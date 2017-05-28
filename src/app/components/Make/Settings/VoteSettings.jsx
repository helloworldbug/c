/**
 * @component VoteSettings
 * @description 投票元素设置面板
 * @time 2015-09-25 15:20
 * @author Nick
 **/

var React = require('react');
var SettingsTabs = require('./Tab/SettingsTabs');
var VoteEditTab = require('./Tab/VoteEditTab');


var VoteSettings = React.createClass({

    render: function () {
        return (
            <div className="vote-form-settings">
                <SettingsTabs element={this.props.element}>
                    <VoteEditTab attributes={this.props.element.attributes} isTimelineFrame={this.props.isTimelineFrame}/>
                </SettingsTabs>
            </div>
        );
    }

});

module.exports = VoteSettings;