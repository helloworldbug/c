/**
 * @component Notification
 * @description 通知组件
 * @time 2015-10-12 17:07
 * @author StarZou
 **/

'use strict';

var React = require('react');

require('../../../assets/css/notification.css');

var Notification = React.createClass({

    getInitialState: function getInitialState() {
        return {
            open    : false,
            duration: 3000
        };
    },

    render: function () {

        if (!this.state.open) {
            return null;
        }

        return (
            <div className="notification-component">
                <div className="content">
                    <span className="icon"></span>
                    <span className="message">{this.state.message}</span>
                </div>
            </div>
        );
    },

    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
        if (prevState.open !== this.state.open) {
            if (this.state.open) {
                this._setAutoHideTimer();
            }
        }
    },

    show: function (message) {
        this.setState({open: true, message: message});
    },

    dismiss: function () {
        this._clearAutoHideTimer();
        this.setState({open: false});
    },

    _clearAutoHideTimer: function _clearAutoHideTimer() {
        if (this._autoHideTimerId !== undefined) {
            this._autoHideTimerId = clearTimeout(this._autoHideTimerId);
        }
    },

    _setAutoHideTimer: function _setAutoHideTimer() {
        var me = this, duration = this.state.duration;

        if (duration > 0) {
            this._clearAutoHideTimer();
            this._autoHideTimerId = setTimeout(function () {
                me.dismiss();
            }, duration);
        }
    }

});

module.exports = Notification;