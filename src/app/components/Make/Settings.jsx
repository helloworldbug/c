/**
 * @component Settings
 * @description 设置面板组件
 * @time 2015-09-06 16:36
 * @author StarZou
 **/

var React = require('react');

require('../../../assets/css/tabs.css');
var SettingsFactory = require('./Settings/SettingsFactory');
var ElementStore = require('../../stores/ElementStore');
var TimeLineAnimate=require("./Settings/Tab/TimeLineAnimate");
var SelectStore = require("../../stores/SelectStore");
var PageStore = require('../../stores/PageStore');
var MagazineStore = require("../../stores/MagazineStore");
var $ = require("jquery");


/**
 * 查询ElementStore数据, 放在state中
 * @returns {{selectedElement: *}}
 */
function getStateFormStore() {
    return {
        selectedElement     : ElementStore.getDisplayFrameSelectedElement(),
        selectedElementIndex: ElementStore.getSelectedElementIndex(),
        music               : ElementStore.getTplMusic()
    };
}

var Settings = React.createClass({

    mixins: [SettingsFactory],

    getInitialState: function () {
        return getStateFormStore();
    },

    render: function () {
        var selectedElements = this.state.selectedElement;// 当前选中元素
        var timelineAnimate;
        if (selectedElements.length==1&&!!selectedElements[0]) {
            var selectedElement=selectedElements[0]
            var isTimeLineOn = !!selectedElement.attributes["item_animation_script"];
            if(isTimeLineOn){
                timelineAnimate =<TimeLineAnimate attributes={selectedElement.attributes} />
            }
        }

        var height = document.body.clientHeight - 54;
        return (
            <div className="settings" style={{height: height}}>
                {this.generateSettingsComponent()}
                {timelineAnimate}
            </div>
        );
    },

    componentDidMount: function () {
        ElementStore.addChangeListener(this._onChange);
        PageStore.addChangeListener(this._onChange);
        MagazineStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        ElementStore.removeChangeListener(this._onChange);
        PageStore.removeChangeListener(this._onChange);
        MagazineStore.removeChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState(getStateFormStore());
    }

});

module.exports = Settings;