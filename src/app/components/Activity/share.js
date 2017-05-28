
// 描述：    分享按钮和操作
var React = require('react');

var Share = React.createClass({
	render : function () {
		return (
			    	<div className="designer-share-hover actDetail">
		                <ul style={this.props.isShow == false ? {display : "none",overflow : "hidden"} : {overflow : "hidden"}}>
		                    <li onClick={this.handleClick(this.getProducts()[0])}><span title="百度贴吧" className="tieba" style={{cursor : "pointer"}}></span></li>
		                    <li onClick={this.handleClick(this.getProducts()[2])}><span title="QQ空间" className="zqone" style={{cursor : "pointer"}}></span></li>
		                    <li onClick={this.handleClick(this.getProducts()[1])}><span title="QQ" className="qq" style={{cursor : "pointer"}}></span></li>
		                    <li onClick={this.handleClick(this.getProducts()[4])}><span title="新浪微博" className="weibo" style={{cursor : "pointer"}}></span></li>
		                </ul>
		            </div>
			)
	},
	getProducts() {
        return ['tieba', 'cqq', 'tqzone', 'tqq', 'tsina'];
    },
    handleClick(type) { 
        return (_event => {
            this.openURL(this.getProductURL(type));
        }).bind(this);
    },
    getProductURL(type, queryObject) {
        var defaultOptions = this.getDefaultOptions();

        var urls = this.getProductURIs(),
            protocol = this.getProtocolPath(),
            urlRoot = urls[type],
            queryString = this.getQueryString(this.buildShareComponentObject('【ME活动分享】'+this.props.title));
            console.log(queryString);
        return protocol + urlRoot + this.splitters[2] + queryString;
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
                site   : "ME微杂志"
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
    getQueryString(queryObject) {
    	console.log(queryObject);
        return Object.keys(queryObject).reduce((prevValue, currValue) => {
            return prevValue + currValue + this.splitters[0] + queryObject[currValue] + '&';
        }, '').slice(0, -1);
    },
    splitters: ['=', '&', '?'],
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
    componentDidMount : function () {
		
    }
});

module.exports = Share;