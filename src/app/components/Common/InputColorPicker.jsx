/**
 * @description 输入颜色选择器
 * @date 2016 7/8
 * @author tony
 **/

'use strict';

// require core module
var React = require('react');
var ColorPicker = require('./ColorPicker');
// define InputColorPicker
var InputColorPicker = React.createClass({
    /**
     * 默认值
     * @returns {{}}
     */
    getInitialState: function () {
        return {value: this.props.value || ""}
    },

    propTypes: {
        //组件样式
        className: React.PropTypes.string,
        //组件的值
        value    : React.PropTypes.string,
        //input type
        type     : React.PropTypes.string,
        //外部监听值改变事件
        onChange : React.PropTypes.func
    },

    rgbToHex: function (rgb, g, b) {
        if (g == undefined || b == undefined) {
            if (typeof rgb == "string") {
                var result = /^rgb[a]?\(([\d]+)[ \n]*,[ \n]*([\d]+)[ \n]*,[ \n]*([\d]+)[ \n]*,?[ \n]*([.\d]+)?[ \n]*\)$/i.exec(rgb);
                if(!result){
                    return ""
                }
                return ms.rgbToHex(parseInt(result[1]), parseInt(result[2]), parseInt(result[3]));
            }
            if (rgb.r == undefined || rgb.g == undefined || rgb.b == undefined) {
                return null;
            }
            return rgbToHex(rgb.r, rgb.g, rgb.b);
        }
        var r = rgb;

        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    },

    /**
     * 输入框内容改变事件
     * @param e
     */
    onChangeHandler: function (e) {
        var value = e.target.value;
        value = "#" + value.replace(/[^0-9a-fA-F]/g, "");
        var len = value.length;
        if (len > 7) {
            return;
        }
        var isChangePiker = false;
        //改变显示的值
        this.setState({inputValue: value});
        //通知外部改变
        if (len == 7) {
            if (this.props.onChange) {
                this.props.onChange(value);
            }
        }
    },

    /**
     * ColorPicker 选择器改变事件
     * @param e
     */
    onChangeColorHandler: function (color) {
        //通知外部改变
        if (this.props.onChange) {
            this.props.onChange(color);
        }
    },

    /**
     * 外部属性改变时执行
     */
    componentWillReceiveProps: function (nextProps) {
        this.setState({value: nextProps.value, inputValue: nextProps.value});
    },

    render: function () {
        var className = this.props.className || "";
        var type = this.props.type || "";
        var color = this.state.value;
        var inputValue = this.state.inputValue || color;
        if (inputValue.indexOf("#") < 0) {
            inputValue = this.rgbToHex(color);
        }
        return (
            <div className={className}>
                <ColorPicker value={color} changeParameter={this.onChangeColorHandler}/>
                <input type={type} value={inputValue} onChange={this.onChangeHandler}/>
            </div>
        );
    },
});

//export InputColorPicker component
module.exports = InputColorPicker;