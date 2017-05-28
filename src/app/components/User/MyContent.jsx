/**
 * @description 个人中心组件--我的内容
 * @time 2017-04-20
 * @author gli-cq-gonglong
 */

'use strict';

// require core module
var React = require('react'),
    ReactDOM=require("react-dom"),
    $ = require('jquery'),
    Base = require('../../utils/Base');
 import moment from 'moment'; 
var serverurl = require("../../config/serverurl"); 
const TabIndex = require('../../constants/MeConstants').UserTab;
var GlobalFunc = require('../Common/GlobalFunc');
var Pagination = require("../../lib/jquery.paging");
var _ = require("../../../vendor/underscore/underscore");

const MOCK_TEMP_DATA = {
    data: [
    {
        mddate_id: 100,
        page_id: 2001,
        article_id: 3001,
        title: "文章标题-1",
        url: "地址标题-1",
        totalCount: 0,
        count_textarea: 30,
        Chapter:{
            ChapterId:4001, // 自增序号
            ChapterImg:"图片地址",  // 图片地址
            ChapterName:"篇章名称", // 篇章名称
            QuoteId:"引用对象",     // 引用对象
            TimeCreate:"1495433485", // 创建时间,1495443485262
            TimeUpdate:"1495443385", // 更新时间
        }
    }
    ]
};

// define MyContent component
//export default class CollectionContent extends React.Component{
class MyContent extends React.Component{
 
    constructor(props) {
        super(props);
        this.state = {
            'isLoading':true,
            'refresh':false,
            'searchKeyWord':"",  // {String} 搜索内容关键词
            'pageSize': 20,       // {number} 每页显示记录条数
            'rowList': [20,40,60], // {array} 下拉框，每页显示记录条数
            'currentPage':1,  // {number} 当前页码.
            'operateCount':0,
            'data': {
                //'flg': false,
                'totalCount': 0,   // {number} 总记录数
                'records': [],     // {array} 记录数列表
                /*
                {
                    'id':'1000',
                    'catalog':'Baidu',
                    'title':'baidu-title',
                    'form':' www.baidu.com', 
                    'time':'2017-04-05 10:00'
                }
                */
            }
        };
        
        // 带合成的 "已选中"的数据
        this.selectedData = [];
        
        console.info( "[constructor]-->");
        // 合成作品
        this.handleClickComposeProduct = this.handleClickComposeProduct.bind(this);
        // 创作作品
        this.handleClickCreateContent = this.handleClickCreateContent.bind(this);
        // 搜索
        this.handleClickSearchBtn = this.handleClickSearchBtn.bind(this);
        // 每页显示--下拉框.
        this.handleChangePageSize = this.handleChangePageSize.bind(this);
        // 删除-单条数据
        this.handleClickDelSingle = this.handleClickDelSingle.bind(this);
        // 删除-多条数据
        this.handleClickDelMulti = this.handleClickDelMulti.bind(this);
        // 查看-单条数据
        this.handleClickDetail = this.handleClickDetail.bind(this);
        // 全选
        this.handleClickSelAll = this.handleClickSelAll.bind(this);
        // 反选
        this.handleClickSelReverse = this.handleClickSelReverse.bind(this);
        // 单选
        this.handleClickSelSingle = this.handleClickSelSingle.bind(this);
    }
    
    componentDidMount (nextProps) {
        //debugger;
        // JSON.stringify(this.state), + JSON.stringify(this.state)
        console.info( "[component-componentDidMount]" );
        var that = this;
        // 页面初始化--加载数据
        this.handleQuery();
        
        var tmpDataStr = sessionStorage.getItem("ME_MY_CONTENT_PAGE") || "";
        this.selectedData = (!!tmpDataStr) ? JSON.parse(tmpDataStr):[];
        this._setChkState();

    }
    //componentWillMount
    componentWillMount (nextProps) {
        // + JSON.stringify(this.state)
        console.info( "[component-componentWillMount]-->" + this.state.pageSize );
    }
    
    componentWillUnmount (nextProps) {
        // + JSON.stringify(this.state)
        console.info( "[component-componentWillUnmount]-->"+ this.state.pageSize );
    }
    //componentWillUpdate
    componentWillUpdate (nextProps) {
        // + JSON.stringify(this.state)
        console.info( "[component-componentWillUpdate]-->"+ this.state.pageSize  );
        // this.handleQuery();
    }
    
    componentDidUpdate (){
        // that.state.totalCount
        console.info( "[component-componentDidUpdate]--> pageSize:" + this.state.pageSize + ",totalCount:" + this.state.data.totalCount );
        
        $("#myContent_search_txt").val( this.state.searchKeyWord );
        // 组件完成更新后立即调用。在初始化时不会被调用
        this._setChkState();
        
        this.innerSetPagingObj();
    }
    
    render() {
        console.info( "[component-render]-->"+ this.state.pageSize  );
        
        var that = this;
        var listData = this.state.data.records;
        
        var showTrue = "";
        var showFalse = "";
        
        if(typeof listData == 'undefined' || listData.length == 0) {
            showTrue = {display: "none"};
            showFalse = {};
        } else {
            showTrue = { };
            showFalse = { display: "none"};
        }
        
        var loading = true ? (<div className="loading">
            <div className="loading-box">
                <div className="loading-boll"></div>
                <span>加载中...</span>
            </div>
        </div>) : null;
        
         return (<div className="authorized gli-mycontent">
            <div className="title">
                <span className="txt">我的内容-页面逻辑</span>
                <input id='myContent_search_txt' placeholder="输入内容关键词进行搜索" className="input-txt" />
                <input id='myContent_search_btn' onClick={this.handleClickSearchBtn} value="搜索" type="button" className="comm-btn search-btn" />
                
            </div>
            <div className="content clearfix" style={{padding:'0 10px 20px 10px'}}>
            
            {/* style={showTrue} */}
            <div id="mycontent_true" >
                <div className="oparate-bar clearfix">
                
                    <div className="btn-groups clearfix">
                        <span className="sm-btn" onClick={this.handleClickSelAll}>全选</span>
                        
                        <span className="sm-btn" onClick={this.handleClickSelReverse}>反选</span>
                        <span className="sm-btn" onClick={this.handleClickDelMulti}>删除</span>
                    </div>
                    
                    <div className="select-pagesize">
                    
                        <select value={this.state.pageSize} onChange={this.handleChangePageSize}>
                            <option value="10">每页显示10条</option>
                            <option value="20">每页显示20条</option>
                            <option value="40">每页显示40条</option>
                            <option value="60">每页显示60条</option>
                        </select>
                    </div>
                    
                    <div id="paging_top" className="paging-plug gli-paging">翻页组件</div>
                </div>
                
                <div className="comm-tbl"  >
                    <div className="head clearfix">
                        <div className="item" style={{width:'30px'}} >  </div>
                        <div className="item" style={{width:'30%'}} >内容分类</div>
                        <div className="item" style={{width:'20%'}}>内容标题</div>
                        <div className="item" style={{width:'15%'}}>内容来源</div>
                        <div className="item" style={{width:'15%'}}>入库时间</div>
                        <div className="item" style={{width:'15%'}}>操作</div>
                    </div>
                    <div className="body" style={showTrue}>
                    
                    { listData.map(function(listItem){
                           return <div className="row-data" key={listItem.article_id} id={listItem.article_id} >
                                <div className="item" style={{width:'30px'}} >
                                    <input type="checkbox" onClick={that.handleClickSelSingle} />
                                </div>
                                 {/*内容分类*/}
                                <div className="item" style={{width:'30%'}} >{listItem.span_name}</div>
                                 {/*内容标题*/}
                                <div className="item" style={{width:'20%'}}>{listItem.title}</div>
                                {/*内容来源*/}
                                <div className="item" style={{width:'15%'}}>{listItem.url || "无"}</div>
                                {/*入库时间*/}
                                <div className="item" style={{width:'15%'}}> { moment( parseInt(listItem.Chapter.TimeCreate+"000", 10) ).format('YYYY-MM-DD HH:mm')  } </div>
                                <div className="item" style={{width:'15%'}}>
                                    <span className="sm-txt-btn" onClick={that.handleClickDetail}>查看</span>
                                    <span className="sm-txt-btn" onClick={that.handleClickDelSingle}>删除</span>
                                </div>
                            </div>
                       })
                    }
                    </div>
                </div>
                 {/*comm-tbl -- End*/}
                
                {/* {loading} */}
                    <div id="mycontent_false" style={showFalse}>
                        <div style={{'paddingTop':"50px"}} >
                            {loading}
                        </div>
                        
                    </div>
                
                <div className="oparate-bar clearfix">
                {/*底部操作条*/}
                    <div className="btn-groups clearfix">
                        <span className="sm-btn" onClick={this.handleClickSelAll}>全选</span>
                        <span className="sm-btn" onClick={this.handleClickSelReverse}>反选</span>
                        <span className="sm-btn" onClick={this.handleClickDelMulti}>删除</span>
                    </div>
                    
                    <div id="paging_bottom" className="paging-plug gli-paging">翻页组件</div>
                </div>
                
                
                <div>
                    <div style={{margin:'0 auto', width:'260px' }}>
                    <input id='myContent_compose_btn' onClick={this.handleClickComposeProduct} value="合成作品" type="button" className="comm-btn btn-size-100x30 " />
                    <input id='myContent_creact_btn' onClick={this.handleClickCreateContent} value="创作内容" type="button" className="comm-btn btn-size-100x30" />
                    </div>
                    
                </div>
            </div>
            {/* mycontent_true End */} 
            
            
            </div>
            
         </div>
         );
    }
    
    
    /**
     * 合成作品.
     *
     */
    handleClickComposeProduct(){
        
        var filterSelectedAry = [];
         
        // 过滤
        for(var i = 0, len = this.selectedData.length; i < len; i++){
            if( this.selectedData[i].selected ){
                this.selectedData[i].order_time = filterSelectedAry.length;
                filterSelectedAry.push( this.selectedData[i] );
            }
        }
        
        var selectedStr = JSON.stringify(filterSelectedAry );
        sessionStorage.setItem("ME_MY_CONTENT_PAGE", selectedStr );
        
        
        var templateType = TabIndex.COMPOSE_PRODUCT;
        Base.linkToPath(`/user/tab/${templateType}`);
    }
    
    /**
     * 创作内容.
     *
     */
    handleClickCreateContent(){
        console.info("创作内容 >>state:\n"+ JSON.stringify(this.state) );
        this.setState({refresh: !this.state.refresh});
        
        console.info("selectedData: \n"+ JSON.stringify(this.selectedData) );
        
    }
    
    /**
     * "搜索"按钮.
     *
     */
    handleClickSearchBtn(){
        var keyword = $("#myContent_search_txt").val() || "";
                
        if(!keyword) {
            alert("请输入'关键词'");
        } else {
            this.setState({searchKeyWord: keyword});
            this.handleQuery( {searchKeyWord: keyword} );
        }
    }
    
    /**
     * "翻页"按钮.
     *
     */
    handleClickPage(page){
        this.setState({currentPage: page});
        this.handleQuery();
    }
    
    /**
     * 改变每页显示记录条数.
     *
     */
    handleChangePageSize(event){
        // event.target.value;
        
        var pageSizeVal = event.target.value
        this.setState({pageSize: pageSizeVal});
        this.handleQuery( {pageSize: pageSizeVal} );
    }
    
    /**
     * "全选".
     *
     */
    handleClickSelAll(){
        var that = this;
        var contentObj = $("#mycontent_true");
        contentObj.find("input[type='checkbox']").each(function(index,item){
            $(this).prop("checked", true);
            that._handleSetSelectedData({'id': $(this).parent().parent().attr("id"), 'selected': true });
        });
    }
    
    /**
     * "反选".
     *
     */
    handleClickSelReverse(){
        var that = this;
        var contentObj = $("#mycontent_true");
        var tempState = false;
        
        contentObj.find("input[type='checkbox']").each(function(index,item){
            tempState = !$(this).prop("checked");
            $(this).prop("checked", tempState );
            that._handleSetSelectedData({'id': $(this).parent().parent().attr("id"), 'selected': tempState });
        });
    }
    
    /**
     * "单选".
     *
     */
    handleClickSelSingle(event){
        
        var id = event.target.parentNode.parentNode.id;
        var tempState = event.target.checked;
        
        this._handleSetSelectedData({'id': id, 'selected': tempState });
    }
    

    /**
     * "查看"单条记录.
     * 
     */
    handleClickDetail( event ){
        var id = event.target.parentNode.parentNode.id;
        console.info("[查看-单条数据] >>" + id);
    }
    
    /**
     * 删除单条记录.
     * 
     */
    handleClickDelSingle( event ){
        
        var id = event.target.parentNode.parentNode.id;
        this._handleClickDel({'ids':id});
    }
    
    /**
     * 删除多条.
     * 注: 需要记录翻页前 选中的数据.
     * 
     */
    handleClickDelMulti( event ){
        
        var id = "";
        if(typeof this.selectedData != 'undefined' && this.selectedData.length > 0){
            var tmpIds = [];
            _.map( this.selectedData, function(item){
                if(item.selected) {
                    return tmpIds.push( item.id );
                }
            } );
            id = tmpIds.join(',');
        }
        
        console.log("handleClickDelMulti ->> ids:" +id);
        
        if(!!id) {
            this._handleClickDel({'ids':id});
        }
    }
    
    /**
     * "删除"单条 OR 多条数据.
     *
     * @param {Object} paramObj.ids  待删除记录 "1001" OR "1001,1002,1003"
     *
     */
    _handleClickDel(paramObj){
        
        var that = this;
        var serverHost = serverurl.api;
        var delUrl = "/del"; // TODO
        $.ajax({
            type: "POST",
            url: serverHost + delUrl,
            dataType: "json",
            data: {
                'ids': paramObj.ids,
            },
            contentType: "application/json",
            success: function (result) {
               console.info("[我的内容] 删除->success \n" + JSON.stringify(result));
               // TODO 删除成功，刷新页面
            },
            error: function (result) {
                console.warn("[我的内容] 删除-> error \n" + JSON.stringify(result));
                
                innerDelSuc();
            }
            
        });
        
        function innerDelSuc() { // TODO-DEL-开发中临时测试
            var idsAry = paramObj.ids.split(",");
            // mycontent_true
            var contentObj = $("#mycontent_true");
           
            that.setState({currentPage: that.state.currentPage+1});
        };
    }
    
    /**
     * 搜索,翻页,改变"每页显示记录数" -- 
     *
     * @param {Object} opts
     * @param {String} opts.searchKeyWord  搜索关键词
     * @param {String} opts.pageSize       每页显示记录数
     * 
     */
    handleQuery(opts) {
        
        var tmpOpts = {
            'searchKeyWord':"" || this.state.searchKeyWord,
            'pageSize':"" || this.state.pageSize,
        };
        
        if( !!opts ){
            opts["pageSize"] = (typeof opts["pageSize"] != "undefined") ? opts.pageSize : tmpOpts.pageSize;
            opts["searchKeyWord"] = (typeof opts["searchKeyWord"] != "undefined") ? opts.searchKeyWord : tmpOpts.searchKeyWord;
        } else {
            opts = tmpOpts;
        }
        
        this.setState({'data':{
            'totalCount': this.state.data.totalCount,
            'records':[]
        }});
        
        var that = this;
        this._excuteQuery({
            'searchKeyWord': opts.searchKeyWord,
            'pageSize': opts.pageSize,
            'currentPage': this.state.currentPage,
            'success': function (result) {
                
                that.setState({
                    'data': {
                        'totalCount':parseInt(result[0].totalCount, 10),
                        'records':result
                    }
                });

            },
            'error': function (result) {

            }
        });
    }
    
    
    /**
     * 查询-我的内容.
     * 
     * @param {Object} paramObj
     * @param {String} paramObj.searchKeyWord  搜索关键词
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
                
                'act':"article",  // 文章列表
                'size': paramObj.pageSize,
                'p':paramObj.currentPage,
                'user_id':GlobalFunc.getUserObj().objectId,
                'search': paramObj.searchKeyWord,
                
                //'keyword': paramObj.searchKeyWord,
                //'pageSize': paramObj.pageSize,
                //'currentPage': paramObj.currentPage,
            },
            timeout: 5000,
            //contentType: "application/json",
            success: function (result) {
               console.info("执行查询->success!! \n" + JSON.stringify(result));
               
               if( typeof paramObj.success == "function" ){
                    paramObj.success(result);
                
                }
            },
            error: function (result) {
                console.warn("执行查询-> error \n" + JSON.stringify(result));
                
                if( typeof paramObj.error == "function" ){
                    paramObj.error();
                }
                
                if(result.statusText == "timeout"){
                    console.warn("TODO-> timeout \n");
                    
                    paramObj.success(MOCK_TEMP_DATA.data);
                    
                }
                
                
            }
            
        });
        
    }
    
    innerSetPagingObj() {
            
            var that = this;
           　// currentPage
            var startPage = that.state.currentPage;
            // that.state.totalCount
            $("#paging_top, #paging_bottom").paging( that.state.data.totalCount, {
                format: '[ <  (q -) nncnn (- p)  > ]',
                lapping: 0,
                page: startPage,
                perpage: that.state.pageSize,
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
     * 设置已选中的数据.
     * 1.已存在的数据, 只改变其选中状态状态;
     * 2.新数据, 直接插入.
     * 
     * @param {array} data
     * @param {String} data[].id          数据id
     * @param {boolean} data[].selected   选中状态, true:已选中, false:未选中.
     *
     */
    _handleSetSelectedData(data) {
        
        console.log("[_handleSetSelectedData]:" + data.id);
        console.log("[this.selectedData]:" + JSON.stringify( this.selectedData ));
        var isExit  = false;
        _.each( this.selectedData, function(item){
            if(item.id == data.id){
                item.selected = data.selected;
                // item.order_time = new Date().getTime();
                isExit = true;
            }
        } );
        
        if(!isExit){
            // this.state.data.records;
            var tmpRecords = this.state.data.records;
            for( var i = 0, len = tmpRecords.length; i < len; i++ ) {
                
                if(tmpRecords[i].article_id == data.id) {
                    
                    this.selectedData.push({
                        'id': tmpRecords[i].article_id,
                        'title': tmpRecords[i].title,
                        'url': tmpRecords[i].url,
                        'time': tmpRecords[i].Chapter.TimeCreate,
                        'selected': true,
                        //'order_time': new Date().getTime()
                        'order_time': this.selectedData.length
                        
                    });
                }
            }
        }
        
    }
    
    /**
     * 页面刷新(翻页)时，根据之前记录的操作已选中数据，设置 checkbox 状态.
     *
     */
    _setChkState(){

        if(typeof this.selectedData != 'undefined' && this.selectedData.length > 0){
            
            var contentObj = $("#mycontent_true");
            var tempData = this.selectedData;
            for(var i = 0, len = tempData.length; i < len; i++){
                if(tempData[i].selected) {
                    contentObj.find("#" + tempData[i].id).find("input[type='checkbox']").prop("checked", true);
                }
            }
        }
       
    }

};

// export MyContent component
module.exports = MyContent;
