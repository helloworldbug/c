/*
 * Created by 95 on 2015/9/11.
 */
var MeDispatcher = require('../dispatcher/MeDispatcher');
var MeConstants = require('../constants/MeConstants');
var DialogTypes = MeConstants.SelectDialog;
var DialogAction = {

    show: function (dialogType, initData, props) {
        MeDispatcher.dispatch({
            type      : DialogTypes.SHOW,
            dialogType: dialogType,
            initData  : initData,
            props     : props
        });
    },

    hide: function () {
        MeDispatcher.dispatch({
            type: DialogTypes.HIDE
        });
    }

};
module.exports = DialogAction;