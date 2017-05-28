// 文件名：css_utils.js
//
// 创建人：曾文彬
// 创建日期：2015/12/01 23:11
// 描述：react style 操作

'use strict';

var MePCAPI = require('../../MePC_Public');

/**
 * dom是否支持classList属性
 *
 * @params {HTMLElement} element 
 * @returns {Boolean}
*/
function isSupportClassList (element) {
    return !!element.classList;
}

/**
 * 拼接className
 *
 * @params {HTMLElement} element 
 * @params {String} className
 * @returns {String}
*/
function comboClassName (element, className) {
    var classNames = ( '' + element.className ).split(/\s+/);
    className && classNames.push(className);

    return MePCAPI.clearBeginOrEndTrim(classnames.join(' '));        
}

/**
 * dom是否存在class
 *
 * @params {HTMLElement} element 
 * @params {String} className
 * @returns {Boolean}
*/
function hasClass (element, className) {

    if (isSupportClassList(element)) return !!className && element.classList.contains(className);

    return !!className && ('' + element.className).indexOf(className) > -1;
}

/**
 * dom添加class
 *
 * @params {HTMLElement} element 
 * @params {String} className
 * @returns {HTMLElement}
*/
function addClass (element, className) {

    if (className) {
        if (isSupportClassList(element)) element.classList.add(className);

        else {
            if (!hasClass(element, className)) element.className = comboClassName(element, className);
        }
    }

    return element;
}

/**
 * dom删除class
 *
 * @params {HTMLElement} element 
 * @params {String} className
 * @returns {HTMLElement}
*/
function removeClass (element, className) {

    if (className) {
        if (isSupportClassList(element)) element.classList.remove(className);

        else {
            if (hasClass(element, className)) {
                element.className = comboClassName(element, 
                    element.className
                        .replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)', 'gi'), '')
                );
            }
        }
    }

    return element;
}

/**
 * dom切换class
 *
 * @params {HTMLElement} element 
 * @params {String} className
 * @returns {HTMLElement}
*/
function toggleClass (element, className) {
    return !hasClass(element, className) ?
        addClass(element, className) :
        removeClass(element, className);
}

module.exports = {

    isSupportClassList: isSupportClassList,
    
    comboClassName: comboClassName,
    
    hasClass: hasClass,
    
    addClass: addClass,
    
    removeClass: removeClass,
    
    toggleClass: toggleClass
};
