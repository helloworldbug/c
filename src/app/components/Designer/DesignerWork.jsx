// 文件名：设计师个人作品.jsx
//
// 创建人：曾文彬
// 创建日期：2015/11/11 16:32
// 描述： 设计师作品图像

'use strict';

var React = require('react');

var MePC = require('../../lib/MePC_Public'),
    MeEvent = require('../../lib/MePC_Event'),
    Base = require('../../utils/Base');

var SuperLogicComponent = require('../../lib/SuperLogicComponent'),
    SuperTemplateComponent = require('../../lib/SuperTemplateComponent');

var UserChooseWorks = require('../User/UserChooseWorks');

var model = new (require('../../utils/Model'));
var ImageModules = require('../Mixins/ImageModules');

model.set('tableName', 'tplobj');

var DesignerWork = MePC.inherit(SuperLogicComponent, SuperTemplateComponent,  React.createClass({

    generateTemplate: function (work, index) {
        return (
            <dl>
                <dt><img src={ this.clearAVFrontChar(work.attributes.effect_img) } width="94" alt="" /></dt>
                <dd>
                    <span>{ index }</span>
                    <span data-tid={ work.attributes.tpl_id } className="btn-del" onClick={ this.getPageActions('handleDelete')(index) }></span>
                </dd>
            </dl>
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

        retArray.results = MePC.orderAscArrayByKey(retArray.results, 'attributes', 'author_recno').slice(0, 7);

        // if (retArray.results.length < 1) {
        //     //console.log(data.results, 'hahah');
        //     //console.log(Base.getCurrentUser().attributes.designer_submittpls, 'wajueji');
        //     //console.log(MePC.getArrayByValues(data.results, 'attributes', 'tpl_id', Base.getCurrentUser().attributes.designer_submittpls));
        //     data.results = data.results.slice(0, 7);
        // }
        return retArray;
        //return retArray.results.length > 0 ? retArray : data;
    },

    send: function (selectSQLObject) {
        var selectSQL = this.generateSelectSQL(selectSQLObject);

        fmacloud.Query.doCloudQuery(selectSQL, {
            success: (function (_data) {
                var data = this.getRecommendByData(_data);
                this.trigger('workSuccess', data);
            }).bind(this),
            error: (function (_error) {
                this.trigger('workError', _error);
            }).bind(this)
        });
    },

    receiveSuccess: function (data) {
        this.setState({
            works: data.results || []
        });
    },

    receiveError: function (error) {

    },

    handleDelete: function (index) {
        var context = this;

        return function (_e) {
            context.setState({
                works:  MePC.removeArrayValueByIndex(context.state.works, index - 1)
            });

            context.removeTplRecno($(_e.target).data('tid'));
        }
    },

    worksHide: function () {
        return (function (_e) {

            this.setState({
                isWorksShow: false
            });

            //this.tids = [];

            //MePC.each(this.state.works, (function (_stat) {
            //    this.setTids(_stat.id);
            //}).bind(this));

            this.refs.userChooseWorks.removeImgByClass();
            this.refs.userChooseWorks.addImgByClass();

        }).bind(this);
    },

    worksShow: function(){
        return (function (_e) {
            this.setState({
                isWorksShow: true
            });

        }).bind(this);
    },

    generateUserWorks() {
        var context = this,
            tids = this.getTids();

        return (
            <div className="popup-choice-bg" style= {{ display: this.state.isWorksShow ? 'block' : 'none' }}>
                <div className="choice-work">
                    <p className="title"><img src={ ImageModules.defineImageModules()['choice-work-title'] } height="26" /></p>
                    <div className="choice-work-lists" ref="workLists">

                        <UserChooseWorks ref="userChooseWorks" tids={ tids } uid={ Base.getCurrentUser().id } />

                    </div>
                    <div className="choice-btn">
                        <div className="fl">最多展示7个作品</div>
                        <div className="fr">
                            <input className="btn" onClick= { this.worksHide() } type="button" value="取    消" />
                            <input className="btn" onClick={ this.getPageActions('handleSubmit') } type="button" value="保    存" />
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    handleSubmit: function () {
        var works = [],
            chooseImgs = this.refs.userChooseWorks.getChooseImgs(),
            state = {};

        if (!MePC.isType(chooseImgs, 'undefined') && MePC.isType(MePC.makeArray(chooseImgs), 'array')) {

            MePC.each(MePC.makeArray(chooseImgs), function (_chooseImg) {
                works.push({
                    attributes: {
                        tpl_id: $(_chooseImg).data('tid'),
                        effect_img: $(_chooseImg).data('timg')
                    },
                    options: {
                        recommend_status: $(_chooseImg).hasClass('active') ? 1 : 0,
                        author_recno: $(_chooseImg).hasClass('active') ? +$(_chooseImg).find('i').html() : 0
                    }
                });

            });

            state = {
                isWorksShow: false,
                works: MePC.orderAscArrayByKey(MePC.getArrayByValue(works, 'options', 'recommend_status', 1), 'options', 'author_recno')
            };

            this.setTplRecno(state.works);
        }

        else {

            state = {
                isWorksShow: false
            }
        }

        this.setState(state);

    },

    removeTplRecno: function (tid) {
        var query = new AV.Query('tplobj');
        query.equalTo('tpl_id', tid);
        query.first({
            success: function (_results) {
                _results.set('recommend_status', 0);
                _results.set('author_recno', 0);
                _results.save(null, {
                    success: function (_msg) {

                    }
                });
            }
        });
    },

    setTplRecno: function (state) {
        var query = new AV.Query('tplobj'),
            i = 0,
            length = state.length;

        MePC.each(state, function (_stat) {
            query.equalTo('tpl_id', _stat.attributes.tpl_id);

            query.first({
                success: function (_results) {

                    MePC.each(_stat.options, function (_value, _key) {
                        _results.set(_key, _value);
                    });

                    _results.save(null, {
                        success: function (_msg) {
                            i++;

                            if (i === length) {
                                //localStorage.setItem('userState', 1);
                                return;
                            }
                        }
                    });
                },
                error: function () {
                    console.log('错误');
                }
            });
        });
    },

    setTids: function (tid) {
        !this.tids && (this.tids = []);
        this.tids.push(tid);
    },

    getTids: function () {
        return this.tids;
    },

    getInitialState: function () {
        return {
            works: [],
            isWorksShow: false
        };
    },

    componentWillMount: function () {
        this.setPageActions('handleDelete', this.handleDelete);
        this.setPageActions('handleSubmit', this.handleSubmit);
    },

    render: function () {
        this.tids = [];

        var works = this.state.works.map((function (_work, _index) {
            this.setTids(_work.attributes.tpl_id);
            
            return this.generateTemplate(_work, _index + 1);
        }).bind(this));
        //console.log(this.getTids(), 'wgg');
        var visibleAddBtn = works.length < 7 ? (
                <span className="add-work" onClick= { this.worksShow() }></span>
            ) : null;

        return (

            <div className="setup-work-lists">
                { this.generateUserWorks() }

                { works }

                { visibleAddBtn }

            </div>
        );
    },

    componentDidMount: function () {
        // 成功事件
        this.bindDataEvents('workSuccess', 'receiveSuccess');

        // 失败事件
        this.bindDataEvents('workError', 'receiveError');

        var queryObj = {
            fieldColumn: '*',
            whereCondition: {
                'tpl_type = ': 11,
                // 'tpl_privacy = ': '\'public\'',
                'tpl_state = ': 2,
                // 'recommend_status > ': 0,
                'author = ': '\''+ this.props.uid +'\''
            }
        }

        // 请求数据
        this.send(queryObj);
    }

}));

module.exports = DesignerWork;
