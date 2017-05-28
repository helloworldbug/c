/**
 * @description 在线转换
 * @time 2016-11-2
 * @author fisnYu
 */

'use strict';

//require core module
var React = require('react');
import {Link} from 'react-router';

//require style
require('./convertRecords.css');
const CONVERT_TYPE_ARR = ['EPUB3', 'MOBI'];
const CONVERT_STATUS_ARR = {        //后续需要增加状态对应信息
    "transfer_success" : "转档完成"
};
//默认封面图片
var recordDefault = require('../../../../assets/images/user/record-default.png'); 
/**
 * 在线转换页面
 */
export default class ConvertRecord extends React.Component{
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
    }
    /**
     *渲染界面
     */
    render() {
        const {record} = this.props;
        var outFiles = (record.record.out_files&&record.record.out_files.length > 1) ? record.record.out_files : CONVERT_TYPE_ARR;
        var corverImg = record.record.cover_img || recordDefault;
        // corverImg = corverImg ? corverImg + "?" + Date.now() : recordDefault;   //预防浏览器缓存
        // var convertType = outFiles.join("、");  
        var frontStatus = record.record.front_statuss;  //转档记录的前端显示状态数组，
        var convertType = CONVERT_STATUS_ARR[frontStatus[frontStatus.length - 1].progress];  
        var size = record.record.tf_size;
        var sizeStr = "";
        var time = record.record.tf_end_at;
        time = this.getDateString(time, "yyyy-MM-dd HH:mm");
        if(size > (1024 * 1024 *1024)){
            sizeStr = (Math.round(size * 100 / (1024 * 1024 * 1024)) / 100).toString() + 'GB';
        }else if (size > 1024 * 1024){
            sizeStr = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
        }else{
            sizeStr = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
        }   
        //取掉后缀名称
        var name = record.record.uf_name;
        var fileName = name.substring(0, name.lastIndexOf('.'));    //去掉后缀名称如.doc  .docx  <span className="hover-preview-mask" onClick={this.onShowPreviewHandler.bind(this)}>预览</span>
        return (
            <li className="convert-record-item">
                <div className="convert-records-title-name text-nowrap">
                    <input type="checkbox" checked={record.isSelected} onChange={this.onSelectRecordHandler.bind(this)} />
                    <span className="convert-record-cover" style={{"backgroundImage": `url('${corverImg}')`}}></span> 
                    <span className="hover-preview-mask" onClick={this.onShowPreviewHandler.bind(this)}>内容确认</span>
                    <span  className="convert-record-item-name" title={fileName}>{fileName}</span>
                </div>
                <span className="convert-records-title-time text-nowrap">{time}</span>
                <span className="convert-records-title-type text-nowrap" title={convertType}>{convertType}</span>
                <span className="convert-records-title-size text-nowrap">{sizeStr}</span>
                <span className="convert-records-title-option text-nowrap">
                    <a href="javascript:;" className="replace-cover" onClick={this.onReplaceCoverHandler.bind(this)} title="替换封面"></a>
                    <a href="javascript:;" className="download" onClick={this.onDownloadDataHandler.bind(this)} title="下载"></a>
                    <a href="javascript:;" className="delete" onClick={this.onDeleteRecordHandler.bind(this)} title="删除"></a>
                </span>
            </li>
        );
    }

    /**
     * 选中单条记录的开关控制事件
     */
    onSelectRecordHandler(){
        const {recordIndex} = this.props;
        this.props.updateRecord(recordIndex);
    }
    /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * 例子：
     * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    */
    getDateString(date, format) {
        var t = new Date(date);
        var tf = function (i) { return (i < 10 ? '0' : '') + i };
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
            switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                    // break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    // break;
                case 'mm':
                    return tf(t.getMinutes());
                    // break;
                case 'dd':
                    return tf(t.getDate());
                    // break;
                case 'HH':
                    return tf(t.getHours());
                    // break;
                case 'ss':
                    return tf(t.getSeconds());
                    // break;
            }
        });
    }

    /**
     * 在线预览转档文件
     */
    onShowPreviewHandler(evt){
        evt.preventDefault();
        evt.stopPropagation();
        const {record} = this.props;
        var fileHash = record.record.hashcode;
        this.props.showPreview(fileHash);
        console.log("showpreview");
    }

    /**
     * 下载转档文件
     */
    onDownloadDataHandler(evt){
        evt.preventDefault();
        evt.stopPropagation();
        const {record} = this.props;
        var fileHash = record.record.hashcode;
        this.props.downloadRecord(fileHash);
    }

    /**
     * 删除单条记录
     */
    onDeleteRecordHandler(evt){
        evt.preventDefault();
        evt.stopPropagation();
        const {record} = this.props;
        var fileHash = record.record.hashcode;
        this.props.deleteRecord(fileHash, evt);
    }

    /**
     * 替换单条记录的封面
     */
    onReplaceCoverHandler(evt){
        evt.preventDefault();
        evt.stopPropagation();
        var self = this;
        const {record} = this.props;
        var fileHash = record.record.hashcode;
         //确定回调
        $("#croped-img-url").unbind("finished").on("finished", function (event, data) {
            self.props.replaceCover(fileHash, data, evt);
        });
        $("#publish-info-uploadFile").find("input").trigger("click", [{width : 600, height: 800}]);
    }
};