/**
  * @name 修改密码组件
  * @author 曾文彬
  * @datetime 2015-9-6  
*/

'use strict';

// require core module
var React = require('react'),
    ReactDOM = require('react-dom'),
    Base = require('../../utils/Base.js');

// require css module
var FormCSS = require('../../../assets/css/form.css');

// require common mixins
var FormMixin = require('../Mixins/Form'),
    ImageModules = require('../Mixins/ImageModules');

// require children component
var Input = require('../Common/Input'),
    Images = require('../Common/Image');

// define forget component
var Forget = React.createClass({

    mixins: [FormMixin, ImageModules],

    getInitialState() {
        return {
            text: this.getConfirmText()
        };
    },

    getConfirmText() {
        return '修改密码'
    },

    handleUpdate() {
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

        // ready update
        this.update({
            phone: phone.state.value,
            identifycode: identifycode.state.value,
            pwd: pwd.state.value
        });
    },

    update(users) {
        var context = this;

        var phone = this.refs.phone;
        // show loading style
        context.setState({ isShowLoading: true });
        fmacloud.Cloud.run('verifySmsByEngine', { phone: phone.state.value, code: users.identifycode }, {
            success: function (obj) {
                fmacloud.Cloud.run('user_update_pwd', {
                    // params
                    phonenum: users.phone,
                    pwd: users.pwd
                }, {
                        // success
                        success(_result) {
                            context.setState({ text: '修改密码成功，请重新登录' });

                            // link to /login
                            Base.linkToPath('/login');
                        },
                        // error
                        error(_error) {
                            context.displayStatusInfo(this.defineCodeMap()['forget'][_error.code] || _error.message);
                        }
                    });

                // hide loading style
                context.setState({ isShowLoading: false });

            },
            error: function (err) {
                // 验证码是否过期
                context.displayStatusInfo(this.defineCodeMap()['vertifyCode'][_error.code] || _error.message);

                // 改变发送验证码按钮文字
                context.setState({ vertifycodeText: '发送验证码' });

                // 禁止计时器
                context.timer && clearInterval(context.timer);

                // hide loading style
                context.setState({ isShowLoading: false });
            }
        });
        // fmacloud.Cloud.verifySmsCode(users.identifycode).then(() => {
        //     fmacloud.Cloud.run('user_update_pwd', {
        //         // params
        //         phonenum: users.phone,
        //         pwd: users.pwd
        //     }, {
        //             // success
        //             success(_result) {
        //                 context.setState({ text: '修改密码成功，请重新登录' });

        //                 // link to /login
        //                 Base.linkToPath('/login');
        //             },
        //             // error
        //             error(_error) {
        //                 context.displayStatusInfo(this.defineCodeMap()['forget'][_error.code] || _error.message);
        //             }
        //         });

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

    backToIndexPage() {
        // link to index
        Base.linkToPath('/login');
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
                                <button disabled={this.state.disabled} data-loading={this.state.isShowLoading && 'visible'} className="submit btn-submit btn-animation changePass" onClick={this.handleUpdate}>
                                    <i></i>
                                    <span ref="status" dangerouslySetInnerHTML={{ __html: this.state.text }}></span>
                                </button>
                            </div>
                            <Images className="or" src={this.defineImageModules().sure} width="156" />
                            {/*mepcwxlogin/weixin_login.php 废弃的登录方式*/}
                            <a href="wxlogin">
                                <button className="btn-weixinsubmit" type="button">
                                    <Images className="img-weixin" src={this.defineImageModules().wxlogo} /><span className="txt-weixin">微信登录</span>
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Forget;