/**
 * @description 推送消息管理--推送消息按钮组件
 * @time 2016-07-04
 * @author zhao
 */

'use strict';

// require core module
var React = require('react');
var Base = require('../../../utils/Base');
//导入消息管理CSS样式
require('../../../../assets/css/weixinmanager.css');
var MeActionCreators = require('../../../actions/MeActionCreators');
var ContextUtils = require('../../../utils/ContextUtils');
var Dialog = require('../../Common/Dialog');
/**导入TabIndex 静态变量**/
const TabIndex = require('../../../constants/MeConstants').UserTab;

/**
 * 消息消息 按钮组件
 */
var PushMsgItemBtns = React.createClass({
    /**
     * 初始化默认值
     * @returns {{}}
     */
    getInitialState : function () {
        return {}
    },

    /**
     * 分享发布事件
     */
    onShareHandler : function(e){
        e.stopPropagation();
        e.preventDefault();
        //此处写跳转链接
        this.props.showPushMsgDialog(this.props.msgObj);
    },

    /**
     * 编辑事件
     * @param e
     */
    onEditHandler : function(e){
        e.stopPropagation();
        e.preventDefault();
        //跳转到编辑页面
        var msgStatus;
        if(this.props.tabIndex == TabIndex.WEIXINMGR){
            msgStatus = 3;
        }else{
            msgStatus = 1;
        }
        Base.linkToPath(`/user/tab/${TabIndex.WEIXINEDIT}&msgid=${this._msgId}&msgstatus=${msgStatus}`);
    },

    /**
     * 恢复按钮事件
     * @param e
     */
    onRestoreHandler : function(e){
        e.stopPropagation();
        e.preventDefault();
        var userId = ContextUtils.getCurrentUser().id;
        if(!userId) return;
        var opt = {};
        opt.messageId = this.props.msgObj.id;
        opt.userId = userId;
        MeActionCreators.restoreMessage(opt);
    },

    /**
     * 删除事件
     * @param e
     */
    onDeleteHandler : function(e){
        e.stopPropagation();
        e.preventDefault();
        var userId = ContextUtils.getCurrentUser().id;
        if(!userId) return;

        var opt = {};
        opt.messageId = this.props.msgObj.id;
        opt.userId = userId;

        var title = "";
        switch(this.props.tabIndex){
            case TabIndex.WEIXINMGR:
                title = "确定要把此作品放入回收站吗？";
                break;
            case TabIndex.WEIXINMGRDRAFT:
                title = "确定要把此草稿放入回收站吗？";
                break;
            case TabIndex.WEIXINMGRREC:
                title = "确定要永久性删除此作品吗？";
                break;
        }
        if(title){
            this.setState({
                dialogTitle: title,
                showDialog : true,
                sureFn     : this.deleteMessage.bind(this, opt)
            });
        }
    },

    deleteMessage : function(opt){
        if(this.props.tabIndex == TabIndex.WEIXINMGRREC){
            MeActionCreators.deleteMessage(opt);
        }else{
            opt.status = "4";
            MeActionCreators.updateMessageStatus(opt);
        }
        this.hideDialog();
    },

    /**
     * 关闭dialog
     */
    hideDialog: function () {
        this.setState({
            showDialog: false
        });
    },

    render : function () {
        this._msgId = this.props.msgObj.id;
        if(!this._msgId) return;
        //按钮显示状态
        var isShowShare = false, isShowEdit = false, isShowRestore = false;
        switch (this.props.tabIndex){
            //已发送标签
            case TabIndex.WEIXINMGR:
                isShowShare = true;
                isShowEdit = true;
                break;
            //草稿箱标签
            case TabIndex.WEIXINMGRDRAFT:
                isShowEdit = true;
                break;
            //回收站便签
            case TabIndex.WEIXINMGRREC:
                isShowRestore = true;
                break;
        }
        //class名称
        var viewTypeClassName = this.props.viewType == 1 ? "View" : "List";

        return (
            <div className={"msg"+viewTypeClassName+"Item-btns"}>

                <div className={"msg"+viewTypeClassName+"Item-btnShare"} title="推送消息" onClick = {this.onShareHandler} style={{display : isShowShare ? "inline-block" : "none"}}></div>
                <div className={"msg"+viewTypeClassName+"Item-btnEdit"} title="编辑消息" onClick = {this.onEditHandler} style={{display : isShowEdit ? "inline-block" : "none"}}></div>
                <div className={"msg"+viewTypeClassName+"Item-btnRestore"} title="还原消息" onClick = {this.onRestoreHandler} style={{display : isShowRestore ? "inline-block" : "none"}}></div>
                <div className={"msg"+viewTypeClassName+"Item-btnDel"} title="删除消息" onClick = {this.onDeleteHandler}></div>
                <Dialog title={this.state.dialogTitle} appearanceState={this.state.showDialog}
                        sureFn={this.state.sureFn} cancelFn={this.hideDialog} />
            </div>
        )
    }
});

module.exports = PushMsgItemBtns;