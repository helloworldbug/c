/**
 * Created by 95 on 2015/12/15.
 */
var MakeActionCreators = require('../../../actions/MakeActionCreators');

var UndoMixin ={
    startRecord:function(){
         MakeActionCreators.undoRecord("start");
    },
    endRecord:function(){
        MakeActionCreators.undoRecord("end");
    }
}
module.exports = UndoMixin;