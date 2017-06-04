// 文件名：RechargeView.jsx
//
// 创建人：tony
// 创建日期：2016/9/8 10:27
// 描述： 充值

'use strict';
var React = require('react');
var Base = require('../../utils/Base');
var RechargeHeaderView = require('./RechargeHeaderView');
var GlobalFunc = require("../Common/GlobalFunc");
var classNames = require('classnames');

var MeAPI = require('../../utils/MeAPI');

const RechargeAmount = [100, 300, 600];
const MinValue = 1;
const MaxValue = 20000;


var RechargeView = React.createClass({

    getInitialState(){
        var user = GlobalFunc.getUserObj();
        var userPic="",userNick="";
        if(user){
            userPic = user.user_pic;
            userNick = user.user_nick;
        }

        return {
            amountIndex : 0,
            payTypeIndex : 0,
            inputValue : "",
            isShowInputTip : false,
            isAgree : true,
            userPic : userPic,
            userNick : userNick,
            orderId : null,
            payAmount : 0,
            isLoading : false
        };
    },

    /**
     * 支付金额选择事件
     * @param e
     */
    onAmountHandler : function(e){
        e.stopPropagation();
        e.preventDefault();
        var target = e.target;
        var index = target.dataset.index;
        this.setState({
            amountIndex : index,
            inputValue : "",
            isShowInputTip : false
        });
    },

    /**
     * 输入框获取焦点事件
     * @param e
     */
    onInputFocusHandler : function(e){
        this.setState({amountIndex : -1});
    },

    /**
     * 输入框失去焦点事件
     * @param e
     */
    onInputBlurHandler : function(e){
        var target = e .target;
        var value = target.value;
        value = value.replace(/\.$/,""); //清除最后1位是.
        this.setState({
            inputValue : value,
            isShowInputTip:this.checkInputTipShow(value)
        });
    },

    /**
     * 检测输入的金额的最大值 最小值
     * @param value
     * @returns {boolean}
     */
    checkInputTipShow : function(value){
        if(value < MinValue || value > MaxValue){
            return true;
        }else{
            return false;
        }
    },

    /**
     * 输入金额事件
     * @param eve
     */
    onInputChangeHandler : function(e){
        var target = e .target;
        var value = target.value;

        // if(value!="" && (value<MinValue || value>MaxValue)) return;

        value = value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
        value = value.replace(/^\./g,""); //验证第一个字符是数字而不是
        value = value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
        value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数

        this.setState({inputValue:value, isShowInputTip:this.checkInputTipShow(value)});
    },

    onInputPasteHandler : function(event){
        return false;
    },

    /**
     * 支付方式选择事件
     * @param e
     */
    onPayTypeHandler : function(e){
        e.stopPropagation();
        e.preventDefault();
        var target = e.target;
        var index = parseInt(target.dataset.index);
        this.setState({payTypeIndex : index});
    },

    /**
     * checkbox 点击事件
     */
    onCheckBoxHandler : function(e){
        e.stopPropagation();
        e.preventDefault();
        this.setState({isAgree : !this.state.isAgree});
    },

    /**
     * 确认提交事件
     * @param e
     */
    onConfirmHandler : function(e){
        e.stopPropagation();
        e.preventDefault();

        var user = GlobalFunc.getUserObj();
        if(!user){
            return;
        }

        if(!this.state.isAgree){
            return;
        }

        if(this.state.isShowInputTip){
            return;
        }

        var payData = {};
        var amount = 0;
        if(this.state.amountIndex >=0){
            amount = RechargeAmount[this.state.amountIndex];
        }else{
            amount = parseFloat(this.state.inputValue);
        }

        if(this.state.payAmount){
            amount = parseFloat(this.state.payAmount);
        }
        payData.pay_amount = parseInt((amount * 100).toFixed(0));
        payData.type = this.state.payTypeIndex;
        payData.return_url = window.location.origin + "/paymentSuccess";
        if(this.state.orderId){
            payData.order_id = this.state.orderId;
        }else{
            payData.order_id = "";
        }
        
        var self = this;
        var opt = {};
        opt.data = payData;
        opt.userID = user.objectId;
        self.setState({isLoading : true})
        MeAPI.recharge(opt, function(result){
            self.setState({isLoading : false});
            if(result.qr_code_url){
                var params = {};
                params.trade_no = result.trade_no;
                params.qr_code_url = result.qr_code_url;
                params.amount = amount;
                Base.linkToPath("rechargePayment/?"+ encodeURIComponent(JSON.stringify(params)));
            }else{
                window.document.write(result.package.aliPay.html);
            }
        }, function(error){
            self.setState({isLoading : false});
        });
    },

    //组件渲染前
    componentWillMount() {
        var params = location.search, _state;
        if(params){
            params = JSON.parse(decodeURIComponent(params.substr(1)));
            _state = {};
            if(params.orderId){
                _state.orderId = params.orderId;
            }

            if(params.payAmount){
                _state.payAmount = params.payAmount;
            }

            this.setState(_state);
        }
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
        var amount = 0;
        if(this.state.amountIndex >=0){
            amount = RechargeAmount[this.state.amountIndex];
        }else{
            amount = this.state.inputValue;
        }

        if(this.state.payAmount){
            amount = this.state.payAmount;
        }

        var rechargeDiv = ""
        if(!this.state.payAmount){
            rechargeDiv = <div className="recharge-amount">
                            <span className="recharge-title">充值金额:</span>
                            <span className={this.state.amountIndex == 0 ? "recharge-select-btn selected" : "recharge-select-btn"} data-index="0" onClick={this.onAmountHandler}>{RechargeAmount[0]+"元"}</span>
                            <span className={this.state.amountIndex == 1 ? "recharge-select-btn selected" : "recharge-select-btn"} data-index="1" onClick={this.onAmountHandler}>{RechargeAmount[1]+"元"}</span>
                            <span className={this.state.amountIndex == 2 ? "recharge-select-btn selected" : "recharge-select-btn"} data-index="2" onClick={this.onAmountHandler}>{RechargeAmount[2]+"元"}</span>
                            <div className="recharge-amount-input-div">
                                <input className={this.state.amountIndex == -1 ? "recharge-amount-input selected" : "recharge-amount-input"} type="text" placeholder={this.state.amountIndex == -1 ? "" : "充值其他金额"}
                                       value={this.state.inputValue} onPaste={this.onInputPasteHandler} onFocus={this.onInputFocusHandler} onBlur={this.onInputBlurHandler} onChange={this.onInputChangeHandler}
                                />
                                <span className="amount-tip" style={{display: this.state.isShowInputTip ? "inline-block" : "none"}}>{"*充值最少为"+MinValue+"元，最多"+MaxValue+"元"}</span>
                            </div>
                        </div>
        }

        var btnEnable = this.state.isShowInputTip == false  && this.state.isAgree ? true : false;

        var btnClass = classNames({
            'recharge-btn-sure' : true,
            'recharge-btn-sure-disable' : !btnEnable,
            'loading-animation': this.state.isLoading
        });

        return (
            <div className="recharge-view">
                <RechargeHeaderView />
                <div className="recharge-container">
                    <div className="recharge-container-left">
                        <div className="recharge-user-div">
                            <span>充值到该账户</span>
                            <div className="recharge-user-header-div">
                                <div className="recharge-user-header-img" style={{background : "url('"+this.state.userPic+"') no-repeat center", backgroundSize : "100%"}}></div>
                                <div className="recharge-user-vip-icon"></div>

                            </div>
                            <span className="recharge-user-name">{this.state.userNick}</span>
                        </div>
                        <div className="recharge-use-desc">
                            <li>充值后的账户余额可以用来购买ME
                            所有特权服务、作品模板；</li>
                            <li>账户余额仅用于在ME平台内消费，
                            充值后不能退款，不能进行转账交
                            易，不能兑换ME平台外的产品和服
                            务。</li>
                            <div className="service-number"><div className="phone-icon"></div><div><span>客服电话</span><span>021-58385236</span></div></div>
                        </div>
                    </div>
                    <div className="recharge-container-right">
                        {rechargeDiv}
                        <div className="recharge-pay-type">
                            <span className="recharge-title">支付方式:</span>
                            <span className={this.state.payTypeIndex == 0 ? "recharge-select-btn selected" : "recharge-select-btn"} data-index="0" onClick={this.onPayTypeHandler}>支付宝</span>
                            <span className={this.state.payTypeIndex == 1 ? "recharge-select-btn selected" : "recharge-select-btn"} data-index="1" onClick={this.onPayTypeHandler}>微信</span>
                        </div>
                        <div className="recharge-payments">
                            <span className="recharge-title">应付金额:</span>
                            <span className="recharge-payments-txt">{amount+" 元"}</span>
                            <div className="recharge-clause-div">
                                <span className={this.state.isAgree ? "recharge-checkBox selected" : "recharge-checkBox"} onClick={this.onCheckBoxHandler}></span>
                                <span>我已阅读</span><a href="/helper?type=ME充值服务协议" target="_blank"><span className="recharge-blue-color">ME充值服务协议</span></a></div>
                            <div className="recharge-btn-div">
                                <span className={btnClass} onClick={this.onConfirmHandler}>确定充值</span>
                                <span className="recharge-btn-tip" style={{display: btnEnable ? "inline-block" : "none"}}>请核准收款人为：H5微场景</span>
                            </div>
                        </div>
                    </div>
                    <div className="clear"></div>
                </div>
            </div>
        );
    }
});

/** export component **/
module.exports = RechargeView;