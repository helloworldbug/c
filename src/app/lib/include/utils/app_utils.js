// me-utils.js
// 工具类
//
// 项目常用方法集合
// 曾文彬 2015-12-10

'use strict';

;(function (moduleName, moduleDefinition) {

/**
 * 支持前后端模块导出方式导出
 *
 * @params {String} moduleName 模块名
 * @params {Function} moduleDefinition 模块内部结构
*/
function supportEnvirModuleExport (moduleName, moduleDefinition) {
    if (typeof define === 'function') {
        define(moduleDefinition); // cmd、amd环境
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = moduleDefinition(); // nodejs环境
    } else {
        this[moduleName] = moduleDefinition(); // 浏览器环境
    }
}

supportEnvirModuleExport(moduleName, moduleDefinition);  

})('me-utils', function () {

    var arraySlice = Array.prototype.slice,
        arrayForEach = Array.prototype.forEach, 
        arraySome = Array.prototype.some,
        arrayIndexOf = Array.prototype.indexOf,
        objectToString = Object.prototype.toString,
        objectOwnerProp = Object.prototype.hasOwnProperty;

    var MEUtils = {

        eachObjectOrArray: function (obj, fn) {
            if (this.object.isPlainObject(obj)) {

                for (var prop in obj) {
                    objectOwnerProp.call(obj, prop) && fn.call(null, obj[prop], prop, obj);
                }
            } else if (this.array.isArray(obj)) {

                if (arrayForEach) arrayForEach.call(obj, fn);
                else {
                    for (var i = 0, len = obj.length; i < len; i++) {
                        fn.call(null, obj[i], i, obj);
                    }
                } 
            }
        },

        mix: function (target) {
            var sources = MEUtils.array.makeArray(arguments, 1),
                isCover = typeof sources[sources.length - 1] === 'boolean' ? sources.pop() : false;

            if (!sources.length) {
                sources = [target];
                target = this;
            } 

            MEUtils.eachObjectOrArray(sources, function (obj) {
                if (MEUtils.object.isPlainObject(obj)) {
                    MEUtils.eachObjectOrArray(obj, function (val, key) {
                       (isCover || typeof target[key] === 'undefined') && (target[key] = obj[key]); 
                    });
                }
            });    
            
            return target;    
        },

        isType: function (obj, type) {
            return objectToString.call(obj).slice(8, -1).toLowerCase() === type;
        },

        Function: {
            isFunction: function (fn) {
                return MEUtils.isType(fn, 'function');
            }
        }, 

        string: {
            isString: function (str) {
                return MEUtils.isType(str, 'string'); 
            }
        },

        array: {
            isArray: function (arr) {
                return MEUtils.isType(arr, 'array'); 
            },
            parseArray: function (unArr) {
                return [].concat(unArr);
            },
            inArray: function (arr, val) {
                if (arrayIndexOf) return arrayIndexOf.call(arr, val) >= 0 ? true : false;

                return MEUtils.array.some(arr, function (value) {
                    return value === val;
                });
            },
            some: function (arr, fn) {
                if (arraySome) return arraySome.call(arr, fn);

                for (var i = 0, length = arr.length; i < length; i++) {
                    if (fn.call(null, arr[i], i, arr)) return true;
                } 

                return false;
            },
            makeArray: function (likeArray, offset) {
                return ('length' in likeArray) && arraySlice.call(likeArray, offset || 0);
            }
        },

        object: {
            isPlainObject: function (obj) {
                return (!MEUtils.isType(obj, 'object') || obj.nodeType) ? !1 : !0;
            }
        }
    };

    return MEUtils;
});