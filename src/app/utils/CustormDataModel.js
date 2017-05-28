/**
 * @description CustormData模型
 * @time 2015-9-14
 * @author 曾文彬
*/

'use strict';

// define core module
var Model = require('./Model');

// define a CustormData Model Class
// 需传入的初始化属性包括 skip limit orderDirection
// skip: skip值 limit: limit值 orderDirection(排序方向)：0 -- 升序， 1 -- 降序
class CustormDataModel extends Model {

    // initialize
    constructor(attributes) {
        super(attributes);

        this.set('tableName', 'me_customerdata');
    }

    // define method
    // get custormdata promise
    getCustormDataPromise(tid, queryCondition, orderByField, action) {

        // define custorm table
        var custorm = this.getTable();

        // define find condition
        // skip
        var skip = this.get('skip');

        // limit
        var limit = this.get('limit');

        // uid
        var uid = this.get('uid');
        
        
        // query
        var queryCondition = $.extend({}, { cd_userid: uid, cd_tplid: tid }, (queryCondition || {}));

        // set table condition
        $.each(queryCondition, (_key, _value) => {
            custorm.equalTo(_key, _value);
        });

        skip && custorm.skip(skip);
        limit && custorm.limit(limit);

        orderByField && (query[this.get('orderDirection') == 0 ? 'ascending' : 'descending'](orderByField));

        return new Promise((_resolve, _reject) => {
            custorm[action](_resolve, _reject);
        });
    }

    // get custormdata data
    getCustormData() {
        var args = [].slice.call(arguments);

        var configs = args.slice(0, -2),
            callbacks = [].slice.call(args, -2);

        var custormPromise = this.getCustormDataPromise.apply(this, configs);

        custormPromise.then.apply(custormPromise, callbacks);
    }
}

// export CustormDataModel Model Class
module.exports = CustormDataModel;