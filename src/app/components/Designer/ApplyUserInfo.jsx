/**
 * @module      DesignerApplyUserInfo
 * @description 3.0设计师模块 -> 申请
 * @time        2015-10-19
 * @author      misterY 
*/

'use strict';
// require core module
var React = require('react'),
    ReactDOM = require("react-dom"),
    Router = require('react-router'),
    Link = Router.Link;

var Base = require('../../utils/Base');

var Input = require('../Common/Input'),
    FormMixin = require('../Mixins/Form'),
    Dialog = require('../Common/Dialog');

// define DesignerApplyUserInfo component
var DesignerApplyUserInfo = React.createClass({

    mixins: [FormMixin],

    getInitialState() {
        return {
            upData: false,
            codeTime: '获取验证码',
            canClick: true
        }
    },

    trim(str) {
        return (str.toString()).replace(/(^\s*)|(\s*$)/g, "");
    },
    checkEmail(email) {
        if( undefined == email || "" == email ){
            return false;
        }
        return !!(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(email));
    },
    checkPhone(phone) {
        if( undefined == phone || "" == phone ){
            return false;
        }
        return !!(/^1[1-9]\d{9}$/.test(phone));
    },
    checkTrim(val){
        return ""!=val;
    },

    checkInfoValidity() {
        var dom = ReactDOM.findDOMNode(this),
            $dom = $(dom);

        var nameVal = this.refs.name.state.value;
        var jobVal = this.refs.job.state.value;
        var phoneVal = this.refs.phone.state.value;
        var emailVal = this.refs.Emain.state.value;
        var codeVal = this.refs.code.state.value;

        var phone = $dom.find(".invitePhone"),
            $info = $dom.find(".invitePhoneErrinfo");

        var email = $dom.find(".inviteEmain"),
            $emailInfo = $dom.find(".inviteEmainErrinfo");

        if( 
            !this.checkTrim(nameVal)||
            !this.checkTrim(jobVal)||
            !this.checkTrim(emailVal)||
            !this.checkTrim(phoneVal) ||
            !this.checkTrim(codeVal)
        ){
            this.showDialog(" 请输入信息 ");
        }else if ( !this.checkEmail(emailVal) ){
            $emailInfo.show();
            email.focus();
            return false;
        }else if ( !this.checkPhone(phoneVal) ) {
            $emailInfo.hide();
            $info.show();
            phone.focus();
            return false;
        }else{
            $info.hide();
            $emailInfo.hide();

            return {
                user_nick: nameVal,
                job: jobVal,
                vipphone: phoneVal,
                email: emailVal,
                approved_status: 1,
                user_type: 1,
                designer_submittpls: this.props.DesignerAction.getActionTpl()
            };
        }
    },

    sendPhoneMsg() {
        if(!this.state.canClick)
            return;

        var phone = $(".invitePhone"),
            phoneVal = phone.val();
        if( !!this.checkPhone(phoneVal) ){
            this.props.DesignerAction.sendPhoneMsg(phoneVal,function(){
                this.beginSetInterval();
            }.bind(this),function(err){
                this.setState({
                    codeTime: "获取失败"
                },function(){
                    this.showDialog(err.message);
                });
            }.bind(this));
        }else{
            this.showDialog("请输入正确的手机号");
        }
    },

    beginSetInterval() {
        var _this = this;
        
        Base.countDowning(secend => {
            _this.setState({
                codeTime: secend,
                canClick: false
            })
        }, () => {
            _this.setState({
                canClick: true,
                codeTime: "获取验证码"
            })
        });
    },

    /*
     * 提交资料
    */
    goPrivilegoClickFn() {
        var _userInfo = this.checkInfoValidity();
        if( !!_userInfo ){
            if(
                this.props.DesignerAction.addUserInfo(_userInfo)
            ){
                this.nextProgres();
            } else {
                this.showDialog(" 请填写资料 ");
            }
        }
    },

    /*
     * 下一步
    */
    nextProgres() {
        var $dom = $(ReactDOM.findDOMNode(this)),
            _code = $dom.find(".inviteCode"),
            _codeVal = _code.val();

        var _this = this;
        var phone = $(".invitePhone"),
            phoneVal = phone.val();
        this.props.DesignerAction.verifyPhoneMsgCode(phoneVal,gi_codeVal,function(){

            _this.setState({
                upData: true
            },function(){

                if (Base.setUserInfo(_this.props.DesignerAction.getUserInfo())) {
                    _this.props.nextProgres(3);
                } else{
                    this.showDialog("程序出错");
                }

            });

        },function(){
            _this.showDialog("验证码输入有误");
            _code.focus();
        });
    },

    getHtml() {
        if (!this.state.upData){
            return (
                <div className="begin-privilege"> 
                    <p> 
                        <Input ref="name" name="name" className="inviteUserName" placeholder="姓名：" type="text"/>
                    </p>
                    <p> 
                        <Input ref="job" name="job" className="inviteJob" type="text" placeholder="职业：" />
                    </p>
                    <p> 
                        <Input ref="Emain" name="Emain" placeholder="邮箱：" className="inviteEmain" type="text" />
                        <span style={{display:"none"}} className="inviteEmainErrinfo ErrInfo">*邮箱格式有误，请重新填写</span>
                    </p>
                    <p> 
                        <Input ref="phone" name="phone" placeholder="手机号：" className="invitePhone" type="text"/>
                        <span style={{display:"none"}} className="invitePhoneErrinfo ErrInfo">*手机号输入有误，请重新填写</span>
                    </p>
                    <p> 
                        <Input ref="code" name="code" placeholder="验证码：" className="inviteCode f_l" type="text" />
                        <span onClick={this.sendPhoneMsg} className="getCode f_l tc c_pointer">{this.state.codeTime}</span>
                    </p>
                    <p className="goPrivilego"> 
                        <Input id="goPrivilego" className="submit btn-navy btn-fill-vert-o" type="button" value="下一步" onClick={this.goPrivilegoClickFn} />
                    </p>
                </div>
            )
        }
        // else{
        //     return (
        //         <div className="begin-privilege auto">
        //             <div style={{paddingTop:"44px"}}></div>
        //             <div>
        //                 正在提交数据
        //             </div>
        //         </div>
        //     )
        // }
    },

    popupDialog(state,h,t) {
        this.refs.dialog.setState({
            appearanceState: state,
            sureIsHide: h,

            title: t
        }); 
    },
    showDialog(title) {
        this.popupDialog(true,true,title);
    },
    hideDialog() {
        this.popupDialog(false,true);
    },
    render() {
        var _h = this.getHtml();
        return (
            <div className="inner">
                <Dialog ref="dialog" sureFn={this.hideDialog} title={"请输入信息"} />
                {_h}
            </div>
        );
    }
});

// export DesignerApplyUserInfo component
module.exports = DesignerApplyUserInfo;
