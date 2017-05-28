/**
 * Created by 95 on 2015/9/10.
 */
var React = require("react");
var Tag = React.createClass({
    displayName: 'Tag',

    render: function render() {
        var style=this.props.style||{}
        if(!this.props.active){
            style.display="none";
        }else{
          //if(style.display=="none") {
              style.display="block";
          //}
        }
        return (
            <li style={style}>{this.props.children}</li>
        )
    }


});

module.exports = Tag;