// 文件名：debounce.js
//
// 创建人：曾文彬
// 创建日期：2015/12/01 21:25
// 描述：函数的两次调用间隔不得小于给定的时间

'use strict';

var MePCAPI = require('../../MePC_Public');

/**
 * 控制函数在不小于给定的时间内执行
 *
 * @params {Function} fn 
 * @params {Number} wait    
 * @returns {Function}
*/
var debounce = function (fn, wait) {
    var timeout;

    return function () {
        var context = this,
            args = MePCAPI.makeArray(arguments),
            later = function () {
                timeout = null;
            };

        if (!timeout) {
            timeout = setTimeout(later, wait);
            fn.apply(context, args);
        }
    };
};

module.exports = debounce;
