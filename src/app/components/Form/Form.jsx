/**
 * @description 个人中心数据查询
 * @time 2015-9-23
 * @author 刘华
*/

'use strict';
var React = require('react');
var QueryDataCSS = require('../../../assets/css/queryData');
var FormData=require('./NewFormInput');
var FormChart=require('./NewFormChart');
// var FormMagazineCard = require('./FormMagazineCard');
var UserService = require("../../utils/user");
var CustormDataModel = require("../../utils/CustormDataModel");
var tpl = require("../../utils/tpl");

var custormDataMode = new CustormDataModel({
    uid: fmacloud.User.current()?fmacloud.User.current().id:null,
    orderDirection: 0
});

var form =React.createClass({
    uid: fmacloud.User.current()?fmacloud.User.current().id:null,
    tid:null,
    getInitialState:function(){
        this.mounted=true;
        return {
            titleType:"form",
            data:{
                tid:this.props.params.tid,
                dataType:[],
                dataTypeCount:0,
                dataCount:0,
                dataPageCount:0,
                runTime:0
            },
            chart:{},
            chartOptions:{},
            crumb:""
        }
    },
    componentWillMount: function () {
        this.mounted=false
        this.tid = this.props.params.tid;
        this.getFormTitle();
        this.getTplFb();
    },
    render:function(){
        var title=[{className:"form",value:"表单统计"},{className:"chart",value:"选项统计"}];
        var content = null;
        var _this=this;
        switch(this.state.titleType){
            case "form":
            content = <FormData tid = {this.props.params.tid}/>;
            break;
            case "chart":
            content = <FormChart tid = {this.props.params.tid} data={this.state.data} chart={this.state.chart} chartOptions={this.state.chartOptions}/>;
            break;


        }
        return  (<div>
                    <div id="pro-wrapper" className="container">
                        <div>
                            <div className="statistic">
                                <div className="formTitle">
                                    {title.map(function(item,index){
                                        return <div key={index} data-type={item.className} className={_this.state.titleType==item.className?"selected 1":"1"} onClick={_this.changeTitle}>{item.value}</div>
                                    })}
                                </div>
                                <div className="tabPanelContainer">
                                    {content}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
    },
    changeTitle:function(e){
        var type=e.target.dataset.type;
        this.setState({
            titleType:type,
        });
    },
    getFormTitle:function(){
        var _this=this;
        var type=[];
        var typeCount=0;
        custormDataMode.getCustormData(this.tid, null, null, 'find',
        (data) => {
            if(! this.mounted){
                return;
            }
                    var maxData={};
                    if( !data[0] ) return;
                    var currentLength=0;
                    var length=0;
                    delete data[0].attributes.cd_radio;
                    delete data[0].attributes.cd_checkbox;
                    for(var item in data[0].attributes){
                            currentLength++;
                        }
                    maxData=data[0];
                    for(var i=0;i<data.length;i++){
                        delete data[i].attributes.cd_radio;
                        delete data[i].attributes.cd_checkbox;
                        for(var item in data[i].attributes){
                            length++;
                        }
                        if(length>currentLength){
                            maxData=data[i];
                        }
                        length=0;
                    }
                    delete maxData.attributes.cd_tplid;
                    delete maxData.attributes.cd_userhead;
                    delete maxData.attributes.cd_userid;
                    delete maxData.attributes.cd_radio;
                    delete maxData.attributes.cd_checkbox;
                    for(var item in maxData.attributes){
                        type.push(item);
                        typeCount++;
                    }
                    UserService.QueryFormCountByTpl(this.tid,this.uid,"","",function(data){
                        if(!_this.mounted){
                            return;
                        }
                        $(".dataCount .count").text(data);
                        _this.setState({
                            data:{
                                dataType:type,
                                dataTypeCount:typeCount,
                                dataCount:data,
                                dataPageCount:Math.ceil(data/10),
                                runTime:Math.ceil(data/900),
                                tid:_this.tid
                            }
                        })
                        _this.forceUpdate();
                    })
                },
        () => {
            })
    },
    getTplFb:function(){
        var dataChartOptions=[],dataChartStore={},_this=this;
        tpl.getByTid(function(data){
            if( !this.mounted){
                return;
            }
            var crumbTitle=data[0].attributes.name;
            dataChartOptions=eval('('+data[0].attributes.tpl_fbcollect+')');
            if(dataChartOptions!=undefined){
                if(dataChartOptions.hasOwnProperty("radio")){
                    dataChartStore.cd_radio={};
                    for(var i=0;i<dataChartOptions.radio.content.length;i++){
                        var radioContent=dataChartOptions.radio.content[i];
                        dataChartStore.cd_radio[radioContent]=0;
                    }
                }if(dataChartOptions.hasOwnProperty("checkbox")){
                    dataChartStore.cd_checkbox={};
                    for(var i=0;i<dataChartOptions.checkbox.content.length;i++){
                        var checkboxContent=dataChartOptions.checkbox.content[i];
                        dataChartStore.cd_checkbox[checkboxContent]=0;
                    }
                }
            }
            _this.setState({
                chart:dataChartStore,
                chartOptions:dataChartOptions,
                crumb:crumbTitle
            });
            _this.forceUpdate();
        },this.tid)
    }
})
module.exports=form;
