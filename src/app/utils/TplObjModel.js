/**
 * @description TplObj模型
 * @time 2015-9-14
 * @author 曾文彬
*/

'use strict';

// define core module
var Base = require('./Base'),
    Model = require('./Model');

var defaultTplobjParamMap = {

    fieldColumn: '*',

    currentPage: 1,

    whereCondition: {
        'approved =': 1
    },

    orderCondition: 'createdAt desc'
};

// define a TplObj Model Class
class TplObjModel extends Model {

    // initialize
    constructor(attributes) {
        super(attributes);

        this.set('tableName', 'tplobj');
    }

    // define method
    // get TplObj
    getTplObjPromise(tid) {

        // define tpl table
        var tpl = this.getTable();

        tpl.equalTo('tpl_id', tid || this.get('tid'));

        return new Promise((_resolve, _reject) => {
            tpl.find(_resolve, _reject);
        });
    }

    getTplObj(tid) {
        var callbacks = [].slice.call(arguments, 1);

        var tplPromise = this.getTplObjPromise(tid || this.get('tid'));

        tplPromise.then.apply(tplPromise, callbacks);
    }

    getTplObjs(condition) {
        var strCQL = this.getQuerySQLByCondition(condition);

        return new Promise((_resolve, _reject) => {
            fmacloud.Query.doCloudQuery(strCQL, {
                success: _resolve,
                error: _reject
            });
        });
    }
}

// export TplObj Model Class
module.exports = TplObjModel;
