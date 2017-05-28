/**
 * @description 域名绑定
 * @time 2016-05-26
 * @author lifeng
 */

'use strict';

// require core module
var React = require('react');
var Base = require('../../utils/Base');
import {Link} from 'react-router'
var Dialog = require('../Common/Dialog');
var GlobalFunc = require("../Common/GlobalFunc");
var copy  = require("../../../vendor/zeroclipboard/ZeroClipboard");
var Links = [{
    img : require("../../../assets/images/dnslink/wanwang.jpg"),
    href: "http://www.net.cn"
}, {
    img : require("../../../assets/images/dnslink/xinnet.jpg"),
    href: "http://www.xinnet.com/"
}, {
    img : require("../../../assets/images/dnslink/cndns.jpg"),
    href: "http://www.cndns.com"
}, {
    img : require("../../../assets/images/dnslink/ename.jpg"),
    href: "http://www.ename.net/"
}, {img: require("../../../assets/images/dnslink/sundns.jpg"), href: "http://www.sundns.com/"}
];
var divLinks = Links.map((link,index)=> {
    return <a href={link.href} key={index} target="_blank"><img src={link.img}/></a>
})
var DomainBind = React.createClass({
    /**
     * 设置默认域名和输入框域名状态
     * @returns {{editDomain: boolean, user: (*|Object), domain: string}}
     */
    getInitialState   : function(){
        var user = Base.getCurrentUser();
        var defaultDomain="www.agoodme.com/views/share/index.html?id="+user["id"];
        return {editDomain: false, user: user,domain:!!user.get("domain")?user.get("domain"):defaultDomain}
    },

    _editDomain       :function(){
        this.setState({editDomain:true});
    },

    _resetDomain      :function(){
        var user=this.state.user;
        var defaultDomain="www.agoodme.com/views/share/index.html?id="+user["id"];
        this.setState({domain:!!user.get("domain")?user.get("domain"):defaultDomain,editDomain:false})
    },

    /**
     * 保存域名后更新域名输入框状态
     * @private
     */
    _saveDomain       :function(){
        var url=this.state.domain.trim();
        var regex=/([A-Za-z0-9]+(-[A-Za-z0-9]+)*\.)+[A-Za-z]{2,}/g;
        var domain = url.match(regex);

        if(domain == null) {
            this.showDialog({
                title: '域名格式不正确!',
                appearanceState: true,
                sureIsHide: true
            });
            return;
        }else {

            if(Array.isArray(domain)){
                domain= domain[0];
            }

            if(domain == "www.agoodme.com") {
                this.showDialog({
                    title: '请输入您的域名!',
                    appearanceState: true,
                    sureIsHide: true
                });
                return;
            }else {
                var user=this.state.user;
                user.set("domain", domain);
                user.save().then(()=>{
                    var defaultDomain = "www.agoodme.com/views/share/index.html?id=" + user["id"];
                    this.setState({domain: !!user.get("domain") ? user.get("domain") : defaultDomain, editDomain:false})
                })
            }
        }

    },
    _inputDomain:function(e){
        this.setState({domain:e.target.value})
    },
    _domainKeyDown:function(e){
        if(e.keyCode==13){
            this._saveDomain();
        }
    },
    render            : function () {
        var buttons=<div className="right "><span className="save button" onClick={this._saveDomain}>保存</span><span className="cancel button" onClick={this._resetDomain}>取消</span></div>
        var domainContent= <input type="text" value={this.state.domain} onChange={this._inputDomain} onKeyDown={this._domainKeyDown}/>
        if(!this.state.editDomain){
            //域名不可编辑时，显示“设定域名”按钮，输入框不能编辑
            buttons = <div className="right"><span className="setDomain button" onClick={this._editDomain} >设定域名</span></div>;
            domainContent = <span className="domain">{this.state.domain}</span>;
        }

        var context = this;

        return (
            <div className="domainBind">
                {
                    this.buildDialog({
                        appearanceState: false,
                        sureFn: function () {
                            context.showDialog({
                                appearanceState: false
                            });
                        }
                    })
                }
                <div className="domainSetting">
                    <h3 className="title"><span className="panelName">域名绑定</span>
                        {buttons}
                    </h3>
                    <div className="content">
                        <div className="item"><span className="itemName">域名：</span>{domainContent}
                            <div id="copyDomain" data-clipboard-target="domainContent" onClick={this.copyTip} >复制链接</div>
                            <div id="domainContent" style={{display:"none"}}>{this.state.domain}</div>
                        </div>
                    </div>
                </div>
                <div className="domainSuppliers">
                    <h3 className="title"><span className="panelName">域名供应商</span>
                        {//todo 修改链接参数
                        }
                        <Link className="right"  to={"/helper?type=常见问题&index=8"} target="_blank">如何设定域名?</Link>
                    </h3>
                    <div className="content">{divLinks}</div>
                </div>
            </div>
        )
    },

    componentDidMount : function() {
        copy.config({swfPath: "http://wwww.agoodme.com/vendor/zeroclipboard/ZeroClipboard.swf"});
        new copy(document.getElementById("copyDomain"));
    },

    copyTip:function(){
        GlobalFunc.addSmallTips("复制完成", 0.8);
    },

    buildDialog(options) {
        return <Dialog ref="dialog" {...options} hash="/login" />
    },

    showDialog(states) {
        this.refs.dialog.setState(states);
    },
});

module.exports = DomainBind;