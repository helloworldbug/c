/**
 * Created by 95 on 2015/9/11.
 */
var EventEmitter = require('events').EventEmitter;
var MeConstants = require('../constants/MeConstants');
var CHANGE_EVENT = MeConstants.Events.CHANGE;
var MeDispatcher = require('../dispatcher/MeDispatcher');
var DialogTypes = MeConstants.SelectDialog;
var ActionType = MeConstants.ActionTypes;

var store = {
    show       : false,
    dialogType : "",
    initData   : "",
    dialogProps: null
};

var DialogStore = Object.assign({}, EventEmitter.prototype, {

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getDisplay: function () {
        return store.show
    },

    getDialogType: function () {
        return store.dialogType;
    },

    getDialogInitData: function () {
        return store.initData;
    },

    getProps: function () {
        return store.dialogProps
    }

});

function hideDialog() {
    store.show = false;
}

function showDialog(type, initData, props) {
    store.show = true;
    store.dialogType = type;
    store.initData = initData;
    store.dialogProps = props;
}

DialogStore.dispatchToken = MeDispatcher.register(function (action) {
    switch (action.type) {
        case DialogTypes.SHOW:
            showDialog(action.dialogType, action.initData, action.props);
            DialogStore.emitChange();
            break;
        case DialogTypes.HIDE:
            hideDialog();
            DialogStore.emitChange();
            break;
        case ActionType.WORK_INIT:
            hideDialog();
            break;
    }
});

module.exports = DialogStore;
