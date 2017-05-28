/*
 * @name 错误提示公共组件
 * @description 将错误提示组件化，分离化，有利于用户体验变更，而不造成代码冗余，代码更具有可维护性
 * @author 曾文彬
 * @datetime 2015-9-6
**/

'use strict';

// 核心模块
var React = require('react');

// 定义错误提示组件类
var ErrorTip = React.createClass({

	// 初始化组件状态变更需要的字段
	getDefaultProps() {
		return {
			id: 'submit_span'
		}
	},

	// 状态改变触发显示
	render: function () {
		return (
			<span {...}>this.props.children</span>
		);
	}
});

Module.exports = ErrorTip;