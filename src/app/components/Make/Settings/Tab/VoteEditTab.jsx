/**
 * @component VoteEditTab
 * @description 投票元素编辑设置
 * @time 2015-09-24 16:00
 * @author Nick
 **/

var React = require('react');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var PositionAndSize = require("./SettingComponents/PositionAndSize");
var Color = require("./SettingComponents/Color");
var DisplayStateEdit=require("./DisplayStateEdit");
var GlobalFunc=require("../../../Common/GlobalFunc")

var VoteEditTab = React.createClass({

    render: function () {
        var attributes = this.props.attributes,
            itemColor = attributes['item_color'],
            itemVal = attributes['item_val'];
        if (this.props.isTimelineFrame === true) {
            return <div className="setting-container" >
                <span className="clearTop"/>
                <PositionAndSize attributes={attributes} hideChangeSize={true}/>

            </div>
        }
        return (
            <div className="setting-container">

                <span className="clearTop"/>
                <div className="setting-input-text">
                    <h1>元素名称</h1>
                    <input type="text" value={GlobalFunc.htmlDecode(attributes.f_name)} onChange={this._changeName} maxLength="20"/>
                </div>

                <PositionAndSize attributes={attributes} hideChangeSize={true}/>
                <DisplayStateEdit attributes = {attributes}/>
                <div className="setting-vote">
                    <h1>投票样式</h1>
                    <ul>
                        <li data-type="icon-love" className={itemVal=="icon-love"?"icon-love active":"icon-love"}
                            onClick={this._changeType}/>
                        <li data-type="icon-star" className={itemVal=="icon-star"?"icon-star active":"icon-star"}
                            onClick={this._changeType}/>
                        <li data-type="icon-flag" className={itemVal=="icon-flag"?"icon-flag active":"icon-flag"}
                            onClick={this._changeType}/>
                        <li data-type="icon-vote" className={itemVal=="icon-vote"?"icon-vote active":"icon-vote"}
                            onClick={this._changeType}/>
                    </ul>
                </div>

                <Color title="样式颜色" parameter="item_color" value={attributes['item_color']} />

            </div>

        );
    },

    _headerClickVote: function () {
        $("#setting-vote").slideToggle();
        $("#voteStyle").toggleClass("hide").toggleClass("show");
    },

    _changeItemColor: function (key, value) {
        MakeActionCreators.updateElement({[key]: value});
    },
    _changeColor    : function (color) {
        var rgb = color.replace(/\s+/g, "");
        MakeActionCreators.updateElement({item_color: rgb});
    },
    _changeName    : function (event) {
        MakeActionCreators.updateElement({f_name: GlobalFunc.htmlEncode(event.target.value)});
    },
    _changeType     : function (event) {
        var type = event.target.dataset.type;
        MakeActionCreators.updateElement({item_val: type});
    }

});

module.exports = VoteEditTab;