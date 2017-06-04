/**
 * @description 产品分享组件
 * @time 2015-10-13
 * @author 曾文彬
 */

'use strict';

// require core module
var React = require('react');

// require css
var ShareProductCSS = require('../../../assets/css/shareProduct');

// define module
var ShareProduct = React.createClass({

    getDefaultOptions() {
        return {
            tsina: { //新浪
                url : encodeURIComponent(window.location.href),
                title: document.title,
                appkey: 4001010101010
            },
            renren: { //人人网
                resourceUrl: encodeURIComponent(window.location.href),
                srcUrl: encodeURIComponent(window.location.href),
                title: document.title,
                appkey: 4001010101010,
                description: " "
            },
            tqq: { //腾讯微博
                c: 'share',
                a: 'index',
                url : encodeURIComponent(window.location.href),
                title: document.title,
                appkey: 4001010101010
            },
            tqzone: { //QQ空间
                url: encodeURIComponent(window.location.href),
                title: document.title,
                summary: " ",
                appkey: 4001010101010
            },
            kaixin: { //开心网
                url: encodeURIComponent(window.location.href), //分享网址
                content: ' ',   //(可选)需要分享的文字，当文字为空时，自动抓取分享网址的title 
                starid: 0,      //(可选)公共主页id
                aid: 0,         //(可选)显示分享来源
                stime: ' ',
                style: 11,
                sig: ' '
            },
            tieba: { //百度贴吧
                url: encodeURIComponent(window.location.href),
                title: document.title,
                desc: " ",
                comment: " "
            },
            cqq: { //qq客户端
                url: encodeURIComponent(window.location.href),
                title: document.title,
                desc: " ",
                summary: " ",
                flash: "",
                site: "H5微场景"
            }
        };
    },

    splitters: ['=', '&', '?'],

    getProducts() {
        return ['tqzone', 'tqq', 'tsina', 'renren', 'kaixin', 'tieba', 'cqq'];
    },

    getProductURIs() {
        return {
            tsina: 'service.weibo.com/share/share.php',
            renren: 'widget.renren.com/dialog/share',
            tqq: 'share.v.t.qq.com/index.php',
            tqzone: 'sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey',
            kaixin: 'www.kaixin001.com/rest/records.php',
            tieba: 'tieba.baidu.com/f/commit/share/openShareApi',
            cqq: 'connect.qq.com/widget/shareqq/index.html'
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

    render() {
        return (
            <ul className="share-navigation clearfix">
                <li className="fl">
                    <a className="share-cqq share-ico" href="javascript:;" onClick={this.handleClick(this.getProducts()[6])}>
                        <div className="share-box">
                            <em>QQ</em>
                            <span className="slide-up"></span>
                        </div>
                    </a>
                </li>
                <li className="fl">
                    <a className="share-tieba share-ico" href="javascript:;" onClick={this.handleClick(this.getProducts()[5])}>
                        <div className="share-box">
                            <em>百度贴吧</em>
                            <span className="slide-up"></span>
                        </div>
                    </a>
                </li>
                <li className="fl">
                    <a className="share-kaixin share-ico" href="javascript:;" onClick={this.handleClick(this.getProducts()[4])}>
                        <div className="share-box">
                            <em>开心网</em>
                            <span className="slide-up"></span>
                        </div>
                    </a>
                </li>
                <li className="fl">
                    <a className="share-renren share-ico" href="javascript:;" onClick={this.handleClick(this.getProducts()[3])}>
                        <div className="share-box">
                            <em>人人网</em>
                            <span className="slide-up"></span>
                        </div>
                    </a>
                </li>
                <li className="fl">
                    <a className="share-tsina share-ico" href="javascript:;" onClick={this.handleClick(this.getProducts()[2])}>
                        <div className="share-box">
                            <em>新浪微博</em>
                            <span className="slide-up"></span>
                        </div>
                    </a>
                </li>
                <li className="fl">
                    <a className="share-tqq share-ico" href="javascript:;" onClick={this.handleClick(this.getProducts()[1])}>
                        <div className="share-box">
                            <em>腾讯微博</em>
                            <span className="slide-up"></span>
                        </div>
                    </a>
                </li>
                <li className="fl">
                    <a className="share-tqzone share-ico" href="javascript:;" onClick={this.handleClick(this.getProducts()[0])}>
                        <div className="share-box">
                            <em>QQ空间</em>
                            <span className="slide-up"></span>
                        </div>
                    </a>
                </li>  
                <li className="fl" onClick={this.props.showWeixinCallback}>
                    <a className="share-weixin share-ico" href="javascript:;">
                        <div className="share-box">
                            <em>微信</em>
                            <span className="slide-up"></span>
                        </div>
                    </a>
                </li>
            </ul>
        );
    }

});

// export module
module.exports = ShareProduct;