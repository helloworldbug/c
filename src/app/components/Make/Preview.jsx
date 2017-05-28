/**
 * @component Preview
 * @description 制作页预览
 * @time 2015-10-10 16:00
 * @author Nick
 **/

var React = require('react');
//作品预览
var ShowPreView = require('../Common/ShowPreView');
//微信朋友圈 预览
var PreviewToWeiChat = require('./PreviewToWeiChat');
//发送给朋友 预览
var PreviewToFriend = require('./PreviewToFriend');
//作品分享需要的变量
var tpl, tplData, musicData, pageUid, userNick;
//分享微信需要的变量
var cover,title,userHeaderUrl,brief;

module.exports = React.createClass({
  getInitialState:function(){
      return {
          component:{},
          curComponentType:"work" //默认预览作品组件
      }
  },
    showComponent:function(type){
      this.setState({curComponentType:type})
    },
    componentWillMount: function(){
        if( window.show_data == undefined ) return;
        //作品分享需要的变量
        tpl = window.show_data.tpl;
        tplData = window.show_data.tplData;
        musicData = window.show_data.musicData;
        pageUid = window.show_data.pageUid;
        userNick = window.show_data.userNick;

        tpl.groups = tplData.groups;

        document.body.style.minWidth = 'auto';
        console.log(tpl);
        //分享微信需要的变量
        userHeaderUrl = tpl.author_img;
        cover = tpl.tpl_share_img || "";
        title = (!tpl.name || tpl.name == 'noname') ? "作品名" : tpl.name;
        brief = (!tpl.brief || tpl.brief == "/") ? "我刚刚使用ME发布了个人作品，快来看看吧！" : tpl.brief;
        var component={};
        component["work"]=<ShowPreView userNick={userNick} tplData={tpl} musicData={musicData} pageUid={pageUid} />
        component["weixinFriends"]=<PreviewToWeiChat cover={cover} title={title} userHeaderUrl={userHeaderUrl} authorName={userNick}/>
        component["weixinFriend"]=<PreviewToFriend cover={cover} title={title} userHeaderUrl={userHeaderUrl} abstract={brief}/>

        this.setState({
            component:component
        })
    },

    render: function () {
        return (
            <div>
                {this.state.component[this.state.curComponentType]}
                <div id="makePreviewThird_ul">
                    <li className={this.state.curComponentType == "work"?"li_ck":""} onClick={this.showComponent.bind(this,"work")}>作品预览</li>
                    <li className={this.state.curComponentType == "weixinFriends"?"li_ck":""} onClick={this.showComponent.bind(this,"weixinFriends")}>分享微信朋友圈</li>
                    <li className={this.state.curComponentType == "weixinFriend"?"li_ck":""} onClick={this.showComponent.bind(this,"weixinFriend")}>发送给朋友</li>
                </div>
            </div>

        )
    }

});