/*
 * Created by 95 on 2015/8/3.
 */

var React = require('react');
var ReactDOM = require("react-dom");
var ElementStore = require('../../../stores/ElementStore');
var PageStore = require('../../../stores/PageStore');
var GlobalFunc = require("../../Common/GlobalFunc");
var DialogActionCreator = require("../../../actions/DialogActionCreator");
var MakeActionCreators = require('../../../actions/MakeActionCreators');
var GridStore = require('../../../stores/GridStore');
var GridActions = require('../../../actions/GridAction');
var UndoStore = require('../../../stores/UndoStore');
var UndoAction = require('../../../actions/UndoAction');
var ClipBoard = require('../../../utils/Clipboard.util');
var panelClick = false;
var CommonTool = React.createClass({

    elChange         : function () {
        this.forceUpdate();
    },

    getInitialState: function () {
        return GridStore.getStore();
    },

    closeGridPanel: function () {
        if (this.state.showGridPanel && !panelClick) {
            GridActions.togglePanel(!this.state.showGridPanel);
        }
        if (!panelClick) {
            document.removeEventListener("click", this.closeGridPanel);
            document.removeEventListener("click", this.capture, true);
        }

    },

    capture: function () {
        panelClick = false;
    },

    handleGridBtnClick: function (e) {
        GlobalFunc.clickAnimation(e);
        var isShow = this.state.showGridPanel;
        GridActions.togglePanel(!this.state.showGridPanel);
        if (!isShow) {
            document.addEventListener("click", this.closeGridPanel);
            document.addEventListener("click", this.capture, true);
        }
        //this.setState({showGridPanel:!this.state.showGridPanel})
    },

    _handleGridPanelClick: function (name, value) {
        switch (name) {
            case "showGrid":
                if ("on" == value) {
                    GridActions.toggleGrid(true);
                } else {
                    GridActions.toggleGrid(false);
                }
                break;
            case "gridNum":
                var gridNum = $('.gridNum', ReactDOM.findDOMNode(this)).val();
                gridNum = parseInt(gridNum);

                if (gridNum < 0)gridNum = 0;
                if (gridNum > 30)gridNum = 30;
                if (isNaN(gridNum))gridNum = "";
                GridActions.changeWidth(gridNum);
                break;
            case "gridReference":
                if ("on" == value) {
                    GridActions.toggleReference(true);
                } else {
                    GridActions.toggleReference(false);
                }
                break;
            case "gridAdsorption":
                if ("on" == value) {
                    GridActions.toggleAdsorption(true);
                } else {
                    GridActions.toggleAdsorption(false);
                }
                break;
        }
    },

    _update: function () {
        this.setState(GridStore.getStore());
    },

    componentDidMount: function () {
        GridStore.addChangeListener(this._update);
        ElementStore.addChangeListener(this._update)

    },

    componentDidUpdate: function () {
        $('#gridColor').spectrum({
            showAlpha        : true,
            color            : this.state.gridColor,
            showInput        : true,
            showButtons      : false,
            preferredFormat  : "rgb",
            replacerClassName: 'noDrop',
            change           : function (color) {
                //console.log(color.toRgbString());
                GridActions.changeColor(color.toRgbString());
            }
        });
    },

    componentWillUnmount: function () {
        GridStore.removeChangeListener(this._update);
        ElementStore.removeChangeListener(this._update)
    },


    colseGrid: function () {
        document.removeEventListener("click", this.closeGridPanel);
        document.removeEventListener("click", this.capture, true);
        GridActions.togglePanel(false);
    },



    zoomIn: function(e){
        GlobalFunc.clickAnimation(e);
        if (GlobalFunc.canZoomIn()) {
            GlobalFunc.setDeviceZoom("in");
            ElementStore.emitChange();
            var scale = GlobalFunc.getDeviceScale();
            GlobalFunc.addSmallTips(parseInt(scale * 100) + "%", 0.3, {delBackGround: true, margin: "0 0 0 -60px"})
        }
    },

    zoomOut: function(e){
        GlobalFunc.clickAnimation(e);
        if (GlobalFunc.canZoomOut()) {
            GlobalFunc.setDeviceZoom("out");
            ElementStore.emitChange();
            var scale = GlobalFunc.getDeviceScale();
            GlobalFunc.addSmallTips(parseInt(scale * 100) + "%", 0.3, {delBackGround: true, margin: "0 0 0 -60px"})
        }
    },
    stoppropagation: function () {
        panelClick = true;
    },
    render: function () {
        var panel;
        var gridPressed = this.state.showGrid ? "toggle turnOn" : "toggle turnOff";
        var referencePressed = this.state.showReference ? "toggle turnOn" : "toggle turnOff";
        var adsorptionPressed = this.state.adsorption ? "toggle turnOn" : "toggle turnOff";

        if (this.state.showGridPanel) {
            panel = <ul className="gridPanel" onClick={this.stoppropagation}>
                <li className="groupLine first">
                    <span className="label"> 显示网格</span>
                    <span className={gridPressed}>
                        <span className="off" onClick={this._handleGridPanelClick.bind(this,"showGrid","off")}>关</span>
                        <span className="on" onClick={this._handleGridPanelClick.bind(this,"showGrid","on")}>开</span>
                    </span>
                </li>
                <li className="groupLine">
                    <span className="label"> 智能参考</span>
                    <span className={referencePressed}>
                        <span className="off"
                              onClick={this._handleGridPanelClick.bind(this,"gridReference","off")}>关</span>
                        <span className="on"
                              onClick={this._handleGridPanelClick.bind(this,"gridReference","on")}>开</span>
                    </span>
                </li>
                <li className="groupLine">
                    <span className="label"> 吸附效果</span>
                    <span className={adsorptionPressed}>
                        <span className="off"
                              onClick={this._handleGridPanelClick.bind(this,"gridAdsorption","off")}>关</span>
                        <span className="on"
                              onClick={this._handleGridPanelClick.bind(this,"gridAdsorption","on")}>开</span>
                    </span>
                </li>
                <li className="groupLine">
                    <span className="label"> 网格数量</span>
                    <input type="text" className='gridNum'
                           onChange={this._handleGridPanelClick.bind(this,"gridNum")}
                           value={this.state.gridNum}/>
                </li>
                <li className="groupLine">
                    <span className="label"> 网格颜色</span>
                    <input type="text" id='gridColor'/>
                </li>
            </ul>;
        }
        var gridBtnPressed = "toolBtn grid ";
        gridBtnPressed += this.state.showGridPanel ? "turnOn" : "turnOff";

        var cls = "toolBtn ";
        return (<ul className="right-tools">

            <div className="right">
                <li className={gridBtnPressed} onClick={this.handleGridBtnClick}>
                    <span className="fadeInLeft animated">智能网格</span>
                </li>
                <li className={cls +(GlobalFunc.canZoomIn()?"device_zoomIn":"device_zoomIn dis")} onClick={this.zoomIn}>
                <span className="fadeInLeft animated">放大</span>
                    </li>
                    <li className={cls +(GlobalFunc.canZoomOut()?"device_zoomOut":"device_zoomOut dis")} onClick={this.zoomOut}>
                <span className="fadeInLeft animated">缩小</span>
                </li>
            </div>
            {panel}
        </ul>)
    }

});


module.exports = CommonTool;