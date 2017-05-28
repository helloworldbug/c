'use strict';
var React = require('react');
var Pie = require('../Chart/Pie');
var Bar = require('../Chart/newBar');
var tpl = require("../../utils/tpl");
var _=require('lodash');
var createFragment = require('react-addons-create-fragment');
var FormChart = React.createClass({
    //初始化数据变量 标题 类型 数据
    getInitialState() {
		this.mounted=true;
        return {
        	selectOptions : [],
        	chartType: 'bar',
        	content : {},
        	store : {}
        };
    },
	componentWillUnmount:function(){
		this.mounted=false;
	},
    //渲染完进行查询
    componentDidMount() {
    	this.firstQueryData();
    },
    render() {
        var content ={noData:<div style = {{textAlign : "center",marginTop:'150px'}}>暂无数据</div>} ;
        return (
            <div>
                <div className="panelbar">
                    {/*下拉列表*/}
                    <span className="chartselect">
                        <select value={this.state.dataType} onChange={this.changeSelect}>
                            {this.state.selectOptions.map((item,index)=>{
                                var title=item.title.title;
                                var type=item.id;
                                return <option key={index} value={type}>{title}</option>
                            })}
                        </select>
                    </span>
                    {/*切换类型*/}
                    <span id="pieChart" className="exce" data-type="pie" onClick={this.changeChartType}>饼形图表</span>
                    <span id="barChart" className="exce" data-type="bar" onClick={this.changeChartType}>柱形图表</span>
                </div>
                <div id="mainChart">
                    {/*图表内容*/}
                    {createFragment(this.state.content)}
                </div>
            </div>
        )
    },

    firstQueryData : function () {
    	var _this = this;
        //查询标题相关数据
    	this.getFormTitle().then(function (title) {
    		var promise = new Promise (function (resolve ,reject) {
				if(_this.mounted){
					_this.setState({
						selectOptions : title
					},function () {
						resolve();
					});
				}

    		});
    	}).then(function () {
			if(!_this.mounted){
				return;
			}
    		if (_this.state.selectOptions.length != 0) {
                //查询下拉列表第一项数据
    			_this.queryDate(_this.state.selectOptions[0].id);
    		}else {
                //没有数据
                _this.setState({
                    content : {noData:<div style={{textAlign:'center',marginTop:'120px'}}>没有相关数据</div>}
                });
            }
    	});
    },

    getFormTitle : function () {
    	var _this = this;
		var promise = new Promise (function (resolve , reject) {
            //遍历作品信息 查找单选多选元素
			fmacapi.tpl_get_data (_this.props.tid, function (pagesObject) {
				if(!_this.mounted){
					return;
				}
	            var pages = pagesObject.attributes.pages;
	            var type = [];
                //将type为20或21的元素标题与信息返回
	            for (var i = 0 ; i < pages.length ; i++) {
	            	for (var j = 0; j < pages[i].attributes.item_object.length ; j++) {
	            		if (pages[i].attributes.item_object[j].attributes.item_type == 20 ||pages[i].attributes.item_object[j].attributes.item_type == 21) {
	            			var obj = pages[i].attributes.item_object[j];
	            			var val = eval("("+obj.attributes.item_val+")");
	            			type.push({title:val,id:obj.id});
	            		}
	            	}
	            }
	            resolve(type);
	        });
		}.bind(this));
    	return promise;
    },

    queryDate : function (id) {
    	var _this = this;
    	var arr = [];
    	var o = {};
        //一次查询最多1000条 需要递归
    	tpl.quertChartDataCount(id,this.props.tid).then(function (data) {
            //递归次数
			if(!_this.mounted){
				return;
			}
    		var t = Math.ceil(data/900);
    		var query = function (times) {
                //递归结束 处理数据
				if(!_this.mounted){
					return;
				}
    			if (times == 0) {
    				var index;
    				var cur = _this.state.selectOptions;
    				for (var i = 0 ; i < cur.length ;i++) {
    					if (cur[i].id == id) {
    						index = i;
    					}
    				}
    				o.title = cur[index].title.title;
    				o.content = {};
                    //初始化选项内容数量
    				for (var i = 0; i < cur[index].title.options.length; i++) {
    					o.content[cur[index].title.options[i]] = 0;
    				}
    				for (var i = 0 ; i < arr.length ; i ++ ) {
						
                        //单选数据处理
    					if (arr[i].attributes.hasOwnProperty("cd_radio_val")&&id==arr[i].attributes.cd_radio) {
    						o.content[arr[i].attributes.cd_radio_val] += 1;
    					}else if(id==arr[i].attributes.cd_checkbox){
                            //多选数据处理
    						var a = arr[i].attributes.cd_checkbox_val.split("|");
    						if (a[a.length] == undefined) {
    							a.pop();
    						}
                            //对于选项统计数+1
    						for (var j = 0; j < a.length ; j++) {
    							o.content[a[j]] += 1;
    						}

    					}
    				}
    				_this.setState({
    					content : {"bar":<Bar tid={_this.props.tid} chartStore={o} type={_this.state.chartType}/>},
    					store : o

    				});
    			}else {
                    //调用接口 取数据
    				tpl.quertChartData(id,_this.props.tid,(times-1)*900,900).then(function (data){
    					arr = arr.concat(data.results);
    					query(--times);
    				});
    			}
    		}
    		query(t);
    	});
    },

    //改变展现形式
    changeChartType : function (e) {
    	var type = e.target.dataset.type;
    	var _this = this;
        var c = {"bar":<Bar tid={_this.props.tid} chartStore={this.state.store} type={type}/>};
        if (this.state.selectOptions.length == 0) {
            c ={noData:<div style={{textAlign:'center',marginTop:'120px'}}>没有相关数据</div>} ;
        }
    	this.setState({
    		chartType : type,
			content : c
    	});
    },
    //改变数据项
    changeSelect : function (e) {
    	var _this = this;
    	var index = e.target.selectedIndex;
    	var value = e.target.options[index].value;
    	this.setState({
    		content : {}
    	},function () {
    		this.queryDate(value);
    	});
    }
})
module.exports = FormChart;