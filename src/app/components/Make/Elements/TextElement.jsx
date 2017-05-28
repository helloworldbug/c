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
var CloudTextUtil = require('../../../utils/CloudTextUtil')
var $ = require("jquery");
var GlobalFunc=require('../../Common/GlobalFunc')
var fix_attr = {};

var TextElement = React.createClass({

    mixins: [ElementMixin, TextMixin],

    getInitialState: function () {
        this.mounted = true
        var editable = false;
        if (this.props.attributes['new']) {
            editable = true;
        }

        var lineHeight;
        if (typeof this.props.attributes['line_height_nodefault'] != 'undefined') {
            lineHeight = this.props.attributes['line_height_nodefault'];
        } else {
            lineHeight = this.props.attributes['line_height'];
        }

        return {
            editable: editable,
            isMoving: true,
            fontSize: this.props.attributes["font_size"],
            lineHeight: lineHeight,
            fontDist: this.props.attributes["font_dist"],
            scaleType: "scale",
            itemVal: this.props.attributes['item_val'],
            writingMode: this.props.attributes['writing_mode']
        }
    },

    _updateDim: function (domWidth, domHeight) {

        if (this.props.showOnly) return;
        if (!this.mounted) {
            return
        }
        if (!!domWidth) fix_attr.itemWidth = domWidth;
        if (!!domHeight) fix_attr.itemHeight = domHeight;
        // var _this = this;
        // //MakeActionCreators.updateTextDim({fix_attr: JSON.stringify(fix_attr)}, [this.props.index]);
        // setTimeout(function (index, dim, width, height,scaleX) {
        //     //console.log("text width", domWidth);
        //      if(width*scaleX>200){
        //         debugger;
        //     }
        //     console.log(width*scaleX, "change",scaleX,width);
        //     var obj = { fix_attr: dim }
        //     // var obj = {fix_attr: dim, fixed_size: '"width":true,"height":true'};

        //     // if (typeof width == "number") {
        //     //     obj.item_width = width;
        //     // }
        //     // if (typeof height == "number") {
        //     //     obj.item_height = height;
        //     // }
        //     MakeActionCreators.updateTextDim(obj, [index]);


        // }.bind(this, this.props.index, JSON.stringify(fix_attr), domWidth + 1, domHeight + 1,this.props.attributes['x_scale']), 0);
        var element=ElementStore.getDisplayFrameElements()[this.props.index];
        element.set("fix_attr",JSON.stringify(fix_attr));
        this.props.changeControl&&this.props.changeControl();

    },
    componentDidMount: function () {

        var attributes = this.props.attributes;

        var dom = $(ReactDOM.findDOMNode(this)).find(".elementDom"),
            domWidth = dom[0].clientWidth + parseInt(dom[0].style.borderWidth) * 2,
            domHeight = dom[0].clientHeight + parseInt(dom[0].style.borderWidth) * 2;

        this.setState({
            itemWidth: domWidth,
            itemHeight: domHeight
        });


        this.loadFont(attributes);
        setTimeout(this.afterNewadd, 700);
        // this._updateDim(domWidth, domHeight);

    },

    componentWillReceiveProps: function (nextProps) {
       

            if (nextProps.showOnly) return;
            var attributes = nextProps.attributes;
            if (this.state.font!=attributes["font_family"]||this.state.itemVal!=attributes['item_val']) {
       
                this.loadFont(attributes);
         }
        
        // var attributes = nextProps.attributes;
        // if (this.state.fontSize != attributes['font_size']) {
        //     var newFS = parseFloat(attributes['font_size'])
        //     var oldFs = parseFloat(this.state.fontSize);
        //     var scale = newFS / oldFs;
        //     var oldWidth = this.state.itemWidth;
        //     this.setState({ itemWidth: oldWidth * scale })

        // }
        

        //var dom = $(ReactDOM.findDOMNode(this)).find(".elementDom"),
        //    domWidth = dom[0].clientWidth,
        //    domHeight = dom[0].clientHeight;
        //
        //this.setState({
        //    itemWidth : domWidth,
        //    itemHeight: domHeight
        //});
        //
        //this._updateDim(domWidth, domHeight);



    },

    componentDidUpdate: function () {

        var attributes = this.props.attributes;

        var dom = $(ReactDOM.findDOMNode(this)).find(".elementDom"),
        // var style = getComputedStyle(dom[0]),
            domWidth = dom[0].clientWidth + parseInt(dom[0].style.borderWidth) * 2,
            domHeight = dom[0].clientHeight + parseInt(dom[0].style.borderWidth) * 2;
        if (this.state.itemVal != attributes['item_val']) {
            this.setState({
                itemWidth: domWidth,
                itemHeight: domHeight,
                itemVal: attributes['item_val']
            })
        }
        // if (this.state.writingMode != attributes['writing_mode']) {
        //     this.setState({
        //         itemWidth: domWidth,
        //         itemHeight: domHeight,
        //         writingMode: attributes['writing_mode']
        //     })
        //     this._updateDim(domWidth, domHeight)
        // }
        if (this.state.font != attributes['font_family']) {
            this.setState({
                font: attributes['font_family']
            });

            this.loadFont(attributes);

        }

        //if (this.state.xScale != attributes['x_scale']) {
        //    this._updateDim(domWidth, domHeight);
        //    this.setState({
        //        xScale: attributes['x_scale']
        //    })
        //}
        //if (this.state.yScale != attributes['y_scale']) {
        //    this._updateDim(domWidth, domHeight);
        //    this.setState({
        //        yScale: attributes['y_scale']
        //    })
        //}
        //
        this.changeFontSize(attributes, domWidth, domHeight);

        this.changeLineHeight(attributes, domHeight);

        this.changeFontDist(attributes, domWidth);
        this.changeBorder(attributes, domWidth, domHeight);

        if (this.state.editable == false) {
            $(dom).removeAttr("contentEditable");
        }
    },

    render: function () {
        var attributes = this.props.attributes;
        var style = $.extend({}, this.getStyles(attributes), {
            cursor: this.state.isMoving ? '-webkit-grab' : 'text'
        });
        var transformStyle = 'rotate(' + attributes['rotate_angle'] + 'deg) scale(' + attributes['x_scale'] + ',' + attributes['y_scale'] + ')';
        var fixLeft = (this.state.itemWidth * attributes['x_scale'] - this.state.itemWidth) / 2;
        var fixTop = (this.state.itemHeight * attributes['y_scale'] - this.state.itemHeight) / 2;

        var position = {
            position: 'absolute',
            left: fixLeft - 1,
            top: fixTop - 1,
            WebkitTransform: transformStyle,
            MozTransform: transformStyle,
            msTransform: transformStyle,
            transform: transformStyle,
        }
        if (isNaN(fixLeft)) {
            delete position.left
        }
        if (isNaN(fixTop)) {
            delete position.top
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
            whiteSpace: 'pre',
            wordBreak: 'break-all',
            backgroundColor: attributes['bg_color'],

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

        return (
            <div className='element' style={style}
                onDoubleClick={this.doubleClick}
                onMouseDown={this.moveElement}>
                <div style={position} className={this.props.active ? "text-position focused" : "text-position"}>
                    <div style={elementDom} className='elementDom' tabIndex="-1"
                        onInput={this.input}
                        onBlur={this.blur}
                        onFocus={this.onFocus}
                        contentEditable={this.state.editable}
                        dangerouslySetInnerHTML={{ __html: attributes['item_val'] }}>
                    </div>
                </div>
                {this.renderElementSelection() }
            </div>


        );
    },

    loadFont: function (attributes, itemVal) {

        //debugger;
        (function (attributes, _this) {
            var dom = ReactDOM.findDOMNode(_this);
            var elementDom = $(dom).find(".elementDom");
            //if(attributes['font_family']=="微软雅黑"){
            //    dom.style.fontFamily = 'wryh';
            //    _this.setState({
            //        font: attributes['font_family']
            //    });
            //    return
            //}
            if (!attributes['font_family'] || attributes['font_family'] == "微软雅黑") {
                dom.style.fontFamily = '"Microsoft YaHei",wryh, Arial';
                _this.setState({
                    font: attributes['font_family']
                });
                setTimeout((function (elementDom, _this) {
                    return function () {
                        if (!_this.mounted) {
                            return
                        }
                        if (elementDom.length != 0) {
                            var width = elementDom[0].clientWidth + parseInt(elementDom[0].style.borderWidth) * 2;
                            var height = elementDom[0].clientHeight + parseInt(elementDom[0].style.borderWidth) * 2;
                            console.log(width);
                            _this.setState({
                                itemWidth: width,
                                itemHeight: height
                            });
                            _this._updateDim(width, height);
                        } else {
                            console.error("elementDom unload")
                        }
                    }
                })(elementDom, _this), 500)
                return;
            }
            var fontServer = "http://agoodme.com:3000";
            itemVal = itemVal || attributes['item_val'];
            // debugger;

            CloudTextUtil.getCloudText(itemVal, attributes['font_family'], function (font) {
                var s = document.createElement('style');
                var r = Math.random() * 100000;
                var fontFamily = 'fontcloud_' + new Date().getMilliseconds() + '_' + Math.floor(r);
                s.innerHTML = '@font-face {\nfont-family:' + fontFamily + ';\nsrc: url("' + fontServer + font.src + '") format("' + font.type + '");}\n';
                console.log("font",font);
                document.head.appendChild(s);
                dom.style.fontFamily = fontFamily;

                setTimeout((function (elementDom, _this) {
                    return function () {
                        if (!_this.mounted) {
                            return
                        }
                        if (elementDom.length != 0) {
                            _this.setState({
                                itemWidth: elementDom[0].clientWidth,
                                itemHeight: elementDom[0].clientHeight
                            });
                            _this._updateDim(elementDom[0].clientWidth, elementDom[0].clientHeight);
                        } else {
                            console.error("elementDom unload")
                        }
                    }
                })(elementDom, _this), 500)
            }.bind(_this));
            //$.ajax({
            //    type: 'GET',
            //    url: fontServer + "/loadfont/?callback=?&r=" + Math.random(),
            //    data: {"type":"fixed","font":attributes['font_family'],"text":itemVal},
            //    success:  function (font) {
            //        var s = document.createElement('style');
            //        var r = Math.random() * 100000;
            //        var fontFamily = 'fontcloud_' + new Date().getMilliseconds() + '_' + Math.floor(r);
            //        s.innerHTML = '@font-face {\nfont-family:' + fontFamily + ';\nsrc: url("' + fontServer + font.src + '") format("' + font.type + '");}\n';
            //        document.head.appendChild(s);
            //        dom.style.fontFamily = fontFamily;
            //        setTimeout((function (elementDom, _this) {
            //            return function () {
            //                if(!_this.mounted){
            //                    return
            //                }
            //                if (elementDom.length != 0) {
            //                    _this.setState({
            //                        itemWidth : elementDom[0].clientWidth,
            //                        itemHeight: elementDom[0].clientHeight
            //                    });
            //                    _this._updateDim(elementDom[0].clientWidth, elementDom[0].clientHeight);
            //                } else {
            //                    console.error("elementDom unload")
            //                }
            //            }
            //        })(elementDom, _this), 500)
            //    }.bind(_this),
            //    error:function(data,status,e){
            //        cb_err(status || e);
            //    },
            //    dataType: "json"
            //});

        })(attributes, this)
    },

    jsonp: function (url, callback) {
        var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        window[callbackName] = function (data) {
            delete window[callbackName];
            document.body.removeChild(script);

            callback(data);
        };
        var script = document.createElement('script');
        script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
        document.body.appendChild(script);
    },
    changeBorder: function (attributes, domWidth, domHeight) {
        if (this.state.itemBorder != attributes['item_border']) {

            this.setState({
                itemBorder: attributes['item_border'],
                itemWidth: domWidth,
                itemHeight: domHeight
            });

            this._updateDim(domWidth, domHeight);

        }

    },
    changeFontSize: function (attributes, domWidth, domHeight) {

        if (this.state.fontSize != attributes['font_size']) {

            this.setState({
                fontSize: attributes['font_size'],
                itemWidth: domWidth,
                itemHeight: domHeight
            });
            var dom = $(ReactDOM.findDOMNode(this)).find(".elementDom");
            var width=attributes['x_scale']*domWidth
           
            this._updateDim(domWidth, domHeight);

        }

    },

    changeLineHeight: function (attributes, domHeight) {
        var defaultLineHeight;
        if (typeof attributes['line_height_nodefault'] != 'undefined') {
            defaultLineHeight = attributes['line_height_nodefault'];
        } else {
            defaultLineHeight = attributes['line_height'];
        }

        if (this.state.lineHeight != defaultLineHeight) {

            this.setState({
                lineHeight: defaultLineHeight,
                itemHeight: domHeight
            });

            this._updateDim("", domHeight);

        }

    },

    changeFontDist: function (attributes, domWidth) {

        if (this.state.fontDist != attributes['font_dist']) {

            this.setState({
                fontDist: attributes['font_dist'],
                itemWidth: domWidth
            });

            this._updateDim(domWidth, "");

        }

    },

    doubleClick: function () {

        if (this.props.showOnly) return;

        if (!!this.props.attributes['can_edit'] && this.props.attributes['can_edit'] != true) return;

        this.setState({
            editable: true,
            isMoving: false
        });

        var selection = $(ReactDOM.findDOMNode(this)).find('.element-selection');
        selection.css('pointer-events', 'none');

        this.rangeSelect();

    },


    input: function () {

        if (this.props.showOnly) return;

        var dom = $(ReactDOM.findDOMNode(this)).find(".elementDom"),
            domWidth = dom[0].clientWidth,
            domHeight = dom[0].clientHeight;

        this.setState({
            itemWidth: domWidth,
            itemHeight: domHeight
        });

        this._updateDim(domWidth, domHeight);

    },

    blur: function () {

        if (this.props.showOnly) return;
        console.log("text blur");
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
            itemVal =  GlobalFunc.htmlEncode(dom[0].innerText),
            index = this.props.index;

        MakeActionCreators.updateElement({ item_val: itemVal }, [index]);

        this.loadFont(attributes, itemVal);

    }

});

module.exports = TextElement;