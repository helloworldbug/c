/**
 * Created by lifeng on 2015/8/4.
 *
 * modal for a work ,
 * 作品的数据模型，保存整个作品的数据的树型结果
 * 业务包括组的增删改、组页拖动
 *
 */
var MeDispatcher = require('../dispatcher/MeDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constans = require("../constants/MeConstants");
var _ = require('lodash');
var ActionTypes = Constans.ActionTypes;
var uuid = require("uuid");
var CHANGE_EVENT = 'change';
var GlobalFunc = require("../components/Common/GlobalFunc");
var WorkDataUtil = require('../utils/WorkDataUtil');
var ClientState = require("../utils/ClientState");
var PageInit = require("../components/Common/PageInit");
var templateObject, tplData;

var MagazineStore = Object.assign({}, EventEmitter.prototype, {
    getWorkData         : function () {
        return tplData;
    },
    getDatas            : function (ID) {
        return GlobalFunc.getObjRef(tplData, ID);
    },
    emitChange          : function () {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener   : function (callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    updateTpl:function(key,value){
        templateObject.set(key,value);
    },
    getTpl              : function () {
        if(typeof templateObject!="undefined"){
            typeof templateObject.get("page_style")=="undefined"&&templateObject.set("page_style", 1); //页码样式
            typeof templateObject.get("list_style")=="undefined"&&templateObject.set("list_style", 1); //目录样式
        }

        return templateObject
    },
    getAllPagesRef      : function (root) {
        return getAllPages(root||tplData.get("items"));
    },
    getTplDataClone     : function (cloneID) {
        return WorkDataUtil.cloneNode(tplData,undefined,cloneID)
    },
    getPagesJSON        : function (root) {
        return getAllPagesJSON(root||tplData.get("items"));

    },

    getTplData: function () {
        var WorkDataUtil = require("../utils/WorkDataUtil");
         var clone=WorkDataUtil.cloneNode(tplData,undefined,true);
        var tplDatatable = WorkDataUtil.tree2Table(templateObject.get("tpl_id"), clone.get("items"), templateObject.get("tpl_id"));
        clone.unset("items");
        clone.set("pages", tplDatatable.pages);
        clone.set("group", tplDatatable.groups);
        return clone;
    }

});

/**
 *
 */
function getAllPagesJSON(items) {
    var pages = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.get("items")) {
            var children = item.get("items");
            var childRet = getAllPagesJSON(children);
            if (childRet.length > 0) {
                pages = pages.concat(childRet)
            }
        } else {
            var pageObj = item.toJSON();
            var elements = item.get("item_object");
            var elementsObj = [];
            for (var j = 0; j < elements.length; j++) {
                var element = elements[j];
                elementsObj[j] = element.toJSON()
            }
            pageObj.item_object = elementsObj;
            //page
            pages.push(pageObj)
        }
    }
    return pages
}

/**
 *
 */
function getAllPages(items) {
    var pages = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.get("items")) {
            var children = item.get("items");
            var childRet = getAllPages(children);
            if (childRet.length > 0) {
                pages = pages.concat(childRet)
            }
        } else {
            //page
            pages.push(item)
        }
    }
    return pages
}

MagazineStore.dispatchToken = MeDispatcher.register(function (action) {
    switch (action.type) {
        //case ActionTypes.WORK_INIT:
        //    templateObject = undefined;
        //    tplData = undefined;
        //    break;
        case ActionTypes.UPDATE_GROUPPAGENUM:
            updateGroupPageNum(action.index,action.value);
            MagazineStore.emitChange();
            break;
        case ActionTypes.MERGE_MAGAZINE:
            mergeMagazine(action.tplData);
            MagazineStore.emitChange();
            break;
        case ActionTypes.CREATE_BLANK_MAGAZINE:
            createBlankMagazine();
            MagazineStore.emitChange();
            break;
        case ActionTypes.CREATE_BLANK_TEMPLATE:
            createOneGroupWork();
            MagazineStore.emitChange();
            break;
        case ActionTypes.CANCEL_UPDATE:
            tplData.id = action.pages_data_id;// 设置页对象 id
            break;
        case ActionTypes.SAVE_UPDATE:
            templateObject = action.templateObject;// 设置模板对象 tpl
            tplData = action.pagesObject;// 设置页对象 tplData
            break;
        case ActionTypes.GET_TEMPLATE_DATA:
            templateObject = action.templateObject;// 设置模板对象 tpl
            // templateObject.set("tpl_state",1);
            // templateObject.set("last_status",0);
            tplData = action.pagesObject;// 设置页对象 tplData
            tplData = WorkDataUtil.initTplData(action.pagesObject);// 设置页对象 tplData
            filterData(tplData);
            validateRedEnvelope(tplData.attributes.pages, templateObject.get("tpl_id"));
            break;
        case ActionTypes.TOGGLE_NODE:
            var ID = action.ID;
            toggleNode(ID);
            MagazineStore.emitChange();
            break;
        case  ActionTypes.UPDATE_ATTR:
            var selectInfo = action.selectInfo;
            if (selectInfo.type == "group") {
                GlobalFunc.updateObj(GlobalFunc.getObjRef(tplData, selectInfo.index), action.data);
                MagazineStore.emitChange();
            }
            break;
        case  ActionTypes.DRAG_NODE:
            var SelectTool = require("./selectTool")
            MeDispatcher.waitFor([SelectTool.dispatchToken]);
            var dragInfo = action.data;
            dragNode(dragInfo, tplData);
            //WorkStore.emitChange();
            break;
        case  ActionTypes.REMOVE_NODE:
            var SelectStore = require("./SelectStore");
            var ID = SelectStore.getSelectInfo().index;
            var obj = GlobalFunc.getObjRef(tplData, ID);
            var parent = obj.get("parent");
            var children = parent.get("items");
            for (var i = 0; i < children.length; i++) {
                if (children[i] == obj) {
                    children.splice(i, 1);
                    break;
                }
            }
            break;
        case ActionTypes.COPY_NODE:
            var SelectStore = require("./SelectStore");
            var ID = SelectStore.getSelectInfo().index;
            var objCopy = copyNode(tplData, ID)
            var lastIndex = GlobalFunc.getLastLayerIndex(ID)
            var parent = objCopy.get("parent");
            var children = parent.get("items");
            children.splice(+lastIndex + 1, 0, objCopy);
            break;
        case ActionTypes.UNDO:
        case ActionTypes.REDO:
            var UndoStore = require("./UndoStore");
            MeDispatcher.waitFor([UndoStore.dispatchToken]);
            tplData = WorkDataUtil.cloneNode(UndoStore.getPayload().workData,undefined,true);
            break;
        case ActionTypes.ADD_GROUP:
            var targetID, targetType;
            var SelectStore = require("./SelectStore");
            var selectInfo = SelectStore.getSelectInfo();
            targetID = selectInfo.index;
            targetType = selectInfo.type;
            var GroupInit = require("../components/Common/GroupInit");
            var lastIndex = GlobalFunc.getLastLayerIndex(targetID);
            var parentID = GlobalFunc.getParent(selectInfo.index)
            var parent = GlobalFunc.getObjRef(MagazineStore.getWorkData(), parentID);
            parent.set("f_collapse", false);
            var children = parent.get("items");
            children.splice(+lastIndex + 1, 0, GroupInit.createBlankGroup(parent, "组"))
            parent.set("items", children)

            break;
        default :
            break;
    }
});
/**
 * //不是当前作者的红包删除掉
 * @param pages
 * @param tid
 */
function validateRedEnvelope(pages, tid) {
    ///不是当前作者的红包删除掉
    var GlobalFunc = require("../components/Common/GlobalFunc");
    for (let i = 0; i < pages.length; i++) {
        let page = pages[i];
        var items = page.get("item_object");
        for (var j = 0; j < items.length; j++) {
            var item = items[j];
            var itemType = item.get("item_type");
            if (itemType == ElementType.redEnvelope) {
                var oriTid = item.get("ext_attr");
                if (oriTid != tid) {
                    items.splice(j, 1);
                    j--;
                }
            }
        }
    }
}
/**
 * copy page or group
 * @param workData
 * @param ID
 */
function copyNode(workData, ID) {
    var obj = GlobalFunc.getObjRef(workData, ID);
    var WorkDataUtil = require("../utils/WorkDataUtil");
    var objCopy = WorkDataUtil.cloneNode(obj, obj.get("parent"));
    GlobalFunc.traversalTree(objCopy, true, GlobalFunc.copyPageEvents);
    //重置ID
    GlobalFunc.traversalTree(objCopy, false, function (node) {
        if (GlobalFunc.isGroup(node)) {
            node.set("f_object_id", fmacapi_create_uid(""))
        } else {
            node.set("page_uid", uuid.v4());
        }
    })
    return objCopy;
}
/**
 * 拖动组或页
 * @param dragInfo.src  原位置
 *  @param dragInfo.dst  目标位置
 */
function dragNode(dragInfo, workData) {
    var src = dragInfo.src;
    var dst = dragInfo.dst;
    var dstOffset = 0;//是否已经完成交换
    var srcLast = parseInt(GlobalFunc.getLastLayerIndex(src));
    var dstLast = parseInt(GlobalFunc.getLastLayerIndex(dst));
    var dstParentObj = GlobalFunc.getObjRef(workData, GlobalFunc.getParent(dst));
    var srcParentObj = GlobalFunc.getObjRef(workData, GlobalFunc.getParent(src));
    if (GlobalFunc.isBrother(src, dst)) {
        ///同层
        if (srcLast < dstLast) {
            ///src在dst之前
            dstLast = dstLast - 1;
        }
    }
    var srcObj = srcParentObj.attributes.items.splice(srcLast, 1)[0];
    srcObj.set("parent", dstParentObj);
    var dstBrotherArr = dstParentObj.attributes.items;
    dstBrotherArr.splice(dstLast, 0, srcObj);
    dstParentObj.set("items", dstBrotherArr);


}

////在组下添加页
function addBlankPageAfterGroup(GroupID, workData) {
    var IDArr = GroupID.toString().split("|");
    var target;
    var pageIndex;

    pageIndex = +IDArr.pop() + 1;
    target = GlobalFunc.getObjRef(workData, IDArr.join("|"));

    var ElementInit = require("../components/Common/ItemInit");
    var item_obj = ElementInit.createBlankItemObj();
    var page_obj = PageInit.createBlankPageObj();
    page_obj.set("item_object", [item_obj]);
    page_obj.set("page_uid", uuid.v4());
    page_obj.set("edited", true);
    page_obj.set("parent", target);
    target.attributes.items.splice(pageIndex, 0, page_obj);
}

///添加组
function addGroup(GroupID, workData) {
    var IDArr = GroupID.toString().split("|");
    var target;
    var pageIndex;

    pageIndex = +IDArr.pop() + 1;
    target = GlobalFunc.getObjRef(workData, IDArr.join("|"));

    var GroupInit = require("../components/Common/GroupInit");
    var newGroup = GroupInit.createGroupWithPage(target, "组");
    target.attributes.items.splice(pageIndex, 0, newGroup);
}

//
function toggleNode(ID) {
    //展开，关闭组
    var group = GlobalFunc.getObjRef(tplData, ID);
    var oldCollapse = group.attributes["f_collapse"];
    group.set("f_collapse", !oldCollapse);
}
/**
 * 创建单组作品
 */
function createOneGroupWork() {
    var _tpl = fmaobj.tpl.create(),
        _tplData = fmaobj.tpl_data.create();
    templateObject = _tpl;
    templateObject.set("tpl_state",1);
    var GroupInit = require("../components/Common/GroupInit");
    var datas = [GroupInit.createGroupWithPage(_tplData, "组", "页")];
    _tplData.set("items", datas);
    tplData = _tplData;
}

/*
 * 创建一个空的期刊对象
 * tpl , tpl-data , pages
 */

function createBlankMagazine() {
    var _tpl = fmaobj.tpl.create(),
        _tplData = fmaobj.tpl_data.create();
    templateObject = _tpl;
    templateObject.set("tpl_state",1)
    var GroupInit = require("../components/Common/GroupInit");
    var datas = [GroupInit.createGroupWithPage(_tplData, "封面", "封面页"), GroupInit.createGroupWithPage(_tplData, "版权", "版权页"), GroupInit.createGroupWithPage(_tplData, "文章", "文章1"), GroupInit.createGroupWithPage(_tplData, "封底", "封底页")];
    _tplData.set("items", datas);
    tplData = _tplData;
}

function mergeMagazine(tplData){
    //数据合并到当前作品
    var SelectStore = require("./SelectStore");
    var selectInfo = SelectStore.getSelectInfo();
    var targetID = selectInfo.index;
    var lastIndex = GlobalFunc.getLastLayerIndex(targetID);
    var parentID = GlobalFunc.getParent(selectInfo.index)
    var parent = GlobalFunc.getObjRef(MagazineStore.getWorkData(), parentID);
    var brothers=parent.get("items");
    var before=brothers.slice(0,+lastIndex+1);
    var after=brothers.slice(+lastIndex+1);
    var WorkDataUtil = require("../utils/WorkDataUtil");
    var cloneTplData=WorkDataUtil.cloneNode(tplData,undefined,false);
    var cloneChildren=cloneTplData.get("items");
    cloneChildren.forEach(child=>{
        child.set("parent",parent)
    });
    var newBrothers=before.concat(cloneChildren,after)
    parent.set("items",newBrothers);
}
/**
 * 修改组显示页码状态
 * @param index
 * @param value
 */
function updateGroupPageNum(index,value){
    tplData.get("items")[index].set("show_page_num",value);
}
function filterData(tplData){
    var userObj = GlobalFunc.getUserObj();
    if (!userObj.speFunctionCode) {
        //不是内部用户没有使用这些动画的权限
        GlobalFunc.traversalTree(tplData, false, function (node) {
            if (!GlobalFunc.isGroup(node)) {
                var items=node.get("item_object");
                items.forEach((item)=>{
                    var animationName = GlobalFunc.getAnimationName(item.attributes['item_animation']),
                        animationVal = GlobalFunc.getAnimationTimeArr(item.attributes['item_animation_val']);
                    animationName.forEach((name,index)=>{
                        //{type: "clipLeftNoTrans", value: "左渐显现"},
                        //{type: "clipRightNoTrans", value: "右渐显现"},
                        //{type: "clipTopNoTrans", value: "上渐显现"},
                        //{type: "clipBottomNoTrans", value: "下渐显现"}
                        if (name == "clipLeftNoTrans" || name == "clipLeftNoTrans" || name == "clipLeftNoTrans" ||name == "clipLeftNoTrans") {
                            animationName[index] = "none";
                            animationVal[index]["type"]="in";
                            item.set("item_animation_val",JSON.stringify(animationVal));
                            item.set("item_animation",JSON.stringify(animationName));
                        }
                    });

                })

            }
        })
    }

}
module.exports = MagazineStore;
