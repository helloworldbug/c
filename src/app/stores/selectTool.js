/**
 * Created by 95 on 2015/8/27.
 */
var MeDispatcher = require('../dispatcher/MeDispatcher');

var Constants = require('../constants/MeConstants');
var ActionTypes = Constants.ActionTypes;
var MagazineStore=require("./MagazineStore");
var GlobalFunc=require("../components/Common/GlobalFunc");
var preOpObj = {};

var selectTool={
    getPreOpObj: function () {
        return preOpObj;
    }
}
selectTool.dispatchToken = MeDispatcher.register(function (action) {
    switch (action.type) {
        case  ActionTypes.DRAG_NODE:
           var workData= MagazineStore.getWorkData();
            var selectStore=require("./SelectStore");
            var selectObj=GlobalFunc.getObjRef(workData,selectStore.getSelectInfo().index);
            preOpObj=selectObj;

            break;


    }

});

module.exports = selectTool;
