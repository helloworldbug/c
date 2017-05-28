/**
 * @component LabelElement
 * @description 按钮元素
 * @time 2015-09-10 17:28
 * @author Nick
 **/

var React = require('react');
var ElementMixin = require('./ElementMixin');

var LabelElement = React.createClass({

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
        var animation = $.extend({}, this.getAnimationStyles(attributes), {
            width : this.state.itemWidth * attributes['x_scale'],
            height: this.state.itemHeight * attributes['y_scale']
        });

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
            lineHeight     : attributes['item_height'] + 'px',
            opacity        : attributes['item_opacity'] / 100,
            borderRadius   : (attributes['bd_radius'] || 0) + 'px',
            textAlign      : attributes['font_halign'] == 'mid' ? 'center' : attributes['font_halign'],
            boxSizing      : 'border-box',
            WebkitTransform: transformStyle,
            MozTransform   : transformStyle,
            msTransform    : transformStyle,
            transform      : transformStyle
        };
        var labelStyle = {
            width: attributes["item_width"] - 33
        };
        var typeUrl;
        var typeString = JSON.parse(attributes["item_val_sub"]);
        for (var prop in typeString) {
            typeUrl = typeString[prop]
        }

        var typeStyle = {
            backgroundImage: 'url(' + typeUrl + ')'
        };
        //console.log(attributes['item_val']);
        return (
            <div className='element' style={style} onMouseDown={this.moveElement}>

                <div style={elementDom} className={"elementDom label "+attributes['ext_attr']}>
                    <div className="type" style={typeStyle}></div>
                    <div className="text" style={labelStyle}
                         dangerouslySetInnerHTML={{__html: attributes['item_val']}}></div>
                </div>
                {this.renderElementSelection()}
            </div>
        );
    }
});

module.exports = LabelElement;