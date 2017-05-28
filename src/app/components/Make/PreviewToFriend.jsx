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
//制作预览-发送全朋友
var PreviewToFriend = React.createClass({
    getInitialState:function(){
        return {
            cover:this.props.cover|| effect_default, //作品封面
            title:this.props.title, //作品标题
            bgUrl: bg_white,                      //背景图
            userHeaderUrl:this.props.userHeaderUrl||head_default,
            abstract:this.props.abstract || this.props.title  //没有描述时显示标题
        }
    },
    render:function(){
        return(
            <div>
                <div id="makePreviewThird" style={{background:"url("+this.state.bgUrl+") no-repeat"}}>
                    <div className="shareArticleTitle">发送给朋友</div>
                    <div id="makePreviewThirdContainer" className="sharePreview_pt">
                        <div id="makeFriend">
                            <div className="headImg" style={{background:"url("+this.state.userHeaderUrl+") no-repeat",backgroundSize:"cover"}}></div>
                            <div className="friendInfo">
                                <div className="title">{this.state.title}</div>
                                <div className="effectImg"style={{background:"url("+this.state.cover+") no-repeat",backgroundSize:"cover"}}></div>
                                <div className="brief" dangerouslySetInnerHTML={{__html:this.state.abstract}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
});
module.exports = PreviewToFriend;