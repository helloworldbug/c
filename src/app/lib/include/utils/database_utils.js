// 文件名：database_utils.js
//
// 创建人：曾文彬
// 创建日期：2015/12/02 22:31
// 描述：database 操作

'use strict';

var MePCAPI = require('../../MePC_Public');

/**
 * SQL关键字首尾加空格
 * 
 * @params {String} comboKeyWord
 * @returns {String}
*/
function addTrimPrefixOrSuffix (comboKeyWord) {
    var space = ' ',
        beginExp = /(^|\s+)\w+/,
        endExp = /\w+(?:\s)/;

    return comboKeyWord
        .replace(beginExp, function (_all, _begin) {
            return _begin.indexOf(space) < 0 ? space + _begin : _begin; 
        })
        .replace(endExp, function (_all, _end) {
            return _end.indexOf(space) < 0 ? space + _end : _end; 
        });
}

/**
 * 获取Avos数据表
 * 
 * @params {String} tableName
 * @returns {AvosObject}
*/
function getAVTableByName (tableName) {
    return new fmacloud.Query(tableName);
}

/**
 * 获取拼接后的where sql语句
 * 
 * @params {Object} whereCondition
 * @params {String} comboKeyWord 
 * @returns {String}
*/
function getComboWhereSQL (whereCondition, comboKeyWord) {
    var whereSQL = 'where';

    if (!whereCondition) return '';

    comboKeyWord = addTrimPrefixOrSuffix(comboKeyWord) || ' and ';

    MePCAPI.each(whereCondition, function (_value, _key) {
        whereSQL += ' ' + _key + _value + comboKeyWord;
    });
    
    return whereSQL;
}

/**
 * 获取拼接后的order by sql语句
 * 
 * @params {String} orderbyCondition
 * @params {String} sortType
 * @returns {String}
*/
function getComboOrderbySQL (orderbyCondition, sortType) {
    var orderbySQL = 'order by {0}';

    if (!orderbyCondition) return '';
    
    sortType = sortType || 'desc';

    return MePCAPI.formatString(orderbySQL, orderbyCondition + ' ' + sortType);
}

/**
 * 获取拼接后的limit sql语句
 * 
 * @params {Array} limitCondition
 * @returns {String}
*/
function getComboLimitSQL (limitCondition) {
    var limitSQL = 'limit {0}, {1}';

    if (!limitCondition) return '';

    return MePCAPI.formatString(limitSQL, limitCondition);        
}

/**
 * 获取查询table sql
 * 
 * @params {String} tableName
 * @params {Array} columns
 * @returns {String}
*/
function getComboTableSQL (tableName, columns) {
    var tableSQL = 'select {0} from {1}';

    columns = (columns && (MePCAPI.isType(columns, 'array') ? columns.join(',') : columns)) || '*';

    return MePCAPI.formatString(tableSQL, [columns].concat(tableName));
}


module.exports = {
    
    getFullSQL: function (condition) {
        var fullSQL = '';

        return getComboTableSQL(condition.tableCondition.tableName, condition.tableCondition.columns)
            += getComboWhereSQL(condition.whereCondition.condition, condition.whereCondition.comboKeyWord)
            += getComboOrderbySQL(condition.orderbyCondition.condition, condition.orderbyCondition.sortType)
            += getComboLimitSQL(condition.limitCondition.condition);
    }
};
