require("./jquery.hotkeys");

var ElementStore = require("../../../stores/ElementStore");
var PageStore = require("../../../stores/PageStore");
var MeConstants = require("../../../constants/MeConstants")
var ElementType = MeConstants.Elements
var GlobalFunc = require("../../Common/GlobalFunc");
var $ = require("jquery");
var MakeActionCreators = require('../../../actions/MakeActionCreators');
var DialogAction = require('../../../actions/DialogActionCreator');
var Clipboard = require("../../../utils/Clipboard.util");
var _window = null;
function GetHelp(e) {
    // open help window
    e.preventDefault();
    //var url = $('#func>a').attr('href');
    var url = window.location.origin + "/about/navigation?action=newer";
    window.open(url);
}

function move(direction, distance) {
    switch (direction) {
        case "up":
            MakeActionCreators.moveElement({ top: -distance }, { type: 'keyboard' });
            break;
        case "down":
            MakeActionCreators.moveElement({ top: distance }, { type: 'keyboard' });
            break;
        case "left":
            MakeActionCreators.moveElement({ left: -distance }, { type: 'keyboard' });
            break;
        case "right":
            MakeActionCreators.moveElement({ left: distance }, { type: 'keyboard' });
            break;
        default:
            throw "direction error";
            break;

    }

}
var step = 4;
var stepMicro = 1;
function moveUp(e) {
    console.log("up");
    e.preventDefault();
    move('up', step);
}
function moveDown(e) {
    e.preventDefault();
    move('down', step);
}
function moveLeft(e) {
    e.preventDefault();
    move('left', step);
}
function moveRight(e) {
    e.preventDefault();
    move('right', step);
}
function moveUpMicro(e) {
    e.preventDefault();
    move('up', stepMicro);
}
function moveDownMicro(e) {

    e.preventDefault();
    move('down', stepMicro);
}
function moveLeftMicro(e) {
    e.preventDefault();
    move('left', stepMicro);
}
function moveRightMicro(e) {
    e.preventDefault();
    move('right', stepMicro);
}
function save(e) {
    e.preventDefault();
    GlobalFunc.createModel("", {
        tpl_type: 11
    });
}
function zIndexUp(e) {
    MakeActionCreators.changeLayer("up");

}
function zIndexDown(e) {
    MakeActionCreators.changeLayer("down");
}
function copyItem(e) {

    //var item = ELementStore.getSelectedElement();
    //var pages = PageStore.getPages();
    //var item;
    //for (var i = 0; i < pages.length; i++) {
    //    item = pages[i].attributes.item_object;
    //    for (var j = 0; j < item.length; j++) {
    //        console.log(item);
    //        if (item[j].attributes.item_type == 20 || item[j].attributes.item_type == 21) {
    //            GlobalFunc.addSmallTips("当前元素已存在,请不要重复添加", null, {clickCancel: true});
    //            //DialogAction.show('tips', "", {contentText: "当前元素已存在,请不要重复添加", hideCancel: true});
    //            return;
    //        }
    //    }
    //}

    if (GlobalFunc.itemCopyAble() === true) {
        var pageuid = PageStore.getPageUid();
        Clipboard.copy(pageuid);
    } else {
        // debugger;
        var items = ElementStore.getSelectedElement();
        if (items.length > 0) {
            GlobalFunc.addSmallTips("当前元素不能复制", null, { clickCancel: true });
        }

    }
}
function sameTypeExistOnPage(item, page) {
    var type = item.get("item_type");
    var items = page.get("item_object");
    for (var j = 0; j < items.length; j++) {
        if (items[j].attributes.item_type == type) {
            return true;
        }
    }
    return false;
}
function pasteItem(e) {
    var obj = Clipboard.getPasteElements();
    var exist = false;
    var tipsType = "";
    if (obj) {
        if (GlobalFunc.canPaste()) {
            MakeActionCreators.pasteElement();
        }
    }
}
function deleteItem() {
    if (GlobalFunc.itemDeleteAble()) {
        var items = ElementStore.getSelectedElement();
        if (GlobalFunc.existType(items, ElementType.redEnvelope)) {
            //MakeActionCreators.removeElement();
            DialogAction.show("tips", "", {
                contentText: "删除后，充值金额将在\n红包过期后退还到账户中", onConfirm: function () {
                    MakeActionCreators.removeElement();
                }
            });
        } else {
            MakeActionCreators.removeElement();
        }
        //MakeActionCreators.removeElement();
    }

}
function undo() {
    var UndoStore = require('../../../stores/UndoStore');
    var UndoAction = require('../../../actions/UndoAction');
    if (UndoStore.canUndo()) UndoAction.createUndo();
}
function redo() {
    var UndoStore = require('../../../stores/UndoStore');
    var UndoAction = require('../../../actions/UndoAction');
    if (UndoStore.canRedo()) UndoAction.createRedo();
}

function cancel() {
    console.log("cancel");
}
function backspace(e) {
    e.preventDefault();
}
function forbbiten(e) {
    e.preventDefault();
}
function selectAll(e) {
    MakeActionCreators.selectElement(undefined, { type: "all" })
}
function compose(e) {
    e.preventDefault();
    if (GlobalFunc.canCompose()) {
        MakeActionCreators.align("compose");
    }

}
function uncompose(e) {
    e.preventDefault();
    if (GlobalFunc.canUnCompose()) {
        MakeActionCreators.align("uncompose");
    }

}
function preview(e) {
    e.preventDefault();
    var WorkDataUtil = require("../../../utils/WorkDataUtil");
    var ElementStore = require('../../../stores/ElementStore');
    null != _window ? (_window.close()) : false;
    var _tplData = WorkDataUtil.getJsonTplData();
    WorkDataUtil.filterJsonItems(_tplData);

    _window = window.open('/makePreview', '_prev', 'width=400,height=700');
    _window.window.show_data = {
        tpl: WorkDataUtil.getJsonTpl(),
        tplData: _tplData,
        musicData: ElementStore.getTplMusic(),
        pageNumber: PageStore.getSelectedPageIndex(),
        userNick: GlobalFunc.getUserObj().user_nick
    }
}

function lock(e) {
    e.preventDefault();
    if (GlobalFunc.canLock()) {
        MakeActionCreators.align("lock");
    }
    console.log("lock");
}
function unlock(e) {
    e.preventDefault();
    if (GlobalFunc.canUnLock()) {
        MakeActionCreators.align("unlock");
    }
}
function zoomIn() {
    if (GlobalFunc.canZoomIn()) {
        GlobalFunc.setDeviceZoom("in");
        ELementStore.emitChange();
        var scale = GlobalFunc.getDeviceScale();
        GlobalFunc.addSmallTips(parseInt(scale * 100) + "%", 0.3, { delBackGround: true, margin: "0 0 0 -60px" })
    }
}
function zoomOut() {
    if (GlobalFunc.canZoomOut()) {
        GlobalFunc.setDeviceZoom("out");
        ELementStore.emitChange();
        var scale = GlobalFunc.getDeviceScale();
        GlobalFunc.addSmallTips(parseInt(scale * 100) + "%", 0.3, { delBackGround: true, margin: "0 0 0 -60px" })
    }
}
module.exports = {
    inited: false,
    init: function () {
        if (this.inited) {
            return;
        }
        this.inited = true;
        $(document).on('keydown', null, "f1", GetHelp);

        //方向键
        $(document).on('keydown', null, "up", moveUp);
        $(document).on('keydown', null, "down", moveDown);
        $(document).on('keydown', null, "left", moveLeft);
        $(document).on('keydown', null, "right", moveRight);
        $(document).on('keydown', null, "ctrl+up", moveUpMicro);
        $(document).on('keydown', null, "ctrl+down", moveDownMicro);
        $(document).on('keydown', null, "ctrl+left", moveLeftMicro);
        $(document).on('keydown', null, "ctrl+right", moveRightMicro);
        $(document).on('keydown', null, "ctrl+s", save);
        $(document).on('keydown', null, "ctrl+[", zIndexUp);
        $(document).on('keydown', null, "ctrl+]", zIndexDown);
        $(document).on('keydown', null, "ctrl+c", copyItem);
        $(document).on('keydown', null, "ctrl+v", pasteItem);
        $(document).on('keydown', null, "del", deleteItem);
        $(document).on('keydown', null, "backspace", backspace);
        $(document).on('keydown', null, "ctrl+z", undo);
        $(document).on('keydown', null, "ctrl+shift+z", redo);
        $(document).on('keydown', null, "ctrl+a", selectAll);

        $(document).on('keydown', null, "ctrl+g", compose);
        $(document).on('keydown', null, "ctrl+shift+g", uncompose);
        $(document).on('keydown', null, "ctrl+f5", preview);
        $(document).on('keydown', null, "ctrl+k", lock);
        $(document).on('keydown', null, "ctrl+l", lock);
        $(document).on('keydown', null, "ctrl+shift+k", unlock);
        $(document).on('keydown', null, "ctrl+shift+l", unlock);

        $(document).on('keydown', null, "ctrl+=", zoomIn);
        $(document).on('keydown', null, "ctrl+-", zoomOut);

    },
    unInit: function () {
        $(document).unbind('keydown', GetHelp);

        $(document).unbind('keydown', moveUp);
        $(document).unbind('keydown', moveDown);
        $(document).unbind('keydown', moveLeft);
        $(document).unbind('keydown', moveRight);
        $(document).unbind('keydown', moveUpMicro);
        $(document).unbind('keydown', moveDownMicro);
        $(document).unbind('keydown', moveLeftMicro);
        $(document).unbind('keydown', moveRightMicro);
        $(document).unbind('keydown', selectAll);
        $(document).unbind('keydown', save);
        $(document).unbind('keydown', zIndexUp);
        $(document).unbind('keydown', zIndexDown);
        $(document).unbind('keydown', copyItem);
        $(document).unbind('keydown', pasteItem);
        $(document).unbind('keydown', deleteItem);
        $(document).unbind('keydown', backspace);
        $(document).unbind('keydown', undo);
        $(document).unbind('keydown', redo);
        $(document).unbind('keydown', redo);

        $(document).unbind('keydown', compose);
        $(document).unbind('keydown', uncompose);
        $(document).unbind('keydown', preview);
        $(document).unbind('keydown', lock);
        $(document).unbind('keydown', unlock);

        $(document).unbind('keydown', zoomIn);
        $(document).unbind('keydown', zoomOut);

        this.inited = false;

    }
}

