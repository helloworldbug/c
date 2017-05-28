/**
 * @component Header
 * @description 头部组件
 * @time 2015-08-31 18:16
 * @author StarZou
 **/

var React = require('react');

var ElementBar = require('./Tools/Bar/ElementBar');
var LogoButton = require('./Tools/Button/LogoButton');
var ActionBar = require('./Tools/Bar/ActionBar');

var Header = React.createClass({


    render: function () {
        return (
            <div className="header row">
                <LogoButton/>
                <ElementBar/>
                <ActionBar/>

            </div>
        );
    }

});

module.exports = Header;