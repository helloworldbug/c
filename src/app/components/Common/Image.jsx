/**
 * @name 图片组件
 * @time 2015-10-9
 * @author 曾文彬
 **/

'use strict';

// require core module
var React = require('react');

// define Image component
var Images = React.createClass({
    render() {
        return <img src={this.props.src} width={this.props.width} {...this.props} />
    }
});

// export Image component
module.exports = Images;