/**
 * @name 登录组件
 * @author 曾文彬
 * @datetime 2015-9-6
 */

'use strict';

// require core module
var React = require('react'),
    Base = require('../../utils/Base.js');
import {Link} from 'react-router'
var ContextUtils = require('../../utils/ContextUtils');

// require css module
var FormCSS = require('../../../assets/css/form.css');

// require common mixins
var FormMixin = require('../Mixins/Form'),
    ImageModules = require('../Mixins/ImageModules');
var GlobalFunc = require("../Common/GlobalFunc");

// require children component
var Input = require('../Common/Input'),
    Images = require('../Common/Image');

// define login component
var Login = React.createClass({

    mixins: [FormMixin, ImageModules],

    getInitialState() {

        return {
            text: this.getConfirmText()
        }
    },

    getConfirmText() {
        return '登&nbsp;&nbsp;&nbsp;录'
    },

    handleLogin() {
        // get child component element
        var phone = this.refs.phone,
            pwd =this.refs.pwd;
        var that=this;
        var flag=true;
        // validate field
        if (phone.state.requiredError ) {
            this.displayStatusInfo(phone.state.requiredError );
            return;
        }

        if (pwd.state.requiredError || pwd.state.formatedError) {
            this.displayStatusInfo(pwd.state.requiredError || pwd.state.formatedError);
            return;
        }
        fmacloud.Cloud.run('userCheck',{'val':phone.state.value,'type':"login"},{
            success:function(data){
                debugger;
                //status=data.result.status;
                return "kong"
            },
            error:function(err){
                //console.log("error")
                debugger;
                return false;
            }
        }).then(function(data){
            if(data.status){
                if(data.end){
                    //var time=data.end.split(".")[0].replace(/[a-zA-Z]+/," ")
                    var time=Base.formattime(data.end,"yyyy-MM-dd HH:mm:ss");
                    var str="该账户已被冻结，冻结截止时间:"+time+"。"
                            +"\n如有问题请联系客服。"
                    alert(str);
                    return false;
                }
                $(".submit span").html("该账号已被永久冻结");
                //setTimeout(function(){
                //    $(".submit span").html('登&nbsp;&nbsp;&nbsp;录');
                //},1000)
            }else{
                debugger;
                that.login(phone.state.value, pwd.state.value,flag)
                debugger;
            }
        }).catch(function(err){
            that.login(phone.state.value, pwd.state.value,flag)
        })
    },

    login(phone, password,flag) {
        var context = this, currentUser;
        // show loading style
        context.setState({isShowLoading: true});
        ContextUtils.resetCurrentUser();

        fmacloud.User.logIn(phone, password, {
            success(_user){
               //debugger;
                 currentUser = Base.getCurrentUser();
                 currentUser.set('lastlogintime', new Date());
                 currentUser.save();
                 // hide loading icon
                 context.setState({isShowLoading: false, text: '登录成功'});

                 // link to /user
                 //var back=context.props.params.back;
                 //if(typeof back=="string"&& back== "true"||(typeof back=="boolean" &&back)){
                 //    window.history.back();
                 //}else{
                 //    Base.linkToPath('/user');
                 //}

                 var referer = localStorage.getItem("referer"); //获取上一个页面的本地存储

                 if (referer == '/register') {
                 referer = '/user';
                 }

                 !!referer ? Base.linkToPath(referer) : Base.linkToPath('/user');

                 localStorage.removeItem("referer"); //清除本地存储


            },
            error(_anull, _error) {
                context.setState({isShowLoading: false});
                context.displayStatusInfo(context.defineCodeMap()['login'][_error.code] || _error.message);
            }
        });
    },

    keyPress(e){
        if (e.which == "13") {
            $(".submit").trigger("click");
        }
    },

    render() {

        if (ContextUtils.getCurrentUser()) {
            Base.linkToPath(`/`);
            return (null)
        }

        return (
            <div className="inner" style={{ paddingTop: '80px' }}>
                <div className="bgc" data-background="form"></div>
                <div id="form-group">
                    <div className="container">
                        <div className="signup-forms login-part">
                            <div className="signup-account" id="signup_account">
                                <div className="input-group">
                                    <Images className="img-ico" src={this.defineImageModules().user}/>
                                    <Input ref="phone" placeholder="输入手机号" {...this.defineInfo().phone} maxLength="11"
                                           className="input-control"
                                           id="signup_phone"/>
                                </div>
                                <div className="input-group">
                                    <Images className="img-ico" src={this.defineImageModules().password}/>
                                    <Input ref="pwd" type="password" placeholder="请输入密码" {...this.defineInfo().password}
                                           className="input-control"
                                           id="signup_pwd" onKeyDown={this.keyPress}/>
                                </div>
                                <button disabled={this.state.disabled}
                                        data-loading={this.state.isShowLoading && 'visible'}
                                        className="submit btn-submit btn-animation" onClick={this.handleLogin}>
                                    <i />
                                    <span ref="status" dangerouslySetInnerHTML={{__html: this.state.text}}/>
                                </button>
                            </div>
                            <Link className="target-link forgetPassword" to="/forget">忘记密码</Link>
                            <Link className="target-link registerImmediate" to="/register">立即注册</Link>
                            <Images className="or" src={this.defineImageModules().sure} width="156"/>
                            {/*<a href="wxlogin" onClick={this.openWeixinLogin}> 废弃的登录方式*/}
                            <a href="wxlogin">
                                <button className="btn-weixinsubmit" type="button">
                                    <Images className="img-weixin" src={this.defineImageModules().wxlogo}/>
                                    <span className="txt-weixin">微信登录</span>
                                </button>
                            </a>
                            <p className="third-party">
                                <a className="qq" href="javascript:;" onClick={ this.platformQQLogin('qq') }>
                                    <span>QQ登录</span>
                                </a>
                                <a className="weibo" href="javascript:;" onClick={ this.platformWeiboLogin }>
                                    <span>微博登录</span>
                                    <span id="wb_connect_btn"></span>
                                </a>
                                <a className="weimob" href={this.platformWeimobLogin()}>
                                    <span>微盟帐号登录</span>
                                </a>
                            </p>
                            <article className="suggest">
                                提示：推荐使用 <span className="suggest-colorwhite">谷歌Chrome</span> 、<span
                                className="suggest-colorwhite">360极速</span> 、<span
                                className="suggest-colorwhite">QQ浏览器</span>（V9.1及以上版本） 进行操作
                                {/*<span className="suggest-h">提示：</span>为了获得更好的体验，建议使用
                                 <span className="suggest-colorwhite">谷歌浏览器</span>、<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                 <span className="suggest-colorwhite">360极速浏览器</span>进行作品创作*/}
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
openWeixinLogin:function(){
    getRanNum()
function getRanNum() {
        // 参数为appid，redirect_uri（授权成功后回调地址必须为encode后的）
        var callbackPath=encodeURIComponent("http://www.agoodme.com/wxlogin.html?origin="+location.origin);
        window.open("https://open.weixin.qq.com/connect/qrconnect?appid=wxaa846f77ece37b87&redirect_uri="+callbackPath+"&response_type=code&scope=snsapi_login&state=1116547e0993eac215c360c270eabc9ddc5#wechat_redirect");
    }
},
    componentDidMount: function () {
        //this.platformSinaWblogLogin('wb_connect_btn')
        //    .then((function (success) {
        //        WB2.logout(()=> {
        //        })
        //        this.externalLogin(this.packageWblogResults(success));
        //    }).bind(this))
        //    .catch(function (error) {
        //    });
    },

    componentWillMount: function () {

    }
});

// define Login component
module.exports = Login;
