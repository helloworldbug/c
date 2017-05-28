// 文件名：RechargeView.jsx
//
// 创建人：zhao
// 创建日期：2016/9/8 10:27
// 描述： 会员特权

'use strict';
var React = require('react');
var Base = require('../../utils/Base');
require('../../../assets/css/recharge.css');

var RechargeHeaderView = React.createClass({

    getInitialState(){
        return {};
    },

    //组件渲染前
    componentWillMount() {
    },

    //组件渲染完成
    componentDidMount(){
    },

    /**
     * 组件被移除前
     */
    componentWillUnmount() {
    },

    render : function() {
        return (
            <header id="header" className="recharge-header-div">
                <div className="clearfix rechargeHeaderClearfix">
                    <div className="rechargeHeader-logo"></div>
                </div>
            </header>
        );
    }
});

/** export component **/
module.exports = RechargeHeaderView;