/**
 * 分享预览-单条消息列表
 * author guYY
 */
var React = require("react");
//导入css
require('../../../../../assets/css/sharePreview.css');
var GlobalFunc = require('../../../Common/GlobalFunc');
//获取当前日期 格式:05月30日
var getCurrentTime = GlobalFunc.formatTimeToStr(new Date().getTime(),"MM月dd日");
//单条消息组件 -主体部份
var PreviewSingleNews = React.createClass({
    getInitialState:function(){
        var firstNews = this.props.currentNews;
        return {
            content:firstNews.digest?firstNews.digest:firstNews.auto_digest,//摘要 没有则显示内容
            thumb_media:firstNews.thumb_media, //消息封面
            title:firstNews.title  //标题
        }
    },
    //点击指向消息正文
    clickNewsHandler:function(e){
        this.props.msgclick(0);
    },
    render:function(){
        return (<div id="shareArticleOne">
            <div className="title" onClick={this.clickNewsHandler }>{this.state.title}</div>
            <div className="timeStr">{getCurrentTime}</div>
            {this.state.thumb_media == ""?null:<p className="effectImg" onClick={this.clickNewsHandler } style={{background:"url("+this.state.thumb_media+") no-repeat",backgroundSize:"cover"}}></p>}
            <div className="desc" onClick={this.clickNewsHandler }>{this.state.content}</div>
            <div className="footer" onClick={this.clickNewsHandler }>阅读全文</div>
        </div>);
    }
});
module.exports = PreviewSingleNews;