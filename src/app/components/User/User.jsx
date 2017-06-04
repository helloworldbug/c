/**
 * @description 个人中心组件
 * @time 2015-9-14
 * @author 曾文彬
 */

'use strict';

// require core module
var React = require('react'),
    ReactDOM = require("react-dom"),
    Base = require('../../utils/Base');
import {Link} from 'react-router'
// require children component
var Input = require('../Common/Input'),
    Slider = require('../Common/Slider'),
    Footer = require('../Common/Footer'),
    Dialog = require('../Common/Dialog'),
    Images = require('../Common/Image'),
    UserTabs = require('./NewUserTabs'),
    ImportThirdParty = require('./importThirdParty'),
    ExportWork = require('./ExportWork'),
    QRCode = require('qrcode.react'),
    PreviewShare = require('../Preview/PreviewShare');
var cropImg = {};
var cropImgSize = {},
    jCropObj, uploadedFile;
var jCropEffect;
// require common mixins
var ImageModules = require('../Mixins/ImageModules');
var GlobalFunc = require('../Common/GlobalFunc');

const TabIndex = require('../../constants/MeConstants').UserTab;

// define User component
var User = React.createClass({

    mixins: [ImageModules],

    defineInfo() {
        return {
            originalWidth: 300,
            originalHeight: 300
        }
    },

    getDefaultProps() {
        return {
            requiredError: '昵称的长度在1-10个字符'
        }
    },

    getInitialState() {
        var index = 0;
        if (this.props.params.redenvelopeID) {
            //path="/user/:redenvelopeID"
            index = parseInt(this.props.params.redenvelopeID)
        } else if (this.props.params.tabIndex) {
            // path="/user/tab/:tabIndex"
            index = parseInt(this.props.params.tabIndex)
        } else if (window.location.pathname.indexOf("=") > 0) {
            //path="/user/:redenvelopeID&...=..."
            index = parseInt(window.location.pathname.substr(window.location.pathname.indexOf("=") + 1));
        }
        this.lastClick = this.props.params.tabIndex;
        this.isConvertCover = null;       //判断是上传到七牛
        return {
            status: true,
            user_pic: Base.isLogin() && this.operaUserPhoto(),
            tabIndex: index,
            showThirdParty: false,
            showShareDiolog: false,
            showExport: false
        }
    },
    componentWillReceiveProps: function (nextProps) {
        var index = nextProps.params.tabIndex || 0;

        this.lastClick = index;
        this.setState({ tabIndex: parseInt(index) })
    },
    exportWork(tid) {
        this.setState({ tid: tid, showExport: true })
    },
    handleFinish() {
        if (this.checkInputNull()) {
            this.showDialog({
                title: '昵称的长度在1-10个字符',
                appearanceState: true,
                sureIsHide: true
            });

            return;
        }

        this.update();
    },

    handleCancel() {
        this.setState({
            status: true
        });

        !this.checkInputNull() && this.setNickInput('');
    },

    handlePopup() {
        this.setState({
            status: false
        });
    },

    handleUploadProfilePhoto() {
        $(ReactDOM.findDOMNode(this.refs.file)).trigger('click');
    },

    handleChangePhoto(e) {
        Base.uploadUserPhoto(e.target.files[0],
            (_userPhoto => {
                var photoPath = _userPhoto.thumbnailURL(this.defineInfo().originalWidth, this.defineInfo().originalHeight);
                // 保存
                this.operaUserPhoto(photoPath);
            }).bind(this),

            (_error => {
                alert('上传失败');
            }).bind(this)
        );
    },

    setNickInput(usernick) {
        var usernick = usernick || '';

        ReactDOM.findDOMNode(this.refs.nick).value = usernick || '';
    },

    operaUserPhoto(photoPath) {
        if (!photoPath) return Base.getUserInfo('user_pic');

        // change state user_pic
        this.setState({
            user_pic: photoPath
        });

        // upload user photo
        Base.asyncByPromise.call(this, (resolve, reject) => {
            Base.tableDataSelect('_User', 'objectId', Base.getCurrentUser().id,
                () => {
                    // 保存用户头像
                    Base.setUserInfo('user_pic', photoPath);
                    resolve();
                }
            );
        }).then(
            () => {
                Base.asyncByPromise.call(null, (resolve, reject) => {
                    Base.tableDataSelect('tplobj', 'author', Base.getCurrentUser().id, resolve, reject);
                });
            }
            ).then(
            _tpls => {
                (_tpls && _tpls.length > 0) && _tpls.forEach(_tpl => {
                    _tpl.set('author_img', photoPath);
                    _tpl.save(null, Base.callerStopByCount(_tpls.length,
                        () => {
                            alert('上传头像成功');
                        }
                    ));
                });
            },
            () => {
                alert('上传失败');
            }
            );
    },

    checkInputNull() {
        var value = ReactDOM.findDOMNode(this.refs.nick).value;

        return value == '' || value.length > 10;
    },

    showDialog(states) {
        this.refs.dialog.setState(states);
    },

    update() {
        var success = Base.setUserInfo('user_nick', ReactDOM.findDOMNode(this.refs.nick).value);

        if (success) {
            this.handleCancel();
            return;
        }

        if (!success) {
            this.showDialog({
                title: '修改昵称失败，请重新修改',
                appearanceState: true,
                sureIsHide: true
            });
        }
    },

    buildDialog(options) {
        return <Dialog ref="dialog" {...options} hash="/login"/>
    },

    isScrollBottom() {
        return document.body.scrollTop + $(window).height() >= document.body.scrollHeight;
    },

    bindWindowScrollEvent(options) {
        var isUnset = !!options && options.isUnset;

        $(window)[isUnset ? 'unbind' : 'bind']('scroll', this.windowScrollCallback);
    },

    windowScrollCallback() {
        if (this.isScrollBottom()) {
            //this.dropLoad.isNext();
        }

        this.refs.slider.handleScroll();
    },

    /**
     * 生成二维码
     */
    generateQRCode(value, size = 160) {
        return (<QRCode value={value} size={size}/>);
    },

    /*
     * 分享地址
     */
    generateShareUrl: function () {
        var url = location.origin+"/views/share/index.html?id=" + Base.getCurrentUser().id;
        return url;
    },

    /**
     * 分享个人中心二维码弹出框
     **/
    shareDialog: function () {
        var url = this.generateShareUrl();
        return (
            <div>
                <div className="share-dialog"></div>
                <div className="share-dialog-box">
                    <div className="share-dialog-close" onClick={this.handleShareDialog}></div>
                    <div className="share-code">
                        { this.generateQRCode(url, 160) }
                    </div>
                    <h3>微信扫一扫分享你的个人中心</h3>
                    <PreviewShare ref="shareProduct"/>
                </div>
            </div>
        )
    },

    componentDidUpdate: function () {
        this.initShare();
    },

    initShare() {
        var title = Base.getUserInfo('user_nick');
        var pic = Base.buildDefaultUserLogo(this.defineImageModules().defaultUserLogo);
        var summary = "这是我的ME空间，完爆所有创意，快来围观吧！";
        var url = this.generateShareUrl();
        var shareComponentObject = {
            url: encodeURIComponent(url),
            title: title,
            content: title,
            pic: pic,
            pics: pic,
            summary: summary,
            comment: summary,
            description: summary
        };
        var shareComponentObjects = {};

        ['tsina', 'renren', 'tqq', 'tqzone', 'kaixin', 'tieba', 'cqq'].forEach(_name => {
            shareComponentObjects[_name] = shareComponentObject;
        });

        this.refs.shareProduct && this.refs.shareProduct.setState(shareComponentObjects);
    },
    render() {
        var context = this;

        //add by tony
        var hideTitleList = [TabIndex.MYSETTING, TabIndex.DOMAINBIND, TabIndex.AUTH, TabIndex.WEIXINPUSH, TabIndex.WEIXINMGR,
            TabIndex.WEIXINMGRDRAFT, TabIndex.WEIXINMGRREC, TabIndex.WEIXINEDIT, TabIndex.ELECTRICITYSUPPLIER, 
            TabIndex.COLLECT_CONTENT, TabIndex.MY_CONTENT, TabIndex.COLLECT_SETTING, TabIndex.COMPOSE_PRODUCT, TabIndex.UPLOAD_CONTENT];
        var isTitleHide = hideTitleList.indexOf(this.state.tabIndex) >= 0 ? { display: "none" } : {};
        var authentication = null;

        //add by tony 2016-11-9 修改顶部的导航, 转换记录的时候
        var hideStyleList = [TabIndex.CONVERTRECORDS, TabIndex.ONLINEREAD, TabIndex.MYBOOKRACK];
        var hideStyle = hideStyleList.indexOf(this.state.tabIndex) >= 0  ?  { display: "none" } : {};
        var ghostPublish = hideStyleList.indexOf(this.state.tabIndex) >= 0  ? (<a href="/dataProcessing" target="_blank">一键出版</a>) : null;
        
        if (!Base.isLogin()) {
            Base.linkToPath("/login");
            return (
                <div className="inner">
                    {
                        this.buildDialog(
                            {
                                appearanceState: true,
                                title: '您还未登录，请登录',
                                sureIsHide: true,
                                cancelFn() {
                                    Base.linkToPath('/');
                                }
                            }
                        )
                    }
                </div>
            );
        }
        var user = Base.getCurrentUser().attributes.approved_status;

        //console.log(Base.getCurrentUser());

        if (user == 2) {
            authentication = <img src={this.defineImageModules()["privilege"]}/>;
        }

        var speFunctionCode = Base.getCurrentUser().attributes.spe_function_code,
            thirdParty;

        if (!!speFunctionCode) {
            thirdParty = <span style={hideStyle}><span className="thirdParty" onClick={this.thirdPartyToggle}>作品导入</span></span>;
        }

        var importThirdParty;

        if (this.state.showThirdParty) {
            importThirdParty = <ImportThirdParty thirdPartyToggle={this.thirdPartyToggle} recrop={this.cropImg}/>
        }
        var exportDialog;

        if (this.state.showExport) {
            exportDialog = <ExportWork close={this.closeExportDialog} tid={this.state.tid}/>
        }
        
        /* add by gli-cq-gonglong 20170504 start */
        // 融合报刊 目前处于开发阶段--测试未完成，不得发布正式服务器(隐藏)
        // 即: 正式服(fmawr:999)隐藏, 测试服(fmawr:0)显示
        var tmpNewsStyle = (window.fmawr == "0") ? {}:{display: "none"};
        /* add by gli-cq-gonglong 20170504 end */
        
        return (
            <div className="inner">
                <Slider ref="slider" emuabled="true"/>
                {
                    context.buildDialog({
                        appearanceState: false,
                        sureFn: function () {
                            context.showDialog({
                                appearanceState: false
                            });
                        }
                    })
                }
                <Dialog ref="dialog" sureFn={this.backToIndexPage} title="确定要登出吗？"/>
                <div className="userFrame" ref="userFrame">
                    <div id="userSlide" ref="userSlide">
                        <ul className="userWorkSetting"><span className="title">作品</span>
                            <li
                                className={this.state.tabIndex == TabIndex.MYPRODUCT || this.state.tabIndex == TabIndex.MYDRAFT || this.state.tabIndex == TabIndex.RECYCLE  || this.state.tabIndex == TabIndex.ILLEGALWORK? "myProduction select" : "myProduction"}
                                onClick={this.changeTabIndex.bind(this, TabIndex.MYPRODUCT) }><span>我的作品</span></li>
                            <li className={this.state.tabIndex == TabIndex.MYCOLLECTION ? "myCollection select" : "myCollection"}
                                onClick={this.changeTabIndex.bind(this, TabIndex.MYCOLLECTION) }>
                                <span>我的收藏</span></li>
                            <li className={this.state.tabIndex == TabIndex.MYMODE||this.state.tabIndex == TabIndex.CHARGEDTEMPLATE  ? "myMode select" : "myMode"}
                                onClick={this.changeTabIndex.bind(this, TabIndex.MYMODE) }><span>我的模板</span></li>
                            <li className={this.state.tabIndex == TabIndex.MYDATA ? "myData select" : "myData"}
                                onClick={this.changeTabIndex.bind(this, TabIndex.MYDATA) }><span>用户资料收集</span></li>
                        </ul>
                        
                        {/* add by gli-cq-gonglong 2017-04-20 内容仓库 Start */}
                        <ul className="media" style={tmpNewsStyle}>
                            <span className="title">内容仓库</span>
                            <li className={this.state.tabIndex == TabIndex.COLLECT_CONTENT ? "myAccout select" : "myAccout"}
                                onClick={this.changeTabIndex.bind(this, TabIndex.COLLECT_CONTENT) }><span>内容采集</span></li>
                                <li className={this.state.tabIndex == TabIndex.UPLOAD_CONTENT ? "myAccout select" : "myAccout"}
                                onClick={this.changeTabIndex.bind(this, TabIndex.UPLOAD_CONTENT) }><span>内容上传</span></li>
                            <li className={this.state.tabIndex == TabIndex.MY_CONTENT ? "myAccout select" : "myAccout"}
                                onClick={this.changeTabIndex.bind(this, TabIndex.MY_CONTENT) }><span>我的内容</span></li>
                            <li className={this.state.tabIndex == TabIndex.COLLECT_SETTING ? "myAccout select" : "myAccout"}
                                onClick={this.changeTabIndex.bind(this, TabIndex.COLLECT_SETTING) }><span>采集设置</span></li>
                        </ul>
                        {/* add by gli-cq-gonglong 2017-04-20 内容仓库 End */}
                        
                        <ul className="media"><span className="title">自媒体管理</span>
                            <li className={this.state.tabIndex == TabIndex.AUTH ? "myAccout select" : "myAccout"}
                                onClick={this.changeTabIndex.bind(this, TabIndex.AUTH) }><span>授权管理</span></li>
                            <li className={this.state.tabIndex == TabIndex.WEIXINPUSH || this.state.tabIndex == TabIndex.WEIXINEDIT ? "myAccout select" : "myAccout"}
                                onClick={this.changeTabIndex.bind(this, TabIndex.WEIXINPUSH) }><span>一键推送</span></li>
                            <li className={[TabIndex.WEIXINMGR, TabIndex.WEIXINMGRDRAFT, TabIndex.WEIXINMGRREC].indexOf(this.state.tabIndex) >= 0 ? "myAccout select" : "myAccout"}
                                onClick={this.changeTabIndex.bind(this, TabIndex.WEIXINMGR) }><span>推送消息管理</span></li>
                        </ul>
                        {/* add by tony 2016-11-2 增加重庆出版管理*/}
                        <ul className="userPublish"><span className="title">出版管理</span>
                            <li className={this.state.tabIndex == TabIndex.CONVERTRECORDS ? "select" : ""}
                                onClick={this.changeTabIndex.bind(this, TabIndex.CONVERTRECORDS) }><span>转档管理</span></li>
                            {/*  注释先不开
                            <li className={this.state.tabIndex == TabIndex.ONLINEREAD ? "select" : ""}
                                onClick={this.changeTabIndex.bind(this, TabIndex.ONLINEREAD) }><span>在线阅读管理</span></li>
                            <li className={this.state.tabIndex == TabIndex.MYBOOKRACK ? "select" : ""}
                                onClick={this.changeTabIndex.bind(this, TabIndex.MYBOOKRACK) }><span>我的书架</span></li>
                            */}
                        </ul>
                        {/* 暂时屏蔽数据统计功能
                        <ul className="userStatistic"><span className="title">统计</span>
                            <li className={this.state.tabIndex == TabIndex.USERDATACOLLECTION ? "select" : ""}
                                onClick={this.changeTabIndex.bind(this, TabIndex.USERDATACOLLECTION) }><span>数据统计</span></li>
                        </ul>*/}

                        <ul className="userAccout"><span className="title">账户</span>
                            <li className={this.state.tabIndex == TabIndex.MYACCOUNT ? "myAccout select" : "myAccout"}
                                onClick={this.changeTabIndex.bind(this, TabIndex.MYACCOUNT) }><span>我的账户</span></li>
                            <li className={this.state.tabIndex==TabIndex.MYORDER?"select":""}
                                onClick={this.changeTabIndex.bind(this,TabIndex.MYORDER)}><span>我的订单</span></li>
                            <li className={this.state.tabIndex==TabIndex.MYPRIVILEGES?"select":""}
                                onClick={this.changeTabIndex.bind(this,TabIndex.MYPRIVILEGES)}><span>我的特权</span></li>
                        </ul>
                        <ul className="userSetting"><span className="title">设置</span>
                            <li className={this.state.tabIndex == TabIndex.MYSETTING ? "mySetUp select" : "mySetUp"}
                                onClick={this.changeTabIndex.bind(this, TabIndex.MYSETTING) }><span>个人资料</span></li>
                            <li className={this.state.tabIndex == TabIndex.DOMAINBIND ? "mySetUp select" : "mySetUp"}
                                onClick={this.changeTabIndex.bind(this, TabIndex.DOMAINBIND) }><span>域名绑定</span></li>
                            <li className={this.state.tabIndex == TabIndex.ELECTRICITYSUPPLIER ? "select" : ""}
                                onClick={this.changeTabIndex.bind(this, TabIndex.ELECTRICITYSUPPLIER) }><span>电商管理</span></li>
                        </ul>
                        {/*<div className="myBack" onClick= { this.handleLogout }><span>退出登录</span></div>*/}

                        
                    </div>

                    <div id="userContent">
                        <div id='userTitle' style={isTitleHide}>
                            <span className="user-img">
                                <Images className="user-img-ico"
                                    src={Base.buildDefaultUserLogo(this.defineImageModules().defaultUserLogo) }/>
                                <span className="userPrivilege">{authentication}</span>
                            </span>
                            <span className="nickname">{Base.getUserInfo('user_nick') }</span>
                            <div className="right">
                                {thirdParty}
                                <a href="javascript:;" onClick={this.handleShareDialog} style={hideStyle} >分享个人中心</a>
                                <a href="/make" target="_blank" style={hideStyle}>立即制作</a>
                                {ghostPublish}
                            </div>
                        </div>
                        <div>
                            <UserTabs pageType="user" ref="tabContent" params={this.props.params}
                                tabIndex={this.state.tabIndex}
                                callbackParent={this.onChildChanged}
                                exportWork={this.exportWork}/>
                        </div>
                    </div>
                </div>
                {importThirdParty}
                {exportDialog}

                {this.state.showShareDiolog ? this.shareDialog() : ''}
                <div id="publish-info-uploadFile">
                    <input id="fileUrl" type="file" accept="image/jpeg,image/jpg,image/png,image/gif" 
                        onChange={this._uploadFile}/>
                </div>
                <div id="publish-info-cropFile">
                    <div>
                        <img id="uploadedImg"/>
                        <input id="croped-img-url" type="text" className="hidden" value=""/>
                        <ul className="cropCtrlBar">
                            <button onClick={this._cropCancel}>取消</button>
                            <button className="active" onClick={this._cropConfirm}>确定</button>
                        </ul>
                    </div>
                </div>
            </div>
        );
    },
    //上传封面图
    _uploadFile: function () {
        function getFileUrl(sourceId) {
            var url;
            if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome
                url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
            } else {
                alert(' 您使用的浏览器不支持此功能，请使用推荐浏览器：“Chrome、360极速” ');
                return {};
            }
            return {
                url: url,
                name: document.getElementById(sourceId).files.item(0).name,
                obj: document.getElementById(sourceId).files.item(0)
            };
        }

        var fileUrl = getFileUrl("fileUrl");
        var $screenImage = $('#screenImage');

        var newFile = new fmacloud.File(fileUrl.name, fileUrl.obj);

        if (!GlobalFunc.isGif(newFile.get("name"))) {
            this.cropImg(fileUrl.url);
        }
        newFile.save().then(function (object) {
            var _url = object.get("url");
            if (GlobalFunc.isGif(newFile.get("name"))) {
                $("#croped-img-url").val(_url);
                $screenImage.attr("src", _url).css({ "margin": 0, "width": 166, "height": 166 });
                $("#croped-img-url").trigger("finished", [{ cropedUrl: _url }]);
            }
            $("#croped-img-url").trigger("upload", [_url]);
        }, function (error) {
            console.log(error);
        });

    },
    cropImg: function (fileUrl) {
        if (fileUrl == null) return;
        var self = this;
        var $cropFile = $("#publish-info-cropFile");

        $cropFile.show();
        var $cropCtrlBar = $cropFile.find(".cropCtrlBar");

        var fixWidth, fixHeight;

        var cropChange = function (c) {
            $cropCtrlBar.hide();
            cropImgSize.width = c.w;
            cropImgSize.height = c.h;
            cropImgSize.left = c.x;
            cropImgSize.top = c.y;
            console.log(cropImgSize);
        };
        var cropSelect = function (c) {
            if (!!jCropObj) {
                c = jCropObj.tellScaled();
                $cropCtrlBar.show();
                $cropCtrlBar.css({
                    left: c.x2 + fixWidth - 140,
                    top: c.y2 + fixHeight + 2
                });
            }
        };

        if (!!jCropObj) jCropObj.destroy();

        var image = document.getElementById("uploadedImg");
        image.onload = function () {
            var imageWidth = image.naturalWidth,
                imageHeight = image.naturalHeight,
                clientWidth = document.body.clientWidth,
                clientHeight = document.body.clientHeight;

            if (imageWidth >= imageHeight && imageWidth >= clientWidth) {
                imageWidth = clientWidth - 100;
                imageHeight = imageHeight / (image.naturalWidth / imageWidth);
            } else if (imageHeight > imageWidth && imageHeight >= clientHeight) {
                imageHeight = clientHeight - 100;
                imageWidth = imageWidth / (image.naturalHeight / imageHeight);
            }
            if (imageHeight >= clientHeight) {
                imageWidth = image.naturalWidth / (image.naturalHeight / (clientHeight - 100));
                imageHeight = clientHeight - 100;
            }
            if (imageWidth >= clientWidth) {
                imageHeight = image.naturalHeight / (image.naturalWidth / (clientWidth - 100));
                imageWidth = clientWidth - 100;
            }

            $("#uploadedImg").css({ width: "auto", height: "auto" });
            //modify by tony 2016-12-7 修改比例
            var _scale = self.isConvertCover ? (self.isConvertCover.width / self.isConvertCover.height) : (1 / 1);  
            $(image).Jcrop({
                onChange: cropChange,
                onSelect: cropSelect,
                boxWidth: imageWidth,
                boxHeight: imageHeight,
                aspectRatio: _scale
            },
                function () {
                    jCropObj = this;
                    fixWidth = (clientWidth - imageWidth) / 2;
                    fixHeight = (clientHeight - imageHeight) / 2;
                    $cropFile.find(".jcrop-holder").css({
                        "margin-left": fixWidth,
                        "margin-top": fixHeight
                    });
                    if (image.naturalWidth > image.naturalHeight) {
                        jCropObj.setSelect([(image.naturalWidth - image.naturalHeight) / 2, 0, image.naturalHeight, image.naturalHeight]);
                    } else {
                        jCropObj.setSelect([0, (image.naturalHeight - image.naturalWidth) / 2, image.naturalWidth, image.naturalWidth]);
                    }
                }
            )

        };
        image.setAttribute("crossOrigin", "anonymous");
        image.src = fileUrl;

    },


    _cropConfirm: function () {
        //TODO 需要修改width="166" height="166"，   scale = 166 / cropImgSize.width;
        var _width = this.isConvertCover ? this.isConvertCover.width : 166;
        var _height = this.isConvertCover ? this.isConvertCover.height : 166;
        var _scale = this.isConvertCover ? (this.isConvertCover.width / cropImgSize.width) : (166 / cropImgSize.width);
        $(".jcrop-holder > div:first-child").append("<div class='saveLoading'><span>裁切中...</span></div>");
        var $cropFile = $("#publish-info-cropFile"),
            $cropCtrlBar = $cropFile.find(".cropCtrlBar"),
            $screenShot = $("#publish-info-screenshot"),
            $screenImage = $('#screenImage'),
            $edit = $screenShot.find(".edit");
        $cropCtrlBar.hide();
        jCropObj.disable();
        var canvas = $('<canvas width="' + _width + '" height="' + _height + '"></canvas>')[0],
            ctx = canvas.getContext('2d'),
            image = document.getElementById("uploadedImg"),
            base64,
            left = cropImgSize.left,
            top = cropImgSize.top,
            scale = _scale;


        ctx.drawImage(image,
            left, top,//开始剪切的坐标位置
            image.width, image.height,//原始图像的宽高
            0, 0,//在画布上图像开始的坐标位置。
            image.width * scale, image.height * scale);//要使用的图像的宽高
        base64 = canvas.toDataURL();
        if(this.isConvertCover){        //上传替换封面
            $("#croped-img-url").trigger("finished", [{ cropedUrl: base64 }]);
            $cropFile.hide();
            $(".jcrop-holder > div:first-child .saveLoading").remove();
            jCropObj.enable();
            var obj = document.getElementById('fileUrl');
            obj.value = "";
            return;
        }
        var WorkDataUtil = require("../../utils/WorkDataUtil")
        WorkDataUtil.uploadEffectImg(base64, function (file) {
            uploadedFile = file;
            $("#croped-img-url").val(file.url());
            $("#croped-img-url").trigger("finished", [{ cropedUrl: file.url() }]);

            var newImg = new Image();
            newImg.onload = function () {
                $screenImage.attr("src", file.url()).css({ "margin": 0, "width": 166, "height": 166 });
                $cropFile.hide();
                $edit.unbind("click");
                $edit.click(function () {
                    $cropFile.show();
                });
                $screenImage.unbind("click");
                $screenImage.click(function () {
                    $cropFile.show();
                });
                $cropCtrlBar.show();
                $(".jcrop-holder > div:first-child .saveLoading").remove();
                jCropObj.enable();
                var obj = document.getElementById('fileUrl');
                obj.value = "";
            };
            newImg.src = file.url();
            console.log("图片上传成功！");
        }, function (err) {
            $(".jcrop-holder > div:first-child .saveLoading span").html("裁切失败，请重新裁切...");
            setTimeout(function () {
                $(".jcrop-holder > div:first-child .saveLoading").remove();
                $cropCtrlBar.show();
                jCropObj.enable();
            }, 2000);
            console.log(err, "封面图裁切上传失败");
        });
    },
    /**
     * 为了判断选择文件框的格式。
     * @param data 有值的时候，就是 转档传输。
     */
    _onclickInputFile : function(evt, data){
        //用于区分是否上传文件
        this.isConvertCover = data;
    },
    _cropCancel: function () {
        var obj = document.getElementById('fileUrl');
        obj.outerHTML = obj.outerHTML;
        $("#publish-info-cropFile").hide();
    },
    popupDialog(state) {
        this.refs.dialog.setState({
            appearanceState: state
        });
    },

    handleLogout() {
        this.popupDialog(true);
    },

    backToIndexPage() {
        // close dialog
        this.popupDialog(false);

        //logout current user
        fmacloud.User.logOut();

        // link to index
        location.pathname === '/' ? location.reload() : Base.linkToPath('/');
    },

    componentDidMount() {
        var $userSlide = $(this.refs.userSlide);
        var minH = $userSlide.outerHeight(true);
        var clientMinH = document.body.clientHeight - 77;
        var clientHeight = Math.max(minH, clientMinH);
        $userSlide.css({ "min-height": `${clientHeight}px`, "height": "100%" });
        console.log(clientHeight);
        this.rePosition();
        $("#fileUrl").on("click",this._onclickInputFile);   //增加对文件上传的监听
        window.addEventListener("resize", this.rePosition)
        this.bindWindowScrollEvent();
    },
    rePosition: function () {
        var dom = this.refs.userFrame;
        if (dom) {
            var marginLeft = ($(dom.parentNode).width() - $(dom).width()) / 2
            $(this.refs.userFrame).css({ "marginLeft": `${marginLeft}px` })
        }

    },
    componentWillUnmount() {
        window.removeEventListener("resize", this.rePosition)
        this.bindWindowScrollEvent({ isUnset: true });
        $("#fileUrl").off("click");
    },

    onChildChanged: function (newState) {
        this.setState({
            tabIndex: newState
        });
    },

    changeTabIndex: function (templateType) {
        console.log(this.lastClick);
        var _this = this;
        if (this.lastClick == TabIndex.WEIXINEDIT && templateType == TabIndex.WEIXINPUSH) {
            return;
        }
        if (this.lastClick == TabIndex.WEIXINEDIT) {
            this.refs.tabContent.confirmSave({
                ok: function () {
                    _this.lastClick = templateType;
                    Base.linkToPath(`/user/tab/${templateType}`)
                }
            })
            return;
        }
        this.lastClick = templateType;
        Base.linkToPath(`/user/tab/${templateType}`)
    },

    thirdPartyToggle: function () {
        this.setState({
            showThirdParty: !this.state.showThirdParty
        })
    },
    closeExportDialog: function () {
        this.setState({
            showExport: false
        })
    },
    handleShareDialog: function () {
        this.setState({
            showShareDiolog: !this.state.showShareDiolog
        });

    }

});

// export User component
module.exports = User;
