// 文件名：DesignerTribeLabel.jsx
//
// 创建人：曾文彬
// 创建日期：2015/11/11 14:46
// 描述： 设计师领域标签

'use strict';

var React = require('react');

var MePC = require('../../lib/MePC_Public');

var SuperLogicComponent = require('../../lib/SuperLogicComponent');

var model = new (require('../../utils/Model'));

model.set('tableName', 'labels');

var DesignerTribeLabel = MePC.inherit(SuperLogicComponent, React.createClass({

    generateTemplate: function (label, index) {
        return (
            <li key={index} >
                <a href="javascript:;" onClick={ this.getPageActions('getDesignersByLabel').bind(this, label.attributes.name) }>{ label.attributes.name }</a>
            </li>
        );
    },

    generateSelectSQL: function (selectSQLObject) {
        return model.getSelectSQL(selectSQLObject);
    },

    send: function (selectSQLObject) {
        var selectSQL = this.generateSelectSQL(selectSQLObject);
        fmacloud.Query.doCloudQuery(selectSQL, {
            success: (function (_data) {
                if (this.mounted) {
                    this.trigger('labelSuccess', _data);
                }

            }).bind(this),
            error: (function (_error) {
                if (this.mounted) {
                    this.trigger('labelError', _error);
                }

            }).bind(this)
        });
    },

    receiveSuccess: function (data) {
        this.setState({
            labels: data.results || []
        });
    },

    receiveError: function (error) {

    },

    getDesignersByLabel: function (name, e) {
        var callCallback = this.props.getDesignersByLabel;

        $(e.target).addClass('active').parent().siblings('li').find('a').removeClass('active');

        callCallback && callCallback(name);
    },

    componentWillUnmount: function () {
        this.mounted = false
    },
    getInitialState: function () {
        this.mounted = true
        return {
            labels: []
        };
    },

    componentWillMount: function () {
        this.setPageActions('getDesignersByLabel', this.getDesignersByLabel);

    },

    render: function () {
        var firstLabel =
            (
                <li>
                    <a href="javascript:;" onClick={ this.getPageActions('getDesignersByLabel').bind(this, '全部') } className="active">全部</a>
                </li>
            )

        var labels = this.state.labels.map((function (_label, _index) {
            return this.generateTemplate(_label, _index);
        }).bind(this));

        return (
            <ul className="clearfix">

                { firstLabel }

                { labels }

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
