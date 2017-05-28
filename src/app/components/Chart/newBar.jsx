'use strict';
var React = require('react');
var ReactDOM=require("react-dom");
var Chart = require('../../utils/Chart');

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

barChart.setSeries('type', 'bar');
barChart.setTooltipTrigger('axis');
pieChart.setSeries('type', 'pie');;
pieChart.setTooltipTrigger('item');
pieChart.setLegendData(['作品数']);
pieChart.setTextFormat('{a} <br/>{b} : {c} ({d}%)');

var Chart = React.createClass({
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
    	pieChart.setElement(ReactDOM.findDOMNode(this.refs[this.props.tid]));
    	this.renderChart();
    },
    componentWillReceiveProps(next){

        	if (next.type == 'pie') {
        		pieChart.render();
        	}else {
        		barChart.render();
        	}
      
    },

    renderChart() {
        var barData = [];
        var x = [];
        var pieData = [];
        var cur = this.props.chartStore;
        barChart.setTitle('text',cur.title);
        pieChart.setTitle('text',cur.title);
        for (var item in cur.content) {
        	x.push(item);
        	barData.push({value : cur.content[item], itemStyle:{
                  normal:{color:'#9FD7FB'}
              }});
        	pieData.push({value:cur.content[item],name:item});
        }
        //console.log(barData);
        barChart.setAxis('x', x);
        barChart.setAxis('y');
        barChart.setSeries('data', [barData]);

        pieChart.setLegendData(x);
        pieChart.setSeries('data', [pieData]);
        if (this.props.type == 'bar') {
        	barChart.render();
        }else {
        	pieChart.render();
        }
        
    }
});

// export bar component
module.exports = Chart;