/*
 * @name 验证模块
 * @description 登录、注册、忘记密码等模块的字段提供验证机制
 * @author 曾文彬
 * @datetime 2015-9-6
**/

'use strict';

class Validate {

    // 构造器
    constructor(options) {
        this.regulars = {};
        this.injectRegular(options);
    }

    // 判断是否是指定类型
    isType(empty, type) {
        return !!empty && Object.prototype.toString.call(empty).slice(8, -1).toLowerCase() === type;
    }

    // 注入验证规则
    injectRegular(field, regular) {
        if (this.isType(field, 'object')) {
            Object.keys(field).forEach(value => this.injectRegular(value, field[value]));
        } else {
            this.regulars[field] = regular instanceof Array ? regular : [regular];
        }
    }
    
    // 验证
    // 返回状态有3种
    /*
       1、如果匹配字段不存在，那么返回undefined
       2、如果匹配字段存在，规则匹配失败，将以数组存储错误信息(包括提示文字和处理函数)对象形式返回
       3、如果匹配字段存在，规则匹配成功，将以空数组返回
    */
    execRegular(field, value) {
        /* 定义规则验证表达式、规则错误提示、规则错误处理函数 */
        let regularExpression, regularErrorTip, regularErrorFunc, regulars, newRegulars;

        /* 验证字段转换成数组，方便于迭代 */
        field = this.isType(field, 'array') ? field : [field];

        /* 遍历验证规则，存储验证失败信息 */
        field.forEach(_name => {
            if (regulars = this.regulars[_name]) {
                newRegulars = [];

                regulars.forEach(_regular => {
                    !_regular.regularExpression.test(value) && newRegulars.push({
                        regularErrorTip: _regular.regularErrorTip, /* 错误提示文字 */
                        regularErrorFunc: _regular.regularErrorFunc /* 错误处理函数 */
                    });
                });
            }
        });

        /* 返回规则验证失败数组 */
        return newRegulars;
    }
}

module.exports = Validate;