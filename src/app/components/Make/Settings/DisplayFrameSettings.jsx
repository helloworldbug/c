/**
 * @component ImageSettings
 * @description 图片元素设置面板
 * @time 2015-09-17 10:19
 * @author Nick
 **/

var React = require('react');
var DisplayFrameEditTab = require('./Tab/DisplayFrameEditTab');


var FloatLayerSettings = React.createClass({

    render: function () {
        return (
            <div className="image-settings">
                <div className="setting-title-blank">样式</div>
                <DisplayFrameEditTab attributes={this.props.element.attributes}/>
            </div>
        );
    }

});

module.exports = FloatLayerSettings;