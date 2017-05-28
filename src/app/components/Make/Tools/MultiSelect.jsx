/**
 * Created by 95 on 2016/1/11.
 */
var React = require('react');
var MultiSelect = React.createClass({

    getInitialState: function () {
        var children = this.props.children;
        var childObj = {}
        this.props.children.forEach((child)=> {
            return childObj[child.props.value] = child.props.text
        })
        return {
            selectIds: this.props.selectValues || [],
            options  : childObj,
            expand   : false
        }


    },
    componentWillReceiveProps:function(nextProps){
        var children = nextProps.children;
        var childObj = {}
        children.forEach((child)=> {
            return childObj[child.props.value] = child.props.text
        })
      var obj={
            selectIds: nextProps.selectValues || [],
            options  : childObj
        }
        this.setState(obj)
    },

    onChange            : function (e) {
        var selectval=e.currentTarget.getAttribute("value");
        var selectIds=this.state.selectIds;
        var index=_.indexOf(selectIds,selectval)
        if(index>-1){
            selectIds.splice(index,1)
        }else{
            selectIds.push(selectval);
        }

        this.setState({selectIds: selectIds});
        if(this.props.onChange){
            e.target.value=selectIds;
            var ar
            this.props.onChange(e)
        }
    },
    toggle              : function () {
        var expand = this.state.expand;
        this.setState({expand: !expand});
    },
    stopClick:function(e){
        e.stopPropagation()
    },
    optionClick:function(e){
        this.onChange(e)
    },
    close:function(e){
        this.setState({expand: false});
    },
    render              : function () {
        var _this = this
        var children = this.props.children;
        var newChildren = children.map((child, index)=> {
            var className="multioptionwrapper";
            if (_.indexOf(_this.state.selectIds, child.props.value.toString()) > -1) {
                className="multioptionwrapper selected"
            }
            var newchild=React.cloneElement(child, {
                className  : "multioption"
            })
            return <div key={index} onClick={_this.optionClick} className= {className} value={child.props.value}><span className="checkbox"/>{newchild}</div>

        });
        var selectText=this.state.selectIds.map((id)=>{
            return _this.state.options[id];
        })
        for(let i=0;i<selectText.length;i++){
            if(!selectText[i]){
                selectText.splice(i,1);
                i--
            }
        }
        return <div className="multiselect" onClick={this.toggle} tabIndex="-1" onBlur={this.close}>
            <div className={this.state.expand?"title expand":"title"}>{selectText.join("/")}</div>
            <div className={this.state.expand?"optionpanel show":"optionpanel hide"} onClick={this.stopClick}>
                {newChildren}
            </div>
        </div>
    }

});

module.exports = MultiSelect;