/**
 * @description 数据统计
 * @time 2016-7-25
 * @author 杨建
*/

'use strict';

// require core module
var React = require('react');
var ImageModules = require('../Mixins/ImageModules');
var CollectionBox = require('./CollectionBox');
import {Link} from 'react-router'
require('../../../assets/css/user-tabs.css');

var UserDataCollection = React.createClass({

	render:function(){
        var template = this.props.templates || [];
        var content = template.map(function(data, index){
            return <CollectionBox key={index} data={data}/>
        });

        var noData = null;
        if(template.length === 0) {
            noData = (<div className="no-works"><div className="word">没有相关作品，试着<Link to="/create">创建</Link>一份ME作品</div></div>);
        }

		return (
            <div>
                {content}
                {noData}
            </div>
        )
	}
});

module.exports= UserDataCollection;