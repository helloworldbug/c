/*
 * 存本地缓存全局方法
 * add by guYY 2016/8/2
 */
var React = require("react");
var GlobalFunc = require('../Common/GlobalFunc');

var SaveLocalFunc = Object.assign({}, {
    /*localStorage 取出对象*/
    getLocalStorageObject:function(prototype){
        var str = window.localStorage.getItem(prototype);
        var result = {};
        if(str && str!=""){
            result = JSON.parse(str);
        }
        return result;
    },
    setLocalStorageObject:function(prototype, obj){
        var str = JSON.stringify(obj);
        window.localStorage.setItem(prototype, str);
    },
    getLocalStorageValue:function(prototype, key){
        var obj = this.getLocalStorageObject(prototype);
        if(obj[key]){
            return obj[key];
        }
        return null;
    },
    addLocalStorageObject:function(prototype, key, value){
        var obj = this.getLocalStorageObject(prototype);
        obj[key] = value;
        this.setLocalStorageObject(prototype, obj);
    },
    delLocalStorageObject:function(prototype, key){
        var obj = this.getLocalStorageObject(prototype);
        if(obj[key]){
            delete obj[key];
        }
        this.setLocalStorageObject(prototype, obj);
    },
    /**
     * 比较当前查询时间段key 、缓存时间段key : 作品ID相同，日期相同且缓存天数30大于等于查询天数7 返回true 否则返回false
     * @param dateNow 格式：1562b27aee62cce8_2016_08_02_366
     * @param dateLocal 格式：562b27aee62cce8_2016_08_02_7
     * @returns {boolean}
     */
    sameKeyForStatistics:function(dateNow,dateLocal){
        var nowLastIndex = dateNow.lastIndexOf("_");
        var localLastIndex = dateLocal.lastIndexOf("_");
        if(dateNow.substr(0,nowLastIndex) != dateLocal.substr(0,localLastIndex)) {
            return false;
        }
        var dateNowDay = dateNow.substring(nowLastIndex+1);
        var dateLocalDay = dateLocal.substring(localLastIndex+1);
        return parseInt(dateLocalDay) >= parseInt(dateNowDay);
    },
    /**
     * 根据当前生成key，获取缓存数据 不存在则返回null
     * @param workId 作品ID
     * @param startTime 数据开始日期
     * @param endTime 数据结束日期
     * @param localDayKey 数据键key
     * @param localDataKey 数据值key
     * @returns {*}
     */
    getDataByLocalStory:function(workId,startTime,endTime,localDayKey,localDataKey){
        var nowStr = GlobalFunc.formatTimeToStr(new Date().getTime(),"yyyy_MM_dd");
        var searchDay = Math.ceil((endTime-startTime)/1000/60/60/24);  //7/31/366
        var currentSearchDays = workId+"_"+nowStr+"_"+searchDay;
        var tempDays = SaveLocalFunc.getLocalStorageValue("StatisticsData",localDayKey);
        if(tempDays && SaveLocalFunc.sameKeyForStatistics(currentSearchDays,tempDays))
        {
            var tempDatas = SaveLocalFunc.getLocalStorageObject(localDataKey);
            if(tempDatas)
                return tempDatas;
        }
        return null;
    },
    setDataToLocalStory:function(workId,startTime,endTime,localDayKey,localDataKey,data){
        var nowStr = GlobalFunc.formatTimeToStr(new Date().getTime(),"yyyy_MM_dd");
        var searchDay = Math.ceil((endTime-startTime)/1000/60/60/24);  //7/31/366
        var currentSearchDays = workId+"_"+nowStr+"_"+searchDay;
        SaveLocalFunc.addLocalStorageObject("StatisticsData", localDayKey,currentSearchDays);
        SaveLocalFunc.setLocalStorageObject(localDataKey,data);
    }
});

module.exports = SaveLocalFunc;
