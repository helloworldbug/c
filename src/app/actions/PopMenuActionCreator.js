/**
 * Created by 95 on 2015/9/11.
 */
var MeDispatcher = require('../dispatcher/MeDispatcher');
var MeConstants = require('../constants/MeConstants');
var ActionTypes = MeConstants.ActionTypes;
var DialogAction = {
    // ��ѯ��Ʒ����
    showPopMenu: function (pos,el) {
        MeDispatcher.dispatch({
            type : ActionTypes.CHANGE_POPMENU_STATE,
            state: "show",
            pos: pos,
            el:el
        });
    },
    hidePopMenu: function () {
        MeDispatcher.dispatch({
            type : ActionTypes.CHANGE_POPMENU_STATE,
            state: "hidden"
        });
    },
    showCrop: function () {
        MeDispatcher.dispatch({
            type : ActionTypes.CHANGE_CROP_STATE,
            state: "show"
        });
    },
    hideCrop: function () {
        MeDispatcher.dispatch({
            type : ActionTypes.CHANGE_CROP_STATE,
            state: "hidden"
        });
    }

};
module.exports = DialogAction;