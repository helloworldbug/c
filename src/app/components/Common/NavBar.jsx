/**
 * @name 导航条模块
 * @author 曾文彬
 * @datetime 2015-9-6
 */

'use strict';

// require core module
var React = require('react'),
    Router = require('react-router'),
    Link = Router.Link,
    Base = require('../../utils/Base');

// require css module
var FormCSS = require('../../../assets/css/navbar.css');

// require children component
var Dialog = require('./Dialog'),
    Images = require('./Image');

// require common mixins
var ImageModules = require('../Mixins/ImageModules');

// define Footer component
var NavBar = React.createClass({

    mixins: [ImageModules, Router.State],

    buildHomepageItem() {
        if (Base.isLogin()) {

            var component;
            var isPreviewPage = this.isActive('preview') || this.isActive('previewNoneUser');
            var from = this.getQuery().form;

            if (isPreviewPage && from === 'user') {
                component = (<Link className="active" to="/user">个人中心</Link>);
            } else {
                component = (<Link to="user">个人中心</Link>);
            }

            return (
                <li>
                    {component}
                </li>
            );
        }
    },

    buildDiscoveryItem() {
        var component;
        var isPreviewPage = this.isActive('preview') || this.isActive('previewNoneUser');
        var isAboutPage = this.isActive('about') || this.isActive('aboutSection');
        var from = this.getQuery().form;

        if ((isPreviewPage && from === undefined) || isAboutPage) {
            component = (<Link className="active" to="/discovery">发现</Link>);
        } else {
            component = (<Link to="discovery">发现</Link>);
        }

        return component;
    },

    buildFormItem() {
        var isLoginState = Base.isLogin(),
            text = isLoginState ? '登出' : '登录/注册';

        if (isLoginState) {
            return (
                <li><a href="javascript:;" onClick={this.handleLogout}>{text}</a></li>
            );
        } else {
            return (
                <li>
                    <Link to="login">{text}</Link>
                </li>
            );
        }
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
        fmacloud.User.logOut();

        // link to index
        location.pathname === '/' ? location.reload() : Base.linkToPath('/');
    },

    render() {
        return (
            <div>
                <Dialog ref="dialog" sureFn={this.backToIndexPage} title="确定要登出吗？"/>
                <nav id="bg" className="nav">
                    <div className="container">
                        <Link className="logo" to="/">
                            <Images alt="logo" src={this.defineImageModules()['websiteLogo']}/>
                        </Link>
                        <ul className="fr clearfix">
                            <li>
                                <Link to="index">首页</Link>
                            </li>
                            <li>
                                <Link to="download">APP</Link>
                            </li>
                            <li>
                                {this.buildDiscoveryItem()}
                            </li>
                            <li>
                                <Link to="create">创建</Link>
                            </li>
                            {this.buildHomepageItem()}
                            {this.buildFormItem()}
                        </ul>
                    </div>
                </nav>
            </div>
        );
    },

    componentDidMount() {
        // load svg animation
        Base.loadSVGAnimation('#bg');
    }
});

// export Footer component
module.exports = NavBar;