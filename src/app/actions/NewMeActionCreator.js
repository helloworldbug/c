/**
 * @component NewMeActionCreator
 * @description common action
 * @time 2015-10-21 11:26
 * @author 曾文彬
 **/

'use strict';

// require dispatcher
var MeDispatcher = require('../dispatcher/MeDispatcher');

// define work action
var NewMeActionCreator = {

    showWorkTemplate(workData) {
        MeDispatcher.dispatch({
            type: 'work',
            data: workData.data,
            category: workData.category
        });
    },

    showLabelTemplate(labelData) {
        MeDispatcher.dispatch({
            type: 'label',
            data: labelData.data
        }); 
    },

    showChildLabelTemplate(childLabelData) {
        MeDispatcher.dispatch({
            type: 'childLabel',
            data: childLabelData.results
        }); 
    },

    showSceneTemplate(sceneData) {
        MeDispatcher.dispatch({
            type: 'scene',
            data: sceneData.data
        }); 
    },

    showActivity(activity) {
        MeDispatcher.dispatch({
            type: 'activity',
            data: activity.data
        }); 
    },

    showOnsaleTemplate(data) {
        MeDispatcher.dispatch({
            type: 'onsale',
            data: data
        });
    }
};

// export work action
module.exports = NewMeActionCreator;