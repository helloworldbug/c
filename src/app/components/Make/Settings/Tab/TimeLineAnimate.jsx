/**
 * @component ImageEditTab
 * @description 图片元素编辑设置
 * @time 2015-09-17 10:29
 * @author Nick
 **/

var React = require('react');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var GlobalFunc = require("../../../Common/GlobalFunc.js");
var TimelineStore = require('../../../../stores/TimelineStore');

var defaultDuration = 1, maxDuration = 10, minDuration = 0;
var defaultDelay = 0.3, maxDelay = 20, minDelay = 0;
var TimeLineAnimate = React.createClass({
    getInitialState: function () {
        var attributes = this.props.attributes;
        var timeObj = JSON.parse(attributes['item_animation_frame']);
        var timePointsArr = [];
        for (var timePoint in timeObj) {
            timePointsArr.push({time: timePoint, value: timeObj[timePoint]})
        }
        var animateTime = GlobalFunc.getAnimationTimeArr(attributes['item_animation_val'])[0];
        var numbers = [];
        for (var i = 0; i < animateTime.duration; i++) {
            numbers.push(<li style={{left:i*100}}>{i.toFixed(2)}</li>)
        }
        numbers.push(<li style={{left:(animateTime.duration)*100}}>{parseFloat(animateTime.duration).toFixed(2)}</li>)
        return {
            isClosed     : false,//是否展开
            cursor       : 0,///游标位置
            cursorInput:0,///有焦点元素对应的时间
            duration     : animateTime.duration,//动画时间
            delay        : animateTime.delay,//动画延迟
            focus        : this.getFocusIndex(TimelineStore.getFocus(), timePointsArr),///有焦点的元素cursor,none或关键帧的下标
            timePointsArr: timePointsArr, //关键帧组成的数组
            numbers      : numbers ///标尺上的刻度
        }
    },

    componentWillReceiveProps    : function (nextProps) {
        var timeObj = JSON.parse(nextProps.attributes['item_animation_frame']);
        var animateTime =  GlobalFunc.getAnimationTimeArr(nextProps.attributes['item_animation_val'])[0];
        var timePointsArr = [];
        for (var timePoint in timeObj) {
            timePointsArr.push({time: timePoint, value: timeObj[timePoint]})
        }
        var numbers = [];
        for (var i = 0; i < animateTime.duration; i++) {
            numbers.push(<li style={{left:i*100}}>{i.toFixed(2)}</li>)
        }
        numbers.push(<li style={{left:(animateTime.duration)*100}}>{parseFloat(animateTime.duration).toFixed(2)}</li>)
        this.setState({
            timePointsArr: timePointsArr,
            duration     : animateTime.duration,
            delay        : animateTime.delay,
            focus        : this.getFocusIndex(TimelineStore.getFocus(), timePointsArr),
            numbers      : numbers
        });
    },
    resetTimelineState           : function () {
        var timeObj = JSON.parse(this.props.attributes['item_animation_frame']);
        var timePointsArr = [];
        for (var timePoint in timeObj) {
            timePointsArr.push({time: timePoint, value: timeObj[timePoint]})
        }
        this.setState({
            focus        : this.getFocusIndex(TimelineStore.getFocus(), timePointsArr),
            timePointsArr: timePointsArr
        })
    },
    componentDidMount            : function () {
        TimelineStore.addChangeListener(this.resetTimelineState)
    },
    componentWillUnmount         : function () {
        TimelineStore.removeChangeListener(this.resetTimelineState)
    },
    render                  : function () {

        var leftSide = 180;
        var rightSide = 300;
        var width = document.body.clientWidth - leftSide - rightSide;
        var style = {
            width: width,
            right: rightSide
        }
        var frame_points = [], timePointsArr = this.state.timePointsArr;
        for (var i = 0; i < timePointsArr.length; i++) {
            var timpPoint = timePointsArr[i]
            frame_points.push(<li style={{left:timpPoint.time/10}}
                                  className={i==this.state.focus?"point selected":"point"}
                                  onMouseDown={this.framePointPressed.bind(this,i)}></li>)
        }
        return (
            <div className={this.state.isClosed?"timeline-animate closed":"timeline-animate"} style={style}>
                <div className="bar">
                    <div className="left">
                        <span className="title">时间轴</span>
                        <button className="add-frame" onClick={this.addFrame}>添加帧</button>
                        <button className="remove-frame" onClick={this.removeFrame}>删除帧</button>
                    </div>
                    <div className="right">
                        <span>动画时间</span><input type="number" max={10} min={0.1} step={0.1}
                                                className="duration" value={this.state.duration}
                                                onChange={this.changeStateAnimateTimeOrDelay.bind(this,"duration")}
                                                onBlur={this.changeAnimateTimeOrDelay.bind(this,"duration")}
                                                onKeyDown={this.keydownTimeOrDelay.bind(this,"duration")}/><span>延迟时间</span><input
                        type="number" className="delay" value={this.state.delay} defaultValue={0.3} max={20} min={0}
                        step={0.1}
                        onChange={this.changeStateAnimateTimeOrDelay.bind(this,"delay")}
                        onBlur={this.changeAnimateTimeOrDelay.bind(this,"delay")}
                        onKeyDown={this.keydownTimeOrDelay.bind(this,"delay")}/><input
                        type="number" className="frame-time" max={this.state.duration} min={0} step={0.1}
                        value={this.state.cursorInput}
                        onChange={this.changeCursorInput}
                        onBlur={this.blurCursorInput}
                        onKeyDown={this.keydownCursorInput}
                    /><span
                        className="spread-wrapper" onClick={this.toggleTimeline}><span
                        className={this.state.isClosed?"closed":""}></span></span>
                    </div>
                </div>
                <div className="timeline">
                    <div className="ruler-wrapper">
                        <div style={{width:(this.state.duration*100+20)}}>
                            <div className="ruler" style={{width:(this.state.duration*100+1)}}></div>
                        </div>
                        <ul className="ruler-number">
                            {this.state.numbers}
                        </ul>
                        <ul className="frame-points">
                            {frame_points}
                        </ul>
                        <div className="cursor-wrapper"> <span
                            className={this.state.focus=="cursor"?"timeline-cursor selected":"timeline-cursor"}
                            style={{left:this.state.cursor}}
                            onMouseDown={this.cursorPressed}></span></div>


                    </div>
                </div>
            </div>
        );
    },
    toggleTimeline               : function () {
        var isClosed = this.state.isClosed;
        this.setState({isClosed: !isClosed})
    },
    getFocusIndex                : function (focusInfo, timePointsArr) {
        var time = focusInfo.pos;
        if (isNaN(parseFloat(time))) {
            //cursor
            return time
        } else {
            for (var i = 0; i < timePointsArr.length; i++) {
                if (time == timePointsArr[i].time) {
                    return i;
                }
            }
        }

    },
    addFrame                     : function (event) {
        //添加帧
        //更新attributes["item_animation_script"],切换焦点
        if (this.state.focus != "cursor")return;
        var focus = this.state.cursor;
        MakeActionCreators.addTimelineFrame(focus * 10)
        MakeActionCreators.changeTimelineFocus({pos: focus * 10, id: this.props.attributes["item_uuid"]});


    },
    removeFrame                  : function (event) {
        //删除帧
        if (this.state.focus == "cursor" || this.state.focus == "none")return;
        var timePointsArr = this.state.timePointsArr;
        var time = timePointsArr[this.state.focus].time
        MakeActionCreators.removeTimelineFrame(time)
    },
    changeFrameCursor       : function (event) {
        var value = event.target.value;
        if (this.state.focus = "cursor") {
            if (value >= 0 && value <= this.state.duration)
                this.setState({cursor: value * 100})
        }
    },
    changeAnimateTimeOrDelay: function (name, event) {
        var value = event.target.value;
        this.changeAnimateTimeOrDelayAttr(name, value);
    },
    keydownTimeOrDelay      : function (name, event) {
        var keyCode = event.which, value = event.target.value;
        if (keyCode == 13) {
            this.changeAnimateTimeOrDelayAttr(name, value);
        }
    },
    keydownCursorInput      : function (event) {
        var keyCode = event.which, value = event.target.value;
        if (keyCode == 13) {
            this.changeCursor( value);

        }
    },
    blurCursorInput:function(event){
        var value = parseFloat(event.target.value);
        this.changeCursor(value);
    },
    changeCursor            :function(value){
        var tmpVal = parseFloat(value);
        if (!isNaN(tmpVal)) {
            if(this.state.focus=="cursor"){
                this.setState({cursor:tmpVal*100})
            }else{
                tmpVal=tmpVal*1000
                this.state.timePointsArr[this.state.focus].time = tmpVal;
                MakeActionCreators.changeTimelineFocus({
                    pos:tmpVal,
                    id : this.props.attributes["item_uuid"]
                });
                MakeActionCreators.updateElement({item_animation_frame: JSON.stringify(GlobalFunc.getTimeObjFromTimeArr(this.state.timePointsArr))})
            }
        }
    },
    changeAnimateTimeOrDelayAttr: function (name, value) {
        var tmpVal = parseFloat(value);
        if (isNaN(tmpVal)) {
            if (name == "duration") {
                tmpVal = defaultDuration
            } else {
                tmpVal = defaultDelay
            }
        } else {
            if (name == "duration") {
                if (tmpVal > maxDuration)tmpVal = maxDuration;
                if (tmpVal < minDuration)tmpVal = minDuration;
            } else {
                if (tmpVal > maxDelay)tmpVal = maxDelay;
                if (tmpVal < minDelay)tmpVal = minDelay;
            }
        }
        var attributes = this.props.attributes;
        var animateTime = GlobalFunc.getAnimationTimeArr(attributes['item_animation_val'])[0];
        if (name == "duration") {
            animateTime.duration = tmpVal
        } else {
            animateTime.delay = tmpVal
        }
        this.setState({[name]: tmpVal})
        MakeActionCreators.updateElement({item_animation_val: JSON.stringify(animateTime)})
    },
    changeStateAnimateTimeOrDelay: function (name, event) {
        this.setState({[name]: event.target.value})
    },
    changeCursorInput            : function (event) {
        this.setState({cursorInput: event.target.value})
    },
    framePointPressed            : function (index, event) {
        var timePointsArr = this.state.timePointsArr;
        var startTime = timePointsArr[index].time;
        var startX = event.pageX;
        var _this = this;
        MakeActionCreators.changeTimelineFocus({pos: startTime, id: this.props.attributes["item_uuid"]});
        document.addEventListener("mousemove", movePoint);
        document.addEventListener("mouseup", removePointHandle);
        function movePoint(event) {
            var x = event.pageX;
            var dx = x - startX;
            var targetTime = +startTime + dx * 10;
            if (targetTime < 0 || targetTime > _this.state.duration * 1000) {
                return;
            }
            timePointsArr[index].time = targetTime;
            _this.setState({timePointsArr: timePointsArr,cursorInput:targetTime/1000})

        }

        function removePointHandle() {
            var timePointsArr = _this.state.timePointsArr;
            _this.setState({timePointsArr: timePointsArr,cursorInput:timePointsArr[index].time/1000})
            MakeActionCreators.changeTimelineFocus({
                pos: timePointsArr[index].time,
                id : _this.props.attributes["item_uuid"]
            });
            MakeActionCreators.updateElement({item_animation_frame: JSON.stringify(GlobalFunc.getTimeObjFromTimeArr(timePointsArr))})
            document.removeEventListener("mousemove", movePoint);
            document.removeEventListener("mouseup", removePointHandle);
        }
    },
    cursorPressed                : function (event) {
        //鼠标按下时，添加移动游标的事件
        MakeActionCreators.changeTimelineFocus({pos: "cursor", id: this.props.attributes["item_uuid"]})
        var startX = event.pageX;
        var startCursor = this.state.cursor;
        var _this = this;
        document.addEventListener("mousemove", moveCursor);
        document.addEventListener("mouseup", removeCursorHandle);
        function moveCursor(event) {
            var x = event.pageX;
            var dx = x - startX;
            var targetCursor = +startCursor + dx;
            if (targetCursor < 0 || targetCursor > _this.state.duration * 100) {
                return;
            }

            _this.setState({cursor: targetCursor,cursorInput: targetCursor/100})
        }

        function removeCursorHandle() {
            document.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseup", removeCursorHandle);
        }

    }


});

module.exports = TimeLineAnimate;