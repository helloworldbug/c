// 文件名：DesignerTribeLabel.jsx
//
// 创建人：曾文彬
// 创建日期：2015/11/11 14:46
// 描述： 设计师领域标签

'use strict';

var React = require('react');

var Base= require('../../utils/Base');

var MePC = require('../../lib/MePC_Public');

var Dialog = require('../Common/Dialog');

var SuperLogicComponent = require('../../lib/SuperLogicComponent');

var model = new (require('../../utils/Model'));

model.set('tableName', 'labels');

var DesignerTribeLabel = MePC.inherit(SuperLogicComponent, React.createClass({

    generateTemplate: function (label, index, array) {
        var handleClick = this.props.isSlice ?
            this.getPageActions('chooseUserLabels').bind(this, label.attributes.name) :
            this.getPageActions('getDesignersByLabel').bind(this, label.attributes.name); 

        var isChoosed = this.isCurrentUserLabel() || void 0,
            isAddClassByIndex = !!(this.props.isSlice && ( isChoosed ? MePC.inArray(isChoosed, label.attributes.name) : (index == 0 || index == 1) ))

        return (
            <li key={index}>
                <a href="javascript:;" onClick={ handleClick } className={isAddClassByIndex && "active"}>{ label.attributes.name }</a>
            </li>
        );
    },

    generateSelectSQL: function (selectSQLObject) {
        return model.getSelectSQL(selectSQLObject);
    },

    isCurrentUserLabel: function () {
        return Base.getCurrentUser().attributes.user_labels;
    },

    send: function (selectSQLObject) {
        var userLabels = this.isCurrentUserLabel(), selectSQL;

        if (!this.props.isSlice) {

            if (!userLabels) {
                selectSQL = this.generateSelectSQL(selectSQLObject);

                fmacloud.Query.doCloudQuery(selectSQL, {
                    success: (function (_data) {
                        var data = _data.results.slice(0, 2);

                        this.trigger('labelSuccess', data);
                    }).bind(this),
                    error: (function (_error) {
                        
                        this.trigger('labelError', _error);
                    }).bind(this)
                });          
            } else {
                userLabels = userLabels.map(function (labelName) {
                    return {
                        attributes: {
                            name: labelName
                        }
                    }
                });
            }

            this.trigger('labelSuccess', userLabels||[]);
        } else {
            selectSQL = this.generateSelectSQL(selectSQLObject);

            fmacloud.Query.doCloudQuery(selectSQL, {
                success: (function (_data) {
                    this.trigger('labelSuccess', _data);
                }).bind(this),
                error: (function (_error) {
                    this.trigger('labelError', _error);
                }).bind(this)
            });
        }
    },

    receiveSuccess: function (data) {
        this.setState({
            labels: !this.props.isSlice ? data : data.results
        });
    },

    receiveError: function (error) {
        
    },

    getCurrentChooseClass: function () {
        return MePC.makeArray($('.tribeLabelLists').find('.active'));
    },

    chooseUserLabels: function (labelName, e) {
        if (!e.target.classList.contains('active')) {

            if (this.getCurrentChooseClass().length > 2) {
                this.refs.dialog.setState({
                    appearanceState: true
                });

                return;
            }
            
            e.target.classList.add('active');
        } else {
            e.target.classList.remove('active');
        }

        this.props.chooseLabel && this.props.chooseLabel();
    },

    getDesignersByLabel: function (name) {
        var callCallback = this.props.getDesignersByLabel;

        callCallback && callCallback(name);
    },

    getInitialState: function () {
        return {
            labels: []
        };
    },

    componentWillMount: function () {
        this.setPageActions('getDesignersByLabel', this.getDesignersByLabel);
        this.setPageActions('chooseUserLabels', this.chooseUserLabels);
    },

    render: function () {
        var context = this;

        var labels = this.state.labels.map((function (_label, _index, _array) {
            return this.generateTemplate(_label, _index, _array);
        }).bind(this));

        var visibleAddBtn = !this.props.isSlice ?
            (   <li>
                    <button className="tribeLabelBtn" onClick={ this.props.popupLabelLyer }>{ this.isCurrentUserLabel() && this.isCurrentUserLabel().length >= 3 ? ' + ' : ' + ' }</button>
                </li>
            ) : null;

        var dialog = this.props.isSlice ?
            (
                <Dialog ref="dialog" sureIsHide={ true } sureFn={ function() { context.refs.dialog.setState({ appearanceState: false }) } }  title="选择数不能超过3个" />
            ) : null;

        return (
            <ul className="clearfix">
            
                { labels }
                
                { visibleAddBtn }

                { dialog }
            </ul>
        );

    },

    componentDidMount: function () {
        // 成功事件
        this.bindDataEvents('labelSuccess', 'receiveSuccess');

        // 失败事件
        this.bindDataEvents('labelError', 'receiveError');

        var sendParamObj = {
            fieldColumn: '*',
            
            whereCondition: {
                'type = ': '\'designer_label\''
            }
        };

        // 请求数据
        this.send(sendParamObj);
    }

}));

module.exports = DesignerTribeLabel;
