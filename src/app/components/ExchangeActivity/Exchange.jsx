/**
 * @component 新书兑换模板
 * @description 首页组件
 * @time 2016-09-19
 * @author yangjian
 **/

'use strict';

// require core module
var React = require('react'),
    ReactDOM=require("react-dom"),
    Footer = require('../Common/Footer'),
    Dialog = require('../Common/Dialog'),
    Base = require('../../utils/Base');

require('../../../assets/css/exchange.css');
import {Link} from 'react-router';

var ExchangeActivity = React.createClass({

    getInitialState: function() {
        return {
            showDialog: false,
            value: '', //兑换码内容
            tips: '' //表单错误提示文字
        }
    },

    render: function () {
        var _this = this;
        return (
            <div>
                <div className="exchange-activity">
                    <div className="banner">
                        <div className="center">
                            <p>
                                <Link to="/make" target="_blank" className="buy">立即购买>></Link>
                            </p>
                            <h3>
                                即日起至活动结束时间为止，购买《创意无间-H5微场景设计指南》<br />
                                即送价值<span>145</span>元H5精品模板！
                            </h3>
                            <p className="time">活动时间：2016年10月8日——2017年10月8日</p>
                        </div>
                    </div>
                    <div className="main">
                        <div className="center">
                            <div className="pic fl"></div>
                            <div className="form fr">
                                <h3>输入验证码立即领取限量模板</h3>
                                <input type="text" ref="mcode" onInput={this.onInputHandle} value={this.state.value} onChange={this.valueChangeHandle} className="txt"  />
                                <p className="err-tips">{this.state.tips}</p>
                                <input type="button" value="立即领取" onClick={this.onSubmitHandle} className="btn" />
                            </div>
                        </div>
                    </div>
                    <div className="foot">
                        <h3>活动规则</h3>
                        <p>活动时间：2016年10月8日——2017年10月8日</p>
                        <p>活动规则：本活动验证码随书附赠，只有购买《创意无间-H5微场景设计指南》才能获得活动验证码。每个验证码只能使用一
                            次，必须持有ME账户才能领取限量模板，且只能验证一次。</p>
                        <p>活动最终解释权在法律规定范围内归上海精灵天下数字技术有限公司所有</p>
                        <p>活动客服热线：400-8868-110</p>
                    </div>
                </div>
                <Footer />
                <Dialog title={this.state.dialogTitle} appearanceState={this.state.showDialog}
                        sureFn={this.state.sureFn} sureIsHide = {this.state.sureIsHide} />
            </div>
        );
    },


    /**
     * 表单输入时触发
    */
    onInputHandle: function(e) {
        var target = e.target,
            value = target.value;

        if(!/^[0-9a-zA-Z]*$/g.test(value)) {
            this.setState({
                tips: "只允许输入字母和数字"
            });
        }else {
            this.setState({
                tips: ""
            });
        }
    },

    /**
     * 表单失去焦点时触发
    */
    onBlurHandle: function(e) {
        var value = e.target.value;
        var opt = {};
        opt.mcode = value.toUpperCase();
        this.checkMcode(opt);
    },

    /**
     * 检查兑换码
     * @param opt
    */
    checkMcode: function(opt) {
        var _this = this;
        fmacloud.Cloud.run("mc_check", opt, {
            success: function (res){
                if(!res.result) { //  兑换码不可用
                    _this.setState({
                        tips: res.message
                    });
                }
            },
            error  : function (error) { //请求失败
                console.log(error, "error");
            }
        });
        return;
    },

    /**
     * 值改变
    */
    valueChangeHandle: function(e) {
        var value = e.target.value;
        value = value.replace(/([^\u0000-\u00FF])/g, '');
        this.setState({
            value: value
        });
    },

    /**
     * 提交
    */
    onSubmitHandle:function() {
        var _this = this;
        var user = Base.getCurrentUser();

        var mcode = ReactDOM.findDOMNode(this.refs.mcode).value;
        if(mcode == '') {
            _this.setState({
                tips: '兑换码为空'
            });
            ReactDOM.findDOMNode(this.refs.mcode).focus();
            return;
        }else if(!user) {
            _this.setState({
                dialogTitle: '您还未登录，请登录',
                showDialog     : true,
                sureIsHide     : true,
                sureFn     : function() {
                    localStorage.setItem("referer", "/exchangeActivity"); //设置登录后跳转地址
                    Base.linkToPath('login');
                }
            });
            return;
        }else{
            var opt = {};
            opt.mcode = mcode.toUpperCase();
            //_this.checkMcode(opt); //检查兑换码
            opt.uid = user.id;
            fmacloud.Cloud.run("mc_redeem", opt, {
                success: function (res){
                    if(!res.result) { //  兑换失败
                        _this.setState({
                            dialogTitle    : res.message,
                            showDialog     : true,
                            sureIsHide     : true,
                            sureFn         : _this.hideDialog
                        });
                    }else {
                        /*_this.showDialog({
                            title          : "兑换成功",
                            showDialog     : true,
                            sureIsHide     : true,
                            sureFn         : function() {
                                Base.linkToPath("/user");
                            }
                        });*/
                        _this.setState({
                            dialogTitle    : "兑换成功",
                            showDialog     : true,
                            sureIsHide     : true,
                            sureFn         : function() {
                                Base.linkToPath("/user");
                            }
                        });
                    }
                },
                error  : function (error) { //请求失败
                    console.log(error, "error");
                }
            })
        }
    },

    showDialog(states) {
        this.refs.dialog.setState(states);
    },

    /**
     * 关闭dialog
     */
    hideDialog: function () {
        this.setState({
            showDialog: false
        });
    }

});

// export Index component
module.exports = ExchangeActivity;