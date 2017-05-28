// require core module
var React = require('react'),
    Base = require('../../utils/Base.js'),
    ImageModules = require('../Mixins/ImageModules'),
    MePC = require('../../lib/MePC_Public'),
    MSuper = require('./M_Super');

var Register =  MePC.inherit(MSuper,React.createClass({
	mixins : [ImageModules],
	render : function(){
        this.generatorMobileMeta();
        this.generatorMobileCSSSheet();
        this.modifierRootClassByName();

		return (
			<div id='contactFrame'>
				<div id='contactHeader'>
					<img src={this.defineImageModules()["mobileContactUs"]}/>
					<span>上海精灵天下数字技术有限公司</span>
					<span>www.agoodme.com</span>
					<img src={this.defineImageModules()["mobileLogo"]}/>
				</div>
				<div id='contactContent'>
					<div><img src={this.defineImageModules()["contactPhone"]}/>联系电话：<a href="tel:4008-868-110">4008-868-110</a></div>
					<div><img src={this.defineImageModules()["contactQQ"]}/>商务合作QQ：2102534037</div>
					<div><img src={this.defineImageModules()["contactWX"]}/>微信公众号：ME微杂志</div>
					<div><img src={this.defineImageModules()["contactAddress"]}/>上海市浦东新区祖冲之路1559号 创意大厦4001</div>
				</div>
			</div>

			)
	},

	componentWillUnmount: function () {
        // 删除mobile 样式
        this.modifierRootClassByName(true);
    }
}));

module.exports = Register;