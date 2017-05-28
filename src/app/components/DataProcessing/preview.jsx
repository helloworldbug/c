import React,{Component} from "react";
var serverurl = require("../../config/serverurl");
var ContextUtils = require('../../utils/ContextUtils');
export default class Preview extends Component{
    componentDidMount(){

    }
    render(){
        var server = serverurl.convertApi;
        var userId = ContextUtils.getCurrentUser().id;
        // server = encodeURI(server);
        return (
            <div className={`book-preview-dialog ${this.props.recordsClass}`}>
           <div className="content">
           <h1 >在线内容确认 <span className="tips">仅作内容确认参考，并非电子书阅读最终效果</span><span className="close" onClick={this.props.onClose}></span></h1>
           {/*<div className="book-preview-exit" onClick={this.props.onClose}></div>*/}
           <iframe src={"/views/tfpreview/index.html?id="+this.props.fileHash+"&userId="+userId+"&server="+server} scrolling="no"/>
           </div> 
            </div>
        )
    }
}