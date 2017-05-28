/**
 * @description 个人中心-账户
 * @time 2016-01-07 13:57
 * @author YJ
 */
'use strict';

// require core module
var React = require('react'),
    ReactDOM=require("react-dom"),
    MePC = require('../../lib/MePC_Public');

var ImageModules = require('../Mixins/ImageModules');
var Base = require('../../utils/Base');
var Dialog = require('../Common/Dialog');
var RedEnvelope = require("../Common/RedEnvelope");
import {Link} from 'react-router';
var AccountDetailList = require("./AccountDetailList");
var Cart = require("../Cart/Cart"),
    MakeWebAPIUtils = require('../../utils/MakeWebAPIUtils');

// require common mixins
var ImageModules = require('../Mixins/ImageModules');
var POPDIALOGTYPE = {
    bindingPhone    : 1,
    bindingAlipay   : 2,
    unBindingPhone  : 3,
    withdraw        : 4,
    withdrawConfirm : 5,
    withdrawIdentify: 6,
    withdrawBill    : 7,
    withdrawFailed  : 8,
    redEnvelope     : 9
};
var ACCOUNTROLEMAP = {
    accountInfo: 1, //账户信息
    accountSecurity: 2, //账户安全
};

var RECORDLISTROLE = {
    incomeExpenditure: 0, //收支记录
    income: 1, //收入记录
    expenditure: 2, //支出记录
    recharge: 3, //充值记录
    withdrawals: 4, //提现记录
};

var RechargePage, //跳转充值页面
    Timer; //刷新时间

var Account = React.createClass({

    mixins: [ImageModules],

    getInitialState() {

        return {
            popupType         : 0,
            verifycodeDisabled: false,
            verifyText        : '获取验证码',
            redEnvelopeCount  : undefined,
            redEnvelopeRecords: [],
            accountTypeTab : ACCOUNTROLEMAP.accountInfo, // tab默认选中 账户信息
            recordListTab: RECORDLISTROLE.incomeExpenditure //记录列表tab默认选中 收支情况
        };
    },

    /*
     * M豆
     */
    generateMeDou: function () {
        return (
            <div className="account-box clearfix">
                <dl>
                    <dt className="medou-pic"></dt>
                    <dd>
                        <h3>500M豆</h3>
                        <p>使用M豆来购买模版等</p>
                    </dd>
                </dl>
                <a href="javascript:;" className="accout-btn fr">充值</a>
            </div>
        );
    },

    /*
     * 余额
     */
    generateBalance         : function () {
        var billBtn = ( this.state.newestBill && this.state.newestBill.length > 0 && this.state.newestBill[0].attributes.status == 1) ? '提现中' : '提现';
        //var balance = this.state.balance === 0 ? "0.00" : this.state.balance; //原有的余额
        var balance = this.state.userAccount === 0 ? "0.00" : this.state.userAccount;
        return (
            <div className="account-box clearfix">
                <dl>
                    <dt className="balance-pic"></dt>
                    <dd>
                        <h3>余额：<span style={{color:"#d65645"}}>{ balance }</span> 元 <Link to={"/helper?type=常见问题&index=6"} target="_blank">发票须知</Link>
                            {/* <a href="javascript:;" onClick={this.changePopupTypeIndex.bind(this, 7)}>账单明细</a>  {!!this.state.newestBill ? (<`pan className="desc">最近提现{this.state.newestBill[0].attributes.amount}元（{this.billStatusType(this.state.newestBill[0].attributes.status)}）</span>) : void 0 }*/}
                        </h3>
                        <p>作品打赏提现，每月仅限一次,提现时请检查账户安全，确保提现金额及时、准确到账</p>
                    </dd>
                </dl>

                <input type="button" onClick={this.goRecharge} className="accout-btn fr" value="充值" />

                {/*<Link className="accout-btn fr" to="/recharge" target="_black" >充值</Link>*/}

                { this.state.balance != 0 ?
                    <input type="button" className="accout-btn fr" onClick={this.handleWithdrawals} value={billBtn}/> :
                    null }


            </div>
        );
    },

    /**
     * 跳转到充值
    */
    goRecharge: function() {
        var _this = this;
        RechargePage = window.open("/recharge");
        Timer = setInterval(function() {
            _this.updateAfterClose();
        }, 1000);
    },

    updateAfterClose: function() {
        var _this = this;
        if(RechargePage.closed == true) {
            clearInterval(Timer);
            _this.queryUserAccountRequest(); // 主窗口刷新
            return;
        }
    },

    generateRedEnvelopeEntry: function () {
        ///getRedEnvelopeCount
        if (this.state.redEnvelopeCount) {
            return (
                <div className="account-box clearfix">
                    <dl>
                        <dt className="redenvelope-pic"></dt>
                        <dd>
                            <h3>{ this.state.redEnvelopeCount }个红包</h3>
                            <p>查看红包记录，红包余额退款</p>
                        </dd>
                    </dl>
                    <input type="button" className="accout-btn fr" onClick={this.showRedEnvelopeSum} value="查看"/>
                </div>
            );
        } else {
            return null
        }
    },
    showRedEnvelopeSum      : function () {
        RedEnvelope.getRedEnvelopeSum(Base.getCurrentUser().id).then((res)=> {
            this.setState({popupType: POPDIALOGTYPE.redEnvelope, redEnvelopeRecords: res.hblist})
        })
    },
    /*
     * 账户安全
     */
    generateSafe            : function () {

        var phoneBind = !this.state.bindmobile ?
            <input type="button" className="accout-btn fr" onClick={this.changePopupTypeIndex.bind(this, 1)}
                   value="绑定"/> :
            <input type="button" className="accout-btn fr" onClick={this.changePopupTypeIndex.bind(this, 3)}
                   value="解除绑定"/>;

        var alipayBind = !this.state.bindalipay ?
            <input type="button" className="accout-btn fr" onClick={this.changePopupTypeIndex.bind(this, 2)}
                   value="绑定"/> :
            <input type="button" className="accout-btn fr" onClick={this.changePopupTypeIndex.bind(this, 3)}
                   value="解除绑定"/>;

        return (
            <div className="account-box clearfix">
                <div className="clearfix">
                    <dl>
                        <dt className="safe-pic"></dt>
                        <dd>
                            <h3>账户安全</h3>
                            <p>绑定手机和支付宝账号提高账户安全性</p>
                        </dd>
                    </dl>
                </div>
                <div className="account-binding">
                    <ul>
                        <li>
                            <div className="fl">
                                <h3>手机号 { !this.state.bindmobile ? <i className="red">未绑定</i> :
                                    <i>{this.generateMosaicChar(this.state.mobile)}</i> }</h3>
                                <p>主要用于提现时验证身份信息</p>
                            </div>

                            { phoneBind }

                        </li>
                        <li>
                            <div className="fl">
                                <h3>支付宝账号  { !this.state.bindalipay ? <i className="red">未绑定</i> : <i>{this.generateMosaicChar( this.state.alipay )}</i> }</h3>
                                <p>主要用于收取提现金额</p>
                            </div>
                            { alipayBind }
                        </li>
                    </ul>
                </div>
            </div>
        );
    },

    /*
     * 弹出层
     */
    generatePopupLayer: function () {
        var content;
        switch (this.state.popupType) {
            case  POPDIALOGTYPE.bindingPhone:
                content = this.generatePopupBindPhone();
                break;
            case POPDIALOGTYPE.bindingAlipay:
                content = this.generatePopupBindPay();
                break;
            case POPDIALOGTYPE.unBindingPhone:
                content = this.generatePopupUnbind();
                break;
            case POPDIALOGTYPE.withdraw:
                content = this.generateCash1();
                break;
            case POPDIALOGTYPE.withdrawConfirm:
                content = this.generateCash2();
                break;
            case POPDIALOGTYPE.withdrawIdentify:
                content = this.generateCash3();
                break;
            case POPDIALOGTYPE.withdrawBill:
                content = this.generateBilling();
                break;
            case POPDIALOGTYPE.withdrawFailed:
                content = this.generateBillingFail();
                break;
            case POPDIALOGTYPE.redEnvelope:
                content = this.generateUserRedEnvelopeSum();
                break;
        }
        return (
            <div className="account-popup">
                {content}
            </div>
        )
    },

    /*
     * 账单明细 
     */
    generateBilling: function () {
        var context = this;
        var bills = MePC.isType(this.state.billRecords, 'array') && this.state.billRecords.map(function (_bill) {
                return (
                    <li><i className="type">{context.billTradeType(_bill.attributes.trade_type)}</i>
                        <i className="amount">{_bill.attributes.trade_type != 2 ? '+' : '-'} { _bill.attributes.amount }</i>
                        <i className="time">{ context.dateToStr(_bill.createdAt) }</i>
                        <i className="trade">{ _bill.attributes.trade_no }</i>
                    </li>
                )
            });
        return (
            <div className="account-popup-layer">
                <div className="billing-head">
                    <span>类型</span>
                    <span>金额</span>
                    <span>时间</span>
                    <span>流水号</span>
                    <i className="close" onClick={this.changePopupTypeIndex.bind(this, 0)}></i>
                </div>
                <div className="billing-lists">
                    <ul>
                        { !bills.length ? <li className="no-data">暂无明细记录</li> : bills }
                    </ul>
                </div>
            </div>
        );
    },

    /*
     * 红包
     */

    generateUserRedEnvelopeSum: function () {
        var context = this;

        var recordRow = this.state.redEnvelopeRecords.map((record) =>{
            var grantTxt = "";
            switch (record.grantstatus) {
                case "1":
                    grantTxt = "未发放"
                    break;
                case "2":
                    grantTxt = "发放中"
                    break;
                case "3":
                    grantTxt = "发放完成"
                    break;
            }
            var refundButton;
            switch (record.tkstatus){
                case "1":
                    refundButton = "-"
                    break;
                case "2":
                    refundButton = <a  href="" onClick={this.redEnvelopeRefund.bind(this,record.hbid)}>退款</a>
                    break;
                case "3":
                    refundButton = "退款完成"
                    break;
            }
            return (
                <div className="row"><span className="name"><a href={"/#preview/tid="+record.tid} target="_blank">{record.hbname}</a></span>
                    <span
                        className="amount">{record.amount.toFixed(2)}</span>
                    <span className="balance">{ record.lastamount.toFixed(2)}</span>
                    <span className="state">{grantTxt}</span>
                    <span className="refund" >{refundButton}</span>
                    <span className="detail"><Link  to={"/redenvelopedetail/"+record.hbid+"/"+record.tid} target="_blank">查看详情</Link></span>
                </div>
            )
        });
        return (
            <div className="redenvelopesum-popup-layer">
                <div className="redenvelopesum-head">
                    <span>活动名称</span>
                    <span>红包金额</span>
                    <span>红包余额</span>
                    <span>发放状态</span>
                    <span>操作</span>
                    <i className="close" onClick={this.changePopupTypeIndex.bind(this, 0)}></i>
                </div>
                <div className="redenvelopesum-lists">
                        { recordRow }
                </div>
            </div>
        );
    },
    redEnvelopeRefund         : function (redEnvelopeId,event) {
        event.preventDefault();
       RedEnvelope.refund(Base.getCurrentUser().id,redEnvelopeId).then(()=>{
           this.showDialog({
               title          : '退款成功，请到钱包账户进行提现',
               appearanceState: true,
               sureIsHide     : true
           });
       }).catch((txt)=>{
           this.showDialog({
               title          : txt,
               appearanceState: true,
               sureIsHide     : true
           });
       })
    },
    /*
     * 账单明细说明
     */
    billTradeType             : function (type) {
        var trade;
        switch (type) {
            case "1":
                trade = "打赏收入";
                break;
            case "2":
                trade = "提现";
                break;
            case "3":
                trade = "提现退款";
                break;
            case "4":
                trade = "红包退款";
                break;
        }
        return trade;
    },

    /*
     * 账单状态信息
     */
    billStatusType: function (type) {
        var status;
        switch (type) {
            case "1":
                status = "提现中";
                break;
            case "2":
                status = "成功";
                break;
            case "3":
                status = <span className="red" onClick={this.changePopupTypeIndex.bind(this, 8)}>失败</span>;
                break;
        }
        return status;
    },

    /*
     * 最近提现
     */
    newestBill: function () {
        var context = this;
        var userId = Base.getCurrentUser().id;
        var user = AV.Object.createWithoutData("_User", userId);
        var query = new AV.Query("money_record");
        query.addDescending('createdAt');
        query.equalTo("user", user);
        query.equalTo("trade_type", '2'); //按照提现查找
        query.limit(1);
        query.find({
            success : function (records) {
                // console.log(records, "最近提现");
                if (records.length > 0) {
                    context.setState({"newestBill": records});
                }
                // cb_ok(records);
            }, error: function (records, err) {
                cb_err(err);
            }
        });
    },

    /*
     * 提现失败信息
     */
    generateBillingFail: function () {
        return (
            <div className="account-popup-layer">
                <div className="account-popup-div1">
                    <h3>提现失败</h3>
                    <div className="form unbind-from">
                        <p className="billing-fail-explain">
                            由于<span className="red">{this.state.newestBill[0].attributes.message}</span>等原因<br/>
                            提现申请未通过，请重新申请
                        </p>
                    </div>
                </div>
                <div className="account-popup-div2">
                    <div className="fr">
                        <input type="button" onClick={this.changePopupTypeIndex.bind(this, 0)} value="确 定"/>
                    </div>
                </div>
            </div>
        );
    },

    /*
     * 弹出层 - 绑定手机
     */
    generatePopupBindPhone: function () {
        return (
            <div className="account-popup-layer">
                <div className="account-popup-div1">
                    <h3>绑定手机号</h3>
                    <div className="form">
                        <p><label>手机号：</label><input type="text" ref="phone"/></p>
                        <p>
                            <label>验证码：</label><input type="text" ref="verify" className="code-txt"/>
                            <input type="button" onClick={ this.handleGetVerify }
                                   disabled={ this.state.verifycodeDisabled } className="btn-get-code"
                                   value={ this.state.verifyText }/>
                        </p>
                    </div>
                </div>
                <div className="account-popup-div2">
                    <span className="fl">绑定后不可随意解除绑定，请谨慎操作</span>
                    <div className="fr">
                        <input type="button" onClick={this.changePopupTypeIndex.bind(this, 0)} value="取 消"/>
                        <input type="button" onClick={this.handlePhoneSubmit} value="确 定"/>
                    </div>
                </div>
            </div>
        );
    },

    /*
     * 弹出层 - 绑定支付宝
     */
    generatePopupBindPay: function () {
        return (
            <div className="account-popup-layer">
                <div className="account-popup-div1">
                    <h3>绑定支付宝</h3>
                    <div className="form"> 
                        <p><label>姓　名：</label><input ref="userName" type="text" /></p>
                        <p><label>支付宝：</label><input ref="userAlipay" type="text" /></p>
                        <p><label>手机号：</label><input type="text" className="code-txt" disabled value={this.generateMosaicChar( this.state.mobile ) } /><input type="button" onClick={ this.handleAlipayVerify } disabled={ this.state.verifycodeDisabled } className="btn-get-code" value={ this.state.verifyText } /></p>
                        <p>
                            <label>验证码：</label><input type="text" ref="alipayVerify" className="" /> 
                        </p>
                    </div>
                </div>
                <div className="account-popup-div2">
                    <span className="fl">绑定后不可随意解除绑定，请谨慎操作</span>
                    <div className="fr">
                        <input type="button" onClick={this.changePopupTypeIndex.bind(this, 0)} value="取 消"/>
                        <input type="button" onClick={this.handleBindAlipaySubmit} value="确 定"/>
                    </div>
                </div>
            </div>
        );
    },

    /*
     * 解除绑定 
     */
    generatePopupUnbind: function () {
        return (
            <div className="account-popup-layer">
                <div className="account-popup-div1">
                    <h3>取消绑定</h3>
                    <div className="form unbind-from">
                        <p className="unbind-explain">
                            如需解除绑定，请将以下信息：<br/>
                            ME账号、姓名、绑定电话、解绑原因<br/>
                            发送至service@gli.cn
                        </p>
                    </div>
                </div>
                <div className="account-popup-div2">
                    <div className="fr">
                        <input type="button" onClick={this.changePopupTypeIndex.bind(this, 0)} value="确 定"/>
                    </div>
                </div>
            </div>
        );
    },

    /*
     * 提现第第一步（提现金额）
     */
    generateCash1: function () {
        return (
            <div className="account-popup-layer">
                <div className="account-popup-div1">
                    <h3>提现金额</h3>
                    <div className="form">
                        <p><label>账户余额：</label><span className="red">{this.state.balance}元</span></p>
                        <p><label>提现金额：</label><input ref="moneys" type="text"/></p>
                    </div>
                </div>
                <div className="account-popup-div2">
                    <span className="fl">提现审核周期为3-5个工作日，节假日顺延</span>
                    <div className="fr">
                        <input type="button" onClick={this.changePopupTypeIndex.bind(this, 0)} value="取 消"/>
                        <input type="button" onClick={this.handlegenerateCash1Submit} value="下一步"/>
                    </div>
                </div>
            </div>
        );
    },

    /*
     * 提现第第一步（提现金额） 提交
     */
    handlegenerateCash1Submit: function () {
        var money = ReactDOM.findDOMNode(this.refs.moneys).value,
            balance = this.state.balance,
            context = this;

        /*输入金额为空*/
        if (money == '' || money == 0) {
            context.showDialog({
                title          : '提现金额不能为空',
                appearanceState: true,
                sureIsHide     : true
            });
        } else if (!this.defineInfo()["nums"].test(money)) { /*输入格式不对*/
            context.showDialog({
                title          : '请输入正确金额格式',
                appearanceState: true,
                sureIsHide     : true
            });
        } else if (money > balance) { /*输入金额大于余额*/
            context.showDialog({
                title          : '余额不足',
                appearanceState: true,
                sureIsHide     : true
            });
        } else { //校验成功 下一步
            context.setState({
                popupType: 5,
                amount   : money
            });
        }
    },

    /*
     * 提现第二步 提现确认
     */
    generateCash2: function () {
        return (
            <div className="account-popup-layer">
                <div className="account-popup-div1">
                    <h3>提现金额</h3>
                    <div className="form">
                        <p><label>提现金额：</label><span className="red">{this.state.amount}元</span></p>
                        <p><label>姓 名：</label>{this.state.verifyname}</p>
                        <p><label>支付宝：</label>{this.state.alipay}</p>
                    </div>
                </div>
                <div className="account-popup-div2">
                    <span className="fl">请仔细确认提现相关信息</span>
                    <div className="fr">
                        <input type="button" onClick={this.changePopupTypeIndex.bind(this, 0)} value="取 消"/>
                        <input type="button" onClick={this.changePopupTypeIndex.bind(this, 6)} value="下一步"/>
                    </div>
                </div>
            </div>
        );
    },

    /*
     * 提现第三步 手机验证
     */
    generateCash3: function () {
        return (
            <div className="account-popup-layer">
                <div className="account-popup-div1">
                    <h3>手机验证</h3>
                    <div className="form">
                        <p><label>手机号：</label>{this.state.mobile}</p>
                        <p>
                            <label>验证码：</label><input type="text" ref="cash3Verify" className="code-txt"/>
                            <input type="button" onClick={ this.handleCash3GetVerify }
                                   disabled={ this.state.verifycodeDisabled } className="btn-get-code"
                                   value={ this.state.verifyText }/>
                        </p>
                    </div>
                </div>
                <div className="account-popup-div2">
                    <span className="fl">为了你的账户安全，请验证绑定的手机号码</span>
                    <div className="fr">
                        <input type="button" onClick={this.changePopupTypeIndex.bind(this, 0)} value="取 消"/>
                        <input type="button" onClick={this.generateCash3Submit} value="完 成"/>
                    </div>
                </div>
            </div>
        );
    },

    /*
     * 提现第三步 手机验证 - 发送验证码
     */
    handleCash3GetVerify: function () {
        var phone = this.state.mobile,
            context = this;

        // 禁用验证码按钮
        context.setState({
            verifycodeDisabled: true
        });

        // 发送验证码
        var mobile = {
            mobilePhoneNumber: phone,
            op               : "提现手机验证"
        };
        fmacloud.Cloud.requestSmsCode(mobile)
            .then(
                function (data) {
                    context.timer = Base.countDowning(
                        function (_second) {
                            context.setState({
                                verifyText: _second + '秒获取'
                            });
                        }, function () {
                            context.setState({
                                verifyText        : '获取验证码',
                                verifycodeDisabled: false
                            });
                        }
                    );
                }, function (data) {
                    context.setState({
                        verifyText        : '重发一次',
                        verifycodeDisabled: false
                    });

                    context.showDialog({
                        title          : data.message || data.error,
                        appearanceState: true,
                        sureIsHide     : true
                    });
                }
            )
    },

    /*提交提现请求*/
    generateCash3Submit: function () {
        var verify = ReactDOM.findDOMNode(this.refs.cash3Verify).value,
            context = this;

        var reg = new RegExp(/^\d{6}$/);
        if (!reg.test(verify)) {
            context.showDialog({
                title          : '验证码格式错误',
                appearanceState: true,
                sureIsHide     : true
            });
            return;
        }

        var tx = {action: "WALLET_TX"};
        tx.amount = this.state.amount;
        tx.code = verify;
        tx.userid = Base.getCurrentUser().id;

        fmacloud.Cloud.run('wallet', tx, {
            success: function (res) {
                res = JSON.parse(res);
                if (res.error == null) {
                    // cb_ok(res);
                    context.setState({
                        popupType: 0
                    }, function () {

                        if (context.timer) {
                            context.clearVerify();
                        }

                        context.changePurse(); //初始化钱袋
                        context.queryBilling(); //账单明细
                        context.newestBill(); //最新提现

                        context.showDialog({
                            title          : '提现请求成功',
                            appearanceState: true,
                            sureIsHide     : true
                        });
                    });
                } else {
                    context.showDialog({
                        title          : res.error,
                        appearanceState: true,
                        sureIsHide     : true
                    });
                    // cb_err(res);
                }
            },
            error  : function (error) { //请求失败

                context.showDialog({
                    title          : '请求失败',
                    appearanceState: true,
                    sureIsHide     : true
                });
                // cb_err(error);
            }
        });
    },

    /*
     * 弹出框选择
     * 0:隐藏  1:绑定手机 2:绑定支付宝 3:解除绑定 4:提现(提现金额) 5:提现(提现确认) 6:提现(手机验证) 7:账单明细 8:失败详细 9：红包记录
     */
    changePopupTypeIndex: function (typeIndex) {
        /*点击绑定支付宝时判断是否绑定手机*/
        if (typeIndex == 2) {
            typeIndex = !this.state.mobile ? 1 : 2;
        }
        this.setState({
            popupType: typeIndex
        })
    },

    /*
     * 提现按钮
     */
    handleWithdrawals: function () {

        if (!this.state.bindmobile) { //手机没有绑定
            this.setState({
                popupType: 1
            });
        } else if (!this.state.bindalipay) { //支付宝没有绑定
            this.setState({
                popupType: 2
            });
        } else if (this.state.txcount == 0) { //本月已经提现过
            this.showDialog({
                title          : '每月只能提现1次',
                appearanceState: true,
                sureIsHide     : true
            });
        } else { //提现
            this.setState({
                popupType: 4
            });
        }
    },

    /*
     * 定义正则类型
     */
    defineInfo() {
        return {
            telExp   : /^1[1-9]\d{9}$/,
            verifyExp: /^.+$/,
            emailExp : /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
            nums     : /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/
        }
    },

    /*
     * 手机绑定 - 发送验证码
     */
    handleGetVerify: function () {
        var phone = ReactDOM.findDOMNode(this.refs.phone).value,
            context = this;

        if (phone == '') {
            context.showDialog({
                title          : '手机号码不能为空',
                appearanceState: true,
                sureIsHide     : true
            });
        } else if (!this.defineInfo()["telExp"].test(phone)) {
            context.showDialog({
                title          : '手机格式错误',
                appearanceState: true,
                sureIsHide     : true
            });
        } else {

            // 禁用验证码按钮
            context.setState({
                verifycodeDisabled: true
            });

            // 发送验证码
            var mobile = {
                mobilePhoneNumber: phone,
                op               : "绑定手机"
            };

            fmacloud.Cloud.requestSmsCode(mobile)
                .then(
                    function (data) {
                        context.timer = Base.countDowning(
                            function (_second) {
                                context.setState({
                                    verifyText: _second + '秒获取'
                                });
                            }, function () {
                                context.setState({
                                    verifyText        : '获取验证码',
                                    verifycodeDisabled: false
                                });
                            }
                        );
                    }, function (data) {

                        context.setState({
                            verifyText        : '重发一次',
                            verifycodeDisabled: false
                        });

                        context.showDialog({
                            title          : data.message || data.error,
                            appearanceState: true,
                            sureIsHide     : true
                        });
                    }
                )
        }
    },

    /*
     *  提交绑定手机信息
     */
    handlePhoneSubmit: function () {
        var phone = ReactDOM.findDOMNode(this.refs.phone).value,
            verify = ReactDOM.findDOMNode(this.refs.verify).value,
            context = this;

        if (phone == '' && !this.defineInfo()["telExp"].test(phone)) {
            context.showDialog({
                title          : '请输入正确手机号码',
                appearanceState: true,
                sureIsHide     : true
            });
            return;
        }

        if (verify == '') {
            context.showDialog({
                title          : '验证码不能为空',
                appearanceState: true,
                sureIsHide     : true
            });
            return;
        }

        var reg = new RegExp(/^\d{6}$/);
        if (!reg.test(verify)) {
            context.showDialog({
                title          : '验证码格式错误',
                appearanceState: true,
                sureIsHide     : true
            });
            return;
        }

        var params = {action: "MOBILE_BIND"};
        params.userid = Base.getCurrentUser().id,
            params.mobile = phone;
        params.code = verify;

        fmacloud.Cloud.run('wallet', params, {
            success: function (res) {
                res = JSON.parse(res);
                if (res.error == null) {
                    // cb_ok(res);
                    clearTimeout(context.timer);
                    context.setState({
                        popupType         : 0,
                        verifyText        : '获取验证码',
                        verifycodeDisabled: false
                    }, function () {

                        context.changePurse(); //初始化钱袋
                        context.showDialog({
                            title          : '手机绑定成功',
                            appearanceState: true,
                            sureIsHide     : true
                        });
                    });

                } else {
                    // console.log(res.error, "error"); 
                    context.showDialog({
                        title          : res.error,
                        appearanceState: true,
                        sureIsHide     : true
                    });
                    // cb_err(res);
                }
            },
            error  : function (error) { //请求失败
                context.showDialog({
                    title          : '请求失败',
                    appearanceState: true,
                    sureIsHide     : true
                });
                // cb_err(error);
            }
        });
    },

    /*
     * 绑定支付宝 发送验证码
     */
    handleAlipayVerify: function () {
        var phone = this.state.mobile,
            context = this;

        // 禁用验证码按钮
        context.setState({
            verifycodeDisabled: true
        });

        // 发送验证码
        var mobile = {
            mobilePhoneNumber: phone,
            op               : "绑定支付宝"
        };
        fmacloud.Cloud.requestSmsCode(mobile)
            .then(
                function (data) {
                    context.timer = Base.countDowning(
                        function (_second) {
                            context.setState({
                                verifyText: _second + '秒获取'
                            });
                        }, function () {
                            context.setState({
                                verifyText        : '获取验证码',
                                verifycodeDisabled: false
                            });
                        }
                    );
                }, function (data) {
                    context.setState({
                        verifyText        : '重发一次',
                        verifycodeDisabled: false
                    });

                    context.showDialog({
                        title          : data.message || data.error,
                        appearanceState: true,
                        sureIsHide     : true
                    });

                }
            )
    },


    /*
     * 提交绑定支付宝信息
     */
    handleBindAlipaySubmit: function () {
        var phone = this.state.mobile,
            userName = ReactDOM.findDOMNode(this.refs.userName).value,
            userAlipay = ReactDOM.findDOMNode(this.refs.userAlipay).value,
            verify = ReactDOM.findDOMNode(this.refs.alipayVerify).value,
            context = this;

        if (userName == '') {
            context.showDialog({
                title          : '姓名不能为空',
                appearanceState: true,
                sureIsHide     : true
            });
            return;
        }

        if (userAlipay == '') {
            context.showDialog({
                title          : '支付宝不能为空',
                appearanceState: true,
                sureIsHide     : true
            });
            return;
        }

        if (!this.defineInfo()["telExp"].test(userAlipay) && !this.defineInfo()["emailExp"].test(userAlipay)) {
            context.showDialog({
                title          : '支付宝格式错误',
                appearanceState: true,
                sureIsHide     : true
            });
            return;
        }

        var reg = new RegExp(/^\d{6}$/);
        if (!reg.test(verify)) {
            context.showDialog({
                title          : '验证码格式错误',
                appearanceState: true,
                sureIsHide     : true
            });
            return;
        }


        var params = {action: "ALIPAY_BIND"};
        params.userid = Base.getCurrentUser().id,
            params.name = userName;
        params.alipay = userAlipay;
        params.code = verify;

        fmacloud.Cloud.run('wallet', params, {
            success: function (res) {
                console.log(res);
                res = JSON.parse(res);
                if (res.error == null) {
                    clearTimeout(context.timer);
                    context.setState({
                        popupType         : 0,
                        verifyText        : '获取验证码',
                        verifycodeDisabled: false
                    }, function () {
                        context.changePurse(); //初始化钱袋
                        context.showDialog({
                            title          : '支付宝绑定成功',
                            appearanceState: true,
                            sureIsHide     : true
                        });
                    });
                }
                // cb_ok(res);
            },
            error  : function (error) {
                context.showDialog({
                    title          : '手机绑定失败',
                    appearanceState: true,
                    sureIsHide     : true
                });
                // cb_err(error);
            }
        });
    },

    componentDidMount: function () {
        this.changePurse(); //初始化钱袋
        this.queryBilling(); //账单明细
        this.newestBill(); //最新提现

        this.queryUserAccountRequest(); //查询用户账户信息请求

        RedEnvelope.getRedEnvelopeCount(Base.getCurrentUser().id).then((res)=> {
            this.setState({redEnvelopeCount: res.hbcount})
            // console.log("redenvelope", res);
        });

    },

    /*
     * 初始化钱袋
     */
    changePurse: function () {
        var context = this;
        var params = {action: "WALLET_INIT"};
        params.userid = Base.getCurrentUser().id,

            fmacloud.Cloud.run('wallet', params, {
                success: function (res) {
                    res = JSON.parse(res);
                    // console.log(res);
                    if (res.error == null) {
                        context.setState({
                            balance   : res.balance,
                            bindmobile: res.bindmobile,
                            bindalipay: res.bindalipay,
                            txcount   : res.txcount,
                            mobile    : res.mobile,
                            alipay    : res.alipay,
                            verifyname: res.verifyname //绑定支付宝姓名
                        });
                    }
                    // cb_ok(res);
                },
                error  : function (error) {
                    cb_err(error);
                }
            });
    },

    /*
     * 获取账单明细列表
     */
    queryBilling: function () {
        var context = this;
        var userId = Base.getCurrentUser().id;
        var user = AV.Object.createWithoutData("_User", userId);
        var query = new AV.Query("money_record");
        query.addDescending('createdAt');
        query.equalTo("user", user);
        query.find({
            success : function (records) {
                // console.log(records, "账单明细");
                //
                context.setState({"billRecords": records});
                cb_ok(records);
            }, error: function (records, err) {
                cb_err(err);
            }
        });
    },

    /**
     * 生成tab
    */
    generateTabType: function() {
        return (
            <div className="account-tab-type">
                <ul>
                    <li className={this.state.accountTypeTab == ACCOUNTROLEMAP.accountInfo ? "active": ""} onClick={this.changeTabIndex.bind(this, ACCOUNTROLEMAP.accountInfo)}>账户信息</li>
                    <li className={this.state.accountTypeTab == ACCOUNTROLEMAP.accountSecurity ? "active": ""} onClick={this.changeTabIndex.bind(this, ACCOUNTROLEMAP.accountSecurity)}>账户安全</li>
                </ul>
            </div>
        )
    },

    /**
     * 改变tab选中项
     */
    changeTabIndex: function(type) {
        this.setState({ accountTypeTab: type });
    },

    /**
     * 生成账户记录tab
     */
    generateRecordTabType: function() {
        return (
            <div className="account-tab-type margin-top-10">
                <ul>
                    <li className={this.state.recordListTab == RECORDLISTROLE.incomeExpenditure ? "active": ""} onClick={this.changeRecordTabIndex.bind(this, RECORDLISTROLE.incomeExpenditure)}>收支记录</li>
                    <li className={this.state.recordListTab == RECORDLISTROLE.income ? "active": ""} onClick={this.changeRecordTabIndex.bind(this, RECORDLISTROLE.income)}>收入记录</li>
                    <li className={this.state.recordListTab == RECORDLISTROLE.expenditure ? "active": ""} onClick={this.changeRecordTabIndex.bind(this, RECORDLISTROLE.expenditure)}>支出记录</li>
                    <li className={this.state.recordListTab == RECORDLISTROLE.recharge ? "active": ""} onClick={this.changeRecordTabIndex.bind(this, RECORDLISTROLE.recharge)}>充值记录</li>
                    <li className={this.state.recordListTab == RECORDLISTROLE.withdrawals ? "active": ""} onClick={this.changeRecordTabIndex.bind(this, RECORDLISTROLE.withdrawals)}>提现记录</li>
                </ul>
            </div>
        )
    },

    /**
     * 改变记录列表tab选中项
    */
    changeRecordTabIndex: function(type) {
        this.setState({ recordListTab: type });
    },

    render: function () {
        var context = this;

        if (!Base.isLogin()) {
            return (
                <div className="inner">
                    {
                        this.buildDialog(
                            {
                                appearanceState: true,
                                title          : '您还未登录，请登录',
                                sureIsHide     : true,
                                cancelFn() {
                                    Base.linkToPath('/');
                                }
                            }
                        )
                    }
                </div>
            );
        }

        return (
            <div className="user-account">
                {
                    context.buildDialog({
                        appearanceState: false,
                        sureFn         : function () {
                            context.showDialog({
                                appearanceState: false
                            });
                        }
                    })
                }
                {/*<div onClick={this.showCartDialog}>show cart</div>*/}
                <Cart ref="cart" />

                {this.generateTabType()}

                {this.state.accountTypeTab == ACCOUNTROLEMAP.accountInfo ? (<div>
                    {/*余额*/}
                    { this.generateBalance() }
                    { this.generateRedEnvelopeEntry() }
                    {/*Me豆*/}
                    { /*this.generateMeDou()*/ }
                </div>): null}

                {this.state.accountTypeTab == ACCOUNTROLEMAP.accountSecurity ? (<div>
                    {/*帐号安全*/}
                    { this.generateSafe() }
                </div>) : null }

                {/* 生成账户记录tab*/}
                {this.generateRecordTabType()}

                {/*弹出层*/}
                { this.state.popupType > 0 ? this.generatePopupLayer() : void 0 }

                {<AccountDetailList recordListTab={this.state.recordListTab} />}

            </div>
        )
    },

    showDialog(states) {
        this.refs.dialog.setState(states);
    },

    buildDialog(options) {
        return <Dialog ref="dialog" {...options} hash="/login"/>
    },

    /*
     * 清除验证码倒计时
     */
    clearVerify: function () {
        var context = this;
        clearTimeout(context.timer);
        context.setState({
            verifyText        : '获取验证码',
            verifycodeDisabled: false
        });
    },

    /*
     * 生成 '*'' 
     */
    generateMosaicChar: function (str) {
        if (!str) {
            return;
        }

        var isEmail;

        if (this.defineInfo()["emailExp"].test(str)) {
            isEmail = true;
        }

        var keyWord = isEmail ? /(.{1,4})@/ : void 0,
            charsFront = !keyWord ? str.slice(0, -4) : str.replace(keyWord, function (total, other) {
                return '****';
            }),
            overCharLength = isEmail ? 4 : str.length - charsFront.length,
            charsBack = '';

        if (!isEmail) { 
            /*for (var i = 0; i < overCharLength + 4; i++ ) {
                charsBack += '*';
            }
            return charsFront + charsBack;  */
            var start, end;
                start = str.substr(0, 3);
                end   = str.substr(7);
            return start + "****" + end;
            
        } else {
            return charsFront;
        }

    },

    /*
     * 格式化时间 
     */
    dateToStr: function (datetime) {
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1;
        var date = datetime.getDate();
        var hour = datetime.getHours();
        var minutes = datetime.getMinutes();
        var second = datetime.getSeconds();
        if (month < 10) {
            month = "0" + month;
        }
        if (date < 10) {
            date = "0" + date;
        }
        if (hour < 10) {
            hour = "0" + hour;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (second < 10) {
            second = "0" + second;
        }

        var time = year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":" + second;

        return time;
    },

    showCartDialog: function() {
        this.refs.cart.changeDialogStatus(true,0); //显示购物车
    },

    /**
     * 查询用户账户信息请求
     */
    queryUserAccountRequest: function() {
        var user = Base.getCurrentUser();
        if(!user) return;
        var _this = this;
        var url = "/v1/trading/useraccount";
        var option = {};
        option.url = url;
        option.userID = user.id;
        option.type = "GET";
        option.success = function(data){
            if(data.err){
                console.log(data.err);
            }else{
                var rst = data.result;
                _this.setState({
                    userAccount: parseFloat(rst.balance / 100).toFixed(2),
                    userAcountStatus: rst.status
                });
            }
        };
        option.error = function(err){
            console.log(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    }


});

module.exports = Account;
