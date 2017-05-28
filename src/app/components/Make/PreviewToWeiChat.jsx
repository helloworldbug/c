/**
 * @component 分享预览
 * @description 微博、微信等分享预览
 * @time 2016/7/1 10:00
 * @author guYY
 **/
var React = require("react");
//导入css 及相关组件
require('../../../assets/css/makeThirdPreview.css');
//默认图片预加载 灰 白
var bg_white = require("../../../assets/images/make/preview/bg_white_old.png");
//封面图 默认
var effect_default = require("../../../assets/images/make/preview/effect_default.png");
//头像 默认
var head_default = require('../../../assets/images/user/defaultFace.png');
//制作预览-分享微信朋友圈
var PreviewWeixinFriends = React.createClass({
    getInitialState:function(){
        return {
            cover:this.props.cover || effect_default, //作品封面
            title:this.props.title, //作品标题
            bgUrl: bg_white, //背景图
            userHeaderUrl:this.props.userHeaderUrl || head_default,//用户头像
            authorName:this.props.authorName//用户昵称
        }
    },
    render:function(){
        return(
            <div>
                <div id="makePreviewThird" style={{background:"url("+this.state.bgUrl+") no-repeat"}}>
                    <div className="shareArticleTitle">微信朋友圈</div>
                    <div id="makePreviewThirdContainer" className="sharePreview_pt">
                        <div id="makeWeChat">
                            <div className="headImg" style={{background:"url("+this.state.userHeaderUrl+") no-repeat",backgroundSize:"cover"}}></div>
                            <div className="weChatRight">
                                <div className="desc_p">{this.state.authorName}</div>
                                <div className="data_info">
                                    <div className="effectImg" style={{background:"url("+this.state.cover+") no-repeat",backgroundSize:"cover"}}></div>
                                    <span className="title">{this.state.title}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
module.exports = PreviewWeixinFriends;