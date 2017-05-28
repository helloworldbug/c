/*
 * 工具栏非页面 dialog 文件功能页
*/

var React = require("react");
var GlobalFunc = require("../../Common/GlobalFunc");
var Base=require('../../../utils/Base')
var indexTooler = function(){
	//退出
	this.exitMake = function(){
		Base.linkToPath('/user');
	};

	this.createModel = function(type,option){
        GlobalFunc.createModel(type,option)
	};
};
module.exports = new indexTooler();