/**
 * @name 柱形图组件
 * @time 2015-10-8
 * @author 曾文彬
*/

'use strict';

// require core module
var React = require('react');
var ReactDOM=require("react-dom");
// require chart class
var Chart = require('../../utils/Chart');

// initial bar chart object
var barChart = new Chart({

    title: '标题',

    legendPos: 'center',

    calculable: true,

    legend: {
        
    },

    series : [
        {
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            }
        }
    ],

    toolbox: {
        show: true,

        feature: {
            mark: {
                show: true
            },

            dataView: {
                show: true,
                readOnly: false
            },

            magicType: {
                show: true,
                type: []
            },

            restore: {
                show: true
            },

            saveAsImage: {
                show: true
            }
        }
    }
});

// 设置为柱状图表
barChart.setSeries('type', 'bar');

// 设置数据列对应name
// barChart.setSeries('name', ['黄瓜', '茄子']);

// 设置触发区域形状
barChart.setTooltipTrigger('axis');

// 设置legend显示文字
// barChart.setLegendData(['黄瓜', '茄子']);

// define bar component
var Bar = React.createClass({
	 getInitialState(){
        return {
            DidMount:false      
        }
    },
    render() {
    	if(this.state.DidMount==true){
            this.renderChart()
        }
        return <div id="xx" ref={this.props.tid} style={{ width: 800, height: 350 }}></div>;
    },

    componentDidMount() {
    	barChart.setElement(ReactDOM.findDOMNode(this.refs[this.props.tid]));
        // this.renderChart();
        this.setState({
            DidMount:true
        });
    },
    componentWillUpdate(){
        barChart.setElement(ReactDOM.findDOMNode(this.refs[this.props.tid]));
    },
    renderChart() {
        var dataType=this.props.dataType;
        var chartStore=this.props.chartStore;
        var selectOptions=this.props.selectOptions;
        var data=[];
        var x=[];
        for(var i=0;i<selectOptions.length;i++){
            if(selectOptions[i].type==dataType){
                barChart.setTitle('text',selectOptions[i].value);
            }
        }
        for(var item in chartStore['cd_'+dataType]){
        	data.push(chartStore['cd_'+dataType][item]);
        	x.push(item);
        }   
        barChart.setAxis('x', x);
        barChart.setAxis('y');
        barChart.setSeries('data', [data]);
        barChart.render();

        

    }
});

// export bar component
module.exports = Bar;