// 文件名：  ActivityDetail.jsx
// 创建人：  YJ
// 创建日期：2015/12/29 14:59
// 描述：    活动列表

'use strict';

var React = require('react');
var Base = require('../../utils/Base');
var RedEnvelope = require("../Common/RedEnvelope");
var GlobalFunc = require("../Common/GlobalFunc")
var MakeWebAPIUtils = require("../../utils/MakeWebAPIUtils")
var UserService = require("../../utils/user.js");

var RedEnvelopeDetail = React.createClass({
    getInitialState      : function () {
        return {
            takeRecords   : [],
            tpl           : undefined,
            redEnvelopeSum: undefined
        }
    },
    componentDidMount    : function () {
        this.getRedEnvelopeItemSum();
        this.getTakeRecord();
        this.getWorksum(this.props.params.tid)
    },
    getWorksum           : function (tplID) {
        MakeWebAPIUtils.getTPL(tplID).then((res)=> {
            this.setState({tpl: res})
        }).catch((txt)=> {
            console.log(txt);
        })
    },
    getRedEnvelopeItemSum: function () {
        RedEnvelope.getRedEnvelopeSum(Base.getCurrentUser().id, this.props.params.redEnvelopeId).then((res)=> {
            var sum = res.hblist[0];
            if (typeof sum == "undefined") {
                return;
            }
            this.setState({redEnvelopeSum: sum})
        })
    },
    getTakeRecord        : function () {
        RedEnvelope.getTakeRecord(this.props.params.redEnvelopeId).then((res)=> {
            var useFullRecords = res.map((record)=> {
                return {
                    sequence : record.get("sequence"),
                    name     : record.get("nickname"),
                    takeTime : GlobalFunc.getDateString(record["createdAt"], "yyyy/MM/dd HH:mm"),
                    takeMoney: record.get("amount")
                }
            })
            this.setState({takeRecords: useFullRecords});
        }).catch(function (error) {
            console.log(error.message)
        })
    },
    genWorkSum           : function () {
        var tpl = this.state.tpl;
        if (typeof tpl == "undefined") {
            return null;
        }
        var rawThumbURL = tpl.get("effect_img");
        var thumbURL = rawThumbURL.substr(3);
        return <div className="work-sum"><img className="work-thumb fl" src={thumbURL}/> <span
            className="work-name fl">{tpl.get("name")}</span>
            <span className="workdate fr">{GlobalFunc.getDateString(tpl["createdAt"], "yyyy-MM-dd")}</span></div>
    },
    genRedEnvelopeSum    : function () {
        var redEnvelopeSum = this.state.redEnvelopeSum;
        console.log(redEnvelopeSum);
        if (typeof redEnvelopeSum == "undefined") {
            return null
        }

        var grantTxt = "";
        switch (redEnvelopeSum.grantstatus) {
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
        return (
            <div className="redenvelope-sum"><span className="redenvelope-thumb fl"/>
                <div className="name-date fl">
                    <div className="redenvelope-name">{redEnvelopeSum.hbname}</div>
                    <div className="date">
                        发放时间:{GlobalFunc.getDateString(new Date(redEnvelopeSum.starttime), "yyyy/MM/dd HH:mm") + "-" + GlobalFunc.getDateString(new Date(redEnvelopeSum.endtime), "yyyy/MM/dd HH:mm")}</div>
                </div>
                <div className="mid fl">
                    <div className="count-wrapper fl">
                        <div className="remain fl">
                            <div className="number">{redEnvelopeSum.count - redEnvelopeSum.lastcount}</div>
                            <div className="type">已领取</div>
                        </div>
                        <span className="separator fl"></span>
                        <div className="amount fl">
                            <div className="number">{redEnvelopeSum.count}</div>
                            <div className="type">红包个数</div>
                        </div>
                    </div>
                    <div className="money-wrapper fl">
                        <div className="remain fl">
                            <div className="number">{redEnvelopeSum.amount - redEnvelopeSum.lastamount}</div>
                            <div className="type">剩余金额</div>
                        </div>
                        <div className="separator fl"></div>
                        <div className="amount fl">
                            <div className="number">{redEnvelopeSum.amount}</div>
                            <div className="type">红包金额</div>
                        </div>
                    </div>
                    <div className="state-wrapper fl">
                        <div className="state">{grantTxt}</div>
                        <div className="type">红包状态</div>
                    </div>
                </div>
                <span className="export fr" onClick={this.exportExcel.bind(this,"redenvelopetakerecord")}>导出Excel</span>
            </div>)
    },
    genTakeRecords       : function () {
        var records = this.state.takeRecords.map((record)=> {
            return <tr >
                <td>{record.sequence}</td>
                <td>{record.name}</td>
                <td>{record.takeTime}</td>
                <td>{record.takeMoney}</td>
            </tr>
        });
        return (
            <div>
                <table className="takerecord" id="redenvelopetakerecord">
                    <thead>
                    <tr className="theader">
                        <th>序号</th>
                        <th>领取人</th>
                        <th>领取时间</th>
                        <th>领取金额</th>
                    </tr>
                    </thead>
                    <tbody className="record-list">
                    {records}
                    </tbody>
                </table>
            </div>)
    },
    exportExcel          : function (tableID) {
        UserService.exportExcel(tableID);
    },
    render               : function () {
        return (
            <div className="content-wrapper redenvelopedetail">
                {this.genWorkSum()}
                {this.genRedEnvelopeSum()}
                {this.genTakeRecords()}
            </div>
        )
    }
});

// export DesignerRule component
module.exports = RedEnvelopeDetail;