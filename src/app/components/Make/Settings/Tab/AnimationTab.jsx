/**
 * @component AnimationTab
 * @description 动画设置tab
 * @time 2015-09-07 15:33
 * @author StarZou
 **/

var React = require('react');
var ElementStore = require('../../../../stores/ElementStore');
var DialogAction = require('../../../../actions/DialogActionCreator');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var Range = require('../../../Common/Range');
var Tags = require("../../../Common/Tags.jsx");
var Tag = require("../../../Common/Tag.jsx");
var UndoMixin = require("../UndoMixin");
var GlobalFunc = require('../../../Common/GlobalFunc');
var AnimateSelect = require("./SettingComponents/AnimateSelect");

var NewRange = require("./SettingComponents/Range");
var animateUtil = require("../../../Common/animateUtil")
var dragInfo = {};
var AnimationTab = React.createClass({

    mixins: [UndoMixin],

    getInitialState: function () {
        //var animationName = GlobalFunc.getAnimationName(this.props.attributes['item_animation']);

        var showTimelineSwitch = true;
        var group_id = this.props.attributes["group_id"];
        if (!!group_id && GlobalFunc.ifPicFrame(group_id, ElementStore.getElements())) {
            showTimelineSwitch = false;
        }
        return {
            showTimelineSwitch: showTimelineSwitch,
            selectBlock: 0,
            animationName: [],
            animationVal: []
        }
    },

    componentWillReceiveProps: function (nextProps) {
        var animationName = GlobalFunc.getAnimationName(nextProps.attributes['item_animation']),
            animationVal = GlobalFunc.getAnimationTimeArr(nextProps.attributes['item_animation_val']);

        this.setState({
            animationName: animationName,
            animationVal: animationVal
        });
    },

    componentDidMount: function () {
        var attributes;
        var elArr = ElementStore.getDisplayFrameSelectedElement();
        if (elArr.length == 0) {
            return null;
        } else {
            attributes = elArr[0].attributes;
        }

        var animationName = GlobalFunc.getAnimationName(attributes['item_animation']),
            animationVal = GlobalFunc.getAnimationTimeArr(attributes['item_animation_val']);

        this.setState({
            animationName: animationName,
            animationVal: animationVal
        });

        //$("#setting-animation-0").show();

    },
    // customNameChange: function (index, name) {

    //     var animationVal = GlobalFunc.getAnimationTimeArr(this.props.attributes['item_animation_val']);
    //     if (typeof name != "") {
    //         animationVal[index].custom_name = name;
    //     } else {
    //         delete animationVal[index].custom_name
    //     }
    //     MakeActionCreators.updateElement({ item_animation_val: JSON.stringify(animationVal) });

    // },
    nameChange: function (index, name, type) {
        var animationName = GlobalFunc.getAnimationName(this.props.attributes['item_animation']);
        animationName[index] = name;
        var animationVal = GlobalFunc.getAnimationTimeArr(this.props.attributes['item_animation_val']);
        if (typeof type != "undefined") {
            animationVal[index].type = type;
        }
        MakeActionCreators.updateElement({ item_animation_val: JSON.stringify(animationVal), item_animation: JSON.stringify(animationName) });

    },
    rangeChange: function (index, type, value, isRange) {

        var obj = { duration: value.duration, delay: value.delay, infinite: value.infinite, type: value.type };
        var animationVal = GlobalFunc.getAnimationTimeArr(this.props.attributes['item_animation_val']);
        var animationName = GlobalFunc.getAnimationName(this.props.attributes['item_animation']);
        if (typeof obj.type == "undefined") {
            obj.type = animateUtil.getType(animationName);
        }
        animationVal[index] = obj;


        var animationValStr = JSON.stringify(animationVal);


        if (isRange) {
            MakeActionCreators.updateElement({ item_animation_val: animationValStr, item_animation: JSON.stringify(animationName) }, undefined, { type: "range" });
        } else {
            MakeActionCreators.updateElement({ item_animation_val: animationValStr, item_animation: JSON.stringify(animationName) });

        }

    },
    stopPropagation: function (e) {
        e.stopPropagation();
    },
    editName: function (index, event) {
        var target = event.target;
        var oldValue = target.innerHTML
        target.parentNode.setAttribute("draggable", false);
        target.innerHTML = '<input id="in-place-input" type="text"  value="" maxlength="20"/>';
        $("#in-place-input").on("blur", (event) => {
            var name = event.target.value;
            target.parentNode.setAttribute("draggable", true);
            target.innerHTML = name;
            $("#in-place-input").remove();
            var animationVal = GlobalFunc.getAnimationTimeArr(this.props.attributes['item_animation_val']);
            if (typeof name != "") {
                animationVal[index].custom_name = name;
            } else {
                delete animationVal[index].custom_name
            }
            MakeActionCreators.updateElement({ item_animation_val: JSON.stringify(animationVal) });
            // MakeActionCreators.updateAttr(this.props.selectedState, {f_name: name});
        }).focus().on("keydown", function (event) {
            if (event.which == 13) {
                $(event.target).trigger("blur")
            }
        }).val(oldValue)[0].select();

    },
    stop: function (event) {
        event.preventDefault();
        event.stopPropagation();
    },
    render: function () {
        var attributes, _this = this;
        var elArr = ElementStore.getDisplayFrameSelectedElement();
        if (elArr.length == 0) {
            return null;
        } else {
            attributes = elArr[0].attributes;
        }

        //console.log(attributes['item_animation'], "attr");


        var animationName = GlobalFunc.getAnimationName(attributes['item_animation']),
            animationVal = GlobalFunc.getAnimationTimeArr(attributes['item_animation_val']),
            moreAnimation;
        var obj = animationVal.length > 0 ? animationVal[0] : animationVal;
        var height = document.body.clientHeight - 54 - 40;
        var isTimeLineOn = !!attributes["item_animation_script"];
        if (isTimeLineOn) {
            return (
                <div className="setting-container" style={{ height: height }}>
                    <div id="setting-animation-base">
                        <span className="clearTop"/>
                        <div className="setting-select">
                            <h1>时间轴</h1>
                            <select value={isTimeLineOn ? "on" : "off"} onChange={this._changeAnimateType}>
                                <option value="on">开启</option>
                                <option value="off">关闭</option>
                            </select>
                        </div>
                        <NewRange title="动画时间" change={this._changeDuration} value={obj.duration}
                            defaultValue={1} max={10} min={0.1} step={0.1} isJSON={true}/>

                        <NewRange title="延迟时间" value={obj.delay} change={this._changeDelay}
                            defaultValue={0} max={20} min={0} step={0.1} isJSON={true}/>

                        <div className="setting-select">
                            <h1>动画次数</h1>
                            <select value={obj.infinite} onChange={this._changeAnimateInfinite}>
                                <option value="1">1次</option>
                                <option value="2">2次</option>
                                <option value="3">3次</option>
                                <option value="4">4次</option>
                                <option value="5">5次</option>
                                <option value="infinite">永久循环</option>
                            </select>
                        </div>
                    </div>
                </div>
            );
        }
        moreAnimation = animationName.map((name, index) => {

            var obj = animationVal.length > index ? animationVal[index] : { duration: 1, delay: 0.1, infinite: "1", type: "in" };
            obj.name = name;

            return (
                <div key={index} >
                    <header  draggable="true"  onClick={_this._headerClick.bind(_this, index) } data-id={index}>
                        <span  draggable="false" onDragStart={this.stop}  onClick={this.stopPropagation} onDoubleClick={this.editName.bind(this, index) } title="双击进入编辑">{!!obj.custom_name ? obj.custom_name : '动画'}</span>
                        <b id={"typeStyle" + index} className={_this.state.selectBlock == index ? "show" : "hide"}/>
                        { <b className="del-event" onClick={_this.confirmDelAnimation.bind(_this, index) }/> }
                    </header>

                    <div id={"setting-animation-" + index}
                        style={{ height: _this.state.selectBlock == index ? height - animationName.length * 40 - 32 : 0 }}
                        className="setting-animation-block">
                        <span className="clearTop"/>

                        <AnimateSelect data={obj} rangeChange={this.rangeChange.bind(this, index) } nameChange={this.nameChange.bind(this, index) }/>

                    </div>
                </div>
            )
        });


        var timelineSwitch;
        if (this.state.showTimelineSwitch) {
            timelineSwitch = <div className="setting-select">
                <span className="clearTop"/>
                <h1>时间轴</h1>
                <select value={isTimeLineOn ? "on" : "off"} onChange={this._changeAnimateType}>
                    <option value="on">开启</option>
                    <option value="off">关闭</option>
                </select>
            </div>;
        } else {
            timelineSwitch = null;
        }
        timelineSwitch = null;
        return (
            <div className="setting-container" ref="draggablePanel" style={{ height: height }} onDragStart={this.dragStart} onDragOver={this.dragOver}
                onDragEnd={this.dragEnd}>
                <div className="drop-target"></div>
                <div className="setting-animation-add" onClick={this._addAnimation}>
                    <span>添加动画</span>
                </div>

                {timelineSwitch}
                {moreAnimation}

            </div>);

    },
    dragStart: function (event) {
        if (event.target.id == "in-place-input") {
            return;
        }
        event.dataTransfer.effectAllowed = "move";
        console.log(event.target.dataset.id)
        dragInfo.srcID = parseInt(event.target.dataset.id);


        // this.setState({pagelistTop: $("#page-list").offset().top});
        //document.addEventListener("drop", this.drop);
    },
    dragOver: function (event) {
        if (typeof dragInfo.srcID == "undefined") {
            return;
        }
        dragInfo.canDrop = false;
        var node = event.target;
        var targetID = node.dataset.id;
        if (typeof targetID == "undefined") {
            return;
        }
        if (dragInfo.srcID == targetID) {
            return;
        }
        var next = false
        if (event.pageY > $(node).offset().top + $(node).height() / 2) {
            next = true;
            targetID = 1 + parseInt(targetID)
        }
        if (dragInfo.srcID == targetID) {
            return;
        }
        dragInfo.targetID = parseInt(targetID);
        var top = next ? $(node).offset().top - 55 + $(node).height() : $(node).offset().top - 55
        $(".drop-target", $(this.refs.draggablePanel)).css({
            top: top,
            display: "block"
        });
        event.dataTransfer.dropEffect = "move";
        event.preventDefault();
    },
    dragEnd: function () {
        if (typeof dragInfo.srcID == "undefined") {
            return;
        }
        $("#drop-target").hide();
        $(".drop-target", $(this.refs.draggablePanel)).css({
            display: "none"
        });
        var animationName = GlobalFunc.getAnimationName(this.props.attributes['item_animation']),
            animationVal = GlobalFunc.getAnimationTimeArr(this.props.attributes['item_animation_val']);
        var srcID = dragInfo.srcID, targetID = dragInfo.targetID;
        dragArr(animationName, srcID, targetID);
        dragArr(animationVal, srcID, targetID);
        function dragArr(arr, srcID, targetID) {
            var obj;
            if (srcID > targetID) {
                //从后往前放
                obj = arr.splice(srcID, 1);
                arr.splice(targetID, 0, obj[0])
            } else {
                //从前往后放
                obj = arr.splice(srcID, 1);
                arr.splice(targetID - 1, 0, obj[0])
            }
        }
        MakeActionCreators.updateElement({
            item_animation: JSON.stringify(animationName),
            item_animation_val: JSON.stringify(animationVal)
        });
        // if (dragInfo.canDrop) {
        //     MakeActionCreators.dragNode({src: dragInfo.srcID, dst: dragInfo.targetID})
        // }
        dragInfo.srcID = dragInfo.targetID = undefined;
    },
    _changeAnimateType: function (event) {
        if (event.target.value == "on") {
            MakeActionCreators.updateElement({ item_animation_script: ' ', item_animation_frame: "{}" });
        } else if (event.target.value == "off") {
            MakeActionCreators.updateElement({ item_animation_script: "", item_animation_frame: "" });
        }
    }
    ,
    _changeDuration: function (value, type) {
        var attributes = ElementStore.getDisplayFrameSelectedElement()[0].attributes;
        var animationObj = GlobalFunc.getAnimationTimeArr(attributes["item_animation_val"]);
        if (animationObj.length > 0) {
            animationObj[0].duration = value;
        }
        if (type) {
            MakeActionCreators.updateElement({ item_animation_val: JSON.stringify(animationObj) }, undefined, { type: type });
        } else {
            MakeActionCreators.updateElement({ item_animation_val: JSON.stringify(animationObj) });
        }
    },

    _headerClick: function (index) {
        var newIndex = this.state.selectBlock == index ? -1 : index
        this.setState({
            selectBlock: newIndex
        });
        //$("div[id^='setting-animation-']").slideUp();
        //$("#setting-animation-" + index).slideDown();
    }
    ,
    _changeDelay: function (value, type) {
        var attributes = ElementStore.getDisplayFrameSelectedElement()[0].attributes;
        var animationObj = GlobalFunc.getAnimationTimeArr(attributes["item_animation_val"]);
        if (animationObj.length > 0) {
            animationObj[0].delay = value;
        }
        if (type) {
            MakeActionCreators.updateElement({ item_animation_val: JSON.stringify(animationObj) }, undefined, { type: type });
        } else {
            MakeActionCreators.updateElement({ item_animation_val: JSON.stringify(animationObj) });
        }

    },

    _addAnimation: function () {

        var newAnimationName = this.state.animationName,
            newAnimationVal = this.state.animationVal,
            _this = this;

        newAnimationName.push("none");
        newAnimationVal.push({ duration: 1, delay: 0, infinite: "1", type: "in" });
        var showIndex = this.state.selectBlock;
        this.setState({ selectBlock: newAnimationName.length - 1 })

        this.setState({

            animationName: newAnimationName,
            animationVal: newAnimationVal
        });

        MakeActionCreators.updateElement({
            item_animation: JSON.stringify(newAnimationName),
            item_animation_val: JSON.stringify(newAnimationVal)
        });

    },
    confirmDelAnimation: function (index, event) {
        var _this = this;
        event.stopPropagation();
        DialogAction.show("tips", "", {
            contentText: "是否删除该动画设置",
            onConfirm: function () {
                _this._delAnimation(index);
                DialogAction.hide();
            }
        });
    }
    ,

    _delAnimation: function (index) {
        var newAnimationName = this.state.animationName,
            newAnimationVal = this.state.animationVal,
            _this = this;
        newAnimationName.splice(index, 1);
        newAnimationVal.splice(index, 1);
        //var showIndex = this.state.selectBlock;
        //if (index<=showIndex) {
        //    this.setState({selectBlock: showIndex - 1})
        //}
        //this.setState({
        //    animationName: newAnimationName,
        //    animationVal : newAnimationVal
        //});


        MakeActionCreators.updateElement({
            item_animation: JSON.stringify(newAnimationName),
            item_animation_val: JSON.stringify(newAnimationVal)
        });

    }
    ,

    _changeAnimate: function (index, event) {

        var animationName = this.state.animationName, _this = this;

        animationName[index] = event.currentTarget.dataset.type;

        MakeActionCreators.updateElement({ item_animation: JSON.stringify(animationName) });

    }
    ,

    _changeValue: function (type, index, value) {
        this._changeValueState(type, index, value);
        var animationVal = JSON.stringify(this.state.animationVal);
        if (!!value.target) {
            MakeActionCreators.updateElement({ item_animation_val: animationVal });
        } else {
            MakeActionCreators.updateElement({ item_animation_val: animationVal }, undefined, { type: "range" });
        }
    }
    ,

    _changeValueState: function (type, index, value) {
        var animationVal = this.state.animationVal;
        if (!!value.target) value = parseFloat(value.target.value);
        switch (type) {
            case "duration":
                if (!value) value = 1;
                if (value > 10) value = 10;
                if (value < 0.1) value = 0.1;
                break;
            case "delay":
                if (!value) value = 0;
                if (value > 10) value = 10;
                if (value < 0) value = 0;
                break;
        }
        if (!animationVal[index]) {
            animationVal[index] = { duration: 1, delay: 0, infinite: "1", type: "in" };
        }
        animationVal[index][type] = parseFloat(value);
        this.setState({
            animationVal: animationVal
        });
    }
    ,

    _hoverAnimate: function (event) {

        var type = event.currentTarget.dataset.type;
        var dom = event.currentTarget;
        $(dom).children("img").addClass(type + " animated");

    }
    ,

    _leaveAnimate: function (event) {

        clearTimeout(this.t);
        var type = event.currentTarget.dataset.type;
        $(event.currentTarget).children("img").removeClass(type + " animated");

    }
    ,
    _changeSelectType: function (index, event) {
        var value = event.target.value;
        var arr = this.state.selectType;
        arr[index] = value
        this.setState({
            selectType: arr
        })
    }

}
)
    ;

module.exports = AnimationTab;