/**
 * 网格相关设置
 * Created by 95 on 2015/8/4.
 */
var MeDispatcher = require("../dispatcher/MeDispatcher");
var Constans = require("../constants/MeConstants");
var GridTypes=Constans.GridType;
var GridAction={
 togglePanel:function(toggleOn){
     MeDispatcher.dispatch({
         type: GridTypes.GRID_PANEL,
         value:toggleOn
     })
 },
    toggleGrid:function(toggleOn){
        MeDispatcher.dispatch({
            type: GridTypes.GRID_SHOW,
            value:toggleOn
        })
    },
    toggleAdsorption:function(toggleOn){
        MeDispatcher.dispatch({
            type: GridTypes.GRID_ADSORPTION,
            value:toggleOn
        })
    },
    toggleReference:function(toggleOn){
        MeDispatcher.dispatch({
            type: GridTypes.GRID_SHOWREFERENCE,
            value:toggleOn
        })
    },
    changeWidth:function(gridNum){
        MeDispatcher.dispatch({
            type: GridTypes.GRID_WIDTH,
            value:gridNum
        })
    },
    changeColor:function(color){
        MeDispatcher.dispatch({
            type: GridTypes.GRID_COLOR,
            value:color
        })
    },



    pushAdsorptionData:function(obj){
        MeDispatcher.dispatch({
            type: GridTypes.GRID_ADSORPTION,
            value:obj
        })
    },
    elementMoveStart:function(pos){
        MeDispatcher.dispatch({
            type: GridTypes.ITEM_MOVE_START,
            pos:pos
        })
    },
    elementMoveEnd:function(pos){
        MeDispatcher.dispatch({
            type: GridTypes.ITEM_MOVE_END,
            pos:pos
        })
    }
}

module.exports=GridAction;