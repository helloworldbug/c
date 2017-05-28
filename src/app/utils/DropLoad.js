/**
  * @name 下拉加载数据
  * @author 曾文彬
  * @datetime 2015-10-28
*/

'use strict';

class DropLoad {
    
    constructor(options = {}) {
        this.parentContext = options.parentContext;
        this.pageSize = options.pageSize;
        this.currentPage = options.currentPage;
        this.whereCondition = options.whereCondition;
        this.loadingState = options.loadingState;
        this.noMore = options.noMore;

        this.setLimitPage();
        this.setOtherCondition();
    }

    // bindWindowScrollEvent(options) {
    //     var isUnset = !!options && options.isUnset,
    //         scrollCallback = this.scroll.bind(this);

    //     $(window)[isUnset ? 'unbind' : 'bind']('scroll', scrollCallback);
    // }

    // init() {
    //     // 绑定滚动事件
    //     this.bindWindowScrollEvent();
    // }

    setWhereCondition(whereCondition) {
        this.whereCondition = whereCondition;
    }

    setOtherCondition(otherCondition) {
        this.otherCondition = $.extend(otherCondition, {currentSize: 0, pageSize: this.limitPage});
    }

    setLimitPage() {
        this.limitPage = this.currentPage * this.pageSize;
    }

    setCurrentPage(currentPage) {
        if (currentPage) this.currentPage = currentPage;
        else { this.currentPage++; }
    }

    isNext() {
        var _this = this;
        if (this.isScrollBottom() && this.limitPage - this.parentContext.getTemplateStores().templateStores.length === 12) {
            this.parentContext.setState({ [ this.loadingState ]: true,  [this.noMore] : false });
            this.parentContext.queryLoading(this.whereCondition, this.otherCondition);
        } else {
            setTimeout(function(){
                this.parentContext.setState({ [ this.loadingState ]: false }, function(){
                    _this.parentContext.setState({
                        [_this.noMore] : true
                    })
                });
            }.bind(this), 500);
        }
    }

    scroll() {
        
        if (this.isScrollBottom() && this.limitPage - this.parentContext.getTemplateStores().templateStores.length === 12 ) {
            
        } else if (this.isScrollBottom() && this.limitPage - this.parentContext.getTemplateStores().templateStores.length !== 12 ) {
            this.parentContext.setState({ [ this.loadingState ]: false });
        }
    }

    isScrollBottom() {
        return document.body.scrollTop + $(window).height() >= document.body.scrollHeight;
    }

    /*
     * 获取数据
     *
    **/
    fetch(strCQL) {
        return new Promise(((_resolve, _reject) => {
            this.query(strCQL, _resolve, _reject);
        }).bind(this));
    }

    /*
     * 组织查询
     *
    **/
    query(strCQL, successCallback, errorCallback) {
        fmacloud.Query.doCloudQuery(strCQL, {
            success: successCallback,
            error: errorCallback
        });
    }
}

module.exports = DropLoad;