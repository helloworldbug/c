/**
 * @description 电商管理
 * @time 2016-07-26
 * @author 杨建
 */

'use strict';

// require core module
var React = require('react');
import {Link} from 'react-router'
var pic = require('../../../assets/images/user/pic.png');
var youzan = require('../../../assets/images/user/youzan.png');
var weimob = require('../../../assets/images/user/weimob.png');
var weidian = require('../../../assets/images/user/weidian.png');

var ElectricitySupplier = React.createClass({

    render: function () {

        return (
            <div className="domainBind">
                <div className="domainSetting">
                    <h3 className="title"><span className="panelName">电商管理</span>
                        <div className="right"><Link to="/helper?type=ME 操作基础&index=5" className="setDomain button">ME商城案例</Link></div>
                    </h3>
                    <div className="content ds-content">
                        <h3>ME电商管理</h3>
                        <h3>电商搭建、自媒体互动营销链接商品一体化</h3>
                        <div className="con">
                            <p>从搭建电商到自媒体互动营销，ME电商为你提供全新商业模式的解决方案；</p>
                            <p>以全媒体互动形式链接商品，深入挖掘媒体内容的商业价值，提高自媒体的变现能力；</p>
                        </div>
                        <div className="pic">
                            <img src={pic} />
                        </div>
                        <h3>管理流程</h3>
                        <ul>
                            <li>入驻电商平台，免费开店</li>
                            <li>管理商品，上线营业</li>
                            <li>作品添加商品链接，参与推广活动</li>
                        </ul>
                    </div>
                </div>
                <div className="setter-box">
                    <h3 className="title"><span className="panelName">立即开店</span></h3>
                    <div className="content">
                        <ul className="seller">
                            <li><a href="https://youzan.com/shangjia" target="_blank" title="有赞"><img src={youzan} width="93" height="40" alt="有赞" /></a></li>
                            <li><a href="http://www.weimob.com/website/business.html" target="_blank" title="微盟"><img src={weimob} width="199" height="40" alt="微盟" /></a></li>
                            <li><a href="http://www.weidian.com/" target="_blank" title="微店"><img src={weidian} width="75" height="40" alt="微店" /></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

});

module.exports = ElectricitySupplier;