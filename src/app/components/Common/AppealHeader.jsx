/**
 * @description 申诉头部
 * 
 * @author lifeng
*/

'use strict';

// require core module
var React = require('react');
var ImageModules = require('../Mixins/ImageModules');
var  Images = require('./Image');

// define Download component
var AppealHeader = React.createClass({

    mixins: [ImageModules],



    render() {
        return (
            <header id="header"  className="clearfix" >
                <div className="contain clearfix">

                 <div id="logo" className="fl">

                     {/*   <Images src={this.defineImageModules().websiteLogo} height="35" />*/}

                    </div>
                </div>
            </header>
        );
    }
});



module.exports = AppealHeader;