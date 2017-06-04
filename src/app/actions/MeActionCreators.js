/**
 * @module MeActionCreators
 * @description ME 动作创建者
 * @time 2015-07-21 15:40
 * @author StarZou
 **/

var MeDispatcher = require('../dispatcher/MeDispatcher');
var MeConstants = require('../constants/MeConstants');
var MeAPI = require('../utils/MeAPI');
var ContextUtils = require('../utils/ContextUtils');
var GlobalFunc = require("../components/Common/GlobalFunc");

var ActionTypes = MeConstants.ActionTypes;

var MeActionCreators = {

    /**
     * 根据条件查询作品, 如果用户已登录, 则先查询收藏数据
     * @param queryOption
     * @param templateType
     * @return {Promise}
     */
    queryTemplatesByCondition: function (queryOption, templateType) {
        // 已登录, 未查询过收藏数据
        if (ContextUtils.isLogged() && !ContextUtils.state.loadedFavorites) {

            MeActionCreators.queryFavorites().then(function () {
                return MeActionCreators.originalQueryTemplatesByCondition(queryOption, templateType);
            });

        } else {
            return MeActionCreators.originalQueryTemplatesByCondition(queryOption, templateType);
        }

    },

    /**
     * 根据条件、作品类型, 查询作品
     * @param queryOption
     * @param templateType
     */
    originalQueryTemplatesByCondition: function (queryOption, templateType) {
        return MeAPI.queryTemplatesByCondition(queryOption).then(function (works) {
            MeDispatcher.dispatch({
                type        : ActionTypes.QUERY_TEMPLATES_BY_CONDITION,
                templateType: templateType,
                queryOption : queryOption,
                data        : works
            });

            return works;

        });
    },

    /**
     * 查询收藏
     */
    queryFavorites: function () {
        return MeAPI.queryFavorites().then(function (favorites) {
            // 置为已查询收藏数据
            ContextUtils.state.loadedFavorites = true;

            // 分发到 MeStore
            MeDispatcher.dispatch({
                type: ActionTypes.QUERY_FAVORITES,
                data: favorites
            });

            return favorites;

        });
    },

    /**
     * 添加收藏作品
     * @param tid
     */
    addFavorite: function (tid) {
        var promise = MeAPI.doFavorite(tid, 'add');

        promise.then(function (data) {

            MeDispatcher.dispatch({
                type    : ActionTypes.ADD_FAVORITE_SUCCEED,
                favorite: data.favorite
            });

            return data;

        }).catch(function (error) {
            console.log(error);
        });

        return promise;
    },

    /**
     * 删除收藏作品
     * @param tid
     * @return {Promise}
     */
    deleteFavorites: function (tid) {
        return MeAPI.doFavorite(tid, 'del').then(function (data) {

            // 重新查询收藏数据
            MeActionCreators.queryFavorites();

            MeDispatcher.dispatch({
                type    : ActionTypes.DELETE_FAVORITE_SUCCEED,
                favorite: data.favorite
            });

            return data;

        }).catch(function (error) {
            console.log(error);
        });
    },

    /**
     * 删除作品
     * @param template
     * @return {Promise}
     */
    deleteWorks: function (template) {
        return MeAPI.deleteWorks(template).then(function (data) {
            MeDispatcher.dispatch({
                type: ActionTypes.DELETE_WORKS_SUCCEED,
                data: data
            });

            return data;
        }).catch(function(err){
            console.log(err);
        });
    },

    /**
     * 假删作品
     * @param template
     * @return {Promise}
    */
    fakeDelete: function(template, type) {
        return MeAPI.fakeDelete(template, type).then(function (data) {
            MeDispatcher.dispatch({
                type: ActionTypes.DELETE_WORKS_SUCCEED,
                data: data
            });

            return data;
        }).catch(function(err){
            console.log(err);
        });
    },

    /**
     * 生成模板
     * @param template
     * @return {Promise}
     */
    createTemplate: function (template) {
        GlobalFunc.addSmallTips("正在生成模板，请稍后...", null, {cancel: true});
        return MeAPI.createTemplate(template).then(function (data) {
            GlobalFunc.addSmallTips("模板生成成功。", 2, {clickCancel: true, delBackGround: true});
            return data;
        }, function (error) {
            GlobalFunc.addSmallTips("模板生成失败，请稍后再试。", 2, {clickCancel: true, delBackGround: true});
            console.log("createTemplate error", error);
        });
    },

    /**
     * 查询授权
     * @param data
    */
    queryAuthList: function(data) {
        // 分发到 MeStore
        MeDispatcher.dispatch({
            type: ActionTypes.QUERY_AUTHlIST,
            data: data
        });
    },

    //add by tony
    /**
     * 根据标签查询消息 已发布 草稿箱 回收站
     * @param opt
     *        opt.whereCondition{
     *          author
     *          type
     *        }
     *        opt.currentPage 当前页
     */
    queryMessageManagerByTabName : function(opt, templateType){
        MeAPI.queryMessageManagerByTabName(opt, templateType, function(data){
            MeDispatcher.dispatch({
                type        : ActionTypes.MESSAGE_MANAGER,
                templateType: templateType,
                queryOption : opt,
                data        : data
            });
            return data;
        }, function(errMsg){

        });
    },

    /**
     * 消息移动到回收站 或者回复到草稿箱
     * @param option
     * option.userId 用户ID
     * option.messageId 消息ID
     * option.status
     */
    updateMessageStatus : function(option){
        MeAPI.updateMessageStatus(option, function(data){
            MeDispatcher.dispatch({
                type: ActionTypes.UPDATE_MESSAGE_STATUS_SUCCEED,
                data: data
            });
        }, function(err){

        });
    },

    /**
     * 删除推送消息
     * @param opt
     */
    deleteMessage : function(opt){
        MeAPI.deleteMessage(opt, function(data){
            MeDispatcher.dispatch({
                type: ActionTypes.DELETE_MESSAGE_SUCCEED,
                data: data
            });
        }, function(err){

        });
    },

    /**
     * 推送消息
     * @param opt
     */
    pushMessage : function(opt){
        MeAPI.pushMessage(opt, function(data){
            MeDispatcher.dispatch({
                type: ActionTypes.UPDATE_MESSAGE_STATUS_SUCCEED,
                data: data
            });
        }, function(err){

        });
    },

    /**
     * 恢复推送消息
     * @param opt
     */
    restoreMessage : function(opt){
        MeAPI.restoreMessage(opt, function(data){
            MeDispatcher.dispatch({
                type: ActionTypes.UPDATE_MESSAGE_STATUS_SUCCEED,
                data: data
            });
        }, function(err){

        });
    },

    /**
     * 改变授权框状态
     */
    changeAuthDialog: function(status) {
        MeDispatcher.dispatch({
            type: ActionTypes.CHANGE_AUTH_DIALOG,
            data: status
        });
    },

    /**
     * 查询交易记录
    */
    queryTradeList: function(data) {
        MeDispatcher.dispatch({
            type: ActionTypes.QUERY_TRADE_LIST,
            data: data
        });
    }
};

module.exports = MeActionCreators;