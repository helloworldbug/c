/**
 * @component DesignerAction
 * @description 设计师申请时,用来处理申请时的请求
 * @time 2015-10-21
 * @author misterY
 **/

var MeDispatcher = require('../dispatcher/MeDispatcher');
var MeConstants = require('../constants/MeConstants');
var ActionTypes = MeConstants.SelectDialog;

var DesignerAction = {

    actionData: [],
    maxLength: 3,
    _userInfo: {},

    clear: function(){
        this.actionData = [];
        this._userInfo = {};
    },

    addUserInfo: function(user){
        this._userInfo = user;
        return this._userInfo != {};
    },
    
    getUserInfo: function(){
        return this._userInfo;
    },

    addTpl: function (id) {
        return (
            (this.actionData.length<this.maxLength) ?
                (true,this.actionData.push(id)) :
                    (false)
        )
    },

    delTpl: function (id) {
        var _id = id, _len = this.actionData.length;
        this.actionData.forEach(function(o,i){
            (o == _id) && (this.actionData.splice(i,1));
        }.bind(this));
        return (_len != this.actionData.length);
    },

    getActionTpl: function(){
        return this.actionData;
    },

    /** 发送短信
      phone，手机号码
    **/
    sendPhoneMsg : function (phone, cb_ok, cb_err) {
        if (!phone) {
            cb_err("手机号码为空!");
            return;
        }
        //add 设计师注册时更换短息接口 by konghuachao 2017-04-18
        fmacloud.Cloud.run('sendMsgByEngine', { phone: phone }, {
            success:cb_ok,
            error:cb_err
        });
       /* fmacloud.Cloud.requestSmsCode(phone).then(
            cb_ok,
            cb_err//err.message=="Can't send sms code too frequently." --短信发送过于频繁
        );*/
    },
    /** 验证手机短信
      phone，手机号码
    **/
    verifyPhoneMsgCode : function (phone,msgcode, cb_ok, cb_err) {
        if (!msgcode) {
            cb_err("验证码为空!");
            return;
        }
        // add 修改验证码验证的接口 by--konghuachao--2017-04-18
        fmacloud.Cloud.run('verifySmsByEngine', {phone:phone,code:msgcode}, {
            success:cb_ok,
            error:cb_err
        })
       /* fmacloud.Cloud.verifySmsCode(msgcode).then(
            cb_ok,
            cb_err//err.code =1||err.code=603 --无效的短信验证码
        );*/
    },

    init: function(){
        /*
         * ie 中不支持 forEach 方法
         * 在这里添加支持
        */
        if (!Array.prototype.forEach) {
            Array.prototype.forEach = function(callback, thisArg) {
                var T, k;
                if (this == null) {
                    throw new TypeError(" this is null or not defined");
                }
                var O = Object(this);
                var len = O.length >>> 0;
                if ({}.toString.call(callback) != "[object Function]") {
                    throw new TypeError(callback + " is not a function");
                }
                if (thisArg) {
                    T = thisArg;
                }
                k = 0;
                while (k < len) {
                    var kValue;
                    if (k in O) {
                        kValue = O[k];
                        callback.call(T, kValue, k, O);
                    }
                    k++;
                }
            };
        }
    }
}

DesignerAction.init();
module.exports = DesignerAction;