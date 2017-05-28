/**
 * @module      DesignerApply
 * @description 3.0设计师模块 -> 申请
 * @time        2015-10-19
 * @author      misterY 
*/

'use strict';
// require core module
var React = require('react');

var ApplyWork = require('./ApplyWork'),
    ApplyUserInfo = require('./ApplyUserInfo'),
    ApplyFinal = require('./ApplyFinal');

var DesignerAction = require('../../actions/DesignerAction');

var Base = require('../../utils/Base');

var ImageModules = require('../Mixins/ImageModules');

// define DesignerApply component
var DesignerApply = React.createClass({

    mixins: [ImageModules],

    getInitialState(){
        return {
            content: null,
            progres: 1,
            prompt: "选择3个作品提交，展示你的创作能力",
            moduleTitle: "block"
        }
    },

    /**
     * 跳转到 router
    */
   

    componentDidMount(){
        if( !Base.isLogin() ){
            Base.linkToPath("/login");
        }
        var _userStatus = Base.getUserInfo("approved_status"),
            _userType = Base.getUserInfo("user_type");
        if( 1 === parseInt(_userType) ){
            this.setState({
                progres: 3
            },function(){
                this.initialProgress(this.state.progres);
            }.bind(this));
        }else{
            this.initialProgress(this.state.progres);
        }
    },

    initialProgress(progres){
        var _userStatus = Base.getUserInfo("approved_status");
        switch ( parseInt(progres) ){
            default:
            case 1:
                DesignerAction.clear();
                this.setState({
                    content: <ApplyWork 
                        DesignerAction={DesignerAction} 
                        changePrompt={this.changePrompt} 
                        nextProgres={this.nextProgres} />
                });
                break;
            case 2:
                this.setState({
                    content: <ApplyUserInfo 
                        DesignerAction={DesignerAction} 
                        changePrompt={this.changePrompt} 
                        nextProgres={this.nextProgres} />
                });
                break;
            case 3:
                this.setState({
                    content: <ApplyFinal 
                        DesignerAction={DesignerAction} 
                        changePrompt={this.changePrompt} 
                        user={_userStatus}
                        changeModuleTitle={this.changeModuleTitle} />
                });
                break;
        }
    },

    nextProgres(p) {
        var _p = (p==undefined)?this.state.progres+1:p;
        this.setState({
            progres : _p
        },function(){
            this.initialProgress(this.state.progres);
        }.bind(this));
    },

    changePrompt(p){
        this.setState({
            prompt: p
        });
    },
    changeModuleTitle(p){
        this.setState({
            moduleTitle: p
        });
    },

    render() {
        var style = {
            width:150,height:0,border:'1px solid #000',margin:'12px 5px auto 5px'
        }
        return ( 
            <div className="designer-module"> 

                    <div className="speed">
                        <ul className={"nav_ul_"+this.state.progres+"_active"}>
                            <li>提交作品</li>
                            <li>完善资料</li>
                            <li>审核状态</li>
                        </ul>
                    </div>
                    
                    <p style={{display:this.state.moduleTitle}} className="section-title">
                        {/*<img src="../assets/images/designer/ds.png"/>*/}
                        <img src={this.defineImageModules()['designer_invite']} width="160" height="27" /> 
                    </p>
                    <p className="paragraph">{this.state.prompt}</p>
                    {this.state.content}

            </div>
 
        );
    }
});

// export DesignerApply component
module.exports = DesignerApply;
