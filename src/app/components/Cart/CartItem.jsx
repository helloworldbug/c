/**
 * @name 购物车 item
 * @time 2016-9-23
 * @author yangjian
 **/
'use strict';

// require core module
var React = require('react');
require('../../../assets/css/cart');
var Switch = require('../Common/Switch');

var CartItem = React.createClass({

    getInitialState() {
        return {
            data: this.props.data,
            sum: parseInt(this.props.data.sum) || 1
        }
    },

    render() {
        var data = this.state.data;
        // debugger;
        var sums;
        if(this.props.buyStatus == 1) { //确认订单
            sums = this.state.sum;
        }else if(data.type == "template") {
            sums = (
                <div className="sums">
                    <input type="button" className="disable reduce" />
                    <input type="number" disabled="true" value={this.state.sum} />
                    <input type="button" className="disable add"/>
                </div>
            )
        }else {
            sums = (<div className="sums">
                <input type="button" onClick={this.onChangeSumHandle} className= {this.state.sum == 0 ? "disable reduce" : "reduce"} />
                <input type="number" onChange={this.changeSumHandle} value={this.state.sum} />
                <input type="button" onClick={this.onChangeSumHandle} className= {this.state.sum == 999 ? "disable add" : "add"}/>
            </div>);
        }

        var itemName = data.name.length > 12 ? data.name.substr(0, 12) + "..." : data.name;
        //add by增加判断 制作页面过来的数据
        var userChangeServiceName;
        if(typeof data.defaultPage !== 'undefined'&&data.defaultPage ==='make'){
            userChangeServiceName = <li className="defaultService">
                <div className="img" style={{backgroundImage:`url(${data.icon})`}}></div>
                <div>
                    <span title={data.name}>{itemName}</span>
                    <div>{data.description}</div>
                </div>
            </li>

        }else{//会员特权页面过来的数据
            userChangeServiceName = <li>
                <div className="img" style={{backgroundImage:`url(${data.icon})`}}></div>
                <span title={data.name}>{itemName}</span>
            </li>
        }

        return (
            <div className="cart">
                <ul>
                    {userChangeServiceName}
                    <li>{data.price}{data.qixian==='永久' ? '/次' : (data.qixian==='年'?'/年':'/月')}</li>
                    <li>
                        {sums}
                    </li>
                    <li>{data.qixian==='永久' ? '--' : (parseInt(data.sum)>0 ?data.sum:'')+data.qixian}</li>
                    <li>{data.totalAmount || (data.price * this.state.sum).toFixed(2)}</li>
                </ul>
            </div>
        );
    },

    componentWillReceiveProps: function(nextProps) {
        if(this.props.buyStatus != 1) {
            this.setState({
                data: nextProps.data,
                sum: nextProps.data.sum
            });
        }
    },

    /**
     * 点击增减数量值
     */
    onChangeSumHandle: function(e) {
        var target = e.target;
        var type = target.className;
        var sum = this.state.sum;
        var _this = this;
        // debugger;
        switch (type) {
            case "reduce": //减少
                sum = sum - 1;
                break;
            case "add": //增加
                sum = parseInt(sum) + 1;
                break;
        }

        if(sum < 0) {
            sum = 0;
        }

        if(sum > 999) {
            sum = 999;
        }

        this.setState({
            sum: sum
        }, function() {
            _this.props.dataChangeFn(_this.props.data.id, sum);
        });
    },

    /**
     * 输入改变数量值
     */
    changeSumHandle: function(e) {
        var _this = this;
        var targetSum = parseInt(e.target.value);
        if(isNaN(targetSum)) { //如果不是数字
            targetSum = 0;
        }else if(targetSum < 0) {
            targetSum = 0;
        }else if (targetSum > 999) {
            targetSum = 999;
        }

        this.setState({
            sum: targetSum
        }, function() {
            _this.props.dataChangeFn(_this.props.data.id, targetSum);
        });
    }
});

module.exports = CartItem;