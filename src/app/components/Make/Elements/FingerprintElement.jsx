/**
 * @component VoteElement
 * @description 投票元素
 * @time 2015-09-25 14:00
 * @author Nick
 **/

var React = require('react');
var ElementMixin = require('./ElementMixin');

var FingerprintElement = React.createClass({

    mixins: [ElementMixin],

    getInitialState: function () {
        return {
            isMoving : true,
            scaleType: "scale"
        }
    },

    render: function () {
        var attributes = this.props.attributes;

        // Todo
        var style = $.extend({}, this.getStyles(attributes), {
            cursor: this.state.isMoving ? '-webkit-grab' : 'text'
        });
        var animation = $.extend({}, this.getAnimationStyles(attributes), {
            width : this.state.itemWidth * attributes['x_scale'],
            height: this.state.itemHeight * attributes['y_scale']
        });

        var transformStyle = 'rotate(' + attributes['rotate_angle'] + 'deg) ' + 'scale(' + attributes['x_scale'] + ',' + attributes['y_scale'] + ')';
        var width = parseInt(attributes["item_width"]);
        var height = parseInt(attributes["item_height"]);
        var elementDom = {
            position       : "absolute",
            left           : (width * attributes['x_scale'] - width) / 2,
            top            : (height * (attributes['y_scale']) - height) / 2,
            width          : (parseInt(attributes["item_width"])) + "px",
            height         : attributes["item_height"] + "px",
            color          : attributes['item_color'],
            fontSize       : attributes['font_size'],
            fontWeight     : attributes['font_weight'],
            textShadow     : attributes["font_frame"] ? "0px 0px " + attributes["frame_pixes"] + "px " + (attributes["frame_color"] || "") : "none",
            lineHeight     : attributes['item_height'] + 'px',
            opacity        : attributes['item_opacity'] / 100,
            backgroundColor: attributes["bg_color"],
            borderRadius   : attributes['bd_radius'] || 0 + 'px',
            textAlign      : attributes['font_halign'] == 'mid' ? 'center' : attributes['font_halign'],
            boxSizing      : 'border-box',
            WebkitTransform: transformStyle,
            MozTransform   : transformStyle,
            msTransform    : transformStyle,
            transform      : transformStyle
        };
        var color = {
            borderColor: attributes['item_color']
        };

        var rgb = attributes["item_color"].replace(/\s+/g, "");
        var rgbarr = rgb.match(/rgb\((\d+),(\d+),(\d+)\)/);
        var startColor = "rgba(" + rgbarr[1] + "," + rgbarr[2] + "," + rgbarr[3] + "," + "0)";
        var shadowColor = "rgba(" + rgbarr[1] + "," + rgbarr[2] + "," + rgbarr[3] + "," + "0.35)";
        var shadowString = "0px 0px 4px " + shadowColor;
        //var itemColorHex="#"+parseInt(rgbarr[1]).toString(16)+parseInt(rgbarr[2]).toString(16)+parseInt(rgbarr[3]).toString(16)
        //rgb\((\d+,)?2\d+)
        var scanLine = {
            borderStyle: "none",
            boxShadow  : shadowString,
            //background:"-webkit-linear-gradient("+startColor+"," +attributes["item_color"]+","+ startColor+")",
            background : "linear-gradient(to right," + startColor + "," + attributes["item_color"] + "," + startColor + ")"
        };


        return (
            <div className='element' style={style} onMouseDown={this.moveElement}>
                <div style={elementDom} className={"elementDom fingerprint " + attributes["item_val"]}>
                    <div className="topleft" style={color}></div>
                    <div className="topright" style={color}></div>
                    <div className="bottomleft" style={color}></div>
                    <div className="bottomright" style={color}></div>
                    <div className="scan" style={scanLine}></div>
                </div>


                {this.renderElementSelection()}
            </div>
        );
    }

});

module.exports = FingerprintElement;