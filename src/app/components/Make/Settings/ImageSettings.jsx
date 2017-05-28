/**
 * @component ImageSettings
 * @description 图片元素设置面板
 * @time 2015-09-17 10:19
 * @author Nick
 **/

var React = require('react');
var SettingsTabs = require('./Tab/SettingsTabs');
var ImageEditTab = require('./Tab/ImageEditTab');

var ImageSettings = React.createClass({

    render: function () {
        return (
            <div className="image-settings">
                <SettingsTabs element={this.props.element}>
                    <ImageEditTab attributes={this.props.element.attributes} isTimelineFrame={this.props.isTimelineFrame}/>
                </SettingsTabs>
            </div>
        );
    }

});

module.exports = ImageSettings;