// 文件名：UserChooseWorks.jsx
//
// 创建人：曾文彬
// 创建日期：2015/11/17 22:20
// 描述： 用户选择个人作品

'use strict';

var React = require('react');

var MePC = require('../../lib/MePC_Public');

var SuperLogicComponent = require('../../lib/SuperLogicComponent'),
    SuperTemplateComponent = require('../../lib/SuperTemplateComponent');

var model = new (require('../../utils/Model'));
var Dialog = require('../Common/Dialog');

model.set('tableName', 'tplobj');

var UserChooseWorks = MePC.inherit(SuperLogicComponent, SuperTemplateComponent,  React.createClass({

	generateTemplate: function (work, index) {
        var isContain = MePC.inArray(this.props.tids, work.attributes.tpl_id),
            inArrayIndex = MePC.getArrayIndexByValue(this.props.tids, work.attributes.tpl_id);

        return (
            <li key={index} ref="work" data-tid={ work.attributes.tpl_id } data-timg={ work.attributes.effect_img } className={ isContain && 'active startAcvive' } onClick={ this.getPageActions('handleChooseImg') }>
                <img src={ this.clearAVFrontChar(work.attributes.effect_img) } width="188" />
                <div><i>{ inArrayIndex >= 0 && isContain ? (inArrayIndex + 1) : (index + 1)  }</i></div>
            </li>
        );
    },

	generateSelectSQL: function (selectSQLObject) {
        return model.getSelectSQL(selectSQLObject);
    },

    clearAVFrontChar(url) {
        return url ? url.slice(3) : '';
    },

    generateDialog: function (options) {
        return <Dialog ref="dialog" {...options} hash="/login" />
    },

    showDialog: function (states) {
        this.refs.dialog.setState(states);
    },

    send: function (selectSQLObject) {
        var selectSQL = this.generateSelectSQL(selectSQLObject);
       // console.log('hehe');
        fmacloud.Query.doCloudQuery(selectSQL, {
            success: (function (_data) {
                this.trigger('workSuccess', _data);
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

    getChooseImgs: function () {
        return this.chooses;
    },

    setChooseImgs: function (chooseImgs) {
        this.chooses = chooseImgs;
    },

    removeImgByClass: function () {
        $('.choice-work-lists li').filter(':not(.startAcvive)').removeClass('active');
    },

    addImgByClass: function () {
        $('.choice-work-lists .startAcvive').addClass('active');
        this.setElementRecno($('.choice-work-lists .startAcvive'));
    },

    setElementRecno: function (jqElement) {
        MePC.each(MePC.makeArray(jqElement), (function (_element) {
            $(_element).find('i').html((MePC.getArrayIndexByValue(this.props.tids, $(_element).data('tid')) + 1));
        }).bind(this));
    },

    removeTplRecno: function (state) {
        var query = new AV.Query('tplobj');

        MePC.each(MePC.makeArray(state), function (_element) {
            query.equalTo('tpl_id', $(_element).data('tid'));

            query.first({
                success: function (_results) {

                    // MePC.each(_stat.options, function (_value, _key) {
                    //     _results.set(_key, _value);
                    // });
                    if (!$(_element).hasClass('active')) {
                        _results.set('recommend_status', 0);
                        _results.set('author_recno', 0);
                    }

                    _results.save(null, {
                        success: function (_msg) {

                        }
                    })
                },
                error: function () {
                    console.log('错误');
                }
            });
        });
    },

    handleChooseImg: function (e) {
        var jQcurrentElement = $(e.currentTarget);
        var liActive  = jQcurrentElement.parent().find("li").filter(".active");
        var activeNum = liActive.length;

        if (jQcurrentElement.hasClass('active')) {

            var curText = jQcurrentElement.removeClass('active').find("i").text();

            liActive.each(function(index, ele){
                if( parseInt($(ele).find('i').text()) > curText ){
                    $(ele).find('i').text(parseInt($(ele).find('i').text()) - 1)
                }
            });

            jQcurrentElement.removeClass('active').find("i").text('');


        } else {

            if(activeNum >= 7){

                this.showDialog({
                    title: '最多只能选择7个作品！',
                    appearanceState: true,
                    sureIsHide: true
                });

                return false;
            }

            jQcurrentElement.addClass('active').find('i').text(activeNum + 1);
        }
        //console.log(jQcurrentElement.parent().find('.active'), 'wjj');
        //this.setChooseImgs(MePC.makeArray(jQcurrentElement.parent().find('.startAcvive')).concat(MePC.makeArray(jQcurrentElement.parent().find('.active').filter(':not(.startAcvive)'))));
        this.setChooseImgs(MePC.makeArray(jQcurrentElement.parent().find('li')));
        //this.removeTplRecno(jQcurrentElement.parent().find('li'));
    },

    getInitialState: function () {
        return {
            works: []
        };
    },

    componentWillMount: function () {
    	this.setPageActions('handleChooseImg', this.handleChooseImg);
    },

    render: function () {
    	var context = this;

    	var works = this.state.works.map((function (_work, _index) {
            return this.generateTemplate(_work, _index);
        }).bind(this));

    	return (
    		<ul>
    			{
                    context.generateDialog({
                        appearanceState: false,
                        sureFn: function () {
                            context.showDialog({
                               appearanceState: false
                            });
                        }
                    })
                }

                { works }
    		</ul>
    	);
    },

    componentDidMount: function () {
    	// 成功事件
        this.bindDataEvents('workSuccess', 'receiveSuccess');

        // 失败事件
        this.bindDataEvents('workError', 'receiveError');

        // 请求数据
        this.send({
            fieldColumn: '*',
            whereCondition: {
                'tpl_type = ': 11,
                'tpl_state = ': 2,
                'author = ': '\''+ this.props.uid +'\''
            }
            /*orderCondition: 'author_recno asc'*/
        });
    }

}));


module.exports = UserChooseWorks;
