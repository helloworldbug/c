/**
 * @description 关于页面组件
 * @time 2015-9-11
 * @author 曾文彬
**/

'use strict';

// require core module
var React = require('react');

// require children component
var AboutItem = require('./AboutItem'),
    Footer = require('../Common/Footer'),
    Slider = require('../Common/Slider');

//require image
var ImageModules = require('../Mixins/ImageModules');

// define About component
var About = React.createClass({
    
    renderAboutItem(type) {
        
        this.setState({
            defaultRefSign: type
        });
    },  

    getPathName(){
        var hash = location.pathname;

        var hashExp = /action=(.*?)$/;
        
        return hashExp.test(hash) && RegExp.$1;
    },

    render() {
        return (
            <div className="inner">
                {/*<div className="about-nav">
                  <div className="container">
                    <span className="about-nav-title">网站导航</span>
                  </div>
                </div>*/}
            
                
                <AboutItem defaultRefSign={(this.state && this.state.defaultRefSign) || 'us'} />
            
            <Slider ref="slider" />
            <Footer render={this.renderAboutItem} />
          </div>
        );
    },

    componentDidMount(){
        this.bindWindowScrollEvent();
    },

    componentWillUnmount() {
        // WorkStore.removeChangeListener(this.onChange);
        this.bindWindowScrollEvent({ isUnset: true });
    },

    componentWillMount() {
        this.renderAboutItem(this.getPathName());
    },

    bindWindowScrollEvent(options) {
        var isUnset = !!options && options.isUnset,
            scrollCallback = this.windowScrollCallback;

        $(window)[isUnset ? 'unbind' : 'bind']('scroll', scrollCallback);
    },

    windowScrollCallback() {
        this.refs.slider.handleScroll();  
    },
});

// export About component
module.exports = About;