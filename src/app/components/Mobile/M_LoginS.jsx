'use strict';

var React = require('react'),
	MePC = require('../../lib/MePC_Public'),
	ImageModules = require('../Mixins/ImageModules'),
	Base = require('../../utils/Base.js'),
	MSuper = require('./M_Super');

var logins = MePC.inherit(MSuper,React.createClass({
	mixins : [ImageModules],
	render : function () {
		this.generatorMobileMeta();
	    this.generatorMobileCSSSheet();
	    this.modifierRootClassByName();
	    if(!Base.isLogin()){
	    	Base.linkToPath('/phone');
	    }
		return (
			<div id='loginsFrame'>
				<div id='loginsHeader'>
					<div>
						<img src={this.defineImageModules()["head-sculptures"]}/>
						<div id='headerContent'>
							<div>ME会员（普通会员）</div>
							<div>永久免费</div>
							<div>请使用电脑登录修改你的个人资料</div>
						</div>
					</div>
				</div>
				<div id='loginsContent'>
					<img src={this.defineImageModules()["loginS"]}/>
					<span>开启你的自媒体时代</span>
					<span>立即开启电脑登录 www.agoodme.com</span>
				</div>
			</div>
			)
	},

	componentWillUnmount: function () {
        // 删除mobile 样式
        this.modifierRootClassByName(true);
    }
}));

module.exports = logins;