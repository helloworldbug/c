/**
 * @component FingerprintEditTab
 * @description 指纹元素编辑设置
 * @time 2015-09-24 16:00
 * @author Nick
 **/

var React = require('react');

var PositionAndSize = require("./SettingComponents/PositionAndSize");
var Color = require("./SettingComponents/Color");
var Range = require("./SettingComponents/Range");
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var GlobalFunc=require('../../../Common/GlobalFunc')
var FingerprintEditTab = React.createClass({
    _changeName    : function (event) {
        MakeActionCreators.updateElement({f_name: GlobalFunc.htmlEncode(event.target.value)});
    },
    render: function () {

        var attributes = this.props.attributes;
        if (this.props.isTimelineFrame === true) {
            return <div className="setting-container fingerprint-edit" style={{height: document.body.clientHeight - 54 - 40}}>

                <span className="clearTop"/>
                <PositionAndSize attributes={attributes}/>

            </div>
        }

        return (
            <div className="setting-container fingerprint-edit" style={{height: document.body.clientHeight - 54 - 40}}>
                <span className="clearTop"/>
                <div className="setting-input-text">
                    <h1>元素名称</h1>
                    <input type="text" value={GlobalFunc.htmlDecode(attributes.f_name)} onChange={this._changeName} maxLength="20"/>
                </div>
                <span className="clearTop"/>

                <PositionAndSize attributes={attributes}/>

                <Range title="不透明度" parameter="item_opacity" value={attributes["item_opacity"]}
                       defaultValue={0} max={100} min={0} step={1} isNumber={true}/>
                <Range title="旋转角度" parameter="rotate_angle" value={attributes["rotate_angle"]}
                       defaultValue={0} max={360} min={0} step={1} isNumber={true}/>

                <Color title="颜色" parameter="item_color" value={attributes['item_color']}/>

            </div>
        );
    }

});

module.exports = FingerprintEditTab;