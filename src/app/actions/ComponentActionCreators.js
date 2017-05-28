/**
 * @component ComponentActionCreators
 * @description 组件动作创建者, 对公用的组件操作. 比如发一个动作, 显示模板预览组件
 * @time 2015-09-30 10:54
 * @author StarZou
 **/

'use strict';

var MeDispatcher = require('../dispatcher/MeDispatcher');
var MeConstants = require('../constants/MeConstants');

var ActionTypes = MeConstants.ActionTypes;

var ComponentActionCreators = {

    /**
     * 显示模板预览组件
     */
    showTemplatePreview: function (template) {
        MeDispatcher.dispatch({
            type: ActionTypes.SHOW_TEMPLATE_PREVIEW,
            data: template
        });
    },

    /**
     * 隐藏模板预览组件
     */
    hideTemplatePreview: function () {
        MeDispatcher.dispatch({
            type: ActionTypes.HIDE_TEMPLATE_PREVIEW
        });
    }

};

module.exports = ComponentActionCreators;