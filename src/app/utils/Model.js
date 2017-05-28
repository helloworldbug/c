/**
 * @name 模型基类
 * @time 2015-9-24
 * @author 曾文彬
*/

'use strict';

var Base = require('./Base');

// define a Base Model Class
class Model {

    // initialize
    constructor(attributes) {
        this.attributes = {};
        this.set(attributes);
    }

    // define common
    // set class property
    set(property, value, options) {

        // define property
        var attr, attrs;

        // check condition
        var isUnset = !!options && options.isUnset;

        var currentAttributes = this.attributes;

        if (typeof property === 'object') {
            attrs = property;
            options = value;
        } else {
            (attrs = {})[property] = value;
        }

        Object.keys(attrs).forEach((_attr) => {
            isUnset ? delete currentAttributes[_attr] : (currentAttributes[_attr] = attrs[_attr]);
        });

        return this;
    }

    // get class property
    get(property) {
        return this.attributes[property];
    }

    // get table
    getTable() {
        return new fmacloud.Query(this.get('tableName'));
    }

    getTplWhereSQL(whereCondition, relation) {

        if (!whereCondition) return '';

        relation = relation || ' and ';

        var names = Object.keys(whereCondition),
            conditionSQL = 'where ',
            value,
            canConcat,
            stopIndex = names.length - 1;

        names.forEach((_name, _index) => {
            value = whereCondition[_name];

            canConcat = (value != null);

            conditionSQL += '' + _name + value;

            if (canConcat && _index !== stopIndex) conditionSQL += relation;
        });

        return conditionSQL;
    }

    getTplOrderSQL(orderCondition) {

        if (!orderCondition) return '';

        return Base.formatString(' order by {0}', orderCondition);
    }

    getTplLimitSQL(currentPage, pageSize) {

        if (!currentPage) return '';

        var limit = pageSize || 1000,
            offset = (currentPage - 1) * limit;

        return Base.formatString(' limit {0},{1}', [offset,limit]);
    }

    getSelectSQL(options) {
        var fieldColumn = options.fieldColumn, selectSQL;

        fieldColumn = fieldColumn instanceof Array ? fieldColumn.join(',') : fieldColumn;

        selectSQL = Base.formatString('select {0} from ', fieldColumn);

        selectSQL += this.get('tableName') + ' ';
        selectSQL += this.getTplWhereSQL(options.whereCondition, options.relation);
        selectSQL += this.getTplLimitSQL(options.currentPage, options.pageSize);
        selectSQL += this.getTplOrderSQL(options.orderCondition);

        return selectSQL;
    }

    getQuerySQLByCondition(condition) {
        return this.getSelectSQL(condition);
    }
}

// export Base Model Class
module.exports = Model;
