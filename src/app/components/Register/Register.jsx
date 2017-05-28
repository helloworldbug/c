/**
  * @name 注册组件
  * @author 曾文彬
  * @datetime 2015-9-6
*/

'use strict';

// require core module
var React = require('react'),
    Base = require('../../utils/Base.js');
import { Link } from 'react-router'
// require css module
var FormCSS = require('../../../assets/css/form.css');

// require common mixins
var FormMixin = require('../Mixins/Form'),
    ImageModules = require('../Mixins/ImageModules');

// require children component
var Input = require('../Common/Input'),
    Images = require('../Common/Image');

// define register component
var Register = React.createClass({

    mixins: [FormMixin, ImageModules],

    getInitialState() {
        return {
            text: this.getConfirmText()
        };
    },

    getConfirmText() {
        return '注&nbsp;&nbsp;&nbsp;册'
    },

    handleRegister() {

        if (!this.state.agree) return;

        // get child component element
        var phone = this.refs.phone,
            identifycode = this.refs.identifycode,
            pwd = this.refs.pwd,
            repeatPwd = this.refs.repeatPwd;

        // validate field
        if (phone.state.requiredError || phone.state.formatedError) {
            this.displayStatusInfo(phone.state.requiredError || phone.state.formatedError);
            return;
        }

        if (identifycode.state.requiredError) {
            this.displayStatusInfo(identifycode.state.requiredError);
            return;
        }

        if (pwd.state.requiredError || pwd.state.formatedError) {
            this.displayStatusInfo(pwd.state.requiredError || pwd.state.formatedError);
            return;
        }

        if (repeatPwd.state.requiredError || repeatPwd.state.formatedError) {
            this.displayStatusInfo(repeatPwd.state.requiredError || repeatPwd.state.formatedError);
            return;
        }

        if (pwd.state.value !== repeatPwd.state.value) {
            this.displayStatusInfo('两次密码输入不一致');
            return;
        }

        // ready register
        this.register({
            username: phone.state.value,
            user_nick: phone.state.value,
            identifycode: identifycode.state.value,
            password: pwd.state.value,
            "register_third": 1
        });
    },

    handleAgree() {
        this.setState({
            agree: !this.state.agree
        });
    },

    getUser(users) {
        var user = new fmacloud.User();

        Object.keys(users).forEach((_key) => {
            user.set(_key, users[_key]);
        });

        return user;
    },

    register(users) {
        var context = this, user;
var phone = this.refs.phone;
var _this=this;
        if (!context.state.agree) return;

        // show loading style
        context.setState({isShowLoading: true});
        
        fmacloud.Cloud.run('verifySmsByEngine', { phone: phone.state.value, code: users.identifycode}, {
            success: function (obj) {
                user = context.getUser(users);
            user.signUp(null, {
                success(_user) {
                    context.setState({ text: '注册成功' });

                    // add default image url
                    // Base.setUserInfo({
                    //     user_pic: '../../../assets/images/user/defaultFace.jpg'
                    // });

                    // link to /user
                    Base.linkToPath('/user');
                },
                error(_anull, _error) {
                    // 用户名是否已经注册
                    context.displayStatusInfo(context.defineCodeMap()['register'][_error.code] || (_error.message));
                }
            });

            // hide loading style
            context.setState({ isShowLoading: false });

            },
            error: function (/*err*/) {
             // 验证码是否过期
            context.displayStatusInfo(_this.defineCodeMap()['vertifyCode'][err.code] || (err.message));

            // 改变发送验证码按钮文字
            context.setState({ vertifycodeText: '发送验证码' });

            // 禁止计时器
            context.timer && clearInterval(context.timer);

            // hide loading style
            context.setState({ isShowLoading: false });
            }
        });


        // fmacloud.Cloud.verifySmsCode(users.identifycode).then(() => {
        //     user = context.getUser(users);
        //     user.signUp(null, {
        //         success(_user) {
        //             context.setState({ text: '注册成功' });

        //             // add default image url
        //             // Base.setUserInfo({
        //             //     user_pic: '../../../assets/images/user/defaultFace.jpg'
        //             // });

        //             // link to /user
        //             Base.linkToPath('/user');
        //         },
        //         error(_anull, _error) {
        //             // 用户名是否已经注册
        //             context.displayStatusInfo(context.defineCodeMap()['register'][_error.code] || _error.message);
        //         }
        //     });

        //     // hide loading style
        //     context.setState({ isShowLoading: false });
        // }, (_error) => {
        //     // 验证码是否过期
        //     context.displayStatusInfo(this.defineCodeMap()['vertifyCode'][_error.code] || _error.message);

        //     // 改变发送验证码按钮文字
        //     context.setState({ vertifycodeText: '发送验证码' });

        //     // 禁止计时器
        //     context.timer && clearInterval(context.timer);

        //     // hide loading style
        //     context.setState({ isShowLoading: false });
        // });
    },
    keyPress(e) {
        if (e.which == "13") {
            $(".submit").trigger("click");
        }
    },

    render() {
        return (
            <div className="inner" style={{ paddingTop: '80px' }}>
                <div className="bgc" data-background="form"></div>
                <div id="form-group">
                    <div className="container">
                        <div className="signup-forms">
                            <div className="signup-account" id="signup_account">
                                <div className="input-group">
                                    <Images className="img-ico" src={this.defineImageModules().user} />
                                    <Input ref="phone" placeholder="输入手机号" {...this.defineInfo().phone} className="input-control" id="signup_phone" />
                                </div>
                                <div className="input-group input-vertifycode-group">
                                    <Input ref="identifycode" placeholder="输入验证码" {...this.defineInfo().identifyCode} className="input-vertifycode" id="signup_identifycode" />
                                    <input className="btn-vertifycode" disabled={this.state.vertifycodeDisabled} onClick={this.handleVertifycode} type="button" value={this.state.vertifycodeText} />
                                </div>
                                <div className="input-group">
                                    <Images className="img-ico" src={this.defineImageModules().password} />
                                    <Input ref="pwd" type="password" placeholder="请输入密码" {...this.defineInfo().password} className="input-control" id="signup_pwd" />
                                </div>
                                <div className="input-group">
                                    <Images className="img-ico" src={this.defineImageModules().password} />
                                    <Input ref="repeatPwd" type="password" placeholder="请重复输入密码" {...this.defineInfo().repeatPassword} className="input-control" id="signup_repeatpwd" onKeyDown={this.keyPress} />
                                </div>
                                <div className="service-protocol">
                                    <div className="protocol" onClick={this.handleAgree}>
                                        <Images className="img-notagree" src={this.defineImageModules().agreelogo} width="20" />
                                        <i className={this.state.agree ? 'img-agree' : ''}></i>
                                    </div>
                                    <span className="txt-agreeprotocol">
                                        同意
                                        <Link target="_blank" to="/about/service?action=service">
                                            <u>应用服务协议</u>
                                        </Link>
                                    </span>
                                </div>
                                <button disabled={this.state.disabled} data-loading={this.state.isShowLoading && 'visible'}
                                    className={this.state.agree ? "submit btn-submit btn-animation" : "submit disable"}
                                    onClick={this.handleRegister}>
                                    <i></i>
                                    <span ref="status" dangerouslySetInnerHTML={{ __html: this.state.text }}></span>
                                </button>
                            </div>
                            <Images className="or register-or" src={this.defineImageModules().sure} width="156" />
                            {/*<a href="mepcwxlogin/weixin_login.php"> 废弃的登录方式*/}
                            <a href="wxLogin">
                                <button className="btn-weixinsubmit" type="button">
                                    <Images className="img-weixin" src={this.defineImageModules().wxlogo} /><span className="txt-weixin">微信登录</span>
                                </button>
                            </a>
                            {/*<p className="third-party">
                                <a className="qq" href="javascript:;" onClick={ this.platformQQLogin('qq') }></a>
                                <a className="weibo" id="wb_connect_btn" href="javascript:;"></a>
                            </p>*/}
                        </div>
                    </div>
                </div>
            </div>
        )
    },

    componentDidMount: function () {
        this.platformSinaWblogLogin('wb_connect_btn')
            .then((function (success) {
                this.externalLogin(this.packageWblogResults(JSON.parse(success)));
            }).bind(this))
            .catch(function (error) { });
    }
});

module.exports = Register;
