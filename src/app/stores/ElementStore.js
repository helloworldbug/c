/**
 * @component ElementStore
 * @description 元素Store
 * @time 2015-08-27 11:29
 * @author StarZou
 **/

var EventEmitter = require('events').EventEmitter;
var MeDispatcher = require('../dispatcher/MeDispatcher');
var MeConstants = require('../constants/MeConstants');
var PageStore = require('../stores/PageStore');
var MagazineStore = require('../stores/MagazineStore');
var GlobalFunc = require('../components/Common/GlobalFunc');
var Clipboard = require("../utils/Clipboard.util");
var ActionTypes = MeConstants.ActionTypes;
var GridTypes = MeConstants.GridType;
var Timeline = MeConstants.Timeline;
var Elements = MeConstants.Elements;
var CHANGE_EVENT = MeConstants.Events.CHANGE;
var timeConsumingEvent = "timeConsumingEvent";
var uuid = require("../utils/numuid");
var musicObj = {};
var _ = require("lodash");
var ClientState = require("../utils/ClientState");
var TimelineStore = require("./TimelineStore")
var MINIWIDTH = MeConstants.Defaults.MINELEMENTWIDTH;

// 仓库
var store = {
    elements: [],// 一页的所有元素数据
    selectedElementIndex: [],// 当前选中的元素的索引
    edittingDisplayFrame: [],//正在编辑的层
};

var StoreSetter = {

    clearSelectIndex: function () {
        store.selectedElementIndex = [];
    },

    selectDisplayFrame: function (group_id) {
        if (typeof group_id == "undefined") {
            return
        }
        //step into a DisplayFrame
        if (this.getDisplayFrame() != group_id) {
            store.edittingDisplayFrame.push(group_id);
        }
    },

    getDisplayFrame: function () {
        if (store.edittingDisplayFrame.length > 0) {
            return store.edittingDisplayFrame[store.edittingDisplayFrame.length - 1];
        }
        else {
            return undefined;
        }

    },

    endEditDisplayFrame: function () {
        //end edit a DisplayFrame
        store.edittingDisplayFrame.pop();
    },

    clearDisplayFrame: function () {
        store.edittingDisplayFrame = [];
    },

    selectGroup: function (groupEls, sourceInfo) {
        var pageEls = ElementStore.getDisplayFrameElements();
        if (typeof sourceInfo == 'undefined') {
            //直接选择分组
            var tempSelect = [];
            groupEls.forEach((elInfo) => {
                for (var index = 0; index < pageEls.length; index++) {
                    if (pageEls[index].get("item_uuid") == elInfo.id) {
                        var i = ElementStore.isSelected(index);
                        if (i != -1) {
                            tempSelect.push(index);
                            //store.elements.push(index)
                        }
                        break;
                    }
                }
            });
            if (tempSelect.length > 0) {
                store.selectedElementIndex = tempSelect
            }
        } else if (sourceInfo.move === true && sourceInfo.ctrlPressed === false) {
            // 移动时选择分组
            var tempSelect = [];
            groupEls.forEach((elInfo) => {
                for (var index = 0; index < pageEls.length; index++) {
                    if (pageEls[index].get("item_uuid") == elInfo.id) {
                        var i = ElementStore.isSelected(index);
                        if (i == -1) {
                            tempSelect.push(index);
                            //store.elements.push(index)
                        }
                        break;
                    }
                }
            });
            if (tempSelect.length > 0) {
                store.selectedElementIndex = tempSelect
            }

        } else if (sourceInfo.ctrlPressed === true) {
            groupEls.forEach((elInfo) => {
                for (var index = 0; index < pageEls.length; index++) {
                    if (pageEls[index].get("item_uuid") == elInfo.id) {
                        var i = ElementStore.isSelected(index);
                        if (i == -1) {
                            store.selectedElementIndex.push(index);
                            //store.elements.push(index)
                        } else {
                            store.selectedElementIndex.splice(i, 1);
                            //store.elements.splice(index,1);
                        }
                        break;
                    }
                }


            })

        } else if (sourceInfo.ctrlPressed === false) {
            var tempSelect = []
            groupEls.forEach((elInfo) => {
                for (var index = 0; index < pageEls.length; index++) {
                    if (pageEls[index].get("item_uuid") == elInfo.id) {
                        tempSelect.push(index);
                        break;
                    }
                }
            });
            store.selectedElementIndex = tempSelect
        }

        //if (sourceInfo.move === true) {
        //    //var i = ElementStore.isSelected(index);
        //    //if (i == -1) {
        //    //    store.selectedElementIndex = [index];
        //    //}
        //} else
    },

    directSelect: function (indedarr) {
        store.selectedElementIndex = indedarr;
    },

    selectElement: function (index, sourceInfo) {
        if (index < 0 || index >= store.elements.length) {
            console.error("selectElement error");
            return;
        }
        if (!sourceInfo) {
            store.selectedElementIndex = [index];
        } else {
            if (sourceInfo.move === true && sourceInfo.ctrlPressed === false) {
                var i = ElementStore.isSelected(index);
                if (i == -1) {
                    store.selectedElementIndex = [index];
                }
            } else if (sourceInfo.ctrlPressed === true) {
                var i = ElementStore.isSelected(index);
                if (i == -1) {
                    store.selectedElementIndex.push(index);
                    //store.elements.push(index)
                } else {
                    store.selectedElementIndex.splice(i, 1);
                    //store.elements.splice(index,1);
                }

            } else if (sourceInfo.ctrlPressed === false) {
                store.selectedElementIndex = [index];
            }
        }


    },

    addObj: function (itemObj) {
        var obj = objToAvItemObj(itemObj.attributes);
        obj.id = "";
        store.elements.push(obj);
    },

    addObjs: function (objArr) {
        for (var i = 0; i < objArr.length; i++) {
            StoreSetter.addObj(objArr[i]);
        }
    },

    appendObjs: function (items) {

        for (var i = 0; i < items.length; i++) {
            StoreSetter.addObj(items[i]);
        }
    },

    selectLast: function () {
        var displayFrameEls = ElementStore.getDisplayFrameElements();
        store.selectedElementIndex = [displayFrameEls.length - 1];
    }

};

function getDisplayFrame() {
    var displayFrame = StoreSetter.getDisplayFrame();
    var displayFrameEls = ElementStore.getDisplayFrameElements();
    if (!displayFrame) {
        return displayFrameEls[0];
    } else {
        for (var i = 0; i < displayFrameEls.length; i++) {
            var item = displayFrameEls[i];
            if (item.get("item_type") == 34) {
                return item;
            }
        }
    }
}

var ElementStore = Object.assign({}, EventEmitter.prototype, {

    getDisplayFrame: function () {
        return StoreSetter.getDisplayFrame();
    },

    canLayerDown: function () {
        var items = this.getDisplayFrameSelectedElement();
        var frameEl = getDisplayFrame();
        if (_.indexOf(items, -1) != -1 || !frameEl) {
            return false
        }
        if (items.length == 1) {
            let frameLayer = frameEl.get("item_layer");
            var item = items[0];
            var layer = item.get("item_layer");
            if (layer == frameLayer || layer == frameLayer + 1) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    },

    canLayerUp: function () {
        var allEls = this.getDisplayFrameElements();
        var items = this.getDisplayFrameSelectedElement();
        if (_.indexOf(items, -1) != -1) {
            return false
        }
        if (items.length == 1) {
            var item = items[0];
            let frameEl = getDisplayFrame();
            let frameLayer = frameEl.get("item_layer");
            var layer = item.get("item_layer");
            if (layer == frameLayer || layer == frameLayer + allEls.length - 1) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    },

    isSelected: function (elementIndex) {
        //返回index的位置
        var arr = store.selectedElementIndex;
        var i = _.indexOf(arr, elementIndex);
        return i;
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    emitTimeConsuming: function () {
        this.emit(timeConsumingEvent);
    },

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    addTimeConsumingListener: function (callback) {
        this.on(timeConsumingEvent, callback);
    },

    removeTimeConsumingListener: function (callback) {
        this.removeListener(timeConsumingEvent, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getBaseElements: function (els) {
        var allElements;
        if (els) {
            allElements = els.slice(0);
        } else {
            allElements = store.elements.slice(0);
        }

        return GlobalFunc.getBaseFrame(allElements);

    },

    getElements: function () {
        return store.elements;
    },

    getDisplayFrameElements: function (group_id) {
        if (!group_id) {
            group_id = StoreSetter.getDisplayFrame()
        }
        if (!group_id) {
            return ElementStore.getBaseElements()
        }
        var ret = [];
        store.elements.forEach((item) => {
            if (item.get("group_id") == group_id) {
                ret.push(item);
            }
        });
        return ret;
    },

    getSelectedElementIndex: function () {
        return store.selectedElementIndex;
    },

    getDisplayFrameSelectedElement: function () {
        var displayEls = ElementStore.getDisplayFrameElements();
        if (!displayEls) return [];
        var elements = [];
        store.selectedElementIndex.forEach((objIndex) => {
            if (objIndex == -1) {
            } else {
                let item = displayEls[objIndex];
                if (!!item) {
                    elements.push(displayEls[objIndex]);
                }

            }

        });
        return elements;
    },

    getSelectedElement: function () {
        return this.getDisplayFrameSelectedElement();
        //if (!store.elements)return [];
        //var elements = [];
        //store.selectedElementIndex.forEach((objIndex)=> {
        //    if (objIndex == -1) {
        //        elements.push(-1);
        //    } else {
        //        elements.push(store.elements[objIndex]);
        //    }
        //
        //})
        //return elements;
    },

    getElementByIndex: function (index) {
        if (!!index || (index == 0)) {
            return store.elements[index]
        } else {
            return ElementStore.getSelectedElement();
        }
        //return store.elements && index ? store.elements[index] : store.elements[store.selectedElementIndex];
    },

    //获得 tpl 音乐对象
    getTplMusic: function () {
        if (!!musicObj.src) {
            return {
                tpl_music: musicObj.tpl_music || "",
                tpl_music_replay: musicObj.tpl_music_replay || true,
                tpl_music_autoplay: musicObj.tpl_music_autoplay || true,
                tpl_music_name: musicObj.tpl_music_name || "",
                tpl_music_img: musicObj.tpl_music_img || "",
                tpl_music_lrc: musicObj.tpl_music_lrc || "",
                tpl_lrc_on: musicObj.tpl_lrc_on || 0
            }
        }
        var tpl = MagazineStore.getTpl();
        if (!!tpl) {
            return {
                tpl_music: tpl.get("tpl_music"),
                tpl_music_replay: tpl.get("tpl_music_replay"),
                tpl_music_autoplay: tpl.get("tpl_music_autoplay"),
                tpl_music_name: musicObj.tpl_music_name || "",
                tpl_music_img: musicObj.tpl_music_img || "",
                tpl_music_lrc: tpl.get("tpl_music_lrc"),
                tpl_lrc_on: tpl.get("tpl_lrc_on")
            }
        }
        return {};
    },

    canLock: function () {
        var els = ElementStore.getDisplayFrameSelectedElement();
        if (_.indexOf(els, -1) != -1) {
            return false
        }
        return ClientState.canLock(els, PageStore.getPageUid())
    },

    canUnLock: function () {

        var els = ElementStore.getDisplayFrameSelectedElement();
        if (_.indexOf(els, -1) != -1) {
            return false
        }
        return ClientState.canUnlock(els, PageStore.getPageUid())
    },

    canAjust: function () {
        var pageId = PageStore.getPageUid();
        var els = ElementStore.getSelectedElement().slice(0);
        if (_.indexOf(els, -1) != -1) {
            return false
        }
        var selectGrp = deleteGrpEls(els);
        if (els.length + selectGrp.length > 2) {
            var alignFlag = false;
            els.forEach((el) => {
                if (!ClientState.isLocked(el.get("item_uuid"), pageId)) {
                    alignFlag = true;
                }
            });
            selectGrp.forEach((grp) => {
                if (!grp.locked) {
                    alignFlag = true;
                }
            });
            return alignFlag;

        } else {
            return false
        }
    },

    canAlign: function () {
        var pageId = PageStore.getPageUid();
        var els = ElementStore.getSelectedElement().slice(0);
        if (_.indexOf(els, -1) != -1) {
            return false
        }
        var selectGrp = deleteGrpEls(els);
        if (els.length + selectGrp.length > 1) {
            var alignFlag = false;
            els.forEach((el) => {
                if (!ClientState.isLocked(el.get("item_uuid"), pageId)) {
                    alignFlag = true;
                }
            });
            selectGrp.forEach((grp) => {
                if (!grp.locked) {
                    alignFlag = true;
                }
            });
            return alignFlag;

        } else {
            return false
        }

    },

    canCompose: function () {
        var els = ElementStore.getDisplayFrameSelectedElement();
        if (_.indexOf(els, -1) != -1) {
            return false
        }
        return ClientState.canCompose(PageStore.getPageUid(), els);
    },

    canUnCompose: function () {

        var els = ElementStore.getDisplayFrameSelectedElement();
        if (_.indexOf(els, -1) != -1) {
            return false
        }
        return ClientState.canUncompose(PageStore.getPageUid(), els);
    }

});

function selectAllEls() {
    var allEls = ElementStore.getDisplayFrameElements();
    var selarr = [];
    for (var i = 1; i < allEls.length; i++) {
        var el = allEls[i];
        var type = el.get("item_type");
        if (type == 17 || type == 24) {
            continue;
        }
        selarr.push(i);
    }
    if (selarr.length > 0) {
        StoreSetter.directSelect(selarr);
    }

}

/**
 * 选中元素
 * @param item_uuid
 */
function selectlayer(item_uuid) {
    var allEls = ElementStore.getElements();
    for (var i = 0; i < allEls.length; i++) {
        var item = allEls[i];
        if (item.get("item_uuid") == item_uuid) {
            StoreSetter.clearDisplayFrame();
            if (item.get("item_type") == 34) {
                StoreSetter.selectDisplayFrame(item.get("group_id"));
                StoreSetter.clearSelectIndex();
                StoreSetter.directSelect([0]);
            } else {
                var displayFrame = ElementStore.getDisplayFrameElements();
                for (let j = 0; j < displayFrame.length; j++) {
                    let showItem = displayFrame[j];
                    if (showItem.get("item_uuid") == item_uuid) {
                        store.selectedElementIndex = [j];
                        break;
                    }
                }
            }
            break;

        }
    }
}

function selectElement(index, sourceInfo) {
    if (sourceInfo && sourceInfo.type == "all") {
        selectAllEls();
        return;
    }
    if (sourceInfo && sourceInfo.type == "select_layer") {
        selectlayer(index);
        return;
    }
    if (index == -1) {
        store.selectedElementIndex = [index];
        return;
    }
    if (index instanceof Array) {
        StoreSetter.directSelect(index);
        return;
    }
    var musicIndex = _.indexOf(store.selectedElementIndex, -1);
    if (musicIndex != -1) {
        store.selectedElementIndex.splice(musicIndex, 1);
    }
    var selectedPage = PageStore.getSelectedPage();
    store.elements = selectedPage.attributes.item_object;
    let displayFrameEls = ElementStore.getDisplayFrameElements();
    displayFrameEls.forEach((el) => {
        if (!el.get("item_uuid") || el.get("item_uuid") == 1) {
            el.set("item_uuid", uuid.generateUid());
        }
    });
    var groupEls = ClientState.getGroupElsByEl(displayFrameEls[index]);
    if (groupEls.length > 0) {
        StoreSetter.selectGroup(groupEls, sourceInfo);
    } else {
        StoreSetter.selectElement(index, sourceInfo);
    }


    //StoreSetter.selectElement(index, sourceInfo);
    //var selectedPage = PageStore.getSelectedPage();
    //
    //store.elements = selectedPage.attributes.item_object;
    //store.selectedElementIndex = index || MeConstants.Defaults.elementIndex;//0
}

/*
 更新触发事件
 */
function updateEvent(attrName, index, value, type) {
    var selectedElement = ElementStore.getDisplayFrameSelectedElement();

    for (var i = 0; i < selectedElement.length; i++) {

        var attributes = selectedElement[i].attributes;

        var oriStr = attributes[attrName].split("|");
        if (type == "add") {
            oriStr.push("");
        } else if (type == "remove") {
            oriStr.splice(index, 1);
        } else {
            oriStr[index] = value;
        }
        var newStr = oriStr.join("|");
        selectedElement[i].set(attrName, newStr);
    }
}


/**
 * 更新当前元素的属性
 * @param element: obj
 * @param index: 元素索引
 */
function updateElement(element, index, sourceInfo, uuid) {//[0,1]
    var selectedElement = [], key;
    if (!!uuid) {
        let allEls = ElementStore.getElements();
        for (let i = 0; i < allEls.length; i++) {
            let item = allEls[i];
            if (item.get("item_uuid") == uuid) {
                for (key in element) {
                    if (element.hasOwnProperty(key)) {
                        item.set(key, element[key])
                    }
                }
                for (key in element) {
                    if (element.hasOwnProperty(key)) {
                        if (GlobalFunc.propCanAnimate(key)) {
                            updateTimelineFrame()
                            break;
                        }
                    }
                }
                break;
            }
        }
    }
    if (!!index) {
        var displayFrame = ElementStore.getDisplayFrameElements();
        for (var i = 0; i < index.length; i++) {
            selectedElement[i] = displayFrame[index[i]];
        }
    } else {
        selectedElement = ElementStore.getDisplayFrameSelectedElement();
    }
    for (var i = 0; i < selectedElement.length; i++) {

        var attributes = selectedElement[i].attributes;

        //if( attributes.item_type == 1 && !attributes.group_id){
        //    for (key in element){
        //        if( key == "item_left" || key == "item_top" || key == "item_width" || key == "item_height"){
        //            return;
        //        }
        //    }
        //}

        for (key in element) {

            //当边框的宽高改变时,不执行该操作
            if (attributes.item_type == 10 && (key == "item_width" || key == "item_height")) return;

            if (element.hasOwnProperty(key)) {
                selectedElement[i].set(key, element[key])
            }
        }
        if (selectedElement.length == 1) {
            for (key in element) {
                if (element.hasOwnProperty(key)) {
                    if (GlobalFunc.propCanAnimate(key)) {
                        updateTimelineFrame()
                        break;
                    }
                }
            }
        }
    }
}

function objToAvItemObj(jdata) {
    var obj = jdata, attr;
    var labelobj = fmaobj.elem.create();
    for (attr in obj) {
        labelobj.set(attr, obj[attr]);
    }
    labelobj.id = "";
    return labelobj;
}

function addDisplayFrameGroup(item) {
    var group_id = StoreSetter.getDisplayFrame();
    if (!!group_id) {
        if (item.length > 0) {
            item.forEach((el) => {
                el.set("group_id", group_id)
            })
        } else {
            item.set("group_id", group_id)
        }
    }

}

function getBaseLayer() {
    var displayFrame = ElementStore.getDisplayFrameElements();
    var base = GlobalFunc.getBaseFrame(displayFrame);
    if (base.length > 0) {
        return base[0].get("item_layer");
    } else {
        return 0
    }

}

function addElement(elementInfo) {
    var ItemInit = require("../components/Common/ItemInit");
    var type = elementInfo.type;
    var deviceScale = GlobalFunc.getDeviceScale();
    var displayFrame = getDisplayFrame();
    //console.log(displayFrame);
    switch (type) {
        case 'vote':
            var obj = elementInfo.obj;
            obj.set("item_layer", ElementStore.getDisplayFrameElements().length + getBaseLayer());

            if (typeof obj.get("item_top") == "number") {
                obj.set("item_top", obj.get("item_top") + $(".device-box")[0].scrollTop / deviceScale - displayFrame.get("item_top"));
            }
            obj.set("f_name", GlobalFunc.genElementName(ElementStore.getElements(), obj));
            addDisplayFrameGroup(obj);
            StoreSetter.addObj(obj);
            StoreSetter.selectLast();
            var MagazineStore = require("./MagazineStore")
            var tpl = MagazineStore.getTpl();
            tpl.set("tpl_fbstate", 1);
            break;
        case "displayFrame":
            var obj = elementInfo.obj;
            obj.set("item_layer", ElementStore.getElements().length);
            if (typeof obj.get("item_top") == "number") {
                obj.set("item_top", obj.get("item_top") + $(".device-box")[0].scrollTop / deviceScale);
            }
            obj.set("f_name", GlobalFunc.genElementName(ElementStore.getElements(), obj));
            StoreSetter.addObj(obj);
            StoreSetter.selectDisplayFrame(obj.get("group_id"));
            break;
        case "backImg":
            replaceElement(elementInfo);
            break;
        case "label":
        case 'text':
        case 'video':
        case 'button':
        case 'input':
        case 'phone':
        case 'embedded':
        case 'reward':
        case 'map':
        case "redEnvelope":
        case "svg":
        case 'music':
        case 'ar':
        case 'vr':
            var obj = elementInfo.obj;
            obj.set("item_layer", ElementStore.getDisplayFrameElements().length + getBaseLayer());
            obj.set("f_name", GlobalFunc.genElementName(ElementStore.getElements(), obj));
            if (typeof obj.get("item_top") == "number") {
                obj.set("item_top", obj.get("item_top") + $(".device-box")[0].scrollTop / deviceScale - displayFrame.get("item_top"));
            }

            addDisplayFrameGroup(obj);
            StoreSetter.addObj(obj);
            StoreSetter.selectLast();
            break;
        case 'fingerprint':
        case 'shake':
            var obj = elementInfo.obj;
            var pageLen = PageStore.getPages().length;
            var curPageIndex = PageStore.getSelectedPageIndex();
            var pageTo = curPageIndex + 1;
            pageTo = (pageTo == pageLen) ? 0 : pageTo;
            obj.set("animate_end_act", "pageto:" + pageTo);
            obj.set("item_layer", ElementStore.getDisplayFrameElements().length + getBaseLayer());
            if (typeof obj.get("item_top") == "number") {
                obj.set("item_top", obj.get("item_top") + $(".device-box")[0].scrollTop / deviceScale - displayFrame.get("item_top"));
            }
            obj.set("f_name", GlobalFunc.genElementName(ElementStore.getElements(), obj));

            addDisplayFrameGroup(obj);
            StoreSetter.addObj(obj);
            StoreSetter.selectLast();
            break;
        case 'frame':
            var indexSrc = elementInfo.src;
            var frameObj, items = ElementStore.getElements();
            for (var i = 0; i < items.length; i++) {
                if (items[i].attributes.item_type == 10) {
                    frameObj = items[i];
                }
            }

            if (frameObj) {
                frameObj.set("item_val", indexSrc);
                frameObj.set("f_name", GlobalFunc.genElementName(ElementStore.getElements(), frameObj));
            } else {
                var obj = ItemInit.frameInit(indexSrc);
                obj.set("item_layer", ElementStore.getElements().length + getBaseLayer());
                obj.set("f_name", GlobalFunc.genElementName(ElementStore.getElements(), obj));
                StoreSetter.addObj(obj);
                StoreSetter.selectLast();
            }
            break;
        case 'watermark':
            var dimObj = GlobalFunc.getImgWidth(elementInfo.img);
            var obj = ItemInit.watermarkInit(elementInfo.src, dimObj.width, dimObj.height);
            obj.set("item_layer", ElementStore.getDisplayFrameElements().length + getBaseLayer());
            if (typeof obj.get("item_top") == "number") {
                obj.set("item_top", obj.get("item_top") + $(".device-box")[0].scrollTop / deviceScale - displayFrame.get("item_top"));
            }
            obj.set("f_name", GlobalFunc.genElementName(ElementStore.getElements(), obj));
            addDisplayFrameGroup(obj);
            StoreSetter.addObj(obj);
            StoreSetter.selectLast();
            break;
        case "scribble":
            var scribbleObj, items = ElementStore.getElements();
            for (var i = 0; i < items.length; i++) {
                if (items[i].attributes.item_type == 24) {
                    scribbleObj = items[i];
                    break;
                }
            }
            if (scribbleObj) {
                scribbleObj.set("item_width", 640);
                scribbleObj.set("item_height", 1008);
                scribbleObj.set("item_href", elementInfo.src);
                scribbleObj.set("item_opacity", elementInfo.opacity);
                scribbleObj.set("clip_percent", elementInfo.clipPercent);
                scribbleObj.set("item_val", elementInfo.tips);

                scribbleObj.set("item_left", (640 - ItemInit.getTextLength(elementInfo.tips)) / 2);
                addAnimationEndScript(scribbleObj)
                scribbleObj.set("f_name", GlobalFunc.genElementName(ElementStore.getElements(), scribbleObj));

            } else {
                var obj = ItemInit.scribbleInit(elementInfo);
                obj.set("item_layer", ElementStore.getDisplayFrameElements().length + getBaseLayer());
                obj.set("f_name", GlobalFunc.genElementName(ElementStore.getElements(), obj));
                addAnimationEndScript(obj)
                StoreSetter.addObj(obj);
            }

            break;
        case 'shape':
            var dimObj = GlobalFunc.getImgWidth(elementInfo.img);
            var obj = ItemInit.shapeInit(elementInfo.src, dimObj.width, dimObj.height);
            obj.set("item_layer", ElementStore.getDisplayFrameElements().length + getBaseLayer());
            if (typeof obj.get("item_top") == "number") {
                obj.set("item_top", obj.get("item_top") + $(".device-box")[0].scrollTop / deviceScale - displayFrame.get("item_top"));
            }
            obj.set("f_name", GlobalFunc.genElementName(ElementStore.getElements(), obj));
            addDisplayFrameGroup(obj);
            StoreSetter.addObj(obj);
            StoreSetter.selectLast();
            break;
        case 'backImg':
            var item_obj = ElementStore.getElements()[0];
            var dimObj = GlobalFunc.getImgWidth(elementInfo.img);
            if (item_obj && item_obj.attributes.item_type == 1) {
                item_obj.set("item_val", elementInfo.src);
                item_obj.set("item_width", dimObj.width);
                item_obj.set("item_height", dimObj.height);
            } else {
                console.error("add backImg error");
                //MakeStore.addItemToBefore(ItemInit.backImgInit(data.src))
            }
            break;

        case 'img':
            //var dimObj = GlobalFunc.getImgWidth(elementInfo.img);
            var dimObj = {};
            dimObj.width = elementInfo.img.width;
            dimObj.height = elementInfo.img.height;

            var imgItem;
            if (elementInfo.hasOwnProperty('imgInf')) {
                imgItem = ItemInit.imageItemInit(elementInfo.src, dimObj.width, dimObj.height, null, elementInfo.imgInf);
            } else {
                imgItem = ItemInit.imageItemInit(elementInfo.src, dimObj.width, dimObj.height);
            }
            imgItem.set("item_layer", ElementStore.getDisplayFrameElements().length + getBaseLayer());
            if (typeof imgItem.get("item_top") == "number") {
                imgItem.set("item_top", imgItem.get("item_top") + $(".device-box")[0].scrollTop / deviceScale - displayFrame.get("item_top"));
            }
            imgItem.set("f_name", GlobalFunc.genElementName(ElementStore.getElements(), imgItem));
            addDisplayFrameGroup(imgItem);
            StoreSetter.addObj(imgItem);
            StoreSetter.selectLast();
            break;
        case 'panorama':
            var dimObj = GlobalFunc.getImgWidth(elementInfo.img);
            var imgItem = ItemInit.panoramaInit(elementInfo.srcInfo, dimObj.width, dimObj.height);
            imgItem.set("item_layer", ElementStore.getDisplayFrameElements().length + getBaseLayer());
            if (typeof imgItem.get("item_top") == "number") {
                imgItem.set("item_top", imgItem.get("item_top") + $(".device-box")[0].scrollTop / deviceScale - displayFrame.get("item_top"));
            }
            imgItem.set("f_name", GlobalFunc.genElementName(ElementStore.getElements(), imgItem));
            addDisplayFrameGroup(imgItem);
            StoreSetter.addObj(imgItem);
            StoreSetter.selectLast();
            break;
        case 'picslide':
            var dimObj = GlobalFunc.getImgWidth(elementInfo.img);
            var imgItem = ItemInit.picslideInit(elementInfo.srcInfo, dimObj.width, dimObj.height);
            imgItem.set("item_layer", ElementStore.getDisplayFrameElements().length + getBaseLayer());
            if (typeof imgItem.get("item_top") == "number") {
                imgItem.set("item_top", imgItem.get("item_top") + $(".device-box")[0].scrollTop / deviceScale - displayFrame.get("item_top"));
            }
            imgItem.set("f_name", GlobalFunc.genElementName(ElementStore.getElements(), imgItem));
            addDisplayFrameGroup(imgItem);
            StoreSetter.addObj(imgItem);
            StoreSetter.selectLast();
            break;
        case 'picFrame':
            var group_id = new Date().getTime();
            var dimObj = GlobalFunc.getImgWidth(elementInfo.img);
            var imgItem = ItemInit.imageItemInit(elementInfo.src, dimObj.width, dimObj.height, group_id);
            imgItem.set("item_layer", ElementStore.getDisplayFrameElements().length + 1 + getBaseLayer());
            var makeChild = ItemInit.makeChildInit(group_id);
            makeChild.set("item_layer", ElementStore.getDisplayFrameElements().length + getBaseLayer());
            if (typeof imgItem.get("item_top") == "number") {
                imgItem.set("item_top", imgItem.get("item_top") + $(".device-box")[0].scrollTop / deviceScale - displayFrame.get("item_top"));
            }
            imgItem.set("f_name", GlobalFunc.genElementName(ElementStore.getElements(), imgItem));
            StoreSetter.appendObjs([makeChild, imgItem]);
            StoreSetter.selectLast();
            break;

        case 'form':
            var obj = elementInfo.obj;
            for (var i = 0; i < obj.length; i++) {
                var item = obj[i];
                item.set("item_layer", ElementStore.getDisplayFrameElements().length + i + getBaseLayer());
                if (typeof item.get("item_top") == "number") {
                    item.set("item_top", item.get("item_top") + $(".device-box")[0].scrollTop / deviceScale - displayFrame.get("item_top"));
                }
                item.set("f_name", GlobalFunc.genElementName(ElementStore.getElements(), item));
            }
            addDisplayFrameGroup(obj);
            StoreSetter.appendObjs(obj);
            StoreSetter.selectLast();
            break;
        case 'radio':
        case 'checkbox':
            var obj = elementInfo.obj;
            obj.set("item_layer", ElementStore.getDisplayFrameElements().length + getBaseLayer());
            if (typeof obj.get("item_top") == "number") {
                obj.set("item_top", obj.get("item_top") + $(".device-box")[0].scrollTop / deviceScale - displayFrame.get("item_top"));
            }
            obj.set("f_name", GlobalFunc.genElementName(ElementStore.getElements(), obj));

            addDisplayFrameGroup(obj);
            StoreSetter.addObj(obj);
            setFbcollect(type);
            StoreSetter.selectLast();
            break;

    }
    //if(obj){
    //    obj.set("f_name",GlobalFunc.genElementName(ElementStore.getElements(),obj))
    //}

    //}else if(type=='text'||type=="video"||type=="button"||type=="inputText"){
    //    addObj(elementInfo.obj)
    //}else if(type=='img'){
    //    var _itemObj = MakeStore.getPage().get("item_object");
    //    var group_id = new Date().getTime();
    //    var dimObj=MakeStore._getImgWidth(elementInfo.img);
    //    var imgItem = ItemInit.imageItemInit(elementInfo.src, dimObj.width,dimObj.height, group_id),
    //        makeChild = ItemInit.makeChildInit(group_id);
    //    MakeStore.appendItems([makeChild, imgItem]);
    //}else if(type=='watermark'){
    //    var dimObj=MakeStore._getImgWidth(elementInfo.img);
    //    MakeStore.appendItem(ItemInit.watermarkInit(elementInfo.src, dimObj.width, dimObj.height));
    //}else if(type=="shape"){
    //    var dimObj=MakeStore._getImgWidth(elementInfo.img);
    //    MakeStore.appendItem(ItemInit.shapeInit(elementInfo.src, dimObj.width, dimObj.height));
    //}else if(type=="fastForm"){
    //    MakeStore.appendItems(elementInfo.obj);
    //}else if(type=="music"){
    //    MakeStore.setTplMusic(elementInfo.obj);
    //}
}

function addAnimationEndScript(obj) {
    var baseEls = ElementStore.getDisplayFrameElements();
    var showEls = []
    baseEls.forEach((el) => {
        var type = el.get("item_type");
        if (type == Elements.background && !el.get("group_id")) {
            return;
        }
        if (type == Elements.scribble || type == Elements.pictureFrame) {
            return;
        }
        showEls.push("show_el:" + el.get("item_id"))
        el.set("item_display_status", 1)
    })
    if (showEls.length > 0) {
        var actionStr = '[{meTap:"' + showEls.join('|') + '"}]'
        obj.set("animate_end_act", actionStr)
    }
}
function setFbcollect(str) {
    var tpl = MagazineStore.getTpl();
    var val = '';
    var content;
    //console.log(tpl.attributes.tpl_fbcollect);
    if (tpl.attributes.tpl_fbcollect == undefined) {
        val = '{"' + str + '":{title:"标题",content:["选项1","选项2","选项3"]}}';
    } else {
        content = tpl.attributes.tpl_fbcollect;
        val = eval('(' + content + ')');
        val[str] = { title: "标题", content: ["选项1", "选项2", "选项3"] };
        val = JSON.stringify(val);
    }
    tpl.set("tpl_fbcollect", val);

}
function replaceElement(elementInfo) {
    var type = elementInfo.type;
    var ItemInit = require("../components/Common/ItemInit");
    if (type == "backImg") {
        var item_obj = ElementStore.getElements()[0];
        item_obj.set("item_val", elementInfo.src);
        if (item_obj.attributes.item_state == "none") {
            item_obj.set("pic_replace", 0);//可替换
            item_obj.set("item_state", "");
            item_obj.set("item_width", elementInfo.img.width);
            item_obj.set("item_height", elementInfo.img.height);
            item_obj.set("item_top", 0);
            item_obj.set("item_left", 0);
            item_obj.set("item_opacity", 100);
            // console.error("add backImg error");
            //MakeStore.addItemToBefore(ItemInit.backImgInit(elementInfo.src))
        }
    } else if (type == "img" || type == "watermark" || type == "shape") {
        var dimObj = GlobalFunc.getImgWidth(elementInfo.img);
        var Obj = ElementStore.getDisplayFrameSelectedElement()[0];
        Obj.set("item_val", elementInfo.src);
        Obj.set("item_width", dimObj.width);
        Obj.set("item_height", dimObj.height);
    } else if (type == "panorama" || type == "picslide") {
        var Obj = ElementStore.getDisplayFrameSelectedElement()[0];
        var dimObj = GlobalFunc.getImgWidth(elementInfo.img);
        var srcInfo = elementInfo.srcInfo;
        Obj.set("item_width", dimObj.width);
        Obj.set("item_height", dimObj.height);
        Obj.set("item_val", srcInfo.src);
        Obj.set("item_val_sub", srcInfo.name);
        Obj.set("item_href", srcInfo.href);
    } else if (type == "music") {
        var srcInfo = elementInfo.srcInfo;
        //console.log("srcInfo", srcInfo);
        var Obj = ElementStore.getDisplayFrameSelectedElement()[0];
        if(!srcInfo.tpl_music){
            return;
        }
        Obj.set("item_val", srcInfo.tpl_music);
        Obj.set("music_img", srcInfo.tpl_music_img);
        Obj.set("music_name", srcInfo.tpl_music_name);
        //console.log("obj", Obj);
    }
}

function pasteElement() {
    var obj = Clipboard.getPasteElements();
    if (obj) {
        var copyPageUid = Clipboard.getPageUid();
        var copy_count = 0;
        if (PageStore.getPageUid() == copyPageUid) {
            copy_count = Clipboard.getPasteTime();
        }
        var grdidMap = {};
        GlobalFunc.copyElementsEvents(obj);
        for (var i = 0, j = 0; i < obj.length; i++) {
            if (obj[i].get("item_type") != 17) {
                obj[i].set("item_left", (obj[i].get("item_left") + copy_count * 10));
                obj[i].set("item_top", (obj[i].get("item_top") + copy_count * 10));
            }
            var oriGid = obj[i].get("group_id");
            if (oriGid && GlobalFunc.ifPicFrame(oriGid, ElementStore.getElements())) {
                if (grdidMap[oriGid]) {
                    obj[i].set("group_id", grdidMap[oriGid]);
                } else {
                    var newGid = new Date().getTime();
                    obj[i].set("group_id", newGid);
                    grdidMap[oriGid] = newGid;
                }

            }
            obj[i].set("item_uuid", uuid.generateUid());
            obj[i].set("item_layer", ElementStore.getElements().length + j);
            j++;
        }
        StoreSetter.addObjs(obj);
    }

}
function removeGroup(groupID, items) {
    var item_obj;
    if (!!items) {
        item_obj = items
    } else {
        item_obj = store.elements;
    }
    if (!!groupID) {
        for (var i = 0; i < item_obj.length; i++) {
            if (item_obj[i].get("group_id") == groupID) {
                item_obj.splice(i, 1);
                i--;
            }
        }

    }
}

function getGroupIDByItemId(item_id) {
    return item_id;
    let allEls = store.elements;
    for (let i = 0; i < allEls.length; i++) {
        let item = allEls[i];
        if (item.get("item_id") == item_id) {
            return item.get("group_id")
        }
    }
    return 0
}
function getDisplayFrameChildrens(item_id) {
    let item_uuids = [];
    let allEls = store.elements;
    let group_id = getGroupIDByItemId(item_id);
    for (let i = 0; i < allEls.length; i++) {
        let item = allEls[i];
        if (item.get("group_id") == group_id) {
            item_uuids.push(item.get("item_uuid"));
            let itemFrameId = GlobalFunc.getDisplayGroup(item);
            if (itemFrameId) {
                item_uuids = item_uuids.concat(getDisplayFrameChildrens(itemFrameId))
            }
        }
    }
    return _.uniq(item_uuids);
}
function removeElement(index) {
    var item_obj = ElementStore.getDisplayFrameElements();
    var item_uuids = [];
    //var item_obj = store.elements;
    var selectIndex = ElementStore.getSelectedElementIndex();
    if (index) {
        item_uuids.push(item_obj[index].get("item_uuid"));
    } else {
        selectIndex.forEach((i) => {
            item_uuids.push(item_obj[i].get("item_uuid"));
        });
    }
    var allEls = store.elements;
    let frameuuids = [];
    item_uuids.forEach((uuid) => {
        if (_.indexOf(frameuuids, uuid) > -1) {
            return;
        }
        for (var i = 0; i < allEls.length; i++) {
            let item = allEls[i];
            if (item.get("item_uuid") == uuid) {
                let itemFrame = GlobalFunc.getDisplayGroup(item);
                if (itemFrame) {
                    frameuuids = frameuuids.concat(getDisplayFrameChildrens(itemFrame))
                }
            }
        }
    });
    item_uuids = item_uuids.concat(frameuuids);
    item_uuids = _.uniq(item_uuids);
    item_uuids.forEach((item_uuid) => {
        for (let i = 0; i < allEls.length; i++) {
            if (allEls[i].get("item_uuid") == item_uuid) {
                let groupID = allEls[i].get("group_id");
                let itemType = allEls[i].get("item_type");
                if (i==0) {
                    //背景元素隐藏
                    let itemObj = allEls[i];
                    itemObj.set("pic_replace", 1);//不可替换
                    itemObj.set("item_state", "none");
                    itemObj.set("item_width", 2);
                    itemObj.set("item_height", 2);
                    itemObj.set("item_type", 1);
                    itemObj.set("item_top", 0);
                    itemObj.set("item_left", -10000);
                    itemObj.set("item_opacity", 0);

                    return;
                }
                //allEls.splice(i, 1);
                if (!!groupID && (GlobalFunc.ifPicFrame(groupID, ElementStore.getElements()) || itemType == 34)) {

                    removeGroup(groupID);
                    if (itemType == 34) {
                        StoreSetter.clearDisplayFrame();
                    }
                } else {
                    allEls.splice(i, 1);
                }
                break;
            }
        }
        for (let i = 0; i < item_obj.length; i++) {
            if (item_obj[i].get("item_uuid") == item_uuid) {
                let groupID = item_obj[i].get("group_id");
                let itemType = item_obj[i].get("item_type");
                //item_obj.splice(i, 1);
                if (!!groupID && (GlobalFunc.ifPicFrame(groupID, ElementStore.getElements()) || itemType == 34)) {
                    removeGroup(groupID, item_obj);
                } else {
                    item_obj.splice(i, 1);
                }
                break;
            }
        }
    });
    var WorkDataUtil = require('../utils/WorkDataUtil');
    WorkDataUtil.resetLayer(item_obj);
}
function changeLayer(type, info) {
    var beforeLayer = [], afterLayer = [], itemObjs = ElementStore.getDisplayFrameElements(), itemIndex = ElementStore.getSelectedElementIndex();

    if (type == "move") {
        var startIndex = info.startIndex;
        var endIndex = info.endIndex;
        var objs = info.objs;
        var startEl = objs.splice(startIndex, 1)[0];
        if (startIndex < endIndex) {
            endIndex--;
        }
        objs.splice(endIndex, 0, startEl);
        objs.forEach((item, index) => {
            item.set("item_layer", index);
        });
        var WorkDataUtil = require('../utils/WorkDataUtil');
        WorkDataUtil.resetAllItemsLayer(ElementStore.getElements())
        return;
    }
    if (!GlobalFunc.canChangeLayer(itemObjs[itemIndex])) return;
    var sortObjs = [];
    itemObjs.forEach((item) => {
        if (item.get("item_type") == 34) {
            item.set("item_layer", 0);
        }
    });
    resortLayer(itemObjs);
    function resortLayer(itemObjs) {
        var layerInfo = [];
        itemObjs.forEach((item, index) => {
            layerInfo.push({ layer: item.get("item_layer"), index: index });
        });
        layerInfo.sort(function (a, b) {
            return a.layer - b.layer;
        });
        layerInfo.forEach((info, index) => {
            itemObjs[info.index].set("item_layer", index);
        })
    }

    function getItemsBySelect(itemObjs, selectedIndex) {
        var arr = [], selectedItem = itemObjs[selectedIndex].attributes;
        if (!!selectedItem.group_id && GlobalFunc.ifPicFrame(selectedItem.group_id, ElementStore.getElements())) {
            for (var i = 0; i < itemObjs.length; i++) {
                if (itemObjs[i].get("group_id") == selectedItem.group_id) {
                    arr.push({ "itemIndex": i, "itemLayer": itemObjs[i].get("item_layer") });
                }
            }
        } else {
            arr.push({ "itemIndex": selectedIndex, "itemLayer": selectedItem.item_layer });
        }
        return arr;
    }

    function getMaxLayer(arr) {
        var maxLayer = -1, targetIndex;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].itemLayer > maxLayer) {
                maxLayer = arr[i].itemLayer;
                targetIndex = i;
            }
        }
        return arr[targetIndex];
    }

    function getMinLayer(arr) {
        var minLayer = 99999, targetIndex;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].itemLayer < minLayer) {
                minLayer = arr[i].itemLayer;
                targetIndex = i;
            }
        }
        return arr[targetIndex];
    }

    beforeLayer = getItemsBySelect(itemObjs, itemIndex);

    if (type == "up") {
        var selectMaxLayer = getMaxLayer(beforeLayer).itemLayer;
        var arr = [];
        for (var i = 0; i < itemObjs.length; i++) {
            if (itemObjs[i].get("item_layer") > selectMaxLayer) {
                arr.push({ "itemIndex": i, "itemLayer": itemObjs[i].get("item_layer") });
            }
        }
        var topMinLayer = getMinLayer(arr);

        if (!topMinLayer) return;

        afterLayer = getItemsBySelect(itemObjs, topMinLayer.itemIndex);

        for (var i = 0; i < beforeLayer.length; i++) {
            var itemObj = itemObjs[beforeLayer[i].itemIndex];
            itemObj.set("item_layer", parseInt(itemObj.get("item_layer") + afterLayer.length))
        }
        for (var i = 0; i < afterLayer.length; i++) {
            var itemObj = itemObjs[afterLayer[i].itemIndex];
            itemObj.set("item_layer", parseInt(itemObj.get("item_layer") - beforeLayer.length))
        }

    } else if (type == "down") {
        var selectMinLayer = getMinLayer(beforeLayer).itemLayer;
        var arr = [];
        for (var i = 0; i < itemObjs.length; i++) {
            if (itemObjs[i].get("item_layer") < selectMinLayer) {
                arr.push({ "itemIndex": i, "itemLayer": itemObjs[i].get("item_layer") });
            }
        }
        var topMaxLayer = getMaxLayer(arr);

        if (!topMaxLayer) return;

        afterLayer = getItemsBySelect(itemObjs, topMaxLayer.itemIndex);

        if (afterLayer.length == 1 && afterLayer[0].itemLayer == 0) return;

        for (var i = 0; i < beforeLayer.length; i++) {
            var itemObj = itemObjs[beforeLayer[i].itemIndex];
            itemObj.set("item_layer", parseInt(itemObj.get("item_layer") - afterLayer.length))
        }
        for (var i = 0; i < afterLayer.length; i++) {
            var itemObj = itemObjs[afterLayer[i].itemIndex];
            itemObj.set("item_layer", parseInt(itemObj.get("item_layer") + beforeLayer.length))
        }

    } else if (type == "toTop") {
        var selectMaxLayer = getMaxLayer(beforeLayer).itemLayer, topCount = 0;
        for (var i = 0; i < itemObjs.length; i++) {
            if (itemObjs[i].get("item_layer") > selectMaxLayer) {
                var itemObj = itemObjs[i];
                itemObj.set("item_layer", parseInt(itemObj.get("item_layer") - beforeLayer.length));
                topCount++;
            }
        }
        for (var i = 0; i < beforeLayer.length; i++) {
            var itemObj = itemObjs[beforeLayer[i].itemIndex];
            itemObj.set("item_layer", parseInt(itemObj.get("item_layer") + topCount))
        }
    } else if (type == "toBottom") {
        var selectMinLayer = getMinLayer(beforeLayer).itemLayer, bottomCount = 0;
        for (var i = 1; i < itemObjs.length; i++) {
            if (itemObjs[i].get("item_layer") < selectMinLayer) {
                var itemObj = itemObjs[i];
                itemObj.set("item_layer", parseInt(itemObj.get("item_layer") + beforeLayer.length));
                bottomCount++;
            }
        }
        for (var i = 0; i < beforeLayer.length; i++) {
            var itemObj = itemObjs[beforeLayer[i].itemIndex];
            itemObj.set("item_layer", parseInt(itemObj.get("item_layer") - bottomCount))
        }
    }
}


ElementStore.dispatchToken = MeDispatcher.register(function (action) {
    var SelectStore = require("./SelectStore");
    switch (action.type) {
        case GridTypes.ITEM_MOVE_END:
            ElementStore.emitChange();
            break;
        case ActionTypes.DRAG_SELECT:
            dragSelect(action.rect, action.selectIndex, action.sourceInfo);
            ElementStore.emitChange();
            break;

        case ActionTypes.ADD_ELEMENT:
            addElement(action.elementInfo);
            ElementStore.emitChange();
            break;

        //case ActionTypes.COPY_ELEMENT:
        //    ElementStore.emitChange();
        //    break;

        case ActionTypes.SELECT_ELEMENT:
            selectElement(action.index, action.sourceInfo);
            ElementStore.emitChange();
            break;
        case ActionTypes.MOVE_ELEMENT:

            moveAll(action.pos);
            updateTimelineFrame();
            if (action.sourceInfo && action.sourceInfo.type == "keyboard") {
                ElementStore.emitChange();
            } else {
                ElementStore.emitTimeConsuming();
            }

            break;
        case ActionTypes.UPDATE_TEXT_DIM:
        case ActionTypes.UPDATE_ELEMENT:

            updateElement(action.element, action.index, action.sourceInfo, action.uuid);
            ElementStore.emitChange();
            break;
        case ActionTypes.UPDATE_EVENT:

            updateEvent(action.name, action.index, action.value, action.opType);
            ElementStore.emitChange();
            break;
        case ActionTypes.MULTI_UPDATE:
            multiUpdate(action.changeInfo, action.sourceInfo);
            ElementStore.emitChange();
            break;
        case ActionTypes.REPLACE_ELEMENT:

            replaceElement(action.elementInfo);
            ElementStore.emitChange();
            break;
        case ActionTypes.PASTE_ELEMENT:

            //var UndoTool=require('./undotool');
            //AppDispatcher.waitFor([UndoTool.dispatchToken]);
            var elLen = store.elements.length;
            pasteElement();
            var selectArr = [];
            for (var i = elLen; i < store.elements.length; i++) {
                var addel = store.elements[i];
                if (!!addel.get("group_id") && addel.get("item_type") == 17) {
                    continue;
                }
                selectArr.push(i);
            }
            if (selectArr.length > 0) {
                selectArr = mapIndexToDisplayFrame(selectArr);
                StoreSetter.directSelect(selectArr);
            }
            ElementStore.emitChange();
            break;
        case ActionTypes.REMOVE_ELEMENT:

            //var UndoTool=require('./undotool');
            //AppDispatcher.waitFor([UndoTool.dispatchToken]);
            if (action.elementInfo) {

                if ("group_id" in action.elementInfo) {
                    //delete group

                    var item_id = action.elementInfo.group_id;
                    let group_id = getGroupIdByItemId(item_id);
                    if (group_id) {
                        removeGroup(group_id)
                    }
                }
                else {
                    //delete scribble
                    var deleteIndex;
                    var items = ElementStore.getElements();
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].attributes.item_type == 24) {
                            deleteIndex = i;
                            break;
                        }
                    }
                    if (deleteIndex) {
                        removeElement(deleteIndex);
                    }
                }

            } else {
                removeElement();
            }

            StoreSetter.directSelect([]);
            ElementStore.emitChange();
            break;
        case ActionTypes.CHANGE_LAYER:

            //var UndoTool=require('./undotool');
            //AppDispatcher.waitFor([UndoTool.dispatchToken]);
            changeLayer(action.direction, action.info); //{type:"up",par:itemobj.attribute}

            ElementStore.emitChange();
            break;

        //对于要改变device显示的所有page事件，操作都是显示选中页
        case ActionTypes.UNDO:
        case ActionTypes.REDO:
        case ActionTypes.ADD_PAGE:
        case ActionTypes.REMOVE_PAGE:
        case ActionTypes.MOVE_PAGE:
        case ActionTypes.SELECT:
        case ActionTypes.SELECT_PAGE:
        case ActionTypes.CREATE_BLANK_MAGAZINE:
        case ActionTypes.CREATE_BLANK_TEMPLATE:
        case ActionTypes.COPY_NODE:
        case ActionTypes.REMOVE_NODE:
        case ActionTypes.REPLACE_PAGE:
        case ActionTypes.ADD_GROUP:
            MeDispatcher.waitFor([SelectStore.dispatchToken, PageStore.dispatchToken]);
            StoreSetter.clearDisplayFrame();
            var selectedPage = PageStore.getSelectedPage();
            if (selectedPage instanceof Array) {
                store.elements = []
            } else if (selectedPage) {
                store.elements = selectedPage.attributes.item_object;
                store.elements.forEach((el) => {
                    if (!el.get("item_uuid")) {
                        el.set("item_uuid", uuid.generateUid());
                    }
                    if (!el.get("item_id") || el.get("item_id") == -1) {
                        el.set("item_id", uuid.generateUidNum());
                    }
                    if (typeof el.get("f_name") == "undefined") {
                        el.set("f_name", GlobalFunc.genElementName(store.elements, el));
                    }
                })
                selectElement([]);
                //StoreSetter.selectElement([]);
            }

            ElementStore.emitChange();
            break;
        case ActionTypes.SAVE_UPDATE:
        case ActionTypes.GET_TEMPLATE_DATA:
            MeDispatcher.waitFor([PageStore.dispatchToken]);
            var SelectStore = require("./SelectStore");
            var selectInfo = SelectStore.getSelectInfo();
            var selectedPage = PageStore.getSelectedPage();
            if (selectInfo.type == "group") {
                return;
            }
            if (selectedPage) {
                store.elements = selectedPage.attributes.item_object;
                store.elements.forEach((el) => {
                    if (!el.get("item_uuid")) {
                        el.set("item_uuid", uuid.generateUid());
                    }
                    if (!el.get("item_id") || el.get("item_id") == -1) {
                        el.set("item_id", uuid.generateUidNum());
                    }
                    if (typeof el.get("f_name") == "undefined") {
                        el.set("f_name", GlobalFunc.genElementName(store.elements, el));
                    }
                })
                selectElement([]);
                ElementStore.emitChange();
            }

            break;
        case ActionTypes.WORK_INIT:
            MeDispatcher.waitFor([PageStore.dispatchToken]);
            setTplMusic();
            store.elements = [];
            store.selectedElementIndex = [];
            store.edittingDisplayFrame = [];
            break;
        case ActionTypes.UPDATE_TPL:
            var tplInfo = action.tplInfo;
            if (!tplInfo) {
                return;
            }
            var type = tplInfo.type;
            if (type == "music") {
                setTplMusic(tplInfo.obj);
            }
            //selectElement(0);
            ElementStore.emitChange();
            break;
        case ActionTypes.ALIGN:

            switch (action.alignType) {
                case "left":
                case "right":
                case "top":
                case "bottom":
                    var edges = getEdgeArr();
                    alignedge(action.alignType, edges);
                    break;
                case "middle":
                case "center":
                    var edges = getEdgeArr();
                    alignCenter(action.alignType, edges);
                    break;
                case "vjustify":
                case "hjustify":
                    var edges = getEdgeArr();
                    alignJustify(action.alignType, edges);
                    break;
                case "lock":
                    lock();
                    break;
                case "unlock":
                    unLock();
                    break;
                case "compose":
                    compose();
                    break;
                case "uncompose":
                    uncompose();
                    selectElement(store.selectedElementIndex[0]);
                    break;
            }

            ElementStore.emitChange();
            break;
        case ActionTypes.EDIT_GROUP:
            if (action.editType == "end") {
                StoreSetter.endEditDisplayFrame();

            } else {
                var item_id = action.itemId;
                let group_id = getGroupIdByItemId(item_id);
                StoreSetter.selectDisplayFrame(group_id);
            }
            StoreSetter.clearSelectIndex();
            ElementStore.emitChange();

            break;
        case Timeline.ADD_TIMELINE_FRAME:
            addTimelineFrame(action.time);
            ElementStore.emitChange();
            break;
        case Timeline.REMOVE_TIMELINE_FRAME:
            removeTimelineFrame(action.time);
            ElementStore.emitChange();
            break;
        case Timeline.TIMELINE_FOCUS:
            var time = parseFloat(action.val.pos);
            if (!isNaN(time)) {
                selectTimelineFrame(time);
                ElementStore.emitChange();
            }

        default:
        // do nothing
    }

});
function updateTimelineFrame() {
    ///按元素的属性修改动画时间线的属性
    var elements = ElementStore.getDisplayFrameSelectedElement();
    var timelineFocusPos = TimelineStore.getFocus().pos;
    if (elements.length == 1 && (!isNaN(parseFloat(timelineFocusPos)))) {
        var element = elements[0]
        var attributes = element.attributes;
        if (attributes['item_animation_script']) {
            var timeObj = JSON.parse(attributes['item_animation_frame']);
            setTimelineObj(timeObj, timelineFocusPos, attributes);
            element.set("item_animation_frame", JSON.stringify(timeObj));
            element.set("item_animation_script", GlobalFunc.encodeAnimateTimeline(timeObj));
        }

    }
}
function selectTimelineFrame(time) {
    var element = ElementStore.getDisplayFrameSelectedElement()[0];
    var attributes = element.attributes;
    var timeObj = JSON.parse(attributes['item_animation_frame']);
    if (!timeObj) {
        return;
    }
    var frameProps = timeObj[time];
    //console.log(frameProps);
    if (!frameProps) {
        return;
    }
    GlobalFunc.resetTimelineFrame(element, frameProps);
    //element.set("item_top", parseFloat(frameProps.top));
    //element.set("item_left", parseFloat(frameProps.left));
    //element.set("item_width", parseFloat(frameProps.width));
    //element.set("item_height", parseFloat(frameProps.height));
    //element.set("x_scale", !isNaN(parseFloat(frameProps["x_scale"])) ? parseFloat(frameProps["x_scale"]) : 1);
    //element.set("y_scale", !isNaN(parseFloat(frameProps["y_scale"])) ? parseFloat(frameProps["y_scale"]) : 1);
    //element.set("rotate_angle", !isNaN(parseFloat(frameProps["rotate_angle"])) ? parseFloat(frameProps["rotate_angle"]) : 0);
    //element.set("item_opacity", !isNaN(parseFloat(frameProps["item_opacity"])) ? parseFloat(frameProps["item_opacity"]) * 100 : 100);
    //element.set("bg_color",typeof frameProps["bg_color"] !="undefined"?frameProps["bg_color"]:"")


}
function setTimelineObj(timelineObj, time, attributes) {
    ////把当前元素的状态设置为元素的一帧
    timelineObj[time] = {
        top: attributes["item_top"],
        left: attributes["item_left"],
        width: attributes["item_width"],
        height: attributes["item_height"],
        x_scale: typeof attributes["x_scale"] != "undefined" ? attributes["x_scale"] : 1,
        y_scale: typeof attributes["y_scale"] != "undefined" ? attributes["y_scale"] : 1,
        rotate_angle: (typeof attributes["rotate_angle"] != "undefined" ? attributes["rotate_angle"] : 0),
        item_opacity: typeof attributes["item_opacity"] != "undefined" ? (parseFloat(attributes["item_opacity"]) / 100) : 1,
        //bg_color:  typeof attributes["bg_color"]!="undefined"?attributes["bg_color"]:""
    }


    return timelineObj
}
function getTimelineValue(attributes, prop) {
    return parseFloat(attributes[prop]).toFixed(3)
}
function addTimelineFrame(time) {
    //增加关键帧
    var element = ElementStore.getDisplayFrameSelectedElement()[0];
    var attributes = element.attributes;

    var timeObj = JSON.parse(attributes['item_animation_frame']);
    if (!timeObj[0]) {
        timeObj = setTimelineObj(timeObj, 0, attributes)
    }
    timeObj = setTimelineObj(timeObj, time, attributes);
    element.set("item_animation_frame", JSON.stringify(timeObj));
}
function removeTimelineFrame(time) {
    //删除关键帧
    var element = ElementStore.getDisplayFrameSelectedElement()[0];
    var attributes = element.attributes;
    var timeObj = JSON.parse(attributes['item_animation_frame']);
    delete timeObj[time];
    element.set("item_animation_frame", JSON.stringify(timeObj));
}

function mapIndexToDisplayFrame(selectArr) {
    var allEls = ElementStore.getElements();
    var select_uuids = selectArr.map((index) => {
        return allEls[index].get("item_uuid");
    })
    var DisplayEls = ElementStore.getDisplayFrameElements();
    var ret = [];
    for (let i = 0; i < DisplayEls.length; i++) {
        var itemId = DisplayEls[i].get("item_uuid");
        if (_.indexOf(select_uuids, itemId) > -1) {
            ret.push(i);
        }
    }
    return ret;
}
function getGroupIdByItemId(itemId) {
    let group_id;
    let items = ElementStore.getElements();
    for (let i = 0; i < items.length; i++) {
        if (items[i].attributes.item_id == itemId) {
            group_id = items[i].attributes.group_id;
            break;
        }
    }
    return group_id;
}
/*
 * 设置 tpl 的music属性
 * @param: object
 *   tpl_music
 *   tpl_music_replay
 *   tpl_music_autoplay
 */
function setTplMusic(music) {
    musicObj = music || {};
    var tpl = MagazineStore.getTpl();
    if (!!tpl) {
        tpl.set("tpl_music", (musicObj.tpl_music || ""));
        tpl.set("tpl_music_replay", (musicObj.tpl_music_replay || true));
        tpl.set("tpl_music_autoplay", (musicObj.tpl_music_autoplay || true));
        tpl.set("tpl_music_lrc", (musicObj.tpl_music_lrc || ""));
        tpl.set("tpl_lrc_on", (musicObj.tpl_lrc_on || 0));
    }
}
function deleteGrpEls(els) {
    return GlobalFunc.deleteGrpEls(els);
}
function getEdgeArr() {
    var pageId = PageStore.getPageUid();
    var displayFrame = ElementStore.getDisplayFrameElements();
    var els = ElementStore.getDisplayFrameSelectedElement().slice(0);
    var selectGrps = deleteGrpEls(els);
    var topArr = [];
    var leftArr = [];
    var bottomArr = [];
    var rightArr = [];
    var heightArr = [];
    var widthArr = [];
    els.forEach((el, index) => {
        var dim = GlobalFunc.getDimAndPos(displayFrame, [el]);
        topArr.push(dim.top);
        leftArr.push(dim.left);
        bottomArr.push(topArr[index] + dim.height);
        heightArr.push(dim.height);
        rightArr.push(leftArr[index] + dim.width);
        widthArr.push(dim.width);
    });
    if (selectGrps.length > 0) {
        selectGrps.forEach((grp) => {
            var agrpEls = grp.els;
            var dimPos = GlobalFunc.getDimAndPos(displayFrame, agrpEls);
            if (!dimPos) {
                return;
            }
            topArr.push(dimPos.top), leftArr.push(dimPos.left), bottomArr.push(dimPos.top + dimPos.height);
            rightArr.push(dimPos.left + dimPos.width);
            heightArr.push(dimPos.height);
            widthArr.push(dimPos.width);
        })
    }
    return { top: topArr, left: leftArr, bottom: bottomArr, right: rightArr, height: heightArr, width: widthArr };
}

function alignJustify(type, edges) {
    if (type == "hjustify") {
        var max = _.max(edges["right"]);
    } else {
        var max = _.max(edges["bottom"]);
    }
    var dir = type == "hjustify" ? "left" : "top";
    var dim = type == "hjustify" ? "width" : "height";
    var allEls = ElementStore.getDisplayFrameElements();
    var min = _.min(edges[dir]);
    var netWidth = _.sum(edges[dim]);
    var spanSum = max - min - netWidth;
    var perSpan = spanSum / (edges[dir].length - 1);
    var centerArr = [];
    edges[dir].forEach((left, index) => {
        centerArr.push({ pos: left + edges[dim][index] / 2, index: index });
    });
    centerArr.sort(function (a, b) {
        return a.pos - b.pos;
    });
    var els = ElementStore.getDisplayFrameSelectedElement().slice(0);
    var selectGrps = deleteGrpEls(els);
    selectGrps.forEach((grp) => {
        els.push(grp);
    });
    if (centerArr.length > 1) {
        centerArr[0].oriPos = centerArr[0].pos;
        centerArr[0].pos = min + (edges[dim][centerArr[0].index]) / 2;
    }
    for (var i = 1; i < centerArr.length; i++) {
        //上个元素的一半 + 间隔 + 当前元素的一半
        centerArr[i].oriPos = centerArr[i].pos;
        centerArr[i].pos = centerArr[i - 1].pos + perSpan + (edges[dim][centerArr[i - 1].index] + edges[dim][centerArr[i].index]) / 2;
    }
    for (var i = 0; i < centerArr.length; i++) {
        //上个元素的一半 + 间隔 + 当前元素的一半
        var oriPos = centerArr[i].oriPos;

        var el = els[centerArr[i].index];
        if (el.children) {
            //group
            if (!el.locked) {
                var diff = oriPos - centerArr[i].pos;
                el.els.forEach((item) => {
                    var oriVal = item.get("item_" + dir);
                    item.set("item_" + dir, oriVal - diff);
                })
            }
        } else if (!ClientState.isLocked(el.get("item_uuid"), PageStore.getPageUid())) {
            var elNum = centerArr[i].pos;
            var group_id = el.get("group_id");
            if (!!group_id && el.get("item_type") != 17) {
                for (var gi = 0; gi < allEls.length; gi++) {
                    var cgrpId = allEls[gi].get("group_id");
                    if (!!cgrpId && cgrpId == group_id && allEls[gi].get("item_type") == 17) {
                        var frameNum = allEls[gi].get("item_" + dir);
                        if (!isNaN(frameNum)) {
                            elNum = elNum - frameNum
                        }
                        break;
                    }
                }
            }
            el.set("item_" + dir, elNum - edges[dim][centerArr[i].index] / 2);
        }
    }
}
function alignCenter(type, edges) {
    var pageId = PageStore.getPageUid();
    var allEls = ElementStore.getDisplayFrameElements();
    var els = ElementStore.getDisplayFrameSelectedElement().slice(0);
    var selectGrps = deleteGrpEls(els);
    _.remove(els, (el) => {
        return ClientState.isLocked(el.get("item_uuid"), pageId)
    });

    var target;
    if (type == "middle") {
        var min = _.min(edges["top"]);
        var max = _.max(edges["bottom"]);
        target = (min + max) / 2;
        els.forEach((el, index) => {
            var elNum = target;
            var group_id = el.get("group_id");
            if (!!group_id && el.get("item_type") != 17) {
                for (var i = 0; i < allEls.length; i++) {
                    var cgrpId = allEls[i].get("group_id");
                    if (!!cgrpId && cgrpId == group_id && allEls[i].get("item_type") == 17) {
                        var frameNum = allEls[i].get("item_top");
                        if (!isNaN(frameNum)) {
                            elNum = elNum - frameNum
                        }
                        break;
                    }
                }
            }
            el.set("item_top", elNum - edges["height"][index] / 2)
        });

        if (selectGrps.length > 0) {
            selectGrps.forEach((grp) => {
                if (!grp.locked) {
                    var agrpEls = grp.els;
                    var dimPos = GlobalFunc.getDimAndPos(allEls, agrpEls);
                    if (!dimPos) {
                        return;
                    }
                    var diff = dimPos["top"] + dimPos["height"] / 2 - target;
                    agrpEls.forEach((el) => {
                        var oriVal = el.get("item_top");
                        el.set("item_top", oriVal - diff);
                    })

                }
            })
        }

    } else {
        var min = _.min(edges["left"]);
        var max = _.max(edges["right"]);
        target = (min + max) / 2;
        els.forEach((el, index) => {
            var elNum = target;
            var group_id = el.get("group_id");
            if (!!group_id && el.get("item_type") != 17) {
                for (var i = 0; i < allEls.length; i++) {
                    var cgrpId = allEls[i].get("group_id");
                    if (!!cgrpId && cgrpId == group_id && allEls[i].get("item_type") == 17) {
                        var frameNum = allEls[i].get("item_left");
                        if (!isNaN(frameNum)) {
                            elNum = elNum - frameNum
                        }
                        break;
                    }
                }
            }
            el.set("item_left", elNum - edges["width"][index] / 2)
        });
        if (selectGrps.length > 0) {
            selectGrps.forEach((grp) => {
                if (!grp.locked) {
                    var agrpEls = grp.els;
                    var dimPos = GlobalFunc.getDimAndPos(allEls, agrpEls);
                    if (!dimPos) {
                        return;
                    }
                    var diff = dimPos["left"] + dimPos["width"] / 2 - target;
                    agrpEls.forEach((el) => {
                        var oriVal = el.get("item_left");
                        el.set("item_left", oriVal - diff);
                    })

                }
            })
        }
    }
}
function alignedge(type, edges) {
    var pageId = PageStore.getPageUid();
    var els = ElementStore.getDisplayFrameSelectedElement().slice(0);
    var allEls = ElementStore.getDisplayFrameElements();
    var selectGrps = deleteGrpEls(els);
    _.remove(els, (el) => {
        return ClientState.isLocked(el.get("item_uuid"), pageId)
    });

    var edgeArr = edges[type];
    if (type == "left" || type == "top") {
        var targetNum = _.min(edgeArr);
        els.forEach((el) => {
            var elNum = targetNum;
            var group_id = el.get("group_id");
            if (!!group_id && el.get("item_type") != 17) {
                for (var i = 0; i < allEls.length; i++) {
                    var cgrpId = allEls[i].get("group_id");
                    if (!!cgrpId && cgrpId == group_id && allEls[i].get("item_type") == 17) {
                        var frameNum = allEls[i].get("item_" + type);
                        if (!isNaN(frameNum)) {
                            elNum = elNum - frameNum
                        }
                        break;
                    }
                }
            }
            el.set("item_" + type, elNum);
        });
        if (selectGrps.length > 0) {
            selectGrps.forEach((grp) => {
                if (!grp.locked) {
                    var agrpEls = grp.els;
                    var dimPos = GlobalFunc.getDimAndPos(allEls, agrpEls);
                    if (!dimPos) {
                        return;
                    }
                    var diff = dimPos[type] - targetNum;
                    agrpEls.forEach((el) => {
                        var oriVal = el.get("item_" + type);
                        el.set("item_" + type, oriVal - diff);
                    })

                }
            })
        }
    } else if (type == "bottom" || type == "right") {
        var targetNum = _.max(edgeArr);
        var transType = "top", transDim = "height";
        if (type == "right") {
            transType = "left", transDim = "width"
        }

        els.forEach((el, index) => {
            el.set("item_" + transType, targetNum - edges[transDim][index]);

            var elNum = targetNum;
            var group_id = el.get("group_id");
            if (!!group_id && el.get("item_type") != 17) {
                for (var i = 0; i < allEls.length; i++) {
                    var cgrpId = allEls[i].get("group_id");
                    if (!!cgrpId && cgrpId == group_id && allEls[i].get("item_type") == 17) {
                        var frameNum = allEls[i].get("item_" + transType);
                        if (!isNaN(frameNum)) {
                            elNum = elNum - frameNum
                        }
                        break;
                    }
                }
            }
            el.set("item_" + transType, elNum - edges[transDim][index]);

        });

        if (selectGrps.length > 0) {
            selectGrps.forEach((grp) => {
                if (!grp.locked) {
                    var agrpEls = grp.els;
                    var dimPos = GlobalFunc.getDimAndPos(allEls, agrpEls);
                    if (!dimPos) {
                        return;
                    }
                    var diff = dimPos[transType] + dimPos[transDim] - targetNum;
                    agrpEls.forEach((el) => {
                        var oriVal = el.get("item_" + transType);
                        el.set("item_" + transType, oriVal - diff);
                    })

                }
            })
        }
    }
}

function lock() {
    var els = ElementStore.getDisplayFrameSelectedElement();
    ClientState.lock(els, PageStore.getPageUid())
}
function unLock() {
    var els = ElementStore.getDisplayFrameSelectedElement();
    ClientState.unlock(els, PageStore.getPageUid())
}

function compose() {
    var selectel = ElementStore.getDisplayFrameSelectedElement();
    ClientState.compose(selectel, PageStore.getPageUid());

}

function uncompose() {
    var selectel = ElementStore.getDisplayFrameSelectedElement();
    ClientState.uncompose(selectel, PageStore.getPageUid());
}

function multiUpdate(changeInfo, sourceInfo) {

    var pageId = PageStore.getPageUid();
    var els = ElementStore.getDisplayFrameSelectedElement();
    var allEls = ElementStore.getDisplayFrameElements();
    var dimPos = GlobalFunc.getDimAndPos(allEls, els);
    var scalex, scaley;
    var moveTop = false, moveLeft = false;
    if (!!changeInfo.top || changeInfo.top == 0) {
        moveTop = true;
    }
    if (!!changeInfo.left || changeInfo.left == 0) {
        moveLeft = true;
    }
    if (!!changeInfo.dy) {
        if (moveTop) {
            if (dimPos.height < MINIWIDTH && changeInfo.dy > 0) {
                return;
            }
            scaley = (dimPos.height - changeInfo.dy) / dimPos.height;
        } else {
            if (dimPos.height < MINIWIDTH && changeInfo.dy < 0) {
                return;
            }
            scaley = (dimPos.height + changeInfo.dy) / dimPos.height;
        }
    }
    if (!!changeInfo.dx) {
        if (moveLeft) {
            if (dimPos.width < MINIWIDTH && changeInfo.dx > 0) {
                return;
            }
            scalex = (dimPos.width - changeInfo.dx) / dimPos.width;
        } else {
            if (dimPos.width < MINIWIDTH && changeInfo.dx < 0) {
                return;
            }
            scalex = (dimPos.width + changeInfo.dx) / dimPos.width;
        }
    }

    if (sourceInfo && sourceInfo.shift) {
        if (scalex) {
            scaley = scalex;
            if (moveTop) {
                changeInfo.dy = dimPos.height * (1 - scalex)
            } else {
                changeInfo.dy = dimPos.height * (scalex - 1)
            }

        } else {
            return;
        }

    }
    if (!!scaley) {
        els.forEach((el) => {
            if (ClientState.isLocked(el.get("item_uuid"), pageId) || el.get("item_type") == 10) {
                return;
            }
            var elDimPos = GlobalFunc.getDimAndPos(allEls, [el]);
            var newHeight = elDimPos.height * scaley;
            if (newHeight < MINIWIDTH) {
                return;
            }
            var type = el.get("item_type");
            if (!GlobalFunc.ifChangeWH(type)) {
                return
            }
            var ys = el.get("y_scale");
            var fs = parseFloat(el.get("font_size"));
            if (GlobalFunc.ifScale(el)) {
                var changeScale = true;
                if (el.get('item_type') == Elements.text && !GlobalFunc.isLineFeedText(el.attributes)) {
                    var targetFontSize = fs * scaley* ys
                    if (targetFontSize > MeConstants.Defaults.MINFONTSIZE && targetFontSize < MeConstants.Defaults.MAXFONTSIZE) {
                        changeScale = false;
                        var lineHeight = el.attributes["line_height_nodefault"]
                        if (lineHeight == undefined) {
                            lineHeight = el.attributes["line_height"]
                        }
                        el.set("line_height_nodefault", lineHeight * scaley);
                        el.set("font_size", `${targetFontSize}px`);
                        el.set("y_scale", 1);
                        el.set("x_scale", (el.get("x_scale") / scaley)/ys);
                        var fa = el.attributes['fix_attr'];
                        if (fa) {
                            var dimobj = JSON.parse(fa);
                            // console.log(dimobj.itemWidth*el.get("x_scale") * scaley,"scale before")
                            dimobj.itemWidth *= scaley;
                            // console.log(dimobj.itemWidth*el.get("x_scale"),"scale after",el.get("x_scale"));
                            // if(dimobj.itemWidth*el.get("x_scale")>200){
                            //     debugger;
                            // }
                            el.set("fix_attr", JSON.stringify(dimobj))
                        }
                    }

                }

                //var ys = el.get("y_scale");
                if (changeScale) {
                    el.set("y_scale", ys * scaley);
                }
                // 

            } else {
                if (!GlobalFunc.canChangeHeight(el.get("item_type"))) {
                    return;
                }
                el.set("item_height", newHeight / ys);
            }


            if (moveTop) {

                var newTop = dimPos.top + changeInfo.dy + (elDimPos.top - dimPos.top) * scaley;
                //var newTop =dimPos.top+dimPos.height- dimPos.height*scaley+ (elDimPos.top - dimPos.top) * scaley;
                //var newTop =elDimPos.top+elDimPos.height- elDimPos.height*scaley;

            } else {
                newTop = dimPos.top + (elDimPos.top - dimPos.top) * scaley;
            }
            var group_id = el.get("group_id");
            if (!!group_id && el.get("item_type") != 34) {
                for (var i = 0; i < allEls.length; i++) {
                    var temp = allEls[i]
                    var igroupId = temp.get("group_id");
                    if (igroupId && igroupId == group_id) {
                        if (temp.get("item_type") == "17" || temp.get("item_type") == "34") {
                            var frameTop = temp.get("item_top");
                            newTop = isNaN(frameTop) ? newTop : newTop - frameTop;
                            break;
                        }
                    }
                }
            }
            el.set("item_top", newTop);
        })
        if (els.length == 1) {
            updateTimelineFrame();
        }
    }
    if (!!scalex) {
        els.forEach((el) => {
            if (ClientState.isLocked(el.get("item_uuid"), pageId) || el.get("item_type") == 10) {
                return;
            }
            var elDimPos = GlobalFunc.getDimAndPos(allEls, [el]);
            var newWidth = elDimPos.width * scalex;
            if (newWidth < MINIWIDTH) {
                return;
            }
            var type = el.get("item_type");
            if (!GlobalFunc.ifChangeWH(type)) {
                return
            }
            var xs = el.get("x_scale");
            if (GlobalFunc.ifScale(el)) {
                //var xs = el.get("x_scale");
                el.set("x_scale", xs * scalex);
            } else {
                el.set("item_width", newWidth / xs);
            }

            var newLeft;
            if (moveLeft) {
                newLeft = dimPos.left + changeInfo.dx + (elDimPos.left - dimPos.left) * scalex;
                //var newLeft =dimPos.left+dimPos.width- dimPos.width*scalex+ (elDimPos.left - dimPos.left) * scalex;
            } else {
                newLeft = dimPos.left + (elDimPos.left - dimPos.left) * scalex;
            }

            var group_id = el.get("group_id");
            if (!!group_id && el.get("item_type") != 34) {
                for (var i = 0; i < allEls.length; i++) {
                    var temp = allEls[i]
                    var igroupId = temp.get("group_id");
                    if (igroupId && igroupId == group_id) {
                        if (temp.get("item_type") == "17" || temp.get("item_type") == "34") {
                            var frameLeft = temp.get("item_left");
                            newLeft = isNaN(frameLeft) ? newLeft : newLeft - frameLeft;
                            break;
                        }
                    }
                }
            }
            el.set("item_left", newLeft);
        })
        if (els.length == 1) {
            updateTimelineFrame();
        }
    }
}

function moveAll(pos) {
    if (!pos.left) {
        pos.left = 0
    }
    if (!pos.top) {
        pos.top = 0
    }
    var els = ElementStore.getDisplayFrameSelectedElement().slice(0);
    var selectGrp = deleteGrpEls(els);
    var pageId = PageStore.getPageUid();
    for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (ClientState.isLocked(el.get("item_uuid"), pageId)) {
            continue;
        }
        var oriLeft = el.get("item_left");
        var oriTop = el.get("item_top");
        el.set("item_left", pos.left + oriLeft);
        el.set("item_top", pos.top + oriTop);
    }
    selectGrp.forEach((grp) => {
        if (grp.locked) return;
        grp.els.forEach((el) => {
            var oriLeft = el.get("item_left");
            var oriTop = el.get("item_top");
            el.set("item_left", pos.left + oriLeft);
            el.set("item_top", pos.top + oriTop);
        })
    })
}

function dragSelect(rect, selectIndex, sourceInfo) {
    var elements = ElementStore.getDisplayFrameElements();
    var willSelect = [];
    elements.forEach((el, index) => {
        var item_type = el.get("item_type");
        if (item_type == 17 || (item_type == 1 && !el.get("group_id")) || item_type == 24 || item_type == 7) {
            //pictureframe and backgroud
            return;
        }
        var dimPos = GlobalFunc.getDimAndPos(elements, [el]);
        if (GlobalFunc.rectIntersect(rect, {
            x1: dimPos.left,
            y1: dimPos.top,
            x2: dimPos.left + dimPos.width,
            y2: dimPos.top + dimPos.height
        })) {
            willSelect.push(index);
        }
    });
    if (sourceInfo.ctrlPressed) {
        selectIndex.forEach((index) => {
            var inWillArr = _.indexOf(willSelect, index);
            if (inWillArr > -1) {
                willSelect.splice(inWillArr, 1);
            }
        })
    }
    if (willSelect.length > 0) {
        var selObjs = willSelect.map((index) => {
            return elements[index];
        });
        var selectGrp = deleteGrpEls(selObjs);
        selectGrp.forEach((grp) => {
            var groupEls = ClientState.getGroupElsByEl(grp.els[0]);
            if (groupEls.length > 0) {
                groupEls.forEach((elInfo) => {
                    for (var index = 0; index < elements.length; index++) {
                        if (elements[index].get("item_uuid") == elInfo.id) {
                            if (_.indexOf(willSelect, index) == -1)
                                willSelect.push(index);
                            break;
                        }
                    }
                });
            }
        });
    }
    StoreSetter.directSelect(willSelect);

}
module.exports = ElementStore;