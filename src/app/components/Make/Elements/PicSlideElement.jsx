/**
 * @component ImageElement
 * @description 图片元素
 * @time 2015-09-10 17:28
 * @author Nick
 **/

var React = require('react');
var ElementMixin = require('./ElementMixin');

var PicSlideElement = React.createClass({

    mixins: [ElementMixin],

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

        var transformStyle = 'rotate(' + attributes['rotate_angle'] + 'deg) scale(' + attributes['x_scale'] + ',' + attributes['y_scale'] + ')';
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
            width:"100%",
            height:"100%",
            display        : "block",
            overflow:"hidden"
        };
        var urlArr = attributes['item_val'].split('|');
        var url = urlArr[0];
        var imgIndex = urlArr.map((u,index)=> {
            return <span key={index}></span>
        });
        var imgStyle = {
            width : style.width,
            height: style.height
        }

        return (
            <div className='element picslide' style={style} onMouseDown={this.moveElement}>
                <div style={elementDom}>
                    <img  src={url} style={imgStyle}/>
                    <div className="index">{imgIndex}</div>
                </div>
                {this.renderElementSelection()}
            </div>
        );
    }

});

module.exports = PicSlideElement;