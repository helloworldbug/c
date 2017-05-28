// 文件名：DesignerTribe.jsx
//
// 创建人：YJ
// 创建日期：2015/11/11 16:32
// 描述： 设计师部落首页

'use strict';

var React = require('react');
import {Link} from 'react-router'

var MePC = require('../../lib/MePC_Public');

var Base = require('../../utils/Base');
var Slider = require('../Common/Slider');

var SuperLogicComponent = require('../../lib/SuperLogicComponent'),
    SuperTemplateComponent = require('../../lib/SuperTemplateComponent'),
    MeEvent = require('../../lib/MePC_Event');

var DesignerTribeMsg = require('./DesignerTribeMsg'),
    DesignerTribeLabel = require('./DesignerTribeLabel');

var DesignerTribe = MePC.inherit(SuperLogicComponent, SuperTemplateComponent, React.createClass({

    getDesignersByLabel: function (labelName) {
        MeEvent.trigger('receiveDesignersByLabel', labelName);
    },

    componentWillMount: function () {
        this.setTemplate({
            'msg': <DesignerTribeMsg />,
            'label': <DesignerTribeLabel getDesignersByLabel={ this.getDesignersByLabel } />
        });

        MeEvent.on('receiveDesignersByLabel', function (labelName) {
            MeEvent.trigger('getDesignersByLabel', labelName);
        });
    },

    render: function () {
        var showDesignerBtn = !Base.isLogin() || Base.getCurrentUser().attributes.approved_status != 2
        ? ( 
            <Link to={ !Base.isLogin() ? '/login' : '/designer' } onClick={this.handleClick}>申请认证设计师</Link> 
        ) : null;

        return (
            <div className="inner">
                <Slider ref="slider"/>
                <div className="dsz-home-bg">
                  <div className="designer-top">
                    <div className={ !Base.isLogin() || Base.getCurrentUser().attributes.approved_status != 2
        ? "fl" : "center" }>
                        <h3><span>创意设计师提供设计服务</span> { showDesignerBtn } </h3>
                        <p>电话：400-8868-110　邮箱：business@gli.cn　QQ：2102534037</p>
                    </div>
                  </div>
                </div>

                <div className="designer-bg clearfix">
                    <div className="designer-main">
                        { this.getTemplate('msg') }

                        <div className="designer-type clearfix fr">
                            <h3>按聚焦领域进行分类</h3>
                            { this.getTemplate('label') }
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    handleClick(){
        var hashs = location.pathname.slice(1); 
        
        if (hashs == '') {
            hashs = '/';
        } else if(hashs == 'login') {
            hashs = '/user';
        }

        localStorage.setItem("referer", hashs);
    },

    componentDidMount: function (){
        this.windowScroll();
        this.bindWindowScrollEvent();
    },

    componentWillUnmount() {
        this.bindWindowScrollEvent({ isUnset: true });
    },

    windowScroll: function(){
        var $designerType = $('.designer-type');
        
        $(window).scroll(function(){ 
            ($(window).scrollTop() >= 174) ? $designerType.addClass('fix-type') : $designerType.removeClass('fix-type');
        })
    },

    bindWindowScrollEvent(options) {
        var isUnset = !!options && options.isUnset,
            scrollCallback = this.windowScrollCallback;

        $(window)[isUnset ? 'unbind' : 'bind']('scroll', scrollCallback);
    },

    windowScrollCallback() {
        this.refs.slider.handleScroll();
    },

    handleScroll(event) {
        this.setState({
            backgroundColor: $(window).scrollTop() > ( location.pathname.slice(1)!="discovery" ? bodyHeight : 430 ) ? 'rgba(30, 30, 30, 1)' : void 0
        });
    }
}));

// export DesignerRule component */}
module.exports = DesignerTribe;
