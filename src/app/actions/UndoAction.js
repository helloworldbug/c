/**撤销
 * Created by 95 on 2015/8/19.
 */
var MeDispatcher = require("../dispatcher/MeDispatcher");
var Constants = require("../constants/MeConstants");
var ActionTypes=Constants.ActionTypes;
var UndoStore=require('../stores/UndoStore');

var UndoAction={
    createRedo:function(payload){
        //var payload=UndoStore.getPayload();
        MeDispatcher.dispatch({
            type: ActionTypes.REDO,
            value:payload
        })
    },
    createUndo:function(payload){
        MeDispatcher.dispatch({
            type: ActionTypes.UNDO,
            value:payload
        })
    },
    //mouseMoveStart:function(pos){
    //    MeDispatcher.dispatch({
    //        actionType: Constants.ITEM_MOVE_START,
    //        position:pos
    //    })
    //},
    //mouseMoveEnd:function(pos){
    //    MeDispatcher.dispatch({
    //        actionType: Constants.ITEM_MOVE_END,
    //        position:pos
    //    })
    //}
}
module.exports=UndoAction;