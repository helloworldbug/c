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
import {Link} from 'react-router';
import _ from 'lodash';

//require submodule
var DataProcessingInput= require('./dataProcessingInput.jsx');   //文件输入组件
var DataProcessingItems= require('./dataProcessingItems.jsx');   //文件条目组件

/**
 * 一键出版上传文件页面
 */
export default class DataProcessingUpload extends React.Component{
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    /**
     *渲染转换文件条目
     */
    renderItemsSection(){
        const {items} = this.props;
        return (<DataProcessingItems items={items} updateItem={this.props.updateItem.bind(this)}  showFeedback={this.props.showFeedback.bind(this)}  
        downloadItems={this.props.downloadItems.bind(this)} deleteItem={this.props.deleteItem.bind(this)} showPreview={this.props.showPreview.bind(this)}/>);
    }
    /**
     *渲染界面
     */
    render() {
        return (
            <div className="data-processing-upload-container">
                <DataProcessingInput addItems={this.props.addItems.bind(this)} />
                {this.renderItemsSection()}
                <div className="data-processing-upload-bottom"></div>
            </div>
        );
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