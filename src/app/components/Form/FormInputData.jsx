'use strict';
var React = require('react');
var CustormDataModel = require("../../utils/CustormDataModel");
var UserService = require("../../utils/user.js");
var custormDataMode;

var formInput =React.createClass({
	dataTypeMap:{cd_phone:"手机",cd_area:"地区",cd_username:"姓名",cd_email:"邮箱",cd_constellation:"星座",cd_description:"自定义",cd_unit:"单位",cd_qq:"QQ",cd_sex:"性别"},
	getInitialState:function(){
        return {
            dataContent:null,
            dataHideTable:null,
            dataIndexContent:[],
            dataCurrentPage:1,
            pageindex:1,
            hideTable:false
        }
    },
	componentWillMount:function(){
		custormDataMode = new CustormDataModel({
            uid: fmacloud.User.current()?fmacloud.User.current().id:null,
            orderDirection: 0
        });
        this.getCurrentPageData(this.state.dataCurrentPage);
        this.getIndex();
        this.getHideForm();
    },
    componentWillReceiveProps:function(nextProps){
    	this.getCurrentPageData(this.state.dataCurrentPage);
    	this.getIndex();
    	this.getHideForm();
    },
    componentDidUpdate:function(){
    	// var subscript=$(".subscript");
    	// var mLeft=-subscript.width()/2;
    	// subscript.css("margin-left",mLeft);
    },
	render:function(){
		var _this=this;
		var dataType=this.props.data.dataType;
		return (
			<div>
				<div className="panelbar">
					<span href="#" className="exce" id="exce" onClick={this.exportExcel}>导出Excel</span>
				</div>
				<div className="tables">
					<div>
						<table className="tableContent" id="tableContent">
						<tr>{dataType.map(function(item){
							return <td>{_this.dataTypeMap[item]}</td>
						})}</tr>
						{this.state.dataContent}
						</table>
					</div>
					<div className="subscript" onSelectStart="return false">
						<span className="previous" onClick={this.prevPage}></span>
						<div className="pagenumber">
							<div>{this.state.dataIndexContent.map((item)=>{
								return  <span data-pagenumber={item} className={this.state.dataCurrentPage==item?"active":""} onClick={this.changeIndex.bind(this,-1)}>
											<div data-pagenumber={item}></div>
											<span data-pagenumber={item} className={this.state.dataCurrentPage==item?"":"hide"}>{item}</span>
										</span>
							})}</div>
						</div>
						<span className="next" onClick={this.nextPage}></span>
					</div>
				</div>
				<table id={this.props.data.tid} style={{display:"none"}}>
					<tr>{dataType.map(function(item){
						return <td>{_this.dataTypeMap[item]}</td>
					})}</tr>
					{this.state.dataHideTable}
				</table>
			</div>
			)
	},
	getCurrentPageData:function(index){
		var _this=this;
		custormDataMode.set({ skip: (index-1)*10, limit: 10 }).getCustormData(this.props.data.tid, null, null, 'find',
        (data) => {
        	console.log(data);
        	var type = _this.props.data["dataType"];
            this.setState({
            	dataContent:data.map((item)=>{
            		var data=item;
            		return <tr>{type.map(function(item){
            			return <td>{data.attributes[item]==undefined?"未填写":data.attributes[item]}</td>
            		})}</tr>
            	}),
            	pageindex:this.getPageIndex(index)
            })
        },
        () => {
        })
	},
	getIndex:function(){
		var content=[];
		if(this.props.data.dataType.length!=0){

			if(this.state.pageindex==10||this.state.dataCurrentPage==1){
				for(var i=(this.state.dataCurrentPage!=1?parseInt(this.state.dataCurrentPage)+1:1);i<=this.props.data.dataPageCount;i++){	
					content.push(i);
					if((i>=10)&&(i%10==0)){break;}
				}	
			}else if(this.state.pageindex==1){
				for(var i=parseInt(this.state.dataCurrentPage-10);i<this.props.data.dataPageCount;i++){
					content.push(i);
					if((i>=10)&&(i%10==0)){break;}
				}
			}
		}
		this.setState({
			dataIndexContent:content
		});
	},
	changeIndex:function(value,e){
		var page;
		if(value==-1){
			page=e.target.dataset.pagenumber;
		}else{
			page=value;
		}
		this.setState({
			dataCurrentPage:page,
		});
		this.getCurrentPageData(page);
	},
	nextPage:function(){
		var val=this.state.dataCurrentPage+1;
		if(this.state.dataCurrentPage<this.props.data.dataPageCount){
			val=this.state.dataCurrentPage+1;
			if(this.state.pageindex!=10){
			}else{
				this.setState({
					dataCurrentPage:val,
				})
				this.getIndex();
			}
			this.changeIndex(parseInt(this.state.dataCurrentPage)+1);
		}
	},
	prevPage:function(){
		var val;
		if(this.state.dataCurrentPage>1){
			val=this.state.dataCurrentPage-1;
			if(this.state.pageindex!=1){

			}else{
				this.setState({
					dataCurrentPage:val,
				})
				this.getIndex();
			}
			this.changeIndex(parseInt(this.state.dataCurrentPage)-1);
		}
	},
	getPageIndex:function(){
		var str=(this.state.dataCurrentPage).toString();
		var index=parseInt(str.substr(str.length-1,1));
		if(index==0){
			index=10;
		}
		return index
	},
	getHideForm:function(){
		if(this.props.data.dataType.length==0){
			return
		}
		
		var _this=this;
		var dataStore=[];
		var type = _this.props.data["dataType"];
		

		// this.setState({
		// 			dataHideTable:dataStore.map((item)=>{
		// 				var data=item;
		// 				return <tr>{type.map(function(item){
		// 					return <td>{data.attributes[item]==undefined?"未填写":data.attributes[item]}</td>
		// 				})}</tr>
		// 			}),
		// 		});
		custormDataMode.set({ skip: 0, limit: 900 }).getCustormData(this.props.data.tid, null, null, 'find',
			(data) => {
				this.setState({
					dataHideTable:data.map((item)=>{
						var data=item;
						return <tr>{type.map(function(item){
							return <td>{data.attributes[item]==undefined?"未填写":data.attributes[item]}</td>
						})}</tr>
					}),
				});
			},
			() => {
			});

		var getDataForHideTable=function(times){
			if(times==0){
				this.setState({
					dataHideTable:dataStore.map((item)=>{
						var data=item;
						return <tr>{type.map(function(item){
							return <td>{data.attributes[item]==undefined?"未填写":data.attributes[item]}</td>
						})}</tr>
					}),
				});
				return
			}
			custormDataMode.set({ skip: (times-1)*10, limit: 900 }).getCustormData(this.props.data.tid, null, null, 'find',
				(data) => {
					dataStore.push(data);
				},
				() => {
				});
			getDataForHideTable(times--);
		}
		// getDataForHideTable(this.props.data.runTime);
	},
	exportExcel:function(){
		UserService.exportExcel(this.props.data.tid);
	}
})
module.exports=formInput