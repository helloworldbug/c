/**
 * @description 一键出版上传文件条目页面
 * @time 2016-11-8
 * @author fisnYu
 */

'use strict';
//require owner style
require("./dataProcessingUpload.css");
//require core module
var React = require('react');
import {Link} from 'react-router';
import _ from 'lodash';

var DataProcessingItem= require('./dataProcessingItem.jsx');   //文件条目组件
const FOUR = 4;     //转档完成状态
var serverurl = require("../../config/serverurl");
/**
 * 一键出版上传文件条目页面
 */
export default class DataProcessingItems extends React.Component{
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
    renderItemSection(){
        const {items} = this.props;
        if(items.length < 1){
            return null;
        }else{
            var itemsDom =  _.map(items, (item, index) => <DataProcessingItem itemIndex={index} key={items.length-index} item={item} 
                updateItem={this.props.updateItem.bind(this)} deleteItem={this.props.deleteItem.bind(this)} downloadItem={this.props.downloadItems.bind(this)} 
            showPreview={this.props.showPreview.bind(this)}/>);
            return (
                <ul className="data-processing-items">
                    {itemsDom}
                </ul>
            );
        }
        
    }
    /**
     *渲染界面
     */
    render() {
        const {items} = this.props;
        var hideStyle = items.some(item => item.code == 4) ?  {} : {display: "none"};       //没有转档完成的 不显示下载按钮
        return (
            <div className="data-processing-items-container">
                {this.renderItemSection()}
                <div className="data-processing-items-bottom">
                    <span>注意 ：系统仅保留30天以内的&nbsp;&nbsp;<a href="/user/tab/20" target="_blank">转档文件</a>&nbsp;，转档完成后请尽快下载保存！</span>
                    {/*<div className="data-processing-feedback">转档中遇到问题，<span onClick={this.props.showFeedback.bind(this)}>反馈给我们</span></div>*/}
                    <div className="data-processing-feedback">有疑问请参考&nbsp;&nbsp;
                    <span onClick={this.onDownloadDemoHandler.bind(this)}>转档样例</span>&nbsp;&nbsp;或&nbsp;&nbsp;<span className="processing-feedback" 
                    onClick={this.props.showFeedback.bind(this)}>反馈问题</span></div>
                    <div className="data-processing-download" style={hideStyle} onClick={this.onDownloadAllDataHandler.bind(this)}>全部下载</div>
                </div>
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

    /**
     * 下载转档文件
     */
    onDownloadAllDataHandler(evt){
        evt.preventDefault();
        evt.stopPropagation();
        const {items} = this.props;
        //过滤只是转档完成的才执行下载
        const findItems = items.filter(item => item.code == FOUR);   
        var fileHashs = findItems.map(item => item.fileHash);
        if(fileHashs.length > 0){
            console.log("downloadAlll");
            //1、显示下载框
            this.props.downloadItems(fileHashs);
        }
        
    }
    /**
     * 下载样例
     */
    onDownloadDemoHandler(evt){
        evt.preventDefault();
        evt.stopPropagation();
        console.log("开始下载样例");
        var url = "/v1/transfer/platform/downloads"
        var server = serverurl.convertApi; //serverurl.convertApi;
        window.open(server + "" + url);
    }
};