// ChildLabels.jsx
// 子标签组件
// 曾文彬 
// 2015-12-18

'use strict';

var React = require('react');

var MEPCApi = require('../../lib/MePC_Public');

var SuperLogicComponent = require('../../lib/SuperLogicComponent');

var MeAction = require('../../actions/NewMeActionCreator');

var ChildLabelStore = require('../../stores/ChildLabelStore');

var LabelsModel = require('../../utils/LabelsModel');

var labelsModel = new LabelsModel();

// var Model = new (require('../../utils/Model'));

// Model.set('tableName', 'labels');

var ChildLabels = MEPCApi.inherit(SuperLogicComponent, React.createClass({

    getChildLabelStores: function () {
        return {
            childLabelStores: ChildLabelStore.getChildLabels() 
        };
    },

    onChange: function () {
        this.setState(this.getChildLabelStores());
    },

    getInitialState: function () {
        return this.getChildLabelStores();
    },

    request: function (parentLabelName) {
        var whereCondition = {
            'description =': '\'works_forlabel\'',
            'type in': '(\''+ (parentLabelName || 'all') +'\')'
        };

        labelsModel
            .getLabelsBySQL({

                'fieldColumn': '*',
                'whereCondition': whereCondition,
                'orderCondition': 'order desc'

            }).then((function (childLabels) {
                this.props.getAllChildLabels && this.props.getAllChildLabels(childLabels.results);
                MeAction.showChildLabelTemplate(childLabels);
            }).bind(this));
    },

    handleClick: function (name) {
        var func = this.props.getTemplatesByChildLabelCategory;

        return (function (evt) {
            func.call(this.props, name);
            this.changeActiveClass($(evt.currentTarget));                    
        }).bind(this);
    },

    changeActiveClass(jqNode) {
        var activeClass = 'active';
        jqNode.addClass(activeClass).siblings().removeClass(activeClass);
    },

    render: function () {
        var childLabelStores = this.state.childLabelStores.map((function (childLabel) {
            return (
                <a href="javascript:;" onClick={ this.handleClick(childLabel.attributes.name) }>{ childLabel.attributes.name }</a>
            );
        }).bind(this));

        return (
            <p>{ childLabelStores }</p>
        );
    },

    componentDidMount: function () {
        // 监听store
        ChildLabelStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function () {
        // 释放store
        ChildLabelStore.removeChangeListener(this.onChange);
        ChildLabelStore.stripChildLabels();
    }
}));

module.exports = ChildLabels;