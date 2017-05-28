/**
 * @component TextElement
 * @description 文本元素
 * @time 2015-09-01 19:54
 * @author StarZou
 **/

var React = require('react');
var ReactDOM = require("react-dom");
var ElementMixin = require('./ElementMixin');
var TextMixin = require('./TextMixin');
var MakeActionCreators = require('../../../actions/MakeActionCreators');
var EditStateStore = require('../../../stores/EditStateStore');
var ElementStore = require('../../../stores/ElementStore');
var CloudTextUtil = require('../../../utils/CloudTextUtil');
var GlobalFunc=require('../../Common/GlobalFunc')
var $ = require("jquery");
var fix_attr = {};

var TextElement = React.createClass({

    mixins: [ElementMixin, TextMixin],

    getInitialState: function () {
        this.mounted = true
        var editable = false;
        if (this.props.attributes['new']) {
            editable = true;
        }
        return {
            editable: editable,
            isMoving: true,
            itemVal: this.props.attributes['item_val']
        }
    },

    _updateDim: function (domWidth, domHeight) {
        if (this.props.showOnly) return;
        if (!this.mounted) {
            return
        }
        if (!!domWidth) fix_attr.itemWidth = domWidth;
        if (!!domHeight) fix_attr.itemHeight = domHeight;
        var _this = this;
        //MakeActionCreators.updateTextDim({fix_attr: JSON.stringify(fix_attr)}, [this.props.index]);
        setTimeout(function (index, dim) {
            //console.log("text", index);
            MakeActionCreators.updateTextDim({ fix_attr: dim }, [index]);
        }.bind(this, this.props.index, JSON.stringify(fix_attr)), 0);
    },


    componentDidMount: function () {
        this.afterNewadd();
        var attributes = this.props.attributes;
        console.log(attributes, "attributes");

        var itemWidth = attributes['item_width'];

        var dom = $(ReactDOM.findDOMNode(this)).find(".elementDom"),
            domHeight = dom[0].clientHeight + parseInt(dom[0].style.borderWidth) * 2;

        var index = this.props.index;
        if (attributes["item_height"] == 0) {
            setTimeout(function (i) {
                MakeActionCreators.updateElement({ item_height: domHeight, is_wrap: true }, [i])
            }.bind(this, index), 0);
        }

        this.setState({
            itemHeight: domHeight
        });

        this._updateDim(itemWidth, domHeight);

        this.loadFont(attributes);
    },

    componentWillReceiveProps: function (nextProps) {

        if (nextProps.attributes != this.props.attributes) {

            var attributes = nextProps.attributes;
            if (nextProps.showOnly) return;
            this.loadFont(attributes);
        }

    },

    componentDidUpdate: function () {
        var attributes = this.props.attributes;
        var dom = $(ReactDOM.findDOMNode(this)).find(".elementDom");

        if (this.state.itemVal != attributes['item_val']) {
            this.setState({
                itemVal: attributes['item_val']
            })
        }

        if (this.state.font != attributes['font_family']) {

            this.setState({
                font: attributes['font_family']
            });

            this.loadFont(attributes);

        }
        if (this.props.showOnly) return;
        var editor = ReactDOM.findDOMNode(this).getElementsByClassName("elementDom")[0];
        var index = this.props.index;
        setTimeout(function (i, viewHeight) {
            var attributes = ElementStore.getElementByIndex(i).attributes;
            if (viewHeight > attributes["item_height"]) {
                if (!attributes["item_scroll"]) {
                    console.log("true", index);
                    MakeActionCreators.updateElement({ item_scroll: true }, [i], { type: "notsave" })
                }
            } else {
                if (attributes["item_scroll"]) {
                    console.log("false", index);
                    MakeActionCreators.updateElement({ item_scroll: false }, [i], { type: "notsave" })

                }


            }

        }.bind(this, index, editor.scrollHeight), 10)

        if (this.state.editable == false) {
            $(dom).removeAttr("contentEditable");
        }

    },

    render: function () {

        var attributes = this.props.attributes;
        var style = $.extend({}, this.getStyles(attributes), {
            cursor: this.state.isMoving ? '-webkit-grab' : 'text'
        });

        var animation = this.getAnimationStyles(attributes);
        var transformStyle = 'rotate(' + attributes['rotate_angle'] + 'deg) scale(' + attributes['x_scale'] + ',' + attributes['y_scale'] + ')';
        var itemWidth = attributes['item_width'];
        //var itemHeight = attributes['item_height'];
        var itemHeight = attributes['item_height'] == 0 ? this.state.itemHeight : attributes['item_height'];
        var fixLeft = (itemWidth * attributes['x_scale'] - itemWidth) / 2;
        var fixTop = (itemHeight * attributes['y_scale'] - itemHeight) / 2;
        var position = {
            position: 'absolute',
            left: fixLeft - 1,
            height: itemHeight,
            top: fixTop - 1,
            WebkitTransform: transformStyle,
            MozTransform: transformStyle,
            msTransform: transformStyle,
            transform: transformStyle,
            overflowX: "hidden",
            overflowY: "hidden"
        }

        var lineHeight;
        if (typeof attributes['line_height_nodefault'] != "undefined") {
            lineHeight = (parseInt(attributes['line_height_nodefault']) + parseInt(attributes['font_size'].slice(0, -2))) + 'px';
        } else if (typeof attributes['line_height'] != "undefined") {
            lineHeight = (parseInt(attributes['line_height']) + parseInt(attributes['font_size'].slice(0, -2))) + 'px';
        } else {
            lineHeight = null;
        }

        var elementDom = {
            display: 'inline-block',
            fontFamily: 'inherit',
            backgroundColor: attributes['bg_color'],
            width: itemWidth,
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",

            opacity: attributes['item_opacity'] / 100,
            borderWidth: attributes['item_border'] || 0 + 'px',
            borderStyle: attributes['bd_style'] || 'solid',
            borderColor: attributes['bd_color'] || '#000',
            borderRadius: attributes['bd_radius'] || 0 + 'px',
            boxSizing: 'border-box',
            fontStyle: attributes['font_style'],
            textShadow: attributes['font_frame'] ? '0px 0px ' + attributes['frame_pixes'] + 'px ' + (attributes['frame_color'] || '') : 'none',
            textAlign: attributes['font_halign'] == 'mid' ? 'center' : attributes['font_halign'],
            textDecoration: attributes['text_decoration'],
            color: attributes['item_color'],
            fontSize: attributes['font_size'],
            fontWeight: attributes['font_weight'],
            lineHeight: lineHeight,
            letterSpacing: attributes['font_dist'] + 'px',
            outline: 'none',
            writingMode: attributes['writing_mode'],
            cursor: this.state.editable && attributes['writing_mode'] ? "vertical-text" : ""
        };
        if (this.state.editable) {
            elementDom.overflowY = "auto"
        }
        return (
            <div className='element text' style={style}
                onDoubleClick={this.doubleClick}
                onMouseDown={this.moveElement}>
                <div style={position} className={this.props.active ? "text-position focused" : "text-position"}>
                    <div style={elementDom} className='elementDom' ref="text" tabIndex="-1"
                        onInput={this.filterText}
                        onBlur={this.blur}
                        onFocus={this.onFocus}
                        contentEditable={this.state.editable}
                        dangerouslySetInnerHTML={{ __html: attributes['item_val'] }}></div>
                </div>
                {this.renderElementSelection() }
            </div>
        );
    },
    filterText: function (event) {
        if (this.props.showOnly) return;
        var val = this.refs.text.innerHTML;
       
        console.log(val);
        if (val.indexOf('&nbsp;') > -1) {
            val = val.replace(/&nbsp;/g, ' ');
            this.refs.text.innerHTML = GlobalFunc.htmlEncode(val)
        }
    },
    loadFont: function (attributes, itemVal) {
        (function (attributes, _this) {
            var dom = ReactDOM.findDOMNode(_this);
            var elementDom = $(dom).find(".elementDom");
            if (attributes['font_family'] == "微软雅黑") {
                dom.style.fontFamily = '"Microsoft YaHei",wryh, Arial';
                _this.setState({
                    font: attributes['font_family']
                });
                return
            }
            if (!attributes['font_family']) {
                dom.style.fontFamily = 'Arial';
                _this.setState({
                    font: attributes['font_family']
                });
                return;
            }
            var fontServer = "http://agoodme.com:3000";
            itemVal = itemVal || attributes['item_val'];

            CloudTextUtil.getCloudText(itemVal, attributes['font_family'], function (font) {
                var s = document.createElement('style');
                var r = Math.random() * 100000;
                var fontFamily = 'fontcloud_' + new Date().getMilliseconds() + '_' + Math.floor(r);
                s.innerHTML = '@font-face {\nfont-family:' + fontFamily + ';\nsrc: url("' + fontServer + font.src + '") format("' + font.type + '");}\n';
                document.head.appendChild(s);
                dom.style.fontFamily = fontFamily;

                // add 保存font_src 和 font_type
            }.bind(_this));

        })(attributes, this)

    },


    doubleClick: function () {
        if (this.props.showOnly) return;

        if (!!this.props.attributes['can_edit'] && this.props.attributes['can_edit'] != true) return;
        //MakeActionCreators.updateElement( {editing: true}, [this.props.index])
        this.setState({
            editable: true,
            isMoving: false
        });

        var selection = $(ReactDOM.findDOMNode(this)).find('.element-selection');
        selection.css('pointer-events', 'none');

        this.rangeSelect();

    },

    blur: function (event) {
        if (this.props.showOnly) return;
        console.log("text blur", this.clickFocus);
        if (EditStateStore.getTextPannelMouseOverState() || !!this.clickFocus) {
            //this.refs.text.focus();
            return;
        }
        this.props.textPannelToggleShow(false);
        this.setState({
            editable: false,
            isMoving: true
        });

        var attributes = this.props.attributes,
            dom = $(ReactDOM.findDOMNode(this)).find(".elementDom"),
            itemVal = GlobalFunc.htmlEncode(dom[0].innerText),
            index = this.props.index;
        var editor = ReactDOM.findDOMNode(this).getElementsByClassName("elementDom")[0];
        editor.scrollTop = 0;
        if (editor.scrollHeight > attributes["item_height"]) {
            MakeActionCreators.updateElement({ item_val: itemVal }, [index]);
        } else {
            MakeActionCreators.updateElement({ item_val: itemVal }, [index]);
        }


        this.loadFont(attributes, itemVal);

    }

});

module.exports = TextElement;