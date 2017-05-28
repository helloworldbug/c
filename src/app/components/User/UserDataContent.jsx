/**
 * @description 个人中心数据统计
 * @time 2015-10-26
 * @author 刘华
 */

'use strict';

// require core module
var React = require('react');
var CommonUtils = require('../../utils/CommonUtils');
var MeAPI = require('../../utils/MeAPI');
var Forms = require('../Form/Form');
require('../../../assets/css/user-tabs.css');

var setting = React.createClass({
    getInitialState  : function () {
        return {
            tplData      : [],
            dataCount    : 0,
            isContentShow: false,
            tid          : null
        }
    },
    render           : function () {
        var a = null;
        if (this.state.isContentShow == true && this.props.data.dataCount > 0) {
            a = <div className={this.state.isContentShow==true?"dataframe":"dataframe beHide"} ref="content">
                <Forms params={{tid: this.props.data.attributes.tpl_id}} dataCount={this.props.data.dataCount}/>
            </div>;
        }

        return (
            <div>
                <div className={this.props.data.dataCount>0?"dataRow pointer":"dataRow"} onClick={this.openData}>
                    <span className="dataImgSpan"><img src={this.props.data.attributes.effect_img.substr(3)}/></span>
                    <span className="dataTextSpan">{this.props.data.attributes.name}</span>
                    <span className="dataReadCountSpan">{this.props.data.attributes.read_pv}</span>
                    <span
                        className="creatData">{CommonUtils.fromNow(parseInt(this.props.data.attributes.reupdate_date) * 1000)}</span>

                    {this.props.data.dataCount > 0 ? <span className="createArrow"></span> : null}
                </div>
                {a}
            </div>
        )
    },
    componentDidMount: function () {
        // 查数据数
        //var me = this;
        //
        //MeAPI.getDataCount(this.props.data.attributes.tpl_id).then(function (count) {
        //    if (count > 0) {
        //        me.setState({
        //            dataCount: count
        //        });
        //    }
        //    else {
        //        me.setState({dataCount: count});
        //    }
        //
        //});
    },
    openData         : function () {
        this.setState({
            isContentShow: !this.state.isContentShow
        });
    }
});

module.exports = setting;
