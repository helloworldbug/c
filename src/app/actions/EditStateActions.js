/**
 * Created by 95 on 2016/8/1.
 */
var MeDispatcher = require('../dispatcher/MeDispatcher');
var MeConstants = require('../constants/MeConstants');

var EditStates = MeConstants.EditStates;

var EditStateActions = {
    changeTextPannelMouseOverState:function(state){
        //修改字体面板状态
        MeDispatcher.dispatch({
            type: EditStates.TEXTPANNELMOUSEOVERSTATE,
            state: state
        });

    }
}

module.exports=EditStateActions