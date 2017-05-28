/**
 * @component ElementSelection
 * @description 元素选中区
 * @time 2015-09-01 20:14
 * @author StarZou
 **/

var React = require('react');
var classNames = require('classnames');
var GlobalFunc = require('../../Common/GlobalFunc');
var MakeActionCreators = require('../../../actions/MakeActionCreators');
var DialogActionCreator = require('../../../actions/DialogActionCreator');
var ClientState = require("../../../utils/ClientState");
var MeConstants = require('../../../constants/MeConstants');
var Elements = MeConstants.Elements;

var ElementSelection = React.createClass({
    replace: function () {
        var attributes = this.props.attributes;
        var item_type = attributes["item_type"];
        if (item_type == 1 && !!attributes["group_id"]) {
            item_type = Elements.image;
        }
        switch (item_type) {
            case Elements.background:
                DialogActionCreator.show("material", "", {materialType: 4, itemType: "backImg", replace:true});
                break;
            case Elements.image:
                DialogActionCreator.show("material", "", {materialType: 5, itemType: "img", replace: true});
                break;
            case Elements.borderFrame:
                DialogActionCreator.show("material", "", {materialType: 2, itemType: "frame", replace:true});
                break;
            case Elements.watermark:
                if (attributes["frame_style"] == 3) {
                    DialogActionCreator.show("material", "", {materialType: 3, itemType: "shape", replace: true});
                } else {
                    DialogActionCreator.show("material", "", {materialType: 1, itemType: "watermark", replace: true});
                }
                break;
        }
    },
    showReplace:function(){
        var attributes = this.props.attributes;
        var item_type = attributes["item_type"];
        if (this.props.selectedElementIndex.length == 1) {
            switch (item_type) {
                case Elements.background:
                case Elements.image:
                case Elements.borderFrame:
                case Elements.watermark:
                    return true;
                    break;
            }
        }
        return false
    },
    onDblClick:function(){
        if(this.showReplace()){
            this.replace();
        }
    },
    render : function () {
        var attributes = this.props.attributes;
        var locked = ClientState.isLocked(attributes["item_uuid"], this.props.pageId);
        var classes = classNames({
            'element-selection': true,
            'active'           : this.props.active,
            'canScale'         : this.props.canScale,
            'locked'           : locked
        });

        var dim = GlobalFunc.getItemWidthAndHeightByObjArr(attributes);
        if (dim.width <= 0 || dim.height <= 0) {
            return null
        }

        var transformStyle = 'rotate(' + attributes['rotate_angle'] + 'deg)';
        var style = {
            top            : -2,
            left           : -2,
            width          : dim.width,
            height         : dim.height,
            WebkitTransform: transformStyle,
            MozTransform   : transformStyle,
            msTransform    : transformStyle,
            transform      : transformStyle

        };

        return (
            <div className={classes} style={style} onDoubleClick={this.onDblClick} >
            </div>
        );
    },


});

module.exports = ElementSelection;