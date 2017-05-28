/**
 * @module app
 * @description app main module
 * @time 2015-06-23 20:41
 * @author StarZou
 **/

/**
 * 引入 第三方lib
 **/
var React = require('react');
var ReacDOM, {render} = require("react-dom");
var injectTapEventPlugin = require("react-tap-event-plugin");
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router';
// var DefaultRoute = Router.DefaultRoute;
// var RouteHandler = Router.RouteHandler;
// var Redirect = Router.Redirect;
// var NotFoundRoute = Router.NotFoundRoute;

// 全局引入jQuery(因为一些jQuery插件写法不好, 以后可以优化)
global.$ = global.jQuery = global.jQuery || require('jquery');

/**
 * 引入 assets
 */
require('../assets/css/base.css');
require('normalize.css/normalize.css');
require('../assets/css/app.css');
require('../assets/css/main.css');
require('../assets/css/components.css');
require('../assets/css/jquery.Jcrop.min.css');
require('../assets/css/loading.css');
require("../vendor/spectrum/spectrum.css");
require("../vendor/spectrum/spectrum.js");


/**
 * 引入自定义 components
 */
var Index = require('./components/Index/Index');// 首页
var MakeMagazine = require("./components/Make/MakeMagazine");//magazine
var MakePreview = require('./components/Make/Preview');//制作页预览
var NavBar = require('./components/Common/NewNavBar');// 导航栏组件
var Download = require('./components/Download/Download');// 下载页
var Discovery = require('./components/Discovery/Discovery');// 发现页
var Create = require('./components/Create/Create');// 创建页
var Login = require('./components/Login/Login');// 登录页
var LoginMobile = require('./components/Mobile/M_Login');// 手机登录页
var Register = require('./components/Register/Register');// 注册页
var RegisterMobile = require('./components/Mobile/M_register');//手机注册
var Forget = require('./components/Forget/Forget');// 忘记密码页
var About = require('./components/About/About');// 关于页
var User = require('./components/User/User');// 个人中心页
var Preview = require('./components/Preview/NewPreview');// 详情页
var Form = require('./components/Form/Form');// 表单统计页
var WxLogin = require('./components/WxLogin/WxLogin');//微信登录跳转页
var Notification = require('./components/Common/Notification');
var Search = require('./components/search/Search');//搜索页
var Contact = require('./components/Mobile/M_contact');//手机联系页
var LoginS = require('./components/Mobile/M_LoginS');//手机登录成功页面
var Ysdh = require('./components/ysdh/index');//与神对话跳转
var ImportArticle = require('./components/User/ThirdPartyPlatformMsg/ImportArticle');//与神对话跳转

/* 3.0 设计师申请 */
//申请页首页
var DesignerRoute = require('./components/Designer/Index');
var HelperRoute = require('./components/Helper/Helper');
var NoFondPath = require('./components/404');
var DeleteWorkError = require('./components/deleteWorkError');


var DesignerTribe = require('./components/DesignerTribe/DesignerTribe');//设计师部落
var DesignerDetail = require('./components/DesignerTribe/DesignerDetail');//设计师主页

//会员特权
var MembershipPrivileges = require('./components/MembershipPrivileges/MembershipPrivileges');
//会员活动
var MembershipActivity = require('./components/MembershipPrivileges/MembershipActivity');

/*邀请好友*/
var Invite = require('./components/Invite/Invite');

/*活动页面*/
var Activity = require('./components/Activity/Activity'); //活动列表
var ActivityDetail = require('./components/Activity/ActivityDetail'); //活动详细页面

var RechargeView = require("./components/recharge/RechargeView");   //充值页面
var WeChatPaymentView = require("./components/recharge/WeChatPaymentView");   //微信充值页面
var PaymentSuccessView = require("./components/recharge/PaymentSuccessView");   //充值完成页面

/**
 * 移动端首页
 */
var Mobile = require('./components/Mobile/M_Index');
var MobileCase = require('./components/Mobile/M_Case');

var RedEnvelopeDetail = require("./components/RedEnvelope/RedEnvelopedetail");
//分享预览 add by guYY
var SharePreview = require("./components/User/ThirdPartyPlatformMsg/SharePreview/SharePreview");//share

/*授权成功*/
var AuthSuccess = require("./components/User/ThirdPartyPlatformMsg/AuthSuccess");

var ExchangeActivity = require('./components/ExchangeActivity/Exchange');// 新书兑换模板

// 一键转档页面， add by fishYu 2016-11-7
var DataProcessing = require('./components/DataProcessing/dataProcessing');

// 图书预览页面， add by fishYu 2016-11-25
var BookPreview = require('./components/BookPreview/bookPreview');


var Appeal = require('./components/Appeal/Appeal');// 申诉
var AppealSuccess = require('./components/Appeal/AppealSuccess');// 申诉完成
var WorkExpired = require('./components/Appeal/WorkExpired');//作品失效
var InvalidWork = require('./components/Appeal/InvalidWork');//作品审核不通过

/**
 * App设置
 */
function setup() {
    // 设置material-ui
    injectTapEventPlugin();
}

setup();
var log = require("loglevel");
if (window.fmawr == "0") {
    log.setLevel(0) //trace debug info warn error
} else {
    log.setLevel(3) //warn error
}

var App = React.createClass({

    getInitialState() {
        var MakeWebAPIUtils = require("./utils/MakeWebAPIUtils.js");
        MakeWebAPIUtils.loadPrices();
        return {
            isUserAgentUseful: false
        };
    },

    render: function () {
        var path = location.pathname;
        var navBar;
        var isHaveNavBar = path.indexOf('/appeal') > -1 || path.indexOf('/make') > -1 || path.indexOf('/preview') > -1 ||
            path.indexOf('/404') > -1 || path.indexOf('/phone') > -1 || path.indexOf('/sharePreview') > -1 ||
            path.indexOf('/AuthSuccess') > -1 || path.indexOf('/Recharge') > -1 || path.indexOf('/BookPreview') > -1;
        if (!isHaveNavBar) navBar = (<NavBar />);

        var compatibleTips;

        //if(!this.state.isUserAgentUseful){
        //    compatibleTips = <div className="compatibleTips">
        //        <div className="container">
        //            <p>
        //                ME在当前浏览器下存在兼容问题，推荐使用
        //                <a href='https://www.baidu.com/s?wd=谷歌浏览器' target='_blank'>谷歌浏览器</a>、
        //                <a href='https://www.baidu.com/s?wd=360极速浏览器' target='_blank'>360极速浏览器</a>、
        //                <a href='https://www.baidu.com/s?wd=QQ浏览器' target='_blank'>QQ浏览器</a>（V9.1及以上版本）
        //            </p>
        //            <button onClick={this.closeCompatible}>知道了</button>
        //        </div>
        //    </div>;
        //}

        return (
            <div className="app">
                {/*生成微博长图文图片时使用*/}
                <div id="html-canvas"></div>


                {navBar}

                <Notification ref="currentNotification" />

                <div>
                    {this.props.children}
                </div>
            </div>
        );
    },

    componentDidMount: function () {
        // 设置当前通知组件
        Notification.currentNotification = this.refs.currentNotification;

        //var explorer = window.navigator.userAgent;

        //if (explorer.indexOf("Chrome") >= 0) {
        //    if (parseFloat(explorer.match(/Chrome\/([\d.]+)/)[1]) > 38) {
        //        this.setState({
        //            isUserAgentUseful: true
        //        });
        //    }
        //}else if(/android/i.test(explorer) || /iphone|ipad|ipod/i.test(explorer)){
        //    this.setState({
        //        isUserAgentUseful: true
        //    });
        //}else{
        //    $("#header").css({top: "48px"});
        //}

    },

    closeCompatible: function () {
        $(".compatibleTips").slideUp();
        $("#header").animate({ top: 0 });
    }

});

// 挂载节点
var appMountElement = document.getElementById('app');
// 渲染
render((
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Index} />
            <Route path="/download" component={Download} />
            <Route path="/discovery" component={Discovery} />
            <Route path="/create" component={Create} />
            <Route path="/login" component={Login} />
            <Route path="/login&back=:back" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/make/label=:label" component={MakeMagazine} />
            <Route path="/make/:tid&reEdit=:reEdit" component={MakeMagazine} />
            <Route path="/make/:tid" component={MakeMagazine} />
            <Route path="/makePreview" component={MakePreview} />
            <Route path="/make" component={MakeMagazine} />
            <Route path="/makemagazine/label=:label" component={MakeMagazine} />
            <Route path="/makemagazine/:tid&reEdit=:reEdit" component={MakeMagazine} />
            <Route path="/makemagazine/:tid" component={MakeMagazine} />
            <Route path="/makemagazine" component={MakeMagazine} />
            <Route path="/forget" component={Forget} />
            <Route path="/about" component={About} />
            <Route path="/about/:section" component={About} />
            <Route path="/user/tab/:tabIndex&msgid=:msgid&msgstatus=:msgstatus" component={User} />
            <Route path="/user/tab/:tabIndex" component={User} />
            <Route path="/user" component={User} />
            <Route path="/user/:redenvelopeID" component={User} />
            <Route path="/preview/tid=:tid&uid=:uid" component={Preview} />
            <Route path="/preview/tid=:tid" component={Preview} />
            <Route path="/preview1/tid=:tid&uid=:uid" component={Preview} />
            <Route path="/preview2/tid=:tid&uid=:uid" component={Preview} />
            <Route path="/preview2/tid=:tid" component={Preview} />
            <Route path="/preview1/tid=:tid" component={Preview} />
            <Route path="/form/tid=:tid" component={Form} />
            <Route path="/wxlogin" component={WxLogin} />
            <Route path="/search" component={Search} />
            <Route path="/designerTribe" component={DesignerTribe} />
            <Route path="/DesignerDetail/uid=:uid" component={DesignerDetail} />
            <Route path="/membershipPrivileges" component={MembershipPrivileges} />
            <Route path="/membershipActivity" component={MembershipActivity} />
            <Route path="/phone" component={Mobile} />
            <Route path="/phone/login" component={LoginMobile} />
            <Route path="/phone/register" component={RegisterMobile} />
            <Route path="/phone/case" component={MobileCase} />
            <Route path="/phone/contact" component={Contact} />
            <Route path="/phone/loginS" component={LoginS} />
            <Route path="/ysdh" component={Ysdh} />
            <Route path="/invite" component={Invite} />

            /*活动页面*/
            <Route path="/activity" component={Activity} />
            <Route path="/activityDetail/tid=:tid" component={ActivityDetail} />
            /*分享预览 add by guYY*/
            <Route path="/sharePreview" component={SharePreview} />
            <Route path="/ImportArticle" component={ImportArticle} />
            <Route path="/AuthSuccess" component={AuthSuccess} />
            <Route path="/404" component={NoFondPath} />
            <Route path="/deleteWorkError" component={DeleteWorkError} />
            <Route path="/designer" component={DesignerRoute}>
                <Route path=":_t" component={undefined} />
            </Route>
            <Route path="/Helper" component={HelperRoute}>
            </Route>
            /**充值页面**/
            <Route path="/recharge" component={RechargeView} />
            /**微信充值扫一扫页面**/
            <Route path="/rechargePayment" component={WeChatPaymentView} />
            /**支付成功页面**/
            <Route path="/paymentSuccess" component={PaymentSuccessView} />
            <Route path="/exchangeActivity" component={ExchangeActivity} />
            /**一键转档页面**/
            <Route path="/dataProcessing" component={DataProcessing} />
            /**图书预览页面**/
            <Route path="/BookPreview/:hash" component={BookPreview} />
            <Route path="/appeal" component={Appeal} />
            <Route path="/appealsuccess" component={AppealSuccess} />
            <Route path="/workexpired" component={WorkExpired} />
            <Route path="/workinvalid" component={InvalidWork} />
            <Route path="*" component={NoFondPath} />

        </Route>
    </Router>
), appMountElement)
    /**
     * App组件
     */


    // // 路由器
    // var routes = (
    //     <Route handler={App}>


    //         <Route name="designer" path="/designer" handler={DesignerRoute}>
    //             <Route name="designerApply" path=":_t" handler={DesignerApply}/>
    //             <Redirect to="designer"/>
    //         </Route>
    //         /*
    //         * 邀请好友
    //         */

//         <Route name="Helper" path="/Helper" handler={HelperRoute}>
//             /**
//              * 默认进入 0
//             */
//             <Route name="HelperTab" path=":_t"/>
//             <Redirect to="Helper"/>
//         </Route>
//       
//     </Route>
// );
