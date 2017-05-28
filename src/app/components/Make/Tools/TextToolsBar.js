/*
 * Created by 95 on 2015/8/3.
 */

var React = require('react');

module.exports = React.createClass({

    getInitialState: function () {
        return {
            close : false,
            colNum: 1,
            top   : 0,
            left  : 0
        }
    },

    render: function () {


        return (<div  className='tools-box'>
            <h3>工具</h3>
            {this.props.children}
        </div>)

    }
});