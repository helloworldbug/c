/**
 * @description 转换记录界面
 * @time 2016-11-2
 * @author fisnYu
 */

'use strict';

//require core module
var React = require('react');
import {Link} from 'react-router'
var Base = require('../../../utils/Base');
import _ from 'lodash';
const Pagination = require('rc-pagination');
var MakeWebAPIUtils = require("../../../utils/MakeWebAPIUtils.js");
var serverurl = require("../../../config/serverurl");
//require style
require('./convertRecords.css');
require('rc-pagination/assets/index.css');

//require submodule
var ConvertRecord =  require('./convertRecord.jsx');

var ConvertGroup =  require('./convertGroup.jsx');

var ContextUtils = require('../../../utils/ContextUtils');

var Download = require('../../Common/Download/Download.jsx');   //通用的下载组件

var Preview = require('../../DataProcessing/preview.jsx');   //通用的下载组件

var CommonDialog = require('./commonDialog.jsx');   //通用的对话框组件

var CartView = require('../../Cart/Cart');

const BookTransferCount = "Svc_BookTransferCount";  //转档次数的 custom_code
/**
 * 转换记录界面
 */

const RECORD_SIZE = 10;      //每页多少条数据
const ZERO = 0;    //删除文档
const FIRST = 1;   //删除分组
const SECOND = 2;  //新增分组
const THREE = 3;   //移动分组
const DefaultName = "def";  //默认分组
const DefaultSelect = "";  //默认选中

export default class ConvertRecords extends React.Component{
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        var user = ContextUtils.getCurrentUser();
        this.userId = user.id;
        this.allRecords = []; //用于存储所有分组类型的转档记录
        this.groupName = "";    //需要删除的分组名称
        this.state = {
            currentPage : 1,    //当前页数
            records : [],
            toggleDownload : false,      //是否显示下载类型页面 
            togglePreview : false,      //是否预览页面
            isShowDialog : false,   //是否显示通用对话框
            dialogType : ZERO,     //通用对话框的类型
            dialogContent : ["确定删除选中的文档吗？"],       //对话框显示的内容值
            dialogPosition : [0, 0], //显示的Top left 位置
            fileHashs : [],    //需要操作的文件集合， 如移动组， 删除
            groupNames : [], //分组名称
            currentGroup : DefaultSelect,       //当前选中的默认分组
            totalCounts : 0,       //转档总次数
            remainCounts : 0,       //转档剩余次数
            cartData : null         //购买的条目对象
        }

        this.hashArray = [];    //文件hash的数组
        this.fileHash = "";
        this.buyCount = 0;      //购买的次数
    }
    /**
     *渲染顶部
     */
    renderTitleSection(){
        var buttonClass = this.state.records.some(item => item.isSelected) ? "convert-records-download" : "convert-records-download1" ;
        return (
            <div>
                <div className="convert-records-opration-container">
                    <span className="convert-records-name">转档管理</span>
                    <span className={buttonClass}onClick={this.onMoveGroupHandler.bind(this)}>移动分组</span>
                    <span className={buttonClass}onClick={this.onDownloadAllHandler.bind(this)}>全部下载</span>
                    <span className={buttonClass}onClick={this.onBatchRemoveHandler.bind(this)}>批量删除</span>
                </div>
                <div className="convert-records-title">
                    <div className="convert-records-title-name"><input type="checkbox" onChange={this.onSelectToggleHandler.bind(this)}/> <span>名称</span></div>
                    <span className="convert-records-title-time">时间</span>
                    <span className="convert-records-title-type">状态</span>
                    <span className="convert-records-title-size">大小</span>
                    <span className="convert-records-title-option">操作</span>
                </div>
            </div>
        );
    }
    /**
     *渲染子选项
     */
    renderRecordSection(records){
        if(records.length < 1){
            return (
                <div className="no-records">你还没有任何转档记录</div>
            );
        }else{
            return(
                _.map(records, (record, index) => <ConvertRecord record={record} key={records.length - index} recordIndex={index} 
                updateRecord={this.updateRecordHandler.bind(this)}  downloadRecord={this.toggleDownloadHandler.bind(this)} 
                showPreview={this.togglePreviewHandler.bind(this)} deleteRecord={this.onRemoveHandler.bind(this)}  replaceCover={this.onReplaceCoverHandler.bind(this)}/>)
            );
        }
    }
    /**
     *渲染底部，下载和分栏
     */
    renderBottomSection(total){
        if(total > 0){
            return (
                <div className="convert-records-bottom">
                    <div className="page-box">
                        <Pagination className="showQuickJumper" showQuickJumper onChange={this.onChangePageHandler.bind(this)} pageSize={RECORD_SIZE} current={this.state.currentPage}  defaultCurrent={1} total={total} />
                    </div>
                </div>
            );
        }else{
             return null;
        }
    }
    /**
     *渲染界面
     */
    render() {
        var records = this.state.records || [] ;
        var start = (this.state.currentPage - 1) * RECORD_SIZE;
        var end = start + RECORD_SIZE;
        var total = records.length;
        var list = records.slice(start, end);
        var self = this;
        var _total = this.state.totalCounts;    //总次数
        var _remain = this.state.remainCounts;  //剩余次数
        var _used = _total - _remain;           //使用的次数
        return (
            <div>
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
                {/*构建通用的对话框*/}
                {this.buildCommonDialog({
                    isShow: self.state.isShowDialog,   //是否显示提示框
                    content: self.state.dialogContent,   //显示内容
                    type: self.state.dialogType ,   
                    position: self.state.dialogPosition,
                    groupNames: self.state.groupNames,      //这个是为了检查输入，是否有重复的
                    cbOk: self.commonDialogOkHnadler.bind(this) , 
                    cbErr: self.commonDialogCancelHnadler.bind(this)
                })}
                <div className="convert-records-hint" >{"当前 ME Book 一键转档文件数量上限为 "+ _total +" 次，已使用 "+ _used +" 次，剩余 "+ _remain +" 次。  "}
                    <span className="buy-convert-count" onClick={this.onBuyCountsHandler.bind(this)}>马上购买</span>
                </div>
                <div className="convert-records-container">
                    <div className="convert-records-container-left">
                        {this.renderTitleSection()}
                        <ul className="convert-records">
                            {this.renderRecordSection(list)}
                        </ul>
                        {this.renderBottomSection(total)}
                    </div>
                    <div className="convert-records-container-right">
                        <ConvertGroup records={this.allRecords}  items={this.state.groupNames} groupType={ZERO} 
                        deleteGroupItem={this.onDeleteGropItemHandler.bind(this)} currentGroup={this.state.currentGroup} 
                        addGroupItem={this.onAddGropItemHandler.bind(this)} filterRecords={this.onFilterRecordsHandler.bind(this)}/>
                    </div>
                </div>
                <CartView ref="cartView" data={this.state.cartData} onOk={this.onPayOk.bind(this)} />
            </div>
        );
    }

    /**
     *装载组件的时候
     */
    componentDidMount(){
        //查询转档数据
        this.loadConvertData();
        //查询转档分组
        this.loadConvertGroup();
        //查询转档的剩余次数和总次数
        this.loadConvertCounts();
    }
    /**
     *卸载组件的时候
     */
    componentWillUnmount() {
    }
    /**
     * 查询转档记录
     */
    loadConvertData(){
        var self = this;
        MakeWebAPIUtils.getRESTfulData({
            url: "/v1/transfer/transferfiles?front_str_status=transfer_success,", 
            success: (data) => {
                if (data && data.result) {
                    console.log(data, "个人中心");
                    var lists = data.result.data;
                    var records = lists.map(function(item, index){
                        var obj = {};
                        obj.isSelected = false; //单条的转档数据是否选中
                        //增加一个时间戳
                        item.cover_img = item.cover_img ? item.cover_img + "?" + Date.now()  : item.cover_img ;
                        obj.record = item;  //单条的转档数据
                        return obj;
                    });
                    self.allRecords = records;  //第一次查询的时候赋值
                    self.filterRecordsByGroupName(self.state.currentGroup);
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
     * 查询转档分组
     */
    loadConvertGroup(){
         var self = this;
        MakeWebAPIUtils.getRESTfulData({
            url: "/v1/transfer/transfers/customclassification", 
            success: (data) => {
                if (data && data.result) {
                    var classifications = data.result.classifications;
                    var initNames = [];
                    for(var key in classifications){
                        if(key == "def") {
                            continue;
                        }else{
                            initNames.push(key);
                        } 
                    }
                    //备注强制把默认分组放到第一位
                    initNames.unshift("默认分组");
                    self.setState({
                        groupNames : initNames
                    });
                }
            }, 
            error: function (err) {
                console.log(err, "分组数据查询");
            },
            userID: self.userId,   //"yuegy_yujin"       //用户ID
            urlType: true       //表示启用新的转档服务器
        });
    }
    /**
     * 查询转档次数良
     */
    loadConvertCounts(){
        var self = this;
        MakeWebAPIUtils.getRESTfulData({
            url: "/v1/useritem/own/external/Svc_BookTransferCount", 
            success: (data) => {
                console.log(data, "转档次数数据查询1");
                if (data && data.result) {
                    var obj = data.result[0];   //此处只是取第一条
                    self.setState({  //初始化转档次数和剩余次数
                        totalCounts : obj.init_count || 0,
                        remainCounts : obj.item_count || 0
                    });
                }
            }, 
            error: function (err) {
                console.log(err, "转档次数数据查询");
            },
            userID: self.userId   //用户ID
        });
    }
    /**
     * 根据分组名称筛选记录
     * @param name 分组名称 ""为空时表示全部
     */
    filterRecordsByGroupName(name){
        var _records = [];
        if(this.allRecords){
            if(!name){
                _records = this.allRecords;
            }else{
                _records =  this.allRecords.filter((record, index) => {
                    var _name = record.record.classification || DefaultName;
                    return _name == name;
                });
            }
        }
        //默认显示分组
        this.setState({records: _records});
    }

    /**
     *分栏器改变的具体实现
     */
    onChangePageHandler(index){
        console.log(index);
        this.setState({currentPage : index});
    }
    /**
     * 全选的开关控制事件
     */
    onSelectToggleHandler(evt){
        var areAllMarked = evt.target.checked;
        var obj = this.state.records.map(function(record){
            record.isSelected =  areAllMarked;
            return record;
        });
        this.setState({records: obj});
        
    }
    /**
     *  改变选中框的处理事件
     */
    updateRecordHandler (index){
        if(index > this.state.records.length){
            return;
        }
        var records = this.state.records;
        const findRecord = records[index];
        var selected = findRecord.isSelected;
        findRecord.isSelected = !selected;
        this.setState({records: records});
    }
    /**
     * 显示或者隐藏选择下载文件的类型
     */
    toggleDownloadHandler(fileHash){
        if(fileHash){
            //单个文件下载的时候
            this.hashArray = [fileHash];
        }
        this.setState({toggleDownload : !this.state.toggleDownload});
    }

    /**
     * 全部下载实现函数
     */
     onDownloadAllHandler(){
         //获取选中需要下载文件的数组
         var filterRecords = this.state.records.filter( record => record.isSelected);
         if(filterRecords.length < 1){
             return;
         }
         //获取需要下载文件的哈希数组
         this.hashArray = filterRecords.map(record => record.record.hashcode);
         this.toggleDownloadHandler();
     }
    /**
     * 构建对话框
     */
    buildDowloadType(options) {
        return <Download  {...options} />
    }

    choseTypesSuccessHandler(types){
        //关闭显示框
        this.toggleDownloadHandler();
        //进行下载
        //1、通过this.hashArray  types;
        var postData = {};
        this.hashArray.forEach(function(item) {
            postData[item]= types;
        });
        //真实下载
        var strPostData = JSON.stringify(postData);
        console.log(strPostData, "开始下载");
        var url = '/v1/transfer/user/'+this.userId+'/transferfile/downloads/'+strPostData; 
        var server = serverurl.convertApi;//"http://api.dev.agoodme.com";//serverurl.api;
        window.open(server + "" + url);
    }

    cancelChoseTypeHandler(){
        //关闭显示框
        this.toggleDownloadHandler();
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
        this.setState({togglePreview : !this.state.togglePreview});
    }
    
    /**
     * 构建对话框
     */
    buildPreview(options) {
        //显示预览框，和隐藏和显示body的滚动条
        if(this.state.togglePreview){
            document.body.style.overflow = "hidden";
            return <Preview  {...options} recordsClass="convert-records-preview" />
        }else{
            document.body.style.overflow = "";
            return null;
        }
    }
    /**
     * 构建对话框
     */
    buildCommonDialog(options) {
        //显示预览框，和隐藏和显示body的滚动条
        if(this.state.isShowDialog){
            document.body.style.overflow = "hidden";
            return <CommonDialog  {...options}  />
        }else{
            document.body.style.overflow = "";
            return null;
        }
    }
    /**
     * 移动分组
     * @param evt 事件
     */
    onMoveGroupHandler(evt){
        evt.preventDefault();
        evt.stopPropagation();
         //获取选中需要移动文件的数组
         var filterRecords = this.state.records.filter( record => record.isSelected);
         if(filterRecords.length < 1){
             return;
         }
         var _fileHashs = filterRecords.map((record, index) => {
             return record.record.hashcode;
         });
         var _content =  this.state.groupNames;
         this.setState({
            isShowDialog : true,
            dialogType : THREE,
            dialogContent : _content,
            dialogPosition : [evt.clientX, evt.clientY],
            fileHashs : _fileHashs
        });
        
    }
    /**
     * 批量删除处理函数
     * @param evt 事件
     */
    onBatchRemoveHandler(evt){
        evt.preventDefault();
        evt.stopPropagation();
         //获取选中需要删除文件的数组
         var filterRecords = this.state.records.filter( record => record.isSelected);
         if(filterRecords.length < 1){
             return;
         }
         var _fileHashs = filterRecords.map((record, index) => {
             return record.record.hashcode;
         });
        this.setState({
            isShowDialog : true,
            dialogType : ZERO,
            dialogContent : ["确定删除选中的文档吗？"],
            dialogPosition : [evt.clientX, evt.clientY],
            fileHashs : _fileHashs
        });
    }

    /**
     * 单个删除处理函数
     * @param evt 事件
     */
    onRemoveHandler(fileHash, evt){
        console.log(fileHash, 8666);
        this.setState({
            isShowDialog : true,
            dialogType : ZERO,
            dialogContent : ["确定删除选中的文档吗？"],
            dialogPosition : [evt.clientX, evt.clientY],
            fileHashs : [fileHash]
        });
    }
    /**
     * 替换封面
     */
    onReplaceCoverHandler(fileHash, data, evt){
        var self = this;
        //可能需要去显示替换封面
        var fileBase64 = data.cropedUrl;
        // 去掉data:image/png;base64,
        fileBase64 = fileBase64.substring(fileBase64.indexOf(",") + 1);
        this.setState({
            fileHashs : [fileHash]
        });
        //TODO 去上传文件
        var obj = {"cover_data" : fileBase64};
        MakeWebAPIUtils.getRESTfulData({
            url: "/v1/transfer/transferfile/" + fileHash + "/replacecover",
            type: "PUT",
            data: obj,
            success: (data) => {
                if(data.result){
                    self.localOprationRecords("update", {cover_img : data.result.cover_img + "?"+Date.now()});  //预防浏览器的缓存，添加一个时间戳
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
     * 组件是否应当渲染新的props或state，返回false表示跳过后续的生命周期方法，
     */
    shouldComponentUpdate (nextProps, nextState){
        return true;
    }
    /**
     * 删除单个分组
     * @param name 分组名称
     */
    onDeleteGropItemHandler(name, fileHashs, evt){
        this.groupName = name;
        this.setState({
            isShowDialog : true,
            dialogType : FIRST,
            dialogContent : ["确定删除分组吗？"],
            dialogPosition : [evt.clientX, evt.clientY],
            fileHashs : fileHashs
            // currentGroup : DefaultName      //删除了之后就是默认分组
        });
    }
    /**
     * 增加分组
     */
    onAddGropItemHandler(evt){
        this.setState({
            isShowDialog : true,
            dialogType : SECOND,
            dialogContent : ["新建分组"],
            dialogPosition : [evt.clientX, evt.clientY]
        });
    }

    /**
     * 根据组名进行筛选
     * @param name 组名称
     */
    onFilterRecordsHandler(name){
        this.setState({
            currentGroup : name
        });
        //筛选过滤
        this.filterRecordsByGroupName(name);
    }
    /**
     * 对话框确定回调
     * @param name 分组的名称
     */
    commonDialogOkHnadler (name){
        switch(this.state.dialogType){
            case ZERO:   //删除文档 name = undefined;
                console.log(name, "删除文档");
                this.deleteRecords();
                break;
            case FIRST:  //删除分组 name = undefined;
                console.log(name, "删除分组");
                this.deleteGroupName();
                break;
            case SECOND: //添加分组 
                console.log(name, "添加分组");
                if(name){
                    this.addGroupName(name);
                }
                break;
            case THREE:  //移动分组
                console.log(name, "移动分组");
                this.updateRecords(name);
                break;
        }
        this.setState({
            isShowDialog : false
        });
    }
    /**
     * 对话框取消回调
     */
    commonDialogCancelHnadler (){
        this.setState({isShowDialog : false});
    }
    /**
     * 删除转档文档记录
     */
    deleteRecords(){
        var self = this;
        var _fileHashs = this.state.fileHashs;
        var obj = {"hashcodes" : _fileHashs}
        MakeWebAPIUtils.getRESTfulData({
            url: "/v1/transfer/transferfiles/movetrash",
            type: "PUT",
            data: obj,
            success: (data) => {
                console.log(data, "删除文档记录");
                if(data.result){
                    self.localOprationRecords("delete");
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
     * 批量更新转档记录
     * @param {string|name} 更新的分组名称
     */
    updateRecords(name){
        var self = this;
        var _fileHashs = this.state.fileHashs;
        var obj = {"old" : "", "new" : name,"hashcodes" : _fileHashs}
        MakeWebAPIUtils.getRESTfulData({
            url: "/v1/transfer/transferfiles/classification",
            type: "PUT",
            data: obj,
            success: (data) => {
                console.log(data, "批量更新文档记录");
                if(data.result){
                    self.localOprationRecords("update", {classification : name});
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
     * 删除分组记录
     */
    deleteGroupName(){
        var self = this;
        if(this.groupName){
            var _index = self.state.groupNames.indexOf(this.groupName);
            MakeWebAPIUtils.getRESTfulData({
                url: "/v1/transfer/transfers/customclassification/" + this.groupName,
                type: "DELETE",
                success: (data) => {
                    console.log(data, "删除分组");
                    var oldNames = self.state.groupNames;
                    oldNames = self.removeItem(oldNames, self.groupName);
                    //add by fishYu 2016-12-14 增加选中
                    var curIndex = _index - 1 > 0 ? _index - 1 : 0;
                    var _oldFilter = oldNames[curIndex];
                    _oldFilter = _oldFilter == "默认分组" ? "def" : _oldFilter;
                    self.setState({
                        groupNames : oldNames,
                        currentGroup : _oldFilter
                    });
                    
                    self.filterRecordsByGroupName(_oldFilter);
                },
                error: function (err) {
                    console.log(err, "删除分组");
                },
                userID: self.userId,   //"yuegy_yujin"       //用户ID
                urlType: true       //表示启用新的转档服务器
            });
        }
        if(this.state.fileHashs.length > 0){    //更新所有记录的组名到默认组
            // 本地修改 modify by fishYu 2016-12-14
            
            self.localOprationRecords("update", {classification : "def", isSelected : false});
        }
    }
    /**
     * 通用函数，删除数组中某个元素
     */
    removeItem(arr, item) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] === item) {
                arr.splice(i, 1);
            }
        }
        return arr;
    }

    /**
     * 删除分组记录
     * @param name 增加的分组名称
     */
    addGroupName(name){
        var self = this;
        MakeWebAPIUtils.postRESTfulData({
            url: "/v1/transfer/transfers/customclassification/",
            data: {"name" : name},
            success: (data) => {
                var oldNames = self.state.groupNames;
                oldNames.push(name);
                self.setState({
                    groupNames : oldNames,
                    currentGroup : name
                });
                //add by fishYu 2016-12-14 增加分组的时候默认选中
                self.filterRecordsByGroupName(name);
            },
            error: function (err) {
                console.log(err, "增加组");
            },
            userID: self.userId,   //"yuegy_yujin"       //用户ID
            urlType: true       //表示启用新的转档服务器
        });
    }
    /**
     * 本地更新数据,执行完批量修改，删除后
     * @param {string|opt} 本地记录的操作，delete, update,
     * @param {object|obj}  需要更新的对象{"cover_img": "url"}  {"classification": "name"}
     */
    localOprationRecords(opt, obj){
        obj = obj || {};
        if(opt == "delete"){
            var _records = this.allRecords.filter((record, index) => {
                return this.state.fileHashs.indexOf(record.record.hashcode) < 0;
            });
            this.allRecords = _records;
        }else if(opt == "update"){
            var _records = this.allRecords.map((record, index) => {
                if (this.state.fileHashs.indexOf(record.record.hashcode) > -1){
                    for(var key in obj){
                        // if( record.record.hasOwnProperty(key)){      //有可能初始的时候没有这个字段, 此处不能做判断
                            record.record[key] = obj[key];
                        // }
                        if(key == "isSelected"){
                            record[key] = obj[key];
                        }else{
                            record.record[key] = obj[key];
                        }
                    }
                }
                return record;
            });
            this.allRecords = _records;
        }
        console.log(this.allRecords, this.state.currentGroup, 866666);
        //TODO  可能是否需要把勾选去掉
        this.filterRecordsByGroupName(this.state.currentGroup);
    }
    /**
     * 购买转档次数
     * @param {object|evt} 事件
     */
    onBuyCountsHandler(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        var self = this;
        MakeWebAPIUtils.getGoodPrice([BookTransferCount], true,"service").then((data) => {
            data = data.length > 0  ? data[0] : null;
            if(!data) return;
            var expire = !!data.end_at ? data.end_at : "永久";
            var cartData =  { name: data.name, icon: data.icon, price: (data.price / 100.0).toFixed(2), sum: "1", qixian: expire, id: data.id, custom_code: data.custom_code };
            self.setState({
                cartData : [cartData]
            });
            self.refs["cartView"].changeDialogStatus(true,0);
        });
    }
    /**
     * 购买成功回调
     * @param {number|status}  1 表示购买框确定点击回调，    2、表示付款完成点击回调
     * @param {object|obj}  status为1时，返回购买对象    2、时返回订单完成对象
     */
    onPayOk(status, obj){
        var count = 0;  //购买的条目
        if(status == 1){
            this.buyCount = obj. items[0].count;        //TODO 这里只是获取了一条
        }else if(status == 2 ){
            this.setState({
                totalCounts : this.state.totalCounts + this.buyCount,
                remainCounts : this.state.remainCounts + this.buyCount,
            });
        }
    }
};