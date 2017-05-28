/**
 * @description 个人中心组件--合成作品/生成作品
 * @time 2017-04-24
 * @author gli-cq-gonglong
 */

'use strict';

// require core module
var React = require('react'),
    ReactDOM=require("react-dom"),
    $ = require('jquery'),
    Base = require('../../utils/Base');
var serverurl = require("../../config/serverurl");
var GlobalFunc = require('../Common/GlobalFunc');
    
var _ = require("../../../vendor/underscore/underscore");
const TabIndex = require('../../constants/MeConstants').UserTab;

const MOCK_TEMP_DATA = {
    template: [
    {
        'template_id':100,
        'template_name':"A1",
        'template_cover':"https://www.baidu.com/img/bd_logo1.png",
    },
    {
        'template_id':101,
        'template_name':"B1",
        'template_cover':"https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1052407332,1334672880&fm=11&gp=0.jpg",
    }
    ]
};


class ComposeProduct extends React.Component{
 
    constructor(props) {
        super(props);
        
        var tmpDataStr = sessionStorage.getItem("ME_MY_CONTENT_PAGE") || "";
        var tmpData = []
        console.log( "[constructor]-->tmpDataStr:" + tmpDataStr);
        
        if(!!tmpDataStr) {
            tmpData = JSON.parse(tmpDataStr);
            _.sortBy( tmpData, 'order_time' );
        }
         /*{
         'id':'1000',
         'catalog':'Baidu',
         'title':'baidu-title',
         'form':' www.baidu.com',
         'time':'2017-04-05 10:00'
         'order_time':'1493202912241' // 排序用，毫秒.
         }
         */
        
        this.state = {
            'pageState':"0",  // {String} 0: 准备合成资料, 1: 显示合成结果
            'pageData': tmpData,
            'templateData':[],
            
        };
        
        this.handleClickCreateProduct = this.handleClickCreateProduct.bind(this);
        this.handleClickBack = this.handleClickBack.bind(this);
        
        this.handleClickMoveUp = this.handleClickMoveUp.bind(this);
        this.handleClickMoveDown = this.handleClickMoveDown.bind(this);
        this.handleClickDel = this.handleClickDel.bind(this);
        this._updateDataOrder = this._updateDataOrder.bind(this);
    }
    
    componentDidMount (nextProps) {
        //debugger;
        // JSON.stringify(this.state), + JSON.stringify(this.state)
        console.log( "[componentDidMount]--> " );
        this._renderMoveBtns();
        this._renderTemplates();
    }
    
    componentWillUnmount (nextProps) {
        // + JSON.stringify(this.state)
        console.log( "[componentWillUnmount]-->"  );
    }
    
    componentDidUpdate (){
        console.info( "[componentDidUpdate]-->"  );
        // 组件完成更新后立即调用。在初始化时不会被调用
        this._renderMoveBtns();
        
        // 默认设定[第一个]模板.
        $("input[name='sel_templates']").eq(0).attr('checked','true');
       
    }
    
    /**
     * 渲染[模板].
     *
     */
    _renderTemplates(){
        
        var that = this;
        $.ajax({
            type: "GET",
            url: serverurl.press,
            dataType: "json",
            data: {
                'act': "templates",
                //'template_id' : "",
            },
            //contentType: "application/json",
            timeout: 5000,
            success: function (result) {
                // templateData
                console.info("[模板] ->success \n" + JSON.stringify(result));
                that.setState({'templateData': result});
            },
            error: function (result) {
                console.warn("[模板] -> error \n" + JSON.stringify(result));
                
                if(result.statusText == "timeout"){
                    console.warn("TODO-> timeout \n");
                    that.setState({templateData: MOCK_TEMP_DATA.template});
                }
            }
            
        });
    }
    
    /**
     * 渲染上移/下移 按钮.
     * 即: 第一行无"上移", 最后一行无"下移".
     *
     */
    _renderMoveBtns(){
       var dataList = $("#compose_pro_true").find(".comm-tbl .row-data");
       dataList.find(".icon-up").css("visibility","visible");
       dataList.find(".icon-down").css("visibility","visible");
       
       dataList.first().find(".icon-up").css("visibility","hidden");
       dataList.last().find(".icon-down").css("visibility","hidden");
       
    }
    
    render() {
        
        var that = this;
        var pageData = this.state.pageData;
        console.log("[render] ->> pageData:" + JSON.stringify(pageData) );
        
        var showOK = {display:'none'};
        var showNoData = {display:'none'};
        var showResult = {display:'none'};
        
        if( this.state.pageState == "0" ) {
            //0: 准备合成资料, 
            showOK = (pageData.length > 0)? {}:{display:'none'};
            showNoData = (pageData.length > 0)? {display:'none'}:{};
            
        } else if ( this.state.pageState == "1" ) {
            // 1: 显示合成结果
            showResult = {};
            
        }
        
        var tmp_template_flg = (this.state.templateData.length == 0);
        var loading = tmp_template_flg ? (<div className="loading">
            <div className="loading-box">
                <div className="loading-boll"></div>
                <span>加载中...</span>
            </div>
        </div>) : null;
        // var template_show = tmp_template_flg ? {display: "none"} : {};
        
        var template_list = this.state.templateData;
        
         return (<div className="authorized gli-mycontent">
            <div className="title">
                <span className="txt">生成作品</span>
                
            </div>
            <div className="content clearfix" style={{padding:'30px 10px'}}>
                
                <div id="compose_pro_true" style={showOK}>
                
                    <div className="comm-tbl">
                        <div className="head clearfix">
                            <div className="item" style={{width:'30%'}} >内容标题</div>
                            <div className="item" style={{width:'30%'}} >内容来源</div>
                            <div className="item" style={{width:'20%'}} >内容入库时间</div>
                            <div className="item" style={{width:'20%'}} >操作</div>
                        </div>
                        <div className="body">
                        
                            { pageData.map(function( listItem ) {
                                    return <div className="row-data" key={listItem.id} id={listItem.id} data-order-time={listItem.order_time} >
                                        <div className="item" style={{width:'30%'}} > {listItem.title} </div>
                                        <div className="item" style={{width:'30%'}} > {listItem.url} </div>
                                        <div className="item" style={{width:'20%'}} > {listItem.time} </div>
                                        <div className="item" style={{width:'20%'}} >
                                            <div className="clearfix" style={{ margin:'10px auto', width:'100px' }}>
                                                <span className="icon icon-up" title="up" onClick={that.handleClickMoveUp}></span>
                                                <span className="icon icon-down" title="down" onClick={that.handleClickMoveDown}></span>
                                                <span className="icon icon-del" title="del" onClick={that.handleClickDel}></span>
                                            </div>
                                        </div>
                                    </div>
                                })
                                
                            }
                            
                        </div>
                    </div>
                     
                        <div className="setting-item">
                            <div className="item-name">
                                <span>输入作品标题:</span>
                            </div>
                            <div className="item-context">
                                <input id="product_title"  placeholder="请输入作品标题" />
                            </div>
                        </div>
                                      
                        <div className="setting-item">
                            <div className="item-name">
                                <span>上传作品封面:</span>
                            </div>
                            <div className="item-context">
                                <input id=""  placeholder="TODO-上传图片组件" />
                            </div>
                        </div>
                        
                        
                        <div className="setting-item" style={{height:'180px',lineHeight:'180px'}}>
                            <div className="item-name" style={{height:'180px',lineHeight:'180px'}}>
                                <span>选择作品模板:</span>
                            </div>
                            <div className="item-context">
                            
                            {
                                template_list.map(function(listItem){
                                    return <label htmlFor={"template_"+listItem.template_id} >
                                        <img src={listItem.template_cover}/>
                                        {listItem.template_name}<input id={"template_"+listItem.template_id}  type="radio" name="sel_templates" value={listItem.template_id} />
                                    </label>
                                })
                            }
                                
                                {loading}
                            </div>
                        </div>
                         
                    
                    <div>
                        <div style={{margin:'0 auto', width:'260px' }}>
                        <input id='myContent_compose_btn' onClick={this.handleClickCreateProduct} value="生成作品" type="button" className="comm-btn btn-size-100x30 " />
                        
                        <input id='myContent_creact_btn' onClick={this.handleClickBack} value="返回" type="button" className="comm-btn btn-size-100x30" />
                        </div>
                    </div>
                
                </div>
                {/* compose_pro_true End */}
                
            
                <div id="compose_pro_false" style={showNoData} >
                    若无 "合成内容"，不应跳转此页面!-111
                    
                    <p> 上传图片 -- fileChange: function (materialType, materialOwner, event) </p>
                    
                </div>
                {/* compose_pro_false End */}
                
                <div id="compose_pro_result" style={showResult} >
                    <p>您的作品已经合成完毕</p>
                    <p>请点击"我的作品"进行查看.</p>
                    <div style={{ margin:'0 auto',width:'150px' }}>
                        <input id='myContent_creact_btn' value="我的作品" onClick={this.handleClickToMyProduct} type="button" className="comm-btn btn-size-100x30" />
                    </div>
                    
                </div>
                
                {/* compose_pro_result End */}
            
            </div>
            
        </div>
        
         );
    }
    
    /**
     * 生成作品.<br/>
     *
     */
    handleClickCreateProduct(){
        console.log("生成作品-->pageData:\n " + JSON.stringify( this.state.pageData ));
        
        if( $("#product_title").val() == "" ){
            alert("请输入作品标题");
            return;
        }
        
        // serverurl, pageData
        var that = this;
        var tmp_imp_ids = [];
        var tmpData = this.state.pageData;
        for(var i = 0,len = tmpData.length; i < len; i++){
            tmp_imp_ids.push(tmpData[i].id);
        }
        
        $.ajax({
            type: "GET",//GET
            url: serverurl.press,
            dataType: "json",
            data: {
                'act': "tplstart",
                'imp_type': "chapter",
                'imp_ids': tmp_imp_ids.join(",") || "",
                'imp_mid': $("input[name='sel_templates']:checked").val(), // 模板ID, "1"
                'user_id': GlobalFunc.getUserObj().objectId,
                'imp_title': $("#product_title").val(),
                'imp_cover': "",
            },
            success: function (result) {
               console.info("[生成作品] ->success \n" + JSON.stringify(result));
               // TODO 删除成功，刷新页面
               that.setState({pageState: '1'});
            },
            error: function (result) {
                console.warn("[生成作品] -> error \n" + JSON.stringify(result));
                 
            }
            
        });
    }
    
    /**
     * 返回.<br/>
     *
     */
    handleClickBack(){
        console.log("返回-->");
        var templateType = TabIndex.MY_CONTENT;
        Base.linkToPath(`/user/tab/${templateType}`);
    }

    /**
     * 上移.
     *
     */    
    handleClickMoveUp( event ){
        var id = event.target.parentNode.parentNode.parentNode.id;
         console.log("上移-->id:" +id);
         this._updateDataOrder(id, 'up');
    }
    
    /**
     * 下移.
     *
     */    
    handleClickMoveDown( event ){
        var id = event.target.parentNode.parentNode.parentNode.id;
         console.log("下移--id:" +id);
         this._updateDataOrder(id, 'down');
    }
    
    /**
     * 删除单条数据.
     *
     */    
    handleClickDel( event ){
        var id = event.target.parentNode.parentNode.parentNode.id;
         console.log("删除单条数据--id:" +id);
    }
    
    /**
     * 跳转"我的作品".
     *
     */    
    handleClickToMyProduct( event ){
        var templateType = TabIndex.MYPRODUCT;
        Base.linkToPath(`/user/tab/${templateType}`);
    }
    
    /**
     * 改变数据排序.
     * order_time
     * @param id {String} 该数据id, 如: '1002'
     * @param id {String} 移动类型, 如: 'up': 上移, 'down': 下移
     * 
     */
    _updateDataOrder(id, type) {
        var temPageData = this.state.pageData;
        var targetIdx = -1;
        var nextIdx = -1;
        
        var tmpItem = null;
        for (var i = 0, len = temPageData.length; i < len; i++) {
            tmpItem = temPageData[i];
            if(tmpItem.id == id) {
                targetIdx = i;
                break;
            }
        }
        
        if(type == 'up') {
            nextIdx = targetIdx-1;
        }else if(type == 'down') {
            nextIdx = targetIdx+1;
        } else {
            console.warn("[_updateDataOrder]->> 输入类型错误!");
        }
        
        if( targetIdx == -1 || nextIdx == -1) {
            console.error("[_updateDataOrder]->> 交换双方下标错误！ >> [targetIdx]:" + targetIdx + ", [nextIdx]:" + nextIdx);
        } else {
            
            //console.log("[targetIdx]:" + targetIdx + ", [nextIdx]:" + nextIdx);
            //console.log("[Before]:" + JSON.stringify(temPageData) );
            
            var tmpIdx = -1;
            tmpIdx = temPageData[targetIdx].order_time;
            temPageData[targetIdx].order_time = temPageData[nextIdx].order_time;
            temPageData[nextIdx].order_time = tmpIdx;
            var tmpSortedData = _.sortBy( temPageData, 'order_time' );
            
            this.setState({ pageData: tmpSortedData });
        }
        
        
        
    }

};

// export ComposeProduct component
module.exports = ComposeProduct;
