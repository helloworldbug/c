/**
 * @component singerMusicElement
 * @description 音频元素
 * @time 2016-03-03 10:00
 * @author Harry
 **/

var React = require('react');
var ElementMixin = require('./ElementMixin');
var ImageModules = require('../../Mixins/ImageModules');

var music = React.createClass({
	mixins : [ElementMixin,ImageModules],

	getInitialState: function () {
        return {
            isMoving : true,
            scaleType: "size"
        }
    },

	render(){
		var attributes = this.props.attributes;
		var attributes = this.props.attributes;

        var style = $.extend({}, this.getStyles(attributes), {
            color          : attributes['item_color'],
            fontSize       : attributes['font_size'] + 'px',
            fontWeight     : attributes['font_weight'],
            letterSpacing  : attributes['font_dist'] + 'px',
            backgroundColor: null
        });
        var animation = this.getAnimationStyles(attributes);

        var transformStyle = 'rotate(' + attributes['rotate_angle'] + 'deg) scale(' + attributes['x_scale'] + ',' + attributes['y_scale'] + ')';
        var elementDom = {
            position       : "absolute",
            width          : '100%',
            height         : attributes["item_height"] + "px",
            textShadow     : attributes["font_frame"] ? "0px 0px " + attributes["frame_pixes"] + "px " + (attributes["frame_color"] || "") : "none",
            lineHeight     : attributes['item_height'] + 'px',
            opacity        : attributes['item_opacity'] / 100,
            backgroundColor: attributes["bg_color"],
            borderWidth    : (attributes['item_border'] || 0) + 'px',
            borderStyle    : attributes['bd_style'] || 'solid',
            borderColor    : attributes['bd_color'] || '#000',
            borderRadius   : (attributes['bd_radius'] || 0) + 'px',
            textAlign      : attributes['font_halign'] == 'mid' ? 'center' : attributes['font_halign'],
            boxSizing      : 'border-box',
            WebkitTransform: transformStyle,
            MozTransform   : transformStyle,
            msTransform    : transformStyle,
            transform      : transformStyle
        };
        return (
            <div className='element' style={style} onMouseDown={this.moveElement}>
                <img style={elementDom} src={this.defineImageModules().singerMusic}/>
                {this.renderElementSelection()}
            </div>
        );
	}
});

module.exports = music;