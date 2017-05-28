/**
 * @component Labels 组件
 * @description 作品标签组件
 * @time 2015-10-21 18:32
 * @author 曾文彬
 **/

// require core module
var React = require('react');

// require action
var MeAction = require('../../actions/NewMeActionCreator');

// require label store
var LabelStore = require('../../stores/LabelStore');

// require globalpagecondition part
var pageConditionPart = require('../../global/GlobalPageConditionPart');

// require label model
var LabelsModel = require('../../utils/LabelsModel');

// initialize label model
var labelsModel = new LabelsModel();

// define label component
var Label = React.createClass({

    getStateLabelStore() {

        return {
            labels: LabelStore.getLabels()
        }
    },

    onChange() {
        this.setState(this.getStateLabelStore());
    },


    labelClick(category, event) {
        var categorys;
        if (category === 'selectLabel') {
            category = $(event.currentTarget).html();
            categorys = $(event.currentTarget).data('categorys');
        }

        this.changeActiveClass($(event.currentTarget));
        this.props.getTemplatesByLabelCategory(category, categorys);

    },
    sceneLabelClick: function (_event) {

        var category = $(_event.currentTarget).attr('data-categorys');
        var category = category.replace(/"/g, "'")
        this.changeActiveClass($(_event.currentTarget));
        MeAction.showChildLabelTemplate({results: []})
        this.props.query(
            category && {["label in"]: "(" + category + ")"},
            true
        );

        //this.dropLoad.setCurrentPage(this.category != category ? 2 : void 0);
        //this.dropLoad.setWhereCondition(category ? $.extend({}, defaultWhereCondition, sceneQueryObj) : defaultWhereCondition);
        //this.dropLoad.setLimitPage();
        //this.dropLoad.setOtherCondition({orderCondition: 'editor_recno desc'});
        //
        //if (this.category != category) {
        //    this.category = category;
        //}

    },
    changeActiveClass(jqNode) {
        var activeClass = 'active';
        jqNode.addClass(activeClass).siblings().removeClass(activeClass);
    },

    formateName: function (name) {
        if (!name) {
            return ""
        }
        if (name[name.length - 1] == "_") {
            name = name.substr(0, name.length - 1)
        }

        return name
    },
    getTemplateLabels() {
        //console.log(this.state.labels);
        return this.state.labels instanceof Array && this.state.labels.map((_label, _index) => {

                return this.props.single ? (<li key={_index} onClick={ this.labelClick.bind(this,_label.attributes.name) }
                                                style={{ backgroundImage: 'url('+ _label.attributes.img +')' }}>
                    <p>{ _label.attributes.name }</p></li> )
                    : (<a key={_index}  href="javascript:;"
                          onClick={ this.labelClick.bind(this,_label.attributes.name) }>{ this.formateName(_label.attributes.name) }</a>);

            });
    },

    getCoditionsByName() {
        return pageConditionPart.tableCondition.Lables;
    },

    getDefaultCondition() {
        var condition = this.getCoditionsByName(),
            splitter = ' ',
            queryCondition = {
                fieldColumn   : '*',
                whereCondition: {
                    [condition.whereConditionField + splitter + condition.whereConditionOperator]: condition.whereConditionValue
                },
                orderCondition: condition.orderField + splitter + condition.orderCategory,
                currentPage   : condition.limitCurrentPage,
                pageSize      : condition.limitOffsetPage
            };

        return queryCondition;
    },

    getPageLabels(condition) {
        var defaultCondition = this.getDefaultCondition(),
            whereCondition = $.extend({}, defaultCondition.whereCondition, condition);

        defaultCondition.whereCondition = whereCondition;

        labelsModel
            .getLabelsBySQL(defaultCondition)
            .then(_labels => {
                MeAction.showLabelTemplate({
                    data: _labels.results
                });
            })
            .catch();
    },

    getInitialState() {
        return this.getStateLabelStore();
    },

    render() {

        var template;

        if (this.props.single) {
            template = (
                <ul>
                    <li className="new-mark active" onClick={ this.labelClick.bind(this,'')}><p>最新发布</p></li>
                    <li className="hot-mark" onClick={ this.labelClick.bind(this,'热门杂志') }><p>热门推荐</p></li>
                    { this.getTemplateLabels() }
                </ul>
            );
        } else {
            template = (
                <p>
                    <b>模版分类：</b>
                    <a  href="javascript:;" onClick={ this.props.getTemplatesByLabelCategory } className="active">全部</a>
                    { this.getTemplateLabels() }
                    <a  href="javascript:;" ref="sceneLabel" onClick={ this.sceneLabelClick }></a>
                </p>
            );
        }

        return template;
    },

    componentDidMount() {
        // 监听store
        LabelStore.addChangeListener(this.onChange);

        // 获取所有标签
        this.getPageLabels(this.props.condition);
    },

    componentWillUnmount() {
        // 删除监听store
        LabelStore.removeChangeListener(this.onChange);
    }
});

// export label component
module.exports = Label;