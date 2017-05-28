/**
 * @component MagazineMainSection

 **/

var React = require('react');
var ReactDOM = require("react-dom");

var MultiPageDevice = require("./MultiPageDevice")
var Device = require('./Device');
var Settings = require('./Settings');
var $ = require("jquery");
var MoveableTool = require('./Tools/MoveableTool');
var ToolsBox = require('./Tools/ToolsBox');
var RightTool = require('./Tools/RightTool');
var CommonTool = require("./Tools/CommonTool");
var AlignTool = require("./Tools/AlignTool");
var GlobalFunc = require('../Common/GlobalFunc');
var MakeActionCreators = require('../../actions/MakeActionCreators');
var MagazinePageTree = require("./MagazinePageTree");
var Module = require("./Module");
var MakeStore = require("../../stores/MakeStore");
var PageStore = require("../../stores/PageStore");
var ElementStore = require("../../stores/ElementStore");
var SelectStore = require("../../stores/SelectStore");
var MagazineStore = require("../../stores/MagazineStore");
var classNames = require('classnames');
var NoviceGuide = require('./NoviceGuide');
//组件库
var MakeComponent = require("./MakeComponent");

var CommonUtils = require('../../utils/CommonUtils');
var DialogAction = require('../../actions/DialogActionCreator');

var dragStartPos;
var deviceContentOffset;
var dragInfo = {};

function getStateFormStore() {
    var type = SelectStore.getSelectInfo().type
    var selectPages = PageStore.getSelectedPage();
    if (type == "group") {
        return {
            pages: selectPages || [],
            showElement: false,
            workData: MagazineStore.getWorkData(),  //作品数据
            selectedState: SelectStore.getSelectInfo(),  //选中状态
        }
    } else {
        return {
            showElement: true,
            pageId: PageStore.getPageUid(),
            workData: MagazineStore.getWorkData(),  //作品数据
            selectedState: SelectStore.getSelectInfo(),  //选中状态
        }
    }

}
var MagazineMainSection = React.createClass({

    getInitialState: function () {
        var state = getStateFormStore();
        state.useDrag = GlobalFunc.getUserExtra("useDrag");
        state.pageAddClickCount = 0; //添加页点击数
        state.tabIndex = 1; //当前选中tab
        return state;
    },

    pageClick: function (ID, type, event) {
        MakeActionCreators.selectSome({ ID: ID, type: type });
        //console.log("click",ID, type);
    },

    componentWillMount: function () {
        this.isNovice();
    },
    changeState: function (obj) {
        this.setState(obj)
    },

    /***
     * 拖动到制作模块事件
     **/
    onDragOverHandler: function (e) {
        e.preventDefault();
    },

    onDropHandler: function (e) {
        e.preventDefault();
        if (window.addEventListener) {
            e.stopPropagation();
        } else if (window.attachEvent) {
            e.cancelBubble = true;
        }

        var self = this;
        var tid = e.dataTransfer.getData("templateId");
        if (tid) {
            self.replaceTemplate(tid);
            return;
        }

        var elementType = e.dataTransfer.getData("elementType");
        if (elementType) {
            console.log(elementType)
            CommonUtils.addElementByType(parseInt(elementType));
            return;
        }

    },

    /**
     * 替换版式
     **/
    replaceTemplate: function (tid) {
        var self = this;
        //获取当前选中的页信息
        var page = PageStore.getSelectedPage();
        //判断当前页元素个数是否大于1
        if (page.attributes.item_object.length > 1) {
            DialogAction.show("tips", "", {     //提示是否替换
                contentText: "确定替换版式吗？",
                onConfirm: function () {
                    CommonUtils.replaceTemplateById(tid, function () {
                        self.pageClickReduce();
                    });
                    self.pageClickAdd();
                }
            });
        } else {
            //不存在版式直接替换版式
            CommonUtils.replaceTemplateById(tid, function () {
                self.pageClickReduce();
            });
            self.pageClickAdd();
        }
    },

    render: function () {
        var elementContainer;
        if (this.state.showElement) {
            //显示元素
            let DisplayFrameGroup = ElementStore.getDisplayFrame();
            let baseElements = ElementStore.getBaseElements();
            let elements = baseElements;
            if (DisplayFrameGroup) {
                elements = ElementStore.getDisplayFrameElements(DisplayFrameGroup);
            }
            var deviceState = {
                baseElements: baseElements,
                elements: elements,
                selectedElementIndex: ElementStore.getSelectedElementIndex(),
                selectedElement: ElementStore.getDisplayFrameSelectedElement(),
                music: ElementStore.getTplMusic(),
                userObj: GlobalFunc.getUserObj(),
                useDrag: this.state.useDrag
            }
            var deviceScale = GlobalFunc.getDeviceScale();
            var scale = {
                width: 640 * deviceScale,
                height: 1008 * deviceScale
            };

            elementContainer = (
                <div>
                    {this.state.pageAddClickCount > 0 ? <div className="m-loading">版式加载中...</div> : ""}

                    {/*<MoveableTool ref="commonTool" expandDirection="left">
                        <CommonTool />
                    </MoveableTool>*/}
                    <Device pageId={this.state.pageId} deviceState={deviceState} changeParentState={this.changeState} onDragOverHandler={this.onDragOverHandler} onDropHandler={this.onDropHandler} />

                    {/*<MoveableTool ref="alignTool" expandDirection="right">
                        <AlignTool/>
                    </MoveableTool>*/}

                    <ToolsBox>
                        <CommonTool />
                    </ToolsBox>
                    <RightTool />
                </div>
            )
        } else {
            //显示多图视图
            elementContainer = <MultiPageDevice pages={this.state.pages} pageAddClickCount={this.state.pageAddClickCount} pageClick={this.pageClick}/>
        }
        var height = document.body.clientHeight - 54;
        var noviceGuide = this.state.isNovice ? <NoviceGuide /> : '';
        var sideDiv;
        if (this.state.tabIndex == 1) {
            sideDiv = <MagazinePageTree show={true} showModule={this.showModuleTab}
                workData={this.state.workData} selectedState={this.state.selectedState} />
        } else if (this.state.tabIndex == 2) {
            sideDiv = <Module show={true} pageClickAdd = {this.pageClickAdd} pageClickReduce={this.pageClickReduce} pageAddClickCount={this.state.pageAddClickCount}
                replacePage={this.state.selectedState.type == "page"}/>
        } else if (this.state.tabIndex == 3) {
            sideDiv = <MakeComponent  selectedState={this.state.selectedState} />
        }
        return (
            <div className="mainsection" style={{ height: height }} onMouseDown={this.dragStart}>
                <div className="make-left-tab">
                    <div className="tab-icon-1" data-id="1" onClick={this.onChangeTabIndex}>
                        <div className="active" style={{ display: this.state.tabIndex == 1 ? "block" : "none" }}></div>
                        <span className="tab-tip">页面管理</span>
                    </div>
                    <div className="tab-icon-2" data-id="2" onClick={this.onChangeTabIndex}>
                        <div className="active" style={{ display: this.state.tabIndex == 2 ? "block" : "none" }}></div>
                        <span className="tab-tip">版式库</span>
                    </div>
                    <div className="tab-icon-3" data-id="3" onClick={this.onChangeTabIndex}>
                        <div className="active" style={{ display: this.state.tabIndex == 3 ? "block" : "none" }}></div>
                        <span className="tab-tip">组件库</span>
                    </div>
                </div>

                <div className="side">{sideDiv}</div>

                <div id="save-tip"></div>
                {elementContainer}
                <Settings workData={this.state.workData} selectedState={this.state.selectedState}/>

                { noviceGuide }

            </div>
        );
    },
    onChange: function () {

        // var selectedEls = ElementStore.getDisplayFrameSelectedElement();
        // var elements = ElementStore.getBaseElements();
        // var dimPos = GlobalFunc.getDimAndPos(elements, selectedEls);
        // if (dimPos.width > 170) {
        //     debugger;
        // }
        this.setState(getStateFormStore())
    },
    componentDidMount: function () {
        PageStore.addChangeListener(this.onChange);
        ElementStore.addChangeListener(this.onChange);
        SelectStore.addChangeListener(this.onChange);
        MagazineStore.addChangeListener(this.onChange);
        var _this = this;
        $(window).resize(function () {
            _this.forceUpdate();
        });
        if (this.state.showElement) {
            var deviceContent = $("#device-content");
            deviceContentOffset = $(deviceContent).offset();
            var deviceScale = GlobalFunc.getDeviceScale();
            deviceContentOffset.left *= deviceScale
            deviceContentOffset.top *= deviceScale


        }

    },
    componentWillUnmount: function () {
        PageStore.removeChangeListener(this.onChange);
        ElementStore.removeChangeListener(this.onChange);
        SelectStore.removeChangeListener(this.onChange);
        MagazineStore.removeChangeListener(this.onChange);
    },
    componentDidUpdate: function () {
        if (this.state.showElement) {
            var deviceContent = $("#device-content");
            //var commonTool = this.refs.commonTool;
            deviceContentOffset = $(deviceContent).offset();
            var deviceScale = GlobalFunc.getDeviceScale();
            deviceContentOffset.left *= deviceScale;
            deviceContentOffset.top *= deviceScale

        }

    },

    dragStart: function (event) {
        if (event.target.className.indexOf("device-box") > -1 || $(event.target).parents('#device').length != 0) {
            if (event.target.className.indexOf("device-box") > -1) {
                MakeActionCreators.selectElement([]);
            }
            dragStartPos = { x: event.pageX, y: event.pageY };

            $("#drag-select").css({ top: dragStartPos.y, left: dragStartPos.x, width: 0, height: 0, display: "block" });
            var ElementStore = require("../../stores/ElementStore");
            dragInfo.selectIndex = ElementStore.getSelectedElementIndex().slice(0);
            dragInfo.deviceScale = GlobalFunc.getDeviceScale();
            document.addEventListener("mousemove", this.dragging);
            document.addEventListener("mouseup", this.dragend);
        }
    },

    dragging: function (event) {
        var pos = { x: event.pageX, y: event.pageY };
        var x1 = Math.min(pos.x, dragStartPos.x);
        var y1 = Math.min(pos.y, dragStartPos.y);
        var x2 = Math.max(pos.x, dragStartPos.x);
        var y2 = Math.max(pos.y, dragStartPos.y);

        $(" #drag-select").css({
            left: x1,
            top: y1,
            width: Math.abs(pos.x - dragStartPos.x),
            height: Math.abs(pos.y - dragStartPos.y)
        });

        function tranScale(x, type) {
            return (x - deviceContentOffset[type]) / dragInfo.deviceScale
        }

        MakeActionCreators.dragSelect({
            x1: tranScale(x1, "left"),
            y1: tranScale(y1, "top"),
            x2: tranScale(x2, "left"),
            y2: tranScale(y2, "top")
        }, dragInfo.selectIndex, {
                ctrlPressed: event.ctrlKey
            });

    },

    dragend: function () {
        $(" #drag-select").css({ display: "none" });
        document.removeEventListener("mousemove", this.dragging);
        document.removeEventListener("mouseup", this.dragend);
    },
    showModuleTab: function (event) {
        this.setState({
            tabIndex: 2
        })
    },

    onChangeTabIndex: function (e) {
        var target = e.target;
        var index = target.getAttribute("data-id");
        if (index) {
            this.setState({ tabIndex: parseInt(index) });
        }
    },

    /*
    * 是否是第一次制作（判断本地存储）
    */
    isNovice: function () {
        var noviceGuide = GlobalFunc.getUserExtra("noviceGuide");
        if (!!noviceGuide) {
            this.setState({ isNovice: false });
        } else {
            this.setState({ isNovice: true });
        }
    },

    // 增加点击数
    pageClickAdd: function () {
        this.setState({ pageAddClickCount: ++this.state.pageAddClickCount });
    },

    // 减少点击数
    pageClickReduce: function () {
        if (this.state.pageAddClickCount > 0)
            this.setState({ pageAddClickCount: --this.state.pageAddClickCount });
        else
            return;
    }

});

module.exports = MagazineMainSection;