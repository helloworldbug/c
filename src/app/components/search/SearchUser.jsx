/**
 * @description 用户搜索内容
 * @time 2016-2-23
 * @author 刘华
 */

var React = require('react');
var tpl = require('../../utils/tpl');
var ImageModules = require('../Mixins/ImageModules');
import {Link} from 'react-router'

var SearchUser = React.createClass({
	getInitialState : function () {
		this.mounted=true;
		return {
			recom : []
		}
	},
	componentWillMount : function () {
		this.mounted=false;
	},
	componentDidMount : function () {
		//获取推荐用户信息
		var _this = this;
		var recomUser = [];
		//取得用户ID
		tpl.searchRecommendUser().then(function(data){
			recomUser = data;
			//根据ID 获取所有作品 计算PV STORE
			var promiseArr = data.map(function (item) {
				return tpl.searchUserWork(item.id);
			});

			Promise.all(promiseArr).then(function(r){
				if(this.mounted){
					for (var i = 0;i < recomUser.length ;i++) {
						$.extend(recomUser[i],r[i]);
					}
					_this.setState({
						recom : recomUser
					});
				}

			});
		});
	},
	render : function () {
		var _this = this;
		var loading = null;
		var allLoading = null;
		/*
		 loading 动画内容
		 messageMode 未找到相应结果提示

		 */
		if(this.props.isLoading=="allLoading"){
			allLoading=<div className="allLoading"><div className="loader"></div><span className="HardLoading">正在努力加载中</span></div>
		}
		if(this.props.isLoading == 'userLoading'){
			loading=<div className="pro-loading loader"></div>;
		}
		var messageUser=(this.props.userStore.length==0&&this.props.isLoading!="allLoading"&&this.props.userNumber==0?<div className="noFindMessage"><div className="noFindLogo"></div>没有找到相关用户</div>:null);
		return (
			<div className='seachUserFrame'>
				<div className='userLContent'>
					{loading}
					{allLoading}
					{messageUser}
					{this.props.userStore.map(function(item){
						var picture = typeof item.user_pic == 'string' && item.user_pic.length>0 ? item.user_pic:ImageModules.defineImageModules().defaultUserLogo;
						return (
							<div className='eachUser'>
								<a href={'#designerDetail/uid='+item.uid} target='_blank'><img className='UserSearchImg' src={picture}/></a>
								<div className='UserSearchDatail'>
									<p>{item.user_nick}</p>
									<p>{item.user_sign||'这个用户很懒，木有签名'}</p>
									<p>
										<span>{item.pv}</span>
										<span>{item.store_count}</span>
									</p>
								</div>
								<div className='userWork'>
									<span>{item.work.length<1?null:<Link to={'/preview/tid='+item.work[0].attributes.tpl_id} target='_blank'><img src={item.work[0].attributes.tpl_share_img}/><span></span></Link>}</span>
									<span>{item.work.length<2?null:<Link to={'/preview/tid='+item.work[1].attributes.tpl_id}><img src={item.work[1].attributes.tpl_share_img}/><span></span></Link>}</span>
									<span>{item.work.length<3?null:<Link to={'/preview/tid='+item.work[2].attributes.tpl_id}><img src={item.work[2].attributes.tpl_share_img}/><span></span></Link>}</span>
								</div>
							</div>
						)
					})}
				</div>
				<div className='userRecommend'>
					<div>推荐用户</div>
					{this.state.recom.map(function (item,index) {
						return (
							<div className='eachRecommendUser' key={index}>
								<a href={'#designerDetail/uid='+item.id} target='_blank'><img src={item.attributes.user_pic}/></a>
								<div>
									<p>{item.attributes.user_nick}</p>
									<p><span>{item.pv}</span></p>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		)
	}
});

module.exports = SearchUser;