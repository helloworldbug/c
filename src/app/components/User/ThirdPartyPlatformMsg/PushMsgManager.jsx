/**
 * @description 推送消息管理
 * @time 2016-07-01
 * @author tony
 */

'use strict';

//require core module
var React = require('react');
import {Link} from 'react-router'
var Base = require('../../../utils/Base');
//导入消息管理CSS样式
require('../../../../assets/css/weixinmanager.css');
//导入视图显示组件
var ViewItem = require('./PushMsgViewItem');
//导入列表显示组件
var ListItem = require('./PushMsgListItem');
//导入TabIndex静态数据
const TabIndex = require('../../../constants/MeConstants').UserTab;

var GroupPushDialog = require("./GroupPushDialog");

/**
 * 消息管理界面
 */
var PushMsgManager = React.createClass({
    /**
     * 设置默认值
     *
     */
    getInitialState : function(){
        return {};
    },

    /**
     * 改变消息查看标签
     * @param e
     */
    onChangeTabHandler : function(e){
        var target = e.target;
        var dataId = target.getAttribute("data-id");
        if(!dataId) return;
        //跳转到对应标签
        Base.linkToPath(`/user/tab/${dataId}`);
    },

    /**
     * 改变视图查看类型
     * @param e
     */
    onChangeViewHandler : function(e){
        var target = e.target;
        var type = target.getAttribute("data-type");
        if(!type) return;
        //刷新视图
        this.props.changeViewFun(type);
    },

    /**
     * 新建图文消息事件
     * @param e
     */
    onNewMessageHandler : function(e){
        //跳转到对应标签
        Base.linkToPath(`/user/tab/12`);
    },

    /**
     *
     * @returns {XML}
     */
    showPushMsgDialog : function(msgObj){
        this.state.pushMsgId = msgObj.id;
        this.state.pushMsgPlatforms = msgObj.plantfoms || [];
        this.changeGroupPushStatus(true);
    },

    hidePushDialog : function(){
        this.state.pushMsgId = null;
        this.state.pushMsgPlatforms = [];
        this.changeGroupPushStatus(false);
    },

    changeGroupPushStatus : function(type){
        this.setState({isShowGroupPush:type});
    },


    render : function () {
        var self = this;
        var tabIndex = self.props.tabIndex ? self.props.tabIndex : TabIndex.WEIXINMGR;
        //获取当前的显示类型
        var viewStatus = self.props.viewStatus || 1;
        //是否隐藏列表标题栏
        var isHideMenu = viewStatus == 1 ? {display: "none"} : {};
        var templateMessageComponents = "";
        var list = self.props.msgData || [];

        if(list.length > 0){
            templateMessageComponents = list.map(function(msg, index){
                if(viewStatus == 1){
                    //返回视图显示组件
                    return <ViewItem key={index} showPushMsgDialog={self.showPushMsgDialog} msgObj={msg} tabIndex={tabIndex} />
                }else if(viewStatus == 2){
               1     //返回列表显示组件
                    return <ListItem key={index} showPushMsgDialog={self.showPushMsgDialog} msgObj={msg} tabIndex={tabIndex} />
                }
            });
        }else{
            var noWork = "";
            if(this.props.tabIndex == 11 || this.props.tabIndex == 13) {
                noWork = <div className="wxNoWorks">没有消息图文作品，去<Link to="/user/tab/12">创建</Link></div>;
            }else{
                noWork = <div className="wxNoWorks">该回收站为空</div>;
            }
            templateMessageComponents = noWork;
            isHideMenu = {display: "none"};
        }

        return (
            <div className="weixinManager">
                <div className="weixinManagerTitleDiv">
                    <div className="weixinManagerTitle">推送消息管理</div>
                    <span className="btnNewMessage" onClick={this.onNewMessageHandler}>新建图文消息</span>
                </div>
                <div className="weixinManagerOption">
                    <span data-id={TabIndex.WEIXINMGR} onClick={this.onChangeTabHandler} className={tabIndex==TabIndex.WEIXINMGR?"selected":""}>已推送</span>
                    <span data-id={TabIndex.WEIXINMGRDRAFT} onClick={this.onChangeTabHandler} className={tabIndex==TabIndex.WEIXINMGRDRAFT?"selected":""}>草稿箱</span>
                    <span data-id={TabIndex.WEIXINMGRREC} onClick={this.onChangeTabHandler} className={tabIndex==TabIndex.WEIXINMGRREC?"selected":""}>回收站</span>
                </div>
                <div className="weixinViewOption">
                    <span data-type="1" onClick={this.onChangeViewHandler} title="缩略图" className={viewStatus==1?"selected weixinBtnView":"weixinBtnView"}></span>
                    <span data-type="2" onClick={this.onChangeViewHandler} title="列表" className={viewStatus==2?"selected weixinBtnList":"weixinBtnList"}></span>
                </div>

                <div className="weixinMsgContent">
                    <div className="weixinListMenu" style={isHideMenu}>
                        <span className="weixinMenuName">名称</span>
                        <span className="weixinMenuCreate">创建时间</span>
                        <span className="weixinMenuPushTime">{tabIndex == TabIndex.WEIXINMGR ? "推送时间" : tabIndex == TabIndex.WEIXINMGRDRAFT ? "修改时间" : "删除时间"}</span>
                        {tabIndex == TabIndex.WEIXINMGR?<span className="weixinMenuPlatform">已推送平台</span>: null}
                    </div>
                    <div className="weixinMsgList">
                        {templateMessageComponents}
                        <div style={{"clear":"both"}}></div>
                    </div>
                </div>

                {this.state.isShowGroupPush ?  <GroupPushDialog msgGroupId={this.state.pushMsgId} platforms={this.state.pushMsgPlatforms} changeGroupPushState={this.hidePushDialog} />  : null }
            </div>
        )
    }
});

module.exports = PushMsgManager;