/**
 * @component Device
 * @description 设备组件: 展示当前页的元素, 并进行操作
 * @time 2015-08-31 18:01
 * @author StarZou
 **/

var React = require('react');
var ReactDOM = require("react-dom");
var ElementContainer = require('./Elements/ElementContainer');
var ElementStore = require('../../stores/ElementStore');
var PageStore = require('../../stores/PageStore');
var SelectStore = require('../../stores/SelectStore');
var GlobalFunc = require('../Common/GlobalFunc');
var PopMenu = require("./PopMenu");
var PopMenuActionCreator = require('../../actions/PopMenuActionCreator');
var $ = require("jquery");
var classNames = require('classnames');
var MakeActionCreators = require('../../actions/MakeActionCreators');
var GridLayer = require('./Tools/GridLayer');
var MusicElement = require('./Elements/MusicElement');
var TextPannel = require('./TextPannel');
var _window = null;
var position = {moveable: false};
var drapPanel, dragStartPos;
var _ = require("lodash");
var scrollInterval = null;
var dragPage = {}
var clientHeight;
/**
 * 查询ElementStore数据, 放在state中
 * @returns {{elements: (*|Array), selectedElementIndex: *, selectedElement: *}}
 */
function getStateFormStore() {

    var DisplayFrameGroup = ElementStore.getDisplayFrame();
    var baseElements = ElementStore.getBaseElements();

    var obj = {
        scrollTop:0,
        sectionHeight:0,
        baseElements        : baseElements,
        elements            : baseElements,
        selectedElementIndex: ElementStore.getSelectedElementIndex(),
        selectedElement     : ElementStore.getDisplayFrameSelectedElement(),
        music               : ElementStore.getTplMusic(),
        userObj             : GlobalFunc.getUserObj(),

    };
    if (DisplayFrameGroup) {
        obj.elements = ElementStore.getDisplayFrameElements(DisplayFrameGroup);
    }
    return obj


}

var Device = React.createClass({

    getInitialState          : function () {
        return this.props.deviceState;
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState(nextProps.deviceState)
    },
    renderGrp                : function () {
        var selectedEls = this.state.selectedElement.slice(0);
        if (_.indexOf(selectedEls, -1) != -1) {
            return null
        }
        var grps = GlobalFunc.deleteGrpEls(selectedEls);
        var grpDiv = [];
        grps.forEach((grp)=> {
            var dimPos = GlobalFunc.getDimAndPos(this.state.elements, grp.els);
            if (!dimPos) {
                return;
            }
            var classes = classNames({
                'locked': grp.locked
            });
            var style = {
                position: 'absolute',
                left    : dimPos.left,
                top     : dimPos.top,
                width   : dimPos.width,
                height  : dimPos.height
            };
            grpDiv.push(<div className={classes} style={style}/>)
        });
        if (grpDiv.length == 0) {
            return null
        } else {
            return (<div className="selected-group">{grpDiv}</div>)
        }
    },

    renderControl       : function () {
        var selectedEls = this.state.selectedElement;
        if (_.indexOf(selectedEls, -1) != -1) {
            return null
        }
        if (selectedEls.length == 1) {
            if (!GlobalFunc.ifChangeWH(selectedEls[0].get("item_type"))) {
                return null;
            }
            if(!GlobalFunc.isLineFeedText(selectedEls[0].attributes)&&selectedEls[0].attributes.item_val==""){
            return null
        }
        }
        
        var dimPos = GlobalFunc.getDimAndPos(this.state.elements, selectedEls);

        if (!dimPos) {
            return null;
        }
        var classes = classNames({
            'active' : true,
            'control': true
        });
        var style = {
            position: 'absolute',
            left    : dimPos.left,
            top     : dimPos.top,
            width   : dimPos.width,
            height  : dimPos.height,
            zIndex  : 999
        };
        if (selectedEls.length == 1) {
            var attributes = this.state.selectedElement[0].attributes;
            var transformStyle = 'rotate(' + attributes['rotate_angle'] + 'deg)';
            style.WebkitTransform = transformStyle;
            style.MozTransform = transformStyle;
            style.msTransform = transformStyle;
            style.transform = transformStyle;
            classes += " single"
        }


        return (
            <div className={classes} style={style}>
                <div className="rotate" onMouseDown={this.rotate}></div>
                <div className="anchor" data-direction="n" onMouseDown={this.mouseDown}></div>
                <div className="anchor" data-direction="e" onMouseDown={this.mouseDown}></div>
                <div className="anchor" data-direction="s" onMouseDown={this.mouseDown}></div>
                <div className="anchor" data-direction="w" onMouseDown={this.mouseDown}></div>
                <div className="anchor corner" data-direction="nw" onMouseDown={this.mouseDown}></div>
                <div className="anchor corner" data-direction="ne" onMouseDown={this.mouseDown}></div>
                <div className="anchor corner" data-direction="se" onMouseDown={this.mouseDown}></div>
                <div className="anchor corner" data-direction="sw" onMouseDown={this.mouseDown}></div>
            </div>
        );
    },
    textPannelToggleShow: function (isShow, top, el, attr) {
        this.refs.textPannel.toggleShow(isShow, top, el, attr);
    },
    render              : function () {
        var musicFocus = false;
        if (ElementStore.isSelected(-1) > -1) {
            musicFocus = true;
        } else {
            musicFocus = false;
        }
        var deviceScale = GlobalFunc.getDeviceScale();
        var pageObj = PageStore.getSelectedPage();
        var pageHeight = pageObj.get("page_height");
        var scale = {
            MozTransform   : "scale(" + deviceScale + ")",
            WebkitTransform: "scale(" + deviceScale + ")",
            OTransform     : "scale(" + deviceScale + ")",
            transform      : "scale(" + deviceScale + ")",
            height         : pageHeight + 4
        };
        //var scale = {
        //    zoom  : deviceScale,
        //    height: pageHeight + 4
        //};

        var DisplayFrameGroup = ElementStore.getDisplayFrame();
        var showBgImg = true;//选中浮层时只有基本框上显示纹理
        if (DisplayFrameGroup) {
            //选中浮层时半透明显示基本元素
            var showBgImg = false;
            var baseLayer = <div id="baselayer"><ElementContainer elements={this.state.baseElements} showOnly={true}
                                                                  page={pageObj}/>
            </div>;
        }
        var $Scroll=$("#device-scroll")
        var ScrollHeight = $Scroll.length==1?$Scroll.height():0;
        var scrollbarStyle ={};
        var scrollStyle = {
            right: "347px"
        };
        var scrollTop=this.state.scrollTop
        scrollbarStyle = {
            height: `${(1008 / pageHeight) * ScrollHeight}px`,
            top:`${scrollTop>(pageHeight-1008)?((pageHeight-1008)/pageHeight)*ScrollHeight:(scrollTop / pageHeight) * ScrollHeight}px`
        }
        var useDragNotice;
        if(!this.props.deviceState.useDrag){
            useDragNotice=<span className="drag-notice" ref="dragnotice"></span>
        }
        return (
            <div>
                <div className="device-box" id="device-box">
                    <TextPannel ref="textPannel" deviceScale={deviceScale}/>
                    <div className="device" style={scale} id="device">
                        <div id="device-content"  onDragOver={this.props.onDragOverHandler}
                             onDrop={this.props.onDropHandler} style={{height: pageHeight}}>
                            {baseLayer}
                            <ElementContainer ref="deviceContent" showBgImg={showBgImg} changeControl={this._onChange} elements={this.state.elements}
                                              page={pageObj}
                                              selectedElementIndex={this.state.selectedElementIndex}
                                              pageId={this.props.pageId}
                                              textPannelToggleShow={this.textPannelToggleShow}/>
                            {this.renderControl()}
                            {this.renderGrp()}
                            <MusicElement musicFocus={musicFocus} music={this.state.music}
                                          selectedElementIndex={this.state.selectedElementIndex}/>
                            <PopMenu />

                            <GridLayer/>
                        </div>
                        <div id="device-border"></div>
                        <div className="first-screen"><span>第一屏</span></div>

                        <div id="drag-page" onMouseDown={this.dragPageStart}></div>

                    </div>
                </div>
                <div id="device-scroll" ref="scroll" style={scrollStyle}><span className="scrollbar" style={scrollbarStyle}></span></div>
                {useDragNotice}
            </div>
        );

    },
    setUseDrag   : function () {
        this.props.changeParentState({useDrag: true})
    },
    dragPageStart       : function (event) {
        GlobalFunc.setUserExtra("useDrag")
        this.setUseDrag();
        //console.log($(".device-box")[0].scrollTop);
        event.stopPropagation();
        var scrollTop = $("#device-box")[0].scrollTop;
        dragPage.start = {top: event.pageY, lastScrollTop: scrollTop};
        clientHeight = document.body.clientHeight
        document.addEventListener("mousemove", this.changePageHeight);
        document.addEventListener("mouseup", this.finishDrag);


    },

    finishDrag      : function (event) {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null
        }
        document.removeEventListener("mouseup", this.finishDrag);

        document.removeEventListener("mousemove", this.changePageHeight)
    },
    changePageHeight: function (event) {
        var scale = GlobalFunc.getDeviceScale();
        var scrollTop = $("#device-box")[0].scrollTop;
        var dy = event.pageY - dragPage.start.top;
        var page = PageStore.getSelectedPage();
        var pageHeight = page.get("page_height");
        //pageHeight=pageHeight+(dy/scale)
        pageHeight = pageHeight + (dy / scale) + (scrollTop - dragPage.start.lastScrollTop);
        //var pageHeight=parseInt(pageHeight);
        if (event.pageY > clientHeight - 16) {
            //var evt=document.createEvent("MouseEvents");
            //evt.initEvent("mousemove",true,true,window, 1, 100, event.pageY, 100, event.pageY);
            //document.dispatchEvent(evt);
            if (scrollInterval == null) {
                scrollInterval = setInterval( ()=> {
                    console.log("scroll",$(".device-box")[0].scrollTop);
                    $(".device-box")[0].scrollTop = $(".device-box")[0].scrollTop +25;
                    var pageHeight = parseInt(page.get("page_height"));
                    var scrollDiff=$(".device-box")[0].scrollTop-dragPage.start.lastScrollTop;
                    pageHeight+=Math.floor(scrollDiff/scale)
                    MakeActionCreators.updateAttr(SelectStore.getSelectInfo(), {page_height: pageHeight });
                    dragPage.start.lastScrollTop = $(".device-box")[0].scrollTop;
                    this.setState({scrollTop:dragPage.start.lastScrollTop/scale});

                }, 150)
            }

        } else {
            if (scrollInterval) {
                clearInterval(scrollInterval);
                scrollInterval = null
            }
            dragPage.start.lastScrollTop = scrollTop;
            dragPage.start.top = event.pageY;
            if (pageHeight < 1008) {
                return;
            }
            MakeActionCreators.updateAttr(SelectStore.getSelectInfo(), {page_height: pageHeight});
        }

    },
    hidePopMenu     : function () {
        PopMenuActionCreator.hidePopMenu();
    },

    componentDidUpdate: function () {
        var dom = ReactDOM.findDOMNode(this.refs.deviceContent);
        var domOffset = $(dom).offset();
        domOffset.top = domOffset.top;
        domOffset.left = domOffset.left - 53;
        $("#miniTool").offset(domOffset);
    },

    componentDidMount: function () {

        var _this=this;
        
        var Obj = document.getElementById("device-box");

       var hideScroll=_.debounce(function hideScroll(){
           $("#device-scroll").css("opacity",0);
       },1000)
        Obj.onscroll=function(e){
            $("#device-scroll").css("opacity",1);
            hideScroll();
            var scale = GlobalFunc.getDeviceScale();
            _this.setState({scrollTop:Obj.scrollTop/scale});
        }
        Obj.onmousewheel = function (e) {
            var pageObj = PageStore.getSelectedPage();
            var pageHeight = pageObj.get("page_height");
            var scale = GlobalFunc.getDeviceScale();
            if (Obj.scrollTop + 1008 * scale >= pageHeight * scale && e.deltaY > 0) {
                e.preventDefault();
            }
        }
        ElementStore.addTimeConsumingListener(this._onChange);


        //禁止右键
        var dom = ReactDOM.findDOMNode(this.refs.deviceContent);
        var domOffset = $(dom).offset();
        domOffset.top = domOffset.top;
        domOffset.left = domOffset.left - 53;
        $("#miniTool").offset(domOffset);
        dom.oncontextmenu = function (event) {
            //event.stopPropagation();
            var scale = GlobalFunc.getDeviceScale();
            event.preventDefault();
            var offset = $(".element-container", "#device").offset();
            PopMenuActionCreator.showPopMenu({
                left: (event.pageX - offset.left) / scale,
                top : (event.pageY - offset.top ) / scale
            }, event.target.parentNode)
        };

        document.addEventListener("click", this.hidePopMenu);
        var deviceScale = GlobalFunc.getDeviceScale();
        if(!this.props.deviceState.useDrag){
            var dragnotice = ReactDOM.findDOMNode(this.refs.dragnotice);
            $(dragnotice).offset({
                left: $(dom).offset().left+320* deviceScale-64-4,
            });
            $(dragnotice).css({
                bottom: 25/deviceScale
            });
        }
    },

    componentWillUnmount: function () {
        document.removeEventListener("click", this.hidePopMenu);
        ElementStore.removeTimeConsumingListener(this._onChange);
    },

    _onChange: function () {
        this.setState(getStateFormStore());
    },

    rotate: function (e) {
        e.stopPropagation();
        var _this = this;

        var selectedEls = this.state.selectedElement[0];
        var dimPos = GlobalFunc.getDimAndPos(this.state.elements, [selectedEls]);
        var ox = e.clientX;
        var oy = -e.clientY;
        var rx = dimPos.left + dimPos.width / 2;
        var ry = dimPos.top + dimPos.height / 2;
        var clientRX = GlobalFunc.deviceX2Client(rx);
        var clientRY = -GlobalFunc.deviceY2Client(ry);
        var elStartAngle = _this.state.selectedElement[0].get("rotate_angle");
        document.onmousemove = function (event) {
            event.stopPropagation();
            //求旋转角度：一个三角形,已知三个点的坐标,求夹角的角度
            // 设A(ox,oy) B(clientRX,clientRY) C(pageX,pageY)
            // 向量AB=(clientRX-ox,clientRY-oy),向量BA=(ox-clientRX,oy-clientRY),向量BC=(pageX-clientRX,pageY-clientRY)
            // cosABC=向量BA向量BC/|BA|*|BC|
            //    =(ox-clientRX,oy-clientRY)*(pageX-clientRX,pageY-clientRY)/|(ox-clientRX,oy-clientRY)|*|(pageX-clientRX,pageY-clientRY)|
            //    =((ox - clientRX ) * (pageX - clientRX) + (oy - clientRY ) * (pageY - clientRY))/|(ox-clientRX,oy-clientRY)|*|(pageX-clientRX,pageY-clientRY)|
            //因为屏幕的Y轴是向下的，所以算法对Y的值要取反
            var pageX = event.clientX;
            var pageY = -event.clientY;
            var cosABC = ((ox - clientRX ) * (pageX - clientRX) + (oy - clientRY ) * (pageY - clientRY)) / (GlobalFunc.getPointMod({
                    x: ox - clientRX,
                    y: oy - clientRY
                }) * GlobalFunc.getPointMod({x: pageX - clientRX, y: pageY - clientRY}));
            var angle = Math.acos(cosABC);
            var rotateAngle = parseInt(angle * (180 / Math.PI));
            if ((clientRX - ox) * (pageY - clientRY) - (clientRY - oy) * (pageX - clientRX) < 0) {
                //逆时针角度取反
                //逆时针判断p1 * p2 = x1y2  - x2 y1，结果为正时是顺时针方向，为负时是逆时针方向
                rotateAngle = -rotateAngle
            }
            if (event.shiftKey) {
                var factor = Math.round(rotateAngle / 15);
                rotateAngle = factor * 15;
            }
            var targetAngle = elStartAngle + rotateAngle;
            //取[0,360]区间
            if (targetAngle < 0) {
                targetAngle = 360 + targetAngle;
            } else if (targetAngle > 360) {
                targetAngle = targetAngle - 360;
            }
            if (!isNaN(targetAngle)) {
                MakeActionCreators.updateElement({rotate_angle: targetAngle}, undefined, {type: "mousemove"});
                //ox = event.clientX;
                //oy = event.clientY;
            }


        };
        document.onmouseup = function () {
            MakeActionCreators.undoRecord("end");
            document.onmousemove = function () {
            };
            document.onmouseup = function () {
            };
        }

    },

    mouseDown: function (event) {

        event.stopPropagation();

        var direction = $(event.target)[0].dataset['direction'],

            deviceScale = GlobalFunc.getDeviceScale();
        position.beginX = event.pageX / deviceScale;
        position.beginY = event.pageY / deviceScale;
        position.moveable = true;

        var changeX, changeY, transX, transY;

        switch (direction) {
            case 'n':
                document.onmousemove = function (event) {
                    if (position.moveable) {
                        transY = event.pageY / deviceScale;
                        changeY = (transY - position.beginY);
                        var sourceInfo = {top: transY, dy: changeY};
                        if (GlobalFunc.canUpdate(sourceInfo)) {
                            position.beginY = transY;
                            MakeActionCreators.multiUpdate(sourceInfo, {type: "mousemove"});
                        }
                    }
                };
                break;
            case 'w':
                document.onmousemove = function (event) {
                    if (position.moveable) {
                        transX = event.pageX / deviceScale;
                        changeX = (transX - position.beginX);

                        var sourceInfo = {left: transX, dx: changeX}
                        if (GlobalFunc.canUpdate(sourceInfo)) {
                            position.beginX = transX;
                            MakeActionCreators.multiUpdate(sourceInfo, {type: "mousemove"});
                        }

                    }
                };
                break;
            case 's':
                document.onmousemove = function (event) {
                    if (position.moveable) {
                        transY = event.pageY / deviceScale;
                        changeY = (transY - position.beginY);
                        var sourceInfo = {dy: changeY}
                        if (GlobalFunc.canUpdate(sourceInfo)) {
                            position.beginY = transY;
                            MakeActionCreators.multiUpdate(sourceInfo, {type: "mousemove"});
                        }
                    }
                };
                break;

            case 'e':
                document.onmousemove = function (event) {
                    if (position.moveable) {
                        var transX = event.pageX / deviceScale;
                        changeX = (transX - position.beginX);
                        var sourceInfo = {dx: changeX}
                        if (GlobalFunc.canUpdate(sourceInfo)) {
                            position.beginX = transX;
                            MakeActionCreators.multiUpdate(sourceInfo, {type: "mousemove"});
                        }
                    }
                };
                break;

            case 'nw':
                document.onmousemove = function (event) {
                    if (position.moveable) {
                        transX = event.pageX / deviceScale;
                        changeX = (transX - position.beginX);
                        transY = event.pageY / deviceScale;
                        changeY = (transY - position.beginY);
                        var sourceInfo = {left: transX, dx: changeX, top: transY, dy: changeY}
                        if (GlobalFunc.canUpdate(sourceInfo, true)) {
                            position.beginY = transY;
                            position.beginX = transX;
                            MakeActionCreators.multiUpdate(sourceInfo, {type: "mousemove", shift: true});
                        }
                    }
                };
                break;
            case 'ne':
                document.onmousemove = function (event) {
                    if (position.moveable) {
                        transX = event.pageX / deviceScale;
                        changeX = (transX - position.beginX);
                        transY = event.pageY / deviceScale;
                        changeY = (transY - position.beginY);
                        var sourceInfo = {dx: changeX, top: transY, dy: changeY}
                        if (GlobalFunc.canUpdate(sourceInfo, true)) {
                            position.beginX = transX;
                            position.beginY = transY;
                            MakeActionCreators.multiUpdate(sourceInfo, {type: "mousemove", shift: true});
                        }

                    }
                };

                break;
            case 'se':
                document.onmousemove = function (event) {
                    if (position.moveable) {
                        transX = event.pageX / deviceScale;
                        changeX = (transX - position.beginX);

                        var transY = event.pageY / deviceScale;
                        changeY = (transY - position.beginY);
                        var sourceInfo = {dx: changeX, dy: changeY}
                        if (GlobalFunc.canUpdate(sourceInfo, true)) {
                            position.beginX = transX;
                            position.beginY = transY;
                            MakeActionCreators.multiUpdate(sourceInfo, {type: "mousemove", shift: true});
                        }

                    }
                };

                break;
            case 'sw':
                document.onmousemove = function (event) {
                    if (position.moveable) {
                        transX = event.pageX / deviceScale;
                        changeX = (transX - position.beginX);
                        transY = event.pageY / deviceScale;
                        changeY = (transY - position.beginY);
                        var sourceInfo = {left: transX, dx: changeX, dy: changeY}
                        if (GlobalFunc.canUpdate(sourceInfo, true)) {
                            position.beginX = transX;
                            position.beginY = transY;
                            MakeActionCreators.multiUpdate(sourceInfo, {type: "mousemove", shift: true});
                        }
                    }
                };

                break;
            default:
                position.moveable = false;
                break;
        }
        document.onmouseup = function () {
            if (position.moveable) {
                MakeActionCreators.undoRecord("end");
                position.moveable = false;
            }
        };
    }

});

module.exports = Device;