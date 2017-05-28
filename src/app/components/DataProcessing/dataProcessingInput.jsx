/**
 * @description 一键出版上传文件页面
 * @time 2016-11-7
 * @author fisnYu
 */

'use strict';
//require owner style
require("./dataProcessingUpload.css");
//require core module
var React = require('react');
var ReactDOM = require("react-dom");
import {Link} from 'react-router';
import _ from 'lodash';

/**
 * 一键出版上传文件页面
 */
export default class DataProcessingInput extends React.Component{
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.state = {
            isChange : true
        }
    }
    
    /**
     *渲染界面
     */
    render() {
        //accept='.doc, .docx'
        return (
            <div className="data-processing-input-container">
                <figure className="data-processing-input-icon"></figure>
                <span>拖拽doc、docx格式文档到这里进行转档</span>
                <span><small>一次最多上传10个文件,每个最大为500MB</small></span>
                <input type="file" multiple  ref="uploadFile" accept='.doc, .docx' onChange={this.changeFileHandler.bind(this)}   
                onDrop={this.dropFileHandler.bind(this)}  onDragOver={this.onDragOverFileHandler.bind(this)} /> 
            </div>
        );
    }
    /**
     *选择文件，处理函数
     */
    changeFileHandler(evt){
        evt.stopPropagation();
        var files = evt.target.files
        var uploadFile = ReactDOM.findDOMNode(this.refs.uploadFile); 
        this.props.addItems(files);
        //延迟一段事件清楚内容
        setTimeout(() => {uploadFile.value = "";}, 200);
        
    }
    /**
     *拖拽事件，处理函数
     */
    dropFileHandler(evt){
        evt.stopPropagation();
        evt.preventDefault();
        var files = evt.dataTransfer.files;
        this.props.addItems(files);
    }
    /**
     *拖拽过程中事件
     */
    onDragOverFileHandler(evt){
        evt.stopPropagation();
        evt.preventDefault();
        //把默认的复制变成移动
        evt.dataTransfer.dropEffect = "move";
    }
    /**
     *装载组件的时候
     */
    componentDidMount(){
    }
    /**
     *卸载组件的时候
     */
    componentWillUnmount() {
    }

};