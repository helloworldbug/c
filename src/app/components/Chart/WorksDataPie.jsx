/**
 * Created by GYY on 2016/7/28.
 * 更多数据-操作系统-pv饼图
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
//饼图图表
var pieChart = new Chart({
    legendPos: 'left',
    calculable: true,
    legendOrient: "vertical",
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {d}%"
    },
    series: [
        {
            radius: '55%',
            center: ['50%', '60%']
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
pieChart.setSeries('type', 'pie');
pieChart.setSeries('name', 'PV量');
pieChart.setSeries('itemStyle', {
    emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
    }
});
//数据集合 模拟
var pvDataArr = {};
//    oses:[{name:'iphone',sum:2321},{name:'Android',sum:1212},{name:'WinPhone',sum:1502},{name:'电脑',sum:12122},{name:'其他',sum:500}]
//};

//图表说明数据
var legendData = [];
//数据数组
var seriesData = [];
var url = "";
//值 {workId}_2016_08_01_7 {workId}_2016_08_01_30 {workId}_2016_08_01_365
var localDayKey = "system_statistics_days";
var localDataKey = "system_statistics_data";

//创建折线图表组件
var WorksDataPie = React.createClass({
    getInitialState() {
        //查询条件 作品ID 开始时间 结束时间
        this.workId = this.props.workId;
        this.startTime = this.props.startTime;
        this.endTime = this.props.endTime;
        return {
            DidMount: false,
            loadError: false  //数据是否加载失败
        }
    },
    requestPVData: function (db_ok, db_err) {
        //取消存缓存
        //var tempData = SaveLocalFunc.getDataByLocalStory(workId,startTime,endTime,localDayKey,localDataKey);
        //if(tempData){
        //    db_ok && db_ok(tempData);
        //    return;
        //}
        var API = this.props.API
        if (API == "platform") {
            url = "/v1/statistics/works/" + this.workId + "/platform/trends?date_from=" + GlobalFunc.formatTimeToStr(this.startTime, "yyyy/M/d") + "&date_to=" + GlobalFunc.formatTimeToStr(this.endTime, "yyyy/M/d") + "&access_token=";
        } else {
            url = "/v1/statistics/works/" + this.workId + "/" + API + "/summary?date_from=" + GlobalFunc.formatTimeToStr(this.startTime, "yyyy/M/d") + "&date_to=" + GlobalFunc.formatTimeToStr(this.endTime, "yyyy/M/d") + "&access_token=";
        }

        var server = serverurl.api;//"http://api.dev.agoodme.com";//
        var contentType = "application/json";
        $.ajax({
            type: "GET",
            url: server + "" + url,
            contentType: contentType,
            success: function (result) {
                //if(result && !result.err){
                //    SaveLocalFunc.setDataToLocalStory(workId,startTime,endTime,localDayKey,localDataKey,result);
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
        return <div className="fl img-wrapper"><div id="main" ref={this.props.tid}></div><div className="tips" ref="tips">（其他数据来源正在测试中，敬请期待）</div></div>;
    },
    //第一次组件渲染成功执行
    componentDidMount() {
        this.setState({
            DidMount: true
        });
        pieChart.setElement(ReactDOM.findDOMNode(this.refs[this.props.tid]));
    },
    //数据不变，组件更新执行
    componentWillUpdate() {
        pieChart.setElement(ReactDOM.findDOMNode(this.refs[this.props.tid]));
    },
    //根据服务器返回对象 处理数据
    resetData(obj) {
        //根据数据获取对应集合
        legendData = [], seriesData = [];
        var key;
        switch (this.props.API) {
            case "os":
                key = "oses";
                break;
            case "platform":
                key = "platforms";
                break;

        }
        if (!key) {
            return;
        }
        if (!obj || !obj[key] || obj[key].length <= 0) return;
        var arr = obj[key]
        for (var i = 0; i < arr.length; i++) {
            legendData.push(arr[i].name);
            seriesData.push({ name: arr[i].name, value: arr[i].sum });
        }
    },
    renderChart() {
        var self = this;
        this.workId = this.props.workId;
        this.startTime = this.props.startTime;
        this.endTime = this.props.endTime;
        pieChart.showLoading();
        this.requestPVData(function (data) {
            pvDataArr = data;
            if (pvDataArr && pvDataArr.err) {
                self.renderChartForError(pvDataArr.err);
                return;
            }
            self.resetData(pvDataArr);
            pieChart.setLegendData(legendData);
            pieChart.setSeries("data", [seriesData]);
            if (self.props.API == "platform") {
                if (seriesData.length == 0) {
                    self.refs["tips"].style.display = "none";
                } else {
                    self.refs["tips"].style.display = "block";
                }
            }

            pieChart.render();
        }, function (err) {
            self.renderChartForError(pvDataArr.err);
        });
    },
    //数据加载错误
    renderChartForError(err) {
        this.setState({ loadError: true });
        pieChart.clear;
    }
});
module.exports = WorksDataPie;