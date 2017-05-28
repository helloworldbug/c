/**
 * @component ChildLabelStore
 * @description 作品二级标签 store
 * @time 2015-12-21 11:26
 * @author 曾文彬
 **/

'use strict';

// require core module
var NewMeStore = require('./NewMeStore');

// require dispatcher
var MeDispatcher = require('../dispatcher/MeDispatcher');

// store array
var childLabels = [];

// define store module
var ChildLabelStore = Object.assign({}, NewMeStore, {
    
    /* 获取所有标签数据 */
    getChildLabels() {
        return childLabels;
    },

    /* 清空所有标签数据 */
    stripChildLabels: function () {
    	childLabels = [];
    }
});

MeDispatcher.register(_action => {

    if (_action.type === 'childLabel') {
        childLabels = _action.data;
        ChildLabelStore.emitChange();
    }

});

// export store module
module.exports = ChildLabelStore;