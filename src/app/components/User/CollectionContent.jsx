/**
 * @description 个人中心组件--内容采集
 * @time 2017-04-20
 * @author gli-cq-gonglong
 */

'use strict';

// require core module
var React = require('react'),
    $ = require('jquery'),
    Base = require('../../utils/Base');
     
    import DatePicker from 'react-datepicker';
    import moment from 'moment'; 
    
    var serverurl = require("../../config/serverurl");
    var GlobalFunc = require('../Common/GlobalFunc');
    var Pagination = require("../../lib/jquery.paging");
    import 'react-datepicker/dist/react-datepicker.css';

const MOCK_DATA = {
    CONTENT_LIST : [
    {
        'id':'a-001', // {String} 内容id, 便于 "查看","重新采集", "重新合成"	
        'timeStart':"2017-04-20", // {String} 采集开始时间, 24小时制, 默认 08:00
        'timeEnd':"2017-04-20",
        'sourceSite':"http://www.gli.cn",
        'collectState':true, // {boolean}, 采集结果, true: 成功, false:失败	
        'ComposeState':1, // {String}, 合成结果, 0:"失败", 1: "成功",2："未合成",3："不合成";	
    },
    {
        'id':'a-002',
        'timeStart':"2017-04-21", // {String} 采集开始时间, 24小时制, 默认 08:00
        'timeEnd':"2017-04-21",
        'sourceSite':"http://www.baidu.com",
        'collectState':false, // {boolean}, 采集结果, true: 成功, false:失败	
        'ComposeState':0, // {String}, 合成结果, 0:"失败", 1: "成功",2："未合成",3："不合成";	
    },
    {
        'id':'a-003',
        'timeStart':"2017-04-10", // {String} 采集开始时间, 24小时制, 默认 08:00
        'timeEnd':"2017-04-10",
        'sourceSite':"www.sina.com",
        'collectState':true, // {boolean}, 采集结果, true: 成功, false:失败	
        'ComposeState':2, // {String}, 合成结果, 0:"失败", 1: "成功",2："未合成",3："不合成";	
    },
    
    ],
    
    data : [
        {
            son_collection_ids: "10120",
            son_date_end: 1494342000,
            son_date_start: 1494259200,
            son_error: "数据解析完成",
            son_id : "10120",
            son_output : "",
            son_push_ids : [100,102],
            son_status : "完成",//完成
            son_update : "1495505253",
            son_url : "paper.前端测试数据.com.cn",
            totalCount : "2",
            user_id : "5827d01f128fe1005ccbba6b",
        },
        {
            son_collection_ids: "10121",
            son_date_end: 1494342000,
            son_date_start: 1494259200,
            son_error: "数据解析完成",
            son_id : "10121",
            son_output : "",
            son_push_ids : null,
            son_status : "",//完成
            son_update : "1495505253",
            son_url : "paper.前端测试数据.com.cn",
            totalCount : "2",
            user_id : "5827d01f128fe1005ccbba6b",
        },
        {
            son_collection_ids: "10125",
            son_date_end: 1494342000,
            son_date_start: 1494259200,
            son_error: "数据解析完成",
            son_id : "10125",
            son_output : "",
            son_push_ids : "",
            son_status : "",//完成
            son_update : "1495505253",
            son_url : "paper.前端测试数据.com.cn",
            totalCount : "2",
            user_id : "5827d01f128fe1005ccbba6b",
        }
    ]
};
    
// define CollectionContent component
export default class CollectionContent extends React.Component{
 

    constructor(props) {
        super(props);
        this.state = {
            sourceSite: "", // {String} 内容采集来源, e.g "http://www.gli.com".
            startDate:"",  // {String} 采集开始日期{yyyy-MM-dd}, 默认 客户端当前日期.
            endDate: "",    // {String} 采集结束日期{yyyy-MM-dd}, 默认 客户端当前日期.
            
            isAutoCompose: false, // {boolean} 是否自动合成作品, true: 是, false: 否.
            startCollectionFlg: false, // {boolean} 开始采集
            
            totalCount:0,   // {number} 总记录数.
            pageSize: 10,   // {number} 每页可显示数据.
            currentPage:0,  // {number} 当前页码.
            currentPageCount:0,  // {number} 当前页记录数.
            taskList:[],
        };
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        
        this.handleBlurSource = this.handleBlurSource.bind(this);
        this.handleChangeAutoCompose = this.handleChangeAutoCompose.bind(this);
        this.handleStartCollection = this.handleStartCollection.bind(this);
    }
    
    
    componentDidMount(){
        // React DOM载入完毕,初始化默认值
        $("#isAutoCompose-"+ ((this.state.isAutoCompose)? "1":"0") ).attr("checked", true);
        
        this.handleClickPage(1);
    }
    
    componentDidUpdate (){
        console.info( "[component-componentDidUpdate]--> pageSize:" + this.state.pageSize + ",totalCount:" + this.state.taskList.length);
        
        console.info("[component] startDate:" + this.state.startDate + ",moment:" + moment(this.state.startDate ).format('YYYY-MM-DD HH:mm') );
        
        this.innerSetPagingObj();
    }
    
    
    /**
     * 生成单条记录[自动合成作品结果]字段的 HTML标签.
     *
     * @param {object|string|null} type
     *    成功:[]
     *    未合成:null
     *    失败:其他
     *
     */
    generateComposeHtml(type){
        
        var itemStyle = {width:'25%'};
        
        /*
        if(type == "2") {
           return <div className="item" style={itemStyle} >未合成</div>
        } else if(type == "3") {
            return <div className="item" style={itemStyle} >不合成</div>
        } else if(type == "0") {
            return <div className="item" style={itemStyle} ><span className="warn-txt">失败</span><span className="sm-btn">重新合成</span></div>
        } else if(type == "1") {
            return <div className="item" style={itemStyle} ><span>成功</span><span className="sm-btn">查看</span></div>
        } else {
            return <div className="item" style={itemStyle} >*</div>
        }
        */
        
        if(toString.apply( type ) === '[object Array]') {
            return <div className="item" style={itemStyle} ><span>成功</span><span className="sm-btn">查看</span></div>
        } else if( null == type ){
            return <div className="item" style={itemStyle} >未合成</div>
        } else {
            return <div className="item" style={itemStyle} ><span className="warn-txt">失败</span><span className="sm-btn">重新合成</span></div>
        }
        
    }
    
    render() {
       
       var isProcessBarHide = (this.state.startCollectionFlg) ? { }:{display: "none"};
       var isDataListHide = (!this.state.startCollectionFlg) ? { } : {display: "none"};

        //var listData = MOCK_DATA.CONTENT_LIST;
        var listData = this.state.taskList;
        var that = this;
        
        var showListFlg = (listData.length == 0);
        var loading = showListFlg ? (<div className="loading">
            <div className="loading-box">
                <div className="loading-boll"></div>
                <span>加载中...</span>
            </div>
        </div>) : null;
        
        var creating = true ? (<div className="loading">
            <div className="loading-box">
                <div className="loading-boll"></div>
                <span>合成中...</span>
            </div>
        </div>) : null;
        
        
       return (
       
         <div className="authorized gli-warehouse">
            <div className="title">
                <span>内容采集</span>
            </div>
            <div className="content clearfix">
            
            
                <div className="setting-item"> 
                    <div className="item-name" id="setting_setting_time">
                        <span>输入内容采集来源:</span>
                    </div>
                    <div className="item-context">
                        <input id="source_site" onBlur={this.handleBlurSource} placeholder="http://www.gli.com" />
                    </div>
                </div>
                
                <div className="setting-item"> 
                    <div className="item-name" id="setting_setting_time">
                        <span>设置采取时间:</span>
                    </div>
                    <div className="item-context">
                        <DatePicker id="date_1" selected={this.state.startDate} onChange={this.handleStartDateChange} placeholderText="开始时间" maxDate={moment()} />
                        <span> -- </span>
                        <DatePicker id="date_2" selected={this.state.endDate} onChange={this.handleEndDateChange} placeholderText="结束时间" maxDate={moment()} />
                    </div>
                </div>
                
               <div className="setting-item"> 
                    <div className="item-name">
                        <span>采集后是否自动合成作品:</span>
                    </div>
                    <div className="item-context">
                        <label htmlFor="isAutoCompose-1">是<input onChange={this.handleChangeAutoCompose} id="isAutoCompose-1" type="radio" name="isAutoCompose" value="1" /></label>
                        <label htmlFor="isAutoCompose-0">否<input onChange={this.handleChangeAutoCompose} id="isAutoCompose-0" type="radio" name="isAutoCompose" value="0" /></label>
                    </div>
                </div>
                
                <div className="setting-item">
                    <input id='colletion_ok_btn' onClick={this.handleStartCollection} className="comm-btn clearfix" type="button" value="添加采集任务" style={{margin:'0 auto'}} />
                       
                </div>
                 {creating}
                
                <div style={isDataListHide}>
                    <div className="tbl-list">
                        <div className="head clearfix">
                        
                            <div className="item" style={{width:'100%', borderBottom:'1px solid #fff'}}>采集任务列表</div>
                        </div>
                        <div className="head clearfix">
                        
                            <div className="item">采集时间</div>
                            <div className="item" style={{width:'30%'}}>采集来源</div>
                            <div className="item" style={{width:'25%'}}>采集结果</div>
                            <div className="item" style={{width:'25%'}}>自动合成作品结果</div>
                        </div>
                        <div className="body clearfix">
                            
                            { listData.map(function(dataItem){
                                return <div className="row-data clearfix" key={dataItem.son_id}>
                                {/* 采集时间 */}
                                
                                <div className="item">{ moment(dataItem.son_date_start ).format('YYYY-MM-DD')}  -- {moment( dataItem.son_date_end ).format('YYYY-MM-DD')}</div>
                                {/* 采集来源 */}
                                <div className="item" style={{width:'30%'}}>{dataItem.son_url}</div>
                                {/* 采集结果 */}
                                { (dataItem.son_status=="完成")? (<div className="item" style={{width:'25%'}}>成功</div>):(
                                <div className="item" style={{width:'25%'}}><span className="warn-txt">失败</span> <span className="sm-btn">重新采集</span></div>) }
                                {/* 自动合成作品结果 */}
                                {that.generateComposeHtml(dataItem.son_push_ids)}
                                
                                </div>
                            }) 
                            }
                            
                        </div>
                    </div>
                    {/* 表格数据结束! */}
                    <div className="setting-item clearfix">
                        <div id="paging_bottom" className="paging-plug gli-paging" style={{ float: 'right' }}>翻页组件</div>
                    </div>
                    
                    {loading}
                    
                </div>
                
            </div>
         </div>
         );
    }
    
    /**
     * "翻页"按钮.
     *
     */
    handleClickPage(page){
        
        var that = this;
        this.setState({currentPage: page});
        
        this._excuteQuery({
            pageSize: this.state.pageSize,
            currentPage: page,
            success: function(result){
                //var tmp = result.concat( MOCK_DATA.data );
                that.setState({taskList: result});
            },
            error: function(result){
                that.setState({taskList: MOCK_DATA.data});
            }
        });
    }
    
     /**
     * 查询-我的内容.
     * 
     * @param {Object} paramObj
     * @param {number} paramObj.pageSize       每页显示数据条数
     * @param {number} paramObj.currentPage    当前页码
     * @param {function} paramObj.success      回调-成功
     * @param {function} paramObj.error        回调-失败
     *
     */
    _excuteQuery(paramObj) {
        
        var that = this;
        var serverHost = serverurl.press;

        $.ajax({
            type: "GET",
            url: serverHost,
            dataType: "json",
            data: {
                'act': "son_list",
                'pageSize': paramObj.pageSize,
                'currentPage': paramObj.currentPage,
                'user_id':  GlobalFunc.getUserObj().objectId,
            },
            timeout: 5000,
            success: function (result) {
               console.info("执行查询->success \n" + JSON.stringify(result));
               
               if( typeof paramObj.success == "function" ){
                    paramObj.success(result);
                }
            },
            error: function (result) {
                console.warn("执行查询-> error \n" + JSON.stringify(result));
                if( typeof paramObj.error == "function" ){
                    paramObj.error();
                }
                
            }
            
        });
        

    }
        
    innerSetPagingObj() {
            
        var that = this;
            var startPage = that.state.currentPage;
            $("#paging_bottom").paging( this.state.taskList.length , {
                format: '[ <  (q -) nncnn (- p)  > ]',
                lapping: 0,
                page: startPage,
                perpage:this.state.pageSize,
                onSelect: function (page) {
                    
                    // 初始化翻页组件时,会自动触发一次
                    if(startPage == page) {
                        startPage = -1;
                    } else {
                        that.handleClickPage(page);
                    }
                    
                },
                onFormat: function (type) {

                    switch (type) {
                    case 'block': // n and c

                        if (this.value == this.page) {
                            return '<a href="#" class="active">' + this.value + '</a>';
                        } else {
                            return '<a href="#">' + this.value + '</a>';
                        }

                    case 'next': // >
                        return '<a href="#">&gt;</a>';
                    case 'prev': // <
                        return '<a href="#">&lt;</a>';
                    case 'first': // [
                        return '<a href="#">首页</a>';
                    case 'last': // ]
                        return '<a href="#">尾页</a>';
                        // right
                    case 'right': // (- p)
                        if (this.page >= (this.value - 2)) {
                            return '';
                        }
                        return '<a href="#">' + this.value + '</a>';

                    case 'leap':
                        //if (this.active)
                        return "";

                    case 'fill':
                        
                        if (this.active) {
                            // return "***";
                            return "<a href='#'>...</a>";
                        }
                    }
                    return "";
                }
            });
        }
    
    
    /**
     * 点击[采集后是否自动合成作品]单选按钮, 保存状态.
     *
     */
     handleChangeAutoCompose(event){
         
         var stateKey = event.target.name;
         var value = parseInt(event.target.value, 10);
       　
         this.setState({ isAutoCompose: !!value });
         
     }
     
    /**
     * 焦点移出[内容采集来源]输入框时, 保存期状态.
     *
     */
     handleBlurSource(event){
         var value = event.target.value;
         this.setState({ sourceSite: value });
     }
     /**
      * 点击"开始时间"按钮
      *
      */
     handleEndDateChange(date){
         console.log("[handleEndDateChange]:" + date);
         this.setState({ endDate: date });
     }
     /**
      * 点击"结束时间"按钮
      *
      */
     handleStartDateChange(date){
         console.log("[handleStartDateChange]:" + date);
         this.setState({ startDate: date });
     }
     /**
      * 点击"开始采集"按钮
      *
      */
     handleStartCollection(){
         // TODO-参数合法性验证.
         //验证输入
         
         if( !this.state.sourceSite ){
             alert("请 [输入内容采集来源]");
             return;
         }
         
        
         if(!this.state.startDate || !this.state.endDate){
             // this.setState({ startDate: "", endDate:"" });
             alert("请 [设置采取时间]");
             return;
         }
         
         
         // this.setState({ startCollectionFlg: !this.state.startCollectionFlg });
         console.log("开始采集:" + JSON.stringify(this.state));
         
         var serverHost = serverurl.press;
         
        $.ajax({
            type: "GET",
            url: serverHost,
            dataType: "json",
            data: {
                'act': "press",
                'url': this.state.sourceSite,
                's_date': moment( this.state.startDate ).format('YYYY-MM-DD:HH'),
                'e_date': moment( this.state.endDate ).format('YYYY-MM-DD:HH'),// YYYY-MM-DD HH:mm
                'user_id':  GlobalFunc.getUserObj().objectId,
            },
            timeout: 5000,
            success: function (result) {
               console.info("执行查询->success \n" + JSON.stringify(result));
               
            },
            error: function (result) {
                console.warn("执行查询-> error \n" + JSON.stringify(result));
                
            }
            
        });
         
     }

 

}

