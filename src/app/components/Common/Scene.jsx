/**
 * @component Scene 组件
 * @description 场景组件
 * @time 2015-10-22 11:52
 * @author 曾文彬
 **/

// require core module
var React = require('react');

// require action
var MeAction = require('../../actions/NewMeActionCreator');

// require label store
var SceneStore = require('../../stores/SceneStore');

// require globalpagecondition part
var pageConditionPart = require('../../global/GlobalPageConditionPart');

// require label model
var ScenesModel = require('../../utils/ScenesModel');

// require Swipe animation
var Swiper = require('../../utils/Swiper');

// initialize label model
var scenesModel = new ScenesModel();

// define scene component
var Scene = React.createClass({

    getStateSceneStore() {
        return {
            scenes: SceneStore.getScenes()
        };
    },

    onChange() {       
        this.setState(this.getStateSceneStore());
    },

    handleClick(category, categoryName) {
        var func = this.props.getTemplatesBySceneCategory,
            category = category instanceof Array ? category : [category];

        return (_event => {
            func.call(this.props, category, categoryName);
        }).bind(this);
    },

    buildTargetLink(data) {
        var attr = data.attributes,
            img = (
               <img src={ attr.bannerimgsrc } /> 
            ), ret;

        if (attr.bannertarget.length > 1) {
            ret = (
                <a href={attr.bannertarget} target="_blank">{ img }</a>
            );
        } else {
            ret = (
                <a>{ img }</a>    
            );
        }

        return ret;
    },

    getTemplateScenes() {
        var template, banner, pointers;

        if (this.props.single) {
            var scenes = this.state.scenes;

            banner = scenes.map((_scene, _index) => {
                return <li key={_index}>{ this.buildTargetLink(_scene) }</li>
            });

            pointers = scenes.map((_scene, _index) => {
                return <li key={_index} className={ !_index ? 'on' : '' }></li>
            });

            template = (
                <div className="explore-banner">
                    {this.state.scenes.length > 1 ? (<div><a href="javascript:;" className="prev"></a>
                     <a href="javascript:;" className="next"></a></div>) : null}
                    <div className="bd">
                        <ul>
                            { banner }
                        </ul>
                    </div>
                    {this.state.scenes.length > 1 ? (<div className="hd">
                     <ul>
                     { pointers }
                     </ul>
                     </div>) : null }
                </div>
            );   

        } else {
            banner = this.state.scenes.map((_scene, _index) => {

                return (
                    <li key={_index} onClick={this.handleClick(_scene.attributes.bannerlabel, _scene.attributes.bannername)}>
                        <dl>
                            <dt><a href="javascript:;"><img src={_scene.attributes.bannerimgsrc} /></a></dt>
                            <dd>{ _scene.attributes.bannername }</dd>
                        </dl>
                    </li>
                );
            });

            template = (
                <div className="pic-lists">
                    <ul>
                        { banner }
                    </ul>
                </div>
            );
        }         

        return template;    
    },

    getCoditionsByName() {
        return pageConditionPart.tableCondition.Banners;
    },

    getDefaultCondition() {
        var condition = this.getCoditionsByName(),
            splitter = ' ',
            queryCondition = {
                fieldColumn: '*',
                whereCondition: {
                    [condition.whereConditionField + splitter + condition.whereConditionOperator]: condition.whereConditionValue
                },
                orderCondition: condition.orderField + splitter + condition.orderCategory,
                currentPage: condition.limitCurrentPage,
                pageSize: 5
                //pageSize: condition.limitOffsetPage
            };

        return queryCondition;
    },

    getPageScenes(condition) {
        var defaultCondition = this.getDefaultCondition(),
            whereCondition = $.extend({}, defaultCondition.whereCondition, condition);        

        defaultCondition.whereCondition = whereCondition;

        scenesModel
            .getScenesBySQL(defaultCondition)
            .then((_scenes => {
                MeAction.showSceneTemplate({
                    data: _scenes.results
                });

                // 初始化平滑插件
                //!this.props.single && this.generationSwipeAnimation();
                }).bind(this))
            .catch();

    },

    generationSwipeAnimation() {
        var swiper = new Swiper({
            parentSelector: '.pic-lists > ul',
            childSelector: 'li',
            leftSelector: '.prev',
            rightSelector: '.next',
            activeCentClass: 'cent',
            activeMidClass: 'mid'
        });
    },

    getInitialState() {
        return this.getStateSceneStore();
    },
        
    componentDidUpdate() {
        var method = this.props.jQPluginMethod;
        method && method();
    },

    render() {

        return this.state.scenes instanceof Array && this.getTemplateScenes();
    },

    componentDidMount() {
        // 监听store
        SceneStore.addChangeListener(this.onChange);
        
        // 获取所有场景
        this.getPageScenes(this.props.condition);
    },

    componentWillUnmount() {
        // 删除监听store
        SceneStore.removeChangeListener(this.onChange);
        SceneStore.stripScenes();
    }
});

// export scene component
module.exports = Scene;