/**
 * @component MaterialDialog
 * @description 资源库
 * @time 2015-11-24 10:45
 * @author Nick
 **/

var React = require("react");
var DialogMixin = require("./DialogMixinNew");
var DialogAction = require("../../../../actions/DialogActionCreator");
var MakeAction = require("../../../../actions/MakeActionCreators");
var GlobalFunc = require("../../../Common/GlobalFunc");
var classnames = require("classnames");
var _ = require("lodash")

var MaterialDialogNew = React.createClass({

    mixins         : [DialogMixin],
    getInitialState: function () {
        var _state = {
            okClicked    : false,
            indexSrc     : null, //选中元素地址
            checked      : false,
            loading      : "",//是否加载中
            perPageNum   : 30,
            count        : 0,
            data         : [],//所有要显示数据
            labels       : [],//素材标签
            isMultiDelete: false,//多选删除
            deleteImgIds : []//选中的要删除元素ID
        };
        _state.propsMaterialType = this.props.materialType;
        switch (_state.propsMaterialType) {
            case 1:
                _state.materialType = "水印";
                _state.menuName = "我的水印";
                break;
            case 2:
                _state.materialType = "边框";
                _state.menuName = "我的边框";
                break;
            case 3:
                _state.materialType = "图形";
                _state.menuName = "我的图形";
                break;
            case 4:
                _state.materialType = "背景";
                _state.menuName = "我的背景";
                break;
            case 5:
                _state.materialType = "图片";
                _state.menuName = "我的图片";
                break;
        }
        return _state;
    },
    queryLabels    : function () {
        //取头上的标签
        var _this = this;
        var query = new fmacloud.Query("labels");
        query.equalTo("type", "res_subtype_pc");
        query.equalTo("description", _this.state.propsMaterialType + "");
        query.ascending("order");
        query.find({
            success : function (results) {
                if (results) {
                    var labels = [];
                    for (var i = 0; i < results.length; i++) {
                        labels.push(results[i].attributes.name);
                    }
                    _this.setState({labels: labels});
                } else {
                    GlobalFunc.addSmallTips("标签查询失败,请稍后再试", 2, {clickCancel: true});
                }
            }, error: function (error) {
                console.log("Error: " + error.code + " " + error.message);
                GlobalFunc.addSmallTips("标签查询失败,请稍后再试", 2, {clickCancel: true});
            }
        });
    },

    getBody: function () {
        var images;
        var imgStyle = {}, liStyle = {}, itemStyle = {};
        var isPersonal = this.state.menuName == "我的" + this.state.materialType;
        images = this.state.data.map(function (image,index) {
                var imgSrc = isPersonal ? image.attributes.material_src : image.attributes.item_val;
                if (imgSrc.indexOf("imageView2") < 0 && imgSrc.indexOf("gif") < 0) {
                    imgSrc = imgSrc + "?imageView2/2/w/640/h/1008";
                }
                itemStyle = {background:"url('"+imgSrc+"') no-repeat center", backgroundSize:"100% auto"};

                if (this.state.isMultiDelete) {
                    return (<li key={index} style={liStyle}>
                        <div className={_.indexOf(this.state.deleteImgIds,image.id)>-1? "imgBorder active": "imgBorder"}
                             style={imgStyle} onClick={this.addMultiDeleteImg.bind(this, image.id)}>
                            <div className="imgOver">
                                <div className="imgBox" style={imgStyle}>
                                    <div style={itemStyle}></div>
                                    <span className="delete-select"> </span>
                                </div>
                            </div>
                        </div>
                    </li >)
                } else {
                    return <li key={index} style={liStyle}>
                        <div className={this.state.indexSrc == imgSrc ? "imgBorder active": "imgBorder"}
                             style={imgStyle} onClick={this.imageClick.bind(this, imgSrc)}>
                            <div className="imgOver" onDoubleClick={this.okBtnClick}>
                                <div className="imgBox" style={imgStyle}>
                                    <div title="双击添加" style={itemStyle}></div>
                                </div>
                            </div>
                        </div>
                    </li >
                }
            }.bind(this)
        );

        var modalBody;

        if(this.state.data.length == 0){
            modalBody = <div className="material-dialog-body-empty"></div>
        }else{
            modalBody = <ul>
                {images}
                <div id="loadNewImg"></div>
            </ul>
        }
        return (<div className="material-dialog-body">{modalBody}</div>)
    },

    imageClick: function (src, e) {
        var _this = $(e.target);
        this.setState({
            indexSrc: src,
            checked : true
        });
    },

    getFooter : function () {
        var _tips, _leftBtn;
        if (this.state.menuName.indexOf("我的") == 0) {
            if (this.state.isMultiDelete) {
                let num = this.state.deleteImgIds.length;
                let allNum = this.state.data.length;
                _tips = <span className="select-all"><input className="select" type="checkbox" checked={num==allNum}
                                                            onChange={this.selectAllDeleteImg}/>全选<span
                    className="count">已选择：{num} 张图片</span><span className="exitManager" onClick={this.quitMultiDelete}>退出管理</span></span>
                _leftBtn = <button className="material-dialog-btn-delete" onClick={this.MultiDelete}>批量删除</button>;
            } else {
                _tips = <span className="tips" onClick={this.enterMultiDelete}>管理</span>;
                _leftBtn = <button className="material-dialog-btn-upload" onClick={this.openFile}>
                        本地上传
                        <input id="addMaterial" type="file" accept="image/jpeg,image/jpg,image/png,image/gif"
                               onChange={this.fileChange.bind(this, this.state.propsMaterialType, 1)}
                               multiple />
                    </button>
            }
        }

        var okButtonClass = classnames({
            active             : this.state.checked,
            "loading-animation": this.state.okClicked
        });
        var okButton = <button className={okButtonClass}
                               onClick={this.okBtnClick}>确定</button >
        var cancelButton = <button className="cancel" onClick={this.closeDialog}>取消</button >
        if (this.state.isMultiDelete) {
            okButton = "";
            cancelButton = ""
        }
        return (
            <div className="material-dialog-footer">
                {_leftBtn}
                {_tips}
                {cancelButton}
                {okButton}
            </div>
        )
    },
    /**
     * 点确定时调用
     */
    okBtnClick: function () {
        this.setState({okClicked: true});
        if (this.state.indexSrc != null) {
            var _this = this;


            if (this.props.confirmHandle) {
                //调用时传了确定时的回调，则调用此回调
                this.props.confirmHandle(this.state.indexSrc, this.state.imgName);
                return
            }
            var image = new Image();
            image.crossOrigin = 'anonymous';
            image.onload = function () {
                _this.setState({okClicked: false})
                //取图片的宽高等信息
                var indexSrc = _this.state.indexSrc;
                _this.setState({indexSrc: null});
                if (_this.props.replace) {
                    //if(image.src.indexOf('gif') > -1){
                    //    ///gif图片直接替换
                    //    MakeAction.updateElement({
                    //        item_val   : _url
                    //
                    //    });
                    //}else{
                    var cropSrc = indexSrc.split('?')[0]; //取原图，避免模糊
                    DialogAction.show("crop", null, {
                        src    : cropSrc,
                        type   : _this.props.itemType,
                        img    : image,
                        replace: true
                    })
                    //}

                } else {
                    if (image.src.indexOf('png') != -1 && "img" == _this.props.itemType) {
                        //对PNG图片，删除外围的透明区，上传后用裁切后的图片，放到原图片的偏移位置
                        var targetImage = _this.removetransparent(image);
                        if (targetImage.imgInfo.top > 20 || targetImage.imgInfo.left > 20) {
                            ///透明像素足够多才上传新图片，否则浪费时间
                            var file = new fmacloud.File("cropPng.png", {base64: targetImage.imgInfo.base64});
                            file.save().then(function (imgObj) {
                                var url = imgObj.get('url');
                                var newImage = new Image();
                                newImage.onload = function () {
                                    DialogAction.hide();
                                    MakeAction.addElement({
                                        src   : url,
                                        type  : _this.props.itemType,
                                        img   : newImage,
                                        imgInf: targetImage
                                    });
                                }
                                newImage.src = url;
                            }, function (e) {

                            });
                        } else {
                            indexSrc = indexSrc.split('?')[0] + "?imageView2/2/w/640/";
                            MakeAction.addElement({src: indexSrc, type: _this.props.itemType, img: image});
                            DialogAction.hide();
                        }

                    } else {
                        //其他类型的图片，直接设置给元素
                        indexSrc = indexSrc.split('?')[0] + "?imageView2/2/w/640/";
                        MakeAction.addElement({src: indexSrc, type: _this.props.itemType, img: image});
                        DialogAction.hide();
                    }
                }
            };
            image.src = this.state.indexSrc.split('?')[0];
        }
    }

});

module.exports = MaterialDialogNew;