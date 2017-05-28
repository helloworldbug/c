/**
 * @component ImageElement
 * @description 图片元素
 * @time 2015-09-10 17:28
 * @author Nick
 **/

var React = require('react');
var ElementMixin = require('./ElementMixin');
var DialogActionCreator = require('../../../actions/DialogActionCreator');
var ImageElement = React.createClass({

    mixins: [ElementMixin],
    replace:function(){
        DialogActionCreator.show("material", "", {materialType: 5, itemType: "img", replace: true});
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

        var transformStyle = 'rotate(' + attributes['rotate_angle'] + 'deg) ';
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
        if (this.props.inPictureFrame == true) {
            return (
                <div className='element' style={style} onMouseDown={this.moveElement}>
                    <div className="pic-frame">
                        <img className='image' style={elementDom} src={attributes['item_val']} onDoubleClick={this.replace}
                             onDragStart={this.disableDragStart} title="按住进行拖动，双击进行替换"/>
                        {this.renderElementSelection()}
                    </div>
                </div>
            );
        }
        return (
            <div className='element' style={style} onMouseDown={this.moveElement}>
                <img className='image' style={elementDom} src={attributes['item_val']}
                     onDragStart={this.disableDragStart}  title="按住进行拖动，双击进行替换" onDoubleClick={this.replace}/>
                {this.renderElementSelection()}
            </div>
        );
    }

});

module.exports = ImageElement;