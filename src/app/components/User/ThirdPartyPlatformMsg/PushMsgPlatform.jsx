/**
 * @description 推送消息管理--消息推送平台样式样式
 * @time 2016-07-04
 * @author tony
 */

'use strict';

// require core module
var React = require('react');
var Base = require('../../../utils/Base');
//导入消息管理CSS样式
require('../../../../assets/css/weixinmanager.css');

/**
 * 消息关系已发布平台组件
 */
var PushMsgPlatform = React.createClass({
    /**
     * 初始化默认值
     * @returns {{}}
     */
    getInitialState : function () {
        return {}
    },

    render : function () {
        var data = this.props.platform;
        if(!data) return;
        //平台名称
        var platformType = data.name || "weixin";
        //平台Class
        var platformClass = "msgPlatform_" + platformType;
        //平台分享次数
        //var platformNum = "*" + (data.count || 0);
        var platformNum = ''
        return (
            <div className="msgPlatformItem">
                <div className={platformClass}></div>
                <div className="msgPlatformNum">{platformNum}</div>
            </div>
        )
    }
});

module.exports = PushMsgPlatform;