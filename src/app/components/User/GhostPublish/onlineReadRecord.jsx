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
require('./onlineReadRecord.css');
//默认封面图片
var recordDefault = require('../../../../assets/images/user/record-default.png'); 
/**
 * 在线阅读条目页面
 */
export default class OnlineReadRecord extends React.Component{
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
            <li className="online-read-item">
                <div className="online-read-item-left" style={{"backgroundImage": `url('${corverImg}')`}}>
                    <Link id="hover-preview-mask" to={'/BookPreview/' + record.record.hashcode} target="_blank" >预览</Link>
                </div>
                <div className="online-read-item-right">
                    <div className="online-read-item-name"> {fileName}</div>
                    <div className="online-read-item-author">{"作者：(美)尼尔·唐纳德·沃"}</div>
                    <div className="online-read-item-brief">{"《与神对话》是2015年在江西人民出版社出版的图书，《与神对话》是2015年在江西人民出版社出版的图书，《与神对话》是2015年在江西人民出版社出版的图书，该书作者是（美）尼尔·唐纳德·沃尔什，该书作者是（美）尼尔·唐纳德·沃尔什，该书作者是（美）尼尔·唐纳德·沃尔什，该书作者是（美）尼尔·唐纳德·沃尔什，译者是李继宏。 作者在书中提出了各种作者在书中提出了各种作者在书中提出了各种作者在书中提出了各种"}</div>
                    <div className="online-read-item-option">
                        <a href="javascript:;" className="shelve"  title="上架" onClick={this.onShelveOrUnShelveHandler.bind(this, "shelve")}>上架</a>
                        <a href="javascript:;"  title="移动栏目" onClick={this.onMoveProgramaHandler.bind(this)}>移动栏目</a>
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
        this.props.movePrograma(fileHash, evt);
    }

    /**
     * 上架或者下架的具体处理函数
     * @param ｛string|data｝表示上架或者下架，shelve  unshelve
     */
    onShelveOrUnShelveHandler(data, evt){
        evt.preventDefault();
        evt.stopPropagation();
        const {record} = this.props;
        //上架或者下架
        this.props.shelveOrUnShelve(data, record);
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
        this.props.removeBoook(fileHash, evt);
        console.log("onRemoveBookHandler");
    }
};