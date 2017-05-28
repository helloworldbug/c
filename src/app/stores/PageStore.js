/**
 * @component PageStore
 * @description 页Store
 * @time 2015-08-27 11:29
 * @author StarZou
 **/

var EventEmitter = require('events').EventEmitter;
var MeDispatcher = require('../dispatcher/MeDispatcher');
var MeConstants = require('../constants/MeConstants');
var WorkDataUtil = require('../utils/WorkDataUtil');
var ActionTypes = MeConstants.ActionTypes;
var CHANGE_EVENT = MeConstants.Events.CHANGE;
var ElementType = MeConstants.Elements;
var RedEnvelope = require("../components/Common/RedEnvelope");
var uuid = require("uuid");
var elementid = require('../utils/numuid');

var PageInit = require("../components/Common/PageInit");


var pageRenderVersions = {};
var DEFAULTVERSION = 5.0;
var workInitVersion = 0;

//是否是二次编辑
var isReEdit = false;
var PageSetter = {

    selectPage: function (index) {
        if (index < 0 || index >= store.pages.length) {
            console.error("selectPage  error");
            return;
        }
        store.selectedPageIndex = index;
    },

    addPage: function (obj, index) {
        if (typeof  index == "undefined") {
            store.pages.push(obj);
        } else {
            store.pages.splice(index, 0, obj);
        }

    },

    repalcePage: function (index, obj) {
        store.pages[index] = obj;
    },
    setPage    : function (obj) {
        store.pages = obj;
    },
    clear      : function () {
        store.pages = [];
        store.selectedPageIndex = -1
    }

};

// 仓库
var store = {
    pages            : [],// 所有页数据
    selectedPageIndex: -1// 当前选中页索引
};

// AvOS对象
var templateObject,// 模板对象
    tplData; // 模板数据对象


var PageStore = Object.assign({}, EventEmitter.prototype, {

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getPages: function () {
        return store.pages;
    },

    getSelectedPageIndex: function () {
        return store.selectedPageIndex;
    },

    getSelectedPage: function () {
        var SelectStore = require("./SelectStore");
        var seleceInfo = SelectStore.getSelectInfo();
        if (seleceInfo.type == "page") {
            var selectIndex = seleceInfo.index.split("|");
            return store.pages ? store.pages[selectIndex[selectIndex.length - 1]] : null
        } else if (seleceInfo.type == "group") {
            return store.pages;
        }
    },


    setTpl: function (tpl) {
        templateObject = tpl;
    },

    setTplData: function (data) {
        tplData = data;
    },

    getPageUid: function () {
        var page = PageStore.getSelectedPage();
        if (page && page.get) {
            return page.get("page_uid");
        }
    },

    /*
     * 设置是否是二次编辑
     */
    setIsReEdit: function (o) {
        isReEdit = o || false;
    },
    getIsReEdit: function () {
        return isReEdit
    },

    /*
     * 在 renderVersion 中筛选高版本号
     */
    getMaxRenderVersion: function () {
        var pages = PageStore.getPages();
        var len = pages.length;
        var version = parseFloat(DEFAULTVERSION);
        for (var i = 0; i < len; i++) {
            var pageUid = pages[i].get("page_uid");
            var pageVersion = parseFloat(pageRenderVersions[pageUid]);
            if (version < pageVersion) {
                version = pageVersion
            }
        }
        if (version < parseFloat(workInitVersion)) {
            version = workInitVersion;
        }
        return version;

    }

});

PageStore.dispatchToken = MeDispatcher.register(function (action) {
    var SelectStore = require("./SelectStore");
    var GlobalFunc = require('../components/Common/GlobalFunc');
    switch (action.type) {
        case  ActionTypes.UPDATE_ATTR:
            var selectInfo = action.selectInfo;
            if (selectInfo.type == "page") {
                GlobalFunc.updateObj(PageStore.getSelectedPage(), action.data);
                PageStore.emitChange();
            }
            break;
        case  ActionTypes.DRAG_NODE:
        case ActionTypes.SELECT:
            //var selectInfo=payload.data;
            MeDispatcher.waitFor([SelectStore.dispatchToken]);
            var selectInfo = SelectStore.getSelectInfo();
            var MagazineStore = require("./MagazineStore");
            var workData = MagazineStore.getWorkData();
            store.pages = getSelectGroupPages(workData, selectInfo) || [];

            PageStore.emitChange();
            break;
        case  ActionTypes.DRAG_NODE:
            MeDispatcher.waitFor([SelectStore.dispatchToken]);
            var selectInfo = SelectStore.getSelectInfo();
            var MagazineStore = require("./MagazineStore");
            var workData = MagazineStore.getWorkData();
            store.pages = getSelectGroupPages(workData, selectInfo) || [];
            break;
        case ActionTypes.SAVE_UPDATE:
            var MagazineStore = require("./MagazineStore");
            MeDispatcher.waitFor([SelectStore.dispatchToken, MagazineStore.dispatchToken]);
            var workData = MagazineStore.getWorkData();
            var selectInfo = SelectStore.getSelectInfo();
            store.pages = getSelectGroupPages(workData, selectInfo);
            break;
        case ActionTypes.GET_TEMPLATE_DATA:
            templateObject = action.templateObject;// 设置模板对象 tpl
            workInitVersion = parseFloat(templateObject.get("render_version"));
            var MagazineStore = require("./MagazineStore");
            MeDispatcher.waitFor([SelectStore.dispatchToken, MagazineStore.dispatchToken]);
            var workData = MagazineStore.getWorkData();
            var selectInfo = SelectStore.getSelectInfo();
            store.pages = getSelectGroupPages(workData, selectInfo);
            WorkDataUtil.setReEdit(action.reEdit);
            break;
        case ActionTypes.CREATE_BLANK_TEMPLATE:
        case ActionTypes.CREATE_BLANK_MAGAZINE:
        case ActionTypes.COPY_NODE:
        case  ActionTypes.REMOVE_NODE:
        case ActionTypes.UNDO:
        case ActionTypes.REDO:
            var MagazineStore = require("./MagazineStore");
            MeDispatcher.waitFor([SelectStore.dispatchToken, MagazineStore.dispatchToken]);
            var workData = MagazineStore.getWorkData();
            var selectInfo = SelectStore.getSelectInfo();
            store.pages = getSelectGroupPages(workData, selectInfo);
            PageStore.emitChange();
            break;
        case ActionTypes.WORK_INIT:
            templateObject = undefined;
            tplData = undefined;
            workInitVersion = 0;

            store.pages = [];
            store.selectedPageIndex = -1;
            break;
        case ActionTypes.UPDATE_PAGEPROP:
            updatePageProps(action.updateObj);
            PageStore.emitChange();
            break;
        case ActionTypes.ADD_GROUP:

            MeDispatcher.waitFor([SelectStore.dispatchToken]);
            MagazineStore = require("./MagazineStore");
            var workData = MagazineStore.getWorkData();
            var selectInfo = SelectStore.getSelectInfo();
            store.pages = getSelectGroupPages(workData, selectInfo);
            //var MagazineStore = require("./MagazineStore");
            //MeDispatcher.waitFor([MagazineStore.dispatchToken]);
            //var targetID, targetType;
            //
            //var SelectStore = require("./SelectStore");
            //var selectInfo = SelectStore.getSelectInfo();
            //targetID = selectInfo.index;
            //targetType = selectInfo.type;
            //var GroupInit = require("../components/Common/GroupInit");
            //var parentID=selectInfo.index;
            //if(targetType=="page"){
            //    parentID=GlobalFunc.getParent(parentID)
            //}
            //var MagazineStore = require("./MagazineStore");
            //var parent = GlobalFunc.getObjRef(MagazineStore.getWorkData(),parentID);
            //if (targetType == "page") {
            //    var pageIndex = GlobalFunc.getLastLayerIndex(targetID);
            //    store.pages.splice(+pageIndex + 1, 0, GroupInit.createBlankGroup(parent, "组"));
            //    store.pages=store.pages[+pageIndex + 1].get("items");
            //    //GlobalFunc.addGroup(selectInfo.index,MagazineStore.getWorkData());
            //}else{
            //
            //    MeDispatcher.waitFor([SelectStore.dispatchToken]);
            //    var workData = MagazineStore.getWorkData();
            //    var selectInfo = SelectStore.getSelectInfo();
            //    store.pages = getSelectGroupPages(workData, selectInfo);
            //    PageStore.emitChange();
            //}
            break;
        case ActionTypes.ADD_PAGE:
            var targetID, targetType;
            var SelectStore = require("./SelectStore");
            var selectInfo = SelectStore.getSelectInfo();
            targetID = selectInfo.index;
            targetType = selectInfo.type;
            var parentID = selectInfo.index;
            if (targetType == "page") {
                parentID = GlobalFunc.getParent(parentID)
                var index = +GlobalFunc.getLastLayerIndex(selectInfo.index) + 1
            }

            var MagazineStore = require("./MagazineStore");
            var parent = GlobalFunc.getObjRef(MagazineStore.getWorkData(), parentID);
            parent.set("f_collapse", false);
            if (action.pageInfo) {
                addPageWithModule(action.pageInfo, parent);
            } else {
                addBlankPage(parent, index);
            }
            //PageSetter.selectPage(PageStore.getSelectedPageIndex() + 1);
            break;
        case ActionTypes.REPLACE_PAGE:
            var parent = store.pages[0].get("parent");
            var pageInfo = action.pageInfo;
            if (pageInfo) {
                replacePageWithModule(pageInfo, parent);
                //PageSetter.selectPage(PageStore.getPages().length - 1)
            }
            setClientState("edited", true);
            PageStore.emitChange();
            break;


        case ActionTypes.ADD_ELEMENT:
        case ActionTypes.UPDATE_ELEMENT:
        case ActionTypes.REMOVE_ELEMENT:
        case ActionTypes.PASTE_ELEMENT:
        case ActionTypes.REPLACE_ELEMENT:
        case  ActionTypes.ALIGN:
        case ActionTypes.MULTI_UPDATE:
        case  ActionTypes.MOVE_ELEMENT:
        case  ActionTypes.CHANGE_LAYER:
            var ElementStore = require("./ElementStore");
            MeDispatcher.waitFor([ElementStore.dispatchToken]);
            setClientState("edited", true);
            break;
        default:
        // do nothing
    }

    //console.log('PageStore action: ', action);
    //console.log('PageStore store: ', store);
});

module.exports = PageStore;
function updatePageProps(obj) {
    var page = PageStore.getSelectedPage();
    if (page) {
        for (var name in obj) {
            page.set(name, obj[name])
        }
    }
}
function setClientState(key, value, pages) {
    if (pages && pages.length > 0) {
        var PageObjs = PageStore.getPages();
        for (var pageIndex of pages) {
            var page = PageObjs[pageIndex];
            page.set(key, value)
        }
    } else {
        var selectedPage = PageStore.getSelectedPage();
        selectedPage.set(key, value)
    }

}

function undo(payload) {
    switch (payload.type) {
        case "replacePage":
            undoReplacePage(payload);
            break;
        case 'addPage':
            //var deletePageIndex=payload.pageIndex||(PageStore.getPages().length-1);
            removePage(PageStore.getPages().length - 1); //目前只添加到最后页
            break;
        case "copyPage":
            var pageIndex = store.pages.length - 1;
            removePage(pageIndex);
            PageSetter.selectPage(pageIndex - 1);
            break;
        case "movePage":
            movePage(payload.newIndex, payload.oldIndex);
            break;
        case "removePage":
            var pages = PageStore.getPages();
            pages.splice(payload.pageIndex, 0, payload.data);
            break;


    }
}

function redo(payload) {
    switch (payload.type) {
        case "replacePage":
            redoReplacePage(payload);
            break;
        case 'addPage':
            var pageInfo = payload.pageInfo;
            if (!!pageInfo) {
                addPage(pageInfo.pageObj[0])
            } else {
                addBlankPage()
            }
            break;

        case "copyPage":
            copyPage(payload.pageIndex);
            break;
        case "movePage":
            movePage(payload.oldIndex, payload.newIndex);
            break;
        case "removePage":
            removePage(payload.pageIndex);
            //pages.splice(payload.pageIndex, 0, payload.data);
            break;
    }
}
function initPageWithModule(pageObj, version) {

    var _itemObj = pageObj.get("item_object"), jlen = _itemObj.length;
    _itemObj.sort(WorkDataUtil.elementsLayerSort);
    for (var j = 0; j < jlen; j++) {
        let item = _itemObj[j];
        item.set("item_layer", j);
        if (!item.get("item_id") || item.get("item_id") == -1 || item.get("item_id") == 1) {
            item.set("item_id", elementid.generateUidNum())
        }

    }
    var newPage = WorkDataUtil.clonePages([pageObj])[0];
    var uid = uuid.v4();
    console.log(uid);
    pageRenderVersions[uid] = version;
    newPage.set("page_uid", uid);
    return newPage;
}
function replacePageWithModule(pageInfo, parent) {
    var GlobalFunc = require('../components/Common/GlobalFunc');
    var page = initPageWithModule(pageInfo.pageObj[0], pageInfo.pageRenderVersion);

    //增加元素名称
    var itemObject = page.attributes.item_object;
    itemObject.forEach((item) => {
        if (!item.get("f_name")) {
            item.set("f_name", GlobalFunc.genElementName(itemObject, item));
        }
    });

    page.set("parent", parent);
    GlobalFunc.copyPageEvents(page);
    var SelectStore = require("./SelectStore");
    var GlobalFunc = require("../components/Common/GlobalFunc")
    var selectPageIndex = +GlobalFunc.getLastLayerIndex(SelectStore.getSelectInfo().index);
    page.set("f_name", store.pages[selectPageIndex].get("f_name"));
    PageSetter.repalcePage(selectPageIndex, page);

}
function addPageWithModule(pageInfo, parent) {
    var page = initPageWithModule(pageInfo.pageObj[0], pageInfo.pageRenderVersion);
    page.set("parent", parent);
    var GlobalFunc = require('../components/Common/GlobalFunc');
    GlobalFunc.copyPageEvents(page);
    addPage(page);
}
function copyPage(index) {
    var GlobalFunc = require('../components/Common/GlobalFunc');
    var oriPage = PageStore.getPages()[index];
    var allPages = PageStore.getPages()
    var elements = oriPage.get("item_object");
    for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        var itemType = el.get("item_type")
        if (itemType == ElementType.redEnvelope || itemType == ElementType.shake) {
            if (GlobalFunc.existInWork(allPages, itemType)) {
                GlobalFunc.addSmallTips("当前页元素一个作品只能添加一个，不能复制", null, {clickCancel: true})
                return false;
            }
        }

    }
    var page = WorkDataUtil.clonePages([oriPage])[0];
    GlobalFunc.copyPageEvents(page);
    addPage(page);
    return true;
}
function addPage(pageObj) {
    //var _pages = page;
    //_pages = cloneTplPages(_pages)[0];
    //pageObj.set("page_width", 640);
    //pageObj.set("page_height", 1008);
    PageSetter.addPage(pageObj);

}
function removePage(index) {
    var pageObjs = PageStore.getPages();
    pageObjs.splice(index, 1);
    if (store.selectedPageIndex > 0) {
        PageSetter.selectPage(store.selectedPageIndex - 1);
    }
}
function movePage(moveIndex, targetIndex) {
    if (moveIndex == targetIndex) return;
    var pageObjs = PageStore.getPages();
    pageObjs.splice(targetIndex, 0, pageObjs.splice(moveIndex, 1)[0]);


    if ((moveIndex > store.selectedPageIndex) && (targetIndex <= store.selectedPageIndex)) {
        //选中页后面到前面
        PageSetter.selectPage(store.selectedPageIndex + 1)

    } else if ((moveIndex < store.selectedPageIndex) && (targetIndex >= store.selectedPageIndex)) {
        PageSetter.selectPage(store.selectedPageIndex - 1)
    } else if (moveIndex == store.selectedPageIndex) {
        PageSetter.selectPage(targetIndex);
    }
}
//临时接口
var tplgroup = {
    create: function () {
        var Group = AV.Object.extend('tpl_group');
        return new Group();
    }
}


/*
 * @method: 添加一个空白页
 */
function addBlankPage(parent, index, name) {
    var ElementInit = require("../components/Common/ItemInit");
    var item_obj = ElementInit.createBlankItemObj();
    item_obj.set("f_name", "背景1");
    var page_obj = PageInit.createBlankPageObj(name);
    page_obj.set("item_object", [item_obj]);
    page_obj.set("page_uid", uuid.v4());
    page_obj.set("parent", parent);
    PageSetter.addPage(page_obj, index);
    // pageObjs.push(page_obj);
    // this.setPageIndex(pageObjs.length-1);
}

function undoReplacePage(payload) {
    var opPageIndex = payload.pageIndex;
    var pageObj = WorkDataUtil.clonePages([payload.undoObj])[0];

    if ((opPageIndex || opPageIndex == 0) && opPageIndex !== PageStore.getSelectedPageIndex()) {
        PageSetter.selectPage(opPageIndex);
    }
    PageSetter.repalcePage(opPageIndex, pageObj);
}

function redoReplacePage(payload) {
    var opPageIndex = payload.pageIndex;
    var pageObj = WorkDataUtil.clonePages([payload.redoObj])[0];
    if ((opPageIndex || opPageIndex == 0) && opPageIndex !== PageStore.getSelectedPageIndex()) {
        PageSetter.selectPage(opPageIndex);
    }
    PageSetter.repalcePage(opPageIndex, pageObj);

}


//取选中的分组里所有的页
function getSelectGroupPages(workData, selectInfo) {
    var type = selectInfo.type;
    var groupID;
    //if( selectInfo.index.indexOf("|")==-1){
    //    return workData.attributes["items"];
    //}
    if (type == "page") {
        var seleceIndex = selectInfo.index.split("|");
        seleceIndex.pop();
        groupID = seleceIndex.join("|");
    } else if (type == "group") {
        groupID = selectInfo.index
    } else {
        throw "select ID error"
    }

    var group = workData.attributes["items"];
    var IDArr = groupID.split("|");
    for (var layer = 0; layer < IDArr.length; layer++) {
        var index = IDArr[layer];
        if (!group[index].attributes["items"]) {
            group[index].set("items", []);
        }
        group = group[index].attributes["items"];
    }
    return group;
}
