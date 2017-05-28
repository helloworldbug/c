/**
 * @description 文件分片上传的工具类
 * @time 2016-11-8
 * @author fisnYu
 */

'use strict';
import hex_md5 from"./MD5Utils.js";  //md5.
var serverurl = require("../config/serverurl.js")
const STATUS = {
    UF_UPLOADING : "uf_uploading",      //上传中
    UPLOAD_FAILED : "upload_failed",    //上传失败
    USER_CANCELS_PROMPT :"tf_user_cancels_prompt",  //用户取消上传
    UF_UPLOADED : "uf_uploaded",        //上传成功
    UF_CALL_TRANSFER : "uf_call_transfer",   //转档中
    TRANSFER_FAILED : "transfer_failed",    //转档失败
    TRANSFER_SUCCESS : "transfer_success"    //转档成功
}
class UploadUtils {
    constructor(options = {}) {
        this.file = options.file;   //需要上传的文件
        this.allUploadCompleted = options.completed;    //上传完成的回调
        this.uploadProgress = options.progress;     //上传进度
        this.userId = options.userId || "";
        this.uploadObj = null;  //上传对象
        this.fileHash = ""; //总文件的hash值
        this.packsetLength = 1; //分片数组总长度
        this.packsetArray = []; //存储的分片数组
        this.blobArray = []; //存储的分片数组
        this.fileSize = 0; //文件的大小
        this.packsetSize = 1024 * 1024; //分片的大小 1M
        this.packsetIndex = 0; //加载文件片段数组的起始下表
        this.fileName = ""; //总文件的hash值
        this.fileType = ""; //文件后缀
        this.completedArr = []; //传输完成的数组
    }

    /**
     *上传文件
     */
    uploadFile(){
        var self = this;
        if (self.file) {
                self.fileSize = self.file.size; //获取文件大小
                self.fileName = self.file.name; //文件名称
                self.fileType = self.fileName.substring(self.fileName.lastIndexOf('.') + 1); //文件后缀
                //以1M以内的大小分片
                self.packsetLength = Math.ceil(self.fileSize * 100 / self.packsetSize / 100); //获取切片数组的总长度
                for (var i = 0; i < self.packsetLength; i++) {
                    var packet; //文件片段
                    var startSize = i * self.packsetSize; //分片的起始位置
                    var endSize = (i + 1) * self.packsetSize; //分片的结束位置
                    if (endSize >= self.fileSize) {
                        packet = self.file.slice(startSize, self.fileSize);
                    } else {
                        packet = self.file.slice(startSize, endSize);
                    }
                    self.packsetArray.push(packet);
                }
                self.finishedCount=0;
                self.threadCount=Math.min(4, self.packsetLength);
                self.isStop=false;
                if(self.fileSize < 8 * 1024 * 1024){
                    var fr = new FileReader();
                    fr.onload = function() {
                        var b64string=this.result
                        var ret=b64string.substr(b64string.indexOf(";base64,")+";base64,".length)
                        self.fileHash = hex_md5(ret); //获取文件的hash值
                        if(self.fileSize > 0){
                            //上传之前先检测文件是存在
                            self.checkFileIsUploaded(self.fileHash, function(data){
                                console.log(data, "检测文件是否存在");
                                if(data && data.err){
                                    self.upload();
                                }else if(data && data.result){
                                    if(data.result.front_str_status == "transfer_success"){     //从已经删除的文件修改状态 
                                        self.completedHandler(true, "转档完成");
                                    }else if(data.result.front_str_status == STATUS.USER_CANCELS_PROMPT && data.result.statuss.length == 2){     //用户取消的状态
                                        self.upload();
                                    }else {
                                        var msg = self.getErrorMessage(data);
                                        self.completedHandler(false, msg);
                                    }
                                     
                                }
                            }, function(err){
                                console.log(err, "上传之前检测失败");
                            });
                        }else{  //0kb的文件不上传
                            self.completedHandler(false, "空文件");
                        }
                    };
                    fr.readAsDataURL(self.file); 
                }else{
                    var md5BlockString="";
                    var firstBlock=self.file.slice(0, 3*1024 * 1024);
                    var fr = new FileReader();
                     fr.onload = function() {
                         md5BlockString=this.result.substr(this.result.indexOf(";base64,")+";base64,".length);
                         var lastBlock=self.file.slice(-(4*1024 * 1024));
                          var fr = new FileReader();
                         fr.onload = function() {
                          md5BlockString+=this.result.substr(this.result.indexOf(";base64,")+";base64,".length);
                          md5BlockString+=self.file.size;
                          self.fileHash = hex_md5(md5BlockString);
                          //上传之前先检测文件是存在
                            self.checkFileIsUploaded(self.fileHash, function(data){
                                console.log(data, "检测文件是否存在");
                                if(data && data.err){
                                    self.upload();
                                }else if(data && data.result){
                                    if(data.result.front_str_status == "transfer_success"){     //从已经删除的文件修改状态 
                                        self.completedHandler(true, "转档完成");
                                    }else if(data.result.front_str_status == STATUS.USER_CANCELS_PROMPT && data.result.statuss.length == 2){     //用户取消的状态
                                        self.upload();
                                    }else {
                                        var msg = self.getErrorMessage(data);
                                        self.completedHandler(false, msg);
                                    }
                                }
                                
                            }, function(err){
                                console.log(err, "上传之前检测失败");
                            });
                        }
                      fr.readAsDataURL(lastBlock);
                    }
                    fr.readAsDataURL(firstBlock);
                }
              
            }
    }
    /**
    * 上传文件片段的具体函数
    * @param cIndex
    * @param cb
    */
    uploadPacketHandler(cIndex, cb) {
        var self = this;
        var packset = self.packsetArray[cIndex];
        var packsetHash = "";
        var fr = new FileReader();
            fr.onload = function() {
                packsetHash = hex_md5(this.result); //获取文件的hash值
                //构造一个表单，FormData是HTML5新增的
                var data =new FormData();
                data.append("meta_data",packset);   //slice方法用于切出文件的一部分
                data.append("name", self.fileName); //文件名
                data.append("type", self.fileType); //文件后缀
                data.append("size", self.fileSize); //文件总长度
                data.append("index", cIndex);   //当前是第几片
                data.append("uf_hashcode",self.fileHash);   //文件的hash
                data.append("hashcode", packsetHash);   //文件片段的hash
                data.append("blocks",self.packsetLength);   //文件片段的数组总长度
                data.append("ub_size",packset.size);    //单片的大小

                // surePostFile(data);
                sureRequestFile(data);
                //ajax处理方式，由于没有进度更换
                function surePostFile(data){
                    
                     $.ajax({

                        url: serverurl.upload + "/upload", //接收文件地址

                        type: "POST", //提交方式
                        processData: false, //很重要，告诉jquery不要对form进行处理
                        data: data,
                        async: true, //异步
                        contentType: false, //很重要，指定为false才能形成正确的Content-Type
                        headers: {
                            "X-Gli-User-Id": self.userId,
                            "X-Gli-Client-Id": "MEPC"
                        },
                        success: function() {
                            //传输下一个片
                            cb();
                        },
                        error: function() {
                            //传输失败重新上传
                            console.error("network error,resend will start later,pleased do not close the window");
                            setTimeout(function(){
                                surePostFile(data)
                            },10*1000)
                        }

                    });
                }
                //XMLHttpRequest处理方式，由于没有进度更换
                function sureRequestFile(data){
                    var xhr = new XMLHttpRequest(); //创建上传对象      //todo可能有些不支持
                    if(xhr){
                        xhr.addEventListener("load", function(evt) {
                            if (evt.target.readyState == 4) {
                                if (evt.target.status == 200) { //服务器响应的HTTP代码，200表示正常  
                                    var responseText = evt.target.responseText;
                                    console.log(responseText, "上传返回");
                                    try{
                                        responseText = JSON.parse(responseText);
                                        //传输下一个片
                                        cb(responseText);
                                    }catch(e){
                                        //传输下一个片, 出错就返回上传失败
                                        var res = {};
                                        res.upload_end_flg = true;
                                        res.file_merge_flg = false;
                                        cb(res);
                                    }
                                    
                                } else {
                                    //传输失败重新上传
                                    setTimeout(function(){
                                        sureRequestFile(data)
                                    },10*1000);
                                }
                            } else {
                                //传输失败重新上传
                                setTimeout(function(){
                                    sureRequestFile(data)
                                },10*1000);
                            }
                        }, false);
                        //传输失败
                        xhr.addEventListener("error", function(evt) {
                            console.error("network error,resend will start later,pleased do not close the window");
                            setTimeout(function(){
                                sureRequestFile(data)
                            },10*1000);
                        }, false);
                        //传输取消重新上传
                        xhr.addEventListener("abort", function(evt) {
                            setTimeout(function(){
                                sureRequestFile(data)
                            },10*1000);
                        }, false);
                        xhr.open("POST", serverurl.upload + "/upload");
                        xhr.setRequestHeader("X-Gli-User-Id", self.userId);
                        xhr.setRequestHeader("X-Gli-Client-Id", "MEPC");
                        xhr.upload.addEventListener("progress", function(evt){
                            self.completedArr[cIndex] = evt.loaded;
                            var sum=0;
                            self.completedArr.forEach((v)=>{
                                if(v){
                                    sum+=v
                                }
                            })
                            var percent =  sum / self.fileSize ;
                            self.uploadProgress(evt, percent);
                        }, false);
                        xhr.send(data);
                    }
                }
            };
          fr.readAsDataURL(packset);  
    }

    upload() {
        for(var i=0;i<this.threadCount;i++){
            this.loopUpload();
            if(i<this.threadCount-1){
                this.packsetIndex++;
            }
        }
    }

    loopUpload(){
        var _this=this;
        if(this.packsetIndex>=this.packsetLength){
            console.log("thread finished")
            return 
        }
        this.uploadPacketHandler(this.packsetIndex, function perPacketEnd(res){
            _this.packsetIndex++;
            _this.finishedCount++;
            if(res.upload_end_flg){     //表示该文件已经上传了， 或者上传失败的
                var enFlg = res.file_merge_flg ;       //上传成功，或者合并失败
                _this.isStop = true;         //停止上传了。
                var msg = enFlg ? "" : "上传失败";
                _this.completedHandler(enFlg, msg);
            }
            if(_this.isStop==true){
                return
            }
            if(_this.finishedCount >= _this.packsetLength){
                _this.completedHandler(res.upload_end_flg);
            }else{
               _this.loopUpload(); 
            }
        });
    }

    stop(){
        this.isStop=true;
    }

    continueUpload(){
        this.isStop=false;
        this.upload();
    }
    /**
     * 检测文件是否已经上传过。
     */

     checkFileIsUploaded(fileHash, cb_ok, ce_err){
         var self = this;
          $.ajax({
            url: serverurl.convertApi + "/v1/transfer/transferfile/hashcode/" + fileHash,  //接收文件地址
            type: "GET", //提交方式
            contentType: "application/json", //很重要，指定为false才能形成正确的Content-Type
            headers: {
                "X-Gli-User-Id": self.userId,
                "X-Gli-Client-Id": "MEPC"
            },
            success: cb_ok,
            error: ce_err
        });
     }

     /**
      * 调用上传完成函数
      */
      completedHandler(status, msg = ""){
          var result = {};
          result.status = status;  //返回的状态，true ,false
          result.msg = msg;        //返回的消息， 
          this.allUploadCompleted(this.fileHash, result); //true表示上传成功, false 表示失败 res.this_upload_flg
      }
      /**
       * 根据数据获取不同的错误信息
       */
      getErrorMessage(data){
          var msg = "";
          var frontStatus = ""
          var statusArr = data.result.front_statuss;
          if(statusArr.length > 0 ) frontStatus = statusArr[statusArr.length - 1].progress;
          switch(frontStatus){
              case STATUS.UF_UPLOADING :    //上传中
                msg = "文档已存在，请勿重复上传";
                break;
              case STATUS.UF_UPLOADED :     //上传成功
                msg = "文档已存在，请勿重复上传";
                break;
              case STATUS.UPLOAD_FAILED :   //上传失败
                msg = "文档已存在，请勿重复上传";
                break;
              case STATUS.UF_CALL_TRANSFER :    //转档中
                msg = "文档已存在，请勿重复上传";
                break;
              case STATUS.TRANSFER_FAILED :     //转档失败
                msg = "文档已存在，请勿重复上传";
                break;  
              case STATUS.TRANSFER_SUCCESS :    //转档成功
                msg = "文档已存在，请勿重复上传";
                break;
             case STATUS.USER_CANCELS_PROMPT :    //上传中
                msg = "文档已存在，请勿重复上传";
                break;
          }
          return msg;
    }
};

module.exports = UploadUtils;