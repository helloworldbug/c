/**
  * @name 登录组件
  * @author liuhua
  * @datetime 2015-11-24
*/
'use strict';
var React = require('react'),
    ReactDOM=require("react-dom"),
    Base = require('../../utils/Base.js'),
    MePC = require('../../lib/MePC_Public'),
    Images = require('../Common/Image'),
    FormMixin = require('../Mixins/Form'),
    ContextUtils = require('../../utils/ContextUtils'),
    ImageModules = require('../Mixins/ImageModules');
    import {Link} from 'react-router'
var MSuper = require('./M_Super');
var MNav   = require('./M_Nav');

var Login =  MePC.inherit(MSuper,React.createClass({
    mixins : [FormMixin,ImageModules],
    getInitialState : function(){
        return {
      text: this.getConfirmText()
        }
    },
  componentWillMount:function(){
  
  },
    render : function(){
        this.generatorMobileMeta();
        this.generatorMobileCSSSheet();
        this.modifierRootClassByName();
        return(
            <div id='login_frame'>
        <MNav />
        <div id='login_phone' className="loginMobile">
          <img src={this.defineImageModules()["user-mobile"]}/>
          <input type="tel" ref="phone" placeholder="输入手机号" {...this.defineInfo().phone}/>
        </div>
        <div id='login_password' className="loginMobile">
          <img src={this.defineImageModules()["password-mobile"]}/>
          <input type="password" ref="pwd" placeholder="请输入密码" {...this.defineInfo().password}/>
        </div>
        <div id='login_submit' onTouchStart={this.handleLogin}>
          <button dangerouslySetInnerHTML={{__html: this.state.text}}></button>
        </div>

        <Link id='linkToRegister' to="/phone/register">还没帐号？立即注册</Link>
      </div>
            )
    },
  getConfirmText:function(){
    return '登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</button>'
  },
  validateField:function(phone,pwd){
    var msg=true;
    if(phone.length==0){
      this.wrongMsg(this.defineInfo().phone.requiredError);
      msg=false;
    }
    if(phone.match(this.defineInfo().phone.formated)==null){
        this.wrongMsg(this.defineInfo().phone.formatedError);
        msg=false;
      }
    if(pwd.length==0){
      this.wrongMsg(this.defineInfo().password.requiredError);
      msg=false;
    }
    if(pwd.match(this.defineInfo().password.formated)==null){
        this.wrongMsg(this.defineInfo().password.formatedError);
        msg=false;
      }
    return msg;
  },
  wrongMsg:function(msg){
    var context=this;
    this.setState({
      text:msg
    },function(){
      Base.delayExec(() => {
            context.setState({text: context.getConfirmText(), disabled: false});
        }, 1500);
    });
    return;
  },
  handleLogin:function(){
    var phone = this.refs.phone,
        pwd = this.refs.pwd,
        that=this;
    var phoneValue=ReactDOM.findDOMNode(phone).value.toString();
    var pwdValue=ReactDOM.findDOMNode(pwd).value.toString();
    var isSubmit=this.validateField(phoneValue,pwdValue);
    /**fmacloud.Cloud.run('userCheck',{'val':phone.state.value,'type':"login"},{
        success:function(data){
        },
        error:function(err){
            //return false;
        }
    }).then(function(data){
        if(data.status){
            if(data.end){
                var time=Base.formattime(data.end,"yyyy-MM-dd HH:mm:ss");
                var str="该账户已被冻结，冻结截止时间:"+time+"。"
                    +"\n如有问题请联系客服。"
                alert(str);
                return false;
            }
            $(".submit span").html("该账号已被永久冻结");
        }else{
            if(isSubmit){
                that.login(phoneValue,pwdValue);
            }
        }
    }).catch(function(err){
        if(isSubmit){
            that.login(phoneValue,pwdValue);
        }
    })**/
    
    if(isSubmit){
      this.login(phoneValue,pwdValue);
    }
  },
  login:function(phone, password){
    var context = this, currentUser;
    ContextUtils.resetCurrentUser();
    fmacloud.User.logIn(phone, password, {
            success(_user) {
                currentUser = Base.getCurrentUser();
                currentUser.set('lastlogintime', new Date());
                currentUser.save();

                // hide loading icon
                context.setState({isShowLoading: false, text: '登录成功'});

                // link to /user
                Base.linkToPath('/phone/logins');
            },
            error(_anull, _error) {
                context.setState({isShowLoading: false});
                context.displayStatusInfo(context.defineCodeMap()['login'][_error.code] || _error.message);
            }
        });
   },

    componentWillUnmount: function () {
        // 删除mobile 样式
        this.modifierRootClassByName(true);
    }
}));

module.exports = Login;