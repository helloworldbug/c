/**
 * @name 图表统计组件
 * @time 2015-9-25
 * @author 曾文彬
*/

'use strict';

// require core module
var React = require('react');
//require interface
var CustormDataModel = require("../../utils/CustormDataModel");
var custormDataMode;
// require children component
var Pie = require('../Chart/Pie');
var Bar = require('../Chart/Bar');

var _=require('lodash');

var FormChart = React.createClass({
    getInitialState() {
        return {
            chartType: 'pie',
            dataType: null,
            selectOptions: [],
            chartStore:{}
        };
    },
    componentWillMount() {
        custormDataMode = new CustormDataModel({
            uid: fmacloud.User.current()?fmacloud.User.current().id:null,
            orderDirection: 0
        });
        this.countChart();
    },
    render() {
        var content;
        if(this.state.chartType=="pie"){
            content=<Pie tid={this.props.data.tid} dataType={this.state.dataType} selectOptions={this.state.selectOptions} chartStore={this.state.chartStore} />;
        }
        if(this.state.chartType=="bar"){
            content=<Bar tid={this.props.data.tid} dataType={this.state.dataType} selectOptions={this.state.selectOptions} chartStore={this.state.chartStore} />;
        }
        return (
            <div>
                <div className="panelbar">
                    <span className="chartselect">
                        <select onChange={this.changeTitle} value={this.state.dataType}>
                            {this.state.selectOptions.map((item)=>{
                                var title=item.value;
                                var type=item.type;
                                return <option value={type}>{title}</option>
                            })}
                        </select>
                    </span>
                    <span id="pieChart" className="exce" type="pie" onClick={this.changeChartType}>饼形图表</span>
                    <span id="barChart" className="exce" type="bar" onClick={this.changeChartType}>柱形图表</span>
                </div>
                <div id="mainChart">
                    {content}
                </div>
            </div>
        )
    },
    countChart() {
        var chartTypeCount = 0;
        var dataChartType = [];
        var dataChartStore = _.cloneDeep(this.props.chart); 
        var options=[];
        var _this=this;
        for(var item in this.props.chart){
            chartTypeCount++;
            dataChartType.push(item);
        }
        if(chartTypeCount==0||this.props.data.dataCount==0){
            return 
        }
        for(var item in this.props.chartOptions){
            if(item=="radio"){
                this.setState({
                    dataType:"radio"
                })
            }else if(item=="checkbox"){
                this.setState({
                    dataType:"checkbox"
                })
            }
            _this.forceUpdate();
            options.push({type:item,value:this.props.chartOptions[item].title});
        }
        this.setState({
            selectOptions:options
        });
        var getData=function(times){
            if(times==0){
                _this.setState({
                    chartStore:dataChartStore
                });
                return 
            }
            custormDataMode.set({ skip: (times-1)*900, limit: 900 }).getCustormData(_this.props.data.tid, null, null, 'find',
                (data) => {
                    for(var i = 0;i < data.length;i++){
                        for(var j = 0;j < dataChartType.length;j++){
                            if(dataChartType[j] == "cd_radio"){
                                var a = data[i].attributes[dataChartType[j]];
                                if(a==undefined){
                                    break;
                                }
                                dataChartStore[dataChartType[j]][a]++;
                            }
                            else if(dataChartType[j] == "cd_checkbox"){
                                if(data[i].attributes.hasOwnProperty(dataChartType[j])){
                                    var a = data[i].attributes[dataChartType[j]];
                                    if(a==undefined){
                                        break;
                                    }
                                    var b = a.split(",");
                                    b.splice(b.length-1,1);
                                    for(var k = 0;k < b.length;k++){
                                        dataChartStore[dataChartType[j]][b[k]]++;
                                    }
                                }   
                            }
                        }
                    }
                    getData(times-1);
                },
                () => {
                }
            );
        }
        getData(this.props.data.runTime);
    },
    changeTitle(e){
        var sel=e.target;
        var val="";
        var field="";
        var option;
        for(var i=0;i<sel.length;i++){
            option=sel.options[i];
            if(option.selected){
                field=option.value;
            }
        }
        this.setState({
            dataType: field
        });
    },
    changeChartType(e){
        this.setState({
            chartType:$(e.target).attr("type")
        });
    }
})
module.exports = FormChart;