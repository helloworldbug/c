/**
 * @module      Designer
 * @description 3.0设计师模块
 * @time        2015-10-19
 * @author      misterY 
*/

'use strict';
// require core module
var React = require('react');
 import  { Link } from 'react-router';

require('../../../assets/css/mistery-base.css');
require('../../../assets/css/designer.css');

var Base = require('../../utils/Base');

var ImageModules = require('../Mixins/ImageModules');

// define User component
var Designer = React.createClass({

    mixins: [ ImageModules],

    getInitialState() {
        return {
        }
    },

    /**
     * 跳转到 router
    */
    goUrl(a_router,param,query) {
        Base.linkToPath(a_router);
    },

    getHtml(userStatus){
        switch(parseInt(userStatus)) {
            default:
            case 0:
                return (
                        <div className="designer-module-content bg tc font">
                            <div>
                                <p>
                                    {/*<img src="../../../assets/images/designer/wz.png" />*/}
                                    <img src={this.defineImageModules()['designer_index']} width="361" height="45" /> 
                                </p>
                                <p>申请成为ME认证设计师，打造自己的品牌</p>
                            </div>
                            <div className="designer-button">
                                <ul>
                                    <li><Link className="btn-navy btn-fill-vert-o" to="/designer/apply">立即申请</Link></li>
                                    <li><Link className="btn-navy btn-fill-vert-o" to="/designer/code">我有邀请码</Link></li>
                                    <div className="clear"></div>
                                </ul>
                            </div>
                        </div>
                    );
                break;
            case 1:
                this.goUrl("/designer/apply");
                break;
            case 2:
                this.goUrl("/designer/apply");
                break;
        }
    },

    render() {
        var h = this.getHtml(Base.getUserInfo("approved_status"));
        return (
            <div className="inner designer-module fixed">
                {h}
            </div>
        )
    }
});

// export Designer component
module.exports = Designer;
