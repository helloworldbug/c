/**
 * @component ImageElement
 * @description 图片元素
 * @time 2015-09-10 17:28
 * @author Nick
 **/

var React = require('react');
var ElementMixin = require('./ElementMixin');

var ImageElement = React.createClass({

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
            display        : "block"
        };

        var src;//拼出动态地图图片地址
        if (attributes['item_val']) {
            var valueObj = JSON.parse(attributes['item_val']);
            src = "http://api.map.baidu.com/staticimage/v2?ak=VzFAGGC7tDTFzqKKIsTI7GRV&copyright=1&center=" +
                valueObj.lng + "," + valueObj.lat + "&zoom=" + valueObj.zoom + "&markers="
                + valueObj.lng + "," + valueObj.lat + "&width=" + attributes['item_width'] + "&height=" + attributes['item_height'];
        }

        //var iframe;
        //if(this.state.iframe){
        //    var mapUrl = "./map.html?lng=" + valueObj.lng + "&lat=" + valueObj.lat + "&zoom=" + valueObj.zoom;
        //    iframe = <iframe name="myFrame" width="640" height="1008" src={mapUrl}></iframe>
        //}

        return (
            <div className='element' style={style} onMouseDown={this.moveElement}>
                <img className='image' style={elementDom} src={src} onDragStart={this.disableDragStart}/>
                {this.renderElementSelection()}
            </div>
        );
    },

    showMap: function () {
        this.setState({
            iframe: true
        })
    }

});

module.exports = ImageElement;