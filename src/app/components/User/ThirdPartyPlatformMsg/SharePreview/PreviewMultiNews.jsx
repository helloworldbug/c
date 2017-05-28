/**
 * 分享预览-多条消息列表
 * author guYY
 */
var React = require("react");
//导入css
require('../../../../../assets/css/sharePreview.css');
var default01 = require("../../../../../assets/images/sharePreview/default01.png");
var default02 = require("../../../../../assets/images/sharePreview/default02.png");
//多条消息列表组件 -主体部份
var PreviewMultiNews = React.createClass({
    getInitialState:function(){
        var firstNews = {};
        if(this.props.newsArr && this.props.newsArr.length > 0) {
            firstNews = this.props.newsArr[0];
        }
        return {
            firstCover:firstNews.thumb_media?firstNews.thumb_media:default02,//消息封面 没有显示默认
            firstTitle:firstNews.title //标题
        }
    },
    //点击消息 触发显示消息正文
    clickNewsItem:function(index,e){
        this.props.msgclick(index);
    },
    render:function(){
        var listHtml = [];
        var newsArr = this.props.newsArr || [];
        for(var i = 1; i < newsArr.length; i++){
            var temp = newsArr[i];
            var thumb_media = temp.thumb_media;
            if(!thumb_media || thumb_media == "") {
                thumb_media = default01;
            }
            listHtml.push(<div className="articleSecond">
                <div className="articleSecondTitle" onClick={this.clickNewsItem.bind(this,i)}>{temp.title}</div>
                <div className="articleSecondImg" style={{background:"url("+thumb_media+") no-repeat center" ,backgroundSize:"cover"}} onClick={this.clickNewsItem.bind(this,i)}></div>
            </div>);
        }
        return (<div id="shareArticleList">
                    <div className="effectImg" style={{background:"url("+this.state.firstCover+") no-repeat #ececec center",backgroundSize:"cover"}} onClick={this.clickNewsItem.bind(this,0)}>
                        <div className="title">{this.state.firstTitle}</div>
                    </div>
                    {listHtml}
                </div>);
    }
});
module.exports = PreviewMultiNews;