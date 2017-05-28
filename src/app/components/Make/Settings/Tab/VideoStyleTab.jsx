/**
 * @component VideoStyleTab
 * @description 视频样式设置
 * @time 2015-12-01 16:26
 * @author Nick
 **/

var React = require('react');
var Range = require("./SettingComponents/Range");

var VideoStyleTab = React.createClass({

    render: function () {
        var attributes = this.props.attributes;
        var height = document.body.clientHeight - 54 - 40;
        return (
            <div className="setting-container" style={{height:height}}>

                <span className="clearTop"/>

                <Range title="不透明度" parameter="item_opacity" value={attributes["item_opacity"]}
                       defaultValue={0} max={100} min={0} step={1} isNumber={true}/>

                <Range title="旋转角度" parameter="rotate_angle" value={attributes["rotate_angle"]}
                       defaultValue={0} max={360} min={0} step={1} isNumber={true}/>

            </div>
        );
    }

});

module.exports = VideoStyleTab;