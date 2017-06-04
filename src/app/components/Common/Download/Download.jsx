/**
 * @description 一键出版的下载通用页面
 * @time 2016-11-10
 * @author tony
 **/
'use strict';

// require core module
var React = require('react');

var DownloadItem = require('./Downloadtem.jsx');

// require style
require('./Download.css');

// require image
var htmlLogo = require('../../../../assets/images/dataProcessing/html.png');
var xmlLogo = require('../../../../assets/images/dataProcessing/xml.png');
var mobiLogo = require('../../../../assets/images/dataProcessing/kindle.png');
var readerLogo = require('../../../../assets/images/dataProcessing/reader.png');
var qqLogo = require('../../../../assets/images/dataProcessing/qq.png');
var pdfLogo = require('../../../../assets/images/dataProcessing/pdf.png');
var weixinLogo = require('../../../../assets/images/dataProcessing/weixin.png');


const DOWNLOAD_TYPES = {
    HTMLS : {
        type : "htmls",
        name : "html",
        logo : htmlLogo,
        isPremium : false,  //  是否收费
        charge : 0,
        isOpen : true       //是否开放
    },
    XML : {
        type : "xml",
        name : "xml数据",
        logo : xmlLogo,
        charge : 0,
        isOpen : true       //是否开放
    },
    MOBI : {
        type : "mobi",
        name : "for kindle(mobi)",
        logo : mobiLogo,
        isPremium : false,  //  是否收费
        charge : 0,
        isOpen : true       //是否开放
    },
    EQUB_QQ : {
        type : "epub3",
        name : "for QQ阅读(EPub)",
        logo : qqLogo,
        isPremium : false,  //  是否收费
        charge : 0,
        isOpen : true       //是否开放
    },
    EQUB_ZHANGYUE : {
        type : "epub3",
        name : "for 掌阅(EPub)",
        logo : readerLogo,
        isPremium : false,  //  是否收费
        charge : 0,
        isOpen : true       //是否开放
    },
	PDF : {
        type : "pdf",
        name : "印刷文件(pdf)",
        logo : pdfLogo,
        isPremium : false,  //  是否收费
        charge : 0,
        isOpen : false       //是否开放
    },
    WEIXIN : {
        type : "epub3",
        name : "for 微信读书(EPub)",
        logo : weixinLogo,
        isPremium : false,  //  是否收费
        charge : 0,
        isOpen : false       //是否开放
    }
};
/**
 * 一键出版上传文件条目页面
 */
export default class Download extends React.Component{
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.initItems = [
                {
                    isSelect: false,    //是否选中
                    type: DOWNLOAD_TYPES.MOBI.type, //下载类型 
                    name: DOWNLOAD_TYPES.MOBI.name,       //类型名称
                    logo: DOWNLOAD_TYPES.MOBI.logo,           //类型LOGO
                    isPremium : DOWNLOAD_TYPES.MOBI.isPremium,  //  是否收费
                    charge : DOWNLOAD_TYPES.MOBI.charge,    //费用
                    isOpen : DOWNLOAD_TYPES.MOBI.isOpen    //是否开放
                },
                {
                    isSelect: true,    //是否选中
                    type: DOWNLOAD_TYPES.EQUB_QQ.type, //下载类型 
                    name: DOWNLOAD_TYPES.EQUB_QQ.name,       //类型名称
                    logo: DOWNLOAD_TYPES.EQUB_QQ.logo,           //类型LOGO
                    isPremium : DOWNLOAD_TYPES.EQUB_QQ.isPremium,  //  是否收费
                    charge : DOWNLOAD_TYPES.EQUB_QQ.charge,    //费用
                    isOpen : DOWNLOAD_TYPES.EQUB_QQ.isOpen    //是否开放
                },
                {
                    isSelect: false,    //是否选中
                    type: DOWNLOAD_TYPES.EQUB_ZHANGYUE.type, //下载类型 
                    name: DOWNLOAD_TYPES.EQUB_ZHANGYUE.name,       //类型名称
                    logo: DOWNLOAD_TYPES.EQUB_ZHANGYUE.logo,           //类型LOGO
                    isPremium : DOWNLOAD_TYPES.EQUB_ZHANGYUE.isPremium,  //  是否收费
                    charge : DOWNLOAD_TYPES.EQUB_ZHANGYUE.charge,    //费用
                    isOpen : DOWNLOAD_TYPES.EQUB_ZHANGYUE.isOpen    //是否开放
                },
                // {
                //     isSelect: false,    //是否选中
                //     type: DOWNLOAD_TYPES.XML.type, //下载类型 
                //     name: DOWNLOAD_TYPES.XML.name,       //类型名称
                //     logo: DOWNLOAD_TYPES.XML.logo,           //类型LOGO
                //     isPremium : DOWNLOAD_TYPES.XML.isPremium,  //  是否收费
                //     charge : DOWNLOAD_TYPES.XML.charge,    //费用
                //     isOpen : DOWNLOAD_TYPES.XML.isOpen    //是否开放
                // },
                {
                    isSelect: false,    //是否选中
                    type: DOWNLOAD_TYPES.WEIXIN.type, //下载类型 
                    name: DOWNLOAD_TYPES.WEIXIN.name,       //类型名称
                    logo: DOWNLOAD_TYPES.WEIXIN.logo,           //类型LOGO
                    isPremium : DOWNLOAD_TYPES.WEIXIN.isPremium,  //  是否收费
                    charge : DOWNLOAD_TYPES.WEIXIN.charge,    //费用
                    isOpen : DOWNLOAD_TYPES.WEIXIN.isOpen    //是否开放
                },
                {
                    isSelect: false,    //是否选中
                    type: DOWNLOAD_TYPES.PDF.type, //下载类型 
                    name: DOWNLOAD_TYPES.PDF.name,       //类型名称
                    logo: DOWNLOAD_TYPES.PDF.logo,           //类型LOGO
                    isPremium : DOWNLOAD_TYPES.PDF.isPremium,  //  是否收费
                    charge : DOWNLOAD_TYPES.PDF.charge,    //费用
                    isOpen : DOWNLOAD_TYPES.PDF.isOpen    //是否开放
                }
            ];
        var copyItems = this.initItems.map( item => item);
        this.state = {
            items: this.initItems,
            isShow : this.props.isShow
        }
    }
    /**
     *渲染顶部
     */
    renderTitleSection(){
        return (
            <div className="download-publication-title">选择下载格式
                <div className="download-publication-close" onClick={this.onDownloadCancelHandler.bind(this)}></div>
            </div>
        );
    }
    /**
     *渲染子选项
     */
    renderItemSection(){
        var items = this.state.items;
        if(items.length < 1){
            return null;
        }else{
            return(
                _.map(items, (item, index) => <DownloadItem item={item} key={items.length - index} itemIndex={index} updateItem={this.updateItemHandler.bind(this)} />)
            );
        }
    }
    /**
     *渲染底部，下载和分栏
     */
    renderBottomSection(){
        var buttonClass = this.state.items.some(item => item.isSelect) ? "download-publication-button" : "download-publication-button2" ;
        return (
            <div className="download-publication-bottom">
                <a href="javascript:;" className={buttonClass} onClick={this.onDownloadPublicationHandler.bind(this)}>确 定</a>
                <a href="javascript:;" className="download-publication-button" onClick={this.onDownloadCancelHandler.bind(this)}>取 消</a>
            </div>
        );
    }
    /**
     *渲染界面
     */
    render() {
        if(this.state.isShow){
            return (
                <div className="download-publication-container">
                    <div className="download-publication-content">
                        {this.renderTitleSection()}
                        <ul>
                            {this.renderItemSection()}
                        </ul>
                        {this.renderBottomSection()}
                    </div>    
                </div>
            );
        }else{
            return null;
        }
        
    }
    /**
     *将要接收属性的时候
     */
    componentWillReceiveProps(nextProps) {
        if(nextProps.isShow){
            this.setState({isShow : nextProps.isShow});
        }
    }
    /**
     *装载组件的时候
     */
    componentDidMount () {

    }

    /**
     *卸载组件的时候
     */
    componentWillUnmount() {

    }
    /**
     *更新类别选中状态
     */
    updateItemHandler(index){
        var oldItems = this.state.items;
        if(index > oldItems.length) return;
        var  findItem = oldItems[index];
        var itemSelect = findItem.isSelect;
        findItem.isSelect = !itemSelect;
        this.setState(oldItems);
    }
    /**
     * 真实下载出版物作品的函数
     */
    onDownloadPublicationHandler(){
        const downloadTypeItems = this.state.items.filter(item => item.isSelect);
        if(downloadTypeItems.length < 1){
            return;     //没有选中的情况下点击没效果
        }
        var types = downloadTypeItems.map(item => item.type);
        //取消事件
        this.setState({
            items: this.initItems,
            isShow : !this.state.isShow
        });
        this.props.downloadTypes(types);
    }

    /**
     * 下载取消事件
     */
    onDownloadCancelHandler(){
        this.props.cancelType();
        this.setState({isShow : !this.state.isShow});
    }

}
