/**
 * @description 搜索组件
 * @time 2015-11-9
 * @author 刘华
 */
'use strict';

var React = require('react');
var ReactDOM=require("react-dom");
var Slider = require('../Common/Slider');
var SearchAction = require('../../actions/SearchAction.js');
var SearchStore = require('../../stores/SearchStore.js');
var SearchContent = require("./SearchContent");
var tpl = require('../../utils/tpl');
require('../../../assets/css/search.css');

var Search=React.createClass({
    getInitialState() {
        this.mounted=true;
        //根据hash判断是否执行搜索
        var propsSearch = "";
        if(location.search.indexOf("value=")!=-1){
            propsSearch = location.search.substr(location.search.indexOf("value=")+6);
        }
        
        //初始化状态
        return {
            search:decodeURI(propsSearch),
            type:"work",
            modeNumber:0,
            workNumber:0,
            userNumber:0,
            modeStore:[],
            workStore:[],
            userStore:[],
            searchText:null,
            isLoading:"null"
        }
    },
    //绑定滚轮事件
    componentDidMount() {
        this.setWindowHashEvent();
        this.bindWindowScrollEvent();
        this.unsubscribe = SearchStore.listen(this.onChanges);
        if(this.state.search!=""){
            this.submitSearch("all",1);
        }
    },
    //取消事件绑定
    componentWillUnmount() {
        this.bindWindowScrollEvent({ isUnset: true });
        this.setWindowHashEvent({ isUnset: true });
        this.unsubscribe();
        this.mounted=false
    },
    render(){
        return(
            <div className="searchFrame">
                <Slider ref="slider"/>
                <div className="searchTitle">
                    <div className="searchInput">
                        <input type="text" ref="contents" placeholder="搜索作品、模版" value={this.state.search} onChange={this.changeSearch} onKeyDown={this.keyDown}/>
                        <span onClick={this.submitSearch.bind(this,"all",1)} className="searchIC"></span>
                    </div>
                    <div className="searchType">
                        <span className={this.state.type=="work"?"selectType":""} onClick={this.changeType.bind(this,"work")}>作品({this.state.workNumber})</span>
                        <span className={this.state.type=="mode"?"selectType":""} onClick={this.changeType.bind(this,"mode")}>模版({this.state.modeNumber})</span>
                        <span className={this.state.type=="user"?"selectType":""} onClick={this.changeType.bind(this,"user")}>用户({this.state.userNumber})</span>
                    </div>
                </div>
                <div className="searchContent">
                    <SearchContent
                        isLoading={this.state.isLoading}
                        type={this.state.type}
                        modeNumber={this.state.modeNumber}
                        workNumber={this.state.workNumber}
                        userNumber={this.state.userNumber}
                        modeStore={this.state.modeStore}
                        workStore={this.state.workStore}
                        userStore={this.state.userStore}
                        search={this.submitSearch}
                        changeLoadings={this.changeLoading}
                    />
                </div>
            </div>
        )
    },
    //改变输入框内容
    changeSearch(){
        this.setState({
            search: ReactDOM.findDOMNode(this.refs.contents).value
        });
    },
    //提交输入内容
    submitSearch(type,time){
        if(this.state.search==""){
            return;
        }
        //根据参数 取得搜索方式
        if(type=="all"){
            this.setState({
                modeNumber:0,
                workNumber:0,
                userNumber:0,
                modeStore:[],
                workStore:[],
                userStore:[],
                searchText:this.state.search,
                isLoading:"allLoading"
            },function(){
                if(time==1){
                    SearchAction.searchCount(this.state.searchText);
                }
                SearchAction.search(this.state.searchText,type);
            });
        }else{
            SearchAction.search(this.state.searchText,type);
        }
    },
    //获取返回数据
    onChanges(_result){
        if((_result.modeNumber>0&&_result.modeStore.length==0)||(_result.workNumber>0&&_result.workStore.length==0)){
            this.setState({
                modeNumber:_result.modeNumber,
                workNumber:_result.workNumber,
                userNumber:_result.userNumber,
                modeStore:_result.modeStore,
                workStore:_result.workStore,
                userStore:_result.userStore
            });
        }else{
            this.setState({
                modeNumber:_result.modeNumber,
                workNumber:_result.workNumber,
                userNumber:_result.userNumber,
                modeStore:_result.modeStore,
                workStore:_result.workStore,
                userStore:_result.userStore,
                isLoading:"null"
            });
        }

    },
    //改变当前类型
    changeType(value){
        this.setState({
            type:value
        })
    },
    //回车提交事件
    keyDown(e){
        if(e.which=="13"){
            $(".searchIC").trigger("click");
        }
    },
    //滚动条事件
    bindWindowScrollEvent(options) {
        var isUnset = !!options && options.isUnset,
            scrollCallback = this.windowScrollCallback;

        $(window)[isUnset ? 'unbind' : 'bind']('scroll', scrollCallback);
    },
    windowScrollCallback() {
        this.refs.slider.handleScroll();
    },
    handleScroll(event) {
        this.setState({
            backgroundColor: $(window).scrollTop() > ( location.pathname.slice(1)!="discovery" ? bodyHeight : 430 ) ? 'rgba(30, 30, 30, 1)' : void 0
        });
    },
    //hash变化事件绑定
    setWindowHashEvent(options) {
        var isUnset = !!options && options.isUnset,
            scrollCallback = this.handleHashChange;

        $(window)[isUnset ? 'unbind' : 'bind']('hashchange', scrollCallback);
    },
    componentWillReceiveProps(nextProp){
    this.handleHashChange();
    },
    //hash变化 执行函数
    handleHashChange(){
        var _this=this;
        if(location.search.indexOf("value=")!=-1){
            this.setState({
                search:decodeURI(location.search.substr(location.search.indexOf("value=")+6))
            },()=>{
                _this.submitSearch("all",1);
            });
        }
    },
    //改变loading图标
    changeLoading(value){
        this.setState({
            isLoading:value
        });
    }
});

module.exports = Search;
