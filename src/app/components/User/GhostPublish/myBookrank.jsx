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
var MyBookrankRecord =  require('./myBookrankRecord.jsx');

var ConvertGroup =  require('./convertGroup.jsx');

var ContextUtils = require('../../../utils/ContextUtils');

var CommonDialog = require('./commonDialog.jsx');   //通用的对话框组件
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

export default class MyBookrank extends React.Component{
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
            isShowDialog : false,   //是否显示通用对话框
            dialogType : ZERO,     //通用对话框的类型
            dialogContent : ["确定删除选中的文档吗？"],       //对话框显示的内容值
            dialogPosition : [0, 0], //显示的Top left 位置
            fileHashs : [],    //需要操作的文件集合， 如移动组， 删除
            groupNames : [] //分组名称
        }

        this.hashArray = [];    //文件hash的数组
        this.fileHash = "";
    }
    /**
     *渲染顶部
     */
    renderTitleSection(){
        var buttonClass = this.state.records.some(item => item.isSelected) ? "convert-records-download" : "convert-records-download1" ;
        return (
            <div>
                <div className="convert-records-opration-container" id="my-bookrank-record-title">
                    <span className="convert-records-name">我的书架</span>
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
                _.map(records, (record, index) => <MyBookrankRecord record={record} key={records.length - index} recordIndex={index} />)
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
        return (
            <div>
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
                <div className="convert-records-hint" >{"当前ME Book 转档服务：文件数量上限 5 个/月；流量上限15M/月；单文件<10M；中转空间上限20M；文件自动清理时间15天。"}</div>
                <div className="convert-records-container">
                    <div className="convert-records-container-left">
                        {this.renderTitleSection()}
                        <ul className="convert-records">
                            {this.renderRecordSection(list)}
                        </ul>
                        {this.renderBottomSection(total)}
                    </div>
                    <div className="convert-records-container-right">
                        <ConvertGroup records={this.allRecords}  items={this.state.groupNames} groupType={FIRST} 
                        deleteGroupItem={this.onDeleteGropItemHandler.bind(this)} 
                        addGroupItem={this.onAddGropItemHandler.bind(this)} filterRecords={this.onFilterRecordsHandler.bind(this)}/>
                    </div>
                </div>
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
                        obj.record = item;  //单条的转档数据
                        return obj;
                    });
                    self.allRecords = records;  //第一次查询的时候赋值
                    self.filterRecordsByGroupName(DefaultSelect);
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
            url: "/v1/transfer/readers/customclassification", 
            success: (data) => {
                if (data && data.result) {
                    var classifications = data.result.classifications;
                    var initNames = [];
                    for(var key in classifications){
                        if(key == "def") key = "默认书架";
                        initNames.push(key);
                    }
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
     * 根据分组名称筛选记录
     * @param name 分组名称
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
         var _content =  this.state.groupNames;
         this.setState({
            isShowDialog : true,
            dialogType : THREE,
            dialogContent : _content,
            dialogPosition : [evt.clientX, evt.clientY]
        });
        
    }

    /**
     * 单个删除处理函数
     * @param evt 事件
     */
    onRemoveHandler(fileHash, evt){
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
    onReplaceCoverHandler(fileHash, evt){
        var self = this;
        //可能需要去显示替换封面
        console.log( [fileHash], "替换封面");
        this.setState({
            fileHashs : [fileHash]
        });
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
        _fileHashs = _fileHashs.join(",");
        MakeWebAPIUtils.getRESTfulData({
            url: "/v1/transfer/transferfile/"+_fileHashs+"/cancelsprompt",
            type: "PUT",
            success: (data) => {
                console.log(data, "删除文档记录");
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
            MakeWebAPIUtils.getRESTfulData({
                url: "/v1/transfer/readers/customclassification/" + this.groupName,
                type: "DELETE",
                success: (data) => {
                    console.log(data, "删除分组");
                    var oldNames = self.state.groupNames;
                    oldNames = self.removeItem(oldNames, self.groupName);
                    self.setState({
                        groupNames : oldNames
                    });
                },
                error: function (err) {
                    console.log(err, "删除分组");
                },
                userID: self.userId,   //"yuegy_yujin"       //用户ID
                urlType: true       //表示启用新的转档服务器
            });
        }
        console.log(this.state.fileHashs, 99666);
        if(this.state.fileHashs.length > 0){    //更新所有记录的组名到默认组
            // this.deleteRecords();
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
            url: "/v1/transfer/readers/customclassification/",
            data: {"name" : name},
            success: (data) => {
                var oldNames = self.state.groupNames;
                oldNames.push(name);
                self.setState({
                    groupNames : oldNames
                });
            },
            error: function (err) {
                console.log(err, "增加组");
            },
            userID: self.userId,   //"yuegy_yujin"       //用户ID
            urlType: true       //表示启用新的转档服务器
        });
    }

};