/**
 * @component ActionButton
 * @description 动作按钮
 * @time 2015-09-06 18:15
 * @author StarZou
 **/

var React = require('react');

var ActionButton = React.createClass({

    render: function () {
            var btnClass=this.props.iconClass+" action-button";
        return (
            <div className={btnClass} onClick={this.handleClick}>

                <span className="text">{this.props.text}</span>
            </div>
        );
    },

    handleClick: function (event){
    this.props.onClick(event);
        //var type = this.props.type;
        //console.log(type, event);
    }

});

module.exports = ActionButton;