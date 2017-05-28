/**
 * @component VideoElement
 * @description 图片元素
 * @time 2015-09-10 17:28
 * @author Nick
 **/

var React = require('react');
var ElementMixin = require('./ElementMixin');
var videoPlayImage = require('../../../../assets/images/make/videoplay.png');

var VideoElement = React.createClass({

    mixins: [ElementMixin],

    getInitialState: function () {
        return {
            isMoving : true,
            scaleType: "size"
        }
    },

    render: function () {
        var attributes = this.props.attributes;

        var style = $.extend({}, this.getStyles(attributes), {});
        var animation = this.getAnimationStyles(attributes);

        var transformStyle = 'rotate(' + attributes['rotate_angle'] + 'deg) scale(' + attributes['x_scale'] + ',' + attributes['y_scale'] + ')';
        var elementDom = {
            width          : attributes['item_width'],
            height         : attributes['item_height'],
            opacity        : attributes['item_opacity'] / 100,
            borderWidth    : attributes['item_border'] || 0 + 'px',
            borderStyle    : attributes['bd_style'] || 'solid',
            borderColor    : attributes['bd_color'] || '#000',
            borderRadius   : attributes['bd_radius'] || 0 + 'px',
            boxSizing      : 'border-box',
            WebkitTransform: transformStyle,
            MozTransform   : transformStyle,
            msTransform    : transformStyle,
            transform      : transformStyle,
            background     : "url(" + attributes['item_val'] + ") 50% 50% / cover no-repeat"
        };
        var playImgStyle = {
            position       : "absolute",
            left           : "50%",
            top            : "50%",
            WebkitTransform: "translate(-50%, -50%)",
            MozTransform   : "translate(-50%, -50%)",
            msTransform    : "translate(-50%, -50%)",
            transform      : "translate(-50%, -50%)",
            width          : attributes['item_width'] > 100 ? 100 : attributes['item_width'],
            height         : attributes['item_height'] > 100 ? 100 : attributes['item_height']
        };

        return (
            <div className='element' style={style} onMouseDown={this.moveElement}>
                <div style={elementDom} className="elementDom">
                    <img style={playImgStyle} src={videoPlayImage}/>
                </div>
                {this.renderElementSelection()}
            </div>
        );
    }

});

module.exports = VideoElement;