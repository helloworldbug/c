/**
 * @component MakeStore
 * @description 制作页面公共Store
 * @time 2015-09-11 15:46
 * @author Nick
 **/

var EventEmitter = require('events').EventEmitter;
var $ = require("jquery");
var Constants = require('../constants/MeConstants');
var ActionTypes = Constants.ActionTypes;
var MeDispatcher = require('../dispatcher/MeDispatcher');
var PageStore = require('../stores/PageStore');
var WorkDataUtil = require('../utils/WorkDataUtil');

var showModule;
var showAddTips;
var imageArr;

function init() {
    showModule = false;
    showAddTips = false;
}

var MakeStore = Object.assign({}, EventEmitter.prototype, {

    getModuleState: function () {
        return showModule;
    },

    getAddTips: function () {
        return showAddTips;
    },

    setCreateByPic: function (files) {
        imageArr = files;
    },

    getImageArr: function(){
        return imageArr;
    }

});
MakeStore.dispatchToken = MeDispatcher.register(function (action) {

    switch (action.type) {

        case ActionTypes.WORK_INIT:
            init();
            break;

        case ActionTypes.CREATE_BLANK_TEMPLATE:
            showModule = true;
            var GlobalFunc = require('../components/Common/GlobalFunc');
            var hadUsedAddPage = GlobalFunc.getUserExtra("userAddPage");
            if (!hadUsedAddPage) showAddTips = true;
            break;

        case ActionTypes.CREATE_BY_PIC:
            MakeStore.setCreateByPic(action.files);
            break;
    }

});

module.exports = MakeStore;