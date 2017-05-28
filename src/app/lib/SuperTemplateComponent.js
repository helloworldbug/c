// 文件名：SuperTemplateComponent.jsx
//
// 创建人：曾文彬
// 创建日期：2015/11/10 11:16
// 描述： 基本模板展示组件

'use strict';

var MePC = require('./MePC_Public'),
    MeEvent = require('./MePC_Event');

var SuperTemplateComponent = MePC.inherit(MeEvent, {

    setTemplate: function (templateKey, templateName) {
        var templates;

        if (MePC.isType(templateKey, 'object')) {
            MePC.each(templateKey, (function (_templateName, _templateKey) {
                this.setTemplate(_templateKey, _templateName);
            }).bind(this));
        }

        templates = MePC.isType(this.templates, 'undefined') ? (this.templates = {}) : this.templates;

        templates[templateKey] = templateName;
    },

    getTemplate: function (templateKey) {
        var ret = [];

        if (!MePC.isType(this.templates, 'object')) return;

        if (!templateKey) {
            MePC.each(this.templates, function (_templateName, _templateKey) {
                ret.push(_templateName);
            });

            return ret;
        } else {
            return this.templates[templateKey];
        }
    },

    callerRender: function () {
        var childTemplates = this.getTemplate.apply(this, arguments);

        this.render.apply(this, childTemplates);
    }
});

module.exports = SuperTemplateComponent;
