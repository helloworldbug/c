var React = require('react');
var Base=require('../../utils/Base')
var Ysdh = React.createClass({
    componentDidMount: function () {
        Base.linkToPath("/search?value=与神对话")
    },
    render: function () {
        return(<div></div>)
    }
});

// define Login component
module.exports = Ysdh;
