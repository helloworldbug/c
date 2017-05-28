/**
 * @name 饼图组件
 * @time 2015-9-25
 * @author 曾文彬
*/

'use strict';

// require core module
var React = require('react');
var ReactDOM=require("react-dom");

// require chart class
var Chart = require('../../utils/Chart');

// initial pie chart object
var pieChart = new Chart({

    title: '标题',
    
    titlePos: 'center',

    legendOrient: 'vertical',
    
    legendPos: 'left',
    
    calculable: true,
    
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
                type: [],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
            
            restore: {
                show: true
            },
            
            saveAsImage: {
                show: true
            }
        }
    },

    series: [
        {
            radius: '55%',
            center: ['50%', '60%']
        }
    ]
});

// 设置为饼图图表
pieChart.setSeries('type', 'pie');;

// 设置触发区域形状
pieChart.setTooltipTrigger('item');

// 设置legent显示文字
pieChart.setLegendData(['作品数']);

// 设置tooltip格式字符
pieChart.setTextFormat('{a} <br/>{b} : {c} ({d}%)');

// define pie component
var Pie = React.createClass({
    getInitialState(){
        return {
            DidMount:false      
        }
    },
    render() {
        if(this.state.DidMount==true){
            this.renderChart()
        }
        
        return <div ref={this.props.tid} style={{ width: 800, height: 350 }}></div>;
    },
    componentDidMount() {
        pieChart.setElement(ReactDOM.findDOMNode(this.refs[this.props.tid]));
        // this.renderChart();
        this.setState({
            DidMount:true
        });
    },
    componentWillUpdate(){
        pieChart.setElement(ReactDOM.findDOMNode(this.refs[this.props.tid]));
    },
    renderChart(nextProps){
        var dataType=this.props.dataType;
        var chartStore=this.props.chartStore;
        var selectOptions=this.props.selectOptions;
        var data=[];
        var title=[];
        for(var i=0;i<selectOptions.length;i++){
            if(selectOptions[i].type==dataType){
                pieChart.setTitle('text',selectOptions[i].value);
            }
        }
        for(var item in chartStore['cd_'+dataType]){
            data.push({value:chartStore['cd_'+dataType][item],name:item});
            title.push(item);
        }
        
        pieChart.setLegendData(title);
        pieChart.setSeries('data', [data]);
        pieChart.render();
    }
});

// export pie component
module.exports = Pie;