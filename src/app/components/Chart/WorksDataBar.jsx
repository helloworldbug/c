/**
 * Created by GYY on 2016/7/28.
 * 更多数据-分类数据-pv柱状图
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
var barChart = new Chart({
    calculable: true,
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['排行第一PV量', '我的PV量']
    },
    series: [{ radius: '55%', center: ['50%', '60%'] }],
    toolbox: {
        show: true,
        feature: {
            //dataView : {show: true, readOnly: false},
            //magicType : {show: true, type: ['line', 'bar']},
            //restore : {show: true},
            //saveAsImage : {show: true,name:"1562b27aee62cce8分类数据20160809",backgroundColor:'rgba(25,25,81,.2)',title:'保存为图片',pixelRatio:1}
        }
    }
});
// 设置为折线图表
barChart.setSeries('type', 'bar');
//数据集合 模拟
var pvDataArr = {};
//    tags:[
//        {
//            name:'金融',
//            top_one:{id:'111', name:'作品名称', ranking:1, pv:12112},
//            self:{id:'222', name:'作品名称', ranking:9087, pv:122}
//        },{
//            name:'互联网',
//            top_one:{id:'111', name:'作品名称', ranking:1,pv:2112},
//            self:{id:'222', name:'作品名称', ranking:9087, pv:1202}
//        },{
//            name:'时尚',
//            top_one:{id:'111', name:'作品名称', ranking:1,pv:212},
//            self:{id:'222', name:'作品名称', ranking:9087, pv:102}
//        }
//    ]
//};
//查询条件 作品ID 开始时间 结束时间
var workId, startTime, endTime;
//数据数组 二维数组
var xAxisData = [], topOneData = [], selfData = [];
var url = "/v1/statistics/works/" + workId + "/tags/summary?date_from=" + GlobalFunc.formatTimeToStr(startTime, "yyyy/M/d") + "&date_to=" + GlobalFunc.formatTimeToStr(endTime, "yyyy/M/d") + "&access_token=";
//值 {workId}_2016_08_01_7 {workId}_2016_08_01_30 {workId}_2016_08_01_365
var localDayKey = "category_statistics_days";
var localDataKey = "category_statistics_data";
//请求数据
var requestPVData = function (db_ok, db_err) {
    //取消存缓存
    //var tempData = SaveLocalFunc.getDataByLocalStory(workId,startTime,endTime,localDayKey,localDataKey);
    //if(tempData){
    //    db_ok && db_ok(tempData);
    //    return;
    //}
    var server = serverurl.api;  //"http://api.dev.agoodme.com";
    url = "/v1/statistics/works/" + workId + "/tags/summary?date_from=" + GlobalFunc.formatTimeToStr(startTime, "yyyy/M/d") + "&date_to=" + GlobalFunc.formatTimeToStr(endTime, "yyyy/M/d") + "&access_token=";
    var contentType = "application/json";
    $.ajax({
        type: "GET",
        url: server + "" + url,
        contentType: contentType,
        success: function (result) {
            if (result.err) {
                db_err && db_err(result.err);
            } else {
                db_ok && db_ok(result);
            }

        },
        error: function (msg) {
            db_err && db_err(msg);
        },
        dataType: "json"
    });
}
//创建柱状图表组件
var WorksDataBar = React.createClass({
    getInitialState() {
        workId = this.props.workId;
        startTime = this.props.startTime;
        endTime = this.props.endTime;
        return {
            DidMount: false,
            loadError: false  //数据是否加载失败
        }
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
        barChart.setElement(ReactDOM.findDOMNode(this.refs[this.props.tid]));
    },
    //数据不变，组件更新执行
    componentWillUpdate() {
        barChart.setElement(ReactDOM.findDOMNode(this.refs[this.props.tid]));
    },
    //根据服务器返回对象 处理数据
    resetData(obj) {
        //根据数据获取对应集合
        xAxisData = [], topOneData = [], selfData = [];
        if (!obj || !obj.tags || obj.tags.length <= 0) return;
        obj.tags.sort(function (a, b) {
            return a.name.localeCompare(b.name)
        })
        for (var i = 0; i < obj.tags.length; i++) {
            xAxisData.push(obj.tags[i].name);
            var topOnePv = 0, selfPv = 0;
            if (obj.tags[i] && obj.tags[i].top_one && obj.tags[i].top_one.pv) {
                topOnePv = obj.tags[i].top_one.pv;
            }
            if (obj.tags[i] && obj.tags[i].self && obj.tags[i].self.pv) {
                selfPv = obj.tags[i].self.pv;
            }
            topOneData.push(topOnePv);
            selfData.push(selfPv);
        }
    },
    renderChart() {
        var self = this;
        workId = this.props.workId;
        startTime = this.props.startTime;
        endTime = this.props.endTime;
        barChart.showLoading();
        requestPVData(function (data) {
            pvDataArr = data;
            if (pvDataArr && pvDataArr.err) {
                self.renderChartForError(pvDataArr.err);
                return;
            }
            self.resetData(pvDataArr);
            barChart.setAxis('x', xAxisData);
            barChart.setAxis('y');
            if (xAxisData.length > 0) {
                barChart.setSeriesByIndex(0, {
                    itemStyle: {
                        normal: {
                            color: 'tomato',
                            barBorderColor: 'tomato',
                            barBorderWidth: 6,
                            barBorderRadius: 0,
                            label: {
                                show: true, position: 'top'
                            }
                        }
                    },
                    name: '排行第一PV量', type: 'bar', data: topOneData, barWidth: 40//柱图宽度
                    // ,markPoint: {
                    //     data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }]
                    // }
                    //,markLine : {data : [{type : 'average', name : '平均值'}]}
                });
                barChart.setSeriesByIndex(1, {
                    itemStyle: {
                        normal: {
                            color: 'tomato',
                            barBorderColor: 'tomato',
                            barBorderWidth: 6,
                            barBorderRadius: 0,
                            label: {
                                show: true, position: 'top'
                            }
                        }
                    },
                    name: '我的PV量', type: 'bar', data: selfData, barWidth: 40//柱图宽度
                    //,markPoint : {
                    //    data : [
                    //        {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183},
                    //        {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
                    //    ]
                    //}
                    //,markLine : {data : [{type : 'average', name : '平均值'}]}
                });
            }
            barChart.render();
        }, function (err) {
            self.renderChartForError(err);
        })

    },
    //数据加载错误
    renderChartForError(err) {
        this.setState({ loadError: true });
        barChart.chart.clear();
    }
});
module.exports = WorksDataBar;