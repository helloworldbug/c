/**
 * @component ElementButton
 * @description 元素按钮组件
 * @time 2015-09-06 18:08
 * @author StarZou
 **/

var React = require('react');


var ElementButton = React.createClass({

    render: function () {
        var tip = !this.props.description ? "" : <span className="description">{this.props.description}</span>;
        if (this.props.tabindex) {
            return (
                <div className="element-button" tabIndex="-1" onMouseEnter={this.handleOnMouseOver} onMouseLeave={this.props.onMouseLeave}>
                    <i className={this.props.iconClass}></i>
                    <span className="text">{this.props.text}</span>
                    {tip}
                    {this.props.children}
                </div>
            );
        } else {

            return (
                <div className="element-button" onClick={this.handleClick} >
                    <i className={this.props.iconClass}></i>
                    <span className="text">{this.props.text}</span>
                    {tip}
                    {this.props.children}
                </div>
            );
        }

    },
    handleClick:function(event){
        this.props.onClick(event)
    },
    handleOnMouseOver: function (event) {
        //if(!this.props.onClick){
        //    this.props.setDialogContent(<h1>sdf</h1>);
        //    this.props.toggleDialog(true);
        //}
        this.props.onMouseEnter(event)
        //console.log(this.props, event);
    }

});

module.exports = ElementButton;