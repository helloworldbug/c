// 文件名：SuperLogicComponent.jsx
//
// 创建人：曾文彬
// 创建日期：2015/11/10 9:25
// 描述： 基本逻辑组件

'use strict';

var MePC = require('./MePC_Public'),
    MeEvent = require('./MePC_Event');

var SuperLogicComponent = MePC.inherit(MeEvent, {

    bindDataEvents: function (eventName, handleName) {
        if (!eventName || !handleName || !MePC.isType(this[handleName], 'function')) return;

        var eventNames = MePC.isType(eventName, 'array') || eventName.split(' ');

        MePC.each(eventNames, (function (_eventName) {
            this.on(_eventName, this[handleName]);
        }).bind(this));
    },

    setPageActions: function (actionKey, actionHandle) {
        if (!MePC.isType(this.pageActions, 'object')) this.pageActions = {};

        this.pageActions[actionKey] = actionHandle;
    },

    getPageActions: function (actionKey) {
        if (!MePC.isType(this.pageActions, 'object')) return;

        return this.pageActions[actionKey];
    }
});

module.exports = SuperLogicComponent;
