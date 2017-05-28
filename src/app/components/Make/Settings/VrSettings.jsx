/**
 * @component VrSettings
 * @description VR元素设置面板
 * @time 2016-06-07 18:56
 * @author Yangjian
 **/

var React = require('react');
var SettingsTabs = require('./Tab/SettingsTabs');
var VrEditTab = require('./Tab/VrEditTab');


var VrSettings = React.createClass({

    render: function () {
        return (
            <div className="vote-form-settings">
                <SettingsTabs element={this.props.element}>
                    <VrEditTab attributes={this.props.element.attributes} isTimelineFrame={this.props.isTimelineFrame}/>
                </SettingsTabs>
            </div>
        );
    }

});

module.exports = VrSettings;