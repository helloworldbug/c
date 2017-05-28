/*
 * Created by 95 on 2015/8/3.
 */

var React = require('react');
import {findDOMNode} from 'react-dom';
var GlobalFunc = require('../../Common/GlobalFunc');
var $ = require('jquery');
var _ = require('lodash');
var TOOLDIFF = 4;

module.exports = React.createClass({


    getInitialState  : function () {
        var lastPos = GlobalFunc.getLocalStorageObject("dragToolPos");


        return {
            top   : lastPos.top || 0,
            right : lastPos.right || (300 + TOOLDIFF),
            height: lastPos.height || "100%"
        }
    },
    componentDidMount: function () {
        if (this.state.right == 304) {
            $("#device-scroll").css("right", "347px")
        } else {
            $("#device-scroll").css("right", "301px")
        }
        var device = document.getElementById("device-box");
        var lastPos = {right: this.state.right, top: this.state.top}
        if (device) {
            this.clientWidth = document.body.clientWidth;
            ///上次缩小了后再刷新，如果在手机上，靠到手机两边
            var deviceOffset = $('#device-content').offset();
            deviceOffset.top = deviceOffset.top - $('.header').height() + device.scrollTop;
            deviceOffset.width = 640 * GlobalFunc.getDeviceScale();

            var deviceLeft = this.clientWidth - deviceOffset.left + TOOLDIFF;
            var deviceRight = this.clientWidth - deviceOffset.left - deviceOffset.width - 40 - TOOLDIFF;
            if (lastPos.right > deviceLeft - deviceOffset.width / 2 && lastPos.right < deviceLeft) {
                //device 左
                lastPos.right = deviceLeft;
                lastPos.top = deviceOffset.top;
            } else if (lastPos.right < deviceLeft - deviceOffset.width / 2 && lastPos.right > deviceRight) {
                //device 右
                lastPos.right = deviceRight;
                lastPos.top = deviceOffset.top;
            }
            this.setState({right: lastPos.right, top: lastPos.top})
        }
    },
    onMouseDown      : function (event) {
        console.log("mousedown");
        this.lastX = event.clientX;
        this.lastY = event.clientY;
        var device = document.getElementById("device-box");
        var deviceOffset = $('#device-content').offset();
        deviceOffset.top = deviceOffset.top - $('.header').height() + device.scrollTop;

        deviceOffset.width = 640 * GlobalFunc.getDeviceScale();
        this.deviceOffset = deviceOffset;
        this.toolHeight = $('.toolPanel', findDOMNode(this.refs.dragTool)).height() + 40;

        this.clientWidth = document.body.clientWidth;
        if (event.target.className != "tool-head") {
            event.preventDefault();
            return;
        }
        //document.onmouseover=this.onMouseOver

        document.addEventListener("mousemove", this.onMouseMove, true);
        document.addEventListener("mouseup", this.onMouseUp, true);

    },
    moveEl           : function (mouseLeft, mouseTop) {
        var diffRight = mouseLeft - this.lastX;
        var diffTop = mouseTop - this.lastY;
        this.lastX = mouseLeft;
        this.lastY = mouseTop;
        var showDock = false;
        var dockLeft = false;
        var dock = {};
        var DOffset = this.deviceOffset;
        var right = this.clientWidth - mouseLeft;
        if (right < (301 + 40)) {
            //右边
            dock.top = 0;
            dock.right = 300 + TOOLDIFF;
            dock.height = "100%";
            showDock = true;
        } else if (mouseLeft < (300 + 40)) {
            //左边
            dock.right = this.clientWidth - 300 - 40 - TOOLDIFF;
            dock.top = 0;
            dock.height = "100%";
            showDock = true;
            dockLeft = true;
        } else if (mouseLeft < DOffset.left + DOffset.width / 2 && mouseLeft > DOffset.left - 40) {
            //device 左
            dock.right = this.clientWidth - DOffset.left + TOOLDIFF;
            dock.top = DOffset.top;
            dock.height = this.toolHeight + "px";
            showDock = true;
        } else if (mouseLeft > DOffset.left + DOffset.width / 2 && mouseLeft < DOffset.left + DOffset.width + 40) {
            //device 右
            dock.right = this.clientWidth - DOffset.left - DOffset.width - 40 - TOOLDIFF;
            dock.top = DOffset.top;
            dock.height = this.toolHeight + "px";
            showDock = true;
            dockLeft = true;
        } else {
            dock.right = this.state.right - diffRight;
            dock.top = this.state.top + diffTop;
            dock.height = this.toolHeight + "px";
        }
        this.setState({
            right     : this.state.right - diffRight,
            top       : this.state.top + diffTop,
            height    : this.toolHeight + "px",
            dockRight : dock.right,
            dockTop   : dock.top,
            dockHeight: dock.height,
            showDock  : showDock,
            dockLeft  : dockLeft
        })
    },
    onMouseMove      : function (event) {
        console.log("onMouseMove");
        if (event.clientY < 60) {
            return;
        }
        //this.moveEl(event.clientX, event.clientY);
        _.throttle(this.moveEl.bind(this,event.clientX,event.clientY), 10)()
    },

    onMouseUp: function () {
        document.removeEventListener("mouseup", this.onMouseUp, true);
        document.onmouseover=function (){}
        document.removeEventListener("mousemove", this.onMouseMove, true);
        if (this.state.right != this.state.dockRight) {
            this.setState({
                right   : this.state.dockRight,
                top     : this.state.dockTop,
                height  : this.state.dockHeight,
                showDock: false
            })
        }

        GlobalFunc.setLocalStorageObject("dragToolPos", {
            top   : this.state.dockTop,
            right : this.state.dockRight,
            height: this.state.dockHeight == "100%" ? "100%" : "auto"
        })
        if (this.state.right == 304) {
            $("#device-scroll").css("right", "347px")
        } else {
            $("#device-scroll").css("right", "301px")
        }
    },
    render   : function () {
        if (this.state.right == 304) {
            $("#device-scroll").css("right")
        }
        var style = {
            right : `${this.state.right}px`,
            top   : `${this.state.top}px`,
            height: this.state.height || "100%"
        }
        var dockRigth = this.state.dockLeft ? this.state.dockRight + 35 : this.state.dockRight;
        var dockStyle = {
            right  : `${dockRigth}px`,
            top    : `${this.state.dockTop}px`,
            height : this.state.dockHeight,
            display: this.state.showDock ? "block" : "none"
        }
        return (<div>
            <div className="dock-tool" style={dockStyle}></div>
            <div className='tools-box' style={style} ref="dragTool">
                <div className="tool-head" onMouseDown={this.onMouseDown}></div>
                {this.props.children}
            </div>

        </div>)

    }
});