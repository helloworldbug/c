/**
 * Created by 95 on 2015/9/21.
 */
/**
 * @component MakeStore
 * @description ����ҳ�湫��Store
 * @time 2015-09-11 15:46
 * @author Nick
 **/

var EventEmitter = require('events').EventEmitter;
var $ = require("jquery");
var MeDispatcher = require('../dispatcher/MeDispatcher');
var MeConstants = require('../constants/MeConstants');
var ActionTypes = MeConstants.ActionTypes;
var CHANGE_EVENT = MeConstants.Events.CHANGE;

var store = {
    popShow : false,
    cropShow: false,
    popMenuPos:null,
    el:undefined
}

var PopMenu = Object.assign({}, EventEmitter.prototype, {
    emitChange       : function () {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getPopMenuState: function () {
        return store.popShow;
    },
    getElPopMenu: function () {
        return store.el;
    },
    getCropState   : function () {
        return store.cropShow;
    },
    getPopMenuPos:function(){
        return store.popMenuPos;
    }
});
PopMenu.dispatchToken = MeDispatcher.register(function (action) {

    switch (action.type) {
        case  ActionTypes.CHANGE_POPMENU_STATE:
            changePopState(action.state);
            if(store.popShow){
                store.popMenuPos=action.pos;
                store.el=action.el;
            }
            PopMenu.emitChange();
            break;
        case ActionTypes.CHANGE_CROP_STATE:
            changeCropState(action.state);
            PopMenu.emitChange();
            break;
    }
})

function changePopState(state) {
    store.popShow = isShow(state);
}
function changeCropState(state) {
    store.cropShow = isShow(state);
    store.popShow =false;
}

function isShow(state) {
    if (state == "show") {
        return true;
    } else {
        return false;
    }
}

module.exports = PopMenu;