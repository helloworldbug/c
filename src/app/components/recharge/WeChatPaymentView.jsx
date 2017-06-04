// 文件名：WeChatPaymentView.jsx
//
// 创建人：tony
// 创建日期：2016/9/18 13:56
// 描述： 会员特权

'use strict';
var React = require('react');
var Base = require('../../utils/Base');
require('../../../assets/css/recharge.css');
var QRCode = require('qrcode.react'); 
var RechargeHeaderView = require('./RechargeHeaderView');
var MeAPI = require('../../utils/MeAPI');

var WeChatPaymentView = React.createClass({

    getInitialState(){
        return {
            amount : 0,
            qrCode : ""
        };
    },

        
    /**
     * 生成二维码
    */
    generateQRCode(value, size = 128) {
        return (<QRCode value={value} size={size}/>);
    },
    

    //组件渲染前
    componentWillMount() {
        var self = this;
        self.data = JSON.parse(decodeURIComponent(location.search.substr(1)));
        var amount = self.data.amount || 0;
        var qrCodeUrl = decodeURIComponent(self.data.qr_code_url);

        self.setState({
            amount : amount,
            qrCode : self.generateQRCode(qrCodeUrl, 168)
        })

        self.intervalId = setInterval(function(){
            self.checkTradeStatus();
        }, 1000);
    },

    //组件渲染完成
    componentDidMount(){
    },

    /**
     * 组件被移除前
     */
    componentWillUnmount() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    },

    checkTradeStatus : function(){
        var opt = {};
        opt.trade_no = this.data.trade_no;
        MeAPI.getTradeStatus(opt, function(data){
            if(data.status == 3){
                Base.linkToPath("paymentSuccess");
            }
        })
    },

    render : function() {
        var qrCodeStyle = "";
        if(this.state.qrCode){
            qrCodeStyle = {background: `url(${this.state.qrCode}) no-repeat center`, backgroundSize:"100%"};
        }

        return (
            <div className="weChat-payment-view">
                <RechargeHeaderView />
                <div className="weChat-payment-container">
                    <div className="weChat-payment-info">
                        <span className="weChat-payment-info-title">ME平台充值</span>
                        <span className="weChat-payment-info-company">收款方：H5微场景</span>
                        <div className="weChat-payment-info-money"><span>{this.state.amount}</span>元</div>
                    </div>
                    <div className="weChat-payment-main">
                        <div className="weChat-payment-main-icon"></div>
                        <div className="weChat-payment-main-title">扫一扫付款（元）</div>
                        <div className="weChat-payment-main-money">{this.state.amount}</div>
                        <div className="weChat-payment-qrCode-div">
                            <div className="weChat-payment-qrCode-img">{this.state.qrCode}</div>
                            
                            <div className="weChat-payment-qrCode-info">
                                <div className="weChat-payment-qrCode-info-icon"></div>
                                <div className="weChat-payment-qrCode-info-txt">
                                    <span>请使用微信扫描</span>
                                    <span>二维码以完成支付</span>
                                </div>
                            </div>
                        </div>
                        <div className="weChat-payment-txt-tip">亿万用户的选择更快更安全</div>
                        <div className="weChat-payment-img-tip"></div>
                    </div>
                </div>
            </div>
        );
    }
});

/** export component **/
module.exports = WeChatPaymentView;