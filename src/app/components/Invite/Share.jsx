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
            <div className="fl invite-copy-link-icon"> 
                <a href="javascript:;" title="分享到QQ" onClick={this.handleClick(this.getProducts()[0])} className="qq"></a>
                <a href="javascript:;" title="分享到QQ空间" onClick={this.handleClick(this.getProducts()[1])} className="qzone"></a>
                <a href="javascript:;" title="分享到腾讯微博" onClick={this.handleClick(this.getProducts()[2])} className="qq-weibo"></a>
                <a href="javascript:;" title="分享到新浪微博" onClick={this.handleClick(this.getProducts()[3])} className="weibo"></a> 
            </div>
        );
    },

    getDefaultOptions() {
        return {
            cqq: { //qq客户端
                url    : encodeURIComponent(window.location.href),
                title  : document.title,
                desc   : " ",
                summary: " ",
                flash  : "",
                site   : "ME微杂志"
            },
            tqzone: { //QQ空间
                url    : encodeURIComponent(window.location.href),
                title  : document.title,
                summary: " ",
                appkey : 4001010101010
            },  
            tqq: { //腾讯微博
                c: 'share',
                a: 'index',
                url : encodeURIComponent(window.location.href),
                title: document.title,
                appkey: 4001010101010
            }, 
            tsina: { //新浪
                url   : encodeURIComponent(window.location.href),
                title : document.title,
                appkey: 4001010101010
            }
        };
    },

    splitters: ['=', '&', '?'],

    getProducts() {
        return ['cqq', 'tqzone', 'tqq', 'tsina'];
    },

    getProductURIs() {
        return {
            cqq   : 'connect.qq.com/widget/shareqq/index.html',
            tqzone: 'sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey',
            tqq   : 'share.v.t.qq.com/index.php',
            tsina : 'service.weibo.com/share/share.php'
        }
    },

    getProtocolPath() {
        return "http://";
    },
    //组装url
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
        return this.setShareComponentState('我在用ME创作H5，这里有海量的模板，操作简单方便，你也来试试吧，官网地址： http://agoodme.com/');
    }

});

// define Preview component
module.exports = Share;