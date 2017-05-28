/**
 * @description 通用对话页面
 * @time 2016-12-1
 * @author fisnYu
 */

'use strict';

//require core module
var React = require('react');
import {Link} from 'react-router'
var Base = require('../../../utils/Base');

//require style
require('./commonDialog.css');
/**
 * 通用对话页面
 */
const ZERO = 0;   //0：表示普通的确认框
const FIRST = 1;  //1：表示普通的确认框
const SECOND = 2; //2：表示输入的对话 
const THREE = 3;   //3: 表单选
const FOUR = 4 ;  //4: 表示多选

export default class CommonDialog extends React.Component{
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.state = {
            isShow : this.props.isShow,     //是否显示
            errorMsg : "",      //错误信息
            returnedValue : "",       //当类型为 单选，选中的值, 或者输入框输入的值
            returnedValues : []  //当类型为 多选选，选中的值     后期预留
        };
    }
    /**
     *渲染内容选项
     */
    renderContentSection(){
        const {content,type} = this.props;
        var _contentDom = null;
        switch (type) {
            case ZERO :
            case FIRST:
                _contentDom = <div className="dialog-text-wrap">{content[0]}</div>
                break;
            case SECOND:
                _contentDom = <div className="dialog-input-wrap">
                                <span>{content[0]}</span> <span className={"err"}>{this.state.errorMsg}</span>
                                <input type="text" value={this.state.returnedValue} onBlur={this.onBlurHandler.bind(this)} onChange={this.onChangeInputHandler.bind(this)}/>
                            </div>
                break;
            case THREE :
                _contentDom = content.map((item, index) => {
                    var _name = index == 0 ? "" : item;
                    var _checked = this.state.returnedValue == _name ? true : false;
                    var _index = content.length - index;
                    return (
                        <div key={_index} className="dialog-raido-wrap">
                            <input type="radio" id={_index+""} name="group-item-radio" checked={_checked}  maxLength="6" value={_name} onChange={this.onRadioChangeHadnler.bind(this)} />
                            <label htmlFor={_index + ""} title={item}>{item}</label>
                        </div>
                    );
                });
                break;
        }
        return (_contentDom);
    }
    /**
     *渲染界面
     */
    render() {
        return this.state.isShow ? (
            <div className="convert-common-dialog-container">
                <div ref="commonDialogWrap" className="convert-common-dialog-wrap">
                    <div className="convert-common-dialog-content">
                        {this.renderContentSection()}
                    </div>
                    <div className="convert-common-dialog-bottom">
                        <a href="javascript:;" className="convert-common-dialog-button" style={{"float" : "left"}}
                        onClick={this.onOkHandler.bind(this)}>确 定</a>
                        <a href="javascript:;" className="convert-common-dialog-button" style={{"float" : "right"}} 
                        onClick={this.onCancelHandler.bind(this)}>取 消</a>
                    </div>
                </div>
            </div>
        ) : null;
    }
    componentDidMount(){
        //重新定位点击坐标
        const { position } = this.props;
        var _dom = this.refs.commonDialogWrap;
        var _left = (position[0] - $(_dom).outerWidth(true) / 2) + "px"; //TODO 需要减去宽度的一半
        var _top = (position[1] + 20 ) + "px";      //为了 优化 下移20个像素
        var _style = {
            "left" : _left,
            "top" : _top
        }
        $(_dom).css(_style);
    }
    onBlurHandler(evt){
        var name = evt.target.value;
        //过滤空格
        name = name.trim();
        var msg = "";
        if(name.length > 6){
            msg = "*长度不能超出6个";
        }
        var customType = this.props.customType; //自定义标签的时候
        var customLabels = this.props.customLabels || [];
        var groupNames = customType ? customLabels : (this.props.groupNames || []);
        var _errMsg = customType ? "*标签名称不能重复" : "*分组名称不能重复";
        if(groupNames.indexOf(name) > -1){
            msg = _errMsg;
        }
        //设置选择的值
        this.setState({
            returnedValue : name,
            errorMsg : msg
        });
    }
    /**
     * 按照当前分组筛选转档记录
     * @param name 分组名称
     */
    onChangeInputHandler(evt){
        evt.preventDefault();
        evt.stopPropagation();
        var name = evt.target.value;
        //过滤空格
        name = name.trim();
        //设置选择的值
        this.setState({
            returnedValue : name,
            errorMsg : ""
        });
        
    }
    /**
     * 按照当前分组筛选转档记录
     * @param name 分组名称
     */
    onRadioChangeHadnler (evt) {
        evt.stopPropagation();
        var name = evt.target.value;
        name = name.trim();
        this.setState({returnedValue : name});
    }
    /**
     * 成功回调
     * @param evt 事件名称
     */
    onOkHandler (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if(this.props.type > FIRST){   //2, 3 的时候返回值  customType表示自定义类型，添加输入框 需要
            if(this.props.type == SECOND){
                var customType = this.props.customType; //自定义标签的时候
                var customLabels = this.props.customLabels || [];
                var groupNames = customType ? customLabels : (this.props.groupNames || []);
                if(this.state.returnedValue.length > 6 || groupNames.indexOf(this.state.returnedValue) > -1){
                    //设置选择的值
                    return ;
                }
            }
            this.props.cbOk(this.state.returnedValue, this.props.customType);
        }else{
            this.props.cbOk();
        }
        //隐藏显示框
        this.setState({
            isShow : false,
            returnedValue : ""
        });
    }

    /**
     * 取消事件
     * @param evt 事件名称
     */
    onCancelHandler (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.props.cbErr();
        //隐藏显示框
        this.setState({
            isShow : false,
            returnedValue : ""
        });
    }
};