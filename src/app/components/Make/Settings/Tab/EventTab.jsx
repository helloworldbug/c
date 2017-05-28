/**
 * @component EventTab
 * @description 事件设置tab
 * @time 2016-03-28 10:33
 * @author Nick
 **/

var React = require('react');

var LinkEdit = require("./LinkEdit");

var EventTab = React.createClass({

    render: function () {
        var attributes = this.props.attributes;
        var height = document.body.clientHeight - 54 - 40;

        return(
            <div className="setting-container" style={{height:height}}>
                <LinkEdit attributes={attributes}/>
            </div>
        )
    }

});

module.exports = EventTab;