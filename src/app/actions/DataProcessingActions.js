/**
 * @description 一键转档执行的动作组件
 * @time 2016-11-7
 * @author fisnYu
 */

var MeDispatcher = require('../dispatcher/MeDispatcher');
var MeConstants = require('../constants/MeConstants');
var ActionTypes = MeConstants.ActionTypes;

//一键转档执行的动作组件
var DataProcessingActions = {
    addDataProcessingItems: function (items, isOld) {  //增加转档条目
        MeDispatcher.dispatch({
            type: ActionTypes.ADD_DATA_PROCESSING_ITEMS,
            items: items,
            isOld: isOld
        });
    },
    deleteDataProcessingItem: function(index, userId){   //删除单条记录
        MeDispatcher.dispatch({
            type: ActionTypes.DELETE_DATA_PROCESSING_ITEM,
            index: index,
            userId: userId
        });
    },
    closeDataProcessingHint: function () {      //关闭转档提示说明窗口
        MeDispatcher.dispatch({
            type: ActionTypes.CLOSE_DATA_PROCESSING_HINT
        });
    },
    hideDataProcessingAnnounce: function () {   //隐藏转档公告组件
        MeDispatcher.dispatch({
            type: ActionTypes.HIDE_DATA_PROCESSING_ANNOUNCE
        });
    },
    updateDataProcessingItem: function (options) {  //更新转档条目
        MeDispatcher.dispatch({
            type: ActionTypes.UPDATE_DATA_PROCESSING_ITEM,
            options: options
        });
    },

    toggleDataProcessingDialog: function (title, isHide, cartData) {   //显示或者隐藏对话框
        MeDispatcher.dispatch({
            type: ActionTypes.TOGGLE_DATA_PROCESSING_DIALOG,
            title : title,
            isHide : isHide,
            cartData : cartData
        });
    },

    toggleDataProcessingDownload: function () {   //显示或者隐藏选择下载类型框
        MeDispatcher.dispatch({
            type: ActionTypes.TOGGLE_DATA_PROCESSING_DOWNLOAD
        });
    },

    toggleDataProcessingPreview: function () {   //显示或者隐藏预览
        MeDispatcher.dispatch({
            type: ActionTypes.TOGGLE_DATA_PROCESSING_PREVIEW
        });
    }
};


module.exports = DataProcessingActions;