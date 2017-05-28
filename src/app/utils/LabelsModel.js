/**
 * @description Labels模型
 * @time 2015-10-21
 * @author 曾文彬
*/

'use strict';

// define core module
var Base = require('./Base'),
    Model = require('./Model');

// define a TplObj Model Class
class LabelsModel extends Model {

    // initialize
    constructor(attributes) {
        super(attributes);

        this.set('tableName', 'labels');
    }

    getLabelsBySQL(condition) {
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

// export a TplObj Model Class
module.exports = LabelsModel;
