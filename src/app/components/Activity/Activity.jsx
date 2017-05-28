// 文件名：  ActivityDetail.jsx
// 创建人：  YJ
// 创建日期：2015/12/29 14:59
// 描述：    活动列表

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

var MeActionCreators = require('../../actions/NewMeActionCreator');

var ActivityStore    = require('../../stores/ActivityStore'); 

var tplobjModel = new TplObjModel();

// 实例化Model类
var model = new Model(); 
model.set('tableName', 'me_activity');

var Activity = MePC.inherit(SuperLogicComponent, SuperTemplateComponent, React.createClass({

    /*
     * 获取活动数据
    */
    getActivitys: function (currentPage) {
        currentPage = currentPage || 1;

        var SQLCondition = {
            fieldColumn: '*', 
            whereCondition:{
                'approved  = '  : 1,
                'data_site !=' : 1
            },
            orderCondition: 'order_number desc',
            currentPage: currentPage,
            pageSize: 1000
        };

        var SQLConditionStr = model.getQuerySQLByCondition(SQLCondition); 

        return new Promise(function(resolveFunc, rejectFunc) {
            fmacloud.Query.doCloudQuery(SQLConditionStr, {
                success: resolveFunc,
                error: rejectFunc
            });    
        }); 

    },

    /*
     * 渲染活动数据
    */ 
    renderActivitys: function () {

        var context = this;

        context
          .getActivitys()
          .then(function(data) { 
 
            var doing, end, datas,
                curDate = Date.parse(new Date());

            var activityCount = data.results.length;
 
            /*正在进行中的活动*/
            doing = data.results.filter(function(item){
                return Date.parse(item.attributes.end_date) > curDate;
            });

            /*结束的活动*/ 
            end = data.results.filter(function(item){ 
                return Date.parse(item.attributes.end_date) < curDate;
            });
 
            context.setState({
                'activity_counts': activityCount,
                'doing_counts'   : doing.length,
                'end_counts'     : end.length
            });

            switch(this.state.tabIndex){
              case 1:
                  datas = data.results;
                  break;
               case 2:
                  datas = doing;
                  break;
               case 3:
                  datas = end;
                  break;
               default:
                  datas = data.results;
            } 

            MeActionCreators.showActivity({
              data: datas,
            });

          }.bind(this))
          .catch(function () {});
    },

    /*
    * 获取活动数据 Store
    */ 
    getActivityStore: function (store) {
        return store ? { activityStores : store } : { activityStores : void 0 };
    },

    /*
     *  更新活动数据状态
    */ 
    onChangeActivity: function () {
        this.setState(this.getActivityStore(ActivityStore.getActivity()));
    },

    /*
     * 获取活动作品信息
    */ 
    getWorkInfo: function (label) {
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

    /*
     * 数组去除重复
    */
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

    /*
    * 生成 tabs 标题 html
    */
    generatorActivityListTabs: function () {
        return (
            <div className="activity-lists-tabs clearfix">
                <ul>
                    <li className={this.state.tabIndex == 1 ? 'active' : ''} onClick={this.changeTabIndex.bind(this, 1)}>全部活动（{this.state.activity_counts}）</li>
                    <li className={this.state.tabIndex == 2 ? 'active' : ''} onClick={this.changeTabIndex.bind(this, 2)}>进行中（{this.state.doing_counts}）</li>
                    <li className={this.state.tabIndex == 3 ? 'active' : ''} onClick={this.changeTabIndex.bind(this, 3)}>已结束（{this.state.end_counts}）</li>
                </ul>
            </div>
        );
    },

    /*
    * 生成 活动列表 html
    */
    generatorActivityLists: function () {  

        var activity =  MePC.isType(this.state.activityStores, 'array') &&  this.state.activityStores.map((function(activity) {  
            return (
                <dl>
                    <dt>
                        <h3><Link to={ '/activityDetail/tid=' + activity.id }>{activity.attributes.name}</Link>　　<span className="color-f15">{this.compareDate(activity.attributes.end_date)}</span></h3>
                        <div>
                            <div className="fl">活动时间：<span className="color-f15">{Base.formattime(activity.attributes.start_date, 'yyyy/MM/dd')}-{Base.formattime(activity.attributes.end_date, 'yyyy/MM/dd')}</span></div>
                            <div className="fr color-f15" id={ activity.id }>
                                { 
                                    !this['checkIsRender' + activity.id] && this.getWorkInfo(activity.attributes.label)
                                        .then(function (workInfo) { 
                                            return workInfo;
                                        })
                                        .then((function (aid, workInfo) {
                                            
                                                this.setState({
                                                    [ 'pvs' + aid ]: workInfo.pvs,
                                                    [ 'authors' + aid ]: workInfo.authors,
                                                    [ 'nums' + aid ]: workInfo.nums
                                                });

                                                this['checkIsRender' + activity.id] = true;
                                                
                                        }).bind(this, activity.id))
                                }
                                <span>{ this.state['pvs' + activity.id] }</span>
                                <span>{ this.state['authors' + activity.id] }</span>
                                <span>{ this.state['nums' + activity.id] }</span> 
                            </div>
                        </div>
                    </dt>
                    <dd>
                        <Link to={ '/activityDetail/tid=' + activity.id }><img src={activity.attributes.activity_img} alt={activity.attributes.name} /></Link>
                    </dd>
                </dl>
            );
        }).bind(this));   

        return (
            <div className="activity-lists clearfix">
                { activity } 
            </div>
        );
    },

    // 初始化状态
    getInitialState: function () {
       return $.extend(
        {
            tabIndex : 1
        },
        this.getActivityStore()
        );
    },

    changeTabIndex: function(typeIndex){
        this.setState({
            tabIndex:typeIndex
        });
        this.renderActivitys();
    },

    compareDate: function(date) {
        return Date.parse(date) > Date.parse(new Date()) ? '进行中' : '已结束';
    },

    render: function () {
        return (
            <div className="inner">
                {/* tabs 标题*/}
                { this.generatorActivityListTabs() }
                {/*活动列表*/}
                { this.generatorActivityLists() } 
            </div> 
        );
    }, 

    componentDidMount: function () {
        ActivityStore.addChangeListener(this.onChangeActivity);
        this.renderActivitys();
    },

    componentWillUnmount: function () {
       ActivityStore.removeChangeListener(this.onChangeActivity);
    }

}));

// export DesignerRule component
module.exports = Activity;