/** 文件名称: log.js
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/7/12 11:23
 * 描    述: logo收集辅助工具
 */

/**
 * log收集的辅助类
 * @constructor     构造函数
 */
(function($){
    var LogUtils = function () {
        //log 日志收集
        this.logData = {
            "version":"",           //版本，  日志收集版本
            "user":"",              //用户ID
            "app":{
                "name":"",          //名称 如：ME、微信、QQ等
                "version":""        //版本
            },
            "target":{
                "uid":"",               //作品ID  、页ID、模版ID
                "type":""               //类型 作品(works)；模板(template)；页(page)；……
            },
            "event":{
                "type":"",              //事件类型  点赞(praise)、评论(comment)、分享(share)、浏览(browse)……
                "src":"user",           //发生源  系统；system 用户  user
                "content":"",           // 比如消息， 暂时没有
                "reserved1":"",         //预留1
                "reserved2":"",         //预留2
                "reserved3":"",         //预留3
                "reserved4":"",         //预留4
                "reserved5":""          //预留5
            },
            "extend":{                  //预留 json字符串

            }
        };
    }
    //定义原型变量
    var p = LogUtils.prototype;
    /**
     * 初始化--设置日志基本信息
     * @param option
     * userId
     * platformName
     * platformVersion
     */
    p.initLogData = function(option) {
        //设置用户ID
        if(option.userId) {
            this.resetLogData("user", option.userId);
        }
        //设置平台名称和版本
        if(option.platformName || option.platformVersion){
            var app = {
                "name" : option.platformName,
                "version" : option.platformVersion
            }
            this.resetLogData("app", app);
        }
    };
    /**
     * 重置log日志信息
     * @param key       设置的键
     * @param val       设置的值
     */
    p.resetLogData = function(key, val) {
        if(this.logData.hasOwnProperty(key)){
            this.logData[key] = val;
        }
    };
    /**
     * 重置LOG信息
     * @param id    //作品ID  、页ID、模版ID
     * @param type 点赞(praise)、评论(comment)、分享(share)、浏览(browse)
     */
    p.resetLogTargetAndEvent  = function (id, type) {
        var targetType = "works"    //类型 作品(works)；模板(template)；页(page)；……
        if(type == "browse"){
            targetType = "page";
        }
        var eventType = type;
        if(type == "works"){
            eventType = "browse";
        }
        var target = {};
        target.uid = id;
        target.type = targetType;
        this.resetLogData("target", target);
        var event = {};
        event.type = eventType;
        event.src = "user";
        event.content = "";
        event.reserved1 = "";
        event.reserved2 = "";
        event.reserved3 = "";
        event.reserved4 = "";
        event.reserved5 = "";
        this.resetLogData("event", event);
    };
    /**
     * 发送post的请求
     * @param cb_ok 请求回调
     */
    p.postLogData = function(url) {
        return;
        $.post(url, this.logData, function(data){
//            console.log(data, "日志请求回调")
        });
    };
    /**
     * 获取平台信息
     * @returns {object} {platformName : "", platformVersion : ""}
     */
    p.getPlatformInfo = function(){
        var userAgent = navigator.userAgent.toLowerCase();
        var res = {platformName : "", platformVersion : ""};
        //来源判断
        if (userAgent.indexOf("micromessenger/") > -1) {
            res.platformName = "weixin";
            var versionTemp = userAgent.match(/micromessenger\/([\d\.]+)/i)[1];
            res.platformVersion = versionTemp;
        }else if(userAgent.indexOf("qq/") > -1){
            res.platformName = "qq";
            var versionTemp = userAgent.match(/qq\/([\d\.]+)/i)[1];
            res.platformVersion = versionTemp;
        }else if (userAgent.indexOf("msie/") > -1){
            res.platformName = "ie";
            var versionTemp = userAgent.match(/msie\/([\d\.]+)/i)[1];
            res.platformVersion = versionTemp;
        }else if (userAgent.indexOf("firefox/") > -1){
            res.platformName = "firefox";
            var versionTemp = userAgent.match(/firefox\/([\d\.]+)/i)[1];
            res.platformVersion = versionTemp;
        }else if (userAgent.indexOf("chrome/") > -1){
            res.platformName = "chrome";
            var versionTemp = userAgent.match(/chrome\/([\d\.]+)/i)[1];
            res.platformVersion = versionTemp;
        }else if (userAgent.indexOf("safari/") > -1){
            res.platformName = "safari";
            var versionTemp = userAgent.match(/safari\/([\d\.]+)/i)[1];
            res.platformVersion = versionTemp;
        }else if (userAgent.indexOf("opera/") > -1){
            res.platformName = "opera";
            var versionTemp = userAgent.match(/opera\/([\d\.]+)/i)[1];
            res.platformVersion = versionTemp;
        }else if (userAgent.indexOf("netscape/") > -1){
            res.platformName = "netscape";
            var versionTemp = userAgent.match(/netscape\/([\d\.]+)/i)[1];
            res.platformVersion = versionTemp;
        }else if (userAgent.indexOf("ucbrowser/") > -1){
            res.platformName = "ucbrowser";
            var versionTemp = userAgent.match(/ucbrowser\/([\d\.]+)/i)[1];
            res.platformVersion = versionTemp;
        }else{
            res.platformName = "otherbrowser";
            res.platformVersion = "none";
        }
        return res;
    };
    //window.LogUtils = LogUtils;
    if (typeof define === "function" && define.amd) {
        define(function () {
            return LogUtils;
        });
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports =LogUtils
    } else {
        window.LogUtils = LogUtils;
    }
}(window.jQuery));