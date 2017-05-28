// 文件名：mepc_event.js
//
// 创建人：曾文彬
// 创建日期：2015/11/4 17:32
// 描述： 自定义事件模块

'use strict';

var MePCPublicAPI = require('./mepc_public');

module.exports = {

    on: function (eventName, handle) {
        if (!eventName) return;

        this.events || (this.events = {});

        var handles = (this.events[eventName] || (this.events[eventName] = []));
        handles.push(handle);
    },

    off: function (eventName, handle) {
        if (!eventName || !this.events[eventName]) {
            this.events = {};
            return;
        }

        var retArr = [],
            currentEvents = this.events;

        if (!handle) {
            currentEvents[eventName] = retArr;
            return;
        }

        MePCPublicAPI.each(currentEvents[eventName], function (_index, _handle)       {
            _handle !== handle && retArr.push(_handle);
        });

        currentEvents[eventName] = retArr;
    },

    trigger: function (eventName) {
        var args = MePCPublicAPI.makeArray(arguments, 1),
            handles = this.events[eventName];

        handles && handles.length > 0 && MePCPublicAPI.each(handles, function (_handle, _index) {
            _handle.apply(null, args);
        });
    }
};
