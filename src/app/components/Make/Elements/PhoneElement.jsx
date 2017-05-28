/**
 * @component PhoneElement
 * @description 一键拨号
 * @time 2015-12-16 11:10
 * @author Nick
 **/

var React = require('react');
var ElementMixin = require('./ElementMixin');
var GlobalFunc=require("../../Common/GlobalFunc")

var PhoneElement = React.createClass({

    mixins: [ElementMixin],

    getInitialState: function () {
        return {
            isMoving: true
        }
    },

    render: function () {
        var attributes = this.props.attributes;

        var style = $.extend({}, this.getStyles(attributes), {
            cursor: this.state.isMoving ? '-webkit-grab' : 'text'
        });
        var animation = $.extend({}, this.getAnimationStyles(attributes), {});

        var transformStyle = 'rotate(' + attributes['rotate_angle'] + 'deg) scale(' + attributes['x_scale'] + ',' + attributes['y_scale'] + ')';
        var width = parseInt(attributes["item_width"]);
        var height = parseInt(attributes["item_height"]);
        var elementDom = {
            position       : "absolute",
            left           : (width * attributes['x_scale'] - width) / 2,
            top            : (height * (attributes['y_scale']) - height) / 2,
            width          : (parseInt(attributes["item_width"])) + "px",
            height         : attributes["item_height"] + "px",
            textShadow     : attributes["font_frame"] ? "0px 0px " + attributes["frame_pixes"] + "px " + (attributes["frame_color"] || "") : "none",
            color          : attributes['item_color'],
            fontSize       : attributes['font_size'],
            fontWeight     : attributes['font_weight'],
            boxSizing      : 'border-box',
            lineHeight     : attributes['item_height'] + 'px',
            opacity        : attributes['item_opacity'] / 100,
            textAlign      : attributes['font_halign'] == 'mid' ? 'center' : attributes['font_halign'],
            backgroundColor: attributes["bg_color"],
            borderWidth    : (attributes['item_border'] || 0) + 'px',
            borderStyle    : attributes['bd_style'] || 'solid',
            borderColor    : attributes['bd_color'] || '#000',
            borderRadius   : (attributes['bd_radius'] || 0) + 'px',
            WebkitTransform: transformStyle,
            MozTransform   : transformStyle,
            msTransform    : transformStyle,
            transform      : transformStyle,
            overflow       : "hidden"
        };

        return (
            <div className='element' style={style} onMouseDown={this.moveElement}>
                <div style={elementDom} className="elementDom phone">
                    {GlobalFunc.htmlDecode(attributes['item_val_sub'])}
                </div>
                {this.renderElementSelection()}
            </div>
        );
    }

});

module.exports = PhoneElement;