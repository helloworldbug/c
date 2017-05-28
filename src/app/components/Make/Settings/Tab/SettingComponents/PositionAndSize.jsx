var React = require('react');
var MakeActionCreators = require('../../../../../actions/MakeActionCreators');
var GlobalFunc = require("../../../../Common/GlobalFunc.js");
var Constans = require("../../../../../constants/MeConstants");

var PositionAndSize = React.createClass({

    render: function () {
        var attributes = this.props.attributes;
        var w = Math.round(attributes["item_width"] * attributes["x_scale"]) || 0;
        var h = Math.round(attributes["item_height"] * attributes["y_scale"]) || 0
        return (
            <div>
                <div className={ !!this.props.hideChangeSize ? "hide" : "setting-number"}>
                    <h1>尺寸</h1>

                    <div>
                        <span>W</span>
                        <input type="text"
                               value={w}
                               onChange={this.changeDim.bind(this,"item_width","x_scale")}/>
                    </div>
                    <div className="fr right">
                        <span>H</span>
                        <input type="text"
                               value={h}
                               onChange={this.changeDim.bind(this,"item_height","y_scale")}/>
                    </div>
                </div>
                <div className={!!this.props.hideChangePosition ? "hide" : "setting-number"}>
                    <h1>位置</h1>

                    <div>
                        <span>X</span>
                        <input type="text" value={Math.round(attributes["item_left"])||0}
                               onChange={this.changePos.bind(this,"item_left")}/>
                    </div>
                    <div className="fr right">
                        <span>Y</span>
                        <input type="text" value={Math.round(attributes["item_top"])||0}
                               onChange={this.changePos.bind(this,"item_top")}/>
                    </div>
                </div>
            </div>
        );
    },
    changeDim: function (name, scaleName, event) {
        ///改变大小，如果不能改变大小就不改变
        if (event.target.value == 0||isNaN(event.target.value)) return;
        var attributes = this.props.attributes;
        if(name=="item_height"){
            if(!GlobalFunc.canChangeHeight(attributes["item_type"])){
                return
            }
        }
        if(parseInt(event.target.value)>Constans.Defaults.MAXINPUT||parseInt(event.target.value)<1){
            return;
        }
        if (GlobalFunc.ifScale(attributes)) {
            var oriDim = (Math.round(attributes[name] * attributes[scaleName]) || 0) / attributes[scaleName];
            var newScale = event.target.value / oriDim;
            MakeActionCreators.updateElement({[scaleName]: newScale});
        } else {
            MakeActionCreators.updateElement({[name]: event.target.value / attributes[scaleName]});
        }
    },
    changePos: function (name, event) {
        if (isNaN(event.target.value)) return;
        if(parseInt(event.target.value)>Constans.Defaults.MAXINPUT||parseInt(event.target.value)<Constans.Defaults.MININPUT){
            return;
        }
        MakeActionCreators.updateElement({[name]: Math.round(event.target.value)});
    },
});

module.exports = PositionAndSize;