/**
 * @description 域名绑定
 * @time 2016-05-26
 * @author lifeng
 */

'use strict';

// require core module
var React = require('react');
var Router = require('react-router'), Link = Router.Link;
var Base = require("../../../utils/Base");
var ContextUtils = require('../../../utils/ContextUtils');
var MakeWebAPIUtils = require('../../../utils/MakeWebAPIUtils');
var MeActionCreators = require('../../../actions/MeActionCreators');
var MeStore = require('../../../stores/MeStore');
const TabIndex = require('../../../constants/MeConstants').UserTab;
//公众号默认头像
var defaultFace = require('../../../../assets/images/user/defaultFace.jpg');

var WeixinMsgEntrance = React.createClass({

    /**
     * 初始化状态
     */
    getInitialState: function () {
        return {}
    },

    stopPropagation: function (e) {
        e.stopPropagation()
    },
    render         : function () {
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

                return <li className={invalid} key={index}><i><img src={item.head_img || defaultFace}/></i>{item.nick_name}</li>
            });
        } else {
            weixinDomList = <p><Link to="/user/tab/9"> (还未授权微信公众号，请点击进行授权)</Link></p>;
        }

        // 新浪微博jsx列表
        var weiboDomList;

        if (weiboAuthList.length > 0) {//判断是否有信息
            weiboDomList = weiboAuthList.map(function (item,index) {
                var invalid = '';
                if (!item.actived) { //判断是否失效
                    invalid = "invalid"; //失效则加上失效样式
                }

                return <li className={invalid} key={index}><i><img src={item.head_img || defaultFace}/></i>{item.nick_name}</li>
            });
        } else {
            weiboDomList = <p><Link to="/user/tab/9"> (还未授权新浪微博，请点击进行授权)</Link></p>;
        }
        return (
            <div id="weixin-msg-entrance" className="align-to-left">
                <h1 className="title">一键推送图文消息</h1>
                <div className="add">
                    <div className="add-btn" title="添加一篇图文"
                         onClick={Base.linkToPath.bind(undefined,`/user/tab/${TabIndex.WEIXINEDIT}`)}></div>
                    <div className="add-note">
                        为保障用户体验，ME自媒体平台严禁恶意营销以及诱导分享朋友圈；严禁发布色情低俗、暴力血腥、政治谣言等各类违反法律法规及相关政策规定的信息。一旦发现，ME将严厉打击和处理，详情查看相关<Link
                        to="/helper?type=ME审核规范" className="link" onClick={this.stopPropagation}>审核规则</Link>。
                    </div>
                </div>
                <div className="account">
                    <h2 className="title">已经授权账号</h2>
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
                </div>
            </div>
        );
    },

    componentDidMount: function () {
        this.queryAuthList(); //渲染授权列表
        MeStore.addChangeListener(this.onChangeAuthList); //添加监听store授权列表
    },

    componentWillUnmount: function () {
        MeStore.removeChangeListener(this.onChangeAuthList);
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

module.exports = WeixinMsgEntrance;