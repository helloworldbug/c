/*
 * Created by 95 on 2015/9/10.
 */

var React = require("react");
var Tag = require('./Tag');

var TagLabel = React.createClass({

    onClick: function (e) {
        this.props.handleTagTouchTap(this.props.tagIndex);
        if (this.props.onClick) {
            this.props.onClick(e);
        }
    },

    render: function () {
        var css = "tag-label";
        if (this.props.active) {
            css += " tag-label-active"
        }
        return (<li className={css} onClick={this.onClick}>{this.props.children}</li>)
    }

});

var Tags = React.createClass({
    displayName: 'Tags',

    getDefaultProps: function getDefaultProps() {
        return {
            initialSelectedIndex: 0
        };
    },

    getInitialState: function getInitialState() {

        var maxIndex = React.Children.count(this.props.children);
        var initialIndex = this.props.initialSelectedIndex;
        return {
            selectedIndex: initialIndex < maxIndex ? initialIndex : 0
        };
    },

    _handleTagTouchTap: function (index) {
        this.setState({selectedIndex: index});
    },

    _isSelected: function (index) {
        return this.state.selectedIndex === index;
    },

    render: function render() {
        var rowChildren = this.props.children;
        var height = document.body.clientHeight - 54 - 132;
        var labels;
        var newChildren;
        var children=[];
        if (Array.isArray(rowChildren)) {
            rowChildren.map((child)=>{
                if(!!child){
                    children.push(child);
                }

            })
            labels = children.map((child, index)=> {
                return (<TagLabel key={index} active={this._isSelected(index)} tagIndex={index}
                                  handleTagTouchTap={this._handleTagTouchTap}
                                  onClick={child.props.onClick}>{child.props.label}</TagLabel>)
            });
            newChildren = children.map((child, index)=> {
                return React.cloneElement(child, {
                    active  : this._isSelected(index),
                    tagIndex: index,
                    key:index
                })
            });
        } else {
            labels = (<TagLabel key="0" active={this._isSelected(0)} tagIndex={0}
                                handleTagTouchTap={this._handleTagTouchTap}
                                onClick={rowChildren.props.onClick}>{rowChildren.props.label}</TagLabel>)
            newChildren =React.cloneElement(rowChildren, {
                active  : this._isSelected(0),
                tagIndex: 0
            })

        }



        return (<div className="tags">
            <ul className="tag-label-wrapper">
                {labels}
            </ul>
            <ul className="tag-wrapper" style={this.props.tagPanelStyle}>
                {newChildren}
            </ul>
        </div>)

    }


});


module.exports = Tags;