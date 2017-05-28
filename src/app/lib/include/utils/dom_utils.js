// 文件名：dom_utils.js
//
// 创建人：曾文彬
// 创建日期：2015/12/01 16:53
// 描述：react dom 工具

'use strict';

var React = require('react');
var ReactDOM=require("react-dom");

var MePCAPI = require('../../MePC_Public');

/**
 * 得到当前原生DOM
 * @param {ReactElement|HTMLElement} refComponentOrElement
 * @returns {HTMLElement}
*/
function ownerElement (refComponentOrElement) {
    var element = ReactDOM.findDOMNode(refComponentOrElement);

    return element; 
}

/**
 * 得到当前原生Document
 * @param {ReactElement|HTMLElement} refComponentOrElement
 * @returns {HTMLDocument}
*/
function ownerDocument (refComponentOrElement) {
    var element = this.ownerElement(refComponentOrElement);

    return (element && element.ownerDocument) || document; 
}

/**
 * 得到当前原生Window
 * @param {ReactElement|HTMLElement} refComponentOrElement
 * @returns {DocumentView|Window}
*/
function ownerWindow (refComponentOrElement) {
    var doc = this.ownerDocument(refComponentOrElement);

    return doc.defaultView || window;
}

module.exports = {
    ownerElement: ownerElement,

    ownerDocument: ownerDocument,

    ownerWindow: ownerWindow,

    scrollTop: function (element, value) {

        if (!element) return;

        var hasScrollTop = 'scrollTop' in element;

        if (MePCAPI.isType(value, 'undefined')) return hasScrollTop ? element.scrollTop : element.pageYOffset;

        hasScrollTop ?
            (element.scrollTop = value) : element.scrollTo(element.scrollX, value);
    }
};

