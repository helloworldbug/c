/**
 * @description 消息编辑->图片库
 * @time 2016-6-26
 * @author lifeng
 */

'use strict';

// require core module
var React = require('react');
var GlobalFunc = require("../../Common/GlobalFunc.js");
var Base = require("../../../utils/Base");
var classnames = require("classnames");
var WorkDialog = React.createClass({
    getInitialState  : function () {

        var url = this.props.url;
        return {
            data           : [],//要显示的图片数据
            url            : url,//
            pageStart      : 0,//分页，开始位置
            pageLimit      : 10,//分页，每页条数
            count          : 1,
            nomore         : null,
            selectTid      : undefined,
            showInvalidTips: false
        }
    },
    /**
     * 向服务器查询数据
     */
    getData          : function () {
        var _this = this;
        if (this.state.pageStart < this.state.count) {
            //取数据前显示加载动画
            this.refs.loadmore.innerHTML = "<svg version='1.1' id='loader-1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='40px' height='40px' viewBox='0 0 50 50' style='enable-background:new 0 0 50 50;' xml:space='preserve'><path fill='#999' d='M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z'><animateTransform attributeType='xml' attributeName='transform' type='rotate' from='0 25 25'to='360 25 25'dur='0.8s'repeatCount='indefinite'/></path></svg>";
            var sql = "select * from tplobj where tpl_type=11 and  tpl_state=2  and  tpl_delete=0 and  author='" + this.props.userID + "' limit " + this.state.pageStart + "," + this.state.pageLimit + "  order by reupdate_date desc";
            fmacloud.Query.doCloudQuery(sql).then((data)=> {
                var newData = _this.state.data;
                newData = newData.concat(data.results);
                var nextStart = this.state.pageStart + data.results.length;
                var tips = "";
                if (nextStart == this.state.count) {
                    tips = "没有更多作品了"
                }
                //取完数据,设置数据，重写加载动画区
                _this.setState({data: newData, pageStart: nextStart, nomore: tips});
            })
        }

    },
    componentDidMount: function () {
        //加载时取数据库第一页
        var _this = this;
        var countSql = "select count(*) from tplobj where tpl_type=11 and  tpl_state=2  and  tpl_delete=0 and  author='" + this.props.userID + "'";
        fmacloud.Query.doCloudQuery(countSql).then((data)=> {
            _this.setState({count: data.count});
            if (data.count == 0) {
                _this.setState({
                    nomore: "该作品列表为空"
                })
            } else {
                _this.getData();
            }


        });
        this.refs.list.addEventListener('scroll', this.listScroll)//下拉刷新
    },
    /**
     * 滚动条滚动时判断到底部时加载更多数据
     * @param event
     */

    listScroll       : function (event) {
        if (this.state.pageStart >= this.state.count) {
            //上次已经取到最后的数据
            return;
        }
        var isToBottom = event.target.scrollTop == event.target.scrollHeight - event.target.clientHeight;
        if (isToBottom) {
            this.getData();
        }
    },
    /**
     * 选择一个作品
     * @param tid 作品tid
     * @param event
     */
    selectWork       : function (tid, event) {

        var oldTid = this.state.selectTid;
        if (oldTid == tid) {
            //如果是已经选中的作品，取消选中，置空url
            this.setState({selectTid: undefined, url: ""})
        } else {
            //如果是没选中的作品，选中这个作品，并生成原文链接的url
            this.setState({selectTid: tid, url: `${location.origin}/preview/tid=${tid}`})
        }
    },
    /**
     * 点击确定时回调
     */
    confirmHandler   : function () {
        var url = this.state.url;
        if (!this.validUrl()) {
            return
        }
        if (url) {
            //地址不为空时，用地址做参数回调父组件传过来的确定函数
            if (url.indexOf("http") != 0) {
                url = "http://" + url
            }
            this.props.ok({url: url})
        }

        this.hideDialog();
    },
    /**
     * 隐藏对话框
     */
    hideDialog       : function () {
        this.props.hide();
    },
    /**
     * 改变url,清除选择
     * @param event
     */
    urlChange        : function (event) {
        this.setState({url: event.target.value, selectTid: undefined})
    },

    blurHanlder:function(){
        if(!this.validUrl()){
            this.setState({showInvalidTips: true})
        }
    },
    /**
     * 验证网站url合法性
     * 不合法时显示校验错误的提示
     *
     */
    validUrl: function () {
        var url = this.state.url;
        if (!url) {
            //为空时不用管
            return true
        }
        if (url.indexOf("http") != 0) {
            url = "http://" + url
        }
        return GlobalFunc.validUrl(url);

    },
    /**
     * 隐藏无效url提示
     */
    hideTips: function () {
        this.setState({showInvalidTips: false})
    },
    render  : function () {
        var worklist = this.state.data.map((tpl ,index)=> {
            //作品列表的html
            var tplAtrr = tpl.attributes;
            var itemClass = classnames({
                selected: tplAtrr.tpl_id == this.state.selectTid
            })

            return <li key={index} className={itemClass} onClick={this.selectWork.bind(this,tplAtrr.tpl_id)}>
                <div className="card-img"><img src={GlobalFunc.subAvChar(tplAtrr.effect_img)}/></div>
                <div className="card-name">{tplAtrr.name}</div>
            </li>
        });

        return (
            <div className="select-dialog">
                <div className="work-dialog">
                    <div className="title">添加ME作品链接</div>
                    <div className="body">
                        <ul className="work-list" ref="list">
                            {worklist}
                            <div className="loadmore" ref="loadmore">{this.state.nomore}</div>

                        </ul>
                    </div>
                    <div className="modal-footer"><input type="text" onChange={this.urlChange} value={this.state.url}
                                                         placeholder="添加其他链接" onClick={this.hideTips}
                                                         onBlur={this.blurHanlder}/><span
                        className={this.state.showInvalidTips?"tips":"hide"}>*链接不合法</span>
                        <button onClick={this.hideDialog}>取消</button>
                        <button onClick={this.confirmHandler}>确认</button>
                    </div>
                </div>
            </div>
        );
    }
});
module.exports = WorkDialog;