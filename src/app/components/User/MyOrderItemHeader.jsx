/**
 * @description 我的订单列表Item
 * @time 2016-09-09
 * @author tony
 */

'use strict';

//require core module
var React = require('react');
//导入CSS样式
require('../../../assets/css/myOrder.css');

/**
 * 我的订单界面
 */
var MyOrderItemHeader = React.createClass({
    /**
     * 设置默认值
     *
     */
    getInitialState : function(){
        return {};
    },

    render : function () {
        var iconStyle = {background: 'url("'+this.props.data.icon+'?imageMogr2/thumbnail/!80x80r") no-repeat center'};

        return (
            <div className="order-header-item">
                <div className="order-header-icon" style={iconStyle}></div>
                <span className="order-header-desc">{this.props.data.item_name}</span>
                <span className="order-header-count">{"x"+ this.props.data.count}</span>
            </div>
        )
    }
});

module.exports = MyOrderItemHeader;