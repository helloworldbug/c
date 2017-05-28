// require core module
var React = require('react'),
	ReactDOM=require("react-dom"),
    Base = require('../../utils/Base.js');
import {Link} from 'react-router'
// require common mixins
var FormMixin = require('../Mixins/Form'),
 	MePC = require('../../lib/MePC_Public'),
    Images = require('../Common/Image'),
    FormMixin = require('../Mixins/Form'),
    ImageModules = require('../Mixins/ImageModules');

var MSuper = require('./M_Super');
var MNav   = require('./M_Nav');

var Register =  MePC.inherit(MSuper,React.createClass({
	mixins : [FormMixin,ImageModules],
	getInitialState : function(){
		return {
      		text: this.getConfirmText(),
      		vertifyDisabled:false,
      		vertifyText: '发送验证码',
      		count:59,
          isSubmit:true
		}
	},
  	getConfirmText:function(){
    	return '注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册</button>'
  	},
	render: function () {
        this.generatorMobileMeta();
        this.generatorMobileCSSSheet();
        this.modifierRootClassByName();
		return(
			<div id="registerFrame">
			<MNav />
				<div id="register_phone">
		          <img src={this.defineImageModules()["user-mobile"]}/>
		          <input type="tel" ref="phone" placeholder="输入手机号" {...this.defineInfo().phone}/>
				</div>
				<div id="register_vertifycode">
					<input type="text" placeholder="请输入手机验证码" ref="identifycode"/>
					<span onClick={this.handleVertify} disabled={this.state.vertifyDisabled} dangerouslySetInnerHTML={{__html: this.state.vertifyText}}></span>
				</div>
				<div id='login_password' className="loginMobile">
		          <img src={this.defineImageModules()["password-mobile"]}/>
		          <input type="password" ref="pwd" placeholder="请输入密码" {...this.defineInfo().password}/>
		        </div>
		        <div id='login_submit' onTouchStart={this.handleRegister}>
		          <button dangerouslySetInnerHTML={{__html: this.state.text}} disabled={this.state.isSubmit==false?true:false}></button>
		        </div>
		        <Link id='linkToLogin' to="/phone/login">已有帐号？立即登录</Link>
			</div>
			)
	},
	handleVertify: function(){
		if (this.state.vertifycodeDisabled == true) {
			return
		}

		var context = this;
		var phone = this.refs.phone;
		var phoneValue = ReactDOM.findDOMNode(phone).value.toString();
		var isOk = this.validateField(phoneValue);
		if (isOk == false) {
			return;
		}

		this.sendVertify(phoneValue);
	},

    sendVertify: function(phone) {
        var context = this;
        // 发送验证码按钮禁用
        this.setState({
            vertifycodeDisabled: true
        });
		
		//远程调用接口
        fmacloud.Cloud.requestSmsCode(phone).then(() => {
        	var count = 59;
            context.setState({vertifyText: context.state.count +' 秒获取'});
            context.setCount = setInterval(function(){
            	if (count==0) {
            		clearInterval(context.setCount);
            		context.setState({vertifycodeDisabled : false,vertifyText:'发送验证码'});
            	}else {
            		count-=1;
            		context.setState({vertifyText: count +' 秒获取'});
            	}
            },1000);


        }, (_error) => {
            // 验证短信发送失败
            context.displayStatusInfo(_error.message);

            context.setState({
                vertifycodeDisabled: false
            }, function () {
            	clearInterval(context.setCount);
            });
        });
    },
    handleRegister: function() {
        if(this.state.isSubmit==false){
          return;
        }
        var _this=this;
        var phone = this.refs.phone,
            identifycode = this.refs.identifycode,
            pwd = this.refs.pwd;
        var phoneValue = ReactDOM.findDOMNode(phone).value.toString();
        var identifycodeValue = ReactDOM.findDOMNode(identifycode).value.toString();
        var pwdValue = ReactDOM.findDOMNode(pwd).value.toString();
        var isSubmit=this.validateField(phoneValue,pwdValue);
        if(pwdValue.length==0){
        	this.wrongMsg("请输入密码");
        	return;
        }
        if(isSubmit){
        	if(identifycodeValue.length!=6){
        		this.wrongMsg("验证码错误");
        		return;
        	}
          this.setState({
            isSubmit:false
          },function(){
            _this.register({
  	            username: phoneValue,
  	            user_nick: phoneValue,
  	            identifycode: identifycodeValue,
  	            password: pwdValue
          	});
          });
        }
    },
    register: function(users) {
        var context = this, user;
        fmacloud.Cloud.verifySmsCode(users.identifycode).then(() => {
            user = context.getUser(users);
            console.log(user);
            user.signUp(null, {
                success(_user) {
                    context.setState({text: '注册成功',isSubmit:true});

                    // add default image url
                    // Base.setUserInfo({
                    //     user_pic: '../../../assets/images/user/defaultFace.jpg'
                    // });

                    // link to /user
                    Base.linkToPath('/phone/logins');
                },
                error(_anull, _error) {
                    // 用户名是否已经注册
                    context.setState({
				      text:context.defineCodeMap()['register'][_error.code] || _error.message,
              isSubmit:true
				    },function(){
				      Base.delayExec(() => {
				      		clearInterval(context.setCount);
				            context.setState({text: context.getConfirmText(), disabled: false,vertifyDisabled:false,vertifyText: '发送验证码'});
				        }, 1500);
				    });
                }
            });

            // hide loading style
            context.setState({isShowLoading: false});
        }, (_error) => {
            // 验证码是否过
            this.setState({
		      text:this.defineCodeMap()['vertifyCode'][_error.code] || _error.message,
          isSubmit:true
		    },function(){
		      Base.delayExec(() => {
		      		clearInterval(context.setCount);
		            context.setState({text: context.getConfirmText(), disabled: false,vertifyDisabled:false,vertifyText: '发送验证码'});
		        }, 1500);
		    });
        });
    },
    getUser(users) {
        var user = new fmacloud.User();

        Object.keys(users).forEach((_key) => {
            user.set(_key, users[_key]);
        });

        return user;
    },

    componentWillUnmount: function () {
        // 删除mobile 样式
        this.modifierRootClassByName(true);
    }
}));

module.exports = Register;
