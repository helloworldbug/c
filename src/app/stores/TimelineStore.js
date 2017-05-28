/**
 * Created by 95 on 2015/9/11.
 */
var EventEmitter = require('events').EventEmitter;
var MeConstants = require('../constants/MeConstants');
var CHANGE_EVENT = MeConstants.Events.CHANGE;
var MeDispatcher = require('../dispatcher/MeDispatcher');
var ActionType = MeConstants.ActionTypes;
var Timeline = MeConstants.Timeline;

var store = {
    focus: {pos: "none", id: undefined}
};

var TimelineStore = Object.assign({}, EventEmitter.prototype, {

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    getFocus            : function () {
        return Object.assign({},store.focus)
    }


});


TimelineStore.dispatchToken = MeDispatcher.register(function (action) {
    switch (action.type) {
        case Timeline.TIMELINE_FOCUS:
            setFocus(action.val);
            TimelineStore.emitChange();
            break;
        case ActionType.SELECT_ELEMENT:
            //var ElementStore=require("./ElementStore")
            //MeDispatcher.waitFor([ElementStore.dispatchToken]);
            //var els=ElementStore.getSelectedElement();
            //if(els.length!=1){
            //    return
            //}
            //var attributes=els[0].attributes;
            //var id=attributes["item_uuid"];
            //if(id!=store.focus.id){
            //    setFocus({pos:"none",id:id});
            //}
            //TimelineStore.emitChange();
            break;


    }
});
function setFocus(val) {
    store.focus =Object.assign({},val)
}
module.exports = TimelineStore;
