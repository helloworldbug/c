/**
  * @name 表单扩展
  * @descriptions 表单组件所需要的mixins
  * @author 曾文彬
  * @datetime 2015-9-10
*/

'use strict';

// require core module
var Base = require('../../utils/Base.js');
var GlobalFunc = require("../Common/GlobalFunc");
module.exports = {

    defineInfo() {
        return {
            phone: {
                requiredError: '手机号不能为空',
                formated: /^1[1-9]\d{9}$/,
                formatedError: '手机格式错误'
            },
            identifyCode: {
                requiredError: '验证码不能为空'
            },
            password: {
                requiredError: '密码不能为空',
                formated: /^.{6,16}$/,
                formatedError: '密码输入6-16位'
            },
            repeatPassword: {
                requiredError: '重复密码不能为空',
                formated: /^.{6,16}$/,
                formatedError: '重复密码输入6-16位'
            },

            /* add */
            name: {
                requiredError: '姓名不能为空'
            },
            job: {
                requiredError: '职业不能为空'
            },
            email: {
                requiredError: '邮箱不能为空',
                formated: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
                formatedError: '邮箱格式错误'
            },
            defaultUserPhoto: 'assets/images/user/mrPicture.png'
        }
    },

    defineCodeMap() {
        return {
            login: {
                211: '不存在此用户！',
                1: '登录失败次数超过限制！',
                210: '用户名或密码错误！'
            },
            register: {
                202: '用户已注册'
            },
            forget: {
                401: '不存在此用户！'
            },
            vertifyCode: {
                603: '验证码已过期'
            }
        };
    },

    getDefaultProps() {
        return {
            countDown: 60,
            vertifycodeText: '发送验证码'
        }
    },

    getInitialState() {
        return {
            agree: true,
            isShowLoading: false,
            disabled: false,
            vertifycodeDisabled: false,
            vertifycodeText: this.props.vertifycodeText
        }
    },

    handleVertifycode() {
        var phone = this.refs.phone;
        console.log(phone);

        // validate field
        if (phone.state.requiredError || phone.state.formatedError) {
            this.displayStatusInfo(phone.state.requiredError || phone.state.formatedError);
            return;
        }
        console.log(typeof (phone.state.value));
        this.sendVertifycode(phone.state.value);
    },

    sendVertifycode(phone) {
        var context = this;

        // 发送验证码按钮禁用
        this.setState({
            vertifycodeDisabled: true
        });

        // add by lifeng 20170411 -发送短信 更新接口
        fmacloud.Cloud.run('sendMsgByEngine', { phone: phone }, {
            success: function (obj) {
                // 开始倒计时
                context.timer = Base.countDowning(second => {
                    // 正在倒计时处理
                    context.setState({ vertifycodeText: second + '秒获取' });
                }, () => {
                    // 倒计时完成处理
                    context.setState({ vertifycodeDisabled: false, vertifycodeText: context.props.vertifycodeText });
                });
            },
            error: function (err) {

                // 验证短信发送失败
                var err_message = err.message;

                if(err_message=='发送短信或者语音验证失败，运营商返回错误。'||err_message=='Send SMS messages beyond the limit of five per day.'){
                    context.displayStatusInfo('超过一天的短信发送额度');
                }else{
                    context.displayStatusInfo(err_message);
                }
                context.setState({
                    vertifycodeDisabled: false
                });
            }
        });

        /** modify by lifeng 20170411 -- start */
        // fmacloud.Cloud.requestSmsCode({mobilePhoneNumber:phone,ttl:1}).then(() => {


        //     // 开始倒计时
        //     context.timer = Base.countDowning(second => {
        //         // 正在倒计时处理
        //         context.setState({vertifycodeText: second +'秒获取'});
        //     }, () => {
        //         // 倒计时完成处理
        //         context.setState({vertifycodeDisabled: false, vertifycodeText: context.props.vertifycodeText});
        //     });
        // }, (_error) => {
        //     // 验证短信发送失败
        //     context.displayStatusInfo(_error.message);

        //     context.setState({
        //         vertifycodeDisabled: false
        //     });
        // });
        /** modify by lifeng 20170411 -- end */
    },

    displayStatusInfo(error) {
        console.log(error);
        var context = this;
        context.setState({ text: error, disabled: true });

        // delay exec
        Base.delayExec(() => {
            context.setState({ text: context.getConfirmText(), disabled: false });
        }, 1500);
    },
    /**
     * weibo登录
     */
    platformWeiboLogin: function () {
        window.open('https://api.weibo.com/oauth2/authorize?client_id=4167809094&forcelogin=true&response_type=code&redirect_uri=' + encodeURIComponent(location.origin + "/wb/wb.html?platform=wb&v=" + Math.random()) + '', '_self')

    },
    /**
     * QQ登录
    */
    platformQQLogin: function (platform) {
        return function () {
            window.open('https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=101178983&redirect_uri=' + encodeURIComponent("http://www.agoodme.com/qq/qq.html?platform=" + platform + "&v=" + Math.random()) + '', '_self');

        };
    },

    /*
     * 微盟登录
    */
    platformWeimobLogin: function () {

        var callback = encodeURIComponent(location.origin + '/Weimob/callback.html');

        return 'http://139.196.51.232:3000/auth/weimob?callback=' + callback;
    },

    /**
     * 新浪微博登录
    */
    platformSinaWblogLogin: function (id) {
        return new Promise(function (resolve, reject) {
            WB2.anyWhere(function (W) {
                W.widget.connectButton({
                    id: id,
                    type: '3,2',
                    callback: {
                        login: resolve, //登录后的回调函数
                        logout: reject //退出后的回调函数
                    }
                });
            });
        });
    },

    /*
     * 封装微博登录成功后对象
    */
    packageWblogResults: function (originObj) {
        return {
            unionid: originObj.id.toString(),
            nickname: originObj.name || '',
            sexual: originObj.gender === 'm' ? 1 : originObj.gender === 'f' ? 2 : 0,
            headimgurl: originObj.avatar_large
        };
    },
    /*
     * 验证账号是否冻结  --konghuachao-2017-0508--start
     * */
    externalLogin:function(data){
        var data1=data;
        var _that=this;
        /**fmacloud.Cloud.run('userCheck',{'val':data.unionid,'type':"login"},{
            success:function(data){
                debugger;
                //status=data.result.status;
                //debugger;
                return data.status;
            },
            error:function(err){
                //console.log("error")
                debugger;
                return false;
            }
        }).then(function(data){
            //debugger;
            var str;
            if(data.status){
                if(data.end){
                    var time=Base.formattime(data.end,"yyyy-MM-dd HH:mm:ss");
                    str="该账户已被冻结，冻结截止时间:"+time+"。"
                        +"\n如有问题请联系客服。"
                    //return false;
                }else{
                    str="该账号已被永久冻结。";
                }
                alert(str);
                window.location.href = 'http://www.agoodme.com/' + 'login';
                return false;
            }else{
                debugger;
                _that.externalLogin1(data1)
            }
        }).catch(function(error){
            debugger;
            _that.externalLogin1(data1)
        })**/
         _that.externalLogin1(data1)
    },
    /*
     * 验证账号是否冻结  --konghuachao-2017-0508--end
     * */

    /**
     * 第三方登录 -
    */
    externalLogin1: function (data) {
        var unionid = data.unionid;
        var nickname = data.nickname;
        var sexual = data.sexual;
        var headimgurl = data.headimgurl;

        var origin=location.origin;
        //检索对象
        var User = fmacloud.Object.extend("_User");
        var query = new fmacloud.Query(User);
        query.equalTo("username", unionid);
        query.find({
            success: function (user) {
                if (user.length > 0) {
                    //用户存在则登陆绑定
                    fmacloud.User.logIn(unionid, "6a063e705a16e625", {
                        success: function (_user) {

                            var jsonUser = JSON.stringify(_user.toJSON());

                            if (!!jsonUser.user_nick) {
                                jsonUser.user_nick = jsonUser.username || "无";
                            }
                            Base.linkToPath(origin+"/user");
                        },
                        error: function (_user, error) {
                            console.log(error.message);
                        }
                    })
                } else {
                    //用户不存在则注册
                    var user = new fmacloud.User();
                    user.set("username", unionid);
                    user.set("password", "6a063e705a16e625"); //me第三方登录
                    user.set('user_nick', nickname);
                    user.set("user_pic", headimgurl);
                    user.set("sex", sexual);
                    user.signUp(null, {
                        success: function (user) {
                            //注册成功则登陆
                            fmacloud.User.logIn(unionid, "6a063e705a16e625", {
                                success: function (user) {
                                    var jsonUser = JSON.stringify(_user.toJSON());
                                    if (!!jsonUser.user_nick) {
                                        jsonUser.user_nick = jsonUser.username || "无";
                                    }

                                    Base.linkToPath(origin+"/user");
                                },
                                error: function (user, error) {
                                    console.log(error.message);
                                }
                            })
                        },
                        error: function (user, error) {
                            console.log(error.message);
                        }
                    })
                }
            },
            error: function (error) {
                console.log(error.message);
            }
        });
    }
};
