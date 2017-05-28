/**
 * Created by GYY on 2016/7/26.
 * 作品数据趋势折线图
 */
"use strict";
var React = require("react");
var ReactDOM = require("react-dom");
var serverurl = require("../../config/serverurl");
// require chart class
var Chart = require('../../utils/Chart');
var GlobalFunc = require('../Common/GlobalFunc');
var SaveLocalFunc = require('../Common/SaveLocalFunc');
var errIcon = require("../../../assets/images/user/statistics/icon04.png");
//平台选中    0全部平台   1微信  2新浪微博
var ALL_PLATFORM = 0, WECHAT_PLATFORM = 1, SINA_PLATFORM = 2;
//平台类型
var WEIXIN = "weixin", WEIBO = "weibo";//, QQ = "qq";
//初始化拆线图表
var lineChart = new Chart({
    legendPos: 'center',
    calculable: true,
    legend: {
    },
    grid: {
        left: '1%',
        right: '1%',
        bottom: '3%',
        containLabel: true
    },
    series: [
        {
            markPoint: {
                data: [
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' }
                ]
            }
        }
    ],
    toolbox: {
        show: true,
        feature: {
            //magicType: {show: true, type: ['stack', 'tiled']},
            //saveAsImage: {show: true}
        }
    }
});
// 设置为折线图表
lineChart.setSeries('type', 'line');
// 设置触发区域形状
lineChart.setTooltipTrigger('axis');
lineChart.setLegendData(['浏览量', '转发量', '评论数', '点赞数']);
//数据集合 模拟
var pvDataArr = {};
//platforms: {
//    "weixin": {
//        name: 'weixin', data: {
//            "2016/7/27": {date: '2016/7/27', pv: 100, share_num: 200, comment_num: 300, like_num: 400},
//            "2016/7/21": {date: '2016/7/21', pv: 150, share_num: 250, comment_num: 350, like_num: 450},
//            "2016/7/22": {date: '2016/7/22', pv: 200, share_num: 300, comment_num: 400, like_num: 500},
//            "2016/7/23": {date: '2016/7/23', pv: 250, share_num: 350, comment_num: 450, like_num: 550},
//            "2016/7/24": {date: '2016/7/24', pv: 300, share_num: 400, comment_num: 500, like_num: 600},
//            "2016/7/25": {date: '2016/7/25', pv: 350, share_num: 450, comment_num: 550, like_num: 650},
//            "2016/7/26": {date: '2016/7/26', pv: 400, share_num: 500, comment_num: 600, like_num: 700}
//        }
//    },
//    "weibo": {
//        name: 'weobo', data: {
//            "2016/7/27": {date: '2016/7/27', pv: 10, share_num: 0, comment_num: 30, like_num: 400},
//            "2016/7/21": {date: '2016/7/21', pv: 15, share_num: 0, comment_num: 0, like_num: 45},
//            "2016/7/22": {date: '2016/7/22', pv: 20, share_num: 30, comment_num: 40, like_num: 50},
//            "2016/7/25": {date: '2016/7/25', pv: 35, share_num: 45, comment_num: 55, like_num: 65},
//            "2016/7/26": {date: '2016/7/26', pv: 40, share_num: 50, comment_num: 60, like_num: 70}
//        }
//    }
//}
//}

var xAxisData = [],url;
var pvData = [], shareData = [], commentData = [], likeData = [];
// var url = "/v1/statistics/works/" + workId + "/platform/trends?date_from=" + GlobalFunc.formatTimeToStr(startTime, "yyyy/M/d") + "&date_to=" + GlobalFunc.formatTimeToStr(endTime, "yyyy/M/d") + "&access_token=";
//值 {workId}_2016_08_01_7 {workId}_2016_08_01_30 {workId}_2016_08_01_365
var localDayKey = "total_statistics_days";
var localDataKey = "total_statistics_data";
//请求数据
//创建折线图表组件
var WorksDataLine = React.createClass({
    getInitialState() {
        //查询条件 作品ID 开始时间 结束时间 平台类型
        this.workId = this.props.workId;
        this.startTime = this.props.startTime;
        this.endTime = this.props.endTime;
        this.platformIndex = this.props.indexForTypeOne;
        return {
            DidMount: false,
            loadError: false //数据加载是否失败
        }
    },
    requestPVData: function (db_ok, db_err) {
    //取消存缓存
    //var tempData = SaveLocalFunc.getDataByLocalStory(workId, startTime, endTime,localDayKey, localDataKey);
    //if(tempData){
    //    db_ok && db_ok(tempData);
    //    return;
    //}
    url = "/v1/statistics/works/" + this.workId + "/platform/trends?date_from=" + GlobalFunc.formatTimeToStr(this.startTime, "yyyy/M/d") + "&date_to=" + GlobalFunc.formatTimeToStr(this.endTime, "yyyy/M/d") + "&access_token=";
    var server = serverurl.api;// "http://api.test.agoodme.com";
    var contentType = "application/json";
    $.ajax({
        type: "GET",
        url: server + "" + url,
        contentType: contentType,
        success: function (result) {
            //if(result && !result.err){
            //    SaveLocalFunc.setDataToLocalStory(workId, startTime, endTime,localDayKey, localDataKey,result);
            //}
            db_ok && db_ok(result);
        },
        error: function (msg) {
            db_err && db_err(msg);
        },
        dataType: "json"
    });
},
    render() {
        if (this.state.DidMount == true && this.state.loadError == false) {
            this.renderChart()
        }
        var errDom;
         if (this.state.loadError) {
            errDom = <div className="errorPrompt"><img src={errIcon } className="img"/><br/>数据获取失败，请刷新页面</div>;
            return  <div className="fl img-wrapper"><div id="main" ref={this.props.tid} style={{display:"none"}}></div>{errDom}</div>
        }
        return <div className="fl img-wrapper"><div id="main" ref={this.props.tid}></div></div>;
    },
    //第一次组件渲染成功执行
    componentDidMount() {
        var self = this;
        this.setState({
            DidMount: true
        });
        lineChart.setElement(ReactDOM.findDOMNode(self.refs[self.props.tid]));
    },
    //数据不变，组件更新执行
    componentWillUpdate(nextProps) {
        //console.log(this.props.workId+"@@"+nextProps.workId);
        // lineChart.setElement(ReactDOM.findDOMNode(self.refs[self.props.tid]));
    },
    //根据服务器返回对象 处理数据
    resetData(obj) {
        //根据数据获取对应集合
        xAxisData = [];
        pvData = [], shareData = [], commentData = [], likeData = [];
        //循环开始日期到结束日期
        if (!obj || !obj.platforms) return;
        var oneData = [];
        //全部平台
        if (this.platformIndex == ALL_PLATFORM) {
            for (var name in obj.platforms) {
                oneData.push(obj.platforms[name]);
            }
        } else if (this.platformIndex == WECHAT_PLATFORM) {//微信
            if (obj.platforms[WEIXIN]) {
                oneData.push(obj.platforms[WEIXIN]);
            }

        } else if (this.platformIndex == SINA_PLATFORM) {//微博
            if (obj.platforms[WEIBO]) {
                oneData.push(obj.platforms[WEIBO]);
            }

        }
        var tempDate = new Date(this.startTime);
        var tempTimer = tempDate.getTime();
        var pvNum, shareNum, commentNum, likeNum;
        while (tempTimer <= this.endTime) {
            var tempDataStr = GlobalFunc.formatTimeToStr(tempTimer, "yyyy/M/d");
            pvNum = shareNum = commentNum = likeNum = 0;
            for (var i = 0; i < oneData.length; i++) {
                if (oneData[i].data && oneData[i].data[tempDataStr]) {
                    pvNum += oneData[i].data[tempDataStr].pv || 0;
                    shareNum += oneData[i].data[tempDataStr].share_num || 0;
                    commentNum += oneData[i].data[tempDataStr].comment_num || 0;
                    likeNum += oneData[i].data[tempDataStr].like_num || 0;
                }
            }
            xAxisData.push(tempDataStr);
            pvData.push(pvNum);
            shareData.push(shareNum);
            commentData.push(commentNum);
            likeData.push(likeNum);
            tempDate.setDate(tempDate.getDate() + 1);
            tempTimer = tempDate.getTime();
        }
    },
    renderChart() {
        var self = this;
        this.workId = this.props.workId;
        this.startTime = this.props.startTime;
        this.endTime = this.props.endTime;
        this.platformIndex = this.props.indexForTypeOne;
        lineChart.showLoading();
        this.requestPVData(function (data) {
            pvDataArr = data;
            if (pvDataArr && pvDataArr.err) {
                self.renderChartForError(pvDataArr.err);
                return;
            }
            self.resetData(pvDataArr);
            lineChart.setAxis('x', xAxisData);
            lineChart.setAxis('y');
            lineChart.setSeriesByIndex(0, { name: '浏览量', type: 'line', data: pvData });
            lineChart.setSeriesByIndex(1, { name: '转发量', type: 'line', data: shareData });
            lineChart.setSeriesByIndex(2, { name: '评论数', type: 'line', data: commentData });
            lineChart.setSeriesByIndex(3, { name: '点赞数', type: 'line', data: likeData });
            lineChart.render();
        }, function (err) {
            self.renderChartForError(err);
        });
    },
    //数据加载错误
    renderChartForError(err) {
        this.setState({ loadError: true });
        lineChart.clear;
    }
});
module.exports = WorksDataLine;