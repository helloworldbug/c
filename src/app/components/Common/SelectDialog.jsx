/*
 * Created by 95 on 2015/9/10.
 */
var React = require("react");
var DialogStore = require('../../stores/DialogStore');
var DialogAction = require("../../actions/DialogActionCreator");
var $ = require("jquery");
var User = require('../../utils/user');
var GlobalFunc = require("./GlobalFunc");
var DialogBase = {

    componentDidMount: function () {
        this.getUserImage();
        document.addEventListener('keydown', this.keyDownHandler);

    },

    componentWillUnmount: function () {
        document.removeEventListener('keydown', this.keyDownHandler);
    },

    keyDownHandler: function (e) {
        if (27 == e.keyCode) {
            this.modalClick();
        }
    },

    prevPage: function () {
        if (this.state.currentPage >= 1) {
            this.changePage(this.state.currentPage - 1);
            this.setState({hoverPage: this.state.currentPage - 1});
            var pagePageCount = this.state.pagePageCount;
            if (pagePageCount >= 1 && this.state.currentPage <= pagePageCount * 12) {
                this.setState({
                    pagePageCount: pagePageCount - 1
                });
            }
        }
    },

    nextPage: function () {
        var menuName = this.state.menuName;
        var isLib = menuName[menuName.length - 1] == "库";
        var perPageNum = this.state.perPageNum;
        var pageCount = isLib ? Math.ceil(this.state.count / perPageNum) : Math.ceil(this.state.count / (perPageNum - 1));
        pageCount = pageCount || 1;
        if (this.state.currentPage < pageCount - 1) {
            this.changePage(this.state.currentPage + 1);
            this.setState({hoverPage: this.state.currentPage + 1});
            var pagePageCount = this.state.pagePageCount;
            if (pagePageCount < pageCount / 12 && this.state.currentPage + 2 > (pagePageCount + 1) * 12) {
                this.setState({
                    pagePageCount: pagePageCount + 1
                });
            }
        }
    },

    paginationHover: function (i) {
        this.setState({
            hoverPage: i
        })
    },

    paginationLeave: function () {
        this.setState({
            hoverPage: this.state.currentPage
        })
    },

    changePage: function (i) {
        this.setState({
                data       : [],
                currentPage: i
            },
            function () {
                var title = this.state.menuName;
                var lastText = title[title.length - 1];
                if (lastText == "库") {
                    this.getPublicImage();
                } else {
                    this.getUserImage();
                }
            }.bind(this));
    },

    openFile: function (e) {
        $(e.target).next().trigger("click");
    },

    fileChange: function (materialType, materialOwner, e) {
        var user_id = this.getUserInfo().objectId;
        if (!user_id) {
            GlobalFunc.addSmallTips("无法上传，请先登录！", null, {clickCancel: true});
            //alert("无法上传 请先登录");
        } else {
            var files = e.target.files, _this = this;
            if (files) {
                this.setState({loading: GlobalFunc.showLoading()});
            }
            for (var i = 0, j = files.length; i < j; i++) {
                var fileName = files[i].name.substring(0, files[i].name.indexOf("."));
                var fileType;
                switch (files[i].type) {
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
                        GlobalFunc.addSmallTips("未识别的图片类型！(暂时只支持jpg,png,gif)", null, {clickCancel: true});
                        _this.setState({loading: ""});
                        break;

                }
                if (!fileType) return;
                if (fileType) {
                    User.uploadMaterial(function (data) {
                        if (data.results !== false) {
                            var image = new Image(), _this = this;
                            image.onload = function () {
                                _this.getUserImage();
                                _this.setState({loading: ""});
                            };
                            image.src = data.data.attributes.material_src;
                        } else {
                            GlobalFunc.addSmallTips("图片上传失败：" + data.error, null, {clickCancel: true});
                            this.setState({loading: ""});
                            //alert(data.error);
                        }
                    }.bind(this), user_id, materialType, materialOwner, files[i]);
                }else{
                    GlobalFunc.saveAsThumbnail({
                        file    : files[i],
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
                                    _this.getUserImage();
                                    _this.setState({loading: ""});
                                };
                                image.src = obj.attributes.material_src;
                            }, function (obj, err) {
                                GlobalFunc.addSmallTips(err.message, null, {clickCancel: true});
                                _this.setState({loading: ""});
                            });
                        },
                        error   : function (err) {
                            GlobalFunc.addSmallTips('图片上传失败：' + (err.message || err), null, {clickCancel: true});
                            _this.setState({loading: ""});
                        }
                    })
                }
            }
            e.target.value = "";
        }
    },

    imageClick: function (src, e) {
        var _this = $(e.target);
        if (_this[0].nodeName === "SPAN") {
            if (_this[0].className == "delImg") {
                return;
            }
        }
        this.setState({
            indexSrc: src,
            checked : true
        });
    },

    delImg: function (id) {
        var _this = this;
        var r = confirm("确定删除此元素？");
        if (r == true) {
            User.delMaterialByUid(id, function () {
                _this.getUserImage();
                _this.setState({
                    indexSrc: null,
                    checked : false
                });
            });
        }
    },

    modalClick: function () {
        if (this.props.cancelHandle) {
            this.props.cancelHandle();
        } else {
            DialogAction.hide();
        }
    },

    dialogClick: function (e) {
        e.stopPropagation();
    },

    getBaseHeader: function (userTypeName, libTypeName) {
        return (<div className="modal-head">
            <ul>
                <li className={this.state.menuName == userTypeName ? "active": ""}
                    onClick={this.changeTap.bind(this, userTypeName)}>{userTypeName}
                </li>
                <li className={this.state.menuName == libTypeName ? "active": ""}
                    onClick={this.changeTap.bind(this, libTypeName)}>{libTypeName}
                </li>
            </ul>
        </div>)
    },

    getBaseFooter: function (userTypeName) {
        var perPageNum = this.state.perPageNum;
        var pagination = [];
        var pageCount = this.state.menuName == userTypeName ? Math.ceil(this.state.count / (perPageNum - 1)) : Math.ceil(this.state.count / perPageNum);
        pageCount = pageCount || 1;
        var i = this.state.pagePageCount * 12;
        for (i; i < (this.state.pagePageCount + 1) * 12 && i < pageCount; i++) {
            pagination.push(
                <li className={this.state.currentPage === i ? "page active": "page"}
                    onMouseEnter={this.paginationHover.bind(this, i)}
                    onMouseLeave={this.paginationLeave}
                    onClick={this.changePage.bind(this, i)}>
                    <div></div>
                    <span
                        className={this.state.currentPage === i||this.state.hoverPage=== i?"show":"hide"}>{i + 1}</span >
                </li>
            );
        }

        return ( <div className="modal-footer">
            <ul className="paginationbar">
                <li className={ this.state.currentPage == 0 ? "previous" : "previous able"}
                    onClick={this.prevPage}></li>
                {pagination}
                <li className={ this.state.currentPage >= pageCount - 1 ? "next" : "next able"}
                    onClick={this.nextPage}></li>
            </ul>
            <button className="cancel" onClick={this.modalClick}>取消</button >
            <button className={this.state.checked ? "active" : ""} onClick={this.okBtnClick}>确定</button >
        </div>)
    },

    render: function () {
        return (

            <div className="select-dialog show" onClick={this.modalClick}>
                <div className="modal-dialog" onClick={this.dialogClick}>
                    {this.getHeader()}
                    {this.getBody()}
                    {this.getFooter()}
                </div>
            </div>

        )
    }

};
module.exports = DialogBase;
