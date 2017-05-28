/**
 * @description 修改组件
 * @description 包括昵称等修改
 * @time 2015-9-14
 * @author 曾文彬
 **/

'use strict';

// require core module
var React = require('react');
var ReactDOM=require("react-dom");

// require children component
var Input = require('./Input');

// define Update component
var Update = React.createClass({
    defineInfo() {
        return {
            requiredError: this.props.requiredError,
            formated: this.props.formated,   
            formatedError: this.props.formatedError
        };
    },
    getInitialState() {
        return {
            status: false
        };
    },
    finish() {
        // get child component element
        var nick = ReactDOM.findDOMNode(this.refs.nick);


    },
    cancel() {
        this.hide();
    },
    hide() {
        this.setState({
            status: true
        });    
    },
    render() {
        return (
            <div id="update-message" data-hide={this.state.status ? "ed" : ""} className={this.props.className}>
                <label>{this.props.fieldName}</label>
                <Input ref="nick" placeholder={this.props.fieldValue} maxlength="10" />
                <button className="btn mini">确定</button>
                <button className="btn mini">取消</button>
            </div>
        );
    },
});

// export Update component
module.exports = Update;
