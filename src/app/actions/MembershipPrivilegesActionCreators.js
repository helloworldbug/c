/**
 * @module MembershipPrivilegesActionCreators
 * @description 会员特权
 * @time 2016-09-09 9:40
 * @author tony
 **/

var MeDispatcher = require('../dispatcher/MeDispatcher');
var MeConstants = require('../constants/MeConstants');
var MeAPI = require('../utils/MeAPI');
var MakeWebAPIUtils = require('../utils/MakeWebAPIUtils');
var ActionTypes = MeConstants.ActionTypes;

var MembershipPrivilegesActionCreators = {
    /**
     * 获取会员特权
     */
    queryMembershipPrivileges : function(){
        MakeWebAPIUtils.getGoodPriceByType("service").then(function(data){
            MeDispatcher.dispatch({
                type: ActionTypes.QUERY_MEMBERSHIPPRIVILEGES,
                data: data
            });
        });
    },

    /**
     * 查询我的特权列表
     * @param opt
     */
    queryMyPrivilegeData : function(opt){
        MeAPI.queryMyPrivilegeData(opt, function(data){
            MeDispatcher.dispatch({
                type: ActionTypes.QUERY_MYPRIVILEGE,
                data: data
            });
        }, function(err){

        });
    },

    /**
     * 查询订单列表
     * @param opt
     */
    queryMyOrderData : function(opt){
        MeAPI.queryMyOrderData(opt, function(data){
            MeDispatcher.dispatch({
                type: ActionTypes.QUERY_MYORDER,
                data: data
            });
        }, function(err){

        });
    },

    /**
     * 取消订单
     * @param opt
     * opt.order_id 订单ID
     */
    cancelMyOrder : function(opt){
        MeAPI.cancelMyOrder(opt, function(data){
            MeDispatcher.dispatch({
                type: ActionTypes.CANCEL_MY_ORDER,
                data: data
            });
        }, function(err){

        });
    },

    /**
     * 支付订单
     * @param opt
     * opt.order_id 订单ID
     */
    payMyOrder : function(opt){
        MeAPI.payMyOrder(opt, function(data){
            MeDispatcher.dispatch({
                type: ActionTypes.PAY_MY_ORDER,
                data: data
            });
        }, function(err){

        });
    }
};

module.exports = MembershipPrivilegesActionCreators;