/**
 * @component Invite
 * @description 邀请好友分享模块
 * @time 2015-12-17 15:10
 * @author 杨建
 **/

var React = require('react');

var Share = React.createClass({

    render: function () {
        return (
            <div className="designer-share-hover">
                <ul>
                    <li onClick={this.handleClick(this.getProducts()[0])}><span title="百度贴吧" className="tieba"></span></li>
                    <li onClick={this.handleClick(this.getProducts()[1])}><span title="QQ空间" className="zqone"></span></li>
                    <li onClick={this.handleClick(this.getProducts()[2])}><span title="QQ" className="qq"></span></li>
                    <li onClick={this.handleClick(this.getProducts()[3])}><span title="新浪微博" className="weibo"></span></li>
                </ul>
            </div>
        );
    },

    getDefaultOptions() {
        return {
            tieba : { //百度贴吧
                url    : encodeURIComponent(window.location.href),
                title  : document.title,
                desc   : " ",
                comment: " "
            },
            tqzone: { //QQ空间
                url    : encodeURIComponent(window.location.href),
                title  : document.title,
                summary: " ",
                appkey : 4001010101010
            },
            cqq: { //qq客户端
                url    : encodeURIComponent(window.location.href),
                title  : document.title,
                desc   : " ",
                summary: " ",
                flash  : "",
                site   : "H5微场景"
            }, 
            tsina: { //新浪
                url   : encodeURIComponent(window.location.href),
                title : document.title,
                appkey: 4001010101010
            },  
            tqq: { //腾讯微博
                c: 'share',
                a: 'index',
                url : encodeURIComponent(window.location.href),
                title: document.title,
                appkey: 4001010101010
            }
        };
    },

    splitters: ['=', '&', '?'],

    getProducts() {
        return ['tieba', 'tqzone', 'cqq', 'tqq', 'tsina'];
    },

    getProductURIs() {
        return {
            tieba : 'tieba.baidu.com/f/commit/share/openShareApi',
            cqq   : 'connect.qq.com/widget/shareqq/index.html',
            tqzone: 'sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey',
            tsina : 'service.weibo.com/share/share.php',
            tqq   : 'share.v.t.qq.com/index.php'
        }
    },

    getProtocolPath() {
        return "http://";
    },

    getProductURL(type, queryObject) {
        var defaultOptions = this.getDefaultOptions();

        var urls = this.getProductURIs(),
            protocol = this.getProtocolPath(),
            urlRoot = urls[type],
            queryString = this.getQueryString($.extend({}, defaultOptions[type], queryObject));

        return protocol + urlRoot + this.splitters[2] + queryString;
    },

    getQueryString(queryObject) {
        return Object.keys(queryObject).reduce((prevValue, currValue) => {
            return prevValue + currValue + this.splitters[0] + queryObject[currValue] + '&';
        }, '').slice(0, -1);
    },

    handleClick(type) { 
        return (_event => {
            this.openURL(this.getProductURL(type, this.state[type]));
        }).bind(this);
    },

    openURL(url) {
        window.open(url);
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.userNick !== this.props.userNick) {
            this.setState(this.setShareComponentState('Hi，我是'+ nextProps.userNick +'，我使用ME创作H5作品，这是我的个人空间，欢迎你前来围观点赞！'));
        }
    },

    buildShareComponentObject(title) {
        return {
            url        : encodeURIComponent(window.location.href),
            title      : title,
            content    : title,
            // pic        : pic,
            // pics       : pic,
            summary    : title,
            comment    : title,
            description: title
        }
    }, 

    setShareComponentState(title) {
        var shareComponentObject = this.buildShareComponentObject(title),
            shareComponentObjects = {};

        ['cqq', 'tqzone', 'tqq', 'tsina'].forEach(_name => {
            shareComponentObjects[_name] = shareComponentObject;
        });

        return shareComponentObjects;
    }, 

    getInitialState: function () {
        return {};
    }

});

// define Preview component
module.exports = Share;