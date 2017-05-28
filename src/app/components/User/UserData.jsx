/**
 * @description 个人中心数据统计
 * @time 2015-10-26
 * @author 刘华
*/

'use strict';

// require core module
var React = require('react');
import {Link} from 'react-router'
var ImageModules = require('../Mixins/ImageModules');
var MeAPI = require('../../utils/MeAPI');
var Base= require('../../utils/Base');
var DataContent = require('./UserDataContent');
require('../../../assets/css/user-tabs.css');


var UserData=React.createClass({
    getInitialState:function(){
        return {
            tplData:[],
            finished:false
        }
    },
    componentWillMount:function(){
        var _this=this;
        //查询所有我的作品数据
        var uid=fmacloud.User.current().id;
        var sql="select count(*),* from tplobj where tpl_type=11 and tpl_state=2 and tpl_delete=0 and author='"+uid+"' order by reupdate_date desc";
        fmacloud.Query.doCloudQuery(sql).then((data)=>{

            this.getDataCount(data.results,0);
            //_this.setState({
            //    tplData:
            //});

        }).catch(err=>{
            console.err(err)
        });
    },
    getDataCount:function(tplArr,index){
        if(tplArr.length==0){
            this.setState({
                finished: true
            });
        }
        if(tplArr.length<=index){
            throw "index error"
        }
        MeAPI.getDataCount(tplArr[index].attributes.tpl_id).then( (count) =>{
            if (count > 0) {
                var tplData=this.state.tplData;
                var newItem=tplArr[index];
                newItem.dataCount=count;
                tplData.push(newItem);
                this.setState({
                    tplData: tplData
                });
            }
            if(tplArr.length>index+1){
                this.getDataCount(tplArr,index+1)
            }else{
                this.setState({
                    finished: true
                });
            }
        }).catch(err=>{
            debugger;
  this.setState({
                    finished: true
                });

        });
    },
	render:function(){
        var content = this.state.tplData.map(function(data,index){
            return <DataContent key={index}  data={data}/>
        });
        var noData = null;
        if(!this.state.finished){
            noData = (<div className="loading">
                <div className="loading-box">
                    <div className="loading-boll"></div>
                    <span>正在加载中...</span>
                </div>
            </div>)
        }else{
            if(this.state.tplData.length === 0) {
                noData = (<div className="no-works"><div className="word">没有相关作品，试着<Link to="/create">创建</Link>一份ME作品</div></div>);
            }
        }

		return (
            <div>{content}
                {noData}
            </div>
			)
	},
});

module.exports= UserData;