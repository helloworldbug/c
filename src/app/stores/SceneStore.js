/**
 * @component SceneStore
 * @description 场景 store
 * @time 2015-10-22 11:38
 * @author 曾文彬
 **/

'use strict';

// require core module
var NewMeStore = require('./NewMeStore');

// require dispatcher
var MeDispatcher = require('../dispatcher/MeDispatcher');

// store array
var scenes = [];

// define store module
var SceneStore = Object.assign({}, NewMeStore, {
    
    /* 获取所有的作品数据 */
    getScenes() {
        return scenes;
    },

    /* 清空所有场景 */
    stripScenes: function () {
    	scenes = [];
    }
});

MeDispatcher.register(_action => {

    if (_action.type === 'scene') {
        scenes = _action.data;
        SceneStore.emitChange();
    }

});

// export store module
module.exports = SceneStore;