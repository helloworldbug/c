/**
 * @component M_Super.jsx
 * @description 移动端基类组件
 * @time 2015-11-24
 * @author 曾文彬
 **/

'use strict';

var MePC = require('../../lib/MePC_Public');
var Base = require('../../utils/Base.js');
var SuperLogicComponent = require('../../lib/SuperLogicComponent');

/************************* 加载CSS ************************************/
//require('../../assets/css/mobile.css');

var MSuper = MePC.inherit(SuperLogicComponent, {

    /**
     * 设置html class
    */
    modifierRootClassByName: function (isUnset) {
        $('html')[isUnset ? 'removeClass' : 'addClass']('mobile-html');
    },    

    /**
     * 生成移动端样式表
    */
    generatorMobileCSSSheet: function () {
        require('../../../assets/css/mobile.css');
    },

    /**
     * 生成meta标签
    */
    generatorMobileMeta: function (isUnset) {
        if (isUnset) {
            $('meta').eq(0).remove();
        } else {
            $('<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />').prependTo($('head'));
        }
    },

    // /**
    //  * 判断浏览设备
    // */
    // isMobileDevice: function () {
    //     var userAgent = navigator.userAgent;

    //     return /android/i.test(userAgent) || /iphone|ipad|ipod/i.test(userAgent);
    // },

    validateField: function (phone,pwd) {
        var msg = true;

        if (!!pwd) {
            
            if (pwd.length == 0){
                this.wrongMsg(this.defineInfo().password.requiredError);
                msg = false;
            }

            if (pwd.match(this.defineInfo().password.formated) == null) {
                this.wrongMsg(this.defineInfo().password.formatedError);
                msg = false;
            }
        }

        if (!!phone) {

            if(phone.length == 0) {
                this.wrongMsg(this.defineInfo().phone.requiredError);
                msg = false;
            }
            
            if (phone.match(this.defineInfo().phone.formated) == null) {
                this.wrongMsg(this.defineInfo().phone.formatedError);
                msg = false;
            }
        } else {
            this.wrongMsg("请输入手机号");
            msg = false;
        }

        return msg;
    },

    wrongMsg: function(msg) {
        this.setState({
            text:msg
        },(function(){
            Base.delayExec(() => {
                this.setState({text: this.getConfirmText(), disabled: false});
            }, 1500);
        }).bind(this));

        return;
    }
});

module.exports = MSuper;

