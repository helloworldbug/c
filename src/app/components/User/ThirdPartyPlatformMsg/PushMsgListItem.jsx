/**
 * @description 推送消息管理--消息List样式
 * @time 2016-07-04
 * @author zhao
 */

'use strict';

// require core module
var React = require('react');
var Base = require('../../../utils/Base');
/**导入消息管理CSS样式**/
require('../../../../assets/css/weixinmanager.css');
/**导入平台组件**/
var PlatformItem = require('./PushMsgPlatform');
/**按钮组件**/
var MsgBtns = require('./PushMsgItemBtns');

var GlobalFunc = require('../../Common/GlobalFunc');
/**导入TabIndex 静态变量**/
const TabIndex = require('../../../constants/MeConstants').UserTab;


/**
 * 消息管理List显示组件
 */
var PushMsgListItem = React.createClass({
    /**
     * 默认值
     * @returns {{}}
     */
    getInitialState: function () {
        return {}
    },

    render : function () {
        //传入的消息数据 msgObj
        var data = this.props.msgObj;
        if(!data) return null;

        var id = data.id;
        //名称
        var title = data.title || "";
        //封面图
        var coverPic = data.cover_pic || "";
        //创建时间
        var createDate = GlobalFunc.formatTimeToStr(data.created_at || Date.now(), "yyyy/MM/dd HH:mm");
        //发布时间
        var publishDate = "";
        if(this.props.tabIndex == TabIndex.WEIXINMGR){
            if(data.sended_at) publishDate = GlobalFunc.formatTimeToStr(data.sended_at, "yyyy/MM/dd HH:mm");
        }else{
            if(data.updated_at) publishDate = GlobalFunc.formatTimeToStr(data.updated_at, "yyyy/MM/dd HH:mm");
        }
        //已推送平台
        var platformsArr = data.plantfoms || [];
        //
        var platformObj ={};
        platformsArr.forEach(function(platform, index){
            var name = platform.name;
            if(platformObj[name]){
                platformObj[name] += 1;
            }else{
                platformObj[name] = 1;
            }
        });
        var platforms = [];
        for(var k in platformObj){
            var obj = {};
            obj.name = k;
            obj.count = platformObj[k]
            platforms.push(<PlatformItem key={k} platform={obj} />)
        }

        var imageStyle = {
            backgroundImage : "url('"+coverPic+"')",
            backgroundSize : "cover"
        };

        return (
            <div className='msgListItem'>
                <div className="msgListItemImage" style={imageStyle}></div>
                <span className="msgListItemTitle">{title}</span>
                <span className="msgListItemCreate">{createDate}</span>
                <span className="msgListItemPush">{publishDate}</span>
                {this.props.tabIndex == TabIndex.WEIXINMGR ? <div className="msgListItemPlatform">{platforms}</div> : null}
                <MsgBtns showPushMsgDialog={this.props.showPushMsgDialog} msgObj={data} viewType="2" tabIndex = {this.props.tabIndex} />
            </div>
        )
    }
});

module.exports = PushMsgListItem;