/**
 * @component SettingsFactory
 * @description 设置面板生成工厂
 * @time 2015-09-06 16:53
 * @author StarZou
 **/

var React = require('react');

var MeConstants = require('../../../constants/MeConstants');
var Elements = MeConstants.Elements;
var PageStore = require('../../../stores/PageStore');
var TimelineStore = require("../../../stores/TimelineStore");

// 引入设置面板组件
var ImageSettings = require('./ImageSettings');
var TextSettings = require('./TextSettings');
var VideoSettings = require('./VideoSettings');
var MusicSettings = require('./MusicSettings');
var InputTextSettings = require('./InputTextSettings');
var ButtonSettings = require('./ButtonSettings');
var VoteSettings = require('./VoteSettings');
var VoteFormSettings = require('./VoteFormSettings');
var FingerprintSettings = require('./FingerprintSettings');
var PhoneSettings = require('./PhoneSettings');
var LabelSettings = require('./LabelSettings');
var DisplayFrameSettings = require('./DisplayFrameSettings');
var MapSettings = require('./MapSettings');

var PicSlideSettings = require('./PicSlideSettings');
var PanoramaSettings = require('./PanoramaSettings');
var RewardSettings = require('./RewardSettings');
var PageSettings = require('./PageSettings');
var GroupSettings = require('./GroupSettings');
var RedEnvelopeSettings = require("./RedEnvelopeSettings");
var SVGSettings = require("./SVGSettings");
var SingerMusicSettings = require('./SingerMusicSetting');
var ArSettings = require('./ArSettings');
var VrSettings = require('./VrSettings');
var GlobalFunc = require("../../Common/GlobalFunc");

// 元素类型与设置面板组件对应
var elementToSettingsComponentMap = {
    [Elements.background]  : ImageSettings,
    [Elements.text]        : TextSettings,
    [Elements.watermark]   : ImageSettings,
    [Elements.video]       : VideoSettings,
    [Elements.borderFrame] : ImageSettings,
    [Elements.link]        : null,
    [Elements.phone]       : PhoneSettings,
    [Elements.inputText]   : InputTextSettings,
    [Elements.map]         : MapSettings,
    [Elements.pictureFrame]: null,
    [Elements.image]       : ImageSettings,
    [Elements.button]      : ButtonSettings,
    [Elements.radio]       : VoteFormSettings,
    [Elements.checkbox]    : VoteFormSettings,
    [Elements.vote]        : VoteSettings,
    [Elements.fingerprint] : FingerprintSettings,
    [Elements.shake]       : FingerprintSettings,
    [Elements.displayFrame]: DisplayFrameSettings,
    [Elements.reward]      : RewardSettings,
    [Elements.label]       : LabelSettings,
    [Elements.svg]         : SVGSettings,
    [Elements.picslide]    : PicSlideSettings,
    [Elements.panorama]    : PanoramaSettings,
    [Elements.redEnvelope] : RedEnvelopeSettings,
    [Elements.music]       : SingerMusicSettings,
    [Elements.ar]          : ArSettings,
    [Elements.vr]          : VrSettings

};

var SettingsFactory = {

    /**
     * 根据元素类型, 生成设置面板组件
     */
    generateSettingsComponent: function () {
        var selectedElementIndex;
        var selectArr = this.state.selectedElementIndex;
        if (selectArr.length > 1) {
            return null;
        }

        if (this.props.selectedState.type == "group") {
            var selectObj = GlobalFunc.getObjRef(this.props.workData, this.props.selectedState.index);
            return <GroupSettings data={selectObj} selectInfo={this.props.selectedState}/>; //组属性
        }

        if (selectedElementIndex == -1) {
            return <MusicSettings music={this.state.music}/>
        }else if (selectArr.length == 0) {
            var pageData = PageStore.getSelectedPage();
            return <PageSettings pageData={pageData} selectInfo={this.props.selectedState}/>; //页属性
            //return null;
        } else {
            selectedElementIndex = selectArr[0]
        }
        if (selectedElementIndex == -1) {
            //背景音乐
            return <MusicSettings music={this.state.music}/>
        }

        var selectedElement = this.state.selectedElement[0];// 当前选中元素
        var SettingsComponent;// 设置面板组件

        if (selectedElement) {
            SettingsComponent = elementToSettingsComponentMap[selectedElement.attributes['item_type']];// 元素类型
            if (SettingsComponent) {
                var isTimeLineOn = !!selectedElement.attributes["item_animation_script"];
                var isTimelineFrame = false;
                if (isTimeLineOn) {
                    var focusInfo = TimelineStore.getFocus();
                    if (focusInfo.pos != 0 && !isNaN(parseFloat(focusInfo.pos))) {
                        isTimelineFrame = true;
                    }
                }
                return (
                    <SettingsComponent element={selectedElement} isTimelineFrame={isTimelineFrame}/>
                );
            }
        }
    }

};

module.exports = SettingsFactory;