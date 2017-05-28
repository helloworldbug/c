/**
 * @component ElementMixin
 * @description 元素组件父类
 * @time 2015-09-01 19:47
 * @author StarZou
 **/

var React = require('react');
var ReactDOM=require("react-dom");
var MeConstants = require('../../../constants/MeConstants');
var MakeActionCreators = require('../../../actions/MakeActionCreators');
var GridAction = require("../../../actions/GridAction");
var ElementSelection = require('./ElementSelection');
var GlobalFunc = require('../../Common/GlobalFunc');
var GridStore = require("../../../stores/GridStore");

var ElementMixin = {

    componentDidMount: function () {

        var attributes = this.props.attributes;

        this.setAnimation(attributes);

    },

    componentDidUpdate: function () {

        var attributes = this.props.attributes;

        if (this.state.animation != attributes['item_animation']) {
            this.setAnimation(attributes);
            this.setState({
                animation: attributes['item_animation']
            })
        }

    },

    componentWillUnmount: function () {
        if (this.state.animationTime) clearTimeout(this.state.animationTime);
    },

    /**
     * 取得样式
     * @param attributes
     * @returns {{left: number, top: number, width: number, height: number, zIndex: number}}
     */
    getStyles: function (attributes) {

        var isHide;
        if (attributes['item_state'] == "hide") isHide = true;

        return {
            left           : attributes['item_left'],
            top            : attributes['item_top'],
            width          : attributes['item_width'] * attributes['x_scale'],
            height         : attributes['item_height'] * attributes['y_scale'],
            zIndex         : attributes["item_layer"],
            cursor         : this.props.active ? "-webkit-grab" : "default",
            outline        : 'none',
            pointerEvents  : "auto",
            display        : isHide ? "none" : "block"
        };
    },

    getAnimationStyles: function (attributes) {

        //设置初始动画属性
        var animationObj = attributes['item_animation_val'], animationVal;
        if (animationObj) {
            animationVal = JSON.parse(animationObj);
        }
        animationVal = animationVal || {'delay': 0.3, 'duration': 1, 'infinite': 1};

        return {
            WebkitAnimationDuration: animationVal.duration + 's',
            MozAnimationDuration   : animationVal.duration + 's',
            msAnimationDuration    : animationVal.duration + 's',
            animationDuration      : animationVal.duration + 's',
            WebkitAnimationDelay   : animationVal.delay + 's',
            MozAnimationDelay      : animationVal.delay + 's',
            msAnimationDelay       : animationVal.delay + 's',
            animationDelay         : animationVal.delay + 's',
            width                  : attributes['item_width'] * attributes['x_scale'],
            height                 : attributes['item_height'] * attributes['y_scale'],
            transformOrigin        : "50% 50%"
        };
    },

    /**
     * 渲染 选中区组件
     */
    renderElementSelection: function () {
        var active = this.props.active, attributes = this.props.attributes;

        var width, height, itemType = attributes['item_type'];
        if (!!this.state.itemWidth && !!this.state.itemHeight) {
            width = this.state.itemWidth + (attributes['item_border'] || 0) * 2;// * attributes['x_scale'];
            height = this.state.itemHeight + (attributes['item_border'] || 0) * 2;// * attributes['y_scale'];
        } else {
            width = attributes['item_width'];
            height = attributes['item_height'];
        }

        //是否允许缩放
        var canScale = (itemType == 10 || itemType == 22 );

        if (active) {
            if (this.props.showOnly) return;
            return <ElementSelection active={active}  scaleType={this.state.scaleType}
                                     attributes={this.props.attributes} canScale={canScale} pageId={this.props.pageId}
                                     selectedElementIndex={this.props.selectedElementIndex }/>
        }
    },

    moveElement: function (event) {

        if (this.props.showOnly) return;

        if (this.state.editable === true) {
            event.stopPropagation()
        }
        if (!this.state.isMoving) return;
        var _this = this;


        var position = {},
            deviceScale = GlobalFunc.getDeviceScale(),
            domNode = ReactDOM.findDOMNode(this),
            attributes = this.props.attributes;
        var mouseTrough = GlobalFunc.mouseThrough(attributes, this.props.index);
        position.beginX = event.pageX / deviceScale;
        position.beginY = event.pageY / deviceScale;
        position.beginLeft = attributes['item_left'];
        position.beginTop = attributes['item_top'];
        position.moveable = true;
        var itemLeft, itemTop;
        var timerId = null;
        var moved = false;
        if (!mouseTrough) {
            event.stopPropagation();
            GridAction.elementMoveStart();


        }
        //if (attributes['item_type'] == 1 && !attributes['group_id']) return;


        document.onmousemove = function (event) {
            event.preventDefault();
            if (mouseTrough) {

                if (!moved) {
                    if (Math.abs((event.pageX / deviceScale) - position.beginX) + Math.abs((event.pageY / deviceScale) - position.beginY) > 10) {
                        moved = true;
                    }
                }
                return;
            }
            if (!moved) {
                if (Math.abs((event.pageX / deviceScale) - position.beginX) + Math.abs((event.pageY / deviceScale) - position.beginY) > 4) {
                    moved = true;
                    MakeActionCreators.selectElement(_this.props.index, {"move": true, ctrlPressed: event.ctrlKey});
                } else {
                    event.preventDefault();
                    return;
                }

            }
            var dx = (event.pageX / deviceScale - position.beginX);
            var dy = (event.pageY / deviceScale - position.beginY);
            itemLeft = position.beginLeft + dx;
            itemTop = position.beginTop + dy;

            MakeActionCreators.moveElement({top: dy, left: dx});
            position.beginX += dx;
            position.beginY += dy;
            clearTimeout(timerId);
            if (GridStore.getStore().adsorption) {
                timerId = setTimeout(doAdsorption, 500);
                function doAdsorption() {
                    var absorption = GridStore.getAdsorptionOffset();
                    //console.log(absorption.left + " top " + absorption.top);
                    if (absorption.top || absorption.left) {
                        if (absorption.top) {
                            position.beginTop += absorption.top;
                        }
                        if (absorption.left) {
                            position.beginLeft += absorption.left;
                        }
                        MakeActionCreators.moveElement({top: absorption.top, left: absorption.left});
                        //itemLeft = position.beginLeft + (event.pageX / deviceScale - position.beginX);
                        //itemTop = position.beginTop + (event.pageY / deviceScale - position.beginY);
                    }
                    //$(domNode).css({
                    //    top : itemTop,
                    //    left: itemLeft
                    //});
                }
            }
            //$(domNode).css({
            //    top : itemTop,
            //    left: itemLeft
            //});

        };
        document.onmouseup = function (event) {
            document.onmousemove = function () {
            }
            document.onmouseup = function () {
            }
            if (mouseTrough) {
                event.preventDefault();
                if (!moved) {
                    MakeActionCreators.selectElement(_this.props.index, {ctrlPressed: event.ctrlKey});
                }
                return;
            }

            itemLeft = itemLeft || attributes['item_left'];
            itemTop = itemTop || attributes['item_top'];
            GridAction.elementMoveEnd({top: itemTop, left: itemLeft});
            position.moveable = false;
            if (moved) {
                MakeActionCreators.undoRecord("end");
                moved = false;
            } else {
                MakeActionCreators.selectElement(_this.props.index, {ctrlPressed: event.ctrlKey});
            }

        };
    },

    setAnimation: function (attributes) {
        if (this.state.animationTime) clearTimeout(this.state.animationTime);
        var _this = this,
            itemAnimation = attributes['item_animation'],
            itemAnimationVal = attributes['item_animation_val'];
        if (itemAnimationVal) {
            itemAnimationVal = JSON.parse(itemAnimationVal);
        } else {
            itemAnimationVal = {duration: 1, delay: 0.3}
        }
        var delay = parseInt(itemAnimationVal.duration || 1) + parseInt(itemAnimationVal.delay || 0.3) + 0.5;
        this.setState({
            itemAnimation: itemAnimation,
            animationTime: setTimeout(function () {
                _this.setState({itemAnimation: null})
            }, delay * 1000)
        });
    },
    disableDragStart:function(e){
        e.preventDefault();
    },

};

module.exports = ElementMixin;