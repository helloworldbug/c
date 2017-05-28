/**
 * @component musicSettings
 * @description 音频元素设置面板
 * @time 2016-03-03 14:20
 * @author Harry
 **/

 var React = require('react');
 var SettingsTabs = require('./Tab/SettingsTabs');
 var MusicStyleTab = require('./Tab/musicEditTab');


 var musicSettings = React.createClass({

    render: function () {
        return (
            <div className="image-settings">
                <SettingsTabs element={this.props.element}>
                    <MusicStyleTab attributes={this.props.element.attributes} isTimelineFrame={this.props.isTimelineFrame}/>
                </SettingsTabs>
            </div>
        );
    }

});

module.exports = musicSettings;