/**
 * @component HelperBox组件
 * @description 帮助中心
 * @time 2015-10-29
 * @author misterY
 **/

var React = require("react");

var HelperBox = React.createClass({

    getInitialState(){
        return {
            isContentShow: this.props.isOpen
        }
    },

    helperBoxTitleBtn(){
        this.setState({
            isContentShow: !this.state.isContentShow
        })
    },

    render() {
        var data = this.props.attr;
        return (
            <div className="helperBox">
                <div className="helperBoxTitle" onClick={this.helperBoxTitleBtn}>
                    <span>{data.attributes.title}</span>
                    <span
                        className={"helperBoxTitleBtn " + (!this.state.isContentShow?'':'active')}>
                    </span>
                </div>
                <div id="helperBoxContent" 
                    style={{display:!this.state.isContentShow?'none':'block'}}
                    className="helperBoxContent"
                    dangerouslySetInnerHTML={
                        {__html: data.attributes.content}
                    } >
                </div>
            </div>
        )
    }
});

module.exports = HelperBox;