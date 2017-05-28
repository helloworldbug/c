/**
 * @component MapEditTab
 * @description 地图元素编辑设置
 * @time 2015-09-17 10:29
 * @author Nick
 **/

var React = require('react');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var GlobalFunc = require('../../../Common/GlobalFunc');
var map, local, marker, valueObj;
var PositionAndSize = require("./SettingComponents/PositionAndSize");
var Range = require("./SettingComponents/Range");
var DisplayStateEdit = require("./DisplayStateEdit");

var MapEditTab = React.createClass({

    getInitialState: function () {
        return {
            searchKey    : '',
            searchResults: ''
        }
    },

    componentDidMount: function () {
        this.loadMap();
    },
    componentWillUnmount:function(){
        //console.log("Unmount");
        document.removeEventListener("click", this.hideSearchResults);
    },

    render: function () {
        var attributes = this.props.attributes, _this = this;
        var height = document.body.clientHeight - 54 - 40;

        var searchResults;
        if (this.props.isTimelineFrame === true) {
            return <div className="setting-container" style={{height:height}}>
                <header onClick={this._headerClick.bind(this, "base-style", "setting-base-style")}><span>基础样式</span><b id="base-style"/></header>
                <div id="setting-base-style">
                    <span className="clearTop"/>
                    <PositionAndSize attributes={attributes}/>
                </div>
            </div>
        }
        if (!!this.state.searchResults) {
            if (this.state.searchResults.length > 0) {
                searchResults = <ul id="results" className="results">
                    {this.state.searchResults.map(function (result,index) {
                        return <li key={index} onClick={_this.addMarker.bind(_this, result.point.lng, result.point.lat, result.title)}>
                            <span className="title">{result.title}</span>
                            <span className="address">{result.address}</span>
                        </li>
                        })}
                </ul>;
            } else {
                searchResults = <ul id="results" className="results">
                    <li>
                        <span className="title">未搜索到该地址</span>
                    </li>
                </ul>;
            }
        }

        return (
            <div className="setting-container" style={{height:height}}>
                <span className="clearTop"/>
                <div className="setting-input-text">
                    <h1>元素名称</h1>
                    <input type="text" value={GlobalFunc.htmlDecode(attributes.f_name)} onChange={this._changeName} maxLength="20"/>
                </div>
                <header onClick={this._headerClick.bind(this, "base-style", "setting-base-style")}><span>基础样式</span><b id="base-style"/></header>
                <div id="setting-base-style">
                    <span className="clearTop"/>
                    <PositionAndSize attributes={attributes}/>
                    <DisplayStateEdit attributes={attributes}/>
                    <Range title="不透明度" parameter="item_opacity" value={attributes["item_opacity"]}
                           defaultValue={0} max={100} min={0} step={1} isNumber={true}/>

                    <Range title="旋转角度" parameter="rotate_angle" value={attributes["rotate_angle"]}
                           defaultValue={0} max={360} min={0} step={1} isNumber={true}/>
                </div>
                <header onClick={this._headerClick.bind(this, "map-style", "setting-map")}><span>地图选项</span><b id="map-style"/></header>
                <div id="setting-map">
                    <span className="clearTop"/>
                    <div className="setting-map-search">
                        <h1>地理位置</h1>
                        <input type="text" value={this.state.searchKey} onChange={this.searchMap}/>
                        {searchResults}
                    </div>
                    <div className="setting-map-container" id="mapContainer"></div>
                </div>
            </div>
        );
    },
    _changeName    : function (event) {
        MakeActionCreators.updateElement({f_name: GlobalFunc.htmlEncode(event.target.value)});
    },
    _headerClick: function (buttonID, contentID) {
        $("#" + contentID).slideToggle();
        $("#" + buttonID).toggleClass("hide").toggleClass("show");
    },

    loadMap: function () {
        var _this = this, itemVal = this.props.attributes['item_val'] || '{"static":"http://api.map.baidu.com/staticimage/v2?ak=VzFAGGC7tDTFzqKKIsTI7GRV&copyright=1&center=","lng":121.618461,"lat":31.213248,"zoom":15}';
        valueObj = JSON.parse(itemVal);

        //加载地图
        map = new BMap.Map("mapContainer");
        var point = new BMap.Point(valueObj.lng, valueObj.lat);
        marker = new BMap.Marker(point);
        map.centerAndZoom(point, valueObj.zoom);//设置默认点和缩放比例
        map.addOverlay(marker);//设置默认标注
        var opts = {type: BMAP_NAVIGATION_CONTROL_ZOOM};
        map.addControl(new BMap.NavigationControl(opts));

        //添加单击事件监听
        map.addEventListener("click", function (event) {
            var lng = event.point.lng, lat = event.point.lat, zoom = this.getZoom();
            _this.addMarker(lng, lat, "", zoom);
        });
        document.addEventListener("click", this.hideSearchResults);


        //搜索结果
        var options = {
            renderOptions   : {map: map, autoViewport: true},
            pageCapacity    : 8,
            onSearchComplete: function (results) {
                var s = [];
                // debugger;
                if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                    for (var i = 0; i < results.getCurrentNumPois(); i++) {
                        // s.push({title:results.getPoi(i).title,address:results.getPoi(i).addressgi} );
                        //s.push(results.xr[i]);
                        s.push(results.getPoi(i));
                    }
                }
                _this.setState({
                    searchResults: s
                })
            }
        };
        local = new BMap.LocalSearch(map, options);
    },

    searchMap: function (event) {
        var value = event.target.value;
        this.setState({
            searchKey: value
        });
        local.search(value);
    },

    /** 添加标注
     * @param lng 经度
     * @param lat 纬度
     * @param title 标题
     * @param zoom 缩放比
     */
    addMarker: function (lng, lat, title, zoom) {
        zoom = typeof zoom == "number" ? zoom : 15;
        this.setState({
            searchKey    : title,
            searchResults: null
        });
        local.clearResults();
        map.removeOverlay(marker);
        var point = new BMap.Point(lng, lat);
        marker = new BMap.Marker(point);
        map.centerAndZoom(point, zoom);
        map.addOverlay(marker);

        valueObj.lng = lng;
        valueObj.lat = lat;
        valueObj.zoom = zoom;
        var str = JSON.stringify(valueObj);
        MakeActionCreators.updateElement({item_val: str});
    },

    hideSearchResults: function () {
        this.setState({
            searchResults: null
        })
    },

    _changeSizeWidth: function (event) {
        if (event.target.value == 0) return;
        MakeActionCreators.updateElement({item_width: event.target.value / this.props.attributes["x_scale"]});
    },

    _changeSizeHeight: function (event) {
        if (event.target.value == 0) return;
        MakeActionCreators.updateElement({item_height: event.target.value / this.props.attributes["y_scale"]});
    },

    _changeParameter: function (key, event) {
        MakeActionCreators.updateElement({[key]: Math.round(event.target.value)});
    }
});

module.exports = MapEditTab;