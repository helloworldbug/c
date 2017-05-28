/**
 * Created by GYY on 2016/7/28.
 * 更多数据-操作系统-区域图谱
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
//地图图表
var mapChart = new Chart({
    calculable: true,
    tooltip: {
        trigger: 'item',
        formatter: "{b} <br/>{a}"
    },
    series: [
        {}
    ],
    dataRange: {
        min: 0,
        max: 1,
        x: 'left',
        y: 'bottom',
        text: ['高', '低'], // 文本，默认为数值文本
        color: ['#ff5e5e', '#ffa25e', '#ffd05e', '#fce6b2']//,'#e1dbcd'
        ,calculable: true
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
            dataView: { readOnly: false },
            restore: {}
            //saveAsImage: {show: true}
        }
    }

});
// 设置为折线图表
// mapChart.setSeries('name', 'PV量');
// mapChart.setSeries('type', 'map');
// mapChart.setSeries('mapType', 'china');
// mapChart.setSeries('itemStyle', {
//     normal: { label: { show: true } },//,areaStyle:{color:'rgba(240,0,0,.1)'}
//     emphasis: { label: { show: true } }
// });
//数据集合 模拟
var pvDataArr = {};
//    areas:[{name:'北京',ip:'110.23.98.112',pv:121212},
//            {name:'上海',ip:'110.23.98.112',pv:92112},
//            {name:'河北',ip:'110.23.98.112',pv:3312},
//            {name:'重庆',ip:'110.23.98.112',pv:31312}]
//};

//数据数组
var seriesData = [];
var url = "";
//值 {workId}_2016_08_01_7 {workId}_2016_08_01_30 {workId}_2016_08_01_365
var localDayKey = "area_statistics_days";
var localDataKey = "area_statistics_data";

//创建折线图表组件
var WorksDataMap = React.createClass({
    getInitialState() {
        //查询条件 作品ID 开始时间 结束时间
        this.workId = this.props.workId;
        this.startTime = this.props.startTime;
        this.endTime = this.props.endTime;
        return {
            DidMount: false,
            loadError: false     //数据是否加载错误
        }
    },
    //请求数据
    requestPVData: function (db_ok, db_err) {
        //取消存缓存
        //var tempData = SaveLocalFunc.getDataByLocalStory(workId, startTime, endTime, localDayKey, localDataKey);
        //if(tempData){
        //    db_ok && db_ok(tempData);
        //    return;
        //}
        url = "/v1/statistics/works/" + this.workId + "/area/summary?date_from=" + GlobalFunc.formatTimeToStr(this.startTime, "yyyy/M/d") + "&date_to=" + GlobalFunc.formatTimeToStr(this.endTime, "yyyy/M/d") + "&access_token=";
        var server = serverurl.api;//"http://api.dev.agoodme.com";//
        var contentType = "application/json";
        $.ajax({
            type: "GET",
            url: server + "" + url,
            contentType: contentType,
            success: function (result) {
                //if(result && !result.err){
                //    SaveLocalFunc.setDataToLocalStory(workId, startTime, endTime, localDayKey, localDataKey, result);
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
            return <div className="fl img-wrapper"><div id="main" ref={this.props.tid} style={{ display: "none" }}></div>{errDom}</div>
        }
        return <div className="fl img-wrapper"><div id="main" ref={this.props.tid}></div></div>;
    },
    //第一次组件渲染成功执行
    componentDidMount() {
        this.setState({
            DidMount: true
        });
        mapChart.setElement(ReactDOM.findDOMNode(this.refs[this.props.tid]));
    },
    //数据不变，组件更新执行
    componentWillUpdate() {
        mapChart.setElement(ReactDOM.findDOMNode(this.refs[this.props.tid]));
    },
    //根据服务器返回对象 处理数据
    resetData(obj) {
        //根据数据获取对应集合
        seriesData = [];
        if (!obj || !obj.areas || obj.areas.length <= 0) return;
        for (var i = 0; i < obj.areas.length; i++) {
            if (!obj.areas[i].name || !obj.areas[i].pv) continue;
            var pvPrecent = (obj.areas[i].pv * 100).toFixed(2) + "%";
            seriesData.push({
                name: pvPrecent, type: 'map', mapType: 'china', roam: false, itemStyle: {
                    normal: { label: { show: true } },
                    emphasis: { label: { show: true } }
                }, data: [{ name: obj.areas[i].name, value: obj.areas[i].pv }]
            });
        }
    },
    renderChart() {
        var self = this;
        this.workId = this.props.workId;
        this.startTime = this.props.startTime;
        this.endTime = this.props.endTime;
        mapChart.showLoading();
        this.requestPVData(function (data) {
            pvDataArr = data;
            if (pvDataArr && pvDataArr.err) {
                self.renderChartForError();
                return;
            }
            self.resetData(pvDataArr);
            if(seriesData.length==0){
               seriesData=[{
                name: "no data", type: 'map', mapType: 'china', roam: false, itemStyle: {
                    normal: { label: { show: true } },
                    emphasis: { label: { show: true } }
                }, data: []
            }] 
            }
            mapChart.setOption("series", seriesData);
            mapChart.render();
        }, function (err) {
            self.renderChartForError(err);
        });
    },
    //数据加载错误
    renderChartForError(err) {
        this.setState({ loadError: true });
        mapChart.clear;
    }
});
module.exports = WorksDataMap;