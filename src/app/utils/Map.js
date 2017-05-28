/**
 * @name 地图类
 * @time 2015-10-14
 * @author 曾文彬
*/

'use strict';

// require core module
var React = require('react');

// define map class
class Map {

    constructor(id, src, options) {
        this.id = id;
        this.src = src;
        this.options = options || {};

        this.render();
    }

    asyncLoaded() {
        this.setOptions();
    }

    getScriptDOM() {
        var mapScript = document.createElement('script');
        mapScript.type = 'text/javascript';
        mapScript.async = 'async';
        mapScript.src = this.src;
        document.body.appendChild(mapScript);

        return mapScript;   
    }

    setOptions() {
        if (!BMap || !BMap.Map) return; 
        
        var options = this.options;

        var map = new BMap.Map(this.id);

        // 创建坐标
        var point = new BMap.Point(options.point[0], options.point[1]);
        map.centerAndZoom(point, 11);

        // 创建标注
        map.clearOverlays();
        var marker = new BMap.Marker(point);// (new BMap.Marker).apply(BMap.Marker, options.point);
        map.addOverlay(marker);
        map.panTo(point);

        //添加地图类型控件
        map.addControl(new BMap.MapTypeControl());
        
        // 设置地图显示的城市 必须设置的
        map.setCurrentCity(options.city);       

        //开启鼠标滚轮缩放
        map.enableScrollWheelZoom(true); 
    }

    render() {
        var mapScript = this.getScriptDOM();
        mapScript.onload = this.asyncLoaded.bind(this);
    }
}

// export map class
module.exports = Map;