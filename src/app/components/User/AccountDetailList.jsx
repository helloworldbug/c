/**
 * @description 个人中心-账户清单列表
 * @time 2016-09-08 15:00
 * @author YJ
 */
'use strict';

// require core module
var React = require('react');
var Base = require('../../utils/Base');
var GlobalFunc = require('../Common/GlobalFunc');

import {Link} from 'react-router';
require('rc-pagination/assets/index.css');
const Pagination = require('rc-pagination');
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';

var MakeWebAPIUtils = require('../../utils/MakeWebAPIUtils'),
    MeActionCreators = require('../../actions/MeActionCreators'),
    MeStore = require('../../stores/MeStore');

const FromData = {
    threeMonths : 1, //最近三个月
    oneYear : 2 //最近一年
};

const PageSize = 10;

var AccountDetailList= React.createClass({

    getInitialState() {
        return {
            data : [],
            currentPage: 1, //默认第一页
            fromData: FromData.threeMonths, //默认最近三个月
            recordListTab: this.props.recordListTab //tab 类型
        }
    },

    /**
     * 获取交易记录
    */
    queryListData: function() {

        var startDate = new Date();
        if(this.state.fromData == FromData.threeMonths){ //近三个月
            startDate.setMonth(startDate.getMonth()-3);
            startDate.setDate(startDate.getDate()+1);
            startDate.setHours(0,0,0);

        }else{ //近一年
            startDate.setFullYear(startDate.getFullYear()-1);
            startDate.setDate(startDate.getDate()+1);
            startDate.setHours(0,0,0);
        }

        var formDate = GlobalFunc.formatTimeToStr(startDate, 'yyyy-MM-dd HH:mm:ss');

        var type = this.state.recordListTab;
        this.queryListRequest(type, formDate, function(data) {
            var trade;
            if(data.err) {
                trade = []
            }else {
                trade = data.result;
            }
            MeActionCreators.queryTradeList(trade);
        }, function(err) {

        });

    },

    /**
     * 查询记录列表
     * @param type 类型
     * @param fromData 交易的起始时间
     */
    queryListRequest: function(type, fromData, cb_ok, cb_err) {
        var url = "/v1/trading/trade/info?type="+type+"&date_from=" + fromData;
        var option = {};
        option.url = url;
        option.userID = Base.getCurrentUser().id;
        option.type = "GET";
        option.success = function(data){
            cb_ok(data);
        };
        option.error = function(err){
            cb_err(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    },

    /**
     * 获取数据列表
    */
    getListData: function() {
       var tradeList = MeStore.getTradeList();
        this.setState({
            currentPage : 1,
            data : tradeList
        });
    },

    getStatus: function(status) {
        var value;
        switch(status) {
            case 1:
                value = "等待付款";
                break;
            case 2:
                value = "付款成功";
                break;
            case 3:
                value = "交易成功";
                break;
            case 4:
                value = "付款失败";
                break;
            case 5:
                value = "交易失败";
                break;
        }

        return value;
    },

    /**
     * 平台信息
    */
    getChannel: function(channel) {
        var value;
        switch(channel) {
            case 0:
                value = "支付宝";
                break;
            case 1:
                value = "微信二维码";
                break;
            case 2:
                value = "微信公众号";
                break;
            case 3:
                value = "提现";
                break;
            case 4:
                value = "直接扣余额";
                break;
        }

        return value;
    },

    render: function() {
        var recordListTab = this.props.recordListTab,
            data = this.state.data || [];

        var start = (this.state.currentPage - 1) * PageSize,
            end = start + PageSize;
        var total = data.length,
            list = data.slice(start, end);

        var listHeader,
            itemContent;

        var _this = this;

        switch (recordListTab) {
            case 0:
            case 2:
            case 4:
                listHeader = (
                    <ul>
                        <li className="time">
                            <Select className="datail-time-select" value={this.state.fromData} optionLabelProp="children" dropdownClassName="datail-time-select-down" onChange={this.onChangeFromDataHandler} showSearch={false} >
                                <Option value={FromData.threeMonths}>近三个月</Option>
                                <Option value={FromData.oneYear}>近一年</Option>
                            </Select>
                        </li>
                        <li className="list-id">流水编号</li>
                        <li className="name">名称</li>
                        <li className="money">金额（元）</li>
                    </ul>
                );
                itemContent = list.map((item, index) => {
                    return (
                        <div className="item" key={index}>
                            <ul>
                                <li className="time">{item.trade_date}</li>
                                <li className="list-id">{item.trade_no}</li>
                                <li className="name">{item.trade_name}</li>
                                <li className="money">{item.trade_fee}</li>
                            </ul>
                        </div>
                    )
                });
                break;
            case 1:
                listHeader = (
                    <ul>
                        <li className="time">
                            <Select className="datail-time-select" value={this.state.fromData} optionLabelProp="children" dropdownClassName="datail-time-select-down" onChange={this.onChangeFromDataHandler} showSearch={false} >
                                <Option value={FromData.threeMonths}>近三个月</Option>
                                <Option value={FromData.oneYear}>近一年</Option>
                            </Select>
                        </li>
                        <li className="list-id">流水编号</li>
                        <li className="name">名称</li>
                        <li className="money">金额（元）</li>
                        <li className="channel">渠道</li>
                    </ul>
                );
                itemContent = list.map((item, index) => {
                    return (
                        <div className="item" key={index}>
                            <ul>
                                <li className="time">{item.trade_date}</li>
                                <li className="list-id">{item.trade_no}</li>
                                <li className="name">{item.trade_name}</li>
                                <li className="money">{item.trade_fee}</li>
                                <li className="channel">{_this.getChannel(item.platform)}</li>
                            </ul>
                        </div>
                    )
                });
                break;
            case 3:
                listHeader = (
                    <ul>
                        <li className="time">
                            <Select className="datail-time-select" value={this.state.fromData} optionLabelProp="children" dropdownClassName="datail-time-select-down" onChange={this.onChangeFromDataHandler} showSearch={false} >
                                <Option value={FromData.threeMonths}>近三个月</Option>
                                <Option value={FromData.oneYear}>近一年</Option>
                            </Select>
                        </li>
                        <li className="list-id">流水编号</li>
                        <li className="name">名称</li>
                        <li className="money">金额（元）</li>
                        <li className="channel">渠道</li>
                        <li className="state">状态</li>
                    </ul>
                );
                itemContent = list.map((item, index) => {
                    return (
                        <div className="item" key={index}>
                            <ul>
                                <li className="time">{item.trade_date}</li>
                                <li className="list-id">{item.trade_no}</li>
                                <li className="name">{item.trade_name}</li>
                                <li className="money">{item.trade_fee}</li>
                                <li className="channel">{_this.getChannel(item.platform)}</li>
                                <li className="state">{this.getStatus(item.status)}</li>
                            </ul>
                        </div>
                    )
                });
                break;
        }

        return (
            <div>
                <div className="account-detail-list">
                    <div className="list-header">
                        {listHeader}
                    </div>
                    <div className="list">
                        { itemContent.length > 0 ? itemContent : (<div className="no-list">你还没有任何记录</div>) }
                    </div>
                </div>
                { itemContent.length > 0 ? (<div className="page-box">
                    <Pagination
                        selectComponentClass={Select}
                        showQuickJumper onChange={this.onPageChange} defaultPageSize={PageSize} current={this.state.currentPage} total={total} />
                </div>) : null}
            </div>)
    },

    componentDidMount: function() {
        this.queryListData();
        MeStore.addChangeListener(this.getListData);
    },

    componentWillReceiveProps: function(nextProps) {
        var _this = this;
        if(nextProps.recordListTab != this.state.recordListTab) {
            _this.setState({
                recordListTab: nextProps.recordListTab
            }, function() {
                _this.queryListData();
            });
        }
    },

    componentWillUnmount: function() {
        MeStore.removeChangeListener(this.getListData);
    },

    /**
     * 改变时间选择
    */
    onChangeFromDataHandler: function(value) {
        var _this = this;
        this.setState({fromData: value}, function() {
            _this.queryListData();
        });
    },

    onPageChange: function(page) {
        this.setState({currentPage:page});
    }

});

module.exports = AccountDetailList;