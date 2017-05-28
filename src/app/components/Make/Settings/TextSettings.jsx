/**
 * @component TextSettings
 * @description 文本元素设置面板
 * @time 2015-09-06 17:12
 * @author StarZou
 **/

var React = require('react');

var SettingsTabs = require('./Tab/SettingsTabs');
var TextEditTab = require('./Tab/TextEditTab');
var TextStyleTab = require('./Tab/TextStyleTab');

var TextSettings = React.createClass({

    render: function () {
        return (
            <div className="text-settings">
                <SettingsTabs element={this.props.element}>
                    <TextEditTab attributes={this.props.element.attributes} isTimelineFrame={this.props.isTimelineFrame} />
                </SettingsTabs>
            </div>
        );
    }

});
module.exports = TextSettings;