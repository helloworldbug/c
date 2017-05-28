/**
 * 分享预览-消息正文
 */
var React = require("react");
//导入css
require('../../../../../assets/css/sharePreview.css');
var GlobalFunc = require('../../../Common/GlobalFunc');
//获取当前日期 格式:2016-05-30 -消息正文
var getCurrentTime = GlobalFunc.formatTimeToStr(new Date().getTime(),"yyyy-MM-dd");
//消息正文组件 -主体部份
var PreviewNewsText = React.createClass({
    getInitialState:function(){
        //消息对象详情
        var currentNews = this.props.currentNews;
        return {
            title:currentNews.title,//标题
            authorName:currentNews.author,//作者
            content:currentNews.content,//内容
            thumb_media:currentNews.thumb_media, //封面
            show_cover_pic:currentNews.show_cover_pic //是否正文中显示封面
        };
    },
    render:function(){
        return (<div id="shareArticleText">
                    <div className="title">{this.state.title}</div>
                    <div className="time"><span className="time_sp">{getCurrentTime}</span><span className="time_author">{this.state.authorName}</span><span className="desc_sp">公众号</span></div>
                    {this.state.thumb_media == "" || !this.state.show_cover_pic?null:<div className="effectImg" style={{background:"url("+this.state.thumb_media+") no-repeat",backgroundSize:"cover"}}></div>}
                    <div className="content" dangerouslySetInnerHTML={{__html:this.state.content}}></div>
                </div>);
    }
});
module.exports = PreviewNewsText;