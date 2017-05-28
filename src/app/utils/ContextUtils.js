/**
 * @component ContextUtils
 * @description 上下文工具类
 * @time 2015-09-22 17:33
 * @author StarZou
 **/

'use strict';

var MeStore = require('../stores/MeStore');

var ContextUtils = {

    /**
     * 保存程序上下文状态
     */
    state: {
        loadedFavorites: false
    },

    logout        : function () {
        fmacloud.User.logOut();
        delete this.user;
    },
    /**
     * 获取当前登录用户
     */
    getCurrentUser: function () {
        var user = this.user;
        if (user) {
            return user;
        }
        return this.user = fmacloud.User.current();
    },

    /**
     * 重置当前登录用户
     */
    resetCurrentUser: function () {
        delete this.user;
        return this.getCurrentUser();
    },

    /**
     * 是否登录
     */
    isLogged: function () {
        return !!this.getCurrentUser();
    }

};

module.exports = ContextUtils;