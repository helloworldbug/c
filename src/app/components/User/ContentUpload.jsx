/**
 * @description 个人中心组件--内容上传
 * @time 2017-05-23
 * @author gli-cq-gonglong
 */

'use strict';

// require core module
var React = require('react'),
    ReactDOM=require("react-dom"),
    $ = require('jquery'),
    Base = require('../../utils/Base');
 
var serverurl = require("../../config/serverurl"); 
const TabIndex = require('../../constants/MeConstants').UserTab;
var GlobalFunc = require('../Common/GlobalFunc');
var Pagination = require("../../lib/jquery.paging");
var _ = require("../../../vendor/underscore/underscore");

const MOCK_TEMP_DATA = {
    data: [
    {
            'id':'1001',
             'time':"2014-03-23 09:00",
             'fileName':"zhuanghuan",
             'fileType':"docx",
             'state':{
                 'val':"60",
                 'msg':""
             },
             'flg':true,
             'result':"成功",
         },
         {
              'id':'1002',
             'time':"2014-05-23 10:00",
             'fileName':"张江",
             'fileType':"xlsx",
             'state':{
                 'val':"",
                 'msg':"扩展名不符"
             },
             'flg':false,
             'result':"失败",
         }
    ]
};

         
class ContentUpload extends React.Component{
 
    constructor(props) {
        super(props);
        this.state = {
            //'isLoading':true, 
        };
        
        // 带合成的 "已选中"的数据
        this.selectedData = [];
        
        console.info( "[constructor]-->");
        // 合成作品
       //  this.handleClickComposeProduct = this.handleClickComposeProduct.bind(this); 
    }
    
    componentDidMount (nextProps) {
        //debugger;
        // JSON.stringify(this.state), + JSON.stringify(this.state)
        console.info( "[component-componentDidMount]" );
        
    }
    //componentWillMount
    componentWillMount (nextProps) {
        // + JSON.stringify(this.state)
        console.info( "[component-componentWillMount]-->"  );
    }
    
    componentWillUnmount (nextProps) {
        // + JSON.stringify(this.state)
        console.info( "[component-componentWillUnmount]-->" );
    }
    //componentWillUpdate
    componentWillUpdate (nextProps) {
        // + JSON.stringify(this.state)
        console.info( "[component-componentWillUpdate]-->" );
        // this.handleQuery();
    }
    
    componentDidUpdate (){
        // that.state.totalCount
        console.info( "[component-componentDidUpdate]--> "  );
        
    }
    
    render() {
        console.info( "[component-render]-->"  );
        
        var listData = MOCK_TEMP_DATA.data;
        
        var loading = false ? (<div className="loading">
            <div className="loading-box">
                <div className="loading-boll"></div>
                <span>正在加载中...</span>
            </div>
        </div>) : null;
        
         return (<div className="authorized gli-mycontent">
                    <div className="title">
                        <span className="txt">内容上传</span>
                        
                    </div>
                    <div className="content clearfix" style={{padding:'50px 10px 20px 10px'}}>
                    
                        <div className="comm-tbl">
                            <div className="head clearfix">
                                
                                <div className="item" style={{width:'30%'}} >上传时间</div>
                                <div className="item" style={{width:'20%'}}>文件名称</div>
                                <div className="item" style={{width:'15%'}}>扩展名</div>
                                <div className="item" style={{width:'15%'}}>状态</div>
                                <div className="item" style={{width:'15%'}}>结果</div>
                            </div>
                            <div className="body">
                            {
                                listData.map(function(listItem){
                                    return <div className="row-data"  key={listItem.id} id={listItem.id} >
                                    {/*上传时间*/}
                                    <div className="item" style={{width:'30%'}} >{listItem.time}</div>
                                    {/*文件名称*/}
                                    <div className="item" style={{width:'20%'}} >{listItem.fileName}</div>
                                    {/*扩展名*/}
                                    <div className="item" style={{width:'15%'}} >{listItem.fileType}</div>
                                    {/*状态*/}
                                    <div className="item" style={{width:'15%'}} >11111</div>
                                    {/*结果*/}
                                    <div className="item" style={{width:'15%'}} >{listItem.result}</div>
                                </div>
                                })
                            }
                                
                                
                            </div>
                            
                            
                        </div>
                        {/* 表格结束 */}
                            {loading}
                    </div>
                </div>
                );
    }

};

// export ContentUpload component
module.exports = ContentUpload;
