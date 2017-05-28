/**
 * @description 群发提示弹出框
 * @time 2016-7-14
 * @author yangjian
 */

'use strict';

// require core module
var React = require('react'),
    MeActionCreators = require('../../../actions/MeActionCreators'),
    MeStore = require('../../../stores/MeStore'),
    ContextUtils = require('../../../utils/ContextUtils'),
    MakeWebAPIUtils = require('../../../utils/MakeWebAPIUtils'),
    Dialog = require('../../Common/Dialog'),
    html2canvas = require('../../../lib/html2canvas'),
    GlobalFunc = require("../../Common/GlobalFunc.js");
    var Base=require("../../../utils/Base")
import {Link} from 'react-router'
var MeActionCreators = require('../../../actions/MeActionCreators');

//公众号默认头像
var defaultFace = require('../../../../assets/images/user/defaultFace.jpg');

var GroupPushDialog = React.createClass({

    getInitialState: function () {
        var accounts = this.props.accounts;
        var platforms = this.props.platforms;
        var data;
        if(accounts){
            data = accounts
        }else if(platforms) {
            data = platforms
        }else {
            data = {}
        }
        var checked = {};
        for(var i=0, len = data.length; i< len; i++) {
            if(data[i].status == "3") {
                checked[data[i].id] = true;
            }
        }

        return {
            okClicked   : false, //确定loading
            authList    : [],
            pushDisabled: false, //提交按钮可以状态
            checked: checked
        };
    },

    componentDidMount: function () {
        this.queryAuthList(); //渲染授权列表
        MeStore.addChangeListener(this.onChangeAuthList); //添加监听store授权列表
    },

    componentWillUnmount: function () {
        MeStore.removeChangeListener(this.onChangeAuthList);
    },


    render: function () {

        var _this = this;

        var authList = this.state.authList || [];
        var weixinAuthList,
            weiboAuthList;

        var platforms = this.props.platforms; //从列表页点击过来有这个变量

        weixinAuthList = authList.filter(function (item) {
            return item.plantfom === "weixin";
        });

        weiboAuthList = authList.filter(function (item) {
            return item.plantfom === "weibo"
        });

        // 微信公众号jsx列表
        var weixinDomList = '',
            weixinTips = "选择要推送图文信息的公众号";
        //判断是否有信息
        if (weixinAuthList.length > 0) {
            weixinDomList = weixinAuthList.map(function (item, index) {
                var invalid = '',
                    input = '', //不可选
                    disabled = false,
                    checked = false;
                if (!item.actived) { //判断是否失效
                    invalid = "invalid"; //失效则加上失效样式
                } else {
                    if(_this.isInAuthList(item.id) && !platforms){
                        disabled = true;
                    }
                    if(_this.state.checked[item.id]){
                        checked  = true;
                    }
                    //添加复选框
                    input = <input type="checkbox" id={"wx" + index} onChange={_this.changeChecked.bind(_this, item.id)} disabled={disabled} value={item.id} checked={checked} />;
                }

                return <li className={invalid} key={index}><label htmlFor={"wx" + index}><i><img
                    src={item.head_img ||defaultFace}/></i>{item.nick_name}{input}</label></li>
            });
        } else {
            weixinTips =
                <Link target="_blank" to="/user/tab/9"
                   onClick={this.props.changeGroupPushState.bind(null, false)}>(还未授权微信公众号，点击进行授权)</Link>;
        }

        // 新浪微博jsx列表
        var weiboDomList = '',
            weiboTips = "选择要推送图文信息的新浪微博";
        //判断是否有信息
        if (weiboAuthList.length > 0) {
            weiboDomList = weiboAuthList.map(function (item, index) {
                var invalid = '',
                    input = '',
                    disabled = false,
                    checked = false;
                if (!item.actived) { //判断是否失效
                    invalid = "invalid"; //失效则加上失效样式
                } else {
                    if(_this.isInAuthList(item.id) && !platforms){
                        disabled = true;
                    }
                    if(_this.state.checked[item.id]){
                        checked  = true;
                    }
                    //添加复选框
                    input = <input type="checkbox" id={"wb" + index} onChange={_this.changeChecked.bind(_this, item.id)} disabled={disabled} value={item.id} checked={checked} />;
                }

                return <li className={invalid} key={index}><label htmlFor={"wb" + index}><i><img src={item.head_img}/></i>{item.nick_name}</label>{input}</li>

            });
        } else {
            weiboTips =
                <Link target="_blank" to="/user/tab/9" onClick={this.props.changeGroupPushState.bind(null, false)}>
                    (还未授权新浪微博,点击进行授权)</Link>;
        }

        return (
            <div>
                <span className="shade"></span>
                <div className="group-push-box">
                    <div className="title">
                        <span className="left">一键推送到各平台</span>
                        <span className="right"><Link target="_blank"
                                                    onClick={this.props.changeGroupPushState.bind(null, false)}
                                                    to="/user/tab/9">更多授权</Link></span>
                    </div>
                    <div className="lists">
                        <dl>
                            <dt><i className="wx-icon"></i>{weixinTips}</dt>
                            <dd>
                                <ul>
                                    {weixinDomList}
                                </ul>
                            </dd>
                        </dl>
                        <dl>
                            <dt><i className="weibo-icon"></i>{weiboTips}</dt>
                            <dd>
                                <ul>
                                    {weiboDomList}
                                </ul>
                            </dd>
                        </dl>
                    </div>
                    <div className="foot">
                        <div className="fl"><label className="check"><input type="checkbox" /> 长图文形式分享</label></div>
                        <a href="javascript:;" className={this.state.okClicked ? 'submit' : null} onClick={!this.state.pushDisabled ? this.submitPush : null}>确定</a>
                        <a href="javascript:;" onClick={this.props.changeGroupPushState.bind(null, false)}>取消</a>
                    </div>
                </div>
                <Dialog headHeight="0" title={this.state.dialogTitle} appearanceState={this.state.showDialog}
                        sureFn={this.state.sureFn} sureIsHide="sureIsHide" cancelFn={this.hideDialog}/>

            </div>
        )
    },


    /**
     * 判断id是否存在授权列表中
     * @param id
     */
    isInAuthList: function(id) {
        var accounts = this.props.accounts;
        var platforms = this.props.platforms;
        var list;
        if(accounts) {
            list = accounts;
        }else if(platforms) {
            list = platforms
        }else {
            list = [];
        }
        return list.some(function(item) { return item.id === id && item.status == "3"  });
    },

    changeChecked: function(id) {
        var _this = this;
        var check = this.state.checked;
        check[id] = !check[id];
        _this.setState({
            checked:check
        });
    },

    /**
     * 提交推送
     */
    submitPush: function () {
        var _this = this;
        var userId = ContextUtils.getCurrentUser() ? ContextUtils.getCurrentUser().id : null;
        if (!userId) return;

        var accounts = []; //选中授权账号列表
        //获取选中的帐号信息
        $('.lists input[type="checkbox"]').each(function () {
            if ($(this).prop('checked') == true) {
                accounts.push(
                    {"id": $(this).val()}
                );
            }
        });

        //长图文形式
        var check = $('.check input').prop("checked");
        var articles;
        if(check) {
            //推送列表点击过来
            if(_this.props.msgGroupId) {
                var msgid = _this.props.msgGroupId;
                MakeWebAPIUtils.getRESTfulData({
                    url    : `/v1/sm/user/${userId}/pushing/group/${msgid}/articles?access_token=`,
                    success: function (data) {
                        articles = data.group.articles;
                        _this.makePic(accounts, userId, articles);
                    }
                });
            }else {
                articles = _this.props.msgItem.articles;
                _this.makePic(accounts, userId, articles);
            }

        }else{
            _this.pushContent(accounts, userId);
        }

    },

    /**
     * 推送图文内容
    **/
    pushContent: function(accounts, userId, longImage) {
        var longPageMode,
            _longImage;

        var _this = this;
        if(!!longImage) {
            _longImage = longImage;
            longPageMode = true;
        }else {
            _longImage = '';
            longPageMode = false;
        }

        if (accounts.length === 0) {
            _this.setState({
                dialogTitle: '请选择要同步图文信息的帐号',
                showDialog : true,
                sureFn     : this.hideDialog
            });
        } else if (this.props.msgGroupId) {
            //设置提交按钮可以状态
            _this.setState({
                okClicked   : true,
                pushDisabled: true
            });
            //群发以后的消息组
            var opt = {};
            opt.accounts = accounts;
            opt.userId = userId;
            opt.messageId = _this.props.msgGroupId;
            opt.long_page_image = _longImage;
            opt.longPageMode  = longPageMode;
            opt.cb_ok = function () {
                _this.setState({
                    dialogTitle: '同步信息成功！',
                    showDialog : true,
                    sureFn     : function () {
                        _this.props.changeGroupPushState(false);
                    },
                    okClicked  : false
                });
            };
            opt.cb_err = function (errMsg) {
                errMsg = errMsg || "信息同步失败！";
                _this.setState({
                    dialogTitle : errMsg,
                    showDialog  : true,
                    sureFn      : _this.hideDialog,
                    pushDisabled: false,
                    okClicked   : false
                });
            };
            MeActionCreators.pushMessage(opt);
        } else {
            //设置提交按钮可以状态
            _this.setState({
                okClicked   : true,
                pushDisabled: true
            });

            var msgItem = _this.props.msgItem;
            var data = {};
            data.group = {};
            data.accounts = accounts; //授权账号
            if (msgItem.id) { //组ID
                data.group.id = msgItem.id;
            }

            data.group.long_page_image = _longImage; //长图片
            data.group.long_page_mode = longPageMode;
            data.group.articles = msgItem.articles;
            var url = "/v1/sm/user/" + ContextUtils.getCurrentUser().id + "/pushing/articles/sending?access_token=";
            var RESTfulData = {
                type         : "POST",
                url          : url,
                data         : JSON.stringify(data),
                success      : function (result) {
                    console.log(result);
                    var account = result.accounts;
                    var err = [];
                    if (!account) {
                        _this.setState({
                            dialogTitle : '同步信息失败！',
                            showDialog  : true,
                            sureFn      : _this.hideDialog,
                            pushDisabled: false,
                            okClicked   : false
                        });
                    } else {
                        for (var i = 0, len = account.length; i < len; i++) {
                            if (account[i].status != 3) {
                                err.push(account[i].name);
                            }
                        }

                        if (err.length > 0) {
                            var errMsg = "<span style='color: #459ae9'>"+err.join("、")+"</span> 同步信息失败!";
                            _this.setState({
                                dialogTitle : errMsg || "同步信息失败",
                                showDialog  : true,
                                sureFn      : _this.hideDialog,
                                pushDisabled: false,
                                okClicked   : false
                            });
                        } else {
                            console.log("success!");
                            _this.setState({
                                dialogTitle: '同步信息成功！',
                                showDialog : true,
                                sureFn     : _this.pushSuccess,
                                okClicked  : false
                            });
                        }
                    }
                },
                'contentType': 'application/json'
            };
            MakeWebAPIUtils.getRESTfulData(RESTfulData);
        }
    },

    /**
     * 生成图文 html
    **/
    generateNewsHtml: function(data) {
        if (data.length <= 0) {
            return "";
        }
        var html = [];
        html.push('<div id="wb-news-list">');
        html.push('<div class="container">');
        for (var i = 0; i < data.length; i++) {
            var d;
            if(typeof data[i].created_at == "undefined") {
                d = new Date();
            }else {
                d = new Date(data[i].created_at);
            }

            var time = GlobalFunc.formatTimeToStr(d, 'yyyy-MM-dd');
            console.log(d, time, "time");
            var title = data[i].title || '';
            var author = data[i].author || "";
            html.push('<div class="news-item">');
            html.push('<p class="title">' + title + '</p>');
            html.push('<p class="time"><span class="time_sp">' + time + '</span>&nbsp;<span>' + author + '</span></p>');
            if (data[i].show_cover_pic && data[i].thumb_media != "") {
                html.push('<img src="' + data[i].thumb_media + '" class="cover">');
            }
            html.push('<div class="content">' );
            html.push(data[i].content);

            if (data[i].content_source_url != "") {
                html.push('<a href="' + data[i].content_source_url + '" class="link_a">阅读全文</a>');
            }

            html.push('</div>');
            html.push('</div>');
        }
        html.push('</div>');
        html.push('<div class="wb-me-logo"></div>')
        html.push('</div>');

        return html.join(' ');
    },

    /**
     * 生成图片
    **/
    makePic: function(accounts, userId, articles) {
        var _this = this;
        var newsHtml =  _this.generateNewsHtml(articles);
        $('#html-canvas').append(newsHtml);
        html2canvas($('#wb-news-list'), {
            useCORS : true,
            onrendered: function(canvas) {
                $('#html-canvas').html(''); //清空存放图片信息的内容
                var base64 = canvas.toDataURL("image/png");

                var file = new fmacloud.File("longImg.png", {base64: base64});
                file.save().then(function (image) {
                    _this.pushContent(accounts, userId, image.get("url"));
                });
            }
        });
    },

    /**
     * 群发成功
     */
    pushSuccess: function () {
        if (this.props.ok) {
            this.props.ok();
        } else {
            Base.linkToPath("/user/tab/11");
        }

    },

    /**
     * 关闭dialog
     */
    hideDialog: function () {
        this.setState({
            showDialog: false
        });
    },

    /**
     * 查询授权列表
     */
    queryAuthList: function () {
        var userid = ContextUtils.getCurrentUser().id;
        var url = "/v1/sm/user/" + userid + "/accounts?access_token=";
        var RESTfulData = {
            type         : 'GET',
            url          : url,
            success      : function (result) {
                console.log(result.accounts);
                if (result.accounts) {
                    MeActionCreators.queryAuthList(result.accounts)
                } else {
                    console.log("error...");
                }
            },
            'contentType': 'application/json'
        };

        MakeWebAPIUtils.getRESTfulData(RESTfulData);

    },

    /**
     * 获取授权列表
     */
    getAuthList: function (store) {
        return store ? {authList: store} : {authList: []};
    },

    /**
     * 更新授权列表状态
     */
    onChangeAuthList: function () {
        this.setState(this.getAuthList(MeStore.getAuthList()));
    }
});

module.exports = GroupPushDialog;