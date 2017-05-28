/**
 * @description 收费对话框
 * 
 * @author lifeng
*/

var React = require('react');

function noop() {

}
var ChargeDialog = React.createClass({
    getInitialState: function () {
        return {
            show: false,
            text: "ddd"
        }

    },
    showCharge: function (onOk, onCancel, text) {
        this.onOk = onOk || noop;
        this.onCancel = onCancel || noop;
        this.setState({
            show: true,
            text: text
        })
    },
    hideCharge: function () {
        this.setState({
            show: false
        })
    },
    ok: function () {
        this.onOk();
        this.hideCharge()
    },
    cancel: function () {
        this.onCancel();
        this.hideCharge()
    },
    render() {
        return (<div className="pupup" style={{ display: this.state.show ? "block" : "none" }}>
            <span className="shade"></span>
            <div ref="dialog" data-animation={this.state.show ? "ed" : ""}
                className="dialog dialog-white-skin">
                <div className="head">
                    {this.state.tipsName || "提示" }
                    <div className="close" onClick={this.cancel}></div>
                </div>

                <div className="dialog-inner">
                    <div className="dialog-header" dangerouslySetInnerHTML={{ __html: this.state.text }}>
                    </div>
                    <div className="dialog-body clearfix" >
                        <a href="javascript:;" onClick={this.ok} className="dialog-btn fl">{this.props.sureText || "确 定"}</a>
                        <a href="javascript:;" onClick={this.cancel} className="dialog-btn fr">{this.props.cancelText || "取 消"}</a>
                    </div>
                </div>
            </div>

        </div>)
    }
})

module.exports = ChargeDialog;