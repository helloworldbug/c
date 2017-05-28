/**
 * @description 转档分组页面
 * @time 2016-12-1
 * @author fisnYu
 */

'use strict';

//require core module
var React = require('react');
import {Link} from 'react-router'
var Base = require('../../../utils/Base');
const groupType = ["分组", "书架", "栏目"];   //为了通用
const DefaultName = "def";  //默认值
//require style
require('./convertRecords.css');
/**
 * 在线转换页面
 */
export default class ConvertGroup extends React.Component{
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.state = {
            currentIndex : 0  //默认中的标签
        };
    }
    /**
     *渲染追加项
     */
    renderTitleSection(){
        // var _className =  this.state.currentIndex == 0 ? "convert-group-item group-item-selected" : "convert-group-item";
        var _className =  this.props.currentGroup == "" ? "convert-group-item group-item-selected" : "convert-group-item";
        return (
            <li className={_className} onClick={this.onFilterRecordsHandler.bind(this, "", 0)} key={0}>
                {"全部"} <span className="group-item-bubble">({this.getFilterRecordsByName("").length})</span>
            </li>
        );
    }
    /**
     *渲染子选项
     */
    renderItemSection(items){
        return(
            items.map((item, index) => {
                var _index = items.length - index;
                // var _className =  this.state.currentIndex == _index ? "convert-group-item group-item-selected" : "convert-group-item";
                var _name = index == 0 ? DefaultName : item;
                var _hideStyle = index == 0 ? {display : "none"} : {}
                var _className =  this.props.currentGroup == _name ? "convert-group-item group-item-selected" : "convert-group-item";
                return (
                    <li className={_className} onClick={this.onFilterRecordsHandler.bind(this, _name, _index)} key={_index} title={item}>
                        {item} <span className="group-item-bubble">({this.getFilterRecordsByName(_name).length})</span>
                        <span className="group-item-delete" style={_hideStyle} onClick={this.onDeleteItemHandler.bind(this, _name)}></span>
                    </li>
                );
            })
        );
    }
    /**
     *渲染追加项
     */
    renderAddSection(items){
        if(items.length > 8){
            return null;
        }else{
            return(
                <li className={"convert-group-item add-group-item"} onClick={this.onAddItemHandler.bind(this)} >新建{groupType[this.props.groupType]}</li>
            );
        }
    }
    /**
     *渲染界面
     */
    render() {
        const {items} = this.props;
        return (
            <ul>
                {this.renderTitleSection()}
                {this.renderItemSection(items)}
                {this.renderAddSection(items)}
            </ul>
        );
    }
    /**
     * 根据组名获取该组中文档的个数
     */
    getFilterRecordsByName(name){
        const {records} = this.props;
        if(!name) return records;
        var _records =  records.filter((record, index) => {
            var _name = record.record.classification || DefaultName;
            return _name == name;
        });
        return _records;
    }
    /**
     * 按照当前分组筛选转档记录
     * @param name 分组名称
     */
    onFilterRecordsHandler(name, index, evt){
        evt.preventDefault();
        evt.stopPropagation();
        //切换选中状态
        // this.setState({currentIndex : index});
        //实行筛选
        this.props.filterRecords(name);
    }

    /**
     * 删除当前分组
     * @param name 分组名称
     */
    onDeleteItemHandler(name, evt){
        evt.preventDefault();
        evt.stopPropagation();
        var _records = this.getFilterRecordsByName(name);
        var _fileHashs = _records.map((record, index) => {
            return record.record.hashcode;
        });
        console.log(_fileHashs);
        this.props.deleteGroupItem(name, _fileHashs, evt);
    }

    /**
     * 添加分组
     */
    onAddItemHandler(evt){
        evt.preventDefault();
        evt.stopPropagation();
        this.props.addGroupItem(evt);
    }
};