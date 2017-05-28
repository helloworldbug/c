/**
 * Created by 95 on 2015/8/18.
 */
var MeDispatcher = require('../dispatcher/MeDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/MeConstants');
var ActionTypes = Constants.ActionTypes;
var WorkDataUtil = require('../utils/WorkDataUtil');
var $ = require("jquery");

var stack;
var transEntity;

var UndoStore = Object.assign({}, EventEmitter.prototype, {
    getPayload: function () {
        return transEntity;
    },


    canUndo: function () {

        return stack.canUndo();
    },
    canRedo: function () {
        return stack.canRedo();
    },

});
module.exports = UndoStore;
/**
 * 加入stack中
 */
function saveStack(name) {
    var MagazineStore = require('./MagazineStore');
    var SelectStore = require('./SelectStore');
    MeDispatcher.waitFor([SelectStore.dispatchToken, MagazineStore.dispatchToken]);
    var workData = MagazineStore.getWorkData();
    var workDataCopy = WorkDataUtil.cloneNode(workData,undefined,true);
    var selectObj = SelectStore.getSelectInfo();
    stack.execute({workData: workDataCopy, selectObj: $.extend(true, {}, selectObj), name: name});
}

UndoStore.dispatchToken = MeDispatcher.register(function (action) {
    switch (action.type) {
        case ActionTypes.GET_TEMPLATE_DATA:
        case ActionTypes.CREATE_BLANK_MAGAZINE:
        case ActionTypes.CREATE_BLANK_TEMPLATE:
            saveStack("开始");
            break;

        case ActionTypes.ADD_PAGE:
        case ActionTypes.ADD_GROUP:
        case  ActionTypes.DRAG_NODE:
        //case  ActionTypes.UPDATE_ATTR:
        case  ActionTypes.REMOVE_NODE:
        case ActionTypes.COPY_NODE:
        case ActionTypes.REPLACE_PAGE:
        case ActionTypes.UPDATE_PAGEPROP:
            saveStack("ddd");
            break;
        case ActionTypes.WORK_INIT:
            stack = new Undo();
            break;
        case ActionTypes.UNDO:
            transEntity = stack.undo();
            break;
        case ActionTypes.REDO:
            transEntity = stack.redo();
            break;

        case ActionTypes.UPDATE_ELEMENT:
            var sourceInfo = action.sourceInfo;
            if (sourceInfo) {
                if (sourceInfo.type != "keyboard" && sourceInfo.type != "range" && sourceInfo.type != "mousemove"&& sourceInfo.type != 'notsave') {
                    //���Ǽ��̵�����
                    saveStack("ddd");
                }
            } else {
                saveStack("ddd");
            }


            break;
        case ActionTypes.UNDORECORD:
            saveStack();
            break;
        case  ActionTypes.ADD_ELEMENT:
        case ActionTypes.REMOVE_ELEMENT:
        case ActionTypes.REPLACE_ELEMENT:
        case  ActionTypes.ALIGN:
            var ElementStore = require("./ElementStore");
            MeDispatcher.waitFor([ElementStore.dispatchToken]);
            if (action.data && action.data.type == "music") {
                UndoStore.saveMusicState(action);
            } else {
                saveStack("ddd");
            }
            break;
        case ActionTypes.CHANGE_LAYER:
            var ElementStore = require("./ElementStore");
            MeDispatcher.waitFor([ElementStore.dispatchToken]);

            saveStack("ddd");

            break;


    }
});

function Undo() {
    this.contain = 200;
    this.queue = [];
    this.stackPosition = -1;
    this.savePosition = -1;
}
function extend(target, ref) {
    var name, value;
    for (name in ref) {
        value = ref[name];
        if (value !== undefined) {
            target[name] = value;
        }
    }
    return target;
};
extend(Undo.prototype, {
    execute   : function (obj) {
        this._clearRedo();
        this.queue.push(obj);
        if (this.queue.length > this.contain) {
            this.queue.shift();
        } else {
            this.stackPosition++;
        }
    },
    undo      : function () {
        this.stackPosition--;
        return this.queue[this.stackPosition];

    },
    canUndo   : function () {
        return this.stackPosition > 0;
    },
    redo      : function () {
        this.stackPosition++;
        return this.queue[this.stackPosition];

    },
    canRedo   : function () {
        return this.stackPosition < this.queue.length - 1;
    },
    _clearRedo: function () {
        // TODO there's probably a more efficient way for this
        this.queue = this.queue.slice(0, this.stackPosition + 1);
    }
})
module.exports = UndoStore;