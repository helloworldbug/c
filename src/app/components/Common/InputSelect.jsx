/**
 * @description 输入下拉框
 * @date 2016 7/7
 * @author zhao
 **/

'use strict';

// require core module
var React = require('react');
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';

// define inputSelect
var InputSelect = React.createClass({
    /**
     * 默认值
     * @returns {{}}
     */
    getInitialState: function () {
        return {value:this.props.value || ""}
    },

    propTypes : {
        //组件样式
        className : React.PropTypes.string,
        //选项值
        options : React.PropTypes.array,
        //组件的值
        value : React.PropTypes.string,
        //input type
        type : React.PropTypes.string,
        //外部监听值改变事件
        onChange : React.PropTypes.func,
        onBlur : React.PropTypes.func
    },

    /**
     * 输入框内容改变事件
     * @param e
     */
    onChangeHandler : function(e){
        var value = e.target.value;
        //改变显示的值
        this.setState({value : value});
        //通知外部改变
        this.props.onChange&& this.props.onChange(value);
        this.props.onSelect&& this.props.onSelect(value);
    },

    /**
     * select 选择器改变事件
     * @param e
     */
    onChangeSelectHandler : function(value){
        //改变显示的值
        this.setState({value : value});
        //通知外部改变
        this.props.onChange&&this.props.onChange(value);
    },

    /**
     * 输入框失去焦点事件
     */
    onBlurHandler : function(e){
        this.props.onBlur(e);
    },

    /**
     * 外部属性改变时执行
     */
    componentWillReceiveProps : function(nextProps){
        this.setState({value : nextProps.value});
    },
    /**
     * 选中时触发
     * @param event
     */
    onSelectHandler:function(value){
        //console.log("select",event.srcElement);
        this.props.onSelect&&this.props.onSelect(value)
    },
    render : function (){
        var {wrapperProps,selectProps}=this.props;
        if(selectProps ===undefined)selectProps={}
        if(wrapperProps ===undefined)wrapperProps={}
        //选项值
        var opts = this.props.options;
        var options = opts.map(function(value, index){
            if(typeof value=="object"){
                return <Option key={index} value={''+value.value}>{value.label}</Option>;
            }else{
                return <Option key={index} value={''+value}>{value}</Option>;
            }
        });
       if(wrapperProps.className){
           wrapperProps.className+=" select-sim"
       }else{
           wrapperProps.className="select-sim"
       }

        var type = this.props.type || "";
        return (
            <div {...wrapperProps}>
                <Select {...selectProps}   notFoundContent="" onChange={this.onChangeSelectHandler} onSelect={this.onSelectHandler} value={''+this.state.value}>
                    {options}
                </Select>
                <input value={this.state.value} onChange={this.onChangeHandler}  onBlur={this.onBlurHandler} />
            </div>
        );
    },
});

// export InputSelect component
module.exports = InputSelect;
