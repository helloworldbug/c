/**
 * @name 对话框组件
 * @time 2015-9-11
 * @author 曾文彬
 **/

'use strict';

// require core module
var React = require('react'),
    Base = require('../../utils/Base');

// require css module
var DialogCSS = require('../../../assets/css/dialog');

// define Dialog component
var Dialog = React.createClass({
    getDefaultProps() {
        return {
            width          : 480,
            bodyHeight     : 70,
            hash           : '/login',
            appearanceState: false,
            sureIsHide     : false,
            showHeader     : false
        }
    },
    getInitialState() {
        return {
            title          : this.props.title,//显示内容
            appearanceState: this.props.appearanceState,//是否显示
            sureIsHide     : !!this.props.sureIsHide,//是否显示确定按钮
            tipsName       : this.props.tipsName,  //标题
            showHeader     : this.props.showHeader
        }
    },
    resetPosition(node) {
        this.setState({
            marginLeft: -parseInt(this.props.width / 2)
        });
    },
    show: function () {
        this.setState({appearanceState: true})
    },
    hide: function () {
        this.setState({appearanceState: false})
    },
    handleCancel() {
        this.setState({
            appearanceState: false
        });
        this.props.cancelFn && this.props.cancelFn();
    },

    handleSure() {
        var sureFn = this.props.sureFn;

        if (sureFn) {
            sureFn(0); // 0 代表回复订单弹出框默认值显示页
            return;
        }
        Base.linkToPath(this.props.hash);
    },


    render() {
        var btn;

        if (this.state.sureIsHide) {
            btn = <div className="dialog-body clearfix" style={{height: this.props.bodyHeight}}>
                <a href="javascript:;" onClick={this.handleSure} className="dialog-btn">{this.props.sureText||"确 定"}</a>
            </div>
        } else {
            btn = <div className="dialog-body clearfix" style={{height: this.props.bodyHeight}}>
                <a href="javascript:;" onClick={this.handleSure} className="dialog-btn">{this.props.sureText||"确 定"}</a>
                <a href="javascript:;" onClick={this.handleCancel} className="dialog-btn">{this.props.cancelText||"取 消"}</a>
            </div>
        }

        var dialogStyle = {width: this.props.width, marginLeft: this.state.marginLeft, transform:"translateY(-50%)"};
        return (
            <div className="pupup" style={{display: this.state.appearanceState ? "block" : "none"}}>
                {/*遮罩*/}
                <span className="shade"></span>
                {/*对话框*/}
                <div ref="dialog" data-animation={this.state.appearanceState ? "ed" : ""}
                     className="dialog dialog-white-skin"
                     style={dialogStyle}>

                    {/*this.state.showHeader ? (<div className="head">
                        {this.state.tipsName || "提示" }
                        <div className="close" onClick={this.handleCancel}></div>
                    </div>) : null */}

                    <div className="head">
                        {this.state.tipsName || "提示" }
                        <div className="close" onClick={this.handleCancel}></div>
                    </div>

                    <div className="dialog-inner">
                        <div className="dialog-header" dangerouslySetInnerHTML={{__html:this.state.title}}>

                        </div>
                        {btn}
                    </div>
                </div>
            </div>
        );
    },
    componentDidMount() {
        // 重置位置
        this.resetPosition();
    },

    // 更新属性
    componentWillReceiveProps(nextProps) {
        this.setState({
            title          : nextProps.title,
            appearanceState: nextProps.appearanceState,
            sureIsHide     : !!nextProps.sureIsHide,
            showHeader     : !!nextProps.showHeader
        });
    }
});
/**
 * 创建对话框的html
 */
Dialog.buildDialog = function (options) {
    return <Dialog ref="dialog" {...options} hash="/login"/>
},
// export Dialog component
    module.exports = Dialog;