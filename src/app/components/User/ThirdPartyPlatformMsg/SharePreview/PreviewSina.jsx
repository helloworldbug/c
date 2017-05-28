/**
 * 分享预览-新浪微博
 */
var React = require("react");
//导入css
require('../../../../../assets/css/sharePreview.css');
var default02 = require("../../../../../assets/images/sharePreview/default02.png");
var icon04 = require("../../../../../assets/images/sharePreview/icon04.png");
var icon03 = require("../../../../../assets/images/sharePreview/icon03.png");
//分享新浪组件 -主体部份
var PreviewSina = React.createClass({
    getInitialState : function () {
        //消息对象详情
        var currentNews = this.props.currentNews;
        var userHeaderUrl = this.props.userHeaderUrl;
        return {
            title        : currentNews.title,//标题
            digest       : currentNews.digest,//摘要  为空则不显示
            thumb_media  : currentNews.thumb_media ? currentNews.thumb_media : default02,//封面 没有显示默认
            userHeaderUrl: userHeaderUrl //头像
        };
    },
    //点击指向消息正文
    clickNewsHandler: function (e) {
        //父组件使用当前消息索引
        this.props.msgclick(-1);
    },
    render          : function () {
        return (<div id="shareSina">
            <img src={icon04} alt=""/>
            <div id="shareSina_con">
                <div className="headImg"
                     style={{background:"url("+this.state.userHeaderUrl+") no-repeat",backgroundSize:"cover"}}></div>
                <div className="p1">微博帐号</div>
                <div className="p2">1分钟 来自ME</div>
                <div className="p3" onClick={this.clickNewsHandler }>【{this.state.title}】{this.state.digest} <span
                    className="sp1">网页链接</span></div>
                <div className="effectImg" onClick={this.clickNewsHandler }
                     style={{background:"url("+this.state.thumb_media+") no-repeat",backgroundSize:"cover"}}></div>
            </div>
            <img src={icon03} alt=""/>
        </div>);
    }
});
module.exports = PreviewSina;