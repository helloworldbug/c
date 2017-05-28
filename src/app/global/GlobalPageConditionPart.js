/**
 * @module 
 * @description
 * @time 2015-10-26 11:26
 * @author 曾文彬
 **/

'use strict';

module.exports = {
    
    tableCondition: {
        
        Templates: {
            whereConditionOperator: '=',
            orderField: 'reupdate_date',
            orderCategory: 'desc',
            limitCurrentPage: 1,
            limitOffsetPage: 12
        },
        Works: {
            whereConditionField: 'approved',
            whereConditionValue: '1',
            whereConditionOperator: '=',
            orderField: 'reupdate_date',
            orderCategory: 'desc',
            limitCurrentPage: 1,
            limitOffsetPage: 12
        },

        Lables: {
            whereConditionField: 'type',
            whereConditionValue: '(\'works_type_label\')',
            whereConditionOperator: 'in',
            orderField: 'order',
            orderCategory: 'desc',
            limitCurrentPage: 1,
            limitOffsetPage: 1000
        },

        Banners: {
            whereConditionField: 'bannertype',
            whereConditionValue: '\'场景\'',
            whereConditionOperator: '=',
            orderField: 'bannernumer',
            orderCategory: 'desc',
            limitCurrentPage: 1,
            limitOffsetPage: 1000
        }
    }
};
