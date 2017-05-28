/**
  * @name 分页类
  * @author 曾文彬
  * @datetime 2015-10-26
*/

'use strict';

// 定义分页类
class Paging {

    /*
     * 分页类构造函数
     *
     * @param currentPage {number} 当前页
     * @param pageSize {number} 每页多少条
     * @param totalPages {number} 总页数
     * @param totalRecords {number} 总记录数
    **/
    constructor(options = {}) {
        this.set(options);
    }

    set(property, value, options) {

        // define property
        var attr, attrs, inUnset;

        if (typeof property === 'object') {
            attrs = property;
            options = value;
        } else {
            (attrs = {})[property] = value;
        }  

        // check condition
        isUnset = !!options && options.isUnset;

        Object.keys(attrs).forEach(((_attr) => {
            isUnset ? delete this[_attr] : (this[_attr] = attrs[_attr]);
        }).bind(this));

        return this;
    }

    getTotalPages() {
        return Math.ceil(this.getTotalRecords() / this.pageSize);    
    }

    getTotalRecords() {
        return this.totalRecords;
    }

    setPage(pageCategory, pageValue) {
        this.set(pageCategory === 'records' ? 'totalRecords' : 'currentPage', pageValue);
    }

    setTotalRecords(value) {
        this.setPage('records', records);
    }

    setCurrentPage(value) {
        this.setPage('page', value);
    }

    hasNextPage() {
        return this.currentPage <= this.totalPages;
    }

    buildLoadMoreBtn() {
        return this.hasNextPage() ? (
            <div className="load-more-button" onClick={this.handleClick}>加载更多</div>    
        ) : null;
    }    

}

// 导出分页类