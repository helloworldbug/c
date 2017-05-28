// 文件名：MePC_Public.js
//
// 创建人：曾文彬
// 创建日期：2015/11/4 16:32
// 描述： mepc公共库

'use strict';

module.exports = {

    copy: function (target) {
        var args = this.makeArray(arguments),
            i = 1,
            length = args.length,
            isCover = args[length - 1] === 'boolean' ? args[length - 1] : false,
            source, prop;

        if (length < 1) return this;

        if (length < 2) {
            i = 0;
            target = this;
        }

        for (; i < length; i++) {
            source = args[i] || {};

            for (prop in source) {
                (isCover || typeof target[prop] === 'undefined') && (target[prop] = source[prop]);
            }
        }

        return target;
    },

    clone: function (obj) {
        return this.copy({}, obj);
    },

    each: function (obj, callback) {

        if (this.isType(obj, 'object')) {

            for (var prop in obj) {
                callback.call(obj[prop], obj[prop], prop, obj);
            }

        } else if (this.isType(obj, 'array')) {
            obj.forEach(callback);
        }
    },

    makeArray: function (likeArray, offset) {
        return (Array.prototype.slice.call(likeArray, offset || 0));
    },

    inArray: function (array, value) {
        var ret = false,
            i = 0,
            length = array.length;

        for (; i < length; i++) {

            if (array[i] === value) {
                ret = true;
                break;
            }
        }

        return ret;
    },

    getArrayByValue: function (array, superKey, key, value) {
        var retArr = [];

        this.each(array, (function (_obj) {

            if (_obj[superKey][key] === value) {
                retArr.push(_obj);
            }
        }).bind(this));

        return retArr;
    },

    orderDescArrayByKey: function (array, key) {
        return array.sort(function (_curr, _next) {

            if (_curr[key] > _next[key]) {
                return -1;
            } else if (_curr[key] < _next[key]) {
                return 1;
            } else {
                return 0;
            }
        });
    },

    orderAscArrayByKey: function (array, superKey, key) {
        return array.sort(function (_curr, _next) {

            if (_curr[superKey][key] > _next[superKey][key]) {
                return 1;
            } else if (_curr[superKey][key] < _next[superKey][key]) {
                return -1;
            } else {
                return 0;
            }
        });
    },

    removeArrayValueByIndex: function (array, index) {
        var retArray = [],
            i = 0,
            length = array.length,
            value = array[index];

        if (!this.inArray(array, value)) return array;

        for (; i < length; i++) {
            array[i] !== value && (retArray.push(array[i]));
        }

        return retArray;
    },

    removeArrayValueByValue: function (array, value) {
        var retArray = [],
            i = 0,
            length = array.length;

        if (!this.inArray(array, value)) return array;

        for (; i < length; i++) {
            array[i] !== value && (retArray.push(array[i]));
        }

        return retArray;
    },

    getArrayIndexByValue: function (array, value) {
        return array.indexOf(value);
    },

    isType: function (obj, type) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type;
    },

    formatString: function (templateStr, matchs) {
        matchs = !(matchs instanceof Array) ? [matchs] : matchs;

        return templateStr.replace(/{(\d+)}/g, function (match, number) {
            return typeof matchs[number] != 'undefined' ? matchs[number] : match;
        });
    },

    clearBeginOrEndTrim: function (str) {
        return str.replace(/^\s+|\s+$/, '');
    },

    implement: function () {
        var args = this.makeArray(arguments),
            superClass = args.shift();

        if (!superClass) return;

        !this.isType(superClass, 'object') && (superClass = superClass.prototype);

        return this.copy.call(this, {}, superClass);
    },

    inherit: function () {
        var args = this.makeArray(arguments), superClass, childClass;

        if (args.length < 1) return;

        if (args.length < 2) return args[0];

        childClass = args.pop();

        this.copy.apply(this, [this.isType(childClass, 'function') ? childClass.prototype :  childClass].concat(args));

        return childClass;
    }
};
