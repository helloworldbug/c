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
import UploadUtils from "../../utils/UploadUtils.js";
var MakeWebAPIUtils = require("../../utils/MakeWebAPIUtils.js");
var ContextUtils = require('../../utils/ContextUtils');

const NumberType = {
    ZERO : 0,   //0, 错误
    FIRST : 1,  //1，上传中...，
    SECOND : 2, //2，等待转档中...，
    THREE : 3,  //3，转档中...，
    FOUR : 4    //4，转档完成
};

const IntervalTime = 1000* 5;  //轮询间隔时间
const TF_SUCCESS = "transfer_success"; //转档成功		
const TF_FAILED = "transfer_failed"; //转档失败
const UF_CALL_TRANSFER = "uf_call_transfer"; //转档中
const BookTransferCount = "Svc_BookTransferCount";  //转档次数的 custom_code
/**
 * 一键出版上传文件条目页面
 */
export default class DataProcessingItem extends React.Component{
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        var user = ContextUtils.getCurrentUser();
        this.userId = user.id;
        this.uploadUtils = new UploadUtils(
            {
                file: this.props.item.file, 
                completed : this.onUploadCompleted.bind(this), 
                progress: this.onUploadProgress.bind(this),
                userId: this.userId
            }
        );
        this.timer = null;
        this.fileHash = this.props.item.fileHash;
        this.timeTimer = null;  //倒计时的time
        this.state = {
            remainingTime : this.props.item.remainingTime  //默认转档完成的最后5秒
        };
        this.hasEstimatedTimeData = null;      //是否有预估时间
    }
    /**
     * 接收传props的时候，重新设置state
     */
    componentWillReceiveProps(nextProps){
         if (nextProps.item && nextProps.item.remainingTime) {
            //  console.log(777777);
            //  this.setState({
            //      remainingTime : nextProps.item.remainingTime
            //  });
        } 
    }
    /**
     * 全部上传完成的回调函数
     */
    onUploadCompleted(hash, result){
        var self = this;
        var status = result.status;
        var msg = result.msg;
        if(status){
            console.log("OK");
            this.fileHash = hash;
            if(msg == "转档完成"){    //直接转档完成
                self.updateItemHandler(NumberType.FOUR);  //设置转档中的状态
            }else{
                //todo 需要去获取一次剩余时间, 先去获取一次，没有获取到就一直循环去获取
                self.loadConvertData(hash, function(data){
                    if (data && data.result && data.result.estimated_time) {
                        self.hasEstimatedTimeData = data;
                        self.initConvertProgress(data);
                    }else{
                        self.updateItemHandler(NumberType.SECOND);  //设置转档中的状态
                        self.loopGetEstimatedTime(hash, self.initConvertProgress.bind(self));
                    }
                },function(err){
                    console.log(err);
                });
            }
        }else{
            console.log("err", status);
            this.fileHash = "";
            var isDelete = true;
            this.updateItemHandler(NumberType.ZERO, msg, isDelete);
        }
    }
    /**
     *  初始化倒计时
     */
    initConvertProgress(data){
        var self = this;
        console.log(data, "上传完成之后");
        var estimatedTime = data.result.estimated_time || 0;     //预估时间
        var frontStatuss = data.result.front_statuss;   //获取状态数组的对象{at:"2016-11-15T12:31:04.033+08:00"context:""progress:"uf_call_transfer"}
        var createdTime = self.getUfCallTransferTime(frontStatuss);       //只是获取一次，就取当时的更新时间
        var updatedTime = data.result.updated_at;  //就取当时的更新时间
        var _progress = data.result.tf_progress || 1;   //转换进度
        var remainingTime = self.getRemainingTime(createdTime, updatedTime, estimatedTime);
        //更新进度和剩余时间
        self.onConvertProgress(remainingTime, _progress);    //初始剩余时间5000，默认转换进度1
        //必须要设置下状态
        self.setState({remainingTime: remainingTime});
        //开始倒计时
        self.startEstimatedTime();
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
     * 查询预估时间
     */
    loadEstimatedTime(hash, cb){
        var self = this;
        self.loadConvertData(hash, function(data){
            if (data && data.result && data.result.estimated_time) {
                self.hasEstimatedTimeData = data;
                cb();
            }else{  //没有时间的时候再去取值
                self.updateItemHandler(NumberType.SECOND);  //设置转档中的状态
                cb();
            }     
        }, function(err){
            console.log(err, "上传完成设置转档失败");
        });
    }

    /**
    *循环获取预估时间
    */
    loopGetEstimatedTime (hash, cb_ok) {
        var self = this;
        if (self.hasEstimatedTimeData) {
            cb_ok(self.hasEstimatedTimeData);
            return;
        } else {
            setTimeout(function() {
                self.loadEstimatedTime(hash, function() {
                    self.loopGetEstimatedTime(hash,cb_ok);
                });
            }, 3*1000); //转档服务，获取信息，延迟3秒
        }
    }
    /**
     * 上传进度的回调函数
     */
    onUploadProgress(evt, percent){
        var bar = this.refs.progressBar;
        percent = Math.min(1, percent);
        var uploadPercent = Math.ceil(percent*100);
        bar.style.width = (percent * 100) + "%";
        var msg = uploadPercent === 100 ? "上传完成" : ("已上传" + uploadPercent + "%...") ;
        this.updateItemHandler(NumberType.FIRST, msg, false, 0, uploadPercent);
    }
    /**
     * 根据不同的状态获取不同的进度条样式
     */
    getProgressStyle() {
        const {item} = this.props;
        var obj = {};
        switch (item.code){
            case NumberType.ZERO :
                obj.name = "error";
                obj.msg = item.msg;
                obj.after = (<span className="data-processing-item-common-a" onClick={this.onDeleteItemHandler.bind(this)}>删除</span>);  //删除按钮
                break;
            case NumberType.FIRST :
                obj.name = "uploading";
                obj.after = "";
                obj.msg = item.msg;
                break;
            case NumberType.SECOND :        //暂时没有等待状态
                obj.name = "waiting";
                obj.after = "";
                obj.msg = "等待转档中...";
                break;
            case NumberType.THREE :
                obj.name = "compressing";
                obj.after = (<span className="data-processing-item-message" dangerouslySetInnerHTML={{__html: this.returnFormattedTime(this.state.remainingTime)}} ></span>);  //转档倒计时
                obj.msg = item.msg;
                break;
            case NumberType.FOUR :
                obj.name = "finished";
                obj.after = (
                            <span><a href="" onClick={this.onShowPreviewHandler.bind(this)} className="data-processing-preview">内容确认</a>
                            <a href="" onClick={this.onDownloadDataHandler.bind(this)}>下载</a></span>
                            );
                obj.msg = "转档完成";
                break;
        }
        return obj;   
    }

    /**
     *渲染界面
     */
    render() {
        const {item} = this.props;
        var _obj =  this.getProgressStyle();
        var _Style = _obj.name;
        var itemAfter = _obj.after;
        return (
                <li className="data-processing-item-upload">
                    <div className="data-processing-item-before" title={item.name}>
                        <span className="data-processing-item-size">{item.size}</span>
                        {item.name}
                    </div>
                    <div className={`data-processing-item-progress ${_Style}`}>
                        <div className="data-processing-item-bar" ref="progressBar" data-content={_obj.msg} ></div>
                    </div>
                    <div className="data-processing-item-after">
                        {itemAfter}
                    </div>
                </li>
            );
    }
    
    /**
     *装载组件的时候
     */
    componentDidMount(){
        //TODO 执行上传文件
        if(this.props.item.code == NumberType.FIRST){
            this.uploadUtils.uploadFile();
        }
        this.changeConvertStatus();
        //初始化显示转档的进度条或者 倒计时
        if(this.props.item.code == NumberType.THREE){
            this.setConvertProgress(this.props.item.convertProgress);
            if(this.props.item.remainingTime){
                this.startEstimatedTime();
            }
        }
    }

    /**
     *轮询转档完成的状态 
     */
     changeConvertStatus(){
        var self = this;
        //TODO 实现
        this.timer = setInterval(function(){
            if(self.fileHash && self.props.item.code === NumberType.THREE){ //上传成功并且有hashcode state ==3
                self.loadConvertData(self.fileHash, function(data){
                    console.log(data, 93366, "轮询查询");
                    if (data && data.result) {
                        var Status = data.result.front_str_status;
                        var _progress = data.result.tf_progress || 1;   //转换进度
                        if(Status == TF_SUCCESS){ //TODO 设置状态
                            // console.log(Status, "完成");
                            self.updateItemHandler(NumberType.FOUR);
                            self.clearTimer();
                            //修改转档次数, 后端去修改
                            // self.modifyConvertCount();
                        }else if(Status == TF_FAILED){
                            // console.log(Status, "转档失败");
                            self.updateItemHandler(NumberType.ZERO, "转档失败", true);
                            self.clearTimer();
                        }else if(Status == UF_CALL_TRANSFER){ //转档中
                            // console.log(Status, "转档中");
                            self.onConvertProgress(null, _progress);  //进度, 剩余时间
                        }
                    }
                }, function(err){
                    console.log(err, 95222);
                });
            }
        }, IntervalTime);    //10秒钟去轮询一次
     }
     /**
      *根据文件的hash查询需要转档的数据
      *@param fileHash 文件hash
      */
     loadConvertData(fileHash, cb_ok, cb_err){
        var self = this;
        MakeWebAPIUtils.getRESTfulData({
            url: `/v1/transfer/transferfile/hashcode/${fileHash}`, 
            success: cb_ok, 
            error: cb_err,
            userID: self.userId,       //用户ID
            urlType: true       //表示启用新的转档服务器
        });
     }
     /**
      *更新单条记录
      *@param code //状态码
      *@param msg //状态消息
      *@param isDelete //是否能删除
      *@param remainingTime //剩余时间
      *@param uploadProgress //上传进度
      *@param convertProgress //转换进度
      */
     updateItemHandler(code, msg, isDelete, remainingTime, uploadProgress, convertProgress){
         var self = this;
         msg = msg || "";
         isDelete = isDelete || false;
         uploadProgress = uploadProgress || 1;
         convertProgress = convertProgress || 1;
         var options = {
            index: self.props.itemIndex,
            code: code, //暂时没有等待转档，----直接到转档中
            fileHash: self.fileHash,
            msg: msg,
            isDelete: isDelete,
            uploadProgress : uploadProgress,
            convertProgress: convertProgress
        }
        if(remainingTime){
            options.remainingTime = remainingTime;
        }
        self.props.updateItem(options);
     }
    /**
     *卸载组件的时候
     */
    componentWillUnmount() {
        this.clearTimer();
        this.hasEstimatedTimeData = null;      //是否有预估时间
    }
    /**
     *清除定时器
     */
    clearTimer(){
        if(this.timer){
            window.clearInterval(this.timer);
            this.timer = null;
        }
        if(this.timeTimer){
            window.clearInterval(this.timeTimer);
            this.timeTimer = null;
        }
    }

    /**
     * 在线预览转档文件
     */
    onShowPreviewHandler(evt){
        evt.preventDefault();
        evt.stopPropagation();
        this.props.showPreview(this.fileHash);
    }

    /**
     * 下载转档文件
     */
    onDownloadDataHandler(evt){
        evt.preventDefault();
        evt.stopPropagation();
        this.props.downloadItem([this.fileHash]);
    }

    /**
     *删除单条文件
     */
     onDeleteItemHandler(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.props.deleteItem(this.props.itemIndex);
     }
     /**
      * 开始倒计时
      */
     startEstimatedTime(){
         var self = this;
         if(self.state.remainingTime > 0){
            this.timeTimer = setInterval(function () {
                var time = self.state.remainingTime - 1;
                if (time <= 0) {
                    clearInterval(self.timeTimer);
                }
                self.setState({remainingTime: time});
            }, 1000);
         }
     }
     /**
     *获取倒计时的时间格式
     *@param time 剩余时间，时间格式为秒
     */
     returnFormattedTime(time){
        //  console.log(time, "倒计时的时间格式");
         time = time <= 0 ? 0 : time;
         var hour = Math.floor(time/3600);
         hour = hour < 10 ? "0" + hour : hour;
         var minute = Math.floor(time%3600/60);
         minute = minute < 10 ? "0" + minute : minute;
         var seconds = Math.floor(time%3600%60);
         seconds = seconds < 10 ? '0' + seconds : seconds;
         if(time === 0){    //当最后到0的时候，出现进行中的动画 
             return "进行中 <div class='data-processing-loader'><div class='data-processing-ball-beat'><div></div><div></div><div></div></div></div>"
         }else{
             return hour + ":"+ minute + ":" + seconds;
         }
    }
    /**
     *设置转档中的进度
     */
    setConvertProgress(percent){
        var bar = this.refs.progressBar;
        bar.style.width = percent + "%";
    }
    /**
     * 转档进度的回调函数
     *@param percent 转档的进度
     */
    onConvertProgress(remainingTime, percent){
        var bar = this.refs.progressBar;
        bar.style.width = percent + "%";
        var msg = ("已转档" + percent + "%...");
        // console.log("转档剩余时间：",remainingTime, "转档百分比：",percent);
        this.updateItemHandler(NumberType.THREE, msg, false, remainingTime, 100, percent);

    }

    /**
     * 获取剩余时间，单位为秒
     *@param createdTime 创建时间
     *@param updatedTime 更新时间 创建时间
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
        //  console.log(time, "转换的时间");
         return time > 0 ? time : 0;
     }

     /**
      * 修改当前作者的转档使用量
      */
     modifyConvertCount(){
        var self = this;
        var obj = {
            "change_type" : 2,           //固定
            "change_reason" : "使用",    //固定
            "target_type" : "transfer",  //固定
            "target" : self.fileHash,
            "items": [
                {
                    "external_id" : BookTransferCount,
                    "use_count": 1
                }
            ]
        };
        MakeWebAPIUtils.postRESTfulData({
            url: "/v1/useritem/own", 
            data: obj,
            success: (data) => {
                if(data && data.result){
                    console.log(data , "修改成功");
                }
            }, 
            error: (err) => {
                console.log("修改转档次数失败原因：" + err);
            },
            userID: self.userId       //用户ID
        });
     }
};