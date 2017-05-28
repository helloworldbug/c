/*
 * component ActivityStore
 * description 活动 store
 * time 2015-12-29 18:57
 * author YJ
*/

'use strict';

// require core module
var NewMeStore = require('./NewMeStore');

// require dispatcher
var MeDispatcher = require('../dispatcher/MeDispatcher');

// store array
var activity = [];

var ActivityStore = Object.assign({}, NewMeStore, {
	// 获取所有活动数据
	getActivity:function(){
		return activity;
	}

});

MeDispatcher.register( _active=> {
	if(_active.type === 'activity'){
		activity = _active.data;
		ActivityStore.emitChange();
	}
})

// export store module
module.exports = ActivityStore;