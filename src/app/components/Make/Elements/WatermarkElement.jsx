/**
 * @component WatermarkElement
 * @description 水印元素
 * @time 2015-09-10 17:28
 * @author Nick
 **/

var React = require('react');
var ElementMixin = require('./ElementMixin');
var DialogActionCreator = require('../../../actions/DialogActionCreator');

var WatermarkElement = React.createClass({

    mixins: [ElementMixin],
    replace:function(){
        var attributes = this.props.attributes;
        if (attributes["frame_style"] == 3) {
            DialogActionCreator.show("material", "", {materialType: 3, itemType: "shape", replace: true});
        } else {
            DialogActionCreator.show("material", "", {materialType: 1, itemType: "watermark", replace: true});
        }
    },
    getInitialState: function () {
        return {
            isMoving : true,
            scaleType: "size"
        }
    },

    render: function () {
        var attributes = this.props.attributes;

        var style = this.getStyles(attributes);
        var animation = this.getAnimationStyles(attributes);

        var transformStyle = 'rotate(' + attributes['rotate_angle'] + 'deg)';
        var elementDom = {
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
            display        : "block"
        };

        return (
            <div className='element' style={style} onMouseDown={this.moveElement}>
                <img className="image" style={elementDom} src={attributes['item_val']} onDragStart={this.disableDragStart} onDoubleClick={this.replace} title="按住进行拖动，双击进行替换"/>
                {this.renderElementSelection()}
            </div>
        );
    }

});

module.exports = WatermarkElement;