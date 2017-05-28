/**
 * @component InputTextElement
 * @description 输入框元素
 * @time 2015-09-10 17:28
 * @author Nick
 **/

var React = require('react');
var ElementMixin = require('./ElementMixin');

var InputTextElement = React.createClass({

    mixins: [ElementMixin],

    getInitialState: function () {
        return {
            isMoving : true,
            scaleType: "scale"
        }
    },

    render: function () {
        var attributes = this.props.attributes;

        var style = $.extend({}, this.getStyles(attributes), {
            fontSize       : attributes['font_size'],
            fontWeight     : attributes['font_weight'],
            letterSpacing  : attributes['font_dist'] + 'px',
            backgroundColor: null
        });
        var animation = this.getAnimationStyles(attributes);
        var fixLeft = (attributes["item_width"] * attributes['x_scale'] - attributes["item_width"]) / 2;
        var fixTop = (attributes["item_height"] * attributes['y_scale'] - attributes["item_height"]) / 2;
        var transformStyle = 'rotate(' + attributes['rotate_angle'] + 'deg) scale(' + attributes['x_scale'] + ',' + attributes['y_scale'] + ')';
        var elementDom = {
            left           : fixLeft,
            top            : fixTop,
            color          : "#000000",
            position       : "absolute",
            width          : attributes["item_width"] + "px",
            height         : attributes["item_height"] + "px",
            textShadow     : attributes["font_frame"] ? "0px 0px " + attributes["frame_pixes"] + "px " + (attributes["frame_color"] || "") : "none",
            lineHeight     : attributes['item_height'] -2*attributes['item_border']+ 'px',
            opacity        : attributes['item_opacity'] / 100,
            paddingLeft    : "10px",
            backgroundColor: attributes["bg_color"],
            borderWidth    : attributes['item_border'] || 0 + 'px',
            borderStyle    : attributes['bd_style'] || 'solid',
            borderColor    : attributes['bd_color'] || '#000',
            borderRadius   : attributes['bd_radius'] || 0 + 'px',
            boxSizing      : 'border-box',
            WebkitTransform: transformStyle,
            MozTransform   : transformStyle,
            msTransform    : transformStyle,
            transform      : transformStyle
        };

        return (
            <div className='element' style={style} onMouseDown={this.moveElement}>
                <div style={elementDom} className='elementDom'
                     dangerouslySetInnerHTML={{__html: attributes['item_val']}}></div>
                {this.renderElementSelection()}
            </div>
        );
    }

});

module.exports = InputTextElement;