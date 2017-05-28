/**
 * @component M_Index.jsx
 * @description 移动端首页组件
 * @time 2015-11-24
 * @author 曾文彬
 **/

'use strict';

var React = require('react');
import {Link} from 'react-router'

var MePC = require('../../lib/MePC_Public');

var MSuper = require('./M_Super'),
    MNav = require('./M_Nav');

var MIndex = MePC.inherit(MSuper, React.createClass({

    /*
    *首页banner
    */ 
    generatorBanner: function() {
        return  (
            <div className="mobile-banner">
                <Link to="/phone/register">立即注册</Link>
            </div>
        );
    }, 

    /*
    *免费在线制作
    */ 
    generatorOnlineMake:function(){
        return (
            <div className="home-onlineMake">
                <div className="home-works">
                    <h1>免费在线制作</h1>
                    <h3>无需编程，人人都能制作动态H5</h3>
                </div>
                <div className="pic"></div>
            </div>
        );
    },


    /*
    *互动营销神器
    */ 
    generatorInteract:function(){
        return  (
            <div className="home-interact">
                <div className="home-works">
                    <h1>自媒体表达神器</h1>
                    <h3>自媒体互动时代，H5引领潮流</h3>
                </div>
                <div className="pic"></div>
            </div>
        ); 
    },

    /*
    *免费平台推广
    */ 
    generatorPlatform:function(){
        return  (
            <div className="home-platform">
                <div className="home-works">
                    <h1>免费平台推广</h1>
                    <h3>APP、PC双端制作浏览,传播力极强</h3>
                </div>
                <div className="pic"></div>
            </div>
        ); 
    },

    /*
    * 丰富应用场景
    */ 
    generatorScene:function(){
        return  (
            <div className="home-scene">
                <div className="home-works">
                    <h1>丰富应用场景</h1> 
                </div>
                <div className="pic"></div>
            </div>
        ); 
    },

    /*
    * Ta们都在使用
    */
    generatorUse:function(){
        return  (
            <div className="home-use">
                <div className="home-works">
                    <h1>Ta们都在使用</h1> 
                </div>
                <div className="pic"></div>
                <Link className="a-works" to="/phone/case">更多案例</Link>
            </div>
        ); 
    },

    /*
    * 90%的中小企业都在使用移动营销推广
    */
    generatorHomeBottom:function(){
        return  (
            <div className="home-contact">
                <div className="home-contact-works">
                    <h1>数百万自媒体都在使用<br/>ME创作内容</h1>
                </div>
                <div className="pic">
                    <h1>开启你的自媒体时代</h1>
                    <h3>立即开启电脑登录　 www.agoodme.com</h3>
                    <p className="clearfix">
                        <Link to="/phone/register">立即注册</Link>
                        <Link to="/phone/contact">联系我们</Link>
                    </p>
                </div> 
            </div>
        ); 
    },

    render: function () {

        // if (!this.isMobileDevice()) {
        //     Base.linkToPath('/');
        //     return;
        // }

        this.generatorMobileMeta();
        this.generatorMobileCSSSheet();
        this.modifierRootClassByName();

        return (
            <div>
                <MNav />

                { this.generatorBanner() }
                
                { this.generatorOnlineMake() }
                
                { this.generatorInteract() }
                
                { this.generatorPlatform() }
                
                { this.generatorScene() }
                
                { this.generatorUse() }
                
                { this.generatorHomeBottom() }
            
            </div>
        );
    },

    componentWillUnmount: function () {
        // 删除mobile 样式
        this.modifierRootClassByName(true);
    }
}));

module.exports = MIndex;
