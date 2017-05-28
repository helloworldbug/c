/**
 * @description 我的订单
 * @time 2016-09-09
 * @author zhao
 */

'use strict';

//require core module
var React = require('react');
import {Link} from 'react-router'
var Base = require('../../utils/Base');
import Select, { Option } from  "rc-select";
const Pagination = require('rc-pagination');
//导入消息管理CSS样式
require('../../../assets/css/myOrder.css');
import 'rc-select/assets/index.css';
require('rc-pagination/assets/index.css');

var MyOrderListItem = require('./MyOrderListItem');

var MemberActionCreators = require('../../actions/MembershipPrivilegesActionCreators');
var MemberStore = require('../../stores/MembershipPrivilegeStore');
var ContextUtils = require('../../utils/ContextUtils');
var defaultOrderPic=require('../../../assets/images/membershipPrivileges/no-order.png');

const OptionName1 = "近三个月";
const OptionName2 = "近一年";
const TabAll = 0;
const TabPay = 1;
const PageSize = 10;

/**
 * 我的订单界面
 */
var MyOrder = React.createClass({

    /**
     * 设置默认值
     *
     */
    getInitialState : function(){
        return {
            currentPage : 1,
            currentTab : TabAll,
            currentOptionName : OptionName1,
        };
    },

    /**
     * 标签改变事件
     * @param e
     */
    onTabClickHandler : function(e){
        e.stopPropagation();
        e.preventDefault();

        var target = e.target, id = target.dataset.id, self = this;
        if(id){
            self.setState({currentTab: id}, function(){
                self.queryMyOrderList();
            });
        }
    },

    /**
     * 查询条件改变事件
     * @param optName
     */
    onChangeSelectData : function(optName){
        var self = this;
        self.setState({currentOptionName: optName}, function(){
            self.queryMyOrderList();
        });
    },

    /**
     * 当前页改变
     */
    onPageChange : function(index){
        this.setState({currentPage : index});
    },

    /**
     * 数据改变
     */
    onDataChange : function(){
        var data = MemberStore.getMyOrderData();
        this.setState({
            currentPage : 1,
            data : data
        })
    },

    onOrderOperation : function(type, data){
        if(type == 1){
            this.onOrderAdd(data);
        }else{
            this.onOrderChangeStatus(data);
        }
    },

    onOrderAdd : function(data){
        var list = MemberStore.getMyOrderData();
        list.reverse();
        list.push(data);
        list.reverse();
        this.setState({
            data : list
        })
    },

    onOrderChangeStatus : function(data){
        var list = MemberStore.getMyOrderData();
        //如果是所有订单 只要改变订单状态
        for(var i = 0; i< list.length; i++){
            if(list[i].id == data.order_id){
                list[i].status_code = data.status_code;
                break;
            }
        }

        if(this.state.currentTab == TabPay){
            list.splice(i, 1);
        }

        this.setState({
            data : list
        })
    },

    render : function () {
        var data = this.state.data || [], itemComponents = "", self = this;
        var start = (this.state.currentPage - 1) * PageSize, end = start + PageSize;
        var total = data.length, list = data.slice(start, end);
        itemComponents = list.map(function(data, index){
            return <MyOrderListItem sureFn={self.onOrderOperation} key={index} data={data} />
        });
        return (
            <div className="myOrderView">
                <div className="title-div">
                    <span className={this.state.currentTab == TabAll ? "selected" : ""} data-id={TabAll} onClick={this.onTabClickHandler}>全部订单</span>
                    <span className={this.state.currentTab == TabPay ? "last selected" : "last"} data-id={TabPay} onClick={this.onTabClickHandler}>待支付订单</span>
                </div>
                <div className="menu-title-div">
                    <div className="menu-title-date">
                        <Select className="menu-title-select"  value={this.state.currentOptionName} onChange={this.onChangeSelectData} showSearch={false} >
                            <Option value={OptionName1}>{OptionName1}</Option>
                            <Option value={OptionName2}>{OptionName2}</Option>
                        </Select>
                    </div>
                    <span className="menu-title-detail">订单详情</span>
                    <span className="menu-title-total">总额（元）</span>
                    <span className="menu-title-status">全部状态</span>
                    <span className="menu-title-operate">操作</span>
                </div>

                {
                    itemComponents.length > 0 ?
                        <div className="my-order-list">
                            {itemComponents}
                        </div>
                        : <div className="no-order-list"><img src={defaultOrderPic} /><div>你还没有任何订单</div></div>
                }
                {
                    total > 0 ?
                        <div className="page-box">
                            <Pagination className="showQuickJumper" showQuickJumper onChange={this.onPageChange} pageSize={PageSize} current={this.state.currentPage}  defaultCurrent={1} total={total} />
                        </div>
                        : null
                }

                <div className="clear"></div>
            </div>
        )
    },

    /**
     * 组件加载完成
     */
    componentDidMount : function(){
        MemberStore.addChangeListener(this.onDataChange);
        this.queryMyOrderList();
    },

    /**
     * 组件被移除前
     */
    componentWillUnmount() {
        MemberStore.removeChangeListener(this.onDataChange);
    },

    queryMyOrderList : function(){
        var userId = ContextUtils.getCurrentUser().id;
        if(!userId) return;

        var startDate = new Date();
        var endDate = new Date();
        if(this.state.currentOptionName == OptionName1){
            endDate.setDate(endDate.getDate());
            endDate.setHours(23,59,59);
            startDate.setMonth(startDate.getMonth()-3);
            startDate.setDate(startDate.getDate()+1);
            startDate.setHours(0,0,0);
        }else{
            endDate.setDate(endDate.getDate());
            endDate.setHours(23,59,59);
            startDate.setFullYear(startDate.getFullYear()-1);
            startDate.setDate(startDate.getDate()+1);
            startDate.setHours(0,0,0);
        }

        var opt = {};
        if(this.state.currentTab == 1){
            opt.status = 0
        }
        opt.fromDate = parseInt(+startDate / 1000);
        opt.toDate = parseInt(+endDate / 1000);
        opt.userID = userId;
        MemberActionCreators.queryMyOrderData(opt);
    }
});

module.exports = MyOrder;