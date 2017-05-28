/**
 * @module      DesignerCode
 * @description 3.0设计师模块
 * @time        2015-10-19
 * @author      misterY 
*/

'use strict';
// require core module
var React = require('react'),
    ReactDOM = require("react-dom");
import {Link} from 'react-router'
var Base = require('../../utils/Base'),
    Input = require('../Common/Input'),
    Dialog = require('../Common/Dialog');

var ImageModules = require('../Mixins/ImageModules');

// define User component
var DesignerCode = React.createClass({

    mixins: [ImageModules],
    /**
     * 跳转到 router
    */
    goUrl(a_router,param,query) {
        Base.linkToPath(a_router,param,query);
    },

    getInitialState() {
        return {
        }
    },

    checkTrim(val){
        return ""!=val;
    },
    checkPhone(phone) {
        if( undefined == phone || "" == phone ){
            return false;
        }
        return !!(/^1[1-9]\d{9}$/.test(phone));
    },

    
    checkInfoValidity() {
        var dom = ReactDOM.findDOMNode(this),
            $dom = $(dom);

        var nameVal = this.refs.name.state.value;
        var jobVal = this.refs.job.state.value;
        var phoneVal = this.refs.phone.state.value;
        var codeVal = this.refs.code.state.value;

        var $phoneInfo = $dom.find(".phoneErrorInfo");

        if( 
            !this.checkTrim(nameVal)||
            !this.checkTrim(jobVal)||
            !this.checkTrim(phoneVal) ||
            !this.checkTrim(codeVal)
        ){
            this.showDialog("请输入信息");
            return;
        }

        if( !this.checkPhone(phoneVal) ){
            $phoneInfo.show();
            this.showDialog("手机号错误，请重新填写");
            return;
        }
        $phoneInfo.hide();

        return {
            job: jobVal,
            user_nick: nameVal,
            vipphone: phoneVal,
            invite_code: codeVal,
            user_type: 1,
            approved_status: 2
        }
    },

    /*
     * 验证邀请码
    */
    checkCode(code,ok,err){
        //根据输入的邀请码判断邀请码的使用状况
        if (""==code||undefined==code) return;
        var query = new fmacloud.Query("pc_invitecode"); 
        query.equalTo("invite_code", code); 
        query.first({
            success: function (obj) {
                if ( !!obj ) {
                    var status = obj.get("code_status");
                    var sucessjson = "";
                    if (status==0) {
                        sucessjson = { "success": true, "error_code": status, "message": "邀请码可使用！" };
                    } else if (status == 1) {
                        sucessjson = { "success": false, "error_code": status, "message": "邀请码已经被使用！" };
                    } else if (status == 2) {
                        sucessjson = { "success": false, "error_code": status, "message": "邀请码已经被禁用！" };
                    }
                    ok(sucessjson);
                }else{
                    err();
                }
            },
            error: err
        }); 
    },
    /*
     * 提交资料
    */
    goPrivilegoClickFn() {
        var dom = ReactDOM.findDOMNode(this),
            $dom = $(dom);

        var $codeInfo = $dom.find(".codeErrorInfo");
        var _userInfo = this.checkInfoValidity(),
            _this = this;
        if( !!_userInfo ){
            this.checkCode(_userInfo.invite_code,function(o){
                if( !!o.success ){
                    $codeInfo.hide();
                    // 提交用户资料
                    _this.designerSubmitInfo(_userInfo,function(){
                        _this.forceUpdate();
                    },function(){
                        this.showDialog("激活码已使用");
                    });
                }else{
                    $codeInfo.html("*"+o.message);
                    $codeInfo.show();
                }
                
            },function(err){
                $codeInfo.html("*邀请码错误，请重新填写");
                $codeInfo.show();
            });
        }
    },
    /**
     * 提交设计师的用户信息
    */
    designerSubmitInfo(options, cb_ok, cb_err){
        var real_name = options.user_nick||"",
        job = options.job||"",
        vipphone = options.vipphone||"",
        invite_code = options.invite_code||"";
        var currentUser = fmacloud.User.current(); //获取当前登录用户信息
        if (currentUser) {
            currentUser.set("user_type", 1);//用户类别设置为 1设计师类别
            currentUser.set("job", job);
            currentUser.set("approved_status", 2); //使用验证码的时候直接设置为 通过
            currentUser.set("vipphone", vipphone);
            currentUser.set("user_nick", real_name);
            currentUser.save(null, {
                success: function (obj) {
                    if (obj) {
                    //修改邀请码为已使用
                    var query = new fmacloud.Query("pc_invitecode");
                    query.equalTo("invite_code", invite_code);
                    query.first({
                        success: function (obj_code) {
                            if (obj_code) {
                                obj_code.set("code_status", 1);//设置邀请码为已使用1
                                obj_code.save(null, {
                                    success: function(){
                                        cb_ok(obj);
                                    },
                                    error: cb_err
                                });
                            } else {
                                cb_ok(obj);
                            }
                        },
                            error: cb_err
                        });
                    }
                },
                error: function (error) { }
            });
        }
    },

    getHtml() {
        if( !Base.isLogin() ){
            this.showDialog("请先登录");
            this.goUrl("/login");
        }
        var _userStatus = Base.getUserInfo("approved_status");
        switch (parseInt(_userStatus)){
            default:
            case 0:
                return{h:(
                    <div className="invite-tab">
                        <p>
                            <Input ref="code" type="text" placeholder="邀请码:" />
                            <span style={{display:'none'}} className="codeErrorInfo error">*邀请码错误，请重新填写</span>
                        </p>
                        <p><Input ref="name" type="text" placeholder="姓　名:" /></p>
                        <p><Input ref="job" type="text" placeholder="职　业:" /></p>
                        <p>
                            <Input ref="phone" type="text" placeholder="手机号:" />
                            <span style={{display:'none'}} className="phoneErrorInfo error">*手机号错误，请重新填写</span>
                        </p>
                        <p><Input onClick={this.goPrivilegoClickFn} type="button" className="submit" value="立即申请" /></p>
                    </div>
                ), t:true}
                break;
            case 1:
                return {h:(
                    <div>
                        资料正在审核
                    </div>
                ), t:true}
                break;
            case 2:
                return {h :(
                    <div className="ok-privilege "> 
                        <span className="okPrivilegeTitle">
                            <img src={this.defineImageModules()['designer_success']} width="786" height="46" />
                        </span>
                        <p className="invite-p-link">
                            <Link className="btn-navy btn-fill-vert-o" target="_blank" to="/make">去做新作品</Link>
                            <Link className="btn-navy btn-fill-vert-o" to="/discovery">去看看作品</Link>
                        </p> 
                    </div>
                ), t:false}
                break;
        }
    },
    render() {
        var _h = this.getHtml().h;
        var style = {
            display: (this.getHtml().t)?"block":"none"
        }
        return (
            <div className="designer-module">
                <Dialog ref="dialog" sureFn={this.hideDialog} title={"请输入信息"} />
                <p style={style} className="section-title">
                   {/*<img src="../assets/images/designer/ds.png"/>*/}
                   <img src={this.defineImageModules()['designer_invite']} width="160" height="27" />
                </p>
                <div className="ds-invite">
                    {_h}
                </div>
            </div>
        )
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
    }
});

// export DesignerCode component
module.exports = DesignerCode;
