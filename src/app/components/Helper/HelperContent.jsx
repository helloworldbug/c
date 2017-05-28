/**
 * @module      HelperContent
 * @description 帮助中心内容
 * @time        2015-11-2
 * @author      Liu
 */

'use strict';

// require core module
var React = require('react');
var HelperBox = require('../Common/HelperBox');
var HelperAction = require('../../actions/HelperAction');

// define HelperContent component
var HelperContent = React.createClass({

    getInitialState(){
        this.mounted=true;
        console.log(this.props);
        return {
            content: [],
            time   : 0
        }
    },
    componentWillUnmount:function(){
        this.mounted=false
    },
    componentWillReceiveProps(np){
        //接收到新标签
        this.getStateByDataType(np.type);
    },

    getStateByDataType(type) {
        var _this = this;
        //获取对应标签的数据
        HelperAction.getHelpCenter(type, function (data) {
            if(_this.mounted){
                _this.setState({
                    content: data
                });
            }

        }, function () {
            alert("程序出错");
        });
    },

    render() {
        var content = this.state.content.map((data, index)=> {
            //带参数第一次进入指定标签 之后默认不展开
            var time = this.props.time;

            if (index == 0 && !this.props.index) {//默认展开第一个，当key为空时
                return (
                    <HelperBox key={index} attr={data} isOpen={true}/>
                )
            } else if (index == this.props.index && time == 0) {
                return (
                    <HelperBox key={index} attr={data} isOpen={true}/>
                )
            } else {
                return (
                    <HelperBox key={index} attr={data} isOpen={false}/>
                )
            }

        });
        return (
            <div className="helper_content">
                {content}
            </div>
        );
    }
});
// export HelperContent component
module.exports = HelperContent;