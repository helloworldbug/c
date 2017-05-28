/**
 * @description 个人中心组件--采集设置
 * @time 2017-04-20
 * @author gli-cq-gonglong
 */

'use strict';

// require core module
var React = require('react'),
    ReactDOM=require("react-dom"),
    $ = require('jquery'),
    Base = require('../../utils/Base');

// require children component
//var Input = require('../Common/Input');

// require common mixins 
// var GlobalFunc = require('../Common/GlobalFunc');

var defaultSetting = {
    isAutoCollect: false, // {boolean} 是否自动采集, true: 是, false: 否
    sourceSite: "", // {String} 内容采集来源, e.g "http://www.gli.com"
    time: "00", // {String} 自动采集开始时间, 24小时制, 默认 '00'
    isAutoCompose: true, // {boolean} 是否自动合成作品, true: 是, false: 否
};
// define CollectionSetting component
var CollectionSetting = React.createClass({
 

    getInitialState() {
        
      return  defaultSetting
    },
    componentDidMount: function (nextProps) {
        // React DOM载入完毕,初始化默认值
        // 是否自动采集
      
        $("#isAutoCollect-"+ ((this.state.isAutoCollect)? "1":"0") ).attr("checked", true);
        $("#source_site").val(this.state.sourceSite);
        $("#isAutoCompose-"+ ((this.state.isAutoCompose)? "1":"0") ).attr("checked", true);
    },
    
    render: function () {
        
        // {display: "none"}, {visibility: "hidden"}
        var isHide = (this.state.isAutoCollect) ? { } : {visibility: "hidden"};
        
         return (
         <div className="authorized gli-warehouse">
            <div className="title">
                <span>采集设置</span>
            </div>
            <div className="content clearfix ">
                <div className="setting-item"> 
                    <div className="item-name">
                        <span>是否自动采集:</span>
                    </div>
                    <div className="item-context">
                    <label htmlFor="isAutoCollect-1">是<input id="isAutoCollect-1" onChange={this.handleChangeAutoCollect.bind(null,this)} type="radio" name="isAutoCollect" value="1" /></label>
                    <label htmlFor="isAutoCollect-0">否<input id="isAutoCollect-0" onChange={this.handleChangeAutoCollect.bind(null,this)} type="radio" name="isAutoCollect" value="0" /></label>
                    </div>
                </div>
                
                <div className="setting-item" style={isHide}> 
                    <div className="item-name" id="setting_setting_time">
                        <span>输入内容采集来源:</span>
                    </div>
                    <div className="item-context">
                        <input id="source_site" onBlur={this.handleBlurSource.bind(null,this)} placeholder="http://www.gli.com" />
                    </div>
                </div>
                
                <div className="setting-item" style={isHide}> 
                    <div className="item-name">
                        <span>设置自动采集时间:</span>
                    </div>
                    <div className="item-context"> 
                        <select id="setting-time" value={this.state.time} onChange={this.handleChangeAutoTime.bind(null,this)} >
                            <option value="00">每天00:00开始采集</option>
                            <option value="01">每天01:00开始采集</option>
                            <option value="02">每天02:00开始采集</option>
                            <option value="03">每天03:00开始采集</option>
                            <option value="04">每天04:00开始采集</option>
                            <option value="05">每天05:00开始采集</option>
                            <option value="06">每天06:00开始采集</option>
                            <option value="07">每天07:00开始采集</option>
                            <option value="08">每天08:00开始采集</option>
                            <option value="09">每天09:00开始采集</option>
                            <option value="10">每天10:00开始采集</option>
                            <option value="11">每天11:00开始采集</option>
                            <option value="12">每天12:00开始采集</option>
                            
                            <option value="13">每天13:00开始采集</option>
                            <option value="14">每天14:00开始采集</option>
                            <option value="15">每天15:00开始采集</option>
                            <option value="16">每天16:00开始采集</option>
                            <option value="17">每天17:00开始采集</option>
                            <option value="18">每天18:00开始采集</option>
                            <option value="19">每天19:00开始采集</option>
                            <option value="20">每天20:00开始采集</option>
                            <option value="21">每天21:00开始采集</option>
                            <option value="22">每天22:00开始采集</option>
                            <option value="23">每天23:00开始采集</option>
                        </select>
                    </div>
                </div>
                
                <div className="setting-item" style={isHide}> 
                    <div className="item-name">
                        <span>采集后是否自动合成作品:</span>
                    </div>
                    <div className="item-context">
                        <label htmlFor="isAutoCompose-1">是<input onChange={this.handleChangeAutoCompose.bind(null,this)} id="isAutoCompose-1" type="radio" name="isAutoCompose" value="1" /></label>
                        <label htmlFor="isAutoCompose-0">否<input onChange={this.handleChangeAutoCompose.bind(null,this)} id="isAutoCompose-0" type="radio" name="isAutoCompose" value="0" /></label>
                    </div>
                </div>
                
                <div className="setting-item" style={isHide} > 
                    <input id='setting_ok_btn' onClick={this.handleClickConfirm.bind(null,this) }  className="comm-btn clearfix" type="button" value="确定" style={{margin:'0 auto'}} />
                </div>
                
            </div>
         </div>
         );
    },
    
    /**
     * 点击[确定]按钮，上传用户设置的 采集参数.
     *
     */
     handleClickConfirm:function(){
         
         var hostUrl = $("#source_site").val();
         this.setState({sourceSite:hostUrl});
         // TODO -- 调用后台接口，传递参数.
         console.log("[采集设置]-》确认:" + JSON.stringify(this.state) );
         
         // 参数(内容来源) 非空检查;
         // 成功--提示信息--重置状态
         // 失败--提示信息;
     },
     
    /**
     * 点击[是否自动采集]按钮, 保存期状态.
     *
     */
     handleChangeAutoCollect:function(obj,event){
         
         var stateKey = event.target.name;
         var value = parseInt(event.target.value, 10);
       
         this.setState({ isAutoCollect: !!value });
     },
     
    /**
     * 选择[自动采集时间]按钮, 保存期状态.
     *
     */
     handleChangeAutoTime:function(obj,event){
         
         var stateKey = event.target.name;
         var value = event.target.value;
         this.setState({ time: value });
         
     },
     
    /**
     * 点击[采集后是否自动合成作品]按钮, 保存期状态.
     *
     */
     handleChangeAutoCompose:function(obj,event){
         
         var stateKey = event.target.name;
         var value = parseInt(event.target.value, 10);
       　
         this.setState({ isAutoCompose: !!value });
         
     },
     
    /**
     * 焦点移出[内容采集来源]输入框时, 保存期状态.
     *
     */
     handleBlurSource:function(obj,event){
         var value = event.target.value;
         this.setState({ sourceSite: value });
     }
});

// export CollectionSetting component
module.exports = CollectionSetting;
