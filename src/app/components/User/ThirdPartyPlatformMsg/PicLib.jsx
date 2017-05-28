/**
 * @description 消息编辑->图片库
 * @time 2016-6-26
 * @author lifeng
 */

'use strict';

// require core module
var React = require('react');
var ReactDOM=require('react-dom');
var GlobalFunc = require("../../Common/GlobalFunc.js");
var classnames = require("classnames");
var Base = require("../../../utils/Base");
var log = require('loglevel');

var MakeWebAPIUtils = require("../../../utils/MakeWebAPIUtils");
var FILEFILTER = "image/jpeg,image/jpg,image/png,image/gif"
var PicLib = React.createClass({
        getInitialState  : function () {
            this.userID = Base.getCurrentUser().id//用户ID
            return {
                showAddImgDialog: false,//是否显示添加网络图片框
                invalidImgUrl   : false,//图片地址是否有效
                data            : [],//要显示的图片数据
                pageStart       : 0,//分页，开始位置
                pageLimit       : 20,//分页，每页条数
                count           : 1,
                uploadClicked   : false,
                nomore          : null, //没有更多里显示内容
            }
        },
        componentDidMount: function () {
            var _this = this;
            MakeWebAPIUtils.getRESTfulData({
                url    : `/v1/sm/user/${_this.userID}/materials?type=image&skip=0&limit=1&access_token=`,
                success: function (data) {
                    if (data.pagination) {
                        _this.setState({count: data.pagination.max_cnt});
                        if (data.pagination.max_cnt == 0) {
                            _this.setState({
                                nomore: "该作品列表为空"
                            })
                        } else {
                            _this.getData();
                        }

                    } else {
                        throw "get material error"
                    }

                }
            });

            this.refs.list.addEventListener('scroll', this.listScroll);//下拉刷新
        },
        /**
         * 向服务器查询数据
         */
        getData          : function (isReset) {
            var _this = this;
            if (isReset) {
//取数据前显示加载动画
                ReactDOM.findDOMNode(this.refs.loadmore).innerHTML = "<svg version='1.1' id='loader-1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='40px' height='40px' viewBox='0 0 50 50' style='enable-background:new 0 0 50 50;' xml:space='preserve'><path fill='#999' d='M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z'><animateTransform attributeType='xml' attributeName='transform' type='rotate' from='0 25 25'to='360 25 25'dur='0.8s'repeatCount='indefinite'/></path></svg>";
                MakeWebAPIUtils.getRESTfulData({
                    url    : `/v1/sm/user/${_this.userID}/materials?type=image&skip=0&limit=${this.state.pageLimit}&access_token=`,
                    success: function (data) {
                        console.log("up");
                        var tips = "";
                        var count = data.pagination.max_cnt;
                        if (count == 0) {
                            tips = "没有更多数据了"
                        }
                        ReactDOM.findDOMNode(_this.refs.loadmore).innerHTML = tips
                        _this.setState({data: data.materials, pageStart: 0, count: count, nomore: tips});

                    }
                });
            } else if (this.state.pageStart < this.state.count) {
                //取数据前显示加载动画
                ReactDOM.findDOMNode(this.refs.loadmore).innerHTML = "<svg version='1.1' id='loader-1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='40px' height='40px' viewBox='0 0 50 50' style='enable-background:new 0 0 50 50;' xml:space='preserve'><path fill='#999' d='M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z'><animateTransform attributeType='xml' attributeName='transform' type='rotate' from='0 25 25'to='360 25 25'dur='0.8s'repeatCount='indefinite'/></path></svg>";
                MakeWebAPIUtils.getRESTfulData({
                    url    : `/v1/sm/user/${_this.userID}/materials?type=image&skip=${ this.state.pageStart }&limit=${this.state.pageLimit}&access_token=`,
                    success: function (data) {
                        var tips = "";
                        var newData = _this.state.data;
                        newData = newData.concat(data.materials);
                        var nextStart = _this.state.pageStart + data.materials.length;

                        if (nextStart == _this.state.count) {
                            tips = "没有更多数据了"
                        }
                        ReactDOM.findDOMNode(_this.refs.loadmore).innerHTML = tips
                        //取完数据,设置数据，重写加载动画区
                        _this.setState({data: newData, pageStart: nextStart, nomore: tips});

                    }
                });


            }
        }
        ,
        /**
         * 滚动条滚动时判断到底部时加载更多数据
         * @param event
         */

        listScroll       : function (event) {
            if (this.state.pageStart >= this.state.count) {
                //上次已经取到最后的数据
                return;
            }
            var isToBottom = event.target.scrollTop == event.target.scrollHeight - event.target.clientHeight;
            if (isToBottom) {
                this.getData();
            }
        }
        ,

        /**
         * 选择一个图片
         * @param tid
         * @param event
         */
        selectWork      : function (tid, event) {

            var oldTid = this.state.selectTid;
            if (oldTid == tid) {
                this.setState({selectTid: undefined, url: ""})
            } else {
                this.setState({selectTid: tid, url: `${location.origin}/preview/tid=${tid}`})
            }
        }
        ,
        /**
         * 触发上传文件对话框
         */
        triggerUpload   : function () {
            if (!this.state.uploadClicked) {
                $("#msg-img-upload").trigger("click")
            }

        }
        ,
        /**
         * 上传文件
         * @param event
         */
        uploadFile      : function (event) {
            event.stopPropagation();
            var _this = this;
            var files = event.target.files;
            var valid = GlobalFunc.validFileSize(files, 5 * 1024 * 1024);
            if (valid.code == 1) {
                GlobalFunc.addSmallTips(valid.msg, null, {clickCancel: true});
                return;
            } else if (valid.code == 2) {
                GlobalFunc.addSmallTips(valid.msg + "大于5M,不能上传", null, {clickCancel: true});
                return;
            }
            valid = GlobalFunc.validFileType(files, FILEFILTER);
            if (valid == 1) {
                GlobalFunc.addSmallTips("未识别的文件类型！(暂时只支持jpeg,jpg,png,gif)", null, {clickCancel: true});
                return;
            }
            this.setState({uploadClicked: true});
            upload7niu(files, 0, function () {
                _this.setState({uploadClicked: false});
                var obj = document.getElementById('msg-img-upload');
                obj.value="";
                //var obj = document.getElementById('msg-img-upload');
                //obj.outerHTML = '<input key="upload" id="msg-img-upload" type="file" multiple accept="image/jpeg,image/jpg,image/png,image/gif"/>';
                _this.getData(true)
            });
            /**
             * 上传 到7niu并更新数据库
             * @param files
             * @param i
             * @param ok
             */
            function upload7niu(files, i, ok) {
                var file = files[i];
                var newFile = new fmacloud.File(file.name, file);
                newFile.save().then(function (object) {
                    var _url = object.get("url");
                    var match = /(\w+)\.\w+$/.exec(file.name);
                    if (match) {
                        var fileName = match[1]
                    }

                    MakeWebAPIUtils.postRESTfulData({
                        url    : `/v1/sm/user/${_this.userID}/material?access_token=`,
                        data   : {type: "image", url: _url, name: fileName, size: Math.ceil(file.size / 1024)},
                        success: function (data) {
                            if (files.length == i + 1) {
                                ok && ok()
                            } else {
                                upload7niu(files, i + 1, ok)
                            }
                        }
                    });

                    //GlobalFunc.addSmallTips("视频封面上传成功", 0, {clickCancel: true, delBackGround: true});
                }, function (error) {
                    _this.setState({uploadClicked: false});
                    log.info(error);
                })
            }

        }
        ,
        /**
         * 隐藏添加图片地址框
         */
        hideAddImgDialog: function () {
            this.setState({showAddImgDialog: false})
        }
        ,
        /**
         * 显示添加图片地址框
         */
        showAddImgDialog: function (event) {
            this.setState({showAddImgDialog: true})
        }
        ,
        /**
         * 添加图片地址框到数据库
         */
        addImgToLib     : function (event) {

            this.hideAddImgDialog();
        }
        ,
        /**
         * 验证图片地址有效性
         */
        validImgUrl     : function () {

        },

        stopPropagation: function (event) {
            event.stopPropagation()
        },
        /**
         * 删除图片
         * @param index
         * @param id
         */
        removePic      : function (index, id, event) {
            event.stopPropagation();
            var _this = this;
            MakeWebAPIUtils.getRESTfulData({
                url    : `/v1/sm/user/${_this.userID}/material/${id}?access_token=`,
                type   : "DELETE",
                success: function (data) {
                    if (data.deleted) {
                        var pics = _this.state.data;
                        pics.splice(index, 1);
                        _this.setState({data: pics, pageStart: _this.state.pageStart - 1, count: _this.state.count - 1});
                        GlobalFunc.addSmallTips("删除成功", 3, {clickCancel: true});
                    } else {
                        console.log(data.err.Message);
                    }
                }
            });
            //
        },
        render         : function () {
            //无效图片地址的样式类
            var showInvalidImgUrlClass = classnames({
                tips: true,
                hide: !this.state.invalidImgUrl
            })
            //添加图片链接对话框
            var addImgDialog = <div className="select-dialog">
                <div className="add-img-url center-dialog">
                    <div className="title">添加图片链接</div>
                    <input type="text" onBlur={this.validImgUrl} onChange={this.stopPropagation}/>
                    <div className="footer modal-footer">
                        <span className={showInvalidImgUrlClass}>*提交链接不是图片链接，请输入图片链接</span>
                        <button onClick={this.hideAddImgDialog}>取消</button>
                        <button onClick={this.addImgToLib}>确定</button>

                    </div>
                </div>
            </div>
            if (!this.state.showAddImgDialog) {
                addImgDialog = null
            }
            var imglist = this.state.data.map((imgObj, index)=> {
                //生成图片库的html

                //var itemClass = classnames({
                //    selected: tplAtrr.tpl_id == this.state.selectTid
                //})


                var imgStyle = {
                    backgroundImage: `url(${imgObj.url})`
                };
                return <li onClick={this.props.addImg.bind(null,imgObj.url,imgObj.size)} key={index}>
                    <div className="card-img"><span className="img-center" style={imgStyle}></span></div>
                    <div className="card-name">{imgObj.name}</div>
                    <div className="remove-wrapper"><span className="remove"
                                                          onClick={this.removePic.bind(this, index,imgObj.id)}></span></div>
                </li>
            });
            var height = (this.props.tabHeight - 125);
            var uploadClass = classnames({
                "upload-img"       : true,
                "loading-animation": this.state.uploadClicked
            })
            return (
                <div className="piclib">
                    {addImgDialog}
                    <div >
                        <div className="tool" onChange={this.uploadFile}>
                            <div className={uploadClass} onClick={this.triggerUpload}>上传图片</div>
                            <input  key="upload" id="msg-img-upload" type="file" multiple accept="image/jpeg,image/jpg,image/png,image/gif" />
                            <div className="add-img-link hide" onClick={this.showAddImgDialog}>添加图片链接</div>
                        </div>

                        <ul className="imglist scroll-wrapper" ref="list"
                            style={{height:`${height}px`}}>
                            {imglist}
                            <div className="loadmore" ref="loadmore">{this.state.nomore}</div>
                        </ul>
                    </div>

                </div>
            );
        }
    })
    ;
module.exports = PicLib;