/**
 * @component ComponentStore
 * @description 保存公用组件相关状态
 * @time 2015-09-30 11:01
 * @author StarZou
 **/

'use strict';

var EventEmitter = require('events').EventEmitter;
var MeDispatcher = require('../dispatcher/MeDispatcher');
var MeConstants = require('../constants/MeConstants');
var ActionTypes = MeConstants.ActionTypes;
var CHANGE_EVENT = MeConstants.Events.CHANGE;

// 仓库
var store = {};

var ComponentStore = Object.assign({}, EventEmitter.prototype, {

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    /**
     * 是否显示模板预览组件
     * @return {boolean}
     */
    isShowTemplatePreview: function () {
        return store.showTemplatePreview;
    },

    /**
     * 获取当前选中模板作品
     * @return {*|null}
     */
    getSelectedTemplate: function () {
        return store.selectedTemplate;
    }

});

ComponentStore.dispatchToken = MeDispatcher.register(function (action) {

    switch (action.type) {

        case ActionTypes.SHOW_TEMPLATE_PREVIEW:

            store.showTemplatePreview = true;
            store.selectedTemplate = action.data;

            ComponentStore.emitChange();
            break;

        case ActionTypes.HIDE_TEMPLATE_PREVIEW:

            store.showTemplatePreview = false;
            store.selectedTemplate = null;

            ComponentStore.emitChange();
            break;

        default:
        // do nothing
    }

});

module.exports = ComponentStore;