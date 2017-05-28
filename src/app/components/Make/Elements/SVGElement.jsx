/**
 * @component SVGElement
 * @description SVG元素
 * @time 2015-09-01 20:16
 * @author StarZou
 **/

var React = require('react');
var ElementMixin = require('./ElementMixin');

var SVGElement = React.createClass({

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

        var transformStyle = 'rotate(' + attributes['rotate_angle'] + 'deg) scale(' + attributes['x_scale'] + ',' + attributes['y_scale'] + ')';
        var elementDom = {
            width          : "100%",
            height         : "100%",
            WebkitTransform: transformStyle,
            MozTransform   : transformStyle,
            msTransform    : transformStyle,
            transform      : transformStyle,
            display        : "block"
        };

        return (
            <div className='element' style={style} onMouseDown={this.moveElement}>
                <div style={elementDom} dangerouslySetInnerHTML={{__html:attributes['item_val']}}></div>
                {this.renderElementSelection()}
            </div>
        );
    }

});

module.exports = SVGElement;