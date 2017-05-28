/**
 * @component invite.jsx
 * @description 邀请好友
 * @time 2015-12-17
 * @author 杨建
 **/

'use strict';

var React = require('react'),
    ReactDOM=require("react-dom"),
    Base = require('../../utils/Base'),
    Dialog = require('../Common/Dialog');

var MePC  = require('../../lib/MePC_Public'),
    Share = require('./Share'),
    copy  = require("../../../vendor/zeroclipboard/ZeroClipboard"),
    GlobalFunc = require("../Common/GlobalFunc"),
    Images = require('../Common/Image');

// require common mixins
var ImageModules = require('../Mixins/ImageModules'); 

var Invite = MePC.inherit(React.createClass({

    mixins: [ImageModules],

    getInitialState(){
        return {
           typeTabIndex : 1,
           btnDisabled: false,
           isShowSuccess: false
        };
    },

    /*
    *复制分享链接
    */ 
    generatorCopyContent: function() {
        return  (
            <div className="invite-copy">
                <h3 className="title">复制分享链接，分享给你的好友，邀请他们加入ME</h3>
                <div className="invite-copy-content">
                    <p>我在用ME创作H5作品，这里有海量的模版，操作简单方便，你也来试试吧，官网地址： http://www.agoodme.com/</p>
                    <div className="invite-copy-icon">

                        <Share ref="Shares" /> 
                     
                        <div className="fr">
                            <a href="javascript:;" id="invite-copy" className="invite-copy-btn" data-clipboard-target="linkContent" onClick={this.copyTip} >复制分享链接</a>
                            <a id="linkContent" href='http://agoodme.com'>http://www.agoodme.com/</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, 

    /*
    * 通过Email、微信或qq发送邀请
    */
    genertorInviteType: function(){

        return (
            <div className="invite-type">
                <h3 className="title">通过微信或QQ发送邀请</h3>
                <div className="invite-type-list">
                    <ul>
                        {/*<li className={this.state.typeTabIndex==1 ? 'active' : ''} onClick={this.changeTypeTabIndex.bind(this, 1)}>Email</li>*/}
                        <li className={this.state.typeTabIndex==1 ? 'active' : ''} onClick={this.changeTypeTabIndex.bind(this, 1)}>QQ</li>
                        <li className={this.state.typeTabIndex==2 ? 'active' : ''} onClick={this.changeTypeTabIndex.bind(this, 2)}>微信</li> 
                    </ul>
                </div>
                <div className="invite-type-content">
                    <ul>
                    {/*<li className={this.state.typeTabIndex==1 ? this.state.isShowSuccess ? "active send-email-succ" : "active" : ""}>
                                            <div className="invite-email-form">
                                                <input type="text" ref="email" className="fl invite-txt" placeholder="请输入好友的邮箱" />
                                                <input type="button" disabled={ this.state.btnDisabled } onClick={ this.handleClickSendInvite } className="fr invite-btn" value="发送邀请" />
                                            </div>
                                            <div className="invite-scuess">
                                                邮件发送成功！
                                            </div>
                                        </li>*/}
                    <li className={this.state.typeTabIndex==1 ? 'active' : ''}>
                        <dl>
                            <dt><Images src={this.defineImageModules()['invite-code']} width="230" height="230" /></dt>
                            <dd>使用QQ扫描二维码，分享给QQ好友</dd>
                        </dl>
                    </li>
                    <li className={this.state.typeTabIndex==2 ? 'active' : ''}>
                        <dl>
                            <dt><Images src={this.defineImageModules()['invite-code']} width="230" height="230" /></dt>
                            <dd>使用微信扫描二维码，分享到朋友圈或好友</dd>
                        </dl>
                    </li>
                    </ul>
                </div>
            </div>
        );

    },

    /**
     * 发送邀请
    */
    handleClickSendInvite: function () {
        var emailQuickExpr = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
            email = ReactDOM.findDOMNode(this.refs.email).value;

        var context = this;

        if (!(emailQuickExpr.test(email))) {
            GlobalFunc.addSmallTips("请输入正确的邮箱格式", 0.8);
            return;
        }

        context.setState({ btnDisabled: true });
        
        Base
            .async(
                'http://ts.agoodme.com/Send-Email/mail.php',
                'POST',
                { 'address': email, 'from_nick': Base.getCurrentUser().attributes.user_nick }
            )
            .then(function (res) {

                // 发送成功
                if (res.state === 200) {
                    context.setState({ isShowSuccess: true });
                    
                    Base.delayExec((function () {
                        this.setState({
                            btnDisabled: false,
                            isShowSuccess: false
                        });
                    }).bind(context), 2000);
                } else {
                    GlobalFunc.addSmallTips('发送失败，请重新再发送一次', 0.8);
                    context.setState({
                        btnDisabled: false
                    });
                }
            })
            .catch(function () {

            });
    },

    render: function () {　
        if (!Base.isLogin()) {
            Base.linkToPath('login');
            // return;
        }

        return (
            <div className="invite-box">
                <h3 className="invite-title">选择以下任意一种方式，邀请你的好友加入ME吧！</h3> 
                {/* 复制分享链接 */}
                { this.generatorCopyContent() }

                { /*通过Email、微信或qq发送邀请*/ }

                { this.genertorInviteType() }

            </div>
        );
    },

    componentDidMount : function() {
        copy.config({swfPath: "http://www.agoodme.com/vendor/zeroclipboard/ZeroClipboard.swf"});
        new copy(document.getElementById("invite-copy")); 

    },

    changeTypeTabIndex:function(typeIndex){
        
        /*if (typeIndex !== 1) {
            ReactDOM.findDOMNode(this.refs.email).value = '';
        }*/

        this.setState({
            typeTabIndex:typeIndex
        });
    }, 

    copyTip:function(){
        GlobalFunc.addSmallTips("复制完成", 0.8);
    }

}));

module.exports = Invite;
