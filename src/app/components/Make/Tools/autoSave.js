/*
 * Created by 95 on 2015/8/12.
 */


var WorkDataUtil = require('../../../utils/WorkDataUtil');
var GlobalFunc = require('../../Common/GlobalFunc');
var _ = require('lodash');

var mask = $("<div class='save-mask'></div>");
var autoSave = {
    start    : function () {
        if (this.working)return;
        this.working = true;
        //debugger;
        $(document).on('mousedown', debounceSave)
    },
    stop     : function () {
        this.working = false;
        debounceSave.cancel();
        $(document).off('mousedown', debounceSave)
    }
    , working: false
}
function save() {
    console.log("saving", autoSave.working);
    if (!autoSave.working) return;
    saveWork("", {
        tpl_type : 11
    }); //reference to save button hanler --> indexjs:_saveModel()
}

function saveWork(type, option) {
    var failedTimer = null;
    var MagazineStore = require("../../../stores/MagazineStore");
    var MakeActionCreators = require("../../../actions/MakeActionCreators");
    var tplData = MagazineStore.getTplDataClone(true);
    var tplobj = MagazineStore.getTpl();

    function failed(error) {
        ///todo 恢复数据
        MakeActionCreators.saveUpdate(tplobj, tplData);
        if (error) {
            console.error(error)
        }
        if (typeof error == "string") {
            error = "保存失败：" + error;
        } else {
            error = "保存失败"
        }
        SortCut.init();
        $(mask).remove();
        GlobalFunc.addSmallTips(error, null, {clickCancel: true});
        //$("#save-tip").html(error);
        $(".action-button-save").children(".saveLoading").remove();
        //setTimeout(function () {
        //    $("#save-tip").hide();
        //}, 5000);
    }

    var option = option || {};
    var SortCut = require('../shortcut/ShortCut');
    SortCut.unInit();
    $(".action-button-save").append("<div class='saveLoading'></div>");
    $("#app").append(mask);

    GlobalFunc.addSmallTips("自动保存中... ", null, {
        cancel   : true,
        cb_cancel: function () {

            ///todo 恢复数据
            MakeActionCreators.saveUpdate(tplobj, tplData);
            $(mask).remove();
            $(".action-button-save").children(".saveLoading").remove();
            SortCut.init();
            WorkDataUtil.resetSave();
        }
    });
    //$("#save-tip").html("自动保存中... <span id='save-cancel'>【取消】</span>").show();
    //function cancelSave() {
    //
    //    SortCut.init();
    //    $(mask).remove();
    //    $(".action-button-save").children(".saveLoading").remove();
    //    $("#save-tip").hide();
    //    WorkDataUtil.resetSave();
    //
    //}
    //
    //$('#save-cancel').click(cancelSave);
    //failedTimer = setTimeout(failed, 15000);
    WorkDataUtil.saveQuick(type, function () {
        SortCut.init();
        GlobalFunc.addSmallTips("已自动保存到草稿箱", null, {clickCancel: true, delBackGround: true});
        $(".action-button-save").children(".saveLoading").remove();
        $(mask).remove();

        function removeDiv() {
            $("#save-tip").hide();
            $(document).off("mousedown", removeDiv).off('keydown', removeDiv);
        }

        $(document).on("mousedown", removeDiv).on('keydown', removeDiv);
        //setTimeout(function () {
        //    $("#createModel").remove();
        //}, 2000);
    }, failed, option)
}
var debounceSave = _.debounce(save, 1000 * 60 * 3);

module.exports = autoSave;
//module.exports=new  AutoTask(1000*60*10,autoSave,1000*10);

