/**
 * 分享预览-微信朋友圈
 */
var React = require("react");
//导入css
require('../../../../../assets/css/sharePreview.css');
var default01 = require("../../../../../assets/images/sharePreview/default01.png");
//分享到微信组件 -主体部份
var PreviewWechat = React.createClass({
    getInitialState : function () {
        //消息对象详情
        var currentNews = this.props.currentNews;
        var userHeaderUrl = this.props.userHeaderUrl;
        return {
            title        : currentNews.title,//标题
            thumb_media  : currentNews.thumb_media ? currentNews.thumb_media : default01, //封面 没有显示默认
            userHeaderUrl: userHeaderUrl //用户头像
        };
    },
    //点击指向消息正文
    clickNewsHandler: function (e) {
        //父组件使用当前消息索引
        this.props.msgclick(-1);
    },
    render          : function () {
        return (<div id="shareWeChat">
            <div className="headImg"
                 style={{background:"url("+this.state.userHeaderUrl+") no-repeat",backgroundSize:"cover"}}></div>
            <div className="weChatRight">
                <p className="desc_p">公众号名称</p>
                <div className="data_info">
                    <div className="effectImg" onClick={this.clickNewsHandler }
                         style={{background:"url("+this.state.thumb_media+") no-repeat",backgroundSize:"cover"}}></div>
                    <span className="title" onClick={this.clickNewsHandler }>{this.state.title}</span>
                </div>
            </div>
        </div>);
    }
});
module.exports = PreviewWechat;