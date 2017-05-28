/**
 * @component PreViewMain
 * @description 作品详情页分享模块
 * @time 2015-10-23 16:00
 * @author Nick
 **/

var React = require('react');

var PreviewShare = React.createClass({

    render: function () {
        return (
            <div className={this.props.fullScreen ? "hide" : "share"}>
                <ul>
                    <li onClick={this.handleClick(this.getProducts()[2])}><span title="微博" className="wb"></span></li>
                    <li onClick={this.handleClick(this.getProducts()[6])}><span title="QQ" className="qq"></span></li>
                    <li onClick={this.handleClick(this.getProducts()[0])}><span title="QQ空间" className="qq-kj"></span></li>
                    <li onClick={this.handleClick(this.getProducts()[5])}><span title="百度贴吧" className="baidu"></span></li>
                </ul>
            </div>
        )
    },

    getDefaultOptions() {
        return {
            tsina : { //新浪
                url   : encodeURIComponent(window.location.href),
                title : document.title,
                appkey: 4001010101010
            },
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
            cqq   : { //qq客户端
                url    : encodeURIComponent(window.location.href),
                title  : document.title,
                desc   : " ",
                summary: " ",
                flash  : "",
                site   : "ME微杂志"
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
            kaixin: { //开心网
                url: encodeURIComponent(window.location.href), //分享网址
                content: ' ',   //(可选)需要分享的文字，当文字为空时，自动抓取分享网址的title
                starid: 0,      //(可选)公共主页id
                aid: 0,         //(可选)显示分享来源
                stime: ' ',
                style: 11,
                sig: ' '
            }
        };
    },

    splitters: ['=', '&', '?'],

    getProducts() {
        return ['tqzone', 'tqq', 'tsina', 'renren', 'kaixin', 'tieba', 'cqq'];
    },

    getProductURIs() {
        return {
            tsina : 'service.weibo.com/share/share.php',
            renren: 'widget.renren.com/dialog/share',
            tqq   : 'share.v.t.qq.com/index.php',
            tqzone: 'sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey',
            kaixin: 'www.kaixin001.com/rest/records.php',
            tieba : 'tieba.baidu.com/f/commit/share/openShareApi',
            cqq   : 'connect.qq.com/widget/shareqq/index.html'
        }
    },

    getProtocolPath() {
        return "http://";
    },
    //组装URL
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
    }

});

// define Preview component
module.exports = PreviewShare;