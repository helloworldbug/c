/**
 * Created by GYY on 2016/8/4.
 * 导入文章-限微信公众号文章
 */
'use strict';
var React = require('react');
var ReactDOM = require("react-dom");
var serverurl = require("../../../config/serverurl");
var Dialog = require('../../Common/Dialog');
require("../../../../assets/css/importArticle.css");
var ImportArticle = React.createClass({
    getInitialState:function(){
        return {
            errMsg:"&nbsp;" //空字符是为了占位
        }
    },
    //点击预览
    clickPreview:function(){
       var self = this;
        var linkHref = ReactDOM.findDOMNode(self.refs["linkHref"]).value.trim();
        if(this.velifiLink(linkHref)){
            window.open(linkHref, "aa","width=500,height=800","_blank");
        }
    },
    //取消导入
    cancelImport:function(){
        this.props.hide();
    },
    //点击导入
    clickImport:function(){
        var self = this;
        //验证地址
        var userId = 0;
        var linkHref = ReactDOM.findDOMNode(self.refs["linkHref"]).value.trim();
        if(this.velifiLink(linkHref)){
            var url = "/v1/sm/user/"+userId+"/pushing/article/import?access_token=";
            var server = serverurl.api;   //"http://api.dev.agoodme.com";//
            var contentType = "application/json";
            var data = {type:"weixin",url:linkHref};
            $.ajax({
                type       : "POST",
                url        : server + "" + url,
                data        : JSON.stringify(data),
                contentType: contentType,
                success    : function (result) {
                    if(result.article)
                        self.props.ok(result.article);
                    else{
                        self.setState({errMsg:"*文章导入失败"})
                    }
                },
                error      : function (msg) {
                    self.setState({errMsg:"*文章导入失败"})
                },
                dataType   : "json"
            });
        }
    },
    //验证地址
    velifiLink:function(linkHref){
        var self = this;
        if(linkHref == ""){
            self.setState({errMsg:"*请输入微信内容链接"})
            return false;
        }else if (linkHref.indexOf("http://mp.weixin.qq.com/") != 0){
            self.setState({errMsg:"*该链接不符合微信公众号文章格式"})
            return false;
        }
        self.setState({errMsg:"&nbsp;"})
        return true;
    },
    render:function(){
        var self = this;
        return (<div className="select-dialog">
                    <div className="import-dialog">
                        <div className="import-title">导入微信图文<span>导入图文消息时，请确认版权所有者给予使用权</span><div id="close-import" onClick={self.cancelImport}></div></div>
                        <input type="text" placeholder="请输入微信内容的链接" id="import-href" ref="linkHref"/>
                        <div className="errMsg" dangerouslySetInnerHTML={{__html:this.state.errMsg}}></div>
                        <div id="import-btns">
                            <div className="btn-item" onClick={self.cancelImport}>取消</div>
                            <div className="btn-item" onClick={self.clickImport}>确认</div>
                            <div className="btn-item" onClick={self.clickPreview}>预览</div>
                        </div>
                    </div>
                </div>);
    }
});
module.exports = ImportArticle;