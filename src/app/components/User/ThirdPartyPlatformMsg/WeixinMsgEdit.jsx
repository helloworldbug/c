/**
 * @description 消息编辑
 * @time 2016-6-26
 * @author lifeng
 */

'use strict';

// require core module
var React = require('react');
var mui = require('material-ui');
import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
var classnames = require("classnames");
var Tabs = mui.Tabs;
var Tab = mui.Tab;
var $ = require("jquery");
var log = require("loglevel");
var PicLib = require('./PicLib');
var ChapterList = require("./ChapterList");
var Dialog = require('../../Common/Dialog');
var WorkDialog = require("./WorkDialog");
var GroupPushDialog = require("./GroupPushDialog");
var ImportArticle = require("./ImportArticle");//导入文章 add by guYY
var GlobalFunc = require("../../Common/GlobalFunc.js");
var MeStore = require('../../../stores/MeStore'),
    MeActionCreators = require('../../../actions/MeActionCreators');
var MakeWebAPIUtils = require("../../../utils/MakeWebAPIUtils");
var Base = require("../../../utils/Base");
var _ = require("lodash");
var _window;
var MSGTAB = "1", PICLIBTAB = "2";//图文消息和图片库tab的值
var COVERMAXSIZE = 2;//封面图最大2M
var FILEFILTER = "image/jpeg,image/jpg,image/png,image/gif"

const MAXLEN = { //最大长度
    title : 64,//标题最大长度
    author: 8,//标题
    digest: 120//摘要
}
function getInitData() {
    return {
        uploadClicked          : false,
        showTextNote           : true,
        showWorkDialog         : false, //用户作品对话框显示状态
        selectTab              : MSGTAB,//图片库选中tab
        selectIndex            : 0,//当前选中的章
        editor                 : null,//编辑器引用
        msgItem                : {
            articles: [{
                title             : "",//标题
                content           : "",//正文
                author            : "",//作者
                digest            : "",//摘要
                thumb_media       : "",//封面
                show_cover_pic    : false,//封面是否显示到正文
                content_source_url: "",//原文地址
                originals         : [] //外链图片
            }]
        },//模拟数据
        isShowGroupPush        : false, //是否显示群发组件
        showImportArticleDialog: false,//导入文章框显示状态 add by guYY
    }
}
var WeixinMsgEdit = React.createClass({
    getInitialState          : function () {

        return getInitData()
    },
    childContextTypes        : {
        muiTheme: React.PropTypes.object
    },
    getChildContext() {
        return {muiTheme: getMuiTheme(baseTheme)};
    },
    componentWillReceiveProps: function () {
        //this.saved = false;
        //return getInitData()
    },
    validMsg                 : function () {
        var articles = this.state.msgItem.articles;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            if (isEmpty(article.title)) {
                this.refs.editorWrapper.scrollTop = 0;
                this.selectChapter(i)
                this.setState({titleError: true,});
                return false;
            }
            if (isEmpty(article.content)) {
                this.refs.editorWrapper.scrollTop = 0;
                this.selectChapter(i)
                this.setState({contentError: true});
                return false;
            }
        }
        return true;
        function isEmpty(str) {
            return typeof str == "undefined" || str == ""
        }

    },
    confirmSaveOK            : function () {
        var msg = this.state.msgItem;
        var _this = this;
        MakeWebAPIUtils.postRESTfulData({
            url    : `/v1/sm/user/${_this.userID}/pushing/articles?access_token=`,
            data   : {group: msg},
            success: function (data) {
                if (_this.confirmSaveDialogOk) {
                    _this.confirmSaveDialogOk()
                }
            }
        });


    },
    confirmPushOK            : function () {
        this.groupPush();
    },
    confirmPushCancel        : function () {
        if (this.confirmSaveDialogOk) {
            this.confirmSaveDialogOk()
        }
    },
    confirmSaveDialogShow    : function (config) {
        if (this.saved == false) {
            this.confirmSaveDialogOk = config.ok.bind(this);
            if (this.props.params.msgstatus == 3) {
                this.refs.pushConfirm.show();
            } else {
                this.refs.dialog.show();
            }

        } else {
            config.ok();
        }

    },

    saveMsg                 : function () {
        var msg = this.state.msgItem;
        var _this = this;
        MakeWebAPIUtils.postRESTfulData({
            url    : `/v1/sm/user/${_this.userID}/pushing/articles?access_token=`,
            data   : {group: msg},
            success: function (data) {
                GlobalFunc.addSmallTips("保存成功", 3, {clickCancel: true});
                _this.saved = true;
                _this.setState({msgItem: data.group});
                var query = `/user/tab/12&msgid=${data.group.id}&msgstatus=1`;
                Base.replacePath(query)
                // window.history.replaceState(null, null, query);
            }
        });

    },
    hideError               : function (key) {
        this.setState({[`${key}Error`]: false})
    },
    /**
     * 判断正文是否为空，为空时显示正文开始提示（模拟placeholder）
     */
    checkTextNote           : function () {
        if (this.state.msgItem.articles[this.state.selectIndex].content == "") {
            this.setState({showTextNote: true});
        } else {
            this.setState({showTextNote: false});
        }
    },
    componentWillUnmount    : function () {
        console.log("weixineditunmount");
        document.onkeydown = function () {
        };
        window.onbeforeunload = function () {
        };
        $("#header").unbind("nav", this.navConfirmSave)
        UE.getEditor('editor').destroy();
        window.onscroll = function () {
        };
    },
    navConfirmSave          : function (event, data) {
        this.confirmSaveDialogShow({
            ok: function () {
                Base.linkToPath(data.url)
                // window.location.hash = data.url
            }
        })
    },
    componentDidMount       : function () {
        var _this = this;
        document.onkeydown = banBackSpace;
        window.onbeforeunload = function () {
            if (_this.saved == false) {
                return "提示：未保存的内容将会丢失";
            }
        };
        $("#header").on("nav", this.navConfirmSave)
        this.accounts = []
        var _this = this;
        var clientHeight = document.body.clientHeight;
        this.refs.editorWrapper.style.height = (clientHeight - 176) + "px";
        this.userID = Base.getCurrentUser().id;
        if (this.props.params && this.props.params.msgid) {
            var msgid = this.props.params.msgid;
            MakeWebAPIUtils.getRESTfulData({
                url    : `/v1/sm/user/${_this.userID}/pushing/group/${msgid}/articles?access_token=`,
                success: function (data) {
                    _this.accounts = data.accounts;
                    _this.setState({msgItem: data.group, selectIndex: 0});
                    if (_this.editorReady) {
                        _this.setState({showTextNote: false});
                        _this.state.editor.setContent(data.group.articles[0].content)
                    } else {
                        editor.addListener('ready', function (editor) {
                            _this.setState({showTextNote: false});
                            _this.state.editor.setContent(data.group.articles[0].content)
                        })
                    }
                }
            })
        }

        UE.delEditor("editor");
        var editor = UE.getEditor('editor', {
            initialStyle      : 'p{line-height:1em; font-family: Microsoft YaHei; }',
            autoFloatEnabled  : false,
            //topOffset         : 180,
            imagePopup        : true,
            elementPathEnabled: false,//不显示div层级0
            maximumWords      : 20000,//最大字数
            enableAutoSave    : false,//禁用自动保存到本地
            zIndex            : 0,//编辑区兄弟节点同层
            initialFrameHeight: 400//为配合图片库高度，设定编辑区初始高度
        });
        this.setState({editor: editor});
        editor.addListener('ready', function (editor) {
            //编辑区随窗口宽度改变时改变宽度;
            _this.editorReady = true;
            var contentID = document.getElementById("editor").firstChild.id;
            document.getElementById(contentID).style.width = "auto";
            document.getElementById(`${contentID}_iframeholder`).style.width = "auto";
        });
        editor.addListener('contentChange', function () {
            //_this.saved = false;
            var content = editor.getContent();
            _this.setState({showTextNote: content == ""});
            if (_this.state.contentError && content != "") {
                _this.setState({contentError: false});
            }

            _this.state.msgItem.articles[_this.state.selectIndex].content = content;
            _this.state.msgItem.articles[_this.state.selectIndex].auto_digest = editor.getContentTxt().substr(0, 54);
        });
        editor.addListener('afterSetContent', function () {
            //_this.saved = false;
            _this.setState({showTextNote: !editor.hasContents()});
        });
        editor.addListener("focus", ()=> {
            //编辑区进入编辑状态时，隐藏提示文字
            this.saved = false;
            this.setState({showTextNote: false});

            editor.setEnabled();
            this.editoring = true;
        });
        editor.addListener("blur", ()=> {
            //编辑区进入编辑状态时，隐藏提示文字
            this.setState({showTextNote: !editor.hasContents()});

        });
        var authorObj = this.refs.author;
        var titleObj = this.refs.title;
        $(authorObj).focus(()=> {
            //作者输入时，禁用编辑工具条，显示字数
            editor.setDisabled();
            authorObj.nextSibling.style.display = "block"
        }).blur(()=> {
            //作者没有焦点时不显示字数
            if (this.getStringLen(authorObj.value) <= MAXLEN.author) {
                authorObj.nextSibling.style.display = "none"
            }

        });
        $(titleObj).focus(()=> {
            //标题输入时，禁用编辑工具条，显示字数
            editor.setDisabled();
            titleObj.nextSibling.style.display = "block"
        }).blur(()=> {
            //标题没有焦点时不显示字数
            if (titleObj.value.length <= MAXLEN.title) {
                titleObj.nextSibling.style.display = "none"
            }

        });

    },
    startEdit               : function (event) {
        //进入编辑，隐藏正文开始提示
        event.stopPropagation();
        this.state.editor.focus();
        this.setState({showTextNote: false});
        //this.refs.textnote.style.display = "none"
    },
    /**
     * 改变当前选中文章某项属性内容
     * @param key 要改变的属性名
     * @param event 事件对象，把event.target.value的值赋给属性
     */
    changeState             : function (key, event) {
        var newMsgItem = this.state.msgItem;
        this.saved = false;
        newMsgItem.articles[this.state.selectIndex][key] = event.target.value;
        this.setState({msgItem: newMsgItem, [`${key}Error`]: false});
    },
    changeAuthor            : function (event) {
        var newMsgItem = this.state.msgItem;
        var value = event.target.value;
        if (this.getStringLen(value) > MAXLEN.author) {
            var trimStr = value.substr(0, MAXLEN.author * 2);
            var len = this.getStringLen(trimStr)
            while (len > MAXLEN.author) {
                trimStr = trimStr.substr(0, trimStr.length - 1);
                len = this.getStringLen(trimStr)
            }
            value = trimStr;
        }
        this.saved = false;
        newMsgItem.articles[this.state.selectIndex]["author"] = value;
        this.setState({msgItem: newMsgItem, "authorError": false});
    },
    /**
     * 改变当前选中文章某项属性的选中状态
     * @param key 要改变的属性名
     * @param event 事件对象，把event.target.checked的值赋给属性
     */
    changeCheckState        : function (key, event) {
        var newMsgItem = this.state.msgItem;
        this.saved = false;
        newMsgItem.articles[this.state.selectIndex][key] = event.target.checked;
        this.setState({msgItem: newMsgItem});
    },
    /**
     * 设置消息内容，增，删，交换时调用
     * @param msgItem 文章对象
     */
    changeMsg               : function (msgItem) {
        this.saved = false;
        this.setState({msgItem: msgItem});
    },

    /**
     * 选中文章
     * @param selectIndex 要选中的序号
     */
    selectChapter           : function (selectIndex) {
        this.setState({selectIndex: selectIndex, titleError: false, contentError: false}, ()=> {
            var content = this.state.msgItem.articles[this.state.selectIndex].content;
            if (!this.state.editor.hasContents()) {
                this.setState({showTextNote: true})
            } else {
                this.setState({showTextNote: false})
            }
            this.state.editor.setContent(content)
        });

    },
    /**
     * 选中图片库标签
     */
    selectPicTab            : function () {
        this.setState({selectTab: PICLIBTAB});
        this.editoring = false;
    },
    /**
     * 改变当前显示的tab
     * @param tabIndex
     */
    tabChange               : function (tabIndex) {
        this.setState({selectTab: tabIndex})
    },
    /**
     * 弹出上传文件框
     */
    triggerUpload           : function () {
        if (!this.state.uploadClicked) {
            $("#msg-cover-upload").trigger("click")
        }

    },
    /**
     * 重新设置上传框的值，否则下次选同一个文件时不会触发onChange
     * @private
     */
    _resetInput             : function () {
        var obj = document.getElementById('msg-cover-upload');
        obj.outerHTML = obj.outerHTML;
    },
    /**
     * 上传文件
     * @param event
     */
    uploadFile              : function (event) {
        var _this = this;
        var files = event.target.files;
        var valid = GlobalFunc.validFileSize(files, COVERMAXSIZE * 1024 * 1024);
        if (valid.code == 1) {
            GlobalFunc.addSmallTips(valid.msg, null, {clickCancel: true});
            return
        } else if (valid.code == 2) {
            GlobalFunc.addSmallTips(valid.msg + "大于2M,不能上传", null, {clickCancel: true});
            return
        }
        valid = GlobalFunc.validFileType(files, FILEFILTER);
        if (valid == 1) {
            GlobalFunc.addSmallTips("未识别的文件类型！(暂时只支持jpeg,jpg,png,gif)", null, {clickCancel: true});
            return;
        }
        var file = files.item(0);
        var filename = file.name;
        var newFile = new fmacloud.File(filename, file);
        //_this._cropUploadFile(fileUrl.url, true);
        this.setState({uploadClicked: true});
        newFile.save().then(function (object) {
            var _url = object.get("url");
            var newArticle = _this.state.msgItem;
            newArticle.articles[_this.state.selectIndex].thumb_media = _url;
            _this.setState({msgItem: newArticle, uploadClicked: false});
            //GlobalFunc.addSmallTips("视频封面上传成功", 0, {clickCancel: true, delBackGround: true});
        }, function (error) {
            _this.setState({uploadClicked: false});
            log.info(error)
        });
        var obj = document.getElementById('msg-cover-upload');
        obj.value = "";

    },
    /**
     * 删除封面
     */
    removeCover             : function () {
        this.saved = false;
        var newArticle = this.state.msgItem;
        newArticle.articles[this.state.selectIndex].thumb_media = "";
        this.setState({msgItem: newArticle});
    },
    /**
     * 计算字符串长度，两个英文字母算一个字，一个汉字一个字
     * @param str
     * @returns {number}
     */
    getStringLen            : function (str) {
        if (!str)return 0;
        return Math.ceil(str.replace(/[^\x00-\xff]/g, "rr").length / 2);
    },
    /**
     * 进入预览
     */
    preview                 : function () {

        localStorage.setItem("msg", JSON.stringify(this.state.msgItem));//设置b为"isaac"
        if (!this.validMsg()) {
            return;
        }
        null != _window ? (_window.close()) : false;
        _window = window.open('/sharePreview', '_prev', 'width=500,height=700');
        _window.window.show_data = {
            msgItem  : this.state.msgItem,
            headerUrl: Base.getCurrentUser().get("user_pic")
        }
    },
    /**
     * 添加原文链接
     * @param urlObj
     */
    addLink : function (urlObj) {
        this.saved = false;
        var newArticle = this.state.msgItem;
        newArticle.articles[this.state.selectIndex].content_source_url = urlObj.url;
        this.setState({msgItem: newArticle});
    },
    /**
     *显示用户作品对话框
     */
    showWorkDialog          : function () {
        this.setState({showWorkDialog: true})
    },
    /**
     *隐藏用户作品对话框
     */
    hideWorkDialog          : function () {
        this.setState({showWorkDialog: false})
    },
    /**
     * 点击导入文章
     * add by guYY
     */
    showImportArticle       : function (ev) {
        ev.stopPropagation()
        //取消当前编辑对象
        var editingArticle = this.state.msgItem.articles[this.state.selectIndex];
        if (editingArticle.content && editingArticle.content.length > 0) {
            //继续导入会覆盖当前文稿，是否继续？
            this.refs["aaa"].show();
            return;
        }else{
            this.showImportArticleConform();
        }

    },
    //点击打开导入窗口 add by guYY
    showImportArticleConform: function () {
        this.setState({showImportArticleDialog: true});
    },
    /**
     * 取消导入文章
     * add by guYY
     */
    hideImportArticleDialog : function () {
        this.setState({showImportArticleDialog: false})
    },
    /**
     * 添加导入文章 覆盖当前文章
     * @param article
     * add by guYY
     */
    importArticle           : function (article) {
        var articles = this.state.msgItem.articles;
        //article.thumb_media = "http://www.44886.com/api/img?url="+article.thumb_media;
        console.log(article.thumb_media);
        articles[this.state.selectIndex] = article;
        this.setState({msgItem: {articles: articles}, showImportArticleDialog: false});
        this.state.editor.setContent(article.content);
    },
    /**
     * 删除原文链接
     * @param urlObj
     */

    removeOriUrl            : function () {
        this.saved = false;
        var newMsg = this.state.msgItem;
        newMsg.articles[this.state.selectIndex].content_source_url = "";
        this.setState({msgItem: newMsg});
    },

    /**
     * 判断图片数组arr中是否有url对应的图片
     * @param arr
     * @param url
     * @returns {boolean} true为已经存在，false为不存在
     * @private
     */
    _existImg: function (arr, url) {
        for (let item of arr) {
            if (item.src == url) {
                return true;
            }
        }
        return false
    },
    /**
     * 给正文或封面添加图片
     * @param url
     */
    addImg   : function (url, size) {
        this.saved = false;
        if (this.editoring) {
            //var newArticle = this.state.msgItem;
            if (!this._existImg(this.state.msgItem.articles[this.state.selectIndex].originals, url)) {
                this.state.msgItem.articles[this.state.selectIndex].originals.push({src: url});
            }
            this.state.editor.execCommand('insertimage', {
                src: url
            });
            //this.state.editor.setContent(`<img src="${url}"/>`, true);
        } else {

            if (size / 1024 > COVERMAXSIZE) {
                GlobalFunc.addSmallTips("封面图最大不能超过2M", null, {clickCancel: true})
            } else {
                var newArticle = this.state.msgItem;
                newArticle.articles[this.state.selectIndex].thumb_media = url;
                this.setState({msgItem: newArticle});
            }

        }

    },

    render: function () {
        var editingArticle = this.state.msgItem.articles[this.state.selectIndex]
        var tabLabContainerStyle = {
            height         : "40px",
            lineHeight     : "40px",
            backgroundColor: "#e4e4e6",
        };
        var tabLabStyle = {
            height    : "40px",
            color     : "#000",
            fontSize  : "14px",
            position  : "relative",
            fontFamily: 'Microsoft YaHei'
        };
        var inkBarStyle = {
            backgroundColor: " rgb(102,102,102)",
            height         : "3px",
            marginTop      : "-3px"
        };
        var coverStyle = {
            backgroundImage   : `url(${this.state.msgItem.articles[this.state.selectIndex].thumb_media})`,
            backgroundSize    : "cover",
            backgroundPosition: 'center center'
        }
        var showCoverClass = classnames({
            hide               : !this.state.msgItem.articles[this.state.selectIndex].thumb_media,
            "cover-img-wrapper": true
        });
        var titleCountClass = classnames({
            overflow: editingArticle.title ? editingArticle.title.length > MAXLEN.title - 2 : false,
            "count" : true
        });
        var authorLen = editingArticle.author ? this.getStringLen(editingArticle.author) : 0
        var authorCountClass = classnames({
            overflow: authorLen > MAXLEN.author - 2,
            "count" : true
        });
        var abstractLen = editingArticle.digest ? editingArticle.digest.length : 0;
        var abstractCountClass = classnames({
            overflow: abstractLen > MAXLEN.digest - 2,
            "count" : true
        })
        var titleErrorClass = classnames({
            error: this.state.titleError,
            tips : true
        })

        var contentErrorClass = classnames({
            error  : this.state.contentError,
            content: true,
            tips   : true
        })
        var textnoteClass = classnames({
            show: this.state.showTextNote
        })
        var tabHeight = document.body.clientHeight - 230;
        var uploadClass = classnames({
            btn                : true,
            "btn-upload"       : true,
            "loading-animation": this.state.uploadClicked,
            hover              : this.state.uploadClicked
        });
        //删除文章时弹出的确定删除对话框

        return (
            <div id="weixin-msg-edit" className="align-to-left" onClick={this.checkTextNote}>
                {Dialog.buildDialog({
                    title : "确定离开当前编辑页面吗？", sureText: "离 开", cancelText: "留 下",
                    sureFn: function () {
                        this.confirmSaveOK();
                    }.bind(this)
                })}
                {Dialog.buildDialog({
                    title   : "是否需要同步图文消息？", sureText: "同 步", cancelText: "放 弃", ref: "pushConfirm",
                    sureFn  : function () {
                        this.confirmPushOK();
                    }.bind(this),
                    cancelFn: function () {
                        this.confirmPushCancel();
                    }.bind(this)
                })}
                {Dialog.buildDialog({
                    ref   : "aaa",
                    title : '继续导入会覆盖当前文稿，是否继续？',
                    sureFn: function () {
                        this.showImportArticleConform();
                        this.refs.dialog.hide()
                    }.bind(this)
                })}
                {this.state.showWorkDialog ? <WorkDialog ok={this.addLink} hide={this.hideWorkDialog}
                                                         url={editingArticle.content_source_url}
                                                         userID={this.userID}/> : null}
                <div className="title">
                    <span className="name">新建图文消息</span>
                    <div className="title-btn">
                        <span onClick={this.showImportArticle}>导入文章</span>
                        <span onClick={this.preview}>预览</span>{this.props.params.msgstatus == 3 ? null :
                        <span onClick={this.saveMsg}>保存</span>}<span
                        onClick={this.clickGroupPushHandle}>同步</span></div>
                </div>
                <div className="content">
                    <div className="editor-area" ref="editorWrapper">
                        <script id="editor" type="text/plain"></script>
                        <div id="author-title">

                            <div className="line">
                                <div className={titleErrorClass}><span className="icon"></span>标题不能为空<span
                                    className="close" onClick={this.hideError.bind(this,"title")}></span>
                                </div>

                                <div className={contentErrorClass}><span className="icon"></span>正文不能为空<span
                                    className="close" onClick={this.hideError.bind(this,"content")}></span></div>
                                <input type="text" name="title" ref="title" value={editingArticle.title}
                                       placeholder="请在这里输入标题"
                                       onChange={this.changeState.bind(this,"title")} maxLength="64"/>
                                <div className={titleCountClass}><span
                                    className="current">{editingArticle.title ? editingArticle.title.length : 0}</span>/<span
                                    className="max">{MAXLEN.title}</span>
                                </div>
                            </div>
                            <div className="author-wrapper line">

                                <input type="text" name="author" ref="author" value={editingArticle.author}
                                       maxLength="30"
                                       placeholder="请输入作者"
                                       onChange={this.changeAuthor}/>
                                <div className={authorCountClass}><span
                                    className="current">{authorLen}</span>/<span
                                    className="max">{MAXLEN.author}</span>
                                </div>
                            </div>

                            <label ref="textnote" className={textnoteClass} onClick={this.startEdit}>从这里开始写正文</label>
                        </div>
                        <div className="article-footer">
                            <div className="edit-link"><span className="btn"
                                                             onClick={this.showWorkDialog}>添加我的作品链接</span><span
                                className="oriurl">{editingArticle.content_source_url || "点击添加作品链接"}</span>{editingArticle.content_source_url ?
                                <span className="removeori" onClick={this.removeOriUrl}>删除链接</span> : null}</div>
                            <div className="edit-cover">
                                <div className="title-name">封面<span className="tips">图片建议尺寸：900像素*500像素</span></div>
                                <div>
                                 <span className={uploadClass} onClick={this.triggerUpload}><input
                                     id="msg-cover-upload" type="file" accept="image/jpeg,image/jpg,image/png,image/gif"
                                     onChange={this.uploadFile}/>本地上传</span><span
                                    className="btn btn-select" onClick={this.selectPicTab}>从图片库选择</span>
                                </div>
                                <div className={showCoverClass}>
                                    <span className="cover" style={coverStyle}/>
                                    <span className="remove" onClick={this.removeCover}></span>
                                </div>

                                <div className="show-in-text title-name"><input type="checkbox"
                                                                                checked={this.state.msgItem.articles[this.state.selectIndex].show_cover_pic?true:false}
                                                                                onChange={this.changeCheckState.bind(this,"show_cover_pic")}/><span
                                    className="tips">封面图片显示在正文中</span>
                                </div>
                            </div>
                            <div className="abstract">
                                <div className="title-name">摘要<span className="tips">选填，如果不填写会默认抓取正文前54个字</span></div>
                                <textarea name="" cols="30" rows="10"
                                          onChange={this.changeState.bind(this,"digest")} value={editingArticle.digest}
                                          maxLength="120" placeholder="请在这里输入摘要"></textarea>
                                <div className="line">
                                    <div className={abstractCountClass}><span
                                        className="current">{abstractLen}</span>/<span
                                        className="max">{MAXLEN.digest}</span>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                    <div className="mgr">
                        <Tabs inkBarStyle={inkBarStyle} tabItemContainerStyle={tabLabContainerStyle}
                              value={this.state.selectTab} onChange={this.tabChange}>
                            <Tab label="图文消息" style={tabLabStyle} value={MSGTAB}><ChapterList
                                msg={this.state.msgItem}
                                selectIndex={this.state.selectIndex}
                                changeMsg={this.changeMsg}
                                select={this.selectChapter} tabHeight={tabHeight}/></Tab>
                            <Tab label="我的图片" style={tabLabStyle} value={PICLIBTAB}><PicLib addImg={this.addImg}
                                                                                            tabHeight={tabHeight}/></Tab>
                        </Tabs>
                    </div>
                </div>
                {this.state.isShowGroupPush ?
                    <GroupPushDialog accounts={this.accounts} ok={this.confirmSaveDialogOk}
                                     changeGroupPushState={this.changeGroupPushState}
                                     msgItem={this.state.msgItem}/> : null }
                {this.state.showImportArticleDialog ?
                    <ImportArticle ok={this.importArticle} hide={this.hideImportArticleDialog}/> : null}
            </div>
        )
            ;
    },

    groupPush           : function (cb) {
        //校验数据信息
        if (!this.validMsg()) {
            return;
        }
        //显示群发框
        this.changeGroupPushState(true);
    },
    /**
     * 点击群发按钮
     */
    clickGroupPushHandle: function () {
        this.groupPush();
    },

    /**
     * 改变群发框
     * @param type boolean
     */
    changeGroupPushState: function (type) {
        this.setState({
            isShowGroupPush: type
        });
    }

});

module.exports = WeixinMsgEdit;


function banBackSpace(e) {
    var ev = e || window.event;//获取event对象
    var obj = ev.target || ev.srcElement;//获取事件源

    var t = obj.type || obj.getAttribute('type');//获取事件源类型

//获取作为判断条件的事件类型
    var vReadOnly = obj.getAttribute('readonly');
    var vEnabled = obj.getAttribute('enabled');
//处理null值情况
    vReadOnly = (vReadOnly == null) ? false : true;
    vEnabled = (vEnabled == null) ? true : vEnabled;

//当敲Backspace键时，事件源类型为密码或单行、多行文本的，
//并且readonly属性为true或enabled属性为false的，则退格键失效
    var flag1 = (ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea")
    && (vReadOnly || vEnabled != true)) ? true : false;

//当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
    var flag2 = (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")
        ? true : false;

//判断
    if (flag2) {
        return false;
    }
    if (flag1) {
        return false;
    }
}
