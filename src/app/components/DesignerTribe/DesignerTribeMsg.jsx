// 文件名：DesignerTribeMsg.jsx
//
// 创建人：曾文彬
// 创建日期：2015/11/10 14:48
// 描述： 设计师个人信息

'use strict';

var React = require('react');
var ReactDOM=require("react-dom");
import {Link} from 'react-router'
var MePC = require('../../lib/MePC_Public');

var Base = require('../../utils/Base');

var SuperLogicComponent = require('../../lib/SuperLogicComponent');

var ImageModules = require('../Mixins/ImageModules');

var model = new (require('../../utils/Model'));

model.set('tableName', '_User');

var MeEvent = require('../../lib/MePC_Event');

var DesignerTribeImg = require('./DesignerTribeImg');

var DesignerTribeMsg = MePC.inherit(SuperLogicComponent, React.createClass({

    generateMosaicChar: function (str, isEmail) {
        var keyWord = isEmail ? /(.{1,4})@/: void 0,
            charsFront = !keyWord ? str.slice(0, -4) : str.replace(keyWord, function (total, other) {
                return '****';
            }),
            overCharLength = isEmail ? 4 : str.length - charsFront.length,
            charsBack = '';

        if (!isEmail) {
            for (var i = 0; i < overCharLength; i++ ) {
                charsBack += '*';
            }

            return charsFront + charsBack;
        } else {
            return charsFront;
        }

    },

    generateTemplate: function (designer, index) {

        var visibleEmail = designer.attributes.email ? (
            <span style={{ marginLeft: "10px" }}>
                    邮箱：{ this.generateMosaicChar(designer.attributes.email, true) }
                </span>
        ) : null;

        var visibleQQ = designer.attributes.qq ? (
            <span style={{ marginLeft: "10px" }}>
                    QQ：{ this.generateMosaicChar(designer.attributes.qq) }
                </span>
        ) : null;

        var visibleSign = designer.attributes.user_sign ? (
            <span>
                    简介：{ designer.attributes.user_sign }
                </span>
        ) : (
            <span>
                    简介：设计师太害羞，什么都没写
                </span>
        );

        var visibleTel = designer.attributes.vipphone ? (
            <span style={{ marginLeft: "10px" }}>
                    手机：{ this.generateMosaicChar(designer.attributes.vipphone) }
                </span>
        ) : null;

        var visibleTelLabel = designer.attributes.user_labels && designer.attributes.user_labels.length > 0 ? (
            <p>聚焦领域：{ designer.attributes.user_labels.join(', ') }</p>
        ) : null;

        return (
            <div key={index} className="designer-display clearfix">
                <div className="designer-lists-up">
                    <div className="designer-lists-info fl">
                        <dl>
                            <dt><Link to={ '/designerDetail/uid=' + designer.id }><img src={ this.generateDefaultUserPic(designer.attributes.user_pic) } width="50" height="50" /></Link></dt>
                            <dd>
                                <h3><Link to={ '/designerDetail/uid=' + designer.id }>{ designer.attributes.user_nick }</Link></h3>

                                { visibleTelLabel }

                                <div className="num-star"><span className="num" ref={ "designer" + designer.id }>{ designer.pv }</span></div>
                            </dd>
                        </dl>
                    </div>

                    <div className="designer-lists-ri fr">
                        <div className="designer-lists-pic1 fl">
                            <DesignerTribeImg uid={ designer.id } isSlice={ true } />
                        </div>
                        <div className="designer-lists-icon fr" onClick={ this.getPageActions('handleSlide') }></div>
                    </div>
                </div>
                <div className="disigner-lists-work clearfix">
                    <p>

                        { visibleSign }

                        { visibleQQ }

                        { visibleTel }

                        { visibleEmail }

                    </p>
                    <div className="designer-lists-pic2 fl">
                        <DesignerTribeImg uid={ designer.id } indexPos={ index } getPVNums={ this.getPVNums.bind(this, designer.id) } />
                    </div>
                </div>
            </div>
        );
    },

    generateSelectSQL: function (selectSQLObject) {
        return model.getSelectSQL(selectSQLObject);
    },

    generateDefaultUserPic: function (userPic) {
        return userPic || ImageModules.defineImageModules().defaultUserLogo;
    },

    setPVs: function (pvs) {
        !this.pvs && (this.pvs = []);

        this.pvs.push(pvs);
    },

    getPVs: function () {
        return this.pvs;
    },

    getPVNums: function (designerId, pvs, index) {
        var designer = 'designer' + designerId;

        ReactDOM.findDOMNode(this.refs[designer]).innerHTML = pvs;
    },

    addPVPrefix: function (pv) {
        if (pv == 0 || pv > 9999) return pv;

        pv = '' + pv;

        var prefixLength = 5 - pv.length, i;

        for (i = 0; i < prefixLength; i++) {
            pv += '0';
        }

        return pv;
    },

    getOriginState: function () {
        return this.state.designers;
    },

    send: function (selectSQLObject) {
        var selectSQL = this.generateSelectSQL(selectSQLObject);

        fmacloud.Query.doCloudQuery(selectSQL, {
            success: (function (_data) {
                if(this.mounted){
                    this.trigger('msgSuccess', _data);
                }

            }).bind(this),
            error: (function (_error) {
                if(this.mounted){
                    this.trigger('msgError', _error);
                }
            }).bind(this)
        });
    },

    receiveSuccess: function (data) {
        var receivedData = [];

        this.setState({
            designers: data.results || []
        });
    },

    receiveError: function (error) {
        console.log(error, 'error');
    },

    receivePVsSuccess: function () {
        var totalPVs = this.getPVs(),
            designersState = this.getOriginState(),
            chooseDesigners = [];

        MePC.each(designersState, function (_designer, _index) {
            chooseDesigners.push(MePC.copy({ pv: totalPVs[_index] }, _designer));
        });

        this.setState({
            designers: MePC.orderDescArrayByKey(chooseDesigners, 'pv')
        });
    },

    handleSlide: function (e) {
        var jqElement = $(e.target),
            changeClassName = 'designer-slide-state-icon',
            isVisibleUpIcon = jqElement.hasClass(changeClassName),
            superElement = jqElement.parents('.designer-display');

        superElement.find('.disigner-lists-work')[ isVisibleUpIcon ? 'slideUp' : 'slideDown' ]();
        superElement.find('.designer-lists-pic1')[ isVisibleUpIcon ? 'show' : 'hide' ]();
        jqElement[ isVisibleUpIcon ? 'removeClass' : 'addClass' ](changeClassName);
    },

    componentWillMount: function () {
        var context = this, param;

        MeEvent.on('getDesignersByLabel', (function (labelName) {
            param = {
                fieldColumn: '*',
                whereCondition: {
                    'approved_status = ': 2,
                    'user_type = ': 1,
                    'recno > ': 10
                },
                orderCondition: 'recno desc'
            };

            if (labelName !== '全部') {
                param.whereCondition['user_labels in '] = '(\''+ labelName+ '\')';
            }

            this.send(param);

        }).bind(this));

        this.setPageActions('handleSlide', this.handleSlide);
    },

    getInitialState: function () {
        
        this.mounted=true
        return {
            designers: void 0
        };
    },

    render: function () {
        var designers = MePC.isType(this.state.designers, 'array') && this.state.designers.map((function (_designer, _index) {
            try{
 var ret=this.generateTemplate(_designer, _index)
            }catch(e) {
console.log(e)
            }
           
                return  this.generateTemplate(_designer, _index);
            }).bind(this));

        var contentDesigner = designers && designers.length < 1 ?
            (
                <div className="no-designer-lists"></div>
            ) : designers;

        return (
            <div className="designer-lists fl">
                { contentDesigner }
            </div>
        );
    },

    componentDidMount: function () {
        // 成功事件
        this.bindDataEvents('msgSuccess', 'receiveSuccess');

        // 失败事件
        this.bindDataEvents('msgError', 'receiveError');

        // 请求数据
        this.send({
            fieldColumn: '*',
            whereCondition: {
                'approved_status = ': 2,
                'user_type = ': 1,
                'recno > ': 10
            },
            orderCondition: 'recno desc'
        });
    },

    componentWillUnmount: function () {
        MeEvent.off('getFinalPV', this.receivePVsSuccess);
        this.mounted=false;
    }
}));

module.exports = DesignerTribeMsg;
