/**
 * @name 底部组件
 * @time 2015-9-11
 * @author 曾文彬
 **/

'use strict';

// require core module
var React = require('react'),
    Base = require('../../utils/Base');
import {Link} from 'react-router'
// require css module
var FooterCSS = require('../../../assets/css/footer.css');

// require children component
var Images = require('./Image');

// require common mixins
var ImageModules = require('../Mixins/ImageModules');

// define Footer component
var Footer = React.createClass({

    mixins: [ImageModules],

    buildAboutLink(hash, type) {
        return (_e => {
            location.pathname.indexOf('about') > -1 ? this.props.render(type) : Base.linkToPath(hash);
        }).bind(this);
    },

    render() {
        return (
            <div id="footer" className={this.props.className ? this.props.className + ' clearfix' : 'clearfix'}>
                <div className="footer clearfix">
                    <div className="fl">
                       {/**
                        <a href="javascript:;" onClick={this.buildAboutLink('/about/us?action=us', 'us')}>关于我们</a>
                         <i>-</i>
                        <a href="javascript:;" onClick={this.buildAboutLink('/about/join?action=join', 'join')}>加入我们</a>
                        <i>-</i>
                        <a href="javascript:;" onClick={this.buildAboutLink('/about/service?action=service', 'service')}>服务协议</a>
                        * 
                        */ }
                    </div>

                    <div className="copyright fr">
                        <p></p>
                    </div>

                </div>
            </div>
        );
    }
});

// export Footer component
module.exports = Footer;
