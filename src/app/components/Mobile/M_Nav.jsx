/**
 * @component M_Index.jsx
 * @description 移动端首页组件
 * @time 2015-11-24
 * @author 曾文彬
 **/

'use strict';

var React = require('react'),
    Base = require('../../utils/Base'); 
    import {Link} from 'react-router'

var MNav = React.createClass({

    /**
     * 生成头部
    */
    generatorHeader: function () {
        return (
            <div className="mobile-header"> 
                <input type="checkbox" id="ac-gn-menustate" className="ac-gn-menustate" />
                <nav id="ac-globalnav">
                    <div className="ac-gn-content">
                        <ul className="ac-gn-header">
                            <li className="ac-gn-item ac-gn-menuicon">
                                <label className="ac-gn-menuicon-label" for="ac-gn-menustate" aria-hidden="true">
                                    <span className="ac-gn-menuicon-bread ac-gn-menuicon-bread-top">
                                      <span className="ac-gn-menuicon-bread-crust ac-gn-menuicon-bread-crust-top"></span>
                                    </span>
                                    <span className="ac-gn-menuicon-bread ac-gn-menuicon-bread-bottom">
                                      <span className="ac-gn-menuicon-bread-crust ac-gn-menuicon-bread-crust-bottom"></span>
                                    </span>
                                </label>
                            </li>
                        </ul>
                    </div>
                    <div className="mobile-nav-lists">
                        <ul>
                            <li><a href="http://me.agoodme.com/">下载APP</a></li>
                            <li><Link to="/phone/case">更多案例</Link></li>
                            <li><Link to="/phone/contact">联系我们</Link></li>
                        </ul> 
                    </div>
                </nav> 


                <div className="mobile-logo"><Link to="/phone">首页</Link></div>
                <div className="user-icon"><Link to={ Base.isLogin() ? '/phone/loginS' : '/phone/login'}>登录</Link></div>             
            </div>    
        ); 
    }, 

    render: function () { 

        return (
            <div>
                { this.generatorHeader() }  
            </div>
        );
    } 

});

module.exports = MNav;
