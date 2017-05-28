/**
 * @component WorkStore
 * @description 作品 store
 * @time 2015-10-21 13:29
 * @author 曾文彬
 **/

'use strict';

// require core module
var NewMeStore = require('./NewMeStore');

// require dispatcher
var MeDispatcher = require('../dispatcher/MeDispatcher');

// store array
var works = [];

//在售模板
var onsales = [];

// rule map
var workRuleMap = {
    SHOW_CREATE_TEMPLATE: false
}

// define store module
var WorkStore = Object.assign({}, NewMeStore, {

    /* 获取所有的作品数据 */
    getWorks() {
        return works;
    },

    // 是否显示创建模板
    isShowCreateTemplate() {
        return workRuleMap.SHOW_CREATE_TEMPLATE;
    },

    /* 获取所有的在售模版 */
    getOnsales() {
        return onsales;
    }

});

MeDispatcher.register(_action => {

    if (_action.type === 'work') {
        works = _action.data;
        workRuleMap.SHOW_CREATE_TEMPLATE = _action.category;
        WorkStore.emitChange();
    }

    if(_action.type === "onsale") {
        onsales = _action.data;
        WorkStore.emitChange();
    }

});

// export store module
module.exports = WorkStore;