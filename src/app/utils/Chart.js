/**
 * @name 图表类
 * @time 2015-9-25
 * @author 曾文彬
*/

'use strict';

// require core module
var React = require('react'),
    Echarts = require('echarts'),
    LineEcharts = require('echarts/chart/line'),
    PieEcharts = require('echarts/chart/pie'),
    BarEcharts = require('echarts/chart/bar'),
    MapEcharts = require('echarts/chart/map');

// define a Chart Class
class Chart {

    // initialize
    constructor(configs) {
        this.configs = {};

        var nowConfigs = {
            //noDataLoadingOption:{             //无数据文案二 暂注 by guyy
            //    text :"暂无数据",
            //    effect : 'whirling',
            //    effectOption:{
            //        backgroundColor:"#fff"
            //    },
            //    textStyle : {
            //        fontSize : 20
            //    }
            //},
            title: {
                text: configs.title || '', /* 主标题 */
                subtext: configs.subTitle || '', /* 副标题 */
                x: configs.titlePos || 'left' // 位置
            },

            legend: {
                orient: configs.legendOrient || 'horizontal',
                x: configs.legendPos || '',
                data: configs.legendLabelValue || []
            },

            tooltip: configs.tooltip,
            grid:configs.grid,

            toolbox: configs.toolbox,

            calculable: configs.calculable,

            series: configs.series,
            dataRange:configs.dataRange
        };

        $.extend(this.configs, nowConfigs);
    }

    getConfigs() {
        return this.configs;
    }

    setElement(element) {
        this.element = element; 
    }

    setTitle(type, title) {
        var configs = this.getConfigs();

        !configs.title && (configs.title = {});

        configs.title[type] = title;
    }
    setOption(key,value){
        var configs = this.getConfigs();
        configs[key]=value;
    }
    setSeries(type, data) {
        var configs = this.getConfigs();
        this.getConfigs().series[0].data=[];
        configs.series && configs.series.forEach((_ses, _i) => {

            if (type === 'data') {
                _ses[type] = _ses[type] instanceof Array
                    ? _ses[type].concat(data[_i])
                    : data[_i];
                
                return;
            }

            _ses[type] = data instanceof Array ? data[_i] : data;
        });
    }
    //根据索引添加对象 add by guYY 2016/7/28
    setSeriesByIndex(index,obj){
        var configs = this.getConfigs();
        this.getConfigs().series[index] = obj;
    }
    setTooltipTrigger(tooltipType) {
        var configs = this.getConfigs();

        !configs.tooltip && (configs.tooltip = {});

        configs.tooltip.trigger = tooltipType;
    }

    setAxis(sign, data) {
        var axis = {}, axi;

        if (sign === 'x') {
            axis.type = 'category';
            axis.data = data;
        } else {
            axis.type = 'value';
        }

        axi = sign + 'Axis';
        // !this.configs[axi] && (this.configs[axi] = [axis]);
        this.configs[axi] = [axis];
    }

    setLegendData(data) {
        var configs = this.getConfigs();

        !configs.legend && (configs.legend = {});

        configs.legend.data = data;
    }

    setTextFormat(formatString) {
        this.configs.tooltip.formatter = formatString;
    }
    //设置数据范围 add by guYY 2016/7/29
    setDataRange(key ,value){
        var configs = this.getConfigs();
        !configs.dataRange && (configs.dataRange = {});
        configs.dataRange[key] = value;
    }
    showLoading(){
        this.chart = Echarts.init(this.element);
        this.chart.showLoading({
            animation:false,
            text : '数据读取中...',
            textStyle : {fontSize : 16}});
    }
    // render
    render() {
        this.chart = Echarts.init(this.element);
        this.chart.setOption(this.getConfigs());
    }
}

// export a Chart Class
module.exports = Chart;