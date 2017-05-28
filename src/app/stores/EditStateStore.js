/**
 * Created by 95 on 2016/8/1.
 */
var EventEmitter = require('events').EventEmitter;
var MeDispatcher = require('../dispatcher/MeDispatcher');
var MeConstants = require('../constants/MeConstants');
var EditStates = MeConstants.EditStates;
const CHANGE_EVENT="change";


var textPannelMouseOverState=false;
var EditStateStore = Object.assign({}, EventEmitter.prototype, {
    getTextPannelMouseOverState:function(){
        return textPannelMouseOverState
    },
    emitChange             : function () {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener      : function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
});

EditStateStore.dispatchToken = MeDispatcher.register(function (action) {
    switch (action.type) {
        case EditStates.TEXTPANNELMOUSEOVERSTATE:
            textPannelMouseOverState=action.state;
            //EditStateStore.emitChange();
            break;

    }
});

module.exports = EditStateStore;
