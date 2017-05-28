/**
 * @description 一键转档页面
 * @time 2016-11-7
 * @author fisnYu
 */

'use strict';

//require core module
var React = require('react');
import {Link} from 'react-router';
var Base = require('../../utils/Base');
var Slider = require('../Common/Slider');
var ContextUtils = require('../../utils/ContextUtils');
var MakeWebAPIUtils = require("../../utils/MakeWebAPIUtils.js");

//require owner style
require("./dataProcessing.css");

var serverurl = require("../../config/serverurl");

//require submodule
var Footer = require('../Common/Footer');
var Images = require('../Common/Image');
var Dialog = require('../Common/Dialog');
var DataProcessingHint = require('./dataProcessingHint.jsx');   //转档说明组件
var DataProcessingAnnounce = require('./dataProcessingAnnounce.jsx');   //转档公告组件
var DataProcessingUpload = require('./dataProcessingUpload.jsx');   //转档组件

var Download = require('../Common/Download/Download.jsx');   //通用的下载组件
var DataProcessingStore = require('../../stores/DataProcessingStore');
var DataProcessingActions = require('../../actions/DataProcessingActions');
var CartView = require('../Cart/Cart');

import Preview from './preview'

var publishParnter = require('../../../assets/images/dataProcessing/parnter.png');
import Feedback from '../Common/Feedback'

const TF_FAILED = "transfer_failed"; //转档失败
const UF_CALL_TRANSFER = "uf_call_transfer"; //转档中
const UF_UPLOADING = "uf_uploading";//上传中
const UPLOAD_FAILED = "upload_failed"; //上传失败
const BookTransferCount = "Svc_BookTransferCount";  //转档次数的 custom_code

/**
 * 一键转档页面
 */
export default class DataProcessing extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        //初始化状态
        this.state = DataProcessingStore.getDataProcessingState();
        this.state.isFeedbackShow=false;
        this.MyMar = null;
        this.speed = 50;
        this.hashArray = [];        //需要下载文件的hash 数组
        this.fileHash = "";
        this.showFeedback=this.showFeedback.bind(this);
        this.hideFeedback=this.hideFeedback.bind(this);
        this.userId = "";
        // this.usedCounts = 0;  //已经使用的次数
        this.buyCounts = 0;     //需要购买的次数
    }
    /**
     *渲染转档提示界面
     */
    renderHintSection() {
        //暂时不做，
        return null;
        // var hint = localStorage.getItem("data-processing-hint");
        // if (hint) {
        //     return null;
        // } else {
        //     localStorage.setItem("data-processing-hint", "1");
        //     if (this.state.closeHint) {
        //         return null;
        //     } else {
        //         return (<DataProcessingHint closeHint={this.closeHintHandler.bind(this)} />);
        //     }
        // }
    }

    /**
     *渲染转档公告界面
     */
    renderIntroductionSection() {
        return (
            <div className="data-processing-introduction">
                <div className="introduction-title">ME BOOK 一键出版</div>
                <div className="introduction-hint">在线转换文档格式，让出版更加便捷</div>
                <div className="introduction-bottom">
                    <div className="introduction-bottom-common">
                        <div className="bottom-title">ME BOOK 一键出版功能干什么？</div>
                        <div className="bottom-hint">
                            me book 支持对word文档一键转换成<span>html，epub，mobi</span>格式文件。云端存储，随时随地下载转档文件。
                        </div>
                    </div>
                    <div className="introduction-bottom-common introduction-bottom-center">
                        <div className="bottom-title">为什么使用ME BOOK 一键出版？</div>
                        <div className="bottom-hint">
                            编辑人员需要针对word文档转换成epub、mobi格式发布于<span>kindle，qq阅读，掌阅</span>等平台。ME book 一键出版简单快速解决转档问题
                        </div>
                    </div>
                    <div className="introduction-bottom-common">
                        <div className="bottom-title">如何使用ME BOOK 一键出版？</div>
                        <div className="bottom-hint">
                            1.上传文件 → 2.转档 → 3.点击下载
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     *渲染转档公告界面
     */
    renderAnnounceSection() {
        if (this.state.hideAnnounce) {
            return null;
        } else {
            return (<DataProcessingAnnounce hideAnnounce={this.hideAnnounceHandler.bind(this)} />);
        }
    }

    /**
     *渲染一键发布的合作商界面
     */
    renderParnterSection() {
        return (
            <div className="data-processing-parnter">
                <span>他们正在使用ME</span>
                <div className="parnter-top" id="data-processing-parnter-top" ></div>
                <div id="publish-parnter" ref="publishParnter" onMouseOver={this.parnterMouseover.bind(this)} onMouseOut={this.parnterMouseout.bind(this)}>
                    <div ref="publishParnter1">
                        <Images src={publishParnter} width="1170" height="254" />
                        <Images src={publishParnter} width="1170" height="254" />
                        <Images src={publishParnter} width="1170" height="254" />
                        <Images src={publishParnter} width="1170" height="254" />
                        <Images src={publishParnter} width="1170" height="254" />
                    </div>
                    <div ref="publishParnter2"></div>
                </div>
                <div className="parnter-down" id="data-processing-parnter-down"></div>
            </div>
        );
    }
    showFeedback(){
        this.setState({isFeedbackShow:true})
    }
    hideFeedback(){
        this.setState({isFeedbackShow:false})
    }
    /**
     *渲染界面
     */
    render() {
        //没有登录的情况下，直接跳转到登录页面，登录完成返回到转档页面
        var self = this;
        var user = ContextUtils.getCurrentUser();
        if (!user) {
            var hashs = location.pathname;/**/
            localStorage.setItem("referer", hashs);
            Base.linkToPath("/login");
            return null;
        }
        this.userId = user.id;
        return (
            <div style={{width: "100%", height:"100%", position: "relative"}}>
                <Slider ref="slider"/>
                {/*显示超出选择条目框 */}
                {this.buildDialog({
                    title: self.state.dialogTitle,
                    appearanceState: self.state.toggleDialog,   //是否显示提示框
                    sureIsHide: self.state.isHideDialogBtn,             //是否隐藏按钮
                    cancelFn() {    //失败回调
                        self.toggleDialogHandler();
                    },
                    sureFn() {  //成功回调
                        self.onDialogOkHandler();
                    }
                })}
                {/*显示下载选择类型框 */}
                {this.buildDowloadType({
                    isShow: self.state.toggleDownload,   //是否显示提示框
                    downloadTypes :  self.choseTypesSuccessHandler.bind(self),//成功回调
                    cancelType : self.cancelChoseTypeHandler.bind(self)  //失败回调
                        
                })}
                {/*显示预览框*/}
                {this.buildPreview({
                    fileHash: self.fileHash,   //是否显示提示框
                    onClose: self.togglePreviewHandler.bind(self)    
                })}
                
               {this.state.isFeedbackShow ? <Feedback onClose={this.hideFeedback}/>:null}
               
                <div className="data-processing-title"></div>
                {this.renderHintSection()}
                {this.renderAnnounceSection()}
                <DataProcessingUpload  items={this.state.dataProcessingItems} addItems={this.addItemsHandler.bind(this)} 
                updateItem={this.updateItemHandler.bind(this)} downloadItems={this.toggleDownloadHandler.bind(this)} 
                showPreview={this.togglePreviewHandler.bind(this)} deleteItem={this.deleteItemHandler.bind(this)} showFeedback={this.showFeedback}/>
                {this.renderIntroductionSection()}
                {this.renderParnterSection()}
                <Footer />
                {/*购买对话框*/}
                <CartView ref="cartView" data={this.state.cartData}  onOk={this.onPayOk.bind(this)} />
            </div>
        );
    }
    /**
     *关闭提示层的具体实现函数
     */
    closeHintHandler() {
        DataProcessingActions.closeDataProcessingHint();
    }

    /**
     *隐藏公告栏的具体实现函数
     */
    hideAnnounceHandler() {
        DataProcessingActions.hideDataProcessingAnnounce();
    }

    /**
     *添加文件列表
     *@param isOld 是否是新老数据
     *@param obj    文件数组，或者之前记录store数组
     */
    addItemsHandler(obj, isOld = false) {
        var self = this;
        if(!isOld){ //新上传的文件
            //TODO需要先判断用户的用量和文件个数,用于收费计算  modify by fishYu 2016-11-28 obj为对象
            var len = obj.length;   //本次需要上传的文件个数
            var sumSize = 0;    //本次上传的文件总容量，用于判断流量和容量
            for(var i = 0; i < len; i++){
                var file = obj[i];
                sumSize += file.size ;
            }
            sumSize = (Math.ceil(sumSize * 100 / (1024 * 1024)) / 100); //转换成MB 所有都通过MB判断1GB = 1024MB
            console.log("需要先判断用户当月的可用流量，可传文件个数，中转空间的容量大小", obj, len, sumSize);
            //请求数据库，比对用户信息, 查询转档次数 add by fishYu 2016-12-8
            MakeWebAPIUtils.getRESTfulData({
                url: "/v1/useritem/own/external/Svc_BookTransferCount", 
                success: (data) => {
                    console.log(data, 885666);
                    if (data && data.result) {
                        console.log(data, "获取转档次数信息");
                        var _data = data.result[0];   //此处只是获取第一条
                        // var totalCounts = _data.init_count || 0;
                        var remainCounts = _data.item_count || 0;
                        // var _remainCounts = remainCounts - this.usedCounts;  //增加一个限制，主要是转档完成才-1；此处是提前减掉1
                        // console.log(_remainCounts, 55464465);
                        if(remainCounts < len){
                            this.buyCounts = len - remainCounts;    //需要购买的此时
                            this.toggleDialogHandler("上传转档文件数量已超出限制！<br />马上购买次数卡升级服务！", false);
                            return 0;
                        }else{
                            DataProcessingActions.addDataProcessingItems(obj, isOld);
                            // this.usedCounts += len ;
                        }
                    }else if(data && data.err){     //没有查到数据的情况也是去买服务
                        this.buyCounts = len;    //需要购买的此时
                        this.toggleDialogHandler("上传转档文件数量已超出限制！<br />马上购买次数卡升级服务！", false);
                        return 0;
                    }
                }, 
                error: function (err) {
                    console.log(err, "转档次数数据查询");
                },
                userID: self.userId   //用户ID
            });
        }else{
            DataProcessingActions.addDataProcessingItems(obj, isOld);
        }
    }

    /**
     *修改单条文件，目前只是修改 code, downloadUrl
     */
    updateItemHandler(options) {
        // if(!options.code){     //code 为0 的时候, 失败的情况  TODO haishi 会有漏洞
        //     this.setUsedCountsMinusOne();   //使用次数减1
        // }
        DataProcessingActions.updateDataProcessingItem(options);
    }
    /**
     *删除该条数据
     */
    deleteItemHandler(index){
        DataProcessingActions.deleteDataProcessingItem(index, this.userId);
    }
    /**
     *开关错误信息
     */
    toggleDialogHandler(title, isHide) {
        //还原标题设置
        DataProcessingActions.toggleDataProcessingDialog(title, isHide);
    }
    /**
     * 显示收费点的信息
     */
    onDialogOkHandler() {
        if(!this.state.isHideDialogBtn){    //点击确认按钮的情况, 两个按钮
            var cartDataPromise = this.onBuyHandler(); //返回promise
            cartDataPromise.then((cartData) => {
                this.refs["cartView"].changeDialogStatus(true,0);
                DataProcessingActions.toggleDataProcessingDialog("", true, cartData);
            });
        }else{
            //还原标题设置
            DataProcessingActions.toggleDataProcessingDialog();
        }
    }

    /**
     *开关显示预览
     */
    togglePreviewHandler(fileHash) {
        if(fileHash){
            this.fileHash = fileHash;
        }else{
            this.fileHash = "";
        }
        DataProcessingActions.toggleDataProcessingPreview();
    }
    
    /**
     * 构建对话框
     */
    buildPreview(options) {
        //显示预览框，和隐藏和显示body的滚动条
        if(this.state.togglePreview){
            document.body.style.overflow = "hidden";
            return <Preview  {...options} />
        }else{
            document.body.style.overflow = "";
            return null;
        }
        
    }

    /**
     *开关显示选择下载类型框
     *@param items 装载file hash 的数组
     */
    toggleDownloadHandler(items){
        if(items && items.length > 0){
            this.hashArray = items;
        }
        DataProcessingActions.toggleDataProcessingDownload();
    }
    /**
     *组件装载事件
     */
    componentDidMount() {
        if(this.userId){
            this.loadConvertNotSuccessData();
            this.parnterScroll();
        }
        DataProcessingStore.addChangeListener(this._onChange.bind(this));
        this.bindWindowScrollEvent();
    }
    /**
     *组件挂载事件
     */
    componentWillUnmount() {
        DataProcessingStore.removeChangeListener(this._onChange.bind(this));
        this.parnterMouseover();
        this.bindWindowScrollEvent({ isUnset: true });
    }
    /**
     *界面改变事件
     */
    _onChange() {
        this.setState(DataProcessingStore.getDataProcessingState());
    }
    /**
     * 启动合作方的图片滚动
     */
    parnterScroll() {
        var self = this;
        var parnter2 = this.refs.publishParnter2;
        var parnter1 = this.refs.publishParnter1;
        parnter2.innerHTML = parnter1.innerHTML;
        this.MyMar = setInterval(self.Marquee.bind(self), this.speed);
    }
    /**
     * 合作方logo鼠标over事件
     */
    parnterMouseover() {
        if (this.MyMar) {
            clearInterval(this.MyMar);
            this.MyMar = null;
        }
    }
    /**
     * 合作方logo鼠标OUT事件 重新启用
     */
    parnterMouseout() {
        var self = this;
        this.MyMar = setInterval(self.Marquee.bind(self), this.speed);
    }
    /**
     * 合作方滚动的具体实现
     */
    Marquee() {
        var parnter2 = this.refs.publishParnter2;
        var parnter1 = this.refs.publishParnter1;
        var parnter = this.refs.publishParnter;

        if (parnter2.offsetTop - parnter.scrollTop <= 0)
            parnter.scrollTop -= parnter1.offsetHeight;
        else {
            parnter.scrollTop++;
        }
    }
    /**
     * 构建对话框
     */
    buildDialog(options) {
        return <Dialog ref="dialog" {...options} />
    }

    /**
     * 构建对话框
     */
    buildDowloadType(options) {
        return <Download  {...options} />
    }
    /**
     * 选择下载类型成功的回调函数
     */
    choseTypesSuccessHandler(types){
        //关闭显示框
        this.toggleDownloadHandler();
        //1、通过this.hashArray  types;
        var postData = {};
        this.hashArray.forEach(function(item) {
            postData[item]= types;
        });
        // /transferfile/downloads/{hashcodes}
        var strPostData = JSON.stringify(postData);
        console.log(strPostData, "开始下载");
        var url = '/v1/transfer/user/'+this.userId+'/transferfile/downloads/'+strPostData;
        var server = serverurl.convertApi; //serverurl.convertApi;
        window.open(server + "" + url);
    }
    /**
     *下载类型取消实现函数
     */
    cancelChoseTypeHandler(){
        //关闭显示框
        this.toggleDownloadHandler();
    }
    /**
     * 绑定滚动事件
     */
    bindWindowScrollEvent(options) {
        var isUnset = !!options && options.isUnset;
        var scrollCallback = this.windowScrollCallback.bind(this);

        $(window)[isUnset ? 'unbind' : 'bind']('scroll', scrollCallback);
    }
    /**
     * 滚动事件 回到顶部
     */
    windowScrollCallback() {
        this.refs.slider.handleScroll();
    }
    /**
     * 通过文件大小获取显示内容
     */
    getFileSizeString(size){
        var sizeStr = "";
        if(size > (1024 * 1024 *1024)){
            sizeStr = (Math.round(size * 100 / (1024 * 1024 * 1024)) / 100).toString() + 'GB';
        }else if (size > 1024 * 1024){
            sizeStr = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
        }else{
            sizeStr = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
        }  
        return sizeStr;
    }
    /**
     *根据状态获取历史记录相关信息
     */
    getFileInfo(status, tf_progress){
        var obj = {};
        var isDelete = false;
        var msg = "";
        var code = 0;
        if(status == UF_UPLOADING){     //反查状态为上传中的时候，修改数据库，增加一次
            this.setUsedCountsMinusOne();   //使用次数减1
        }
        switch(status){
            case UF_CALL_TRANSFER : //转档中
                isDelete = false;
                msg = ("已转档" + tf_progress + "%...") ;
                code = 3;
                break;
            case UF_UPLOADING : //上传中
            case UPLOAD_FAILED : //上传失败
                isDelete = true;
                msg = "上传失败";
                code = 0;
                break;
            case TF_FAILED : //转档失败
                isDelete = true;
                msg = "转档失败";
                code = 0;
                break;
        }
        obj.isDelete = isDelete;
        obj.msg = msg;
        obj.code = code;
        return obj;
    }
    /**
     * 设置使用次数-1
     */
    setUsedCountsMinusOne(){
        // if(this.usedCounts){
        //     this.usedCounts -= 1; 
        // }
        //需要去修改数据库增加一次
    }

    /**
     * 获取剩余时间，单位为秒
     *@param createdTime 创建时间
     *@param updatedTime更新时间 创建时间
     *@param estimatedTime 预估时间
     *@return time 返回的时间，单位为秒
     */
     getRemainingTime(createdTime, updatedTime, estimatedTime){
         var time = 0;
         var _createdTime = (new Date(createdTime)).getTime();

         var _updatedTime = (new Date(updatedTime)).getTime();

         var timestamp = _updatedTime - _createdTime;

         timestamp = Math.floor(timestamp / 1000);   //转换成秒

         time = estimatedTime - timestamp;
        //  time = Math.floor(time / 1000);
         console.log(time, "转换的时间");
         return time > 0 ? time : 0;
     }
     /**
     *根据后端返回的状态，来获取创建预估时间的，当时时间
     */
    getUfCallTransferTime(frontStatuss){
        var time = "";
        frontStatuss.forEach(function(item) {
            if(item.progress == UF_CALL_TRANSFER){
                time = item.at;
            }
        });
        return time;
    }
    /**
     *加载转档失败，上传失败，转档中的 数据
     */
    loadConvertNotSuccessData(){
        var self = this;
        MakeWebAPIUtils.getRESTfulData({
            url: "/v1/transfer/transferfiles?front_str_status=uf_uploading,transfer_failed,uf_call_transfer,upload_failed",  
            success: (data) => {
                console.log(data, "加载转档失败，上传失败，转档中的 数据");
                if(data && data.result){
                    var lists = data.result.data;
                    var items = lists.map(function(item, index){
                        var obj = {};
                        var _progress = item.tf_progress || 1;
                        var estimatedTime = item.estimated_time || 0;     //预估时间
                        var frontStatuss = item.front_statuss;   //获取状态数组的对象{at:"2016-11-15T12:31:04.033+08:00"context:""progress:"uf_call_transfer"}
                        var createdTime = self.getUfCallTransferTime(frontStatuss);       //只是获取一次，就取当时的更新时间
                        var updatedTime = item.updated_at;  //就取当时的更新时间
                        var _info =  self.getFileInfo(item.front_str_status, _progress);
                        obj.size = self.getFileSizeString(item.uf_size);
                        obj.file = "oldItem";       //区别之前的文件
                        obj.name = item.uf_name;
                        obj.fileHash = item.hashcode;      //转档完成把文件的hash保存
                        obj.code = _info.code;
                        obj.msg = _info.msg;
                        obj.isDelete = _info.isDelete;
                        obj.remainingTime = self.getRemainingTime(createdTime, updatedTime, estimatedTime);  //目前为0
                        obj.uploadProgress = 100;
                        obj.convertProgress = _progress;
                        return obj;
                    });
                    self.addItemsHandler(items, true);
                }
            }, 
            error: function (err) {
                console.log(err, 95222);
            },
            userID: self.userId,   //"yuegy_yujin"       //用户ID
            urlType: true       //表示启用新的转档服务器
        });
    }

    /**
     * 购买特权
     * @return {promisse} 返回一个购买条目数组对象 promisse
     */
    onBuyHandler (){
        var self = this;
        return MakeWebAPIUtils.getGoodPrice([BookTransferCount], true,"service").then((data) => {
            data = data.length > 0  ? data[0] : null;
            if(!data) return null;
            var res = [];
            var expire = !!data.end_at ? data.end_at : "永久";
            console.log(self.buyCounts, 8888);
            var _count = self.buyCounts || 1;   //需要购买的次数
            var cartData =  { 
                name: data.name, 
                icon: data.icon, 
                price: (data.price / 100.0).toFixed(2), 
                sum: _count+"", 
                qixian: expire, 
                id: data.id, 
                custom_code: data.custom_code 
            };
            res.push(cartData);
            return res;
        });
    }

    /**
     * 购买成功回调
     * @param {number|status}  1 表示购买框确定点击回调，    2、表示付款完成点击回调
     * @param {object|obj}  status为1时，返回购买对象    2、时返回订单完成对象
     */
    onPayOk(status, obj){   
        var count = 0;  //购买的条目
        this.buyCounts = 0; //购买成功之后，归零
        if(status == 1){
            // this.buyCount = obj. items[0].count;        //TODO 这里只是获取了一条
        }else if(status == 2 ){
            //刷新页面
            // location.replace(location);     
        }
    }
};