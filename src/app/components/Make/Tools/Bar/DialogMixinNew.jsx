/**
 * @component DialogMixin
 * @description 资源库
 * @time 2015-11-26 15:45
 * @author Nick
 **/
var React = require("react");
var DialogAction = require("../../../../actions/DialogActionCreator");
var GlobalFunc = require("../../../Common/GlobalFunc");
var UserUtil = require("../../../../utils/user");
var TplUtil = require("../../../../utils/tpl");
var _=require("lodash");
var MakeWebAPIUtils=require("../../../../utils/MakeWebAPIUtils.js")
var user_obj;
var isLoading = false;

const TabNameList = ["图片", "背景", "图形", "水印", "画框", "边框"];

var DialogMixinNew = {
    componentDidMount: function () {
        user_obj = GlobalFunc.getUserObj();
        isLoading = false;
        this.queryLabels();
        this.getUserImage();
        document.addEventListener('keydown', this.keyDownHandler);
        document.getElementsByClassName('material-dialog-body')[0].addEventListener('scroll', this.loadNewImg);
    },

    componentWillUnmount: function () {
        document.removeEventListener('keydown', this.keyDownHandler);
        document.getElementsByClassName('material-dialog-body')[0].removeEventListener('scroll', this.loadNewImg);
    },

    /**
     * 加载新的图片
     * @param event
     */
    loadNewImg: function (event) {
        var isToBottom = event.target.scrollTop == event.target.scrollHeight - event.target.clientHeight,
            isPrivate = this.state.menuName == "我的" + this.state.materialType;
        if (isToBottom) {
            if (isPrivate) {
                this.getUserImage();
            } else {
                this.getPublicImage();
            }
        }
    },

    /**
     * 加载用户素材库
     * @param options 参数
     * options = {
     *  editEnter //入口为删除或添加时值为true
     * }
     */
    getUserImage: function (options) {
        if (isLoading) return;
        isLoading = true;
        var user_id = user_obj.objectId;
        if (!user_id) {
            GlobalFunc.addSmallTips("请先登录", null, {clickCancel: true});
        } else {
            var _this = this,
                _loadNewImg = $("#loadNewImg"),
                _skip = _this.state.count, //需要跳过的条数，默认为当前已加载完成的总条数
                _limit = _this.state.count == 0 ? (_this.state.perPageNum - 1) : _this.state.perPageNum; //需要加载的条数
            options = options || {};
            if (options.editEnter) {
                _skip = 0;//如果有添加或删除素材，需要重新加载
                _limit = _this.state.count < _this.state.perPageNum ? _this.state.perPageNum : _this.state.count;
            }
            _loadNewImg.html("<svg version='1.1' id='loader-1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='40px' height='40px' viewBox='0 0 50 50' style='enable-background:new 0 0 50 50;' xml:space='preserve'><path fill='#999' d='M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z'><animateTransform attributeType='xml' attributeName='transform' type='rotate' from='0 25 25'to='360 25 25'dur='0.8s'repeatCount='indefinite'/></path></svg>");

            //调用接口获取素材
            UserUtil.getMaterial(function (data) {
                _this.getDataSuccess(data, options);
            }, {
                "uid"           : user_id,
                "material_type" : _this.state.propsMaterialType,
                "material_owner": 1,
                "skip"          : _skip,
                "limit"         : _limit
            })
        }
    },

    /**
     * 获取公共素材
     */
    getPublicImage: function () {
        if (isLoading) return;
        isLoading = true;
        var _this = this,
            _loadNewImg = $("#loadNewImg");
        _loadNewImg.html("<svg version='1.1' id='loader-1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='40px' height='40px' viewBox='0 0 50 50' style='enable-background:new 0 0 50 50;' xml:space='preserve'><path fill='#999' d='M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z'><animateTransform attributeType='xml' attributeName='transform' type='rotate' from='0 25 25'to='360 25 25'dur='0.8s'repeatCount='indefinite'/></path></svg>");
        if (this.state.propsMaterialType == 10) {
            TplUtil.getMusic(function (data) {
                _this.getDataSuccess(data);
            }, {
                music_span: _this.state.menuName,
                skip      : _this.state.count,
                limit     : _this.state.perPageNum
            })
        } else {
            TplUtil.getResModel(function (data) {
                _this.getDataSuccess(data);
            }, {
                "category"   : _this.state.propsMaterialType,
                "res_subtype": _this.state.menuName,
                "skip"       : _this.state.count,
                "limit"      : _this.state.perPageNum
            })
        }
    },

    /**
     * 获取数据成功之后的处理数据
     * @param data
     * @param options
     */
    getDataSuccess: function (data, options) {
        options = options || {};
        var _loadNewImg = $("#loadNewImg");
        var _data = this.state.data,
            _count = this.state.count;
        if (options.editEnter) {
            _data = data.data;
        } else {
            //遍历所有数据并添加到现有数据里面
            for (var i = 0; i < data.data.length; i++) {
                _data.push(data.data[i]);
            }
            _count = _count + data.data.length;
        }
        this.setState({
            data : _data,
            count: _count
        }, function () {
            _loadNewImg.html("");
            isLoading = false;
        });
        if (data.data.length == 0) {
            _loadNewImg.html("没有更多数据了");
        }
    },

    leftTabClickHandler : function(e){
        var materialType = e.target.dataset.type, type;
        switch (materialType) {
            case "水印":
                type = 1;
                break;
            case "边框":
                type = 2;
                break;
            case "图形":
                type = 3;
                break;
            case "背景":
                type = 4;
                break;
            case "图片":
                type = 5;
                break;
        }
        this.setState({
            menuName :"我的" + materialType,
            materialType:materialType,
            propsMaterialType:type
        },()=> {
            this.queryLabels();
            this.getUserImage({editEnter: true});
        });
    },

    getLeftTabs : function(){
        var self = this;
        var tabs = TabNameList.map(function(val, index){
            return <div className={self.state.materialType == val ? "selected" : ""} data-type={val} key={index} onClick={self.leftTabClickHandler}>{val}</div>
        });

        return (
            <div className="material-dialog-container-left">
                {tabs}
            </div>
        )
    },


    /**
     * 获取素材库公共头部
     * @returns {XML}
     */
    getHeader  : function () {
        var _this = this;
        if (this.state.isMultiDelete) {
            //删除时只能删除自己的东西，所以没有其他标签
            return (<div className="material-dialog-header">
                <ul>
                    <li className={this.state.menuName == "我的" + this.state.materialType ? "active": ""}
                        onClick={this.changeTab.bind(this, "我的" + this.state.materialType, "private")}>{"我的" + this.state.materialType}
                    </li>
                </ul>
            </div>)
        } else {
            return (<div className="material-dialog-header">
                <ul>
                    <li className={this.state.menuName == "我的" + this.state.materialType ? "active": ""}
                        onClick={this.changeTab.bind(this, "我的" + this.state.materialType, "private")}>{"我的" + this.state.materialType}
                    </li>
                    {this.state.labels.map(function (result,index) {
                        return <li key={index} className={_this.state.menuName == result ? "active": ""}
                                   onClick={_this.changeTab.bind(_this, result, "public")}>
                            {result}
                        </li>;
                    })}
                </ul>
            </div>)
        }
    },

    enterMultiDelete: function () {
        //批量删除
        this.setState({isMultiDelete: true})
    },
    quitMultiDelete: function () {
        this.setState({isMultiDelete:false})
    },
    MultiDelete:function(){
        var arr=this.state.deleteImgIds;
        var _this=this;

        //从数据库删除多个元素
        MakeWebAPIUtils.deleteMultiMaterial(arr, function () {
            isLoading = false;
            _this.getUserImage({editEnter: true});
            _this.setState({
                indexSrc: null,
                checked : false,
                deleteImgIds:[]
            });

        });

        //this.setState({deleteImgIds:[]})
    },
    /**
     * 增加一个要删除的元素
     * @param id
     */
    addMultiDeleteImg:function(id){
        var oldIds=this.state.deleteImgIds;
        var index=_.indexOf(oldIds,id);
        if(index>-1){
            oldIds.splice(index,1);
        }else{
            oldIds.push(id);
        }
        this.setState({deleteImgIds:oldIds})

    },
    /**
     * 全选
     */
    selectAllDeleteImg:function(e){
        var arr=[];
        var allData=this.state.data;
        var selectData=this.state.deleteImgIds
        if(allData.length>selectData.length){
            arr=allData.map((img)=>{
                return img.id
            })
        }
        this.setState({deleteImgIds:arr});
    },
    /**
     * 选择头标签时重新取数据
     * @param name 标签名
     * @param type 类型（图片水印等）
     */
    changeTab: function (name, type) {
        this.setState({
            indexSrc   : null,
            checked    : false,
            menuName   : name,
            musicImgUrl: null,
            musicName  : null,
            data       : [],
            count      : 0
        }, function () {
            isLoading = false;
            switch (type) {
                case "private":
                    this.getUserImage();
                    break;
                case "public":
                    this.getPublicImage();
                    break;
            }
        }.bind(this))
    },

    keyDownHandler: function (e) {
        if (27 == e.keyCode) {
            //退出
            this.closeDialog();
        }
    },

    openFile: function () {
        //打开文件对话框
        $("#addMaterial").trigger("click");
    },

    fileChange: function (materialType, materialOwner, event) {
        var user_id = user_obj.objectId;
        if (!user_id) {
            GlobalFunc.addSmallTips("无法上传，请先登录！", null, {clickCancel: true});
        } else {
            var files = event.target.files, target = event.target;
            for(var i=0;i<files.length;i++){
                var item=files[i]
                if(item.type.indexOf("audio")==0&&item.size>10*1024*1024){
                    $('#addMaterial').val(null);
                    GlobalFunc.addSmallTips("音频不能大于10M！", null, {clickCancel: true});
                    return
                }else if(item.type.indexOf("image")==0&&item.size>5*1024*1024){
                    $('#addMaterial').val(null);
                    GlobalFunc.addSmallTips("图片不能大于5M！", null, {clickCancel: true});
                    return
                }
            }
            //console.log(files);
            //return
            if (files.length > 0) {
                //按打开的对话框中显示顺序的反序添加到数据库，以便在素材对话框时顺序一致
                this.setState({loading: GlobalFunc.showLoading()});
                var arr=Array.prototype.slice.call(files)
                files= arr.reverse();
                this.uploadFile(files, 0, materialType, materialOwner, function(e){
                    target.value = "";
                })
            }
        }
    },
    /**
     * 上传图片
     * @param files
     * @param index
     * @param materialType
     * @param materialOwner
     * @param cb
     */
    uploadFile: function (files, index, materialType, materialOwner, cb) {
        //对files里的文件串行上传，一个传完后回调uploadFile
        var _this = this, user_id = user_obj.objectId;
        var fileName = files[index].name.substring(0, files[index].name.indexOf("."));
        var fileType;//文件类型

        if (this.state.propsMaterialType == 10) {
            switch (files[index].type) {
                case "audio/mp3":
                    fileType = "mp3";
                    break;
                default:
                    GlobalFunc.addSmallTips("未识别的文件类型！(暂时只支持mp3)", null, {clickCancel: true});
                    this.setState({loading: ""});
                    break;
            }
        } else {
            switch (files[index].type) {
                case "image/jpeg":
                    fileType = "jpg";
                    break;
                case "image/jpg":
                    fileType = "jpg";
                    break;
                case "image/png":
                    fileType = "png";
                    break;
                case "image/gif":
                    fileType = "gif";
                    break;
                default:
                    GlobalFunc.addSmallTips("未识别的文件类型！(暂时只支持jpg, png, gif)", null, {clickCancel: true});
                    this.setState({loading: ""});
                    break;
            }
        }
        if (!fileType) return;
        if (fileType) {
            UserUtil.uploadMaterial(function (data) {
                //上传一个完成，
                if (data.results !== false) {
                    if (data.data.attributes.material_type == 10) {
                        finishedFunc();
                        return;
                    }
                    var image = new Image();
                    image.onload = function () {
                        finishedFunc();
                    };
                    image.src = data.data.attributes.material_src;
                } else {
                    finishedFunc();
                }
            }.bind(this), user_id, materialType, materialOwner, files[index]);
        } else {
            //压缩上传，已经不用，所以对fileType的判断有歧义
            GlobalFunc.saveAsThumbnail({
                file    : files[index],
                fileName: fileName,
                format  : {
                    w         : 640,
                    h         : 1008,
                    q         : 85,
                    scaleToFit: true,
                    fmt       : fileType
                },
                success : function (file) {
                    GlobalFunc.saveMaterialObj({
                        fileUrl      : file._url,
                        fileName     : file._name.substring(0, file._name.indexOf(".")),
                        materialOwner: materialOwner,
                        materialType : materialType,
                        userId       : user_id
                    }, function (obj) {
                        var image = new Image();
                        image.onload = function () {
                            finishedFunc();
                        };
                        image.src = obj.attributes.material_src;
                    }, function () {
                        finishedFunc();
                    });
                },
                error   : function (err) {
                    finishedFunc();
                }
            })
        }

        function finishedFunc(){
            if(index + 1 == files.length){
                //上传完成，修改动画，显示添加的元素
                isLoading = false;
                _this.getUserImage({editEnter: true});
                _this.setState({loading: ""});
                cb();
            }else{
                //不是最后一张，回调上传
                _this.uploadFile(files, index + 1, materialType, materialOwner, cb);
            }
        }
    },

    /**
     * 删除元素
     * @param id
     * @param event
     */
    delMaterial: function (id,event) {
        event.stopPropagation();
        var _this = this;
        var r = confirm("确定删除此元素？");
        if (r == true) {
            UserUtil.delMaterialByUid(id, function () {
                isLoading = false;
                _this.getUserImage({editEnter: true});
                _this.setState({
                    indexSrc: null,
                    checked : false
                });
            });
        }
    },

    closeDialog: function () {
        this.setState({okClicked:false});
        if (this.props.cancelHandle) {
            this.props.cancelHandle();
        } else {
            DialogAction.hide();
        }
    },

    dialogClick: function (e) {
        e.stopPropagation();
    },

    render: function () {
        return (
            <div className="select-dialog show" onClick={this.closeDialog}>
                <div className="modal-dialog-new" onClick={this.dialogClick}>
                    <div className="material-dialog-title">
                        <span className="material-dialog-title-txt">图片库</span>
                        <span className="material-dialog-tip">大小不能超过5M，图片格式支持：jpg、png、gif。</span>
                        <div className="material-dialog-close-btn" onClick={this.closeDialog}></div>
                    </div>
                    <div className="material-dialog-container">
                        {this.getLeftTabs()}
                        <div className="material-dialog-container-right">
                            {this.getHeader()}
                            {this.getBody()}
                            {this.getFooter()}
                        </div>
                    </div>
                </div>
            </div>
        )
    },

    removetransparent: function (i) {
        function RemoveTransparent(image) {
            //裁切出图像的非透明区域
            //收缩图片的4条边，直到碰到非透明像素，裁切出非透明部分
            var offCanvas = document.createElement("canvas");//用于选取非透明部分
            offCanvas.width = image.width;
            offCanvas.height = image.height;
            var offCtx = offCanvas.getContext("2d");
            offCtx.drawImage(image, 0, 0);
            this.srcImgData = offCtx.getImageData(0, 0, image.width, image.height);
            var top = this._geOpaqueAreaTop();
            var bottom = this._getOpaqueAreaBottom();
            if (top > bottom) {
                //全透明图片
                this.imgInfo = {top: 0, left: 0, width: 0, height: -1, base64: ""};
            } else {
                var left = this._getOpaqueAreaLeft(top, bottom);
                var right = this._getOpaqueAreaRight(top, bottom);
                this.imgInfo = {top: top, left: left, width: right - left+3, height: bottom - top+3};

                var dstCan = document.createElement("canvas"); //用于保存成新图片
                dstCan.width = this.imgInfo.width;
                dstCan.height = this.imgInfo.height;
                var dstCTX = dstCan.getContext("2d");
                var dstWidth = this.imgInfo.width, dstHeight = this.imgInfo.height;
                dstCTX.drawImage(image, left, top, dstWidth, dstHeight,
                    0, 0, dstWidth, dstHeight);
                this.imgInfo.base64 = dstCan.toDataURL("image/png");
            }
        }
        Object.assign(RemoveTransparent.prototype, {
            getImgInfo        : function () {
                return this.imgInfo
            },
            //取图片非透明区域的上边缘
            _geOpaqueAreaTop    : function () {
                var srcImgData = this.srcImgData;
                var height = srcImgData.height;
                for (var i = 0; i < height; i++) {
                    if (this._haveOpaquePixRow(i, srcImgData)) {
                        return i;
                    }
                }
                return height;
            },
            //取图片非透明区域的左边缘
            _getOpaqueAreaLeft  : function (top, bottom) {
                var srcImgData = this.srcImgData;
                var width = srcImgData.width;
                for (var i = 0; i < width; i++) {
                    if (this._haveOpaquePixCol(i, srcImgData, top, bottom + 1)) {
                        return i;
                    }
                }
                return width;
            },
            //取图片非透明区域的下边缘
            _getOpaqueAreaBottom: function () {
                var srcImgData = this.srcImgData;
                var height = srcImgData.height;
                for (var i = height - 1; i > 0; i--) {
                    if (this._haveOpaquePixRow(i, srcImgData)) {
                        return i;
                    }
                }
                return 0;
            },
            //取图片非透明区域的右边缘
            _getOpaqueAreaRight : function (top, bottom) {
                var srcImgData = this.srcImgData;
                var width = srcImgData.width;
                for (var i = width - 1; i > 0; i--) {
                    if (this._haveOpaquePixCol(i, srcImgData, top, bottom + 1)) {
                        return i;
                    }
                }
                return 0;
            },
            //判断一行是否有不透明像素
            _haveOpaquePixRow   : function (line, imgData) {
                var width = imgData.width;
                if (line >= imgData.height) {
                    throw "par error"
                }
                var start = width * 4 * line;
                var end = width * 4 * line + width * 4;
                var data = imgData.data;
                for (var i = start; i < end; i += 4) {
                    var alpha = data[i+3];
                    if (alpha != 0) {
                        return true;
                    }
                }
                return false;
            },
            //判断一列是否有不透明像素,高度区域为(startRow, endRow)
            _haveOpaquePixCol: function (col, imgData, startRow, endRow) {
                var width = imgData.width;
                var data = imgData.data;
                for (i = startRow; i < endRow; i++) {
                    var rowStart = width * 4 * i;
                    var alpha = data[rowStart+3 + col * 4];
                    if (alpha != 0) {
                        return true;
                    }
                }
                return false;
            }
        });

        return new RemoveTransparent(i);
    }

};
module.exports = DialogMixinNew;
