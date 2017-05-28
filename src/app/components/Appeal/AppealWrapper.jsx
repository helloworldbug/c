/**
 * @description 申诉头尾页
 * 
 * @author lifeng
*/


'use strict';

// require core module
var React = require('react');
var AppealHeader = require("../Common/AppealHeader");
var Footer = require("../Common/Footer")
require("../../../assets/css/appeal.css");
var classnames = require('classnames');


var AppealWrapper = React.createClass({
    render() {
        var rootClass=classnames({
            appeal:true,
            "appeal-success":true,
            "extra-top":!this.props.showAppealHeader
        })
        return (
            <div className={rootClass}>
                {this.props.showAppealHeader&&<AppealHeader />}
                <div className="content-wrapper">
                    <div className="content">
                        <h1>{this.props.title}</h1>
                        <div className="text">
                            <span className={"icon "+this.props.icon}></span>
                            <div className="tips" dangerouslySetInnerHTML={{__html:this.props.tips}}></div>
                            {this.props.footer}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
})



module.exports = AppealWrapper;