/**
 * @component PageSettings
 * @description 页设置面板
 * @time 2016-11-22 09:40
 * @author Nick
 **/

var React = require('react');
var MakeActionCreators = require('../../../actions/MakeActionCreators');
var GlobalFunc=require("../../Common/GlobalFunc")
var GroupSettings = React.createClass({
    keyDown: function (event) {
        var keyCode = event.which, value = event.target.value;
        if (keyCode == 13) {
            this._changePageHeight(value);
        }
    },

    render: function () {
        var selectGrp = this.props.selectInfo.index;
        var data = this.props.data.attributes;
        var forbiddrenFlip = (<div className="setting-resource-niche">
            <div>
                <span>禁止翻组</span>
                <input  type="checkbox" checked={!!data['f_slip_status']}
                    onChange={this.toggleForbidGroup}/>
            </div>
        </div>)
        if (selectGrp.indexOf('|') > -1) {
            forbiddrenFlip = null;
        }
        return (
            <div className="setting-container">
                <div className="setting-title-blank">编辑组</div>
                <span className="clearTop"/>
                <div className="setting-input-text">
                    <h1>组名称</h1>
                    <input type="text" value={GlobalFunc.htmlDecode(data.f_name)} onChange={this.changeName} maxLength="20"/>
                </div>
                {forbiddrenFlip}
            </div>
        );
    },
    toggleForbidGroup: function () {
        var groupAttr = this.props.data.attributes
        MakeActionCreators.updateAttr(this.props.selectInfo, { f_slip_status: !groupAttr['f_slip_status'] });
    },
    changeName: function (event) {
        MakeActionCreators.updateAttr(this.props.selectInfo, { f_name: GlobalFunc.htmlEncode(event.target.value) });
    },

});

module.exports = GroupSettings;