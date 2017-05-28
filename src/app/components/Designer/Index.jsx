/**
 * @module      DesignerRule
 * @description 3.0设计师模块 -> rule
 * @time        2015-10-19
 * @author      misterY 
*/

'use strict';
// require core module
var React = require('react');

var DesignerIndex = require('./Designer'),
    DesignerApply = require('./Apply'),
    DesignerCode = require('./DesignerCode');
    
var Base = require('../../utils/Base');

// define DesignerRule component
var DesignerRule = React.createClass({

    getClassBy_t(a){

        var _r = (a!=undefined&&"a".toUpperCase!=undefined )?a.toUpperCase():"___";
        switch (_r){
            case "APPLY":
                return <DesignerApply />;
                break;
            case "CODE":
                return <DesignerCode />;
                break;
            default:
                return <DesignerIndex />;
                break;
        }
    },

    render() {
        var _d = this.getClassBy_t(this.props.params._t);
        return (
            <div className="designer_content" style={{width:"100%",height:"100%"}}>
                {_d}
            </div>
        );
    }
});
// export DesignerRule component
module.exports = DesignerRule;