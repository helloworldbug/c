/**
 * @component VoteFormElement
 * @description 单选、多选元素
 * @time 2015-09-25 14:00
 * @author Nick
 **/

var React = require('react');
var ElementMixin = require('./ElementMixin');

var VoteFormElement = React.createClass({

    mixins: [ElementMixin],

    getInitialState: function () {
        return {
            isMoving : true,
            scaleType: "scale"
        }
    },

    render: function () {
        var attributes = this.props.attributes;

        var itemVal = attributes['item_val'], contentVal;
        if (itemVal) {
            contentVal = JSON.parse(itemVal);
        }
        contentVal = contentVal || {"title": "标题", "options": ["选项1", "选项2", "选项3"]};

        var title = contentVal.title,
            options = contentVal.options;

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
            position       : "absolute",
            width          : attributes["item_width"] + "px",
            height         : attributes["item_height"] + "px",
            textShadow     : attributes["font_frame"] ? "0px 0px " + attributes["frame_pixes"] + "px " + (attributes["frame_color"] || "") : "none",
            opacity        : attributes['item_opacity'] / 100,
            borderWidth    : attributes['item_border'] || 0 + 'px',
            borderStyle    : attributes['bd_style'] || 'solid',
            borderColor    : attributes['bd_color'] || '#000',
            borderRadius   : (attributes['bd_radius'] || 0) + 'px',
            boxSizing      : 'border-box',
            WebkitTransform: transformStyle,
            MozTransform   : transformStyle,
            msTransform    : transformStyle,
            transform      : transformStyle
        };

        var radioTitleStyle = {
            height         : "100px",
            lineHeight     : "100px",
            backgroundColor: attributes["bg_color"],
            color          : attributes["item_color"],
            letterSpacing  : attributes["font_dist"] + "px",
            paddingLeft    : "30px",
            whiteSpace     : "nowrap"
        };
        var radioContentStyle = {
            height           : "87px",
            lineHeight       : "87px",
            paddingLeft      : "30px",
            borderBottomColor: attributes["bd_color"],
            whiteSpace       : "nowrap"
        };

        return (
            <div className='element' style={style} onMouseDown={this.moveElement}>
                <div style={elementDom} className="elementDom">
                    <div style={radioTitleStyle}>{title + (attributes["item_type"] == 21 ? "(可多选)" : "")}</div>
                    {options.map(function (item,index) {
                        return (
                            <div key={index} style={radioContentStyle} className="radio-content">
                                <span className={attributes['item_type'] == 21 ? 'radio-item checkbox-item' : 'radio-item'}/>
                                <span>{item}</span>
                            </div>
                        )
                    })}
                </div>
                {this.renderElementSelection()}
            </div>
        );
    }

});

module.exports = VoteFormElement;