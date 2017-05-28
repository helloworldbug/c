/**
 * @component ElementFactory
 * @description 元素生成工厂
 * @time 2015-09-01 20:39
 * @author StarZou
 **/

var React = require('react');

var MeConstants = require('../../../constants/MeConstants');
var Elements = MeConstants.Elements;
// 引入元素
var BackgroundElement = require('./BackgroundElement');
var ImageElement = require('./ImageElement');
var TextElement = require('./TextElement');
var BorderFrameElement = require('./BorderFrameElement');
var WatermarkElement = require('./WatermarkElement');
var InputTextElement = require('./InputTextElement');
var ButtonElement = require('./ButtonElement');
var VideoElement = require('./VideoElement');
var VoteElement = require('./VoteElement');
var VoteFormElement = require('./VoteFormElement');
var PictureFrameElement = require('./PictureFrameElement');
var ScribbleElement = require('./ScribbleElement');
var FingerprintElement = require('./FingerprintElement.jsx');
var ShakeElement = require('./ShakeElement.jsx');
var PhoneElement = require('./PhoneElement.jsx');
var EmbeddedElement = require('./EmbeddedElement');
var LineFeedTextElement = require('./LineFeedTextElement.jsx');
var DisplayFrameElement = require("./DisplayFrameElement.jsx");
var MapElement = require('./MapElement');
var LabelElement = require("./LabelElement.jsx");
var PicSlideElement = require("./PicSlideElement.jsx");
var PanoramaElement = require("./PanoramaElement.jsx");
var SVGElement = require("./SVGElement.jsx");
var musicElement = require('./SingerMusicElement.jsx');
var ArElement = require('./ArElement.jsx');
var VrElement = require('./VrElement.jsx');
var GlobalFunc=require('../../Common/GlobalFunc');

var _ = require("lodash");
// 元素类型与元素组件对应

var elementToElementComponentMap = {
    [Elements.background]  : BackgroundElement,
    [Elements.text]        : TextElement,
    [Elements.watermark]   : WatermarkElement,
    [Elements.video]       : VideoElement,
    [Elements.borderFrame] : BorderFrameElement,
    [Elements.link]        : TextElement,
    [Elements.phone]       : PhoneElement,
    [Elements.inputText]   : InputTextElement,
    [Elements.map]         : MapElement,
    [Elements.pictureFrame]: PictureFrameElement,
    [Elements.image]       : ImageElement,
    [Elements.button]      : ButtonElement,
    [Elements.radio]       : VoteFormElement,
    [Elements.checkbox]    : VoteFormElement,
    [Elements.vote]        : VoteElement,
    [Elements.scribble]    : ScribbleElement,
    [Elements.fingerprint] : FingerprintElement,
    [Elements.shake]       : ShakeElement,
    [Elements.displayFrame]: DisplayFrameElement,
    [Elements.embedded]    : EmbeddedElement,
    [Elements.reward]      : ButtonElement,
    [Elements.label]       : LabelElement,
    [Elements.svg]         : SVGElement,
    [Elements.displayFrame]: DisplayFrameElement,
    [Elements.picslide]    : PicSlideElement,
    [Elements.panorama]    : PanoramaElement,
    [Elements.redEnvelope] : ImageElement,
    [Elements.music]       : musicElement,
    [Elements.ar]          : ArElement,
    [Elements.vr]          : VrElement
};

var ElementFactory = {

    // 生成元素
    generateElement: function (element, index) {

        var itemType = element.attributes['item_type'];// 元素类型
        var Element = elementToElementComponentMap[itemType];// 元素组件
        if (itemType == 2) {
            if(GlobalFunc.isLineFeedText(element.attributes)) {
                Element = LineFeedTextElement;
            }else{
                element.unset("fixed_size");
                element.set("item_width",0);
                element.set("item_height",0)
            }

        }

        var elements;
        if (itemType != 17 && itemType != 34 && !!element.attributes["group_id"]) {
            return null
        }
        if (itemType == 17 || itemType == 34) {
            elements = this.props.elements;
        }

        if (Element) {
            // 创建元素组件
            //if (element.attributes['item_type'] != 17 && !!element.attributes['group_id']) return null;

            if (elements) {
                return (
                    <Element key={index} index={index} attributes={element.attributes} elements={elements}
                             selectedElementIndex={this.props.selectedElementIndex } showOnly={this.props.showOnly}
                             pageId={this.props.pageId} textPannelToggleShow={this.props.textPannelToggleShow} changeControl={this.props.changeControl}/>
                );
            } else {
                return (
                    <Element key={index} index={index} attributes={element.attributes}
                             active={_.indexOf(this.props.selectedElementIndex,index)!=-1}
                             showOnly={this.props.showOnly} pageId={this.props.pageId}
                             selectedElementIndex={this.props.selectedElementIndex } textPannelToggleShow={this.props.textPannelToggleShow} changeControl={this.props.changeControl}/>
                );
            }
        }

    }
};

module.exports = ElementFactory


