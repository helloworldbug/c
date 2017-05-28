// 文件名：RechargeView.jsx
//
// 创建人：zhao
// 创建日期：2016/9/8 10:27
// 描述： 会员特权

'use strict';
var React = require('react');
var Base = require('../../utils/Base');
require('../../../assets/css/recharge.css');
var RechargeHeaderView = require('./RechargeHeaderView');
const CloseTime = 5;

var PaymentSuccessView = React.createClass({

    getInitialState(){
        return {
            closeTime : CloseTime
        };
    },

    startCountDown : function(){
        var self = this;
        self.timer = setInterval(function(){
            var t = self.state.closeTime - 1;
            console.log(t);
            if(t < 0){
                clearInterval(self.timer);
                console.log("close1");
                self.closeWindow();
            }else{
                self.setState({closeTime:t})
            }
        }, 1000);
    },

    closeWindow : function(){
        window.close();
    },

    //组件渲染前
    componentWillMount() {
    },

    //组件渲染完成
    componentDidMount(){
        this.startCountDown();
    },

    /**
     * 组件被移除前
     */
    componentWillUnmount() {
    },

    render : function() {
        return (
            <div className="payment-success-view">
                <RechargeHeaderView />
                <div className="payment-view-container">
                    <div className="payment-view-title" onClick={this.closeWindow}>充值成功</div>
                    <div className="payment-view-main">
                        <div className="payment-view-icon"></div>
                        <span className="payment-view-name">充值成功</span>
                        <span className="payment-view-countdown">{this.state.closeTime + "秒后自动关闭"}</span>
                    </div>
                </div>
            </div>
        );
    }
});

/** export component **/
module.exports = PaymentSuccessView;