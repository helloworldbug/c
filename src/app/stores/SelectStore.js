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
var CHANGE_EVENT = 'change';
var GlobalFunc = require("../components/Common/GlobalFunc");
var WorkDataUtil = require('../utils/WorkDataUtil');
var ClientState = require("../utils/ClientState");
var PageInit = require("../components/Common/PageInit");
var $=require("jquery")
var _selectInfo = {
    type : undefined,
    index: undefined
};

var SelectStore = Object.assign({}, EventEmitter.prototype, {

    emitChange       : function () {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    getSelectInfo       : function () {
        return _selectInfo;
    }
});

SelectStore.dispatchToken = MeDispatcher.register(function (payload) {
    var MagazineStore = require("./MagazineStore");
    var PageStore = require("./PageStore");

    switch (payload.type) {
        //case ActionTypes.WORK_INIT:
        //    _selectInfo = {};
        //    break;
        case ActionTypes.GET_TEMPLATE_DATA:
        case ActionTypes.CREATE_BLANK_TEMPLATE:
        case ActionTypes.CREATE_BLANK_MAGAZINE:
            MeDispatcher.waitFor([MagazineStore.dispatchToken]);
            _selectInfo = getDefaultSelect(MagazineStore.getWorkData());
            SelectStore.emitChange();
            break;
        case ActionTypes.SELECT:
            //var selectInfo=payload.data;
            select(payload.data);
            var tpl_data = fmaobj.tpl_data.create();
            MagazineStore = require('./MagazineStore');
            tpl_data.set("pages", MagazineStore.getAllPagesRef());
            WorkDataUtil.filterPagesEffectImg(tpl_data,function(){
                SelectStore.emitChange();
            });
            break;
        case  ActionTypes.ADD_PAGE:
            MeDispatcher.waitFor([MagazineStore.dispatchToken, PageStore.dispatchToken]);
            var workData = MagazineStore.getWorkData();
            if (!payload.pageInfo) {
                addNode(workData, "page");
            }

            SelectStore.emitChange();
            break;
        case  ActionTypes.ADD_GROUP:

            var workData = MagazineStore.getWorkData();
            MeDispatcher.waitFor([MagazineStore.dispatchToken]);
            addNode(workData, "group");
            break
        case  ActionTypes.DRAG_NODE:
            var SelectTool = require("./selectTool");
            MeDispatcher.waitFor([MagazineStore.dispatchToken]);
            var preOpObj = SelectTool.getPreOpObj();
            _selectInfo.type = !!preOpObj.get("item_object") ? "page" : "group";
            _selectInfo.index = GlobalFunc.getIndexByObj(preOpObj);
            SelectStore.emitChange();
            //console.log(_selectInfo.index);
            break;
        case  ActionTypes.REMOVE_NODE:
            MeDispatcher.waitFor([MagazineStore.dispatchToken]);
            var workData = MagazineStore.getWorkData();
            //console.log(workData, "workdata"); return;
            var newSelectObj= getLastNode(workData, _selectInfo.index, _selectInfo.type);
            if(_selectInfo.type=="page"&&typeof newSelectObj=="undefined"){
                newSelectObj= getLastNode(workData, _selectInfo.index, "group");
            }
            _selectInfo.index=GlobalFunc.getIndexByObj( newSelectObj);
            _selectInfo.type= !!newSelectObj.get("item_object") ? "page" : "group";
            break;
        case  ActionTypes.COPY_NODE:
            MeDispatcher.waitFor([MagazineStore.dispatchToken]);
            var ID=_selectInfo.index;
            var lastIndex=GlobalFunc.getLastLayerIndex(ID);
            var parentID=GlobalFunc.getParent(ID);
            if(parentID==""){
                _selectInfo.index=(+lastIndex+1).toString()
            }else{
                _selectInfo.index=parentID+"|"+(+lastIndex+1)
            }
            SelectStore.emitChange();
            break;
        case ActionTypes.UNDO:
        case ActionTypes.REDO:
            var UndoStore=require("./UndoStore");
            MeDispatcher.waitFor([MagazineStore.dispatchToken,UndoStore.dispatchToken]);
            _selectInfo=$.extend(true,{},UndoStore.getPayload().selectObj)
            break;
        default :
            break;
    }
});
/**
 * 取同元素类型的上一个元素
 * @param workData
 * @param ID
 * @param type
 */
function getLastNode(workData, ID, type) {
    var parent =GlobalFunc.getParent(ID);
    var parentObj=GlobalFunc.getObjRef(workData,parent);
    var children=parentObj.get("items");
    var lastIndex=GlobalFunc.getLastLayerIndex(ID);

    //往上找最后一页
    for (var i = lastIndex - 1; i > -1; i--) {
        var child=children[i];
        if(type=="group"){
            if(GlobalFunc.isGroup(child)){
                return child;
            }
        }else if(type=="page"){
            if(GlobalFunc.isGroup(child)){
                var page=getLastNodeInRoot(child,"page")
               if(typeof page!="undefined"){
                   return page
               }
            }else{
                return child;
            }
        }
    }

    //没有找到时往下找最前一页
    for (var i = lastIndex;i<children.length;i++) {
        var child=children[i];
        if(type=="group"){
            if(GlobalFunc.isGroup(child)){
                return child;
            }
        }else if(type=="page"){
            if(GlobalFunc.isGroup(child)){
                return getFirstNodeInRoot(child,"page")
            }else{
                return child;
            }
        }
    }
    //没有找到时，找父层
    return getLastNode(workData, parent, type)


}
/**
 * 在root中找最后一个type类型的节点
 * @param root
 * @param type
 * @returns {*}
 */
function getLastNodeInRoot(root, type) {
    var chilren = root.get("items");
    for (var i = chilren.length - 1; i > -1; i--) {
            var child=chilren[i];
        if(type=="group"){
            if(GlobalFunc.isGroup(child)){
                return child;
            }
        }else if(type=="page"){
            if(GlobalFunc.isGroup(child)){
                return getLastNodeInRoot(child,"page")
            }else{
                return child;
            }
        }
    }
    return undefined;
}
/**
 * 在root中找最前一个type类型的节点
 * @param root
 * @param type
 * @returns {*}
 */
function getFirstNodeInRoot(root, type) {
    var chilren = root.get("items");
    for (var i =0; i<chilren.length; i++) {
        var child=chilren[i];
        if(type=="group"){
            if(GlobalFunc.isGroup(child)){
                return child;
            }
        }else if(type=="page"){
            if(GlobalFunc.isGroup(child)){
                return getFirstNodeInRoot(child,"page")
            }else{
                return child;
            }
        }
    }
    return undefined;
}
function addNode(workData, type) {
    var IDArr = _selectInfo.index.split("|");
    if (_selectInfo.type == "group") {
        if(type=="group"){
            //select group, add group
            var lastIndex = GlobalFunc.getLastLayerIndex(_selectInfo.index);
            IDArr[IDArr.length-1]=+lastIndex+1;
            _selectInfo = {index: IDArr.join("|"), type: type}
        }else{
            ///select group ,add page
            var selectObj = GlobalFunc.getObjRef(workData, _selectInfo.index);

            var lastIndex = selectObj.get("items").length - 1;
            IDArr.push(lastIndex);
            _selectInfo = {index: IDArr.join("|"), type: type}
        }
    } else {
            //select page ,add page or group
            var lastIndex = IDArr[IDArr.length - 1];
            lastIndex = +lastIndex + 1;
            IDArr[IDArr.length - 1] = lastIndex;
            _selectInfo = {index: IDArr.join("|"), type: type}


    }
}
//选择组、页、元素
function select(selectInfo) {
    _selectInfo = {index: selectInfo.ID.toString(), type: selectInfo.type}
}
/*
 * 默认选中信息
 *
 */
function getDefaultSelect(workData) {
    var selectIndex = "0";
    var groups = workData.get("items");
    if (!groups) {
        ///没有分组的作品
        return {index: "0", type: "page"};
    } else {
        //分组的页
        if (!groups[0]) {
            //空作品
            return undefined;
        }
        var type = !!groups[0].get("item_object") ? "page" : "group";
        var childGroups = groups[0].get("items");
        while (childGroups && childGroups[0]) {
            selectIndex += "|0";
            type = !!childGroups[0].get("item_object") ? "page" : "group";
            childGroups = childGroups[0].get("items");
        }
        if (type == "group") {
            return {index: selectIndex, type: type};
        } else {
            var pageIndex = selectIndex.split("|");
            var group;
            if (pageIndex.length == 1) {
                ///选择根组
                type = "root";
            }
            return {index: selectIndex, type: type}
        }
    }
}
module.exports = SelectStore;
