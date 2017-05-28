/**
 * @name 导航条模块
 * @author 曾文彬
 * @datetime 2015-9-6
 */

'use strict';

// require core module
var React = require('react'),
    ReactDOM=require("react-dom"),
    $ = require('jquery'),
    Base = require('../../utils/Base'),
    ImageModules = require('../Mixins/ImageModules');
    import {Link} from 'react-router'
var ContextUtils = require('../../utils/ContextUtils');
// require css module
require('../../../assets/css/new_navbar.css');

// require children component
var Dialog = require('./Dialog'),
    Images = require('./Image');


var bodyHeight = $(window).height();

// define Footer component
var NavBar = React.createClass({

    mixins: [ImageModules],

    buildUserNavItem() {
        var isLoginState = Base.isLogin();

        if (isLoginState) {

            var user = Base.getCurrentUser().attributes.approved_status,
                authentication = null;

            if (user == 2) {
                authentication = <img className="navImgV" src={this.defineImageModules()["privilege"]}/>;
            }

            return (
                <div className="end-sign fr">
                    <Link to="user" style={{height:"34px",display:"inline-block"}}
                          onClick={this.confirm.bind(this,"/user")}><Images
                        src={ Base.buildDefaultUserLogo(ImageModules.defineImageModules().defaultUserLogo) }
                        className="face" width="34" height="34"/>
                        {authentication}
                    </Link>
                    {/*<span className="point"></span>*/}
                    <div className="sign-down">
                        <div className="top-bg"></div>
                        <div className="sign-down-lists" style={{ backgroundColor: this.state.backgroundColor }}>
                            <ul>
                                <li>
                                    <Link to="user" onClick={this.confirm.bind(this,"/user")}>个人中心</Link>
                                </li>
                                <li>
                                    <Link to="invite" onClick={this.confirm.bind(this,"/invite")}>邀请好友</Link>
                                </li>
                                {/*<li>
                                 <Link to="designer">认证设计师</Link>
                                 </li>*/}
                                <li>
                                    <a href="javascript:;" onClick={ this.handleLogout }>退出登录</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="top-sign fr">
                    <Link to="login" onClick={this.handleClick}>登录LOGIN</Link>
                    <span>|</span>
                    <Link to="register">注册 SIGN UP</Link>
                </div>
            );
        }
    },
    handleClick(){
        var hashs = location.pathname;

        if (hashs == '') {
            hashs = '/'
        } else if (hashs == '/login') {
            hashs = '/user'
        }
        localStorage.setItem("referer", hashs);
    },
    popupDialog(state) {
        this.refs.dialog.setState({
            appearanceState: state
        });
    },
    handleLogout() {
        this.popupDialog(true);
    },
    backToIndexPage() {
        // close dialog
        this.popupDialog(false);

        //logout current user
        ContextUtils.logout();

        // link to index
        location.pathname === '/' ? location.reload() : Base.linkToPath('/');
    },

    handleMouse(type, state) {
        var context = this;
        return (_e => {
            if (!state) {
                //$(React.findDOMNode(context.refs[type + '-line'])).css('left', '-90px');    
                //$(React.findDOMNode(context.refs[context.selectType + '-line'])).css('left', 0);
                if (context.selectType === type) {


                } else {
                    $(ReactDOM.findDOMNode(context.refs[type + '-line'])).css('left', '-90px');
                    $(ReactDOM.findDOMNode(context.refs[context.selectType + '-line'])).css('left', 0);
                }


                //if (context.selectType === type) {
                //$(React.findDOMNode(context.refs[type + '-line'])).css('left', 0);
                //}
            } else {
                $(ReactDOM.findDOMNode(context.refs[context.selectType + '-line'])).css('left', '-90px');
                $(ReactDOM.findDOMNode(context.refs[type + '-line'])).css('left', 0);
            }
        }).bind(this);
    },

    getMarginLeft() {
        return 12;
    },

    getNavStyle() {
        var hash = location.pathname.slice(1),
            hashExp = /[^/]+/,
            hashRet = hashExp.exec(hash),
            hashFirstChar;

        var defaultChar = 'create';

        if (!hashRet) return;

        hashFirstChar = hashRet[0];

        if (hashFirstChar == 'designerDetail') {
            hashFirstChar = 'designerTribe';
        }

        return (hashFirstChar === 'discovery' || hashFirstChar === 'create' || hashFirstChar === 'designerTribe' || hashFirstChar === 'preview' || hashFirstChar === 'helper') && hashFirstChar;
    },

    getInitialState() {
        return {
            backgroundColor: void 0
        }
    },

    getOffsetLeft(element) {
        return $(element).position().left + this.getMarginLeft();
    },

    setWindowScrollEvent(options) {
        var isUnset = !!options && options.isUnset;
        $(window)[isUnset ? 'unbind' : 'bind']('scroll', this.handleScroll);
    },


   
    handleScroll(event) {
        var pathname = location.pathname.slice(1);

        this.setState({
            backgroundColor: $(window).scrollTop() > ( pathname !== "discovery" ? pathname !== 'designerTribe' ? bodyHeight : 174 : 430 ) ? 'rgba(30, 30, 30, 1)' : void 0
        });
    },

    searchFocus(){
        var dom = ReactDOM.findDOMNode(this.refs.searchIn);
        if (!$(dom).hasClass("searchOpen")) {
            $(dom).addClass("searchOpen");
            $(dom).children("input").attr("placeholder", "搜索作品、模版");
        }
    },

    searchBlur(){
        var dom = ReactDOM.findDOMNode(this.refs.searchIn);
        if ($(dom).hasClass("searchOpen") && ($(dom).children("input").val() == "")) {
            $(dom).removeClass("searchOpen");
            // $(dom).children("input").val("");
            $(dom).children("input").attr("placeholder", "搜索");
        }
    },
    searchSubmit(e){
        var value = $(ReactDOM.findDOMNode(this.refs.searchIn)).children("input").val();
        if (value != "") {
            Base.linkToPath("/search?value=" + value);
        } else {
            // this.searchFocus();
        }
    },
    keyDown(e){
        if (e.which == "13") {
            $(".searchIcon").trigger("click");
        }
    },
    iconHover(){
        var dom = ReactDOM.findDOMNode(this.refs.searchIn);
        if ($(dom).hasClass("searchOpen") && ($(dom).children("input").val() != "")) {
            $(dom).children('span').addClass("searchOpacity");
        }
    },
    iconLeave(){
        var dom = ReactDOM.findDOMNode(this.refs.searchIn);
        $(dom).children('span').removeClass("searchOpacity");
    },
    confirm: function (hash, event) {
        var url = window.location.href;
        if (url.indexOf('/user/tab/12') > -1) {
            $("#header").trigger("nav", [{url: hash}])
            event.preventDefault();
        }
    },
    render() {
        //根据hash 判断是否显示搜索条
        var ishid = false;
        if (location.pathname.match(/login|forget|register/) != null) {
            ishid = true;
        }

        return (
            <div>
                <Dialog ref="dialog" sureFn={this.backToIndexPage} title="确定要登出吗？"/>
                <header id="header" style={{ backgroundColor: this.state.backgroundColor }}
                        className={location.pathname.slice(1).match(/user|about|help|search|invite|designerDetail|activity|deleteWorkError|workexpired|workinvalid/) ? "bg_black" : ""}>
                    <div className="contain clearfix" ref="contain">

                        <div id="logo" className="fl">
                            <Link to="/">
                                <Images src={ this.defineImageModules().websiteLogo } height="35"/>
                            </Link>
                        </div>

                        <div id="nav" ref="nav">
                            <ul>
                                <li ref="create" onMouseOver={ this.handleMouse('create', 'hover') }
                                    onMouseOut={ this.handleMouse('create') }>
                                    <Link to="/create" onClick={this.confirm.bind(this,"/create")} activeClassName="active">场景创作</Link>
                                    <span ref="create-line" className="nav-line" ></span>
                                </li>

                                <li ref="discovery" onMouseOver={ this.handleMouse('discovery', 'hover') }
                                    onMouseOut={ this.handleMouse('discovery') }>
                                    <Link to="/discovery" onClick={this.confirm.bind(this,"/discovery")} activeClassName="active">精品推荐</Link>
                                    <span ref="discovery-line" className="nav-line"
                                          ></span>
                                </li>

                                <li ref="designerTribe" onMouseOver={ this.handleMouse('designerTribe', 'hover') }
                                    onMouseOut={ this.handleMouse('designerTribe') }>
                                    <Link to="/designerTribe"
                                       onClick={this.confirm.bind(this,"/designerTribe")} activeClassName="active">设计部落</Link>
                                    <span ref="designerTribe-line" className="nav-line"
                                          ></span>
                                </li>

                                <li ref="membershipPrivileges" onMouseOver={ this.handleMouse('membershipPrivileges', 'hover') }
                                    onMouseOut={ this.handleMouse('membershipPrivileges') }>
                                    <Link to="/membershipPrivileges"
                                          onClick={this.confirm.bind(this,"/membershipPrivileges")} activeClassName="active">会员特权</Link>
                                    <span ref="membershipPrivileges-line" className="nav-line"
                                          ></span>
                                </li>
                                <li ref="membershipActivity" onMouseOver={ this.handleMouse('membershipActivity', 'hover') }
                                    onMouseOut={ this.handleMouse('membershipActivity') }>
                                    <Link to="/membershipActivity"
                                          onClick={this.confirm.bind(this,"/membershipActivity")} activeClassName="active">会员活动</Link>
                                    <span ref="membershipActivity-line" className="nav-line"
                                          ></span>
                                </li>

                                <li ref="helper" onMouseOver={ this.handleMouse('helper', 'hover') }
                                    onMouseOut={ this.handleMouse('helper') }>
                                    <Link to="/helper" onClick={this.confirm.bind(this,"/helper")} activeClassName="active">帮助中心</Link>
                                    <span ref="helper-line" className="nav-line"
                                          ></span>
                                </li>
                            </ul>
                        </div>

                        <div className="header-ri fr"> 
                            <span className={ishid?"hid":"search"} ref="searchIn"
                                  style={Base.isLogin()?{}:{right:"208px"}} onBlur={this.searchBlur}
                                  onKeyDown={this.keyDown}>
                                <input type="text" placeholder="搜索" onClick={this.searchFocus}/>
                                <span className="searchIcon" onClick={this.searchSubmit} onMouseEnter={this.iconHover}
                                      onMouseLeave={this.iconLeave}></span>
                            </span>
                            {this.buildUserNavItem()}
                        </div>

                    </div>
                </header>
            </div>
        );
    },

    componentDidMount() {
        this.setWindowScrollEvent();
        this.rePosition();
        window.addEventListener("resize",this.rePosition)
        // this.bindSearchBlur();
    },

    rePosition:function(){
        var dom = this.refs.contain;
        var $dom = $(dom);
        var $parentNode = $(dom.parentNode);
        var $nav = $(this.refs.nav);
        var marginLeft=($parentNode.width() - $dom.width())/2;
        $dom.css({"marginLeft":`${marginLeft}px`});
        $nav.css({left:`${($parentNode.width() - $nav.width())/2}px`})
    },

    componentWillUnmount() {
        window.removeEventListener("resize",this.rePosition)
        this.setWindowScrollEvent({isUnset: true});
    }
});

// export Footer component
module.exports = NavBar;
