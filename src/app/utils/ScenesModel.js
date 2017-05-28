/**
 * @description Scene模型
 * @time 2015-10-22
 * @author 曾文彬
*/

'use strict';

// define core module
var Base = require('./Base'),
    Model = require('./Model');

// define a Scene Model Class
class ScenesModel extends Model {

	// initialize
    constructor(attributes) {
        super(attributes);

        this.set('tableName', 'me_bannerconf');
    }

    getScenesBySQL(condition) {
        var strCQL = this.getQuerySQLByCondition(condition);

        return new Promise(
           (_resolve, _reject) => {
                fmacloud.Query.doCloudQuery(strCQL, {
                    success: _resolve,
                    error: _reject
                });
            }
        )
    }
}

module.exports = ScenesModel;
