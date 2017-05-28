/**
 * @component PictureFrameElement
 * @description 画框元素
 * @time 2015-09-13 19:07
 * @author Nick
 **/

var React = require('react');

var MeConstants = require('../../../constants/MeConstants');
var Elements = MeConstants.Elements;
var ElementStore = require('../../../stores/ElementStore');

// 引入元素
var BackgroundElement = require('./BackgroundElement');
var ImageElement = require('./ImageElement');
var TextElement = require('./TextElement');
var BorderFrameElement = require('./BorderFrameElement');
var WatermarkElement = require('./WatermarkElement');
var InputTextElement = require('./InputTextElement');
var ButtonElement = require('./ButtonElement');
var VideoElement = require('./VideoElement');
var _=require("lodash");

// 元素类型与元素组件对应
var elementToElementComponentMap = {
    [Elements.background]  : BackgroundElement,
    [Elements.text]        : TextElement,
    [Elements.watermark]   : BackgroundElement,
    [Elements.video]       : VideoElement,
    [Elements.borderFrame] : BorderFrameElement,
    [Elements.link]        : TextElement,
    [Elements.phone]       : TextElement,
    [Elements.inputText]   : InputTextElement,
    [Elements.image]       : ImageElement,
    [Elements.pictureFrame]: null,
    [Elements.button]      : ButtonElement
};

var PictureFrameElement = React.createClass({

    render: function () {

        var attributes = this.props.attributes;

        var elementsList,// 元素组件列表
            elements = this.props.elements;// 元素数组

        if (elements) {
            elementsList = elements.map(this.generateElement);
        }

        var style = {
            width        : attributes['item_width'],
            height       : attributes['item_height'],
            top          : attributes['item_top'],
            left         : attributes['item_left'],
            position     : 'absolute',
            pointerEvents: "none",
            zIndex       : attributes['item_layer']
        };

        //console.log('elementsList', elementsList);

        return (
            <div style={style}>
                {elementsList}
            </div>
        );
    },

    // 生成元素
    generateElement: function (element, index) {
        var selectedIndexArr = ElementStore.getSelectedElementIndex();
        var itemType = element.attributes['item_type'];// 元素类型
        if (itemType == 17) return null;
        var Element = elementToElementComponentMap[itemType];// 元素组件
        var groupID = this.props.attributes['group_id'];

        if (Element) {
            // 创建元素组件
            if (!element.attributes['group_id']) return null;
            if (element.attributes['group_id'] != groupID || itemType == 17) {
                return null;
            } else {
                return (
                    <Element key={index} index={index} attributes={element.attributes} inPictureFrame={true}
                             active={_.indexOf(this.props.selectedElementIndex,index)!=-1 } showOnly={this.props.showOnly}  pageId={this.props.pageId} selectedElementIndex={this.props.selectedElementIndex }/>
                );
            }
        }

    }

});

module.exports = PictureFrameElement;