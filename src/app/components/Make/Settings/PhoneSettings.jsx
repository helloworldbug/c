/**
 * @component PhoneSettings
 * @description 一键拨号元素设置面板
 * @time 2015-12-16 17:00
 * @author Nick
 **/

var React = require('react');
var SettingsTabs = require('./Tab/SettingsTabs');
var PhoneEditTab = require('./Tab/PhoneEditTab');


var PhoneSettings = React.createClass({

    render: function () {
        return (
            <div className="vote-form-settings">
                <SettingsTabs element={this.props.element}>
                    <PhoneEditTab attributes={this.props.element.attributes} isTimelineFrame={this.props.isTimelineFrame}/>
                </SettingsTabs>
            </div>
        );
    }

});

module.exports = PhoneSettings;