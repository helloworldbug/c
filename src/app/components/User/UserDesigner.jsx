/**
 * @description 个人中心设计师组件
 * @time 2015-9-22
 * @author 刘华
*/

'use strict';

// require core module
var React = require('react');
var ImageModules = require('../Mixins/ImageModules');
var UserService = require("../../utils/user");
var Base= require('../../utils/Base');


var ApplyFinal = require('../Designer/ApplyFinal');


var designer = React.createClass({
  mixins: [ImageModules],
  getInitialState: function () {
        return {
          privilege : <div className="begin-privilege auto">
                            <div style={{paddingTop:"44px"}}><h1>亲爱的设计师，欢迎你！</h1></div>
                            <p><label>姓名</label><input className="inviteUserName" type="text"/></p>
                            <p><label>职业</label><input className="inviteJob" type="text" placeholder="设计师，摄影师等"/></p>
                            <p><label>手机号</label><input className="invitePhone" type="text"/>
                            <span style={{display:"none"}} className="invitePhoneErrinfo ErrInfo">*手机号输入有误，请重新填写</span></p>
                            <p><label>邀请码</label> <input className="inviteCode" type="text" placeholder="请输入邀请码"/>
                            <span style={{display:"none"}} className="inviteCodeErrinfo ErrInfo">*邀请码输入有误，请重新填写</span></p>
                            <p className="goPrivilego"><label>&nbsp;</label>
                            <input id="goPrivilego" type="button" value="完成认证" onClick={this.goPrivilegoClickFn}/></p>
                        </div>
        }
  },
  
  render:function(){
    return  <div id="privilege" class="container hide tab">
                <div id="privilege-content">
                <ApplyFinal user={this.props.user} />
                </div>
                <div className="designPower">
                    <div>
                        <img className="auto" src={this.defineImageModules()['design']}/>
                        <hr className="designPowerHr" />
                    </div>
                    <div className="designPowerWater auto">
                        <div style={{marginLeft: "0px"}}>
                            <span className="power1"></span>
                            <span className="power2"></span>
                            <span className="power3"></span>
                            <span className="power4"></span>
                        </div>
                        <div>
                            <span className="power5"></span>
                            <span className="power6"></span>
                            <span className="power7"></span>
                        </div>
                        <div>
                            <span className="power8"></span>
                            <span className="power9"></span>
                            <span className="power10"></span>
                            <span className="power11"></span>
                        </div>
                        <p className="clear"></p>
                    </div>
                </div>
            </div>
  },
  componentDidMount:function(user){
    var userData=Base.getCurrentUser().attributes;
    this.getPrivilegeContent(userData);
  },
  getPrivilegeContent:function(user){
    var _user=user;
        if(1 == _user.user_type){
            this.setState({
                privilege : <div className="ok-privilege auto">
                                <p style={{height:"1px"}}></p>
                                <span className="okPrivilegeTitle">
                                    <img style={{position:"relative",top:"5px",marginRight:"12px"}} src={this.defineImageModules()['authenticationOkIcon']} />
                                    恭喜，您已成为ME认证设计师！
                                </span>
                                <span>您的作品有机会获得ME多渠道终端推广</span>
                            </div>
            });
        }
        // else if(1 == _user.user_type && 1 == _user.approved_status){
        //   this.setState({
        //         privilege : <div className="ok-privilege auto">
        //                 <p style={{height:"1px"}}></p>
        //                 <span className="okPrivilegeTitle">
        //                 <img style={{position:"relative",top:"5px",marginRight:"12px"}} src={this.defineImageModules()['authenticationIngIcon']}/>
        //                 您的设计师资格正在审核中，请稍等</span><span>空余的时间可以浏览ME里的优秀作品哦</span>
        //               </div>
        //     });
        // }else if(1 == _user.user_type && 0 == _user.approved_status){
     
        //   this.setState({
        //         privilege :  <div class="ok-privilege auto">
        //           <p style="height:1px;"></p>
        //           <span class="okPrivilegeTitle">
        //           <img style="position:relative;top:5px;margin-right:12px;" src="/images/user/authenticationIngIcon.png" />啊！您似乎遗漏了什么，导致设计师申请资格未能通过</span>
        //           <span>提交优秀的作品会提高通过的几率</span>
        //         </div>
        //     });
        // }       
  },
  goPrivilegoClickFn:function(){
    var _this=this;
    var f = this.checkInfoValidity();
      if( !!f ){
        var _code = this.trim($(".inviteCode").val()),
          $info = $(".inviteCodeErrinfo");
        this.getInviteCodeStatus(_code,function(result){
          if( !!result.success ){
            $info.hide();
            var _o = {
              real_name : this.trim($(".inviteUserName").val()),
              job : this.trim($(".inviteJob").val()),
              vipphone : this.trim($(".invitePhone").val()),
              invite_code : _code
            };
            this.designerSubmitInfo(_o,function(user){
              var _jsonUser = JSON.stringify(user.toJSON());
              // window.sessionStorage.setItem("user", _jsonUser);
              Base.localStorageAction("user",JSON.stringify(user.toJSON()));
              var userData = Base.getCurrentUser().attributes;
              _this.getPrivilegeContent(userData);
            },function(){
              console.log( arguments , "err" );
            });
          }else{
            $info.html("*邀请码已经被使用，请重新填写").show();
          }
        },function(){
          console.log( "邀请码不可用" );
          $info.html("*邀请码输入有误，请重新填写").show();
        });
      }
  },
  checkInfoValidity:function(){
    var phone = $(".invitePhone"),
    phoneVal = phone.val(),
    $info = $(".invitePhoneErrinfo");
    var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
    if ( !reg.test(phoneVal) ) {
      $info.show();
      phone.focus();
      return false;
    }
    $info.hide();
    return true;
  },
  trim:function(str){
    var _str = str.toString();
    return _str.replace(/(^\s*)|(\s*$)/g, "");
  },
  //根据输入的邀请码判断邀请码的使用状况
    getInviteCodeStatus(invite_code,cb_ok,cb_err){
      if (""==invite_code||undefined==invite_code) return;
      var query = new fmacloud.Query("pc_invitecode"); 
      query.equalTo("invite_code", invite_code); 
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
                  cb_ok(sucessjson);
              }else{
                  cb_err();
              }
          },
          error: cb_err
      }); 
    },
    /**
   提交设计师的用户信息

    **/
    designerSubmitInfo(options, cb_ok, cb_err){
      var real_name = options.real_name||"",
        job = options.job||"",
        vipphone = options.vipphone||"",
        invite_code = options.invite_code||"";
      var currentUser = fmacloud.User.current(); //获取当前登录用户信息
      if (currentUser) {
          currentUser.set("user_type", 1);//用户类别设置为 1设计师类别
          currentUser.set("job", job);
          currentUser.set("approved_status", 2); //使用验证码的时候直接设置为 通过
          currentUser.set("vipphone", vipphone);
          currentUser.set("real_name", real_name);
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
              }, error: function (error) {

              }
          });
      } 
    }
})

module.exports=designer;