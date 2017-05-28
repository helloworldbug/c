/**
 * @component LabelStore
 * @description 作品标签 store
 * @time 2015-10-21 17:08
 * @author 曾文彬
 **/

'use strict';

// require core module
var NewMeStore = require('./NewMeStore');

// require dispatcher
var MeDispatcher = require('../dispatcher/MeDispatcher');

// store array
var labels = [];

// define store module
var LabelStore =Object.assign({}, NewMeStore, {
    
    /* 获取所有的作品数据 */
    getLabels() {
        return labels;
    }
});

MeDispatcher.register(_action => {

    if (_action.type === 'label') {
        labels = _action.data;
        LabelStore.emitChange();
    }

});

// export store module
module.exports = LabelStore;