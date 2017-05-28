/**
 * @component NewMeStore
 * @description 基类store
 * @time 2015-10-21 13:06
 * @author 曾文彬
 **/

'use strict';

// require core module
var EventEmitter = require('events').EventEmitter;

var eventName = 'change';

// define base store
var NewMeStore = Object.assign({}, EventEmitter.prototype, {

	emitChange() {
		this.emit(eventName);
	},

	addChangeListener(callback) {
		this.on(eventName, callback);
	},

	removeChangeListener(callback) {
		this.removeListener(eventName, callback);
	}
});

// export base store
module.exports = NewMeStore;


