/**
 * @description 在线阅读条目页面
 * @time 2016-11-2
 * @author fisnYu
 */

'use strict';

//require core module
var React = require('react');
import {Link} from 'react-router';

//require style
require('./myBookrankRecord.css');
//默认封面图片
var recordDefault = require('../../../../assets/images/user/record-default.png'); 
/**
 * 在线阅读条目页面
 */
export default class MyBookrankRecord extends React.Component{
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
        var corverImg = record.record.cover_img || recordDefault;
        //取掉后缀名称
        var name = record.record.uf_name;
        var fileName = name.substring(0, name.lastIndexOf('.'));    //去掉后缀名称如.doc  .docx
        var _className = "unShelve";
        // unDelete  不可删除的样式   下架的样式 unShelve 上架的样式 shelve <span id="hover-preview-mask" onClick={this.onShowPreviewHandler.bind(this)}>预览</span>
        return (
            <li className="my-bookrank-item">
                <div className="my-bookrank-item-left" style={{"backgroundImage": `url('${corverImg}')`}}>
                    <Link id="my-bookrank-preview-mask" to={'/BookPreview/' + record.record.hashcode} target="_blank" >预览</Link>
                </div>
                <div className="my-bookrank-item-right">
                    <div className="my-bookrank-item-name .text-nowrap"> {fileName}</div>
                    <div className="my-bookrank-item-author text-nowrap">{"作者：(美)尼尔·唐纳德·沃"}</div>
                    <Link className="my-bookrank-item-read" to={'/BookPreview/' + record.record.hashcode} target="_blank">{"阅读50%"}</Link>
                    <div className="my-bookrank-item-option">
                        <a href="javascript:;"  title="移动栏目" onClick={this.onMoveProgramaHandler.bind(this)}>移动书架</a>
                        <a href="javascript:;" className="unDelete" title="删除书籍" onClick={this.onRemoveBookHandler.bind(this)}>删除书籍</a>
                    </div>
                </div>
            </li>
        );
    }

    /**
     * 移动栏目的具体实现函数
     */
    onMoveProgramaHandler(evt){
        evt.preventDefault();
        evt.stopPropagation();
        const {record} = this.props;
        var fileHash = record.record.hashcode;
        console.log("onMoveProgramaHandler");
    }

    /**
     * 上架或者下架的具体处理函数
     */
    onShelveOrUnShelveHandler(evt){
        evt.preventDefault();
        evt.stopPropagation();
        const {record} = this.props;
        var fileHash = record.record.hashcode;
        console.log("onShelveOrUnShelveHandler");
    }

    /**
     * 替换单条记录的封面
     */
    onRemoveBookHandler(evt){
        evt.preventDefault();
        evt.stopPropagation();
        var self = this;
        const {record} = this.props;
        var fileHash = record.record.hashcode;
        console.log("onRemoveBookHandler");
    }
};