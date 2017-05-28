// 文件名：DesignerTribeImg.jsx
//
// 创建人：曾文彬
// 创建日期：2015/11/11 16:32
// 描述： 设计师作品图像

'use strict';

var React = require('react');
import {Link} from 'react-router'

var MePC = require('../../lib/MePC_Public');

var SuperLogicComponent = require('../../lib/SuperLogicComponent'),
    SuperTemplateComponent = require('../../lib/SuperTemplateComponent');

var model = new (require('../../utils/Model'));

model.set('tableName', 'tplobj');

var DesignerTribeImg = MePC.inherit(SuperLogicComponent, SuperTemplateComponent, React.createClass({

        /*
         * 去掉url开头的 "AV:"
         */
        subAvChar(url) {
            if (!url) {
                return ""
            } else {
                return url.substr(0, 3) == "AV:" ? url.substr(3) : url;
            }
        },

        generateTemplate: function (img, index) {
            return (
                <li key={index}>
                    <Link to={ '/preview/tid=' + img.attributes.tpl_id } target="_blank">
                        <img src={ this.subAvChar(img.attributes.tpl_share_img) } width="96"/>
                    </Link>
                </li>
            );
        },

        generateSelectSQL: function (selectSQLObject) {
            return model.getSelectSQL(selectSQLObject);
        },

        clearAVFrontChar(url) {
            return url ? url.slice(3) : '';
        },

        getRecommendByData: function (data) {
            var retArray = {
                results: []
            };

            MePC.each(data.results, function (object) {
                if (object.attributes.recommend_status) {
                    retArray.results.push(object);
                }
            });

            if (retArray.results.length > 0) {
                retArray.results = MePC.orderAscArrayByKey(retArray.results, 'attributes', 'author_recno');
            } else {
                data.results = MePC.orderDescArrayByKey(data.results, 'attributes', 'read_pv');
            }

            return retArray.results.length > 0 ? retArray : data;
        },

        send: function (selectSQLObject) {
            var selectSQL = this.generateSelectSQL(selectSQLObject);

            fmacloud.Query.doCloudQuery(selectSQL, {
                success: (function (_data) {
                    if (!this.mounted) {
                        return;
                    }
                    var data;
                    this.trigger('pvs', _data);
                    data = this.getRecommendByData(_data);
                    this.trigger('imgSuccess', data);
                }).bind(this),
                error  : (function (_error) {
                    if (this.mounted) {
                        this.trigger('imgError', _error);
                    }

                }).bind(this)
            });
        },

        receiveSuccess: function (data) {
            if(this.mounted){
                this.setState({
                    imgs: data.results ? this.props.isSlice ? data.results.slice(0, 3) : data.results.slice(0, 7) : []
                });
            }

        },

        receiveError: function (error) {

        },

        receivePVSuccess: function (data) {
            var superGetPVNums = this.props.getPVNums,
                pvs = 0;

            if (MePC.isType(superGetPVNums, 'function')) {
                MePC.each(data.results, function (_attr) {
                    pvs += (_attr.attributes.read_pv || 0);
                });

                superGetPVNums(pvs, this.props.indexPos);
            }
        },

        getInitialState          : function () {
            return {
                imgs: []
            };
        },
        componentWillUnmount      : function () {
            this.mounted = false
        },
        componentWillReceiveProps: function (nextProps) {
            if (nextProps.uid !== this.props.uid) {
                this.send({
                    fieldColumn   : '*',
                    whereCondition: {
                        'tpl_type = ' : 11,
                        //'tpl_privacy = ': '\'public\'',
                        'tpl_state = ': 2,
                        'tpl_delete'  : '=0',
                        'author = '   : '\'' + nextProps.uid + '\''
                    }
                });
            }
        },
        render: function () {
            var imgs = this.state.imgs.map((function (_img, index) {
                return this.generateTemplate(_img, index);
            }).bind(this));

            return (
                <ul>
                    { imgs }
                </ul>
            );

        }
        ,

        componentDidMount: function () {
            this.mounted = true;
            // 成功事件
            this.bindDataEvents('imgSuccess', 'receiveSuccess');

            // 失败事件
            this.bindDataEvents('imgError', 'receiveError');

            // 设置阅读数
            !this.props.isSlice && this.bindDataEvents('pvs', 'receivePVSuccess');

            // 请求数据
            this.send({
                fieldColumn   : '*',
                whereCondition: {
                    'tpl_type = ' : 11,
                    /*'tpl_privacy = ': '\'public\'',*/
                    'tpl_state = ': 2,
                    'tpl_delete'  : '=0',
                    'author = '   : '\'' + this.props.uid + '\''
                }
            });
        }

    }))
    ;

module.exports = DesignerTribeImg;
