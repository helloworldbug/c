/**
 * 分享预览-发送给朋友
 */
var React = require("react");
//导入css
require('../../../../../assets/css/sharePreview.css');
var default01 = require("../../../../../assets/images/sharePreview/default01.png");
//发送组朋友组件 -主体部份
var PreviewFriend = React.createClass({
    getInitialState:function(){
        //消息对象详情
        var currentNews = this.props.currentNews;
        //用户头像
        var userHeaderUrl = this.props.userHeaderUrl;
        return {
            title:currentNews.title,                                                //标题
            thumb_media:currentNews.thumb_media?currentNews.thumb_media:default01,                  //封面，没有显示默认图片
            digest:currentNews.digest?currentNews.digest:"你还没有填写摘要",//消息摘要
            content:currentNews.content,                                            //消息内容
            userHeaderUrl:userHeaderUrl                                             //用户头像
        };
    },
    //点击指向消息正文
    clickNewsHandler:function(e){
        //父组件使用当前消息索引
        this.props.msgclick(-1);
    },
    render:function(){
        return (<div id="shareFriend">
            <div className="headImg" style={{background:"url("+this.state.userHeaderUrl+") no-repeat",backgroundSize:"cover"}}></div>
            <div className="friendInfo">
                <div className="title" onClick={this.clickNewsHandler }>{this.state.title}</div>
                <div className="effectImg" onClick={this.clickNewsHandler } style={{background:"url("+this.state.thumb_media+") no-repeat",backgroundSize:"cover"}}></div>
                <div className="brief" onClick={this.clickNewsHandler } dangerouslySetInnerHTML={{__html:this.state.digest}}></div>
            </div>
        </div>);
    }
});
module.exports = PreviewFriend;