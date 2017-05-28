/**
 * @component MakeActionCreators
 * @description Make(制作)模块 动作创建者
 * @time 2015-08-27 10:19
 * @author StarZou
 **/

var MeDispatcher = require('../dispatcher/MeDispatcher');
var MeConstants = require('../constants/MeConstants');
var MakeWebAPIUtils = require('../utils/MakeWebAPIUtils');
var WorkDataUtil = require('../utils/WorkDataUtil');
var GroupInit = require("../components/Common/GroupInit");
var uuid = require("uuid");
var ActionTypes = MeConstants.ActionTypes;
var Timeline = MeConstants.Timeline;


var MakeActionCreators = {
    getMagazineData: function (tid, reEditParam, success, err) {
        
        
        MakeWebAPIUtils.getMagazineTreeDataById(tid, function (templateObject, pagesObject) {
            var GlobalFunc = require("../components/Common/GlobalFunc");
            var userID = GlobalFunc.getUserObj().objectId,
                tplUserID = templateObject.get("author"),
                reEdit = userID == tplUserID ? (!!reEditParam) : false;
            var tpl = templateObject;
            var tplData = pagesObject;
            if (!reEdit) {
                //用模板打开，复制数据
                tpl = WorkDataUtil.cloneTpl(tpl);// 设置模板对象 tpl
                tpl.set("tpl_id", WorkDataUtil.createTplId());
                tpl.set("inherit_from", tid);
                tpl.set("last_status",0);
                ///clone tree
                var objCopy = WorkDataUtil.cloneNode(tplData);
                //try{
                GlobalFunc.traversalTree(objCopy, true, GlobalFunc.copyPageEvents);
                //}catch (e){
                //    debugger;
                //    console.log(e);
                //}
                var pageUids = {}; //新旧页UID
                //重置ID
                GlobalFunc.traversalTree(objCopy, false, function (node) {
                    if (GlobalFunc.isGroup(node)) {
                        node.set("f_object_id", fmacapi_create_uid(""))
                    } else {
                        var newPageUid = uuid.v4();
                        pageUids[node.get("page_uid")] = newPageUid;
                        node.set("page_uid", newPageUid);
                    }
                });
                GlobalFunc.traversalTree(objCopy, false, function (node) {
                    if (!GlobalFunc.isGroup(node)) {
                        GlobalFunc.copyPageToEvents(node, pageUids);
                    }
                })
                //tplData = WorkDataUtil.cloneTplData(objCopy);// clone tpldata obj
                //tplData.set("items",objCopy.get("items"));
                objCopy.set("key_id", tpl.get("tpl_id"));
                tplData = objCopy
            }
            MakeLoadingWave.end(function () {
                MeDispatcher.dispatch({
                    type          : ActionTypes.GET_TEMPLATE_DATA,
                    templateObject: tpl,
                    pagesObject   : tplData,
                    reEdit        : reEdit
                });
                if (success) success(tplData);
            });

        }, function (error) {
            // error
            if (err) err(error);
            console.log(error);
        })
    },
    saveUpdate     : function (tpl, tplData) {
        MeDispatcher.dispatch({
            type          : ActionTypes.SAVE_UPDATE,
            templateObject: tpl,
            pagesObject   : tplData

        });
    },
    cancelUpdate   : function (pages_data_id) {
        MeDispatcher.dispatch({
            type         : ActionTypes.CANCEL_UPDATE,
            pages_data_id: pages_data_id

        });
    },

    workInit: function () {
        MeDispatcher.dispatch({
            type: ActionTypes.WORK_INIT
        });
    },

    // 空白模板
    createBlankMode    : function () {
        MeDispatcher.dispatch({
            type: ActionTypes.CREATE_BLANK_TEMPLATE
        });
    },
    // 空白期刊
    createBlankMagazine: function () {
        MeDispatcher.dispatch({
            type: ActionTypes.CREATE_BLANK_MAGAZINE
        });
    },

    // 选中页
    selectPage: function (selectedPageIndex) {
        MeDispatcher.dispatch({
            type             : ActionTypes.SELECT_PAGE,
            selectedPageIndex: selectedPageIndex
        });
    },

    movePage: function (moveIndex, targetIndex) {
        MeDispatcher.dispatch({
            type       : ActionTypes.MOVE_PAGE,
            moveIndex  : moveIndex,
            targetIndex: targetIndex
        });
    },

    removePage: function (index) {
        MeDispatcher.dispatch({
            type : ActionTypes.REMOVE_PAGE,
            index: index
        });
    },

    copyPage: function (index) {
        MeDispatcher.dispatch({
            type : ActionTypes.COPY_PAGE,
            index: index
        });
    },

    addPage : function (obj) {
        MeDispatcher.dispatch({
            type    : ActionTypes.ADD_PAGE,
            pageInfo: obj
        });
    },
    addGroup: function (targetID) {
        MeDispatcher.dispatch({
            type    : ActionTypes.ADD_GROUP,
            targetID: targetID
        });
    },

    replacePage   : function (pageInfo) {
        MeDispatcher.dispatch({
            type    : ActionTypes.REPLACE_PAGE,
            pageInfo: pageInfo
        });
    },
    elementMoveAll: function (pos) {
        //所有选中元素都移动
        MeDispatcher.dispatch({
            type: ActionTypes.ELEMENTMOVEALL,
            pos : pos
        })
    },
    moveElement   : function (pos, sourceInfo) {
        MeDispatcher.dispatch({
            type      : ActionTypes.MOVE_ELEMENT,
            pos       : pos,
            sourceInfo: sourceInfo
        })
    },
    align         : function (type) {
        MeDispatcher.dispatch({
            type     : ActionTypes.ALIGN,
            alignType: type
        })
    },
    /**
     * 更新元素
     * @param element
     */
    updateElement : function (element, index, sourceInfo, uuid) {
        MeDispatcher.dispatch({
            type      : ActionTypes.UPDATE_ELEMENT,
            element   : element,
            index     : index,
            sourceInfo: sourceInfo,
            uuid      : uuid
        });
    },
    updateEvent   : function (attrName, index, value, type) {
        MeDispatcher.dispatch({
            type  : ActionTypes.UPDATE_EVENT,
            name  : attrName,
            index : index,
            value : value,
            opType: type
        });
    },
    editGroup     : function (item_id, edit_type) {
        MeDispatcher.dispatch({
            type    : ActionTypes.EDIT_GROUP,
            editType: edit_type,
            itemId  : item_id
        });
    },
    multiUpdate   : function (changeInfo, sourceInfo) {
        MeDispatcher.dispatch({
            type      : ActionTypes.MULTI_UPDATE,
            changeInfo: changeInfo,
            sourceInfo: sourceInfo
        });
    },
    undoRecord    : function (recordType) {
        MeDispatcher.dispatch({
            type      : ActionTypes.UNDORECORD,
            recordType: recordType
        });
    },

    updateTextDim: function (element, index) {
        MeDispatcher.dispatch({
            type   : ActionTypes.UPDATE_TEXT_DIM,
            element: element,
            index  : index
        });
    },

    /**
     * 选中当前元素
     * @param index
     */
    selectElement: function (index, obj) {
        MeDispatcher.dispatch({
            type      : ActionTypes.SELECT_ELEMENT,
            index     : index,
            sourceInfo: obj
        });
    },
    dragSelect   : function (rect, selectIndex, sourceInfo) {
        MeDispatcher.dispatch({
            type       : ActionTypes.DRAG_SELECT,
            rect       : rect,
            selectIndex: selectIndex,
            sourceInfo : sourceInfo
        });
    },

    addElement: function (elementInfo) {
        MeDispatcher.dispatch({
            type       : ActionTypes.ADD_ELEMENT,
            elementInfo: elementInfo
        });
    },

    updateTpl: function (obj) {
        MeDispatcher.dispatch({
            type   : ActionTypes.UPDATE_TPL,
            tplInfo: obj
        });
    },

    replaceElement: function (elementInfo) {
        MeDispatcher.dispatch({
            type       : ActionTypes.REPLACE_ELEMENT,
            elementInfo: elementInfo
        });
    },

    pasteElement: function () {
        MeDispatcher.dispatch({
            type: ActionTypes.PASTE_ELEMENT
        });
    },

    removeElement: function (obj) {
        MeDispatcher.dispatch({
            type       : ActionTypes.REMOVE_ELEMENT,
            elementInfo: obj
        });
    },

    changeLayer: function (direction, info) {
        MeDispatcher.dispatch({
            type     : ActionTypes.CHANGE_LAYER,
            direction: direction,
            info     : info
        });
    },

    createByPic: function (files) {
        MeDispatcher.dispatch({
            type : ActionTypes.CREATE_BY_PIC,
            files: files
        });
    },

    changeZoom         : function (direction) {
        MeDispatcher.dispatch({
            type     : ActionTypes.CHANGE_ZOOM,
            direction: direction
        });
    },
    updatePageProp     : function (updateObj) {
        MeDispatcher.dispatch({
            type     : ActionTypes.UPDATE_PAGEPROP,
            updateObj: updateObj
        });
    },
    changeTimelineFocus: function (val) {
        MeDispatcher.dispatch({
            type: Timeline.TIMELINE_FOCUS,
            val : val
        });
    },
    addTimelineFrame   : function (time) {
        MeDispatcher.dispatch({
            type: Timeline.ADD_TIMELINE_FRAME,
            time: time
        });
    },
    removeTimelineFrame: function (time) {
        MeDispatcher.dispatch({
            type: Timeline.REMOVE_TIMELINE_FRAME,
            time: time
        });
    },
    toggleNode         : function (ID) {
        MeDispatcher.dispatch({
            type: ActionTypes.TOGGLE_NODE,
            ID  : ID
        });
    },
    selectSome         : function (obj) {
        MeDispatcher.dispatch({
            type: ActionTypes.SELECT,
            data: obj
        });
    },
    updateAttr         : function (selectInfo, attributeObj) {
        MeDispatcher.dispatch({
            type      : ActionTypes.UPDATE_ATTR,
            selectInfo: selectInfo,
            data      : attributeObj
        });
    },
    dragNode           : function (dragInfo) {
        MeDispatcher.dispatch({
            type: ActionTypes.DRAG_NODE,
            data: dragInfo
        });
    },
    removeNode         : function () {
        MeDispatcher.dispatch({
            type: ActionTypes.REMOVE_NODE
        });
    },
    copyNode           : function () {
        MeDispatcher.dispatch({
            type: ActionTypes.COPY_NODE
        });
    },
    mergeMagazine      : function (tplData) {
        MeDispatcher.dispatch({
            type   : ActionTypes.MERGE_MAGAZINE,
            tplData: tplData
        });
    },
    updateGroupPageNum : function (index, value) {
        MeDispatcher.dispatch({
            type : ActionTypes.UPDATE_GROUPPAGENUM,
            index: index,
            value: value
        });
    }
};

module.exports = MakeActionCreators;