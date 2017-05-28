/**
 * @component MeStore
 * @description MeStore, 保存整个程序相关状态
 * @time 2015-08-27 11:29
 * @author StarZou
 **/

var EventEmitter = require('events').EventEmitter;
var MeDispatcher = require('../dispatcher/MeDispatcher');
var MeConstants = require('../constants/MeConstants');
var CommonUtils = require('../utils/CommonUtils');
var TemplateUtils = require('../utils/TemplateUtils');
var ActionTypes = MeConstants.ActionTypes;
var CHANGE_EVENT = MeConstants.Events.CHANGE;
var  templatesExchange=[];

// 仓库
var store = {};
    store.showAutoDialog = false;

var MeStore = Object.assign({}, EventEmitter.prototype, {

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
     * 根据类型获取作品数据
     * @param type
     * @return {*}
     */
    getTemplatesByType: function (type) {
        return store[type] ? store[type].templates : null;
    },

    /**
     * 根据类型获取是否有更多作品
     * @param type
     * @return {*}
     */
    getHasNext: function (type) {
        return store[type] ? store[type].hasNext : null;
    },

    /**
     * 获取当前查询的作品类型
     * @return {*|templateType}
     */
    getCurrentTemplateType: function () {
        return store.templateType;
    },

    /**
     * 获取当前用户的收藏数据
     */
    getFavorites: function () {
        return store.favorites;
    },

    /**
     * 是否刷新
     */
    isRefresh: function () {
        return !!store.refresh;
    },

    /**
     * 获取授权列表
    */
    getAuthList: function() {
        return store.authList;
    },

    /**
     * 获取授权框状态
     */
    getAuthDialogStatus: function() {
        return store.showAutoDialog;
    },

    /**
     * 获取购物车弹出框状态
     */
    getCartDialogStatus: function() {
        return store.showCartDialog;
    },

    /**
     * 获取交易记录列表
     */
    getTradeList: function() {
        return store.tradeList;
    },

});

MeStore.dispatchToken = MeDispatcher.register(function (action) {
    switch (action.type) {
        case ActionTypes.QUERY_TEMPLATES_BY_CONDITION:
            var data = action.data; // 总返回对象
            var results = data.results;// 数据行
            var templateType = action.templateType; // 作品类型
            var record = store[templateType];// 记录
            var currentPage = action.queryOption.currentPage;// 当前页

            // 查询第一页, 清空数据
            if (record && currentPage != 1) {
                record.templates = record.templates.concat(results);
            } else {
                if(templateType=="myTemplate"){
                    // debugger;
                    results=templatesExchange.concat(results);
                    data.count+=templatesExchange.length;
                }
                record = store[templateType] = {
                    templates: results,
                    count    : data.count
                };
            }

            // 是否有下一页
            record.hasNext = CommonUtils.hasNext(data.count, currentPage);

            if (record.hasNext) {
                // 当前页递增
                TemplateUtils.changeCurrentPageQueryOptionByTemplateType(templateType);
            }

            store.templateType = templateType;// 记录作品类型
            store.refresh = false;// 置为不刷新

            MeStore.emitChange();
            break;

        case ActionTypes.QUERY_FAVORITES:
            store.favorites = action.data;
            MeStore.emitChange();
            break;

        case ActionTypes.ADD_FAVORITE_SUCCEED:
            store.favorites.push(action.favorite);
            MeStore.emitChange();
            break;

        case ActionTypes.DELETE_FAVORITE_SUCCEED:
            store.refresh = true;// 置为刷新
            MeStore.emitChange();
            break;

        case ActionTypes.DELETE_WORKS_SUCCEED:
            store.refresh = true;// 置为刷新
            //store.removeItem=true;
            MeStore.emitChange();
            break;
        case ActionTypes.MESSAGE_MANAGER:
            var data = action.data; // 总返回对象
            var results = data.groups;// 数据行
            var templateType = action.templateType; // 作品类型
            var record = store[templateType];// 记录
            var currentPage = action.queryOption.currentPage;// 当前页
            // 查询第一页, 清空数据
            if (record && currentPage != 1) {
                record.templates = record.templates.concat(results);
            } else {
                record = store[templateType] = {
                    templates: results,
                    count    : data.count
                };
            }
            // 是否有下一页
            record.hasNext = CommonUtils.hasNext(data.count, currentPage);
            if (record.hasNext) {
                // 当前页递增
                TemplateUtils.changeCurrentPageQueryOptionByTemplateType(templateType);
            }
            store.templateType = templateType;// 记录作品类型
            store.refresh = false;// 置为不刷新

            MeStore.emitChange();
            break;
        case ActionTypes.QUERY_AUTHlIST:
            store.authList = action.data;
            MeStore.emitChange();
            break;
        case ActionTypes.UPDATE_MESSAGE_STATUS_SUCCEED:
            store.refresh = true;// 置为刷新
            MeStore.emitChange();
            break;
        case ActionTypes.DELETE_MESSAGE_SUCCEED:
            store.refresh = true;// 置为刷新
            MeStore.emitChange();
            break;
        case ActionTypes.CHANGE_AUTH_DIALOG:
            store.showAutoDialog = action.data;
            MeStore.emitChange();
            break;
        case ActionTypes.QUERY_TRADE_LIST: //查询交易记录
            store.tradeList = action.data;
            MeStore.emitChange();
            break;
        default:
        // do nothing
    }

    //console.log('MeStore action: ', action);
    //console.log('MeStore store: ', store);

});

module.exports = MeStore;