/**
 * @description 颜色选择器
 * 
 * @author lifeng
*/

var React = require("react");
var ReactDOM = require("react-dom");
var $ = require("jquery");


module.exports = React.createClass({
    getInitialState: function () {
        return {value:this.props.value || ""}
    },

    componentDidMount: function() {
        $(ReactDOM.findDOMNode(this)).spectrum({
            color: this.props.value,
            showPaletteOnly: true,
            togglePaletteOnly: true,
            hideAfterPaletteSelect: true,
            togglePaletteMoreText: '更多',
            togglePaletteLessText: '精简',
            palette: [
                ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ],
            change: function(color){
                this.props.changeParameter(color.toRgbString());
            }.bind(this),
            select:function(color){
                this.props.onSelect&&this.props.onSelect(color);
            }.bind(this),
            hide:function(color){
                this.props.onHide&&this.props.onHide(color);
            }.bind(this),
            show: function(color) {
                this.props.onShow&&this.props.onShow();
            }.bind(this)
        })
    },

    /**
     * 外部属性改变时执行
     */
    componentWillReceiveProps : function(nextProps){
        $(ReactDOM.findDOMNode(this)).spectrum("set", nextProps.value);
    },

    render: function() {
        return (
            <input type='text' />
        )
    }
});
