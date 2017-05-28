/**
 * @component ElementButton
 * @description 元素按钮组件
 * @time 2015-09-06 18:08
 * @author StarZou
 **/

var React = require('react');


var MenuItem = React.createClass({

    render: function () {
        var tip=!this.props.description?"":<span className="description">{this.props.description}</span>;
        var menuitemClass="menuitem "+this.props.iconClass
        return (
            <div className={menuitemClass} onClick={this.handleClick}>
                <span className="text">{this.props.text}</span>
                {tip}
                {this.props.children}
            </div>
        );
    },

    handleClick: function (event) {
        //if(!this.props.onClick){
        //    this.props.setDialogContent(<h1>sdf</h1>);
        //    this.props.toggleDialog(true);
        //}
        this.props.onClick(event)
        //console.log(this.props, event);
    }

});

module.exports = MenuItem;