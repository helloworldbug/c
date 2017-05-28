/**
 * @component 发布作品
 * @description 发布作品
 * @time 2015-09-19 19:20
 * @author Nick
 **/
var React = require("react");
import {Link} from 'react-router'
var QRCode = require('qrcode.react');
var DialogAction = require("../../../../actions/DialogActionCreator");
var TplObjModel = require('../../../../utils/TplObjModel');
var GlobalFunc = require("../../../Common/GlobalFunc");
var RedEnvelope = require("../../../Common/RedEnvelope");
var MakeAction = require('../../../../actions/MakeActionCreators');
var moneyPlaceholder = "";
var countPlaceholder = "";
var COUNTDOWN =10 * 60-1;
var stepNameArr;
var userObj;
var DATESPAN = 14;
var entryTime=""
module.exports = React.createClass({
    getInitialState: function () {
        entryTime =GlobalFunc.getDateString( new Date(), "yyyy-MM-dd HH:mm:ss")
        return {
            step        : 0,
            envelopeName: "新年抢红包",
            ower        : "",
            blessing    : "恭喜发财,大吉大利!",
            money       : "",
            count       : "",
            startTime   : entryTime,
            endTime     : GlobalFunc.getDateString(new Date(new Date().valueOf() + 1000 * 60 * 60 * 24 * DATESPAN), "yyyy-MM-dd HH:mm:ss"),
            error       : false,
            countdown   : COUNTDOWN,
            countTimer  : null,
            payTimer    : null,
            codeURL     : "",
            tradeno     : "",
            hbid        : "",
            skipPay     : false,
            disableNext:false,
        }
    },

    componentWillMount  : function () {
        userObj = GlobalFunc.getUserObj();
        if (userObj.speFunctionCode) {
            if (userObj.speFunctionCode.indexOf("SKIPPAY") > -1) {
                this.setState({skipPay: true})
            }
        }
        stepNameArr = ["notice", "editTips", "editMoney", "pay", "paySuccess", "payFailed"]
        if (this.state.skipPay) {
            stepNameArr = ["notice", "editTips", "editMoney", "paySuccess", "payFailed"]
        }
        this.setState({ower: userObj.user_nick});
        moneyPlaceholder =  this.props.moneyMin + "-" + this.props.moneyMax;
        countPlaceholder = "";
    },
    componentWillUnmount: function () {
        this.removeTimer();
    },
    enterStep           : function (stepName) {
        var stepIndex;
        for (let i = 0; i < stepNameArr.length; i++) {
            if (stepNameArr[i] == stepName) {
                stepIndex = i;
                break;
            }
        }
        if (stepIndex) {
            this.setState({step: stepIndex})
        } else {
            console.log("stepIndex error");
        }
    },
    removeTimer         : function () {
        if (this.state.countTimer) {
            clearInterval(this.state.countTimer);
        }
        if (this.state.payTimer) {
            clearInterval(this.state.payTimer);
        }
        this.setState({payTimer: null, countTimer: null})
    },
    closeDialog         : function () {
        this.removeTimer();
        DialogAction.hide();
    },
    nextStep            : function () {
        this.setState({step: (this.state.step + 1)})
    },
    prevStep            : function () {
        this.setState({step: (this.state.step - 1)})
    },
    addRedEnvelope      : function () {
        //update database
        var par = {
            userid   : userObj.objectId,
            tid      : this.props.tid,
            name     : this.state.envelopeName,
            wishing  : this.state.blessing,
            amount   : this.state.money,
            count    : this.state.count,
            starttime: new Date(this.state.startTime),
            endtime  : new Date(this.state.endTime),
            sendname:this.state.ower
        };
        if(this.state.disableNext==true){
            return;
        }
        console.log("next",this.state.disableNext);
        this.setState({disableNext:true})
        RedEnvelope.addRedEnvelope(par).then((res)=> {
            if (this.state.skipPay) {
                this.setState({hbid: res.hbid});
                this.addToPage();
                this.enterStep("paySuccess");
            } else {
                //get payurl
                this.enterPay(res)
            }
            this.enableNext()
        }).catch((error)=> {
            this.enableNext()
            GlobalFunc.addSmallTips(error, null, {clickCancel: true});
        })
    },
enableNext:function(){
    setTimeout(()=>{
        this.setState({disableNext:false})
    },2000)
},
    enterPay     : function (res) {
        var _this = this;
        this.getPayURL(res).then((res)=> {
            this.setState({
                codeURL: res.url,
                tradeno: res.tradeno
            })
            this.checkPayState();
            this.countDown();
            this.enterStep("pay");
        });
    },
    getPayURL    : function (obj) {
        this.setState({hbid: obj.hbid});
        var par = {
            total_fee : this.state.money,// 金额
            trade_type: '2',//交易类型 2为微信支付
            hbid      : obj.hbid, //红包ID
            uid       : userObj.objectId,//支付用户id
            body      : this.state.envelopeName  // 描述
        };
        return RedEnvelope.getPayURL(par);
    },
    editTipsNext:function(){
        if(GlobalFunc.trimStr(this.state.blessing)==""||GlobalFunc.trimStr(this.state.envelopeName)==""||GlobalFunc.trimStr(this.state.ower)==""){
            return ;
        }
        this.nextStep();
    },

    editMoneyNext: function () {
        //valid data,add remote database record,next
        if (typeof this.state.count == "number" && typeof this.state.money == "number") {
            if (RedEnvelope.isValidRedEnvelope(this.state.money, this.state.count)) {
                if (this.state.startTime != "" && this.state.endTime != "") {
                    this.addRedEnvelope();
                }
            }
        }
    },
    addToPage    : function () {
        var ItemInit = require("../../../Common/ItemInit");
        MakeAction.addElement({type: 'redEnvelope', obj: ItemInit.redEnvelopeInit(this.state.hbid,this.props.tid)});
        GlobalFunc.createModel("", {
            tpl_state: 1, //未完成
            tpl_type : 11,
            tpl_class: 0
        });
    },
    textChange   : function (name, event) {
        this.setState({[name]: event.target.value})
    },
    moneyChange  : function (event) {
        var input=GlobalFunc.trimStr(event.target.value)
        if (isNaN(input)||input=="") {
            this.setState({money: input});
            countPlaceholder = ""
            return
        }
        var money = Number(input);
        money = RedEnvelope.getValidMoney(money);
        var countSpan = RedEnvelope.getCountSpan(money);

        countPlaceholder =  countSpan.min + "-" + countSpan.max;
        this.setState({money: money})
    },
    countChange  : function (event) {
        var input=GlobalFunc.trimStr(event.target.value)
        if (isNaN(input)||input=="") {
            this.setState({count: input});
            return
        } else {
            var count = Number(input);
            this.setState({count: count})
        }
    },
    countDown    : function () {
        //超时
        var _this = this;
        this.setState({countdown: COUNTDOWN});
        var countTimer = setInterval(()=> {
            var time = _this.state.countdown;
            var nextTime = time - 1;
            if (nextTime < 0) {
                _this.removeTimer()
                _this.enterStep("payFailed");
            } else {
                _this.setState({countdown: nextTime})
            }
        }, 1000);
        _this.setState({countTimer: countTimer});
    },
    checkPayState: function () {
        //定时向服务器检查是否付款成功
        var _this = this;
        var payTimer = setInterval(()=> {
            RedEnvelope.getPayState(_this.state.tradeno).then((res)=> {
                if (res.result) {
                    _this.removeTimer();
                    _this.addToPage();
                    _this.nextStep();
                }
            }).catch((msg)=> {
                GlobalFunc.addSmallTips(msg, null, {clickCancel: true})
            })
        }, 2000);
        _this.setState({payTimer: payTimer})
    },
    dateClick    : function (id, event) {
        var _this = this;
        var minDate,maxDate;
        if(id=="start_time"){
            maxDate=this.state.endTime
            minDate= GlobalFunc.getDateString(new Date(new Date(new Date(maxDate).valueOf() - 1000 * 60 * 60 * 24 * DATESPAN).setHours(0, 0, 0)),"yyyy-MM-dd HH:mm:ss");

        }else{
            minDate= this.state.startTime;
            maxDate= GlobalFunc.getDateString(new Date(new Date(new Date(minDate).valueOf() + 1000 * 60 * 60 * 24 * DATESPAN).setHours(23, 59, 59)),"yyyy-MM-dd HH:mm:ss");
        }
        WdatePicker({
            el          : id,
            onpicked    : this.setTime.bind(this, id),
            autoPickDate: true,
            minDate     :  minDate,
            maxDate     : maxDate,
            isShowClear:false
        })
    },
    setTime      : function (id) {
        if (id == "start_time") {
            this.setState({startTime: $dp.cal.getDateStr()})
        } else {
            this.setState({endTime: $dp.cal.getDateStr()})
        }
    },
    noop:function(){

},
    reAdd        : function (event) {
        event.preventDefault();
        clearInterval(this.state.payTimer);
        this.setState({countdown: COUNTDOWN, step: 2, payTimer: null})
    },
    render       : function () {
        var content;
        var pageName = stepNameArr[this.state.step]
        switch (pageName) {
            case "notice":
                content = <div className="redenvelope-dialog notice">
                    <h1>红包使用须知</h1>
                    <ul>
                        <li>1.红包只在微信中发放并被领取。</li>
                        <li>2.每个用户可以领取的红包金额最少1元，最多200元。</li>
                        <li>3.红包一旦添加，便不可再修改，除非你删除当前红包。</li>
                        <li>4.充值金额将于红包失效（即到达结束日期）后退还到“个人中心-账户”中。</li>
                        <li>5.红包一旦添加，且作品已保存或发布成功，即视为你已同意红包在设置的有效时间内被领取。</li>
                        <li>6.点击“使用”按钮，即视为你已阅读本《须知》并愿意承担相关风险。</li>
                    </ul>
                    <div className="modal-footer">
                        <button className="ok" onClick={this.nextStep}>使&nbsp;&nbsp;&nbsp;用</button >
                        <button onClick={this.closeDialog}>放&nbsp;&nbsp;&nbsp;弃</button >
                    </div>
                </div>
                break;
            case "editTips":
                content = <div className="redenvelope-dialog edit-tips">
                    <h1><span className="select">编辑红包信息</span><span className="separator">></span>设置红包金额<span
                        className="separator">></span>塞钱进红包</h1>
                    <div className="content">
                        <div className="line"><span>活动名称：</span><input type="text"
                                                                       onChange={this.textChange.bind(this,"envelopeName")}
                                                                       value={this.state.envelopeName} maxLength="10"/><span className={GlobalFunc.trimStr(this.state.envelopeName)==""?"error":"error hide"}>不能为空</span></div>
                        <div className="line"><span>发送者：</span><input type="text"
                                                                      onChange={this.textChange.bind(this,"ower")}
                                                                      value={this.state.ower} maxLength="10"/><span className={GlobalFunc.trimStr(this.state.ower)==""?"error":"error hide"}>不能为空</span></div>
                        <div className="line"><span>祝福语：</span><input type="text"
                                                                      onChange={this.textChange.bind(this,"blessing")}
                                                                      value={this.state.blessing} maxLength="20"/><span className={GlobalFunc.trimStr(this.state.blessing)==""?"error":"error hide"}>不能为空</span></div>
                    </div>
                    <div className="modal-footer">
                        <span className="tips">编辑完成后不能修改，请认真填写</span>
                        <button className="ok" onClick={this.editTipsNext}>下&nbsp;一&nbsp;步</button >
                        <button onClick={this.closeDialog}>取&nbsp;&nbsp;&nbsp;消</button >
                    </div>
                </div>
                break;

            case "editMoney":
                content = <div className="redenvelope-dialog edit-money">
                    <h1>编辑红包信息<span className="separator">></span><span className="select">设置红包金额</span><span
                        className="separator">></span>塞钱进红包</h1>
                    <div className="content">
                        <div className="line"><span>总金额：</span><input type="text" onChange={this.moneyChange}
                                                                      value={this.state.money}
                                                                      placeholder={moneyPlaceholder}/><span
                            className="unit">元</span><span className={this.state.money==""?"error":"error hide"}>不能为空</span><span className={isNaN(this.state.money)?"error":"error hide"}>只能输入数字</span></div>
                        <div className="line"><span>红包个数：</span><input onChange={this.countChange}
                                                                       value={this.state.count}
                                                                       placeholder={countPlaceholder}/><span
                            className="unit">个</span><span className={RedEnvelope.isValidRedEnvelope(this.state.money,this.state.count)?"error hide":"error"}>单个红包需要满足1-200元</span>
                        </div>
                        <div className="line"><span>开始时间：</span><input id="start_time" type="text"
                                                                       onClick={this.dateClick.bind(this,"start_time")}
                                                                       value={this.state.startTime} onChange={this.noop}/></div>
                        <div className="line"><span>结束时间：</span><input id="end_time" type="text"
                                                                       onClick={this.dateClick.bind(this,"end_time")}
                                                                       value={this.state.endTime} onChange={this.noop}/></div>
                    </div>
                    <div className="modal-footer">
                        <span className="tips">添加成功后，可以在<Link to="/user/6" target="_blank"> 账户 </Link>中查看红包记录</span>
                        <button className="ok" onClick={this.editMoneyNext} disabled={this.state.disableNext}>下&nbsp;一&nbsp;步</button >
                        <button onClick={this.prevStep}>上&nbsp;一&nbsp;步</button >
                    </div>
                </div>
                break;

            case "pay":
                var time = this.state.countdown;
                var timeStr = GlobalFunc.getTimeString(time, "m:ss");
                content = <div className="redenvelope-dialog pay">
                    <h1>编辑红包信息<span className="separator">></span>设置红包金额<span
                        className="separator">></span><span className="select">塞钱进红包</span></h1>
                    <div className="content">
                        <div className="pay-code">
                            <QRCode size={160} value={this.state.codeURL}/>
                            <div className="description">微信扫描二维码支付</div>
                        </div>
                        <div className="line1">请在<em> {timeStr}</em> 内完成支付</div>
                        <div className="line2">红包总金额：<em>￥{this.state.money.toFixed(2)}</em></div>

                    </div>
                    <div className="modal-footer">
                        <span className="tips">如需大额充值，请联系4008-868-110</span>
                        <button className="ok" onClick={this.closeDialog}>取&nbsp;&nbsp;&nbsp;消</button >
                    </div>
                </div>
                break;

            case "paySuccess":
                content = <div className="redenvelope-dialog pay-success">
                    <h1>编辑红包信息<span className="separator">></span>设置红包金额<span
                        className="separator">></span><span className="select">塞钱进红包</span></h1>
                    <div className="content">
                        <div className="img-success"></div>
                        <div className="line1">支付成功！</div>
                        <div className="line2">发布作品就可以让伙伴们领红包了！</div>
                    </div>
                    <div className="modal-footer">
                        <span className="tips">支付成功后，请在请在<Link to="/user/6" target="_blank"> 账户 </Link>中查看</span>
                        <button className="ok" onClick={this.closeDialog}>完&nbsp;&nbsp;&nbsp;成</button >
                    </div>
                </div>
                break;
            case "payFailed":
                content = <div className="redenvelope-dialog pay-failed">
                    <h1>编辑红包信息<span className="separator">></span>设置红包金额<span
                        className="separator">></span><span className="select">塞钱进红包</span></h1>
                    <div className="content">
                        <div className="img-failed"></div>
                        <div className="line1">支付超时，请<a className="readd" href="" onClick={this.reAdd}>重新添加</a>红包</div>
                    </div>
                    <div className="modal-footer">
                        <span className="tips">如需大额充值，请联系4008-868-110</span>
                        <button className="ok" onClick={this.closeDialog}>取&nbsp;&nbsp;&nbsp;消</button >
                    </div>
                </div>
                break;
        }
        return (
            <div className="select-dialog">
                {content}
            </div>
        )
    }


});
