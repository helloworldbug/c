/**
 * @component ButtonElement
 * @description 按钮元素
 * @time 2015-09-10 17:28
 * @author Nick
 **/

var React = require('react');
var ElementMixin = require('./ElementMixin');
var MakeAction = require("../../../actions/MakeActionCreators");
var MeConstants = require('../../../constants/MeConstants');
var Elements = MeConstants.Elements;
var MakeAction = require("../../../actions/MakeActionCreators");
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
var LabelElement = require("./LabelElement.jsx")
var PicSlideElement = require("./PicSlideElement.jsx");
var PanoramaElement = require("./PanoramaElement.jsx");
var MapElement = require('./MapElement');
var GlobalFunc=require('../../Common/GlobalFunc');
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
    [Elements.embedded]    : EmbeddedElement,
    [Elements.reward]      : ButtonElement,
    [Elements.label]       : LabelElement,
    [Elements.picslide]    : PicSlideElement,
    [Elements.panorama]    : PanoramaElement,
    [Elements.redEnvelope] : ImageElement
};
var DisplayFrameElement = React.createClass({
    mixins         : [ElementMixin],
    getInitialState: function () {
        return {
            isMoving : true,
            scaleType: "size"
        }
    },
    finishedEdit(){
        MakeAction.editGroup(undefined, "end")
    },
    // 生成元素
    generateElement: function (element, index) {
        var selectedIndexArr = this.props.selectedElementIndex;
        var itemType = element.attributes['item_type'];// 元素类型
        var Element = elementToElementComponentMap[itemType];// 元素组件
        if (itemType == 2) {
            if(GlobalFunc.isLineFeedText(element.attributes)) {
                Element = LineFeedTextElement;
            }

        }

        var elements;
        if (itemType == 34) {
            return null
        }

        var groupID = this.props.attributes['group_id'];

        if (Element) {
            // 创建元素组件
            if (!element.attributes['group_id']) return null;
            if (element.attributes['group_id'] != groupID) {
                return null;
            } else {
                return (
                    <Element key={index} index={index} attributes={element.attributes}
                             active={_.indexOf(this.props.selectedElementIndex,index)!=-1 }
                             showOnly={this.props.showOnly} pageId={this.props.pageId}
                             selectedElementIndex={this.props.selectedElementIndex } textPannelToggleShow={this.props.textPannelToggleShow}/>
                );
            }
        }

    },

    render: function () {
        //if (this.props.showOnly)return null;
        var attributes = this.props.attributes;

        var style = this.getStyles(attributes);
        var button_style = {
            zIndex: 999
        };
        var displayFrameEls = this.props.elements;
        var frameEls = [];
        if (displayFrameEls) {
            displayFrameEls.forEach((el, index)=> {

                frameEls.push(this.generateElement(el, index))
            })
        }
        if (this.props.showOnly)return (
            <div className="element" style={style}>{frameEls}</div>

        )
        style.transform= 'rotate(' + attributes['rotate_angle'] + 'deg) scale(' + attributes['x_scale'] + ',' + attributes['y_scale'] + ')';
        style.border = "2px solid rgba(0, 0, 0, .5)";
        return (
            <div  >
                <div className="element" style={style} onMouseDown={this.moveElement}>{frameEls}</div>
                <div className='display_frame' style={button_style}>
                    <a className="finish" title="编辑完成" onClick={this.finishedEdit}></a>
                </div>
            </div>
        );
    }

});

module.exports = DisplayFrameElement;