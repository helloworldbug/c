/**
 * @module      ApplyFinal
 * @description 3.0设计师模块 -> rule
 * @time        2015-10-19
 * @author      misterY 
*/

'use strict';
// require core module
var React = require('react');

var Base = require('../../utils/Base');
var ImageModules = require('../Mixins/ImageModules');
import {Link} from 'react-router'

// define ApplyFinal component
var ApplyFinal = React.createClass({

    mixins: [ImageModules],

    /**
     * 跳转到 router
    */
    

    getInitialState() {
        this.props.changePrompt(" ");
        this.props.changeModuleTitle("none");
        return {
            content: null
        }
    },

    /*
     * 初始化渲染执行之前立刻调用
    */
    componentWillMount(){
        this.props.changePrompt(" ");
        this.props.changeModuleTitle("none");
        this.getHtml(this.props.user);
    },

    componentWillReceiveProps(np){
        this.props.changePrompt(" ");
        this.props.changeModuleTitle("none");
        this.getHtml(np.user);
    },

    repeatApply() {

        if( Base.setUserInfo({
            approved_status: 0,
            user_type: 0
        }) ){
            if(Base.setUserInfo({approved_status: 0,user_type: 0})) {
                Base.linkToPath("/designer");
            }
        }
    },

    getHtml(status) {
        switch (parseInt(status)){
            case 0:
                this.setState({
                    content :  (
                        <div className="ok-privilege">
                            <p style={{height:'1px'}}></p>
                            <span className="okPrivilegeTitle">
                            {/*<img style={{position:"relative",top:"5px",marginRight:"12px"}} src={this.defineImageModules()['authenticationOkIcon']} />
                                啊！您似乎遗漏了什么，导致设计师申请资格未能通过</span>
                            <span>提交优秀的作品会提高通过的几率</span>*/}
                            <img src={this.defineImageModules()['designer_failure']} width="848" height="45" />
                            </span>
                            <p className="invite-p-link">
                                <a onClick={this.repeatApply} className="btn-navy btn-fill-vert-o" href="javascript:void(0)">重新申请</a> 
                            </p> 
                        </div>
                    )
                });
                break;
            case 1:
                this.setState({
                    content : (
                        <div className="ok-privilege">
                            <p style={{height:'1px'}}></p>
                            <span className="okPrivilegeTitle">
                            {/*<img style={{position:"relative",top:"5px",marginRight:"12px"}} 
                                src={this.defineImageModules()['authenticationIngIcon']} />
                            您的设计师资格正在审核中，请稍等*/}
                            {/*<img src="../assets/images/designer/examine.png" />*/}
                            <img src={this.defineImageModules()['designer_examine']} width="786" height="46" />
                            </span>
                            <p className="invite-p-link">
                                <Link className="btn-navy btn-fill-vert-o" target="_blank" to="/make">去做新作品</Link>
                                <Link className="btn-navy btn-fill-vert-o" to="/discovery">去看看作品</Link>
                            </p> 
                        </div>
                    )
                });
                break;
            case 2:
                this.setState({
                    content: (
                        <div className="ok-privilege ">
                            <p style={{height:"1px"}}></p>
                            <span className="okPrivilegeTitle">
                            {/*<img style={{position:"relative",top:"5px",marginRight:"12px"}} src={this.defineImageModules()['authenticationOkIcon']} />
                                恭喜，您已成为ME认证设计师！
                            </span>
                            <span>您的作品有机会获得ME多渠道终端推广</span>*/}
                            {/*<img src="../assets/images/designer/success.png" />*/}
                            {/*<img src={this.defineImageModules()['designer_success']} width="708" height="46" />*/}
                            <img src={this.defineImageModules()['designer_success']} width="708" height="46" />
                            </span>
                            <p className="invite-p-link">
                                <Link className="btn-navy btn-fill-vert-o" target="_blank" to="/make">去做新作品</Link>
                                <Link className="btn-navy btn-fill-vert-o" to="/discovery">去看看作品</Link>
                            </p> 
                        </div>
                    )
                });
                break;
            default:
                this.setState({
                    content :  (
                        <div className="ok-privilege">
                            <p style={{height:"1px"}}></p>
                            <span className="okPrivilegeTitle">
                            {/*<img style={{position:'relative',top:'5px',marginRight:'12px'}} src="/images/user/authenticationIngIcon.png" />啊！您似乎遗漏了什么，导致设计师申请资格未能通过</span>
                            <span>提交优秀的作品会提高通过的几率</span>*/}
                            <img src="../assets/images/designer/failure.png" />
                            </span>
                            <p className="invite-p-link">
                                <a onClick={this.repeatApply} className="btn-navy btn-fill-vert-o" href="javascript:void(0)">重新申请</a> 
                            </p> 
                        </div>
                    )
                });
                break;
        }
    },

    render() {
        return (
            <div style={{width:"100%",height:"100%"}}>
                {this.state.content}
            </div>
        );
    }
});
// export ApplyFinal component
module.exports = ApplyFinal;
