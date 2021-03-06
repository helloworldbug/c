/**
 * @component ButtonSettings
 * @description 按钮元素设置面板
 * @time 2015-09-24 18:00
 * @author Nick
 **/

var React = require('react');
var SettingsTabs = require('./Tab/SettingsTabs');
var RewardEditTab = require('./Tab/RewardEditTab');


var RewardSettings = React.createClass({

    render: function () {
        return (
            <div className="button-settings">
                <SettingsTabs changeSelectedIndex={this.changeSelectedIndex} element={this.props.element}>
                    <RewardEditTab attributes={this.props.element.attributes} isTimelineFrame={this.props.isTimelineFrame}/>
                </SettingsTabs>
            </div>
        );
    }

});

module.exports = RewardSettings;