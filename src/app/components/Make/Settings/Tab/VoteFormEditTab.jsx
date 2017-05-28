/**
 * @component VoteFormEditTab
 * @description 单选、多选元素编辑设置
 * @time 2015-09-24 16:00
 * @author Nick
 **/

var React = require('react');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var DialogAction = require("../../../../actions/DialogActionCreator");
var PageStore = require("../../../../stores/PageStore");
var MagazineStore = require("../../../../stores/MagazineStore");
var GlobalFunc = require("../../../Common/GlobalFunc");
var contentVal = {};

var PositionAndSize = require("./SettingComponents/PositionAndSize");
var Color = require("./SettingComponents/Color");
var InputText = require("./SettingComponents/InputText");
var DisplayStateEdit = require("./DisplayStateEdit");

var VoteFormEditTab = React.createClass({
    _changeName    : function (event) {
        MakeActionCreators.updateElement({f_name: GlobalFunc.htmlEncode(event.target.value)});
    },
    render: function () {
        var attributes = this.props.attributes,
            itemVal = GlobalFunc.htmlDecode(attributes['item_val']),
            height = document.body.clientHeight - 54 - 40;
        if (itemVal) {
            contentVal = JSON.parse(itemVal);
        }
        contentVal = contentVal || {"title": "标题", "options": ["选项1", "选项2", "选项3"]};

        var title = contentVal.title,
            options = contentVal.options;
        if (this.props.isTimelineFrame === true) {
            return <div className="setting-container"  style={{height:height}}>
                <span className="clearTop"/>
                <PositionAndSize attributes={attributes}/>

            </div>
        }
        return (
            <div className="setting-container" style={{height:height}}>
                <span className="clearTop"/>
                <div className="setting-input-text">
                    <h1>元素名称</h1>
                    <input type="text" value={GlobalFunc.htmlDecode(attributes.f_name)} onChange={this._changeName} maxLength="20"/>
                </div>
                <span className="clearTop"/>

                <PositionAndSize attributes={attributes}/>
                <DisplayStateEdit attributes={attributes}/>
                <Color title="标题颜色" parameter="item_color" value={attributes['item_color']}/>

                <div className="setting-radio-title">
                    <h1>标题</h1>
                    <input type="text" value={title} maxLength="10" onChange={this._changeTitle}/>
                </div>

                <header onClick={this._headerClickVote}><span>选项</span><b id="voteStyle"/></header>
                <div id="setting-vote-form">

                    <span className="clearTop"/>

                    {options.map(function (item, index) {
                        return (<div  key={index} className="setting-radio-content">
                            <h1>选项{index + 1}</h1>
                            <div style={{position: "relative"}}>
                                <input type="text" data-index={index} value={item} maxLength="13" onChange={this._changeRadio}/>
                            <span className="deleteRadioBt" data-index={index} data-work="delete"
                                  onClick={this._changeRadioNumber}>-</span>
                                <span className="addRadioBt" data-index={index} onClick={this._changeRadioNumber}>+</span>
                            </div>
                        </div>)
                    }, this)}
                </div>

            </div>
        );
    },

    _headerClickVote: function () {
        $("#setting-vote-form").slideToggle();
        $("#voteStyle").toggleClass("hide").toggleClass("show");
    },

    _changeParameter: function (key, event) {
        MakeActionCreators.updateElement({[key]: Math.round(event.target.value)});
    },

    _changeSizeWidth: function (event) {
        if (event.target.value == 0) return;
        MakeActionCreators.updateElement({item_width: event.target.value / this.props.attributes["x_scale"]});
    },

    _changeItemColor: function (key, value) {
        MakeActionCreators.updateElement({[key]: value});
    },

    _changeColor: function (color) {
        MakeActionCreators.updateElement({item_color: color});
    },

    _changeTitle: function (event) {
        contentVal.title = event.target.value;
        var str = JSON.stringify(contentVal);
        MakeActionCreators.updateElement({item_val: str});
        this._setFbcollect("title", event.target.value);
    },

    _changeRadio: function (event) {
        var index = event.target.dataset.index;
        var radioArr = contentVal.options;
        radioArr[index] = event.target.value;
        contentVal.options = radioArr;
        var str = JSON.stringify(contentVal);
        MakeActionCreators.updateElement({item_val: GlobalFunc.htmlEncode(str)});
        this._setFbcollect("content", event.target.value, index);
    },

    _changeRadioNumber: function (event) {
        var eventNode = $(event.target)[0],
            index = parseInt(eventNode.dataset.index),
            radioArr = contentVal.options,
            length = $(event.target).parent().parent().parent().children('div').length,
            height = this.props.attributes["item_height"];
        if (eventNode.dataset.work == "delete") {
            if (length == 1) {
                GlobalFunc.addSmallTips("选项数量最少为1", 2, {delBackGround: true, clickCancel: true});
            } else {
                radioArr.splice(index, 1);
                height = parseInt(height) - 87;
                this._setFbcollect("delete", "", index);
            }

        } else {
            if (length == 8) {
                GlobalFunc.addSmallTips("选项数量过长", 2, {delBackGround: true, clickCancel: true});
            } else {
                index = index + 1;
                radioArr.splice(index, 0, "新选项");
                height = parseInt(height) + 87;
                this._setFbcollect("add", "", index);
            }
        }
        contentVal.options = radioArr;
        var str = JSON.stringify(contentVal);
        MakeActionCreators.updateElement({item_height: height, item_val: str});
    },

    _setFbcollect: function (str, value, index) {
        var tpl = MagazineStore.getTpl(),
            attributes = this.props.attributes,
            val,
            type = "";
        if (attributes["item_type"] == 20) {
            type = "radio";
        } else if (attributes["item_type"] == 21) {
            type = "checkbox";
        }

        var tpl_fbcollect = tpl.attributes.tpl_fbcollect;
        if (tpl_fbcollect) {
            val = eval('(' + tpl_fbcollect + ')');
        }
        switch (str) {
            case "title":
                val[type].title = value;
                break;
            case "content":
                val[type].content[index] = value;
                break;
            case "delete":
                val[type].content.splice(index, 1);
                break;
            case "add":
                val[type].content.splice(index, 0, "新选项");
                break;
        }

        val = JSON.stringify(val);

        tpl.set("tpl_fbcollect", val);

    }

});

module.exports = VoteFormEditTab;