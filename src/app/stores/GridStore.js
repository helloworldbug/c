/**
 * Created by 95 on 2015/8/4.
 * ��ʾ����1�����Ԫ���ϰ���ʱ����GridTypes.ITEM_MOVE_START��itemAxis����ÿ��Ԫ�ص�������
 * 2 ����ƶ�����GridTypes.ELEMENTMOVE��gridStore������������ߣ�Ԫ������ʱ��ƫ�ƣ�500ms��Ԫ�أ�ElementMixin������ GridStore.getAdsorptionOffset()ȡ���һ��������ƫ��
 *
 */
var MeDispatcher = require('../dispatcher/MeDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constans = require("../constants/MeConstants");
var _=require('lodash');
var GridTypes = Constans.GridType;
var ActionTypes=Constans.ActionTypes;
var CHANGE_EVENT = 'change';
var HASREFERENCE = "hasReference";
var ElementStore = require('./ElementStore');
var PageStore=require('./PageStore')
var GlobalFunc = require("../components/Common/GlobalFunc");
var GridAction = require("../actions/GridAction");
var MakeActionCreators = require("../actions/MakeActionCreators");
var ClientState=require("../utils/ClientState");
var AdsorptionOffset = {};
var ReferenData;
var Constants = require("../constants/MeConstants");
var Defaults = Constants.Defaults;
var PHONEWIDTH = Defaults.PHONEWIDTH;
var PHONEHIGHT = Defaults.PHONEHIGHT;
var initGridData = function () {
    var AdsorptionInfo = {top: 0, left: 0};
    var gridSetting = {
        showGridPanel         : false,
        showGrid              : false,
        gridNum               : 9,
        gridColor             : "rgba(0,0,0,0.3)",
        adsorption            : false,
        showReference         : true,
        isMouseMove           : false,
        itemAxis              : null
    };
    return {
        getStore: function () {
            return gridSetting;
            //return assign({},gridSetting);
        },
        setStore: function (obj) {
            for (var key in gridSetting) {
                if (key in obj) {
                    gridSetting[key] = obj[key];
                }
            }
        },


    }
}

var gridData = initGridData();
var GridStore = Object.assign({}, EventEmitter.prototype, {
    getStore               : function () {
        return gridData.getStore();
    },
    emitChange             : function () {
        this.emit(CHANGE_EVENT);
    },
    emitReference          : function () {
        this.emit(HASREFERENCE);
    },
    addReferenceListener   : function (callback) {
        this.on(HASREFERENCE, callback);
    },
    removeReferenceListener: function (callback) {
        this.removeListener(HASREFERENCE, callback);
    },
    addChangeListener      : function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    togglePanel         : function (toggleOn) {
        toggleOn = toggleOn || false;
        gridData.setStore({showGridPanel: toggleOn});
    }
    ,
    toggleGrid          : function (toggleOn) {
        toggleOn = toggleOn || false;
        gridData.setStore({showGrid: toggleOn});
    },
    toggleAdsorption    : function (toggleOn) {
        toggleOn = toggleOn || false;
        if (true == toggleOn) {
            if (false == gridData.getStore().showReference) {
                return
            }
        }
        gridData.setStore({adsorption: toggleOn});
    },
    toggleReference     : function (toggleOn) {
        toggleOn = toggleOn || false;
        gridData.setStore({showReference: toggleOn});
        if (toggleOn == false) {
            gridData.setStore({adsorption: false});
        }
    },
    changeWidth         : function (num) {
        gridData.setStore({gridNum: num});
    },
    changeColor         : function (color) {
        gridData.setStore({gridColor: color});
    },
    getReferenceData    : function () {
        return ReferenData;
    },
    getAdsorptionOffset : function () {
        return AdsorptionOffset;
    },
    initItemGridLine    : function () {
        function asendSort(a, b) {
            return a > b;
        };
        var obj = {rows: [], cols: []};
        var items = ElementStore.getDisplayFrameElements();
        var focusIndex = ElementStore.getSelectedElementIndex();
        for (var i = 0; i < items.length; i++) {
            if (_.indexOf(focusIndex, i)!=-1)continue;
            var item=items[i];
            var type=item.get("item_type");
            if(type==17||type==24&&type==7){
                continue;
            }
            var dimPos=GlobalFunc.getDimAndPos(items,[items[i]]);
            var top = dimPos.top;
            var left = dimPos.left;
            var width = dimPos.width;
            var height = dimPos.height;
            obj.rows = obj.rows.concat([top, top + (height / 2), top + height]);
            obj.cols = obj.cols.concat([left, left + (width / 2), left + width]);
        }
        obj.rows.sort(asendSort);
        obj.cols.sort(asendSort);
        gridData.setStore({itemAxis: obj});
    },


    //lastAdsorption       : function (obj) {
    //    if (gridData.getStore().adsorption) {
    //        var ret = this._calAdsorptionData();
    //        if (ret == undefined)return;
    //        var rowMin = ret.rows.length && ret.rows[0].dis;
    //        var colMin = ret.cols.length && ret.cols[0].dis;
    //        var curItem = ElementStore.getItem();
    //        var top = curItem.get("item_top");
    //        var left = curItem.get("item_left");
    //        if (colMin != 0) {
    //            setTimeout(function () {
    //                //console.log("left:"+colMin);
    //                MakeActionCreators.changeParameters({
    //                    type: "grid", par: [{
    //                        key      : "item_left",
    //                        value    : left + colMin,
    //                        itemIndex: obj.itemIndex
    //                    }]
    //                });
    //            }, 0)
    //
    //        }
    //        if (rowMin != 0) {
    //            setTimeout(function () {
    //                //console.log(rowMin+"rowMin");
    //                MakeActionCreators.changeParameters({
    //                    type: "grid", par: [{
    //                        key      : "item_top",
    //                        value    : top + rowMin,
    //                        itemIndex: obj.itemIndex
    //                    }]
    //                });
    //            }, 0)
    //
    //        }
    //
    //    }
    //
    //},
    generateReferenceData: function (dy, dx) {
        //var selectedEls =ElementStore.getSelectedElement() ;
        //var dimPos = GlobalFunc.getDimAndPos(ElementStore.getElements(), selectedEls);
        var state = GridStore.getStore();
        var ret;
        if (state.showReference && state.isMouseMove) {
            ret = calAdsorptionData(dy, dx);
            ReferenData = ret;
            GridStore.emitReference();
        } else {
            ReferenData = undefined;
        }

        if (ret) {
            if (GridStore.getStore().adsorption) {
                var rowMin = ret.rows.length && ret.rows[0].dis;
                var colMin = ret.cols.length && ret.cols[0].dis;
                setAdsorptionOffset({top: rowMin, left: colMin});
            }

        }else{
            setAdsorptionOffset({top: 0, left: 0})
        }

        return ret
    }
});


MeDispatcher.register(function (payload) {
    switch (payload.type) {
        case  GridTypes.GRID_SHOW:
            GridStore.toggleGrid(payload.value);
            GridStore.emitChange();
            break;
        case   GridTypes.GRID_PANEL:
            GridStore.togglePanel(payload.value);
            GridStore.emitChange();
            break;
        case   GridTypes.GRID_WIDTH:
            GridStore.changeWidth(payload.value);
            GridStore.emitChange();
            break;
        case  GridTypes.GRID_COLOR:
            GridStore.changeColor(payload.value);
            GridStore.emitChange();
            break;
        case GridTypes.GRID_SHOWREFERENCE:
            GridStore.toggleReference(payload.value);
            GridStore.emitChange();
            break;
        case  GridTypes.GRID_ADSORPTION:
            if (typeof (payload.value) == 'object') {
                //gridData.setAdsorptionInfo(playload.value);
                //GridStore.emitAdsorption();
            } else {
                GridStore.toggleAdsorption(payload.value);
                GridStore.emitChange();
            }

            break;
        //case Constants.FUNC_CHANGE_PARAMETER:
        //    GridStore.toggleMouseMove(playload.value);
        //    break;
        case GridTypes.ITEM_MOVE_END:
            //GridStore.lastAdsorption(payload);
            gridData.setStore({isMouseMove: false});
            GridStore.generateReferenceData(payload.pos.top, payload.pos.left);
            GridStore.emitChange();
            GridStore.emitReference();
            break;
        case GridTypes.ITEM_MOVE_START:
            //GridStore.lastAdsorption(playload);
            GridStore.initItemGridLine(true);
            gridData.setStore({isMouseMove: true});
            GridStore.emitChange();
            break;
        case ActionTypes.MOVE_ELEMENT:
            MeDispatcher.waitFor([ElementStore.dispatchToken]);
            GridStore.generateReferenceData(payload.pos.top, payload.pos.left);
        default :
            break;
    }
});

function filterCandidateReference(target, arr, MaxDis, boxSide) {

    for (var ri = 0; ri < arr.length; ri++) {
        var temp = arr[ri];
        if ((0 - temp) > MaxDis || (temp - boxSide) > MaxDis)
            continue;
        //if(target+MaxDis<=temp)break;
        if (Math.abs(temp - target) <= MaxDis) {
            return {line: temp, dis: temp - target};
        }
        if (target <= temp)break;
    }
    return undefined
}
function setAdsorptionOffset(obj) {
    for (var key in obj) {
        AdsorptionOffset[key] = obj[key];
    }
}
function calAdsorptionData(dy, dx) {
    var boxWidth = PHONEWIDTH, boxHeight = PHONEHIGHT;
    var refDis = 10;
    var ret = {rows: [], cols: []};
    var gridStore = GridStore.getStore();
    if (undefined == gridStore.itemAxis)return undefined;
    var cw = boxWidth / (gridStore.gridNum + 1);
    var curItems = ElementStore.getDisplayFrameSelectedElement();
    var allEls=ElementStore.getDisplayFrameElements();
    var pageId=PageStore.getPageUid();
    if (curItems.length==0) {
        return undefined;
    }

    var horizontalArr = [];
    var verticalArr = [];
    curItems.forEach((item)=>{
        if(ClientState.isLocked(item.get("item_uuid"),pageId)){
            return
        }
        var dimPos=GlobalFunc.getDimAndPos(allEls,[item]);
        verticalArr.push(dimPos.left)
        verticalArr.push(dimPos.left+(dimPos.width)/2)
        verticalArr.push(dimPos.left+dimPos.width);
        horizontalArr.push(dimPos.top);
        horizontalArr.push(dimPos.top+(dimPos.height)/2);
        horizontalArr.push(dimPos.top+dimPos.height);

    })

    if (gridStore.showReference) {
        var itemAxis = gridStore.itemAxis;
        $.each(horizontalArr, function (i, hi) {
            ret.rows.push(filterCandidateReference(hi, itemAxis.rows, refDis, boxHeight));
        });
        $.each(verticalArr, function (i, vi) {
            ret.cols.push(filterCandidateReference(vi, itemAxis.cols, refDis, boxWidth));
        });

        //std grid
        if (gridStore.showGrid) {
            for (var i = 0; i < horizontalArr.length; i++) {
                if (undefined != ret.rows[i])continue;
                if (horizontalArr[i] + refDis < 0 || horizontalArr[i] - refDis > boxHeight)continue;
                var remain = horizontalArr[i] % cw;
                if (remain > (cw / 2)) {
                    if (cw - remain <= refDis)ret.rows[i] = {
                        line: parseInt(horizontalArr[i] - remain + cw),
                        dis : (cw - remain)
                    };
                } else {
                    if (remain <= refDis)ret.rows[i] = {line: parseInt(horizontalArr[i] - remain), dis: -remain};
                }
            }
            for (var i = 0; i < verticalArr.length; i++) {
                if (undefined != ret.cols[i])continue;
                if (verticalArr[i] + refDis < 0 || verticalArr[i] - refDis > boxWidth) continue;
                var remain = verticalArr[i] % cw;
                if (remain > (cw / 2)) {
                    if (cw - remain <= refDis)ret.cols[i] = {
                        line: parseInt(verticalArr[i] - remain + cw),
                        dis : (cw - remain)
                    };
                }
                else {
                    if (remain <= refDis) {
                        ret.cols[i] = {line: parseInt(verticalArr[i] - remain), dis: -remain};
                    }
                }
            }
        }
        arrFilterUndefined(ret.rows);
        arrFilterUndefined(ret.cols);

        getMinDisArr(ret.rows);
        getMinDisArr(ret.cols);
        if (ret.rows.length == 0 && ret.cols.length == 0)return undefined;
        return ret;
    }
    return undefined;
}

function arrFilterUndefined(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (undefined == arr[i]) {
            arr.splice(i, 1);
            i--;
        }
    }
}
function getMinDisArr(arr) {
    var min = 9999;
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        var curDis = Math.abs(item.dis);
        if (curDis < min) min = curDis;
    }
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        var curDis = Math.abs(item.dis);
        if (Math.abs(curDis - min) > 1) {
            arr.splice(i, 1);
            i--;
        }
    }
}
module.exports = GridStore;
