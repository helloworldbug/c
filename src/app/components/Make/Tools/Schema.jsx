/**
 * Created by 95 on 2016/1/11.
 */
var React = require('react');
var GlobalFunc = require("../../Common/GlobalFunc");
var MagazineStore = require("../../../stores/MagazineStore")
var Schema = React.createClass({

    getInitialState: function () {
        var children = this.props.data.get("items").map((child,index)=> {
            return this.createChild(child,this.props.selectValue,index)

        });
        return {
            selectValue: this.props.selectValue,
            expand     : false,
            children   : children,
            pageName   : GlobalFunc.getPageName(this.props.selectValue, MagazineStore.getWorkData())
        }
    },

    componentWillReceiveProps: function (nextProps) {
        var children = nextProps.data.get("items").map((child,index)=> {
            return this.createChild(child,nextProps.selectValue,index)

        });
        this.setState({
            selectValue: nextProps.selectValue,
            children   : children,
            pageName   : GlobalFunc.getPageName(nextProps.selectValue, MagazineStore.getWorkData())
        })
    },

    createChild: function (item,selectValue,key) {
        if (GlobalFunc.isGroup(item)) {
            ///渲染成组
            return (<dd  key={key}>
                {this.createGroup(item,selectValue,key)}
            </dd>)
        } else {
            ///渲染成页
            return this.createPage(item,selectValue,key);
        }
    },
    createGroup: function (group,selectValue,key) {
        var children;

        if (group.attributes["items"]) {
            children = group.attributes["items"].map((child,index)=> {
                return this.createChild(child,selectValue,`${key}|${index}`);
            })
        }
        return (<dl>
            <dt onClick={this.toggleGroup}><span
                className="arrow"></span>
                <div className="group-name">{group.attributes["f_name"]}</div>
            </dt>
            <div className="children">{children}</div>
        </dl>)
    },
    toggleGroup: function (e) {
        var parent = e.currentTarget.parentNode;
        if (parent.className == "collapse") {
            parent.className = ""
        } else {
            parent.className = "collapse"
        }
        //console.log(111);
    },
    createPage : function (leaf,selectValue,key) {
        var leafID = leaf.get("page_uid");
        return <div key={key} className={leafID==selectValue?"page-name selected":"page-name"}
                    onClick={this.leafClick.bind(this,leafID)}>{leaf.get("f_name")}</div>
    },
    toggle     : function () {
        var expand = this.state.expand;
        this.setState({expand: !expand});
    },

    stopClick  : function (e) {
        e.stopPropagation()
    },
    leafClick  : function (pageuid) {
        this.props.onSelect(pageuid);
        this.close()
    },
    close      : function (e) {
        this.setState({expand: false});
    },
    render     : function () {


        return <div className="schema" tabIndex="-1" onBlur={this.close}>
            <div className={this.state.expand?"title expand":"title"} onClick={this.toggle}>{this.state.pageName}</div>
            <div className={this.state.expand?"optionpanel show":"optionpanel hide"} onClick={this.stopClick}>
                {this.state.children}
            </div>
        </div>
    }

});

module.exports = Schema;