// 文件名：  ActivityDetail.jsx
// 创建人：  YJ
// 创建日期：2015/12/29 10:41
// 描述：    活动详细页面

'use strict';

var React  = require('react'),
    QRCode = require('qrcode.react'),
    Base   = require('../../utils/Base'),
    MePC   = require('../../lib/MePC_Public'), 
    Model  = require('../../utils/Model'),
    TplObjModel = require('../../utils/TplObjModel');
import {Link} from 'react-router'
var SuperLogicComponent    = require('../../lib/SuperLogicComponent'),
    SuperTemplateComponent = require('../../lib/SuperTemplateComponent');

var Share = require('./share');
var ActivityAction = require('../../actions/ActivityAction.js');
var ActivityStore = require('../../stores/ActivityDetailStore.js');

var LoadingComponent = require('../../lib/include/buss/loading');
var tplobjModel = new TplObjModel();
var model = new Model(); 
model.set('tableName', 'me_activity');


var ActivityDetail = MePC.inherit(SuperLogicComponent, SuperTemplateComponent, React.createClass({

    getInitialState(){
        return {
            typeTabIndex : 1,
            tplData : {},
            order : "reupdate_date",
            tplContent : null,
            activityDate : {},
            isShareShow : false,
            isActivityShow : false
        };
    },
         
    /*
    * 生成 banner html
    */
    generatorBanner: function() {
        var time = null;
        var bgImg = null;
        if (!!this.state.tplData.start_date) {
            bgImg = this.state.tplData.activity_img;
            var s = this.state.tplData.start_date;
            var e = this.state.tplData.end_date;
            time = s.getFullYear()+'/'+(s.getMonth()+1)+'/'+s.getDate()+'-'+e.getFullYear()+'/'+(e.getMonth()+1)+'/'+e.getDate()
        }
        return (
            <div className="activity-banner">
               <img src = {bgImg} />
               <div className="activity-banner-layer">
                   <ul>
                       <li>
                           <h3>{this.state.tplData.name}{this.state.isActivityShow == false ? "（已结束）":null}</h3>
                           <p>活动时间：{time}</p>  
                       </li>
                       <li>
                           <Link to={!!this.state.tplData.label?"/make/label="+this.state.tplData.label:"#"} style={this.state.isActivityShow == false ? {display : "none"} : null} onClick={this.handleClick} >我要参加</Link>

                            <a href= "javascript:;" onClick = {this.openShare}>分享</a>
                            <Link to="/activity">更多</Link>
                            <Share isShow = {this.state.isShareShow} title = {this.state.tplData.name}/>
                       </li>
                   </ul>
               </div>
            </div>
        );
    },

    /*登录后跳转*/
    handleClick(){
        //var hashs = location.hash.slice(2);
        // var hashs = "make/label="+this.state.tplData.label;
        // if(hashs == ''){
        //     hashs = '#/'
        // }else if( hashs == 'login'){
        //     hashs = 'user'
        // }
    },

    /*
    * 生成tab 标题html
    */
    generatorActivityTab: function () {
        return (
            <div className="activity-tab">
                <div className="activity-tab-main">
                    <div className="activity-tabs fl">
                        <ul>
                            <li className={this.state.typeTabIndex == 1 ? 'active' : ''} onClick={this.changeTypeTabIndex.bind(this, 1)}>活动介绍</li>
                            <li className={this.state.typeTabIndex == 2 ? 'active' : ''} onClick={this.changeTypeTabIndex.bind(this, 2)}>活动作品</li>
                        </ul>
                    </div>
                    <div className="fr">参加人数：{this.state.activityDate.authors}　活动作品：{this.state.activityDate.nums}　浏览量：{this.state.activityDate.pvs}</div>
                </div>
            </div>
        );
    },

    /*
    * 生成活动介绍html
    */ 
    generatorActivityDetail: function () {
        return (
            <div className="activity-detail" dangerouslySetInnerHTML={{ __html: this.state.tplData.description }}></div>
        );
    },

    /*
    * 生成活动作品html
    */ 
    generatorActivityWorks: function () {
        return (
            <div className="activity-works">
                <div className="activity-works-title">
                    <span className="title">全部作品</span>
                    <div className="activity-works-sort" onClick={this.changeTplOrder.bind(this)}>排序：<i data-type="reupdate_date">时间</i> | <i data-type="read_pv">热度</i></div>
                </div>
                {this.state.tplContent}
            </div>
        );
    },    

    render: function () {
        return (
            <div className="inner">
                {/*banner*/}
                { this.generatorBanner() }
                {/*tab 标题*/}
                { this.generatorActivityTab() }
                {/*活动介绍*/} 
                {this.state.typeTabIndex == 1 ? this.generatorActivityDetail() : void 0 } 
                { /*活动作品*/ }
                {this.state.typeTabIndex == 2 ? this.generatorActivityWorks() : void 0 }  
            </div> 
        );
    },

    changeTypeTabIndex:function(typeIndex){
        this.setState({
            typeTabIndex:typeIndex
        })
    },

    componentDidMount: function () {
        this.unsubscribe = ActivityStore.listen(this.onChanges);
        var tid = this.getTid();
        ActivityAction.getActivtiy(tid);
    },

    componentWillUnmount: function () {
       this.unsubscribe();
    }, 


    getTid: function () {
        var url = window.location.pathname;
        if(url.indexOf("tid=") != -1) {
            var tid = url.substr(url.indexOf("tid=")+4);
            return tid;
        }
    },

    onChanges : function (data) {　
        var _this = this;
        this.getWorkInfo(data.label).then(function (act) {
            var isShow = _this.isActivityShow(data);
            _this.setState({
                tplData : data,
                tplContent : <LoadingComponent pageSize={ 10 } orderCondition={{ orderCondition: _this.state.order+" desc" }} whereCondition={ { whereCondition: {'label =': "'"+data.label+"'", 'tpl_type =': 11, 'approved =' : 1}} } />,
                activityDate : act,
                isActivityShow : isShow
            });
        });
    },

    changeTplOrder : function (e) {
        var _this = this;
        if (e.target.nodeName != 'I') {
            return false;
        }

        this.setState({
            order : e.target.dataset.type,
            tplContent : null
        },function () {
            _this.setState({
                tplContent : <LoadingComponent pageSize={ 10 } orderCondition={{ orderCondition: this.state.order+" desc" }} whereCondition={ { whereCondition: {'label =': "'"+this.state.tplData.label+"'", 'tpl_type =': 11, 'approved =' : 1}} } />
            })
        });
    },

    getWorkInfo : function (label) {
        var context = this;

        var SQLCondition = {
            fieldColumn: 'count(*),*',
            whereCondition:{
                'label in ': JSON.stringify(label).replace(/[\[\]"]/g, function (reason) { return reason === ']' ? ')' : reason === '[' ? '(' : '\'' }),
                'tpl_type = ': 11,
                'approved = ': 1
            }
        };

        return new Promise(function (resolve, reject) {

            tplobjModel
                .getTplObjs(SQLCondition)
                .then(function (data) {
                    var nums = data.results.length; //作品总数
                    //求pv总数
                    var pvs = 0;
                    if(data.results.length){
                        pvs = data.results.map (function(item){
                            return item.attributes.read_pv || 0;
                        }).reduce(function(prev,next){
                            return prev + next;
                        });
                    }

                     var authors = 0; //参赛人数

                    if(data.results.length != 0){
                        var authors_arr = [];
                        for(var i= 0; i < nums; i++){
                           authors_arr[i] = data.results[i].attributes.author;
                        }

                        var authors = context.arrayUnique(authors_arr).length;  
                    }

                    resolve({
                        nums: nums,
                        pvs: pvs,
                        authors: authors
                    });

                })
                .catch(function (error) {
                    reject(error);
                });
        });
    },
    arrayUnique: function (arr) {
        var result = [], hash = {};
        for (var i = 0, elem; (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;  
    },
    openShare : function (){
        this.setState({
            isShareShow : !this.state.isShareShow
        });
    },
    isActivityShow : function (data) {
        var now = new Date();
        var endTime = data.end_date;
        if (now.getTime() < endTime.getTime()) {
            return true
        }else {
            return false
        }
    }
}));

// export DesignerRule component
module.exports = ActivityDetail;