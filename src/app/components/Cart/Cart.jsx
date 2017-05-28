/**
 * @name 购物车
 * @time 2016-9-10
 * @author yangjian
 **/
'use strict';

// require core module
var React = require('react');
var Base = require('../../utils/Base');
var CartItem = require('./CartItem');
var MeActionCreators = require('../../actions/MeActionCreators'),
    MakeWebAPIUtils = require('../../utils/MakeWebAPIUtils');

var Dialog = require('../Common/Dialog');
import { Link } from 'react-router'

require('../../../assets/css/cart');

var sucessPic = require('../../../assets/images/cart/sucess.png');
var chargeFailedPic = require('../../../assets/images/cart/charge-failed.png');
var qPic = require('../../../assets/images/cart/q.png');

var DIALOGTYPE = {
    buy: 0, //购买列表
    order: 1 //订单列表
}

var Cart = React.createClass({

    getInitialState: function () {
        return {
            showCartDialog: false, //显示状态
            data: [],
            dialogType: this.props.cartType || DIALOGTYPE.buy,  //默认购买
            popInfo : false //切换弹出框,默认不显示
        }
    },

    /**
     * 查询用户账户信息请求
    */
    queryUserAccountRequest: function () {
        var user = Base.getCurrentUser();
        if (!user) return;
        var _this = this;
        var url = "/v1/trading/useraccount";
        var option = {};
        option.url = url;
        option.userID = user.id;
        option.type = "GET";
        debugger;
        option.success = function (data) {
            if (data.err) {
                console.log(data.err);
            } else {
                var rst = data.result;
                _this.setState({
                    account: parseFloat(rst.balance / 100).toFixed(2),
                    acountStatus: rst.status
                });
            }
        };
        option.error = function (err) {
            console.log(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    },

    /**
     * 计算总价
    */
    calcTatal: function () {
        var data = this.state.data || [];
        var total = 0;
        for (var i = 0; i < data.length; i++) {
            // total += parseFloat(data[i].price) * parseInt(data[i].sum || 1);
            total += parseFloat(data[i].price) * parseInt(data[i].sum);
        }

        return total;
    },

    render: function () {
        var _this = this;
        var data = this.state.data || [];
        var dataListDom = data.map(function (item, index) {
            if(typeof item.custom_code !== 'undefined'){
                item.qixian = Base.change_end_at(item.custom_code);
            }
            return <CartItem data={item} dataChangeFn={_this.dataChange} key={index} buyStatus={_this.state.dialogType} type={item.type} />
        });

        var total = this.calcTatal(); //求总价

        var headerDom,popChangeInfo,
            footDom;
        if (this.state.dialogType == DIALOGTYPE.buy) {
            headerDom = (
                <div className="fl">
                    <span>购买特权</span>
                    <span className="balance">账户余额：￥{this.state.account || "0.00"}</span>
                    <span><Link to="/recharge" target="_black">去充值</Link></span>
                </div>
            );

            footDom = (
                <div className="cart-footer">
                    <div className="fl">购买特权为虚拟服务，购买成功后概不退款</div>
                    <div className="fr">
                        <div className="fl">
                            <p><span>总价：</span><span className="balance">￥{total.toFixed(2)}</span></p>
                        </div>
                        <input type="button" value="去结算" onClick={this.generateOrderHandler} />
                    </div>
                </div>
            );
        } else {
            headerDom = (
                <div className="fl">
                    <span>订单信息确认</span>
                </div>
            );
            footDom = (
                <div className="cart-footer">
                    <div className="fl">确定支付后，你的余额将会扣除付款金额</div>
                    <div className="fr">
                        <div className="fl order-foot">
                            <p><span>实付款：</span><span className="balance">￥{this.state.mainPayAmount}</span></p>
                            <p><span>账户余额：</span><span>￥{this.state.account || "0.00"}</span></p>
                        </div>
                        <input type="button" value="确定支付" onClick={this.payOrderHandler} />
                    </div>
                </div>
            );
        }

        if(this.state.popInfo){
            popChangeInfo = <div className="popInfo"><div></div><div>{this.state.popInfo}</div></div>;
        }



        if (this.state.showCartDialog) {
            return (
                <div className="cart-bg">
                    <div className="cart-content">
                        <div className="cart-header">
                            {headerDom}
                            <div className="close" onClick={this.changeDialogStatus.bind(this, false,0)}></div>
                        </div>
                        <div className="cart-box">
                            <div className="cart-box-header">
                                <ul>
                                    <li>名称</li>
                                    <li>单价（元）</li>
                                    <li>数量</li>
                                    <li>期限</li>
                                    <li>小计（元）</li>
                                </ul>
                            </div>
                            {popChangeInfo}

                            <div className="cart-list">
                                {dataListDom}
                            </div>
                        </div>
                        {footDom}
                    </div>
                    <Dialog title={this.state.dialogTitle} sureText={this.state.sureText} showHeader={this.state.showHeader} appearanceState={this.state.showDialog} sureIsHide={this.state.sureIsHide} sureFn={this.state.sureFn} cancelFn={this.state.cancelFn} />
                </div>
            )
        } else {
            return null;
        }

    },

    componentWillReceiveProps: function (nextProps) {
        // debugger;
        var _state = { dialogTitle: "", showDialog: false };
        var cartType = nextProps.cartType || DIALOGTYPE.buy;
        if(this.state.dialogType != DIALOGTYPE.order){ //add by Mr xu 修改原有Bug 在订单页面,依然调用props
            _state.dialogType = cartType;
            _state.data = nextProps.data;
        }

        if (nextProps.orderId && nextProps.orderId != '') {
            _state.orderId = nextProps.orderId;
        }

        if (nextProps.mainPayAmount) {
            _state.mainPayAmount = nextProps.mainPayAmount;
        }

        this.setState(_state);
    },

    componentDidMount: function () {
        // this.queryUserAccountRequest();
    },

    /**
     * 数据改变， 通过id
     * @param id 商品id
     * @param sum 改变后的数量
    */
    dataChange: function (id, sum) {
        if (typeof id === 'undefined') return;
        var data = this.state.data;
        //TODO 判断是否为制作页面过来的数据 目前默认为4种服务
        for(let value of data) {
            let cleanRange;//判断清空服务 last只清空套餐服务 sublings清除当前之外其他付费条目
            let code;

            if (typeof value.defaultPage !== 'undefined' && value.defaultPage === 'make') {
                code = value.custom_code;
                if (value.id === id) {
                    value.sum = sum;
                    //点击次数,只清空套餐服务
                    if (code === 'Svc_CustomLogo' || code === 'Svc_LastPageAndBottomMark') {
                        cleanRange = 'last';
                        this.changeSumFromServiceData(data, cleanRange, value);
                    }
                    //点击套餐清除当前之外其他付费条目
                    if (code === 'Svc_Mouth' || code === 'Svc_Year') {
                        cleanRange = 'sublings';
                        this.changeSumFromServiceData(data, cleanRange, value);
                    }
                }

            } else {//会员特权过来的单条数据data
                if (value.id === id) {
                    value.sum = sum;
                }
            }
        };
        /*for (var i = 0; i < data.length; i++) {
         if (data[i].id == id) {
         data[i].sum = sum;
         }
         }*/
        this.setState({
            data: data
        });
    },
    /*
    * 增加订单数据模型修改
    * */
    changeSumFromServiceData : function (data, cleanRange, target) {
        for(let v of data){
            if(cleanRange === 'last'){
                if(v.custom_code === 'Svc_Mouth' || v.custom_code === 'Svc_Year'){
                    v.sum = 0;
                }
            }
            if(cleanRange === 'sublings'){
                // debugger
                if(target.custom_code === 'Svc_Mouth' && target.sum > 5 && v.custom_code === 'Svc_Year'){
                    target.sum = 0;
                    v.sum = 1;
                    this.showPopChangeInfo('已为你选择最优方案');
                }else{
                    if(v.custom_code !== target.custom_code){
                        v.sum = 0;
                    }
                }

            }
        }
    },
    /**
     * 改变弹出框状态
     * param type (boolean)
    */
    changeDialogStatus: function (type,dialogType) {
        var _this = this;
        this.setState({
            showCartDialog: type,
            dialogType : dialogType//add by 修正打开状态,就更正为默认初值
        }, function () {
            if (type) {
                _this.queryUserAccountRequest();
            } else {
                // _this.setState({
                //     dialogType: DIALOGTYPE.buy
                // });
            }
        });
    },
    /*
    * 控制切换弹出框体的样式 add by Mr xu
    * */
    showPopChangeInfo : function (text) {
        var self = this;
        this.setState({ popInfo: text});
        setTimeout(function () {
            self.setState({ popInfo: false})
        },1000);
    },

    /**
     * 生成订单
    */
    generateOrderHandler: function () {
        /*var account = parseFloat(this.state.account),
            total = parseFloat(this.calcTatal()); //求总价*/
        //先判断订单总金额是否为空
        var total = this.calcTatal();
        if(typeof total === 'number' && total <= 0){
            this.showPopChangeInfo('选择不能为空哦!');
            return;
        }
        var data = this.state.data || [];
        var orderData = [];
        for (var i = 0; i < data.length; i++) {
            // debugger;
            if(parseInt(data[i].sum) === 0){
                continue;
            }
            var obj = {};
            obj.item_id = data[i].id;
            obj.item_name = data[i].name;
            obj.unit_price = 0;
            // obj.count = parseInt(data[i].sum) || 1;
            obj.count = parseInt(data[i].sum);
            obj.display_order = 0;
            orderData.push(obj);
        }

        this.generateOrderRequest(orderData);

    },

    /**
     * 价格转换 分->元
     */
    priceConvert: function (price) {
        return parseFloat(price / 100).toFixed(2)
    },
    getItemObj: function (item_id) {
        var datas = this.props.data;
        for (var i = 0, len = datas.length; i < len; i++) {
            var data = datas[i];
            if (data.id == item_id) {
                return data;
            }
        }
    },
    /***
     * 生成订单请求
     * @param data 订单数据
    */
    generateOrderRequest: function (data) {
        var _this = this;
        var url = "/v1/orders/own";
        var option = {};
        option.url = url;
        option.type = "POST";
        option.userID = Base.getCurrentUser().id;
        option.data = data;
        option.success = function (data) {
            if (data.err) {
                console.log(data.err, "data err")
            } else {
                var rst = data.result;
                var item = rst.items;
                var data = [];

                for (var i = 0, len = item.length; i < len; i++) {
                    var obj = {};
                    var srcInfo = _this.getItemObj(item[i].item_id)
                    if (srcInfo) {
                        obj.icon = srcInfo.icon;
                        obj.name = srcInfo.name;
                    } else {
                        obj.icon = item[i].icon;
                        obj.name = item[i].item_name;
                    }
                    obj.name = item[i].item_name;
                    obj.price = _this.priceConvert(item[i].unit_price);
                    obj.sum = item[i].count;
                    obj.totalAmount = _this.priceConvert(item[i].total_amount);
                    obj.qixian = Base.change_end_at(item[i]['custom_code'].trim());
                    data.push(obj);
                }
                if (_this.props.onOk) {
                    _this.props.onOk(1, rst);  //1 生成新的订单
                }

                setTimeout(function () {
                    _this.setState({
                        orderId: rst.id,
                        mainPayAmount: _this.priceConvert(rst.total_amount),
                        data: data
                    }, function () {

                        _this.setState({  //切换到订单确定
                            dialogType: DIALOGTYPE.order
                        })
                    });
                }, 0)
            }
        };
        option.error = function (err) {
            console.log(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    },

    /**
     * 支付订单事件
    */
    payOrderHandler: function () {
        var _this = this;
        debugger
        var orderid = this.state.orderId;
        if (!orderid) return;
        var url = "/v1/orders/own/" + orderid + "/payment";
        var option = {};
        option.userID = Base.getCurrentUser().id;
        option.url = url;
        option.type = "PUT";
        option.success = function (data) {
            if (data.err) {
                console.log(data.err, "data");
                if (data.err) {
                    var code = data.err.code;
                    switch (code) {
                        case -1201:
                            _this.setState({
                                dialogTitle: "正在处理支付中",
                                showDialog: true,
                                showHeader: true,
                                sureIsHide: true,
                                sureText: "确定",
                                sureFn: _this.hideDialog,
                                cancelFn: _this.hideDialog
                            });
                            break;
                        case -1202:
                            _this.setState({
                                dialogTitle: "支付操作成功",
                                showDialog: true,
                                showHeader: true,
                                sureIsHide: true,
                                sureText: "确定",
                                sureFn: _this.hideDialog,
                                cancelFn: _this.hideDialog
                            });
                            break;
                        case -1203:
                            _this.setState({
                                dialogTitle: "支付操作失败",
                                showDialog: true,
                                showHeader: true,
                                sureIsHide: true,
                                sureText: "确定",
                                sureFn: _this.hideDialog,
                                cancelFn: _this.hideDialog
                            });
                            break;
                        case -1204:
                            _this.setState({
                                dialogTitle: "支付操作超时",
                                showDialog: true,
                                showHeader: true,
                                sureIsHide: true,
                                sureText: "确定",
                                sureFn: _this.hideDialog,
                                cancelFn: _this.hideDialog
                            });
                            break;
                        case -1205:
                            _this.setState({
                                dialogTitle: "支付完成",
                                showDialog: true,
                                showHeader: true,
                                sureIsHide: true,
                                sureText: "确定",
                                sureFn: _this.hideDialog,
                                cancelFn: _this.hideDialog
                            });
                            break;
                        case -1206:
                            _this.setState({
                                dialogTitle: "订单已过期",
                                showDialog: true,
                                showHeader: true,
                                sureIsHide: true,
                                sureText: "确定",
                                sureFn: _this.hideDialog,
                                cancelFn: _this.hideDialog
                            });
                            break;
                        case -1207:
                            _this.setState({
                                dialogTitle: "订单已取消",
                                showDialog: true,
                                showHeader: true,
                                sureIsHide: true,
                                sureText: "确定",
                                sureFn: _this.hideDialog,
                                cancelFn: _this.hideDialog
                            });
                            break;
                        case -1208:
                            _this.setState({
                                dialogTitle: "订单状态不符合要求",
                                showDialog: true,
                                showHeader: true,
                                sureIsHide: true,
                                sureText: "确定",
                                sureFn: _this.hideDialog,
                                cancelFn: _this.hideDialog
                            });
                            break;
                        case 10012: //重复支付订单
                            _this.setState({
                                dialogTitle: "不能重复支付订单",
                                showDialog: true,
                                showHeader: true,
                                sureIsHide: true,
                                sureText: "确定",
                                sureFn: _this.hideDialog,
                                cancelFn: _this.hideDialog
                            });
                            break;
                        case 10015: //余额不足
                            _this.setState({
                                dialogTitle: "余额不足，请及时充值",
                                showDialog: true,
                                showHeader: true,
                                sureIsHide: false,
                                sureText: "去充值",
                                sureFn: function () {
                                    var info = {};
                                    info.orderId = orderid;
                                    info.payAmount = _this.state.mainPayAmount;
                                    //跳转到充值支付页面
                                    window.open(location.origin + "/recharge/?" + encodeURIComponent(JSON.stringify(info)));

                                    //显示确认支付成功的对话框
                                    _this.setState({
                                        dialogTitle: "<p><img src=" + qPic + " /> 支付成功了吗？</p><p style='font-size: 12px; color: #999; line-height: 18px;'>部分用户充值到账时间稍有延迟，<br/>若充值遇到问题，请联系 021-58385236</p>",
                                        showDialog: true,
                                        showHeader: true,
                                        sureIsHide: true,
                                        sureText: "确定",
                                        sureFn: function () {
                                            _this.getOrderStatusById(orderid);
                                        },
                                        cancelFn: function () {
                                            _this.getOrderStatusById(orderid);
                                        }
                                    })

                                },
                                cancelFn: _this.hideDialog
                            });
                            break;
                        default: //其他错误
                            _this.setState({
                                dialogTitle: "出现未知错误，Code:" + code,
                                showDialog: true,
                                showHeader: true,
                                sureIsHide: true,
                                sureText: "确定",
                                sureFn: _this.hideDialog,
                                cancelFn: _this.hideDialog
                            });

                    }

                } else {
                    console.log(data.err.message);
                }
            } else {
                _this.swicthStatusCode(data.result.status_code, data);
            }
        };
        option.error = function (err) {
            console.log(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    },

    /**
     * 订单状态(不同的状态做不同的处理)
     * @param code 状态值
     */
    swicthStatusCode: function (code, data) {
        function chargeCloseFn(dialogType) {
            _this.setState({
                showDialog: false //隐藏对话框
            }, function () {
                MakeWebAPIUtils.clearOwnGoods();//更新用户拥有的特权
                //隐藏购物车弹出框
                _this.setState({ showCartDialog: false ,dialogType : dialogType}, function () {
                    if (_this.props.onOk) {
                        _this.props.onOk(2, data.result);  //2支付成功
                    }
                });
            });
        }
        var _this = this;
        switch (code) {
            case 0:
                _this.setState({
                    dialogTitle: "订单生成，等待支付",
                    showDialog: true,
                    showHeader: true,
                    sureIsHide: true,
                    sureFn: _this.hideDialog,
                    cancelFn: _this.hideDialog
                });
                break;
            case 1:
                _this.setState({
                    dialogTitle: "正在处理支付中",
                    showDialog: true,
                    showHeader: true,
                    sureIsHide: true,
                    sureFn: _this.hideDialog,
                    cancelFn: _this.hideDialog
                });
                break;
            case 2:
                var chargeFaileText = "<p><img src=" + chargeFailedPic + " /> 商品到账失败！</p><p style='font-size: 12px; color: #999; line-height: 18px;'>您已成功支付订单，但由于网络原因，导致商品到账失败</p><p style='font-size: 12px; color: #999; line-height: 18px;'>请及时联系客服: 021-58385236</p>"
                _this.setState({
                    dialogTitle: chargeFaileText,
                    showDialog: true,
                    showHeader: true,
                    sureIsHide: true,
                    sureFn: function () {
                        _this.setState({ showDialog: false, showCartDialog: false });
                    },
                    cancelFn: function () {
                        _this.setState({ showDialog: false, showCartDialog: false });
                    }
                });
                break;
            case 3:
                _this.setState({
                    dialogTitle: "支付失败",
                    showDialog: true,
                    showHeader: true,
                    sureIsHide: true,
                    sureFn: _this.hideDialog,
                    cancelFn: _this.hideDialog
                });
                break;
            case 4:
                _this.setState({
                    dialogTitle: "支付操作超时",
                    showDialog: true,
                    showHeader: true,
                    sureIsHide: true,
                    sureFn: _this.hideDialog,
                    cancelFn: _this.hideDialog
                });
                break;
            case 5:
            MakeWebAPIUtils.clearOwnGoods();
                var showText = "<p><img src=" + sucessPic + " /> 购买成功！</p><p style='font-size: 12px; color: #999; line-height: 18px;'>因网络原因，部分用户开通有延迟</p>"
                if (this.props.data[0].type == "template") {
                    showText = "<div class='pay-success'><p><img src=" + sucessPic + " /> 购买成功！</p><p style='font-size: 12px; color: #999; line-height: 18px;'>因网络原因，部分用户开通有延迟</p><p style='font-size: 12px; color: #999; line-height: 18px;'><a href='/user/tab/19' target='_blank'>查看我的模板</a></p></div>";
                }
                _this.setState({
                    dialogTitle: showText,
                    showDialog: true,
                    showHeader: true,
                    sureIsHide: true,
                    sureFn: chargeCloseFn,
                    cancelFn: chargeCloseFn
                });

                break;
            case 6:
                _this.setState({
                    dialogTitle: "订单已过期，无法处理",
                    showDialog: true,
                    showHeader: true,
                    sureIsHide: true,
                    sureFn: _this.hideDialog,
                    cancelFn: _this.hideDialog

                });
                break;
            case 7:
                _this.setState({
                    dialogTitle: "订单已取消",
                    showDialog: true,
                    showHeader: true,
                    sureIsHide: true,
                    sureFn: _this.hideDialog,
                    cancelFn: _this.hideDialog
                });
                break;
        }
    },

    /**
     * 通过订单id查询订单状态
    */
    getOrderStatusById: function (orderid) {
        var user = Base.getCurrentUser();
        if (!user) return;
        var _this = this;
        var url = "/v1/orders/own/" + orderid;
        var option = {};
        option.url = url;
        option.userID = user.id;
        option.type = "GET";
        option.success = function (data) {
            if (data.err) {
                console.log(data.err);
            } else {
                _this.swicthStatusCode(data.result.status_code, data);
            }
        };
        option.error = function (err) {
            console.log(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    },

    hideDialog: function () {
        this.setState({ showDialog: false });
    }
});

module.exports = Cart;
