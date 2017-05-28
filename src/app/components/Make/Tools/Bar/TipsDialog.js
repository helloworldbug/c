/*
 * Created by 95 on 2015/9/14.
 */
var React = require("react");
var DialogAction = require("../../../../actions/DialogActionCreator");
module.exports = React.createClass({

    componentDidMount: function () {
    },

    componentDidUpdate: function () {
        document.addEventListener("keydown", this.keyDownHandler);
    },

    render: function () {

        var btns;
        if (this.props.hideCancel || this.props.showCancel === false) {
            btns = <div className="btnBox middle">
                <button onClick={this.onConfirm}>确 定</button >
            </div>
        }
        else {
            btns = <div className="btnBox">
                <button onClick={this.onConfirm} className="left">确 定</button >
                <button onClick={this.closeDialog} className="right">取 消</button >
            </div>
        }
        return (
            <div className="select-dialog" onClick={this.closeDialog}>
                <div className="tipsDialog" onClick={this.dialogClick}>
                    <p>{this.props.contentText}{this.props.selector}{/*selector id="tips-selector"*/}</p>

                    {btns}
                </div>
            </div>
        )
    },

    onConfirm: function () {
        if (this.props.onConfirm) {
            if(this.props.selector){
                var value = $("#tips-selector").val();
                this.props.onConfirm(value);
            }else{
                this.props.onConfirm();
            }
        }
        DialogAction.hide();
    },

    dialogClick: function (e) {
        e.stopPropagation();
    },

    componentWillUnmount: function () {
        document.removeEventListener('keydown', this.keyDownHandler);
    },

    keyDownHandler: function (e) {
        if (27 == e.keyCode) {
            this.closeDialog();
        }
    },

    closeDialog: function () {
        DialogAction.hide();
    }

});
