/**
 * Created by 95 on 2015/11/23.
 */

///  root: children:[ {id:****},{children:[...]}]
///
///
var md5= require('md5');
var CloudText = {};
var fontServer = "http://agoodme.com:3000";
var requestQueue = {} ///已经发出但是没有返回的请求
//字符串去重后排序
function getDistinctSortString(str) {
    var oriArr = str.split('');
    var newArr = [], exist = {};
    for (var i = 0, len = oriArr.length; i < len; i++) {
        if(/\s/.test(oriArr[i])){
            continue;
        }
        if (!exist[oriArr[i]]) {
            newArr.push(oriArr[i]);
            exist[oriArr[i]] = true;
        }
    }
    newArr.sort()
    return newArr.join('');
}

function getFont(str, fontName, cb, cb_err) {
    $.ajax({
        type    : 'GET',
        url     : fontServer + "/loadfont/?callback=?&r=" + Math.random(),
        data    : {"type": "fixed", "font": fontName, "text": str},
        success : function (font) {
            cb(font)
        },
        error   : function (data, status, e) {
            cb_err(status || e);
        },
        dataType: "json"
    });

}

module.exports = {
    getCloudText: function (str, fontName, cb) {
        var GlobalFunc=require("../components/Common/GlobalFunc")
        var str=GlobalFunc.htmlDecode(str)
        var distinctString = getDistinctSortString(str);
        var key = md5(`${distinctString}|${fontName}`);
        if (CloudText[key]) {
            //之前请求过
            cb(CloudText[key]);
        } else {
            if (requestQueue[key] instanceof Array) {
                //入队
                requestQueue[key].push(cb);
            } else {
                //请求字体
                requestQueue[key] = [cb];
                (function (textKey) {
                    getFont(distinctString, fontName, function success(font) {
                        console.log("key",textKey);
                        CloudText[textKey] = font;
                        requestQueue[textKey].forEach((callBack)=> {
                            callBack(font);
                        })
                        delete requestQueue[textKey]

                    }, function err(msg) {
                        console.error(msg);
                        delete requestQueue[textKey]
                    })
                })(key);
            }
        }
    }
}
