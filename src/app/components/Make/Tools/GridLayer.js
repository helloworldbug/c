/**
 * Created by 95 on 2015/8/4.
 */
var React = require('react');
var GridStore = require('../../../stores/GridStore');
var ElementStore = require('../../../stores/ElementStore');
var GridAction = require('../../../actions/GridAction');
var Constants = require("../../../constants/MeConstants");
var Defaults = Constants.Defaults;
var canObj = null;
var timeId = undefined;
var PHONEWIDTH = Defaults.PHONEWIDTH;
var PHONEHIGHT = Defaults.PHONEHIGHT;
module.exports = React.createClass({
    getInitialState  : function () {
        return GridStore.getStore();
    },
    _itemMove        : function () {
        var data = GridStore.getReferenceData();

        this.setState({references: data})
    },
    updateState:function(){
        this.setState(GridStore.getStore());
    },
    componentDidMount: function () {
        GridStore.addReferenceListener(this._itemMove);
        GridStore.addChangeListener(this.updateState);

    },

    componentWillUnmount: function () {
        GridStore.removeReferenceListener(this._itemMove);
    GridStore.removeChangeListener(this.updateState);
    },
    componentDidUpdate  : function () {

    },
    render              : function () {

        return <div id="gridLayer">
            <GridCell num={this.state.gridNum} color={this.state.gridColor}
                      isShow={this.state.showGrid&&this.state.isMouseMove}></GridCell>
            <GridReference references={this.state.references}></GridReference>
        </div>
    }
});
var GridCell = React.createClass({


    render: function () {
        var cw = PHONEWIDTH / (this.props.num + 1);
        var ax = cw, item = [];
        var key=0;
        if (this.props.isShow) {
            while (ax < PHONEWIDTH) {
                var style = {left: parseInt(ax), backgroundColor: this.props.color};
                item.push(<div key={key++} className="axisy" style={style}></div>);

                ax += cw;
            }
            ax = cw;
            while (ax < PHONEHIGHT) {
                var style = {top: parseInt(ax), backgroundColor: this.props.color};
                item.push(<div  key={key++} className="axisx" style={style}></div>);
                ax += cw;
            }
        }
        return <div id="gridCell">{item}</div>
    }

});

var GridReference = React.createClass({
    render: function () {
        if (this.props.references == undefined)return null;
        var key=0;
        var rows = this.props.references.rows.map(function (val) {
            var styleObj = {top: val.line}
            return <div key={key++} className="row" style={styleObj}></div>

        })
        var cols = this.props.references.cols.map(function (val) {
            var styleObj = {left: val.line}
            return <div key={key++}  className="col" style={styleObj}></div>

        })
        return <div id="highlight">
            {rows}
            {cols}
        </div>
    }
})