/**
 * @description 授权管理
 * @time 2016-06-28
 * @author yangjian
 */

'use strict';

// require core module
var React = require('react'),
    $ = require('jquery'),
    MeActionCreators = require('../../../actions/MeActionCreators'),
    Base = require('../../../utils/Base'),
    ContextUtils = require('../../../utils/ContextUtils'),
    MakeWebAPIUtils = require('../../../utils/MakeWebAPIUtils'),
    MeStore = require('../../../stores/MeStore'),
    Dialog = require('../../Common/Dialog');
    import {Link} from 'react-router'
//公众号默认头像
var defaultFace = require('../../../../assets/images/user/defaultFace.jpg');
var serverurl = require('../../../../app/config/serverurl');

var Authorized = React.createClass({

    /**
     * 初始化状态
     */
    getInitialState: function () {
        return {
            isShowAuth: false, //微信公众号授权
            AuthUrl   : '' //授权地址
        }
    },

    /**
     * 微信公众号授权
     */
    authFrame: function () {
        var url = this.state.AuthUrl;
        return (
            <div className="auth-popup-bg">
                <div className="wx-auth">
                    <div onClick={this.clickHideAuthHandle} className="close"></div>
                    <iframe src={url} frameBorder="no" scrolling="no" allowTransparency="yes" width="100%"
                            height="100%"></iframe>
                </div>
            </div>
        );
    },
    render   : function () {
        //通过状态判断是否显示微信授权框
        var authFrame = this.state.isShowAuth ? (this.authFrame()) : null;

        //授权帐号列表信息
        var authList = this.state.authList || [];
        var weixinAuthList,
            weiboAuthList;

        //过滤出微信帐号列表
        weixinAuthList = authList.filter(function (item) {
            return item.plantfom === "weixin";
        });

        //过滤出微博帐号列表
        weiboAuthList = authList.filter(function (item) {
            return item.plantfom === "weibo"
        });

        // 微信公众号jsx列表
        var weixinDomList;

        if (weixinAuthList.length > 0) {//判断是否有信息
            weixinDomList = weixinAuthList.map(function (item,index) {
                var invalid = '';
                if (!item.actived) { //判断是否失效
                    invalid = "invalid"; //失效则加上失效样式
                }

                return <li  key={index}  className={invalid}><i><img src={item.head_img || defaultFace}/></i>{item.nick_name}</li>
            });
        } else {
            weixinDomList = <p>(还未授权微信公众号，点击右边的按钮进行授权)</p>;
        }

        // 新浪微博jsx列表
        var weiboDomList;

        if (weiboAuthList.length > 0) {//判断是否有信息
            weiboDomList = weiboAuthList.map(function (item,index) {
                var invalid = '';
                if (!item.actived) { //判断是否失效
                    invalid = "invalid"; //失效则加上失效样式
                }

                return <li  key={index}  className={invalid}><i><img src={item.head_img || defaultFace}/></i>{item.nick_name}</li>
            });
        } else {
            weiboDomList = <p>(还未授权新浪微博，点击右边的按钮进行授权)</p>;
        }

        return (
            <div className="authorized">
                <div className="title">
                    <span>授权其他平台</span>
                    <Link to="/user/tab/12">新建图文消息</Link>
                </div>
                <div className="content clearfix">
                    <div className="authorized-le left">
                        <h3>已授权帐号<em>授权帐号最多五个</em></h3>
                        <div className="authorized-list clearfix">
                            <dl>
                                <dt><i className="wx-icon"></i></dt>
                                <dd>
                                    <ul>
                                        {weixinDomList}
                                    </ul>
                                </dd>
                            </dl>
                        </div>
                        <div className="authorized-list clearfix">
                            <dl>
                                <dt><i className="weibo-icon"></i></dt>
                                <dd>
                                    <ul>
                                        {weiboDomList}
                                    </ul>
                                </dd>
                            </dl>
                        </div>
                        <h3>授权其他平台：</h3>
                        <p>ME为平台方正式授权应用，不会记录你的任何账号、密码信息，更不会泄露授权平台的隐私信息和影响任何功能，授权后可以随时取消授权。</p>
                        <h3>公众号授权：</h3>
                        <p>
                            微信公众号授权给ME后，你可以在ME平台上进行内容推送与同步操作。<br/>
                            如何解除授权：进入微信公众号， 点击“+添加功能插件”，进入授权管理，解除ME授权。
                        </p>
                        <h3>新浪微博解除授权：</h3>
                        <p>
                            登录个人主页-点击“管理中心”-进入“我的应用”，解除ME授权。
                        </p>
                    </div>
                    <div className="authorized-ri right">
                        <ul>
                            <li onClick={this.clickShowAuthHandle.bind(this, "wx")} className="wx-btn">授权微信公众号</li>
                            <li onClick={this.clickShowAuthHandle.bind(this, "wb")} className="weibo-btn">授权新浪微博</li>
                        </ul>
                        <p className="more">更多平台入驻中</p>
                    </div>
                </div>

                {/*微信授权显示框*/}
                { authFrame }

                <Dialog title={this.state.dialogTitle} appearanceState={this.state.showDialog}
                        sureFn={this.state.sureFn} sureIsHide="sureIsHide" cancelFn={this.hideDialog}/>

            </div>
        )
    },

    componentDidMount: function () {
        MeActionCreators.changeAuthDialog(false); //初始化时，让授权框隐藏
        var authDialogStatus = MeStore.getAuthDialogStatus();

        this.setState({
            isShowAuth: authDialogStatus
        });

        this.queryAuthList(); //渲染授权列表
        MeStore.addChangeListener(this.onChangeAuthList); //添加监听store授权列表
    },

    componentWillUnmount: function () {
        MeStore.removeChangeListener(this.onChangeAuthList);
    },

    /**
     * 显示微信授权框
     */
    clickShowAuthHandle: function (type) {
        var authList = this.state.authList || [];
        //授权帐号最多五个
        if (authList.length >= 5) {
            this.setState({
                dialogTitle: '授权帐号最多五个',
                showDialog : true,
                sureFn     : this.hideDialog
            });
            return;
        }

        var _this = this;
        var url = serverurl.push + "/" + type + "/oauthurl";
        $.get(url, function (result) {
                var callback;
                //通过fmawr的值决定回调地址
                 callback = result + location.origin+"/push/" + type + "callback.html";
                // if (window.fmawr === "0") {
                //     callback = result + "http://test.agoodme.com/push/" + type + "callback.html";
                // } else {
                //     callback = result + "http://www.agoodme.com/push/" + type + "callback.html";
                // }
                console.log(callback, "callback");
                _this.setState({
                    AuthUrl: callback
                }, function () {
                    MeActionCreators.changeAuthDialog(true);
                    _this.setState({
                        isShowAuth: MeStore.getAuthDialogStatus()
                    });
                });
            }
        );
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
     * 隐藏授权框
     */
    clickHideAuthHandle: function () {
        var _this = this;
        MeActionCreators.changeAuthDialog(false); //触发隐藏授权框事件
        var dialogStatus = MeStore.getAuthDialogStatus()
        this.setState({
            isShowAuth: dialogStatus
        }, function () {
            _this.queryAuthList(); //渲染授权列表
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

module.exports = Authorized;