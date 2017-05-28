/**
 * @description 消息编辑->选择作品对话框
 * @time 2016-6-26
 * @author lifeng
 */

var React = require('react');
var GlobalFunc = require("../../Common/GlobalFunc.js");
var classnames = require("classnames");
var Dialog = require('../../Common/Dialog');

var BLANKCOVER = require("../../../../assets/images/user/media/blank-cover.png"); //默认背景图片
var FIRSTBLANKCOVER = require("../../../../assets/images/user/media/first-blank-cover.png"); //第一篇文章默认图

var ChapterList = React.createClass({
    /**
     * 添加空文章
     */
    addChapter: function () {
        var msg = this.props.msg;
        msg.articles.push({
            title             : "",//标题
            content           : "",//正文
            author            : "",//作者
            digest            : "",//摘要
            thumb_media       : "",//封面
            show_cover_pic    : false,//封面是否显示到正文
            content_source_url: "",//原文地址
            originals         : [] //外链图片
        });

        //告诉父组件消息和选中文章有改变
        this.props.changeMsg(msg);
        var selectIndex = msg.articles.length - 1;//选中添加的文章
        this.props.select(selectIndex);
    },
    /**
     * 文章下移
     * @param index 要移动的文章下标
     * @param event
     */
    moveDown  : function (index, event) {
        //与下章交换，选中下章
        event.stopPropagation();
        var msg = this.props.msg;
        this._swapChapterNext(msg, index, index + 1);
        this.props.changeMsg(msg);
        this.props.select(index + 1);
    },

    /**
     * 文章上移
     * @param index 要移动的文章下标
     * @param event
     */
    moveUp          : function (index, event) {
        //与上章交换，选中上章
        event.stopPropagation();
        var msg = this.props.msg;
        this._swapChapterNext(msg, index, index - 1);
        this.props.changeMsg(msg);
        this.props.select(index - 1);
    },
    /**
     * msg的第index1篇文章与index2的位置互换
     * @param msg
     * @param index
     * @private
     */
    _swapChapterNext: function (msg, index1, index2) {
        var articles = msg.articles;
        var ch1 = articles[index1];
        var ch2 = articles[index2];
        articles[index1] = ch2;
        articles[index2] = ch1;
        msg.articles = articles;
    },
    /**
     * 删除文章
     * @param index 要删除的文章下标
     */
    remove          : function (index) {
        //删除文章，选中删除文章的上一篇
        if (typeof index != 'number') {
            throw "invalid index"
        }
        var msg = this.props.msg;
        var articles = msg.articles;
        articles.splice(index, 1);
        msg.articles = articles;
        this.props.changeMsg(msg);
        this.props.select(index - 1);
    },
    /**
     * 确定删除
     * @param index
     * @param event
     */
    confirmRemove   : function (index, event) {
        event.stopPropagation();
        this.removeIndex = index;//点确定时要删除的下标保存在this上
        this.refs.dialog.show();

    },
    render          : function () {
        var list, articles = this.props.msg.articles;
        list = articles.map((chapter, index)=> {
            //生成文章列表
            var src;
            if (index == 0) {
                //第一篇文章的默认图为大图，其他为小图
                src = chapter.thumb_media ? chapter.thumb_media : FIRSTBLANKCOVER;
            } else {
                src = chapter.thumb_media ? chapter.thumb_media : BLANKCOVER;
            }

            //封面图样式
            var listCoverStyle = {
                backgroundImage: `url(${src})`
            }

            //一篇文章的样式类，last用来决定是否显示下移图标
            var itemClass = classnames({
                selected: index == this.props.selectIndex,
                last    : index == articles.length - 1,
                first   : index == 0
            })
            return <li onClick={this.props.select.bind(null,index)}
                       className={itemClass} key={index}><span className="img img-center" style={listCoverStyle}></span><span
                className="title">{chapter.title ? chapter.title : "标题"}</span>
                <div className="tool">
                    <span
                        className="move-up fl" onClick={this.moveUp.bind(this, index)}></span>
                    <span className="move-down fl" onClick={this.moveDown.bind(this, index)}></span>

                    <span className="remove fr"
                          onClick={this.confirmRemove.bind(this, index)}></span></div>
            </li>
        });

        if (articles.length < 8) {
            //最多能有8条消息，所以>=8时不显示添加文章按钮
            list.push(<li className="add-chapter" onClick={this.addChapter} key="addChaper"
                          title="新增一篇图文消息"></li>)
        }

        //删除文章时弹出的确定删除对话框
        var dialog = Dialog.buildDialog(
            {
                appearanceState: false,
                title          : '确定删除吗？',
                sureFn         : function () {
                    this.remove(this.removeIndex);
                    this.removeIndex = undefined
                    this.refs.dialog.hide()
                }.bind(this)
            }
        )
        return (
            <div style={{height:`${this.props.tabHeight}px`}} className="scroll-wrapper">{dialog}
                <ul className="chapter-list">{list}</ul>
            </div>
        );
    }

});


module.exports = ChapterList;