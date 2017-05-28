/**
 * @description 一键转档数据组件
 * @time 2016-11-7
 * @author fisnYu
 */
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/MeConstants');
var ActionTypes = Constants.ActionTypes;
var MeDispatcher = require('../dispatcher/MeDispatcher');
var MakeWebAPIUtils = require("../utils/MakeWebAPIUtils.js");
var error = require('../../assets/images/dataProcessing/error.png');
import _ from 'lodash';
//一键出版的数据
var DataProcessingStore = Object.assign({}, EventEmitter.prototype, {
    dataProcessingState:{
        dataProcessingItems: [
        ],
        closeHint: false,   //表示关闭打开的提示框
        hideAnnounce: false,   //公告栏开关  
        toggleDialog: false,   //错误消息提示框显示开关
        toggleDowload: false,   //下载类型选择框显示开关
        togglePreview: false,   //预览框显示开关
        dialogTitle : "",        //显示对话框的标题
        isHideDialogBtn : true,      //是否隐藏按钮
        cartData : null           //收费对象
    },
    //获取转档组件的状态
    getDataProcessingState: function () {
        return this.dataProcessingState;
    },
    //添加转档的条目
    addDataProcessingItemsHandler: function (items, isOld) {
        var concatLength = items.length;        //需要合并的文件个数
        if(concatLength < 1){
            return;
        }
        if(concatLength > 10 && !isOld){        //不是老数据反查的
            this.dataProcessingState.toggleDialog = true;   //显示错误消息框
            this.dataProcessingState.dialogTitle = '<span style="background:url(' + error + ') left center no-repeat;text-indent:24px;display:inline-block;">一次只能上传10个文件</span>';
            return;
        }
        // var currentLength = this.dataProcessingState.dataProcessingItems.length;    //已经添加的文件记录个数
        // var totalLength = currentLength + concatLength; //总的文件数
        // if(totalLength > 30){   //当前页面最多展示30个文件，再添加时，给出提示
        //     alert("文档数超出30条了");
        //     return;
        // }
        var newItems = [];
        if(!isOld){
            var filterType = "docdocx";    //只匹配.doc, .docx
            var typeDoc = "doc";
            var typeDocx = "docx";
            var filterDocSize = 500*1024*1024;     //DOC大小为500MB
            var filterDocxSize = 1024*1024*1024;    //docx大小为500MB
            var code = 1;   //0, 表示不允许转档，  1、表示允许转档
            var msg = "";   //错误消息
            var isDelete = false;   //是否能删除
            newItems = _.map(items, function(item, index){
                var obj = {};
                var name = item.name;
                var size = item.size;
                var sizeStr = "";
                if(size > (1024 * 1024 *1024)){
                    sizeStr = (Math.round(size * 100 / (1024 * 1024 * 1024)) / 100).toString() + 'GB';
                }else if (size > 1024 * 1024){
                    sizeStr = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                }else{
                    sizeStr = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
                }   
                var type = name.substring(name.lastIndexOf('.') + 1); //文件后缀
                type = type.toLowerCase();
                if(filterType.indexOf(type) < 0){   //格式不对的情况
                    code = 0;
                    msg = "格式不支持";
                    isDelete = true;
                }else{      //格式对的情况
                    if(typeDoc == type && size > filterDocSize){   //类型为doc 大小超出1024M的时候
                        code = 0;
                        msg = "文件大小超出500M（docx不超过1024M）";
                        isDelete = true;
                    }else if(typeDocx == type && size > filterDocxSize){   //类型为docx 大小超出1024M的时候
                        code = 0;
                        msg = "文件大小超出500M（docx不超过1024M）";
                        isDelete = true;
                    }else{
                        code = 1;
                        msg = "已上传5%...";
                        isDelete = false;
                    }
                }
                obj.size = sizeStr;
                obj.file = item;
                obj.name = name;
                obj.fileHash = "";      //转档完成把文件的hash保存
                obj.code = code;
                obj.msg = msg;
                obj.isDelete = isDelete;
                obj.remainingTime = 0;  //剩余时间， 为时间戳的形式,或者秒数
                obj.uploadProgress = 1;  //上传进度
                obj.convertProgress = 1;  //转档进度
                return obj;
            });
        }else{
            newItems = items;
        }
        this.dataProcessingState.dataProcessingItems = newItems.concat(this.dataProcessingState.dataProcessingItems);
    },
    //关闭转档提示说明窗口
    closeDataProcessingHintHandler: function () {
        this.dataProcessingState.closeHint = true;
    },
    //隐藏转档公告组件
    hideDataProcessingAnnounceHandler: function(){
        this.dataProcessingState.hideAnnounce = true;
    },
    //触发转档页面改变事件
    emitChange: function () {
        this.emit(ActionTypes.CHANGE_DATA_PROCESSING);
    },
    //监听转档页面改变事件
    addChangeListener: function (callback) {
        this.on(ActionTypes.CHANGE_DATA_PROCESSING, callback);
    },
    //移除转档页面改变事件
    removeChangeListener: function (callback) {
        this.removeListener(ActionTypes.CHANGE_DATA_PROCESSING, callback);
    },
    //更新转档的条目
    updateDataProcessingItemHandler: function (options) {
        //目前只是支持更新CODE 和 downloadUrl  fileHash
        var index = options.index;
        if(index > this.dataProcessingState.dataProcessingItems.length) return;
        const foundItem = this.dataProcessingState.dataProcessingItems[index];
        foundItem.code = options.code;
        foundItem.fileHash = options.fileHash;
        foundItem.msg = options.msg;
        //更改是否可删除，和倒计时时间
        foundItem.isDelete = options.isDelete;
        if(options.remainingTime){
            foundItem.remainingTime = options.remainingTime;
        }
        foundItem.uploadProgress = options.uploadProgress || 1;
        foundItem.convertProgress = options.convertProgress || 1;
    },

    //删除单条记录
    deleteDataProcessingItemHandler: function (index, userId) {
        var self = this;
        if(index > this.dataProcessingState.dataProcessingItems.length) return;
        var fondItem = this.dataProcessingState.dataProcessingItems[index];
        var hashcode = fondItem.fileHash;
        console.log(hashcode, index, 99966);
        //1、删除数据
        this.dataProcessingState.dataProcessingItems.splice(index, 1);
        //2、如果数据库里面有数据的删除数据库里面的数据
        if(hashcode){
            //做出提示
            this.toggleDataProcessingDialogHandler("占用的转档次数已恢复", true);
            MakeWebAPIUtils.getRESTfulData({
                url: "/v1/transfer/transferfile/"+hashcode+"/cancelsprompt",
                type: "PUT",
                success: (data) => {
                    console.log(data, "删除");
                },
                error: function (err) {
                    console.log(err, 95222);
                },
                userID: userId,   //"yuegy_yujin"       //用户ID
                urlType: true       //表示启用新的转档服务器
            });
        }

    },

    //显示或者隐藏对话框
    toggleDataProcessingDialogHandler: function(title, isHide, cartData){
        var toggleDialog = this.dataProcessingState.toggleDialog;
        this.dataProcessingState.toggleDialog = !toggleDialog;
        title = title || '<span style="background:url(' + error + ') left center no-repeat;text-indent:24px;display:inline-block;">一次只能上传10个文件</span>';
        this.dataProcessingState.dialogTitle = title;
        isHide = isHide == undefined ? true : isHide;
        this.dataProcessingState.isHideDialogBtn = isHide;
        if(cartData){
            this.dataProcessingState.cartData = cartData;
        }
    },

    //显示或者隐藏选择下载类型框
    toggleDataProcessingDownloadHandler: function(){
        var toggleDownload = this.dataProcessingState.toggleDownload;
        this.dataProcessingState.toggleDownload = !toggleDownload;
    },

    //显示或者隐藏预览
    toggleDataProcessingPreviewHandler: function(){
        var togglePreview = this.dataProcessingState.togglePreview;
        this.dataProcessingState.togglePreview = !togglePreview;
    }

});
//全局监听事件
DataProcessingStore.dispatchToken = MeDispatcher.register(function (action) {

    switch (action.type) {

        case ActionTypes.ADD_DATA_PROCESSING_ITEMS:      //增加转档条目
            DataProcessingStore.addDataProcessingItemsHandler(action.items, action.isOld);
            DataProcessingStore.emitChange();
            break;

        case ActionTypes.CLOSE_DATA_PROCESSING_HINT:    //关闭提示窗口
            DataProcessingStore.closeDataProcessingHintHandler();
            DataProcessingStore.emitChange();
            break;

        case ActionTypes.HIDE_DATA_PROCESSING_ANNOUNCE:     //隐藏公告栏
            DataProcessingStore.hideDataProcessingAnnounceHandler();
            DataProcessingStore.emitChange();
            break;

        case ActionTypes.UPDATE_DATA_PROCESSING_ITEM:      //更新转档条目
            DataProcessingStore.updateDataProcessingItemHandler(action.options);
            DataProcessingStore.emitChange();
            break;

        case ActionTypes.DELETE_DATA_PROCESSING_ITEM:      //删除单条记录
            DataProcessingStore.deleteDataProcessingItemHandler(action.index, action.userId);
            DataProcessingStore.emitChange();
            break;

        case ActionTypes.TOGGLE_DATA_PROCESSING_DIALOG:     //显示或者隐藏对话框
            DataProcessingStore.toggleDataProcessingDialogHandler(action.title, action.isHide, action.cartData);
            DataProcessingStore.emitChange();
            break;

        case ActionTypes.TOGGLE_DATA_PROCESSING_DOWNLOAD:     //显示或者隐藏选择下载类型框
            DataProcessingStore.toggleDataProcessingDownloadHandler();
            DataProcessingStore.emitChange();
            break;

        case ActionTypes.TOGGLE_DATA_PROCESSING_PREVIEW:     //显示或者隐藏预览
            DataProcessingStore.toggleDataProcessingPreviewHandler();
            DataProcessingStore.emitChange();
            break;
    }

});

module.exports = DataProcessingStore;