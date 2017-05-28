// 文件名：mepc_promise.js
//
// 创建人：曾文彬
// 创建日期：2015/12/08 10:49
// 描述： 异步流程控制模块，减少回调函数嵌套，降低异步编程的复杂性。

'use strict';

/*
    resolve,
    reject,
    done,
    fail
    then 返回一个新的promise对象
    Handle {}
    
    then(success, error);
    new Promise(function (resolve, reject) {
        // 默认根据当前的文档进行判断
        resolve('10')    
    });
    实现链式，一方面就得重新实现这种方法
    
*/
