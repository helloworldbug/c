/**
 * @description 活动存储
 * @time 2016-1-4
 * @author 刘华
*/
var Reflux = require('reflux');
var ActivityAction = require('../actions/ActivityAction');
var tpl = require("../utils/tpl");
var Model  = require('../utils/Model');
var model = new Model(); 
model.set('tableName', 'me_activity');



var _result = {};

var ActivtiyStore = Reflux.createStore({
	init : function () {
		this.listenTo(ActivityAction.getActivtiy,this.getActivtiy);
	},


	getActivtiy : function (tid) {
		var _this = this;
		this.getActivityByTid(tid).then(function (result) {
			_result = result;
			_this.trigger(_result.results[0].attributes);
		});
		 
	},
	getActivityByTid : function (tid) {
		var SQLCondition = {
            fieldColumn: '*', 
            whereCondition:{
                'objectId  = '  : "'"+tid+"'"
            }
        };
        var SQLConditionStr = model.getQuerySQLByCondition(SQLCondition); 
        return new Promise(function(resolveFunc, rejectFunc) {
            fmacloud.Query.doCloudQuery(SQLConditionStr, {
                success: resolveFunc,
                error: rejectFunc
            });    
        });
	}
});

module.exports = ActivtiyStore;