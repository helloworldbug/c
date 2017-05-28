/*
 * Created by 95 on 2015/8/3.
 */

var React = require('react');
var startMousePos = {};



module.exports = React.createClass({

    getInitialState: function () {
        return {
            close : false,
            colNum: 1,
            top   : 0,
            left  : 0
        }
    },
    componentDidMount(){

    },
    onClick: function () {
        this.setState({
            close: !this.state.close
        });
    },

    toggleCol: function () {
        this.setState({
            colNum: this.state.colNum == 1 ? 2 : 1
        });

    },

    onMouseDown: function (e) {

        //debugger;
        startMousePos = {top: e.pageY, left: e.pageX};
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp)
    },

    onMouseMove: function (e) {

        var curPos = {top: e.pageY, left: e.pageX};
        if(curPos.top<80||curPos.top>(document.body.offsetHeight-10)){
            return
        }
        if(curPos.left<40||curPos.left>(document.body.offsetWidth-40)){
            return
        }
        var dPos = {dtop: curPos.top - startMousePos.top, dleft: curPos.left - startMousePos.left};
        var top = this.state.top + (dPos.dtop) , left = this.state.left + (dPos.dleft) ;

        this.setState({top: top, left: left});
        startMousePos = curPos;
    },

    onMouseUp: function (e) {
        console.log(e);
        document.removeEventListener('mousemove', this.onMouseMove)
        document.removeEventListener('mouseup', this.onMouseUp);

    },

    render: function () {

        var pos = {top: this.state.top, left: this.state.left};
        var toolContainer = (this.state.colNum == 1) ? "singleCol" : "doubleCol";
        toolContainer += " " + (this.state.close ? "closedTool" : "openedTool");
        toolContainer+=" toolContainer";
        var toolWrapperShow = {
            position: "absolute",
            top     : this.state.top,
            left    : this.state.left
        };
        var rightAlign = {
            position: "absolute",
            top     : 0
        }
        if(this.props.expandDirection=="left"){
            rightAlign.right=40;
        }

        toolWrapperShow.display = "block";

        return (<div  className='miniTool'>


            <div style={toolWrapperShow}>
                <div style={rightAlign}>
                    <div className={toolContainer} >
                        <div className="title" onMouseDown={this.onMouseDown}><span onClick={this.toggleCol}
                                                                                    className="toggleCol"></span> <span
                            onClick={this.onClick} className="closePanel"></span></div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        </div>)

    }
});