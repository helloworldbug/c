/**
 * @module MembershipPrivilegeStore
 * @description 会员特权数据
 * @time 2016-09-09 9:40
 * @author zhao
 **/
'use strict';

// require core module
var NewMeStore = require('./NewMeStore');

// require dispatcher
var MeDispatcher = require('../dispatcher/MeDispatcher');
var MeConstants = require('../constants/MeConstants');
var ActionTypes = MeConstants.ActionTypes;

// store array
var store = {};

// define store module
var MembershipPrivilegeStore = Object.assign({}, NewMeStore, {

    /* 获取所有的作品数据 */
    getMembershipData() {
        return store.membershipList;
    },

    getMyPrivilegeData(){
        return store.myPrivilegeData;
    },

    getMyOrderData(){
        return store.myOrderData;
    }
    
});

MeDispatcher.register(_action => {
    switch(_action.type){
        case ActionTypes.QUERY_MEMBERSHIPPRIVILEGES:
            store.membershipList = _action.data;
            MembershipPrivilegeStore.emitChange();
            break;
        case ActionTypes.QUERY_MYPRIVILEGE:
            var result = [];
            for(var i = 0; i < _action.data.length; i++){
                var obj = _action.data[i];
                if(obj.type == "service" || obj.type == "component"){
                    result.push(obj);
                }
            }
            store.myPrivilegeData = result;
            MembershipPrivilegeStore.emitChange();
            break;
        case ActionTypes.QUERY_MYORDER:
            store.myOrderData = _action.data;
            MembershipPrivilegeStore.emitChange();
            break;
        case ActionTypes.CANCEL_MY_ORDER:
            store.myOrderData.map(function(data, index){
                if(data.id == _action.data.order_id){
                    data.status_code = _action.data.status_code;
                }
            });
            MembershipPrivilegeStore.emitChange();
            break;
    }

});

// export store module
module.exports = MembershipPrivilegeStore;