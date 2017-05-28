/**
 * @component InputTextSettings
 * @description 输入框元素设置面板
 * @time 2015-09-24 16:00
 * @author Nick
 **/

var React = require('react');
var SettingsTabs = require('./Tab/SettingsTabs');
var InputTextEditTab = require('./Tab/InputTextEditTab');


var InputTextSettings = React.createClass({

    render: function () {
        return (
            <div className="input-text-settings">
                <SettingsTabs changeSelectedIndex={this.changeSelectedIndex} element={this.props.element}>
                    <InputTextEditTab attributes={this.props.element.attributes} isTimelineFrame={this.props.isTimelineFrame}/>
                </SettingsTabs>
            </div>
        );
    }

});

module.exports = InputTextSettings;