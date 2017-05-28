/**
 * @description 我的订单列表Item
 * @time 2016-09-09
 * @author zhao
 */

'use strict';

//require core module
var React = require('react');
//导入CSS样式
require('../../../assets/css/myOrder.css');
var OrderItemHeader = require("./MyOrderItemHeader");
var MemberActionCreators = require('../../actions/MembershipPrivilegesActionCreators');
var ContextUtils = require('../../utils/ContextUtils');
var Dialog = require('../Common/Dialog');
var CartDialog = require('../Cart/Cart');
var GlobalFunc = require('../Common/GlobalFunc')
var MakeWebAPIUtils = require('../../utils/MakeWebAPIUtils');

/**
 * 我的订单界面
 */
var MyOrderListItem = React.createClass({
    /**
     * 设置默认值
     *
     */
    getInitialState : function(){
        return {
            dialogTitle : "",
            showDialog : false,
            sureFn : null,
            cartType : 0,
            cartData : null,
            orderId : "",
            orderPayAmount : 0,
            ownGoods : []
        };
    },

    componentDidMount  : function(){
        var self = this;
        MakeWebAPIUtils.loadOwnGoods().then(function(data){
            var goods = data.result || [];
            self.setState({ownGoods:goods});
        });
    },

    /**
     * 再次购买事件
     */
    onBuyHandler : function(){
        /*var self = this;
        var list = this.props.data.items, data=[];
        for(var i = 0; i < list.length; i++){
            var obj = {};
            debugger;
            obj.id = list[i].item_id;
            obj.name = list[i].item_name;
            obj.icon = list[i].icon;
            obj.price = list[i].unit_price / 100.0,
            obj.type = list[i].type;
            obj.sum = list[i].count;
            data.push(obj);
        }*/
        let data = this.initOrderDate();
        if(data === false){
            alert('功能已下线');
            return;
        }
        this.setState({
            cartType : 0,
            cartData : data,
            orderId : ""
        }, () =>{
            this.refs.cart.changeDialogStatus(true,0);
        })
    },

    /**
     * 立即支付事件
     */
    onPayHandler : function(e){
        e.stopPropagation();
        e.preventDefault();
        /*var self = this;
        var list = this.props.data.items, data=[];

        for(var i = 0; i < list.length; i++){
            var obj = {};
            debugger;
            obj.id = list[i].item_id;
            obj.name = list[i].item_name;
            obj.icon = list[i].icon;
            obj.price = list[i].unit_price / 100.0;
            obj.type = list[i].type;
            obj.sum = list[i].count;
            data.push(obj);
        }*/
        let data = this.initOrderDate();
        if(data === false){
            alert('该功能已下线');
            return;
        }
        this.setState({
            cartType : 1,
            cartData : data,
            orderId : this.props.data.id,
            orderPayAmount : this.props.data.total_amount / 100.0
        }, () =>{
            this.refs.cart.changeDialogStatus(true,1);
        })
    },
    /*
    * 增加数据更正复用 add by Mr xu 2015/5/9
    * */
    initOrderDate : function () {
        let list = this.props.data.items, data=[],obj={};
        // debugger;
        for(let value of list){
            //add by高级数据统计和导出数据报表功能下架
            if(value.custom_code === 'Svc_AdvancedStatistics' || value.custom_code === 'Svc_ExportReport'){
                return false;
            }

            obj.id = value.item_id;
            obj.custom_code = value.custom_code;
            obj.name = value.item_name;
            obj.icon = value.icon;
            obj.price = parseInt(value.unit_price) / 100.0;
            obj.type = value.type;
            obj.sum = value.count;
            obj.qixian = '';//默认初始化属性,赋值Cart.jsx会处理
            data.push(obj);
        }
        return data;
    },

    /**
     * 取消支付事件
     */
    onCancelHandler : function(e){
        e.stopPropagation();
        e.preventDefault();
        var userId = ContextUtils.getCurrentUser().id;
        if(!userId) return;

        var opt = {};
        opt.order_id = this.props.data.id;
        opt.userID = userId;

        this.setState({
            dialogTitle: "确定取消该订单吗？",
            showDialog : true,
            sureFn     : this.cancelOrderItem.bind(this, opt)
        });
    },

    /**
     * 取消订单
     */
    cancelOrderItem : function(opt){
        MemberActionCreators.cancelMyOrder(opt);
        this.hideDialog();
    },

    /**
     * 隐藏对话框
     */
    hideDialog : function(){
        this.setState({
            showDialog: false
        });
    },

    render : function () {
        var data = this.props.data, itemList = data.items, hasTemplate=false, isShowPayBtn=true, ownGoods = this.state.ownGoods;
        var headerTemplates = itemList.map(function(obj, index){
            if(obj.type == "template"){
                hasTemplate = true;
                for(var i=0; i<ownGoods.length;i++){
                    if(ownGoods[i].item_description.item_id == obj.custom_code){
                        isShowPayBtn = false;
                    }
                }
            }
            return <OrderItemHeader key={index} data={obj} />
        });
        var statusStr, statusBtn = "";
        switch(data.status_code){
            case 0:
                statusStr = "待支付";
                if(isShowPayBtn){
                    statusBtn = <span className="btn-cancel-div"><span className="btn-buy" onClick={this.onPayHandler}>立即支付</span><span className="btn-buy-cancel" onClick={this.onCancelHandler}>取消支付</span></span>
                }else{
                    statusBtn = <span className="btn-buy-cancel" onClick={this.onCancelHandler}>取消支付</span>
                }
                break;
            case 1:
                statusStr = "支付中"; 
                break;
            case 2:
            case 5:
                if(hasTemplate==false){
                    statusBtn = <span className="btn-buy-again" onClick={this.onBuyHandler}>再次购买</span>
                }
                statusStr = "交易成功";
                break;
            case 3:
                statusStr = "支付失败";
                if(isShowPayBtn){
                    statusBtn = <span className="btn-cancel-div"><span className="btn-buy" onClick={this.onPayHandler}>立即支付</span><span className="btn-buy-cancel" onClick={this.onCancelHandler}>取消支付</span></span>
                }else{
                    statusBtn = <span className="btn-buy-cancel" onClick={this.onCancelHandler}>取消支付</span>
                }
                break;
            case 4:
                statusStr = "待处理";
                break;
            case 6:
            case 7:
                statusStr = "交易关闭";
                break;
        }

        var order_date = GlobalFunc.formatTimeToStr(data.order_at, "yyyy-MM-dd HH:mm");

        return (
            <div className="my-order-item">
                <div className="order-item-title">
                    <span className="order-item-title-data">{order_date}</span>
                    <span className="order-item-title-name">订单号：</span>
                    <span className="order-item-title-no">{data.order_no}</span>
                </div>
                <div className="my-order-item-content">
                    <div className="my-order-item-head-list">
                        {headerTemplates}
                    </div>
                    <div className="order-item-price">{data.total_amount / 100.0}</div>
                    <div className="order-item-status">{statusStr}</div>
                    <div className="order-item-btn-buy">
                        {statusBtn}
                    </div>
                    <div className="clear"></div>
                </div>
                <Dialog title={this.state.dialogTitle} appearanceState={this.state.showDialog}
                        sureFn={this.state.sureFn} cancelFn={this.hideDialog} />
                <CartDialog ref="cart" onOk={this.props.sureFn} cartType={this.state.cartType} orderId={this.state.orderId} data = {this.state.cartData} mainPayAmount={this.state.orderPayAmount} />
            </div>
        )
    }
});

module.exports = MyOrderListItem;