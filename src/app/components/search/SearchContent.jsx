/**
 * @description 个人中心内容
 * @time 2015-11-9
 * @author 刘华
*/
'use strict';

var React = require('react');
var TplMode = require('../Common/NewUserMagazineCard');
var TemplateProduct = require('../Common/TemplateProduct');
var SearchUser = require('./SearchUser');

var Search=React.createClass({
    getInitialState() {
        return {

        }
    },
    componentDidMount() {
        this.bindScrollEvent();
    },
    //搜索结果出现 隐藏加载动画
    componentDidUpdate(){
        $(".loader *").remove();
        $(".loader").append("<svg version='1.1' id='loader-1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='40px' height='40px' viewBox='0 0 50 50' style='enable-background:new 0 0 50 50;'' xml:space='preserve'><path fill='#999' d='M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z'><animateTransform attributeType='xml'attributeName='transform'type='rotate'from='0 25 25'to='360 25 25'dur='0.8s'repeatCount='indefinite'/></path></svg>");
    },
    render(){
        var content;
        var loading = null;
        var allLoading = null;
        //loading 动画
        if(this.props.isLoading=="workLoading"||this.props.isLoading=="modeLoading"||this.props.isLoading == 'userLoading'){
            loading=<div className="pro-loading loader"></div>;
        }
        if(this.props.isLoading=="allLoading"){
            allLoading=<div className="allLoading"><div className="loader"></div><span className="HardLoading">正在努力加载中</span></div>
        }
        //内容
        if(this.props.type=="mode"){
            var messageMode=(this.props.modeStore.length==0&&this.props.isLoading!="allLoading"&&this.props.modeNumber==0?<div className="noFindMessage"><div className="noFindLogo"></div>没有找到相关模版</div>:null);
            return(
                <div className="modeContent product-lists">
                {allLoading}
                {messageMode}
                <TemplateProduct category="create" type="mode" templateStores={ this.props.modeStore } />
                {loading}
                </div>
                )
        }else if (this.props.type == 'user') {
            var messageUser=(this.props.userStore.length==0&&this.props.isLoading!="allLoading"&&this.props.userNumber==0?<div className="noFindMessage"><div className="noFindLogo"></div>没有找到相关用户</div>:null);
            return(
                <div className = 'userContent product-lists'>
                    <SearchUser userStore={this.props.userStore} userNumber={this.props.userNumber} isLoading={this.props.isLoading} />
                </div>
                )
        }else if(this.props.type=="work"||this.props.type=="all"){
            var messageWork=(this.props.workStore.length==0&&this.props.isLoading!="allLoading"&&this.props.workNumber==0?<div className="noFindMessage"><div className="noFindLogo"></div>没有找到相关作品</div>:null);
            return(
                <div className="workContent product-lists">
                {allLoading}
                {messageWork}
                <TemplateProduct type="work" templateStores={ this.props.workStore } />
                {loading}
                </div>
            )
        }
    	return(
            <div>
            {content}
            </div>
    		)
    },
    //搜索内容
    search(){
        var tplStoreLength = this.props[(this.props.type+"Store")].length;
        var tplLength = this.props[(this.props.type+"Number")];
        if(tplStoreLength < tplLength){
            this.changeLoading(this.props.type+"Loading");
            this.props.search(this.props.type);
        }
    },
    //绑定滚轮事件
    bindScrollEvent(){
        var _this=this;
        $(window).bind("mousewheel",function(e){
            if(document.body.scrollTop+ $(window).height()>document.body.scrollHeight - 250&&_this.props.type!="all"){
                _this.search();
            }
        });
    },
    //改变loading 内容
    changeLoading(value){
        this.props.changeLoadings(value);
    }
});

module.exports = Search;
