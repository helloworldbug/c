;(function(){function require(name){var module=require.modules[name];if(!module)throw new Error('failed to require "'+name+'"');if(!("exports"in module)&&typeof module.definition==="function"){module.client=module.component=true;module.definition.call(this,module.exports={},module);delete module.definition}return module.exports}require.loader="component";require.helper={};require.helper.semVerSort=function(a,b){var aArray=a.version.split(".");var bArray=b.version.split(".");for(var i=0;i<aArray.length;++i){var aInt=parseInt(aArray[i],10);var bInt=parseInt(bArray[i],10);if(aInt===bInt){var aLex=aArray[i].substr((""+aInt).length);var bLex=bArray[i].substr((""+bInt).length);if(aLex===""&&bLex!=="")return 1;if(aLex!==""&&bLex==="")return-1;if(aLex!==""&&bLex!=="")return aLex>bLex?1:-1;continue}else if(aInt>bInt){return 1}else{return-1}}return 0};require.latest=function(name,returnPath){function showError(name){throw new Error('failed to find latest module of "'+name+'"')}var versionRegexp=/(.*)~(.*)@v?(\d+\.\d+\.\d+[^\/]*)$/;var remoteRegexp=/(.*)~(.*)/;if(!remoteRegexp.test(name))showError(name);var moduleNames=Object.keys(require.modules);var semVerCandidates=[];var otherCandidates=[];for(var i=0;i<moduleNames.length;i++){var moduleName=moduleNames[i];if(new RegExp(name+"@").test(moduleName)){var version=moduleName.substr(name.length+1);var semVerMatch=versionRegexp.exec(moduleName);if(semVerMatch!=null){semVerCandidates.push({version:version,name:moduleName})}else{otherCandidates.push({version:version,name:moduleName})}}}if(semVerCandidates.concat(otherCandidates).length===0){showError(name)}if(semVerCandidates.length>0){var module=semVerCandidates.sort(require.helper.semVerSort).pop().name;if(returnPath===true){return module}return require(module)}var module=otherCandidates.sort(function(a,b){return a.name>b.name})[0].name;if(returnPath===true){return module}return require(module)};require.modules={};require.register=function(name,definition){require.modules[name]={definition:definition}};require.define=function(name,exports){require.modules[name]={exports:exports}};require.register("component~transform-property@0.0.1",function(exports,module){var styles=["webkitTransform","MozTransform","msTransform","OTransform","transform"];var el=document.createElement("p");var style;for(var i=0;i<styles.length;i++){style=styles[i];if(null!=el.style[style]){module.exports=style;break}}});require.register("component~has-translate3d@0.0.3",function(exports,module){var prop=require("component~transform-property@0.0.1");if(!prop||!window.getComputedStyle){module.exports=false}else{var map={webkitTransform:"-webkit-transform",OTransform:"-o-transform",msTransform:"-ms-transform",MozTransform:"-moz-transform",transform:"transform"};var el=document.createElement("div");el.style[prop]="translate3d(1px,1px,1px)";document.body.insertBefore(el,null);var val=getComputedStyle(el).getPropertyValue(map[prop]);document.body.removeChild(el);module.exports=null!=val&&val.length&&"none"!=val}});require.register("yields~has-transitions@1.0.0",function(exports,module){exports=module.exports=function(el){switch(arguments.length){case 0:return bool;case 1:return bool?transitions(el):bool}};function transitions(el,styl){if(el.transition)return true;styl=window.getComputedStyle(el);return!!parseFloat(styl.transitionDuration,10)}var styl=document.body.style;var bool="transition"in styl||"webkitTransition"in styl||"MozTransition"in styl||"msTransition"in styl});require.register("component~event@0.1.4",function(exports,module){var bind=window.addEventListener?"addEventListener":"attachEvent",unbind=window.removeEventListener?"removeEventListener":"detachEvent",prefix=bind!=="addEventListener"?"on":"";exports.bind=function(el,type,fn,capture){el[bind](prefix+type,fn,capture||false);return fn};exports.unbind=function(el,type,fn,capture){el[unbind](prefix+type,fn,capture||false);return fn}});require.register("ecarter~css-emitter@0.0.1",function(exports,module){var events=require("component~event@0.1.4");var watch=["transitionend","webkitTransitionEnd","oTransitionEnd","MSTransitionEnd","animationend","webkitAnimationEnd","oAnimationEnd","MSAnimationEnd"];module.exports=CssEmitter;function CssEmitter(element){if(!(this instanceof CssEmitter))return new CssEmitter(element);this.el=element}CssEmitter.prototype.bind=function(fn){for(var i=0;i<watch.length;i++){events.bind(this.el,watch[i],fn)}return this};CssEmitter.prototype.unbind=function(fn){for(var i=0;i<watch.length;i++){events.unbind(this.el,watch[i],fn)}return this};CssEmitter.prototype.once=function(fn){var self=this;function on(){self.unbind(on);fn.apply(self.el,arguments)}self.bind(on);return this}});require.register("component~once@0.0.1",function(exports,module){var n=0;var global=function(){return this}();module.exports=function(fn){var id=n++;function once(){if(this==global){if(once.called)return;once.called=true;return fn.apply(this,arguments)}var key="__called_"+id+"__";if(this[key])return;this[key]=true;return fn.apply(this,arguments)}return once}});require.register("yields~after-transition@0.0.1",function(exports,module){var has=require("yields~has-transitions@1.0.0"),emitter=require("ecarter~css-emitter@0.0.1"),once=require("component~once@0.0.1");var supported=has();module.exports=after;function after(el,fn){if(!supported||!has(el))return fn();emitter(el).bind(fn);return fn}after.once=function(el,fn){var callback=once(fn);after(el,fn=function(){emitter(el).unbind(fn);callback()})}});require.register("component~emitter@1.2.0",function(exports,module){module.exports=Emitter;function Emitter(obj){if(obj)return mixin(obj)}function mixin(obj){for(var key in Emitter.prototype){obj[key]=Emitter.prototype[key]}return obj}Emitter.prototype.on=Emitter.prototype.addEventListener=function(event,fn){this._callbacks=this._callbacks||{};(this._callbacks["$"+event]=this._callbacks["$"+event]||[]).push(fn);return this};Emitter.prototype.once=function(event,fn){function on(){this.off(event,on);fn.apply(this,arguments)}on.fn=fn;this.on(event,on);return this};Emitter.prototype.off=Emitter.prototype.removeListener=Emitter.prototype.removeAllListeners=Emitter.prototype.removeEventListener=function(event,fn){this._callbacks=this._callbacks||{};if(0==arguments.length){this._callbacks={};return this}var callbacks=this._callbacks["$"+event];if(!callbacks)return this;if(1==arguments.length){delete this._callbacks["$"+event];return this}var cb;for(var i=0;i<callbacks.length;i++){cb=callbacks[i];if(cb===fn||cb.fn===fn){callbacks.splice(i,1);break}}return this};Emitter.prototype.emit=function(event){this._callbacks=this._callbacks||{};var args=[].slice.call(arguments,1),callbacks=this._callbacks["$"+event];if(callbacks){callbacks=callbacks.slice(0);for(var i=0,len=callbacks.length;i<len;++i){callbacks[i].apply(this,args)}}return this};Emitter.prototype.listeners=function(event){this._callbacks=this._callbacks||{};return this._callbacks["$"+event]||[]};Emitter.prototype.hasListeners=function(event){return!!this.listeners(event).length}});require.register("yields~css-ease@0.0.1",function(exports,module){module.exports={"in":"ease-in",out:"ease-out","in-out":"ease-in-out",snap:"cubic-bezier(0,1,.5,1)",linear:"cubic-bezier(0.250, 0.250, 0.750, 0.750)","ease-in-quad":"cubic-bezier(0.550, 0.085, 0.680, 0.530)","ease-in-cubic":"cubic-bezier(0.550, 0.055, 0.675, 0.190)","ease-in-quart":"cubic-bezier(0.895, 0.030, 0.685, 0.220)","ease-in-quint":"cubic-bezier(0.755, 0.050, 0.855, 0.060)","ease-in-sine":"cubic-bezier(0.470, 0.000, 0.745, 0.715)","ease-in-expo":"cubic-bezier(0.950, 0.050, 0.795, 0.035)","ease-in-circ":"cubic-bezier(0.600, 0.040, 0.980, 0.335)","ease-in-back":"cubic-bezier(0.600, -0.280, 0.735, 0.045)","ease-out-quad":"cubic-bezier(0.250, 0.460, 0.450, 0.940)","ease-out-cubic":"cubic-bezier(0.215, 0.610, 0.355, 1.000)","ease-out-quart":"cubic-bezier(0.165, 0.840, 0.440, 1.000)","ease-out-quint":"cubic-bezier(0.230, 1.000, 0.320, 1.000)","ease-out-sine":"cubic-bezier(0.390, 0.575, 0.565, 1.000)","ease-out-expo":"cubic-bezier(0.190, 1.000, 0.220, 1.000)","ease-out-circ":"cubic-bezier(0.075, 0.820, 0.165, 1.000)","ease-out-back":"cubic-bezier(0.175, 0.885, 0.320, 1.275)","ease-out-quad":"cubic-bezier(0.455, 0.030, 0.515, 0.955)","ease-out-cubic":"cubic-bezier(0.645, 0.045, 0.355, 1.000)","ease-in-out-quart":"cubic-bezier(0.770, 0.000, 0.175, 1.000)","ease-in-out-quint":"cubic-bezier(0.860, 0.000, 0.070, 1.000)","ease-in-out-sine":"cubic-bezier(0.445, 0.050, 0.550, 0.950)","ease-in-out-expo":"cubic-bezier(1.000, 0.000, 0.000, 1.000)","ease-in-out-circ":"cubic-bezier(0.785, 0.135, 0.150, 0.860)","ease-in-out-back":"cubic-bezier(0.680, -0.550, 0.265, 1.550)"}});require.register("component~query@0.0.3",function(exports,module){function one(selector,el){return el.querySelector(selector)}exports=module.exports=function(selector,el){el=el||document;return one(selector,el)};exports.all=function(selector,el){el=el||document;return el.querySelectorAll(selector)};exports.engine=function(obj){if(!obj.one)throw new Error(".one callback required");if(!obj.all)throw new Error(".all callback required");one=obj.one;exports.all=obj.all;return exports}});require.register("move",function(exports,module){var Emitter=require("component~emitter@1.2.0");var query=require("component~query@0.0.3");var after=require("yields~after-transition@0.0.1");var has3d=require("component~has-translate3d@0.0.3");var ease=require("yields~css-ease@0.0.1");var translate=has3d?["translate3d(",", 0)"]:["translate(",")"];module.exports=Move;var style=window.getComputedStyle||window.currentStyle;Move.version="0.5.0";Move.ease=ease;Move.defaults={duration:500};Move.select=function(selector){if("string"!=typeof selector)return selector;return query(selector)};function Move(el){if(!(this instanceof Move))return new Move(el);if("string"==typeof el)el=query(el);if(!el)throw new TypeError("Move must be initialized with element or selector");this.el=el;this._props={};this._rotate=0;this._transitionProps=[];this._transforms=[];this.duration(Move.defaults.duration)}Emitter(Move.prototype);Move.prototype.transform=function(transform){this._transforms.push(transform);return this};Move.prototype.skew=function(x,y){return this.transform("skew("+x+"deg, "+(y||0)+"deg)")};Move.prototype.skewX=function(n){return this.transform("skewX("+n+"deg)")};Move.prototype.skewY=function(n){return this.transform("skewY("+n+"deg)")};Move.prototype.translate=Move.prototype.to=function(x,y){return this.transform(translate.join(""+x+"px, "+(y||0)+"px"))};Move.prototype.translateX=Move.prototype.x=function(n){return this.transform("translateX("+n+"px)")};Move.prototype.translateY=Move.prototype.y=function(n){return this.transform("translateY("+n+"px)")};Move.prototype.scale=function(x,y){return this.transform("scale("+x+", "+(y||x)+")")};Move.prototype.scaleX=function(n){return this.transform("scaleX("+n+")")};Move.prototype.matrix=function(m11,m12,m21,m22,m31,m32){return this.transform("matrix("+[m11,m12,m21,m22,m31,m32].join(",")+")")};Move.prototype.scaleY=function(n){return this.transform("scaleY("+n+")")};Move.prototype.rotate=function(n){return this.transform("rotate("+n+"deg)")};Move.prototype.ease=function(fn){fn=ease[fn]||fn||"ease";return this.setVendorProperty("transition-timing-function",fn)};Move.prototype.animate=function(name,props){for(var i in props){if(props.hasOwnProperty(i)){this.setVendorProperty("animation-"+i,props[i])}}return this.setVendorProperty("animation-name",name)};Move.prototype.duration=function(n){n=this._duration="string"==typeof n?parseFloat(n)*1e3:n;return this.setVendorProperty("transition-duration",n+"ms")};Move.prototype.delay=function(n){n="string"==typeof n?parseFloat(n)*1e3:n;return this.setVendorProperty("transition-delay",n+"ms")};Move.prototype.setProperty=function(prop,val){this._props[prop]=val;return this};Move.prototype.setVendorProperty=function(prop,val){this.setProperty("-webkit-"+prop,val);this.setProperty("-moz-"+prop,val);this.setProperty("-ms-"+prop,val);this.setProperty("-o-"+prop,val);return this};Move.prototype.set=function(prop,val){this.transition(prop);this._props[prop]=val;return this};Move.prototype.add=function(prop,val){if(!style)return;var self=this;return this.on("start",function(){var curr=parseInt(self.current(prop),10);self.set(prop,curr+val+"px")})};Move.prototype.sub=function(prop,val){if(!style)return;var self=this;return this.on("start",function(){var curr=parseInt(self.current(prop),10);self.set(prop,curr-val+"px")})};Move.prototype.current=function(prop){return style(this.el).getPropertyValue(prop)};Move.prototype.transition=function(prop){if(!this._transitionProps.indexOf(prop))return this;this._transitionProps.push(prop);return this};Move.prototype.applyProperties=function(){for(var prop in this._props){this.el.style.setProperty(prop,this._props[prop],"")}return this};Move.prototype.move=Move.prototype.select=function(selector){this.el=Move.select(selector);return this};Move.prototype.then=function(fn){if(fn instanceof Move){this.on("end",function(){fn.end()})}else if("function"==typeof fn){this.on("end",fn)}else{var clone=new Move(this.el);clone._transforms=this._transforms.slice(0);this.then(clone);clone.parent=this;return clone}return this};Move.prototype.pop=function(){return this.parent};Move.prototype.reset=function(){this.el.style.webkitTransitionDuration=this.el.style.mozTransitionDuration=this.el.style.msTransitionDuration=this.el.style.oTransitionDuration="";return this};Move.prototype.end=function(fn){var self=this;this.emit("start");if(this._transforms.length){this.setVendorProperty("transform",this._transforms.join(" "))}this.setVendorProperty("transition-properties",this._transitionProps.join(", "));this.applyProperties();if(fn)this.then(fn);after.once(this.el,function(){self.reset();self.emit("end")});return this}});if(typeof exports=="object"){module.exports=require("move")}else if(typeof define=="function"&&define.amd){define("move",[],function(){return require("move")})}else{(this||window)["move"]=require("move")}})();

;(function() {
/**
 * 手动封装Zepto. <br/> 
 * 
 * */
var js_libs_zeptodev, js_src_global, js_src_tool, js_src_api, js_src_panelTempl, move,
 js_libs_move, js_src_panelMain, js_src_widget_plugRadioGroup, js_src_widget_plugSwitches,
 js_src_widget_plugDrag, js_src_panelSetting, js_src_catalog, js_src_widget_plugDialog, 
 js_src_message_zh, js_src_bookmark, js_src_panelEdit, js_src_panelShare, js_src_panelDetail,
 js_src_note, js_src_panelCbn, js_src_panelComplaint, js_src_panelSearch, js_src_dom, 
 js_src_widget_plugProgressBar, js_src_countPage, js_src_widget_plugLoading, js_src_panelPrompt,
 js_src_copyright, js_src_panelViewImg, js_src_config, js_src_select, js_src_widget_plugTips, 
 js_src_panelCorrect, js_src_widget_delicateType, js_src_widget_plugVideoMobile, js_src_readerMobile, 
 js_src_pc_panelTemplPc, js_src_pc_copyrightPc, js_src_pc_bookmarkPc, js_src_pc_panelSelectPc, js_src_pc_panelNotePc, 
 js_src_widget_plugVideoPc, js_src_readerPC, js_src_pad_panelTemplPad, js_src_widget_publish, js_src_pad_panelMainPad, 
 js_src_pad_panelSettingPad, js_src_pad_bookmarkPad, js_src_pad_panelEditPad, js_src_pad_panelDetailPad,
 js_src_pad_notePad, js_src_pad_panelCbnPad, js_src_pad_panelComplaintPad, js_src_pad_panelSearchPad,
 js_src_pad_panelCorrectPad, js_src_readerPad, js_src_readerNew;
 

js_libs_zeptodev = function () {
  /* Zepto v1.1.6 - zepto event ajax form ie - zeptojs.com/license */
  var Zepto = function () {
    function L(t) {
      return null == t ? String(t) : j[S.call(t)] || 'object';
    }
    function Z(t) {
      return 'function' == L(t);
    }
    function _(t) {
      return null != t && t == t.window;
    }
    function $(t) {
      return null != t && t.nodeType == t.DOCUMENT_NODE;
    }
    function D(t) {
      return 'object' == L(t);
    }
    function M(t) {
      return D(t) && !_(t) && Object.getPrototypeOf(t) == Object.prototype;
    }
    function R(t) {
      return 'number' == typeof t.length;
    }
    function k(t) {
      return s.call(t, function (t) {
        return null != t;
      });
    }
    function z(t) {
      return t.length > 0 ? n.fn.concat.apply([], t) : t;
    }
    function F(t) {
      return t.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/_/g, '-').toLowerCase();
    }
    function q(t) {
      return t in f ? f[t] : f[t] = new RegExp('(^|\\s)' + t + '(\\s|$)');
    }
    function H(t, e) {
      return 'number' != typeof e || c[F(t)] ? e : e + 'px';
    }
    function I(t) {
      var e, n;
      return u[t] || (e = a.createElement(t), a.body.appendChild(e), n = getComputedStyle(e, '').getPropertyValue('display'), e.parentNode.removeChild(e), 'none' == n && (n = 'block'), u[t] = n), u[t];
    }
    function V(t) {
      return 'children' in t ? o.call(t.children) : n.map(t.childNodes, function (t) {
        return 1 == t.nodeType ? t : void 0;
      });
    }
    function B(n, i, r) {
      for (e in i)
        r && (M(i[e]) || A(i[e])) ? (M(i[e]) && !M(n[e]) && (n[e] = {}), A(i[e]) && !A(n[e]) && (n[e] = []), B(n[e], i[e], r)) : i[e] !== t && (n[e] = i[e]);
    }
    function U(t, e) {
      return null == e ? n(t) : n(t).filter(e);
    }
    function J(t, e, n, i) {
      return Z(e) ? e.call(t, n, i) : e;
    }
    function X(t, e, n) {
      null == n ? t.removeAttribute(e) : t.setAttribute(e, n);
    }
    function W(e, n) {
      var i = e.className || '', r = i && i.baseVal !== t;
      return n === t ? r ? i.baseVal : i : void (r ? i.baseVal = n : e.className = n);
    }
    function Y(t) {
      try {
        return t ? 'true' == t || ('false' == t ? !1 : 'null' == t ? null : +t + '' == t ? +t : /^[\[\{]/.test(t) ? n.parseJSON(t) : t) : t;
      } catch (e) {
        return t;
      }
    }
    function G(t, e) {
      e(t);
      for (var n = 0, i = t.childNodes.length; i > n; n++)
        G(t.childNodes[n], e);
    }
    var t, e, n, i, C, N, r = [], o = r.slice, s = r.filter, a = window.document, u = {}, f = {}, c = {
        'column-count': 1,
        columns: 1,
        'font-weight': 1,
        'line-height': 1,
        opacity: 1,
        'z-index': 1,
        zoom: 1
      }, l = /^\s*<(\w+|!)[^>]*>/, h = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, p = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, d = /^(?:body|html)$/i, m = /([A-Z])/g, g = [
        'val',
        'css',
        'html',
        'text',
        'data',
        'width',
        'height',
        'offset'
      ], v = [
        'after',
        'prepend',
        'before',
        'append'
      ], y = a.createElement('table'), x = a.createElement('tr'), b = {
        tr: a.createElement('tbody'),
        tbody: y,
        thead: y,
        tfoot: y,
        td: x,
        th: x,
        '*': a.createElement('div')
      }, w = /complete|loaded|interactive/, E = /^[\w-]*$/, j = {}, S = j.toString, T = {}, O = a.createElement('div'), P = {
        tabindex: 'tabIndex',
        readonly: 'readOnly',
        'for': 'htmlFor',
        'class': 'className',
        maxlength: 'maxLength',
        cellspacing: 'cellSpacing',
        cellpadding: 'cellPadding',
        rowspan: 'rowSpan',
        colspan: 'colSpan',
        usemap: 'useMap',
        frameborder: 'frameBorder',
        contenteditable: 'contentEditable'
      }, A = Array.isArray || function (t) {
        return t instanceof Array;
      };
    return T.matches = function (t, e) {
      if (!e || !t || 1 !== t.nodeType)
        return !1;
      var n = t.webkitMatchesSelector || t.mozMatchesSelector || t.oMatchesSelector || t.matchesSelector;
      if (n)
        return n.call(t, e);
      var i, r = t.parentNode, o = !r;
      return o && (r = O).appendChild(t), i = ~T.qsa(r, e).indexOf(t), o && O.removeChild(t), i;
    }, C = function (t) {
      return t.replace(/-+(.)?/g, function (t, e) {
        return e ? e.toUpperCase() : '';
      });
    }, N = function (t) {
      return s.call(t, function (e, n) {
        return t.indexOf(e) == n;
      });
    }, T.fragment = function (e, i, r) {
      var s, u, f;
      return h.test(e) && (s = n(a.createElement(RegExp.$1))), s || (e.replace && (e = e.replace(p, '<$1></$2>')), i === t && (i = l.test(e) && RegExp.$1), i in b || (i = '*'), f = b[i], f.innerHTML = '' + e, s = n.each(o.call(f.childNodes), function () {
        f.removeChild(this);
      })), M(r) && (u = n(s), n.each(r, function (t, e) {
        g.indexOf(t) > -1 ? u[t](e) : u.attr(t, e);
      })), s;
    }, T.Z = function (t, e) {
      return t = t || [], t.__proto__ = n.fn, t.selector = e || '', t;
    }, T.isZ = function (t) {
      return t instanceof T.Z;
    }, T.init = function (e, i) {
      var r;
      if (!e)
        return T.Z();
      if ('string' == typeof e)
        if (e = e.trim(), '<' == e[0] && l.test(e))
          r = T.fragment(e, RegExp.$1, i), e = null;
        else {
          if (i !== t)
            return n(i).find(e);
          r = T.qsa(a, e);
        }
      else {
        if (Z(e))
          return n(a).ready(e);
        if (T.isZ(e))
          return e;
        if (A(e))
          r = k(e);
        else if (D(e))
          r = [e], e = null;
        else if (l.test(e))
          r = T.fragment(e.trim(), RegExp.$1, i), e = null;
        else {
          if (i !== t)
            return n(i).find(e);
          r = T.qsa(a, e);
        }
      }
      return T.Z(r, e);
    }, n = function (t, e) {
      return T.init(t, e);
    }, n.extend = function (t) {
      var e, n = o.call(arguments, 1);
      return 'boolean' == typeof t && (e = t, t = n.shift()), n.forEach(function (n) {
        B(t, n, e);
      }), t;
    }, T.qsa = function (t, e) {
      var n, i = '#' == e[0], r = !i && '.' == e[0], s = i || r ? e.slice(1) : e, a = E.test(s);
      return $(t) && a && i ? (n = t.getElementById(s)) ? [n] : [] : 1 !== t.nodeType && 9 !== t.nodeType ? [] : o.call(a && !i ? r ? t.getElementsByClassName(s) : t.getElementsByTagName(e) : t.querySelectorAll(e));
    }, n.contains = a.documentElement.contains ? function (t, e) {
      return t !== e && t.contains(e);
    } : function (t, e) {
      for (; e && (e = e.parentNode);)
        if (e === t)
          return !0;
      return !1;
    }, n.type = L, n.isFunction = Z, n.isWindow = _, n.isArray = A, n.isPlainObject = M, n.isEmptyObject = function (t) {
      var e;
      for (e in t)
        return !1;
      return !0;
    }, n.inArray = function (t, e, n) {
      return r.indexOf.call(e, t, n);
    }, n.camelCase = C, n.trim = function (t) {
      return null == t ? '' : String.prototype.trim.call(t);
    }, n.uuid = 0, n.support = {}, n.expr = {}, n.map = function (t, e) {
      var n, r, o, i = [];
      if (R(t))
        for (r = 0; r < t.length; r++)
          n = e(t[r], r), null != n && i.push(n);
      else
        for (o in t)
          n = e(t[o], o), null != n && i.push(n);
      return z(i);
    }, n.each = function (t, e) {
      var n, i;
      if (R(t)) {
        for (n = 0; n < t.length; n++)
          if (e.call(t[n], n, t[n]) === !1)
            return t;
      } else
        for (i in t)
          if (e.call(t[i], i, t[i]) === !1)
            return t;
      return t;
    }, n.grep = function (t, e) {
      return s.call(t, e);
    }, window.JSON && (n.parseJSON = JSON.parse), n.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function (t, e) {
      j['[object ' + e + ']'] = e.toLowerCase();
    }), n.fn = {
      forEach: r.forEach,
      reduce: r.reduce,
      push: r.push,
      sort: r.sort,
      indexOf: r.indexOf,
      concat: r.concat,
      map: function (t) {
        return n(n.map(this, function (e, n) {
          return t.call(e, n, e);
        }));
      },
      slice: function () {
        return n(o.apply(this, arguments));
      },
      ready: function (t) {
        return w.test(a.readyState) && a.body ? t(n) : a.addEventListener('DOMContentLoaded', function () {
          t(n);
        }, !1), this;
      },
      get: function (e) {
        return e === t ? o.call(this) : this[e >= 0 ? e : e + this.length];
      },
      toArray: function () {
        return this.get();
      },
      size: function () {
        return this.length;
      },
      remove: function () {
        return this.each(function () {
          null != this.parentNode && this.parentNode.removeChild(this);
        });
      },
      each: function (t) {
        return r.every.call(this, function (e, n) {
          return t.call(e, n, e) !== !1;
        }), this;
      },
      filter: function (t) {
        return Z(t) ? this.not(this.not(t)) : n(s.call(this, function (e) {
          return T.matches(e, t);
        }));
      },
      add: function (t, e) {
        return n(N(this.concat(n(t, e))));
      },
      is: function (t) {
        return this.length > 0 && T.matches(this[0], t);
      },
      not: function (e) {
        var i = [];
        if (Z(e) && e.call !== t)
          this.each(function (t) {
            e.call(this, t) || i.push(this);
          });
        else {
          var r = 'string' == typeof e ? this.filter(e) : R(e) && Z(e.item) ? o.call(e) : n(e);
          this.forEach(function (t) {
            r.indexOf(t) < 0 && i.push(t);
          });
        }
        return n(i);
      },
      has: function (t) {
        return this.filter(function () {
          return D(t) ? n.contains(this, t) : n(this).find(t).size();
        });
      },
      eq: function (t) {
        return -1 === t ? this.slice(t) : this.slice(t, +t + 1);
      },
      first: function () {
        var t = this[0];
        return t && !D(t) ? t : n(t);
      },
      last: function () {
        var t = this[this.length - 1];
        return t && !D(t) ? t : n(t);
      },
      find: function (t) {
        var e, i = this;
        return e = t ? 'object' == typeof t ? n(t).filter(function () {
          var t = this;
          return r.some.call(i, function (e) {
            return n.contains(e, t);
          });
        }) : 1 == this.length ? n(T.qsa(this[0], t)) : this.map(function () {
          return T.qsa(this, t);
        }) : n();
      },
      closest: function (t, e) {
        var i = this[0], r = !1;
        for ('object' == typeof t && (r = n(t)); i && !(r ? r.indexOf(i) >= 0 : T.matches(i, t));)
          i = i !== e && !$(i) && i.parentNode;
        return n(i);
      },
      parents: function (t) {
        for (var e = [], i = this; i.length > 0;)
          i = n.map(i, function (t) {
            return (t = t.parentNode) && !$(t) && e.indexOf(t) < 0 ? (e.push(t), t) : void 0;
          });
        return U(e, t);
      },
      parent: function (t) {
        return U(N(this.pluck('parentNode')), t);
      },
      children: function (t) {
        return U(this.map(function () {
          return V(this);
        }), t);
      },
      contents: function () {
        return this.map(function () {
          return o.call(this.childNodes);
        });
      },
      siblings: function (t) {
        return U(this.map(function (t, e) {
          return s.call(V(e.parentNode), function (t) {
            return t !== e;
          });
        }), t);
      },
      empty: function () {
        return this.each(function () {
          this.innerHTML = '';
        });
      },
      pluck: function (t) {
        return n.map(this, function (e) {
          return e[t];
        });
      },
      show: function () {
        return this.each(function () {
          'none' == this.style.display && (this.style.display = ''), 'none' == getComputedStyle(this, '').getPropertyValue('display') && (this.style.display = I(this.nodeName));
        });
      },
      replaceWith: function (t) {
        return this.before(t).remove();
      },
      wrap: function (t) {
        var e = Z(t);
        if (this[0] && !e)
          var i = n(t).get(0), r = i.parentNode || this.length > 1;
        return this.each(function (o) {
          n(this).wrapAll(e ? t.call(this, o) : r ? i.cloneNode(!0) : i);
        });
      },
      wrapAll: function (t) {
        if (this[0]) {
          n(this[0]).before(t = n(t));
          for (var e; (e = t.children()).length;)
            t = e.first();
          n(t).append(this);
        }
        return this;
      },
      wrapInner: function (t) {
        var e = Z(t);
        return this.each(function (i) {
          var r = n(this), o = r.contents(), s = e ? t.call(this, i) : t;
          o.length ? o.wrapAll(s) : r.append(s);
        });
      },
      unwrap: function () {
        return this.parent().each(function () {
          n(this).replaceWith(n(this).children());
        }), this;
      },
      clone: function () {
        return this.map(function () {
          return this.cloneNode(!0);
        });
      },
      hide: function () {
        return this.css('display', 'none');
      },
      toggle: function (e) {
        return this.each(function () {
          var i = n(this);
          (e === t ? 'none' == i.css('display') : e) ? i.show() : i.hide();
        });
      },
      prev: function (t) {
        return n(this.pluck('previousElementSibling')).filter(t || '*');
      },
      next: function (t) {
        return n(this.pluck('nextElementSibling')).filter(t || '*');
      },
      html: function (t) {
        return 0 in arguments ? this.each(function (e) {
          var i = this.innerHTML;
          n(this).empty().append(J(this, t, e, i));
        }) : 0 in this ? this[0].innerHTML : null;
      },
      text: function (t) {
        return 0 in arguments ? this.each(function (e) {
          var n = J(this, t, e, this.textContent);
          this.textContent = null == n ? '' : '' + n;
        }) : 0 in this ? this[0].textContent : null;
      },
      attr: function (n, i) {
        var r;
        return 'string' != typeof n || 1 in arguments ? this.each(function (t) {
          if (1 === this.nodeType)
            if (D(n))
              for (e in n)
                X(this, e, n[e]);
            else
              X(this, n, J(this, i, t, this.getAttribute(n)));
        }) : this.length && 1 === this[0].nodeType ? !(r = this[0].getAttribute(n)) && n in this[0] ? this[0][n] : r : t;
      },
      removeAttr: function (t) {
        return this.each(function () {
          1 === this.nodeType && t.split(' ').forEach(function (t) {
            X(this, t);
          }, this);
        });
      },
      prop: function (t, e) {
        return t = P[t] || t, 1 in arguments ? this.each(function (n) {
          this[t] = J(this, e, n, this[t]);
        }) : this[0] && this[0][t];
      },
      data: function (e, n) {
        var i = 'data-' + e.replace(m, '-$1').toLowerCase(), r = 1 in arguments ? this.attr(i, n) : this.attr(i);
        return null !== r ? Y(r) : t;
      },
      val: function (t) {
        return 0 in arguments ? this.each(function (e) {
          this.value = J(this, t, e, this.value);
        }) : this[0] && (this[0].multiple ? n(this[0]).find('option').filter(function () {
          return this.selected;
        }).pluck('value') : this[0].value);
      },
      offset: function (t) {
        if (t)
          return this.each(function (e) {
            var i = n(this), r = J(this, t, e, i.offset()), o = i.offsetParent().offset(), s = {
                top: r.top - o.top,
                left: r.left - o.left
              };
            'static' == i.css('position') && (s.position = 'relative'), i.css(s);
          });
        if (!this.length)
          return null;
        var e = this[0].getBoundingClientRect();
        return {
          left: e.left + window.pageXOffset,
          top: e.top + window.pageYOffset,
          width: Math.round(e.width),
          height: Math.round(e.height)
        };
      },
      css: function (t, i) {
        if (arguments.length < 2) {
          var r, o = this[0];
          if (!o)
            return;
          if (r = getComputedStyle(o, ''), 'string' == typeof t)
            return o.style[C(t)] || r.getPropertyValue(t);
          if (A(t)) {
            var s = {};
            return n.each(t, function (t, e) {
              s[e] = o.style[C(e)] || r.getPropertyValue(e);
            }), s;
          }
        }
        var a = '';
        if ('string' == L(t))
          i || 0 === i ? a = F(t) + ':' + H(t, i) : this.each(function () {
            this.style.removeProperty(F(t));
          });
        else
          for (e in t)
            t[e] || 0 === t[e] ? a += F(e) + ':' + H(e, t[e]) + ';' : this.each(function () {
              this.style.removeProperty(F(e));
            });
        return this.each(function () {
          this.style.cssText += ';' + a;
        });
      },
      index: function (t) {
        return t ? this.indexOf(n(t)[0]) : this.parent().children().indexOf(this[0]);
      },
      hasClass: function (t) {
        return t ? r.some.call(this, function (t) {
          return this.test(W(t));
        }, q(t)) : !1;
      },
      addClass: function (t) {
        return t ? this.each(function (e) {
          if ('className' in this) {
            i = [];
            var r = W(this), o = J(this, t, e, r);
            o.split(/\s+/g).forEach(function (t) {
              n(this).hasClass(t) || i.push(t);
            }, this), i.length && W(this, r + (r ? ' ' : '') + i.join(' '));
          }
        }) : this;
      },
      removeClass: function (e) {
        return this.each(function (n) {
          if ('className' in this) {
            if (e === t)
              return W(this, '');
            i = W(this), J(this, e, n, i).split(/\s+/g).forEach(function (t) {
              i = i.replace(q(t), ' ');
            }), W(this, i.trim());
          }
        });
      },
      toggleClass: function (e, i) {
        return e ? this.each(function (r) {
          var o = n(this), s = J(this, e, r, W(this));
          s.split(/\s+/g).forEach(function (e) {
            (i === t ? !o.hasClass(e) : i) ? o.addClass(e) : o.removeClass(e);
          });
        }) : this;
      },
      scrollTop: function (e) {
        if (this.length) {
          var n = 'scrollTop' in this[0];
          return e === t ? n ? this[0].scrollTop : this[0].pageYOffset : this.each(n ? function () {
            this.scrollTop = e;
          } : function () {
            this.scrollTo(this.scrollX, e);
          });
        }
      },
      scrollLeft: function (e) {
        if (this.length) {
          var n = 'scrollLeft' in this[0];
          return e === t ? n ? this[0].scrollLeft : this[0].pageXOffset : this.each(n ? function () {
            this.scrollLeft = e;
          } : function () {
            this.scrollTo(e, this.scrollY);
          });
        }
      },
      position: function () {
        if (this.length) {
          var t = this[0], e = this.offsetParent(), i = this.offset(), r = d.test(e[0].nodeName) ? {
              top: 0,
              left: 0
            } : e.offset();
          return i.top -= parseFloat(n(t).css('margin-top')) || 0, i.left -= parseFloat(n(t).css('margin-left')) || 0, r.top += parseFloat(n(e[0]).css('border-top-width')) || 0, r.left += parseFloat(n(e[0]).css('border-left-width')) || 0, {
            top: i.top - r.top,
            left: i.left - r.left
          };
        }
      },
      offsetParent: function () {
        return this.map(function () {
          for (var t = this.offsetParent || a.body; t && !d.test(t.nodeName) && 'static' == n(t).css('position');)
            t = t.offsetParent;
          return t;
        });
      }
    }, n.fn.detach = n.fn.remove, [
      'width',
      'height'
    ].forEach(function (e) {
      var i = e.replace(/./, function (t) {
        return t[0].toUpperCase();
      });
      n.fn[e] = function (r) {
        var o, s = this[0];
        return r === t ? _(s) ? s['inner' + i] : $(s) ? s.documentElement['scroll' + i] : (o = this.offset()) && o[e] : this.each(function (t) {
          s = n(this), s.css(e, J(this, r, t, s[e]()));
        });
      };
    }), v.forEach(function (t, e) {
      var i = e % 2;
      n.fn[t] = function () {
        var t, o, r = n.map(arguments, function (e) {
            return t = L(e), 'object' == t || 'array' == t || null == e ? e : T.fragment(e);
          }), s = this.length > 1;
        return r.length < 1 ? this : this.each(function (t, u) {
          o = i ? u : u.parentNode, u = 0 == e ? u.nextSibling : 1 == e ? u.firstChild : 2 == e ? u : null;
          var f = n.contains(a.documentElement, o);
          r.forEach(function (t) {
            if (s)
              t = t.cloneNode(!0);
            else if (!o)
              return n(t).remove();
            o.insertBefore(t, u), f && G(t, function (t) {
              null == t.nodeName || 'SCRIPT' !== t.nodeName.toUpperCase() || t.type && 'text/javascript' !== t.type || t.src || window.eval.call(window, t.innerHTML);
            });
          });
        });
      }, n.fn[i ? t + 'To' : 'insert' + (e ? 'Before' : 'After')] = function (e) {
        return n(e)[t](this), this;
      };
    }), T.Z.prototype = n.fn, T.uniq = N, T.deserializeValue = Y, n.zepto = T, n;
  }();
  window.Zepto = Zepto, void 0 === window.$ && (window.$ = Zepto), function (t) {
    function l(t) {
      return t._zid || (t._zid = e++);
    }
    function h(t, e, n, i) {
      if (e = p(e), e.ns)
        var r = d(e.ns);
      return (s[l(t)] || []).filter(function (t) {
        return !(!t || e.e && t.e != e.e || e.ns && !r.test(t.ns) || n && l(t.fn) !== l(n) || i && t.sel != i);
      });
    }
    function p(t) {
      var e = ('' + t).split('.');
      return {
        e: e[0],
        ns: e.slice(1).sort().join(' ')
      };
    }
    function d(t) {
      return new RegExp('(?:^| )' + t.replace(' ', ' .* ?') + '(?: |$)');
    }
    function m(t, e) {
      return t.del && !u && t.e in f || !!e;
    }
    function g(t) {
      return c[t] || u && f[t] || t;
    }
    function v(e, i, r, o, a, u, f) {
      var h = l(e), d = s[h] || (s[h] = []);
      i.split(/\s/).forEach(function (i) {
        if ('ready' == i)
          return t(document).ready(r);
        var s = p(i);
        s.fn = r, s.sel = a, s.e in c && (r = function (e) {
          var n = e.relatedTarget;
          return !n || n !== this && !t.contains(this, n) ? s.fn.apply(this, arguments) : void 0;
        }), s.del = u;
        var l = u || r;
        s.proxy = function (t) {
          if (t = j(t), !t.isImmediatePropagationStopped()) {
            t.data = o;
            var i = l.apply(e, t._args == n ? [t] : [t].concat(t._args));
            return i === !1 && (t.preventDefault(), t.stopPropagation()), i;
          }
        }, s.i = d.length, d.push(s), 'addEventListener' in e && e.addEventListener(g(s.e), s.proxy, m(s, f));
      });
    }
    function y(t, e, n, i, r) {
      var o = l(t);
      (e || '').split(/\s/).forEach(function (e) {
        h(t, e, n, i).forEach(function (e) {
          delete s[o][e.i], 'removeEventListener' in t && t.removeEventListener(g(e.e), e.proxy, m(e, r));
        });
      });
    }
    function j(e, i) {
      return (i || !e.isDefaultPrevented) && (i || (i = e), t.each(E, function (t, n) {
        var r = i[t];
        e[t] = function () {
          return this[n] = x, r && r.apply(i, arguments);
        }, e[n] = b;
      }), (i.defaultPrevented !== n ? i.defaultPrevented : 'returnValue' in i ? i.returnValue === !1 : i.getPreventDefault && i.getPreventDefault()) && (e.isDefaultPrevented = x)), e;
    }
    function S(t) {
      var e, i = { originalEvent: t };
      for (e in t)
        w.test(e) || t[e] === n || (i[e] = t[e]);
      return j(i, t);
    }
    var n, e = 1, i = Array.prototype.slice, r = t.isFunction, o = function (t) {
        return 'string' == typeof t;
      }, s = {}, a = {}, u = 'onfocusin' in window, f = {
        focus: 'focusin',
        blur: 'focusout'
      }, c = {
        mouseenter: 'mouseover',
        mouseleave: 'mouseout'
      };
    a.click = a.mousedown = a.mouseup = a.mousemove = 'MouseEvents', t.event = {
      add: v,
      remove: y
    }, t.proxy = function (e, n) {
      var s = 2 in arguments && i.call(arguments, 2);
      if (r(e)) {
        var a = function () {
          return e.apply(n, s ? s.concat(i.call(arguments)) : arguments);
        };
        return a._zid = l(e), a;
      }
      if (o(n))
        return s ? (s.unshift(e[n], e), t.proxy.apply(null, s)) : t.proxy(e[n], e);
      throw new TypeError('expected function');
    }, t.fn.bind = function (t, e, n) {
      return this.on(t, e, n);
    }, t.fn.unbind = function (t, e) {
      return this.off(t, e);
    }, t.fn.one = function (t, e, n, i) {
      return this.on(t, e, n, i, 1);
    };
    var x = function () {
        return !0;
      }, b = function () {
        return !1;
      }, w = /^([A-Z]|returnValue$|layer[XY]$)/, E = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      };
    t.fn.delegate = function (t, e, n) {
      return this.on(e, t, n);
    }, t.fn.undelegate = function (t, e, n) {
      return this.off(e, t, n);
    }, t.fn.live = function (e, n) {
      return t(document.body).delegate(this.selector, e, n), this;
    }, t.fn.die = function (e, n) {
      return t(document.body).undelegate(this.selector, e, n), this;
    }, t.fn.on = function (e, s, a, u, f) {
      var c, l, h = this;
      return e && !o(e) ? (t.each(e, function (t, e) {
        h.on(t, s, a, e, f);
      }), h) : (o(s) || r(u) || u === !1 || (u = a, a = s, s = n), (r(a) || a === !1) && (u = a, a = n), u === !1 && (u = b), h.each(function (n, r) {
        f && (c = function (t) {
          return y(r, t.type, u), u.apply(this, arguments);
        }), s && (l = function (e) {
          var n, o = t(e.target).closest(s, r).get(0);
          return o && o !== r ? (n = t.extend(S(e), {
            currentTarget: o,
            liveFired: r
          }), (c || u).apply(o, [n].concat(i.call(arguments, 1)))) : void 0;
        }), v(r, e, u, a, s, l || c);
      }));
    }, t.fn.off = function (e, i, s) {
      var a = this;
      return e && !o(e) ? (t.each(e, function (t, e) {
        a.off(t, i, e);
      }), a) : (o(i) || r(s) || s === !1 || (s = i, i = n), s === !1 && (s = b), a.each(function () {
        y(this, e, s, i);
      }));
    }, t.fn.trigger = function (e, n) {
      return e = o(e) || t.isPlainObject(e) ? t.Event(e) : j(e), e._args = n, this.each(function () {
        e.type in f && 'function' == typeof this[e.type] ? this[e.type]() : 'dispatchEvent' in this ? this.dispatchEvent(e) : t(this).triggerHandler(e, n);
      });
    }, t.fn.triggerHandler = function (e, n) {
      var i, r;
      return this.each(function (s, a) {
        i = S(o(e) ? t.Event(e) : e), i._args = n, i.target = a, t.each(h(a, e.type || e), function (t, e) {
          return r = e.proxy(i), i.isImmediatePropagationStopped() ? !1 : void 0;
        });
      }), r;
    }, 'focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error'.split(' ').forEach(function (e) {
      t.fn[e] = function (t) {
        return 0 in arguments ? this.bind(e, t) : this.trigger(e);
      };
    }), t.Event = function (t, e) {
      o(t) || (e = t, t = e.type);
      var n = document.createEvent(a[t] || 'Events'), i = !0;
      if (e)
        for (var r in e)
          'bubbles' == r ? i = !!e[r] : n[r] = e[r];
      return n.initEvent(t, i, !0), j(n);
    };
  }(Zepto), function (t) {
    function h(e, n, i) {
      var r = t.Event(n);
      return t(e).trigger(r, i), !r.isDefaultPrevented();
    }
    function p(t, e, i, r) {
      return t.global ? h(e || n, i, r) : void 0;
    }
    function d(e) {
      e.global && 0 === t.active++ && p(e, null, 'ajaxStart');
    }
    function m(e) {
      e.global && !--t.active && p(e, null, 'ajaxStop');
    }
    function g(t, e) {
      var n = e.context;
      return e.beforeSend.call(n, t, e) === !1 || p(e, n, 'ajaxBeforeSend', [
        t,
        e
      ]) === !1 ? !1 : void p(e, n, 'ajaxSend', [
        t,
        e
      ]);
    }
    function v(t, e, n, i) {
      var r = n.context, o = 'success';
      n.success.call(r, t, o, e), i && i.resolveWith(r, [
        t,
        o,
        e
      ]), p(n, r, 'ajaxSuccess', [
        e,
        n,
        t
      ]), x(o, e, n);
    }
    function y(t, e, n, i, r) {
      var o = i.context;
      i.error.call(o, n, e, t), r && r.rejectWith(o, [
        n,
        e,
        t
      ]), p(i, o, 'ajaxError', [
        n,
        i,
        t || e
      ]), x(e, n, i);
    }
    function x(t, e, n) {
      var i = n.context;
      n.complete.call(i, e, t), p(n, i, 'ajaxComplete', [
        e,
        n
      ]), m(n);
    }
    function b() {
    }
    function w(t) {
      return t && (t = t.split(';', 2)[0]), t && (t == f ? 'html' : t == u ? 'json' : s.test(t) ? 'script' : a.test(t) && 'xml') || 'text';
    }
    function E(t, e) {
      return '' == e ? t : (t + '&' + e).replace(/[&?]{1,2}/, '?');
    }
    function j(e) {
      e.processData && e.data && 'string' != t.type(e.data) && (e.data = t.param(e.data, e.traditional)), !e.data || e.type && 'GET' != e.type.toUpperCase() || (e.url = E(e.url, e.data), e.data = void 0);
    }
    function S(e, n, i, r) {
      return t.isFunction(n) && (r = i, i = n, n = void 0), t.isFunction(i) || (r = i, i = void 0), {
        url: e,
        data: n,
        success: i,
        dataType: r
      };
    }
    function C(e, n, i, r) {
      var o, s = t.isArray(n), a = t.isPlainObject(n);
      t.each(n, function (n, u) {
        o = t.type(u), r && (n = i ? r : r + '[' + (a || 'object' == o || 'array' == o ? n : '') + ']'), !r && s ? e.add(u.name, u.value) : 'array' == o || !i && 'object' == o ? C(e, u, i, n) : e.add(n, u);
      });
    }
    var i, r, e = 0, n = window.document, o = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, s = /^(?:text|application)\/javascript/i, a = /^(?:text|application)\/xml/i, u = 'application/json', f = 'text/html', c = /^\s*$/, l = n.createElement('a');
    l.href = window.location.href, t.active = 0, t.ajaxJSONP = function (i, r) {
      if (!('type' in i))
        return t.ajax(i);
      var f, h, o = i.jsonpCallback, s = (t.isFunction(o) ? o() : o) || 'jsonp' + ++e, a = n.createElement('script'), u = window[s], c = function (e) {
          t(a).triggerHandler('error', e || 'abort');
        }, l = { abort: c };
      return r && r.promise(l), t(a).on('load error', function (e, n) {
        clearTimeout(h), t(a).off().remove(), 'error' != e.type && f ? v(f[0], l, i, r) : y(null, n || 'error', l, i, r), window[s] = u, f && t.isFunction(u) && u(f[0]), u = f = void 0;
      }), g(l, i) === !1 ? (c('abort'), l) : (window[s] = function () {
        f = arguments;
      }, a.src = i.url.replace(/\?(.+)=\?/, '?$1=' + s), n.head.appendChild(a), i.timeout > 0 && (h = setTimeout(function () {
        c('timeout');
      }, i.timeout)), l);
    }, t.ajaxSettings = {
      type: 'GET',
      beforeSend: b,
      success: b,
      error: b,
      complete: b,
      context: null,
      global: !0,
      xhr: function () {
        return new window.XMLHttpRequest();
      },
      accepts: {
        script: 'text/javascript, application/javascript, application/x-javascript',
        json: u,
        xml: 'application/xml, text/xml',
        html: f,
        text: 'text/plain'
      },
      crossDomain: !1,
      timeout: 0,
      processData: !0,
      cache: !0
    }, t.ajax = function (e) {
      var a, o = t.extend({}, e || {}), s = t.Deferred && t.Deferred();
      for (i in t.ajaxSettings)
        void 0 === o[i] && (o[i] = t.ajaxSettings[i]);
      d(o), o.crossDomain || (a = n.createElement('a'), a.href = o.url, a.href = a.href, o.crossDomain = l.protocol + '//' + l.host != a.protocol + '//' + a.host), o.url || (o.url = window.location.toString()), j(o);
      var u = o.dataType, f = /\?.+=\?/.test(o.url);
      if (f && (u = 'jsonp'), o.cache !== !1 && (e && e.cache === !0 || 'script' != u && 'jsonp' != u) || (o.url = E(o.url, '_=' + Date.now())), 'jsonp' == u)
        return f || (o.url = E(o.url, o.jsonp ? o.jsonp + '=?' : o.jsonp === !1 ? '' : 'callback=?')), t.ajaxJSONP(o, s);
      var C, h = o.accepts[u], p = {}, m = function (t, e) {
          p[t.toLowerCase()] = [
            t,
            e
          ];
        }, x = /^([\w-]+:)\/\//.test(o.url) ? RegExp.$1 : window.location.protocol, S = o.xhr(), T = S.setRequestHeader;
      if (s && s.promise(S), o.crossDomain || m('X-Requested-With', 'XMLHttpRequest'), m('Accept', h || '*/*'), (h = o.mimeType || h) && (h.indexOf(',') > -1 && (h = h.split(',', 2)[0]), S.overrideMimeType && S.overrideMimeType(h)), (o.contentType || o.contentType !== !1 && o.data && 'GET' != o.type.toUpperCase()) && m('Content-Type', o.contentType || 'application/x-www-form-urlencoded'), o.headers)
        for (r in o.headers)
          m(r, o.headers[r]);
      if (S.setRequestHeader = m, S.onreadystatechange = function () {
          if (4 == S.readyState) {
            S.onreadystatechange = b, clearTimeout(C);
            var e, n = !1;
            if (S.status >= 200 && S.status < 300 || 304 == S.status || 0 == S.status && 'file:' == x) {
              u = u || w(o.mimeType || S.getResponseHeader('content-type')), e = S.responseText;
              try {
                'script' == u ? (1, eval)(e) : 'xml' == u ? e = S.responseXML : 'json' == u && (e = c.test(e) ? null : t.parseJSON(e));
              } catch (i) {
                n = i;
              }
              n ? y(n, 'parsererror', S, o, s) : v(e, S, o, s);
            } else
              y(S.statusText || null, S.status ? 'error' : 'abort', S, o, s);
          }
        }, g(S, o) === !1)
        return S.abort(), y(null, 'abort', S, o, s), S;
      if (o.xhrFields)
        for (r in o.xhrFields)
          S[r] = o.xhrFields[r];
      var N = 'async' in o ? o.async : !0;
      S.open(o.type, o.url, N, o.username, o.password);
      for (r in p)
        T.apply(S, p[r]);
      return o.timeout > 0 && (C = setTimeout(function () {
        S.onreadystatechange = b, S.abort(), y(null, 'timeout', S, o, s);
      }, o.timeout)), S.send(o.data ? o.data : null), S;
    }, t.get = function () {
      return t.ajax(S.apply(null, arguments));
    }, t.post = function () {
      var e = S.apply(null, arguments);
      return e.type = 'POST', t.ajax(e);
    }, t.getJSON = function () {
      var e = S.apply(null, arguments);
      return e.dataType = 'json', t.ajax(e);
    }, t.fn.load = function (e, n, i) {
      if (!this.length)
        return this;
      var a, r = this, s = e.split(/\s/), u = S(e, n, i), f = u.success;
      return s.length > 1 && (u.url = s[0], a = s[1]), u.success = function (e) {
        r.html(a ? t('<div>').html(e.replace(o, '')).find(a) : e), f && f.apply(r, arguments);
      }, t.ajax(u), this;
    };
    var T = encodeURIComponent;
    t.param = function (e, n) {
      var i = [];
      return i.add = function (e, n) {
        t.isFunction(n) && (n = n()), null == n && (n = ''), this.push(T(e) + '=' + T(n));
      }, C(i, e, n), i.join('&').replace(/%20/g, '+');
    };
  }(Zepto), function (t) {
    t.fn.serializeArray = function () {
      var e, n, i = [], r = function (t) {
          return t.forEach ? t.forEach(r) : void i.push({
            name: e,
            value: t
          });
        };
      return this[0] && t.each(this[0].elements, function (i, o) {
        n = o.type, e = o.name, e && 'fieldset' != o.nodeName.toLowerCase() && !o.disabled && 'submit' != n && 'reset' != n && 'button' != n && 'file' != n && ('radio' != n && 'checkbox' != n || o.checked) && r(t(o).val());
      }), i;
    }, t.fn.serialize = function () {
      var t = [];
      return this.serializeArray().forEach(function (e) {
        t.push(encodeURIComponent(e.name) + '=' + encodeURIComponent(e.value));
      }), t.join('&');
    }, t.fn.submit = function (e) {
      if (0 in arguments)
        this.bind('submit', e);
      else if (this.length) {
        var n = t.Event('submit');
        this.eq(0).trigger(n), n.isDefaultPrevented() || this.get(0).submit();
      }
      return this;
    };
  }(Zepto), function (t) {
    '__proto__' in {} || t.extend(t.zepto, {
      Z: function (e, n) {
        return e = e || [], t.extend(e, t.fn), e.selector = n || '', e.__Z = !0, e;
      },
      isZ: function (e) {
        return 'array' === t.type(e) && '__Z' in e;
      }
    });
    try {
      getComputedStyle(void 0);
    } catch (e) {
      var n = getComputedStyle;
      window.getComputedStyle = function (t) {
        try {
          return n(t);
        } catch (e) {
          return null;
        }
      };
    }
  }(Zepto);
  (function ($) {
    var touch = {}, touchTimeout, tapTimeout, swipeTimeout, longTapTimeout, longTapDelay = 750, gesture;
    function swipeDirection(x1, x2, y1, y2) {
      return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? 'Left' : 'Right' : y1 - y2 > 0 ? 'Up' : 'Down';
    }
    function longTap() {
      longTapTimeout = null;
      if (touch.last) {
        touch.el.trigger('longTap');
        touch = {};
      }
    }
    function cancelLongTap() {
      if (longTapTimeout)
        clearTimeout(longTapTimeout);
      longTapTimeout = null;
    }
    function cancelAll() {
      if (touchTimeout)
        clearTimeout(touchTimeout);
      if (tapTimeout)
        clearTimeout(tapTimeout);
      if (swipeTimeout)
        clearTimeout(swipeTimeout);
      if (longTapTimeout)
        clearTimeout(longTapTimeout);
      touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
      touch = {};
    }
    function isPrimaryTouch(event) {
      return (event.pointerType == 'touch' || event.pointerType == event.MSPOINTER_TYPE_TOUCH) && event.isPrimary;
    }
    function isPointerEventType(e, type) {
      return e.type == 'pointer' + type || e.type.toLowerCase() == 'mspointer' + type;
    }
    $(document).ready(function () {
      var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType;
      if ('MSGesture' in window) {
        gesture = new MSGesture();
        gesture.target = document.body;
      }
      $(document).bind('MSGestureEnd', function (e) {
        var swipeDirectionFromVelocity = e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
        if (swipeDirectionFromVelocity) {
          touch.el.trigger('swipe');
          touch.el.trigger('swipe' + swipeDirectionFromVelocity);
        }
      }).on('touchstart MSPointerDown pointerdown', function (e) {
        if ((_isPointerType = isPointerEventType(e, 'down')) && !isPrimaryTouch(e))
          return;
        firstTouch = _isPointerType ? e : e.touches[0];
        if (e.touches && e.touches.length === 1 && touch.x2) {
          // Clear out touch movement data if we have it sticking around
          // This can occur if touchcancel doesn't fire due to preventDefault, etc.
          touch.x2 = undefined;
          touch.y2 = undefined;
        }
        now = Date.now();
        delta = now - (touch.last || now);
        touch.el = $('tagName' in firstTouch.target ? firstTouch.target : firstTouch.target.parentNode);
        touchTimeout && clearTimeout(touchTimeout);
        touch.x1 = firstTouch.pageX;
        touch.y1 = firstTouch.pageY;
        if (delta > 0 && delta <= 250)
          touch.isDoubleTap = true;
        touch.last = now;
        longTapTimeout = setTimeout(longTap, longTapDelay);
        // adds the current touch contact for IE gesture recognition
        if (gesture && _isPointerType)
          gesture.addPointer(e.pointerId);
      }).on('touchmove MSPointerMove pointermove', function (e) {
        if ((_isPointerType = isPointerEventType(e, 'move')) && !isPrimaryTouch(e))
          return;
        firstTouch = _isPointerType ? e : e.touches[0];
        cancelLongTap();
        touch.x2 = firstTouch.pageX;
        touch.y2 = firstTouch.pageY;
        deltaX += Math.abs(touch.x1 - touch.x2);
        deltaY += Math.abs(touch.y1 - touch.y2);
      }).on('touchend MSPointerUp pointerup', function (e) {
        if ((_isPointerType = isPointerEventType(e, 'up')) && !isPrimaryTouch(e))
          return;
        cancelLongTap();
        // swipe
        if (touch.x2 && Math.abs(touch.x1 - touch.x2) > 30 || touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)
          swipeTimeout = setTimeout(function () {
            if (touch.el) {
              touch.el.trigger('swipe');
              // touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)) );
              /* modify by gonglong 20160801 start */
              var specialSwipe = 'swipe' + swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2);
              var swipEvent = $.Event(specialSwipe);
              swipEvent.clientX = touch.x2;
              swipEvent.clientY = touch.y2;
              swipEvent.cancelTouch = cancelAll;
              touch.el.trigger(swipEvent);  /* modify by gonglong 20160801 end */
            }
            touch = {};
          }, 0)  // normal tap
;
        else if ('last' in touch)
          // don't fire tap when delta position changed by more than 30 pixels,
          // for instance when moving to a point and back to origin
          if (deltaX < 30 && deltaY < 30) {
            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
            // ('tap' fires before 'scroll')
            tapTimeout = setTimeout(function () {
              // trigger universal 'tap' with the option to cancelTouch()
              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
              var event = $.Event('tap');
              /* modify by gonglong 20160801 start */
              // event.changedTouches = e.changedTouches;
              event.clientX = touch.x1;
              event.clientY = touch.y1;
              /* modify by gonglong 20160801 end */
              event.cancelTouch = cancelAll;
              // [by paper] fix -> "TypeError: 'undefined' is not an object (evaluating 'touch.el.trigger'), when double tap
              if (touch.el)
                touch.el.trigger(event);
              // trigger double tap immediately
              if (touch.isDoubleTap) {
                if (touch.el)
                  touch.el.trigger('doubleTap');
                touch = {};
              }  // trigger single tap after 250ms of inactivity
              else {
                touchTimeout = setTimeout(function () {
                  touchTimeout = null;
                  if (touch.el)
                    touch.el.trigger('singleTap');
                  touch = {};
                }, 250);
              }
            }, 0);
          } else {
            touch = {};
          }
        deltaX = deltaY = 0;
      })  // when the browser window loses focus,
          // for example when a modal dialog is shown,
          // cancel all ongoing events
.on('touchcancel MSPointerCancel pointercancel', cancelAll);
      // scrolling the window indicates intention of the user
      // to scroll, not tap or swipe, so cancel all ongoing events
      $(window).on('scroll', cancelAll);
    });
    [
      'swipe',
      'swipeLeft',
      'swipeRight',
      'swipeUp',
      'swipeDown',
      'doubleTap',
      'tap',
      'singleTap',
      'longTap'
    ].forEach(function (eventName) {
      $.fn[eventName] = function (callback) {
        return this.on(eventName, callback);
      };
    });
  }(Zepto));
  (function ($, undefined) {
    var prefix = '', eventPrefix, vendors = {
        Webkit: 'webkit',
        Moz: '',
        O: 'o'
      }, testEl = document.createElement('div'), supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i, transform, transitionProperty, transitionDuration, transitionTiming, transitionDelay, animationName, animationDuration, animationTiming, animationDelay, cssReset = {};
    function dasherize(str) {
      return str.replace(/([A-Z])/g, '-$1').toLowerCase();
    }
    function normalizeEvent(name) {
      return eventPrefix ? eventPrefix + name : name.toLowerCase();
    }
    if (testEl.style.transform === undefined)
      $.each(vendors, function (vendor, event) {
        if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
          prefix = '-' + vendor.toLowerCase() + '-';
          eventPrefix = event;
          return false;
        }
      });
    transform = prefix + 'transform';
    cssReset[transitionProperty = prefix + 'transition-property'] = cssReset[transitionDuration = prefix + 'transition-duration'] = cssReset[transitionDelay = prefix + 'transition-delay'] = cssReset[transitionTiming = prefix + 'transition-timing-function'] = cssReset[animationName = prefix + 'animation-name'] = cssReset[animationDuration = prefix + 'animation-duration'] = cssReset[animationDelay = prefix + 'animation-delay'] = cssReset[animationTiming = prefix + 'animation-timing-function'] = '';
    $.fx = {
      off: eventPrefix === undefined && testEl.style.transitionProperty === undefined,
      speeds: {
        _default: 400,
        fast: 200,
        slow: 600
      },
      cssPrefix: prefix,
      transitionEnd: normalizeEvent('TransitionEnd'),
      animationEnd: normalizeEvent('AnimationEnd')
    };
    $.fn.animate = function (properties, duration, ease, callback, delay) {
      if ($.isFunction(duration))
        callback = duration, ease = undefined, duration = undefined;
      if ($.isFunction(ease))
        callback = ease, ease = undefined;
      if ($.isPlainObject(duration))
        ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration;
      if (duration)
        duration = (typeof duration == 'number' ? duration : $.fx.speeds[duration] || $.fx.speeds._default) / 1000;
      if (delay)
        delay = parseFloat(delay) / 1000;
      return this.anim(properties, duration, ease, callback, delay);
    };
    $.fn.anim = function (properties, duration, ease, callback, delay) {
      var key, cssValues = {}, cssProperties, transforms = '', that = this, wrappedCallback, endEvent = $.fx.transitionEnd, fired = false;
      if (duration === undefined)
        duration = $.fx.speeds._default / 1000;
      if (delay === undefined)
        delay = 0;
      if ($.fx.off)
        duration = 0;
      if (typeof properties == 'string') {
        // keyframe animation
        cssValues[animationName] = properties;
        cssValues[animationDuration] = duration + 's';
        cssValues[animationDelay] = delay + 's';
        cssValues[animationTiming] = ease || 'linear';
        endEvent = $.fx.animationEnd;
      } else {
        cssProperties = [];
        // CSS transitions
        for (key in properties)
          if (supportedTransforms.test(key))
            transforms += key + '(' + properties[key] + ') ';
          else
            cssValues[key] = properties[key], cssProperties.push(dasherize(key));
        if (transforms)
          cssValues[transform] = transforms, cssProperties.push(transform);
        if (duration > 0 && typeof properties === 'object') {
          cssValues[transitionProperty] = cssProperties.join(', ');
          cssValues[transitionDuration] = duration + 's';
          cssValues[transitionDelay] = delay + 's';
          cssValues[transitionTiming] = ease || 'linear';
        }
      }
      wrappedCallback = function (event) {
        if (typeof event !== 'undefined') {
          if (event.target !== event.currentTarget)
            return;
          // makes sure the event didn't bubble from "below"
          $(event.target).unbind(endEvent, wrappedCallback);
        } else
          $(this).unbind(endEvent, wrappedCallback);
        // triggered by setTimeout
        fired = true;
        $(this).css(cssReset);
        callback && callback.call(this);
      };
      if (duration > 0) {
        this.bind(endEvent, wrappedCallback);
        // transitionEnd is not always firing on older Android phones
        // so make sure it gets fired
        setTimeout(function () {
          if (fired)
            return;
          wrappedCallback.call(that);
        }, (duration + delay) * 1000 + 25);
      }
      // trigger page reflow so new elements can animate
      this.size() && this.get(0).clientLeft;
      this.css(cssValues);
      if (duration <= 0)
        setTimeout(function () {
          that.each(function () {
            wrappedCallback.call(this);
          });
        }, 0);
      return this;
    };
    testEl = null;
  }(Zepto)  //     Zepto.js
            //     (c) 2010-2016 Thomas Fuchs
            //     Zepto.js may be freely distributed under the MIT license.
);
  (function ($, undefined) {
    var document = window.document, docElem = document.documentElement, origShow = $.fn.show, origHide = $.fn.hide, origToggle = $.fn.toggle;
    function anim(el, speed, opacity, scale, callback) {
      if (typeof speed == 'function' && !callback)
        callback = speed, speed = undefined;
      var props = { opacity: opacity };
      if (scale) {
        props.scale = scale;
        el.css($.fx.cssPrefix + 'transform-origin', '0 0');
      }
      return el.animate(props, speed, null, callback);
    }
    function hide(el, speed, scale, callback) {
      return anim(el, speed, 0, scale, function () {
        origHide.call($(this));
        callback && callback.call(this);
      });
    }
    $.fn.show = function (speed, callback) {
      origShow.call(this);
      if (speed === undefined)
        speed = 0;
      else
        this.css('opacity', 0);
      return anim(this, speed, 1, '1,1', callback);
    };
    $.fn.hide = function (speed, callback) {
      if (speed === undefined)
        return origHide.call(this);
      else
        return hide(this, speed, '0,0', callback);
    };
    $.fn.toggle = function (speed, callback) {
      if (speed === undefined || typeof speed == 'boolean')
        return origToggle.call(this, speed);
      else
        return this.each(function () {
          var el = $(this);
          el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback);
        });
    };
    $.fn.fadeTo = function (speed, opacity, callback) {
      return anim(this, speed, opacity, null, callback);
    };
    $.fn.fadeIn = function (speed, callback) {
      var target = this.css('opacity');
      if (target > 0)
        this.css('opacity', 0);
      else
        target = 1;
      return origShow.call(this).fadeTo(speed, target, callback);
    };
    $.fn.fadeOut = function (speed, callback) {
      return hide(this, speed, null, callback);
    };
    $.fn.fadeToggle = function (speed, callback) {
      return this.each(function () {
        var el = $(this);
        el[el.css('opacity') == 0 || el.css('display') == 'none' ? 'fadeIn' : 'fadeOut'](speed, callback);
      });
    };
  }(Zepto));
  return Zepto;
}();
js_src_global = function () {
  return window;
}();
js_src_tool = function (window) {
  var _ = window._;
  var TOOL = {
    /**
     * 日志信息.<br/>
     * 
     */
    LOG: {
      log: function (msg) {
        console.log(msg);
      },
      info: function (msg, cssType) {
        if (typeof cssType == 'undefined') {
          cssType = 'background: yellowgreen;';
        }
        console.info('%c ' + msg, cssType);
      },
      warn: function (msg) {
        console.warn(msg);
      },
      error: function (msg) {
        console.error(msg);
      }
    },
    /**
     * 清空str两端空字符. <br/>
     * 
     * @param {Object} str 
     */
    trim: function (str) {
      return str.replace(/(^\s*)|(\s*$)/g, '');
    },
    /**
     * 下载图片-手机. <br/>
     * 
     * @param {String} URL      //源地址
     * @param {String} fileName //保存地址
     * @param {Function} cb     //回调函数
     */
    _downloadImageFile: function (URL, fileName, cb) {
      //          console.log("[tool.js] -> _saveImageFile! ");
      gli_ftp_download({
        'url': URL,
        'local_path': fileName
      });
    },
    /**
     * 下载图片-PC. <br/>
     * 
     * @param {Array} arryImgFile
     */
    downloadImageFilePc: function (arryImgFile) {
      gli_ftp_download(arryImgFile, 'gli_ftp_download_cb');
    },
    /**
     * 保存文件--普通方式.<br/>
     * 
     * @param path    {String} 本地文件存储路径, 包含文件名. 如 "/download/10001/120/0_catalog.txt"
     * @param content {String} 文件内容.
     * @param cb      {Function} 回调函数.
     * 
     * @author gli-gonglong-20160727
     * 
     */
    _saveFileCommon: function (path, content, cb) {
      console.log('[tool.js] -> _saveFileCommon! ');
      var _content = TOOL.doEncodeData(content);
      gli_file_put(path, _content);
    },
    /**
     * 保存文件 -- 加密方式.<br/>
     * 
     * @param path    {String} 本地文件存储路径, 包含文件名. 如 "/download/10001/120/0_catalog.txt"
     * @param content {String} 文件内容.
     * @param cb      {String} 回调函数名--全局.
     * 
     * @author gli-gonglong-20160727
     * 
     */
    _saveFileEncrypt: function (path, content, cb) {
      console.log('[tool.js] -> _saveFileEncrypt! ' + path);
      gli_lockit_encode({
        'output_file': path,
        'input_file': content
      }, cb);
    },
    /**
     * 读取文件--普通方式.<br/>
     * 
     * @param path    {String} 本地文件存储路径, 包含文件名. 如 "/download/10001/120/0_catalog.txt"
     * @param cb      {Function} 回调函数, 成功: 返回文件内容, 失败: 返回 null;
     * 
     * @author gli-gonglong-20160727
     * 
     */
    _readFileCommon: function (path, cb) {
      console.log('[tool.js] -> _readFileCommon! ');
      gli_file_get(path, '', cb);
    },
    /**
     * 读取文件--解密方式.<br/>
     * 
     * @param {Object} opts {
     *      license_id   {String}    加密 - 文件许可证号,   ps:'doc_110220330'
     *      server       {String}    加密 - lockit服务器域名    ps:'server_101010101010'
     *      }
     * @param path    {String} 本地文件存储路径, 包含文件名. 如 "/download/10001/120/0_catalog.txt"
     * @param cb      {Function} 回调函数, 成功: 返回文件内容, 失败: 返回 null;;
     * 
     * @author gli-gonglong-20160727
     * 
     */
    _readFileDecrypt: function (opts, path, cb) {
      console.log('[tool.js] -> 读取文件--解密方式:' + path);
      gli_lockit_decode({
        'input_file': path,
        // 必选.
        'output_file': '',
        // 必不选!!
        'license_id': opts.license_id,
        'server': opts.server,
        'force': true
      }, cb);
    },
    /**
     * 生成下载/读取 用书籍路径.<br/>
     * 
     * @param userId   {String} 用户id. 如: "20160700001"
     * @param bookId   {String} 书籍id. 如: "b100"
     * @param fileName {String} 文件名. 如: "catalog"
     * @param basePath {String} 基础路径. 如: "c:/path"
     * 
     * @return localPath {String} 本地路径 如: "c:/path/20160700001/b100/catalog.txt"
     * 
     * @author gli-gonglong-20160727. <br/>
     * 
     */
    createBookPath: function (userId, bookId, fileName, basePath) {
      var localPath = '';
      var fileType = '.txt';
      var slash = '/';
      var tmp = [];
      tmp.push(basePath);
      tmp.push(userId);
      tmp.push(bookId);
      tmp.push(fileName.replace(/\s/g, ''));
      localPath = tmp.join(slash) + fileType;
      return localPath;
    },
    /**
     * 获取"进度"百分比. 比如: 下载进度<br/> 
     * 
     * @param {Number} total    总数  如: 10
     * @param {Number} current  已完成 如: 5
     * @param {Number} range 起始值 如: 30(ps: 30%)   
     * 
     * @return {Number} percentVal 65 (ps: 65%)
     * 
     */
    getProgressRate: function (total, current, range) {
      var percentVal = 0;
      var start = parseInt(range) || 0;
      var defaultRage = 100 - start;
      var rate = 0;
      try {
        rate = current / total;
        percentVal = parseInt(rate * defaultRage) + start;
      } catch (e) {
        console.error('Utils.js -> getProgressRate. ' + e);
      }
      return percentVal;
    },
    /**
     * 空函数格式化函数
     */
    emptyFunc: function () {
    },
    /**
     * 格式化时间函数 
     * 
     * yyyy-MM-dd HH:MM
     * 
     * tiem {Object} new Date()对象 传值过来是为了统一时间。
     * 
     */
    getNowFormatDate: function (time) {
      var date = time || new Date();
      var seperator1 = '-';
      var seperator2 = ':';
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      var hours = date.getHours();
      var mins = date.getMinutes();
      month = '00' + month;
      month = month.substr(month.length - 2);
      strDate = '00' + strDate;
      strDate = strDate.substr(strDate.length - 2);
      hours = '00' + hours;
      hours = hours.substr(hours.length - 2);
      mins = '00' + mins;
      mins = mins.substr(mins.length - 2);
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + hours + seperator2 + mins;
      return currentdate;
    },
    /**
     * 格式化时间函数 
     * 
     *  HH:MM:SS
     * 
     * time {Number} 秒
     * 
     * return {String} hmsTime "00:10:10"
     * 
     */
    formatTime: function (time) {
      var hours, minutes, seconds, hmsTime;
      var totalMin = Math.floor(time / 60);
      secends = Math.floor(time % 60);
      if (totalMin >= 60) {
        hours = Math.floor(totalMin / 60);
        minutes = Math.floor(totalMin % 60);
      } else {
        minutes = totalMin;
        hours = '00';
      }
      hours = '00' + hours;
      hours = hours.substr(hours.length - 2);
      minutes = '00' + minutes;
      minutes = minutes.substr(minutes.length - 2);
      secends = '00' + secends;
      secends = secends.substr(secends.length - 2);
      hmsTime = hours + ':' + minutes + ':' + secends;
      return hmsTime;
    },
    /**
     * 加密数据.<br/>
     * 
     */
    doEncodeData: function (data) {
      // return encodeURI(data);
      return data;
    },
    /**
     * 解密数据.<br/>
     * 
     */
    doDecodeData: function (data) {
      // return decodeURI(data);
      return data;
    },
    /**
     * 将数组B中所有元素push到数组A中. <br/>
     * 
     * @param {Object} arrayA
     * @param {Object} arrayB
     */
    pushArray: function (arrayA, arrayB) {
      var arrayT = arrayA.concat();
      for (var i = 0, len = arrayB.length; i < len; i++) {
        arrayT.push(arrayB[i]);
      }
      return arrayT;
    },
    createFunName: function (cb, name) {
      var tmpName = name || cb.name;
      tmpName = 'gli_' + tmpName;
      if (typeof window[tmpName] == 'undefined') {
        console.log('%c Not Exits!', 'background:pink;');
        window[tmpName] = cb;
      } else {
        console.log('%c  Exits! ' + tmpName, 'background:yellow;');
      }
      return tmpName;
    },
    /**
     * 判断是否有funName的函数. <br/>
     * 
     * @param {Object} obj
     * @param {String} funName
     * @return {Boolean} flag
     * 
     * @author gli-jiangxq-20161019
     */
    hasFunction: function (obj, funName) {
      var flag = false;
      if (!!obj && typeof obj[funName] == 'function') {
        flag = true;
      }
      return flag;
    },
    /**
     * 获取 20位随机主键.<br/>
     * ps: 包含 数字, 英文字符.
     * 
     * @return rankey {String} 如: "abcd-1234-ab34-56ui"
     * 
     */
    getRandomKey: function () {
      // 10
      var digit = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ];
      // 26
      var alphabet = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z'
      ];
      var keySet = [];
      keySet = keySet.concat(digit, alphabet);
      var sectionSet = [];
      for (var i = 0, len = 4; i < len; i++) {
        sectionSet.push(getSectionKey(keySet));
      }
      rankey = sectionSet.join('-');
      console.log('rankey:' + rankey);
      return rankey;
    },
    /**
     * 转换数据格式--笔记|书签.<br/>
     * 
     * @param {Array} list  
     * @param {String} type 
     * 
     * 
     * @return {Array} groupData  以章节分组 格式化.
     * 
     */
    convertData: function (list, type) {
      var groupData = [];
      if (!list || list.length == 0) {
        return groupData;
      }
      // 按照时间排序
      var sortList = _.sortBy(list, function (item) {
        return -new Date(item.note_time).getTime();
      });
      // 过滤掉本地已删除的数据
      var filterData = _.filter(sortList, function (item) {
        if (item.oparate_type != '3') {
          return true;
        }
      });
      var chapterGroupData = _.groupBy(filterData, 'chapter_id');
      var tmpKey = null;
      var groupItem = null;
      var chapterItem = null;
      for (tmpKey in chapterGroupData) {
        groupItem = chapterGroupData[tmpKey];
        chapterItem = {};
        chapterItem.chapter_id = groupItem[0].chapter_id;
        chapterItem.chapter_name = groupItem[0].chapter_name;
        chapterItem.note_count = groupItem.length;
        chapterItem[type] = groupItem;
        groupData.push(chapterItem);
      }
      return groupData;
    },
    /**
     * 过滤 本地数据 笔记|书签.<br/>
     * 
     * @param  {array} targetData  待过滤数据.
     * @return  {array} uploadData 本地有变动(增,改,删)的数据.
     * 
     */
    filterLocalData: function (targetData) {
      var uploadData = [];
      var item = null;
      if (typeof targetData == 'undefined' || !targetData) {
        return uploadData;
      }
      for (var i = 0, len = targetData.length; i < len; i++) {
        item = targetData[i];
        if (!item.s_id) {
          //  新增;
          uploadData.push(item);
        } else if (!!item.s_id && item.oparate_type == '2') {
          // 改
          uploadData.push(item);
        } else if (!!item.s_id && item.oparate_type == '3') {
          // 删
          item.original = '';
          uploadData.push(item);
        }
      }
      return uploadData;
    }
  };
  if (typeof gli_file_get != 'function') {
    gli_file_get = TOOL.emptyFunc;
  }
  return TOOL;
  /**
  * 获取单个片断
  * 
  * @param characterSet {Array} 随机字符集
  * @return sectionVal {String} 如: "23fd"
  */
  function getSectionKey(characterSet) {
    var defaultSet = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z'
    ];
    var optSet = characterSet || defaultSet;
    var section = [];
    var rankey = [];
    var maxVal = optSet.length;
    var pos = null;
    var tmpKey = '';
    for (var i = 0, len = 4; i < len; i++) {
      pos = getRandom(maxVal);
      tmpKey = optSet[pos];
      rankey.push(tmpKey);
    }
    sectionVal = rankey.join('');
    return sectionVal;
  }
  /**
  * 返回 大于 零，小于用户指定数字 范围内的值.
  * 
  * @param max {Number} 最大值. 如: 10
  * 
  * @return val {Number} 随机数. 如: 5
  * 
  */
  function getRandom(max) {
    // 生成n-m，包含n但不包含m的整数
    var min = 0;
    var rangeVal = max - min;
    var val = parseInt(Math.random() * rangeVal + 0, 10);
    return val;
  }
}(js_src_global);
js_src_api = function (window, $) {
  var API = function (options) {
    var defaults = {
      // 基础参数;
      baseData: {
        hostUrl: '../../PHP/index.php',
        //由PHP模拟数据
        book_id: '',
        user_id: '',
        use_file_url: false
      },
      // 根据业务逻辑, "过境"数据 {Object};
      passData: null
    };
    this.opts = $.extend(true, {}, defaults, options);
  };
  /**
   * 从服务器获取书籍目录信息.<br/>
   * 
   * @param data      {Object}   业务参数.
   * @param successCb {Function} 回调函数-成功
   * @param errorCb   {Function} 回调函数-失败
   *
   */
  API.prototype.getBookCatalog = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'get_catalog',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id,
      'use_file_url': optsObj.baseData.use_file_url
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      dataType: 'json',
      success: function (result, status, xhr) {
        if (result.status && typeof successCb == 'function') {
          successCb(result.data);
        }
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(xhr.responseText);
        }
      }
    });
  };
  /**
   * 从服务器获取书籍书签信息.<br/>
   * 
   * @param data      {Object}   业务参数.
   * @param successCb {Function} 回调函数-成功
   * @param errorCb   {Function} 回调函数-失败
   *
   */
  API.prototype.getBookmark = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'get_bookmark',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      dataType: 'json',
      success: function (result, status, xhr) {
        if (result.status && typeof successCb == 'function') {
          var tempBookmark = result.data.bookmark_list;
          for (var i = 0, len = tempBookmark.length; i < len; i++) {
            // 从服务器下载的数据, 属性[oparate_type]设置为 "0"
            tempBookmark[i].oparate_type = '0';
          }
          successCb(result.data);
        }
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(xhr.responseText);
        }
      }
    });
  };
  /**
   * 设置（上传）书签.<br/>
   * 
   * @param data      {Object}   业务参数.
   * @param successCb {Function} 回调函数-成功
   * @param errorCb   {Function} 回调函数-失败
   *
   */
  API.prototype.setBookmark = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'set_bookmark',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      dataType: 'json',
      success: function (result, status, xhr) {
        if (result.status && typeof successCb == 'function') {
          successCb(result);
        }
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(xhr.responseText);
        }
      }
    });
  };
  /**
   * 删除书签.<br/>
   * 
   * @param data      {Object}   业务参数.
   * @param successCb {Function} 回调函数-成功
   * @param errorCb   {Function} 回调函数-失败
   *
   */
  API.prototype.delBookmark = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'del_bookmark',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      dataType: 'json',
      success: function (result, status, xhr) {
        if (result.status && typeof successCb == 'function') {
          successCb(result);
        }
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(xhr.responseText);
        }
      }
    });
  };
  /**
   * 从服务器获取书籍笔记信息.<br/>
   * 
   * @param data      {Object}   业务参数.
   * @param successCb {Function} 回调函数-成功
   * @param errorCb   {Function} 回调函数-失败
   *
   */
  API.prototype.getBookNote = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'get_note',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      dataType: 'json',
      success: function (result, status, xhr) {
        if (result.status && typeof successCb == 'function') {
          var note_list = result.data.note_list;
          for (var i = 0, len = note_list.length; i < len; i++) {
            // 1：增; 2：改; 3：删
            note_list[i].oparate_type = '0';
          }
          successCb(result.data);
        } else {
          if (typeof errorCb == 'function') {
            errorCb(result.data);
          }
        }
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(xhr.responseText);
        }
      }
    });
  };
  /**
   * 删除笔记.<br/>
   * 
   * @param data      {Object}   业务参数.
   * @param successCb {Function} 回调函数-成功
   * @param errorCb   {Function} 回调函数-失败
   *
   */
  API.prototype.delNote = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'del_note',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      dataType: 'json',
      success: function (result, status, xhr) {
        if (result.status && typeof successCb == 'function') {
          successCb(result);
        }
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(xhr.responseText);
        }
      }
    });
  };
  /**
   * 从服务器获取 书籍章节.<br/>
   * 
   * @param data      {Object}   业务参数. 'chapter_id'
   * @param successCb {Function} 回调函数-成功
   * @param errorCb   {Function} 回调函数-失败
   *
   */
  API.prototype.getChapter = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'get_chapter',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      dataType: 'json',
      success: function (result, status, xhr) {
        if (result.status && typeof successCb == 'function') {
          successCb(result.data);
        }
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(xhr.responseText);
        }
      }
    });
  };
  /**
   * 发送版权投诉
   * 
   * @param {Object} data
   * @param {Object} successCb
   * @param {Object} errorCb
   */
  API.prototype.sendComplaint = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'send_complaint',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      dataType: 'json',
      success: function (result, status, xhr) {
        successCb(result);
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(xhr.responseText);
        }
      }
    });
  };
  /**
   * 获取搜索历史记录
   * 
   * @param {Object} data
   * @param {Object} successCb
   * @param {Object} errorCb
   */
  API.prototype.getSearchHistory = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'search_history',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      dataType: 'json',
      success: function (result, status, xhr) {
        if (result.status && typeof successCb == 'function') {
          successCb(result.data);
        }
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(xhr.responseText);
        }
      }
    });
  };
  /**
   * 清除搜索历史记录
   * 
   * @param {Object} data
   * @param {Object} successCb
   * @param {Object} errorCb
   */
  API.prototype.delSearchHis = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'del_history',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      dataType: 'json',
      success: function (result, status, xhr) {
        if (result.status && typeof successCb == 'function') {
          successCb(result.data);
        }
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(xhr.responseText);
        }
      }
    });
  };
  /**
   * 发送搜索关键字
   * 
   * @param {Object} data
   * @param {Object} successCb
   * @param {Object} errorCb
   */
  API.prototype.search = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'search',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      dataType: 'json',
      success: function (result, status, xhr) {
        successCb(result);
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(xhr.responseText);
        }
      }
    });
  };
  /**
   * 获取版权保护参数（独立水印/打印/截屏/下载/复制的权限，及复制字数次数）<br/>
   * 
   * @param {Object} data {
   *              img_type        {String}  // 水印图片格式, ps:'base64'
   *          }
   *          
   * @param {Object} successCb
   * @param {Object} errorCb
   * @return {Object}
   *          {
   *              status:         {Boolean}, // 状态, true: 成功, false: 失败,
   *              copy_long:      {Number},  // 复制字数;
   *              copy_times:     {Number},  // 复制次数;
   *              print_flg:      {Boolean}, // 打印控制 true: 允许打印， false: 不可打印(默认)
   *              download_flg:   {Boolean}, // 下载控制 true: 可以下载(默认), false: 不可下载;
   *              screenshot_flg: {Boolean}  // 防止截图 true: 可以截图, false: 不可截图(默认).
   *          }
   * 
   * @author gli-jiangxq-20160822
   */
  API.prototype.get_copyright = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'copyright_get',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      timeout: 3000,
      dataType: 'json',
      success: function (result, status, xhr) {
        if (result.status && typeof successCb == 'function') {
          successCb(result.data);
        } else {
          errorCb(result.error);
        }
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(error);
        }
      }
    });
  };
  /**
   * 版权保护，每次操作时向后台提交数据. <br/>
   * 
   * @param {Object} data  {
   *          operate_type    {String}  // 'copy','print','download_start','download_end','screenshot'
   *          operate_val     {Number}  // a. 复制字数; b. 1:true, c. 0:false;
   *      }
   * @param {Object} successCb
   * @param {Object} errorCb
   * 
   * @author gli-jiangxq-20160822
   */
  API.prototype.set_copyright = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'copyright_set',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      timeout: 3000,
      dataType: 'json',
      success: function (result, status, xhr) {
        if (result.status && typeof successCb == 'function') {
          successCb();
        } else {
          errorCb(result.error);
        }
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(error);
        }
      }
    });
  };
  /**
   * 设置（上传）单条笔记.<br/>
   * 
   * @param data      {Object}   业务参数.
   * @param successCb {Function} 回调函数-成功
   * @param errorCb   {Function} 回调函数-失败
   *
   */
  API.prototype.sendNote = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'send_note',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      dataType: 'json',
      success: function (result, status, xhr) {
        successCb(result);
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(xhr.responseText);
        }
      }
    });
  };
  /**
   * 发送纠错信息. <br/>
   * 
   * @param data      {Object}   业务参数.
   * @param successCb {Function} 回调函数-成功
   * @param errorCb   {Function} 回调函数-失败
   *
   */
  API.prototype.sendCorrect = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'send_correct',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id,
      'chapter_id': data.chapter_id,
      'chapter_name': data.chapter_name,
      'percent': data.percent,
      'original': data.original,
      'correctVal': data.correctVal
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      dataType: 'json',
      success: function (result, status, xhr) {
        if (result.status && typeof successCb == 'function') {
          successCb();
        } else {
          errorCb(result.error);
        }
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(xhr.responseText);
        }
      }
    });
  };
  /**
   * 批量更新笔记. <br/>
   * 
   * @param data      {Object}   业务参数.
   * @param successCb {Function} 回调函数-成功
   * @param errorCb   {Function} 回调函数-失败
   *
   */
  API.prototype.batchUpdateNote = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'batch_update_note',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      timeout: 3000,
      dataType: 'json',
      success: function (result, status, xhr) {
        if (result.status && typeof successCb == 'function') {
          successCb(result);
        } else {
          errorCb(result.msg);
        }
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(error);
        }
      }
    });
  };
  /**
   * 批量更新书签. <br/>
   * 
   * @param data      {Object}   业务参数.
   * @param successCb {Function} 回调函数-成功
   * @param errorCb   {Function} 回调函数-失败
   *
   */
  API.prototype.batchUpdateBookmark = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'batch_update_bookmark',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      timeout: 3000,
      dataType: 'json',
      success: function (result, status, xhr) {
        if (result.status && typeof successCb == 'function') {
          successCb();
        } else {
          errorCb(result.error);
        }
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(error);
        }
      }
    });
  };
  /**
   * 保存书籍阅读状态记录信息. <br/>
   * 
   * @param data      {Array}   业务参数.
   *              ['bookOpenTime': 书籍打开时间,
                   'bookCloseTime': 书籍关闭时间]
   * @param successCb {Function} 回调函数-成功
   * @param errorCb   {Function} 回调函数-失败
   *
   */
  API.prototype.setBookState = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'set_book_state',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      timeout: 3000,
      dataType: 'json',
      success: function (result, status, xhr) {
        if (result.status && typeof successCb == 'function') {
          successCb();
        } else {
          errorCb(result.error);
        }
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(error);
        }
      }
    });
  };
  /**
   * 在线获取阅读进度. <br/>
   * 
   * @param {Object} data   null
   * @param {Function} successCb
   * @param {Function} errorCb
   */
  API.prototype.getProgressData = function (data, successCb, errorCb) {
    var optsObj = this.opts;
    var defaultData = {
      'action': 'get_progress',
      'book_id': optsObj.baseData.book_id,
      'user_id': optsObj.baseData.user_id
    };
    var requestData = $.extend(true, {}, defaultData, optsObj.passData, data);
    $.ajax({
      type: 'get',
      url: optsObj.baseData.hostUrl,
      async: true,
      data: requestData,
      timeout: 3000,
      dataType: 'json',
      success: function (result, status, xhr) {
        if (result.status && typeof successCb == 'function') {
          successCb();
        } else {
          errorCb(result.error);
        }
      },
      error: function (xhr, status, error) {
        if (typeof errorCb == 'function') {
          errorCb(error);
        }
      }
    });
  };
  return API;
}(js_src_global, js_libs_zeptodev);
js_src_panelTempl = function (window, $) {
  //  var $ = window.Zepto;
  var _ = window._;
  //  var templSets = {
  //      "countpage": $("#countpage-templ").html(),
  //
  //      "main": $("#main-templ").html(),
  //      "newpage": $("#newpage-templ").html(),
  //      "setting": $("#setting-template").html(),
  //      "fontlight": $("#fontlight-templ").html(),
  //      "progress": $("#progress-templ").html(),
  //      "complain": $("#complain-templ").html(),
  //      "search": $("#search-templ").html(),
  //      "correct": $("#correct-templ").html(),
  //
  //      "cbn": $("#cbn-template").html(),
  //      "cbnNavMenu": $("#custom-nav-menus").html(),
  //      "cbnNavBody": $("#custom-nav-body").html(),
  //      "catalog": $("#catalog-templ").html(),
  //      "note": $("#note-templ").html(),
  //      "bookmark": $("#bookmark-templ").html(),
  //
  //      "firstOpen": $('#first-open-templ').html(),
  //      "viewImg": $("#view-img-templ").html(),
  //      
  //      "noteEdit": $("#note-edit").html(),
  //      "noteDetail": $("#note-detail").html(),
  //      "noteShare": $("#note-share").html(),
  //
  //      "video": $("#read-video-templ").html(),
  //  };
  var templSets = {
    'countpage': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-comm-panel%20read-panel%20read-selector-countpage%22%20style=%22z-index:%20-1;%22%3E%0A%20%20%20%20%20%20%20%20%3C!--%E7%AB%A0%E8%8A%82%E5%90%8D--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E6%98%BE%E7%A4%BA%E7%AB%A0%E8%8A%82--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-view%22%3Eheader%3C/div%3E%0A%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%86%85%E5%AE%B9%E6%98%BE%E7%A4%BA%E5%8C%BA--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-countpage-content%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-countpage%20read-cf%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C!--%E9%A1%B5%E7%A0%81--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-page%20read-icon-hv-center%22%3Efooter%3C/span%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'main': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-comm-panel%20read-panel%20read-selector-main%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-page-storage%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%20%E5%B9%B3%E9%93%BA%E5%8A%A8%E7%94%BB%E9%A1%B5%E9%9D%A2%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-content-animate%20read-page-prev%20read-cf%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E6%98%BE%E7%A4%BA%E7%AB%A0%E8%8A%82--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-name%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-view%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapterName%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E6%98%BE%E7%A4%BA%E4%B9%A6%E7%AD%BE--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-view%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%86%85%E5%AE%B9%E6%98%BE%E7%A4%BA%E5%8C%BA--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-animate-content%20read-cf%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E9%A1%B5%E7%A0%81--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-page%20read-icon-hv-center%22%3E%3C%25=%20pagePerc%20%25%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-view-page%22%20style=%22%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E7%AB%A0%E8%8A%82%E5%90%8D--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E6%98%BE%E7%A4%BA%E7%AB%A0%E8%8A%82--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-name%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-view%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapterName%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E6%98%BE%E7%A4%BA%E4%B9%A6%E7%AD%BE--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-view%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%86%85%E5%AE%B9%E6%98%BE%E7%A4%BA%E5%8C%BA--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-content%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapterContent%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-delicate%20read-cf%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E9%A1%B5%E7%A0%81--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-progressbar%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-page%20read-icon-hv-center%22%3E%3C%25=%20pagePerc%20%25%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%20%E5%B9%B3%E9%93%BA%E5%8A%A8%E7%94%BB%E9%A1%B5%E9%9D%A2%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-content-animate%20read-page-next%20read-cf%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E6%98%BE%E7%A4%BA%E7%AB%A0%E8%8A%82--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-name%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-view%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapterName%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E6%98%BE%E7%A4%BA%E4%B9%A6%E7%AD%BE--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-view%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%86%85%E5%AE%B9%E6%98%BE%E7%A4%BA%E5%8C%BA--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-animate-content%20read-cf%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E9%A1%B5%E7%A0%81--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-page%20read-icon-hv-center%22%3E%3C%25=%20pagePerc%20%25%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C!--%20%E4%BB%BF%E7%9C%9F%E5%8A%A8%E7%94%BB%E9%A1%B5%E9%9D%A2%20--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-real-animate%20read-cf%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E6%98%BE%E7%A4%BA%E7%AB%A0%E8%8A%82--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-name%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-view%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapterName%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E6%98%BE%E7%A4%BA%E4%B9%A6%E7%AD%BE--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-view%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%86%85%E5%AE%B9%E6%98%BE%E7%A4%BA%E5%8C%BA--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-animate-content%20read-cf%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E9%A1%B5%E7%A0%81--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-page%20read-icon-hv-center%22%3E%3C%25=%20pagePerc%20%25%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'newpage': decodeURI('%0A%20%20%20%20%3C!--%E7%AB%A0%E8%8A%82%E5%90%8D--%3E%0A%20%20%20%20%3Cdiv%20class=%22read-header%22%3E%0A%20%20%20%20%20%20%20%20%3C!--%E6%98%BE%E7%A4%BA%E7%AB%A0%E8%8A%82--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-view%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapterName%20%25%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C!--%E6%98%BE%E7%A4%BA%E4%B9%A6%E7%AD%BE--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-view%22%20style=%22opacity:%201;%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%3C!--%E5%86%85%E5%AE%B9%E6%98%BE%E7%A4%BA%E5%8C%BA--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapterContent%20%25%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C!--%E9%A1%B5%E7%A0%81--%3E%0A%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-page%20read-icon-hv-center%22%3E20%25%3C/span%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'setting': decodeURI('%0A%0A%20%20%20%20%3Cdiv%20class=%22read-comm-panel%20read-setting-panel%22%3E%0A%0A%20%20%20%20%20%20%20%20%3C!--%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%B7%A6%E4%BE%A7%E9%80%80%E5%87%BA%E6%8C%89%E9%92%AE--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-exit-reader%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-v-center%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%20read-icon-v-center%20read-sel-out-reader%22%3E%E8%BF%94%E5%9B%9E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%8F%B3%E4%BE%A7%E7%89%88%E6%9D%83%E6%8A%95%E8%AF%89%E5%92%8C%E6%90%9C%E7%B4%A2--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-copyright%20read-lf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-v-center%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-search%20read-rt%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%0A%20%20%20%20%20%20%20%20%3C!--%E4%B8%AD%E9%97%B4%E9%80%8F%E6%98%8E%E5%8C%BA%E5%9F%9F--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%3C/div%3E%0A%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-set-btn%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-cbn-btn%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-hv-center%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-progress-btn%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-hv-center%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-font-btn%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-hv-center%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-speed-night%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A%0A'),
    'fontlight': decodeURI('%0A%0A%20%20%20%20%3C!--%E5%AD%97%E4%BD%93%E8%AE%BE%E7%BD%AE%E9%9D%A2%E6%9D%BF--%3E%0A%20%20%20%20%3Cdiv%20class=%22read-font-set-panel%20%22%3E%0A%20%20%20%20%20%20%20%20%3C!--%E7%AC%AC%E4%B8%80%E9%A1%B5--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-set-page1%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%B1%8F%E5%B9%95%E4%BA%AE%E5%BA%A6--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-setting-bar%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-font%22%3E%E5%B1%8F%E5%B9%95%E4%BA%AE%E5%BA%A6%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-plugs-group%20read-screen-intensity%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%20style=%22width:70%25;%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-light-bar%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-icon-div%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-lf%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-rt%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%22%20style=%22width:25%25;%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-system-light%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%3E%E7%B3%BB%E7%BB%9F%E4%BA%AE%E5%BA%A6%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%AD%97%E4%BD%93%E5%A4%A7%E5%B0%8F--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-setting-bar%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-font%22%3E%E5%AD%97%E4%BD%93%E5%A4%A7%E5%B0%8F%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-plugs-group%20read-font-size%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E7%BF%BB%E9%A1%B5%E6%96%B9%E5%BC%8F--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-setting-bar%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-font%22%3E%E7%BF%BB%E9%A1%B5%E6%96%B9%E5%BC%8F%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-plugs-group%20read-turn-page%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%B0%8F%E6%8C%89%E9%92%AE%20%E5%88%87%E6%8D%A2%E4%B8%A4%E9%A1%B5%E8%AE%BE%E7%BD%AE%E7%95%8C%E9%9D%A2--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-turn-page-icon%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-lf%20read-icon%20read-active%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-rt%20read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C!--%E7%AC%AC%E4%BA%8C%E9%A1%B5--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-set-page2%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%AD%97%E4%BD%93%E7%B1%BB%E5%9E%8B--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-setting-bar%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-font%22%3E%E5%AD%97%E4%BD%93%E7%B1%BB%E5%9E%8B%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-plugs-group%20read-font-family%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-font-family-view%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20read-more-font-btn%20read-disabled%22%3E%E6%9B%B4%E5%A4%9A%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E8%83%8C%E6%99%AF%E9%A2%9C%E8%89%B2--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-setting-bar%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-font%22%3E%E8%83%8C%E6%99%AF%E9%A2%9C%E8%89%B2%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-plugs-group%20read-bg-color%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%B1%8F%E5%B9%95%E5%B8%B8%E4%BA%AE--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-setting-bar%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-font%22%3E%E5%B1%8F%E5%B9%95%E9%95%BF%E4%BA%AE%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-plugs-group%20read-screen-always-bright%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-lf%20read-font%22%3E%E5%BC%80%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-turn-off-on%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-rt%20read-font%20read-active%22%3E%E5%85%B3%3C/span%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%B0%8F%E6%8C%89%E9%92%AE%20%E5%88%87%E6%8D%A2%E4%B8%A4%E9%A1%B5%E8%AE%BE%E7%BD%AE%E7%95%8C%E9%9D%A2--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-turn-page-icon%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-lf%20read-icon%20%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-rt%20read-icon%20read-active%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'progress': decodeURI('%0A%0A%20%20%20%20%3C!--%E8%BF%9B%E5%BA%A6%E8%AE%BE%E7%BD%AE%E9%9D%A2%E6%9D%BF--%3E%0A%20%20%20%20%3Cdiv%20class=%22read-schedule-set-panel%22%3E%0A%20%20%20%20%20%20%20%20%3C!--%E7%AB%A0%E8%8A%82--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-adjust%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-lf%20read-font%20read-prev-chapter%22%3E1%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-center-click-view%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-lf%20read-icon%20read-prev%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-count-view%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-text-over%20read-chapt-title%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-text-over%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-chapt-current%22%3E2%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%3E/%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-chapt-total%22%3E10%3C/span%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-rt%20read-icon%20read-next%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-rt%20read-font%20read-next-chapter%22%3E3%3C/span%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C!--%E8%BF%9B%E5%BA%A6%E8%B0%83%E8%8A%82--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-schedule-adjust%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%3Cdiv%20class=%22prev-step%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22icon-v-center%22%3E6%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-progress-bar%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A%0A'),
    'complain': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-comm-panel%20read-copyright-complaint%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-lf%20read-cancel%22%3E%E5%8F%96%E6%B6%88%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon-hv-center%22%3E%E7%89%88%E6%9D%83%E6%8A%95%E8%AF%89%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-rt%20read-sub-blue-color%20read-send%22%3E%E5%8F%91%E9%80%81%3C/span%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctextarea%20placeholder=%22%E4%BF%9D%E6%8A%A4%E7%89%88%E6%9D%83%EF%BC%8C%E5%85%B1%E5%BB%BA%E7%99%BE%E5%AE%B6%E4%BA%89%E9%B8%A3%E7%9A%84%E5%8E%9F%E5%88%9B%E5%A4%A7%E7%8E%AF%E5%A2%83%EF%BC%8C%E6%84%9F%E8%B0%A2%E6%9C%89%E6%82%A8%22%3E%3C/textarea%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'search': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-comm-panel%20read-search-panel%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-lf%20read-cancel%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-search-ipt-box%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-search%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20type=%22search%22%20class=%22read-search-ipt%22%20placeholder=%22%E8%AF%B7%E8%BE%93%E5%85%A5%E6%90%9C%E7%B4%A2%E5%85%B3%E9%94%AE%E5%AD%97%22%20/%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-rt%20read-sub-blue-color%20read-send%22%3E%E6%90%9C%E7%B4%A2%3C/span%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-search-history%20read-hide%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-search-result%20read-hide%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'correct': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-comm-panel%20read-reader-correct%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-lf%20read-cancel%22%3E%E5%8F%96%E6%B6%88%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon-hv-center%22%3E%E7%BA%A0%E9%94%99%E6%96%87%E5%AD%97%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-rt%20read-sub-blue-color%20read-send%22%3E%E5%8F%91%E9%80%81%3C/span%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-original-text%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctextarea%20placeholder=%22%E5%B8%AE%E5%8A%A9%E6%88%91%E4%BB%AC%E7%BA%A0%E6%AD%A3%E9%94%99%E8%AF%AF%EF%BC%8C%E8%AE%A9%E6%88%91%E4%BB%AC%E4%B8%BA%E5%A4%A7%E5%AE%B6%E6%9B%B4%E5%A5%BD%E7%9A%84%E6%9C%8D%E5%8A%A1%22%3E%3C/textarea%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'cbn': decodeURI('%0A%0A%20%20%20%20%3Cdiv%20class=%22read-comm-panel%20read-cbn-panel%22%20style=%22display:%20none;%22%3E%0A%20%20%20%20%20%20%20%20%3C!--%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header-nav%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C!--%E5%BA%95%E9%83%A8%E7%BB%A7%E7%BB%AD%E9%98%85%E8%AF%BB%E6%8C%89%E9%92%AE--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-back-read%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-h-center%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%3E%E7%BB%A7%E7%BB%AD%E9%98%85%E8%AF%BB%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A%0A'),
    'cbnNavMenu': decodeURI('%0A%20%20%20%20%3C%25%20_.each(obj,%20function(%20menu%20)%7B%20%20%20%25%3E%0A%0A%20%20%20%20%3Cdiv%20class=%22read-lf%20%3C%25=%20menu.state%20%25%3E%20read-nav-menus%3C%25=%20obj.length%20%25%3E%20%22%3E%0A%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-pointer%20read-text-over%22%20data-view=%22%3C%25=%20menu.view%20%25%3E%22%3E%3C%25=%20menu.text%20%25%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C%25%20%20%20%7D);%20%20%25%3E%0A'),
    'cbnNavBody': decodeURI('%0A%20%20%20%20%3C%25%20_.each(obj,%20function(%20menu%20)%7B%20%20%20%25%3E%0A%20%20%20%20%3Cdiv%20class=%22%3C%25=%20menu.view%20%25%3E%20%3C%25%20if(menu.state%20!=%20\'read-active\')%7B%20%25%3E%20read-hide%20%20%3C%25%20%7D%20%25%3E%20%22%20style=%22height:%20100%25;%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-no-%3C%25=%20menu.name%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-h-center%20%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%22%3E%3C%25=%20menu.prompt%20%25%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C%25%20%20%20%7D);%20%20%25%3E%0A'),
    'catalog': decodeURI('%0A%0A%20%20%20%20%3Cdiv%20class=%22read-book-info%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%3Ch1%20class=%22read-text-over%22%3E%3C%25=%20obj.name%20%25%3E%3C/h1%3E%0A%20%20%20%20%20%20%20%20%3Ch2%20class=%22read-text-over%22%3E%3C%25=%20obj.subtitle%20%25%3E%3C/h2%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cf%20read-catalog-author%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%3E%3Cspan%20class=%22read-lf%20read-text-over%22%3E%3C%25=%20obj.author%20%25%3E%3C/span%3E%3Cspan%20class=%22%22%3E%E8%91%97%3C/span%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%3E%3Cspan%20class=%22read-lf%20read-text-over%22%3E%3C%25=%20obj.translator%20%25%3E%3C/span%3E%3Cspan%20class=%22%22%3E%E8%AF%91%3C/span%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cf%20read-catalog-visitors%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%3E%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%3Cspan%3E%3C%25=%20obj.read_num%20%25%3E%20%E9%98%85%E8%AF%BB%3C/span%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%22%3E%3Cspan%3E%3C%25=%20obj.word_count%20%25%3E%20%E5%AD%97%3C/span%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A%0A%20%20%20%20%3Cdiv%20class=%22read-chapter-list%22%3E%0A%20%20%20%20%20%20%20%20%3Cul%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20_.each(obj.chapter,%20function(chapt)%7B%20%20%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cli%20class=%22%3C%25%20if%20(!chapt.chapter_status)%20%7B%20%25%3Eread-no-data%3C%25%20%7D%20%25%3E%22%20data-status=%22%3C%25=%20chapt.chapter_status%20%25%3E%22%20data-id=%22%3C%25=%20chapt.chapter_id%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-lf%20read-chapter-name%22%3E%3C%25=%20chapt.chapter_name%20%25%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%3Cspan%20class=%22read-rt%20read-chapter-seat%22%3E%3C%25=%20!!chapt.pageNum%20?%20chapt.pageNum%20:%200%20%25%3E%3C/span%3E--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-rt%20read-chapter-seat%22%3E%3C%25=%20(parseInt(chapt.textlen)/parseInt(obj.word_count)%20*%20100).toFixed(2)%20%25%3E%25%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%20%20%20%20%3C/ul%3E%0A%20%20%20%20%3C/div%3E%0A%0A'),
    'note': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-has-note%20%22%3E%0A%20%20%20%20%20%20%20%20%3C%25%20_.each(obj.chapter_list,%20function(chapt)%7B%20%20%20%25%3E%0A%20%20%20%20%20%20%20%20%3C%25%20if(!_.isEmpty(chapt.note_list))%7B%20%25%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-one-chapter-notes%22%20data-chapterid=%22%3C%25=%20chapt.chapter_id%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-chapter%20cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-note-chapter-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapt.chapter_name%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20read-note-chapter-count%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapt.note_count%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20_.each(chapt.note_list,%20function(note)%7B%20%20%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note%22%20data-noteid=%22%3C%25=%20note.note_id%20%25%3E%22%20data-percent=%22%3C%25=%20note.note_page%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-left%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-original-text%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20note.original%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-text%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20note.note_text%20%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cf%20read-note-time%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-note-or-underline%20read-note-%3C%25=%20!note.note_text%20?%200%20:%201%20%20%25%3E%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=(parseFloat(note.note_page)*100).toFixed(2)+%20%22%25%22%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20obj.nowDate%20==%20note.note_time.substr(0,%2010)%20?%20note.note_time.substring(11)%20:%20note.note_time.substr(0,%2010)%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-del%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%3E%E5%88%A0%E9%99%A4%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C%25%20%7D;%20%25%3E%0A%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%3C/div%3E%0A%20%20%20%20%3Cdiv%20class=%22read-no-note%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-h-center%20%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%22%3E%E9%98%85%E8%AF%BB%E6%97%B6%E9%95%BF%E6%8C%89%E6%96%87%E5%AD%97%E5%8F%AF%E6%B7%BB%E5%8A%A0%E7%AC%94%E8%AE%B0%3C/span%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'bookmark': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-has-bookmark%22%3E%0A%20%20%20%20%20%20%20%20%3C%25%20_.each(obj.chapter_list,%20function(chapt)%7B%20%20%20%25%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-one-chapter-bookmark%22%20data-chapterid=%22%3C%25=%20chapt.chapter_id%20%25%3E%22%20data-chapterName=%22%3C%25=%20chapt.chapter_name%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-chapter%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-text-over%20read-bookmark-chapter-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapt.chapter_name%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20read-bookmark-chapter-count%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapt.count%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20_.each(chapt.bookmark_list,%20function(bookmark)%7B%20%20%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark%20read-bookmark%3C%25=%20bookmark.bookmark_id%20%25%3E%22%20data-bookmarkid=%22%3C%25=%20bookmark.bookmark_id%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-left%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-original-text%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20bookmark.bookmark_text%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cf%20read-bookmark-time%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%3E%3Cspan%20class=%22read-icon%20read-icon-v-center%22%3E%3C/span%3E%3Cspan%20class=%22read-bookmark-percent%22%3E%3C%25=%20(parseFloat(bookmark.bookmark_page)*100).toFixed(2)%20%25%3E%25%3C/span%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20bookmark.bookmark_time%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-del%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%3E%E5%88%A0%E9%99%A4%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%3C/div%3E%0A%20%20%20%20%3Cdiv%20class=%22read-no-bookmark%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-h-center%20%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%22%3E%E9%98%85%E8%AF%BB%E6%97%B6%E4%B8%8B%E6%8B%89%E6%B7%BB%E5%8A%A0%E4%B9%A6%E7%AD%BE%3C/span%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'firstOpen': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-first-time%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-flex-item-1%20read-icon%20%20read-icon-left%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-flex-item-2%20read-icon%20%20read-icon-middle%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-flex-item-1%20read-icon%20%20read-icon-right%22%3E%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'viewImg': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-viewimg-panel%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-img-setting%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-exit-img%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%22%3E%E8%BF%94%E5%9B%9E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20read-save-btn%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%22%3E%E4%BF%9D%E5%AD%98%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-rotate-btn%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-viewimg-content%22%3E%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'noteEdit': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-comm-panel%20read-note-edit%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-lf%20read-cancel%22%3E%E5%8F%96%E6%B6%88%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon-hv-center%22%3E%E7%BC%96%E8%BE%91%E7%AC%94%E8%AE%B0%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-rt%20read-sub-blue-color%20read-send%22%3E%E4%BF%9D%E5%AD%98%3C/span%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-original-text%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctextarea%20placeholder=%22%E8%BD%BB%E6%9D%BE%E8%AE%B0%E5%BD%95%E6%82%A8%E7%9A%84%E6%89%80%E6%83%B3%E3%80%81%E6%89%80%E6%84%9F%22%3E%3C/textarea%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'noteDetail': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-note-detail%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-detail-left%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-detail-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon-hv-center%20read-font%22%3E%E6%9C%AC%E7%AB%A0%E8%8A%82%E7%AC%94%E8%AE%B0%E8%AF%A6%E6%83%85%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-rt%20read-share-btn%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%8E%9F%E6%96%87%E6%91%98%E8%A6%81--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-original-text%22%3E%E5%8E%9F%E6%96%87%E6%91%98%E8%A6%81%E5%8E%9F%E6%96%87%E6%91%98%E8%A6%81%E5%8E%9F%E6%96%87%E6%91%98%E8%A6%81%E5%8E%9F%E6%96%87%E6%91%98%E8%A6%81%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E7%AC%94%E8%AE%B0%E5%86%85%E5%AE%B9--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-text%22%3E%E7%AC%94%E8%AE%B0%E5%86%85%E5%AE%B9%E7%AC%94%E8%AE%B0%E5%86%85%E5%AE%B9%E7%AC%94%E8%AE%B0%E5%86%85%E5%AE%B9%E7%AC%94%E8%AE%B0%E5%86%85%E5%AE%B9%E7%AC%94%E8%AE%B0%E5%86%85%E5%AE%B9%E7%AC%94%E8%AE%B0%E5%86%85%E5%AE%B9%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E6%97%B6%E9%97%B4--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-time%20read-rt%22%3E2016/08/01%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-btns%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cbutton%20class=%22read-lf%20read-delete-btn%22%3E%E5%88%A0%E9%99%A4%3C/button%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cbutton%20class=%22read-rt%20read-edit-btn%22%3E%E7%BC%96%E8%BE%91%3C/button%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-prev%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%3E%E4%B8%8A%E4%B8%80%E4%B8%AA%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-icon-hv-center%20read-page%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-current%22%3E1%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%3E/%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-total%22%3E3%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20read-next%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%3E%E4%B8%8B%E4%B8%80%E4%B8%AA%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'noteShare': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-note-share%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-share-cover%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-share-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cul%20class=%22read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20_.each(obj,%20function(item)%7B%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cli%20class=%22%3C%25if(!item.flag)%7B%20%25%3E%20read-close%20%3C%25%20%7D%20%25%3E%22%20data-type=%22%3C%25=item.type%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-icon%20%20%3C%25=item.icon_css%20%25%3E%20%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-font%20read-text-over%22%3E%3C%25=item.txt%20%25%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/li%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/ul%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cbutton%20class=%22read-note-share-cancel%22%3E%E5%8F%96   %E6%B6%88%3C/button%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'video': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-mobile-video-wrap%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-video-list%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bigSizeVideo%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cvideo%20class=%22read-current-video%22%20width=%22100%25%20%22%20height=%2299%25%20%22%3E%3C/video%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%20%E6%8E%A7%E5%88%B6%E6%9D%A1%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-contorls-container%20%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-video-controls%20%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-video-play-btn%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-video-currenttime%20%22%3E00:00%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-progress-bar%20%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-loadedprogress-bar%20%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-video-totaltime%20%22%3E00:00%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-full-screen%20%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header-back-icon%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header-video-title%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%20%E8%B0%83%E8%8A%82%E9%9F%B3%E9%87%8F%E6%9D%A1%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-volume-bar%20%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-addvolume-icon%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-totalvolume-bar%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-loadedvolume-bar%20%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-reducevolume-icon%20%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%20%E8%B0%83%E8%8A%82%E4%BA%AE%E5%BA%A6%E6%9D%A1%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-light-bar%20%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-light-icon%20%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-totallight-bar%20%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-loadedlight-bar%20%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%20%E5%BC%95%E5%AF%BC%E9%A1%B5%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-guide-page%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%20%E8%BF%9B%E5%BA%A6%E9%81%AE%E7%BD%A9%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-progress-mask%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-progress-bar%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-current-time%22%3E%3C/span%3E%3Cspan%3E/%3C/span%3E%3Cspan%20class=%22read-total-time%20%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%20%E6%AD%A3%E5%9C%A8%E5%8A%A0%E8%BD%BD%E9%81%AE%E7%BD%A9%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-waiting-mask%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-play-icon%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%20%E6%9A%82%E5%81%9C%E9%81%AE%E7%BD%A9%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-pause-mask%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-play-icon%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A')
  };
  return output = {
    getTempl: function (type) {
      return templSets[type];
    }
  };
}(js_src_global, js_libs_zeptodev);

move = window.move;
js_libs_move = move;

js_src_panelMain = function (window, $, move) {
  var _ = window._;
  var MainPanel = function (options) {
    var defaults = {
      $readerObj: null,
      templHtml: '',
      // HTML 模板
      $domObj: null,
      // 该panel所在 DOM对象.
      data: {
        'chapterName': '',
        'chapterContent': '',
        'pagePerc': ''
      },
      isMobile: true,
      swipe: 'X',
      // 判断水平滑动还是竖直滑动
      basePoint: {
        X: 0,
        Y: 0
      },
      width: 0,
      // 阅读主面板的 宽;
      height: 0
    };
    this.opts = $.extend(true, {}, defaults, options);
    // 动画页面.
    this.opts.$animatePage = null;
    // 阅读正文
    this.opts.$mainCont = null;
    // 动画正文
    this.opts.$animateCont = null;
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  MainPanel.prototype._init = function () {
    console.log('[panelMain] --> _init');
    this._renderLayout();
    this._bindEvent();
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  MainPanel.prototype._renderLayout = function () {
    var optsObj = this.opts;
    var readerOffset = optsObj.$readerObj.offset();
    optsObj.basePoint.X = readerOffset.left;
    optsObj.basePoint.Y = readerOffset.top;
    // 利用 模板 生成HTML
    var templObj = _.template(optsObj.templHtml);
    var panelHtml = templObj(optsObj.data);
    // 转化 zepto 对象;
    optsObj.$readerObj.append(panelHtml);
    optsObj.$domObj = optsObj.$readerObj.find('.read-selector-main');
    optsObj.$mainCont = optsObj.$domObj.find('.read-content');
    // 宽,高 属性;
    optsObj.width = readerOffset.width;
    optsObj.height = readerOffset.height;
    optsObj.$content = optsObj.$domObj.find('.read-content');
    optsObj.$chapter = optsObj.$domObj.find('.read-chapter-view');
    optsObj.$page = optsObj.$domObj.find('.read-page');
    // add by @gli-hxy-20160816 start
    optsObj.$animatePage = optsObj.$domObj.find('.read-content-animate');
    optsObj.$animateCont = optsObj.$animatePage.find('.read-animate-content');
    optsObj.$Achapter = optsObj.$domObj.find('.read-content-animate .read-chapter-view');
    optsObj.$Acontent = optsObj.$domObj.find('.read-animate-content');
    optsObj.$Apage = optsObj.$domObj.find('.read-content-animate .read-page');
    optsObj.$real = optsObj.$domObj.find('.read-real-animate');
    optsObj.$realChapter = optsObj.$real.find('.read-chapter-view');
    optsObj.$realContent = optsObj.$real.find('.read-animate-content');
    optsObj.$realPage = optsObj.$real.find('.read-page');  // add by @gli-hxy-20160816 end
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  MainPanel.prototype._bindEvent = function () {
    var optsObj = this.opts;
    var basePos = optsObj.basePoint;
    var panelW = optsObj.width;
    var panelH = optsObj.height;
    var that = this;
    // 判断是左滑还是右滑
    optsObj.isLeft = true;
    // 判断是否是第一次进入滑动，一次滑动只判断一次左滑还是右滑
    optsObj.isMove = false;
    optsObj.$domObj.on('touchstart', function (e) {
      var touches = e.touches[0];
      //触控开始
      optsObj.flag = null;
      optsObj.movement = 0;
      //记录落点
      optsObj.pageX = touches.pageX;
      optsObj.pageY = touches.pageY;
      optsObj.isMove = true;
    });
    optsObj.$domObj.on('touchmove', function (e) {
      if (optsObj.$readerObj.attr('data-pageway') != 'page_2') {
        that.touchmove(e);
      }
    });
    optsObj.$domObj.on('touchend', function (e) {
      that.touchend(e);
    });
    // PC浏览器: click; Mobile浏览器: tap;
    var eventType = optsObj.isMobile ? 'tap' : 'click';
    optsObj.$domObj.on(eventType, function (e) {
      // add by gli-hxy-20160817 start 
      var tmpState = $(this).attr('data-animate');
      if (tmpState == '1') {
        // 翻页动画正在执行，按时不能操作页面
        console.info('%c [panelMain.js] -> 动画中!', 'background:yellow;');
        return;
      }
      // add by gli-hxy-20160817 end
      /* add by gli-gong-20160823 start */
      // 浏览图片。
      var targetObj = e.target;
      if (targetObj.nodeName == 'IMG' && targetObj.getAttribute('data-cover') != 1) {
        console.info('[panelMain.js]-> 点击了图片!');
        console.info('data-index:' + targetObj.getAttribute('data-index'));
        optsObj.$domObj.trigger('mainpanel:img', { 'currentIdx': targetObj.getAttribute('data-index') });
        return;
      }
      /* add by gli-gong-20160823 end. */
      /* add by gli-hxy-20161118 start */
      // 浏览视频
      if (targetObj.nodeName == 'VIDEO') {
        console.info('[panelMain.js]-> 点击了视频!');
        var videoSrc = targetObj.getAttribute('src') || targetObj.querySelector('source').getAttribute('src');
        var videoName = targetObj.getAttribute('data-name') || videoSrc.split('/').pop();
        optsObj.$domObj.trigger('mainpanel:video', {
          'src': videoSrc,
          'name': videoName
        });
        return;
      }
      /* add by gli-hxy-20161118 end */
      console.log('MainPanel -> x: ' + e.clientX + ' , y:' + e.clientY + ', type:' + e.type);
      // 判断点击区域 -- 30%, 40%, 30%
      var eX = e.clientX - basePos.X;
      var eY = e.clientY - basePos.Y;
      var eventPos = Math.floor(eX / panelW * 100);
      if (70 < eventPos && eventPos <= 100) {
        // 点击 偏右区域, 下一页 翻页;
        optsObj.$domObj.trigger('mainpanel:right');
      } else if (30 < eventPos && eventPos <= 70) {
        // 点击 中部区域, 弹出设置面板;
        optsObj.$domObj.trigger('mainpanel:middle');
      } else if (0 < eventPos && eventPos <= 30) {
        // 点击 偏右区域, 上一页 翻页;
        optsObj.$domObj.trigger('mainpanel:left');
      } else {
        console.warn('[panelMain] -> eventPos:' + eventPos);
      }
    });
    // 添加/删除 书签
    optsObj.$domObj.on('swipeDown', function (event, a, b) {
      console.info('添加/删除 书签!!');
      // TOOD, 判断 事件坐标范围.
      var bid = optsObj.$domObj.find('.read-bookmark-view').attr('data-bookmarkid');
      optsObj.$domObj.trigger('mainpanel:swipeDown', bid);
    });
  };
  /**
   * 显示页面数据. <br/>
   * 
   * @param {Object} data {
   *      'chapt_index':      {Number} 章节下标,
   *      'page_index':       {Number} 页码,
   *      'chapterId'         {String} 当前的章节id
   *      'chapterName':      {String} 章节名
   *      'chapterContent':   {String} 当前页html
   *      'pagePerc':         {String} 当前页偏移量  ps:12.34%
   *      'direction':        {String} 翻页方向  ps:'next','prev'
   *      'turnMode':         {Number} 翻页模式  ps:0,正常反应，有翻页动画;1,特殊翻页,无翻页动画
   *      'startPageOffset'   {String} 当前页的开始偏移量
   *      'endPageOffset'     {String} 当前页的结束偏移量
   *     }
   * 
   * @param {Object} way 翻页方式 ( page_1平铺翻页，page_2仿真翻页  )
   * 
   */
  MainPanel.prototype.showPagedata = function (data, way) {
    var that = this;
    var optsObj = that.opts;
    optsObj.data = data;
    // way 翻页方式
    if (way == 'page_1' && data.turnMode != 1) {
      // 平铺翻页
      that._getTileData();
    } else if (way == 'page_2') {
      // 仿真翻页 
      //          that.realPage();
      that.firstPage();
    } else {
      // 第一次打开阅读器无动画
      that.firstPage();
    }
  };
  /**
   * trigger 获取数据 填充动画页面显示
   * 
   */
  MainPanel.prototype._getTileData = function () {
    var that = this;
    var optsObj = that.opts;
    var direction = optsObj.data.direction;
    // 填充动画页内容
    if (direction == 'next') {
      optsObj.$animatePage.eq(1).find('.read-chapter-view').html(optsObj.data.chapterName);
      optsObj.$animatePage.eq(1).find('.read-animate-content').html(optsObj.data.chapterContent);
      optsObj.$animatePage.eq(1).find('.read-page').html(optsObj.data.currPage);
    } else if (direction == 'prev') {
      optsObj.$animatePage.eq(0).find('.read-chapter-view').html(optsObj.data.chapterName);
      optsObj.$animatePage.eq(0).find('.read-animate-content').html(optsObj.data.chapterContent);
      optsObj.$animatePage.eq(0).find('.read-page').html(optsObj.data.currPage);
    }
    // 点击翻页时才执行
    if (optsObj.operation != 'swipe') {
      this._tilePage(direction);
    }
  };
  /**
   * 平铺动画动画
   * @param {String} direction 向前翻页还是向后翻页
   * 
   */
  MainPanel.prototype._tilePage = function (direction) {
    var that = this;
    var optsObj = that.opts;
    // 先把书签显示标记隐藏
    optsObj.$domObj.find('.read-header .read-bookmark-view').hide();
    // 添加正在动画标志
    optsObj.$domObj.attr('data-animate', '1');
    if (direction == 'prev') {
      optsObj.$animatePage.eq(0).removeClass('read-hide');
      setTimeout(function () {
        move(optsObj.$animatePage[0]).translate(optsObj.width, 0).duration('0.3s').ease('out').end();
      }, 10);
    } else {
      optsObj.$animatePage.eq(1).removeClass('read-hide');
      setTimeout(function () {
        move(optsObj.$animatePage[1]).translate(-optsObj.width, 0).duration('0.3s').ease('out').end();
      }, 10);
    }
    setTimeout(function () {
      // 填充 阅读主页面 内容
      optsObj.$chapter.html(optsObj.data.chapterName);
      optsObj.$content.html(optsObj.data.chapterContent);
      optsObj.$page.html(optsObj.data.currPage);
      that._setPageShow();
      optsObj.$domObj.find('.read-content-animate').css({
        'transform': 'none',
        '-webkit-transform': 'none',
        '-moz-transform': 'none',
        '-ms-transform': 'none'
      }).addClass('read-hide');
      optsObj.$animatePage.eq(1).find('.read-chapter-view').html('');
      optsObj.$animatePage.eq(1).find('.read-animate-content').html('');
      optsObj.$animatePage.eq(1).find('.read-page').html('');
      optsObj.$animatePage.eq(0).find('.read-chapter-view').html('');
      optsObj.$animatePage.eq(0).find('.read-animate-content').html('');
      optsObj.$animatePage.eq(0).find('.read-page').html('');
      // 取消正在动画标志
      optsObj.$domObj.attr('data-animate', '0');
      // 判断当前页是否有书签
      optsObj.$domObj.trigger('mainpanel:showBookmark', optsObj.data);
    }, 300);
  };
  /**
   * 仿真翻页 <br/>
   * 
   * @param {String} direction 向前翻页还是向后翻页
   * @param {Object} reader Reader对象
   * 
   * @author gli-hxy-20160817
   * 
   */
  MainPanel.prototype.realPage = function () {
    var that = this;
    var optsObj = that.opts;
    var direction = optsObj.data.direction;
    optsObj.$domObj.attr('data-animate', '1');
    // 先把书签显示标记隐藏
    optsObj.$domObj.find('.read-header .read-bookmark-view').hide();
    optsObj.$real.show();
    setTimeout(function () {
      optsObj.$real.addClass('read-real-turn-' + direction);
    }, 10);
    // 填充 阅读主页面 内容
    optsObj.$realChapter.html(optsObj.$chapter.html());
    optsObj.$realContent.html(optsObj.$content.html());
    optsObj.$chapter.html(optsObj.data.chapterName);
    optsObj.$content.html(optsObj.data.chapterContent);
    setTimeout(function () {
      optsObj.$real.removeClass('read-real-turn-' + direction);
      optsObj.$real.hide();
      optsObj.$domObj.attr('data-animate', '0');
      // 判断当前页是否有书签
      optsObj.$domObj.trigger('mainpanel:showBookmark', optsObj.data);
    }, 500);
    optsObj.$page.html(optsObj.data.currPage);
    this._setPageShow();
  };
  /**
   * 第一次进入阅读器时
   * @param {Object} direction
   * @param {Object} reader
   */
  MainPanel.prototype.firstPage = function () {
    var that = this;
    var optsObj = that.opts;
    var direction = optsObj.data.direction;
    // 判断当前页是否有书签
    optsObj.$domObj.trigger('mainpanel:showBookmark', optsObj.data);
    // 填充 阅读主页面 内容
    optsObj.$chapter.html(optsObj.data.chapterName);
    optsObj.$content.html(optsObj.data.chapterContent);
    optsObj.$page.html(optsObj.data.currPage);
    this._setPageShow();
  };
  /**
   * 页面显示加载，加载公式/图片/表格/笔记等. <br/>
   * 
   */
  MainPanel.prototype._setPageShow = function () {
    var optsObj = this.opts;
    if (typeof MathJax !== 'undefined') {
      MathJax.Hub.Queue([
        'Typeset',
        MathJax.Hub
      ]);
    }
    this._setImgSrc();
    this._setVideoSrc();
    this._setTableStyle();
    this._bindTableEvent();
    optsObj.$domObj.trigger('mainpanel:showNote');
  };
  /**
   * 设置图片src值. <br/>
   * 
   * @author gli-jiangxq-20160816
   */
  MainPanel.prototype._setImgSrc = function () {
    var optsObj = this.opts;
    optsObj.$mainCont.find('img[data-src]').each(function () {
      var data_src = $(this).attr('data-src');
      $(this).attr('src', data_src);
      $(this).removeAttr('data-src');
    });
  };
  /**
   * 设置视频的src值.
   * 
   * @author gli-hxy-20161118
   */
  MainPanel.prototype._setVideoSrc = function () {
    var optsObj = this.opts;
    optsObj.$mainCont.find('source[data-src]').each(function () {
      var data_src = $(this).attr('data-src');
      $(this).attr('src', data_src);
      $(this).removeAttr('data-src');
    });
  };
  /**
   * 设置表格缩小样式. <br/>
   * 
   * @author gli-jiangxq-20160816
   */
  MainPanel.prototype._setTableStyle = function () {
    var optsObj = this.opts;
    var pageW = optsObj.$mainCont.width();
    var parentH = 0;
    optsObj.$mainCont.find('table').each(function () {
      if ($(this).attr('zoom') == '1') {
        return true;
      }
      if ($(this).width() > pageW) {
        parentH = $(this).parent().height();
        $(this).parent().addClass('read-tbl-big-data');
        parentH = parentH * 2 - $(this).parent().height();
        $(this).attr('zoom', '1');
        $(this).attr('data-resth', parentH);
      }
    });
    optsObj.$mainCont.find('table[zoom="1"]').each(function () {
      var height = $(this).attr('data-resth');
      var tempDiv = $('<div class="read-tbl-wrap" style="height: ' + height + 'px">');
      $(this).parent().append(tempDiv);
      var tmpImg = $('<div class="read-open-pop">');
      $(this).parent().append(tmpImg);
      tempDiv.append($(this));
    });
  };
  /**
   * 绑定表格放大事件. <br/>
   * 
   * @author gli-jiangxq-20160816
   */
  MainPanel.prototype._bindTableEvent = function () {
    var that = this;
    var optsObj = this.opts;
    var basePos = optsObj.basePoint;
    var panelW = optsObj.width;
    var bigTable = optsObj.$mainCont.find('table[zoom="1"]');
    var eventType = optsObj.isMobile ? 'tap' : 'click';
    bigTable.on(eventType, function (e) {
      var eX = e.clientX - basePos.X;
      var eventPos = Math.floor(eX / panelW * 100);
      // 点击表格30%-70%响应放大事件
      if (30 < eventPos && eventPos <= 70) {
        var table_clone = $(this).clone(true);
        that._expandTable(table_clone);
        e.stopPropagation();
      }
    });
  };
  /**
   * 将缩小的表格放大显示. <br/>
   * 
   * @param {Object} table 需要放大的表格
   * @author gli-jiangxq-20160816
   */
  MainPanel.prototype._expandTable = function (table) {
    var optsObj = this.opts;
    var eventType = optsObj.isMobile ? 'tap' : 'click';
    var maskObj = $('<div class="read-comm-panel read-comm-table">');
    var tableObj = $('<div class="read-comm-tbl-wrap">');
    var closeObj = $('<div class="read-close-btn">');
    maskObj.append(closeObj);
    maskObj.append(tableObj);
    tableObj.append(table);
    optsObj.$readerObj.append(maskObj);
    maskObj.on(eventType + ' swipeDown', function (e) {
      return false;
    });
    closeObj.on(eventType, function (e) {
      maskObj.remove();
      e.stopPropagation();
    });
  };
  /**
   * 设置 主面板字体大小. <br/>
   * 
   * @param {Object} options
   * 
   */
  MainPanel.prototype.setFontSize = function (options) {
    var optsObj = this.opts;
    var tmpFontSize = {
      'oldValue': '',
      'newValue': ''
    };
    tmpFontSize.oldValue = 'read-size-' + options.oldValue;
    tmpFontSize.newValue = 'read-size-' + options.newValue;
    optsObj.$domObj.find('.read-content').removeClass(tmpFontSize.oldValue).addClass(tmpFontSize.newValue);
    optsObj.$domObj.find('.read-delicate').removeClass(tmpFontSize.oldValue).addClass(tmpFontSize.newValue);
    optsObj.$domObj.find('.read-animate-content').removeClass(tmpFontSize.oldValue).addClass(tmpFontSize.newValue);
  };
  /**
   * 设置 主面板字体类型. <br/>
   * 
   * @param {Object} options
   * 
   */
  MainPanel.prototype.setFontFamily = function (options) {
    var optsObj = this.opts;
    var tmpFamily = {
      'oldValue': '',
      'newValue': ''
    };
    tmpFamily.oldValue = 'read-font-family-' + options.oldValue;
    tmpFamily.newValue = 'read-font-family-' + options.newValue;
    optsObj.$domObj.find('.read-content').removeClass(tmpFamily.oldValue).addClass(tmpFamily.newValue);
    optsObj.$domObj.find('.read-delicate').removeClass(tmpFamily.oldValue).addClass(tmpFamily.newValue);
    optsObj.$domObj.find('.read-animate-content').removeClass(tmpFamily.oldValue).addClass(tmpFamily.newValue);
  };
  /**
   * 设置 背景颜色.
   * 
   * @param {Object} options
   * 
   */
  MainPanel.prototype.setBgColor = function (options) {
    var optsObj = this.opts;
    var tmpBgColor = {
      'oldValue': '',
      'newValue': ''
    };
    tmpBgColor.oldValue = 'read-bg-' + options.oldValue;
    tmpBgColor.newValue = 'read-bg-' + options.newValue;
    // 阅读主页面.
    optsObj.$readerObj.removeClass('read-night');
    optsObj.$domObj.removeClass(tmpBgColor.oldValue);
    optsObj.$domObj.addClass(tmpBgColor.newValue);  // 动画页面.
                                                    //      optsObj.$animatePage.removeClass(tmpBgColor.oldValue);
                                                    //      optsObj.$animatePage.addClass(tmpBgColor.newValue);
  };
  /**
   * 打开面板. <br/>
   * 
   */
  MainPanel.prototype.open = function () {
    console.log('[panelMain] --> open');
    var optsObj = this.opts;
    optsObj.$domObj.fadeIn(300);
  };
  /**
   * 关闭面板. <br/>
   * 
   */
  MainPanel.prototype.close = function () {
    var optsObj = this.opts;
    optsObj.$domObj.fadeOut(100);
  };
  /**
   * 自定义事件. <br/>
   * 
   * @param eventName {String}   事件名称, "mainpanel:left", "mainpanel:middle", "mainpanel:right", "mainpanel:swipeDown",
   *                                     "mainpanel:showNote" 
   * @param cb        {Function} 回调事件
   * 
   */
  MainPanel.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  /**
   * 滑动中
   * @param {Object} e 滑动event对象
   */
  MainPanel.prototype.touchmove = function (e) {
    var that = this;
    var optsObj = this.opts;
    var touches = e.touches[0];
    var X = touches.pageX - optsObj.pageX;
    var Y = touches.pageY - optsObj.pageY;
    // 设置是滑动翻页（标识）-- 还是点击翻页标识
    optsObj.operation = 'swipe';
    //判断
    if (!optsObj.flag) {
      optsObj.flag = Math.abs(X) > Math.abs(Y) ? 'X' : 'Y';
    }
    if (optsObj.flag === optsObj.swipe) {
      e.preventDefault();
      e.stopPropagation();
      optsObj.movement = X;
      if (optsObj.isMove) {
        optsObj.isLeft = X < 0 ? false : true;
        if (X < 0) {
          optsObj.isLeft = false;
          optsObj.$domObj.trigger('mainpanel:right');
        } else {
          optsObj.isLeft = true;
          optsObj.$domObj.trigger('mainpanel:left');
        }
        optsObj.isMove = false;
      }
      if (!optsObj.isLeft) {
        optsObj.$animatePage.eq(1).removeClass('read-hide');
        optsObj.$animatePage[1].style.webkitTransform = 'translate3d(' + X + 'px' + ',0,0)';
      } else if (optsObj.isLeft) {
        optsObj.$animatePage.eq(0).removeClass('read-hide');
        optsObj.$animatePage[0].style.webkitTransform = 'translate3d(' + X + 'px' + ',0,0)';
      }
    }
  };
  /**
   * 结束滑动
   * @param {Object} e 滑动event对象
   */
  MainPanel.prototype.touchend = function (e) {
    var that = this;
    var optsObj = this.opts;
    var minRange = 50;
    var movement = optsObj.movement;
    // 设置是滑动翻页（标识）-- 还是点击翻页标识
    optsObj.operation = 'tap';
    if (!optsObj.flag) {
      return;
    }
    e.preventDefault();
    //滑动结束判断是否执行翻页动画
    if (Math.abs(movement) > Math.abs(minRange)) {
      var direction = optsObj.isLeft ? 'prev' : 'next';
      that._tilePage(direction);
    } else {
      optsObj.$animatePage[1].style.webkitTransform = 'translate3d(' + 0 + 'px' + ',0,0)';
      optsObj.$animatePage[0].style.webkitTransform = 'translate3d(' + 0 + 'px' + ',0,0)';
      optsObj.$animatePage.addClass('read-hide');
    }
  };
  return MainPanel;
}(js_src_global, js_libs_zeptodev, js_libs_move);
js_src_widget_plugRadioGroup = function (window, $) {
  // jquery, zepto
  //  var $ = window.$;
  // underscore
  var _ = window._;
  /**
   * 插件 单选按钮. <br/>
   * 
   * @param options {Object}
   * @param options.type {String} 按钮类型 round: 圆形(默认),  oval: 椭圆形;
   * @param options.data {Array}  初始化按钮数据  {
   *                                              text: '', // {String} 显示文字, 如: '大' 
   *                                              value:''  // {String} 值 ,如: 'font-3'
   *                                            },,,
   * 
   */
  var RadioGroup = function (options) {
    console.log('[RadioGroup] -> 构造函数!');
    // html模板.
    var tmplHtml = '<% if(list.length > 0) {%><ul class="read-reader-radio-group <%= type%>">' + '<% _.each(list, function(radio) {   %>' + '<li class=\'read-item <% if(!!radio.bg) {  %> <%= radio.bg %> <% } %> \' ' + 'data-active="<%= !!radio.active ? radio.active : \'true\' %>" ' + 'data-val="<%= radio.value %>" style="<%= itemStyle%>"> <%= radio.text%> </li>' + '<% }); %> </ul> <% } %>';
    var defaults = {
      domSelector: '',
      // {String} 最好是id. '#xxx'
      $domObj: null,
      groupCssName: 'read-reader-radio-group',
      itemCssName: 'read-item',
      selectedCssName: 'read-selected',
      type: 'round',
      // oval, round
      data: [],
      // {text: '大', value: 'font-3'}, {text: '中', value: 'font-2'}
      value: '',
      oldValue: '',
      newText: '',
      // 当前显示文本text
      isMobile: true,
      templ: _.template(tmplHtml)
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化 单选按钮组.. <br/>
   * 
   */
  RadioGroup.prototype._init = function () {
    var optsObj = this.opts;
    optsObj.oldValue = optsObj.value;
    if (optsObj.$domObj == null) {
      optsObj.$domObj = $(optsObj.domSelector);
    }
    if (!this._check()) {
      return false;
    }
    this._setLayout();
    this._bindEvent();
    optsObj.$domObj.find('[data-val=\'' + optsObj.value + '\'  ]').addClass(optsObj.selectedCssName);
  };
  /**
   * 传入数据 合法性验证. <br/>
   * 
   * @return checkVal {Boolean} true: 合法, false: 非法。
   * 
   */
  RadioGroup.prototype._check = function () {
    var optsObj = this.opts;
    var checkVal = true;
    if (optsObj.$domObj.length === 0) {
      console.warn('[RadioGroup]: 请传入合法 dom 选择器!');
      checkVal = false;
    }
    if ($.isArray(optsObj.data) && optsObj.data.length < 2) {
      console.warn('[RadioGroup]: 请传入至少两个单选按钮数据!');
      checkVal = false;
    }
    return checkVal;
  };
  /**
   * 设置 单选按钮组布局. <br/>
   * 
   */
  RadioGroup.prototype._setLayout = function () {
    var optsObj = this.opts;
    // 按钮组 宽高.
    var groupWH = {
      width: optsObj.$domObj.width() || 0,
      height: optsObj.$domObj.height() || 0
    };
    // 单个按钮 宽高. 
    var itemWH = {
      width: Math.floor((groupWH.width - 0.1 * groupWH.width) / optsObj.data.length) || 0,
      height: groupWH.height || 0
    };
    var itemStyleVal = '';
    if (optsObj.type == 'round') {
      // 圆形
      itemWH.width = itemWH.height;
    }
    itemStyleVal = 'line-height:' + itemWH.height + 'px; width:' + itemWH.width + 'px; border-radius:' + Math.ceil(itemWH.height / 2) + 'px';
    var tmpData = {
      type: optsObj.type,
      itemStyle: itemStyleVal,
      list: optsObj.data
    };
    var templHTML = optsObj.templ(tmpData);
    optsObj.$domObj.html(templHTML);
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  RadioGroup.prototype._bindEvent = function () {
    var that = this;
    var optsObj = that.opts;
    var eventName = optsObj.isMobile ? 'tap' : 'click';
    optsObj.$domObj.on(eventName, '.read-item', function (e) {
      if ($(this).data('active') == false) {
        return false;
      }
      $(this).addClass(optsObj.selectedCssName).siblings().removeClass(optsObj.selectedCssName);
      optsObj.oldValue = optsObj.value;
      optsObj.value = $(this).data('val');
      optsObj.newText = $(this).text();
      console.log('[执行切换]' + optsObj.value);
      $(this).trigger('change:click', {
        'oldValue': optsObj.oldValue,
        'newValue': optsObj.value,
        'newText': optsObj.newText
      });
    });
  };
  /**
   * 设置 当前选中项的值. <br/>
   * 
   */
  RadioGroup.prototype.setValue = function (value, newText) {
    var optsObj = this.opts;
    optsObj.$domObj.find('[data-val="' + value + '"]').text(newText);
  };
  /**
   * 获取 当前选中项的值. <br/>
   * 
   */
  RadioGroup.prototype.getValue = function () {
    return this.opts.value;
  };
  /**
   * 获取 DOM对象 (jQuery 格式). <br/>
   * 
   */
  RadioGroup.prototype.getDomObj = function () {
    return this.opts.$domObj;
  };
  /**
   * 调整 宽高 . <br/>
   * 
   */
  RadioGroup.prototype.reSize = function () {
    console.log(' %c [RadioGroup] -> reSize!', 'background: skyblue');
    var optsObj = this.opts;
    // 按钮组 宽高.
    var groupWH = {
      width: optsObj.$domObj.width() || 0,
      height: optsObj.$domObj.height() || 0
    };
    // 单个按钮 宽高. 
    var itemWH = {
      width: Math.floor((groupWH.width - 0.1 * groupWH.width) / optsObj.data.length) || 0,
      height: groupWH.height || 0
    };
    var itemStyleVal = '';
    if (optsObj.type == 'round') {
      // 圆形
      itemWH.width = itemWH.height;
    }
    itemStyleVal = 'line-height:' + itemWH.height + 'px; width:' + itemWH.width + 'px; border-radius:' + Math.ceil(itemWH.height / 2) + 'px';
    optsObj.$domObj.find('li').each(function (a, b) {
      $(this).attr('style', itemStyleVal);
    });
  };
  /**
   * 注册 自定义 监听事件. <br/>
   * 
   * @param eventName {String}   事件名称, "change:click";
   * @param cb        {Function} 回调事件
   * 
   */
  RadioGroup.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  return RadioGroup;
}(js_src_global, js_libs_zeptodev);
js_src_widget_plugSwitches = function (window, $, move) {
  // jquery, zepto
  //  var $ = window.Zepto;
  // underscore
  var _ = window._;
  /**
   * 插件 开关按钮. <br/>
   * 
   * @param {Object} options
   * @param {Array} options.data 初始化开关信息 [true, false]
   */
  var Switches = function (options) {
    console.log('[Switches] -> 构造函数!');
    // html模板
    var tmplHtml = '<div class="read-reader-switch" style=<%= switchesStyle %>>' + '<div class="read-switch-cursor" style=<%= btnStyle %>></div>' + '<div class="read-switch-label read-switch-label-on" style="<%= fontStyle %> <%= onStyle %>"></div>' + '<div class="read-switch-label read-switch-label-off" style="<%= fontStyle %> <%= offStyle %>"></div>' + '</div>';
    var defaults = {
      domSelector: '',
      $domObj: null,
      data: [
        true,
        false
      ],
      switchesStyle: '',
      // 开关整体样式
      bgCssName: '',
      // 开关为开状态时背景样式
      btnStyle: '',
      // 圆按钮样式
      fontStyle: '',
      //ON OFF的共同样式
      onStyle: '',
      offStyle: '',
      value: false,
      // 开关状态： true为开，false 为关，默认为false
      isMobile: true,
      // underscore 
      templ: _.template(tmplHtml)
    };
    // 合并
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化 开关按钮. <br/>
   * 
   */
  Switches.prototype._init = function () {
    var optsObj = this.opts;
    optsObj.$domObj = $(optsObj.domSelector);
    if (!this._check()) {
      return false;
    }
    this._setLayout();
    this._bindEvent();
  };
  /**
   * 传入数据 合法性验证. <br/>
   * 
   * @return checkVal {Boolean} true: 合法, false: 非法。
   */
  Switches.prototype._check = function () {
    var optsObj = this.opts;
    var checkVal = true;
    if (optsObj.$domObj.length === 0) {
      console.warn('[Switches]: 请传入合法 dom 选择器!');
      checkVal = false;
    }
    if (optsObj.data.length != 2) {
      console.warn('[Switches]: 只能传入两个数据!');
      checkVal = false;
    }
    return checkVal;
  };
  /**
   * 设置 开关按钮布局. <br/>
   * 
   */
  Switches.prototype._setLayout = function () {
    var optsObj = this.opts;
    optsObj.$domObj = $(optsObj.domSelector);
    // 按钮背景框宽高.
    var divWH = {
      width: optsObj.$domObj.width() || 0,
      height: optsObj.$domObj.height() || 0
    };
    var divStyleVal = 'width:' + divWH.width + 'px;height:' + divWH.height + 'px;border-radius:' + divWH.height + 'px;';
    // 圆按钮宽高.
    var topH = Math.floor(divWH.height / 10);
    var btnWH = { height: divWH.height - topH * 2 - 2 };
    //把按钮信息存下来
    optsObj.topH = topH;
    optsObj.btnWH = btnWH;
    optsObj.divWH = divWH;
    //按钮为开时距离左边的距离
    optsObj.rightValue = optsObj.divWH.width - optsObj.btnWH.height - optsObj.topH - 2;
    var fontStyleVal = '';
    var onStyleVal = 'left:' + (btnWH.height / 2 + topH) + 'px';
    var offStyleVal = 'right:' + (btnWH.height / 2 - btnWH.height / 4 + topH) + 'px;width:' + btnWH.height / 2 + 'px;height:' + btnWH.height / 2 + 'px;';
    var btnStyleVal = 'width:' + btnWH.height + 'px;height:' + btnWH.height + 'px;border-radius:50%;' + 'top:' + topH + 'px;';
    if (!optsObj.value) {
      btnStyleVal += 'left:' + topH + 'px';
    } else {
      divStyleVal += 'background:#1b88ee;';
      btnStyleVal += 'left:' + optsObj.rightValue + 'px';
    }
    var tmpData = {
      state: optsObj.state,
      switchesStyle: divStyleVal,
      btnStyle: btnStyleVal,
      fontStyle: fontStyleVal,
      onStyle: onStyleVal,
      offStyle: offStyleVal
    };
    var templHTML = optsObj.templ(tmpData);
    optsObj.$domObj.html(templHTML);
  };
  /**
   * 调整 宽高 . <br/>
   * 
   */
  Switches.prototype.reSize = function () {
    console.log(' %c [Switches] -> reSize!', 'background: skyblue');
    var optsObj = this.opts;
    // 按钮背景框宽高.
    var divWH = {
      width: optsObj.$domObj.width() || 0,
      height: optsObj.$domObj.height() || 0
    };
    var divStyleVal = 'width:' + divWH.width + 'px;height:' + divWH.height + 'px;border-radius:' + divWH.height + 'px;';
    // 圆按钮宽高.
    var topH = Math.floor(divWH.height / 10);
    var btnWH = { height: divWH.height - topH * 2 - 2 };
    //把按钮信息存下来
    optsObj.topH = topH;
    optsObj.btnWH = btnWH;
    optsObj.divWH = divWH;
    //按钮为开时距离左边的距离
    optsObj.rightValue = optsObj.divWH.width - optsObj.btnWH.height - optsObj.topH - 2;
    var fontStyleVal = '';
    var onStyleVal = 'left:' + (btnWH.height / 2 + topH) + 'px';
    var offStyleVal = 'right:' + (btnWH.height / 2 - btnWH.height / 4 + topH) + 'px;width:' + btnWH.height / 2 + 'px;height:' + btnWH.height / 2 + 'px;';
    var btnStyleVal = 'width:' + btnWH.height + 'px;height:' + btnWH.height + 'px;border-radius:50%;' + 'top:' + topH + 'px;';
    if (!optsObj.value) {
      btnStyleVal += 'left:' + topH + 'px';
    } else {
      divStyleVal += 'background:#1b88ee;';
      btnStyleVal += 'left:' + optsObj.rightValue + 'px';
    }
    optsObj.$domObj.find('.read-reader-switch').attr('style', divStyleVal);
    optsObj.$domObj.find('.read-switch-cursor').attr('style', btnStyleVal);
    optsObj.$domObj.find('.read-switch-label-on').attr('style', onStyleVal);
    optsObj.$domObj.find('.read-switch-label-off').attr('style', offStyleVal);
  };
  /**
   * 开关按钮绑定事件. <br/>
   * ps: "change:click".
   * 
   */
  Switches.prototype._bindEvent = function () {
    var that = this;
    var optsObj = that.opts;
    var eventName = optsObj.isMobile ? 'tap' : 'click';
    optsObj.$domObj.on(eventName, '.read-reader-switch', function (event) {
      that.changeState();
    });
  };
  /**
   * 获取当前开关值. <br/>
   * 
   */
  Switches.prototype.getValue = function () {
    return this.opts.value;
  };
  /**
   * 获取 DOM对象 (jQuery 格式). <br/>
   * 
   */
  Switches.prototype.getDomObj = function () {
    return this.opts.$domObj;
  };
  /**
   * 切换开关状态. <br/> 
   * 
   * @author gli-gong-20160824
   * 
   */
  Switches.prototype.changeState = function () {
    var that = this;
    var optsObj = that.opts;
    if (!optsObj.value) {
      move(optsObj.$domObj.find('.read-reader-switch')[0]).set('background', '#1b88ee').duration('0.15s').end();
      move(optsObj.$domObj.find('.read-switch-cursor')[0]).set('left', optsObj.rightValue + 'px').duration('0.15s').end();
    } else {
      move(optsObj.$domObj.find('.read-reader-switch')[0]).set('background', '').duration('0.15s').end();
      move(optsObj.$domObj.find('.read-switch-cursor')[0]).set('left', optsObj.topH + 'px').duration('0.15s').end();
    }
    optsObj.value = !optsObj.value;
    console.log('[执行切换]' + optsObj.value);
    optsObj.$domObj.trigger('change:click', optsObj.value);
  };
  /**
   * 注册 自定义 监听事件. <br/>
   * 
   * @param eventName {String}   事件名称, "change:click";
   * @param cb        {Function} 回调事件
   * 
   */
  Switches.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  return Switches;
}(js_src_global, js_libs_zeptodev, move);
js_src_widget_plugDrag = function (window, $) {
  // zepto
  //  var $ = window.Zepto;
  // underscore
  var _ = window._;
  /**
   * 插件 拖拽进度. <br/>
   * 
   * @param {Object} options
   * 
   */
  var Drag = function (options) {
    console.log('[Drag] -> 构造函数!');
    // html模板
    var tmplHtml = '<div class="read-drag-bar" style="<%= dragStyle %>">' + '<div class="read-drag-percent" style="<%= percentStyle %>">' + '<div class="read-drag-btn" style="<%= btnStyle %>"></div>' + '</div>' + '</div>';
    var defaults = {
      domSelector: '',
      $domObj: null,
      dragColor: '',
      // 拖动背景颜色
      percentColor: '',
      //拖动前面选中的颜色
      btnColor: '',
      // 圆按钮背景颜色
      btnBorderColor: '',
      // 圆按钮边框颜色
      state: false,
      // 禁止拖动
      value: 0,
      // 默认拖动了0 百分比
      isMobile: true,
      // underscore 
      templ: _.template(tmplHtml),
      initX: 0
    };
    // 合并
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化 拖动. <br/>
   * 
   */
  Drag.prototype._init = function () {
    var optsObj = this.opts;
    optsObj.$domObj = $(optsObj.domSelector);
    if (!this._check()) {
      return false;
    }
    this._setLayout();
    this._bindEvent();
  };
  /**
   * 传入数据 合法性验证. <br/>
   * 
   * @return checkVal {Boolean} true: 合法, false: 非法。
   */
  Drag.prototype._check = function () {
    var optsObj = this.opts;
    var checkVal = true;
    if (optsObj.$domObj.length === 0) {
      console.warn('[Drag]: 请传入合法 dom 选择器!');
      checkVal = false;
    }
    return checkVal;
  };
  /**
   * 设置 开关按钮布局. <br/>
   * 
   */
  Drag.prototype._setLayout = function () {
    var optsObj = this.opts;
    optsObj.$domObj = $(optsObj.domSelector);
    // 背景框宽高.
    var divWH = {
      width: optsObj.$domObj.width() || 0,
      height: optsObj.$domObj.height() || 0
    };
    //按钮高
    var btnH = divWH.height;
    //默认的拖动距离
    var defaultPercent = divWH.width * parseInt(optsObj.value);
    var dragStyleVal = 'background-color:' + optsObj.dragColor + ';';
    var percentStyleVal = 'width:' + defaultPercent + 'px;background-color:' + optsObj.percentColor + ';';
    var btnStyleVal = 'width:' + btnH + 'px;height:' + btnH + 'px;background-color:' + optsObj.btnColor + ';border-color:' + optsObj.btnBorderColor + ';left:' + defaultPercent + 'px;';
    var tmpData = {
      dragStyle: dragStyleVal,
      percentStyle: percentStyleVal,
      btnStyle: btnStyleVal
    };
    var templHTML = optsObj.templ(tmpData);
    optsObj.$domObj.html(templHTML);
  };
  /**
   * 调整 宽高 . <br/>
   * 
   */
  Drag.prototype.reSize = function () {
    console.log(' %c [Drag] -> reSize!', 'background: skyblue');
    var optsObj = this.opts;
    // 拖动容器 宽高.
    var divWH = {
      width: optsObj.$domObj.width() || 0,
      height: optsObj.$domObj.height() || 0
    };
    // 按钮高. 
    var btnH = divWH.height;
    // 能移动的最大距离
    optsObj.canDragWidth = optsObj.$domObj.width() - btnH;
    var defaultPercent = divWH.width * parseFloat(optsObj.value);
    var percentStyleVal = 'width:' + defaultPercent + 'px;background-color:' + optsObj.percentColor + ';';
    var btnStyleVal = 'width:' + btnH + 'px;height:' + btnH + 'px;background-color:' + optsObj.btnColor + ';border-color:' + optsObj.btnBorderColor + ';left:' + defaultPercent + 'px;';
    optsObj.$domObj.find('.read-drag-percent').attr('style', percentStyleVal);
    optsObj.$domObj.find('.read-drag-btn').attr('style', btnStyleVal);
  };
  /**
   * 开关按钮绑定事件. <br/>
   * 
   */
  Drag.prototype._bindEvent = function () {
    var that = this;
    var optsObj = that.opts;
    var eventName = optsObj.isMobile ? 'touchstart' : 'mousedown';
    optsObj.$domObj.on(eventName, '.read-drag-btn', function (event) {
      event.stopPropagation();
      var self = this;
      optsObj.state = true;
      optsObj.initX = event.clientX || event.touches[0].clientX;
      // 圆按钮距离左侧的距离
      optsObj.left = $(self).css('left');
      // 选中的宽度
      optsObj.width = $(self).parent().width();
      function endDrag() {
        if (!!optsObj.state) {
          $(self).trigger('dragEnd', optsObj.value);
        }
        optsObj.state = false;
      }
      function moveDrag(e) {
        if (!!optsObj.state) {
          var x = e.clientX || e.touches[0].clientX;
          // x方向移动的差值
          var DeltaX = x - optsObj.initX;
          // 在能移动范围内
          if (DeltaX + optsObj.width <= optsObj.canDragWidth && DeltaX + optsObj.width >= 0) {
            $(self).parent().width(optsObj.width + DeltaX);
            $(self).css('left', parseInt(optsObj.left) + DeltaX);
          } else if (DeltaX + optsObj.width > optsObj.canDragWidth) {
            $(self).parent().width(optsObj.canDragWidth);
            $(self).css('left', optsObj.canDragWidth);
          } else if (DeltaX + optsObj.width < 0) {
            $(self).parent().width(0);
            $(self).css('left', 0);
          }
          //返回百分比
          optsObj.value = ($(self).parent().width() / optsObj.canDragWidth).toFixed(4);
          $(self).trigger('dragMove', optsObj.value);
        }
      }
      if (eventName == 'touchstart') {
        document.ontouchend = function () {
          endDrag();
        };
        document.ontouchmove = function (event) {
          moveDrag(event);
        };
      } else {
        document.onmouseup = function () {
          endDrag();
        };
        document.onmousemove = function (event) {
          moveDrag(event);
        };
      }
    });
  };
  /**
   * 获取当前开关值. <br/>
   * 
   */
  Drag.prototype.getValue = function () {
    return this.opts.value;
  };
  /**
   * 设置当前开关值. <br/>
   * 
   * @param {Number} val 取值范围 [0 - 1]
   * 
   */
  Drag.prototype.setValue = function (val) {
    var that = this;
    var optsObj = that.opts;
    if (!!val && val >= 0) {
      val = val >= 1 ? 1 : val;
      var left = optsObj.canDragWidth * val;
      optsObj.$domObj.find('.read-drag-percent').width(left);
      optsObj.$domObj.find('.read-drag-btn').css('left', left);
    }
  };
  /**
   * 设置已拖动部分的颜色
   * 
   * @param {String} color 如: "yellow" OR "#ffffff" 等...
   */
  Drag.prototype.setColor = function (color) {
    var optsObj = this.opts;
    optsObj.$domObj.find('.read-drag-percent').css('background', color);
  };
  /**
   * 获取 DOM对象 (jQuery 格式). <br/>
   * 
   */
  Drag.prototype.getDomObj = function () {
    return this.opts.$domObj;
  };
  /**
   * 注册 自定义 监听事件. <br/>
   * 
   * @param eventName {String}   事件名称, "change:click";
   * @param cb        {Function} 回调事件
   * 
   */
  Drag.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  /**
   * 设置拖动条 不可用.<br/>
   * 
   */
  Drag.prototype.disabled = function () {
    var optsObj = this.opts;
    optsObj.$domObj.find('.read-drag-percent').addClass('read-disabled');
  };
  /**
   * 设置拖动条 可用.<br/>
   * 
   */
  Drag.prototype.enable = function () {
    var optsObj = this.opts;
    optsObj.$domObj.find('.read-drag-percent').removeClass('read-disabled');
  };
  return Drag;
}(js_src_global, js_libs_zeptodev);
js_src_panelSetting = function (window, radioGroup, switches, drag, move, $) {
  //  var $ = window.Zepto;
  var _ = window._;
  var SettingPanel = function (options) {
    var defaults = {
      wrapDomId: '',
      $readerObj: null,
      templHtml: '',
      // 参数设置 主模板
      fontlightHtml: '',
      // 字体/亮度 面板
      progressHtml: '',
      // 字体/亮度 面板
      $domObj: null,
      $headerObj: null,
      $footerObj: null,
      $bodyObj: null,
      $fontlight: null,
      $progress: null,
      isMobile: true,
      isNightMode: null,
      // 屏幕亮度, 系统亮度, 字体大小, 翻页方式, 字体类型, 背景颜色, 屏幕长亮;
      settingData: null,
      // 阅读进度.
      progressData: null,
      // 设置面板页数
      settingPage: 2
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  SettingPanel.prototype._init = function () {
    console.log('[SettingPanel] --> _init');
    this._renderLayout();
    this._bindEvent();
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  SettingPanel.prototype._renderLayout = function () {
    var optsObj = this.opts;
    // 利用 模板 生成HTML
    var templObj = _.template(optsObj.templHtml);
    var panelHtml = templObj();
    // 转化 zepto 对象;
    optsObj.$domObj = $(panelHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
    optsObj.$headerObj = optsObj.$domObj.find('.read-header');
    optsObj.$footerObj = optsObj.$domObj.find('.read-footer');
    var headerTopVal = optsObj.$headerObj.css('top');
    var footerBottomVal = optsObj.$footerObj.css('bottom');
    // 保存 header, footer 原始值. 动画还原.
    optsObj.$headerObj.attr('data-top', headerTopVal);
    optsObj.$footerObj.attr('data-bottom', footerBottomVal);
    // 进度设置面板 
    this._renderProgress();
    // 字体设置面板
    this._renderFontlight();
  };
  /**
   * 渲染 进度设置面板 布局. <br/>
   * 
   */
  SettingPanel.prototype._renderProgress = function () {
    var optsObj = this.opts;
    var progressTemplObj = _.template(optsObj.progressHtml);
    var progressHtml = progressTemplObj();
    optsObj.$footerObj.append(progressHtml);
    optsObj.$progress = optsObj.$footerObj.find('.read-schedule-set-panel');
    console.info('%c 阅读进度!!:' + optsObj.progressData, 'background:yellow;');
    // 阅读进度 gli-hxy-20160809
    var $progressWrap = optsObj.$progress.find('.read-progress-bar');
    this.$progressObj = new drag({
      'domSelector': $progressWrap,
      'value': optsObj.progressData || 0,
      'isMobile': optsObj.isMobile
    });
    // 拖动定位页码.
    optsObj.$progress.on('dragEnd', function (e, data) {
      optsObj.$domObj.trigger('progress:click', data);
    });
  };
  /**
   * 渲染 字体设置面板 布局.  <br/>
   * 
   */
  SettingPanel.prototype._renderFontlight = function () {
    var optsObj = this.opts;
    var tmpSettingData = optsObj.settingData;
    // TODO --gognlong
    var fontlightTemplObj = _.template(optsObj.fontlightHtml);
    var fontlightHtml = fontlightTemplObj();
    optsObj.$footerObj.append(fontlightHtml);
    optsObj.$fontlight = optsObj.$footerObj.find('.read-font-set-panel');
    // 屏幕亮度 - 自调节-拖动 gli-hxy-20160808
    var $systemLightbarWrap = optsObj.$fontlight.find('.read-light-bar');
    this.$systemLightbarObj = new drag({
      'domSelector': $systemLightbarWrap,
      'value': tmpSettingData.brightness,
      'isMobile': optsObj.isMobile
    });
    // 屏幕亮度 - 系统亮度.
    var $systemLightWrap = optsObj.$fontlight.find('.read-system-light');
    this.$systemLightObj = new switches({
      'domSelector': $systemLightWrap,
      // 'data': [false, true],
      'value': tmpSettingData.useSysBrightness,
      'isMobile': optsObj.isMobile
    });
    // 屏幕长亮.
    // @author gli-hxy-20160808
    var $screenLightWrap = optsObj.$fontlight.find('.read-screen-always-bright .read-turn-off-on');
    this.$screenLightObj = new switches({
      'domSelector': $screenLightWrap,
      // 'data': ['close', 'open'],
      'value': tmpSettingData.screenLongActive,
      'isMobile': optsObj.isMobile
    });
    // 字体大小.
    var $fontSizeWrap = optsObj.$fontlight.find('.read-font-size');
    this.$fontSizeObj = new radioGroup({
      '$domObj': $fontSizeWrap,
      'data': tmpSettingData.fontSize.list,
      'value': tmpSettingData.fontSize.value,
      'isMobile': optsObj.isMobile
    });
    // 翻页方式
    var $pagingWrap = optsObj.$fontlight.find('.read-turn-page');
    this.$pagingObj = new radioGroup({
      'type': 'oval',
      '$domObj': $pagingWrap,
      'data': [
        {
          'text': '平铺翻页',
          // tile
          'value': 'page_1'
        },
        {
          'text': '无',
          // simulation
          'value': 'page_2'
        }
      ],
      'value': 'page_1',
      'isMobile': optsObj.isMobile
    });
    // 字体类型
    var $fontFamilyWrap = optsObj.$fontlight.find('.read-font-family-view');
    this.$fontFamilyObj = new radioGroup({
      'type': 'oval',
      '$domObj': $fontFamilyWrap,
      'data': tmpSettingData.fontFamily.list,
      'value': tmpSettingData.fontFamily.value
    });
    // 背景颜色
    var $bgColorWrap = optsObj.$fontlight.find('.read-bg-color');
    this.$bgColorObj = new radioGroup({
      'type': 'round',
      '$domObj': $bgColorWrap,
      'data': tmpSettingData.bgColor.list,
      'value': tmpSettingData.bgColor.value
    });
    innerSetDisplay();
    // 根据开关设置是否显示
    function innerSetDisplay() {
      if (!optsObj.useComplaint) {
        optsObj.$domObj.find('.read-header .read-copyright').css('display', 'none');
      }
      if (!optsObj.useSearch) {
        optsObj.$domObj.find('.read-header .read-search').css('display', 'none');
      }
      if (!optsObj.useExit) {
        optsObj.$domObj.find('.read-exit-reader').hide();
      }
      if (!optsObj.useFonts) {
        $fontSizeWrap.parents('.read-setting-bar').hide();
        $fontFamilyWrap.parents('.read-setting-bar').hide();
      }
      if (!optsObj.useBgColor) {
        $bgColorWrap.parents('.read-setting-bar').hide();
      }
      if (!optsObj.useLight) {
        $systemLightWrap.parents('.read-setting-bar').hide();
        $screenLightWrap.parents('.read-setting-bar').hide();
        optsObj.$domObj.find('.read-footer .read-speed-night').hide();
      }
      if (!optsObj.usePageWay) {
        $pagingWrap.parents('.read-setting-bar').hide();
      }
      var $page1 = [];
      var $page2 = [];
      var showNum = 0;
      optsObj.$fontlight.find('.read-setting-bar').each(function () {
        if ($(this).css('display') != 'none') {
          $page1.push($(this));
        } else {
          $page2.push($(this));
        }
      });
      showNum = $page1.length;
      for (var i = 0, len = $page2.length; i < len; i++) {
        $page1.push($page2[i]);
      }
      for (var i = $page1.length - 1; i >= 0; i--) {
        if (i < 3) {
          optsObj.$fontlight.find('.read-set-page1').prepend($page1[i]);
        } else {
          optsObj.$fontlight.find('.read-set-page2').prepend($page1[i]);
        }
      }
      if (showNum == 0) {
        optsObj.$footerObj.find('.read-font-btn').hide();
      } else if (showNum < 4) {
        optsObj.settingPage = 1;
        optsObj.$fontlight.find('.read-set-page2').hide();
        optsObj.$fontlight.find('.read-set-page1 .read-turn-page-icon').hide();
      }
    }
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  SettingPanel.prototype._bindEvent = function () {
    var optsObj = this.opts;
    var that = this;
    // 确定事件类型.
    var eventType = optsObj.isMobile ? 'tap' : 'click';
    // 隐藏面板
    optsObj.$domObj.find('.read-body').on(eventType, function () {
      that.close();
    });
    // 返回
    optsObj.$domObj.find('.read-exit-reader').on(eventType, function () {
      that.close();
      optsObj.$domObj.trigger('out:click');
    });
    // 目录, 书签, 笔记.
    optsObj.$footerObj.find('.read-cbn-btn').on(eventType, function () {
      optsObj.$domObj.trigger('cbn:click');
      that.close();
    });
    // 打开版权投诉
    optsObj.$domObj.find('.read-header .read-copyright').on(eventType, function () {
      optsObj.$domObj.trigger('complaint:click');
      that.close();
    });
    // 打开搜索面板
    optsObj.$domObj.find('.read-header .read-search').on(eventType, function () {
      optsObj.$domObj.trigger('search:click');
      that.close();
    });
    // 章节向前翻.
    optsObj.$footerObj.find('.read-prev').on(eventType, function () {
      optsObj.$domObj.trigger('progress:prev');
    });
    // 章节向后翻.
    optsObj.$footerObj.find('.read-next').on(eventType, function () {
      optsObj.$domObj.trigger('progress:next');
    });
    // 拖动定位页码组件.
    optsObj.$footerObj.find('.read-progress-btn').on(eventType, function () {
      $(this).addClass('read-active').siblings().removeClass('read-active');
      that._hideChildPanel(optsObj.$fontlight);
      that._showChildPanel(optsObj.$progress);
      optsObj.$domObj.trigger('progress:setVal');
    });
    //      // 拖动定位页码.
    //      optsObj.$progress.on('dragEnd', function(e, data) {
    //          
    //          optsObj.$domObj.trigger('progress:click', data);
    //          
    //      });
    // 设置-字体, 亮度 等.
    optsObj.$footerObj.find('.read-font-btn').on(eventType, function () {
      $(this).addClass('read-active').siblings().removeClass('read-active');
      that._hideChildPanel(optsObj.$progress);
      that._showChildPanel(optsObj.$fontlight);
    });
    // 屏幕亮度, dragMove
    this.$systemLightbarObj.on('dragMove', function (e, param) {
      console.info('[panelSetting.js] -> dragMove:' + param);
      that._setScreenBrightness(parseFloat(param));
      that.$systemLightbarObj.enable();
    });
    this.$systemLightbarObj.on('dragEnd', function (e, param) {
      console.info('[panelSetting.js] -> dragEnd:' + param);
      if (that.$systemLightObj.getValue()) {
        that.$systemLightObj.changeState();
      }
    });
    // 系统亮度
    this.$systemLightObj.on('change:click', function (event, param) {
      if (param) {
        that.$systemLightbarObj.disabled();
        that._useSysBrightness();
      } else {
        that.$systemLightbarObj.enable();
        that._setScreenBrightness(that.$systemLightbarObj.getValue());
      }
    });
    // 设置翻页方式
    this.$pagingObj.on('change:click', function (event, param) {
      console.log(' %c 设置翻页方式! ' + param, 'color:green');
      optsObj.$domObj.trigger('pageway:click', param);
    });
    // 字体大小.
    this.$fontSizeObj.on('change:click', function (e, param) {
      optsObj.$domObj.trigger('size:click', param);
    });
    // 字体类型
    this.$fontFamilyObj.on('change:click', function (e, param) {
      optsObj.$domObj.trigger('family:click', param);
    });
    // 背景颜色
    this.$bgColorObj.on('change:click', function (e, param) {
      optsObj.isNightMode = false;
      optsObj.$domObj.trigger('bgcolor:click', param);
    });
    // 屏幕长亮
    this.$screenLightObj.on('change:click', function (e, param) {
      gli_set_keepscreenon(param);
      // 修改开关文字样式
      var alwaysBright = optsObj.$domObj.find('.read-footer .read-set-page2 .read-screen-always-bright');
      if (param) {
        alwaysBright.find('read-.font.read-lf').addClass('read-active');
        alwaysBright.find('.read-font.read-rt').removeClass('read-active');
      } else {
        alwaysBright.find('.read-font.read-lf').removeClass('read-active');
        alwaysBright.find('.read-font.read-rt').addClass('read-active');
      }
    });
    // 夜间模式  
    // add by gli-hxy-20160913
    optsObj.$domObj.find('.read-footer .read-speed-night').on(eventType, function () {
      optsObj.isNightMode = !optsObj.isNightMode;
      optsObj.$domObj.trigger('night:click', optsObj.isNightMode);
    });
    // 字体/亮度 左滑 手机.
    optsObj.$fontlight.on('swipeLeft', function (e) {
      // 面板有2页才能滑动
      if (optsObj.settingPage > 1) {
        console.log(' %c swipeleft! ', 'color:green');
        innerSwipeFontlight('-100%');  // move(optsObj.$fontlight[0]).set("left", "-100%").duration("0.5s").end();
      }
    });
    // 字体/亮度 右滑 手机.
    optsObj.$fontlight.on('swipeRight', function (e) {
      // 面板有2页才能滑动
      if (optsObj.settingPage > 1) {
        console.log(' %c swiperight! ', 'color:green');
        innerSwipeFontlight('0');  // move(optsObj.$fontlight[0]).set("left", "0").duration("0.5s").end();
      }
    });
    /**
     * 滑动 字体颜色 设置面板.
     * 
     * @param leftVal {String} e.g. "0" OR "-100%"
     * 
     */
    function innerSwipeFontlight(leftVal) {
      move(optsObj.$fontlight[0]).set('left', leftVal).duration('0.5s').end();
    }
  };
  /**
   * 设置快速翻页章节信息. <br/>
   * 
   * @param {Array} data {
   *          'name':         //chaptName, 章节名
   *          'currIndex':    //optsObj.chapt_index + 1, 
   *          'total':        //chaptTotal 总章节数
   *      }
   * 
   * @author gli-jiangxq 20160811
   */
  SettingPanel.prototype.setProgressVal = function (data) {
    var optsObj = this.opts;
    var prev = data.currIndex - 1;
    var next = data.total - data.currIndex;
    if (prev === 0) {
      prev = '无';
    }
    if (next === 0) {
      prev = '无';
    }
    if (data.turnMode) {
      this.$progressObj.setValue(data.val);
    }
    optsObj.$footerObj.find('.read-prev-chapter').html(prev);
    optsObj.$footerObj.find('.read-next-chapter').html(next);
    optsObj.$footerObj.find('.read-chapt-title').html(data.name);
    optsObj.$footerObj.find('.read-chapt-current').html(data.currIndex);
    optsObj.$footerObj.find('.read-chapt-total').html(data.total);
  };
  /**
   * 设置长亮进度条的颜色. <br/>
   * 
   * @param {String} color 如: "yellow" OR "#ffffff".
   * 
   * @author gli-hxy 20160818
   */
  SettingPanel.prototype.setColor = function (color) {
    this.$systemLightbarObj.setColor(color);
  };
  /**
   * 显示 子面板 -- "进度设置面板", "字体/亮度 设置面板". <br/>
   * 
   * @param panelObj {Object} 面板对象. 如: $progress, $fontlight;
   * 
   */
  SettingPanel.prototype._showChildPanel = function (panelObj) {
    var optsObj = this.opts;
    move(panelObj[0]).set('top', -panelObj.height() + 'px').duration('0.5s').end();
  };
  /**
   * 隐藏 子面板 -- "进度设置面板", "字体/亮度 设置面板". <br/>
   * 
   * @param panelObj {Object} 面板对象. 如: $progress, $fontlight;
   * 
   */
  SettingPanel.prototype._hideChildPanel = function (panelObj) {
    var optsObj = this.opts;
    move(panelObj[0]).set('top', '0').duration('0.5s').end();
  };
  /**
   * 获取面板对象. <br/>
   * 
   */
  SettingPanel.prototype.getPanelObject = function () {
  };
  /**
   * 注册 自定义 监听事件. <br/>
   * 
   * @param eventName {String}   事件名称, 
   *                  "cbn:click", "progress:click", "close:click", 
   *                  "family:click", "size:click", "progress:prev", "progress:next"
   * 
   * @param cb        {Function} 回调事件
   * 
   */
  SettingPanel.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  /**
   * 打开面板. <br/>
   * 
   */
  SettingPanel.prototype.open = function () {
    console.log('[SettingPanel] --> open');
    var optsObj = this.opts;
    optsObj.$domObj.fadeIn(200);
    // 显示 面板
    move(optsObj.wrapDomId + ' .read-setting-panel  .read-header').set('top', '0').duration('0.3s').end();
    move(optsObj.wrapDomId + ' .read-setting-panel  .read-footer').set('bottom', '0').duration('0.3s').end();
    optsObj.$footerObj.find('.read-set-btn').children().each(function () {
      $(this).removeClass('read-active');
    });
    this.$fontSizeObj.reSize();
    this.$pagingObj.reSize();
    this.$fontFamilyObj.reSize();
    this.$bgColorObj.reSize();
    this.$systemLightbarObj.reSize();
    this.$progressObj.reSize();
    this.$screenLightObj.reSize();
    this.$systemLightObj.reSize();
  };
  /**
   * 关闭面板. <br/>
   * 
   */
  SettingPanel.prototype.close = function () {
    var optsObj = this.opts;
    var headerTopVal = optsObj.$headerObj.attr('data-top');
    var footerBottomVal = optsObj.$footerObj.attr('data-bottom');
    // 隐藏 面板
    move(optsObj.wrapDomId + ' .read-setting-panel .read-header').set('top', headerTopVal).duration('0.3s').end();
    move(optsObj.wrapDomId + ' .read-setting-panel .read-footer').set('bottom', footerBottomVal).duration('0.3s').end();
    setTimeout(function () {
      optsObj.$domObj.fadeOut(10);
    }, 300);
    this._hideChildPanel(optsObj.$progress);
    this._hideChildPanel(optsObj.$fontlight);
    optsObj.$domObj.trigger('close:click');
  };
  /**
   * 获取 设置面板相应参数. <br/>
   * ps: 不包括 阅读进度.
   * 
   */
  SettingPanel.prototype.getSettingData = function () {
    var optsObj = this.opts;
    var tmpData = optsObj.settingData;
    // 屏幕亮度
    tmpData.brightness = this.$systemLightbarObj.getValue();
    // 系统亮度
    tmpData.useSysBrightness = this.$systemLightObj.getValue();
    // 屏幕长亮.
    tmpData.screenLongActive = this.$screenLightObj.getValue();
    // 字体大小
    tmpData.fontSize.value = this.$fontSizeObj.getValue();
    // 翻页方式
    tmpData.pagingType.value = this.$pagingObj.getValue();
    // 字体类型
    tmpData.fontFamily.value = this.$fontFamilyObj.getValue();
    // 背景颜色
    tmpData.bgColor.value = this.$bgColorObj.getValue();
    // 夜间模式
    tmpData.isNightMode = optsObj.isNightMode;
    return tmpData;
  };
  /**
   * 设置屏幕亮度.<br/>
   * 
   * @param {Number} brightnessVal 屏幕亮度值 (ps: 范围 [0 - 1])
   * 
   */
  SettingPanel.prototype._setScreenBrightness = function (brightnessVal) {
    var MIX = 0.3;
    var RANGE = 0.7;
    var tmpVal = MIX + brightnessVal * RANGE;
    tmpVal = parseFloat(tmpVal.toFixed(2));
    if (typeof gli_set_brightness == 'function') {
      gli_set_brightness(tmpVal);
    }
  };
  /**
   * 使用 系统亮度.<br/>
   * 
   */
  SettingPanel.prototype._useSysBrightness = function () {
    var that = this;
    if (typeof gli_get_brightness == 'function') {
      gli_get_brightness(function (val) {
        that._setScreenBrightness(val);
      });
    }
  };
  return SettingPanel;
}(js_src_global, js_src_widget_plugRadioGroup, js_src_widget_plugSwitches, js_src_widget_plugDrag, move, js_libs_zeptodev);
js_src_catalog = function (window, $) {
  var _ = window._;
  var Catalog = function (options) {
    var defaults = {
      wrapObj: null,
      tmplHtml: '',
      isMobile: true,
      data: null
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  Catalog.prototype._init = function () {
    var optsObj = this.opts;
    optsObj.templObj = _.template(optsObj.tmplHtml);
    this._bindEvent();
  };
  /**
   * 事件委托 绑定事件.<br/>
   * ps: catalog:click;
   * 
   */
  Catalog.prototype._bindEvent = function () {
    var optsObj = this.opts;
    var eventName = optsObj.isMobile ? 'tap' : 'click';
    optsObj.wrapObj.on(eventName, 'li', function () {
      optsObj.wrapObj.trigger('catalog:click', {
        id: $(this).attr('data-id'),
        status: $(this).attr('data-status')
      });
    });
  };
  /**
   * 渲染目录 <br>.
   * 
   * @param {Object} data 目录数据
   */
  Catalog.prototype.renderLayout = function (data) {
    var optsObj = this.opts;
    var txtlen = 0;
    var chapt = data.chapter;
    for (var i = 0, len = chapt.length; i < len; i++) {
      txtlen += chapt[i].textlen;
      chapt[i].textlen = txtlen;
    }
    var tempHtml = optsObj.templObj(data);
    optsObj.wrapObj.html(tempHtml);
  };
  return Catalog;
}(js_src_global, js_libs_zeptodev);
js_src_widget_plugDialog = function (window, $) {
  var Dialog = function (options) {
    var defaults = {
      $wrapDomObj: null,
      isMobile: true,
      // 提示信息.
      msg: '这是对话框\uFF0C请确认你的操作!',
      okBtn: {
        txt: '确认',
        cssClass: '',
        func: function () {
          console.log('[plugDialog] -> OK!');
        }
      },
      cancelBtn: {
        txt: '取消',
        cssClass: '',
        func: function () {
          console.log('[plugDialog] -> Cancel!');
        }
      }
    };
    this.opts = $.extend(true, {}, defaults, options);
    // "对话框"对象 不可传入!
    this.$dialogDomObj = null;
    this.$msgObj = null;
    this.$okBtnObj = null;
    this.$cacelBtnObj = null;
    this._init();
  };
  /**
   * 初始化. <br/> 
   * 
   */
  Dialog.prototype._init = function () {
    this._renderLayout();
    this._bindEvent();
  };
  /**
   * 渲染布局. <br/> 
   * 
   */
  Dialog.prototype._renderLayout = function () {
    var optsObj = this.opts;
    var tmplHtml = '';
    tmplHtml += '<div class=\'read-dialog-main\'>';
    tmplHtml += '<div class=\'read-msg-content\'></div>';
    tmplHtml += '<div class=\'read-btns\'>';
    tmplHtml += '<div class=\'read-item read-ok-btn\'>OK</div>';
    tmplHtml += '<div class=\'read-item read-cancel-btn\'>CANCEL</div>';
    tmplHtml += '</div>';
    tmplHtml += '</div>';
    if (optsObj.clientType == 'MOBILE') {
      this.$dialogDomObj = $('<div class=\'read-reader-dialog-mask\'>');
    } else {
      this.$dialogDomObj = $('<div class=\'read-reader-dialog-mask read-pc-dialog\'>');
    }
    this.$dialogDomObj.html(tmplHtml);
    this.$msgObj = this.$dialogDomObj.find('.read-msg-content');
    this.$okBtnObj = this.$dialogDomObj.find('.read-ok-btn');
    this.$cacelBtnObj = this.$dialogDomObj.find('.read-cancel-btn');
    // 根据传入参数设置 提示信息, 按钮文字;
    this.$msgObj.html(optsObj.msg);
    this.$okBtnObj.html(optsObj.okBtn.txt);
    this.$cacelBtnObj.html(optsObj.cancelBtn.txt);
    optsObj.$wrapDomObj.append(this.$dialogDomObj);  //      this.$dialogDomObj.hide(1);
  };
  /**
   * 绑定事件. <br/> 
   * 
   */
  Dialog.prototype._bindEvent = function () {
    var that = this;
    var optsObj = this.opts;
    // isMobile
    var eventName = optsObj.isMobile ? 'tap' : 'click';
    this.$okBtnObj.on(eventName, function () {
      that.close();
      optsObj.okBtn.func();
    });
    this.$cacelBtnObj.on(eventName, function () {
      that.close();
      optsObj.cancelBtn.func();
    });
  };
  /**
   * 调整样式, 居中. <br/> 
   * 
   */
  Dialog.prototype._resize = function () {
    console.log('[plugDialog.js] -> _resize:');
  };
  /**
   * 设置 提示信息. <br/> 
   * 
   * @param {String} msgTxt 信息内容
   * 
   */
  Dialog.prototype.setMsg = function (msgTxt) {
    this.$msgObj.html(msgTxt);
  };
  /**
   * 打开 对话框. <br/> 
   * 
   */
  Dialog.prototype.open = function () {
    var optsObj = this.opts;
    console.log('[plugDialog.js] -> open');
    this._resize();
    this.$dialogDomObj.show(200);
  };
  /**
   * 关闭 对话框. <br/> 
   * 
   */
  Dialog.prototype.close = function () {
    var optsObj = this.opts;
    console.log('[plugDialog.js] -> close');
    this.$dialogDomObj.hide(300);
  };
  /**
   * 销毁 对话框. <br/> 
   * 
   */
  Dialog.prototype.destroy = function () {
    // 取消绑定事件
    this.$okBtnObj.off();
    this.$cacelBtnObj.off();
    // 移除HTML 标签.
    this.$dialogDomObj.remove();
  };
  return Dialog;
}(js_src_global, js_libs_zeptodev);
js_src_message_zh = {
  loading: '加载中...',
  downloadBooks: '书籍下载中...',
  chapterFalse: '获取章节失败\uFF01\uFF01',
  copyRunOut: '可复制次数已用完',
  copyStill: '复制字数超长,还能复制',
  firstPage: '已经是第一页了',
  lastPage: '已经是最后一页了',
  testReadOver: '试读结束,请购买',
  compCancel: '取消后投诉信息将不会保存',
  dealWith: '处理中',
  compSucess: '发送成功\uFF01\uFF01我们会尽快处理\uFF01',
  sendError: '发送失败\uFF01\uFF01请检查你的网络\uFF01',
  inputContent: '请输入内容',
  nowSearch: '正在搜索,请等待',
  emptySearch: '搜索结果为空\uFF01',
  noteCancel: '取消后笔记信息将不会保存',
  noteSucess: '笔记保存成功',
  noteError: '您选择的内容已经有笔记或者划线',
  noteFail: '笔记保存失败',
  noteDelFail: '笔记删除失败',
  bookMarkFail: '书签保存失败',
  bookMarkDelFail: '书签删除失败',
  correctCancel: '取消后纠错信息将不会保存',
  correctSucess: '感谢您的纠正',
  correctError: '请您输入纠错信息',
  compInterval: '20秒之内只能投诉一次,请过会再来\uFF01',
  changeFont: '正在修改字体,请稍等\uFF01',
  changeImgtxt: '正在修改阅读模式'
};
js_src_bookmark = function (window, $, tool, move, dialog, Msg) {
  var _ = window._;
  var Bookmark = function (options) {
    console.log('[Bookmark] -> 构造函数!');
    var defaults = {
      wrapObj: null,
      tmplHtml: '',
      isMobile: true,
      data: null,
      markDomObj: null
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化 <br>.
   */
  Bookmark.prototype._init = function () {
    var optsObj = this.opts;
    optsObj.templObj = _.template(optsObj.tmplHtml);
    this._bindEvent();
    this.dialog = new dialog({
      $wrapDomObj: optsObj.$readerObj,
      isMobile: optsObj.isMobile,
      okBtn: {
        txt: '确定',
        cssClass: '',
        func: function () {
        }
      },
      cancelBtn: {
        txt: '离开',
        cssClass: '',
        func: function () {
        }
      }
    });
  };
  /**
   * 事件委托 绑定事件.<br/>
   * 
   */
  Bookmark.prototype._bindEvent = function () {
    var that = this;
    var optsObj = this.opts;
    var eventName = optsObj.isMobile ? 'tap swipeLeft swipeRight' : 'click swipeLeft swipeRight';
    optsObj.wrapObj.on(eventName, '.read-bookmark-del', function (e) {
      console.log('[bookmark.js]书签点击了删除' + e.type);
      optsObj.wrapObj.trigger('bookmark:delclick');
      var oneChapterBookmark = $(this).parents('.read-one-chapter-bookmark');
      var bookmarkObj = {
        'chapterId': oneChapterBookmark.attr('data-chapterid'),
        'bookmarkid': $(this).attr('data-bookmarkid')
      };
      that.delBookmark(bookmarkObj);
    });
    optsObj.wrapObj.on(eventName, '.read-bookmark-left', function (e) {
      console.log('书签执行了' + e.type);
      if (e.type == 'swipeLeft') {
        that.bookmarkLeft(this);
      } else if (e.type == 'swipeRight') {
        that.cancelDel();
      } else {
        var percent = parseFloat($(this).find('.read-bookmark-percent').text()) / 100;
        optsObj.wrapObj.trigger('bookmark:click', percent);
        that.cancelDel();
      }
    });
  };
  /**
   * 渲染书签页面
   * 
   * @param {Object} data 书签数据对象
   */
  Bookmark.prototype.renderLayout = function (data) {
    var optsObj = this.opts;
    var tmp = tool.convertData(data.bookmark_list, 'bookmark_list');
    var bookmarkConvert = {
      'chapter_list': tmp,
      'bookmark_list': data.bookmark_list
    };
    optsObj.data = bookmarkConvert;
    if (tmp.length > 0) {
      var tempHtml = optsObj.templObj(bookmarkConvert);
      optsObj.wrapObj.html(tempHtml);
    } else {
      optsObj.wrapObj.find('.read-has-bookmark').html('').hide();
      optsObj.wrapObj.find('.read-no-bookmark').fadeIn();
    }
  };
  /**
   * 左侧滑动某一条书签
   * 
   * @param {Object} self 当前书签dom对象
   */
  Bookmark.prototype.bookmarkLeft = function (self) {
    var optsObj = this.opts;
    var parents = $(self).parents('.read-bookmark');
    var allBookmark = $(self).parents('.read-has-bookmark').find('.read-bookmark');
    var hasDel = false;
    // 判断当前书签页是否有某一条书签处于待删除状态
    for (var i = 0; i < allBookmark.length; i++) {
      // 如果有书签处于待删除状态，这取消这个状态
      if ($(allBookmark[i]).attr('data-hasDel') == 'true' && $(allBookmark[i]).attr('data-bookmarkid') != parents.attr('data-bookmarkid')) {
        hasDel = true;
        var thisBookmark = $(allBookmark[i]).find('.read-bookmark-del');
        move(thisBookmark[0]).set('right', thisBookmark.attr('data-right')).duration('0.2s').end();
        $(allBookmark[i]).attr('data-hasDel', 'false');
      }
    }
    // 没有书签在待删除状态
    if (!hasDel) {
      var thisBookmark = parents.find('.read-bookmark-del');
      if (parents.attr('data-hasDel') != 'true') {
        // 给当前这条书签增加一个待删除书签标记
        parents.attr('data-hasDel', 'true');
        parents.find('.read-bookmark-del').attr('data-bookmarkid', parents.attr('data-bookmarkid'));
        thisBookmark.attr('data-right', thisBookmark.css('right'));
        move(thisBookmark[0]).set('right', '0').duration('0.2s').end();
      }
    }
  };
  /**
   * 取消删除状态
   * 
   */
  Bookmark.prototype.cancelDel = function () {
    var that = this;
    var optsObj = that.opts;
    var allBookmark = optsObj.wrapObj.find('.read-has-bookmark .read-bookmark');
    // 判断当前书签页是否有某一条书签处于待删除状态
    for (var i = 0; i < allBookmark.length; i++) {
      // 如果有书签处于待删除状态，这取消这个状态
      if ($(allBookmark[i]).attr('data-hasDel') == 'true') {
        var thisBookmark = $(allBookmark[i]).find('.read-bookmark-del');
        move(thisBookmark[0]).set('right', thisBookmark.attr('data-right')).duration('0.2s').end();
        $(allBookmark[i]).attr('data-hasDel', 'false');
      }
    }
  };
  /**
   * 新增书签信息. <br/>
   * 
   * @param {Object} bookmarkData 书签对象
   * @param {Object} bookmarkData.text 书签位置文本
   * @param {Object} bookmarkData.pageSite 书签位置
   * @param {Object} bookmarkData.chapterId 书签位置的章节id
   * @param {Object} bookmarkData.chapterName 书签位置的章节名
   * 
   */
  Bookmark.prototype.addBookmark = function (bookmarkData) {
    var that = this;
    var optsObj = this.opts;
    console.log('[Bookmark] -> addBookmark!');
    var bookmark = {
      bookmark_id: tool.getRandomKey(),
      bookmark_text: bookmarkData.text.slice(0, 100),
      bookmark_time: tool.getNowFormatDate(),
      bookmark_page: bookmarkData.pageSite,
      chapter_name: bookmarkData.chapterName,
      chapter_id: bookmarkData.chapterId,
      'oparate_type': '1',
      // 1：增; 3：删
      's_id': ''  // s_id为服务器数据库的id,离线新增书签时设置为 空字符串;  
    };
    optsObj.markDomObj.attr({
      'data-bookmarkid': bookmark.bookmark_id,
      'data-chapterid': bookmarkData.chapterId
    }).fadeIn();
    var updateObj = $.extend(true, {}, bookmark);
    // 新增书签发送给服务器
    optsObj.api.setBookmark(updateObj, function (data) {
      console.log('[Bookmark.prototype.addBookmark] --> 增加书签-成功!' + data);
      innerAddBookmark();
      var addMark = {
        'oparate_type': '1',
        's_id': data.s_id,
        'bookmark_id': data.bookmark_id,
        'time_stamp': data.time_stamp
      };
      that._updLocalData(addMark);
    }, function (data) {
      if (!optsObj.isClient) {
        that.dialog.setMsg(Msg.bookMarkFail);
        that.dialog.open();
        optsObj.markDomObj.fadeOut();
      } else {
        innerAddBookmark();
      }
    });
    function innerAddBookmark() {
      optsObj.data.bookmark_list.push(bookmark);
      var tempBookmark = {
        'time_stamp': optsObj.data.time_stamp,
        'bookmark_list': optsObj.data.bookmark_list
      };
      // 然后保存本地 
      optsObj.saveFile(optsObj.filePath, JSON.stringify(tempBookmark));
      // 重新渲染书签显示
      that.renderLayout(optsObj.data);
    }
  };
  /**
   * 删除 书签信息. <br/>
   * 
   * @param {Object} bookmarkData 书签对象
   * @param {Object} bookmarkData.bookmarkid 书签id
   * @param {Object} bookmarkData.chapterId 书签位置的章节id
   * 
   */
  Bookmark.prototype.delBookmark = function (bookmarkData) {
    var that = this;
    var optsObj = this.opts;
    console.log('[Bookmark] -> delBookmark!');
    if (_.isEmpty(bookmarkData)) {
      bookmarkData = {
        'bookmarkid': optsObj.markDomObj.attr('data-bookmarkid'),
        'chapterId': optsObj.markDomObj.attr('data-chapterid')
      };
    }
    var bookmarkid = bookmarkData.bookmarkid;
    var list = optsObj.data.bookmark_list;
    var markItem = null;
    for (var i = 0, len = list.length; i < len; i++) {
      markItem = list[i];
      if (markItem.bookmark_id == bookmarkData.bookmarkid) {
        markItem.oparate_type = '3';
        break;
      }
    }
    var tempBookmark = {
      'time_stamp': optsObj.data.time_stamp,
      'bookmark_list': optsObj.data.bookmark_list
    };
    // 保存本地
    optsObj.saveFile(optsObj.filePath, JSON.stringify(tempBookmark));
    if (optsObj.markDomObj.attr('data-bookmarkid') == bookmarkid) {
      optsObj.markDomObj.fadeOut();
    }
    // 重新渲染书签显示
    that.renderLayout(optsObj.data);
    // 删除 与 服务器交互
    if (!!markItem.s_id) {
      // 同步的数据才需要向服务发请求.
      optsObj.api.delBookmark({ 'bookmark_id': bookmarkid }, function (data) {
        var delMark = {
          'oparate_type': '3',
          's_id': data.s_id,
          'bookmark_id': data.bookmark_id,
          'time_stamp': data.time_stamp
        };
        that._updLocalData(delMark);
      }, function (data) {
        if (!optsObj.isClient) {
          that.dialog.setMsg(Msg.bookMarkDelFail);
          that.dialog.open();
          markItem.oparate_type = '0';
          if (optsObj.markDomObj.attr('data-bookmarkid') == bookmarkid) {
            optsObj.markDomObj.fadeIn();
          }
          // 重新渲染书签显示
          that.renderLayout(optsObj.data);
        }
      });
    }
  };
  /**
   * 增加 书签信息. <br/>
   * 
   * @param {Object} bookmarkData 书签对象
   * 
   */
  Bookmark.prototype.updateBookmarks = function (bookmarkData) {
    var that = this;
    var optsObj = this.opts;
    console.log('[Bookmark] -> updateBookmarks!');
    if (optsObj.markDomObj.css('display') == 'none') {
      that.addBookmark(bookmarkData);
    } else {
      that.delBookmark(bookmarkData);
    }
  };
  /**
   * 获取 书签信息. <br/>
   * 
   */
  Bookmark.prototype.getBookmarks = function () {
    console.log('[Bookmark] -> getBookmarks! ');
    var optsObj = this.opts;
    return optsObj.data;
  };
  /**
   * 销毁 书签信息. <br/>
   * 
   */
  Bookmark.prototype.destoryBookmarks = function () {
    console.log('[Bookmark] -> destoryBookmarks!');
  };
  /**
   * 初始化 书签信息. <br/>
   * 
   */
  Bookmark.prototype._initBookmarks = function () {
    console.log('[Bookmark] -> _initBookmarks!');
  };
  /**
   * 判断是否显示书签
   * 
   * @param {Object} pageObj {
   *      'chapt_index':      {Number} 章节下标,
   *      'page_index':       {Number} 页码,
   *      'chapterId'         {String} 当前的章节id
   *      'chapterName':      {String} 章节名
   *      'chapterContent':   {String} 当前页html
   *      'pagePerc':         {String} 当前页偏移量  ps:12.34%
   *      'direction':        {String} 翻页方向  ps:'next','prev'
   *      'turnMode':         {Number} 翻页模式  ps:0,正常反应，有翻页动画;1,特殊翻页,无翻页动画
   *      'startPageOffset'   {String} 当前页的开始偏移量
   *      'endPageOffset'     {String} 当前页的结束偏移量
   *     }
   */
  Bookmark.prototype.isShowBookmark = function (pageObj) {
    console.log('[Bookmark] -> isShowBookmark!');
    var that = this;
    var optsObj = that.opts;
    var chapterList = [];
    // 判断当前显示也是否有书签 
    var hasBookmark = true;
    // 取出 optsObj.data.chapter_list
    if (!_.isEmpty(optsObj.data)) {
      chapterList = optsObj.data.chapter_list;
    }
    for (var i = 0; i < chapterList.length; i++) {
      var iChapt = chapterList[i];
      // 先找到章节id相等的所有书签,减少循环次数
      if (pageObj.chapterId == iChapt.chapter_id) {
        for (var j = 0; j < iChapt.bookmark_list.length; j++) {
          var jBookmark = iChapt.bookmark_list[j];
          // 当前书签的偏移量
          var bPage = jBookmark.bookmark_page;
          if (bPage <= pageObj.endPageOffset && bPage > pageObj.startPageOffset) {
            hasBookmark = false;
            that._showMarkIcon(jBookmark.bookmark_id, 'open');
            break;
          }
        }
        break;
      }
    }
    if (hasBookmark) {
      that._showMarkIcon('', 'close');
    }
  };
  /**
   * 在主面板显示书签标记并赋值data-bookmarkid. <br/>
   * 
   * @param {String} bookmark_id 书签id
   * @param {String} status 显示状态 open显示 close隐藏
   * 
   */
  Bookmark.prototype._showMarkIcon = function (bookmark_id, status) {
    if (status == 'open') {
      this.opts.markDomObj.attr('data-bookmarkid', bookmark_id).fadeIn(100);
    } else {
      this.opts.markDomObj.attr('data-bookmarkid', '').fadeOut(50);
    }
  };
  /**
   * 返回 书签DOM对象(jq). <br/>
   * 
   * 
   */
  Bookmark.prototype.getMarkDom = function () {
    return this.opts.markDomObj;
  };
  /**
   * 当用户执行 增加/删除 操作,向后台发送请求,根据返回值 更新本地数据.<br/>
   * 
   * @param {Object} bookmark
   *              bookmark.s_id
   *              bookmark.oparate_type
   *              bookmark.bookmark_id
   *              bookmark.time_stamp
   * 
   * @author gli-gonglong-20161028
   * 
   */
  Bookmark.prototype._updLocalData = function (bookmark) {
    var that = this;
    var optsObj = this.opts;
    var list = optsObj.data.bookmark_list;
    var item = null;
    for (var i = 0, len = list.length; i < len; i++) {
      item = list[i];
      if (item.bookmark_id == bookmark.bookmark_id) {
        if (bookmark.oparate_type == '1') {
          // 增
          item.s_id = bookmark.s_id;
          item.oparate_type = '0';
        } else if (bookmark.oparate_type == '3') {
          // 删
          list.splice(i, 1);
        }
        optsObj.data.time_stamp = bookmark.time_stamp;
        break;
      }
    }
    var tempBookmark = {
      'time_stamp': optsObj.data.time_stamp,
      'bookmark_list': optsObj.data.bookmark_list
    };
    // 然后保存本地 
    optsObj.saveFile(optsObj.filePath, JSON.stringify(tempBookmark));
  };
  return Bookmark;
}(js_src_global, js_libs_zeptodev, js_src_tool, move, js_src_widget_plugDialog, js_src_message_zh);
js_src_panelEdit = function (window, move, $, dialog, Msg, tool) {
  var _ = window._;
  var editPanel = function (options) {
    var defaults = {
      $readerObj: null,
      editHtml: '',
      $domObj: null,
      isMobile: true,
      noteData: null,
      sigleNote: null,
      // 单条笔记
      api: null
    };
    this.opts = $.extend(false, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  editPanel.prototype._init = function () {
    console.log('[editPanel] --> _init');
    this._renderLayout();
    this._bindEvent();
    this.dialog = new dialog({ $wrapDomObj: this.opts.$domObj });
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  editPanel.prototype._renderLayout = function () {
    var optsObj = this.opts;
    var editTemplObj = _.template(optsObj.editHtml);
    var editHtml = editTemplObj();
    // 笔记编辑 dom
    optsObj.$domObj = $(editHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  editPanel.prototype._bindEvent = function () {
    var that = this;
    var optsObj = that.opts;
    // 确定事件类型.
    var eventType = optsObj.isMobile ? 'tap' : 'click';
    // 关闭笔记编辑面板 
    optsObj.$domObj.find('.read-header .read-cancel').on(eventType, function () {
      var val = optsObj.$domObj.find('.read-body textarea').val().trim();
      optsObj.$domObj.find('.read-body textarea').blur();
      that.cancel(val);
    });
    // 保存笔记信息
    optsObj.$domObj.find('.read-header .read-send').on(eventType, function () {
      var val = optsObj.$domObj.find('.read-body textarea').val().trim();
      that._sendNote(optsObj.thisNoteObj, val);
    });
  };
  /**
   * 打开笔记编辑面板. <br/>
   * 
   */
  editPanel.prototype.open = function (data) {
    var that = this;
    var optsObj = that.opts;
    optsObj.thisNoteObj = data;
    optsObj.$domObj.show();
    setTimeout(function () {
      var height = optsObj.$domObj.height();
      move(optsObj.$domObj[0]).set('top', '0px').duration('0.5s').end();
      if (typeof MathJax !== 'undefined') {
        MathJax.Hub.Queue([
          'Typeset',
          MathJax.Hub
        ]);
      }
    }, 10);
    optsObj.$domObj.find('.read-body .read-original-text').html(data.original);
    if (!!data.note_text) {
      // true 笔记在编辑
      optsObj.isEditNote = true;
      optsObj.$domObj.find('.read-body textarea').val(data.note_text);
    } else {
      // false 笔记在新增
      optsObj.isEditNote = false;
    }
    if (!!data.isunderline) {
      _.each(optsObj.noteData.note_list, function (note) {
        if (note.note_id == data.note_id) {
          optsObj.thisNoteObj.s_id = note.s_id;
          return false;
        }
      });
    }
  };
  /**
   * 取消笔记编辑面板. <br/>
   * 
   */
  editPanel.prototype.cancel = function (value) {
    var that = this;
    var optsObj = that.opts;
    // 判断是否输入了内容
    if (value) {
      // 取消后的提示框
      var cancelDialog = new dialog({
        $wrapDomObj: optsObj.$domObj,
        okBtn: {
          txt: '继续编辑',
          cssClass: '',
          func: function () {
            optsObj.$domObj.find('.read-body textarea').focus();
            cancelDialog.destroy();
          }
        },
        cancelBtn: {
          txt: '离开',
          cssClass: '',
          func: function () {
            that.close();
            cancelDialog.destroy();
          }
        }
      });
      cancelDialog.setMsg(Msg.noteCancel);
      cancelDialog.open();
    } else {
      that.close();
    }
  };
  /**
   * 关闭笔记编辑面板. <br/>
   * 
   */
  editPanel.prototype.close = function () {
    var that = this;
    var optsObj = that.opts;
    // 清空数据
    optsObj.$domObj.find('.read-body textarea').val('');
    var height = optsObj.$domObj.height();
    move(optsObj.$domObj[0]).set('top', '-101%').duration('0.3s').end();
    setTimeout(function () {
      optsObj.$domObj.hide();
    }, 300);
  };
  /**
   * 发送笔记编辑信息. <br/>
   * 
   * @param {Object} note 笔记参数
   * @param {String} val  笔记内容
   * 
   */
  editPanel.prototype._sendNote = function (note, val) {
    var that = this;
    var optsObj = that.opts;
    // 验证传送内容是否为空
    if (!!val) {
      // 发送成功后的提示框
      that.sucessDialog = new dialog({
        $wrapDomObj: this.opts.$domObj,
        okBtn: {
          txt: '确定',
          cssClass: '',
          func: function () {
            that.close();
            that.sucessDialog.destroy();
          }
        },
        cancelBtn: {
          txt: '离开',
          cssClass: '',
          func: function () {
            that.close();
            that.sucessDialog.destroy();
          }
        }
      });
      // 当前笔记对象
      var saveNote = {
        chapter_id: note.chapter_id,
        chapter_name: note.chapter_name,
        firstId: note.firstId,
        lastId: note.lastId,
        note_id: note.note_id,
        note_page: note.note_page,
        note_text: val,
        note_time: tool.getNowFormatDate(),
        original: note.original,
        s_id: note.s_id,
        oparate_type: '',
        isSave: false
      };
      if (optsObj.isEditNote || !!note.isunderline) {
        // 编辑笔记
        saveNote.oparate_type = 2;
        var tmpNoteList = optsObj.noteData.note_list;
        for (var i = 0, len = tmpNoteList.length; i < len; i++) {
          if (tmpNoteList[i].note_id == saveNote.note_id) {
            // 覆盖旧信息
            tmpNoteList[i] = saveNote;
            break;
          }
        }
      } else {
        // 新增笔记
        saveNote.s_id = '';
        saveNote.note_id = tool.getRandomKey();
        // {Number}  1：增; 2：改; 3：删
        saveNote.oparate_type = 1;
        optsObj.noteData.note_list.push(saveNote);
      }
      optsObj.$domObj.trigger('addnote:update', {
        'noteData': optsObj.noteData,
        'sigleNote': saveNote,
        'flag': optsObj.isEditNote
      });
    } else {
      // 没输入内容 点击保存笔记时
      that.dialog.setMsg(Msg.inputContent);
      that.dialog.open();
    }
  };
  /**
   * 自定义事件. <br/>
   * 
   * @param eventName {String}   事件名称, 'addnote:update'
   * @param cb        {Function} 回调事件
   * 
   */
  editPanel.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  return editPanel;
}(js_src_global, move, js_libs_zeptodev, js_src_widget_plugDialog, js_src_message_zh, js_src_tool);
js_src_panelShare = function (window, move, $, dialog, Msg, tool) {
  var _ = window._;
  var sharePanel = function (options) {
    var defaults = {
      $readerObj: null,
      shareHtml: '',
      $domObj: null,
      isMobile: true,
      // 分享笔记--参数配置.
      note_share_conf: {
        'flag': false,
        'share_items': [
          {
            // 微信好友
            'type': 'wx',
            //  开关(是否使用该分享). false: 关闭(默认); true: 打开,此时必须注册回调函数!
            'flag': false,
            // 回调函数--分享逻辑
            'share_cb': null
          },
          {
            // 微信朋友圈
            'type': 'wx_moments',
            'flag': false,
            'share_cb': null
          },
          {
            // 新浪微博
            'type': 'sina_weibo',
            'flag': false,
            'share_cb': null
          },
          {
            // qq好友
            'type': 'qq',
            'flag': false,
            'share_cb': null
          },
          {
            // qq空间
            'type': 'qq_zone',
            'flag': false,
            'share_cb': null
          }
        ]
      },
      itemsObj: {
        'wx': {
          'txt': '微信好友',
          'icon_css': 'read-icon-wx'
        },
        'wx_moments': {
          'txt': '微信朋友圈',
          'icon_css': 'read-icon-wx-pyq'
        },
        'sina_weibo': {
          'txt': '新浪微博',
          'icon_css': 'read-icon-wb'
        },
        'qq': {
          'txt': 'qq好友',
          'icon_css': 'read-icon-qq'
        },
        'qq_zone': {
          'txt': 'qq空间',
          'icon_css': 'read-icon-qzone'
        }
      },
      currentNoteInfo: null
    };
    this.opts = $.extend(false, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  sharePanel.prototype._init = function () {
    console.log('[sharePanel] --> _init');
    this._renderLayout();
    this._bindEvent();
    this.dialog = new dialog({ $wrapDomObj: this.opts.$domObj });
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  sharePanel.prototype._renderLayout = function () {
    var optsObj = this.opts;
    var sharelTemplObj = _.template(optsObj.shareHtml);
    // note_share_conf
    var shareItems = optsObj.note_share_conf.share_items;
    var itemsPropSet = optsObj.itemsObj;
    var activeItems = [];
    var tmpType = '';
    var tmpItem = null;
    var newItem = null;
    for (var i = 0, len = shareItems.length; i < len; i++) {
      if (shareItems[i].flag) {
        tmpItem = shareItems[i];
        tmpType = tmpItem.type;
        itemsPropSet[tmpType].share_cb = tmpItem.share_cb;
        newItem = {
          'flag': true,
          'icon_css': itemsPropSet[tmpType].icon_css,
          'txt': itemsPropSet[tmpType].txt,
          'type': tmpType
        };
        activeItems.push(newItem);
      }
    }
    //          <li class="close">
    //                  <div class="icon icon-wx"></div>
    //                  <div class="font text-over">A微信好友</div>
    //              </li>
    var shareHtml = sharelTemplObj(activeItems);
    // 笔记分享 dom
    optsObj.$domObj = $(shareHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  sharePanel.prototype._bindEvent = function () {
    var that = this;
    var optsObj = that.opts;
    var itemsPropSet = optsObj.itemsObj;
    // 确定事件类型.
    var eventType = optsObj.isMobile ? 'tap' : 'click';
    // 关闭分享笔记面板--取消
    optsObj.$domObj.find('.read-note-share-cancel').on(eventType, function () {
      that.close();
    });
    // 点击空白处关闭分享面板
    optsObj.$domObj.find('.read-share-cover').on(eventType, function () {
      that.close();
    });
    // 笔记分享
    optsObj.$domObj.on(eventType, 'li', function () {
      var type = $(this).attr('data-type');
      if (typeof itemsPropSet[type].share_cb == 'function') {
        itemsPropSet[type].share_cb(optsObj.currentNoteInfo);
        that.close();
      } else {
        console.error('[笔记分享]:' + itemsPropSet[type].txt + ', 请注册相应函数!');
      }
    });
  };
  /**
   * 打开笔记分享面板. <br/>
   * 
   */
  sharePanel.prototype.open = function (noteid, chapterid) {
    var that = this;
    var optsObj = that.opts;
    optsObj.$domObj.fadeIn();
    var animateObj = optsObj.$domObj.find('.read-note-share-content');
    var height = animateObj.height();
    move(animateObj[0]).translate(0, -height).duration('0.3s').end();
  };
  /**
   * 关闭笔记分享面板. <br/>
   * 
   */
  sharePanel.prototype.close = function () {
    var that = this;
    var optsObj = that.opts;
    var animateObj = optsObj.$domObj.find('.read-note-share-content');
    var height = animateObj.height();
    move(animateObj[0]).translate(0, height).duration('0.3s').end();
    optsObj.$domObj.fadeOut();
  };
  /**
   * 设置当前笔记相关信息. <br/>
   * 
   * @param noteInfo {Object} 包括: book_id, chapter_id, note_txt
   * 
   */
  sharePanel.prototype.setCurrentNoteInfo = function (noteInfo) {
    var optsObj = this.opts;
    optsObj.currentNoteInfo = noteInfo;
  };
  return sharePanel;
}(js_src_global, move, js_libs_zeptodev, js_src_widget_plugDialog, js_src_message_zh, js_src_tool);
js_src_panelDetail = function (window, move, $, dialog, Msg, tool, sharePanel) {
  var _ = window._;
  var detailPanel = function (options) {
    var defaults = {
      $readerObj: null,
      detailHtml: '',
      $domObj: null,
      isMobile: true,
      noteData: null,
      thisNoteObj: null,
      // 当前笔记id和章节id对象
      thisNoteList: [],
      // 当前章节除开划线的笔记信息
      api: null,
      shareObj: null
    };
    this.opts = $.extend(false, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  detailPanel.prototype._init = function () {
    console.log('[detailPanel] --> _init');
    this._renderLayout();
    this._bindEvent();
    this.dialog = new dialog({ $wrapDomObj: this.opts.$domObj });
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  detailPanel.prototype._renderLayout = function () {
    var optsObj = this.opts;
    var detailTemplObj = _.template(optsObj.detailHtml);
    var detailHtml = detailTemplObj();
    // 笔记详情 dom
    optsObj.$domObj = $(detailHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
    if (optsObj.note_share_conf.flag) {
      //  使用"分享笔记"
      optsObj.shareObj = new sharePanel({
        $readerObj: optsObj.$readerObj,
        //              detailHtml: optsObj.detailHtml,
        shareHtml: optsObj.shareHtml,
        isMobile: optsObj.isMobile,
        isMobile: optsObj.isMobile,
        //              api: optsObj.api,
        //              saveFile: optsObj.saveFile,
        //              filePath: optsObj.filePath,
        //              noteData: optsObj.data,
        note_share_conf: optsObj.note_share_conf
      });
    } else {
      // 隐藏 "分享笔记"按钮.
      optsObj.$domObj.find('.read-header .read-share-btn').css('visibility', 'hidden');
    }
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  detailPanel.prototype._bindEvent = function () {
    var that = this;
    var optsObj = that.opts;
    // 确定事件类型.
    var eventType = optsObj.isMobile ? 'tap swipeRight' : 'click';
    // 关闭笔记详情面板
    optsObj.$domObj.find('.read-note-detail-left').on(eventType, function (e) {
      (e.type == 'tap' || e.type == 'swipeRight') && that.close();
    });
    // 删除本条笔记
    optsObj.$domObj.find('.read-body .read-delete-btn').on(eventType, function (e) {
      e.type == 'tap' && that.deleteNote();
    });
    // 笔记编辑
    optsObj.$domObj.find('.read-body .read-edit-btn').on(eventType, function (e) {
      e.type == 'tap' && that.editNote();
    });
    // 笔记详情分享
    if (optsObj.note_share_conf.flag) {
      optsObj.$domObj.find('.read-header .read-share-btn').on(eventType, function (e) {
        // 设置参数
        var noteInfo = that._getCurrentNotInfo();
        optsObj.shareObj.setCurrentNoteInfo(noteInfo);
        e.type == 'tap' && optsObj.shareObj.open();
      });
    }
    // 笔记上翻
    optsObj.$domObj.find('.read-footer .read-prev').on(eventType, function (e) {
      e.type == 'tap' && that._prev();
    });
    // 笔记下翻
    optsObj.$domObj.find('.read-footer .read-next').on(eventType, function (e) {
      e.type == 'tap' && that._next();
    });
  };
  /**
   * 打开笔记详情面板. <br/>
   * 
   * @param {Number} noteid 笔记id
   * @param {Number} chapterid 章节id
   * 
   */
  detailPanel.prototype.open = function (noteid, chapterid) {
    var that = this;
    var optsObj = that.opts;
    // 存储当前笔记数据,删除时用
    optsObj.thisNoteObj = {
      noteid: noteid,
      chapterid: chapterid
    };
    // 动画
    optsObj.$domObj.fadeIn();
    var animateObj = optsObj.$domObj.find('.read-note-detail-content');
    var width = animateObj.width();
    move(animateObj[0]).translate(-width, 0).duration('0.3s').end();
    // 显示笔记
    this._filterNote(chapterid);
    this.viewNote();
  };
  /**
   * 关闭笔记详情面板. <br/>
   * 
   */
  detailPanel.prototype.close = function () {
    var that = this;
    var optsObj = that.opts;
    // 动画
    var animateObj = optsObj.$domObj.find('.read-note-detail-content');
    var width = animateObj.width();
    move(animateObj[0]).translate(width, 0).duration('0.3s').end();
    optsObj.$domObj.fadeOut();
  };
  /**
   * 显示笔记. <br/>
   * 
   */
  detailPanel.prototype.viewNote = function () {
    var that = this;
    var optsObj = that.opts;
    var thisNoteObj = optsObj.thisNoteObj;
    if (thisNoteObj.noteid === -1) {
      // 当前章节没笔记啦
      optsObj.$domObj.find('.read-body .read-original-text').html('');
      optsObj.$domObj.find('.read-body .read-note-text').html('当前章节没笔记啦\uFF01');
      optsObj.$domObj.find('.read-body .read-time').html('');
      optsObj.$domObj.find('.read-footer .read-page .read-current').html(0);
      optsObj.$domObj.find('.read-footer .read-page .read-total').html(0);
      optsObj.$domObj.find('.read-body .read-btns').css('pointer-events', 'none');
      optsObj.$domObj.find('.read-footer').css('pointer-events', 'none');
      return false;
    } else {
      optsObj.$domObj.find('.read-body .read-btns').css('pointer-events', '');
      optsObj.$domObj.find('.read-footer').css('pointer-events', '');
    }
    // 遍历找到chapterid相等且noteid相等的笔记
    _.each(optsObj.thisNoteList, function (note, i) {
      if (note.note_id == thisNoteObj.noteid) {
        optsObj.thisNoteData = note;
        optsObj.$domObj.find('.read-body .read-original-text').html(note.original);
        optsObj.$domObj.find('.read-body .read-note-text').html(note.note_text);
        optsObj.$domObj.find('.read-body .read-time').html(note.note_time);
        optsObj.$domObj.find('.read-footer .read-page .read-current').html(i + 1);
        optsObj.$domObj.find('.read-footer .read-page .read-total').html(optsObj.thisNoteList.length);
        optsObj.thisNoteIndex = i;
        return false;
      }
    });
    if (typeof MathJax !== 'undefined') {
      MathJax.Hub.Queue([
        'Typeset',
        MathJax.Hub
      ]);
    }
  };
  /**
   * 删除笔记后,重新显示笔记. <br/>
   * 
   */
  detailPanel.prototype.reshowNote = function () {
    var optsObj = this.opts;
    this._filterNote(optsObj.thisNoteObj.chapterid);
    var index = optsObj.thisNoteIndex;
    if (index > 0) {
      index = index - 1;
    } else {
      index = index < optsObj.thisNoteList.length ? index : -1;
    }
    optsObj.thisNoteObj.noteid = index > -1 ? optsObj.thisNoteList[index].note_id : -1;
    this.viewNote();
  };
  /**
   * 过滤划线显示笔记. <br/>
   * 
   * @param {String}  chapterid   当前的笔记的章节id
   *  
   */
  detailPanel.prototype._filterNote = function (chapterid) {
    var optsObj = this.opts;
    var noteList = [];
    optsObj.thisNoteList = [];
    for (var i = 0, len = optsObj.noteData.chapter_list.length; i < len; i++) {
      if (optsObj.noteData.chapter_list[i].chapter_id == chapterid) {
        noteList = optsObj.noteData.chapter_list[i].note_list;
        break;
      }
    }
    for (var j = 0, m = noteList.length; j < m; j++) {
      if (!!noteList[j].note_text && noteList[j].oparate_type != '3') {
        optsObj.thisNoteList.push(noteList[j]);
      }
    }
  };
  /**
   * 笔记上翻. <br/>
   * 
   */
  detailPanel.prototype._prev = function () {
    var that = this;
    var optsObj = that.opts;
    var oldIndex = optsObj.thisNoteIndex;
    optsObj.thisNoteIndex = optsObj.thisNoteIndex > 0 ? optsObj.thisNoteIndex - 1 : 0;
    optsObj.thisNoteObj.noteid = optsObj.thisNoteList[optsObj.thisNoteIndex].note_id;
    if (oldIndex == optsObj.thisNoteIndex) {
      return false;
    }
    this.viewNote();
  };
  /**
   * 笔记下翻. <br/>
   * 
   */
  detailPanel.prototype._next = function () {
    var that = this;
    var optsObj = that.opts;
    var oldIndex = optsObj.thisNoteIndex;
    var max = optsObj.thisNoteList.length - 1;
    optsObj.thisNoteIndex = optsObj.thisNoteIndex < max ? optsObj.thisNoteIndex + 1 : max;
    optsObj.thisNoteObj.noteid = optsObj.thisNoteList[optsObj.thisNoteIndex].note_id;
    if (oldIndex == optsObj.thisNoteIndex) {
      return false;
    }
    this.viewNote();
  };
  /**
   *编辑笔记. <br/>
   * 
   */
  detailPanel.prototype.editNote = function () {
    var that = this;
    var optsObj = that.opts;
    optsObj.$domObj.trigger('detailDel:edit', optsObj.thisNoteData);  //          this.viewNote();
  };
  /**
   * 删除笔记. <br/>
   * 
   */
  detailPanel.prototype.deleteNote = function () {
    var that = this;
    var optsObj = that.opts;
    optsObj.$domObj.trigger('detailDel:delete', optsObj.thisNoteObj);
  };
  /**
   * 自定义事件. <br/>
   * 
   * @param eventName {String}   事件名称, 'detailDel:delete', 'detailDel:edit'
   * @param cb        {Function} 回调事件
   * 
   */
  detailPanel.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  /**
   * 获取当前笔记相关信息. <br/>
   * 
   * return noteInfo {Object} 包括: book_id, chapter_id, note_txt
   * 
   */
  detailPanel.prototype._getCurrentNotInfo = function () {
    var that = this;
    var optsObj = that.opts;
    var noteInfo = {
      'book_id': '',
      'chapter_id': '',
      'note_txt': ''
    };
    try {
      noteInfo.book_id = optsObj.api.opts.baseData.book_id || '';
      noteInfo.chapter_id = optsObj.thisNoteObj.chapterid;
      noteInfo.note_txt = optsObj.thisNoteData.original;
    } catch (e) {
      console.error('[panelDetail.js]' + e);
    }
    return noteInfo;
  };
  return detailPanel;
}(js_src_global, move, js_libs_zeptodev, js_src_widget_plugDialog, js_src_message_zh, js_src_tool, js_src_panelShare);
js_src_note = function (window, $, move, editPanel, detailPanel, Tool, dialog, Msg) {
  var _ = window._;
  var Note = function (options) {
    var defaults = {
      wrapObj: null,
      $readerObj: null,
      $contentObj: null,
      tmplHtml: '',
      isMobile: true,
      data: null,
      // 笔记划线数据
      chapter_id: '',
      // 当前章节id
      editHtml: '',
      detailHtml: '',
      shareHtml: ''
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化   <br/>.
   */
  Note.prototype._init = function () {
    var optsObj = this.opts;
    optsObj.templObj = _.template(optsObj.tmplHtml);
    //转化 zepto 对象
    optsObj.$contentObj = optsObj.$readerObj.find('.read-selector-main .read-content');
    // 笔记提示对话框
    this.noteDialog = new dialog({
      $wrapDomObj: this.opts.$readerObj,
      okBtn: {
        txt: '确定',
        cssClass: '',
        func: function () {
        }
      },
      cancelBtn: {
        txt: '离开',
        cssClass: '',
        func: function () {
        }
      }
    });
  };
  /**
   * 事件委托 绑定事件.<br/>
   * 
   */
  Note.prototype._bindEvent = function () {
    var optsObj = this.opts;
    var that = this;
    var eventName = optsObj.isMobile ? 'tap swipeLeft swipeRight' : 'click swipeLeft swipeRight';
    // 点击笔记的删除按钮-CBN面板，点击[滑出]的删除按钮.
    optsObj.wrapObj.on(eventName, '.read-note-del', function (e) {
      console.log('[note.js]笔记点击了删除' + e.type);
      var oneChapterNote = $(this).parents('.read-one-chapter-notes');
      var delNoteData = {
        'chapterid': oneChapterNote.attr('data-chapterid'),
        'noteid': $(this).attr('data-noteid')
      };
      that.delNote(delNoteData);
    });
    // 笔记上的点击与滑动,左滑调出删除按钮,右滑调出
    optsObj.wrapObj.on(eventName, '.read-note-left', function (e) {
      console.log('笔记执行了' + e.type);
      if (e.type == 'swipeLeft') {
        // 判断是否滑出删除按钮
        that.noteLeft(this);
      } else if (e.type == 'swipeRight') {
        // 取消删除状态
        that.cancelDel();
      } else {
        // 点击笔记 实现跳转
        var percent = $(this).parents('.read-note').attr('data-percent');
        optsObj.wrapObj.trigger('cbnnote:click', percent);
        // 取消删除状态
        that.cancelDel();
      }
    });
    // 更新笔记(新增,编辑)
    optsObj.editObj.on('addnote:update', function (event, data) {
      optsObj.data = data.noteData;
      that.renderCbnPage(optsObj.data);
      that.showNote(optsObj.chapter_id, optsObj.chapter_name);
      if (data.flag) {
        optsObj.noteDetailObj.reshowNote();
      }
      if (!!data.sigleNote) {
        that._sendNote(data.sigleNote);
      }
    });
    // 执行触发的 detailDel:delete
    optsObj.noteDetailObj.on('detailDel:delete', function (e, thisData) {
      that.delNote(thisData);
    });
    // 执行触发的 detailDel:edit
    optsObj.noteDetailObj.on('detailDel:edit', function (e, thisData) {
      thisData.chapter_id = optsObj.chapter_id;
      // 打开编辑面板.
      that.editNote(thisData);
    });
  };
  /**
   * 渲染布局
   * 
   * @param {Object} data 笔记信息
   * 
   */
  Note.prototype.renderLayout = function (data) {
    var that = this;
    var optsObj = this.opts;
    optsObj.data = data || {
      time_stamp: '0',
      note_list: []
    };
    this.renderCbnPage(optsObj.data);
    // 渲染编辑笔记页面
    optsObj.editObj = new editPanel({
      $readerObj: optsObj.$readerObj,
      editHtml: optsObj.editHtml,
      isMobile: optsObj.isMobile,
      api: optsObj.api,
      saveFile: optsObj.saveFile,
      filePath: optsObj.filePath,
      noteData: optsObj.data
    });
    // 渲染笔记详情页面
    optsObj.noteDetailObj = new detailPanel({
      $readerObj: optsObj.$readerObj,
      detailHtml: optsObj.detailHtml,
      shareHtml: optsObj.shareHtml,
      isMobile: optsObj.isMobile,
      api: optsObj.api,
      saveFile: optsObj.saveFile,
      filePath: optsObj.filePath,
      noteData: optsObj.data,
      note_share_conf: optsObj.note_share_conf
    });
    this._bindEvent();
  };
  /* 渲染cbn面板布局. <br/>
   * 
   * @param {Object} data 笔记信息
   */
  Note.prototype.renderCbnPage = function (data) {
    var that = this;
    var optsObj = this.opts;
    // 是否有笔记
    var flag = false;
    var tmp = Tool.convertData(data.note_list, 'note_list');
    data.chapter_list = tmp;
    var noteConvert = {
      'chapter_list': tmp,
      'nowDate': ''
    };
    if (noteConvert.chapter_list.length > 0) {
      for (var i = 0, len = noteConvert.chapter_list.length; i < len; i++) {
        if (noteConvert.chapter_list[i].note_count) {
          flag = true;
          break;
        }
      }
      var nowDate = Tool.getNowFormatDate();
      noteConvert.nowDate = nowDate.substr(0, 10);
      var tempHtml = optsObj.templObj(noteConvert);
      optsObj.wrapObj.html(tempHtml);
      if (typeof MathJax !== 'undefined') {
        MathJax.Hub.Queue([
          'Typeset',
          MathJax.Hub
        ]);
      }
    }
    if (!flag) {
      optsObj.wrapObj.find('.read-has-note').html('').hide();
      optsObj.wrapObj.find('.read-no-note').fadeIn();
    }
  };
  /**
   * 左侧滑动某一条笔记. <br/>
   * 
   * @param {Object} self 当前书签dom对象
   */
  Note.prototype.noteLeft = function (self) {
    var optsObj = this.opts;
    var parents = $(self).parents('.read-note');
    var allNote = $(self).parents('.read-has-note').find('.read-note');
    var hasDel = false;
    // 判断当前书签页是否有某一条书签处于待删除状态
    for (var i = 0; i < allNote.length; i++) {
      var $iNote = $(allNote[i]);
      // 如果有书签处于待删除状态，这取消这个状态
      if ($iNote.attr('data-hasDel') == 'true' && $iNote.attr('data-noteid') != parents.attr('data-noteid')) {
        hasDel = true;
        var thisNote = $iNote.find('.read-note-del');
        var width = thisNote.width();
        move(thisNote[0]).translate(width, 0).duration('0.2s').end();
        $iNote.attr('data-hasDel', 'false');
      }
    }
    // 没有笔记在待删除状态
    if (!hasDel) {
      var thisNote = parents.find('.read-note-del');
      if (parents.attr('data-hasDel') != 'true') {
        // 给当前这条书签增加一个待删除书签标记
        parents.attr('data-hasDel', 'true');
        parents.find('.read-note-del').attr('data-noteid', parents.attr('data-noteid'));
        var width = thisNote.width();
        move(thisNote[0]).translate(-width, 0).duration('0.2s').end();
      }
    }
  };
  /**
   * 取消删除状态. <br/>
   * 
   */
  Note.prototype.cancelDel = function () {
    var that = this;
    var optsObj = that.opts;
    var allNote = optsObj.wrapObj.find('.read-has-note .read-note');
    // 判断当前书签页是否有某一条书签处于待删除状态
    for (var i = 0; i < allNote.length; i++) {
      // 如果有书签处于待删除状态，这取消这个状态
      if ($(allNote[i]).attr('data-hasDel') == 'true') {
        var thisNote = $(allNote[i]).find('.read-note-del');
        var width = thisNote.width();
        move(thisNote[0]).translate(width, 0).duration('0.2s').end();
        $(allNote[i]).attr('data-hasDel', 'false');
      }
    }
  };
  /**
   * 删除 笔记or划线 信息. <br/>
   * 
   * @param {Object} delNoteData {
   *      noteid      {String}  笔记id
   *      chapterid   {String}  笔记所在的章节id
   *  }
   * 
   */
  Note.prototype.delNote = function (delNoteData) {
    var that = this;
    var optsObj = this.opts;
    // var chapter_list = optsObj.data.chapter_list;
    var noteid = delNoteData.noteid;
    var note_list = optsObj.data.note_list;
    var note_sid = '';
    var tmpNoteItem = null;
    for (var i = 0, len = note_list.length; i < len; i++) {
      tmpNoteItem = note_list[i];
      if (tmpNoteItem.note_id == noteid) {
        if (tmpNoteItem.s_id == '') {
          // 删除"离线"状态的数据.
          note_list.splice(i, 1);
        } else {
          tmpNoteItem.oparate_type = '3';
          note_sid = tmpNoteItem.s_id;
        }
        break;
      }
    }
    var localNoteData = {
      'time_stamp': optsObj.data.time_stamp,
      'note_list': optsObj.data.note_list
    };
    // 保存本地
    optsObj.saveFile(optsObj.filePath, JSON.stringify(localNoteData));
    that.renderCbnPage(optsObj.data);
    // 重新渲染笔记显示
    if (!!optsObj.noteDetailObj.opts.thisNoteObj) {
      optsObj.noteDetailObj.reshowNote();
    }
    this.showNote(optsObj.chapter_id, optsObj.chapter_name);
    if (note_sid != '') {
      // 删除的数据在DB有记录时.
      optsObj.api.delNote({ 'note_id': noteid }, function (data) {
        that._updateSingleNote({
          's_id': '',
          'note_id': data.note_id,
          'time_stamp': data.time_stamp,
          'oparate_type': 3
        });
      }, function () {
        if (!optsObj.isClient) {
          that.noteDialog.setMsg(Msg.noteDelFail);
          that.noteDialog.open();
          tmpNoteItem.oparate_type = '0';
          // 重新渲染笔记显示
          that.renderCbnPage(optsObj.data);
          if (!!optsObj.noteDetailObj.opts.thisNoteObj) {
            optsObj.noteDetailObj._filterNote(optsObj.chapter_id);
            optsObj.noteDetailObj.opts.thisNoteObj.noteid = noteid;
            optsObj.noteDetailObj.viewNote();
          }
          that.showNote(optsObj.chapter_id, optsObj.chapter_name);
        }
      });
    }
  };
  /**
   * 页面显示笔记和划线. <br/>
   * 
   * @param {String} chapterid  章节ID
   * @param {String} chapterName  章节名
   */
  Note.prototype.showNote = function (chapterid, chapterName) {
    var optsObj = this.opts;
    var eventName = optsObj.isMobile ? 'tap swipeLeft swipeRight' : 'click swipeLeft swipeRight';
    optsObj.chapter_id = chapterid;
    optsObj.chapter_name = chapterName;
    var note_list = [];
    // 显示前,先清除
    optsObj.$contentObj.find('.read-gli-note').removeClass('read-gli-note');
    optsObj.$contentObj.find('.read-gli-underline').removeClass('read-gli-underline');
    optsObj.$contentObj.find('.read-note-icon').remove();
    var chapts = !optsObj.data ? [] : optsObj.data.chapter_list;
    for (var i = 0, len = chapts.length; i < len; i++) {
      if (chapts[i].chapter_id == chapterid) {
        // 深复制
        note_list = chapts[i].note_list.concat();
        break;
      }
    }
    // 笔记开始结束data-id
    var first_id = optsObj.$contentObj.find('span[data-id]').first().attr('data-id');
    var last_id = optsObj.$contentObj.find('span[data-id]').last().attr('data-id');
    first_id = parseInt(first_id);
    last_id = parseInt(last_id);
    // 笔记开始结束下标
    var firstId = 0;
    var lastId = 0;
    var oldId = 0;
    var note_id = '';
    var note_text = '';
    var fontsize = optsObj.$contentObj.css('font-size');
    fontsize = parseFloat(fontsize.replace('px', ''));
    var readerTop = optsObj.$readerObj.offset().top;
    var readerLeft = optsObj.$readerObj.offset().left;
    // 按顺序查找显示
    while (note_list.length) {
      firstId = parseInt(note_list[0].firstId);
      lastId = parseInt(note_list[0].lastId);
      oldId = lastId;
      note_id = note_list[0].note_id;
      note_text = note_list[0].note_text;
      // 笔记跨页等特殊情况也能得到笔记开始结束位置
      firstId = firstId > first_id ? firstId : first_id;
      lastId = lastId < last_id ? lastId : last_id;
      // 笔记不在当前页
      if (firstId > lastId) {
        note_list.splice(0, 1);
        continue;
      }
      if (note_text === '') {
        // 划线
        for (var j = firstId; j <= lastId; j++) {
          optsObj.$contentObj.find('span[data-id="' + j + '"]').attr('data-noteid', note_id);
          if (!optsObj.$contentObj.find('span[data-id="' + j + '"]').hasClass('read-gli-note')) {
            optsObj.$contentObj.find('span[data-id="' + j + '"]').addClass('read-gli-underline');
          }
        }
      } else {
        // 笔记
        for (var j = firstId; j <= lastId; j++) {
          optsObj.$contentObj.find('span[data-id="' + j + '"]').attr('data-noteid', note_id).addClass('read-gli-note');
        }
        if (lastId === oldId) {
          // 笔记标记图标
          var $noteIcon = $('<div class="read-note-icon">');
          var $notelast = optsObj.$contentObj.find('span[data-id="' + lastId + '"]');
          var top = $notelast.offset().top - optsObj.$contentObj.offset().top;
          var left = $notelast.offset().left;
          var width = $notelast.width();
          top = top < fontsize ? fontsize : top;
          // 笔记图标设置位置 并绑定事件
          $noteIcon.css({
            'top': top - fontsize - readerTop + 'px',
            'left': left - readerLeft + width - fontsize + 'px'
          }).attr('data-noteid', note_id).attr('data-chapterid', chapterid).on(eventName, function (event) {
            optsObj.noteDetailObj.open($(this).data('noteid'), optsObj.chapter_id);
            event.stopPropagation();
          });
          optsObj.$contentObj.eq(0).append($noteIcon);
        }
      }
      note_list.splice(0, 1);
    }
  };
  /**
   * 增加划线. <br/>
   * 
   * @param {Object} data {
   *      fisrtId     {Number} 被选中内容的第一个元素的data-id值
   *      lastId      {Number} 被选中内容的最后一个元素的data-id值
   *      original    {String} 选中的内容，公式和特殊标签sub/sup/i等含html代码
   *      chapter_id  {String} 章节ID
   *      note_page   {Number} 当前页码 ps:0.1234
   *  }
   */
  Note.prototype.addUnderline = function (data) {
    var optsObj = this.opts;
    if (optsObj.$contentObj.find('.read-font-select').hasClass('read-gli-underline') || optsObj.$contentObj.find('.read-font-select').hasClass('read-gli-note')) {
      // 不能addUnderline的提示框
      this.noteDialog.setMsg(Msg.noteError);
      this.noteDialog.open();
    } else {
      optsObj.$contentObj.find('.read-font-select').addClass('read-gli-underline');
      var note_list = optsObj.data.note_list;
      var underlineData = {
        'chapter_id': optsObj.chapter_id,
        'chapter_name': optsObj.chapter_name,
        's_id': '',
        'note_id': Tool.getRandomKey(),
        'original': data.original,
        'note_text': '',
        'note_time': Tool.getNowFormatDate(),
        'firstId': data.firstId,
        'lastId': data.lastId,
        'note_page': data.note_page,
        'oparate_type': '1',
        'isSave': false
      };
      optsObj.$contentObj.find('.read-font-select').attr('data-noteid', underlineData.note_id);
      note_list.push(underlineData);
      this.renderCbnPage(optsObj.data);
      this._sendNote(underlineData);
    }
  };
  /**
   * 
   * 编辑笔记--打开面板. <br/>
   * 
   * @param {Object} data {
   *      fisrtId     {Number} 被选中内容的第一个元素的data-id值
   *      lastId      {Number} 被选中内容的最后一个元素的data-id值
   *      original    {String} 选中的内容，公式和特殊标签sub/sup/i等含html代码
   *      chapter_id  {String} 章节ID
   *      note_page   {Number} 当前页码 ps:0.1234
   *      isunderline {Boolean}是否是划线转笔记
   *  }
   */
  Note.prototype.editNote = function (data) {
    var optsObj = this.opts;
    var that = this;
    if (!data.isunderline && (optsObj.$contentObj.find('.read-font-select').hasClass('read-gli-underline') || optsObj.$contentObj.find('.read-font-select').hasClass('read-gli-note'))) {
      // 不能增加笔记的提示框
      this.noteDialog.setMsg(Msg.noteError);
      this.noteDialog.open();
      return false;
    }
    optsObj.editObj.open(data);
  };
  /**
   * 发送单条 笔记(or划线) 信息. <br/>
   * 
   * @param {Object} noteInfo {
   *      firstId     {Number}    笔记开始下标,
   *      lastId      {Number}    笔记结束下标,
   *      note_id     {Number}    笔记ID,
   *      note_page   {String}    笔记在本章位置(0.5213),
   *      note_text   {String}    笔记内容,
   *      note_time   {String}    笔记时间,
   *      original    {String}    笔记原文,
   *  }
   */
  Note.prototype._sendNote = function (noteInfo) {
    var optsObj = this.opts;
    var that = this;
    // 本地储存
    var localNoteData = {
      'time_stamp': optsObj.data.time_stamp,
      'note_list': optsObj.data.note_list
    };
    optsObj.saveFile(optsObj.filePath, JSON.stringify(localNoteData));
    // 保存单条笔记信息
    optsObj.api.sendNote(noteInfo, function (data) {
      console.info('[panelNotePc.js --> _sendNote] -- success!');
      that._updateSingleNote({
        's_id': data.s_id,
        'note_id': data.note_id,
        'time_stamp': data.time_stamp,
        'oparate_type': 1
      });
      // 提示保存成功
      innerSetDialog(Msg.noteSucess, noteInfo.note_text != '');
      that._fallback(true);
    }, function () {
      var msg = optsObj.isClient ? Msg.noteSucess : Msg.noteFail;
      if (noteInfo.note_text == '' && !optsObj.isClient) {
        that.noteDialog.setMsg(Msg.noteFail);
        that.noteDialog.open();
      } else {
        if (noteInfo.note_text != '') {
          innerSetDialog(msg, true);
        }
      }
      that._fallback(optsObj.isClient);
    });
    function innerSetDialog(msg, flag) {
      if (flag) {
        optsObj.editObj.sucessDialog.setMsg(msg);
        optsObj.editObj.sucessDialog.open();
      }
    }
  };
  /**
   * 保存笔记失败回退. <br/>
   * 
   * @param {Boolean} sucessFlag 是否回退
   */
  Note.prototype._fallback = function (sucessFlag) {
    var optsObj = this.opts;
    var note_list = optsObj.data.note_list;
    var editFlag = false;
    for (var i = note_list.length - 1; i >= 0; i--) {
      if (note_list[i].isSave === false) {
        delete note_list[i].isSave;
        var editOpts = optsObj.editObj.opts;
        if (sucessFlag) {
          editOpts.thisNoteObj = null;
        } else {
          if (!editOpts.isEditNote) {
            if (!!editOpts.thisNoteObj && !!editOpts.thisNoteObj.isunderline) {
              // 划线转笔记
              note_list[i].note_text = '';
            } else {
              // 新增笔记
              note_list.splice(i, 1);
            }
          } else {
            // 编辑笔记
            note_list[i] = editOpts.thisNoteObj;
            editFlag = true;
          }
          this.renderCbnPage(optsObj.data);
          this.showNote(optsObj.chapter_id, optsObj.chapter_name);
          if (editFlag) {
            optsObj.noteDetailObj.opts.thisNoteObj.noteid = editOpts.thisNoteObj.note_id;
            optsObj.noteDetailObj._filterNote(optsObj.chapter_id);
            optsObj.noteDetailObj.viewNote();
          }
        }
        break;
      }
    }
  };
  /**
   * 当用户执行 增删改 操作,服务器返回数据时，更新本地数据(内存, 本地文件). <br/>
   * 
   * @param {Object} noteInfo
   *           noteInfo.s_id
   *           noteInfo.note_id
   *           noteInfo.time_stamp
   *           noteInfo.oparate_type, // 1：增; 2：改; 3：删
   * 
   */
  Note.prototype._updateSingleNote = function (noteInfo) {
    var optsObj = this.opts;
    var localNoteList = optsObj.data.note_list;
    var noteItem = null;
    for (var i = 0, len = localNoteList.length; i < len; i++) {
      noteItem = localNoteList[i];
      if (noteItem.note_id == noteInfo.note_id) {
        if (noteInfo.oparate_type == '3') {
          // 删
          localNoteList.splice(i, 1);
        } else {
          // 增, 改
          noteItem.s_id = noteInfo.s_id;
          // 本条数据已与服务器同步
          noteItem.oparate_type = '0';
        }
        // 更新时间戳;
        if (!!noteInfo.time_stamp) {
          optsObj.data.time_stamp = noteInfo.time_stamp;
        }
        break;
      }
    }
    var localNoteData = {
      'time_stamp': optsObj.data.time_stamp,
      'note_list': optsObj.data.note_list
    };
    optsObj.saveFile(optsObj.filePath, JSON.stringify(localNoteData));
  };
  /**
   * 批量更新笔记.<br/>
   * 
   */
  Note.prototype.batchUpdateNote = function (noteInfo, successCb, errorCb) {
    var optsObj = this.opts;
    optsObj.api.batchUpdateNote(noteInfo, function (data) {
      if (typeof successCb == 'function') {
        successCb(data);
      }
    }, function (data) {
      if (typeof errorCb == 'function') {
        errorCb(data);
      }
    });
  };
  /**
   * 自定义事件. <br/>
   * 
   * @param eventName {String}   事件名称, 'cbnnote:click'
   * @param cb        {Function} 回调事件
   * 
   */
  Note.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.wrapObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  return Note;
}(js_src_global, js_libs_zeptodev, move, js_src_panelEdit, js_src_panelDetail, js_src_tool, js_src_widget_plugDialog, js_src_message_zh);
js_src_panelCbn = function (window, Catalog, Bookmark, Note, move, $, tool) {
  //  var $ = window.Zepto;
  var _ = window._;
  var CbnPanel = function (options) {
    var defaults = {
      wrapDomId: '',
      // 多实例 区分用;
      $readerObj: null,
      templHtml: '',
      // HTML 模板
      templHeadHtml: '',
      // 头部导航 模板.
      templBodyHtml: '',
      // 子内容 模板.
      templCatalogHtml: '',
      //目录 模板.
      templNoteHtml: '',
      //笔记 模板.
      $domObj: null,
      $headerObj: null,
      $bodyObj: null,
      isMobile: true,
      // 开关- 使用[书签]
      useBookmark: true,
      // 开关- 使用[笔记]
      useNote: true,
      data: null
    };
    var defaultMenu = [
      {
        text: '目录',
        name: 'catalog',
        state: 'read-active',
        view: 'read-catalog-body',
        prompt: '无目录'
      },
      {
        text: '笔记',
        name: 'note',
        state: '',
        view: 'read-note-body',
        prompt: '阅读时长按文字可添加笔记'
      },
      {
        text: '书签',
        name: 'bookmark',
        state: '',
        view: 'read-bookmark-body',
        prompt: '阅读时下拉添加书签'
      }
    ];
    this.opts = $.extend(true, {}, defaults, options);
    // 根据开关的值, 移除相应 "导航菜单".
    if (!this.opts.useBookmark) {
      // 移除 书签.
      defaultMenu.pop();
    }
    if (!this.opts.useNote) {
      // 移除 笔记.
      defaultMenu.splice(1, 1);
    }
    // 自定义导航,添加默认样式, 'read-custom-body';
    var tmpCustomNavs = this.opts.data;
    for (var j = 0, len = tmpCustomNavs.length; j < len; j++) {
      tmpCustomNavs[j].view = 'read-custom-body';
      tmpCustomNavs[j].state = tmpCustomNavs[j].state || '';
    }
    this.opts.data = defaultMenu.concat(this.opts.data);
    // 自定义导航菜单 最多支持 2 个. 
    if (this.opts.data.length > 5) {
      this.opts.data = this.opts.data.slice(0, 5);
    }
    // add by gli-hxy 把自定义导航的函数取出来
    this.customFunc = [];
    for (var i = 0; i < this.opts.data.length; i++) {
      var cbFunc = this.opts.data[i].cbFunc || tool.emptyFunc;
      this.customFunc.push(cbFunc);
    }
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  CbnPanel.prototype._init = function () {
    console.log('[panelCbn.js] --> _init! ');
    this._renderLayout();
    this._bindEvent();
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  CbnPanel.prototype._renderLayout = function () {
    var optsObj = this.opts;
    var that = this;
    // 利用 模板 生成HTML
    var templObj = _.template(optsObj.templHtml);
    var panelHtml = templObj();
    // 转化 zepto 对象;
    optsObj.$domObj = $(panelHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
    optsObj.$headerObj = optsObj.$domObj.find('.read-header-nav');
    optsObj.$bodyObj = optsObj.$domObj.find('.read-body');
    // 头部导航菜单.
    var navTemplObj = _.template(optsObj.templHeadHtml);
    var headNavMenuHtml = navTemplObj(optsObj.data);
    optsObj.$headerObj.append(headNavMenuHtml);
    // 导航子内容
    var bodyTemplObj = _.template(optsObj.templBodyHtml);
    var bodyHtml = bodyTemplObj(optsObj.data);
    optsObj.$bodyObj.append(bodyHtml);
    // 目录
    var $catalogWrap = optsObj.$bodyObj.find('.read-catalog-body');
    this.$catalogWrapBody = $catalogWrap;
    this.catalogObj = new Catalog({
      wrapObj: $catalogWrap,
      tmplHtml: optsObj.templCatalogHtml,
      isMobile: optsObj.isMobile
    });
    // 书签
    var $bookmarkWrap = optsObj.$bodyObj.find('.read-bookmark-body');
    this.$bookmarkWrapBody = $bookmarkWrap;
    this.bookmarkObj = null;
    if (optsObj.useBookmark) {
      this.bookmarkObj = new Bookmark({
        wrapObj: $bookmarkWrap,
        $readerObj: optsObj.$readerObj,
        tmplHtml: optsObj.templBookmarkHtml,
        isMobile: optsObj.isMobile,
        isClient: optsObj.isClient,
        markDomObj: optsObj.$readerObj.find('.read-panel.read-selector-main>.read-header .read-bookmark-view'),
        saveFile: optsObj.saveFile,
        filePath: optsObj.bookmarkFilePath,
        api: optsObj.api
      });
    }
    //笔记
    var $noteWrap = optsObj.$bodyObj.find('.read-note-body');
    this.$noteWrapBody = $noteWrap;
    this.noteObj = null;
    if (optsObj.useNote) {
      this.noteObj = new Note({
        $readerObj: optsObj.$readerObj,
        wrapObj: $noteWrap,
        tmplHtml: optsObj.templNoteHtml,
        isMobile: optsObj.isMobile,
        isClient: optsObj.isClient,
        saveFile: optsObj.saveFile,
        filePath: optsObj.noteFilePath,
        editHtml: optsObj.editHtml,
        detailHtml: optsObj.detailHtml,
        shareHtml: optsObj.shareHtml,
        api: optsObj.api,
        note_share_conf: optsObj.note_share_conf
      });
    }
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  CbnPanel.prototype._bindEvent = function () {
    var optsObj = this.opts;
    var eventName = optsObj.isMobile ? 'tap' : 'click';
    var that = this;
    // 继续阅读.
    optsObj.$domObj.find('.read-back-read').on(eventName, function () {
      // 取消有删除状态的书签
      //              that.bookmarkObj.cancelDel();
      if (tool.hasFunction(that.bookmarkObj, 'cancelDel')) {
        that.bookmarkObj.cancelDel();
      }
      that.close();
    });
    // 当前选中导航菜单的 内容面板.
    var $tmpCurrentNavBody = null;
    optsObj.$headerObj.on(eventName, 'div', function () {
      var idx = $(this).index();
      $(this).addClass('read-active').siblings().removeClass('read-active');
      // 取消有删除状态的书签
      //              that.bookmarkObj.cancelDel();
      //              that.noteObj.cancelDel();
      if (tool.hasFunction(that.bookmarkObj, 'cancelDel')) {
        that.bookmarkObj.cancelDel();
      }
      if (tool.hasFunction(that.noteObj, 'cancelDel')) {
        that.noteObj.cancelDel();
      }
      $tmpCurrentNavBody = optsObj.$bodyObj.children().eq(idx);
      $tmpCurrentNavBody.show().siblings().hide();
      // add by gli-hxy 判断是不是点击的自定义导航栏
      if ($tmpCurrentNavBody.hasClass('read-custom-body')) {
        that.customFunc[idx]($tmpCurrentNavBody);
      }
    });
    // 目录-自定义事件
    this.$catalogWrapBody.on('catalog:click', function (event, params) {
      // TODO, 章节内容切换, 回到阅读主页面.
      console.log('[panelCbn.js] 你点击了目录! -> id:' + params.id + ', status:' + params.status);
      optsObj.$domObj.trigger('cbncatalog:click', params);
    });
    // 书签-自定义点击事件
    this.$bookmarkWrapBody.on('bookmark:click', function (event, percent) {
      console.log('[panelCbn.js] 你点击了书签 -! ->');
      optsObj.$domObj.trigger('cbnbookmark:click', percent);
    });
  };
  /**
   * 获取面板对象. <br/>
   * 
   */
  CbnPanel.prototype.getPanelObject = function () {
  };
  /**
   * 获取 用户自定义菜单之 body. <br/>
   * 
   * @param position {Number} 自定义菜单坐标. 如: 1 -- 第一个自定义菜单.
   * 
   * @return 
   * 
   */
  CbnPanel.prototype.getCustomNavBody = function (position) {
    console.log('[CbnPanel] --> getCustomNavBody');
  };
  /**
   * 渲染 目录. <br/>
   * 
   * @param data {Object} 目录信息.
   * 
   */
  CbnPanel.prototype.renderCatalog = function (data) {
    this.catalogObj.renderLayout(data);
  };
  /**
   * 渲染 书签. <br/>
   * 
   * @param data {Object} 书签信息.
   * 
   */
  CbnPanel.prototype.renderBookmark = function (data) {
    this.bookmarkObj.renderLayout(data);
  };
  /**
   * 新增 书签. <br/>
   * 
   * @param data {Object} 书签显示dom (zepto对象).
   * 
   */
  CbnPanel.prototype.updateBookmarks = function (data) {
    console.log('[panelCbn.js]--> updateBookmarks');
    //          this.bookmarkObj.updateBookmarks(data);
    if (tool.hasFunction(this.bookmarkObj, 'updateBookmarks')) {
      this.bookmarkObj.updateBookmarks(data);
    }
  };
  /**
   * 获取 书签对象. <br/>
   * 
   */
  CbnPanel.prototype.getBookmarkData = function () {
    console.log('[panelCbn.js]--> getBookmarkData');
    return this.bookmarkObj.getBookmarks();
  };
  /**
   * 显示 书签标记. <br/>
   * 
   */
  CbnPanel.prototype.showBookmark = function (data) {
    console.log('[panelCbn.js]--> showBookmark');
    //          this.bookmarkObj.isShowBookmark(data);
    if (tool.hasFunction(this.bookmarkObj, 'isShowBookmark')) {
      this.bookmarkObj.isShowBookmark(data);
    }
  };
  /**
   * 渲染 笔记. <br/>
   * 
   * @param data {Object} 笔记信息.
   * 
   */
  CbnPanel.prototype.renderNote = function (data) {
    this.noteObj.renderLayout(data);
  };
  /**
   * 打开面板. <br/>
   * 
   */
  CbnPanel.prototype.open = function () {
    var optsObj = this.opts;
    optsObj.$domObj.show();
    setTimeout(function () {
      move(optsObj.wrapDomId + ' .read-cbn-panel').set('top', '0').duration('0.5s').end();
    }, 10);
  };
  /**
   * 关闭面板. <br/>
   * 
   */
  CbnPanel.prototype.close = function () {
    var optsObj = this.opts;
    move(optsObj.wrapDomId + ' .read-cbn-panel').set('top', '100%').duration('0.5s').end();
    setTimeout(function () {
      optsObj.$domObj.hide();
    }, 500);
  };
  /**
   * 注册 自定义 监听事件. <br/>
   * 
   * @param eventName {String}   事件名称, "catalog:click",  "cbncatalog:click"
   * @param cb        {Function} 回调事件
   * 
   */
  CbnPanel.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  return CbnPanel;
}(js_src_global, js_src_catalog, js_src_bookmark, js_src_note, move, js_libs_zeptodev, js_src_tool);
js_src_panelComplaint = function (window, move, $, dialog, Msg) {
  var _ = window._;
  var ComplaintPanel = function (options) {
    var defaults = {
      $readerObj: null,
      complainHtml: '',
      // 版权投诉 面板
      $domObj: null,
      isMobile: true,
      api: null
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  ComplaintPanel.prototype._init = function () {
    console.log('[ComplaintPanel] --> _init');
    this._renderLayout();
    this._bindEvent();
    this.dialog = new dialog({ $wrapDomObj: this.opts.$domObj });
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  ComplaintPanel.prototype._renderLayout = function () {
    var optsObj = this.opts;
    var complainTemplObj = _.template(optsObj.complainHtml);
    var complainHtml = complainTemplObj();
    // 版权投诉 dom
    optsObj.$domObj = $(complainHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  ComplaintPanel.prototype._bindEvent = function () {
    var that = this;
    var optsObj = that.opts;
    // 确定事件类型.
    var eventType = optsObj.isMobile ? 'tap' : 'click';
    // 关闭版权投诉面板 -- 取消
    optsObj.$domObj.find('.read-header .read-cancel').on(eventType, function () {
      var val = optsObj.$domObj.find('.read-body textarea').val();
      optsObj.$domObj.find('.read-body textarea').blur();
      that.cancel(val);
    });
    // 发送版权投诉信息
    optsObj.$domObj.find('.read-header .read-send').on(eventType, function () {
      var val = optsObj.$domObj.find('.read-body textarea').val();
      that.sendComplaint(val);
    });
  };
  /**
   * 打开版权投诉面板. <br/>
   * 
   */
  ComplaintPanel.prototype.open = function () {
    var that = this;
    var optsObj = that.opts;
    optsObj.$domObj.show();
    setTimeout(function () {
      move(optsObj.$domObj[0]).set('top', '0px').duration('0.3s').end();
    }, 10);
  };
  /**
   * 取消版权投诉面板. <br/>
   * 
   */
  ComplaintPanel.prototype.cancel = function (value) {
    var that = this;
    var optsObj = that.opts;
    // 取消后的提示框
    that.cancelDialog = new dialog({
      $wrapDomObj: this.opts.$domObj,
      okBtn: {
        txt: '继续编辑',
        cssClass: '',
        func: function () {
          optsObj.$domObj.find('.read-body textarea').focus();
        }
      },
      cancelBtn: {
        txt: '离开',
        cssClass: '',
        func: function () {
          that.close();
        }
      }
    });
    // 判断是否输入了内容
    if (value) {
      that.cancelDialog.setMsg(Msg.compCancel);
      that.cancelDialog.open();
    } else {
      that.close();
    }
  };
  /**
   * 关闭版权投诉面板. <br/>
   * 
   */
  ComplaintPanel.prototype.close = function () {
    var that = this;
    var optsObj = that.opts;
    // 清空数据
    optsObj.$domObj.find('.read-body textarea').val('');
    move(optsObj.$domObj[0]).set('top', '-101%').duration('0.2s').end();
    setTimeout(function () {
      optsObj.$domObj.hide();
    }, 200);
  };
  /**
   * 发送版权保护信息. <br/>
   * 
   * @param {String} val 投诉内容
   * 
   */
  ComplaintPanel.prototype.sendComplaint = function (val) {
    var that = this;
    var optsObj = that.opts;
    var sendBtn = optsObj.$domObj.find('.read-header .read-send');
    // 发送成功后的提示框
    that.sucessDialog = new dialog({
      $wrapDomObj: this.opts.$domObj,
      okBtn: {
        txt: '确定',
        cssClass: '',
        func: function () {
          that.close();
        }
      },
      cancelBtn: {
        txt: '离开',
        cssClass: '',
        func: function () {
          that.close();
        }
      }
    });
    // 验证传送内容是否为空
    if (val.length != 0) {
      // 控制投诉间隔时间
      var nowTime = new Date().getTime();
      var deltaTime = sendBtn.attr('data-complaint') ? nowTime - sendBtn.attr('data-complaint') : nowTime;
      if (deltaTime > 20000) {
        optsObj.loading.setMsg(Msg.dealWith);
        optsObj.loading.open();
        optsObj.api.sendComplaint({ 'complaint_val': val }, function (data) {
          optsObj.loading.close();
          if (data.status) {
            that.sucessDialog.setMsg(Msg.compSucess);
            that.sucessDialog.open();
            sendBtn.attr('data-complaint', new Date().getTime());
          } else {
            that.sucessDialog.setMsg(data.error);
            that.sucessDialog.open();
          }
        }, function () {
          optsObj.loading.close();
          that.dialog.setMsg(Msg.sendError);
          that.dialog.open();
        });
      } else {
        that.dialog.setMsg(Msg.compInterval);
        that.dialog.open();
      }
    } else {
      that.dialog.setMsg(Msg.inputContent);
      that.dialog.open();
    }
  };
  return ComplaintPanel;
}(js_src_global, move, js_libs_zeptodev, js_src_widget_plugDialog, js_src_message_zh);
js_src_panelSearch = function (window, move, $, dialog, Msg) {
  var _ = window._;
  // 搜索历史html
  var hisTmplHtml = '<div class="read-history-title"><span class="read-icon"></span><span class="read-font">搜索历史</span></div>' + '<ul> <% _.each(obj, function(search){  %> ' + '<li class="read-cf"><span class="read-lf read-text-over read-search-val"><%= search.keyword %></span><span class="read-rt"><%= search.time %></span></li> ' + '<% }); %> </ul>' + '<div class="read-history-btn"><a class="read-clear-search read-icon-hv-center"><span class="read-icon"></span>清空搜索历史</a></div>';
  // 搜索结果html
  var searchResTemplHtml = '<ul class="read-cf"> <% _.each(obj.search_list, function(search_list){  %>' + '<li class="read-cf" data-site="<%= search_list.search_page %>">' + '<div class="read-search-text"><%= search_list.search_text %></div>' + '<div class="read-search-page read-rt"><%= (parseFloat(search_list.search_page)*100).toFixed(4) + "%" %></div>' + '</li>' + '<% }); %> </ul>';
  var SearchPanel = function (options) {
    var defaults = {
      $readerObj: null,
      searchHtml: '',
      // 搜索 面板
      $domObj: null,
      isMobile: true,
      api: null,
      hisTempl: _.template(hisTmplHtml),
      searchResTempl: _.template(searchResTemplHtml)
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  SearchPanel.prototype._init = function () {
    console.log('[SearchPanel] --> _init');
    var optsObj = this.opts;
    if (optsObj.isClient) {
      // 离线搜索
      this.sendSearch = this.sendSearchOffline;
    } else {
      //在线搜索
      this.sendSearch = this.sendSearchOnline;
    }
    this._renderLayout();
    this._bindEvent();
    this.dialog = new dialog({ $wrapDomObj: this.opts.$domObj });
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  SearchPanel.prototype._renderLayout = function () {
    var optsObj = this.opts;
    var searchTemplObj = _.template(optsObj.searchHtml);
    var searchHtml = searchTemplObj();
    // 搜索 dom
    optsObj.$domObj = $(searchHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  SearchPanel.prototype._bindEvent = function () {
    var that = this;
    var optsObj = that.opts;
    // 确定事件类型.
    var eventType = optsObj.isMobile ? 'tap' : 'click';
    // 关闭搜索面板 -- 取消
    optsObj.$domObj.find('.read-header .read-cancel').on(eventType, function () {
      optsObj.$domObj.find('.read-header .read-search-ipt-box .read-search-ipt').blur();
      that.close();
    });
    // 发送搜索信息
    optsObj.$domObj.find('.read-header .read-send').on(eventType, function () {
      var val = optsObj.$domObj.find('.read-header .read-search-ipt').val();
      that.sendSearch(val);
    });
    // 点击历史搜索
    optsObj.$domObj.on(eventType, '.read-search-history li', function (e) {
      console.log('[panelSearch.js] -- > 点击搜索历史');
      that.sendSearch($(this).find('.read-search-val').text());
    });
    // 点击清空历史搜索
    optsObj.$domObj.on(eventType, '.read-search-history .read-clear-search', function (e) {
      console.log('[panelSearch.js] -- > 点击清空搜索历史');
      optsObj.$domObj.find('.read-search-history').html('');
      that.delSearchHis();
    });
    // 点击搜索结果跳转
    optsObj.$domObj.on(eventType, '.read-search-result li', function (e) {
      console.log('[panelSearch.js] -- > 点击搜索历史');
      that.close();
      optsObj.$domObj.trigger('search:click', parseFloat($(this).attr('data-site')));
    });
  };
  /**
   * 打开搜索面板. <br/>
   * 
   */
  SearchPanel.prototype.open = function () {
    var that = this;
    var optsObj = that.opts;
    optsObj.$domObj.show();
    setTimeout(function () {
      move(optsObj.$domObj[0]).set('top', '0px').duration('0.3s').end();
    }, 10);
    //获取搜索历史记录
    optsObj.api.getSearchHistory({}, function (result) {
      if (result.search_history.length != 0) {
        var hisHtml = optsObj.hisTempl(result.search_history);
        optsObj.$domObj.find('.read-search-history').show().html(hisHtml);
      }
    }, function () {
    });
  };
  /**
   * 关闭搜索面板. <br/>
   * 
   */
  SearchPanel.prototype.close = function () {
    var that = this;
    var optsObj = that.opts;
    // 隐藏搜索结果和搜索历史
    optsObj.$domObj.find('.read-search-result').hide();
    optsObj.$domObj.find('.read-search-history').hide();
    move(optsObj.$domObj[0]).set('top', '-101%').duration('0.2s').end();
    setTimeout(function () {
      optsObj.$domObj.show();
    }, 200);
  };
  /**
   * 发送搜索keyword  Offline. <br/>
   * 
   * @param {String} val 关键字
   * 
   */
  SearchPanel.prototype.sendSearchOffline = function (val) {
    var that = this;
    var optsObj = that.opts;
    // TODO 需和phoneGap调试接口
    if (typeof gli_search_offline != 'function') {
      that.sendSearchOnline(val);
    } else {
      // 验证传送内容是否为空
      if (val.length != 0) {
        // loading
        optsObj.loading.open();
        optsObj.loading.setMsg(Msg.nowSearch);
        // 传给客户端搜索
        gli_search_offline({ 'keyword': val }, function (result) {
          optsObj.loading.close();
          if (result.length != 0) {
            // 隐藏搜索历史
            optsObj.$domObj.find('.read-search-history').hide();
            // 显示搜索结果
            var searchResHtml = optsObj.searchResTempl(result);
            optsObj.$domObj.find('.read-search-result').show().html(searchResHtml);
          }
        }, function () {
          optsObj.loading.close();
          that.dialog.setMsg(Msg.sendError);
          that.dialog.open();
        });
      } else {
        console.log('%c [panelSearch] sendSearch--> 请输入搜索内容', 'color:red;');
        that.dialog.setMsg(Msg.inputContent);
        that.dialog.open();
      }
    }
  };
  /**
   * 发送搜索keyword  Online. <br/>
   * 
   * @param {String} val 关键字
   * 
   */
  SearchPanel.prototype.sendSearchOnline = function (val) {
    var that = this;
    var optsObj = that.opts;
    // 验证传送内容是否为空
    if (val.length != 0) {
      // loading
      optsObj.loading.open();
      optsObj.loading.setMsg(Msg.nowSearch);
      optsObj.api.search({ 'keyword': val }, function (data) {
        var result = data.data;
        optsObj.loading.close();
        if (data.status) {
          if (result.search_list.length > 0) {
            // 隐藏搜索历史
            optsObj.$domObj.find('.read-search-history').hide();
            // 显示搜索结果
            var searchResHtml = optsObj.searchResTempl(result);
            optsObj.$domObj.find('.read-search-result').show().html(searchResHtml);
          } else {
            that.dialog.setMsg(Msg.emptySearch);
            that.dialog.open();
          }
        } else {
          that.dialog.setMsg(data.msg);
          that.dialog.open();
        }
      }, function () {
        optsObj.loading.close();
        that.dialog.setMsg(Msg.sendError);
        that.dialog.open();
      });
    } else {
      that.dialog.setMsg(Msg.inputContent);
      that.dialog.open();
      console.log('%c [panelSearch] sendSearch--> 请输入搜索内容', 'color:red;');
    }
  };
  /**
   * 清空搜索记录
   */
  SearchPanel.prototype.delSearchHis = function () {
    var that = this;
    var optsObj = that.opts;
    optsObj.api.delSearchHis({}, function () {
      console.log('%c [panelSearch] 清除历史搜索成功', 'background:green;');
    }, function () {
    });
  };
  return SearchPanel;
}(js_src_global, move, js_libs_zeptodev, js_src_widget_plugDialog, js_src_message_zh);
js_src_dom = function (window, Tool) {
  return {
    /**
     * 创建div <br>.
     * 
     * @param {String} html 字符串
     */
    createElementByHtml: function (html) {
      var temp = document.createElement('div');
      temp.innerHTML = html;
      return temp.children.length == 1 ? temp.children[0] : temp.childNodes;
    },
    /**
     * 克隆元素 <br>.
     * 
     * @param {Object} elem DOM元素
     */
    cloneElemnt: function (elem) {
      if (elem.nodeValue) {
        return document.createTextNode(elem.nodeValue);
      }
      return this.createElementByHtml(elem.outerHTML);
    },
    /**
     * 获取子元素 <br>.
     * 
     * @param {Object} elem
     */
    getElementChild: function (elem) {
      var children = elem.childNodes || [];
      var result = [];
      for (var i = 0; i < children.length; i++) {
        if (children[i].nodeName === '#text' && Tool.trim(children[i].nodeValue) === '') {
          continue;
        }
        result.push(children[i]);
      }
      return result;
    },
    /**
     * 获取元素标签 <br>.
     * 
     * @param {Object} elem
     */
    getElementOutTag: function (elem) {
      if (elem.nodeValue) {
        return Tool.trim(elem.nodeValue);
      }
      var tmpOuterHtml = '';
      if (elem.innerHTML.length == elem.nodeName.length) {
        var firstIdx = elem.outerHTML.indexOf('>');
        var tmpTagHTML = elem.outerHTML.substring(0, firstIdx);
        tmpOuterHtml = elem.outerHTML.substr(firstIdx);
        tmpOuterHtml = tmpOuterHtml.replace(elem.innerHTML, '');
        tmpOuterHtml = tmpTagHTML + tmpOuterHtml;
        tmpOuterHtml = Tool.trim(tmpOuterHtml);
      } else {
        tmpOuterHtml = Tool.trim(elem.outerHTML.replace(elem.innerHTML, ''));
      }
      return tmpOuterHtml;
    },
    /**
     * 拆分文本节点 <br>.
     * 
     * @param {Object} elem Dom 对象
     * @param {Number} size 
     * 
     */
    splitTextNode: function (elem, size) {
      //如果不是#Text节点,或者是空白节点,拆分失败
      if (elem.nodeName != '#text' || Tool.trim(elem.nodeValue) === '') {
        return false;
      }
      //去掉首尾空白
      var nodeValue = Tool.trim(elem.nodeValue);
      //只有一个字符 ,拆分失败
      if (nodeValue.length <= 1) {
        return false;
      }
      //开始拆分
      size = size || nodeValue.length;
      size = 2;
      var values = [];
      var maxLength = nodeValue.length;
      for (var i = 0; i < size; i++) {
        values.push(nodeValue.substr(maxLength / size * i, maxLength / size + size * i));
      }
      //合并插入
      var elem_frag = document.createDocumentFragment();
      for (var i = 0; i < values.length; i++) {
        var child = document.createTextNode(values[i]);
        elem_frag.appendChild(child);
      }
      elem.parentNode.insertBefore(elem_frag, elem);
      //移除被拆分的节点
      elem.parentNode.removeChild(elem);
      return true;
    },
    /**
     * 拆分文本，每个字包裹一个标签span. <br/>
     * 
     * @param {Object} elem Dom 对象
     */
    splitTextTab: function (elem) {
      //如果是空白节点,拆分失败
      if (Tool.trim(elem.nodeValue) === '') {
        return false;
      }
      //开始拆分
      var wordReg = /(([\w_\.%]+)|([^\2]))/gi;
      var html = '';
      html = elem.nodeValue.replace(wordReg, function (txt) {
        return '<span class="reader-minNode">' + txt + '</span>';
      });
      var span = document.createElement('span');
      elem.parentNode.insertBefore(span, elem);
      elem.parentNode.removeChild(elem);
      span.outerHTML = html;
      return true;
    },
    /**
     * 1.将IMG的src属性更换为data-src; <br/>
     * 2.根据data-width/data-height初始化IMG大小. <br/>
     *
     * @param {Object} dom 待操作的dom.
     * @param {String} path图片下载地址
     * @param {Number} pageW 页面宽度
     * @param {Number} pageH 页面高度
     * 
     * @return {Array} images {
     *              gli_image_num: 图片序号,
     *              name: 图片名字带后缀,
     *              old_src: 源地址, http://static.spbook2.gli.cn//images/icon.png
     *              new_src: 本地地址  C:\Users\Administrator\AppData\Local\Temp\Readercache_glipps/icon.png
     *         }
     */
    replaceImgSrc: function (isClient, pageW, pageH, dom, path, fontSize) {
      var elem_svg = dom.querySelectorAll('svg');
      for (var n = 0, len = elem_svg.length; n < len; n++) {
        elem_svg[n].setAttribute('width', 0);
        elem_svg[n].setAttribute('height', 0);
        elem_svg[n].removeAttribute('viewBox');
      }
      var elem_image = dom.querySelectorAll('image');
      for (var n = 0, len = elem_image.length; n < len; n++) {
        var imageSrc = elem_image[n].getAttribute('xlink:href') || '';
        elem_image[n].src = imageSrc;
        elem_image[n].setAttribute('src', imageSrc);
        elem_image[n].outerHTML = elem_image[n].outerHTML.replace(/image/gi, 'img');
      }
      var elem_img = dom.querySelectorAll('img');
      var tmpImg = null;
      var img_src = '';
      var img_new_src = '';
      var img_name = '';
      var img_type = '';
      var arrayTemp = [];
      var images = [];
      // pageW = 屏幕的宽度，pageH = 屏幕的高度 * 0.7
      pageW = pageW - 5;
      pageH = 0.7 * (pageH - 5);
      for (var i = 0, len = elem_img.length; i < len; i++) {
        tmpImg = elem_img[i];
        img_type = tmpImg.getAttribute('type') || '';
        img_src = tmpImg.getAttribute('src') || '';
        if (img_src != '') {
          arrayTemp = img_src.split('/');
          img_name = arrayTemp[arrayTemp.length - 1];
          img_new_src = path + img_name;
          tmpImg.removeAttribute('src');
        } else {
          img_name = '';
          img_new_src = '';
        }
        // 如果是字体图片
        if (img_type != 'font') {
          tmpImg.setAttribute('data-src', isClient ? img_new_src : img_src);
          tmpImg.setAttribute('data-index', i + 1);
          var imgSpan = document.createElement('span');
          imgSpan.setAttribute('class', 'read-not-publish');
          imgSpan.style.display = 'none';
          imgSpan.innerHTML = '图片';
          // TODO 在所有的图片后插入一个SPAN,目的:在text中占位。 20160816
          this.insertAfter(imgSpan, tmpImg);
          // 存储图片src地址等信息
          images.push({
            'gli_image_num': i + 1,
            'name': img_name,
            'old_src': img_src,
            'new_src': img_new_src,
            'type': img_type
          });
        }
        var pageDataW = parseInt(tmpImg.getAttribute('data-width')) || 0;
        var pageDataH = parseInt(tmpImg.getAttribute('data-height')) || 0;
        // 字体图标
        if (img_type == 'font') {
          tmpImg.setAttribute('data-src', img_src);
          tmpImg.style.width = '';
          tmpImg.style.height = '';
          tmpImg.style.maxWidth = '';
          tmpImg.style.maxHeight = fontSize + 'px';
          // pageDataW = pageDataH == 0 ? fontSize : pageDataW * fontSize / pageDataH;
          // 如果pageDataH == 0 时下面的pageDataW为NAN,不用上面那样是为了让图片没有宽度,让图片自己等比缩放
          pageDataW = pageDataW * fontSize / pageDataH;
          pageDataH = fontSize;
          pageDataW = pageDataW < fontSize ? fontSize : pageDataW;
          tmpImg.setAttribute('width', pageDataW + 'px');
          tmpImg.setAttribute('height', pageDataH + 'px');
        } else if (isNaN(pageDataW) || pageDataW == 0) {
          tmpImg.setAttribute('width', pageW * 0.3 + 'px');
          tmpImg.setAttribute('height', pageH * 0.5 + 'px');
        } else {
          tmpImg.setAttribute('width', pageDataW + 'px');
          tmpImg.setAttribute('height', pageDataH + 'px');
          tmpImg.style.maxWidth = pageW + 'px';
          tmpImg.style.maxHeight = pageH + 'px';
        }
      }
      return images;
    },
    /**
     * 设置视频的宽高. <br/>
     * 
     * @param {Object} dom
     * @param {Object} pageW
     * @param {Object} pageH
     * 
     * @return {Array} videos {
     *              gli_video_num: 视频序号（从1开始）,
     *              name: 视频名字,
     *              src: 源地址, http://static.spbook2.gli.cn//videos/movie.mp4
     *         }
     */
    replaceVideoSrc: function (pageW, pageH, dom) {
      var elem_video = dom.querySelectorAll('video');
      var tmpVideo = null;
      var temSource = null;
      var video_src = '';
      var video_name = '';
      var video_type = '';
      var arrayTemp = [];
      var videos = [];
      // pageW = 屏幕的宽度，pageH = 屏幕的高度 * 0.7
      pageW = pageW - 5;
      pageH = pageH - 5;
      for (var i = 0, len = elem_video.length; i < len; i++) {
        tmpVideo = elem_video[i];
        temSource = tmpVideo.querySelector('source');
        video_src = temSource.getAttribute('src') || '';
        video_type = temSource.getAttribute('type') || '';
        if (video_src != '') {
          arrayTemp = video_src.split('/');
          // 视频名（首先取设置的其次取路径上的）
          video_name = tmpVideo.getAttribute('data-name') || arrayTemp[arrayTemp.length - 1];
        }
        temSource.removeAttribute('src');
        temSource.setAttribute('data-src', video_src);
        temSource.setAttribute('data-index', i + 1);
        videos.push({
          'gli_video_num': i + 1,
          'name': video_name,
          'src': video_src,
          'type': video_type
        });
        var pageDataW = parseInt(tmpVideo.getAttribute('data-width')) || 0;
        var pageDataH = parseInt(tmpVideo.getAttribute('data-height')) || 0;
        if (isNaN(pageDataW) || pageDataW == 0) {
          var tmpWidth = pageW > pageH ? pageH : pageW;
          tmpVideo.setAttribute('width', tmpWidth + 'px');
          tmpVideo.setAttribute('height', tmpWidth * 0.75 + 'px');
        } else {
          if (pageDataW > pageW) {
            pageDataH = pageDataH * pageW / pageDataW;
            pageDataW = pageW;
          }
          if (pageDataH > pageH) {
            pageDataW = pageDataW * pageH / pageDataH;
            pageDataH = pageH;
          }
          tmpVideo.setAttribute('width', pageDataW + 'px');
          tmpVideo.setAttribute('height', pageDataH + 'px');
        }
      }
      return videos;
    },
    /**
     * 1.恢复IMG的src属性;  <br/>
     * 2.缩小图片绑定放大事件. <br/>
     *
     * @param {Object} dom 待操作的dom.
     */
    loadImgSrc: function (dom) {
      var elem_img = dom.querySelectorAll('img');
      var tmpImg = null;
      var img_src = '';
      for (var i = 0; i < elem_img.length; i++) {
        tmpImg = elem_img[i];
        img_src = tmpImg.getAttribute('data-src');
        tmpImg.removeAttribute('data-src');
        tmpImg.setAttribute('src', img_src);
      }  // 缩小图片绑定放大事件
         //Dom.bindImgPreview(dom);
    },
    /**
     * 在节点后插入新节点. <br/>
     * 
     * @param {Object} newElement
     * @param {Object} targetElement
     */
    insertAfter: function (newElement, targetElement) {
      var parent = targetElement.parentNode;
      if (parent.lastChild == targetElement) {
        // 如果最后的节点是目标元素，则直接添加。因为默认是最后
        parent.appendChild(newElement);
      } else {
        //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
        parent.insertBefore(newElement, targetElement.nextSibling);
      }
    },
    /**
     * 原稿图-预处理.<br/>
     * 
     * 如果 原稿图满足 分页要求, 设置属性 [islast='1']
     * 
     */
    doManuscriptPic: function (domObj) {
      var imgList = domObj.getElementsByTagName('img');
      var imgItem = null;
      var nextSibling = null;
      var nextDomSibling = null;
      //单张原稿 OR 连续多张原稿的最后一张 会将设置 自定义属性 islast = '1'
      for (var i = 0, len = imgList.length; i < len; i++) {
        imgItem = imgList[i];
        if (imgItem.getAttribute('type') == 'exp') {
          // 1. 默认可分页
          imgItem.setAttribute('islast', '1');
          // 2. [一文多图] 只认定 最后一张图可分页
          if (!!imgItem.nextElementSibling && imgItem.nextElementSibling.nodeName == 'IMG' && imgItem.nextElementSibling.getAttribute('type') == 'exp') {
            // 后跟 连续节点为 原稿图  
            imgItem.setAttribute('islast', '0');
          }
          // 3. 未被标签包裹的 "纯文字"可分页(nextSibling 不同于 nextElementSibling)
          if (imgItem.nextSibling.nodeName == '#text' && imgItem.nextSibling.nodeValue.replace(/(^\s*)|(\s*$)/g, '').length != 0) {
            imgItem.setAttribute('islast', '1');
          }
        }
      }
    }
  };
}(js_src_global, js_src_tool);
js_src_widget_plugProgressBar = function (window, $) {
  var ProgressBar = function (options) {
    console.log('[ProgressBar] -> 构造函数!');
    var defaults = {
      $domObj: null,
      barWrapColor: '',
      // 进度条背景颜色
      barColor: 'rgba(236, 106, 33, 1)',
      //进度条颜色
      styleVal: 'bottom: 0',
      height: '2px',
      value: 0
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  ProgressBar.prototype._init = function () {
    var optsObj = this.opts;
    if (!this._check()) {
      return false;
    }
    this._setLayout();
  };
  /**
   * 传入数据 合法性验证. <br/>
   * 
   * @return checkVal {Boolean} true: 合法, false: 非法。
   */
  ProgressBar.prototype._check = function () {
    var optsObj = this.opts;
    var checkVal = true;
    if (optsObj.$domObj.length === 0) {
      console.warn('[ProgressBar]: 请传入合法 dom 选择器!');
      checkVal = false;
    }
    return checkVal;
  };
  /**
   * 设置分页器进度条布局. <br/>
   * 
   */
  ProgressBar.prototype._setLayout = function () {
    var optsObj = this.opts;
    var value = optsObj.value / 100 || 0;
    var $BarObj = $('<div class="read-progressbar" style="height: 100%">');
    this.$BarWrapObj = $('<div class="read-progressbar-wrap" ' + 'style="width: 100%; position: absolute; ' + optsObj.styleVal + '">');
    this.$BarWrapObj.css('background-color', optsObj.barWrapColor);
    this.$BarWrapObj.css('height', optsObj.height);
    $BarObj.css('background-color', optsObj.barColor);
    $BarObj.css('width', value + '%');
    this.$BarWrapObj.append($BarObj);
    optsObj.$domObj.append(this.$BarWrapObj);
  };
  /**
   * 设置进度条显示值. <br/>
   * 
   * @param {Number} val 进度条值(int: 0-100)
   */
  ProgressBar.prototype.setValue = function (val) {
    var optsObj = this.opts;
    optsObj.value = val;
    this.$BarWrapObj.find('.read-progressbar').css('width', val + '%');
  };
  /**
   * 打开进度条. <br/>
   * 
   */
  ProgressBar.prototype.open = function () {
    var optsObj = this.opts;
    optsObj.value = 0;
    this.$BarWrapObj.show();
  };
  /**
   * 关闭进度条. <br/>
   * 
   */
  ProgressBar.prototype.close = function () {
    var optsObj = this.opts;
    this.$BarWrapObj.hide();
  };
  /**
   * 销毁进度条. <br/> 
   * 
   */
  ProgressBar.prototype.destroy = function () {
    // 移除HTML 标签.
    this.$BarWrapObj.remove();
  };
  return ProgressBar;
}(js_src_global, js_libs_zeptodev);
js_src_countPage = function (window, Dom, progressBar, Dialog, $, Tool, Msg) {
  var CountPage = function (options) {
    var defaults = {
      templHtml: '',
      $domObj: null,
      // 分页器内容显示dom
      $countPageObj: null,
      // 分页器根dom
      $readerObj: null,
      isMobile: true,
      getHtml: '',
      pageW: 0,
      pageH: 0,
      auto: false,
      // true 自动算页， false 手动算页
      step: 4,
      // 算好4页回调一次pages
      state: 0,
      // 分页状态：1表示准备分页/正在分页,0表示分页结束
      direction: 'next',
      // 翻页方向, 'prev'向前翻页, 'next'向后翻页
      pages: [],
      allPages: [],
      useEpubStyle: false,
      //是否使用epub的内部样式表
      totalLen: 0,
      // 数据文字总数.
      /**
       *  {Object} chapts
       *  {
       *      'chapter_id':       章节ID 
       *      'chapter_name':     章节名称
       *      'chapter_status':   本章是否能读 {Boolean} true: 可读， false: 不可读
       *      'chapter_url':      "http://xxx/book_01", // HTML地址,不经过阅读器分页计算
       *      'textlen':          字数 ps:2191
       *      'isDownload':       是否下载
       *      'pages':            分页信息{Array} html,txt,textlen
       *      'videos'            视频数据{Array} gli_video_num,name,src
       *      'images'：                    图片保存信息{Array} gli_image_num,name,old_src,new_src
       *      'isPretreat'：            是否已预处理分页数据, ps:1, 0
       * }
       */
      chapts: [],
      // 包含 "目录" 和 "分页内容"的 信息集合。
      chapt_index: 0,
      // {Number} 图书章节下标, 第一章下标为0
      page_index: 0,
      // {Number} 图书每章节页码下标，第一页下标为1
      wordId: 0,
      // 给每章每个字绑定一个属性data-id=wordId,用于划线和笔记
      alreadyState: 0,
      // 分页数据准备状态
      turnMode: 0,
      // 翻页模式, 0正常模式,1没有翻页动画
      noCountState: 0,
      // 1表示已有分页数据，不需要分页
      isPretreat: 0,
      // 1表示分页数据已经预处理
      downloadPath: '',
      // 图片下载地址  /path/download/books/u_20160808/b_1001/images/
      pageColumn: 1,
      // 显示几页
      useFixedMenu: true,
      // 使用固定菜单操作栏
      useProbation: false,
      //使用reader 控制试读内容范围
      useManuscriptPic: false
    };
    // 合并
    this.opts = $.extend(true, {}, defaults, options);
    // 断字符
    this.wordBreakChar = '\u300B\u3001\'\uFF0C,\uFF1B;/.\u3002_>\uFF09)\uFF1F?~\uFF01!"\u201D';
    this._init();
  };
  /**
   * 初始化 <br>.
   */
  CountPage.prototype._init = function () {
    var optsObj = this.opts;
    this._setLayout();
    // true 自动算页， false 手动算页
    if (optsObj.auto) {
      this.excutePaging();
    }
  };
  /**
   * 渲染  <br>.
   */
  CountPage.prototype._setLayout = function () {
    var optsObj = this.opts;
    // 利用 模板 生成HTML
    var templObj = _.template(optsObj.templHtml);
    var countPageHtml = templObj();
    // 转化 zepto 对象;
    optsObj.$countPageObj = $(countPageHtml);
    optsObj.$readerObj.append(optsObj.$countPageObj);
    if (optsObj.pageColumn == 2) {
      optsObj.$countPageObj.addClass('read-two-page');
      optsObj.$readerObj.find('.read-selector-main').addClass('read-two-page');
    }
    if (!optsObj.useFixedMenu) {
      optsObj.$countPageObj.addClass('read-unfixed-menu');
      optsObj.$readerObj.find('.read-selector-main').addClass('read-unfixed-menu');
    }
    optsObj.$domObj = optsObj.$countPageObj.find('.read-countpage');
    optsObj.pageW = optsObj.$countPageObj.find('.read-selector-countpage .read-countpage-content').width();
    optsObj.pageH = optsObj.$countPageObj.find('.read-selector-countpage .read-countpage-content').height();
    //分页器专用进度条
    this.ProgressBarObj = new progressBar({ $domObj: optsObj.$readerObj.find('.read-selector-main .read-footer .read-progressbar') });
    // 弹出框
    this.DialogObj = new Dialog({
      '$wrapDomObj': optsObj.$readerObj,
      'isMobile': optsObj.isMobile,
      'clientType': optsObj.clientType
    });
  };
  /**
   * 传入数据 合法性验证. <br/>
   * 
   * @return checkVal {Boolean} true: 合法, false: 非法。
   */
  CountPage.prototype._check = function () {
    var optsObj = this.opts;
    var checkVal = true;
    if (optsObj.getHtml === '') {
      console.log('[countPage.js]-->传入分页数据错误\uFF01');
      checkVal = false;
    }
    return checkVal;
  };
  /** 
   * 
   * 设置章节信息. <br/>
   * 
   * @param {Object} param {
   * 				'pages'      // {Array}  分页page
   * 				'getHtml'    // {String} 章节Html
   *              'isPretreat' // {Number} html是否已经预处理过
   *              'index'      // {Number} 章节下标
   * 			}
   */
  CountPage.prototype.setChapterData = function (param) {
    var optsObj = this.opts;
    optsObj.getHtml = param.getHtml;
    optsObj.pages = param.pages;
    optsObj.chapt_index = param.index;
    optsObj.wordId = 0;
    optsObj.isPretreat = param.isPretreat || 0;
    optsObj.alreadyState = 0;
    optsObj.noCountState = 0;
    if (optsObj.pages.length) {
      optsObj.noCountState = 1;
    }
  };
  /**
   * 分页算法：第一步,先将数据预处理(1.处理图片,算页时不加载图片;)  <br/>
   * 
   */
  CountPage.prototype.excutePaging = function () {
    var that = this;
    var optsObj = that.opts;
    if (!that._check()) {
      return false;
    }
    if (optsObj.state) {
      console.log('[countPage.js] --> excutePaging 正在分页\uFF01');
      return false;
    }
    optsObj.pages = [];
    optsObj.alreadyState = 0;
    console.time('countPage_times');
    // 显示进度条
    that.ProgressBarObj.open();
    optsObj.$countPageObj.show();
    optsObj.$domObj.html(optsObj.getHtml);
    // 保存预处理,改变字体等重新算页时不需要预处理
    if (!optsObj.isPretreat) {
      console.time('pretreat_times');
      that._pretreat(optsObj.$domObj[0]);
      optsObj.getHtml = optsObj.$domObj.html();
      console.timeEnd('pretreat_times');
    }
    var countPage_flag = false;
    var wordRex = /<\/?math>/;
    // 正则表达式查找分页数据是否有公式
    if (wordRex.test(optsObj.getHtml) && typeof MathJax !== 'undefined') {
      var content_clone = Dom.cloneElemnt(optsObj.$domObj[0]);
      // 加载数学公式
      MathJax.Hub.Config({
        showProcessingMessages: false,
        messageStyle: 'none',
        showMathMenu: false,
        showMathMenuMSIE: false
      });
      MathJax.Hub.Queue([
        'Typeset',
        MathJax.Hub
      ]);
      // 准备算页时在数学公式加载完成后回调算页方法
      countPage_flag = true;
      // 数学公式加载好宽高后回调
      MathJax.Hub.Queue(function () {
        if (countPage_flag) {
          var math_span = optsObj.$domObj[0].querySelectorAll('.MathJax_SVG');
          var all_math = content_clone.querySelectorAll('math');
          for (var i = 0; i < math_span.length; i++) {
            var new_math_span = document.createElement('span');
            new_math_span.style.width = math_span[i].offsetWidth + 'px';
            new_math_span.style.height = math_span[i].offsetHeight + 'px';
            new_math_span.style.display = 'inline-block';
            new_math_span.setAttribute('class', 'reader-MathJax reader-minNode');
            all_math[i].parentNode.insertBefore(new_math_span, all_math[i]);
            new_math_span.appendChild(all_math[i]);
          }
          optsObj.$domObj.html(content_clone.innerHTML);
          that._pagingMain();
          countPage_flag = false;
        }
      });
    } else {
      that._pagingMain();
    }
  };
  /**
   * 提出数据中内部样式表.
   * 
   */
  CountPage.prototype._getStyle = function () {
    var optsObj = this.opts;
    var $styleObjs = optsObj.$domObj.find('style');
    var tmpDom = $styleObjs.clone();
    // 把提取的样式表存起来的.
    optsObj.chapts[optsObj.chapt_index].styleObj = tmpDom;
    $styleObjs.remove();
    // 每次获取当前章的数据内的style时需要设置一次样式 -- 为了不影响分页数据
    this._setStyle();
  }, /**
   * 本章的样式设定. <br/>
   * 
   */
  CountPage.prototype._setStyle = function () {
    var optsObj = this.opts;
    if (!optsObj.useEpubStyle) {
      return;
    }
    var styleDiv = optsObj.$readerObj.find('.read-style-container');
    if (styleDiv.length == 0) {
      styleDiv = $('<div class=\'read-style-container\'>');
    }
    optsObj.$readerObj.prepend(styleDiv.html(optsObj.chapts[optsObj.chapt_index].styleObj));
  };
  /**
   * 分页算法：第二步,将数据分块;
   * 		       第三步,递归算页. <br/>
   * 			
   */
  CountPage.prototype._pagingMain = function () {
    var that = this;
    var optsObj = that.opts;
    var chapt = optsObj.chapts[optsObj.chapt_index];
    optsObj.state = 1;
    // 准备算页
    var currLen = 0;
    // 当前已算页完成的总字数
    var pageLen = 0;
    var traverseFlg = false;
    var contentAry = [];
    // 用于存放分块数据 
    var rate = 8;
    // 分块高度为页面高度的倍数
    var elem_content = document.createElement('div');
    elem_content.innerHTML = optsObj.$domObj.html();
    optsObj.$domObj.html('');
    optsObj.$domObj[0].appendChild(elem_content);
    //console.info('%c' + '去空格分页前本章总字数：' + elem_content.innerText.replace(/\s/g, '').length, 'color:red');
    console.time('getPrepareData_times');
    contentAry = that._getPrepareData({
      'domObj': elem_content,
      'pageH': optsObj.pageH,
      'rate': rate
    });
    console.timeEnd('getPrepareData_times');
    optsObj.$domObj.html('');
    elem_content.innerHTML = '';
    that.LOOP_STATUS = false;
    that.LOOP = setInterval(function () {
      //如果是锁定状态就跳过
      if (that.LOOP_STATUS) {
        return false;
      }
      if (contentAry.length > 0) {
        elem_content.appendChild(contentAry[0]);
        try {
          that.LOOP_STATUS = true;
          traverseFlg = false;
          traverseFlg = that._traverseElem(elem_content, optsObj.$domObj[0]);
          that.LOOP_STATUS = false;
        } catch (e) {
          console.error('countPage:' + e);
        }
        if (traverseFlg) {
          that._splitTab(optsObj.$domObj[0]);
          pageLen = optsObj.$domObj.text().replace(/\s/g, '').length;
          optsObj.pages.push({
            html: optsObj.$domObj.html(),
            txt: optsObj.$domObj.text(),
            textlen: pageLen
          });
          optsObj.$domObj.html('');
          currLen += pageLen;
          // 进度条值
          that.ProgressBarObj.setValue(Math.floor(100 * currLen / chapt.textlen));
        }
        if (!elem_content.innerHTML || elem_content.innerHTML.replace(/\s/g, '').length === 0) {
          elem_content.innerHTML = '';
          contentAry.shift();
        }
        // 每算好 step=3 页执行一次回调
        if ((optsObj.direction === 'next' || optsObj.turnMode) && traverseFlg && optsObj.pages.length > 0 && optsObj.pages.length % optsObj.step === 0) {
          that.readyData();
        }
      } else {
        if (optsObj.$domObj.text()) {
          that._splitTab(optsObj.$domObj[0]);
          pageLen = optsObj.$domObj.text().replace(/\s/g, '').length;
          optsObj.pages.push({
            html: optsObj.$domObj.html(),
            txt: optsObj.$domObj.text(),
            textlen: pageLen
          });
          if (optsObj.pageColumn == 2 && optsObj.pages.length % 2 == 1) {
            optsObj.pages.push({
              html: '',
              txt: '',
              textlen: 0
            });
          }
          currLen += pageLen;
          // 进度条值
          that.ProgressBarObj.setValue(Math.floor(100 * currLen / chapt.textlen));
        }
        that.ProgressBarObj.close();
        //console.info('%c' + '去空格分页后本章总字数：' + currLen, 'color:red');
        elem_content.innerHTML = '';
        optsObj.$domObj.html('');
        optsObj.$countPageObj.hide();
        optsObj.state = 0;
        //算页完成
        that.readyData();
        that._finishPaging();
        console.timeEnd('countPage_times');
        clearInterval(that.LOOP);
      }
    }, 0);
  };
  /**
   * 拆分标签，将每个字用span标签包裹. </br>
   * 
   * @param {Object} elem 待拆分标签的dom
   */
  CountPage.prototype._splitTab = function (elem) {
    var optsObj = this.opts;
    var children = Dom.getElementChild(elem);
    var wordReg = /(([\w_\.%]+)|([^\2]))/gi;
    var html = '';
    for (var i = 0, len = children.length; i < len; i++) {
      // 拆分文本节点
      if (children[i].nodeName === '#text') {
        html = children[i].nodeValue.replace(wordReg, function (txt) {
          optsObj.wordId += 1;
          return '<span data-id="' + optsObj.wordId + '" class="read-filterSpan">' + txt + '</span>';
        });
        var span = document.createElement('span');
        //                  children[i].parentNode.insertBefore(span, children[i]);
        //                  children[i].parentNode.removeChild(children[i]);
        children[i].parentNode.replaceChild(span, children[i]);
        span.outerHTML = html;
      } else {
        // 对分页时已拆分过的节点绑定data-id属性
        if (typeof children[i].className == 'string' && children[i].className.indexOf('reader-minNode') !== -1) {
          optsObj.wordId += 1;
          children[i].classList.add('read-filterSpan');
          children[i].setAttribute('data-id', optsObj.wordId);
          children[i].classList.remove('reader-minNode');
        } else {
          // 有子节点继续拆分
          if (children[i].nodeName !== 'svg' && children[i].nodeName !== 'IMG' && children[i].nodeName !== 'VIDEO' && children[i].className.indexOf('read-filterSpan') === -1 && children[i].className.indexOf('read-not-publish') === -1 && children[i].nodeName !== 'TABLE') {
            this._splitTab(children[i]);
          }
        }
      }
    }
  };
  /**
   * 数据分页前第一步进行预处理(1.图片src处理;2.图片下载，3.视频设置宽高) <br/>
   * 
   * @param {Object} elem 待处理dom数据
   */
  CountPage.prototype._pretreat = function (elem) {
    var optsObj = this.opts;
    // 提取数据中的样式
    this._getStyle();
    var chapt = optsObj.chapts[optsObj.chapt_index];
    // 默认值.
    chapt.images = [];
    chapt.videos = [];
    chapt.manuScripPics = [];
    var all_p = elem.querySelectorAll('p');
    for (var j = 0, length = all_p.length; j < length; j++) {
      if (!!all_p[j].innerHTML.trim()) {
        // 每个P标签段首增加一个span占位符，占两个字符
        var span = document.createElement('span');
        span.setAttribute('class', 'read-placeholder read-not-publish');
        all_p[j].insertBefore(span, all_p[j].firstChild);
      }
    }
    // 图片src处理及宽高设置
    var images = Dom.replaceImgSrc(optsObj.isClient, optsObj.pageW, optsObj.pageH, elem, optsObj.downloadPath + 'images/', optsObj.fontSize);
    // 设置视频宽高
    var videos = Dom.replaceVideoSrc(optsObj.pageW, optsObj.pageH, elem);
    if (optsObj.useManuscriptPic) {
      // 开启 原稿图 
      Dom.doManuscriptPic(elem);
      var tmpManuScripPics = [];
      for (var k = 0, kLen = images.length; k < kLen; k++) {
        if (images[k].type == 'exp') {
          tmpManuScripPics.push(images[k]);
        }
      }
      chapt.manuScripPics = tmpManuScripPics;
    }
    if (optsObj.isClient) {
      for (var i = 0, len = images.length; i < len; i++) {
        optsObj.$domObj.trigger('countpage:downloadPhoto', images[i]);
      }
    }
    // 封面处理  TODO:默认第一章为封面切只有一张图片
    if (optsObj.chapt_index == 0) {
      $(elem).find('img').eq(0).each(function () {
        $(this).css({
          'min-width': optsObj.pageW + 'px',
          'min-height': optsObj.pageH + 'px',
          'display': 'block'
        });
        $(this).attr('data-cover', '1');
      });
    }
    chapt.images = images;
    chapt.videos = videos;
    chapt.textlen += images.length * 2;
    optsObj.totalLen += images.length * 2;
    this._packageTab(elem);
  };
  /**
   * 预处理特殊标签，用span包裹特殊标签. <br/>
   * 
   * @param {Object} elem 待处理dom数据
   */
  CountPage.prototype._packageTab = function (elem) {
    var optsObj = this.opts;
    var chapt = optsObj.chapts[optsObj.chapt_index];
    // 特殊标签         TODO:穷举所有的特殊标签
    var specialTabName = 'sup,sub';
    var specialTab = elem.querySelectorAll(specialTabName);
    for (var i = 0, length = specialTab.length; i < length; i++) {
      var span = document.createElement('span');
      span.setAttribute('class', 'read-special-tab reader-minNode');
      specialTab[i].parentNode.insertBefore(span, specialTab[i]);
      span.appendChild(specialTab[i]);
    }
  };
  /**
   * 递归算页方法：将elem放入domPage,如果内容溢出，则放入子节点，直至算好一页数据. <br/>
   * 
   * @param {Object} elem		// 待算页的数据
   * @param {Object} domPage 	// 呈现页面的标准DOM
   */
  CountPage.prototype._traverseElem = function (elem, domPage) {
    var that = this;
    var optsObj = that.opts;
    var elem_children = Dom.getElementChild(elem);
    var elem_clone = null;
    var currentH = 0;
    var currentW = 0;
    for (var i = 0; i < elem_children.length; i++) {
      try {
        elem_clone = Dom.cloneElemnt(elem_children[i]);
        domPage.appendChild(elem_clone);
      } catch (e) {
        console.log('添加节点-ERROR:' + e);
      }
      currentH = optsObj.$domObj[0].offsetHeight;
      currentW = optsObj.$domObj[0].offsetWidth;
      // 算页最高优先级 --NO.1 -- <nzzp/>
      if (elem_children[i].nodeName == 'NZZP') {
        // 强制本页内容已完成 
        elem_children[i].parentNode.removeChild(elem_children[i]);
        elem_children.splice(0, 1);
        return true;
      }
      // 算页优先级 --NO.2 -- <img type="exp" />
      // 1. "正常模式"  -- display:none; 不做处理（css控制）;
      // 2. "只显示原稿;"-- display:block; 不做处理(根本就不需要分页！);
      // 3. "图文对照"  -- display:block; 需要特殊处理, 规定本节点之前 肯定会出现 <nzzp/>;
      // 3.1  "一文多图" -- 只在最后一个 img节点处 翻页.
      if (optsObj.useManuscriptPic && elem_children[i].nodeName == 'IMG' && elem_children[i].getAttribute('type') == 'exp') {
        if (elem_children[i].getAttribute('islast') == '1') {
          // islast 属性会在 算页以前 的 "过滤数据"阶段，添加; 
          // 单张原稿 OR 连续多张原稿的最后一张 会将设置 自定义属性 islast = '1'
          // 强制本页内容已完成
          elem_children[i].parentNode.removeChild(elem_children[i]);
          elem_children.splice(0, 1);
          return true;
        } else {
          continue;
        }
      }
      if (currentH <= optsObj.pageH && currentW <= optsObj.pageW) {
        elem_children[i].parentNode.removeChild(elem_children[i]);
        elem_children.splice(0, 1);
        i--;
        continue;
      } else {
        // 如果是table
        if (elem_children[i].nodeName == 'TABLE') {
          var tmpChild = elem_children[i];
          var winH = optsObj.pageH;
          var restH = winH - (currentH - elem_clone.offsetHeight);
          var tblH = elem_clone.offsetHeight || 0;
          if (restH <= 0.4 * winH) {
            //移除导致页面超过大小的节点
            domPage.removeChild(elem_clone);
          } else {
            // 表格就在本页显示.
            var cssVal = elem_clone.parentNode.getAttribute('class') || '';
            elem_clone.parentNode.setAttribute('class', cssVal + ' read-tbl-big-data');
            elem_clone.setAttribute('zoom', '1');
            elem_clone.setAttribute('data-resth', restH - 20);
            elem_children[i].parentNode.removeChild(elem_children[i]);
          }
          return true;
        }
        elem_clone.parentNode.removeChild(elem_clone);
        if (elem_children[i].nodeName === '#text') {
          // 如果是#text节点,拆分后再重新循环插入
          if (Dom.splitTextTab(elem_children[i])) {
            elem_children = Dom.getElementChild(elem);
            i--;
            continue;
          }
        } else {
          // 如果是公式节点，不再拆分
          if (typeof elem_children[i].className == 'string' && elem_children[i].className.indexOf('reader-MathJax') !== -1) {
            return true;
          }
          // 如果是视频节点，不再拆分
          if (elem_children[i].nodeName == 'VIDEO') {
            return true;
          }
        }
        // 如果有子节点,把子节点拆分加入
        if (elem_children[i].className !== 'reader-minNode' && Dom.getElementChild(elem_children[i]).length > 0) {
          // 当前节点外部标签
          var child = Dom.createElementByHtml(Dom.getElementOutTag(elem_children[i]));
          domPage.appendChild(child);
          return this._traverseElem(elem_children[i], child);
        } else {
          // 如果下一页段首是断字符，移到上一页段末
          if (elem_clone.className === 'reader-minNode' && this.wordBreakChar.indexOf(elem_clone.innerText) !== -1) {
            elem_children[i].style.width = 5 + 'px';
            elem_children[i].style.float = 'right';
            domPage.appendChild(elem_children[i]);
          }
          return true;
        }
      }
    }
    return false;
  };
  /**
   * 将需要分页的数据先进行分块，提高分页效率. <br/>
   * 
   * @param {Object} options {
   * 				'domObj': tmpItem, 	// {Object} 待分块的dom
   *              'pageH': pageH, 	// {int} 屏幕页面高度
   *              'rate': rate   		// {int} 分块高度为页面高度的倍数
   * 		}
   * 
   * @return {Array} data 			// 分块后的数据
   */
  CountPage.prototype._getPrepareData = function (options) {
    var currentH = 0;
    var data = [];
    var domObj = options.domObj;
    var pageH = options.pageH;
    var rate = options.rate;
    var standardH = options.pageH * rate;
    var tmpItem = null;
    var tmpH = 0;
    var nodes = domObj.childNodes;
    var nextAry = null;
    for (var i = 0, len = nodes.length; i < len; i++) {
      tmpItem = nodes[i];
      tmpH = tmpItem.offsetHeight || 0;
      if (tmpH > standardH && tmpItem.nodeName != 'TABLE' && tmpItem.nodeName != 'IMG' && tmpItem.nodeName != 'P') {
        nextAry = this._getPrepareData({
          'domObj': tmpItem,
          'pageH': pageH,
          'rate': rate
        });
        for (var j = 0, jlen = nextAry.length; j < jlen; j++) {
          nextAry[j].id = nextAry[j].id + '_' + tmpItem.id + '_' + j;
          data.push(nextAry[j]);
        }
      } else {
        data.push(tmpItem);
      }
    }
    return data;
  };
  /**
   * 获取本章分页数据和image信息. <br/>
   * 
   * @return {Object} {
   *      pages   {Array} 已分好页的数据,
   *      images  {Array} 保存的图片信息,
   *      html    {String}已预处理过的html,
   *      isPretreat {Number} 分页数据是否预处理
   *  }
   */
  CountPage.prototype.getPagingData = function () {
    var optsObj = this.opts;
    var images = optsObj.chapts[optsObj.chapt_index].images || [];
    return {
      'pages': optsObj.pages,
      'images': images,
      'html': optsObj.getHtml,
      'isPretreat': 1
    };
  };
  /**
   * 首次进入分页器. <br/>
   * 
   * @param {Object} param {
   *      'totalLen'      {Number}    本书总字数
   *      'chapts'        {Array}     目录信息
   *      'chapt_index'   {Number}    章节下标
   *      'progressData'  {Float}     阅读进度
   *      'path': path    {String}    图片本地保存路径
   *  }
   */
  CountPage.prototype.begin = function (param) {
    var optsObj = this.opts;
    optsObj.totalLen = param.totalLen;
    optsObj.chapts = param.chapts;
    optsObj.downloadPath = param.path;
    optsObj.chapt_index = param.chapt_index;
    optsObj.turnMode = 1;
    var progressData = param.progressData.progress;
    // 判断是否有阅读进度
    if (progressData > 0) {
      this.turnPageByPerc(progressData);
    } else {
      optsObj.page_index = 0;
      this.turnPage('next');
    }
    this._turnPageByPerc = this.turnPageByPerc;
  };
  /**
   * 章节跳转. <br/>
   * 
   * @param {Number} index //章节下标
   */
  CountPage.prototype.turnChapter = function (index) {
    var optsObj = this.opts;
    if (optsObj.chapt_index > index) {
      optsObj.direction = 'prev';
    } else {
      optsObj.direction = 'next';
    }
    optsObj.chapt_index = index;
    optsObj.page_index = 1;
    optsObj.turnMode = 2;
    this._getContent();
  };
  /**
   * 翻页. <br/>
   * 
   * @param {String} direction //'next'向后翻页,'prev'向前翻页
   * 
   */
  CountPage.prototype.turnPage = function (direction) {
    var that = this;
    var optsObj = that.opts;
    optsObj.direction = direction || optsObj.direction;
    if (direction === 'prev') {
      optsObj.page_index -= optsObj.pageColumn * 2 - 1;
      optsObj.page_index = optsObj.page_index < 0 ? 0 : optsObj.page_index;
    } else {
      optsObj.page_index += 1;
    }
    if (!optsObj.pages.length) {
      // 当前章节无分页数据，先分页
      // TODO, 如果当前章节无权限，继续往后翻页,(后续可根据情况更改)
      while (!optsObj.chapts[optsObj.chapt_index].chapter_status) {
        optsObj.chapt_index += 1;
        if (!optsObj.chapts[optsObj.chapt_index]) {
          // 没有更多的章节了
          optsObj.chapt_index -= 1;
          break;
        }
      }
      that._getContent();
    } else {
      if (optsObj.page_index === 0 || optsObj.page_index > optsObj.pages.length) {
        that._crossChapt();
      } else {
        that._showPage();
      }
    }
  };
  /**
   * 翻页跨章节,根据目录获取新章节的下标. <br/>
   * 
   */
  CountPage.prototype._crossChapt = function () {
    var that = this;
    var optsObj = that.opts;
    var chapts = optsObj.chapts;
    var old_chaptIndex = optsObj.chapt_index;
    var hasRight = true;
    var msg = '';
    if (optsObj.page_index === 0) {
      // 1. 跨章节向前翻页
      optsObj.chapt_index -= 1;
      // 判断章节是否有阅读权限   TODO, 目前没有权限直接跳过向前继续翻页
      while (optsObj.chapt_index >= 0 && !chapts[optsObj.chapt_index].chapter_status) {
        optsObj.chapt_index -= 1;
        hasRight = false;
      }
      // 没有数据，已经不能继续向前翻页了
      if (optsObj.chapt_index < 0) {
        optsObj.chapt_index = old_chaptIndex;
        optsObj.page_index = optsObj.pageColumn;
        msg = old_chaptIndex == 0 ? Msg.firstPage : Msg.testReadOver;
        that.DialogObj.setMsg(msg);
        that.DialogObj.open();
        console.log('[countPage.js] --> 没有数据\uFF0C已经不能继续向前翻页了');
        return false;
      }
      // 获取新章节内容
      that._getContent();
    } else {
      // 2. 跨章节向后翻页
      optsObj.chapt_index += 1;
      // 判断章节是否有阅读权限   TODO, 目前没有权限直接跳过向后继续翻页
      while (optsObj.chapt_index < chapts.length && !chapts[optsObj.chapt_index].chapter_status) {
        optsObj.chapt_index += 1;
        hasRight = false;
      }
      // 没有数据，已经不能继续向后翻页了
      if (optsObj.chapt_index === chapts.length) {
        optsObj.chapt_index = old_chaptIndex;
        optsObj.page_index = optsObj.pages.length;
        msg = old_chaptIndex == chapts.length - 1 ? Msg.lastPage : Msg.testReadOver;
        that.DialogObj.setMsg(msg);
        that.DialogObj.open();
        if (!hasRight) {
          // 无权限读取下章内容
          optsObj.$domObj.trigger('countpage:noright');
        }
        console.log('[countPage.js] --> _crossChapt, 没有数据\uFF0C已经不能继续向后翻页了');
        return false;
      }
      optsObj.page_index = 1;
      // 获取新章节内容
      that._getContent();
    }
  };
  /**
   * 根据chapter_id获取在chapts的下标. <br/>
   * 
   * @param {String} id   chapter_id
   * 
   * @return {Number} i   下标
   * 
   */
  CountPage.prototype.searchChaptIndex = function (id) {
    var optsObj = this.opts;
    var chapts = optsObj.chapts;
    for (var i = 0, len = chapts.length; i < len; i++) {
      if (chapts[i].chapter_id == id) {
        break;
      }
    }
    return i;
  };
  /**
   * 获取当前页页码. <br/>
   * 
   * @param  {Number} chapt_index 章节下标
   * @return {Object} {
   *      totalPage:  总页码，
   *      currPage:   当前页码
   *  }
   */
  CountPage.prototype.getPageIndex = function (chapt_index) {
    var optsObj = this.opts;
    var chaptIndex = optsObj.chapt_index;
    var pageIndex = optsObj.page_index;
    var hasPage = 0;
    var hasTextLen = 0;
    var restTextLen = 0;
    var totalPage = 0;
    var currPage = 0;
    var pageLen = 0;
    var pages = optsObj.allPages;
    if (chapt_index != undefined) {
      chaptIndex = chapt_index;
      pageIndex = 1;
    }
    pages = optsObj.allPages.length ? optsObj.allPages : optsObj.pages;
    hasPage = pages.length;
    for (var i = 0; i < hasPage; i++) {
      hasTextLen += pages[i].textlen;
    }
    totalPage = parseInt(hasPage * optsObj.totalLen / hasTextLen);
    for (var j = 0; j < chaptIndex; j++) {
      pageLen = !!optsObj.chapts[j].pages ? optsObj.chapts[j].pages.length : Math.ceil(hasPage * optsObj.chapts[j].textlen / hasTextLen);
      currPage += pageLen;
    }
    //          currPage += !!restTextLen ? parseInt(hasPage * optsObj.chapts[j].textlen / hasTextLen) : 0;
    currPage += pageIndex;
    return {
      'totalPage': totalPage,
      'currPage': currPage
    };
  };
  /**
   * 通过页码快速翻页. <br/>
   * 
   * @param {Object} page_index 页码
   */
  CountPage.prototype.turnPageById = function (page_index) {
    var optsObj = this.opts;
    var chapterId = 0;
    var flag = true;
    //          var pageInfo = this.getPageIndex();
    //          if(pageInfo.currPage != page_index){
    //              var perc = page_index / pageInfo.totalPage;
    //              this.turnPageByPerc(perc);
    //          }
    var pageInfo = null;
    page_index = page_index % 2 ? page_index + optsObj.pageColumn - 1 : page_index;
    for (var i = 0, len = optsObj.chapts.length; i < len; i++) {
      pageInfo = this.getPageIndex(i);
      pageInfo.currPage += optsObj.pageColumn - 1;
      if (pageInfo.currPage >= page_index) {
        chapterId = pageInfo.currPage == page_index ? i : i - 1;
        if (optsObj.chapts[chapterId].pages == undefined) {
          flag = false;
        }
        break;
      }
      if (optsObj.chapts[i].pages == undefined) {
        flag = false;
        break;
      }
    }
    if (flag) {
      optsObj.chapt_index = chapterId;
      optsObj.pages = optsObj.chapts[chapterId].pages;
      optsObj.page_index = page_index - this.getPageIndex(chapterId).currPage;
      if (optsObj.page_index == 0) {
        optsObj.page_index = 1;
      } else {
        optsObj.page_index = optsObj.page_index % 2 ? optsObj.page_index : optsObj.page_index + 1 - optsObj.pageColumn;
      }
      this._showPage();
    } else {
      pageInfo = this.getPageIndex();
      if (pageInfo.currPage != page_index) {
        var perc = page_index / pageInfo.totalPage;
        this.turnPageByPerc(perc);
      }
    }
  };
  /**
   * 计算当前页或者给定页的第一个字百分比. <br/>
   * 
   * @param  {Number} index  pages的下标
   * @return {Number} perc   返回值(0.1234) 未换算成百分比
   * 
   */
  CountPage.prototype.getHeadPerc = function (index) {
    var optsObj = this.opts;
    var currTextLen = 0;
    var perc = 0;
    var pageIndex = index != undefined ? index : optsObj.page_index;
    // 计算当前章节前所有章节字数
    for (var i = 0; i < optsObj.chapt_index; i++) {
      currTextLen += optsObj.chapts[i].textlen;
    }
    for (var j = 0; j < pageIndex - 1; j++) {
      currTextLen += optsObj.pages[j].textlen;
    }
    perc = (currTextLen / optsObj.totalLen).toFixed(4);
    if (perc > 0.9995) {
      perc = 1;
    }
    return perc;
  };
  /**
   * 计算当前页左后一个字百分比. <br/>
   * 
   * @return {Number} 返回值(0.1234) 未换算成百分比
   * 
   */
  CountPage.prototype.getFootPerc = function () {
    var optsObj = this.opts;
    var pageCol = optsObj.pageColumn;
    var currTextLen = 0;
    var perc = 0;
    // 计算当前章节前所有章节字数 
    for (var i = 0; i < optsObj.chapt_index; i++) {
      currTextLen += optsObj.chapts[i].textlen;
    }
    var tmpDelVal = pageCol == 2 ? 2 : 1;
    // 计算本章内容，当前页码之前的 所有字数 --add by gonglong-20161124
    for (var j = 0, len = optsObj.page_index - tmpDelVal; j < len; j++) {
      currTextLen += optsObj.pages[j].textlen;
    }
    perc = (currTextLen / optsObj.totalLen).toFixed(4);
    if (perc > 0.9995) {
      perc = 1;
    }
    return perc;
  };
  /**
   * 根据百分比跳转页面. <br/>
   * 
   * @param {Number} perc // 百分比 0.1234
   * 
   */
  CountPage.prototype.turnPageByPerc = function (perc) {
    var that = this;
    var optsObj = that.opts;
    var currPerc = 0;
    perc = perc > 1 ? 1 : perc;
    perc = perc < 0 ? 0 : perc;
    if (optsObj.pages.length) {
      currPerc = this.getFootPerc();
    }
    if (currPerc > perc) {
      optsObj.direction = 'prev';
    } else {
      optsObj.direction = 'next';
    }
    var chaptIndex = 0;
    var total = optsObj.totalLen;
    var currLen = 0;
    // 第一步根据百分比计算出所在章节下标chapt_index
    for (var i = 0, len = optsObj.chapts.length; i < len; i++) {
      currLen += optsObj.chapts[i].textlen;
      if (perc <= (currLen / total).toFixed(4)) {
        if (!optsObj.chapts[i].chapter_status) {
          this.DialogObj.setMsg(Msg.testReadOver);
          this.DialogObj.open();
          return false;
        }
        chaptIndex = i;
        currLen -= optsObj.chapts[i].textlen;
        break;
      }
    }
    // 第二步判断该章节是否已有分页数据
    if (chaptIndex === optsObj.chapt_index && optsObj.pages.length > 0) {
      // 1.有分页数据，直接根据分页数据进行定位
      var pages = optsObj.pages;
      for (var j = 0, len = pages.length; j < len; j++) {
        currLen += pages[j].textlen;
        if (perc <= (currLen / total).toFixed(4)) {
          optsObj.page_index = j + 1;
          if (optsObj.pageColumn == 2 && optsObj.page_index % 2 == 0) {
            optsObj.page_index -= 1;
          }
          that._showPage();
          break;
        }
      }
    } else {
      // 保存信息，获取新分页信息后继续查找
      optsObj.chapt_index = chaptIndex;
      that.currLen = currLen;
      that.perc = perc;
      that.fastPagingState = 1;
      that._getContent();
    }
  };
  /**
   * 获取章节内容. <br/>
   * 
   */
  CountPage.prototype._getContent = function () {
    var optsObj = this.opts;
    this._setStyle();
    optsObj.$domObj.trigger('countpage:getChapterContent', optsObj.chapt_index);
  };
  /**
   * 准备分页数据. <br/>
   * 
   */
  CountPage.prototype.readyData = function () {
    var optsObj = this.opts;
    var that = this;
    if (that.fastPagingState) {
      // 1. 根据百分比快速跳转执行;
      var currLen = that.currLen;
      var perc = that.perc;
      for (var j = 0, len = optsObj.pages.length; j < len; j++) {
        currLen += optsObj.pages[j].textlen;
        if (perc <= (currLen / optsObj.totalLen).toFixed(4)) {
          optsObj.page_index = j + 1;
          if (optsObj.pageColumn == 2 && optsObj.page_index % 2 == 0) {
            optsObj.page_index -= 1;
          }
          that.fastPagingState = 0;
          optsObj.alreadyState = 1;
          break;
        }
      }
    } else {
      // 2. 正常分页获取分页数据;
      optsObj.alreadyState += 1;
      // 3. 跨章节向前翻页获取页码下标;
      if (optsObj.direction === 'prev') {
        if (optsObj.turnMode) {
          optsObj.page_index = 1;
        } else {
          optsObj.page_index = optsObj.pages.length - optsObj.pageColumn + 1;
        }
        optsObj.alreadyState = 1;
      }
    }
    // alreadyState 分页数据是否已准备好,0未准备好,1准备好,>1分页数据已经显示
    if (optsObj.alreadyState === 1) {
      if (!optsObj.noCountState) {
        // 触发关闭loading
        optsObj.$domObj.trigger('countpage:already');
      }
      that._showPage();
    }
  };
  /**
   * 算页完成执行方法. <br/>
   * 
   */
  CountPage.prototype._finishPaging = function () {
    var optsObj = this.opts;
    optsObj.allPages = Tool.pushArray(optsObj.allPages, optsObj.pages);
    optsObj.$domObj.trigger('countpage:finish', optsObj.chapt_index);
  };
  /**
   * 显示分页数据到页面.  <br/>
   * 
   */
  CountPage.prototype._showPage = function () {
    var optsObj = this.opts;
    var name = optsObj.chapts[optsObj.chapt_index].chapter_name;
    var chapterId = optsObj.chapts[optsObj.chapt_index].chapter_id;
    // 开始偏移量
    var startPageOffset = this.getHeadPerc();
    // reader 控制试读结束
    if (optsObj.useProbation && parseFloat(startPageOffset) > 0.2) {
      this.DialogObj.setMsg(Msg.testReadOver);
      this.DialogObj.open();
      return false;
    }
    // 结束偏移量
    var endPageOffset = this.getFootPerc();
    var percent = (endPageOffset * 100).toFixed(2);
    var html = optsObj.pages[optsObj.page_index - 1].html;
    var pageIndexInfo = this.getPageIndex();
    var data = {
      'chapt_index': optsObj.chapt_index,
      'page_index': optsObj.page_index,
      'chapterName': name,
      'chapterId': chapterId,
      'chapterContent': html,
      'pagePerc': percent + '%',
      'startPageOffset': startPageOffset,
      'endPageOffset': endPageOffset,
      'direction': optsObj.direction,
      'turnMode': optsObj.turnMode,
      'totalPage': pageIndexInfo.totalPage,
      'currPage': pageIndexInfo.currPage
    };
    if (optsObj.pageColumn == 2) {
      optsObj.page_index += 1;
      data.page_index = optsObj.page_index;
      data.secondPage = optsObj.pages[optsObj.page_index - 1].html;
      endPageOffset = this.getFootPerc();
      data.firstPagePerc = percent + '%';
      percent = (endPageOffset * 100).toFixed(2);
      data.pagePerc = percent + '%';
      data.endPageOffset = endPageOffset;
    }
    optsObj.$domObj.trigger('countpage:showPage', data);
    optsObj.turnMode = 0;
    optsObj.direction = 'next';
  };
  /**
   * 设置 主面板字体大小. <br/>
   * 
   * @param {Object} options
   * 
   */
  CountPage.prototype.setFontSize = function (options) {
    var optsObj = this.opts;
    var tmpFontSize = {
      'oldValue': '',
      'newValue': ''
    };
    tmpFontSize.oldValue = 'read-size-' + options.oldValue;
    tmpFontSize.newValue = 'read-size-' + options.newValue;
    optsObj.$domObj.parents('.read-content').removeClass(tmpFontSize.oldValue);
    optsObj.$domObj.parents('.read-content').addClass(tmpFontSize.newValue);
    optsObj.fontSize = parseInt(optsObj.$domObj.parents('.read-content').css('font-size'));
    if (typeof this._turnPageByPerc === 'function') {
      optsObj.turnMode = 1;
      var percent = this.getFootPerc();
      optsObj.pages = [];
      optsObj.allPages = [];
      this._turnPageByPerc(percent);
    }
  };
  /**
   * 设置 主面板字体类型. <br/>
   * 
   * @param {Object} options
   * 
   */
  CountPage.prototype.setFontFamily = function (options) {
    var optsObj = this.opts;
    var tmpFamily = {
      'oldValue': '',
      'newValue': ''
    };
    tmpFamily.oldValue = 'fread-ont-family-' + options.oldValue;
    tmpFamily.newValue = 'read-font-family-' + options.newValue;
    optsObj.$domObj.parents('.read-content').removeClass(tmpFamily.oldValue);
    optsObj.$domObj.parents('.read-content').addClass(tmpFamily.newValue);
    if (typeof this._turnPageByPerc === 'function') {
      optsObj.turnMode = 1;
      var percent = this.getFootPerc();
      optsObj.pages = [];
      optsObj.allPages = [];
      this._turnPageByPerc(percent);
    }
  };
  /**
   * 一页一列和两列切换. <br/>
   * 
   */
  CountPage.prototype.changeColumn = function () {
    var optsObj = this.opts;
    var percent = 0;
    optsObj.turnMode = 1;
    if (optsObj.pageColumn == 2) {
      percent = (parseFloat(this.getHeadPerc()) + parseFloat(this.getFootPerc())) / 2;
      optsObj.$countPageObj.addClass('read-two-page');
      optsObj.$readerObj.find('.read-selector-main').addClass('read-two-page');
    } else {
      percent = parseFloat(this.getHeadPerc());
      optsObj.$countPageObj.removeClass('read-two-page');
      optsObj.$readerObj.find('.read-selector-main').removeClass('read-two-page');
    }
    optsObj.$countPageObj.show();
    optsObj.pageW = optsObj.$countPageObj.find('.read-selector-countpage .read-countpage-content').width();
    optsObj.pageH = optsObj.$countPageObj.find('.read-selector-countpage .read-countpage-content').height();
    optsObj.$countPageObj.hide();
    optsObj.pages = [];
    optsObj.allPages = [];
    this.turnPageByPerc(percent);
  };
  /**
   * 自定义事件. <br/>
   * 
   * @param eventName {String}   事件名称, 'countpage:getChapterContent','countpage:showPage',
   *                  'countpage:finish','countpage:already','countpage:downloadPhoto','countpage:noright'
   * @param cb        {Function} 回调事件
   * 
   */
  CountPage.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  return CountPage;
}(js_src_global, js_src_dom, js_src_widget_plugProgressBar, js_src_widget_plugDialog, js_libs_zeptodev, js_src_tool, js_src_message_zh);
js_src_widget_plugLoading = function (window, $) {
  var Loader = function (options) {
    var defaults = {
      domSelector: '',
      // 页面DOM标签 选择器. 建议使用 "id选择器". 如: "#loader"
      width: '2.2em',
      height: '2.2em',
      fillColor: '#1b88ee',
      //图片颜色（传入图片时失效）
      fontColor: '#fff',
      // 字体颜色
      value: 0,
      useProgress: false,
      // 是否使用进度
      $domObj: null,
      $progressObj: null,
      //进度
      fontSize: '0.5em',
      msg: '正在加载...',
      gifUrl: '',
      // gif图地址
      svgUrl: '',
      // svg图地址.
      svg: '',
      maskDomStyle: 'position: absolute; z-index:9999; background-color: rgba(119, 119, 119, 0.6); width: 100%; height: 100%; top: 0; left: 0; display:none'
    };
    this.opts = $.extend(true, {}, defaults, options);
    if (this.opts.clientType == 'PC') {
      this.opts.width = '80px';
      this.opts.height = '80px';
      this.opts.fontSize = '18px';
    }
    // 如果没有传入gif或者外部svg路径，则使用下面默认svg
    this.opts.svg = '<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"' + 'width="' + this.opts.width + '" height="' + this.opts.height + '" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">' + '<path fill="' + this.opts.fillColor + '" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">' + '<animateTransform attributeType="xml"' + 'attributeName="transform"' + 'type="rotate"' + 'from="0 25 25"' + 'to="360 25 25"' + 'dur="0.6s"' + 'repeatCount="indefinite"/>' + '</path>' + '</svg>';
    this._init();
  };
  Loader.prototype._init = function () {
    var optsObj = this.opts;
    optsObj.$domObj = $(optsObj.domSelector);
    if (!this._check()) {
      return false;
    }
    this._setLayout();
  };
  Loader.prototype._check = function () {
    var optsObj = this.opts;
    // 检查数据.
    if (optsObj.$domObj.length === 0) {
      console.warn('[plugLoading]--> _check : 没有传入dom');
      return false;
    }
    return true;
  };
  Loader.prototype._setLayout = function () {
    var optsObj = this.opts;
    //蒙层背景
    var loadingBg = $('<div />');
    optsObj.$loadingBg = loadingBg;
    optsObj.$domObj.append(loadingBg.attr('style', optsObj.maskDomStyle));
    // 显示区域，包括图片和文字
    var loaderMain = $('<div role=\'loader-main\' style=\'width:100%; text-align: center; position: absolute; top: 50%; transform: translateY(-50%);-webkit-transform: translateY(-50%);\'/>');
    var svgObj;
    if (!!optsObj.svgUrl) {
      //传入svg地址
      svgObj = $('<embed type=\'image/svg+xml\' />');
      svgObj.attr('src', optsObj.svgUrl).attr('width', optsObj.width + 'px').attr('height', optsObj.height + 'px');
    } else if (!!optsObj.gifUrl) {
      //传入gif地址
      svgObj = $('<img />');
      svgObj.attr('src', optsObj.gifUrl).attr('width', optsObj.width + 'px').attr('height', optsObj.height + 'px');
    } else {
      //不传入gif和外部svg文件时
      svgObj = $('<div />');
      svgObj.attr('width', optsObj.width + 'px').attr('height', optsObj.height + 'px');
      svgObj.append(optsObj.svg);
    }
    //提示文字显示内容
    var progressObj = $('<p style=\'width:100%; text-indent: 0; text-align: center;margin: 0; font-size:' + optsObj.fontSize + ';\' />');
    progressObj.css('color', optsObj.fontColor);
    if (optsObj.useProgress) {
      progressObj.html(optsObj.msg + '0%').show();
    }
    optsObj.$progressObj = progressObj;
    loaderMain.append(svgObj).append(progressObj);
    optsObj.$loadingBg.append(loaderMain);
  };
  /**
   * 
   * 关闭loading
   */
  Loader.prototype.close = function () {
    console.log('[Loader]--> close!');
    var optsObj = this.opts;
    optsObj.value = 0;
    optsObj.$loadingBg.hide();
  };
  /**
   * 
   * 打开loading
   * 
   * @param msg {String} 提示消息文本.
   * 
   */
  Loader.prototype.open = function (msg) {
    console.log('[Loader]--> open!');
    var optsObj = this.opts;
    optsObj.msg = msg != '' && msg != null ? msg : optsObj.msg;
    optsObj.$progressObj.html(optsObj.msg);
    optsObj.$loadingBg.show();
  };
  /**
   * 设置消息. <br/> 
   * 
   * @param msg {String} 提示消息文本.
   * 
   */
  Loader.prototype.setMsg = function (msg) {
    console.log('[Loader]--> setMsg!');
    var optsObj = this.opts;
    optsObj.msg = msg != '' && msg != null ? msg : optsObj.msg;
    optsObj.$progressObj.html(optsObj.msg);
  };
  /**
   * 设置进度并显示. <br/> 
   * 
   * @param progress {Number} 当前进度值.
   * 
   */
  Loader.prototype.setValue = function (progress) {
    console.log('[Loader]--> setValue!');
    var optsObj = this.opts;
    if (!!optsObj.useProgress) {
      optsObj.$progressObj.html(optsObj.msg + progress + '%');
    }
  };
  /**
   * 销毁loading. <br/> 
   * 
   */
  Loader.prototype.destroy = function () {
    console.log('[Loader]--> destroy!');
    // 移除HTML 标签.
    this.opts.$loadingBg.remove();
  };
  return Loader;
}(js_src_global, js_libs_zeptodev);
js_src_panelPrompt = function (window, $) {
  var Prompt = function (options) {
    console.log('[panelPrompt.js] --> 构造函数!');
    var defaults = {
      $wrapObj: null,
      // 父对象
      $domObj: null,
      // 提示面板 对象
      isMobile: true,
      templHtml: '<div class=\'read-comm-panel read-comm-mask read-sel-prompt-panel\' />',
      // 面板模板
      contentSet: [],
      // 面板内容集合
      _currentIdx: 0,
      // 当前展示的面板内容 下标.
      _defaultTxt: '提示面板!'
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  Prompt.prototype._init = function () {
    if (!this._check()) {
      console.error('[panelPrompt.js] -->请确认传入参数 是否正确! ');
      return;
    }
    this._renderLayout();
    this._bindEvent();
  };
  /**
   * 检测 传入参数合法性. <br/>
   *
   */
  Prompt.prototype._check = function () {
    var optsObj = this.opts;
    var chkVal = true;
    if (!optsObj.$wrapObj || optsObj.$wrapObj.length === 0 || optsObj.contentSet.length === 0) {
      // 数据不合法: 父对象不存在, 面板内容为空.
      chkVal = false;
    }
    return chkVal;
  };
  /**
   * 渲染布局. <br/>
   *
   */
  Prompt.prototype._renderLayout = function () {
    var optsObj = this.opts;
    optsObj.$domObj = $(optsObj.templHtml);
    optsObj.$wrapObj.append(optsObj.$domObj);
  };
  /**
   * 绑定事件. <br/>
   *
   */
  Prompt.prototype._bindEvent = function () {
    var optsObj = this.opts;
    var that = this;
    var eventName = optsObj.isMobile ? 'tap' : 'click';
    optsObj.$domObj.on(eventName, function () {
      that.close();
    });
  };
  /**
   * 打开 提示页面.<br/> 
   * 
   * @param {Number} index 正整数
   * 
   */
  Prompt.prototype.open = function (index) {
    var optsObj = this.opts;
    var len = optsObj.contentSet.length || 0;
    var tmpHtml = '';
    var tmpIdx = typeof index == 'undefined' || 0 == len || index < 0 ? 0 : index;
    tmpHtml = optsObj.contentSet[tmpIdx];
    optsObj.$domObj.html(tmpHtml);
    optsObj.$domObj.show();
  };
  /**
   * 关闭 提示页面.<br/> 
   * 
   */
  Prompt.prototype.close = function () {
    var optsObj = this.opts;
    optsObj.$domObj.hide();
    optsObj.$domObj.html(optsObj._defaultTxt);
  };
  return Prompt;
}(js_src_global, js_libs_zeptodev);
js_src_copyright = function (window, Tool, radioGroup, Dialog, $, Msg) {
  var Copyright = function (options) {
    var defaults = {
      $domObj: null,
      $readerObj: null,
      isMobile: true,
      /**
       * 版权保护配置
       * {
       *      'status'            是否开启版权保护,
       *      'copy_long'         {Number}  可复制字数
       *      'copy_times'        {Number}  可复制次数
       *      'print_flg'         {Boolean} 打印权限,ps: true可以打印
       *      'download_flg'      {Boolean} 下载权限 
       *      'screenshot_flg'    {Boolean} 截屏权限
       *      'watermark' {       独立水印
       *              'status'    是否水印,
       *              'imgUrl'    水印图片地址,
       *              'opacity'   透明度
       *          }
       * }
       */
      coprData: null,
      black_time: 30000,
      // 第一次黑屏30s,第二次60s,第三次120s，第四次退出reader
      black_timeMax: 120000,
      // 超出120s退出reader
      black_timeNow: 0,
      // 记录本次黑屏时间
      api: null
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
    this.copyrightMask = this._setMask;
  };
  /**
   * 初始化. <br/>
   * 
   */
  Copyright.prototype._init = function () {
    var optsObj = this.opts;
    var that = this;
    this._setLayout();
    this.getCoprParam(function () {
      that.run();
    }, 'first');
  };
  /**
   * 设置面板. <br/>
   * 
   */
  Copyright.prototype._setLayout = function () {
    var optsObj = this.opts;
    var templHtml = '<div class="read-comm-panel read-copyright-watermark">' + '<div class="read-watermark"></div>' + '<div class="read-mask"></div>' + '<div class="read-phoneblack"><div class="read-countdown"></div></div>' + '</div>';
    // 转化 zepto 对象;
    optsObj.$domObj = $(templHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
    optsObj.$domObj.find('.read-mask').on('click', function () {
      $(this).css('display', 'none');
    });
  };
  /**
   * 获取版权保护参数(独立水印/打印/截屏/下载/复制的权限参数，及复制字数次数). <br/>
   * 
   * @param {Function} cb     回调函数
   * @param {String}   state  是否是第一次调用,'fisrt'第一次调用,'nofisrt'非第一调用
   */
  Copyright.prototype.getCoprParam = function (cb, state) {
    var optsObj = this.opts;
    var that = this;
    var first = state || 'nofirst';
    optsObj.api.get_copyright({ img_type: 'base64' }, function (data) {
      data.watermark.imgUrl = 'data:image/png;base64,' + data.watermark.imgUrl;
      optsObj.coprData = data;
      that._saveCoprParam();
      cb();
    }, function (data) {
      if (first === 'first') {
        optsObj.$domObj.trigger('Copyright:getCoprParam');
      } else {
        cb();
      }
    });
  };
  /**
   * 版权保护，每次操作时向后台提交数据 <br/>
   * 
   * @param {String} operate_type  'copy','print','download_start','download_end','screenshot'
   * @param {Number} operate_val      a. 复制字数; b. 1:true, c. 0:false;
   */
  Copyright.prototype.setCoprParam = function (operate_type, operate_val) {
    var optsObj = this.opts;
    var that = this;
    var coprData = optsObj.coprData;
    if (!coprData.status) {
      return false;
    }
    optsObj.api.set_copyright({
      operate_type: operate_type,
      operate_val: operate_val
    }, function () {
      console.log('[copyright.js] ->setCoprParam 成功:');
    }, function (data) {
      if (operate_type === 'copy' && operate_val) {
        if (coprData.copy_long !== -1) {
          coprData.copy_long -= operate_val;
        }
        if (coprData.copy_times !== -1) {
          coprData.copy_times -= 1;
        }
        that._saveCoprParam();
      }
      console.log('[copyright.js] ->setCoprParam 出错:' + data);
    });
  };
  /**
   * 根据版权保护参数设置执行版权保护. <br/>
   * 
   */
  Copyright.prototype.run = function () {
    var optsObj = this.opts;
    this._setWatermark();
    if (optsObj.coprData.status) {
      this._intercept();
      this._interfaceFun();
    }
  };
  /**
   * 保存版权保护参数. <br/>
   * 
   */
  Copyright.prototype._saveCoprParam = function () {
    var optsObj = this.opts;
    optsObj.$domObj.trigger('Copyright:saveCoprParam', optsObj.coprData);
  };
  /**
   * 设置独立水印图片显示. <br/>
   * 
   */
  Copyright.prototype._setWatermark = function () {
    var optsObj = this.opts;
    var watermark = optsObj.coprData.watermark;
    if (watermark.status) {
      var waterMarkObj = optsObj.$domObj.find('.read-watermark');
      waterMarkObj.css('background-image', 'url(' + watermark.imgUrl + ')');
      waterMarkObj.css('opacity', watermark.opacity / 100);
      waterMarkObj.css('display', 'block');
    }
  };
  /**
   * 拦截鼠标，快捷键和touch事件. <br/>
   *
   */
  Copyright.prototype._intercept = function () {
    var optsObj = this.opts;
    var that = this;
    //禁止鼠标右键
    optsObj.$readerObj[0].oncontextmenu = function () {
      return that._pressRbutton();
    };
    //禁止快捷键复制,打印,截屏
    document.onkeydown = function () {
      if (event.ctrlKey && window.event.keyCode == 67) {
        return that._pressCtrlC();
      }
      if (event.ctrlKey && window.event.keyCode == 80) {
        return that._pressCtrlP();
      }
      if (event.ctrlKey && (event.altKey || window.event.keyCode == 18)) {
        return that._pressCtrlAlt();
      }
    };
    if (!optsObj.coprData.print_flg) {
      // 通过鼠标onblur事件判断页面是否在第一焦点 
      window.onblur = function () {
        that._setMask('worked');
      };
    }
    //手机端禁止文本选中
    if (optsObj.isMobile) {
      optsObj.$readerObj.css({
        '-webkit-user-select': 'none',
        '-ms-user-select': 'none'
      });
    }
  };
  /**
   * 对应小精灵接口和cordova接口. <br/>
   */
  Copyright.prototype._interfaceFun = function () {
    var coprData = this.opts.coprData;
    var that = this;
    /*CtrlC **/
    if (typeof gli_capture_cc != 'undefined' && typeof gli_capture_cc == 'function') {
      var pressCtrlC = this._pressCtrlC;
      gli_capture_cc(pressCtrlC);
    }
    /*CtrlP **/
    if (typeof gli_capture_cp != 'undefined' && typeof gli_capture_cp == 'function') {
      var pressCtrlP = this._pressCtrlP;
      gli_capture_cp(pressCtrlP);
    }
    /*Ctrl + Alt **/
    if (typeof gli_capture_ctrl_alt != 'undefined' && typeof gli_capture_ctrl_alt == 'function') {
      var pressCtrlAlt = this._pressCtrlAlt;
      gli_capture_ctrl_alt(pressCtrlAlt);
    }
    /*右键 **/
    if (typeof gli_capture_rbutton != 'undefined' && typeof gli_capture_rbutton == 'function') {
      var pressRbutton = this._pressRbutton;
      gli_capture_rbutton(pressRbutton);
    }
    /*窗口变化 **/
    if (typeof gli_capture_foreground != 'undefined' && typeof gli_capture_foreground == 'function') {
      var loseFocus = this._loseFocus;
      gli_capture_foreground(loseFocus);
    }
    //cordova接口:每100ms调用cordova手机相片数量统计接口，根据数量变化进行黑屏处理
    if (typeof gli_photo_change != 'undefined' && typeof gli_photo_change == 'function') {
      if (!coprData.screenshot_flg) {
        gli_photo_change(function () {
          that._phoneblack();
        }, true);
      }
    }
    // 小精灵端监控剪切板发生变化调用此事件
    if (typeof gli_capture_clipboard_change != 'undefined' && typeof gli_capture_clipboard_change == 'function') {
      if (!coprData.screenshot_flg) {
        gli_capture_clipboard_change(function (data) {
          that._clipboardChange(data);
        });
      }
    }
  };
  /**
   * 小精灵接口回调：CtrlC. <br/>
   */
  Copyright.prototype._pressCtrlC = function () {
    return false;
  };
  /**
   * 小精灵接口回调：打印. <br/>
   */
  Copyright.prototype._pressCtrlP = function () {
    var coprData = this.opts.coprData;
    if (coprData.print_flg) {
      //小精灵打印
      if (typeof gli_web_print != 'undefined' && typeof gli_web_print == 'function') {
        gli_web_print();
      }
      this.setCoprParam('print', 1);
      return true;
    } else {
      this.setCoprParam('print', 0);
      return false;
    }
  };
  /**
   * 小精灵接口回调：CtrlAlt. <br/>
   */
  Copyright.prototype._pressCtrlAlt = function () {
    var coprData = this.opts.coprData;
    if (coprData.screenshot_flg) {
      return true;
    } else {
      this._setMask('worked');
      return false;
    }
  };
  /**
   * 小精灵接口回调：右键. <br/>
   */
  Copyright.prototype._pressRbutton = function () {
    return false;
  };
  /**
   * 小精灵接口回调：窗口变化. <br/>
   * 
   * @param {Boolean} flag
   */
  Copyright.prototype._loseFocus = function (flag) {
    var coprData = this.opts.coprData;
    if (!coprData.print_flg && !flag) {
      this._setMask('worked');
    }
  };
  /**
   * 设置版权保护蒙层. <br/>
   * 
   * @param {String} action 'worked' 显示蒙层
   */
  Copyright.prototype._setMask = function (action) {
    var optsObj = this.opts;
    var mask = optsObj.$domObj.find('.read-mask');
    if (action === 'worked') {
      mask.css('display', 'block');
    } else {
      mask.css('display', 'none');
    }
  };
  /**
   * 黑屏事件. <br/>
   */
  Copyright.prototype._phoneblack = function () {
    var optsObj = this.opts;
    this.setCoprParam('screenshot', 1);
    var time_now = new Date().getTime();
    var time_old = parseInt(localStorage.getItem('timeRecord')) || time_now;
    localStorage.setItem('timeRecord', time_now);
    localStorage.setItem('black_timeNow', localStorage.getItem('black_timeNow') || optsObj.black_time);
    //超过10分钟，恢复黑屏时间
    if (time_now - time_old > 10 * 60 * 1000) {
      localStorage.setItem('black_timeNow', optsObj.black_time);
    }
    var count = parseInt(localStorage.getItem('black_timeNow'));
    if (count > optsObj.black_timeMax) {
      //退出reader
      optsObj.$domObj.trigger('Copyright:exitReaderCb');
      return false;
    }
    var phoneblackObj = optsObj.$domObj.find('.read-phoneblack');
    var countdownObj = optsObj.$domObj.find('.read-countdown');
    phoneblackObj.css('display', 'block');
    optsObj.black_timeNow = count;
    localStorage.setItem('black_timeNow', parseInt(count) * 2);
    // 黑屏恢复倒计时
    this._countDown();
    setTimeout(function () {
      phoneblackObj.css('display', 'none');
    }, count);
  };
  /**
   * 黑屏恢复倒计时显示. <br/>
   */
  Copyright.prototype._countDown = function () {
    var that = this;
    var optsObj = that.opts;
    var timeRecord = localStorage.getItem('timeRecord');
    var n = (parseInt(timeRecord) + optsObj.black_timeNow - new Date().getTime()) / 1000;
    var countdownObj = optsObj.$domObj.find('.read-countdown');
    countdownObj.html('您有截屏操作\uFF0C我们正在对您进行黑屏处理\uFF0C还有' + n.toFixed(0) + '秒恢复正常\uFF01');
    if (n >= 0) {
      setTimeout(function () {
        that._countDown.call(that);
      }, 1000);
    } else {
      // 重新注册cordova 监听手机图片接口
      gli_photo_change(function () {
        that._phoneblack();
      }, true);
    }
  };
  /**
   * 小精灵监听剪辑版为图片时调用. <br/>
   * 
   * @param {String} data 返回图片判断值:'bitmap'
   */
  Copyright.prototype._clipboardChange = function (data) {
    var that = this;
    var type = data;
    //如果小精灵返回的数据类型data为图片则清空剪切板内容
    if (type === 'bitmap') {
      that._phoneblack();
      if (typeof gli_set_clipboard != 'undefined' && typeof gli_set_clipboard == 'function') {
        gli_set_clipboard({
          type: 'text',
          text: ''
        });
        that.setCoprParam('screenshot', 0);
      }
    }
  };
  /**
   * 自定义事件. <br/>
   * 
   * @param eventName {String}   事件名称, 'Copyright:saveCoprParam', 'Copyright:getCoprParam',
   *              'Copyright:exitReaderCb'
   * @param cb        {Function} 回调事件
   * 
   */
  Copyright.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  return Copyright;
}(js_src_global, js_src_tool, js_src_widget_plugRadioGroup, js_src_widget_plugDialog, js_libs_zeptodev, js_src_message_zh);
js_src_panelViewImg = function (window, $, move) {
  var _ = window._;
  // 图片集合html
  var imgViewHtml = '<div class="read-img-list" style="<%=obj.listStyle %>">' + '<% _.each(obj.imgSet, function(item){  %>' + '<div class="read-img-item" style="<%=obj.itemStyle %>">' + '<img src="<%= obj.isClient ? item.new_src : item.old_src %>" />' + '</div>' + '<% }); %>' + '</div>';
  var ViewImg = function (options) {
    console.log('[panelViewImg.js] -> 查看图片,  构造函数!!');
    var defaults = {
      $wrapObj: null,
      // 父对象
      $domObj: null,
      isDownloadImg: true,
      // 图片集合
      imgSet: [],
      //  当前图片的下标. data-index
      currentIdx: 0,
      dataTempl: '',
      _dataTemplObj: null,
      _templ: '<div class=\'read-comm-panel read-comm-mask read-sel-imgview-panel read-hide\' />',
      _wrapW: 0,
      // 插件 宽度.
      _listTotalW: 0,
      // 图片列表 总宽度;
      _left: 0,
      // 偏移量;
      // 本次预览图片信息
      /**
       * {
       *     imgSet:[],
       *     currentIdx:0
       * }
       */
      dataInfo: null
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  ViewImg.prototype._init = function () {
    var optsObj = this.opts;
    if (optsObj.clientType == 'PC') {
      this._renderLayoutPC();
      this._bindEventPC();
    } else {
      this._renderLayout();
      this._bindEvent();
    }
  };
  /**
   * 渲染布局.MOBILE和PAD通用 <br/>
   *
   */
  ViewImg.prototype._renderLayout = function () {
    var optsObj = this.opts;
    optsObj.$domObj = $(optsObj._templ);
    var _dataTemplObj = _.template(optsObj.dataTempl);
    var tmpDataHtml = _dataTemplObj();
    optsObj.$domObj.html(tmpDataHtml);
    optsObj.$wrapObj.append(optsObj.$domObj);
    // 设置面板
    optsObj.$imgSetting = optsObj.$domObj.find('.read-img-setting');
    optsObj.$setHeadObj = optsObj.$imgSetting.find('.read-header');
    optsObj.$setFootObj = optsObj.$imgSetting.find('.read-footer');
    var headerTopVal = optsObj.$setHeadObj.css('top');
    var footerBottomVal = optsObj.$setFootObj.css('bottom');
    // 保存 header, footer 原始值. 动画还原.
    optsObj.$setHeadObj.attr('data-top', headerTopVal);
    optsObj.$setFootObj.attr('data-bottom', footerBottomVal);
    if (!optsObj.isDownloadImg) {
      optsObj.$imgSetting.find('.read-save-btn').hide();
    }
    optsObj._wrapW = optsObj.$wrapObj.width();
  };
  /**
   * 渲染PC布局. <br/>
   */
  ViewImg.prototype._renderLayoutPC = function () {
    var optsObj = this.opts;
    var _dataTemplObj = _.template(optsObj.dataTempl);
    var tmpDataHtml = _dataTemplObj();
    optsObj.$domObj = $(tmpDataHtml);
    optsObj.$wrapObj.append(optsObj.$domObj);
    if (!optsObj.isDownloadImg) {
      optsObj.$domObj.find('.read-save-btn').hide();
    }
    optsObj._wrapW = optsObj.$wrapObj.width() - 200;
  };
  /**
   * PC绑定事件. <br/>
   *
   */
  ViewImg.prototype._bindEventPC = function () {
    var that = this;
    var optsObj = this.opts;
    var changeVal = optsObj._wrapW;
    // 切换上一张图片
    optsObj.$domObj.find('.read-body .read-prev').on('click', function (e) {
      that._changeImg(-changeVal);
    });
    // 浏览图片点击下一页
    optsObj.$domObj.find('.read-body .read-next').on('click', function (e) {
      that._changeImg(changeVal);
    });
    // 点击返回 退出图片页
    optsObj.$domObj.find('.read-header .read-back-btn').on('click', function () {
      that.close();
    });
    // 图片旋转
    optsObj.$domObj.find('.read-header .read-rotate-btn').on('click', function () {
      that._imgRotate90();
      var selfBtn = this;
      // 正在旋转时不允许点击（连续点击会导致不能正确居中显示）;
      $(selfBtn).css('pointer-events', 'none');
      setTimeout(function () {
        $(selfBtn).css('pointer-events', 'auto');
      }, 500);
    });
    // 图片保存
    optsObj.$domObj.find('.read-header .read-save-btn').on('click', function () {
      var img = optsObj.$domObj.find('.read-img-list').find('img').eq(optsObj.dataInfo.currentIdx - 1);
      if (optsObj.isClient) {
      } else {
        OpenWindow = window.open(img.attr('src'), 'AAA', 'toolbar=yes, location=no, directories=no, status=1, menubar=0, scrollbars=1,' + 'resizable=1, menubar=no, copyhistory=yes, width=400, height=400');
      }
    });
  };
  /**
   * 绑定事件. <br/>
   *
   */
  ViewImg.prototype._bindEvent = function () {
    var that = this;
    var optsObj = this.opts;
    var changeVal = optsObj._wrapW;
    // 切换上一张图片
    optsObj.$domObj.on('swipeLeft', function () {
      that._changeImg(-changeVal);
    });
    // 切换下一张图片
    optsObj.$domObj.on('swipeRight', function () {
      that._changeImg(changeVal);
    });
    // 点击图片显示页中间区域弹出设置面板
    optsObj.$domObj.find('.read-viewimg-content').on('tap', function () {
      that.settingOpen();
    });
    // 点击设置面板中间区域关闭设置面板
    optsObj.$imgSetting.on('tap', '.read-body', function () {
      that.settingClose();
    });
    // 点击返回 退出图片页
    optsObj.$imgSetting.on('tap', '.read-exit-img', function () {
      that.close();
    });
    // 图片旋转
    optsObj.$imgSetting.on('tap', '.read-rotate-btn', function () {
      that._imgRotate90();
      var selfBtn = this;
      // 正在旋转时不允许点击（连续点击会导致不能正确居中显示）;
      $(selfBtn).css('pointer-events', 'none');
      setTimeout(function () {
        $(selfBtn).css('pointer-events', 'auto');
      }, 500);
    });
    // 图片保存
    optsObj.$imgSetting.on('tap', '.read-save-btn', function () {
      var img = optsObj.$domObj.find('.read-img-list').find('img').eq(optsObj.dataInfo.currentIdx - 1);
      if (optsObj.isClient) {
        gli_savepic_album(img.attr('src'));  // TODO 待调试接口
      } else {
        OpenWindow = window.open(img.attr('src'), 'AAA', 'toolbar=yes, location=no, directories=no, status=1, menubar=0, scrollbars=1,' + 'resizable=1, menubar=no, copyhistory=yes, width=400, height=400');
      }
    });
  };
  /**
   * 切换图片.<br/>
   * 
   * @param {Number} moveVal 移动偏移量 (ps: 可正,可负)
   * 
   */
  ViewImg.prototype._changeImg = function (moveVal) {
    var optsObj = this.opts;
    // 所有图片所需容器宽度
    var totalW = optsObj._listTotalW;
    // 当前容器的偏移量
    var leftVal = optsObj._left;
    // 动画DOM对象
    var listObj = optsObj.$domObj.find('.read-img-list')[0];
    // 当前图片是本章所有图片的的第几张
    var currentIdx = parseInt(optsObj.dataInfo.currentIdx);
    var targetleft = leftVal + moveVal;
    if (targetleft <= -totalW || targetleft > 0) {
      // 不能执行本次 切换动作
      // TODO 提示消息
      console.warn('不能执行本次 切换动作!');
    } else {
      optsObj._left = targetleft;
      // 移动后重新判断当前图片是本章所有图片的的第几张
      if (optsObj.clientType == 'PC') {
        currentIdx = moveVal < 0 ? currentIdx - 1 : currentIdx + 1;
      } else {
        currentIdx = moveVal > 0 ? currentIdx - 1 : currentIdx + 1;
      }
      optsObj.dataInfo.currentIdx = currentIdx;
      // pc图标切换上下一页显示
      this._judgePc(currentIdx);
      move(listObj).set('left', targetleft + 'px').duration('0.2s').end();
    }
  };
  /**
   * 设置图片参数. <br/>
   * 
   * @param {Object} imgInfo
   * @param {Array}  imgInfo.imgSet
   * @param {Number} imgInfo.currentIdx
   * 
   */
  ViewImg.prototype.setOptions = function (imgInfo) {
    var optsObj = this.opts;
    // 需要显示的图片集合
    var tmpImgSet = imgInfo.imgSet;
    // 图片张数
    var imgLen = tmpImgSet.length;
    // 所有图片所需容器宽度
    var totalW = imgLen * optsObj._wrapW;
    // 当前图片是本章所有图片的的第几张
    var currentIdx = imgInfo.currentIdx;
    // 根据是否是客户端--判断显示图片src的值时显示new_src还是old_src
    imgInfo.isClient = optsObj.isClient;
    // 容器宽度存起来_changeImg方法需使用
    optsObj._listTotalW = totalW;
    // 当前容器的偏移量
    optsObj._left = optsObj.clientType == 'PC' ? -(imgLen - currentIdx) * optsObj._wrapW : -(currentIdx - 1) * optsObj._wrapW;
    var floatDirection = optsObj.clientType == 'PC' ? 'float:right;' : 'float:left;';
    if (Object.prototype.toString.call(tmpImgSet) == '[object Array]' && imgLen > 0) {
      imgInfo.listStyle = 'width:' + totalW + 'px;' + 'left:' + optsObj._left + 'px;';
      imgInfo.itemStyle = 'width:' + optsObj._wrapW + 'px;' + floatDirection;
    }
    var imgViewHtmlObj = _.template(imgViewHtml);
    var tmpDataHtml = imgViewHtmlObj(imgInfo);
    optsObj.$domObj.find('.read-viewimg-content').html(tmpDataHtml);
    // 把imgInfo信息存起来_changeImg方法需使用
    optsObj.dataInfo = imgInfo;
    // pc图标切换上下一页显示
    this._judgePc(currentIdx);
  };
  /**
   * 判断pc翻页小图标显示状态
   */
  ViewImg.prototype._judgePc = function (currentIdx) {
    var optsObj = this.opts;
    if (optsObj.clientType == 'PC') {
      var prevBtn = optsObj.$domObj.find('.read-body .read-prev');
      var nextBtn = optsObj.$domObj.find('.read-body .read-next');
      // pc翻页图标样式
      if (currentIdx == 1) {
        prevBtn.addClass('read-disabled');
      } else if (Math.abs(currentIdx) == optsObj.dataInfo.imgSet.length) {
        nextBtn.addClass('read-disabled');
      } else {
        prevBtn.removeClass('read-disabled');
        nextBtn.removeClass('read-disabled');
      }
    }
  };
  /**
   * 图片旋转90° 操作
   */
  ViewImg.prototype._imgRotate90 = function () {
    var optsObj = this.opts;
    var that = this;
    var img = optsObj.$domObj.find('.read-img-list').find('img').eq(optsObj.dataInfo.currentIdx - 1);
    var width = img.width();
    var height = img.height();
    var deg = parseInt(img.attr('data-rotate')) || 1;
    // 旋转动画
    move(img[0]).rotate(90 * deg).duration('0.5s').end();
    /**
     * 之前居中显示是用transform的translate居中
     * 由于move覆盖了tranform样式且旋转后的translate是不准确的
     * 这里用margin居中。
     */
    if (deg % 2 == 0) {
      img.css('margin', -width / 2 + 'px 0 0 ' + -height / 2 + 'px');
    } else {
      img.css('margin', -height / 2 + 'px 0 0 ' + -width / 2 + 'px');
    }
    img.attr('data-rotate', ++deg);
  };
  /**
   * 打开设置面板. <br/>
   */
  ViewImg.prototype.settingOpen = function () {
    var optsObj = this.opts;
    var headerTopVal = optsObj.$setHeadObj.attr('data-top');
    var footerBottomVal = optsObj.$setFootObj.attr('data-bottom');
    optsObj.$imgSetting.fadeIn(200);
    // 隐藏 面板
    move(optsObj.$setHeadObj[0]).set('top', '0').duration('0.3s').end();
    move(optsObj.$setFootObj[0]).set('bottom', '0').duration('0.3s').end();
  };
  /**
   * 打开设置面板. <br/>
   */
  ViewImg.prototype.settingClose = function () {
    var optsObj = this.opts;
    var headerTopVal = optsObj.$setHeadObj.attr('data-top');
    var footerBottomVal = optsObj.$setFootObj.attr('data-bottom');
    // 隐藏 面板
    move(optsObj.$setHeadObj[0]).set('top', headerTopVal).duration('0.3s').end();
    move(optsObj.$setFootObj[0]).set('bottom', footerBottomVal).duration('0.3s').end();
    setTimeout(function () {
      optsObj.$imgSetting.hide();
    }, 300);
  };
  /**
   * 打开面板. <br/>
   *
   */
  ViewImg.prototype.open = function () {
    var optsObj = this.opts;
    optsObj.$domObj.show(400);
  };
  /**
   * 关闭面板. <br/>
   *
   */
  ViewImg.prototype.close = function () {
    var optsObj = this.opts;
    optsObj.$domObj.hide();
  };
  return ViewImg;
}(js_src_global, js_libs_zeptodev, move);
js_src_config = {
  /**
   * 阅读进度参数 <br>.
   */
  progressData: {
    updateTime: '',
    // {String} 最近更新时间, 毫秒 (注: 与服务器同步.);
    progress: 0
  },
  /**
   * 设置参数 <br>.
   */
  settingData: {
    readTimes: 0,
    // {Number} 使用次数( 首次[or 前两次])打开APP, 操作提示界面 );
    brightness: 0.15,
    // {Number}, 屏幕亮度 [0 - 100];
    useSysBrightness: false,
    // {Boolean}, 系统亮度;
    // 字体大小.
    fontSize: {
      'list': [
        {
          text: '小',
          value: '1'
        },
        {
          text: '中',
          value: '2'
        },
        {
          text: '大',
          value: '3'
        },
        {
          text: '大大',
          value: '4'
        }
      ],
      'value': '2'
    },
    // 翻页方式
    pagingType: {
      'list': [
        {
          'text': '平铺翻页',
          // tile
          'value': 'page_1'
        },
        {
          'text': '仿真翻页',
          // simulation
          'value': 'page_2'
        }
      ],
      'value': 'page_1'
    },
    // 字体类型.
    fontFamily: {
      'list': [
        {
          'text': '雅黑',
          'value': '1'
        },
        {
          'text': '宋体',
          'value': '2'
        },
        {
          'text': '黑体',
          'value': '3'
        }
      ],
      'value': '1'
    },
    // 背景颜色.
    bgColor: {
      'list': [
        {
          'text': '',
          'value': '1',
          'bg': 'read-bg-white'
        },
        {
          'text': '',
          'value': '2',
          'bg': 'read-bg-blue'
        },
        {
          'text': '',
          'value': '3',
          'bg': 'read-bg-pink'
        },
        {
          'text': '',
          'value': '4',
          'bg': 'read-bg-green'
        }
      ],
      'value': '2'
    },
    // 夜间模式
    isNightMode: false,
    // {Boolean}, 屏幕长亮
    screenLongActive: false
  },
  /**
   * 版权保护 <br>.
   */
  copyright: {
    'status': true,
    // {Boolean} true开启版权保护
    'copy_long': 100,
    // {Number}  可复制字数
    'copy_times': 3,
    // {Number}  可复制次数
    'print_flg': true,
    // {Boolean} 打印权限,ps: true可以打印
    'download_flg': true,
    // {Boolean} 下载权限 
    'screenshot_flg': true,
    // {Boolean} 截屏权限
    // 独立水印
    'watermark': {
      'status': false,
      // {Boolean} true开启独立水印
      'imgUrl': 'http://img58.nipic.com/file/20140911/13713955_102931345000_1.jpg',
      // 水印图片url
      'opacity': 20
    }
  },
  license_id: 'doc_110220330',
  // 加密 - 文件许可证号;
  server: 'server_101010101010'
};
js_src_select = function (window, Tool, radioGroup, Dialog, $, Msg) {
  var Select = function (options) {
    var defaults = {
      $domObj: null,
      $readerObj: null,
      $contentObj: null,
      // 主面板内容容器
      $menuWrap: null,
      // 复制等菜单根容器
      isMobile: true,
      pageColumn: 1,
      touchState: 0,
      // 0,无操作; 1.touchstart; 2.长按状态; 3.取消长按
      isShowMenu: 0,
      // 是否显示菜单
      ismove: 1,
      // 是否可以移动上标和下标
      posMenu: '',
      // 选择文本时弹出的上标下标菜单标识,'upper'上标,'lower'下标
      pos: {
        // touch/mouse定位
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
      },
      useNote: true,
      useCorrect: true,
      menu: {
        'list': [
          {
            'text': '划线',
            'value': 'underline'
          },
          {
            'text': '笔记',
            'value': 'note'
          },
          {
            'text': '复制',
            'value': 'copy'
          },
          {
            'text': '纠错',
            'value': 'correct'
          }
        ],
        'value': 'copy'
      },
      coprObj: null
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  Select.prototype._init = function () {
    var optsObj = this.opts;
    this._setLayout();
    this._bindEvent();
    // 禁止手机自带选择
    if (optsObj.isMobile) {
      optsObj.$readerObj.css({
        '-webkit-user-select': 'none',
        '-ms-user-select': 'none'
      });
    }
  };
  /**
   * 设置面板. <br/>
   * 
   */
  Select.prototype._setLayout = function () {
    var optsObj = this.opts;
    var templHtml = '<div class="read-comm-panel read-content-select">' + '<div class="read-radiogroup-menu"></div>' + '<div class="read-pos-upper"></div>' + '<div class="read-pos-lower"></div>' + '</div>';
    // 转化 zepto 对象;
    optsObj.$domObj = $(templHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
    optsObj.$contentObj = optsObj.$readerObj.find('.read-selector-main .read-content');
    optsObj.$allContentObj = optsObj.$contentObj;
    optsObj.$menuWrap = optsObj.$domObj.find('.read-radiogroup-menu');
    // 菜单
    var menuList = optsObj.menu.list;
    for (var i = 0, len = menuList.length; i < len; i++) {
      if (!optsObj.useNote) {
        if (menuList[i].value == 'underline' || menuList[i].value == 'note') {
          menuList[i].active = 'false';
          menuList[i].bg = 'read-bg-gray';
        }
      }
      if (!optsObj.useCorrect) {
        if (menuList[i].value == 'correct') {
          menuList[i].active = 'false';
          menuList[i].bg = 'read-bg-gray';
        }
      }
    }
    this.$menuObj = new radioGroup({
      '$domObj': optsObj.$menuWrap,
      'data': menuList,
      'value': optsObj.menu.value,
      'isMobile': optsObj.isMobile
    });
    optsObj.$menuWrap.fadeOut(1);
    // 弹出框
    this.DialogObj = new Dialog({
      '$wrapDomObj': optsObj.$readerObj,
      'isMobile': optsObj.isMobile
    });
    // 选择文本时弹出的上标下标按钮
    this.upperPos = optsObj.$domObj.find('.read-pos-upper');
    this.lowerPos = optsObj.$domObj.find('.read-pos-lower');
    this.posW = this.upperPos.width();
    this.posH = this.upperPos.height();
    this.upperPos.fadeOut(10);
    this.lowerPos.fadeOut(10);
  };
  /**
   * 获取event坐标参数. <br/>
   * 
   * @param {Object} event
   * @return {Object} event
   */
  Select.prototype._getEvent = function (event) {
    var optsObj = this.opts;
    if (!event) {
      return false;
    }
    if (!optsObj.isMobile) {
      event = event || window.event;
    } else if (event.touches !== undefined && typeof event.touches === 'object' && event.touches.length > 0) {
      event = event.touches[0];
    } else if (event.targetTouches.touches !== undefined && typeof event.targetTouches.touches === 'object' && event.targetTouches.touches.length > 0) {
      event = event.targetTouches.touches[0];
    } else if (event.changedTouches !== undefined && typeof event.changedTouches === 'object' && event.changedTouches.length > 0) {
      event = event.changedTouches[0];
    } else {
      event = undefined;
    }
    return event;
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  Select.prototype._bindEvent = function () {
    var optsObj = this.opts;
    var that = this;
    var $contentObj = optsObj.$contentObj;
    // 点击上标时隐藏复制划线等组合菜单
    this.upperPos.on('touchstart', function (event) {
      optsObj.$menuWrap.fadeOut(1);
    });
    // 点击下标时隐藏复制划线等组合菜单
    this.lowerPos.on('touchstart', function (event) {
      optsObj.$menuWrap.fadeOut(1);
    });
    // 拖动上标
    this.upperPos.on('touchmove', function (event) {
      if (!optsObj.ismove) {
        return false;
      }
      var touchObj = that._getEvent(event);
      var pos = optsObj.pos;
      optsObj.posMenu = 'upper';
      var linehight = $contentObj.css('line-height');
      linehight = parseFloat(linehight.replace('px', ''));
      var fontsize = $contentObj.css('font-size');
      fontsize = parseFloat(fontsize.replace('px', ''));
      var startX = touchObj.pageX + that.posW / 2;
      var startY = touchObj.pageY + that.posH / 2;
      if (startY > pos.endY + (linehight - fontsize) / 2 || Math.abs(startY - pos.endY) < linehight / 2 && startX + fontsize / 8 > pos.endX) {
        startX = pos.endX;
        startY = pos.endY;
      }
      pos.startX = startX;
      pos.startY = startY;
      that._selectElem(pos.startX, pos.startY, pos.endX, pos.endY);
    });
    // 拖动下标
    this.lowerPos.on('touchmove', function (event) {
      if (!optsObj.ismove) {
        return false;
      }
      var touchObj = that._getEvent(event);
      var pos = optsObj.pos;
      optsObj.posMenu = 'lower';
      var linehight = $contentObj.css('line-height');
      linehight = parseFloat(linehight.replace('px', ''));
      var fontsize = $contentObj.css('font-size');
      fontsize = parseFloat(fontsize.replace('px', ''));
      var endX = touchObj.pageX - that.posW / 2;
      var endY = touchObj.pageY - that.posH / 2;
      if (endY < pos.startY - (linehight - fontsize) / 2 || Math.abs(pos.startY - endY) < linehight / 2 && pos.startX - fontsize / 8 > endX) {
        endX = pos.startX;
        endY = pos.startY;
      }
      pos.endX = endX;
      pos.endY = endY;
      that._selectElem(pos.startX, pos.startY, pos.endX, pos.endY);
    });
    // 上标touchend
    this.upperPos.on('touchend', function (event) {
      if (optsObj.touchState === 2) {
        that._menuShow();
      }
      if (optsObj.touchState === 1) {
        optsObj.touchState = 0;
      }
    });
    // 下标touchend
    this.lowerPos.on('touchend', function (event) {
      if (optsObj.touchState === 2) {
        that._menuShow();
      }
      if (optsObj.touchState === 1) {
        optsObj.touchState = 0;
      }
    });
    // 点击文本, 长按通过此事件响应时间进行判断
    $contentObj.on('touchstart', function (event) {
      var touchObj = that._getEvent(event);
      optsObj.pos.startX = touchObj.pageX;
      optsObj.pos.startY = touchObj.pageY;
      optsObj.pos.endX = touchObj.pageX;
      optsObj.pos.endY = touchObj.pageY;
      that._menuclose();
      that.upperPos.fadeOut(10);
      that.lowerPos.fadeOut(10);
      if (optsObj.touchState === 2) {
        optsObj.touchState = 3;
      } else {
        optsObj.touchState = 1;
      }
      setTimeout(function () {
        that._isLongTouch.call(that);
      }, 400);
    });
    // 在文本中滑动
    $contentObj.on('touchmove', function (event) {
      if (optsObj.touchState === 3) {
        return false;
      }
      if (optsObj.touchState !== 2) {
        optsObj.touchState = 0;
      }
    });
    $contentObj.on('touchend', function (event) {
      if (optsObj.touchState === 2) {
        // 长按状态下,显示菜单
        that._menuShow();
      }
      if (optsObj.touchState === 1) {
        optsObj.touchState = 0;
      }
    });
    // 列举需要阻止冒泡的事件名
    var eventName = optsObj.isMobile ? 'tap' : 'click';
    var eventType = eventName + ' swipeDown swipeLeft swipeRight';
    // 防止事件击穿,不能添加删除书签等
    $contentObj.on(eventType, function (event) {
      if (optsObj.touchState === 2) {
        return false;
      }
      if (optsObj.touchState === 3) {
        optsObj.touchState = 0;
        return false;
      }
    });
    // 菜单按钮点击事件
    this.$menuObj.on('change:click', function (e, param) {
      var firstId = $contentObj.find('.read-font-select').first().attr('data-id');
      var lastId = $contentObj.find('.read-font-select').last().attr('data-id');
      var currInfo = that._getPosLen();
      var selectData = {
        'firstId': parseInt(firstId),
        'lastId': parseInt(lastId),
        'original': '',
        'isunderline': !optsObj.ismove,
        'posLen': currInfo.posLen,
        'currPage': currInfo.currPage
      };
      $contentObj.find('.read-font-select').each(function () {
        if ($(this).hasClass('reader-MathJax')) {
          selectData.original += $(this).find('script').html();
        } else {
          if ($(this).hasClass('read-special-tab')) {
            selectData.original += $(this).html();
          } else {
            selectData.original += $(this).text();
          }
        }
      });
      // 复制
      if (param.newValue === 'copy') {
        that._phoneCopy();
      }
      // 划线
      if (param.newValue === 'underline') {
        if (param.newText === '删除') {
          var noteid = $contentObj.find('.read-font-select').attr('data-noteid');
          optsObj.$domObj.trigger('Select:delUnderline', noteid);
        } else {
          optsObj.$domObj.trigger('Select:addUnderline', selectData);
        }
        optsObj.touchState = 0;
        that._menuclose();
        that.upperPos.fadeOut(10);
        that.lowerPos.fadeOut(10);
      }
      // 笔记
      if (param.newValue === 'note') {
        if (!!$contentObj.find('.read-font-select').attr('data-noteid')) {
          selectData.note_id = $contentObj.find('.read-font-select').attr('data-noteid');
        }
        optsObj.$domObj.trigger('Select:addNote', selectData);
        optsObj.touchState = 0;
        that._menuclose();
        that.upperPos.fadeOut(10);
        that.lowerPos.fadeOut(10);
      }
      // 纠错
      if (param.newValue === 'correct') {
        optsObj.$domObj.trigger('Select:correct', selectData);
        optsObj.touchState = 0;
        that._menuclose();
        that.upperPos.fadeOut(10);
        that.lowerPos.fadeOut(10);
      }
    });
  };
  /**
   * 手机端复制文本. <br/>
   */
  Select.prototype._phoneCopy = function () {
    var optsObj = this.opts;
    var copyText = '';
    var len = 0;
    optsObj.$contentObj.find('.read-font-select').each(function () {
      copyText += $(this)[0].innerText;
      if (Tool.trim($(this)[0].innerText) !== '') {
        len += 1;
      }
    });
    this._gliCopy(copyText, len);
  };
  /**
   * 每次复制向后台读取剩余复制字数次数，并判断. <br/>
   * 
   * @param {String} txt  复制文本内容
   * @param {Number} len  复制文本长度
   */
  Select.prototype._gliCopy = function (txt, len) {
    var optsObj = this.opts;
    var that = this;
    var copyText = txt || '';
    var copyLength = len;
    //每次复制，重新向后台取数据
    optsObj.coprObj.getCoprParam(function () {
      var coprData = optsObj.coprObj.opts.coprData;
      var currLength = -1;
      var currTimes = -1;
      if (coprData.status) {
        currLength = coprData.copy_long;
        currTimes = coprData.copy_times;
      }
      if (currLength == -1 && currTimes == -1) {
        that._setCopyInfo(copyText, copyLength);
      } else {
        if (copyLength > 0 && copyLength <= currLength && currTimes > 0) {
          that._setCopyInfo(copyText, copyLength);
        } else {
          optsObj.coprObj.setCoprParam('copy', 0);
          that._copyDisabled(currTimes, currLength);
          copyText = '';
        }
      }
    });
  };
  /**
   * 支持手机端、小精灵端、和PC浏览器复制. <br/>
   * 
   * @param {String} txt 复制文本内容
   * @param {Number} len  复制文本长度
   */
  Select.prototype._setCopyInfo = function (txt, len) {
    var optsObj = this.opts;
    var that = this;
    var copyText = txt || '';
    var copyLength = len;
    try {
      if (typeof gli_set_clipboard != 'undefined' && typeof gli_set_clipboard == 'function') {
        if (copyText) {
          // 手机端和小精灵复制
          gli_set_clipboard({
            type: 'text',
            text: copyText
          });
        }
      }
      optsObj.coprObj.setCoprParam('copy', copyLength);
      that.DialogObj.setMsg('您复制了' + copyLength + '个字!');
      that.DialogObj.opts.okBtn.func = function (e) {
        var copyInput = $('<input id="copyInput"  value="' + copyText + '" />');
        document.getElementsByTagName('body')[0].appendChild(copyInput[0]);
        document.getElementById('copyInput').select();
        // PC端浏览器复制
        document.execCommand('copy');
        copyInput.remove();
        that._menuclose();
        that.upperPos.fadeOut(10);
        that.lowerPos.fadeOut(10);
      };
      that.DialogObj.open();
    } catch (e) {
      console.warn('[copyright.js] -->setCopyInfo 出错.');
    }
  };
  /**
   * 根据剩余复制字数和次数弹出对应的提示信息. <br/>
   * 
   * @param {Number} times 剩余复制次数
   * @param {Number} len   剩余复制字数
   */
  Select.prototype._copyDisabled = function (times, len) {
    if (times == 0) {
      this.DialogObj.setMsg(Msg.copyRunOut);
      this.DialogObj.opts.okBtn.func = function () {
      };
      this.DialogObj.open();
      return;
    }
    if (len == 0) {
      this.DialogObj.setMsg(Msg.copyRunOut);
      this.DialogObj.opts.okBtn.func = function () {
      };
      this.DialogObj.open();
    } else {
      this.DialogObj.setMsg(Msg.copyStill + len + '个字!');
      this.DialogObj.opts.okBtn.func = function () {
      };
      this.DialogObj.open();
    }
  };
  /**
   * 长按执行事件. <br/>
   */
  Select.prototype._isLongTouch = function () {
    var that = this;
    var optsObj = that.opts;
    var index = 0;
    optsObj.posMenu = '';
    if (optsObj.touchState === 1 || optsObj.touchState === 3) {
      optsObj.touchState = 2;
      // 如果一页有两列
      if (optsObj.pageColumn == 2) {
        var pageOneWidth = optsObj.$readerObj.find('.read-selector-main .read-content.read-page-2').offset().left;
        if (pageOneWidth < optsObj.pos.startX) {
          optsObj.$contentObj = optsObj.$readerObj.find('.read-selector-main .read-content.read-page-2');
        } else {
          optsObj.$contentObj = optsObj.$readerObj.find('.read-selector-main .read-content.read-page-1');
        }
      }
      var allElem = optsObj.$contentObj.find('.read-filterSpan');
      if (allElem.length === 0) {
        optsObj.touchState = 0;
        return false;
      }
      index = that._positionElem(optsObj.pos.startX, optsObj.pos.startY);
      // 上标坐标
      optsObj.pos.startX = allElem.eq(index).offset().left + allElem.eq(index).width() / 2;
      optsObj.pos.startY = allElem.eq(index).offset().top + allElem.eq(index).height() / 2;
      // 下标坐标
      optsObj.pos.endX = allElem.eq(index).offset().left + allElem.eq(index).width() / 2;
      optsObj.pos.endY = allElem.eq(index).offset().top + allElem.eq(index).height() / 2;
      var start = index;
      var end = index;
      if (allElem.eq(index).hasClass('read-gli-underline')) {
        // 不能移动上标和下标
        optsObj.ismove = 0;
        var noteId = allElem.eq(index).attr('data-noteid');
        var noteObj = optsObj.$allContentObj.find('[data-noteid="' + noteId + '"]');
        var start = noteObj.first().attr('data-id');
        var end = noteObj.last().attr('data-id');
        noteObj.addClass('read-font-select');
        optsObj.posMenu = 'upper';
        that._posMenuShow(start);
        optsObj.posMenu = 'lower';
        that._posMenuShow(end);
        this.$menuObj.setValue('underline', '删除');
      } else {
        optsObj.ismove = 1;
        $(allElem[index]).addClass('read-font-select');
        that._posMenuShow(allElem.eq(index).attr('data-id'));
      }
    }
  };
  /**
   * 选择文本,并增加选中样式. <br/>
   * 
   * @param {Number} x1 开始X坐标
   * @param {Number} y1 开始Y坐标
   * @param {Number} x2 结尾X坐标
   * @param {Number} y2 结尾Y坐标
   */
  Select.prototype._selectElem = function (x1, y1, x2, y2) {
    var optsObj = this.opts;
    var start = 0;
    var end = 0;
    var index = 0;
    var allElem = optsObj.$contentObj.find('.read-filterSpan');
    start = this._positionElem(x1, y1);
    end = this._positionElem(x2, y2);
    optsObj.$contentObj.find('.read-font-select').each(function () {
      $(this).removeClass('read-font-select');
    });
    for (var i = start; i <= end; i++) {
      allElem.eq(i).addClass('read-font-select');
    }
    if (optsObj.posMenu === 'upper') {
      this._posMenuShow(allElem.eq(start).attr('data-id'));
    }
    if (optsObj.posMenu === 'lower') {
      this._posMenuShow(allElem.eq(end).attr('data-id'));
    }
  };
  /**
   * 根据touch/mouse的pageX和pageY进行定位. <br/>
   * 
   * @param {Number} x    pageX
   * @param {Number} y    pageY
   * 
   * @return {Number} index 定位的当前元素在所有元素中的下标
   */
  Select.prototype._positionElem = function (x, y) {
    var that = this;
    var optsObj = that.opts;
    var fontsize = optsObj.$contentObj.css('font-size');
    var linehight = optsObj.$contentObj.css('line-height');
    var lately = 9999;
    var index = 0;
    var left = 0;
    var top = 0;
    fontsize = parseFloat(fontsize.replace('px', ''));
    linehight = parseFloat(linehight.replace('px', ''));
    var allElem = optsObj.$contentObj.find('.read-filterSpan');
    for (var i = 0, len = allElem.length; i < len; i++) {
      left = $(allElem[i]).offset().left + $(allElem[i]).width();
      top = $(allElem[i]).offset().top + $(allElem[i]).height();
      // 先定位Y坐标
      if (top + (linehight - fontsize) / 2 > y) {
        if (left > x) {
          optsObj.isShowMenu = 1;
          index = i;
          break;
        }
        // 再定位X坐标
        if (lately > Math.abs(left + fontsize / 2 - x)) {
          lately = Math.abs(left + fontsize / 2 - x);
        } else {
          optsObj.isShowMenu = 1;
          index = i;
          if (i && $(allElem[i]).offset().top > $(allElem[i - 1]).offset().top) {
            index = i - 1;
          }
          break;
        }
      }
      // 如果是最后一个元素
      if (!index && i === len - 1 && i) {
        optsObj.isShowMenu = 1;
        index = i;
      }
    }
    return index;
  };
  /**
   * 显示选取元素时左右两端的上标和下标. <br/>
   * 
   * @param {String} index 选择元素data-id
   */
  Select.prototype._posMenuShow = function (index) {
    var optsObj = this.opts;
    var thisElem = optsObj.$allContentObj.find('.read-filterSpan[data-id="' + index + '"]');
    var elemTop = thisElem.offset().top;
    var elemLeft = thisElem.offset().left;
    var elemW = thisElem.width();
    var elemH = thisElem.height();
    var readerTop = optsObj.$readerObj.offset().top;
    var readerLeft = optsObj.$readerObj.offset().left;
    if (optsObj.posMenu !== 'lower') {
      this.upperPos.css('top', elemTop - this.posH + elemH - readerTop + 'px');
      this.upperPos.css('left', elemLeft - this.posW / 2 - readerLeft + 'px');
    }
    if (optsObj.posMenu !== 'upper') {
      this.lowerPos.css('top', elemTop - readerTop + 'px');
      this.lowerPos.css('left', elemLeft - this.posW / 2 + elemW - readerLeft + 'px');
    }
    this.upperPos.fadeIn(0);
    this.lowerPos.fadeIn(0);
  };
  /**
   * 菜单显示. <br/>
   */
  Select.prototype._menuShow = function () {
    var that = this;
    var optsObj = that.opts;
    if (!optsObj.isShowMenu) {
      return false;
    }
    var pageH = optsObj.$readerObj.height();
    var startY = 0;
    var endY = 0;
    var allElem = optsObj.$contentObj.find('.read-font-select');
    var readerTop = optsObj.$readerObj.offset().top;
    startY = allElem.eq(0).offset().top - readerTop;
    endY = allElem.eq(allElem.length - 1).offset().top - readerTop;
    if (startY > endY) {
      var tempY = startY;
      startY = endY;
      endY = tempY;
    }
    if (startY > 80 + optsObj.$contentObj.offset().top) {
      optsObj.$menuWrap.css('top', startY - 80 + 'px');
    } else if (endY < pageH - 120) {
      optsObj.$menuWrap.css('top', endY + 80 + 'px');
    } else {
      optsObj.$menuWrap.css('top', '50%');
    }
    var readerLeft = optsObj.$readerObj.offset().left;
    var menuLeft = optsObj.$contentObj.offset().left + optsObj.$contentObj.width() / 2;
    optsObj.$menuWrap.css('left', menuLeft - readerLeft + 'px');
    optsObj.$menuWrap.fadeIn(400);
  };
  /**
   * 关闭菜单并清空选中样式. <br/>
   */
  Select.prototype._menuclose = function () {
    var optsObj = this.opts;
    optsObj.$menuWrap.fadeOut(200);
    this.$menuObj.setValue('underline', '划线');
    optsObj.isShowMenu = 0;
    optsObj.touchState = 0;
    optsObj.$allContentObj.find('.read-font-select').each(function () {
      $(this).removeClass('read-font-select');
    });
  };
  /**
   * 选择上标下标菜单关闭. <br/>
   */
  Select.prototype.close = function () {
    var optsObj = this.opts;
    this._menuclose();
    this.upperPos.fadeOut(10);
    this.lowerPos.fadeOut(10);
  };
  /**
   * 获取选中内容距离本页第一个的文字长度. <br/>
   * 
   * @return {Number}  posLen
   * @return {Number}  currPage // 当前是页面第几列
   */
  Select.prototype._getPosLen = function () {
    var optsObj = this.opts;
    var posLen = 0;
    var $firstSelect = optsObj.$contentObj.find('.read-font-select').first();
    var dataId = $firstSelect.attr('data-id');
    var currPage = 2;
    if (optsObj.pageColumn == 2) {
      if ($firstSelect.offset().left < optsObj.$allContentObj.eq(1).offset().left) {
        currPage = 1;
      }
    }
    optsObj.$contentObj.find('.read-filterSpan').each(function () {
      posLen += $(this)[0].innerText.length;
      if ($(this).attr('data-id') === dataId) {
        return false;
      }
    });
    return {
      'posLen': posLen,
      'currPage': currPage
    };
  };
  /**
   * 自定义事件. <br/>
   * 
   * @param eventName {String}   事件名称,'Select:addUnderline', 'Select:addNote',
   *      'Select:delUnderline', 'Select:correct'
   * @param cb        {Function} 回调事件
   * 
   */
  Select.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  return Select;
}(js_src_global, js_src_tool, js_src_widget_plugRadioGroup, js_src_widget_plugDialog, js_libs_zeptodev, js_src_message_zh);
js_src_widget_plugTips = function (window, $) {
  var Tips = function (options) {
    var defaults = {
      parentObj: document.getElementsByTagName('body')[0],
      // DOM对象. 提示框影响范围， 默认为 body.
      msg: '消息提示框',
      // {String} 毫秒数
      time: 1800,
      // {Number} 毫秒数
      _htmlWrap: '<div class=\'read-tip-wrap\'></div>',
      _htmlMsg: '<span class=\'read-tip-msg\'></span>'
    };
    this.opts = $.extend(true, {}, defaults, options);
    this.tipWrapObj = null;
    this.tipMsgObj = null;
    this._init();
  };
  Tips.prototype._init = function () {
    var optsObj = this.opts;
    var parentWrapObj = $(optsObj.parentObj);
    this.tipWrapObj = $(optsObj._htmlWrap);
    this.tipMsgObj = $(optsObj._htmlMsg);
    this.tipWrapObj.append(this.tipMsgObj).appendTo(parentWrapObj);
    this.tipWrapObj.fadeOut(0);
  };
  /**
   * 打开 提示框. <br/> 
   * 
   * @param {String} msg 文字消息. e.g. "这是中号文字"
   * @param {Number} time 关闭提示框的时间间隔( 毫秒数 ). e.g. 500
   * 
   */
  Tips.prototype.open = function (msg, time) {
    var optsObj = this.opts;
    var w = 0;
    var h = 0;
    msg = msg || optsObj.msg;
    time = time || optsObj.time;
    if (this.tipMsgObj.css('display') === 'block') {
      return false;
    }
    this.tipWrapObj.fadeIn(0);
    w = this.tipMsgObj.width();
    this.tipMsgObj.html(msg);
    w += this.tipMsgObj.width();
    h = this.tipMsgObj.height();
    this.tipMsgObj.css({
      'width': w,
      'height': h,
      'display': 'block'
    });
    this.close(time);
  };
  /**
   * 关闭 提示框. <br/> 
   * 
   * @param {Number} time 关闭提示框的时间间隔( 毫秒数 ). e.g. 500
   * 
   */
  Tips.prototype.close = function (time) {
    var optsObj = this.opts;
    var that = this;
    var timeVal = time || optsObj.time;
    setTimeout(function () {
      that.tipWrapObj.fadeOut(400);
    }, timeVal);
    setTimeout(function () {
      that.tipMsgObj.html('').css('display', 'inline');
    }, timeVal + 400);
  };
  return Tips;
}(js_src_global, js_libs_zeptodev);
js_src_panelCorrect = function (window, move, $, tips, Msg) {
  var _ = window._;
  var CorrectPanel = function (options) {
    var defaults = {
      $readerObj: null,
      correctHtml: '',
      // 版权投诉 面板
      $domObj: null,
      isMobile: true,
      api: null
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  CorrectPanel.prototype._init = function () {
    console.log('[CorrectPanel] --> _init');
    this._renderLayout();
    this._bindEvent();
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  CorrectPanel.prototype._renderLayout = function () {
    var optsObj = this.opts;
    var correctTemplObj = _.template(optsObj.correctHtml);
    var correctHtml = correctTemplObj();
    // 纠错文字  dom
    optsObj.$domObj = $(correctHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
    this.tips = new tips({ parentObj: optsObj.$readerObj[0] });
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  CorrectPanel.prototype._bindEvent = function () {
    var that = this;
    var optsObj = that.opts;
    // 确定事件类型.
    var eventType = optsObj.isMobile ? 'tap' : 'click';
    // 关闭纠错面板 -- 取消
    optsObj.$domObj.find('.read-header .read-cancel').on(eventType, function () {
      var val = optsObj.$domObj.find('.read-body textarea').val().trim();
      optsObj.$domObj.find('.read-body textarea').blur();
      that.cancel(val);
    });
    // 发送纠错信息
    optsObj.$domObj.find('.read-header .read-send').on(eventType, function () {
      var val = optsObj.$domObj.find('.read-body textarea').val().trim();
      that.sendCorrect(val);
    });
  };
  /**
   * 打开纠错文字面板. <br/>
   * 
   * @param {Object} data
   */
  CorrectPanel.prototype.open = function (data) {
    var optsObj = this.opts;
    optsObj.thisNoteObj = data;
    optsObj.first = true;
    optsObj.$domObj.show();
    setTimeout(function () {
      var height = optsObj.$domObj.height();
      move(optsObj.$domObj[0]).set('top', '0px').duration('0.5s').end();
    }, 10);
    optsObj.$domObj.find('.read-body .read-original-text').html(data.original);
    if (typeof MathJax !== 'undefined') {
      MathJax.Hub.Queue([
        'Typeset',
        MathJax.Hub
      ]);
    }
  };
  /**
   * 取消纠错文字面板. <br/>
   * 
   */
  CorrectPanel.prototype.cancel = function (value) {
    var optsObj = this.opts;
    // 判断是否输入了内容
    if (value && optsObj.first) {
      setTimeout(function () {
        optsObj.first = false;
      }, 1000);
      this.tips.open(Msg.correctCancel, 1000);
      optsObj.$domObj.find('.read-body textarea').focus();
    } else {
      this.close();
    }
  };
  /**
   * 关闭纠错文字面板. <br/>
   * 
   */
  CorrectPanel.prototype.close = function () {
    var that = this;
    var optsObj = that.opts;
    // 清空数据
    optsObj.$domObj.find('.read-body textarea').val('');
    var height = optsObj.$domObj.height();
    move(optsObj.$domObj[0]).set('top', '-101%').duration('0.3s').end();
    setTimeout(function () {
      optsObj.$domObj.hide();
    }, 300);
  };
  /**
   * 发送纠错信息. <br/>
   * 
   * @param {String} val 纠错说明内容
   * 
   */
  CorrectPanel.prototype.sendCorrect = function (val) {
    var that = this;
    var optsObj = this.opts;
    // 纠错要发送的信息
    var correctData = {
      'chapter_id': optsObj.thisNoteObj.chapter_id,
      'chapter_name': optsObj.thisNoteObj.chapter_name,
      'percent': optsObj.thisNoteObj.note_page,
      'original': optsObj.thisNoteObj.original,
      'correctVal': val
    };
    if (val) {
      optsObj.api.sendCorrect(correctData, function () {
        that.tips.open(Msg.correctSucess, 1000);
        that.close();
      }, function (data) {
        console.warn(data);
        that.tips.open(Msg.sendError, 1000);
      });
    } else {
      this.tips.open(Msg.correctError, 1000);
    }  // TODO 保存
  };
  return CorrectPanel;
}(js_src_global, move, js_libs_zeptodev, js_src_widget_plugTips, js_src_message_zh);
js_src_widget_delicateType = function (global) {
  var target = null;
  /**
   * 对外暴露的构造函数
   * 
   * @param {Object} options
   * @param {Object} options.wrapDomObj  需要精排的DOM对象
   * @param {Object} options.isSplitWord 是否拆字
   */
  function DelicateType(options) {
    target = new typeSetting(options);
  }
  /**
   * 仅对外暴露excute方法
   * @param {Object} param       修正参数对象
   * @param {String} param.html  待处理的html标签
   */
  DelicateType.prototype.excute = function (param) {
    return target._excute(param);
  };
  /**
   * 构造函数.<br/>
   *
   * @param {Object} options
   * @param {Object} options.wrapDomObj  需要精排的DOM对象
   *
   */
  var typeSetting = function (options) {
    var _default = {
      // 容器DOM对象
      'wrapDomObj': null,
      // 是否跟外部动态关联--外部是否可以看到精排过程的变化，默认为: false;
      'isAssociate': false,
      // 是否拆字, 默认不拆字 : false
      'isSplitWord': false
    };
    this.opts = this._extend({}, _default, options);
    this._init();
  };
  typeSetting.prototype._init = function () {
    console.log('[typeSetting]-->_init!');
  };
  /**
   * 深度复制对象
   */
  typeSetting.prototype._cloneObj = function (oldObj) {
    if (typeof oldObj != 'object') {
      return oldObj;
    }
    if (oldObj == null) {
      return oldObj;
    }
    var newObj = new Object();
    for (var i in oldObj) {
      newObj[i] = _cloneObj(oldObj[i]);
    }
    return newObj;
  };
  /**
   * 合并、扩展对象
   */
  typeSetting.prototype._extend = function () {
    var args = arguments;
    if (args.length < 2) {
      return;
    }
    var temp = this._cloneObj(args[0]);
    for (var n = 1; n < args.length; n++) {
      for (var i in args[n]) {
        temp[i] = args[n][i];
      }
    }
    return temp;
  };
  /**
   * 拆分标签，将每个字用span标签包裹. </br>
   * 
   * @param {Object} elem 待拆分标签的dom
   */
  typeSetting.prototype._splitTag = function (elem) {
    var optsObj = this.opts;
    if (!optsObj.isSplitWord) {
      return;
    }
    var children = elem.childNodes || [];
    var wordReg = /(([\w_\.%]+)|([^\2]))/gi;
    var html = '';
    for (var i = 0, len = children.length; i < len; i++) {
      // 拆分文本节点
      if (children[i].nodeName === '#text') {
        html = children[i].nodeValue.replace(wordReg, function (txt) {
          return '<span class="read-filterSpan">' + txt + '</span>';
        });
        var span = document.createElement('span');
        children[i].parentNode.replaceChild(span, children[i]);
        span.outerHTML = html;
      } else {
        // 有子节点继续拆分
        if (children[i].nodeName !== 'svg' && children[i].nodeName !== 'IMG' && children[i].className.indexOf('read-filterSpan') === -1 && children[i].className.indexOf('read-not-publish') === -1 && children[i].nodeName !== 'TABLE') {
          this._splitTag(children[i]);
        }
      }
    }
  };
  /**
   * 执行"精排".<br/>
   *
   * @param {Object} param       修正参数对象
   * @param {String} param.html  待处理的html标签
   *
   * @return {String} finishedHtml 精排完毕的html字符串.
   *
   */
  typeSetting.prototype._excute = function (param) {
    console.log('[typeSetting]-->_excute!' + param);
    var optsObj = this.opts;
    var that = this;
    // 把传入的html放入精排dom内;
    optsObj.wrapDomObj.innerHTML = param.html;
    // 拆分每一个文字
    that._splitTag(optsObj.wrapDomObj);
    // 精排逻辑
    var reg1 = /。/;
    var reg2 = /：|“|”|？|-|！|。|，|‘|’|、|（|）|~|,|\.|\?|'|'|"|"|!|；|;|@|#|%/;
    var txtNode = optsObj.wrapDomObj.querySelectorAll('span.read-filterSpan');
    //容器距离左边距离
    var l1 = optsObj.wrapDomObj.getBoundingClientRect().left;
    //容器宽度
    var w1 = optsObj.wrapDomObj.offsetWidth;
    // 存最后一个不为空的span的下标
    var lastIndex = txtNode.length - 1;
    // 获取当前页最后一个span.filterSpan
    var lastSpan = txtNode[lastIndex];
    // 本页字数大于2执行
    if (lastIndex > 0) {
      // 避免找到最后一个为空的span
      for (var i = 0; i < txtNode.length; i++) {
        if (!lastSpan.innerText) {
          lastIndex = lastIndex - (i + 1);
          lastSpan = txtNode[lastIndex];
        } else {
          break;
        }
      }
      // 最后一个字符宽度
      var w2 = lastSpan.offsetWidth;
      // 最后一个字符距离左边距离
      var l2 = lastSpan.getBoundingClientRect().left;
      // 最后一个字符距离右边的距离
      var delta1 = w1 + l1 - (l2 + w2);
      // 最后一个字没有靠最右.
      if (delta1 > 0 && delta1 < 0.3 * w1) {
        // 最后一个字符不是句号（。）
        if (!reg1.test(lastSpan.innerText)) {
          lastSpan.setAttribute('data-publish1', 'publish-span1');
          // 获取当前行字的个数
          for (var k = 0; k < lastIndex + 1; k++) {
            // 通过比较两个字距离顶部的值来判断,这两个字是否在同一行
            if (lastIndex <= k || txtNode[lastIndex - k].offsetTop != txtNode[lastIndex - k - 1].offsetTop) {
              break;
            }
          }
          // 每个字移动距离的减量
          var reduce1 = delta1 / k;
          // 移动这一行的每一个字,达到两端对齐
          for (var n = 0; n < k; n++) {
            //1、 通过相对定位控制右对齐
            txtNode[lastIndex - n].style.position = 'relative';
            txtNode[lastIndex - n].style.left = delta1 - reduce1 * n + 'px';  //2、 通过字间距控制右对齐
                                                                              //                      txtNode[lastIndex - n].style.letterSpacing     = reduce1 +"px";
                                                                              //3、 通过改变宽度控制右对齐
                                                                              //                      var thisNode = txtNode[lastIndex - n];
                                                                              //                      var thisWidth = thisNode.getBoundingClientRect().width;
                                                                              //                      thisNode.style.display = "inline-block";
                                                                              //                      thisNode.style.textAlign = "right";
                                                                              //                      thisNode.style.width = thisWidth + reduce1 + "px";
          }
        }
      }
    }
    // 判断每一行最后一个字是否是符号。如果是符号且靠最右时，调整位置，达到右边对齐效果
    // 符号移动自身的一半
    for (var j = 0; j < txtNode.length; j++) {
      if (txtNode[j + 1] === undefined || txtNode[j].offsetTop != txtNode[j + 1].offsetTop) {
        var thisSpan = txtNode[j];
        // 最后一个字符宽度
        var w3 = thisSpan.offsetWidth;
        // 最后一个字符距离左边距离
        var l3 = thisSpan.getBoundingClientRect().left;
        var delta2 = w1 + l1 - (l3 + w3);
        // delta2 < 2   offset取值有多位小数,导致算值不能太精确,允许两个像素的盘偏差
        if (reg2.test(thisSpan.innerText) && delta2 >= 0 && delta2 < 2) {
          // 获取当前行字的个数
          for (var l = 0; l < j + 1; l++) {
            // 通过比较两个字距离顶部的值来判断,这两个字是否在同一行
            if (j <= l || txtNode[j - l].offsetTop != txtNode[j - l - 1].offsetTop) {
              break;
            }
          }
          var delta3 = w3 / 2;
          // 每个字移动距离的减量
          var reduce2 = delta3 / l;
          // 移动这一行的每一个字,达到两端对齐
          for (var z = 0; z < l; z++) {
            txtNode[j - z].style.position = 'relative';
            txtNode[j - z].style.left = delta3 - reduce2 * z + 'px';
          }
        }
      }
    }
    var finishedHtml = optsObj.wrapDomObj.innerHTML;
    return finishedHtml;
  };
  // 暴露为全局变量.
  //  window.DelicateType = DelicateType;
  return DelicateType;
}(js_src_global);
js_src_widget_plugVideoMobile = function (window, $, tool) {
  var _ = window._;
  var Video = function (options) {
    var defaults = { $domObj: null };
    this.opts = $.extend(true, {}, defaults, options);
    this.slideState = 0;
    // 滑动状态；0，未滑动；1，左右滑动;2，上下滑动；
    this.controlsTimer = null;
    this.showControlsFlag = true;
    this.touchPos = {
      'posx': '',
      'posy': ''
    };
    this._init();
  };
  /**
   * 初始化.
   */
  Video.prototype._init = function () {
    var optsObj = this.opts;
    var videoTempl = _.template(optsObj.videoTemplHtml);
    var videoTemplObj = videoTempl();
    optsObj.$domObj = $(videoTemplObj);
    optsObj.$readerObj.append(optsObj.$domObj);
    // 播放视频的容器
    optsObj.playVideo = optsObj.$domObj.find('.read-bigSizeVideo');
    // 引导提示
    optsObj.guidePage = optsObj.playVideo.find('.read-guide-page');
    // 控制栏
    optsObj.contorlBar = optsObj.playVideo.find('.read-contorls-container');
    // 视频顶部退出 及 名字显示
    optsObj.headContorl = optsObj.playVideo.find('.read-header');
    // 暂停遮罩
    optsObj.pauseMask = optsObj.playVideo.find('.read-pause-mask');
    // 视频中间的进度
    optsObj.progressMask = optsObj.playVideo.find('.read-progress-mask');
    // 正在加载
    optsObj.waitingMask = optsObj.playVideo.find('.read-waiting-mask');
    // 声音控件
    optsObj.volumeBar = optsObj.playVideo.find('.read-volume-bar');
    // 声音条
    optsObj.loadedVolumeBar = optsObj.volumeBar.find('.read-loadedvolume-bar');
    this._bindEvent();
  };
  /**
   * 绑定事件.
   */
  Video.prototype._bindEvent = function () {
    var optsObj = this.opts;
    var that = this;
    // 点击引导页面
    optsObj.guidePage.on('tap', function () {
      that.setVideoPlayOrPause();
      $(this).hide();
    });
    // video标签
    var temVideo = optsObj.playVideo.find('.read-current-video');
    // 亮度
    var mobileLightBar = optsObj.playVideo.find('.read-light-bar');
    var loadedLightBar = mobileLightBar.find('.read-loadedlight-bar');
    // 播放暂停按钮
    var playBtn = optsObj.contorlBar.find('.read-video-play-btn');
    temVideo.on('touchstart', function (event) {
      var touchObj = that.getEvent(event);
      var curPosX = touchObj.pageX;
      var curPosY = touchObj.pageY;
      that.touchPos.posx = curPosX;
      that.touchPos.posy = curPosY;
    });
    temVideo.on('touchmove', function (event) {
      var touchObj = that.getEvent(event);
      var curPosX = touchObj.pageX;
      var curPosY = touchObj.pageY;
      var curVideoW = optsObj.playVideo.find('.read-current-video').width();
      var curVideoH = optsObj.playVideo.find('.read-current-video').height();
      var curVolume;
      var curTime;
      var curVideoTotalTime = this.duration;
      var totalVolumeH;
      var curVolH;
      // 横向左右滑动调整进度
      if (that.slideState != 2) {
        if (Math.abs(curPosY - that.touchPos.posy) < 10) {
          if (curPosX - that.touchPos.posx > 10) {
            // 右滑动
            that.slideState = 1;
            curTime = this.currentTime;
            if (curTime < curVideoTotalTime) {
              this.currentTime = (curTime + 0.5).toFixed(1);
            }
            that.touchPos.posx = curPosX;
          } else if (curPosX - that.touchPos.posx < -10) {
            // 左滑动
            that.slideState = 1;
            curTime = this.currentTime;
            if (curTime > 0.5) {
              this.currentTime = (curTime - 0.5).toFixed(1);
            }
            that.touchPos.posx = curPosX;
          }
        }
      }
      // 左侧区域上下滑动（调节亮度）
      if (curPosX < curVideoW / 2) {
        if (that.slideState != 1) {
          if (curPosY - that.touchPos.posy > 5) {
            if (Math.abs(curPosX - that.touchPos.posx) < 10) {
              // 下滑
              that.slideState = 2;
              that.touchPos.posy = curPosY;
              mobileLightBar.show();
              var totalLightH = mobileLightBar.find('.read-totallight-bar').height();
              // 调节亮度---
              gli_get_brightness(function (val) {
                if (val > 0.1) {
                  gli_set_brightness(val - 0.1);
                  loadedLightBar.height(val * totalLightH);
                }
              });
            }
          } else if (curPosY - that.touchPos.posy < -5) {
            if (Math.abs(curPosX - that.touchPos.posx) < 10) {
              // 上滑
              that.slideState = 2;
              that.touchPos.posy = curPosY;
              mobileLightBar.show();
              var totalLightH = mobileLightBar.find('.read-totallight-bar').height();
              gli_get_brightness(function (val) {
                if (val < 1) {
                  gli_set_brightness(val + 0.1);
                  loadedLightBar.height(val * totalLightH);
                }
              });
            }
          }
        }
      }  // 右侧区域上下滑动（调节音量）
      else {
        if (that.slideState != 1) {
          if (curPosY - that.touchPos.posy > 5) {
            if (Math.abs(curPosX - that.touchPos.posx) < 10) {
              // 下滑
              that.slideState = 2;
              curVolume = this.volume;
              if (this.volume > 0) {
                this.volume = (curVolume - 0.1).toFixed(1);
              }
              that.touchPos.posy = curPosY;
              optsObj.volumeBar.show();
              totalVolumeH = optsObj.volumeBar.find('.read-totalvolume-bar').height();
              curVolH = this.volume * totalVolumeH;
              optsObj.loadedVolumeBar.height(curVolH);
            }
          } else if (curPosY - that.touchPos.posy < -5) {
            if (Math.abs(curPosX - that.touchPos.posx) < 10) {
              // 上滑
              that.slideState = 2;
              curVolume = this.volume;
              if (this.volume < 1) {
                this.volume = (curVolume + 0.1).toFixed(1);
              }
              that.touchPos.posy = curPosY;
              optsObj.volumeBar.show();
              totalVolumeH = optsObj.volumeBar.find('.read-totalvolume-bar').height();
              curVolH = this.volume * totalVolumeH;
              optsObj.loadedVolumeBar.height(curVolH);
            }
          }
        }
      }
      return false;
    });
    temVideo.on('touchend', function () {
      setTimeout(function () {
        // 隐藏音量条
        optsObj.volumeBar.hide();
        // 隐藏亮度条
        mobileLightBar.hide();
      }, 300);
      if (that.slideState == 1) {
        optsObj.progressMask.hide();
      }
      that.slideState = 0;
    });
    // 点击当前视频
    temVideo.on('tap', function () {
      // 隐藏控制条
      optsObj.contorlBar.toggle();
      optsObj.headContorl.toggle();
      clearTimeout(that.controlsTimer);
      that.showControlsFlag = true;
      return false;
    });
    // 播放按钮播放/暂停
    playBtn.on('touchend', function () {
      that.setVideoPlayOrPause();
      return false;
    });
    // 绑定播放事件
    temVideo.on('play', function () {
      console.log('播放视频');
      playBtn.addClass('read-pause');
      optsObj.progressMask.hide();
      optsObj.pauseMask.hide();
      if (that.showControlsFlag == false) {
        that.showControlsFlag = true;
      }
      event.stopPropagation();
    });
    // 绑定暂停事件
    temVideo.on('pause', function () {
      console.log('暂停视频');
      playBtn.removeClass('read-pause');
      optsObj.pauseMask.show();
    });
    // 暂停时点击暂停遮罩
    optsObj.pauseMask.on('tap', function () {
      that.setVideoPlayOrPause();
      $(this).hide();
      return false;
    });
    // 缓冲
    temVideo.on('waiting', function () {
      optsObj.progressMask.hide();
      optsObj.waitingMask.show();
    });
    // 当浏览器能够开始播放指定的音频/视频时，会发生 canplay 事件
    temVideo.on('canplay', function () {
      optsObj.waitingMask.hide();
      optsObj.progressMask.hide();
    });
    // 点击退出全屏图标
    optsObj.contorlBar.find('.read-full-screen').on('tap', function () {
      that.close();
      return false;
    });
    // 点击返回图标
    optsObj.headContorl.find('.read-header-back-icon').on('tap', function () {
      that.close();
      return false;
    });
    // 监听currentTime改变
    temVideo.on('timeupdate', function () {
      var curTime = this.currentTime;
      var totalTime = this.duration;
      // 格式化后的当前时间
      var formatCurTime = tool.formatTime(curTime);
      // 格式化后的总时间
      var formatTotalTime = tool.formatTime(totalTime);
      var controlsWidth = optsObj.contorlBar.find('.read-progress-bar').width();
      var curWidth = curTime / totalTime * controlsWidth;
      optsObj.playVideo.find('.read-loadedprogress-bar').width(curWidth);
      optsObj.contorlBar.find('.read-video-currenttime').html(formatCurTime);
      if (!isNaN(totalTime)) {
        optsObj.contorlBar.find('.read-video-totaltime').html(formatTotalTime);
      }
      // 隐藏控制条的定时器
      if (that.showControlsFlag) {
        that.controlsTimer = setTimeout(function () {
          optsObj.contorlBar.hide();
          optsObj.headContorl.hide();
        }, 10000);
        that.showControlsFlag = false;
      }
    });
    // 监听进度发生改变
    temVideo.on('seeking', function () {
      var curTime = this.currentTime;
      var totalTime = this.duration;
      // 格式化后的当前时间
      var formatCurTime = tool.formatTime(curTime);
      // 格式化后的总时间
      var formatTotalTime = tool.formatTime(totalTime);
      optsObj.pauseMask.hide();
      optsObj.waitingMask.hide();
      optsObj.progressMask.show();
      optsObj.progressMask.find('.read-current-time').html(formatCurTime);
      optsObj.progressMask.find('.read-total-time').html(formatTotalTime);
    });
  };
  /**
   * 设置视频播放或暂停
   * 
   */
  Video.prototype.setVideoPlayOrPause = function () {
    var optsObj = this.opts;
    var curVideo = optsObj.playVideo.find('.read-current-video')[0];
    if (curVideo.paused) {
      curVideo.play();
    } else {
      curVideo.pause();
    }
  }, /**
   * 打开视频插件，预览本章所有视频.
   * 
   * param {Object} videos {
   *                  name: 视频名字,
   *                  src: 源地址, http://static.spbook2.gli.cn//videos/movie.mp4
   *              } 
   */
  Video.prototype.open = function (videos) {
    var optsObj = this.opts;
    var that = this;
    optsObj.videoName = videos.name;
    optsObj.videoSrc = videos.src;
    optsObj.$domObj.removeClass('read-hide').addClass('read-vertical-video');
    optsObj.playVideo.fadeIn();
    optsObj.playVideo.find('.read-current-video').attr('src', optsObj.videoSrc);
    if (localStorage.getItem('first-open-video') != 'false') {
      optsObj.guidePage.show();
    }
    localStorage.setItem('first-open-video', 'false');
    optsObj.contorlBar.find('.read-video-currenttime').html('00:00:00');
    optsObj.contorlBar.find('.read-video-totaltime').html('00:00:00');
    optsObj.headContorl.find('.read-header-video-title').html(optsObj.videoName);
    optsObj.contorlBar.show();
    optsObj.headContorl.show();
    optsObj.pauseMask.show();
    clearTimeout(that.controlsTimer);
  };
  /**
   * 关闭预览视频插件.
   */
  Video.prototype.close = function () {
    var optsObj = this.opts;
    optsObj.guidePage.hide();
    optsObj.pauseMask.hide();
    optsObj.waitingMask.hide();
    optsObj.progressMask.hide();
    this.setVideoPlayOrPause();
    optsObj.playVideo.hide();
    optsObj.$domObj.addClass('read-hide');
  };
  /**
   * 获取event坐标参数
   * 
   * @param {Object} event
   * @return {Object} event
   */
  Video.prototype.getEvent = function (event) {
    if (!event) {
      return false;
    }
    if (event.touches !== undefined && typeof event.touches === 'object' && event.touches.length > 0) {
      event = event.touches[0];
    } else if (event.changedTouches !== undefined && typeof event.changedTouches === 'object' && event.changedTouches.length > 0) {
      event = event.changedTouches[0];
    } else {
      event = undefined;
    }
    return event;
  };
  return Video;
}(js_src_global, js_libs_zeptodev, js_src_tool);
js_src_readerMobile = function (window, $, tool, Api, templSet, mainPanel, settingPanel, cbnPanel, complaintPanel, searchPanel, countPage, Loader, promptPanel, copyright, viewImgPanel, Config, dialog, Msg, selectPanel, correctPanel, delicateType, Video) {
  var LOG = tool.LOG;
  var Mobile = function (options) {
    LOG.log('[reader.js] --> 构造函数! ');
    var defaults = {
      // a: 必须传入参数.
      domWrapId: '',
      // 阅读器 页面标签的 [属性id]. 如: "#110";
      hostUrl: '',
      // 书籍信息来源地址.
      book_id: '',
      // {String} 图书id.
      passData: null,
      // eg: {shop_id:2} 存放shop_id 等.
      // b: 可选传入参数(存有默认值).
      user_id: '',
      // {String} 用户id 可选.
      downloadPath: 'download/books',
      // 书籍数据读写模式. true: 加密模式; false: (默认)普通/明文 模式;
      isEncrypt: false,
      // true: 本阅读器只需要 下载功能(不需要初始化布局); false: (默认)阅读 +下载.
      // 如果 DOM元素的 宽高小于 "最小值", 则强制复制为 "true",并给出 警告日志信息.
      isOnlyDownload: false,
      // 一次性下载整本书。( true为一次性下载所有能读章节,false:看到哪章下哪章(默认值) )
      // isDownloadAllChapter: false,
      // 是否为 客户端(APP, C++), true: (默认)客户端, 需要缓存文件.读取本地文件; false: PC浏览器;
      isClient: true,
      // 是否为 手机, 用于: 绑定事件, 渲染布局;
      isMobile: true,
      // 是否允许保存图片到本地指定位置    默认允许true
      isDownloadImg: true,
      // 默认的翻页方式
      pagingType: 'page_1',
      // 夜间模式
      isNightMode: false,
      // true: 不分页,直接读取 epub源文件; false: 需要分页计算.
      useEpubFile: false,
      // true: 开启版权保护; false: 关闭版权保护
      usePublish: true,
      // 开关- 使用[书签]
      useBookmark: true,
      // 开关- 使用[笔记]
      useNote: true,
      // 开关- 使用[文字纠错]
      useCorrect: true,
      // 开关- 使用[版权投诉]
      useComplaint: true,
      // 开关- 使用[搜索]
      useSearch: true,
      // 开关- 使用[退出]
      useExit: true,
      // 开关- 使用[字体]
      useFonts: true,
      // 开关- 使用[背景颜色]
      useBgColor: true,
      // 开关- 使用[亮度控制]
      useLight: true,
      // 开关- 使用[翻页方式]
      usePageWay: true,
      // 开关- 使用[epub样式]
      useEpubStyle: true,
      // 开关- 使用[视频]
      useVideo: true,
      // 开关- 试读(由reader控制试读 - 中原农民特殊要求)
      useProbation: false,
      // 记录书籍打开时间
      bookOpenTime: '',
      // 分享笔记--参数配置.默认false
      note_share_conf: { 'flag': false },
      historyData: { page_offset: 105 },
      license_id: 'doc_110220330',
      // 加密 - 文件许可证号;
      server: 'server_101010101010',
      // 加密 - lockit服务器域名;
      // 自定义导航类菜单, 注意: 目前仅支持 2 个自定义菜单.
      custom_nav_menus: [],
      /** 
       * 算页过程中(分步返回),执行用户回调。
       * {function} 默认为 空函数.
       * 
       * 如: function(){
       *        // var pages = reader.getPagesAll();
       *        // data数据结构 与 reader.chapts 相同;
       *        // 在此完成业务逻辑。
       *     }
       */
      getDataCb: tool.emptyFunc,
      /** 
       * reader取得目录信息后,执行用户回调。
       *  {function} 默认为 空函数
       * 
       * 如: function(){
       *        // var pages = reader.getCatalogInfo();
       *        // 在此完成业务逻辑。
       *     }
       */
      getCatalogCb: tool.emptyFunc,
      /**
       * 书籍处于 试读状态，当翻到最后一页后 点击 获取下一章数据时触发回调; 
       * {function} 默认为 空函数
       * 
       * 约定: 回调方法逻辑--跳转页面.
       * 
       */
      probotionCb: tool.emptyFunc,
      /**
       * 退出 阅读器 回调函数.<br/>
       * {function} 默认为 空函数
       * 
       */
      exitReaderCb: tool.emptyFunc,
      /**
       * 使用reader下载图书，回调函数 -- 新华传媒. <br/>
       * 
       * 每下载一章就触发一次，更新下载进度.
       */
      downloadCb: tool.emptyFunc,
      /**
       * 点击 不可阅读目录时, 触发此函数. <br/>
       * ps: 试读.
       * 
       */
      getDisableChaptCb: tool.emptyFunc,
      // c: 不可传入参数
      // 是否渲染布局. true:使用布局, false: 不使用布局. 
      _useLayout: true,
      // 阅读器 外部容器;
      $readerWrap: null,
      // 阅读器 根节点对象;
      $readerObj: null,
      // 容器最小宽度 px.
      _minW: 300,
      // 容器最小高度 px.
      _minH: 500,
      // 下载状态 和 进度
      _downloadState: {
        'state': true,
        'rate': 0
      },
      // 正本数据 文字总数.
      totalLen: 0,
      chapt_index: 0,
      // {Number} 当前阅读章节下标, 第一章下标为0
      page_index: 0,
      // {Number} 图书每章节页码下标，第一页下标为1
      // 分页用章节信息, 结构参考 方法: [countPage.js] getPagingData;
      chapts: null
    };
    this.opts = $.extend(true, {}, defaults, options);
    // 下载用
    this.opts.data = {
      // {Object} 目录;
      'catalog': null,
      // {Array} 可读章节信息 {"chapter_name":"", "chapter_id":"", isDownload: ""}
      'readableChapter': null,
      // {Object} 阅读进度. {"progressData":{"updateTime":1472022745833,"progress":"0.7804"}}
      'progressData': null,
      // {Object} 设置面板参数
      'settingData': null,
      // {Object} 版权保护参数
      'copyright': null
    };
    this.LoadingObj = new Loader({
      'domSelector': this.opts.domWrapId,
      'msg': Msg.loading
    });
    this.DialogObj = new dialog({ $wrapDomObj: $(this.opts.domWrapId) });
    this._init();
  };
  /**
   * 根据  传入参数, 判定阅读器用法, 并执行相应 初始化. <br/>
   * 
   */
  Mobile.prototype._init = function () {
    var optsObj = this.opts;
    this._check();
    // 书籍打开时间
    optsObj.bookOpenTime = new Date().getTime();
    // 实例化 网络请求API接口对象.
    this.ApiObj = new Api({
      baseData: {
        hostUrl: optsObj.hostUrl,
        book_id: optsObj.book_id,
        user_id: optsObj.user_id,
        use_file_url: optsObj.useEpubFile
      },
      passData: optsObj.passData
    });
    if (optsObj.isClient) {
      //目录
      this.getCatalog = this._getCatalogOffline;
      //书签
      this.getBookmark = this._getBookmarkOffline;
      //笔记
      this.getNote = this._getNoteOffline;
      // 章节内容
      this.getChapterContent = this._getChapterOffline;
    } else {
      //目录
      this.getCatalog = this._getCatalogOnline;
      //书签
      this.getBookmark = this._getBookmarkOnline;
      //笔记
      this.getNote = this._getNoteOnline;
      // 章节内容
      this.getChapterContent = this._getChapterOnline;
    }
    this._refresh();
    this._renderLayout();
  };
  /**
   * 检测传入参数. <br/>
   * 
   */
  Mobile.prototype._check = function () {
    var optsObj = this.opts;
    optsObj.$readerWrap = $(optsObj.domWrapId);
    // 检测 阅读器的 DOM标签.
    if (optsObj.isOnlyDownload || optsObj.domWrapId == '' || optsObj.length == 0 || optsObj.$readerWrap.width() < optsObj._minW || optsObj.$readerWrap.height() < optsObj._minH) {
      //  无效, 不渲染布局
      optsObj._useLayout = false;
    } else {
      //  有效.
      optsObj._useLayout = true;
      optsObj.$readerObj = $('<div class=\'read-reader-mobile\' />');
      optsObj.$readerWrap.append(optsObj.$readerObj);
      this._setFontSize();
      this.LoadingObj.open();
    }
  };
  /**
   * 重设参数后 刷新阅读器.<br/>
   * ps: 加密模式, 背景颜色, 图书id,,,等.
   * 
   * @author gli-gonglong-20160727.
   * 
   */
  Mobile.prototype._refresh = function () {
    var optsObj = this.opts;
    if (optsObj.isEncrypt) {
      // 加密模式. 这种方式 绑定成了 "对象.静态函数"
      this.saveFile = tool._saveFileEncrypt;
      this.readFile = this._readFileDec;
    } else {
      // 普通模式,
      this.saveFile = tool._saveFileCommon;
      this.readFile = tool._readFileCommon;
    }
    // 如果不是客服端就不保存数据
    if (!optsObj.isClient) {
      this.saveFile = tool.emptyFunc;
      // 如果不是客服端且没有登陆，则关掉笔记和书签功能
      if (optsObj.user_id == '') {
        optsObj.useNote = false;
        optsObj.useBookmark = false;
      }
    }
  };
  /**
   * 读取加密文件. <br/>
   * 
   * @param path    {String} 本地文件存储路径, 包含文件名. 如 "/download/10001/120/0_catalog.txt"
   * @param cb      {Function} 回调函数, 成功: 返回文件内容, 失败: 返回 null;
   */
  Mobile.prototype._readFileDec = function (path, cb) {
    var optsObj = this.opts;
    var reader_opts = {
      license_id: optsObj.license_id,
      // 加密 - 文件许可证号;
      server: optsObj.server
    };
    var config_opts = {
      license_id: Config.license_id,
      // 加密 - 文件许可证号;
      server: Config.server
    };
    var opts = $.extend(true, {}, config_opts, reader_opts);
    tool._readFileDecrypt(opts, path, cb);
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  Mobile.prototype._renderLayout = function () {
    var optsObj = this.opts;
    // 阅读主页面
    this.mainpage = null;
    // 目录(Catalog), 书签(Bookmark), 笔记(note) 显示面板. 
    this.cbnpage = null;
    // 设置操作 面板
    this.settingpage = null;
    // 分页计算器.
    this.countPageObj = null;
    // 版权投诉面板.
    this.complainpage = null;
    // 搜索面板.
    this.searchpage = null;
    // 操作提示面板
    this.promptPage = null;
    // 图片浏览面板
    this.viewImgPage = null;
    this._renderCatalog();
    if (optsObj._useLayout) {
      this._renderBookmark();
      this._renderNote();
      // 操作提示
      this._renderPromptPage();
      this._renderSetting();
      this._renderMainpage();
      this._renderCopyright();
      // 投诉
      this._renderComplaint();
      // 纠错文字
      this._renderCorrect();
      this._renderSearch();
      this._renderCountpage();
      // 查看图片
      this._renderViewImgPage();
      // 视频
      this._renderVideoPage();
      // 选择文本
      this._renderSelect();
    }
  };
  /**
   * 渲染 阅读主页面, 并监听其相关事件. <br/>
   * 
   */
  Mobile.prototype._renderMainpage = function () {
    var optsObj = this.opts;
    var that = this;
    // 阅读主面板.
    var mainTempl = templSet.getTempl('main');
    this.mainpage = new mainPanel({
      $readerObj: optsObj.$readerObj,
      templHtml: mainTempl,
      // HTML 模板
      isMobile: optsObj.isMobile
    });
    // 阅读主面板.
    this.mainpage.on('mainpanel:left', function () {
      that.prev();
      // 清空选择文本内容样式及图标
      that.selectObj.close();
    });
    this.mainpage.on('mainpanel:middle', function () {
      that.settingpage.open();
      that.selectObj.close();
    });
    this.mainpage.on('mainpanel:right', function () {
      that.next();
      that.selectObj.close();
    });
    // 判断是否显示书签标记
    this.mainpage.on('mainpanel:showBookmark', function (event, data) {
      that.cbnpage.showBookmark(data);
    });
    this.mainpage.on('mainpanel:img', function (e, param) {
      that.viewImgPage.setOptions({
        'imgSet': optsObj.chapts[optsObj.chapt_index].images,
        'currentIdx': parseInt(param.currentIdx)
      });
      that.viewImgPage.open();
    });
    // 点击了视频
    this.mainpage.on('mainpanel:video', function (e, param) {
      if (optsObj.useVideo) {
        that.videoPage.open(param);
      }
    });
    this.mainpage.on('mainpanel:showNote', function () {
      var chapter_id = optsObj.chapts[optsObj.chapt_index].chapter_id;
      var chapter_name = optsObj.chapts[optsObj.chapt_index].chapter_name;
      //              that.cbnpage.noteObj.showNote(chapter_id);
      if (tool.hasFunction(that.cbnpage.noteObj, 'showNote')) {
        that.cbnpage.noteObj.showNote(chapter_id, chapter_name);
      }
    });
    // add by gli-hxy-20160816 start
    this.mainpage.on('mainpanel:swipeDown', function (event, bookmarkid) {
      console.log('[reader.js] --> 下滑添加书签!! ');
      var thisChapterObj = optsObj.chapts[optsObj.chapt_index];
      var bookmarkData = {
        'bookmarkid': bookmarkid,
        'pageSite': that.countPageObj.getFootPerc(),
        'text': thisChapterObj.pages[optsObj.page_index - 1].txt,
        'chapterId': thisChapterObj.chapter_id,
        'chapterName': thisChapterObj.chapter_name
      };
      that.cbnpage.updateBookmarks(bookmarkData);
    });
    // add by gli-hxy-20160816 end
    // add by gli-jiangxq-20160905 start
    if (typeof gli_keydown_event != 'undefined' && typeof gli_keydown_event == 'function') {
      // 音量键up, 向前翻页;
      gli_keydown_event(1, function () {
        that.prev();
      }, true);
      // 音量键down, 向后翻页;
      gli_keydown_event(2, function () {
        that.next();
      }, true);
      // 退出键
      gli_keydown_event(0, function () {
        that.exit();
      }, true);
    }
    // add by gli-jiangxq-20160905 end
    // 禁用微信浏览器下拉
    var overscroll = function (elem) {
      elem.addEventListener('touchstart', function () {
        var top = elem.scrollTop;
        var totalScroll = elem.scrollHeight;
        var currentScroll = top + elem.offsetHeight;
        if (top === 0) {
          elem.scrollTop = 1;
        } else if (currentScroll === totalScroll) {
          elem.scrollTop = top - 1;
        }
      });
      elem.addEventListener('touchmove', function (evt) {
        if (elem.offsetHeight < elem.scrollHeight) {
          evt._isScroller = true;
        } else {
          evt._isScroller = false;
        }
      });
    };
    overscroll(optsObj.$readerObj.find('.read-selector-main')[0]);
    document.body.addEventListener('touchmove', function (evt) {
      if (evt._isScroller === false) {
        evt.preventDefault();
      }
    });
  };
  /**
   * 渲染版权保护面板, 并监听其相关事件. <br/>
   * 
   * @author gli-jiangxq-20160822
   */
  Mobile.prototype._renderCopyright = function () {
    var optsObj = this.opts;
    var that = this;
    this.copyrightObj = new copyright({
      $readerObj: optsObj.$readerObj,
      isMobile: optsObj.isMobile,
      coprData: Config.copyright,
      api: that.ApiObj
    });
    // 保存版权保护参数
    this.copyrightObj.on('Copyright:saveCoprParam', function (event, data) {
      that.opts.data.copyright = data;
      that._saveCopyright();
    });
    // 获取离线状态下版权保护参数
    this.copyrightObj.on('Copyright:getCoprParam', function () {
      that._getCoprDataOffline(function (data) {
        that.opts.data.copyright = data.coprData;
        that.copyrightObj.opts.copyright = data.coprData;
        that.copyrightObj.run();
      }, function () {
        that.copyrightObj.run();
      });
    });
    // 退出阅读器
    this.copyrightObj.on('Copyright:exitReaderCb', function () {
      that.exit();
    });
  };
  /**
   * 选择文本面板, 并监听其相关事件. <br/>
   * 
   * @author gli-jiangxq-20160919
   */
  Mobile.prototype._renderSelect = function () {
    var optsObj = this.opts;
    var that = this;
    this.selectObj = new selectPanel({
      $readerObj: optsObj.$readerObj,
      isMobile: optsObj.isMobile,
      coprObj: that.copyrightObj,
      useNote: optsObj.useNote,
      useCorrect: optsObj.useCorrect
    });
    // 增加划线
    this.selectObj.on('Select:addUnderline', function (event, data) {
      var newData = innerSetData(data);
      that.cbnpage.noteObj.addUnderline(newData);
    });
    // 删除划线
    this.selectObj.on('Select:delUnderline', function (event, noteid) {
      that.cbnpage.noteObj.delNote({
        'chapterid': optsObj.chapts[optsObj.chapt_index].chapter_id,
        'noteid': noteid
      });
    });
    // 增加笔记
    this.selectObj.on('Select:addNote', function (event, data) {
      var newData = innerSetData(data);
      that.cbnpage.noteObj.editNote(newData);
    });
    // 纠错文字
    this.selectObj.on('Select:correct', function (event, data) {
      var newData = innerSetData(data);
      that.correctpage.open(newData);
    });
    function innerSetData(data) {
      var chapter = optsObj.chapts[optsObj.chapt_index];
      data.chapter_id = chapter.chapter_id;
      data.chapter_name = chapter.chapter_name;
      data.note_page = data.posLen / optsObj.totalLen + parseFloat(that.countPageObj.getHeadPerc());
      data.note_page = data.note_page.toFixed(4);
      delete data.posLen;
      delete data.currPage;
      return data;
    }
  };
  /**
   * 渲染 版权投诉面板, 并监听其相关事件. <br/>
   * 
   * @author gli-hxy-20160819 
   * 
   */
  Mobile.prototype._renderComplaint = function () {
    var optsObj = this.opts;
    var that = this;
    // 版权投诉面板.
    var complainTempl = templSet.getTempl('complain');
    that.complainpage = new complaintPanel({
      $readerObj: optsObj.$readerObj,
      complainHtml: complainTempl,
      // HTML 模板
      isMobile: optsObj.isMobile,
      api: that.ApiObj,
      loading: that.LoadingObj
    });
  };
  /**
   * 纠错文字面板，并监听其相关事件. <br/>
   * 
   * @author gli-jiangxq-20160920
   */
  Mobile.prototype._renderCorrect = function () {
    var optsObj = this.opts;
    var that = this;
    // 纠错文字面板.
    var correctTempl = templSet.getTempl('correct');
    that.correctpage = new correctPanel({
      $readerObj: optsObj.$readerObj,
      correctHtml: correctTempl,
      // HTML 模板
      isMobile: optsObj.isMobile,
      api: that.ApiObj
    });
  };
  /**
   * 渲染 搜索面板, 并监听其相关事件. <br/>
   * 
   * @author gli-hxy-20160819 
   * 
   */
  Mobile.prototype._renderSearch = function () {
    var optsObj = this.opts;
    var that = this;
    // 搜索面板.
    var searchTempl = templSet.getTempl('search');
    that.searchpage = new searchPanel({
      $readerObj: optsObj.$readerObj,
      searchHtml: searchTempl,
      // HTML 模板
      isMobile: optsObj.isMobile,
      isClient: optsObj.isClient,
      api: that.ApiObj,
      loading: that.LoadingObj
    });
    that.searchpage.opts.$domObj.on('search:click', function (e, data) {
      console.log('[reader.js] -> search:click 触发事件, 点击搜索结果跳转! ');
      that.countPageObj.turnPageByPerc(data);
    });
  };
  /**
   * 渲染目录, 并监听其相关事件. <br/>
   * 
   */
  Mobile.prototype._renderCatalog = function () {
    var optsObj = this.opts;
    var that = this;
    this.getCatalog(function (fileData) {
      optsObj.data.catalog = fileData;
      // 渲染 目录，并下载 默认 章节
      LOG.info('成功读取 目录数据 !', 'background:yellow;');
      optsObj.totalLen = parseInt(fileData.word_count);
      // 深度复制, 数组新建 指针.
      optsObj.chapts = $.extend(true, [], fileData.chapter);
      if (optsObj._useLayout) {
        LOG.info('执行 \u3010渲染布局\u3011!');
        // 检查分页数据准备情况
        that._checkPaging();
        // 目录、书签、笔记，面板.
        var cbnTempl = templSet.getTempl('cbn');
        var cbnNavMenuTempl = templSet.getTempl('cbnNavMenu');
        var cbnNavBodyTempl = templSet.getTempl('cbnNavBody');
        var catalogTempl = templSet.getTempl('catalog');
        var bookmarkTempl = templSet.getTempl('bookmark');
        var noteTempl = templSet.getTempl('note');
        var editTempl = templSet.getTempl('noteEdit');
        var detailTempl = templSet.getTempl('noteDetail');
        var shareTempl = templSet.getTempl('noteShare');
        // 创建bookmark的filePath
        var bookmarkFilePath = that._getCachePath({ 'fileName': 'bookmark' });
        // 创建bookmark的filePath
        var noteFilePath = that._getCachePath({ 'fileName': 'note' });
        that.cbnpage = new cbnPanel({
          wrapDomId: optsObj.domWrapId,
          $readerObj: optsObj.$readerObj,
          templHtml: cbnTempl,
          templHeadHtml: cbnNavMenuTempl,
          templBodyHtml: cbnNavBodyTempl,
          templCatalogHtml: catalogTempl,
          templBookmarkHtml: bookmarkTempl,
          templNoteHtml: noteTempl,
          isMobile: optsObj.isMobile,
          isClient: optsObj.isClient,
          saveFile: that.saveFile,
          bookmarkFilePath: bookmarkFilePath,
          noteFilePath: noteFilePath,
          data: optsObj.custom_nav_menus,
          api: that.ApiObj,
          // 开关- 使用[书签]
          useBookmark: optsObj.useBookmark,
          // 开关- 使用[笔记]
          useNote: optsObj.useNote,
          editHtml: editTempl,
          detailHtml: detailTempl,
          shareHtml: shareTempl,
          note_share_conf: optsObj.note_share_conf
        });
        that.cbnpage.renderCatalog(fileData);
        // 点击bookmark跳转  by gli-hxy-20160816
        that.cbnpage.on('cbnbookmark:click', function (event, percent) {
          // 关闭cbnPanel
          that.cbnpage.close();
          // 跳转到对应百分比
          that.countPageObj.turnPageByPerc(percent);
        });
        // 点击笔记跳转  by gli-hxy-20160919
        that.cbnpage.on('cbnnote:click', function (event, percent) {
          // 关闭cbnPanel
          that.cbnpage.close();
          // 跳转到对应百分比
          that.countPageObj.turnPageByPerc(percent);
        });
        // 点击目录跳转
        that.cbnpage.on('cbncatalog:click', function (event, params) {
          var oldIndex = optsObj.chapt_index;
          var newIndex = that.countPageObj.searchChaptIndex(params.id);
          if (!optsObj.chapts[newIndex].chapter_status) {
            // 该章节无权限
            console.log('[reader.js] -->章节' + params.id + '无权限\uFF01');
            optsObj.getDisableChaptCb();
            return false;
          }
          // 如果不是当前章节
          if (oldIndex !== newIndex) {
            that.countPageObj.turnChapter(newIndex);
          }
          that.cbnpage.close();
        });
      }
    }, function () {
      LOG.info('[reader.js] --> _renderCatalog --> 渲染目录\uFF0C获取目录信息失败!');
      if (optsObj.isClient) {
        LOG.info('[APP阅读] 本地无目录信息, 执行下载 !', 'background:pink;');
        // 本地无数据, 执行下载(目录, 章节);.
        that.download();
        that.LoadingObj.setMsg(Msg.downloadBooks);
      }
    });
  };
  /**
   * 渲染 设置面板. <br/>
   * 
   * 
   */
  Mobile.prototype._renderSetting = function () {
    console.info('%c _renderSetting', 'background:yellow;');
    var optsObj = this.opts;
    var that = this;
    var tmpData = optsObj.data;
    that._getProgressDataOffline(function (data) {
      // 获取服务器保存的阅读进度，并和本地保存的进度进行比较
      that._getProgressDataOnline(function (onlineData) {
        if (parseInt(onlineData.bookCloseTime) > parseInt(data.progressData.updateTime)) {
          tmpData.progressData = {
            'updateTime': onlineData.bookCloseTime,
            'progress': onlineData.progress
          };
        } else {
          tmpData.progressData = data.progressData;
        }
        that._getSettingDataOffline(function (data) {
          tmpData.settingData = data.settingData;
          innerSuccessCb();
        }, function () {
          innnerErrorCb();
        });
      }, function () {
        tmpData.progressData = data.progressData;
        that._getSettingDataOffline(function (data) {
          tmpData.settingData = data.settingData;
          innerSuccessCb();
        }, function () {
          innnerErrorCb();
        });
      });
    }, function () {
      // error
      innnerErrorCb();
    });
    function innnerErrorCb() {
    }
    function innerSuccessCb() {
      console.info('%c innerSuccessCb', 'background:yellow;');
      // 设置操作 面板
      var settingTempl = templSet.getTempl('setting');
      // 字体设置面板
      var fontlightTempl = templSet.getTempl('fontlight');
      // 进度设置面板
      var progressTempl = templSet.getTempl('progress');
      that.settingpage = new settingPanel({
        wrapDomId: optsObj.domWrapId,
        $readerObj: optsObj.$readerObj,
        templHtml: settingTempl,
        fontlightHtml: fontlightTempl,
        progressHtml: progressTempl,
        isMobile: optsObj.isMobile,
        progressData: tmpData.progressData.progress,
        settingData: tmpData.settingData,
        isNightMode: tmpData.settingData.isNightMode,
        // 开关- 使用[版权投诉]
        useComplaint: optsObj.useComplaint,
        // 开关- 使用[搜索]
        useSearch: optsObj.useSearch,
        // 开关- 使用[退出]
        useExit: optsObj.useExit,
        // 开关- 使用[字体]
        useFonts: optsObj.useFonts,
        // 开关- 使用[背景颜色]
        useBgColor: optsObj.useBgColor,
        // 开关- 使用[亮度控制]
        useLight: optsObj.useLight,
        // 开关- 使用[翻页方式]
        usePageWay: optsObj.usePageWay
      });
      // 设置操作 面板
      // 目录, 笔记, 书签
      that.settingpage.on('cbn:click', function () {
        console.log('[reader.js] -> 触发事件, 打开目录面板! ');
        that.cbnpage.open();
      });
      // 设置进度条值.
      that.settingpage.on('progress:setVal', function () {
        console.log('[reader.js] -> 触发事件, 弹出进度条! ');
        var val = that.countPageObj.getFootPerc() || 0;
        that.settingpage.$progressObj.setValue(val);
      });
      // 拖动定位页码.
      that.settingpage.on('progress:click', function (e, data) {
        console.log('[reader.js] -> 触发事件, 拖动定位! ');
        that.countPageObj.turnPageByPerc(data);  //that.settingpage.close();
      });
      // 章节向前翻.
      that.settingpage.on('progress:prev', function () {
        var newIndex = optsObj.chapt_index - 1;
        if (newIndex < 0) {
          newIndex = 0;
          return false;
        }
        if (!optsObj.chapts[newIndex].chapter_status) {
          // 该章节无权限
          console.log('[reader.js] -->章节:' + optsObj.chapts[newIndex].chapter_name + '无权限\uFF01');
          optsObj.getDisableChaptCb();
          return false;
        }
        that.countPageObj.turnChapter(newIndex);
        console.log('[reader.js] -> 触发事件, 章节向前翻! ');
      });
      // 章节向后翻.
      that.settingpage.on('progress:next', function () {
        var newIndex = optsObj.chapt_index + 1;
        if (newIndex === optsObj.chapts.length) {
          newIndex = newIndex - 1;
          return false;
        }
        if (!optsObj.chapts[newIndex].chapter_status) {
          // 该章节无权限
          console.log('[reader.js] -->章节:' + optsObj.chapts[newIndex].chapter_name + '无权限\uFF01');
          optsObj.getDisableChaptCb();
          return false;
        }
        that.countPageObj.turnChapter(newIndex);
        console.log('[reader.js] -> 触发事件, 章节向后翻! ');
      });
      // 设置-字体, 亮度 等.
      that.settingpage.on('font:click', function () {
        console.log('[reader.js] -> 触发事件, 设置-字体, 亮度 等! ');
      });
      // 字体大小.
      var tmpFontSize = tmpData.settingData.fontSize;
      innerSetFontSize({
        'oldValue': tmpFontSize.value,
        'newValue': tmpFontSize.value
      });
      that.settingpage.on('size:click', function (e, param) {
        console.log('[reader.js] -> 字体大小! ');
        innerSetFontSize(param);
      });
      // 版权投诉
      that.settingpage.on('complaint:click', function () {
        console.log('[reader.js] -> 触发事件, 打开版权投诉面板! ');
        that.complainpage.open();
      });
      // 搜索
      that.settingpage.on('search:click', function () {
        console.log('[reader.js] -> 触发事件, 打开搜索面板! ');
        that.searchpage.open();
      });
      // 翻页方式
      that.settingpage.on('pageway:click', function (event, param) {
        console.log('[reader.js] -> 触发事件, 翻页方式 ' + param.newValue);
        optsObj.pagingType = param.newValue;
        optsObj.$readerObj.attr('data-pageway', optsObj.pagingType);
      });
      // 字体类型
      var tmpFamilyData = tmpData.settingData.fontFamily;
      innerSetFontFamily({
        'oldValue': tmpFamilyData.value,
        'newValue': tmpFamilyData.value
      });
      // 捕获事件.
      that.settingpage.on('family:click', function (e, param) {
        LOG.info('[reader.js] -> 字体类型! ');
        innerSetFontFamily(param);
      });
      // 背景颜色
      var tmpBgColor = tmpData.settingData.bgColor;
      innerbackground({
        'oldValue': tmpBgColor.value,
        'newValue': tmpBgColor.value
      });
      that.settingpage.on('bgcolor:click', function (e, param) {
        LOG.info('[reader.js] -> 背景颜色! ');
        innerbackground(param);
      });
      // 夜间模式
      optsObj.isNightMode = tmpData.settingData.isNightMode;
      innerNightMode();
      that.settingpage.on('night:click', function (e, param) {
        LOG.info('[reader.js] -> 夜间模式切换! ');
        optsObj.isNightMode = param;
        innerNightMode();
      });
      // 关闭面板
      that.settingpage.on('close:click', function () {
        console.log('[reader.js] -> 捕获事件, 关闭面板! ');
        that._saveSettingFile();
      });
      // 退出阅读器
      that.settingpage.on('out:click', function () {
        console.log('[reader.js] -> 捕获事件, 退出阅读器! ');
        that.exit();
      });
    }
    // 设置 "字体大小";
    function innerSetFontSize(options) {
      that._deletePages();
      that.mainpage.setFontSize(options);
      that.countPageObj.setFontSize(options);
    }
    // 设置 "字体类型"
    function innerSetFontFamily(options) {
      that._deletePages();
      that.mainpage.setFontFamily(options);
      that.countPageObj.setFontFamily(options);
    }
    // 设置 "背景颜色"
    function innerbackground(options) {
      that.mainpage.setBgColor(options);
    }
    // 设置"夜间模式"
    function innerNightMode() {
      if (optsObj.isNightMode) {
        optsObj.$readerObj.addClass('read-night');
      } else {
        optsObj.$readerObj.removeClass('read-night');
      }
    }
  };
  /**
   * 检查分页状态. <br/>
   * 
   */
  Mobile.prototype._checkPaging = function () {
    // 计时器 等待 [阅读记录] 读取完毕.
    var that = this;
    var optsObj = this.opts;
    setTimeout(function () {
      if (null == optsObj.data.progressData) {
        that._checkPaging();
      } else {
        // 本地路径
        if (!optsObj.isClient) {
          var path = '';
        } else {
          var path = gli_get_cache_path() + that._getCachePath({ fileName: '' }) || '';
          path = path.substr(0, path.lastIndexOf('.'));
        }
        that.countPageObj.begin({
          'totalLen': optsObj.totalLen,
          'chapts': optsObj.chapts,
          'chapt_index': optsObj.chapt_index,
          'progressData': optsObj.data.progressData,
          'path': path
        });
      }
    }, 800);
  };
  /**
   * 渲染 分页器面板. <br/>
   * 
   */
  Mobile.prototype._renderCountpage = function () {
    var that = this;
    var optsObj = this.opts;
    // 分页器面板
    var countPageTempl = templSet.getTempl('countpage');
    this.countPageObj = new countPage({
      templHtml: countPageTempl,
      $readerObj: optsObj.$readerObj,
      isMobile: optsObj.isMobile,
      useEpubStyle: optsObj.useEpubStyle,
      useProbation: optsObj.useProbation
    });
    this.delicateObj = new delicateType({ wrapDomObj: optsObj.$readerObj.find('.read-delicate')[0] });
    var innerRenderCatalog = function () {
      var catalogData = optsObj.data.catalog;
      for (var i = 0, len = catalogData.chapter.length; i < len; i++) {
        var pageIndexInfo = that.countPageObj.getPageIndex(i);
        catalogData.chapter[i].pageNum = pageIndexInfo.currPage;
      }
      that.cbnpage.renderCatalog(catalogData);
    };
    // 章节内容
    this.countPageObj.on('countpage:getChapterContent', function (event, index) {
      that._pagingChapter(index);
    });
    // 页面显示
    this.countPageObj.on('countpage:showPage', function (event, data) {
      // 先去精排dom内精排后取出精排数据
      if (optsObj.usePublish) {
        data.chapterContent = that.delicateObj.excute({ html: data.chapterContent });
      }
      that._showPage(data);
    });
    // 分页完成
    this.countPageObj.on('countpage:finish', function (event, index) {
      var chapt = optsObj.chapts[index];
      var tempData = that.countPageObj.getPagingData();
      chapt.pages = tempData.pages;
      chapt.images = tempData.images;
      chapt.html = tempData.html;
      chapt.isPretreat = tempData.isPretreat;
      //              innerRenderCatalog();
      // 执行注册回调函数
      optsObj.getDataCb();
    });
    // 分页显示数据准备完成
    this.countPageObj.on('countpage:already', function () {
      that.LoadingObj.close();
      // 首次进入阅读器, 操作提示.
      if (optsObj.data.settingData.readTimes === 0) {
        that.promptPage.open(0);
        optsObj.data.settingData.readTimes++;
      }
    });
    // 保存图片
    this.countPageObj.on('countpage:downloadPhoto', function (event, data) {
      that._downloadPhoto(data);
    });
    // 试读 -- 无权限阅读数据
    this.countPageObj.on('countpage:noright', function (event, data) {
      optsObj.probotionCb();
    });
  };
  /**
   * 渲染 图片预览面板. <br/>
   * 
   */
  Mobile.prototype._renderViewImgPage = function () {
    var that = this;
    var optsObj = this.opts;
    this.viewImgPage = new viewImgPanel({
      '$wrapObj': optsObj.$readerObj,
      'dataTempl': templSet.getTempl('viewImg'),
      'isClient': optsObj.isClient,
      'isMobile': optsObj.isMobile,
      'clientType': optsObj.clientType,
      'isDownloadImg': optsObj.isDownloadImg
    });
  };
  /**
   * 渲染 视频面板. <br/>
   * 
   */
  Mobile.prototype._renderVideoPage = function () {
    var that = this;
    var optsObj = this.opts;
    if (!optsObj.useVideo) {
      return;
    }
    this.videoPage = new Video({
      '$readerObj': optsObj.$readerObj,
      'videoTemplHtml': templSet.getTempl('video'),
      'isClient': optsObj.isClient,
      'isMobile': optsObj.isMobile,
      'clientType': optsObj.clientType
    });
  };
  /**
   * 渲染 操作提示面板 . <br/>
   * 
   */
  Mobile.prototype._renderPromptPage = function () {
    var optsObj = this.opts;
    this.promptPage = new promptPanel({
      '$wrapObj': optsObj.$readerObj,
      'isMobile': optsObj.isMobile,
      'contentSet': [
        templSet.getTempl('firstOpen'),
        '<div class=\'read-content\'> TEST_2 !</div>'
      ]
    });
  };
  /**
   * 设置阅读器 区域的 属性: fontsize. <br/>
   * 
   */
  Mobile.prototype._setFontSize = function () {
    var optsObj = this.opts;
    var deviceWidth = optsObj.$readerWrap.width();
    deviceWidth = deviceWidth > 750 ? 750 : deviceWidth;
    optsObj.$readerWrap.css('font-size', deviceWidth / 7.5 + 'px');
  };
  /**
   * 取得本地图书目录(手机, C++)。<br/>
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  Mobile.prototype._getCatalogOffline = function (successCb, errorCb) {
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': 'catalog' });
    this.readFile(filePath, function (data) {
      if (null == data) {
        errorCb();
      } else {
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 取得在线图书目录。<br/>
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  Mobile.prototype._getCatalogOnline = function (successCb, errorCb) {
    this.ApiObj.getBookCatalog({}, function (data) {
      successCb(data);
    }, function (result) {
      errorCb(result);
    });
  };
  /**
   * 取得本地图书书签(手机, C++)。<br/>
   * 
   * 如果获取数据失败 或 不可读, 则认为: "数据损坏", 并执行重新下载!
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function} 获得数据失败 执行回调函数.
   * 
   */
  Mobile.prototype._getBookmarkOffline = function (successCb, errorCb) {
    LOG.log('[reader.js] -> _getBookmarkOffline! ');
    var optsObj = this.opts;
    var filePath = this._getCachePath({ fileName: 'bookmark' });
    this.readFile(filePath, function (data) {
      if (null == data) {
        errorCb();
      } else {
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 取得在线图书书签(web)。<br/>
   * 
   * 如果获取数据失败 或 不可读, 则认为: "数据损坏", 弹出提示框!
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function} 获得数据失败 执行回调函数.
   * 
   */
  Mobile.prototype._getBookmarkOnline = function (successCb, errorCb) {
    LOG.log('[reader.js] -> _getBookmarkOnline! ');
    this.ApiObj.getBookmark({}, function (data) {
      successCb(data);
    }, function (result) {
      console.warn('[reader.js]--获取书签信息失败!');
      errorCb(result);
    });
  };
  /**
   * 渲染书签. <br/>
   * 
   */
  Mobile.prototype._renderBookmark = function () {
    var optsObj = this.opts;
    var that = this;
    // 判断开关, 是否使用书签.
    if (!optsObj.useBookmark) {
      return;
    }
    if (!that.cbnpage) {
      // cbnPage 未初始化. 等待。。。
      setTimeout(function () {
        that._renderBookmark();
      }, 1000);
      return;
    }
    this.getBookmark(function (fileData) {
      // 渲染 书签.
      LOG.info('成功读取 书签数据 !', 'background:yellow;');
      // 如果是客户端，先下载服务器上的书签，并和本地的书签进行比较，如果本地书签更新时间晚，批量更新服务器书签
      if (optsObj.isClient) {
        var uploadBookmark = tool.filterLocalData(fileData.bookmark_list);
        if (uploadBookmark.length == 0) {
          // 本地无更新
          innerGetLatestBookmark();
        } else {
          that.ApiObj.batchUpdateBookmark({
            'time_stamp': fileData.time_stamp,
            'mark_list': uploadBookmark
          }, function (data) {
            innerGetLatestBookmark();
          }, function (data) {
            // 批量更新失败.
            that.cbnpage.renderBookmark(fileData);
          });
        }
      } else {
        that.cbnpage.renderBookmark(fileData);
      }
      function innerGetLatestBookmark() {
        that._getBookmarkOnline(function (latestBookmark) {
          var filePath = that._getCachePath({ 'fileName': 'bookmark' });
          var dataStr = JSON.stringify(latestBookmark);
          that.saveFile(filePath, dataStr);
          that.cbnpage.renderBookmark(latestBookmark);
        }, function () {
          // 获取最新笔记信息失败
          that.cbnpage.renderBookmark(fileData);
        });
      }
    }, function () {
      LOG.warn('[reader.js] --> _renderBookmark --> 渲染书签\uFF0C获取书签信息失败!');
      if (optsObj.isClient) {
        LOG.info('[APP阅读] 本地无书签信息, 执行下载 !', 'background:pink;');
        that.downloadBookmark();
      } else {
        that.cbnpage.renderBookmark();
      }
    });
  };
  /**
   * 下载图书书签. <br/>
   * 
   */
  Mobile.prototype.downloadBookmark = function () {
    var that = this;
    var optsObj = this.opts;
    LOG.log('[Mobile.js] -> downloadBookmark ' + optsObj.book_id);
    // 1. 书签 -- bookmark;
    var filePath = that._getCachePath({ fileName: 'bookmark' });
    this._getBookmarkOnline(function (data) {
      LOG.log('成功下載 书签 并 保存!');
      var dataStr = JSON.stringify(data);
      that.saveFile(filePath, dataStr);
      setTimeout(function () {
        that._renderBookmark();
      }, 300);
    }, function (result) {
      LOG.warn('[Mobile.js] -> downloadBookmark ' + result);
    });
  };
  /**
   * 取得本地图书笔记(手机, C++)。<br/>
   * 
   * 如果获取数据失败 或 不可读, 则认为: "数据损坏", 并执行重新下载!
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function} 获得数据失败 执行回调函数.
   * 
   */
  Mobile.prototype._getNoteOffline = function (successCb, errorCb) {
    LOG.log('[reader.js] -> _getNoteOffline! ');
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': 'note' });
    this.readFile(filePath, function (data) {
      if (null == data) {
        errorCb();
      } else {
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 取得在线图书笔记(web)。<br/>
   * 
   * 如果获取数据失败 或 不可读, 则认为: "数据损坏", 弹出提示框!
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function} 获得数据失败 执行回调函数.
   * 
   */
  Mobile.prototype._getNoteOnline = function (successCb, errorCb) {
    LOG.log('[reader.js] -> _getNoteOnline! ');
    this.ApiObj.getBookNote({}, function (data) {
      successCb(data);
    }, function (result) {
      LOG.warn('[reader.js]--获取笔记信息失败!');
      errorCb(result);
    });
  };
  /**
   * 获取 设置面板 参数.<br/>
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  Mobile.prototype._getSettingDataOffline = function (successCb, errorCb) {
    var that = this;
    var optsObj = that.opts;
    var tmpData = {};
    // 非app 比如微信、浏览器等
    if (!optsObj.isClient) {
      tmpData.settingData = Config.settingData;
      successCb(tmpData);
      return;
    }
    var filePath = this._getCachePath({
      'fileName': 'settingPanel',
      'bid': 'b_all',
      'uid': 'u_all'
    });
    this.readFile(filePath, function (data) {
      if (null == data) {
        tmpData.settingData = Config.settingData;
        that.saveFile(filePath, JSON.stringify(tmpData));
        successCb(tmpData);
      } else {
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 获取 阅读进度 参数. TODO -- 需要同步服务器.<br/>
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  Mobile.prototype._getProgressDataOffline = function (successCb, errorCb) {
    var that = this;
    var optsObj = that.opts;
    var tmpData = {};
    if (!optsObj.isClient) {
      tmpData.progressData = Config.progressData;
      tmpData.progressData.updateTime = '0';
      successCb(tmpData);
      return;
    }
    var filePath = this._getCachePath({ 'fileName': 'progress' });
    this.readFile(filePath, function (data) {
      if (null == data) {
        tmpData.progressData = Config.progressData;
        tmpData.progressData.updateTime = '0';
        that.saveFile(filePath, JSON.stringify(tmpData));
        successCb(tmpData);
      } else {
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 在线获取 阅读进度 参数. <br/>
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  Mobile.prototype._getProgressDataOnline = function (successCb, errorCb) {
    LOG.log('[readerMobile.js] -> _getProgressDataOnline! ');
    this.ApiObj.getProgressData({}, function (data) {
      successCb(data);
    }, function (result) {
      LOG.warn('[reader.js]--在线获取 阅读进度 失败!');
      errorCb(result);
    });
  };
  /**
   * 渲染笔记. <br/>
   * 
   */
  Mobile.prototype._renderNote = function () {
    var optsObj = this.opts;
    var that = this;
    // 判断开关, 是否使用书签.
    if (!optsObj.useNote) {
      return;
    }
    if (!that.cbnpage) {
      // cbnPage 未初始化. 等待。。。
      setTimeout(function () {
        that._renderNote();
      }, 100);
      return;
    }
    this.getNote(function (fileData) {
      // 渲染 目录，并下载 默认 章节.
      LOG.info('成功读取 笔记数据 !', 'background:yellow;');
      if (optsObj.isClient) {
        var uploadNote = tool.filterLocalData(fileData.note_list);
        if (uploadNote.length == 0) {
          // 本地无更新
          innerGetLatestNote();
        } else {
          that.cbnpage.noteObj.batchUpdateNote({
            'time_stamp': fileData.time_stamp,
            'note_list': uploadNote
          }, function (data) {
            innerGetLatestNote();
          }, function (data) {
            // 批量更新失败.
            that.cbnpage.renderNote(fileData);
          });
        }
      } else {
        that.cbnpage.renderNote(fileData);
      }
      function innerGetLatestNote() {
        that._getNoteOnline(function (latestNote) {
          var filePath = that._getCachePath({ 'fileName': 'note' });
          var dataStr = JSON.stringify(latestNote);
          that.saveFile(filePath, dataStr);
          that.cbnpage.renderNote(latestNote);
        }, function () {
          // 获取最新笔记信息失败
          that.cbnpage.renderNote(fileData);
        });
      }
    }, function () {
      LOG.warn('[reader.js] --> _renderNote --> 渲染笔记\uFF0C获取笔记信息失败!');
      if (optsObj.isClient) {
        LOG.info('[APP阅读] 本地无笔记信息, 执行下载 !', 'background:pink;');
        that.downloadNote();
      } else {
        that.cbnpage.renderNote();
      }
    });
  };
  /**
   * 下载图书笔记. <br/>
   * 
   */
  Mobile.prototype.downloadNote = function () {
    var that = this;
    var optsObj = this.opts;
    LOG.log('[Mobile.js] -> download ' + optsObj.book_id);
    // 1. 笔记 -- note; 
    var filePath = this._getCachePath({ 'fileName': 'note' });
    this._getNoteOnline(function (data) {
      LOG.log('成功下載 笔记 并 保存!');
      var dataStr = JSON.stringify(data);
      that.saveFile(filePath, dataStr);
      setTimeout(function () {
        that.cbnpage.renderNote(data);
      }, 300);
    }, function (result) {
      LOG.warn('[Mobile.js] -> downloadNote ' + result);
      that.cbnpage.renderNote();
    });
  };
  /**
   * 取得 本地图书章节内容<br/>
   * 
   * @param dataIn {Object}  章节id  e.g.  {chapter_id: "1001",chapter_name: "第一章"}
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  Mobile.prototype._getChapterOffline = function (dataIn, successCb, errorCb) {
    LOG.log('[reader.js] -> _getChapterOffline! ');
    // TODO， 改为 chapter_id;
    var filePath = this._getCachePath({ 'fileName': dataIn.chapter_name });
    this.readFile(filePath, function (data) {
      if (null == data) {
        errorCb();
      } else {
        data = tool.doDecodeData(data);
        successCb(data);
      }
    });
  };
  /**
   * 取得 在线图书章节内容<br/>
   * 
   * @param dataIn {Object}  章节id  e.g.  {chapter_id: "1001",chapter_name: "第一章"}
   * @param successCb {Function} 获得数据成功 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  Mobile.prototype._getChapterOnline = function (dataIn, successCb, errorCb) {
    this.ApiObj.getChapter(dataIn, function (result) {
      successCb(result);
    }, function (result) {
      errorCb(result);
    });
  };
  /**
   * 更新目录信息中的 章节下载状态.<br/>
   * 
   * @param target {Object}  e.g {chapter_id: "1001", isDownload: true}
   * 
   */
  Mobile.prototype._updateDownloadState = function (target) {
    var optsObj = this.opts;
    var catalogData = !!optsObj.data.catalog ? optsObj.data.catalog.chapter : [];
    for (var i = 0, len = catalogData.length; i < len; i++) {
      if (catalogData[i].chapter_id == target.chapter_id) {
        catalogData[i].isDownload = target.isDownload;
        break;
      }
    }
  };
  /**
   * 保存 目录信息至本地.<br/>
   * 
   */
  Mobile.prototype._saveCatalog = function () {
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': 'catalog' });
    var catalogStr = JSON.stringify(optsObj.data.catalog);
    this.saveFile(filePath, catalogStr);
  };
  /**
   * 保存 章节内容 至本地.<br/>
   * 
   * @param {String} chapterName  文件名. 
   * @param {String} content      文件内容.
   * 
   */
  Mobile.prototype._saveChapter = function (chapterName, content) {
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': chapterName });
    // 批量下载图片
    if (optsObj.isOnlyDownload) {
      var path = filePath.substr(0, filePath.lastIndexOf('/') + 1);
      this._batchdownloadPhoto(path, content);
    }
    this.saveFile(filePath, content);
  };
  /**
   * 保存/更新 当前设置面板参数至本地.<br/>
   * 
   * @param {Boolean} updTimes 是否更新阅读次数.
   * 
   */
  Mobile.prototype._saveSettingFile = function (updTimes) {
    var optsObj = this.opts;
    var filePath = this._getCachePath({
      'fileName': 'settingPanel',
      'bid': 'b_all',
      'uid': 'u_all'
    });
    if (!!this.settingpage) {
      var tmpSettingData = this.settingpage.getSettingData();
      if (!!updTimes) {
        // 阅读器打开次数. 用以判断 是否弹出 "操作提示界面"!
        tmpSettingData.readTimes = parseInt(tmpSettingData.readTimes) + 1;
      }
      this.saveFile(filePath, JSON.stringify({ 'settingData': tmpSettingData }));
    }
  };
  /**
   * 保存/更新 当前 阅读进度 至本地.<br/>
   * 
   */
  Mobile.prototype._saveProgressFile = function () {
    var optsObj = this.opts;
    var tempData = optsObj.data.progressData;
    var filePath = this._getCachePath({ 'fileName': 'progress' });
    tempData.updateTime = new Date().getTime();
    tempData.progress = this.countPageObj.getFootPerc();
    this.saveFile(filePath, JSON.stringify({ 'progressData': tempData }));
  };
  /**
   * 保存记录书籍阅读状态. <br/>
   * 
   */
  Mobile.prototype._saveBookState = function () {
    var optsObj = this.opts;
    var that = this;
    var chapter_id = optsObj.chapts[optsObj.chapt_index].chapter_id;
    var bookStateData = [];
    var filePath = this._getCachePath({ 'fileName': 'bookState' });
    this.readFile(filePath, function (data) {
      if (null != data) {
        data = tool.doDecodeData(data);
        data = JSON.parse(data);
        bookStateData = data;
      }
      bookStateData.push({
        'bookOpenTime': optsObj.bookOpenTime,
        'bookCloseTime': new Date().getTime(),
        'progress': that.countPageObj.getFootPerc(),
        'chapter_id': chapter_id
      });
      that.ApiObj.setBookState({ 'bookStateData': bookStateData }, function () {
        that.saveFile(filePath, JSON.stringify([]));
      }, function () {
        that.saveFile(filePath, JSON.stringify(bookStateData));
      });
    });
  };
  /**
   * 获取 离线状态下本地的版权保护 参数.<br/>
   * 
   * @param successCb {Function}   成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   * @author gli-jiangxq-20160829
   */
  Mobile.prototype._getCoprDataOffline = function (successCb, errorCb) {
    var that = this;
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': 'copyright' });
    if (!optsObj.isClient) {
      optsObj.data.copyright = Config.copyright;
      errorCb();
      return false;
    }
    this.readFile(filePath, function (data) {
      if (null == data) {
        var tmpData = {};
        tmpData.coprData = Config.copyright;
        that.opts.data.copyright = Config.copyright;
        that.saveFile(filePath, JSON.stringify(tmpData));
        errorCb();
      } else {
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 保存当前版权保护信息至本地. <br/>
   * 
   * @author gli-jiangxq-20160829
   */
  Mobile.prototype._saveCopyright = function () {
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': 'copyright' });
    var copyrightStr = JSON.stringify({ 'coprData': optsObj.data.copyright });
    this.saveFile(filePath, copyrightStr);
  };
  /**
   * 下载 单个章节内容. <br/>
   * 
   * @param {Object} chapterInfo 单个章节的目录信息
   * @param {String} chapterInfo.chapter_id    章节id
   * @param {String} chapterInfo.chapter_name  章节名
   * @param {Boolean} chapterInfo.isDownload   是否已下载
   * @param {Boolean} chapterInfo.chapter_status 是否可读
   * 
   * @param {Function} successCb 下载成功 回调函数
   * @param {Function} errorCb   下载失败 回调函数
   * 
   * @author gli-hxy-20160826
   * 
   */
  Mobile.prototype._downloadSingleChapter = function (chapterInfo, successCb, errorCb) {
    var that = this;
    var optsObj = that.opts;
    if (!chapterInfo || !chapterInfo.chapter_status) {
      // 传入信息错误 或者 本章无权限阅读.
      // errorCb(); TODO
      return;
    }
    this._getChapterOnline({ 'chapter_id': chapterInfo.chapter_id }, function (result) {
      LOG.info('[reader.js] -> 下载单个章节:' + chapterInfo.chapter_name);
      chapterInfo.isDownload = true;
      // 保存本章 内容。
      that._saveChapter(chapterInfo.chapter_name, result);
      // 更新目录信息.
      that._updateDownloadState(chapterInfo);
      that._saveCatalog();
      successCb();
      // 执行下载完成一章回调
      optsObj.downloadCb();
    }, function (result) {
      LOG.warn('[reader.js] -> 获取单个 [章节内容] 失败!' + result);
      errorCb();
    });
  };
  /**
   * 下载章节内容.<br/>
   * 
   */
  Mobile.prototype._downloadChapter = function () {
    var optsObj = this.opts;
    var chapterSet = optsObj.data.readableChapter || [];
    var pos = -1;
    var that = this;
    for (var i = 0, len = chapterSet.length; i < len; i++) {
      if (!chapterSet[i].isDownload) {
        pos = i;
        break;
      }
    }
    if (-1 !== pos) {
      //  revise by gli-hxy-20160826 stsrt
      that._downloadSingleChapter(chapterSet[pos], function (result) {
        //  sucess
        // 判断是下载一章，还是全书下载
        if (optsObj.isOnlyDownload) {
          that._downloadChapter();
        }
        if (optsObj._downloadState.rate == 30) {
          that._renderCatalog();
        }
        optsObj._downloadState = {
          'state': true,
          'rate': tool.getProgressRate(chapterSet.length, pos + 1, 30)
        };  //                  optsObj.downloadCb();
      }, function (errorResult) {
        // error.
        if (optsObj._downloadState.rate <= 30) {
          // 只有目录下载成功， 无章节内容.
          console.error('[reader.js] --> _downloadChapter; 只有目录下载成功\uFF0C 无章节内容.');
          // 关闭loading
          that.LoadingObj.close();
          // 提示用户当前章节下载失败
          that.DialogObj.setMsg(Msg.chapterFalse);
          that.DialogObj.open();  // TODO 提示信息的确定取消都要退出阅读器
        }
      });  //  revise by gli-hxy-20160826 end
    }
  };
  /**
   * 下载 图书, 保存为 本地文件. <br/>
   * 
   * 图书信息包括 目录, 章节. <br/>
   * ps: 以后考虑 书签, 笔记, 阅读习惯参数 等...<br/>
   * 
   */
  Mobile.prototype.download = function () {
    var optsObj = this.opts;
    var that = this;
    LOG.info('[reader.js] --> download!  userId:' + optsObj.user_id + ' , book_id:' + optsObj.book_id);
    this._getCatalogOnline(function (catalogData) {
      // 存入 当前对象.
      optsObj.data.catalog = catalogData;
      // 增加 属性 [isDownload]
      var tmpChapter = catalogData.chapter;
      // 准备需要下载的 章节的 id.
      var readableChapter = [];
      // 目录下载成功即有30%数据
      optsObj._downloadState.rate = 30;
      for (var i = 0, len = tmpChapter.length; i < len; i++) {
        tmpChapter[i].isDownload = false;
        if (tmpChapter[i].chapter_status) {
          var tmpItem = {};
          tmpItem.chapter_id = tmpChapter[i].chapter_id;
          tmpItem.chapter_name = tmpChapter[i].chapter_name;
          tmpItem.isDownload = tmpChapter[i].isDownload;
          tmpItem.chapter_status = tmpChapter[i].chapter_status;
          readableChapter.push(tmpItem);
        }
      }
      optsObj.data.readableChapter = readableChapter;
      optsObj.getCatalogCb();
      if (optsObj.useEpubFile) {
        //  执行 注册函数回调. 使用 epub源文件. 不需要分页, 不需要下载章节;/ 
        return;
      }
      that._saveCatalog();
      that._downloadChapter();
    }, function (result) {
      LOG.warn('[reader.js] -> download ' + result);
    });
  };
  /**
   * 获取 图书下载 进度信息。
   *
   * @return {
   *     state : {Boolean} 状态 true: 成功, 失败.
   *     rate :  {Number} 进度
   * }
   *
   */
  Mobile.prototype.getDownloadInfo = function () {
    var optsObj = this.opts;
    var downloadInfo = optsObj._downloadState;
    return downloadInfo;
  };
  /**
   * 获取 目录信息。<br/>
   *
   * @return {Object} 结构复杂,请参考数据接口文档
   *
   */
  Mobile.prototype.getCatalogInfo = function () {
    var optsObj = this.opts;
    var catalogData = optsObj.data.catalog || [];
    return catalogData;
  };
  /**
   * 获取 分页完毕的 书籍信息。<br/>
   *
   * @return {Object}
   *
   */
  Mobile.prototype.getPagesAll = function () {
    var optsObj = this.opts;
    var tmpChapterData = optsObj.chapts || [];
    return tmpChapterData;
  };
  /**
   * 下载图片. <br/>
   * @param {Object} images {
   *              old_src: 图片服务器源地址
   *              new_src: 图片保存本地地址
   *         }
   * @author gli-jiangxq-20160816
   */
  Mobile.prototype._downloadPhoto = function (img) {
    var optsObj = this.opts;
    var new_src = img.new_src.replace(gli_get_cache_path(), '');
    tool._downloadImageFile(img.old_src, new_src);
  };
  /**
   * 批量下载图片. <br/>
   * 
   * @param {String} path     路径
   * @param {String} content  章节html
   * 
   * @author gli-jiangxq-20161014
   */
  Mobile.prototype._batchdownloadPhoto = function (path, content) {
    var basePath = gli_get_cache_path() + path + 'images/';
    var that = this;
    $(content).find('img').each(function () {
      var old_src = $(this).attr('src');
      var img_name = old_src.substring(old_src.lastIndexOf('/') + 1, old_src.length);
      var new_src = basePath + img_name;
      that._downloadPhoto({
        'old_src': old_src,
        'new_src': new_src
      });
    });
  };
  /** 
   * 读取具体某一章节(optsObj.chapt_index),并执行分页. <br/>
   * 
   * @param {Number} index 目标章节的下标
   * 
   * @author gli-jiangxq-20160809
   */
  Mobile.prototype._pagingChapter = function (index) {
    var that = this;
    var optsObj = that.opts;
    var chapterItem = optsObj.chapts[index];
    if (!chapterItem.chapter_status) {
      console.log('[reader.js] --> 该章节您没有权限\uFF01');
      return false;
    }
    // 是否已有分页信息
    if (!!optsObj.chapts[index].pages && optsObj.chapts[index].pages.length) {
      // 设置章节分页信息
      that.countPageObj.setChapterData({
        'index': index,
        'getHtml': optsObj.chapts[index].html,
        'pages': optsObj.chapts[index].pages,
        'isPretreat': optsObj.chapts[index].isPretreat
      });
      that.countPageObj.readyData();
    } else {
      that.LoadingObj.setMsg(Msg.loading);
      that.LoadingObj.open();
      // 分页数据已经预处理过，直接用预处理过的html
      if (optsObj.chapts[index].isPretreat) {
        // 设置需要分页的章节信息
        that.countPageObj.setChapterData({
          'index': index,
          'getHtml': optsObj.chapts[index].html,
          'pages': [],
          'isPretreat': optsObj.chapts[index].isPretreat
        });
        // 执行分页
        that.countPageObj.excutePaging();
      } else {
        // 获取当前章节的数据
        that.getChapterContent({
          'chapter_id': chapterItem.chapter_id,
          'chapter_name': chapterItem.chapter_name
        }, function (data) {
          optsObj.chapts[index].html = data;
          // 设置需要分页的章节信息
          that.countPageObj.setChapterData({
            'index': index,
            'getHtml': data,
            'pages': [],
            'isPretreat': optsObj.chapts[index].isPretreat
          });
          // 执行分页
          that.countPageObj.excutePaging();
        }, function (data) {
          // add by gli-hxy-20160826 start
          LOG.warn('[reader.js]--> pagingChapter:' + data);
          that._downloadSingleChapter(chapterItem, function () {
            var len = 0;
            var chapts = optsObj.chapts;
            for (var i = 0; i < chapts.length; i++) {
              if (chapts[i].chapter_status) {
                len++;
              }
            }
            that._pagingChapter(index);
            optsObj._downloadState = {
              'state': true,
              'rate': tool.getProgressRate(len, index + 1, optsObj._downloadState.rate)
            };
          }, function () {
            // 关闭loading
            that.LoadingObj.close();
            // 提示用户当前章节下载失败
            that.DialogObj.setMsg(Msg.chapterFalse);
            that.DialogObj.open();
            that.countPageObj.opts.chapt_index = optsObj.chapt_index;
            that.countPageObj.opts.page_index = optsObj.page_index;
          });  // add by gli-hxy-20160826 end
        });
      }
    }
  };
  /**
   * 删除所有分页数据. <br/>
   * 
   * @author gli-jiangxq-20160818
   */
  Mobile.prototype._deletePages = function () {
    var optsObj = this.opts;
    var chapts = optsObj.chapts;
    if (!chapts) {
      return false;
    }
    for (var i = 0, len = chapts.length; i < len; i++) {
      if (!!chapts[i].pages) {
        chapts[i].pages = [];
      }
    }
  };
  /**
   * 向后翻页. </br>
   * 
   * @author gli-jiangxq-20160905
   */
  Mobile.prototype.next = function () {
    this.countPageObj.turnPage('next');
  };
  /**
   * 向前翻页. </br>
   * 
   * @author gli-jiangxq-20160905
   */
  Mobile.prototype.prev = function () {
    this.countPageObj.turnPage('prev');
  };
  /**
   * 显示分页数据到页面.  <br/>
   * 
   * @param {Object} data {
   *      'chapt_index':      {Number} optsObj.chapt_index,
   *      'page_index':       {Number} optsObj.page_index,
   *      'chapterId'         {String} 当前的章节id
   *      'chapterName':      {String} 章节名
   *      'chapterContent':   {String} 当前页html
   *      'pagePerc':         {String} 当前页偏移量  ps:12.34%
   *      'direction':        {String} 翻页方向  ps:'next','prev'
   *      'turnMode':         {Number} 翻页模式  ps:0,正常反应，有翻页动画;1,特殊翻页,无翻页动画
   *      'startPageOffset'   {String} 当前页的开始偏移量
   *      'endPageOffset'     {String} 当前页的结束偏移量
   *     }
   * @author gli-jiangxq 20160809
   */
  Mobile.prototype._showPage = function (data) {
    LOG.info('[reader.js]--> showPage');
    var optsObj = this.opts;
    // 页面章节下标和页码没有发生改变不执行页面翻页动作
    if (!data.turnMode && optsObj.chapt_index === data.chapt_index && optsObj.page_index === data.page_index) {
      return false;
    }
    optsObj.chapt_index = data.chapt_index;
    optsObj.page_index = data.page_index;
    // TODO: 将页码换成百分百
    data.currPage = data.pagePerc;
    this.mainpage.showPagedata(data, optsObj.pagingType);
    var chaptName = optsObj.chapts[optsObj.chapt_index].chapter_name;
    var chaptTotal = optsObj.chapts.length;
    var progressVal = this.countPageObj.getFootPerc();
    this.settingpage.setProgressVal({
      'name': chaptName,
      'currIndex': optsObj.chapt_index + 1,
      'total': chaptTotal,
      'val': progressVal,
      'turnMode': data.turnMode
    });
  };
  /**
   * 获取缓存路径（书签、笔记、目录、设置的参数等） <br />
   * 
   * @param {Object} params 传入参数
   * @param {String} params.fileName 文件名  如:"第一章"
   * @param {String} params.bid      图书id 如:"b100"
   * @param {String} params.uid      用户id 如:"20160700001"
   * 
   * @return {String} filePath 文件路径  "c:/path/20160700001/b100/第一章.txt"
   * 
   * @author gli-hxy-20160818
   * 
   */
  Mobile.prototype._getCachePath = function (params) {
    var optsObj = this.opts;
    var localPath = optsObj.downloadPath;
    var bookid = params.bid || optsObj.book_id;
    var userid = params.uid || optsObj.user_id;
    var tmpFileName = params.fileName || '';
    var filePath = tool.createBookPath(userid, bookid, tmpFileName, localPath);
    return filePath;
  };
  /**
   * 删除本地指定位置数据（目录、书签、章节信息、设置信息等） <br>.
   * 
   * 开发者使用
   */
  Mobile.prototype.delLocalData = function () {
    var that = this;
    var optsObj = that.opts;
    //          var path = tool.createBookPath(
    //              optsObj.user_id,
    //              optsObj.book_id,
    //              "",
    //              optsObj.downloadPath);
    //              
    //          var localPath = path.indexOf(".txt") != -1 ? path.slice(0,-5) :path;
    if (typeof gli_file_unlink == 'function') {
      gli_file_unlink(optsObj.downloadPath);
    }
  };
  /**
   * 退出阅读器取消监听：音量键、返回键监听，相册数量监听
   */
  Mobile.prototype._unbindAppEvents = function () {
    // 取消按键注册
    if (typeof gli_keydown_event != 'undefined' && typeof gli_keydown_event == 'function') {
      gli_keydown_event(0, function () {
      }, false);
      gli_keydown_event(1, function () {
      }, false);
      gli_keydown_event(2, function () {
      }, false);
    }
    // 取消相册监听
    if (typeof gli_photo_change != 'undefined' && typeof gli_photo_change == 'function') {
      gli_photo_change(function () {
      }, false);
    }
  };
  /**
   * 退出阅读器. <br/>
   * 
   */
  Mobile.prototype.exit = function (params) {
    var optsObj = this.opts;
    this._saveProgressFile();
    this._saveSettingFile(true);
    this._saveBookState();
    try {
      this._unbindAppEvents();
    } catch (e) {
      console.error('[readerMObile.js] --> 解除绑定cordova监听事件失败' + e);
    }
    optsObj.exitReaderCb();
  };
  /**
   * 打开阅读器. <br/>
   * 
   */
  Mobile.prototype.open = function (params) {
    console.info('[readerMobile.js] --> open!');
  };
  return Mobile;
}(js_src_global, js_libs_zeptodev, js_src_tool, js_src_api, js_src_panelTempl, js_src_panelMain, js_src_panelSetting, js_src_panelCbn, js_src_panelComplaint, js_src_panelSearch, js_src_countPage, js_src_widget_plugLoading, js_src_panelPrompt, js_src_copyright, js_src_panelViewImg, js_src_config, js_src_widget_plugDialog, js_src_message_zh, js_src_select, js_src_panelCorrect, js_src_widget_delicateType, js_src_widget_plugVideoMobile);
js_src_pc_panelTemplPc = function (window, $) {
  //  var $ = window.Zepto;
  var _ = window._;
  //  var templSets = {
  //      "main": $("#main-templ-pc").html(),
  //      "staticPanel": $("#static-templ-pc").html(),
  //      "cbnHeader": $("#nav-menus-pc").html(),
  //      "cbnBody": $("#custom-nav-body").html(),
  //      "catalog": $("#catalog-templ-pc").html(),
  //      "countpage": $("#countpage-templ-pc").html(),
  //      "bookmark": $("#bookmark-templ-pc").html(),
  //      "note": $("#note-templ-pc").html(),
  //      "searchResult": $("#search-result-pc").html(),
  //      "picture": $("#picture-templ-pc").html(),
  //      "video": $("#video-templ-pc").html(),
  //  };
  var templSets = {
    'main': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-main-panel%20read-selector-main%22%20id=%22reader_main_panel%22%3E%0A%20%20%20%20%20%20%20%20%3Cheader%20class=%22read-header%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%20%E9%A1%B6%E9%83%A8%E6%93%8D%E4%BD%9C%E6%A0%8F%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-setting-panel%22%20id=%22reader_setting_nav%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-left%20read-lf%22%20id=%22reader_setting_nav_lf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-cbn-btn%20read-sel-comm-btn%22%20data-panel-id=%22#reader_cbn_panel%22%3E%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-aa-btn%20read-sel-comm-btn%22%20data-panel-id=%22#reader_font_panel%22%3E%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-color-btn%22%3E%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-com-btn%20read-sel-comm-btn%22%20data-panel-id=%22#reader_complain_panel%22%3E%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-imgtxt-btn%20read-sel-comm-btn%22%20data-panel-id=%22#reader_imgtxt_panel%22%3E%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-middle%20read-h-center%22%20id=%22reader_setting_nav_md%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-sel-comm-btn%20read-prev%22%3E%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-sel-comm-btn%20read-next%22%3E%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-reader-pc-page%20read-rt%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%20%E8%BF%9B%E5%BA%A6%20%E7%99%BE%E5%88%86%E6%AF%94%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20type=%22text%22%20class=%22%22%20/%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%3E/%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-right%20read-rt%22%20id=%22reader_setting_nav_rt%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20type=%22text%22%20placeholder=%22%E8%AF%B7%E8%BE%93%E5%85%A5%E6%90%9C%E7%B4%A2%E5%85%B3%E9%94%AE%E5%AD%97%22%20/%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20class=%22read-a-btn%20read-search-btn%20read-sel-comm-btn%22%20data-panel-id=%22#reader_search_panel%22%3E%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20class=%22read-a-btn%20read-bookmark-btn%20read-bookmark-view%22%3E%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20class=%22read-a-btn%20read-exit-btn%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%22%3E%E9%80%80%E5%87%BA%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%0A%20%20%20%20%20%20%20%20%3C/header%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-animate-cover%20read-hide%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-prev-paging%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-icon%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-next-paging%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-icon%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-control-wh%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-name%20read-chapter-view%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-content%20read-page-1%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-content%20read-page-2%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-delicate-container%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-delicate%20read-cf%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-progressbar%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C!--%20%E8%83%8C%E6%99%AF%E9%A2%9C%E8%89%B2%20--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bgcolor-div%20read-hide%22%20id=%22bgcolor_panel%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bgcolor-cover%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bgcolor-box%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-triangle%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bgcolor-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cf%20read-content%22%20data-class=%221%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20type=%22radio%22%20name=%22bg%22%20checked=%22checked%22%20/%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-check%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-bg%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%22%3E%E9%BB%98%E8%AE%A4%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cf%20read-content%22%20data-class=%222%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20type=%22radio%22%20name=%22bg%22%20/%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-check%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-bg%20read-icon-blue%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%22%3E%E6%B5%B7%E5%A4%A9%E8%93%9D%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cf%20read-content%22%20data-class=%223%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20type=%22radio%22%20name=%22bg%22%20/%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-check%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-bg%20read-icon-red%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%22%3E%E8%83%AD%E8%84%82%E7%BA%A2%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cf%20read-content%22%20data-class=%224%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20type=%22radio%22%20name=%22bg%22%20/%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-check%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-bg%20read-icon-green%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%22%3E%E9%9D%92%E8%8D%89%E7%BB%BF%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%0A%20%20%20%20%3C/div%3E%0A'),
    'staticPanel': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-reader-static-panel%20read-hide%22%20id=%22reader_static_panel%22%3E%0A%20%20%20%20%20%20%20%20%3C!--%E8%92%99%E5%B1%82--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-mask%22%20id=%22reader_panel_mask%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C!--%E7%9B%AE%E5%BD%95%E3%80%81%E7%AC%94%E8%AE%B0%E3%80%81%E4%B9%A6%E7%AD%BE--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-menu-cover%20read-cbn-panel%22%20id=%22reader_cbn_panel%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cbn-content%20read-left-aside%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header-nav%22%20id=%22cbn_header%22%3E%E7%9B%AE%E5%BD%95%E3%80%81%E7%AC%94%E8%AE%B0%E3%80%81%E4%B9%A6%E7%AD%BE%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%20id=%22cbn_body%22%3E%E7%9B%AE%E5%BD%95%E3%80%81%E7%AC%94%E8%AE%B0%E3%80%81%E4%B9%A6%E7%AD%BE--%3E%E5%86%85%E5%AE%B9%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C!--%E5%AD%97%E4%BD%93%E8%AE%BE%E7%BD%AE%E9%9D%A2%E6%9D%BF--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-menu-cover%20read-font-panel%22%20id=%22reader_font_panel%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-left-aside%20read-font-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%AD%97%E4%BD%93%E5%A4%A7%E5%B0%8F--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-f-size%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ch2%20class=%22read-font-title%22%3E%E5%AD%97%E4%BD%93%E5%A4%A7%E5%B0%8F%3C/h2%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20id=%22font_size_change%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%22%20data-class=%221%22%3EA%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-active%22%20data-class=%222%22%3EA%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%22%20data-class=%223%22%3EA%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%22%20data-class=%224%22%3EA%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-f-family%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ch2%20class=%22read-font-title%22%3E%E5%AD%97%E4%BD%93%E8%AE%BE%E7%BD%AE%3C/h2%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cul%20id=%22font_fm_change%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cli%20class=%22read-cf%20read-active%20read-has-download%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-text-over%22%3E%E9%9B%85%E9%BB%91(%E9%BB%98%E8%AE%A4)%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-has-font%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20type=%22radio%22%20name=%22font-fam%22%20checked=%22checked%22%20class=%22read-choose-fm%20read-hv-center%22%20data-class=%221%22%20/%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-hv-center%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-not-font%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-hv-center%22%3E%E4%B8%8B%E8%BD%BD%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/li%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cli%20class=%22read-cf%20read-has-download%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-text-over%22%3E%E5%AE%8B%E4%BD%93%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-has-font%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20type=%22radio%22%20name=%22font-fam%22%20class=%22read-choose-fm%20read-hv-center%22%20data-class=%222%22%20/%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-hv-center%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-not-font%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-hv-center%22%3E%E4%B8%8B%E8%BD%BD%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/li%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cli%20class=%22read-cf%20read-has-download%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-text-over%22%3E%E9%BB%91%E4%BD%93%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-has-font%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20type=%22radio%22%20name=%22font-fam%22%20class=%22read-choose-fm%20read-hv-center%22%20data-class=%223%22%20/%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-hv-center%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-not-font%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-hv-center%22%3E%E4%B8%8B%E8%BD%BD%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/li%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/ul%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%88%86%E5%89%B2%E7%BA%BF%20%E6%9B%B4%E5%A4%9A--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-more-font%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-more-font-btn%20read-disabled%22%3E%3Cspan%3E%E6%9B%B4%E5%A4%9A%3C/span%3E%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C!--%E7%89%88%E6%9D%83%E6%8A%95%E8%AF%89%E9%9D%A2%E6%9D%BF--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-menu-cover%20read-complaint-panel%20read-com-edit-correction%20%22%20id=%22reader_complain_panel%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-complaint-content%20read-content%20read-left-aside%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ch1%3E%E7%89%88%E6%9D%83%E6%8A%95%E8%AF%89%3C/h1%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-edit%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctextarea%20placeholder=%22%E4%BF%9D%E6%8A%A4%E7%89%88%E6%9D%83%EF%BC%8C%E5%85%B1%E5%BB%BA%E7%99%BE%E5%AE%B6%E4%BA%89%E9%B8%A3%E7%9A%84%E5%8E%9F%E5%88%9B%E5%A4%A7%20%E7%8E%AF%E5%A2%83%EF%BC%8C%E6%84%9F%E8%B0%A2%E6%9C%89%E6%82%A8%22%3E%3C/textarea%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-btn-div%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-send%22%3E%E5%8F%91%E9%80%81%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-cancel%22%3E%E5%8F%96%E6%B6%88%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C!--%20%E5%9B%BE%E6%96%87%E5%AF%B9%E7%85%A7%20--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-menu-cover%20read-imgtxt-panel%22%20id=%22reader_imgtxt_panel%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-left-aside%20read-imgtxt-container%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-imgtxt%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ch2%20class=%22read-font-title%22%3E%E9%80%89%E6%8B%A9%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F%3C/h2%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cul%20id=%22imgtxt_change%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cli%20class=%22read-cf%20read-active%22%20data-model=%221%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-text-over%22%3E%E6%AD%A3%E5%B8%B8%E6%A8%A1%E5%BC%8F%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/li%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cli%20class=%22read-cf%22%20data-model=%222%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-text-over%22%3E%E5%8F%AA%E6%98%BE%E7%A4%BA%E5%8E%9F%E7%A8%BF%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/li%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cli%20class=%22read-cf%22%20data-model=%223%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-text-over%22%3E%E5%9B%BE%E6%96%87%E5%AF%B9%E7%85%A7%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/li%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/ul%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C!--%E6%90%9C%E7%B4%A2%E9%9D%A2%E6%9D%BF--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-search-panel%22%20id=%22reader_search_panel%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-left-aside%20read-search-content%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C!--%E7%AC%94%E8%AE%B0%E8%AF%A6%E6%83%85--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-menu-cover%20read-detail-panel%20read-com-edit-correction%22%20id=%22reader_detailNote_panel%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-detail-content%20read-content%20read-left-aside%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ch1%3E%E6%9C%AC%E7%AB%A0%E8%8A%82%E7%AC%94%E8%AE%B0%E8%AF%A6%E6%83%85%3C/h1%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-original-text%22%3E%E5%8E%9F%E6%96%87%E5%86%85%E5%AE%B9%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-view%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-text%22%3E%E7%AC%94%E8%AE%B0%E5%86%85%E5%AE%B9%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-btn-div%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-delete-btn%22%3E%E5%88%A0%E9%99%A4%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-edit-btn%22%3E%E7%BC%96%E8%BE%91%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-turn-note%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cbutton%20class=%22read-lf%20read-prev%22%3E%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%E4%B8%8A%E4%B8%80%E9%A1%B5%3C/button%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-page%20read-hv-center%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-current%22%3E1%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%3E/%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-total%22%3E1%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cbutton%20class=%22read-rt%20read-next%22%3E%E4%B8%8B%E4%B8%80%E9%A1%B5%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%3C/button%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-share%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-title%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-hv-center%22%3E%E5%88%86%E4%BA%AB%E5%88%B0%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cul%20class=%22read-cf%20read-sel-share%22%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20_.each(obj.shareNotes,%20function(item)%7B%20%25%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cli%20data-type=%22%3C%25=item.type%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-icon%20%3C%25=item.icon_css%25%3E%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-font%20read-text-over%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=item.txt%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/li%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/ul%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C!--%E7%AC%94%E8%AE%B0%E7%BC%96%E8%BE%91--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-menu-cover%20read-edit-panel%20read-com-edit-correction%22%20id=%22reader_editNote_panel%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-edit-content%20read-content%20read-left-aside%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ch1%3E%E7%BC%96%E8%BE%91%E7%AC%94%E8%AE%B0%3C/h1%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-original-text%22%3E%E5%8E%9F%E6%96%87%E5%86%85%E5%AE%B9%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-edit%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctextarea%20placeholder=%22%E8%BD%BB%E6%9D%BE%E8%AE%B0%E5%BD%95%E4%BD%A0%E7%9A%84%E6%89%80%E6%83%B3%E3%80%81%E6%89%80%E6%84%9F%22%3E%3C/textarea%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-btn-div%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-send%22%3E%E4%BF%9D%E5%AD%98%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-cancel%22%3E%E5%8F%96%E6%B6%88%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C!--%E6%96%87%E5%AD%97%E7%BA%A0%E9%94%99--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-menu-cover%20read-correction-panel%20read-com-edit-correction%22%20id=%22reader_correct_panel%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-correction-content%20read-content%20read-left-aside%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ch1%3E%E7%BA%A0%E9%94%99%E6%96%87%E5%AD%97%3C/h1%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-original-text%22%3E%E5%8E%9F%E6%96%87%E5%86%85%E5%AE%B9%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-edit%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctextarea%20placeholder=%22%E5%B8%AE%E5%8A%A9%E6%88%91%E4%BB%AC%E7%BA%A0%E6%AD%A3%E9%94%99%E8%AF%AF%EF%BC%8C%E8%AE%A9%E6%88%91%E4%BB%AC%E6%9B%B4%E5%A5%BD%E7%9A%84%E4%B8%BA%E5%A4%A7%E5%AE%B6%E6%9C%8D%E5%8A%A1%22%3E%3C/textarea%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-btn-div%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-send%22%3E%E5%8F%91%E9%80%81%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-cancel%22%3E%E5%8F%96%E6%B6%88%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'cbnHeader': decodeURI('%0A%20%20%20%20%3C%25%20_.each(obj,%20function(%20menu%20)%7B%20%20%20%25%3E%0A%20%20%20%20%3Cdiv%20class=%22read-lf%20read-nav-menu%20%3C%25=%20menu.state%20%25%3E%20read-nav-menu%3C%25=%20obj.length%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-pointer%20read-text-over%22%3E%3C%25=%20menu.text%20%25%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C%25%20%20%20%7D);%20%20%25%3E%0A'),
    'cbnBody': decodeURI('%0A%20%20%20%20%3C%25%20_.each(obj,%20function(%20menu%20)%7B%20%20%20%25%3E%0A%20%20%20%20%3Cdiv%20class=%22%3C%25=%20menu.view%20%25%3E%20%3C%25%20if(menu.state%20!=%20\'read-active\')%7B%20%25%3E%20read-hide%20%20%3C%25%20%7D%20%25%3E%20%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-no-%3C%25=%20menu.name%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-h-center%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%20read-h-center%22%3E%3C%25=%20menu.prompt%20%25%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C%25%20%20%20%7D);%20%20%25%3E%0A'),
    'catalog': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-book-info%20read-cf%22%20id=%22reader_catalog_panel%22%3E%0A%20%20%20%20%20%20%20%20%3Ch1%20class=%22read-text-over%22%3E%3C%25=%20obj.name%20%25%3E%3C/h1%3E%0A%20%20%20%20%20%20%20%20%3Ch2%20class=%22read-text-over%22%3E%3C%25=%20obj.subtitle%20%25%3E%3C/h2%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cf%20read-catalog-author%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%3E%3Cspan%20class=%22read-lf%20read-text-over%22%3E%3C%25=%20obj.author%20%25%3E%3C/span%3E%3Cspan%20class=%22read-light-gray%22%3E%E8%91%97%3C/span%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%3E%3Cspan%20class=%22read-lf%20read-text-over%22%3E%3C%25=%20obj.translator%20%25%3E%3C/span%3E%3Cspan%20class=%22read-light-gray%22%3E%E8%AF%91%3C/span%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cf%20read-catalog-visitors%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%3E%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%3Cspan%3E%3C%25=%20obj.read_num%20%25%3E%20%E9%98%85%E8%AF%BB%3C/span%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%22%3E%3Cspan%3E%3C%25=%20obj.word_count%20%25%3E%20%E5%AD%97%3C/span%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A%0A%20%20%20%20%3Cdiv%20class=%22read-chapter-list%22%3E%0A%20%20%20%20%20%20%20%20%3Cul%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20_.each(obj.chapter,%20function(chapt)%7B%20%20%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cli%20class=%22read-sel-catalog%20%3C%25%20if%20(!chapt.chapter_status)%20%7B%20%25%3Eread-no-data%3C%25%20%7D%20%25%3E%22%20data-status=%22%3C%25=%20chapt.chapter_status%20%25%3E%22%20data-id=%22%3C%25=%20chapt.chapter_id%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-lf%20read-chapter-name%20read-text-over%22%20title=%22%3C%25=%20chapt.chapter_name%20%25%3E%22%3E%3C%25=%20chapt.chapter_name%20%25%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%3Cspan%20class=%22read-rt%20read-chapter-seat%22%3E%3C%25=%20!!chapt.pageNum%20?%20chapt.pageNum%20:%200%20%25%3E%3C/span%3E--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-rt%20read-chapter-seat%22%3E%3C%25=%20(parseInt(chapt.curtextlen)/parseInt(obj.word_count)%20*%20100).toFixed(2)%20%25%3E%25%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%20%20%20%20%3C/ul%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'countpage': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-countpage-panel%20read-selector-countpage%22%3E%0A%20%20%20%20%20%20%20%20%3Cheader%20class=%22read-header%20read-cf%22%3E%3C/header%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-control-wh%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-name%20read-chapter-view%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-content%20read-page-1%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-countpage-content%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-countpage%20read-cf%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-progressbar%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'bookmark': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-has-bookmark%22%3E%0A%20%20%20%20%20%20%20%20%3C%25%20_.each(obj.chapter_list,%20function(chapt)%7B%20%20%20%25%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-one-chapter-bookmark%22%20data-chapterid=%22%3C%25=%20chapt.chapter_id%20%25%3E%22%20data-chapterName=%22%3C%25=%20chapt.chapter_name%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-chapter%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-text-over%20read-bookmark-chapter-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapt.chapter_name%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20read-bookmark-chapter-count%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapt.count%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20_.each(chapt.bookmark_list,%20function(bookmark)%7B%20%20%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark%20read-bookmark%3C%25=%20bookmark.bookmark_id%20%25%3E%22%20data-page=%22%3C%25=%20bookmark.bookmark_page%20%25%3E%22%20data-chapterid=%22%3C%25=%20chapt.chapter_id%20%25%3E%22%20data-bookmarkid=%22%3C%25=%20bookmark.bookmark_id%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-left%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-original-text%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20bookmark.bookmark_text%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cf%20read-bookmark-time%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-bookmark-percent%22%3E%3C%25=%20(parseFloat(bookmark.bookmark_page)*100).toFixed(2)%20%25%3E%25%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-time%22%3E%3C%25=%20bookmark.bookmark_time%20%25%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-bookmark-del%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%3C/div%3E%0A%20%20%20%20%3Cdiv%20class=%22read-no-bookmark%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-h-center%20%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%20read-h-center%22%3E%E9%98%85%E8%AF%BB%E6%97%B6%E7%82%B9%E5%87%BB%E5%8F%B3%E4%B8%8A%E8%A7%92%E7%9A%84%E4%B9%A6%E7%AD%BE%E5%8D%B3%E5%8F%AF%E6%B7%BB%E5%8A%A0%3C/span%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'note': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-has-note%22%20id=%22reader_note_panel%22%3E%0A%20%20%20%20%20%20%20%20%3C%25%20_.each(obj.chapter_list,%20function(chapt)%7B%20%20%20%25%3E%0A%20%20%20%20%20%20%20%20%3C%25%20if(!_.isEmpty(chapt.note_list))%7B%20%25%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-one-chapter-notes%22%20data-chapterid=%22%3C%25=%20chapt.chapter_id%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-chapter%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-note-chapter-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapt.chapter_name%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20read-note-chapter-count%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapt.note_count%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20_.each(chapt.note_list,%20function(note)%7B%20%20%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note%22%20data-noteid=%22%3C%25=%20note.note_id%20%25%3E%22%20data-percent=%22%3C%25=%20note.note_page%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-left%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-original-text%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20note.original%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-text%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20note.note_text%20%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cf%20read-note-time%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-note-or-underline%20read-note-%3C%25=%20!note.note_text%20?%200%20:%201%20%20%25%3E%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=(parseFloat(note.note_page)*100).toFixed(2)+%20%22%25%22%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-time%22%3E%3C%25=%20obj.nowDate%20==%20note.note_time.substr(0,%2010)%20?%20note.note_time.substring(11)%20:%20note.note_time.substr(0,%2010)%25%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C%25%20%7D;%20%25%3E%0A%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%3C/div%3E%0A%20%20%20%20%3Cdiv%20class=%22read-no-note%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-h-center%20%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%20read-h-center%22%3E%E9%98%85%E8%AF%BB%E6%97%B6%E9%95%BF%E6%8C%89%E6%96%87%E5%AD%97%E5%8F%AF%E6%B7%BB%E5%8A%A0%E7%AC%94%E8%AE%B0%3C/span%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'searchResult': decodeURI('%0A%20%20%20%20%3Cul%3E%0A%20%20%20%20%20%20%20%20%3C%25%20_.each(obj.search_list,%20function(res)%7B%20%20%20%25%3E%0A%20%20%20%20%20%20%20%20%3Cli%20class=%22read-cf%22%20data-page=%22%3C%25=%20res.search_page%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-title%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20res.chapter_name%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-search-font%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20res.search_text%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20read-search-seat%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20(parseFloat(res.search_page)*100).toFixed(4)%20+%20%22%25%22%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/li%3E%0A%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%3C/ul%3E%0A'),
    'picture': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-bigimg-panel%20read-hide%22%20id=%22picture_panel%22%3E%0A%20%20%20%20%20%20%20%20%3Cheader%20class=%22read-header%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-back-btn%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%3E%E8%BF%94%E5%9B%9E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-h-center%22%3E%E6%9F%A5%E7%9C%8B%E5%9B%BE%E7%89%87%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20class=%22read-a-btn%20read-rotate-btn%22%3E%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20class=%22read-rt%20read-a-btn%20read-save-btn%22%3E%E4%BF%9D%E5%AD%98%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/header%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-content%22%20id=%22big_img_view%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-viewimg-content%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-prev%22%3E%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-next%22%3E%3C/a%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'video': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-bigsize-video-wrap%22%20style=%22display:%20none;%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header-bar%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-container%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-back%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-back-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-back-des%22%3E%E8%BF%94%E5%9B%9E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cp%20class=%22read-video-title%22%3E%E8%82%96%E7%94%B3%E5%85%8B%E7%9A%84%E6%95%91%E8%B5%8E%3C/p%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-video-container%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cvideo%20class=%22read-bigsize-video%22%3E%E6%82%A8%E7%9A%84%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%8D%E6%94%AF%E6%8C%81%20video%20%E6%A0%87%E7%AD%BE%E3%80%82%3C/video%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-video-controls-container%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-video-controls%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-video-play-btn%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-video-currenttime%22%3E00:00%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-progress-bar%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-loadedprogress-bar%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-video-totaltime%22%3E00:00%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-volume-icon%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-volume-bar%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-loadedvolume-bar%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-loadedvolume-point%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-addvolume-icon%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-full-screen%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-pause-mask%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-play-icon%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-waiting-mask%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-play-icon%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A')
  };
  return output = {
    getTempl: function (type) {
      return templSets[type];
    }
  };
}(js_src_global, js_libs_zeptodev);
js_src_pc_copyrightPc = function (window, Tool, radioGroup, Dialog, $, Msg) {
  var Copyright = function (options) {
    var defaults = {
      $domObj: null,
      $readerObj: null,
      isMobile: true,
      /**
       * 版权保护配置
       * {
       *      'status'            是否开启版权保护,
       *      'copy_long'         {Number}  可复制字数
       *      'copy_times'        {Number}  可复制次数
       *      'print_flg'         {Boolean} 打印权限,ps: true可以打印
       *      'download_flg'      {Boolean} 下载权限 
       *      'screenshot_flg'    {Boolean} 截屏权限
       *      'watermark' {       独立水印
       *              'status'    是否水印,
       *              'imgUrl'    水印图片地址,
       *              'opacity'   透明度
       *          }
       * }
       */
      coprData: null,
      black_time: 30000,
      // 第一次黑屏30s,第二次60s,第三次120s，第四次退出reader
      black_timeMax: 120000,
      // 超出120s退出reader
      black_timeNow: 0,
      // 记录本次黑屏时间
      api: null
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  Copyright.prototype._init = function () {
    var optsObj = this.opts;
    //          var that = window.ReaderCopyRight;
    this._setLayout();
    this.getCoprParam(function () {
      window.ReaderCopyRight.run();
    }, 'first');
  };
  /**
   * 设置面板. <br/>
   * 
   */
  Copyright.prototype._setLayout = function () {
    var optsObj = this.opts;
    var templHtml = '<div class="read-comm-panel read-copyright-watermark">' + '<div class="read-watermark"></div>' + '<div class="read-mask"></div>' + '<div class="read-phoneblack"><div class="read-countdown"></div></div>' + '</div>';
    // 转化 zepto 对象;
    optsObj.$domObj = $(templHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
    optsObj.$domObj.find('.read-mask').on('click', function () {
      $(this).css('display', 'none');
    });
  };
  /**
   * 获取版权保护参数(独立水印/打印/截屏/下载/复制的权限参数，及复制字数次数). <br/>
   * 
   * @param {Function} cb     回调函数
   * @param {String}   state  是否是第一次调用,'fisrt'第一次调用,'nofisrt'非第一调用
   */
  Copyright.prototype.getCoprParam = function (cb, state) {
    var optsObj = this.opts;
    //          var that = window.ReaderCopyRight;
    var first = state || 'nofirst';
    optsObj.api.get_copyright({ img_type: 'base64' }, function (data) {
      data.watermark.imgUrl = 'data:image/png;base64,' + data.watermark.imgUrl;
      optsObj.coprData = data;
      window.ReaderCopyRight._saveCoprParam();
      cb();
    }, function (data) {
      if (first === 'first') {
        optsObj.$domObj.trigger('Copyright:getCoprParam');
      } else {
        cb();
      }
    });
  };
  /**
   * 版权保护，每次操作时向后台提交数据 <br/>
   * 
   * @param {String} operate_type  'copy','print','download_start','download_end','screenshot'
   * @param {Number} operate_val      a. 复制字数; b. 1:true, c. 0:false;
   */
  Copyright.prototype.setCoprParam = function (operate_type, operate_val) {
    var optsObj = window.ReaderCopyRight.opts;
    //          var that = window.ReaderCopyRight;
    var coprData = optsObj.coprData;
    if (!coprData.status) {
      return false;
    }
    optsObj.api.set_copyright({
      operate_type: operate_type,
      operate_val: operate_val
    }, function () {
      console.log('[copyright.js] ->setCoprParam 成功:');
    }, function (data) {
      if (operate_type === 'copy' && operate_val) {
        if (coprData.copy_long !== -1) {
          coprData.copy_long -= operate_val;
        }
        if (coprData.copy_times !== -1) {
          coprData.copy_times -= 1;
        }
        window.ReaderCopyRight._saveCoprParam();
      }
      console.log('[copyright.js] ->setCoprParam 出错:' + data);
    });
  };
  /**
   * 根据版权保护参数设置执行版权保护. <br/>
   * 
   */
  Copyright.prototype.run = function () {
    var optsObj = window.ReaderCopyRight.opts;
    window.ReaderCopyRight._setWatermark();
    if (optsObj.coprData.status) {
      window.ReaderCopyRight._intercept();
      window.ReaderCopyRight._interfaceFun();
    }
  };
  /**
   * 保存版权保护参数. <br/>
   * 
   */
  Copyright.prototype._saveCoprParam = function () {
    var optsObj = window.ReaderCopyRight.opts;
    optsObj.$domObj.trigger('Copyright:saveCoprParam', optsObj.coprData);
  };
  /**
   * 设置独立水印图片显示. <br/>
   * 
   */
  Copyright.prototype._setWatermark = function () {
    var optsObj = window.ReaderCopyRight.opts;
    var watermark = optsObj.coprData.watermark;
    if (watermark.status) {
      var waterMarkObj = optsObj.$domObj.find('.read-watermark');
      waterMarkObj.css('background-image', 'url(' + watermark.imgUrl + ')');
      waterMarkObj.css('opacity', watermark.opacity / 100);
      waterMarkObj.css('display', 'block');
    }
  };
  /**
   * 拦截鼠标，快捷键和touch事件. <br/>
   *
   */
  Copyright.prototype._intercept = function () {
    var optsObj = window.ReaderCopyRight.opts;
    //          var that = window.ReaderCopyRight;
    //禁止鼠标右键
    optsObj.$readerObj[0].oncontextmenu = function () {
      return window.ReaderCopyRight._pressRbutton();
    };
    //禁止快捷键复制,打印,截屏
    document.onkeydown = function () {
      if (event.ctrlKey && window.event.keyCode == 67) {
        return window.ReaderCopyRight._pressCtrlC();
      }
      if (event.ctrlKey && window.event.keyCode == 80) {
        return window.ReaderCopyRight._pressCtrlP();
      }
      if (event.ctrlKey && (event.altKey || window.event.keyCode == 18)) {
        return window.ReaderCopyRight._pressCtrlAlt();
      }
    };
    if (!optsObj.coprData.print_flg) {
      // 通过鼠标onblur事件判断页面是否在第一焦点 
      window.onblur = function () {
        window.ReaderCopyRight._setMask('worked');
      };
    }
    //手机端禁止文本选中
    if (optsObj.isMobile) {
      optsObj.$readerObj.css({
        '-webkit-user-select': 'none',
        '-ms-user-select': 'none'
      });
    }
  };
  /**
   * 对应小精灵接口和cordova接口. <br/>
   */
  Copyright.prototype._interfaceFun = function () {
    var coprData = window.ReaderCopyRight.opts.coprData;
    //          var that = window.ReaderCopyRight;
    /*CtrlC **/
    if (typeof gli_capture_cc != 'undefined' && typeof gli_capture_cc == 'function') {
      var pressCtrlC = Tool.createFunName(window.ReaderCopyRight._pressCtrlC, 'pressCtrlC');
      gli_capture_cc(pressCtrlC);
    }
    /*CtrlP **/
    if (typeof gli_capture_cp != 'undefined' && typeof gli_capture_cp == 'function') {
      var pressCtrlP = Tool.createFunName(window.ReaderCopyRight._pressCtrlP, 'pressCtrlP');
      gli_capture_cp(pressCtrlP);
    }
    /*Ctrl + Alt **/
    if (typeof gli_capture_ctrl_alt != 'undefined' && typeof gli_capture_ctrl_alt == 'function') {
      var pressCtrlAlt = Tool.createFunName(window.ReaderCopyRight._pressCtrlAlt, 'pressCtrlAlt');
      gli_capture_ctrl_alt(pressCtrlAlt);
    }
    /*右键 **/
    if (typeof gli_capture_rbutton != 'undefined' && typeof gli_capture_rbutton == 'function') {
      var pressRbutton = Tool.createFunName(window.ReaderCopyRight._pressRbutton, 'pressRbutton');
      gli_capture_rbutton(pressRbutton);
    }
    /*窗口变化 **/
    if (typeof gli_capture_foreground != 'undefined' && typeof gli_capture_foreground == 'function') {
      var loseFocus = Tool.createFunName(window.ReaderCopyRight._loseFocus, 'loseFocus');
      gli_capture_foreground(loseFocus);
    }
    //cordova接口:每100ms调用cordova手机相片数量统计接口，根据数量变化进行黑屏处理
    if (typeof gli_photo_change != 'undefined' && typeof gli_photo_change == 'function') {
      if (!coprData.screenshot_flg) {
        gli_photo_change(function () {
          window.ReaderCopyRight._phoneblack();
        }, true);
      }
    }
    // 小精灵端监控剪切板发生变化调用此事件
    if (typeof gli_capture_clipboard_change != 'undefined' && typeof gli_capture_clipboard_change == 'function') {
      if (!coprData.screenshot_flg) {
        function clipboardChangeCb(data) {
          window.ReaderCopyRight._clipboardChange(data);
        }
        var clipboardChange = Tool.createFunName(clipboardChangeCb, 'clipboardChange');
        gli_capture_clipboard_change(clipboardChange);
      }
    }
  };
  /**
   * 小精灵接口回调：CtrlC. <br/>
   */
  Copyright.prototype._pressCtrlC = function () {
    return false;
  };
  /**
   * 小精灵接口回调：打印. <br/>
   */
  Copyright.prototype._pressCtrlP = function () {
    var coprData = window.ReaderCopyRight.opts.coprData;
    if (coprData.print_flg) {
      //小精灵打印
      if (typeof gli_web_print != 'undefined' && typeof gli_web_print == 'function') {
        gli_web_print();
      }
      window.ReaderCopyRight.setCoprParam('print', 1);
      return true;
    } else {
      window.ReaderCopyRight.setCoprParam('print', 0);
      return false;
    }
  };
  /**
   * 小精灵接口回调：CtrlAlt. <br/>
   */
  Copyright.prototype._pressCtrlAlt = function () {
    //          var coprData = window.ReaderCopyRight.opts.coprData;
    var coprData = window.ReaderCopyRight.opts.coprData;
    if (coprData.screenshot_flg) {
      return true;
    } else {
      window.ReaderCopyRight._setMask('worked');
      return false;
    }
  };
  /**
   * 小精灵接口回调：右键. <br/>
   */
  Copyright.prototype._pressRbutton = function () {
    return false;
  };
  /**
   * 小精灵接口回调：窗口变化. <br/>
   * 
   * @param {Boolean} flag
   */
  Copyright.prototype._loseFocus = function (flag) {
    var coprData = window.ReaderCopyRight.opts.coprData;
    if (!coprData.print_flg && !flag) {
      window.ReaderCopyRight._setMask('worked');
    }
  };
  /**
   * 设置版权保护蒙层. <br/>
   * 
   * @param {String} action 'worked' 显示蒙层
   */
  Copyright.prototype._setMask = function (action) {
    var optsObj = window.ReaderCopyRight.opts;
    var mask = optsObj.$domObj.find('.mask');
    if (action === 'worked') {
      mask.css('display', 'block');
    } else {
      mask.css('display', 'none');
    }
  };
  /**
   * 黑屏事件. <br/>
   */
  Copyright.prototype._phoneblack = function () {
    var optsObj = window.ReaderCopyRight.opts;
    window.ReaderCopyRight.setCoprParam('screenshot', 1);
    var time_now = new Date().getTime();
    var time_old = parseInt(localStorage.getItem('timeRecord')) || time_now;
    localStorage.setItem('timeRecord', time_now);
    localStorage.setItem('black_timeNow', localStorage.getItem('black_timeNow') || optsObj.black_time);
    //超过10分钟，恢复黑屏时间
    if (time_now - time_old > 10 * 60 * 1000) {
      localStorage.setItem('black_timeNow', optsObj.black_time);
    }
    var count = parseInt(localStorage.getItem('black_timeNow'));
    if (count > optsObj.black_timeMax) {
      //退出reader
      optsObj.$domObj.trigger('Copyright:exitReaderCb');
      return false;
    }
    var phoneblackObj = optsObj.$domObj.find('.read-phoneblack');
    var countdownObj = optsObj.$domObj.find('.read-countdown');
    phoneblackObj.css('display', 'block');
    optsObj.black_timeNow = count;
    localStorage.setItem('black_timeNow', parseInt(count) * 2);
    // 黑屏恢复倒计时
    window.ReaderCopyRight._countDown();
    setTimeout(function () {
      phoneblackObj.css('display', 'none');
    }, count);
  };
  /**
   * 黑屏恢复倒计时显示. <br/>
   */
  Copyright.prototype._countDown = function () {
    //          var that = window.ReaderCopyRight;
    var optsObj = window.ReaderCopyRight.opts;
    var timeRecord = localStorage.getItem('timeRecord');
    var n = (parseInt(timeRecord) + optsObj.black_timeNow - new Date().getTime()) / 1000;
    var countdownObj = optsObj.$domObj.find('.read-countdown');
    countdownObj.html('您有截屏操作\uFF0C我们正在对您进行黑屏处理\uFF0C还有' + n.toFixed(0) + '秒恢复正常\uFF01');
    if (n >= 0) {
      setTimeout(function () {
        window.ReaderCopyRight._countDown.call(window.ReaderCopyRight);
      }, 1000);
    } else {
    }
  };
  /**
   * 小精灵监听剪辑版为图片时调用. <br/>
   * 
   * @param {String} data 返回图片判断值:'bitmap'
   */
  Copyright.prototype._clipboardChange = function (data) {
    //          var that = window.ReaderCopyRight;
    var type = data;
    //如果小精灵返回的数据类型data为图片则清空剪切板内容
    if (type === 'bitmap') {
      window.ReaderCopyRight._phoneblack();
      if (typeof gli_set_clipboard != 'undefined' && typeof gli_set_clipboard == 'function') {
        gli_set_clipboard({
          type: 'text',
          text: ''
        });
        window.ReaderCopyRight.setCoprParam('screenshot', 0);
      }
    }
  };
  /**
   * 自定义事件. <br/>
   * 
   * @param eventName {String}   事件名称, 'Copyright:saveCoprParam', 'Copyright:getCoprParam',
   *              'Copyright:exitReaderCb'
   * @param cb        {Function} 回调事件
   * 
   */
  Copyright.prototype.on = function (eventName, cb) {
    var optsObj = window.ReaderCopyRight.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  return Copyright;
}(js_src_global, js_src_tool, js_src_widget_plugRadioGroup, js_src_widget_plugDialog, js_libs_zeptodev, js_src_message_zh);
js_src_pc_bookmarkPc = function (window, $, tool, move, dialog, Msg) {
  var _ = window._;
  var Bookmark = function (options) {
    console.log('[Bookmark] -> 构造函数!');
    var defaults = {
      //          wrapObj: null,
      tmplHtml: '',
      isMobile: true,
      data: {
        'chapter_list': null,
        'bookmark_list': null,
        'time_stamp': null
      }
    };
    this.opts = $.extend(false, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化 <br>.
   */
  Bookmark.prototype._init = function () {
    var optsObj = this.opts;
    optsObj.templObj = _.template(optsObj.tmplHtml);
    this.dialog = new dialog({
      $wrapDomObj: $('#reader_main_panel'),
      isMobile: false,
      clientType: optsObj.clientType,
      okBtn: {
        txt: '确定',
        cssClass: '',
        func: function () {
        }
      },
      cancelBtn: {
        txt: '离开',
        cssClass: '',
        func: function () {
        }
      }
    });  //      this.renderLayout(optsObj.data);
         //      this._bindEvent();
  };
  /**
   * 事件委托 绑定事件.<br/>
   * 
   */
  Bookmark.prototype._bindEvent = function () {
  };
  /**
   * 渲染书签页面
   * 
   * @param {Object} data 书签数据对象
   */
  Bookmark.prototype.renderLayout = function (data) {
    var that = this;
    var optsObj = this.opts;
    // optsObj.data = data;
    optsObj.bookmarkBody = $('#cbn_body .read-bookmark-body');
    var tmp = tool.convertData(data.bookmark_list, 'bookmark_list');
    var bookmarkConvert = {
      'chapter_list': tmp,
      'bookmark_list': data.bookmark_list,
      'time_stamp': data.time_stamp || ''
    };
    optsObj.data = bookmarkConvert;
    if (tmp.length > 0) {
      var tempHtml = optsObj.templObj(bookmarkConvert);
      optsObj.bookmarkBody.html(tempHtml);
      optsObj.bookmarkBody.find('.read-has-bookmark').show();
      optsObj.bookmarkBody.find('.read-no-bookmark').hide();
    } else {
      optsObj.bookmarkBody.find('.read-has-bookmark').html('').hide();
      optsObj.bookmarkBody.find('.read-no-bookmark').fadeIn();
    }  //      that._bindEvent();
  };
  /**
   * 新增书签信息. <br/>
   * 
   * @param {Object} bookmarkData 书签对象
   * @param {Object} bookmarkData.text 书签位置文本
   * @param {Object} bookmarkData.pageSite 书签位置
   * @param {Object} bookmarkData.chapterId 书签位置的章节id
   * @param {Object} bookmarkData.chapterName 书签位置的章节名
   * 
   */
  Bookmark.prototype.addBookmark = function (bookmarkData) {
    var that = this;
    var optsObj = this.opts;
    console.log('[Bookmark] -> addBookmark!');
    // 添加书签的章节是否有书签
    var hasBookmark = true;
    var bookmark = {
      bookmark_id: tool.getRandomKey(),
      bookmark_text: bookmarkData.text.slice(0, 100),
      bookmark_time: tool.getNowFormatDate(),
      bookmark_page: bookmarkData.pageSite,
      chapter_name: bookmarkData.chapterName,
      chapter_id: bookmarkData.chapterId,
      'oparate_type': '1',
      // 1：增; 3：删
      's_id': ''  // s_id为服务器数据库的id,离线新增书签时设置为 空字符串;  
    };
    optsObj.markDomObj.attr({
      'data-bookmarkid': bookmark.bookmark_id,
      'data-chapterid': bookmarkData.chapterId
    }).addClass('read-active');
    var updateObj = $.extend(true, {}, bookmark);
    // 新增书签发送给服务器
    optsObj.api.setBookmark(updateObj, function (data) {
      console.log('[Bookmark.prototype.addBookmark] --> 增加书签-成功!' + data);
      innerAddBookmark();
      var addMark = {
        'oparate_type': '1',
        's_id': data.s_id,
        'bookmark_id': data.bookmark_id,
        'time_stamp': data.time_stamp
      };
      that._updLocalData(addMark);
    }, function (data) {
      if (!optsObj.isClient) {
        that.dialog.setMsg(Msg.bookMarkFail);
        that.dialog.open();
        optsObj.markDomObj.removeClass('read-active');
      } else {
        innerAddBookmark();
      }
    });
    function innerAddBookmark() {
      optsObj.data.bookmark_list.push(bookmark);
      var tempBookmark = {
        'time_stamp': optsObj.data.time_stamp,
        'bookmark_list': optsObj.data.bookmark_list
      };
      // 然后保存本地 
      optsObj.saveFile(optsObj.filePath, JSON.stringify(tempBookmark));
      // 重新渲染书签显示
      that.renderLayout(optsObj.data);
    }
  };
  /**
   * 删除 书签信息. <br/>
   * 
   * @param {Object} bookmarkData 书签对象
   * @param {Object} bookmarkData.bookmarkid 书签id
   * @param {Object} bookmarkData.chapterId 书签位置的章节id
   * 
   */
  Bookmark.prototype.delBookmark = function (bookmarkData) {
    var that = this;
    var optsObj = this.opts;
    console.log('[Bookmark] -> delBookmark!');
    if (_.isEmpty(bookmarkData)) {
      bookmarkData = {
        'bookmarkid': optsObj.markDomObj.attr('data-bookmarkid'),
        'chapterId': optsObj.markDomObj.attr('data-chapterid')
      };
    }
    var bookmarkid = bookmarkData.bookmarkid;
    var list = optsObj.data.bookmark_list;
    var markItem = null;
    for (var i = 0, len = list.length; i < len; i++) {
      markItem = list[i];
      if (markItem.bookmark_id == bookmarkData.bookmarkid) {
        markItem.oparate_type = '3';
        break;
      }
    }
    var tempBookmark = {
      'time_stamp': optsObj.data.time_stamp,
      'bookmark_list': optsObj.data.bookmark_list
    };
    // 保存本地
    optsObj.saveFile(optsObj.filePath, JSON.stringify(tempBookmark));
    if (optsObj.markDomObj.attr('data-bookmarkid') == bookmarkid) {
      optsObj.markDomObj.removeClass('read-active');
    }
    // 重新渲染书签显示
    that.renderLayout(optsObj.data);
    // 删除 与 服务器交互
    if (!!markItem.s_id) {
      // 同步的数据才需要向服务发请求.
      optsObj.api.delBookmark({ 'bookmark_id': bookmarkid }, function (data) {
        var delMark = {
          'oparate_type': '3',
          's_id': data.s_id,
          'bookmark_id': data.bookmark_id,
          'time_stamp': data.time_stamp
        };
        that._updLocalData(delMark);
      }, function (data) {
        if (!optsObj.isClient) {
          that.dialog.setMsg(Msg.bookMarkDelFail);
          that.dialog.open();
          markItem.oparate_type = '0';
          if (optsObj.markDomObj.attr('data-bookmarkid') == bookmarkid) {
            optsObj.markDomObj.addClass('read-active');
          }
          // 重新渲染书签显示
          that.renderLayout(optsObj.data);
        }
      });
    }
  };
  /**
   * 翻页判断当前页是否有书签
   * 
   */
  Bookmark.prototype.isShowBookmark = function (pageData) {
    var that = this;
    var optsObj = that.opts;
    // 判断当前显示也是否有书签 
    var thisHasBookmark = true;
    var chapterList = [];
    if (!_.isEmpty(optsObj.data)) {
      chapterList = optsObj.data.chapter_list;
    }
    var prevPercent = pageData.prevPercent;
    var nowPercent = pageData.nowPercent;
    var chapterId = pageData.chaptId;
    for (var i = 0; i < chapterList.length; i++) {
      if (chapterId == chapterList[i].chapter_id) {
        for (var j = 0; j < chapterList[i].bookmark_list.length; j++) {
          if (chapterList[i].bookmark_list[j].bookmark_page <= nowPercent && chapterList[i].bookmark_list[j].bookmark_page > prevPercent) {
            thisHasBookmark = false;
            that.showMarkIcon({
              'chapter_id': chapterList[i].chapter_id,
              'bookmark_id': chapterList[i].bookmark_list[j].bookmark_id
            }, 'open');
            break;
          }
        }
        break;
      }
    }
    // 没有书签 要显示
    if (thisHasBookmark) {
      that.showMarkIcon({
        'chapter_id': '',
        'bookmark_id': ''
      }, 'close');
    }
  };
  /**
   * 增加 书签信息. <br/>
   * 
   * @param {Object} bookmarkData 书签对象
   * 
   */
  Bookmark.prototype.updateBookmarks = function (bookmarkData) {
    var that = this;
    var optsObj = this.opts;
    console.log('[Bookmark] -> updateBookmarks!');
    if (optsObj.markDomObj.css('display') == 'none') {
      that.addBookmark(bookmarkData);
    } else {
      that.delBookmark(bookmarkData);
    }
  };
  /**
   * 获取 书签信息. <br/>
   * 
   */
  Bookmark.prototype.getBookmarks = function () {
    console.log('[Bookmark] -> getBookmarks! ');
    var optsObj = this.opts;
    return optsObj.data;
  };
  /**
   * 销毁 书签信息. <br/>
   * 
   */
  Bookmark.prototype.destoryBookmarks = function () {
    console.log('[Bookmark] -> destoryBookmarks!');
  };
  /**
   * 初始化 书签信息. <br/>
   * 
   */
  Bookmark.prototype._initBookmarks = function () {
    console.log('[Bookmark] -> _initBookmarks!');
  };
  /**
   * 在主面板显示书签标记并赋值data-bookmarkid. <br/>
   * 
   * @param {String} bookmark_id 书签id
   * @param {String} status 显示状态 open显示 close隐藏
   * 
   */
  Bookmark.prototype.showMarkIcon = function (markObj, status) {
    if (status == 'open') {
      this.opts.markDomObj.attr({
        'data-bookmarkid': markObj.bookmark_id,
        'data-chapterid': markObj.chapter_id
      }).addClass('read-active');
    } else {
      this.opts.markDomObj.attr({
        'data-bookmarkid': '',
        'data-chapterid': ''
      }).removeClass('read-active');
    }
  };
  /**
   * 返回 书签DOM对象(jq). <br/>
   * 
   * 
   */
  Bookmark.prototype.getMarkDom = function () {
    return this.opts.markDomObj;
  };
  /**
   * 当用户执行 增加/删除 操作,向后台发送请求,根据返回值 更新本地数据.<br/>
   * 
   * @param {Object} bookmark
   *              bookmark.s_id
   *              bookmark.oparate_type
   *              bookmark.bookmark_id
   *              bookmark.time_stamp
   * 
   * @author gli-gonglong-20161028
   * 
   */
  Bookmark.prototype._updLocalData = function (bookmark) {
    var that = this;
    var optsObj = this.opts;
    var list = optsObj.data.bookmark_list;
    var item = null;
    for (var i = 0, len = list.length; i < len; i++) {
      item = list[i];
      if (item.bookmark_id == bookmark.bookmark_id) {
        if (bookmark.oparate_type == '1') {
          // 增
          item.s_id = bookmark.s_id;
          item.oparate_type = '0';
        } else if (bookmark.oparate_type == '3') {
          // 删
          list.splice(i, 1);
        }
        optsObj.data.time_stamp = bookmark.time_stamp;
        break;
      }
    }
    var tempBookmark = {
      'time_stamp': optsObj.data.time_stamp,
      'bookmark_list': optsObj.data.bookmark_list
    };
    // 然后保存本地 
    optsObj.saveFile(optsObj.filePath, JSON.stringify(tempBookmark));
  };
  /**
   * 批量更新笔记.<br/>
   * 
   */
  Bookmark.prototype.batchUpdateBookmark = function (markInfo, successCb, errorCb) {
    var optsObj = this.opts;
    optsObj.api.batchUpdateBookmark(markInfo, function (data) {
      if (typeof successCb == 'function') {
        successCb(data);
      }
    }, function (data) {
      if (typeof errorCb == 'function') {
        errorCb(data);
      }
    });
  };
  return Bookmark;
}(js_src_global, js_libs_zeptodev, js_src_tool, move, js_src_widget_plugDialog, js_src_message_zh);
js_src_pc_panelSelectPc = function (window, Tool, radioGroup, Dialog, $, Msg) {
  var Select = function (options) {
    var defaults = {
      $domObj: null,
      $readerObj: null,
      $contentObj: null,
      // 主面板内容容器
      $menuWrap: null,
      // 复制等菜单根容器
      isMobile: false,
      pageColumn: 1,
      touchState: 0,
      // 0,无操作; 1.touchstart; 2.长按状态; 3.取消长按
      isShowMenu: 0,
      // 是否显示菜单
      ismove: 1,
      // 是否可以移动上标和下标
      posMenu: '',
      // 选择文本时弹出的上标下标菜单标识,'upper'上标,'lower'下标
      pos: {
        // touch/mouse定位
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
      },
      useNote: true,
      useCorrect: true,
      menu: {
        'list': [
          {
            'text': '划线',
            'value': 'underline'
          },
          {
            'text': '笔记',
            'value': 'note'
          },
          {
            'text': '复制',
            'value': 'copy'
          },
          {
            'text': '纠错',
            'value': 'correct'
          }
        ],
        'value': 'copy'
      },
      coprObj: null
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  Select.prototype._init = function () {
    var optsObj = this.opts;
    this._setLayout();
    this._bindEvent();
    optsObj.$readerObj.css({
      '-webkit-touch-callout': 'none',
      '-webkit-user-select': 'none',
      '-khtml-user-select': 'none',
      '-moz-user-select': 'none',
      '-ms-user-select': 'none',
      'user-select': 'none'
    });
  };
  /**
   * 设置面板. <br/>
   * 
   */
  Select.prototype._setLayout = function () {
    var optsObj = this.opts;
    var templHtml = '<div class="read-comm-panel read-content-select">' + '<div class="read-radiogroup-menu"></div>' + '<div class="read-pos-upper"></div>' + '<div class="read-pos-lower"></div>';
    '</div>';
    // 转化 zepto 对象;
    optsObj.$domObj = $(templHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
    optsObj.$contentObj = optsObj.$readerObj.find('.read-selector-main .read-content');
    optsObj.$allContentObj = optsObj.$contentObj;
    optsObj.$menuWrap = optsObj.$domObj.find('.read-radiogroup-menu');
    // 菜单
    var menuList = optsObj.menu.list;
    for (var i = 0, len = menuList.length; i < len; i++) {
      if (!optsObj.useNote) {
        if (menuList[i].value == 'underline' || menuList[i].value == 'note') {
          menuList[i].active = 'false';
          menuList[i].bg = 'read-bg-gray';
        }
      }
      if (!optsObj.useCorrect) {
        if (menuList[i].value == 'correct') {
          menuList[i].active = 'false';
          menuList[i].bg = 'read-bg-gray';
        }
      }
    }
    this.$menuObj = new radioGroup({
      '$domObj': optsObj.$menuWrap,
      'data': menuList,
      'value': optsObj.menu.value,
      'isMobile': optsObj.isMobile
    });
    optsObj.$menuWrap.fadeOut(1);
    // 弹出框
    this.DialogObj = new Dialog({
      '$wrapDomObj': optsObj.$readerObj,
      'isMobile': optsObj.isMobile,
      'clientType': optsObj.clientType
    });
    // 选择文本时弹出的上标下标按钮
    this.upperPos = optsObj.$domObj.find('.read-pos-upper');
    this.lowerPos = optsObj.$domObj.find('.read-pos-lower');
    this.posW = this.upperPos.width();
    this.posH = this.upperPos.height();
    this.upperPos.fadeOut(10);
    this.lowerPos.fadeOut(10);
  };
  /**
   * 获取event坐标参数. <br/>
   * 
   * @param {Object} event
   * @return {Object} event
   */
  Select.prototype._getEvent = function (event) {
    var optsObj = this.opts;
    if (!event) {
      return false;
    }
    if (!optsObj.isMobile) {
      event = event || window.event;
    } else if (event.touches !== undefined && typeof event.touches === 'object' && event.touches.length > 0) {
      event = event.touches[0];
    } else if (event.targetTouches.touches !== undefined && typeof event.targetTouches.touches === 'object' && event.targetTouches.touches.length > 0) {
      event = event.targetTouches.touches[0];
    } else if (event.changedTouches !== undefined && typeof event.changedTouches === 'object' && event.changedTouches.length > 0) {
      event = event.changedTouches[0];
    } else {
      event = undefined;
    }
    return event;
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  Select.prototype._bindEvent = function () {
    var optsObj = this.opts;
    var that = this;
    var $contentObj = optsObj.$readerObj.find('.read-selector-main .read-body .read-chapter-content');
    // 点击上标时隐藏复制划线等组合菜单
    this.upperPos.on('mousedown', function (event) {
      optsObj.$menuWrap.fadeOut(1);
      optsObj.posMenu = 'upper';
    });
    // 点击下标时隐藏复制划线等组合菜单
    this.lowerPos.on('mousedown', function (event) {
      optsObj.$menuWrap.fadeOut(1);
      optsObj.posMenu = 'lower';
    });
    // 拖动上标
    this.upperPos.on('mousemove', function (event) {
    });
    // 拖动下标
    this.lowerPos.on('mousemove', function (event) {
    });
    // 上标touchend
    this.upperPos.on('mouseup', function (event) {
      optsObj.posMenu = '';
      if (optsObj.touchState === 2) {
        that._menuShow();
      }
      if (optsObj.touchState === 1) {
        optsObj.touchState = 0;
      }
    });
    // 下标touchend
    this.lowerPos.on('mouseup', function (event) {
      optsObj.posMenu = '';
      if (optsObj.touchState === 2) {
        that._menuShow();
      }
      if (optsObj.touchState === 1) {
        optsObj.touchState = 0;
      }
    });
    // 点击文本, 长按通过此事件响应时间进行判断
    $contentObj.on('mousedown', function (event) {
      var touchObj = that._getEvent(event);
      optsObj.pos.startX = touchObj.pageX;
      optsObj.pos.startY = touchObj.pageY;
      optsObj.pos.endX = touchObj.pageX;
      optsObj.pos.endY = touchObj.pageY;
      that._menuclose();
      that.upperPos.fadeOut(10);
      that.lowerPos.fadeOut(10);
      if (optsObj.touchState === 2) {
        optsObj.touchState = 3;
      } else {
        optsObj.touchState = 1;
      }
      setTimeout(function () {
        that._isLongTouch.call(that);
      }, 400);
    });
    // 在文本中滑动
    optsObj.$readerObj.find('.read-selector-main').on('mousemove', function (event) {
      var pos = optsObj.pos;
      var fontsize = optsObj.$contentObj.css('font-size');
      fontsize = parseFloat(fontsize);
      var touchObj = that._getEvent(event);
      if (optsObj.touchState === 2) {
        if (!optsObj.ismove) {
          return false;
        }
        var linehight = optsObj.$contentObj.css('line-height');
        linehight = parseFloat(linehight);
        if (optsObj.posMenu === 'upper') {
          // 拖动上标
          var startX = touchObj.pageX + that.posW / 2;
          var startY = touchObj.pageY + that.posH / 2;
          if (startY > pos.endY + (linehight - fontsize) / 2 || Math.abs(startY - pos.endY) < linehight / 2 && startX + fontsize / 8 > pos.endX) {
            startX = pos.endX;
            startY = pos.endY;
          }
          pos.startX = startX;
          pos.startY = startY;
        }
        if (optsObj.posMenu === 'lower') {
          // 拖动下标
          var endX = touchObj.pageX - that.posW / 2;
          var endY = touchObj.pageY - that.posH / 2;
          if (endY < pos.startY - (linehight - fontsize) / 2 || Math.abs(pos.startY - endY) < linehight / 2 && pos.startX - fontsize / 8 > endX) {
            endX = pos.startX;
            endY = pos.startY;
          }
          pos.endX = endX;
          pos.endY = endY;
        }
        that._selectElem(pos.startX, pos.startY, pos.endX, pos.endY);
      }
      if (optsObj.touchState === 3) {
        return false;
      }
      if (optsObj.touchState === 1 && (Math.abs(touchObj.pageX - pos.endX) > fontsize || Math.abs(touchObj.pageY - pos.endY) > fontsize)) {
        optsObj.touchState = 0;
      }
    });
    optsObj.$readerObj.find('.read-selector-main').on('mouseup', function (event) {
      optsObj.posMenu = '';
      if (optsObj.touchState === 2) {
        // 长按状态下,显示菜单
        that._menuShow();
      }
      if (optsObj.touchState === 1) {
        optsObj.touchState = 0;
      }
    });
    // 列举需要阻止冒泡的事件名
    var eventName = optsObj.isMobile ? 'tap' : 'click';
    var eventType = eventName + ' swipeDown swipeLeft swipeRight';
    // 防止事件击穿,不能添加删除书签等
    $contentObj.on(eventType, function (event) {
      if (optsObj.touchState === 2) {
        return false;
      }
      if (optsObj.touchState === 3) {
        optsObj.touchState = 0;
        return false;
      }
    });
    // 菜单按钮点击事件
    this.$menuObj.on('change:click', function (e, param) {
      var firstId = $contentObj.find('.read-font-select').first().attr('data-id');
      var lastId = $contentObj.find('.read-font-select').last().attr('data-id');
      var currInfo = that._getPosLen();
      var selectData = {
        'firstId': parseInt(firstId),
        'lastId': parseInt(lastId),
        'original': '',
        'isunderline': !optsObj.ismove,
        'posLen': currInfo.posLen,
        'currPage': currInfo.currPage
      };
      $contentObj.find('.read-font-select').each(function () {
        if ($(this).hasClass('reader-MathJax')) {
          selectData.original += $(this).find('script').html();
        } else {
          if ($(this).hasClass('read-special-tab')) {
            selectData.original += $(this).html();
          } else {
            selectData.original += $(this).text();
          }
        }
      });
      // 复制
      if (param.newValue === 'copy') {
        that._phoneCopy();
      }
      // 划线
      if (param.newValue === 'underline') {
        if (param.newText === '删除') {
          var noteid = $contentObj.find('.read-font-select').attr('data-noteid');
          optsObj.$domObj.trigger('Select:delUnderline', noteid);
        } else {
          optsObj.$domObj.trigger('Select:addUnderline', selectData);
        }
        optsObj.touchState = 0;
        that._menuclose();
        that.upperPos.fadeOut(10);
        that.lowerPos.fadeOut(10);
      }
      // 笔记
      if (param.newValue === 'note') {
        if (!!$contentObj.find('.read-font-select').attr('data-noteid')) {
          selectData.note_id = $contentObj.find('.read-font-select').attr('data-noteid');
        }
        optsObj.$domObj.trigger('Select:addNote', selectData);
        optsObj.touchState = 0;
        that._menuclose();
        that.upperPos.fadeOut(10);
        that.lowerPos.fadeOut(10);
      }
      // 纠错
      if (param.newValue === 'correct') {
        optsObj.$domObj.trigger('Select:correct', selectData);
        optsObj.touchState = 0;
        that._menuclose();
        that.upperPos.fadeOut(10);
        that.lowerPos.fadeOut(10);
      }
    });
    optsObj.$readerObj.on('mousedown', function (event) {
      var touchObj = that._getEvent(event);
      var offset = $contentObj.offset();
      var pagingWidth = optsObj.$readerObj.find('.read-selector-main .read-body .read-prev-paging').width();
      if (touchObj.pageX < offset.left + pagingWidth || touchObj.pageX > offset.left + offset.width - pagingWidth || touchObj.pageY < offset.top || touchObj.pageY > offset.top + offset.height) {
        that.close();
      }
    });
  };
  /**
   * 手机端复制文本. <br/>
   */
  Select.prototype._phoneCopy = function () {
    var optsObj = this.opts;
    var copyText = '';
    var len = 0;
    optsObj.$contentObj.find('.read-font-select').each(function () {
      copyText += $(this)[0].innerText;
      if (Tool.trim($(this)[0].innerText) !== '') {
        len += 1;
      }
    });
    this._gliCopy(copyText, len);
  };
  /**
   * 每次复制向后台读取剩余复制字数次数，并判断. <br/>
   * 
   * @param {String} txt  复制文本内容
   * @param {Number} len  复制文本长度
   */
  Select.prototype._gliCopy = function (txt, len) {
    var optsObj = this.opts;
    var that = this;
    var copyText = txt || '';
    var copyLength = len;
    //每次复制，重新向后台取数据
    optsObj.coprObj.getCoprParam(function () {
      var coprData = optsObj.coprObj.opts.coprData;
      var currLength = -1;
      var currTimes = -1;
      if (coprData.status) {
        currLength = coprData.copy_long;
        currTimes = coprData.copy_times;
      }
      if (currLength == -1 && currTimes == -1) {
        that._setCopyInfo(copyText, copyLength);
      } else {
        if (copyLength > 0 && copyLength <= currLength && currTimes > 0) {
          that._setCopyInfo(copyText, copyLength);
        } else {
          optsObj.coprObj.setCoprParam('copy', 0);
          that._copyDisabled(currTimes, currLength);
          copyText = '';
        }
      }
    });
  };
  /**
   * 支持手机端、小精灵端、和PC浏览器复制. <br/>
   * 
   * @param {String} txt 复制文本内容
   * @param {Number} len  复制文本长度
   */
  Select.prototype._setCopyInfo = function (txt, len) {
    var optsObj = this.opts;
    var that = this;
    var copyText = txt || '';
    var copyLength = len;
    try {
      if (typeof gli_set_clipboard != 'undefined' && typeof gli_set_clipboard == 'function') {
        if (copyText) {
          // 手机端和小精灵复制
          gli_set_clipboard({
            type: 'text',
            text: copyText
          });
        }
      }
      optsObj.coprObj.setCoprParam('copy', copyLength);
      that.DialogObj.setMsg('您复制了' + copyLength + '个字!');
      that.DialogObj.opts.okBtn.func = function (e) {
        var copyInput = $('<input id="copyInput"  value="' + copyText + '" />');
        document.getElementsByTagName('body')[0].appendChild(copyInput[0]);
        document.getElementById('copyInput').select();
        // PC端浏览器复制
        document.execCommand('copy');
        copyInput.remove();
        that._menuclose();
        that.upperPos.fadeOut(10);
        that.lowerPos.fadeOut(10);
      };
      that.DialogObj.open();
    } catch (e) {
      console.warn('[copyright.js] -->setCopyInfo 出错.');
    }
  };
  /**
   * 根据剩余复制字数和次数弹出对应的提示信息. <br/>
   * 
   * @param {Number} times 剩余复制次数
   * @param {Number} len   剩余复制字数
   */
  Select.prototype._copyDisabled = function (times, len) {
    if (times == 0) {
      this.DialogObj.setMsg(Msg.copyRunOut);
      this.DialogObj.opts.okBtn.func = function () {
      };
      this.DialogObj.open();
      return;
    }
    if (len == 0) {
      this.DialogObj.setMsg(Msg.copyRunOut);
      this.DialogObj.opts.okBtn.func = function () {
      };
      this.DialogObj.open();
    } else {
      this.DialogObj.setMsg(Msg.copyStill + len + '个字!');
      this.DialogObj.opts.okBtn.func = function () {
      };
      this.DialogObj.open();
    }
  };
  /**
   * 长按执行事件. <br/>
   */
  Select.prototype._isLongTouch = function () {
    var that = this;
    var optsObj = that.opts;
    var index = 0;
    optsObj.posMenu = '';
    if (optsObj.touchState === 1 || optsObj.touchState === 3) {
      optsObj.touchState = 2;
      // 如果一页有两列
      if (optsObj.pageColumn == 2) {
        var pageOneWidth = optsObj.$readerObj.find('.read-selector-main .read-content.read-page-2').offset().left;
        if (pageOneWidth < optsObj.pos.startX) {
          optsObj.$contentObj = optsObj.$readerObj.find('.read-selector-main .read-content.read-page-2');
        } else {
          optsObj.$contentObj = optsObj.$readerObj.find('.read-selector-main .read-content.read-page-1');
        }
      }
      var allElem = optsObj.$contentObj.find('.read-filterSpan');
      if (allElem.length === 0) {
        optsObj.touchState = 0;
        return false;
      }
      index = that._positionElem(optsObj.pos.startX, optsObj.pos.startY);
      // 上标坐标
      optsObj.pos.startX = allElem.eq(index).offset().left + allElem.eq(index).width() / 2;
      optsObj.pos.startY = allElem.eq(index).offset().top + allElem.eq(index).height() / 2;
      // 下标坐标
      optsObj.pos.endX = allElem.eq(index).offset().left + allElem.eq(index).width() / 2;
      optsObj.pos.endY = allElem.eq(index).offset().top + allElem.eq(index).height() / 2;
      var start = index;
      var end = index;
      if (allElem.eq(index).hasClass('read-gli-underline')) {
        // 不能移动上标和下标
        optsObj.ismove = 0;
        var noteId = allElem.eq(index).attr('data-noteid');
        var noteObj = optsObj.$allContentObj.find('[data-noteid="' + noteId + '"]');
        var start = noteObj.first().attr('data-id');
        var end = noteObj.last().attr('data-id');
        noteObj.addClass('read-font-select');
        optsObj.posMenu = 'upper';
        that._posMenuShow(start);
        optsObj.posMenu = 'lower';
        that._posMenuShow(end);
        this.$menuObj.setValue('underline', '删除');
      } else {
        optsObj.ismove = 1;
        $(allElem[index]).addClass('read-font-select');
        that._posMenuShow(allElem.eq(index).attr('data-id'));
      }
    }
  };
  /**
   * 选择文本,并增加选中样式. <br/>
   * 
   * @param {Number} x1 开始X坐标
   * @param {Number} y1 开始Y坐标
   * @param {Number} x2 结尾X坐标
   * @param {Number} y2 结尾Y坐标
   */
  Select.prototype._selectElem = function (x1, y1, x2, y2) {
    var optsObj = this.opts;
    var start = 0;
    var end = 0;
    var index = 0;
    var allElem = optsObj.$contentObj.find('.read-filterSpan');
    start = this._positionElem(x1, y1);
    end = this._positionElem(x2, y2);
    optsObj.$contentObj.find('.read-font-select').each(function () {
      $(this).removeClass('read-font-select');
    });
    for (var i = start; i <= end; i++) {
      allElem.eq(i).addClass('read-font-select');
    }
    if (optsObj.posMenu === 'upper') {
      this._posMenuShow(allElem.eq(start).attr('data-id'));
    }
    if (optsObj.posMenu === 'lower') {
      this._posMenuShow(allElem.eq(end).attr('data-id'));
    }
  };
  /**
   * 根据touch/mouse的pageX和pageY进行定位. <br/>
   * 
   * @param {Number} x    pageX
   * @param {Number} y    pageY
   * 
   * @return {Number} index 定位的当前元素在所有元素中的下标
   */
  Select.prototype._positionElem = function (x, y) {
    var that = this;
    var optsObj = that.opts;
    var fontsize = optsObj.$contentObj.css('font-size');
    var linehight = optsObj.$contentObj.css('line-height');
    var lately = 9999;
    var index = 0;
    var left = 0;
    var top = 0;
    fontsize = parseFloat(fontsize.replace('px', ''));
    linehight = parseFloat(linehight.replace('px', ''));
    var allElem = optsObj.$contentObj.find('.read-filterSpan');
    for (var i = 0, len = allElem.length; i < len; i++) {
      left = $(allElem[i]).offset().left + $(allElem[i]).width();
      top = $(allElem[i]).offset().top + $(allElem[i]).height();
      // 先定位Y坐标
      if (top + (linehight - fontsize) / 2 > y) {
        if (left > x) {
          optsObj.isShowMenu = 1;
          index = i;
          break;
        }
        // 再定位X坐标
        if (lately > Math.abs(left + fontsize / 2 - x)) {
          lately = Math.abs(left + fontsize / 2 - x);
        } else {
          optsObj.isShowMenu = 1;
          index = i;
          if (i && $(allElem[i]).offset().top > $(allElem[i - 1]).offset().top) {
            index = i - 1;
          }
          break;
        }
      }
      // 如果是最后一个元素
      if (!index && i === len - 1 && i) {
        optsObj.isShowMenu = 1;
        index = i;
      }
    }
    return index;
  };
  /**
   * 显示选取元素时左右两端的上标和下标. <br/>
   * 
   * @param {String} index 选择元素data-id
   */
  Select.prototype._posMenuShow = function (index) {
    var optsObj = this.opts;
    var thisElem = optsObj.$allContentObj.find('.read-filterSpan[data-id="' + index + '"]');
    var elemTop = thisElem.offset().top;
    var elemLeft = thisElem.offset().left;
    var elemW = thisElem.width();
    var elemH = thisElem.height();
    var readerTop = optsObj.$readerObj.offset().top;
    var readerLeft = optsObj.$readerObj.offset().left;
    if (optsObj.posMenu !== 'lower') {
      this.upperPos.css('top', elemTop - this.posH + elemH - readerTop + 'px');
      this.upperPos.css('left', elemLeft - this.posW / 2 - readerLeft + 'px');
    }
    if (optsObj.posMenu !== 'upper') {
      this.lowerPos.css('top', elemTop - readerTop + 'px');
      this.lowerPos.css('left', elemLeft - this.posW / 2 + elemW - readerLeft + 'px');
    }
    this.upperPos.fadeIn(0);
    this.lowerPos.fadeIn(0);
  };
  /**
   * 菜单显示. <br/>
   */
  Select.prototype._menuShow = function () {
    var that = this;
    var optsObj = that.opts;
    if (!optsObj.isShowMenu) {
      return false;
    }
    var pageH = optsObj.$readerObj.height();
    var startY = 0;
    var endY = 0;
    var allElem = optsObj.$contentObj.find('.read-font-select');
    var readerTop = optsObj.$readerObj.offset().top;
    startY = allElem.eq(0).offset().top - readerTop;
    endY = allElem.eq(allElem.length - 1).offset().top - readerTop;
    if (startY > endY) {
      var tempY = startY;
      startY = endY;
      endY = tempY;
    }
    if (startY > 80 + optsObj.$contentObj.offset().top) {
      optsObj.$menuWrap.css('top', startY - 80 + 'px');
    } else if (endY < pageH - 120) {
      optsObj.$menuWrap.css('top', endY + 80 + 'px');
    } else {
      optsObj.$menuWrap.css('top', '50%');
    }
    var readerLeft = optsObj.$readerObj.offset().left;
    var menuLeft = optsObj.$contentObj.offset().left + optsObj.$contentObj.width() / 2;
    optsObj.$menuWrap.css('left', menuLeft - readerLeft + 'px');
    optsObj.$menuWrap.fadeIn(400);
  };
  /**
   * 关闭菜单并清空选中样式. <br/>
   */
  Select.prototype._menuclose = function () {
    var optsObj = this.opts;
    optsObj.$menuWrap.fadeOut(200);
    this.$menuObj.setValue('underline', '划线');
    optsObj.isShowMenu = 0;
    optsObj.touchState = 0;
    optsObj.$allContentObj.find('.read-font-select').each(function () {
      $(this).removeClass('read-font-select');
    });
  };
  /**
   * 选择上标下标菜单关闭. <br/>
   */
  Select.prototype.close = function () {
    var optsObj = this.opts;
    this._menuclose();
    this.upperPos.fadeOut(10);
    this.lowerPos.fadeOut(10);
  };
  /**
   * 获取选中内容距离本页第一个的文字长度. <br/>
   * 
   * @return {Number}  posLen
   */
  Select.prototype._getPosLen = function () {
    var optsObj = this.opts;
    var posLen = 0;
    var $firstSelect = optsObj.$contentObj.find('.read-font-select').first();
    var dataId = $firstSelect.attr('data-id');
    var currPage = 2;
    if (optsObj.pageColumn == 2) {
      if ($firstSelect.offset().left < optsObj.$allContentObj.eq(1).offset().left) {
        currPage = 1;
      }
    }
    optsObj.$contentObj.find('.read-filterSpan').each(function () {
      posLen += $(this)[0].innerText.length;
      if ($(this).attr('data-id') === dataId) {
        return false;
      }
    });
    return {
      'posLen': posLen,
      'currPage': currPage
    };
  };
  /**
   * 自定义事件. <br/>
   * 
   * @param eventName {String}   事件名称,'Select:addUnderline', 'Select:addNote',
   *      'Select:delUnderline', 'Select:correct'
   * @param cb        {Function} 回调事件
   * 
   */
  Select.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  return Select;
}(js_src_global, js_src_tool, js_src_widget_plugRadioGroup, js_src_widget_plugDialog, js_libs_zeptodev, js_src_message_zh);
js_src_pc_panelNotePc = function (window, $, move, Tool, tips, dialog, Msg) {
  var _ = window._;
  var Note = function (options) {
    var defaults = {
      wrapObj: null,
      $readerObj: null,
      $contentObj: null,
      tmplHtml: '',
      isMobile: true,
      data: null,
      // 笔记划线数据
      editData: null,
      // 编辑笔记数据
      detailData: null,
      // 笔记详情数据
      correctDta: null,
      // 纠错数据
      chapter_id: '',
      // 当前章节id
      // 分享笔记
      note_share_conf: {
        'flag': false,
        'share_items': [
          {
            // 微信好友
            'type': 'wx',
            //  开关(是否使用该分享). false: 关闭(默认); true: 打开,此时必须注册回调函数!
            'flag': false,
            // 回调函数--分享逻辑
            'share_cb': null
          },
          {
            // 微信朋友圈
            'type': 'wx_moments',
            'flag': false,
            'share_cb': null
          },
          {
            // 新浪微博
            'type': 'sina_weibo',
            'flag': false,
            'share_cb': null
          },
          {
            // qq好友
            'type': 'qq',
            'flag': false,
            'share_cb': null
          },
          {
            // qq空间
            'type': 'qq_zone',
            'flag': false,
            'share_cb': null
          }
        ]
      }
    };
    this.opts = $.extend(true, {}, defaults, options);
    // 开启的"分享笔记"回调函数
    this._noteShareActiveItems = {
      'wx': null,
      'wx_moments': null,
      'sina_weibo': null,
      'qq': null,
      'qq_zone': null
    };
    this._init();
  };
  /**
   * 初始化   <br/>.
   */
  Note.prototype._init = function () {
    var optsObj = this.opts;
    var that = this;
    optsObj.templObj = _.template(optsObj.tmplHtml);
    //转化 zepto 对象
    optsObj.$contentObj = $('#reader_main_panel .read-body .read-content');
    optsObj.$cbnNoteObj = $('#cbn_body .read-note-body');
    optsObj.wrapObj = optsObj.$cbnNoteObj;
    this._bindEvent();
    // 笔记提示对话框
    this.noteDialog = new dialog({
      $wrapDomObj: optsObj.$readerObj,
      isMobile: false,
      clientType: optsObj.clientType,
      okBtn: {
        txt: '确定',
        cssClass: '',
        func: function () {
          that.close();
        }
      },
      cancelBtn: {
        txt: '离开',
        cssClass: '',
        func: function () {
          that.close();
        }
      }
    });
    // 删除笔记提示框
    this.noteDelDialog = new dialog({
      $wrapDomObj: optsObj.$readerObj,
      isMobile: false,
      clientType: optsObj.clientType,
      okBtn: {
        txt: '确定',
        cssClass: '',
        func: function () {
        }
      },
      cancelBtn: {
        txt: '离开',
        cssClass: '',
        func: function () {
        }
      }
    });
    // 纠错操作提示框
    this.tips = new tips({ parentObj: optsObj.$readerObj[0] });
  };
  /**
   * 渲染布局
   * 
   * @param {Object} data 笔记信息
   * 
   */
  Note.prototype.renderLayout = function (data) {
    var that = this;
    var optsObj = this.opts;
    optsObj.data = data || {
      time_stamp: '0',
      note_list: []
    };
    this._renderCbnPage(optsObj.data);
    // 分享关闭时不显示"分享到"
    if (!optsObj.note_share_conf.flag) {
      $('#reader_detailNote_panel .read-share').hide();
    } else {
      $('#reader_detailNote_panel .read-share').show();
    }
  };
  /**
   * 事件委托 绑定事件.<br/>
   * 
   */
  Note.prototype._bindEvent = function () {
    var that = this;
    var optsObj = this.opts;
    var noteShareConf = optsObj.note_share_conf;
    // 更新笔记
    $('#reader_editNote_panel .read-send').on('click', function () {
      var val = $('#reader_editNote_panel textarea').val().trim();
      that._saveNote(val);
    });
    // 取消编辑
    $('#reader_editNote_panel .read-cancel').on('click', function () {
      var val = $('#reader_editNote_panel textarea').val().trim();
      // 判断是否输入了内容
      if (val) {
        var cancelDialog = new dialog({
          $wrapDomObj: optsObj.$readerObj,
          isMobile: false,
          clientType: optsObj.clientType,
          okBtn: {
            txt: '继续编辑',
            cssClass: '',
            func: function () {
              $('#reader_editNote_panel textarea').focus();
              cancelDialog.destroy();
            }
          },
          cancelBtn: {
            txt: '离开',
            cssClass: '',
            func: function () {
              that.close();
              cancelDialog.destroy();
            }
          }
        });
        cancelDialog.setMsg(Msg.noteCancel);
        cancelDialog.open();
      } else {
        that.close();
      }
    });
    // 笔记详情   上一页
    $('#reader_detailNote_panel .read-prev').on('click', function () {
      that._prev();
    });
    // 笔记详情   下一页
    $('#reader_detailNote_panel .read-next').on('click', function () {
      that._next();
    });
    // 笔记详情    删除
    $('#reader_detailNote_panel .read-delete-btn').on('click', function () {
      that.delNote({
        'noteid': optsObj.detailData.note_id,
        'chapterid': optsObj.chapter_id
      });
    });
    // 笔记详情    编辑
    $('#reader_detailNote_panel .read-edit-btn').on('click', function () {
      optsObj.detailData.chapter_id = optsObj.chapter_id;
      var width = $('#reader_detailNote_panel').width();
      move($('#reader_detailNote_panel')[0]).translate(-width, 0).duration('0.4s').end();
      // 移出 动画状态
      $('#reader_detailNote_panel').removeClass('read-animateShow');
      setTimeout(function () {
        that._openEditNote(optsObj.detailData);
      }, 100);
    });
    // 文字纠错    发送
    $('#reader_correct_panel .read-send').on('click', function () {
      var val = $('#reader_correct_panel textarea').val().trim();
      that._sendCorrect(val);
    });
    // 文字纠错    取消
    $('#reader_correct_panel .read-cancel').on('click', function () {
      var val = $('#reader_correct_panel textarea').val().trim();
      $('#reader_correct_panel textarea').blur();
      that._cancelCorrect(val);
    });
    // 点击笔记的删除按钮(PC)
    optsObj.$cbnNoteObj.on('click', '.read-icon', function (e) {
      var oneChapterNote = $(this).parents('.read-one-chapter-notes');
      var delNoteData = {
        'chapterid': oneChapterNote.attr('data-chapterid'),
        'noteid': $(this).parents('.read-note').attr('data-noteid')
      };
      that.delNote(delNoteData);
      e.stopPropagation();
    });
    // 点击笔记跳转到相应页面
    optsObj.$cbnNoteObj.on('click', '.read-original-text', function (e) {
      var percent = $(this).parents('.read-note').attr('data-percent');
      optsObj.wrapObj.trigger('panelNote:click', parseFloat(percent));
      e.stopPropagation();
    });
    // "分享笔记" -- 微博, 微信, QQ等
    if (noteShareConf.flag) {
      // _noteShareActiveItems
      var shareItems = noteShareConf.share_items;
      for (var i = 0, len = shareItems.length; i < len; i++) {
        if (shareItems[i].flag) {
          this._noteShareActiveItems[shareItems[i].type] = shareItems[i].share_cb;
        }
      }
      $('#reader_detailNote_panel').find('.read-sel-share').on('click', 'li', function () {
        var tmpShareNote = that._getCurrentNotInfo();
        var shareType = $(this).attr('data-type');
        if (typeof that._noteShareActiveItems[shareType] == 'function') {
          that._noteShareActiveItems[shareType](tmpShareNote);
        } else {
          console.error('PC分享笔记:' + $(this).find('.read-text-over').html() + ',未注册回调函数!');
        }
      });
    }
  };
  /**
   * 获取当前笔记相关信息. <br/>
   * 
   * return noteInfo {Object} 包括: book_id, chapter_id, note_txt
   * 
   */
  Note.prototype._getCurrentNotInfo = function () {
    var that = this;
    var optsObj = that.opts;
    var noteInfo = {
      'book_id': '',
      'chapter_id': '',
      'note_txt': ''
    };
    try {
      noteInfo.book_id = optsObj.api.opts.baseData.book_id || '';
      noteInfo.chapter_id = optsObj.detailData.chapter_id;
      noteInfo.note_txt = optsObj.detailData.original;
    } catch (e) {
      console.error('[panelNotePc.js]' + e);
    }
    return noteInfo;
  };
  /*
   * 渲染cbn面板布局. <br/>
   * 
   * @param {Object} data 笔记信息
   */
  Note.prototype._renderCbnPage = function (data) {
    var that = this;
    var optsObj = this.opts;
    // 是否有笔记
    var flag = false;
    var tmp = Tool.convertData(data.note_list, 'note_list');
    data.chapter_list = tmp;
    var noteConvert = {
      'chapter_list': tmp,
      'nowDate': ''
    };
    if (noteConvert.chapter_list.length > 0) {
      for (var i = 0, len = noteConvert.chapter_list.length; i < len; i++) {
        if (noteConvert.chapter_list[i].note_count) {
          flag = true;
          break;
        }
      }
      var nowDate = Tool.getNowFormatDate();
      noteConvert.nowDate = nowDate.substr(0, 10);
      var tempHtml = optsObj.templObj(noteConvert);
      optsObj.$cbnNoteObj.html(tempHtml);
      if (typeof MathJax !== 'undefined') {
        MathJax.Hub.Queue([
          'Typeset',
          MathJax.Hub
        ]);
      }
    }
    if (!flag) {
      optsObj.$cbnNoteObj.find('.read-has-note').html('').hide();
      optsObj.$cbnNoteObj.find('.read-no-note').fadeIn();
    }
  };
  /**
   * 删除 笔记信息. <br/>
   * 
   * @param {Object} delNoteData {
   *      noteid      {String}  笔记id
   *      chapterid   {String}  笔记所在的章节id
   *  }
   * 
   */
  Note.prototype.delNote = function (delNoteData) {
    var that = this;
    var optsObj = this.opts;
    // var chapter_list = optsObj.data.chapter_list;
    var noteid = delNoteData.noteid;
    var note_list = optsObj.data.note_list;
    var note_sid = '';
    var tmpNoteItem = null;
    for (var i = 0, len = note_list.length; i < len; i++) {
      tmpNoteItem = note_list[i];
      if (tmpNoteItem.note_id == noteid) {
        if (tmpNoteItem.s_id == '') {
          // 删除"离线"状态的数据.
          note_list.splice(i, 1);
        } else {
          tmpNoteItem.oparate_type = '3';
          note_sid = tmpNoteItem.s_id;
        }
        break;
      }
    }
    var localNoteData = {
      'time_stamp': optsObj.data.time_stamp,
      'note_list': optsObj.data.note_list
    };
    // 保存本地
    optsObj.saveFile(optsObj.filePath, JSON.stringify(localNoteData));
    // 重新渲染笔记显示
    this._renderCbnPage(optsObj.data);
    this._reshowNote();
    this.showNote(optsObj.chapter_id, optsObj.chapter_name);
    if (note_sid != '') {
      // 删除的数据在DB有记录时.
      optsObj.api.delNote({ 'note_id': noteid }, function (data) {
        that._updateSingleNote({
          's_id': '',
          'note_id': data.note_id,
          'time_stamp': data.time_stamp,
          'oparate_type': 3
        });
      }, function () {
        if (!optsObj.isClient) {
          that.noteDelDialog.setMsg(Msg.noteDelFail);
          that.noteDelDialog.open();
          tmpNoteItem.oparate_type = '0';
          // 重新渲染笔记显示
          that._renderCbnPage(optsObj.data);
          that._filterNote();
          that._viewNote(noteid);
          that.showNote(optsObj.chapter_id, optsObj.chapter_name);
        }
      });
    }
  };
  /**
   * 页面显示笔记和划线. <br/>
   * 
   * @param {String} chapterid    章节ID
   * @param {String} chapterName  章节名
   */
  Note.prototype.showNote = function (chapterid, chapterName) {
    var optsObj = this.opts;
    var that = this;
    optsObj.chapter_id = chapterid;
    optsObj.chapter_name = chapterName;
    var note_list = [];
    // 显示前,先清除
    optsObj.$contentObj.find('.read-gli-note').removeClass('read-gli-note');
    optsObj.$contentObj.find('.read-gli-underline').removeClass('read-gli-underline');
    optsObj.$contentObj.find('.read-note-icon').remove();
    var chapts = !optsObj.data ? [] : optsObj.data.chapter_list;
    for (var i = 0, len = chapts.length; i < len; i++) {
      if (chapts[i].chapter_id == chapterid) {
        // 深复制
        note_list = chapts[i].note_list.concat();
        break;
      }
    }
    // 笔记开始结束data-id
    var first_id = optsObj.$contentObj.find('span[data-id]').first().attr('data-id');
    var last_id = optsObj.$contentObj.find('span[data-id]').last().attr('data-id');
    first_id = parseInt(first_id);
    last_id = parseInt(last_id);
    // 笔记开始结束下标
    var firstId = 0;
    var lastId = 0;
    var oldId = 0;
    var note_id = '';
    var note_text = '';
    var fontsize = optsObj.$contentObj.css('font-size');
    fontsize = parseFloat(fontsize.replace('px', ''));
    var readerTop = optsObj.$readerObj.offset().top;
    var readerLeft = optsObj.$readerObj.offset().left;
    // 按顺序查找显示
    while (note_list.length) {
      firstId = parseInt(note_list[0].firstId);
      lastId = parseInt(note_list[0].lastId);
      oldId = lastId;
      note_id = note_list[0].note_id;
      note_text = note_list[0].note_text;
      // 笔记跨页等特殊情况也能得到笔记开始结束位置
      firstId = firstId > first_id ? firstId : first_id;
      lastId = lastId < last_id ? lastId : last_id;
      // 笔记不在当前页
      if (firstId > lastId) {
        note_list.splice(0, 1);
        continue;
      }
      if (note_text === '') {
        // 划线
        for (var j = firstId; j <= lastId; j++) {
          optsObj.$contentObj.find('span[data-id="' + j + '"]').attr('data-noteid', note_id);
          if (!optsObj.$contentObj.find('span[data-id="' + j + '"]').hasClass('read-gli-note')) {
            optsObj.$contentObj.find('span[data-id="' + j + '"]').addClass('read-gli-underline');
          }
        }
      } else {
        // 笔记
        for (var j = firstId; j <= lastId; j++) {
          optsObj.$contentObj.find('span[data-id="' + j + '"]').attr('data-noteid', note_id).addClass('read-gli-note');
        }
        if (lastId === oldId) {
          // 笔记标记图标
          var $noteIcon = $('<div class="read-note-icon">');
          var $notelast = optsObj.$contentObj.find('span[data-id="' + lastId + '"]');
          var mainTop = optsObj.$readerObj.find('.read-selector-main .read-body')[0].getBoundingClientRect().top;
          var top = $notelast[0].getBoundingClientRect().top;
          var left = $notelast[0].getBoundingClientRect().left;
          var width = $notelast.width();
          // 笔记图标设置位置 并绑定事件
          $noteIcon.css({
            'top': top - fontsize + 'px',
            'left': left + width - fontsize + 'px'
          }).attr('data-noteid', note_id).attr('data-chapterid', chapterid).on('click', function (event) {
            that._openDetailNote($(this).data('noteid'));
            event.stopPropagation();
          });
          optsObj.$contentObj.eq(0).append($noteIcon);
        }
      }
      note_list.splice(0, 1);
    }
  };
  /**
   * 增加划线. <br/>
   * 
   * @param {Object} data {
   *      fisrtId     {Number} 被选中内容的第一个元素的data-id值
   *      lastId      {Number} 被选中内容的最后一个元素的data-id值
   *      original    {String} 选中的内容，公式和特殊标签sub/sup/i等含html代码
   *      chapter_id  {String} 章节ID
   *      note_page   {Number} 当前页码 ps:0.1234
   *  }
   */
  Note.prototype.addUnderline = function (data) {
    var optsObj = this.opts;
    if (optsObj.$contentObj.find('.read-font-select').hasClass('read-gli-underline') || optsObj.$contentObj.find('.read-font-select').hasClass('read-gli-note')) {
      // 不能addUnderline的提示框
      this.noteDialog.setMsg(Msg.noteError);
      this.noteDialog.open();
    } else {
      optsObj.$contentObj.find('.read-font-select').addClass('read-gli-underline');
      var note_list = optsObj.data.note_list;
      var underlineData = {
        'chapter_id': optsObj.chapter_id,
        'chapter_name': optsObj.chapter_name,
        's_id': '',
        'note_id': Tool.getRandomKey(),
        'original': data.original,
        'note_text': '',
        'note_time': Tool.getNowFormatDate(),
        'firstId': data.firstId,
        'lastId': data.lastId,
        'note_page': data.note_page,
        'oparate_type': '1',
        'isSave': false
      };
      optsObj.$contentObj.find('.read-font-select').attr('data-noteid', underlineData.note_id);
      note_list.push(underlineData);
      this._renderCbnPage(optsObj.data);
      this._sendNote(underlineData);
    }
  };
  /**
   * 
   * 编辑笔记. <br/>
   * 
   * @param {Object} data {
   *      fisrtId     {Number} 被选中内容的第一个元素的data-id值
   *      lastId      {Number} 被选中内容的最后一个元素的data-id值
   *      original    {String} 选中的内容，公式和特殊标签sub/sup/i等含html代码
   *      chapter_id  {String} 章节ID
   *      note_page   {Number} 当前页码 ps:0.1234
   *      isunderline {Boolean}是否是划线转笔记
   *  }
   */
  Note.prototype.editNote = function (data) {
    var optsObj = this.opts;
    var that = this;
    if (!data.isunderline && (optsObj.$contentObj.find('.read-font-select').hasClass('read-gli-underline') || optsObj.$contentObj.find('.read-font-select').hasClass('read-gli-note'))) {
      // 不能增加笔记的提示框
      this.noteDialog.setMsg(Msg.noteError);
      this.noteDialog.open();
      return false;
    }
    this._openEditNote(data);
  };
  /**
   * 打开编辑笔记页面. <br/>
   * 
   * @param {Object} data
   */
  Note.prototype._openEditNote = function (data) {
    var optsObj = this.opts;
    var isNewNote = true;
    data.isNewNote = isNewNote;
    var $editNoteObj = $('#reader_editNote_panel');
    var $staticPanel = $('#reader_static_panel');
    $staticPanel.show();
    var width = $editNoteObj.width();
    $editNoteObj.addClass('read-animateShow');
    setTimeout(function () {
      move($editNoteObj[0]).translate(width, 0).duration('0.5s').end();
      if (typeof MathJax !== 'undefined') {
        MathJax.Hub.Queue([
          'Typeset',
          MathJax.Hub
        ]);
      }
    }, 10);
    $editNoteObj.find('.read-original-text').html(data.original);
    if (!!data.note_text) {
      // true 笔记在编辑
      data.isNewNote = false;
      $editNoteObj.find('textarea').val(data.note_text);
    }
    if (!!data.isunderline) {
      _.each(optsObj.data.note_list, function (note) {
        if (note.note_id == data.note_id) {
          data.s_id = note.s_id;
          data.isNewNote = false;
          return false;
        }
      });
    }
    optsObj.editData = data;
  };
  /**
   * 打开详情笔记页面. <br/>
   * 
   * @param {String} noteid 笔记ID
   */
  Note.prototype._openDetailNote = function (noteid) {
    var optsObj = this.opts;
    var $detailNoteObj = $('#reader_detailNote_panel');
    var $staticPanel = $('#reader_static_panel');
    $staticPanel.show();
    var width = $detailNoteObj.width();
    $detailNoteObj.addClass('read-animateShow');
    setTimeout(function () {
      move($detailNoteObj[0]).translate(width, 0).duration('0.5s').end();
      if (typeof MathJax !== 'undefined') {
        MathJax.Hub.Queue([
          'Typeset',
          MathJax.Hub
        ]);
      }
    }, 10);
    this._filterNote();
    this._viewNote(noteid);
  };
  /**
   * 打开文字纠错页面. <br/>
   * 
   * @param {Object} data
   */
  Note.prototype.openCorrect = function (data) {
    var optsObj = this.opts;
    optsObj.correctData = data;
    optsObj.first = true;
    var $correctObj = $('#reader_correct_panel');
    var $staticPanel = $('#reader_static_panel');
    $staticPanel.show();
    var width = $correctObj.width();
    $correctObj.addClass('read-animateShow');
    setTimeout(function () {
      move($correctObj[0]).translate(width, 0).duration('0.5s').end();
      $correctObj.find('.original-text').html(data.original);
      if (typeof MathJax !== 'undefined') {
        MathJax.Hub.Queue([
          'Typeset',
          MathJax.Hub
        ]);
      }
    }, 10);
  };
  /**
   * 过滤划线保存笔记.<br/>
   * 
   */
  Note.prototype._filterNote = function () {
    var optsObj = this.opts;
    var noteList = [];
    optsObj.thisNoteList = [];
    for (var i = 0, len = optsObj.data.chapter_list.length; i < len; i++) {
      if (optsObj.data.chapter_list[i].chapter_id == optsObj.chapter_id) {
        noteList = optsObj.data.chapter_list[i].note_list;
        break;
      }
    }
    var tempItem = null;
    for (var j = 0, m = noteList.length; j < m; j++) {
      tempItem = noteList[j];
      if (!!tempItem.note_text && tempItem.oparate_type != '3') {
        optsObj.thisNoteList.push(tempItem);
      }
    }  // 更新数据内容
       //          optsObj.data.chapter_list = Tool.convertData(noteList, "note_list");
  };
  /**
   * 删除笔记后,重新显示笔记. <br/>
   * 
   */
  Note.prototype._reshowNote = function () {
    var optsObj = this.opts;
    this._filterNote();
    var index = optsObj.thisNoteIndex;
    if (index > 0) {
      index = index - 1;
    } else {
      index = index < optsObj.thisNoteList.length ? index : -1;
    }
    var noteid = index > -1 ? optsObj.thisNoteList[index].note_id : -1;
    this._viewNote(noteid);
  };
  /**
   * 笔记详情页面显示笔记. <br/>
   * 
   * @param {String} noteid 笔记ID
   */
  Note.prototype._viewNote = function (noteid) {
    var that = this;
    var optsObj = that.opts;
    var $detailNoteObj = $('#reader_detailNote_panel');
    if (noteid === -1) {
      // 当前章节没笔记啦
      $detailNoteObj.find('.read-original-text').html('');
      $detailNoteObj.find('.read-note-text').html('当前章节没笔记啦\uFF01');
      //              optsObj.$domObj.find(".footer .time").html('');
      $detailNoteObj.find('.read-footer .read-page .read-current').html(0);
      $detailNoteObj.find('.read-footer .read-page .read-total').html(0);
      $detailNoteObj.find('.read-footer').css('pointer-events', 'none');
      return false;
    } else {
      $detailNoteObj.find('.read-footer').css('pointer-events', '');
    }
    // 遍历找到chapterid相等且noteid相等的笔记
    _.each(optsObj.thisNoteList, function (note, i) {
      if (note.note_id == noteid) {
        optsObj.detailData = note;
        $detailNoteObj.find('.read-original-text').html(note.original);
        $detailNoteObj.find('.read-note-text').html(note.note_text);
        //                  optsObj.$domObj.find(".footer .time").html(note.note_time);
        $detailNoteObj.find('.read-footer .read-page .read-current').html(i + 1);
        $detailNoteObj.find('.read-footer .read-page .read-total').html(optsObj.thisNoteList.length);
        optsObj.thisNoteIndex = i;
        return false;
      }
    });
    if (typeof MathJax !== 'undefined') {
      MathJax.Hub.Queue([
        'Typeset',
        MathJax.Hub
      ]);
    }
  };
  /**
   * 笔记上翻. <br/>
   * 
   */
  Note.prototype._prev = function () {
    var that = this;
    var optsObj = that.opts;
    var oldIndex = optsObj.thisNoteIndex;
    optsObj.thisNoteIndex = optsObj.thisNoteIndex > 0 ? optsObj.thisNoteIndex - 1 : 0;
    var noteid = optsObj.thisNoteList[optsObj.thisNoteIndex].note_id;
    if (oldIndex == optsObj.thisNoteIndex) {
      return false;
    }
    this._viewNote(noteid);
  };
  /**
   * 笔记下翻. <br/>
   * 
   */
  Note.prototype._next = function () {
    var that = this;
    var optsObj = that.opts;
    var oldIndex = optsObj.thisNoteIndex;
    var max = optsObj.thisNoteList.length - 1;
    optsObj.thisNoteIndex = optsObj.thisNoteIndex < max ? optsObj.thisNoteIndex + 1 : max;
    var noteid = optsObj.thisNoteList[optsObj.thisNoteIndex].note_id;
    if (oldIndex == optsObj.thisNoteIndex) {
      return false;
    }
    this._viewNote(noteid);
  };
  /**
   * 保存笔记. <br/>
   * 
   * @param {Object} val  笔记内容
   */
  Note.prototype._saveNote = function (val) {
    var optsObj = this.opts;
    var that = this;
    // 验证传送内容是否为空
    if (!!val) {
      // 当前笔记对象
      var saveNoteData = {
        chapter_id: optsObj.editData.chapter_id,
        chapter_name: optsObj.editData.chapter_name,
        firstId: optsObj.editData.firstId,
        lastId: optsObj.editData.lastId,
        note_id: optsObj.editData.note_id,
        note_page: optsObj.editData.note_page,
        note_text: val,
        note_time: Tool.getNowFormatDate(),
        original: optsObj.editData.original,
        s_id: optsObj.editData.s_id,
        oparate_type: '',
        isSave: false
      };
      if (optsObj.editData.isNewNote) {
        // 新增笔记
        saveNoteData.s_id = '';
        saveNoteData.note_id = Tool.getRandomKey();
        // {Number}  1：增; 2：改; 3：删
        saveNoteData.oparate_type = 1;
        optsObj.data.note_list.push(saveNoteData);
      } else {
        // 编辑笔记
        saveNoteData.oparate_type = 2;
        var tmpNoteList = optsObj.data.note_list;
        for (var i = 0, len = tmpNoteList.length; i < len; i++) {
          if (tmpNoteList[i].note_id == saveNoteData.note_id) {
            // 覆盖旧信息
            tmpNoteList[i] = saveNoteData;
            break;
          }
        }
      }
      this._sendNote(saveNoteData);
      this._renderCbnPage(optsObj.data);
      this.showNote(optsObj.chapter_id, optsObj.chapter_name);
    } else {
      var emptyDialog = new dialog({
        $wrapDomObj: optsObj.$readerObj,
        isMobile: false,
        clientType: optsObj.clientType,
        okBtn: {
          txt: '确定',
          cssClass: '',
          func: function () {
            $('#reader_editNote_panel textarea').focus();
            emptyDialog.destroy();
          }
        },
        cancelBtn: {
          txt: '离开',
          cssClass: '',
          func: function () {
            that.close();
            emptyDialog.destroy();
          }
        }
      });
      // 没输入内容 点击保存笔记时
      emptyDialog.setMsg(Msg.inputContent);
      emptyDialog.open();
    }
  };
  /**
   * 取消纠错文字面板. <br/>
   * 
   */
  Note.prototype._cancelCorrect = function (value) {
    var optsObj = this.opts;
    var that = this;
    // 判断是否输入了内容
    if (value) {
      var cancelDialog = new dialog({
        $wrapDomObj: optsObj.$readerObj,
        isMobile: false,
        clientType: optsObj.clientType,
        okBtn: {
          txt: '继续编辑',
          cssClass: '',
          func: function () {
            $('#reader_correct_panel textarea').focus();
            cancelDialog.destroy();
          }
        },
        cancelBtn: {
          txt: '离开',
          cssClass: '',
          func: function () {
            that.close();
            cancelDialog.destroy();
          }
        }
      });
      cancelDialog.setMsg(Msg.correctCancel);
      cancelDialog.open();
    } else {
      that.close();
    }  //          // 判断是否输入了内容
       //          if(value && optsObj.first) {
       //              setTimeout(function() {
       //                  optsObj.first = false;
       //              }, 1000);
       //              this.tips.open(Msg.correctCancel, 1000);
       //              $('#reader_correct_panel textarea').focus();
       //          } else {
       //              this.close();
       //          }
  };
  /**
   * 发送纠错信息. <br/>
   * 
   * @param {String} val 纠错说明内容
   * 
   */
  Note.prototype._sendCorrect = function (val) {
    var that = this;
    var optsObj = this.opts;
    var data = optsObj.correctData;
    // 纠错要发送的信息
    var correctData = {
      'chapter_id': data.chapter_id,
      'chapter_name': data.chapter_name,
      'percent': data.note_page,
      'original': data.original,
      'correctVal': val
    };
    var errorDialog = new dialog({
      $wrapDomObj: optsObj.$readerObj,
      isMobile: false,
      clientType: optsObj.clientType,
      okBtn: {
        txt: '继续编辑',
        cssClass: '',
        func: function () {
          $('#reader_correct_panel textarea').focus();
          errorDialog.destroy();
        }
      },
      cancelBtn: {
        txt: '离开',
        cssClass: '',
        func: function () {
          that.close();
          errorDialog.destroy();
        }
      }
    });
    if (val) {
      optsObj.api.sendCorrect(correctData, function () {
        that.noteDialog.setMsg(Msg.correctSucess);
        that.noteDialog.open();  //                  that.tips.open(Msg.correctSucess, 1000);
                                 //                  that.close();
      }, function (data) {
        console.warn(data);
        errorDialog.setMsg(Msg.sendError);
        errorDialog.open();  //                  that.tips.open(Msg.sendError, 1000);
      });
    } else {
      errorDialog.setMsg(Msg.correctError);
      errorDialog.open();  //              this.tips.open(Msg.correctError, 1000);
    }
  };
  /**
   * 发送单条笔记信息. <br/>
   * 
   * @param {Object} noteInfo {
   *      firstId     {Number}    笔记开始下标,
   *      lastId      {Number}    笔记结束下标,
   *      note_id     {Number}    笔记ID,
   *      note_page   {String}    笔记在本章位置(0.5213),
   *      note_text   {String}    笔记内容,
   *      note_time   {String}    笔记时间,
   *      original    {String}    笔记原文,
   *  }
   */
  Note.prototype._sendNote = function (noteInfo) {
    var optsObj = this.opts;
    var that = this;
    // 本地储存
    var localNoteData = {
      'time_stamp': optsObj.data.time_stamp,
      'note_list': optsObj.data.note_list
    };
    optsObj.saveFile(optsObj.filePath, JSON.stringify(localNoteData));
    // 保存单条笔记信息
    optsObj.api.sendNote(noteInfo, function (data) {
      that._updateSingleNote({
        's_id': data.s_id,
        'note_id': data.note_id,
        'time_stamp': data.time_stamp,
        'oparate_type': 1
      });
      innerSetDialog(Msg.noteSucess, noteInfo.note_text != '');
      that._fallback(true);
    }, function () {
      var msg = optsObj.isClient ? Msg.noteSucess : Msg.noteFail;
      if (noteInfo.note_text == '' && !optsObj.isClient) {
        that.noteDialog.setMsg(Msg.noteFail);
        that.noteDialog.open();
      } else {
        if (noteInfo.note_text != '') {
          innerSetDialog(msg, true);
        }
      }
      that._fallback(optsObj.isClient);
    });
    function innerSetDialog(msg, flag) {
      if (flag) {
        that.noteDialog.setMsg(msg);
        that.noteDialog.open();
      }
    }
  };
  /**
   * 保存笔记失败回退. <br/>
   * 
   * @param {Boolean} sucessFlag 是否回退
   */
  Note.prototype._fallback = function (sucessFlag) {
    var optsObj = this.opts;
    var note_list = optsObj.data.note_list;
    for (var i = note_list.length - 1; i >= 0; i--) {
      if (note_list[i].isSave === false) {
        delete note_list[i].isSave;
        if (!sucessFlag) {
          if (!optsObj.editData || optsObj.editData.isNewNote) {
            // 新增笔记
            note_list.splice(i, 1);
          } else {
            if (!!optsObj.editData.isunderline) {
              // 划线转笔记
              note_list[i].note_text = '';
            } else {
              // 编辑笔记
              note_list[i] = optsObj.detailData;
            }
          }
          this._renderCbnPage(optsObj.data);
          this.showNote(optsObj.chapter_id, optsObj.chapter_name);
        }
        break;
      }
    }
    optsObj.editData = null;
  };
  /**
   * 当用户执行 增删改 操作,服务器返回数据时，更新本地数据(内存, 本地文件). <br/>
   * 
   * @param {Object} noteInfo
   *           noteInfo.s_id
   *           noteInfo.note_id
   *           noteInfo.time_stamp
   *           noteInfo.oparate_type, // 1：增; 2：改; 3：删
   * 
   */
  Note.prototype._updateSingleNote = function (noteInfo) {
    var optsObj = this.opts;
    var localNoteList = optsObj.data.note_list;
    var noteItem = null;
    for (var i = 0, len = localNoteList.length; i < len; i++) {
      noteItem = localNoteList[i];
      if (noteItem.note_id == noteInfo.note_id) {
        if (noteInfo.oparate_type == '3') {
          // 删
          localNoteList.splice(i, 1);
        } else {
          // 增, 改
          noteItem.s_id = noteInfo.s_id;
          // 本条数据已与服务器同步
          noteItem.oparate_type = '0';
        }
        // 更新时间戳;
        if (!!noteInfo.time_stamp) {
          optsObj.data.time_stamp = noteInfo.time_stamp;
        }
        break;
      }
    }
    var localNoteData = {
      'time_stamp': optsObj.data.time_stamp,
      'note_list': optsObj.data.note_list
    };
    optsObj.saveFile(optsObj.filePath, JSON.stringify(localNoteData));
  };
  /**
   * 批量更新笔记.<br/>
   * 
   */
  Note.prototype.batchUpdateNote = function (noteInfo, successCb, errorCb) {
    var optsObj = this.opts;
    optsObj.api.batchUpdateNote(noteInfo, function (data) {
      if (typeof successCb == 'function') {
        successCb(data);
      }
    }, function (data) {
      if (typeof errorCb == 'function') {
        errorCb(data);
      }
    });
  };
  /**
   * 关闭笔记相关页面. <br/>
   * 
   */
  Note.prototype.close = function () {
    var optsObj = this.opts;
    $('#reader_editNote_panel textarea').val('');
    optsObj.wrapObj.trigger('panelNote:close');
  };
  /**
   * 自定义事件. <br/>
   * 
   * @param eventName {String}   事件名称, 'panelNote:close'
   * @param cb        {Function} 回调事件
   * 
   */
  Note.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.wrapObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  return Note;
}(js_src_global, js_libs_zeptodev, move, js_src_tool, js_src_widget_plugTips, js_src_widget_plugDialog, js_src_message_zh);
js_src_widget_plugVideoPc = function (window, $, tool) {
  var _ = window._;
  var Video = function (options) {
    var defaults = { $domObj: null };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化.
   */
  Video.prototype._init = function () {
    this.bigSizeVideoWrap = this.opts.$domObj;
    this.waitingMask = this.bigSizeVideoWrap.find('.read-waiting-mask');
    this.pauseMask = this.bigSizeVideoWrap.find('.read-pause-mask');
    this.bigsizeVideo = this.bigSizeVideoWrap.find('.read-bigsize-video');
    this.videoPlayIcon = this.bigSizeVideoWrap.find('.read-video-play-btn');
    this.volumeBar = this.bigSizeVideoWrap.find('.read-volume-bar');
    this.volumePoint = this.volumeBar.find('.read-loadedvolume-point');
    this.loadedVolumeBar = this.volumeBar.find('.read-loadedvolume-bar');
    this.progressBar = this.bigSizeVideoWrap.find('.read-progress-bar');
    this.loadedProgressBar = this.progressBar.find('.read-loadedprogress-bar');
    this.headControl = this.bigSizeVideoWrap.find('.read-header-bar');
    this.footControl = this.bigSizeVideoWrap.find('.read-video-controls-container');
    // 鼠标按下时相对于浏览器页面的坐标
    this.mousePos = { 'posY': '' };
    this._bindEvent();
  };
  /**
   * 绑定事件.
   */
  Video.prototype._bindEvent = function () {
    var optsObj = this.opts;
    var that = this;
    var backBtn = this.bigSizeVideoWrap.find('.read-back');
    // 点击“返回”
    backBtn.on('click', function () {
      that.close();
    });
    // 播放按钮绑定播放/暂停
    this.videoPlayIcon.on('click', function () {
      that._setVideoPlayOrPause();
      return false;
    });
    // 点击视频绑定播放/暂停
    this.bigsizeVideo.on('click', function () {
      that._setVideoPlayOrPause();
      return false;
    });
    // 绑定播放事件
    this.bigsizeVideo.on('play', function () {
      console.log('播放视频');
      that.videoPlayIcon.addClass('read-pause');
      that.pauseMask.hide();
    });
    // 绑定暂停事件
    this.bigsizeVideo.on('pause', function () {
      console.log('暂停视频');
      that.videoPlayIcon.removeClass('read-pause');
      that.pauseMask.show();
    });
    // 暂停时点击遮罩
    this.pauseMask.on('click', function () {
      that._setVideoPlayOrPause();
      $(this).hide();
      return false;
    });
    // 缓冲
    this.bigsizeVideo.on('waiting', function () {
      that.waitingMask.show();
    });
    // 能够播放视频状态
    this.bigsizeVideo.on('canplay', function () {
      that.waitingMask.hide();
    });
    // 点击模拟进度条
    this.progressBar.on('click', function (event) {
      // event.offsetX 表示鼠标指针的位置相对于触发事件的对象的X坐标;
      var loadedProgress = event.offsetX;
      var totalProgress = $(this).width();
      var progressRate = (loadedProgress / totalProgress).toFixed(2);
      var curVideo = $(this).parent().parent().prev()[0];
      var totalTime = curVideo.duration;
      curVideo.currentTime = progressRate * totalTime;
      curVideo.play();
      that.loadedProgressBar.width(loadedProgress);
    });
    // 监听currentTime改变
    this.bigsizeVideo.on('timeupdate', function () {
      var curTime = this.currentTime;
      var totalTime = this.duration;
      // 格式化后的当前时间
      var formatCurTime = tool.formatTime(curTime);
      // 格式化后的总时间
      var formatTotalTime = tool.formatTime(totalTime);
      var controlsWidth = that.progressBar.width();
      var curWidth = curTime / totalTime * controlsWidth;
      that.loadedProgressBar.width(curWidth);
      that.bigSizeVideoWrap.find('.read-video-currenttime').html(formatCurTime);
      if (!isNaN(totalTime)) {
        that.bigSizeVideoWrap.find('.read-video-totaltime').html(formatTotalTime);
      }
    });
    // 点击音量图标
    this.bigSizeVideoWrap.find('.read-volume-icon').on('click', function () {
      that.volumeBar.toggle();
      that._setVolumeBarH();
      that._clearSelect();
      return false;
    });
    // 点击音量进度条
    this.volumeBar.on('click', function (event) {
      // event.offsetY 表示鼠标指针的位置相对于触发事件的对象的Y坐标;
      var totalVolumeH = $(this).height();
      var loadedVolumeY = event.offsetY;
      var volumeRate = loadedVolumeY / totalVolumeH;
      var formatVolumeRate = volumeRate.toFixed(1);
      // 音量的范围为0~1
      var totalVolume = 1;
      that.bigsizeVideo[0].volume = 1 - formatVolumeRate * totalVolume;
      that.loadedVolumeBar.height(loadedVolumeY);
      that.volumePoint.css('bottom', totalVolumeH - loadedVolumeY - 8);
      event.stopPropagation();
    });
    // 点击音量增加图标
    this.volumeBar.find('.read-addvolume-icon').on('click', function () {
      var curVol = that.bigsizeVideo[0].volume;
      if (1 - curVol > 0.1) {
        that.bigsizeVideo[0].volume = curVol + 0.1;
      }
      var totalVolumeH = that.volumeBar.height();
      curVol = that.bigsizeVideo[0].volume;
      if (1 - curVol < 0.1) {
        curVol = 1;
      }
      that.loadedVolumeBar.height(totalVolumeH - curVol * totalVolumeH);
      that.volumePoint.css('bottom', curVol * totalVolumeH);
      that._clearSelect();
      return false;
    });
    // 拖动音量按钮调节音量
    this.volumePoint.on('mousedown', function (event) {
      var eve = event || window.event;
      that.mousePos.posY = eve.clientY;
      var btnTop = this.offsetTop;
      // 音量按钮相对于父级对象的上边距
      var volumeBarH = that.volumeBar.height();
      var btnW = $(this).width();
      that.bigSizeVideoWrap.on('mousemove', function (ev) {
        var thisY = (ev || window.event).clientY;
        // 移动后音量按钮离底部的位置
        var afterMovedH = volumeBarH - (thisY - that.mousePos.posY + btnTop + btnW);
        if (afterMovedH < 0) {
          afterMovedH = -btnW / 2;
        } else if (afterMovedH > volumeBarH) {
          afterMovedH = volumeBarH;
        }
        that.volumePoint.css('bottom', afterMovedH);
        that.loadedVolumeBar.height(volumeBarH - afterMovedH);
        var volumeRate = (afterMovedH / volumeBarH).toFixed(1);
        var totalVolume = 1;
        // 音量总量为1
        that.bigsizeVideo[0].volume = volumeRate * totalVolume;
        that._clearSelect();
      });
      that.bigSizeVideoWrap.on('mouseup', function () {
        that.bigSizeVideoWrap.off('mousemove');
        that.bigSizeVideoWrap.off('mouseup');
      });
      return false;
    });
    this.volumePoint.on('click', function () {
      return false;
    });
    // 监听鼠标位置  是否显示操作栏
    that.headControl.on('mouseover', function (e) {
      if (that.headControl.find('.read-container').css('display') == 'none') {
        that._setControlBar('show');
      }
      clearTimeout(optsObj.timer);
    });
    that.headControl.on('mouseleave', function (e) {
      that._setControlBar('hide');
    });
    that.footControl.on('mouseover', function (e) {
      if (that.footControl.find('.read-video-controls').css('display') == 'none') {
        that._setControlBar('show');
      }
      clearTimeout(optsObj.timer);
    });
    that.footControl.on('mouseleave', function (e) {
      that._setControlBar('hide');
    });
    // 全屏 退出全屏
    that.footControl.find('.read-full-screen').on('click', function () {
      if ($(this).hasClass('read-exit-full-screen')) {
        $(this).removeClass('read-exit-full-screen');
        that._exitFullScreen();
      } else {
        $(this).addClass('read-exit-full-screen');
        that._fullScreen();
      }
    });
    document.addEventListener('fullscreenchange', function () {
      if (!document.fullscreen) {
        that.footControl.find('.read-full-screen').removeClass('read-exit-full-screen');
      }
    }, false);
    document.addEventListener('mozfullscreenchange', function () {
      if (!document.mozFullScreen) {
        that.footControl.find('.read-full-screen').removeClass('read-exit-full-screen');
      }
    }, false);
    document.addEventListener('webkitfullscreenchange', function () {
      if (!document.webkitIsFullScreen) {
        that.footControl.find('.read-full-screen').removeClass('read-exit-full-screen');
      }
    }, false);
    document.addEventListener('msfullscreenchange', function () {
      if (!document.msFullscreenElement) {
        that.footControl.find('.read-full-screen').removeClass('read-exit-full-screen');
      }
    }, false);
  };
  /**
   * 显示或隐藏顶部底部控制栏
   * 
   */
  Video.prototype._setControlBar = function (handle) {
    var that = this;
    var optsObj = this.opts;
    if (handle == 'show') {
      that.headControl.find('.read-container').fadeIn();
      that.footControl.find('.read-video-controls').fadeIn();
    } else {
      optsObj.timer = setTimeout(function () {
        that.headControl.find('.read-container').fadeOut();
        that.footControl.find('.read-video-controls').fadeOut();
      }, 3000);
    }
  };
  /**
   * 获取视频当前音量，设置音量条的高度
   * 
   */
  Video.prototype._setVolumeBarH = function () {
    var curVol = this.bigsizeVideo[0].volume;
    var totalVol = 1;
    var volRate = ((1 - curVol) / totalVol).toFixed(1);
    var totalVolumeH = this.volumeBar.height();
    var curVolH = volRate * totalVolumeH;
    this.loadedVolumeBar.height(curVolH);
    this.volumePoint.css('bottom', curVol / totalVol * totalVolumeH);
  };
  /**
   * 设置视频播放或暂停
   * 
   */
  Video.prototype._setVideoPlayOrPause = function () {
    var curVideo = this.bigsizeVideo[0];
    if (curVideo.paused) {
      curVideo.play();
    } else {
      curVideo.pause();
    }
  };
  /**
   * 清除选择文本
   * 
   */
  Video.prototype._clearSelect = function () {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else {
      document.selection.empty();
    }
  };
  /**
   * 全屏
   * 
   */
  Video.prototype._fullScreen = function () {
    var docElm = document.documentElement;
    //W3C
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    }  //FireFox
    else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen();
    }  //Chrome等
    else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen();
    }  //IE11
    else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };
  /**
   * 退出全屏
   * 
   */
  Video.prototype._exitFullScreen = function () {
    var docElm = document.documentElement;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };
  /**
   * 打开视频插件，预览本章所有视频.
   * 
   * param {Object} videos {
   *                  name: 视频名字,
   *                  src: 源地址, http://static.spbook2.gli.cn//videos/movie.mp4
   *              } 
   */
  Video.prototype.open = function (videos) {
    var optsObj = this.opts;
    var that = this;
    optsObj.videoName = videos.name;
    optsObj.videoSrc = videos.src;
    that.bigsizeVideo[0].src = optsObj.videoSrc;
    // 当前时间进度
    that.bigSizeVideoWrap.find('.read-video-currenttime').html('00:00:00');
    // 总时间进度
    that.bigSizeVideoWrap.find('.read-video-totaltime').html('00:00:00');
    // 视频名称
    that.bigSizeVideoWrap.find('.read-video-title').html(optsObj.videoName);
    // 暂停遮罩
    that.pauseMask.show();
    optsObj.$domObj.fadeIn();
    // 隐藏控制栏
    that._setControlBar('hide');
    // 监听空格事件
    $('body').on('keypress', function (event) {
      if (event.keyCode === 32) {
        console.log('你按下了空格\uFF01\uFF01');
        that._setVideoPlayOrPause();
      }
    });
  };
  /**
   * 关闭预览视频插件.
   */
  Video.prototype.close = function () {
    var optsObj = this.opts;
    // 取消绑定空格事件
    $('body').off('keypress');
    // 左下角按钮变回播放按钮
    this.videoPlayIcon.removeClass('read-pause');
    optsObj.$domObj.fadeOut();
  };
  return Video;
}(js_src_global, js_libs_zeptodev, js_src_tool);
js_src_readerPC = function (window, $, tool, Api, Loader, TemplSet, Copyright, Config, Dialog, Msg, move, countpage, bookmark, selectPanel, notePanel, viewImgPanel, delicateType, Video) {
  var _ = window._;
  // 为小精灵接口定义回调函数;
  window.gli_ftp_download_cb = function () {
  };
  var LOG = tool.LOG;
  var LoadingObj = null;
  var commonDialog = null;
  // 实例化 网络请求API接口对象.
  var ApiObj = null;
  // 分页器
  var CountPageObj = null;
  // 版权保护
  var CopyrightObj = null;
  var bookmarkObj = null;
  var noteObj = null;
  var SelectObj = null;
  var PC = function (options) {
    LOG.log('[reader.js] --> 构造函数! ');
    // PC 默认为: 小精灵
    var defaults = {
      // a: 必须传入参数.
      domWrapId: '',
      // 阅读器 页面标签的 [属性id]. 如: "#110";
      hostUrl: '',
      // 书籍信息来源地址.
      book_id: '',
      // {String} 图书id.
      passData: null,
      // eg: {shop_id:2} 存放shop_id 等.
      // b: 可选传入参数(存有默认值).
      user_id: '',
      // {String} 用户id 可选.
      downloadPath: 'download/books',
      // 书籍数据读写模式. true: 加密模式; false: (默认)普通/明文 模式;
      isEncrypt: false,
      // true: 本阅读器只需要 下载功能(不需要初始化布局); false: (默认)阅读 +下载.
      // 如果 DOM元素的 宽高小于 "最小值", 则强制复制为 "true",并给出 警告日志信息.
      isOnlyDownload: false,
      // 一次性下载整本书。( true为一次性下载所有能读章节,false:看到哪章下哪章(默认值) )
      // isDownloadAllChapter: false,
      // 是否为 客户端(APP, C++), true: (默认)客户端, 需要缓存文件.读取本地文件; false: PC浏览器;
      isClient: true,
      // 是否为 手机, 用于: 绑定事件, 渲染布局;
      isMobile: false,
      // 默认的翻页方式
      pagingType: 'page_1',
      // 夜间模式
      isNightMode: false,
      // 是否允许保存图片到本地指定位置    默认允许true
      isDownloadImg: true,
      // true: 不分页,直接读取 epub源文件; false: 需要分页计算.
      useEpubFile: false,
      // true: 开启版权保护; false: 关闭版权保护
      usePublish: true,
      // 开关- 使用[书签]
      useBookmark: true,
      // 开关- 使用[笔记]
      useNote: true,
      // 开关- 使用[文字纠错]
      useCorrect: true,
      // 开关- 使用[版权投诉]
      useComplaint: true,
      // 开关- 使用[搜索]
      useSearch: true,
      // 开关- 使用[退出]
      useExit: true,
      // 开关- 使用[字体]
      useFonts: true,
      // 开关- 使用[背景颜色]
      useBgColor: true,
      // 开关- 使用[epub样式]
      useEpubStyle: true,
      // 视频
      useVideo: true,
      // 开关- 使用[背景图片]
      useBgImg: false,
      // 开关- 使用固定[菜单操作栏]
      useFixedMenu: true,
      // 开关- 试读(由reader控制试读内容范围 - 中原农民特殊要求 -- TODO -- 2016.11.28 -- 注: 后期须改为后台代码实现.)
      useProbation: false,
      // 开关- 使用[图文对照],原稿 -- manuscript.
      useManuscriptPic: false,
      // 记录书籍打开时间
      bookOpenTime: '',
      historyData: { page_offset: 105 },
      license_id: 'doc_110220330',
      // 加密 - 文件许可证号;
      server: 'server_101010101010',
      // 加密 - lockit服务器域名;
      // 自定义导航类菜单, 注意: 目前仅支持 2 个自定义菜单.
      custom_nav_menus: [],
      /** 
       * 算页过程中(分步返回),执行用户回调。
       * {function} 默认为 空函数.
       * 
       * 如: function(){
       *        // var pages = reader.getPagesAll();
       *        // data数据结构 与 reader.chapts 相同;
       *        // 在此完成业务逻辑。
       *     }
       */
      getDataCb: tool.emptyFunc,
      /** 
       * reader取得目录信息后,执行用户回调。
       *  {function} 默认为 空函数
       * 
       * 如: function(){
       *        // var pages = reader.getCatalogInfo();
       *        // 在此完成业务逻辑。
       *     }
       */
      getCatalogCb: tool.emptyFunc,
      /**
       * 书籍处于 试读状态，当翻到最后一页后 点击 获取下一章数据时触发回调; 
       * {function} 默认为 空函数
       * 
       * 约定: 回调方法逻辑--跳转页面.
       * 
       */
      probotionCb: tool.emptyFunc,
      /**
       * 退出 阅读器 回调函数.<br/>
       * {function} 默认为 空函数
       * 
       */
      exitReaderCb: tool.emptyFunc,
      /**
       * 使用reader下载图书，回调函数 -- 新华传媒. <br/>
       * 
       * 每下载一章就触发一次，更新下载进度.
       */
      downloadCb: tool.emptyFunc,
      /**
       * 点击 不可阅读目录时, 触发此函数. <br/>
       * ps: 试读.
       * 
       */
      getDisableChaptCb: tool.emptyFunc,
      // c: 不可传入参数
      // 是否渲染布局. true:使用布局, false: 不使用布局. 
      _useLayout: true,
      // 阅读器 外部容器;
      $readerWrap: null,
      // 阅读器 根节点对象;
      $readerObj: null,
      // 容器最小宽度 px.
      _minW: 300,
      // 容器最小高度 px.
      _minH: 500,
      // 下载状态 和 进度
      _downloadState: {
        'state': true,
        'rate': 0
      },
      // 正本数据 文字总数.
      totalLen: 0,
      chapt_index: 0,
      // {Number} 当前阅读章节下标, 第一章下标为0
      page_index: 0,
      // {Number} 图书每章节页码下标，第一页下标为1
      pageColumn: 1,
      // 一页显示几列
      // 分页用章节信息, 结构参考 方法: [countPage.js] getPagingData;
      chapts: null
    };
    this.opts = $.extend(true, {}, defaults, options);
    // 如果使用背景图则不使用背景颜色
    if (this.opts.useBgImg) {
      this.opts.useBgColor = false;
    }
    // 下载用
    this.opts.data = {
      // {Object} 目录;
      'catalog': null,
      // {Array} 可读章节信息 {"chapter_name":"", "chapter_id":"", isDownload: ""}
      'readableChapter': null,
      // {Object} 阅读进度. {"progressData":{"updateTime":1472022745833,"progress":"0.7804"}}
      'progressData': null,
      // {Object} 设置面板参数
      'settingData': null,
      // {Object} 版权保护参数
      'copyright': null
    };
    LoadingObj = new Loader({
      'domSelector': this.opts.domWrapId,
      'msg': Msg.loading,
      'clientType': this.opts.clientType
    });
    //          try {
    this._init();  //          } catch(e) {
                   //              console.error("[readerPC.js] --> 初始化异常!" + e);
                   //          }
  };
  PC.prototype._init = function () {
    var optsObj = this.opts;
    this._check();
    // 书籍打开时间
    optsObj.bookOpenTime = new Date().getTime();
    ApiObj = new Api({
      baseData: {
        hostUrl: optsObj.hostUrl,
        book_id: optsObj.book_id,
        user_id: optsObj.user_id,
        use_file_url: optsObj.useEpubFile
      },
      passData: optsObj.passData
    });
    if (optsObj.isClient) {
      //目录
      this.getCatalog = this._getCatalogOffline;
      //书签
      this.getBookmark = this._getBookmarkOffline;
      //笔记
      this.getNote = this._getNoteOffline;
      // 章节内容
      this.getChapterContent = this._getChapterOffline;
    } else {
      //目录
      this.getCatalog = this._getCatalogOnline;
      //书签
      this.getBookmark = this._getBookmarkOnline;
      //笔记
      this.getNote = this._getNoteOnline;
      // 章节内容
      this.getChapterContent = this._getChapterOnline;
    }
    this._refresh();
    if (optsObj.isOnlyDownload || optsObj.useEpubFile) {
      this.download();
    } else {
      // new 一个全局通用的dialog
      commonDialog = new Dialog({
        $wrapDomObj: optsObj.$readerWrap,
        isMobile: optsObj.isMobile,
        clientType: optsObj.clientType
      });
      // 布局, 绑定交互动画(事件);
      this._renderLayout();
      this._bindPanelEvent();
    }
  };
  /**
   * 检测传入参数. <br/>
   * 
   */
  PC.prototype._check = function () {
    var optsObj = this.opts;
    optsObj.$readerWrap = $(optsObj.domWrapId);
    // 检测 阅读器的 DOM标签.
    if (optsObj.isOnlyDownload || optsObj.domWrapId == '' || optsObj.length == 0 || optsObj.$readerWrap.width() < optsObj._minW || optsObj.$readerWrap.height() < optsObj._minH) {
      //  无效, 不渲染布局
      optsObj._useLayout = false;
    } else {
      //  有效.
      optsObj._useLayout = true;
      LoadingObj.open();
    }
  };
  /**
   * 重设参数后 刷新阅读器.<br/>
   * ps: 加密模式, 背景颜色, 图书id,,,等.
   * 
   * @author gli-gonglong-20160727.
   * 
   */
  PC.prototype._refresh = function () {
    var optsObj = this.opts;
    if (optsObj.isEncrypt) {
      // 加密模式. 这种方式 绑定成了 "对象.静态函数"
      this.saveFile = this._saveFileEnc;
      this.readFile = this._readFileDec;
    } else {
      // 普通模式,
      this.saveFile = tool._saveFileCommon;
      this.readFile = tool._readFileCommon;
    }
    // 如果不是客服端就不保存数据
    if (!optsObj.isClient) {
      this.saveFile = tool.emptyFunc;
      // 如果不是客服端且没有登陆，则关掉笔记和书签功能
      if (optsObj.user_id == '') {
        optsObj.useNote = false;
        optsObj.useBookmark = false;
      }
    }
  };
  PC.prototype._renderLayout = function () {
    var optsObj = this.opts;
    // 主面板: 文字内容区域, 顶部操作栏；
    optsObj.$readerObj = $('<div class=\'read-reader-pc\' />');
    optsObj.$readerWrap = $(optsObj.domWrapId);
    var mainTemplHtml = TemplSet.getTempl('main');
    var mainTempl = _.template(mainTemplHtml);
    var mainPageHtml = mainTempl();
    optsObj.$readerObj.html(mainPageHtml);
    optsObj.$readerWrap.append(optsObj.$readerObj);
    // 静态面板: 字体设置, 背景色设置, 版权投诉,搜索，  分页独立面板;
    var staticTemlHtml = TemplSet.getTempl('staticPanel');
    var staticTempl = _.template(staticTemlHtml);
    var shareItem = this._getShareItemsInfo();
    var staticPageHtml = staticTempl({ 'shareNotes': shareItem });
    optsObj.$readerObj.append(staticPageHtml);
    // 分页器面板
    var countPageTempl = TemplSet.getTempl('countpage');
    // 分页器
    CountPageObj = new countpage({
      templHtml: countPageTempl,
      $readerObj: optsObj.$readerObj,
      isMobile: optsObj.isMobile,
      clientType: optsObj.clientType,
      isClient: optsObj.isClient,
      pageColumn: optsObj.pageColumn,
      useEpubStyle: optsObj.useEpubStyle,
      useFixedMenu: optsObj.useFixedMenu,
      useProbation: optsObj.useProbation,
      useManuscriptPic: optsObj.useManuscriptPic
    });
    // 视频
    if (optsObj.useVideo) {
      var videoHtml = TemplSet.getTempl('video');
      var videoTempl = _.template(videoHtml);
      var $videoDom = $(videoTempl());
      optsObj.$readerObj.append($videoDom);
      this.videoPage = new Video({
        '$readerObj': optsObj.$readerObj,
        '$domObj': $videoDom,
        'isClient': optsObj.isClient,
        'isMobile': optsObj.isMobile,
        'clientType': optsObj.clientType
      });
    }
    // 精排
    this.delicateObj = new delicateType({ wrapDomObj: optsObj.$readerObj.find('.read-delicate')[0] });
    // 动态数据面板: 目录、笔记、书签、纠错
    this._renderViewImgPage();
    this._renderCbnPanel();
    this._renderCatalog();
    this._renderBookmark();
    this._bindCbnEvent();
    this._bindCountEvent();
    // 渲染设置面板数据
    this._renderSetting();
    // 版权保护
    this._renderCopyright();
    // 文本选择
    this._renderSelect();
    // 笔记
    this._renderNote();
  };
  PC.prototype._renderCbnPanel = function () {
    var optsObj = this.opts;
    var defaultMenu = [
      {
        text: '目录',
        name: 'catalog',
        state: 'read-active',
        view: 'read-catalog-body',
        prompt: '无目录'
      },
      {
        text: '笔记',
        name: 'note',
        state: '',
        view: 'read-note-body',
        prompt: '阅读时长按文字可添加笔记'
      },
      {
        text: '书签',
        name: 'bookmark',
        state: '',
        view: 'read-bookmark-body',
        prompt: '阅读时点击右上角的书签即可添加'
      }
    ];
    // 根据开关的值, 移除相应 "导航菜单".
    if (!optsObj.useBookmark) {
      // 移除 书签.
      defaultMenu.pop();
      $('#reader_setting_nav_rt .read-bookmark-view').hide();
    }
    if (!optsObj.useNote) {
      // 移除 笔记.
      defaultMenu.splice(1, 1);
    }
    // 添加默认样式, 'read-custom-body';
    var tmpCustomNavs = optsObj.custom_nav_menus;
    for (var j = 0, len = tmpCustomNavs.length; j < len; j++) {
      tmpCustomNavs[j].view = 'read-custom-body';
      tmpCustomNavs[j].state = tmpCustomNavs[j].state || '';
    }
    defaultMenu = defaultMenu.concat(optsObj.custom_nav_menus);
    // 自定义导航菜单 最多支持 2 个. 
    if (defaultMenu.length > 5) {
      defaultMenu = defaultMenu.slice(0, 5);
    }
    // 取出自定义导航的回调函数
    optsObj.customFunc = [];
    for (var i = 0; i < defaultMenu.length; i++) {
      var cbFunc = defaultMenu[i].cbFunc || tool.emptyFunc;
      optsObj.customFunc.push(cbFunc);
    }
    // cbnHeader
    var headerTemplHtml = TemplSet.getTempl('cbnHeader');
    var headerTemplObj = _.template(headerTemplHtml);
    var headerMenuHtml = headerTemplObj(defaultMenu);
    $('#cbn_header').html(headerMenuHtml);
    // cbnBody
    var bodyTemplHtml = TemplSet.getTempl('cbnBody');
    var bodyTemplObj = _.template(bodyTemplHtml);
    var bodyMenuHtml = bodyTemplObj(defaultMenu);
    $('#cbn_body').html(bodyMenuHtml);
  };
  PC.prototype._bindCountEvent = function () {
    var that = this;
    var optsObj = that.opts;
    var innerRenderCatalog = function () {
      var catalogTemlHtml = TemplSet.getTempl('catalog');
      var catalogTempl = _.template(catalogTemlHtml);
      var catalogData = optsObj.data.catalog;
      for (var i = 0, len = catalogData.chapter.length; i < len; i++) {
        var pageIndexInfo = CountPageObj.getPageIndex(i);
        catalogData.chapter[i].pageNum = pageIndexInfo.currPage;
      }
      var catalogHtml = catalogTempl(catalogData);
      $('#cbn_body .read-catalog-body').html(catalogHtml);
    };
    CountPageObj.on('countpage:getChapterContent', function (event, index) {
      that._pagingChapter(index);
    });
    // 页面显示
    CountPageObj.on('countpage:showPage', function (event, data) {
      // 先去精排dom内精排后取出精排数据
      if (optsObj.usePublish) {
        data.chapterContent = that.delicateObj.excute({ html: data.chapterContent });
        if (optsObj.pageColumn == 2) {
          data.secondPage = that.delicateObj.excute({ html: data.secondPage });
        }
      }
      that._showPage(data);
    });
    // 分页完成
    CountPageObj.on('countpage:finish', function (event, index) {
      var chapt = optsObj.chapts[index];
      var tempData = CountPageObj.getPagingData();
      chapt.pages = tempData.pages;
      chapt.images = tempData.images;
      chapt.html = tempData.html;
      chapt.isPretreat = tempData.isPretreat;
      //              innerRenderCatalog();
      // 执行注册回调函数
      optsObj.getDataCb();
    });
    // 分页显示数据准备完成
    CountPageObj.on('countpage:already', function () {
      LoadingObj.close();
      // 首次进入阅读器, 操作提示.
      if (optsObj.data.settingData.readTimes === 0) {
      }
    });
    // 保存图片
    CountPageObj.on('countpage:downloadPhoto', function (event, data) {
      that._downloadPhoto(data);
    });
    // 试读 -- 无权限阅读数据
    CountPageObj.on('countpage:noright', function (event, data) {
      optsObj.probotionCb();
    });
  };
  /**
   * 绑定cbn操作的事件,切换导航等.
   */
  PC.prototype._bindCbnEvent = function () {
    var that = this;
    var optsObj = that.opts;
    var currentIdx = 0;
    var cbnBody = $('#cbn_body');
    // 切换目录笔记书签
    $('#cbn_header').on('click', '.read-nav-menu', function () {
      currentIdx = $(this).index();
      $(this).addClass('read-active').siblings().removeClass('read-active');
      innerShowMenu(currentIdx);
    });
    function innerShowMenu(idx) {
      var $tmpCurrentNavBody = cbnBody.children().eq(idx);
      $tmpCurrentNavBody.removeClass('read-hide').siblings().addClass('read-hide');
      // 如果是切换到自定义导航则执行自定义导航的回调函数
      if ($tmpCurrentNavBody.hasClass('read-custom-body')) {
        optsObj.customFunc[idx]($tmpCurrentNavBody);
      }
    }
  };
  /**
   * 渲染目录. <br/>
   */
  PC.prototype._renderCatalog = function () {
    var optsObj = this.opts;
    var that = this;
    this.getCatalog(function (fileData) {
      console.log('[renderCatalog]' + fileData);
      optsObj.data.catalog = fileData;
      // 渲染 目录，并下载 默认 章节
      LOG.info('成功读取 目录数据 !', 'background:yellow;');
      optsObj.totalLen = parseInt(fileData.word_count);
      // 深度复制, 数组新建 指针.
      optsObj.chapts = $.extend(true, [], fileData.chapter);
      if (optsObj._useLayout) {
        LOG.info('执行 \u3010渲染布局\u3011!');
        var catalogTemlHtml = TemplSet.getTempl('catalog');
        var catalogTempl = _.template(catalogTemlHtml);
        // update by gonglong -- 2016.11.28 -- 修正目录百分比
        // 目录百分百计算时加上前面章节字数
        var txtlen = 0;
        var chapt = fileData.chapter;
        chapt[0].curtextlen = 0;
        for (var i = 1, len = chapt.length; i < len; i++) {
          txtlen += chapt[i - 1].textlen;
          chapt[i].curtextlen = txtlen;
        }
        var catalogHtml = catalogTempl(fileData);
        $('#cbn_body .read-catalog-body').html(catalogHtml);
        $('#cbn_body').on('click', '.read-sel-catalog', function () {
          var id = $(this).attr('data-id');
          var status = $(this).attr('data-status');
          var oldIndex = optsObj.chapt_index;
          var newIndex = CountPageObj.searchChaptIndex(id);
          if (status == 'false') {
            // 该章节无权限
            console.log('[reader.js] -->章节' + id + '无权限\uFF01');
            optsObj.getDisableChaptCb();
            return false;
          }
          // 如果不是当前章节
          if (oldIndex !== newIndex) {
            CountPageObj.turnChapter(newIndex);
          } else {
            that._closeAllPanel();
          }
        });
        // 检查分页数据准备情况
        that._checkPaging();
      }
    }, function () {
      LOG.info('[reader.js] --> _renderCatalog --> 渲染目录\uFF0C获取目录信息失败!');
      if (optsObj.isClient) {
        LOG.info('[APP阅读] 本地无目录信息, 执行下载 !', 'background:pink;');
        // 本地无数据, 执行下载(目录, 章节);.
        that.download();
        LoadingObj.setMsg(Msg.downloadBooks);
      }
    });
  };
  /**
   * 渲染 设置面板. <br/>
   * 
   */
  PC.prototype._renderSetting = function () {
    console.info('%c _renderSetting', 'background:yellow;');
    var optsObj = this.opts;
    var that = this;
    innerSetDisplay();
    var tmpData = optsObj.data;
    that._getProgressDataOffline(function (data) {
      // 获取服务器保存的阅读进度，并和本地保存的进度进行比较
      that._getProgressDataOnline(function (onlineData) {
        if (parseInt(onlineData.bookCloseTime) > parseInt(data.progressData.updateTime)) {
          tmpData.progressData = {
            'updateTime': onlineData.bookCloseTime,
            'progress': onlineData.progress
          };
        } else {
          tmpData.progressData = data.progressData;
        }
        that._getSettingDataOffline(function (data) {
          tmpData.settingData = data.settingData;
          innerSuccessCb();
        }, function () {
          innnerErrorCb();
        });
      }, function () {
        tmpData.progressData = data.progressData;
        that._getSettingDataOffline(function (data) {
          tmpData.settingData = data.settingData;
          innerSuccessCb();
        }, function () {
          innnerErrorCb();
        });
      });
    }, function () {
      // error
      innnerErrorCb();
    });
    function innnerErrorCb() {
    }
    function innerSuccessCb() {
      // 快速翻页
      $('#reader_setting_nav_md input').bind('blur keypress', function (event) {
        // 回车执行
        if (event.keyCode === 13) {
          //                      var val = $(this).val();
          //                      if(!isNaN(val)) {
          //                          val = parseInt(val);
          //                          val = val < 1 ? 1 : val;
          //                          CountPageObj.turnPageById(val);
          //                      };
          var perc = $(this).val();
          if (!isNaN(perc)) {
            perc = parseFloat(perc) / 100;
            perc = perc < 0 ? 0 : perc;
            perc = perc > 1 ? 1 : perc;
            CountPageObj.turnPageByPerc(perc);
          } else {
            console.warn('请输入正浮点数\uFF01');
            $(this).val(CountPageObj.getFootPerc() * 100);
          }
        }
      });
      // 设置背景颜色的checkbox并设置背景颜色
      innerBgColor();
      // 设置字体大小选中
      innerSetFontSize();
      // 设置字体类型
      innerSetFontFamily();
      // 设置背景颜色
      function innerBgColor() {
        var bgVal = tmpData.settingData.bgColor.value;
        if (optsObj.useBgImg && optsObj.pageColumn == 2) {
          bgVal = 'img';
        }
        // 修改主面板背景颜色及选中
        that._setBgColor({
          'oldValue': bgVal,
          'newValue': bgVal
        });
      }
      // 设置字体大小
      function innerSetFontSize() {
        // 获取设置数据里的字体大小值 并设置到字体设置面板的字体大小的样式
        var fsizeVal = tmpData.settingData.fontSize.value;
        $('#font_size_change').find('a[data-class=\'' + fsizeVal + '\']').addClass('read-active').siblings().removeClass('read-active');
        // 修改主面板字体大小
        that._setFontSize({
          'oldValue': fsizeVal,
          'newValue': fsizeVal
        });
      }
      // 设置字体类型
      function innerSetFontFamily(options) {
        var familyVal = tmpData.settingData.fontFamily.value;
        $('#font_fm_change li').addClass('read-active').siblings().removeClass('read-active');
        $('#font_fm_change li').find('input[data-class=\'' + familyVal + '\']').attr('checked', 'checked');
        // 修改主面板字体大小
        that._setFontFamily({
          'oldValue': familyVal,
          'newValue': familyVal
        });
      }
    }
    // 根据开关设置是否显示
    function innerSetDisplay() {
      if (!optsObj.useComplaint) {
        $('#reader_setting_nav_lf .read-com-btn').css('display', 'none');
      }
      if (!optsObj.useSearch) {
        $('#reader_setting_nav_rt input').css('visibility', 'hidden');
        $('#reader_setting_nav_rt .read-search-btn').css('visibility', 'hidden');
      }
      if (!optsObj.useExit) {
        $('#reader_setting_nav_rt .read-exit-btn').css('visibility', 'hidden');
      }
      if (!optsObj.useFonts) {
        $('#reader_setting_nav_lf .read-aa-btn').css('display', 'none');
      }
      if (!optsObj.useBgColor) {
        $('#reader_setting_nav_lf .read-color-btn').css('display', 'none');
      }
      if (!optsObj.useManuscriptPic) {
        $('#reader_setting_nav_lf .read-imgtxt-btn').css('display', 'none');
      }
    }
  };
  /**
   * 版权保护. <br/>
   * 
   */
  PC.prototype._renderCopyright = function () {
    var optsObj = this.opts;
    var that = this;
    CopyrightObj = new Copyright({
      $readerObj: optsObj.$readerObj,
      isMobile: optsObj.isMobile,
      clientType: optsObj.clientType,
      coprData: Config.copyright,
      api: ApiObj
    });
    // TODO, 此处版权保护 因回调函数必须为全局函数，所以将 [CopyrightObj] 暴露为全局对象;
    window.ReaderCopyRight = CopyrightObj;
    // 保存版权保护参数
    CopyrightObj.on('Copyright:saveCoprParam', function (event, data) {
      optsObj.data.copyright = data;
      that._saveCopyright();
    });
    // 获取离线状态下版权保护参数
    CopyrightObj.on('Copyright:getCoprParam', function () {
      that._getCoprDataOffline(function (data) {
        that.opts.data.copyright = data.coprData;
        CopyrightObj.opts.copyright = data.coprData;
        CopyrightObj.run();
      }, function () {
        CopyrightObj.run();
      });
    });
    // 退出阅读器
    CopyrightObj.on('Copyright:exitReaderCb', function () {
      that.exit();
    });
  };
  /**
   * 选择文本面板, 并监听其相关事件. <br/>
   * 
   * @author gli-jiangxq-20160919
   */
  PC.prototype._renderSelect = function () {
    var optsObj = this.opts;
    var that = this;
    SelectObj = new selectPanel({
      $readerObj: optsObj.$readerObj,
      isMobile: optsObj.isMobile,
      clientType: optsObj.clientType,
      coprObj: CopyrightObj,
      useNote: optsObj.useNote,
      useCorrect: optsObj.useCorrect,
      pageColumn: optsObj.pageColumn
    });
    // 增加划线
    SelectObj.on('Select:addUnderline', function (event, data) {
      var newData = innerSetData(data);
      noteObj.addUnderline(newData);
    });
    // 删除划线
    SelectObj.on('Select:delUnderline', function (event, noteid) {
      noteObj.delNote({
        'chapterid': optsObj.chapts[optsObj.chapt_index].chapter_id,
        'noteid': noteid
      });
    });
    // 增加笔记
    SelectObj.on('Select:addNote', function (event, data) {
      var newData = innerSetData(data);
      noteObj.editNote(newData);
    });
    // 纠错文字
    SelectObj.on('Select:correct', function (event, data) {
      var newData = innerSetData(data);
      noteObj.openCorrect(newData);
    });
    function innerSetData(data) {
      var chapter = optsObj.chapts[optsObj.chapt_index];
      data.chapter_id = chapter.chapter_id;
      data.chapter_name = chapter.chapter_name;
      var pageIndex = data.currPage == 2 ? optsObj.page_index : optsObj.page_index - 1;
      data.note_page = data.posLen / optsObj.totalLen + parseFloat(CountPageObj.getHeadPerc(pageIndex));
      data.note_page = data.note_page.toFixed(4);
      delete data.posLen;
      delete data.currPage;
      return data;
    }
  };
  /**
   * 渲染笔记. <br/>
   * 
   */
  PC.prototype._renderNote = function () {
    var optsObj = this.opts;
    var that = this;
    // 判断开关, 是否使用书签.  TODO: 目前PC端笔记和纠错代码逻辑没有分开写，必须new笔记对象noteObj
    //          if(!optsObj.useNote) {
    //              return;
    //          }
    innerRenderNote();
    this.getNote(function (fileData) {
      // 如果是客户端，先下载服务器上的笔记，并和本地的笔记进行比较，如果本地笔记更新时间晚，批量更新服务器笔记
      if (optsObj.isClient) {
        var uploadNote = tool.filterLocalData(fileData.note_list);
        if (uploadNote.length == 0) {
          // 本地无更新
          innerGetLatestNote();
        } else {
          noteObj.batchUpdateNote({
            'time_stamp': fileData.time_stamp,
            'note_list': uploadNote
          }, function (data) {
            innerGetLatestNote();
          }, function (data) {
            // 批量更新失败.
            noteObj.renderLayout(fileData);
          });
        }
      } else {
        noteObj.renderLayout(fileData);
      }
      function innerGetLatestNote() {
        that._getNoteOnline(function (latestNote) {
          var filePath = that._getCachePath({ 'fileName': 'note' });
          var dataStr = JSON.stringify(latestNote);
          that.saveFile(filePath, dataStr);
          noteObj.renderLayout(latestNote);
        }, function () {
          // 获取最新笔记信息失败
          noteObj.renderLayout(fileData);
        });
      }
    }, function () {
      LOG.warn('[reader.js] --> _renderNote --> 渲染笔记\uFF0C获取笔记信息失败!');
      if (optsObj.isClient) {
        LOG.info('[APP阅读] 本地无笔记信息, 执行下载 !', 'background:pink;');
        that._downloadNote();
      } else {
        noteObj.renderLayout();
      }
    });
    function innerRenderNote() {
      var noteTemlHtml = TemplSet.getTempl('note');
      // 创建note的filePath
      var noteFilePath = that._getCachePath({ 'fileName': 'note' });
      noteObj = new notePanel({
        $readerObj: optsObj.$readerObj,
        tmplHtml: noteTemlHtml,
        data: null,
        isMobile: optsObj.isMobile,
        isClient: optsObj.isClient,
        clientType: optsObj.clientType,
        saveFile: that.saveFile,
        filePath: noteFilePath,
        note_share_conf: optsObj.note_share_conf,
        api: ApiObj
      });
      noteObj.on('panelNote:close', function () {
        that._closeAllPanel();
      });
      noteObj.on('panelNote:click', function (e, percent) {
        CountPageObj.turnPageByPerc(percent);
      });
    }
  };
  /**
   * 获取"分享笔记" 布局相应信息.<br/>
   * 
   * 
   * @return shareItems {Array}
   * @author gli-gonglong-20161018
   * 
   */
  PC.prototype._getShareItemsInfo = function () {
    var optsObj = this.opts;
    var that = this;
    var defaultConf = {
      'flag': false,
      'share_items': [
        {
          // 微信好友
          'type': 'wx',
          //  开关(是否使用该分享). false: 关闭(默认); true: 打开,此时必须注册回调函数!
          'flag': false,
          // 回调函数--分享逻辑
          'share_cb': null
        },
        {
          // 微信朋友圈
          'type': 'wx_moments',
          'flag': false,
          'share_cb': null
        },
        {
          // 新浪微博
          'type': 'sina_weibo',
          'flag': false,
          'share_cb': null
        },
        {
          // qq好友
          'type': 'qq',
          'flag': false,
          'share_cb': null
        },
        {
          // qq空间
          'type': 'qq_zone',
          'flag': false,
          'share_cb': null
        }
      ]
    };
    var propInfo = {
      'wx': {
        'txt': '微信好友',
        'icon_css': 'read-icon-wx'
      },
      'wx_moments': {
        'txt': '微信朋友圈',
        'icon_css': 'read-icon-wx-pyq'
      },
      'sina_weibo': {
        'txt': '新浪微博',
        'icon_css': 'read-icon-wb'
      },
      'qq': {
        'txt': 'qq好友',
        'icon_css': 'read-icon-qq'
      },
      'qq_zone': {
        'txt': 'qq空间',
        'icon_css': 'read-icon-qzone'
      }
    };
    var currentConf = $.extend(true, {}, defaultConf, optsObj.note_share_conf);
    var shareItems = [];
    if (currentConf.flag) {
      // 开启"分享"功能.
      var tmpItems = currentConf.share_items;
      var tmp = {};
      var tmpType = '';
      for (var i = 0, len = tmpItems.length; i < len; i++) {
        if (tmpItems[i].flag) {
          // 开启 分享的具体渠道.
          tmpType = tmpItems[i].type;
          tmp = {
            'flag': true,
            'icon_css': propInfo[tmpType].icon_css,
            'txt': propInfo[tmpType].txt,
            'type': tmpType
          };
          shareItems.push(tmp);
        }
      }
    }
    return shareItems;
  };
  /**
   * 渲染 图片预览面板. <br/>
   * 
   */
  PC.prototype._renderViewImgPage = function () {
    var that = this;
    var optsObj = this.opts;
    this._viewImgPage = new viewImgPanel({
      '$wrapObj': optsObj.$readerObj,
      'dataTempl': TemplSet.getTempl('picture'),
      'isClient': optsObj.isClient,
      'isMobile': optsObj.isMobile,
      'clientType': optsObj.clientType,
      'isDownloadImg': optsObj.isDownloadImg
    });
  };
  /**
   * 渲染书签. <br/>
   * 
   */
  PC.prototype._renderBookmark = function () {
    var optsObj = this.opts;
    var that = this;
    // 判断开关, 是否使用书签
    if (!optsObj.useBookmark) {
      return;
    }
    innerRenderBookmark();
    this.getBookmark(function (fileData) {
      // 渲染 书签.
      LOG.info('成功读取 书签数据 !', 'background:yellow;');
      // 如果是客户端，先下载服务器上的书签，并和本地的书签进行比较，如果本地书签更新时间晚，批量更新服务器书签
      if (optsObj.isClient) {
        var uploadMark = tool.filterLocalData(fileData.bookmark_list);
        if (uploadMark.length == 0) {
          // 本地无更新
          innerGetLatestBookmark();
        } else {
          bookmarkObj.batchUpdateBookmark({
            'time_stamp': fileData.time_stamp,
            'mark_list': uploadMark
          }, function () {
            innerGetLatestBookmark();
          }, function () {
            // 批量更新失败.
            bookmarkObj.renderLayout(fileData);
          });
        }
      } else {
        bookmarkObj.renderLayout(fileData);
      }
      function innerGetLatestBookmark() {
        that._getBookmarkOnline(function (latestBookmark) {
          var filePath = that._getCachePath({ 'fileName': 'bookmark' });
          var dataStr = JSON.stringify(latestBookmark);
          that.saveFile(filePath, dataStr);
          bookmarkObj.renderLayout(latestBookmark);
        }, function () {
          // 获取最新书签失败。
          bookmarkObj.renderLayout(fileData);
        });
      }
    }, function () {
      LOG.warn('[readerPC.js] --> _renderBookmark --> 渲染书签\uFF0C获取书签信息失败!');
      if (optsObj.isClient) {
        LOG.info('[APP阅读] 本地无书签信息, 执行下载 !', 'background:pink;');
        that.downloadBookmark();
      }
    });
    function innerRenderBookmark() {
      var bookmarkTemlHtml = TemplSet.getTempl('bookmark');
      // 创建bookmark的filePath
      var bookmarkFilePath = that._getCachePath({ 'fileName': 'bookmark' });
      bookmarkObj = new bookmark({
        data: null,
        tmplHtml: bookmarkTemlHtml,
        isMobile: optsObj.isMobile,
        clientType: optsObj.clientType,
        isClient: optsObj.isClient,
        markDomObj: $('#reader_setting_nav_rt .read-bookmark-view'),
        saveFile: that.saveFile,
        api: ApiObj,
        filePath: bookmarkFilePath
      });
      // 书签的跳转，删除
      that._bindBookmark();
    }
  };
  /**
   * PC -- cbn面板书签的跳转与删除
   */
  PC.prototype._bindBookmark = function () {
    // 跳转
    $('#cbn_body .read-bookmark-body').on('click', '.read-original-text', function () {
      var pageSite = $(this).parents('.read-bookmark').attr('data-page');
      CountPageObj.turnPageByPerc(pageSite);
    });
    // 删除
    $('#cbn_body .read-bookmark-body').on('click', '.read-bookmark-del', function () {
      var bid = $(this).parents('.read-bookmark').attr('data-bookmarkid');
      var cid = $(this).parents('.read-bookmark').attr('data-chapterid');
      var bookmarkData = {
        'bookmarkid': bid,
        'chapterId': cid
      };
      bookmarkObj.delBookmark(bookmarkData);
    });
  };
  /**
   * 取得本地图书书签(手机, C++)。<br/>
   * 
   * 如果获取数据失败 或 不可读, 则认为: "数据损坏", 并执行重新下载!
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function} 获得数据失败 执行回调函数.
   * 
   */
  PC.prototype._getBookmarkOffline = function (successCb, errorCb) {
    LOG.log('[readerPC.js] -> _getBookmarkOffline! ');
    var optsObj = this.opts;
    var filePath = this._getCachePath({ fileName: 'bookmark' });
    this.readFile(filePath, function readBookmark(data) {
      // null == data是普通读取，data.status == 'false'是加密读取判断
      if (null == data || data.status == 'false') {
        errorCb();
      } else {
        if (!!data.doc_code) {
          data = data.doc_code;
        }
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 取得在线图书书签(web)。<br/>
   * 
   * 如果获取数据失败 或 不可读, 则认为: "数据损坏", 弹出提示框!
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function} 获得数据失败 执行回调函数.
   * 
   */
  PC.prototype._getBookmarkOnline = function (successCb, errorCb) {
    LOG.log('[readerPC.js] -> _getBookmarkOnline! ');
    ApiObj.getBookmark({}, function (data) {
      successCb(data);
    }, function (result) {
      console.warn('[reader.js]--获取书签信息失败!');
      errorCb(result);
    });
  };
  /**
   * 下载图书书签. <br/>
   * 
   */
  PC.prototype.downloadBookmark = function () {
    var that = this;
    var optsObj = this.opts;
    LOG.log('[Mobile.js] -> downloadBookmark ' + optsObj.book_id);
    // 1. 书签 -- bookmark;
    var filePath = that._getCachePath({ fileName: 'bookmark' });
    this._getBookmarkOnline(function (data) {
      LOG.log('成功下載 书签 并 保存!');
      var dataStr = JSON.stringify(data);
      that.saveFile(filePath, dataStr);
      setTimeout(function () {
        bookmarkObj.renderLayout(data);
      }, 300);
    }, function (result) {
      LOG.warn('[Mobile.js] -> downloadBookmark ' + result);
    });
  };
  /**
   * 绑定各面板的操作交互、面板弹出的动画等 <br/>.
   * 
   */
  PC.prototype._bindPanelEvent = function () {
    var that = this;
    var optsObj = this.opts;
    var staticPanel = $('#reader_static_panel');
    // cbn、字体设置 、颜色设置、版权投诉 按钮点击
    $('#reader_setting_nav_lf').on('click', '.read-sel-comm-btn', function () {
      var panelId = $(this).attr('data-panel-id');
      innerNavAnima(panelId);
    });
    // 版权投诉 发送
    $('#reader_complain_panel .read-send').on('click', function () {
      that._sendComplaint();
    });
    // 版权投诉 取消
    $('#reader_complain_panel .read-cancel').on('click', function () {
      $('#reader_complain_panel textarea').val('');
      that._closeAllPanel();
    });
    // 点击背景颜色按钮
    $('#reader_setting_nav_lf .read-color-btn').on('click', function () {
      that._closeAllPanel();
      var $bgPanel = $('#bgcolor_panel');
      if ($bgPanel.hasClass('read-hide')) {
        $bgPanel.removeClass('read-hide');
        setTimeout(function () {
          move($bgPanel.find('.read-bgcolor-box')[0]).set('height', '216px').duration('0.2s').end();
        }, 10);
      } else {
        move($bgPanel.find('.read-bgcolor-box')[0]).set('height', '0px').duration('0.2s').end();
        setTimeout(function () {
          $bgPanel.addClass('read-hide');
        }, 200);
      }
    });
    // 切换背景颜色
    $('#bgcolor_panel .read-bgcolor-content').on('click', '.read-content', function () {
      // 背景色当前值
      var oldVal = optsObj.data.settingData.bgColor.value;
      // 获取需设置的背景颜色新值 
      var newVal = $(this).attr('data-class');
      var tmpFontSize = {
        'oldValue': oldVal,
        'newValue': newVal
      };
      that._setBgColor(tmpFontSize);
      // 修改optsObj.data的背景颜色的value
      optsObj.data.settingData.bgColor.value = newVal.slice(-1);
      // 存储设置数据
      that._saveSettingFile();
    });
    // 点击处背景颜色框外空白区域
    $('#bgcolor_panel .read-bgcolor-cover ').on('click', function () {
      var $bgPanel = $('#bgcolor_panel');
      move($bgPanel.find('.read-bgcolor-box')[0]).set('height', '0px').duration('0.2s').end();
      setTimeout(function () {
        $bgPanel.addClass('read-hide');
      }, 200);
    });
    // 切换字体大小
    $('#font_size_change').on('click', '.read-a-btn', function () {
      LoadingObj.setMsg(Msg.changeFont);
      LoadingObj.open();
      //修改选中的样式
      $(this).addClass('read-active').siblings().removeClass('read-active');
      // 字体大小class当前值
      var oldVal = optsObj.data.settingData.fontSize.value;
      // 获取需设置的背景颜色class
      var newVal = $(this).attr('data-class');
      var tmpFontSize = {
        'oldValue': oldVal,
        'newValue': newVal
      };
      that._setFontSize(tmpFontSize);
      // 修改optsObj.data的背景颜色的value
      optsObj.data.settingData.fontSize.value = newVal;
      // 存储设置数据
      that._saveSettingFile();
    });
    // 切换图文对照模式
    $('#imgtxt_change').on('click', 'li', function () {
      LoadingObj.setMsg(Msg.changeImgtxt);
      LoadingObj.open();
      //修改选中的样式
      $(this).addClass('read-active').siblings().removeClass('read-active');
      // 获取需设置的背景颜色class
      //data-model 为1:正常模式;2:只显示原稿;3:图文对照
      var newVal = $(this).attr('data-model');
      // TODO
      console.log('阅读模式切换为  ' + newVal);
      LoadingObj.close();
    });
    // 切换字体类型
    $('#font_fm_change').on('click', '.read-choose-fm', function () {
      LoadingObj.setMsg(Msg.changeFont);
      LoadingObj.open();
      //修改选中的样式
      $(this).parents('li').addClass('read-active').siblings().removeClass('read-active');
      // 字体类型当前值
      var oldVal = optsObj.data.settingData.fontFamily.value;
      // 获取需设置的字体类型新值
      var newVal = $(this).attr('data-class');
      var tmpFontSize = {
        'oldValue': oldVal,
        'newValue': newVal
      };
      that._setFontFamily(tmpFontSize);
      // 修改optsObj.data的背景颜色的value
      optsObj.data.settingData.fontFamily.value = newVal;
      // 存储设置数据
      that._saveSettingFile();
    });
    // 上一页 下一页
    $('#reader_setting_nav_md').on('click', '.read-sel-comm-btn', function () {
      if ($(this).hasClass('read-prev')) {
        that.prev();
      } else {
        that.next();
      }
    });
    // 鼠标移入翻页区域提示
    var prevArea = $('#reader_main_panel .read-body .read-prev-paging');
    var nextArea = $('#reader_main_panel .read-body .read-next-paging');
    prevArea.on('mouseover', function () {
      $(this).addClass('read-active');
    });
    prevArea.on('mouseout', function () {
      $(this).removeClass('read-active');
    });
    nextArea.on('mouseover', function () {
      $(this).addClass('read-active');
    });
    nextArea.on('mouseout', function () {
      $(this).removeClass('read-active');
    });
    // 主面板左右翻页
    prevArea.on('click', function () {
      that.prev();
    });
    nextArea.on('click', function () {
      that.next();
    });
    // 点击书签
    $('#reader_setting_nav_rt .read-bookmark-btn').on('click', function (e) {
      var thisChapterObj = optsObj.chapts[optsObj.chapt_index];
      var bookmarkData = {
        'pageSite': CountPageObj.getFootPerc(),
        'text': thisChapterObj.pages[optsObj.page_index - 1].txt,
        'chapterId': thisChapterObj.chapter_id,
        'chapterName': thisChapterObj.chapter_name
      };
      if ($(this).hasClass('read-active')) {
        bookmarkObj.delBookmark();
      } else {
        bookmarkObj.addBookmark(bookmarkData);
      }
    });
    // 点击搜索
    $('#reader_setting_nav_rt').on('click', '.read-sel-comm-btn', function () {
      innerSearch();
    });
    // 回车搜索
    $('#reader_setting_nav_rt input').on('keypress', function (event) {
      if (event.keyCode === 13) {
        innerSearch();
      }
    });
    // 点击蒙层
    $('#reader_panel_mask').on('click', function () {
      that._closeAllPanel();
    });
    // 点击退出
    $('#reader_setting_nav_rt .read-exit-btn').on('click', function () {
      that.exit();
    });
    // main面板操作 (视频音频等)
    $('#reader_main_panel .read-chapter-content').on('click', function (e) {
      var targetObj = e.target;
      var imgIdx = targetObj.getAttribute('data-index');
      if (targetObj.nodeName == 'IMG' && targetObj.getAttribute('data-cover') != 1) {
        console.info('[readerPC.js]-> 点击了图片!');
        that._viewImgPage.setOptions({
          'imgSet': optsObj.chapts[optsObj.chapt_index].images,
          'currentIdx': imgIdx
        });
        that._viewImgPage.open();
        return;
      } else if (targetObj.nodeName == 'VIDEO') {
        if (optsObj.useVideo) {
          console.info('[readerPC.js]-> 点击了视频!');
          var videoSrc = targetObj.getAttribute('src') || targetObj.querySelector('source').getAttribute('src');
          var videoName = targetObj.getAttribute('data-name') || videoSrc.split('/').pop();
          that.videoPage.open({
            'src': videoSrc,
            'name': videoName
          });
          return;
        }
      }
      var readerOffset = optsObj.$readerObj.offset();
      var headContorl = $('#reader_main_panel .read-header');
      var eX = e.clientX - readerOffset.left;
      var eY = e.clientY - readerOffset.top;
      var eventPos = Math.floor(eX / readerOffset.width * 100);
      var animateH = 50;
      if (!optsObj.useFixedMenu && 30 < eventPos && eventPos <= 70) {
        // 点击 中部区域, 弹出设置面板;
        console.log('弹出设置面板');
        headContorl.toggleClass('read-active');
        if (!headContorl.hasClass('read-active')) {
          animateH = -50;
        }
        move(headContorl[0]).translate(0, animateH).duration('0.2s').end();
      }
    });
    // 点击搜索图标和回车搜索
    var innerSearch = function () {
      if (optsObj.isClient) {
        // 离线搜索
        that.sendSearch = that._sendSearchOffline;
      } else {
        //在线搜索
        that.sendSearch = that._sendSearchOnline;
      }
      var rtDiv = $('#reader_setting_nav_rt');
      var val = rtDiv.find('input').val();
      // 没输入内容则不弹出搜索框
      if (val) {
        var panelId = rtDiv.find('.read-search-btn').attr('data-panel-id');
        innerNavAnima(panelId, -1);
        that.sendSearch(val);
      } else {
        commonDialog.setMsg(Msg.inputContent);
        commonDialog.open();
      }
    };
    // 顶部左侧菜单操作栏相关面板 切换动画.
    var innerNavAnima = function (panelId, direction) {
      // 蒙层
      staticPanel.show();
      // 判断是否有面板显示
      var isFirstAnimate = true;
      var $animatePanel = $(panelId);
      // 传入domid 错误
      if ($animatePanel.length === 0) {
        console.error('[innerNavAnima]--> DOM not exist!');
        return;
      }
      direction = direction || 1;
      // 根据打开左右侧面板 修改animateWidth的值为正数或者负数
      var animateWidth = direction * $animatePanel.width();
      var $brotherPanel = $animatePanel.siblings('.read-animateShow');
      if ($brotherPanel.length > 0) {
        // 关闭 旧面板
        isFirstAnimate = false;
        // 如果是右侧面板则修改animateWidth的值为反数
        if ($brotherPanel.attr('id') === 'reader_search_panel') {
          direction = -1;
        }
        move($brotherPanel[0]).translate(-animateWidth * direction, 0).duration('0.4s').end();
        // 移出 动画状态
        $brotherPanel.removeClass('read-animateShow');
      }
      if (isFirstAnimate) {
        animateShowPanel();
      } else {
        setTimeout(function () {
          animateShowPanel();
        }, 200);
      }
      // 打开新面板
      function animateShowPanel() {
        $animatePanel.addClass('read-animateShow');
        move($animatePanel[0]).translate(animateWidth, 0).duration('0.5s').end();
      }
      console.info('[panelId]' + panelId);
    };
  };
  /** 设置 主面板背景颜色. <br/>
   * 
   * @param {Object} options
   * 
   */
  PC.prototype._setBgColor = function (options) {
    var that = this;
    var optsObj = that.opts;
    var tmpFontSize = {
      'oldValue': '',
      'newValue': ''
    };
    tmpFontSize.oldValue = 'read-bg-' + options.oldValue;
    tmpFontSize.newValue = 'read-bg-' + options.newValue;
    // 主面板背景颜色
    $('#reader_main_panel .read-chapter-content').removeClass(tmpFontSize.oldValue).addClass(tmpFontSize.newValue);
    $('#bgcolor_panel').find('.read-content[data-class=\'' + options.newValue + '\'] input').prop('checked', 'checked');
  };
  /** 设置 主面板字体大小. <br/>
   * 
   * @param {Object} options
   * 
   */
  PC.prototype._setFontSize = function (options) {
    var that = this;
    var optsObj = that.opts;
    var tmpFontSize = {
      'oldValue': '',
      'newValue': ''
    };
    tmpFontSize.oldValue = 'read-size-' + options.oldValue;
    tmpFontSize.newValue = 'read-size-' + options.newValue;
    // 主面板字体大小
    $('#reader_main_panel .read-chapter-content .read-content').removeClass(tmpFontSize.oldValue).addClass(tmpFontSize.newValue);
    $('#reader_main_panel .read-chapter-content .read-delicate-container').removeClass(tmpFontSize.oldValue).addClass(tmpFontSize.newValue);
    // 修改分页面板的字体大小
    that._deletePages();
    CountPageObj.setFontSize(options);
  };
  /**
   * 设置 主面板字体类型. <br/>
   * 
   * @param {Object} options
   * 
   */
  PC.prototype._setFontFamily = function (options) {
    var that = this;
    var optsObj = that.opts;
    var tmpFamily = {
      'oldValue': '',
      'newValue': ''
    };
    tmpFamily.oldValue = 'read-font-family-' + options.oldValue;
    tmpFamily.newValue = 'read-font-family-' + options.newValue;
    // 主面板字体类型
    $('#reader_main_panel .read-chapter-content').removeClass(tmpFamily.oldValue).addClass(tmpFamily.newValue);
    // 修改分页面板的字体类型
    that._deletePages();
    CountPageObj.setFontFamily(options);
  };
  /**
   * 发送版权投诉 (在线功能)
   */
  PC.prototype._sendComplaint = function () {
    var that = this;
    var optsObj = that.opts;
    var sendBtn = $('#reader_complain_panel .read-send');
    var val = $('#reader_complain_panel textarea').val();
    var sucessDialog = null;
    // 验证传送内容是否为空
    if (val.length != 0) {
      // 控制投诉间隔时间
      var nowTime = new Date().getTime();
      var deltaTime = sendBtn.attr('data-complaint') ? nowTime - sendBtn.attr('data-complaint') : nowTime;
      if (deltaTime > 20000) {
        sucessDialog = new Dialog({
          $wrapDomObj: optsObj.$readerObj,
          isMobile: optsObj.isMobile,
          clientType: optsObj.clientType,
          okBtn: {
            txt: '确定',
            cssClass: '',
            func: function () {
              that._closeAllPanel();
              sucessDialog.destroy();
            }
          },
          cancelBtn: {
            txt: '离开',
            cssClass: '',
            func: function () {
              that._closeAllPanel();
              sucessDialog.destroy();
            }
          }
        });
        LoadingObj.setMsg(Msg.dealWith);
        LoadingObj.open();
        ApiObj.sendComplaint({ 'complaint_val': val }, function (data) {
          $('#reader_complain_panel textarea').val('');
          LoadingObj.close();
          if (data.status) {
            sucessDialog.setMsg(Msg.compSucess);
            sucessDialog.open();
            sendBtn.attr('data-complaint', new Date().getTime());
          } else {
            sucessDialog.setMsg(data.error);
            sucessDialog.open();
          }
        }, function () {
          LoadingObj.close();
          commonDialog.setMsg(Msg.sendError);
          commonDialog.open();
        });
      } else {
        commonDialog.setMsg(Msg.compInterval);
        commonDialog.open();
      }
    } else {
      commonDialog.setMsg(Msg.inputContent);
      commonDialog.open();
    }
  };
  /**
   * 发送搜索keyword  Offline. <br/>
   * 
   * @param {String} val 关键字
   * 
   */
  PC.prototype._sendSearchOffline = function (val) {
    var that = this;
    var optsObj = that.opts;
    // TODO 需和phoneGap调试接口
    if (typeof gli_search_offline != 'function') {
      that._sendSearchOnline(val);
    } else {
      // loading
      LoadingObj.open();
      LoadingObj.setMsg(Msg.nowSearch);
      // 传给客户端搜索
      gli_search_offline({ 'keyword': val }, function (result) {
        LoadingObj.close();
        if (result.length != 0) {
        }
      }, function () {
        LoadingObj.close();
        commonDialog.setMsg(Msg.sendError);
        commonDialog.open();
      });
    }
  };
  /**
   * 发送搜索keyword  Online. <br/>
   * 
   * @param {String} val 关键字
   * 
   */
  PC.prototype._sendSearchOnline = function (val) {
    var that = this;
    var optsObj = that.opts;
    // loading
    LoadingObj.setMsg(Msg.nowSearch);
    LoadingObj.open();
    ApiObj.search({ 'keyword': val }, function (data) {
      var result = data.data;
      LoadingObj.close();
      if (data.status) {
        if (result.search_list.length > 0) {
          // 显示搜索结果
          var searchResTempl = TemplSet.getTempl('searchResult');
          var searchResObj = _.template(searchResTempl);
          var searchResHtml = searchResObj(result);
          $('#reader_search_panel .read-search-content').html(searchResHtml);
          that._bindSearch();
        } else {
          commonDialog.setMsg(Msg.emptySearch);
          commonDialog.open();
        }
      } else {
        commonDialog.setMsg(data.msg);
        commonDialog.open();
      }
    }, function () {
      LoadingObj.close();
      commonDialog.setMsg(Msg.sendError);
      commonDialog.open();
    });
  };
  /**
   * 搜索结果绑定事件跳转
   */
  PC.prototype._bindSearch = function () {
    $('#reader_search_panel .read-search-content').on('click', '.read-search-font', function () {
      var pageSite = $(this).parents('li').attr('data-page');
      CountPageObj.turnPageByPerc(pageSite);
    });
  };
  /**
   * 取得本地图书目录(手机, C++)。<br/>
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  PC.prototype._getCatalogOffline = function (successCb, errorCb) {
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': 'catalog' });
    this.readFile(filePath, function readCatalog(data) {
      // null == data是普通读取，data.status == 'false'是加密读取判断
      if (null == data || data.status == 'false') {
        errorCb();
      } else {
        if (!!data.doc_code) {
          data = data.doc_code;
        }
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 取得在线图书目录。<br/>
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  PC.prototype._getCatalogOnline = function (successCb, errorCb) {
    ApiObj.getBookCatalog({}, function (data) {
      successCb(data);
    }, function (result) {
      errorCb(result);
    });
  };
  /**
   * 获取 阅读进度 参数. TODO -- 需要同步服务器.<br/>
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  PC.prototype._getProgressDataOffline = function (successCb, errorCb) {
    var that = this;
    var optsObj = that.opts;
    var tmpData = {};
    if (!optsObj.isClient) {
      tmpData.progressData = Config.progressData;
      tmpData.progressData.updateTime = '0';
      successCb(tmpData);
      return;
    }
    var filePath = this._getCachePath({ 'fileName': 'progress' });
    this.readFile(filePath, function readProgressData(data) {
      // null == data是普通读取，data.status == 'false'是加密读取判断
      if (null == data || data.status == 'false') {
        tmpData.progressData = Config.progressData;
        tmpData.progressData.updateTime = '0';
        that.saveFile(filePath, JSON.stringify(tmpData));
        // errorCb(tmpData);
        successCb(tmpData);
      } else {
        if (!!data.doc_code) {
          data = data.doc_code;
        }
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 在线获取 阅读进度 参数. <br/>
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  PC.prototype._getProgressDataOnline = function (successCb, errorCb) {
    LOG.log('[readerPC.js] -> _getProgressDataOnline! ');
    ApiObj.getProgressData({}, function (data) {
      successCb(data);
    }, function (result) {
      LOG.warn('[reader.js]--获取笔记信息失败!');
      errorCb(result);
    });
  };
  /**
   * 获取 设置面板 参数.<br/>
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  PC.prototype._getSettingDataOffline = function (successCb, errorCb) {
    var that = this;
    var optsObj = that.opts;
    var tmpData = {};
    if (!optsObj.isClient) {
      tmpData.settingData = Config.settingData;
      successCb(tmpData);
      return;
    }
    var filePath = this._getCachePath({
      'fileName': 'settingPanel',
      'bid': 'b_all',
      'uid': 'u_all'
    });
    this.readFile(filePath, function readSettingData(data) {
      // null == data是普通读取，data.status == 'false'是加密读取判断
      if (null == data || data.status == 'false') {
        tmpData.settingData = Config.settingData;
        that.saveFile(filePath, JSON.stringify(tmpData));
        successCb(tmpData);
      } else {
        if (!!data.doc_code) {
          data = data.doc_code;
        }
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 获取 离线状态下本地的版权保护 参数.<br/>
   * 
   * @param successCb {Function}   成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   * @author gli-jiangxq-20160829
   */
  PC.prototype._getCoprDataOffline = function (successCb, errorCb) {
    var that = this;
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': 'copyright' });
    if (!optsObj.isClient) {
      optsObj.data.copyright = Config.copyright;
      errorCb();
      return false;
    }
    this.readFile(filePath, function readCoprData(data) {
      // null == data是普通读取，data.status == 'false'是加密读取判断
      if (null == data || data.status == 'false') {
        var tmpData = {};
        tmpData.coprData = Config.copyright;
        that.opts.data.copyright = Config.copyright;
        that.saveFile(filePath, JSON.stringify(tmpData));
        errorCb();
      } else {
        if (!!data.doc_code) {
          data = data.doc_code;
        }
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 检查分页状态. <br/>
   * 
   */
  PC.prototype._checkPaging = function () {
    // 计时器 等待 [阅读记录] 读取完毕.
    var that = this;
    var optsObj = this.opts;
    setTimeout(function () {
      if (null == optsObj.data.progressData) {
        that._checkPaging();
      } else {
        // 本地路径
        // TODO -- gli_get_cache_path -- C++接口返回值必须与 手机返回一致;
        if (!optsObj.isClient) {
          var path = '';
        } else {
          var path = gli_get_cache_path() + '/' + that._getCachePath({ fileName: '' }) || '';
          path = path.substr(0, path.lastIndexOf('.'));
        }
        CountPageObj.begin({
          'totalLen': optsObj.totalLen,
          'chapts': optsObj.chapts,
          'chapt_index': optsObj.chapt_index,
          'progressData': optsObj.data.progressData,
          'path': path
        });
      }
    }, 800);
  };
  /**
   * 读取加密文件. <br/>
   * 
   * @param path    {String} 本地文件存储路径, 包含文件名. 如 "/download/10001/120/0_catalog.txt"
   * @param cb      {Function} 回调函数, 成功: 返回文件内容, 失败: 返回 null;
   */
  PC.prototype._readFileDec = function (path, cb) {
    var optsObj = this.opts;
    var reader_opts = {
      license_id: optsObj.license_id,
      // 加密 - 文件许可证号;
      server: optsObj.server
    };
    var config_opts = {
      license_id: Config.license_id,
      // 加密 - 文件许可证号;
      server: Config.server
    };
    var opts = $.extend(true, {}, config_opts, reader_opts);
    // PC 用函数名
    var cbName = tool.createFunName(cb);
    var pathPc = gli_get_cache_path() + '/' + path;
    tool._readFileDecrypt(opts, pathPc, cbName);
  };
  /**
   * 小精灵加密保存. <br/>
   * 
   * @param {Object} path
   * @param {Object} content
   * @param {Object} cb
   */
  PC.prototype._saveFileEnc = function (path, content, cb) {
    var pathPc = gli_get_cache_path() + '/' + path;
    // 小精灵加密保存需要先对文件内容encode
    var contentPc = typeof GLI_BASE64 == 'undefined' ? content : '?base64:' + GLI_BASE64.encode(content);
    if (typeof cb != 'function') {
      cb = tool.emptyFunc;
    }
    tool._saveFileEncrypt(pathPc, contentPc, cb);
  };
  /**
   * 获取缓存路径（书签、笔记、目录、设置的参数等） <br />
   * 
   * @param {Object} params 传入参数
   * @param {String} params.fileName 文件名  如:"第一章"
   * @param {String} params.bid      图书id 如:"b100"
   * @param {String} params.uid      用户id 如:"20160700001"
   * 
   * @return {String} filePath 文件路径  "c:/path/20160700001/b100/第一章.txt"
   * 
   * @author gli-hxy-20160818
   * 
   */
  PC.prototype._getCachePath = function (params) {
    var optsObj = this.opts;
    var localPath = optsObj.downloadPath;
    var bookid = params.bid || optsObj.book_id;
    var userid = params.uid || optsObj.user_id;
    var tmpFileName = params.fileName || '';
    var filePath = tool.createBookPath(userid, bookid, tmpFileName, localPath);
    return filePath;
  };
  /**
   * 保存 目录信息至本地.<br/>
   * 
   */
  PC.prototype._saveCatalog = function () {
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': 'catalog' });
    var catalogStr = JSON.stringify(optsObj.data.catalog);
    this.saveFile(filePath, catalogStr);
  };
  /**
   * 保存 章节内容 至本地.<br/>
   * 
   * @param {String} chapterName  文件名. 
   * @param {String} content      文件内容.
   * 
   */
  PC.prototype._saveChapter = function (chapterName, content) {
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': chapterName });
    // 批量下载图片
    if (optsObj.isOnlyDownload) {
      var path = filePath.substr(0, filePath.lastIndexOf('/') + 1);
      this._batchdownloadPhoto(path, content);
    }
    this.saveFile(filePath, content);
  };
  /**
   * 保存当前版权保护信息至本地. <br/>
   * 
   * @author gli-jiangxq-20160829
   */
  PC.prototype._saveCopyright = function () {
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': 'copyright' });
    var copyrightStr = JSON.stringify({ 'coprData': optsObj.data.copyright });
    this.saveFile(filePath, copyrightStr);
  };
  /**
   * 下载图片. <br/>
   * @param {Object} img {
   *              old_src: 图片服务器源地址
   *              new_src: 图片保存本地地址
   *         }
   * @author gli-jiangxq-20160816
   */
  PC.prototype._downloadPhoto = function (img) {
    var arryImg = [];
    var imgItem = {
      url: img.old_src,
      local_path: img.new_src,
      username: '',
      password: ''
    };
    arryImg.push(imgItem);
    tool.downloadImageFilePc(arryImg);
  };
  /**
   * 批量下载图片. <br/>
   * 
   * @param {String} path     路径
   * @param {String} content  章节html
   * 
   * @author gli-jiangxq-20161014
   */
  PC.prototype._batchdownloadPhoto = function (path, content) {
    var basePath = gli_get_cache_path() + '/' + path + 'images/';
    var that = this;
    $(content).find('img').each(function () {
      var old_src = $(this).attr('src');
      var img_name = old_src.substring(old_src.lastIndexOf('/') + 1, old_src.length);
      var new_src = basePath + img_name;
      that._downloadPhoto({
        'old_src': old_src,
        'new_src': new_src
      });
    });
  };
  /**
   * 下载章节内容.<br/>
   * 
   */
  PC.prototype._downloadChapter = function () {
    var optsObj = this.opts;
    var chapterSet = optsObj.data.readableChapter || [];
    var pos = -1;
    var that = this;
    for (var i = 0, len = chapterSet.length; i < len; i++) {
      if (!chapterSet[i].isDownload) {
        pos = i;
        break;
      }
    }
    if (-1 !== pos) {
      //  revise by gli-hxy-20160826 stsrt
      that._downloadSingleChapter(chapterSet[pos], function (result) {
        //  sucess
        // 判断是下载一章，还是全书下载
        if (optsObj.isOnlyDownload) {
          that._downloadChapter();
        }
        if (optsObj._downloadState.rate == 30) {
          that._renderCatalog();
        }
        optsObj._downloadState = {
          'state': true,
          'rate': tool.getProgressRate(chapterSet.length, pos + 1, 30)
        };  //                  optsObj.downloadCb();
      }, function (errorResult) {
        // error.
        if (optsObj._downloadState.rate <= 30) {
          // 只有目录下载成功， 无章节内容.
          console.error('[reader.js] --> _downloadChapter; 只有目录下载成功\uFF0C 无章节内容.');
          // 关闭loading
          LoadingObj.close();  // 提示用户当前章节下载失败
                               //                      that.DialogObj.setMsg(Msg.chapterFalse);
                               //                      that.DialogObj.open();
                               // TODO 提示信息的确定取消都要退出阅读器
        }
      });  //  revise by gli-hxy-20160826 end
    }
  };
  /**
   * 下载 单个章节内容. <br/>
   * 
   * @param {Object} chapterInfo 单个章节的目录信息
   * @param {String} chapterInfo.chapter_id    章节id
   * @param {String} chapterInfo.chapter_name  章节名
   * @param {Boolean} chapterInfo.isDownload   是否已下载
   * @param {Boolean} chapterInfo.chapter_status 是否可读
   * 
   * @param {Function} successCb 下载成功 回调函数
   * @param {Function} errorCb   下载失败 回调函数
   * 
   * @author gli-hxy-20160826
   * 
   */
  PC.prototype._downloadSingleChapter = function (chapterInfo, successCb, errorCb) {
    var that = this;
    var optsObj = that.opts;
    if (!chapterInfo || !chapterInfo.chapter_status) {
      // 传入信息错误 或者 本章无权限阅读.
      // errorCb(); TODO
      return;
    }
    this._getChapterOnline({ 'chapter_id': chapterInfo.chapter_id }, function (result) {
      LOG.info('[reader.js] -> 下载单个章节:' + chapterInfo.chapter_name);
      chapterInfo.isDownload = true;
      // 保存本章 内容。
      that._saveChapter(chapterInfo.chapter_name, result);
      // 更新目录信息.
      that._updateDownloadState(chapterInfo);
      that._saveCatalog();
      successCb();
      // 执行下载完成一章回调
      optsObj.downloadCb();
    }, function (result) {
      LOG.warn('[reader.js] -> 获取单个 [章节内容] 失败!' + result);
      errorCb();
    });
  };
  /**
   * 取得 本地图书章节内容<br/>
   * 
   * @param dataIn {Object}  章节id  e.g.  {chapter_id: "1001",chapter_name: "第一章"}
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  PC.prototype._getChapterOffline = function (dataIn, successCb, errorCb) {
    LOG.log('[reader.js] -> _getChapterOffline! ');
    // TODO， 改为 chapter_id;
    var filePath = this._getCachePath({ 'fileName': dataIn.chapter_name });
    this.readFile(filePath, function readChapter(data) {
      /**
       * 小精灵解密返回结果      TODO：所有的小精灵解密读取返回结果都是如下结构
       * error: data:{
       *     error: "无法传递数据对象!"
       *     loading: "0"
       *     status: "false"
       *  }
       * success： data: {
       *     doc_code: "[]"  // 文件内容
       *     doc_id: "889811df-e4f5-4937-8a2d-b15c38f84adb"
       *     error: "操作成功。"
       *     loading: "100"
       *     status: "true"
       * }
       * 
       */
      // null == data是普通读取，data.status == 'false'是加密读取判断
      if (null == data || data.status == 'false') {
        errorCb();
      } else {
        if (!!data.doc_code) {
          data = data.doc_code;
        }
        data = tool.doDecodeData(data);
        successCb(data);
      }
    });
  };
  /**
   * 取得 在线图书章节内容<br/>
   * 
   * @param dataIn {Object}  章节id  e.g.  {chapter_id: "1001",chapter_name: "第一章"}
   * @param successCb {Function} 获得数据成功 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  PC.prototype._getChapterOnline = function (dataIn, successCb, errorCb) {
    ApiObj.getChapter(dataIn, function (result) {
      successCb(result);
    }, function (result) {
      errorCb(result);
    });
  };
  /**
   * 更新目录信息中的 章节下载状态.<br/>
   * 
   * @param target {Object}  e.g {chapter_id: "1001", isDownload: true}
   * 
   */
  PC.prototype._updateDownloadState = function (target) {
    var optsObj = this.opts;
    var catalogData = !!optsObj.data.catalog ? optsObj.data.catalog.chapter : [];
    for (var i = 0, len = catalogData.length; i < len; i++) {
      if (catalogData[i].chapter_id == target.chapter_id) {
        catalogData[i].isDownload = target.isDownload;
        break;
      }
    }
  };
  /**
   * 取得本地图书笔记(手机, C++)。<br/>
   * 
   * 如果获取数据失败 或 不可读, 则认为: "数据损坏", 并执行重新下载!
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function} 获得数据失败 执行回调函数.
   * 
   */
  PC.prototype._getNoteOffline = function (successCb, errorCb) {
    LOG.log('[reader.js] -> _getNoteOffline! ');
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': 'note' });
    this.readFile(filePath, function readNote(data) {
      // null == data是普通读取，data.status == 'false'是加密读取判断
      if (null == data || data.status == 'false') {
        errorCb();
      } else {
        if (!!data.doc_code) {
          data = data.doc_code;
        }
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 取得在线图书笔记(web)。<br/>
   * 
   * 如果获取数据失败 或 不可读, 则认为: "数据损坏", 弹出提示框!
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function} 获得数据失败 执行回调函数.
   * 
   */
  PC.prototype._getNoteOnline = function (successCb, errorCb) {
    LOG.log('[reader.js] -> _getNoteOnline! ');
    ApiObj.getBookNote({}, function (data) {
      successCb(data);
    }, function (result) {
      LOG.warn('[reader.js]--获取笔记信息失败!');
      errorCb(result);
    });
  };
  /**
   * 下载图书笔记. <br/>
   * 
   */
  PC.prototype._downloadNote = function () {
    var that = this;
    var optsObj = this.opts;
    LOG.log('[Mobile.js] -> download ' + optsObj.book_id);
    // 1. 笔记 -- note; 
    var filePath = this._getCachePath({ 'fileName': 'note' });
    this._getNoteOnline(function (data) {
      LOG.log('成功下載 笔记 并 保存!');
      var dataStr = JSON.stringify(data);
      that.saveFile(filePath, dataStr);
      setTimeout(function () {
        noteObj.renderLayout(data);
      }, 300);
    }, function (result) {
      LOG.warn('[Mobile.js] -> downloadNote ' + result);
      noteObj.renderLayout();
    });
  };
  /** 
   * 读取具体某一章节(optsObj.chapt_index),并执行分页. <br/>
   * 
   * @param {Number} index 目标章节的下标
   * 
   * @author gli-jiangxq-20160809
   */
  PC.prototype._pagingChapter = function (index) {
    var that = this;
    var optsObj = that.opts;
    var chapterItem = optsObj.chapts[index];
    if (!chapterItem.chapter_status) {
      console.log('[reader.js] --> 该章节您没有权限\uFF01');
      return false;
    }
    // 是否已有分页信息
    if (!!optsObj.chapts[index].pages && optsObj.chapts[index].pages.length) {
      // 设置章节分页信息
      CountPageObj.setChapterData({
        'index': index,
        'getHtml': optsObj.chapts[index].html,
        'pages': optsObj.chapts[index].pages,
        'isPretreat': optsObj.chapts[index].isPretreat
      });
      CountPageObj.readyData();
    } else {
      LoadingObj.setMsg(Msg.loading);
      LoadingObj.open();
      // 分页数据已经预处理过，直接用预处理过的html
      if (optsObj.chapts[index].isPretreat) {
        // 设置需要分页的章节信息
        CountPageObj.setChapterData({
          'index': index,
          'getHtml': optsObj.chapts[index].html,
          'pages': [],
          'isPretreat': optsObj.chapts[index].isPretreat
        });
        // 执行分页
        CountPageObj.excutePaging();
      } else {
        // 获取当前章节的数据
        that.getChapterContent({
          'chapter_id': chapterItem.chapter_id,
          'chapter_name': chapterItem.chapter_name
        }, function (data) {
          optsObj.chapts[index].html = data;
          // 设置需要分页的章节信息
          CountPageObj.setChapterData({
            'index': index,
            'getHtml': data,
            'pages': [],
            'isPretreat': optsObj.chapts[index].isPretreat
          });
          // 执行分页
          CountPageObj.excutePaging();
        }, function (data) {
          // add by gli-hxy-20160826 start
          LOG.warn('[reader.js]--> pagingChapter:' + data);
          that._downloadSingleChapter(chapterItem, function () {
            var len = 0;
            var chapts = optsObj.chapts;
            for (var i = 0; i < chapts.length; i++) {
              if (chapts[i].chapter_status) {
                len++;
              }
            }
            that._pagingChapter(index);
            optsObj._downloadState = {
              'state': true,
              'rate': tool.getProgressRate(len, index + 1, optsObj._downloadState.rate)
            };
          }, function () {
            // 关闭loading
            LoadingObj.close();
            // 提示用户当前章节下载失败
            // that.DialogObj.setMsg(Msg.chapterFalse);
            // that.DialogObj.open();
            CountPageObj.opts.chapt_index = optsObj.chapt_index;
            CountPageObj.opts.page_index = optsObj.page_index;
          });  // add by gli-hxy-20160826 end
        });
      }
    }
  };
  /**
   * 关闭所有面板和蒙层. <br/>
   * 
   */
  PC.prototype._closeAllPanel = function () {
    var staticPanel = $('#reader_static_panel');
    var hasAnimatePanel = staticPanel.find('.read-animateShow');
    if (!hasAnimatePanel.length) {
      return false;
    }
    var animateWidth = hasAnimatePanel.width();
    // 如果是右侧面板则修改animateWidth的值为反数
    if (hasAnimatePanel.attr('id') === 'reader_search_panel') {
      animateWidth = -animateWidth;
    }
    move(hasAnimatePanel[0]).translate(-animateWidth, 0).duration('0.5s').end();
    hasAnimatePanel.removeClass('read-animateShow');
    setTimeout(function () {
      staticPanel.fadeOut();
    }, 200);
    // 清除搜索内容
    $('#reader_setting_nav_rt').find('input').val('');
  };
  /**
   * 页面显示一列和两列切换. <br/>
   * 
   * @param {Number} column  显示几列  ps:1或者2
   */
  PC.prototype.changePageColumn = function (column) {
    var optsObj = this.opts;
    if (this.countPageObj.opts.state) {
      console.log('[readerPC.js] --> 正在分页,不能切换\uFF01');
      return false;
    }
    optsObj.pageColumn = column;
    this.selectObj.opts.pageColumn = column;
    this.countPageObj.opts.pageColumn = column;
    this._deletePages();
    this._setFontSize();
    this.countPageObj.changeColumn();
  };
  /**
   * 显示分页数据到页面.  <br/>
   * 
   * @param {Object} data {
   *      'chapt_index':      {Number} optsObj.chapt_index,
   *      'page_index':       {Number} optsObj.page_index,
   *      'chapterName':      {String} 章节名
   *      'chapterContent':   {String} 当前页html
   *      'pagePerc':         {Float} 当前页码  ps:0.1234
   *      'direction':        {String} 翻页方向  ps:'next','prev'
   *      'turnMode':         {Number} 翻页模式  ps:0,正常反应，有翻页动画;1,特殊翻页,无翻页动画
   *     }
   * 
   * @author gli-jiangxq 20160809
   */
  PC.prototype._showPage = function (data) {
    LOG.info('[reader.js]--> showPage');
    var optsObj = this.opts;
    // 页面章节下标和页码没有发生改变不执行页面翻页动作
    if (!data.turnMode && optsObj.chapt_index === data.chapt_index && optsObj.page_index === data.page_index) {
      this._closeAllPanel();
      return false;
    }
    optsObj.chapt_index = data.chapt_index;
    optsObj.page_index = data.page_index;
    var singleChapter = optsObj.chapts[optsObj.chapt_index];
    var chapter_id = singleChapter.chapter_id;
    var chapter_name = singleChapter.chapter_name;
    if (optsObj.pageColumn == 2) {
      var $leftContentObj = $('#reader_main_panel .read-body .read-content.read-page-1');
      showMainData(data, $leftContentObj);
      var $rightContentObj = $('#reader_main_panel .read-body .read-content.read-page-2');
      var secondData = data;
      secondData.chapterContent = secondData.secondPage;
      showMainData(secondData, $rightContentObj);
    }
    if (optsObj.pageColumn == 1) {
      var $singleContentObj = $('#reader_main_panel .read-body .read-content.read-page-1');
      showMainData(data, $singleContentObj);
    }
    LoadingObj.close();
    noteObj.showNote(chapter_id, chapter_name);
    this._closeAllPanel();
    // 判断当前页的书签标记是否显示
    var prevPercent = optsObj.pageColumn == 2 ? CountPageObj.getHeadPerc(optsObj.page_index - 1) : CountPageObj.getHeadPerc();
    var thisPageData = {
      'prevPercent': prevPercent,
      'nowPercent': CountPageObj.getFootPerc(),
      'chaptId': optsObj.chapts[optsObj.chapt_index].chapter_id
    };
    //          bookmarkObj.isShowBookmark(thisPageData);
    if (tool.hasFunction(bookmarkObj, 'isShowBookmark')) {
      bookmarkObj.isShowBookmark(thisPageData);
    }
    function showMainData(pageData, $thisContentObj) {
      var $mianPage = $('#reader_main_panel');
      var $contentObj = $thisContentObj;
      $mianPage.find('.read-body .read-chapter-view').text(pageData.chapterName);
      $contentObj.html(pageData.chapterContent);
      //              $mianPage.find(".read-header .read-middle input").val(parseInt(pageData.currPage));
      //              $mianPage.find(".read-header .read-middle span").eq(1).html(pageData.totalPage);
      $mianPage.find('.read-header .read-middle input').val(parseFloat(pageData.pagePerc));
      $mianPage.find('.read-header .read-middle span').eq(1).html('100%');
      if (typeof MathJax !== 'undefined') {
        MathJax.Hub.Queue([
          'Typeset',
          MathJax.Hub
        ]);
      }
      var setImgSrc = function () {
        $contentObj.find('img[data-src]').each(function () {
          var data_src = $(this).attr('data-src');
          $(this).attr('src', data_src);
          $(this).removeAttr('data-src');
        });
      };
      var setVideoSrc = function () {
        $contentObj.find('source[data-src]').each(function () {
          var data_src = $(this).attr('data-src');
          $(this).attr('src', data_src);
          $(this).removeAttr('data-src');
        });
      };
      var setTableStyle = function () {
        var pageW = $contentObj.width();
        var parentH = 0;
        $contentObj.find('table').each(function () {
          if ($(this).attr('zoom') == '1') {
            return true;
          }
          if ($(this).width() > pageW) {
            parentH = $(this).parent().height();
            $(this).parent().addClass('read-tbl-big-data');
            parentH = parentH * 2 - $(this).parent().height();
            $(this).attr('zoom', '1');
            $(this).attr('data-resth', parentH);
          }
        });
        $contentObj.find('table[zoom="1"]').each(function () {
          var height = $(this).attr('data-resth');
          var tempDiv = $('<div class="read-tbl-wrap" style="height: ' + height + 'px">');
          $(this).parent().append(tempDiv);
          var tmpImg = $('<div class="read-open-pop">');
          $(this).parent().append(tmpImg);
          tempDiv.append($(this));
        });
      };
      var bindTableEvent = function () {
        var bigTable = $contentObj.find('table[zoom="1"]');
        bigTable.parents('.read-tbl-wrap').on('click', function (e) {
          var table_clone = $(this).clone(true);
          expandTable(table_clone);
          e.stopPropagation();
        });
        function expandTable(table) {
          var maskObj = $('<div class="read-comm-panel read-comm-table">');
          var tableObj = $('<div class="read-comm-tbl-wrap">');
          var closeObj = $('<div class="read-close-btn">');
          maskObj.append(closeObj);
          maskObj.append(tableObj);
          tableObj.append(table);
          optsObj.$readerObj.append(maskObj);
          maskObj.on('click', function (e) {
            return false;
          });
          closeObj.on('click', function (e) {
            maskObj.remove();
            e.stopPropagation();
          });
        }
      };
      setImgSrc();
      setVideoSrc();
      setTableStyle();
      bindTableEvent();
    }
  };
  /**
   * 删除所有分页数据. <br/>
   * 
   * @author gli-jiangxq-20160818
   */
  PC.prototype._deletePages = function () {
    var optsObj = this.opts;
    var chapts = optsObj.chapts;
    if (!chapts) {
      return false;
    }
    for (var i = 0, len = chapts.length; i < len; i++) {
      if (!!chapts[i].pages) {
        chapts[i].pages = [];
      }
    }
  };
  /**
   * 保存/更新 当前设置面板参数至本地.<br/>
   * 
   */
  PC.prototype._saveSettingFile = function () {
    var optsObj = this.opts;
    var filePath = this._getCachePath({
      'fileName': 'settingPanel',
      'bid': 'b_all',
      'uid': 'u_all'
    });
    this.saveFile(filePath, JSON.stringify({ 'settingData': optsObj.data.settingData }));
  };
  /**
   * 保存/更新 当前 阅读进度 至本地.<br/>
   * 
   */
  PC.prototype._saveProgressFile = function () {
    var optsObj = this.opts;
    var tempData = optsObj.data.progressData;
    var filePath = this._getCachePath({ 'fileName': 'progress' });
    tempData.updateTime = new Date().getTime();
    tempData.progress = CountPageObj.getFootPerc();
    this.saveFile(filePath, JSON.stringify({ 'progressData': tempData }));
  };
  /**
   * 保存记录书籍阅读状态. <br/>
   * 
   */
  PC.prototype._saveBookState = function () {
    var optsObj = this.opts;
    var that = this;
    var chapter_id = optsObj.chapts[optsObj.chapt_index].chapter_id;
    var bookStateData = [];
    if (optsObj.isClient) {
      var filePath = this._getCachePath({ 'fileName': 'bookState' });
      this.readFile(filePath, function (data) {
        if (null != data) {
          data = tool.doDecodeData(data);
          data = JSON.parse(data);
          bookStateData = data;
        }
        bookStateData.push({
          'bookOpenTime': optsObj.bookOpenTime,
          'bookCloseTime': new Date().getTime(),
          'progress': CountPageObj.getFootPerc(),
          'chapter_id': chapter_id
        });
        ApiObj.setBookState({ 'bookStateData': bookStateData }, function () {
          that.saveFile(filePath, JSON.stringify([]));
        }, function () {
          that.saveFile(filePath, JSON.stringify(bookStateData));
        });
      });
    } else {
      bookStateData.push({
        'bookOpenTime': optsObj.bookOpenTime,
        'bookCloseTime': new Date().getTime(),
        'progress': CountPageObj.getFootPerc(),
        'chapter_id': chapter_id
      });
      ApiObj.setBookState({ 'bookStateData': bookStateData }, function () {
        LOG.log('[PC.prototype._saveBookState]-->非客户端setBookState成功\uFF01');
      }, function () {
        LOG.log('[PC.prototype._saveBookState]-->非客户端setBookState失败\uFF01');
      });
    }
  };
  PC.prototype.open = function () {
  };
  /**
   * 退出阅读器 (保存阅读进度等).
   */
  PC.prototype.exit = function () {
    var optsObj = this.opts;
    this._saveProgressFile();
    this._saveSettingFile();
    optsObj.$readerWrap.html('');
    this._saveBookState();
    optsObj.exitReaderCb();
  };
  /**
   * 向后翻页. </br>
   * 
   * @author gli-jiangxq-20160905
   */
  PC.prototype.next = function () {
    CountPageObj.turnPage('next');
  };
  /**
   * 向前翻页. </br>
   * 
   * @author gli-jiangxq-20160905
   */
  PC.prototype.prev = function () {
    CountPageObj.turnPage('prev');
  };
  PC.prototype.getPagesAll = function () {
  };
  /**
   * 获取 图书下载 进度信息。
   *
   * @return {
   *     state : {Boolean} 状态 true: 成功, 失败.
   *     rate :  {Number} 进度
   * }
   *
   */
  PC.prototype.getDownloadInfo = function () {
    var optsObj = this.opts;
    var downloadInfo = optsObj._downloadState;
    return downloadInfo;
  };
  /**
   * 获取 目录信息。<br/>
   *
   * @return {Object} 结构复杂,请参考数据接口文档
   *
   */
  PC.prototype.getCatalogInfo = function () {
    var optsObj = this.opts;
    var catalogData = optsObj.data.catalog || [];
    return catalogData;
  };
  /**
   * 下载 图书, 保存为 本地文件. <br/>
   * 
   * 图书信息包括 目录, 章节. <br/>
   * ps: 以后考虑 书签, 笔记, 阅读习惯参数 等...<br/>
   * 
   */
  PC.prototype.download = function () {
    var optsObj = this.opts;
    var that = this;
    LOG.info('[reader.js] --> download!  userId:' + optsObj.user_id + ' , book_id:' + optsObj.book_id);
    this._getCatalogOnline(function (catalogData) {
      // 存入 当前对象.
      optsObj.data.catalog = catalogData;
      // 增加 属性 [isDownload]
      var tmpChapter = catalogData.chapter;
      // 准备需要下载的 章节的 id.
      var readableChapter = [];
      // 目录下载成功即有30%数据
      optsObj._downloadState.rate = 30;
      for (var i = 0, len = tmpChapter.length; i < len; i++) {
        tmpChapter[i].isDownload = false;
        if (tmpChapter[i].chapter_status) {
          var tmpItem = {};
          tmpItem.chapter_id = tmpChapter[i].chapter_id;
          tmpItem.chapter_name = tmpChapter[i].chapter_name;
          tmpItem.isDownload = tmpChapter[i].isDownload;
          tmpItem.chapter_status = tmpChapter[i].chapter_status;
          readableChapter.push(tmpItem);
        }
      }
      optsObj.data.readableChapter = readableChapter;
      optsObj.getCatalogCb();
      if (optsObj.useEpubFile) {
        //  执行 注册函数回调. 使用 epub源文件. 不需要分页, 不需要下载章节;/ 
        return;
      }
      that._saveCatalog();
      that._downloadChapter();
    }, function (result) {
      LOG.warn('[reader.js] -> download ' + result);
    });
  };
  PC.prototype.delLocalData = function () {
  };
  return PC;
}(js_src_global, js_libs_zeptodev, js_src_tool, js_src_api, js_src_widget_plugLoading, js_src_pc_panelTemplPc, js_src_pc_copyrightPc, js_src_config, js_src_widget_plugDialog, js_src_message_zh, move, js_src_countPage, js_src_pc_bookmarkPc, js_src_pc_panelSelectPc, js_src_pc_panelNotePc, js_src_panelViewImg, js_src_widget_delicateType, js_src_widget_plugVideoPc);
js_src_pad_panelTemplPad = function (window, $) {
  //  var $ = window.Zepto;
  var _ = window._;
  //  var templSets = {
  //      "countpage": $("#countpage-templ").html(),
  //
  //      "main": $("#main-templ").html(),
  //      "newpage": $("#newpage-templ").html(),
  //      "setting": $("#setting-template").html(),
  //      "fontlight": $("#fontlight-templ").html(),
  //      "progress": $("#progress-templ").html(),
  //      "complain": $("#complain-templ").html(),
  //      "search": $("#search-templ").html(),
  //      "correct": $("#correct-templ").html(),
  //
  //      "cbn": $("#cbn-template").html(),
  //      "cbnNavMenu": $("#custom-nav-menus").html(),
  //      "cbnNavBody": $("#custom-nav-body").html(),
  //      "catalog": $("#catalog-templ").html(),
  //      "note": $("#note-templ").html(),
  //      "bookmark": $("#bookmark-templ").html(),
  //
  //      "firstOpen": $('#first-open-templ').html(),
  //      "viewImg": $("#view-img-templ").html(),
  //      
  //      "noteEdit": $("#note-edit").html(),
  //      "noteDetail": $("#note-detail").html(),
  //  };
  var templSets = {
    'countpage': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-comm-panel%20read-panel%20read-selector-countpage%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-view%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E6%98%BE%E7%A4%BA%E7%AB%A0%E8%8A%82--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-name%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-view%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%86%85%E5%AE%B9%E6%98%BE%E7%A4%BA%E5%8C%BA--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-content%20read-page-1%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-countpage-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-countpage%20read-cf%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E9%A1%B5%E7%A0%81--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-progressbar%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-view-offset%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-page%20read-two-offset%20read-offset-1%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-page%20read-two-offset%20read-offset-2%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'main': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-comm-panel%20read-panel%20read-selector-main%20%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-page-storage%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%20%E5%B9%B3%E9%93%BA%E5%8A%A8%E7%94%BB%E9%A1%B5%E9%9D%A2%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-content-animate%20read-page-prev%20read-cf%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E6%98%BE%E7%A4%BA%E7%AB%A0%E8%8A%82--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-name%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-view%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E6%98%BE%E7%A4%BA%E4%B9%A6%E7%AD%BE--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-view%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%86%85%E5%AE%B9%E6%98%BE%E7%A4%BA%E5%8C%BA--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-animate-content%20read-page-1%20read-cf%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-animate-content%20read-page-2%20read-cf%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E9%A1%B5%E7%A0%81--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-view-offset%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-page%20read-two-offset%20read-offset-1%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-page%20read-two-offset%20read-offset-2%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-view%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E6%98%BE%E7%A4%BA%E7%AB%A0%E8%8A%82--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-name%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-view%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%86%85%E5%AE%B9%E6%98%BE%E7%A4%BA%E5%8C%BA--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-content%20read-page-1%20read-cf%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-content%20read-page-2%20read-cf%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-delicate-container%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-delicate%20read-cf%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E9%A1%B5%E7%A0%81--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-progressbar%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-view-offset%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-page%20read-two-offset%20read-offset-1%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-page%20read-two-offset%20read-offset-2%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%20%E5%B9%B3%E9%93%BA%E5%8A%A8%E7%94%BB%E9%A1%B5%E9%9D%A2%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-content-animate%20read-page-next%20read-cf%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E6%98%BE%E7%A4%BA%E7%AB%A0%E8%8A%82--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-name%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-view%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E6%98%BE%E7%A4%BA%E4%B9%A6%E7%AD%BE--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-view%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%86%85%E5%AE%B9%E6%98%BE%E7%A4%BA%E5%8C%BA--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-animate-content%20read-page-1%20read-cf%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-animate-content%20read-page-2%20read-cf%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E9%A1%B5%E7%A0%81--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-view-offset%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-page%20read-two-offset%20read-offset-1%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-page%20read-two-offset%20read-offset-2%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'newpage': decodeURI(''),
    'setting': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-comm-panel%20read-setting-panel%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3C!--%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%B7%A6%E4%BE%A7%E9%80%80%E5%87%BA%E6%8C%89%E9%92%AE--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-exit-reader%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-lf%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%22%3E%E8%BF%94%E5%9B%9E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%8F%B3%E4%BE%A7%20%E4%B9%A6%E7%AD%BE%20%E7%89%88%E6%9D%83%E6%8A%95%E8%AF%89%20%E6%90%9C%E7%B4%A2--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20read-handle-box%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-view%20read-lf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-bookmark-btn%20read-rt%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-copyright%20read-lf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-rt%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-search%20read-lf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-rt%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%0A%20%20%20%20%20%20%20%20%3C!--%E4%B8%AD%E9%97%B4%E9%80%8F%E6%98%8E%E5%8C%BA%E5%9F%9F--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%3C/div%3E%0A%20%20%20%20%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-set-btn%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-content%20read-h-center%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-cbn-btn%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-hv-center%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-progress-btn%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-hv-center%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-font-btn%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-hv-center%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-night-btn%20read-active%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-hv-center%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'fontlight': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-font-set-panel%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-set-page%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%B1%8F%E5%B9%95%E4%BA%AE%E5%BA%A6--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-setting-bar%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-screen-intensity%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-light-bar%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-icon-div%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-lf%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-rt%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-system-light%20read-h-right%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-font%22%3E%E7%B3%BB%E7%BB%9F%E4%BA%AE%E5%BA%A6%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%AD%97%E4%BD%93%E5%A4%A7%E5%B0%8F--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-setting-bar%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-font-size%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E8%83%8C%E6%99%AF%E9%A2%9C%E8%89%B2--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-setting-bar%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bg-color%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%AD%97%E4%BD%93%E7%B1%BB%E5%9E%8B--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-setting-bar%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-font-family%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-font-family-view%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20read-more-font-btn%20read-disabled%22%3E%E6%9B%B4%E5%A4%9A%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E7%BF%BB%E9%A1%B5%E6%96%B9%E5%BC%8F%20%20%20--%20%E5%B1%8F%E5%B9%95%E9%95%BF%E4%BA%AE--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-setting-bar%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-plugs-group%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-turn-page%20read-lf%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-screen-always-bright%20read-rt%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%22%3E%E5%B1%8F%E5%B9%95%E9%95%BF%E4%BA%AE%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bright-bar%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-icon-triangle%20read-h-center%22%3E%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'progress': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-schedule-set-panel%22%3E%0A%20%20%20%20%20%20%20%20%3C!--%E7%AB%A0%E8%8A%82--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-adjust%20read-h-center%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-lf%20read-font%20read-prev-chapter%22%3E%E6%97%A0%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-center-click-view%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-lf%20read-icon%20read-prev%20read-v-center%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-chapter-count-view%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-text-over%20read-chapt-title%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-text-over%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-chapt-current%22%3E1%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%3E/%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-chapt-total%22%3E6%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-rt%20read-icon%20read-next%20read-v-center%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-rt%20read-font%20read-next-chapter%22%3E5%3C/span%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C!--%E8%BF%9B%E5%BA%A6%E8%B0%83%E8%8A%82--%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-schedule-adjust%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-progress-bar%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'complain': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-comm-panel%20read-pad-modal%20read-complaint-panel%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-pad-modal-cover%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-pad-modal-body%20read-hv-center%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-pad-body-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-cancel-btn%20read-lf%22%3E%E5%8F%96%E6%B6%88%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%20read-h-center%22%3E%E7%89%88%E6%9D%83%E6%8A%95%E8%AF%89%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-send-btn%20read-rt%22%3E%E5%8F%91%E9%80%81%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-pad-canel-box%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-canel-box-btn%20read-canel-box-cont%22%3E%E7%BB%A7%E7%BB%AD%E7%BC%96%E8%BE%91%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-canel-box-btn%20read-canel-box-leave%22%3E%E7%A6%BB%E5%BC%80%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-pad-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctextarea%20class=%22read-complaint-textarea%22%20placeholder=%22%E4%BF%9D%E6%8A%A4%E7%89%88%E6%9D%83%EF%BC%8C%E5%85%B1%E5%BB%BA%E7%99%BE%E5%AE%B6%E4%BA%89%E9%B8%A3%E7%9A%84%E5%8E%9F%E5%88%9B%E5%A4%A7%E7%8E%AF%E5%A2%83%EF%BC%8C%E6%84%9F%E8%B0%A2%E6%9C%89%E6%82%A8%22%3E%3C/textarea%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'search': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-comm-panel%20read-search-panel%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%B7%A6%E4%BE%A7%E8%BF%94%E5%9B%9E%E6%8C%89%E9%92%AE--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-search-back%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-lf%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%20read-v-center%22%3E%E8%BF%94%E5%9B%9E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E4%B8%AD%E9%97%B4%E6%90%9C%E7%B4%A2%E6%A1%86--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20read-search-box%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-search-ipt%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20type=%22text%22%20placeholder=%22%E8%AF%B7%E8%BE%93%E5%85%A5%E6%90%9C%E7%B4%A2%E5%85%B3%E9%94%AE%E5%AD%97%22/%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-search-btn%22%3E%E6%90%9C%E7%B4%A2%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-search-history%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-history-title%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-lf%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%20read-lf%22%3E%E5%8E%86%E5%8F%B2%E6%90%9C%E7%B4%A2%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20read-clear-history%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-history-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-search-result%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'correct': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-comm-panel%20read-pad-modal%20read-correction-panel%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-pad-modal-cover%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-pad-modal-body%20read-hv-center%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-pad-body-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-cancel-btn%20read-lf%22%3E%E5%8F%96%E6%B6%88%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%20read-h-center%22%3E%E7%BA%A0%E9%94%99%E6%96%87%E5%AD%97%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-send-btn%20read-rt%22%3E%E5%8F%91%E9%80%81%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-pad-canel-box%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-canel-box-btn%20read-canel-box-cont%22%3E%E7%BB%A7%E7%BB%AD%E7%BC%96%E8%BE%91%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-canel-box-btn%20read-canel-box-leave%22%3E%E7%A6%BB%E5%BC%80%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-pad-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-original-text%22%3E%E5%8F%91%E7%9A%84%E6%96%B9%E6%B3%95%E7%9A%84%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctextarea%20class=%22read-correction-textarea%22%20placeholder=%22%E5%B8%AE%E5%8A%A9%E6%88%91%E4%BB%AC%E7%BA%A0%E6%AD%A3%E9%94%99%E8%AF%AF%EF%BC%8C%E8%AE%A9%E6%88%91%E4%BB%AC%E4%B8%BA%E5%A4%A7%E5%AE%B6%E6%9B%B4%E5%A5%BD%E7%9A%84%E6%9C%8D%E5%8A%A1%22%3E%3C/textarea%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'cbn': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-comm-panel%20read-cbn-panel%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cbn-cover%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cbn-view%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header-nav%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'cbnNavMenu': decodeURI('%0A%20%20%20%20%3C%25%20_.each(obj,%20function(%20menu%20)%7B%20%20%20%25%3E%0A%0A%20%20%20%20%3Cdiv%20class=%22read-lf%20%3C%25=%20menu.state%20%25%3E%20read-nav-menus%3C%25=%20obj.length%20%25%3E%20%22%3E%0A%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-pointer%20read-text-over%20read-hv-center%22%20data-view=%22%3C%25=%20menu.view%20%25%3E%22%3E%3C%25=%20menu.text%20%25%3E%3C/span%3E%0A%20%20%20%20%3C/div%3E%0A%20%20%20%20%0A%20%20%20%20%3C%25%20%20%20%7D);%20%20%25%3E%0A'),
    'cbnNavBody': decodeURI('%0A%20%20%20%20%3C%25%20_.each(obj,%20function(%20menu%20)%7B%20%20%20%25%3E%0A%20%20%20%20%3Cdiv%20class=%22%3C%25=%20menu.view%20%25%3E%20%3C%25%20if(menu.state%20!=%20\'read-active\')%7B%20%25%3E%20read-hide%20%20%3C%25%20%7D%20%25%3E%20%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-no-%3C%25=%20menu.name%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-h-center%20%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%22%3E%3C%25=%20menu.prompt%20%25%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C%25%20%20%20%7D);%20%20%25%3E%0A'),
    'catalog': decodeURI('%0A%20%20%20%20%0A%20%20%20%20%3Cdiv%20class=%22read-book-info%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%3Ch1%20class=%22read-text-over%22%3E%3C%25=%20obj.name%20%25%3E%3C/h1%3E%0A%20%20%20%20%20%20%20%20%3Ch2%20class=%22read-text-over%22%3E%3C%25=%20obj.subtitle%20%25%3E%3C/h2%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cf%20read-catalog-author%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%3E%3Cspan%20class=%22read-lf%20read-text-over%22%3E%3C%25=%20obj.author%20%25%3E%3C/span%3E%3Cspan%20class=%22%22%3E%E8%91%97%3C/span%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%3E%3Cspan%20class=%22read-lf%20read-text-over%22%3E%3C%25=%20obj.translator%20%25%3E%3C/span%3E%3Cspan%20class=%22%22%3E%E8%AF%91%3C/span%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cf%20read-catalog-visitors%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%3E%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%3Cspan%3E%3C%25=%20obj.read_num%20%25%3E%20%E9%98%85%E8%AF%BB%3C/span%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%22%3E%3Cspan%3E%3C%25=%20obj.word_count%20%25%3E%20%E5%AD%97%3C/span%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A%0A%20%20%20%20%3Cdiv%20class=%22read-chapter-list%22%3E%0A%20%20%20%20%20%20%20%20%3Cul%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20_.each(obj.chapter,%20function(chapt)%7B%20%20%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cli%20class=%22%3C%25%20if%20(!chapt.chapter_status)%20%7B%20%25%3Eread-no-data%3C%25%20%7D%20%25%3E%22%20data-status=%22%3C%25=%20chapt.chapter_status%20%25%3E%22%20data-id=%22%3C%25=%20chapt.chapter_id%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-lf%20read-chapter-name%22%3E%3C%25=%20chapt.chapter_name%20%25%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%3Cspan%20class=%22read-rt%20read-chapter-seat%22%3E%3C%25=%20!!chapt.pageNum%20?%20chapt.pageNum%20:%200%20%25%3E%3C/span%3E--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-rt%20read-chapter-seat%22%3E%3C%25=%20(parseInt(chapt.textlen)/parseInt(obj.word_count)%20*%20100).toFixed(2)%20%25%3E%25%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/li%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%20%20%20%20%3C/ul%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'note': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-has-note%20%22%3E%0A%20%20%20%20%20%20%20%20%3C%25%20_.each(obj.chapter_list,%20function(chapt)%7B%20%20%20%25%3E%0A%20%20%20%20%20%20%20%20%3C%25%20if(!_.isEmpty(chapt.note_list))%7B%20%25%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-one-chapter-notes%22%20data-chapterid=%22%3C%25=%20chapt.chapter_id%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-chapter%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-note-chapter-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapt.chapter_name%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20read-note-chapter-count%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapt.note_count%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20_.each(chapt.note_list,%20function(note)%7B%20%20%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note%22%20data-noteid=%22%3C%25=%20note.note_id%20%25%3E%22%20data-percent=%22%3C%25=%20note.note_page%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-left%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-original-text%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20note.original%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-text%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20note.note_text%20%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cf%20read-note-time%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-note-or-underline%20read-note-%3C%25=%20!note.note_text%20?%200%20:%201%20%20%25%3E%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-page-site%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=(parseFloat(note.note_page)*100).toFixed(2)+%20%22%25%22%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-time%22%3E%3C%25=%20obj.nowDate%20==%20note.note_time.substr(0,%2010)%20?%20note.note_time.substring(11)%20:%20note.note_time.substr(0,%2010)%25%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C%25%20%7D;%20%25%3E%0A%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%3C/div%3E%0A%20%20%20%20%3Cdiv%20class=%22read-no-note%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-h-center%20%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%20read-h-center%22%3E%E9%98%85%E8%AF%BB%E6%97%B6%E9%95%BF%E6%8C%89%E6%96%87%E5%AD%97%E5%8F%AF%E6%B7%BB%E5%8A%A0%E7%AC%94%E8%AE%B0%3C/span%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'bookmark': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-has-bookmark%22%3E%0A%20%20%20%20%20%20%20%20%3C%25%20_.each(obj.chapter_list,%20function(chapt)%7B%20%20%20%25%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-one-chapter-bookmark%22%20data-chapterid=%22%3C%25=%20chapt.chapter_id%20%25%3E%22%20data-chapterName=%22%3C%25=%20chapt.chapter_name%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-chapter%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-text-over%20read-bookmark-chapter-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapt.chapter_name%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20read-bookmark-chapter-count%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20chapt.count%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20_.each(chapt.bookmark_list,%20function(bookmark)%7B%20%20%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark%22%20data-bookmarkid=%22%3C%25=%20bookmark.bookmark_id%20%25%3E%22%20data-percent=%22%3C%25=%20bookmark.bookmark_page%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-bookmark-left%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-original-text%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25=%20bookmark.bookmark_text%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-cf%20read-bookmark-time%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%22%3E%3Cspan%20class=%22read-icon%20read-icon-v-center%22%3E%3C/span%3E%3Cspan%20class=%22read-bookmark-percent%22%3E%3C%25=%20(parseFloat(bookmark.bookmark_page)*100).toFixed(2)%20%25%3E%25%3C/span%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-time%22%3E%3C%25=%20bookmark.bookmark_time%20%25%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-bookmark-del%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%3C/div%3E%0A%20%20%20%20%3Cdiv%20class=%22read-no-bookmark%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-icon-h-center%20%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%20read-h-center%22%3E%E9%98%85%E8%AF%BB%E6%97%B6%E7%82%B9%E5%87%BB%E5%8F%B3%E4%B8%8A%E8%A7%92%E7%9A%84%E4%B9%A6%E7%AD%BE%E5%8D%B3%E5%8F%AF%E6%B7%BB%E5%8A%A0%3C/span%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'firstOpen': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-first-time%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-item-1%20read-icon-left%20read-lf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-icon%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-item-2%20read-icon-middle%20read-lf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-icon%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-item-1%20read-icon-right%20read-lf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-icon%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'viewImg': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-viewimg-panel%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-img-setting%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20read-exit-img%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%22%3E%E8%BF%94%E5%9B%9E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20read-save-btn%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%22%3E%E4%BF%9D%E5%AD%98%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%20read-rotate-btn%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-viewimg-content%22%3E%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'noteEdit': decodeURI('%0A%20%20%20%20%0A%20%20%20%20%3Cdiv%20class=%22read-comm-panel%20read-pad-modal%20read-edit-note-panel%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-pad-modal-cover%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-pad-modal-body%20read-hv-center%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-pad-body-header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-cancel-btn%20read-lf%22%3E%E5%8F%96%E6%B6%88%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-font%20read-h-center%22%3E%E7%BC%96%E8%BE%91%E7%AC%94%E8%AE%B0%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-send-btn%20read-rt%22%3E%E4%BF%9D%E5%AD%98%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-pad-canel-box%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-canel-box-btn%20read-canel-box-cont%22%3E%E7%BB%A7%E7%BB%AD%E7%BC%96%E8%BE%91%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-canel-box-btn%20read-canel-box-leave%22%3E%E7%A6%BB%E5%BC%80%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-pad-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-original-text%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctextarea%20class=%22read-edit-textarea%22%20placeholder=%22%E8%BD%BB%E6%9D%BE%E8%AE%B0%E5%BD%95%E4%BD%A0%E7%9A%84%E6%89%80%E6%83%B3%E3%80%81%E6%89%80%E6%84%9F%22%3E%3C/textarea%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A'),
    'noteDetail': decodeURI('%0A%20%20%20%20%3Cdiv%20class=%22read-comm-panel%20read-note-detail-panel%20read-hide%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-detail-cover%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-detail-content%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-header%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-hv-center%20read-font%22%3E%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-body%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E5%8E%9F%E6%96%87%E6%91%98%E8%A6%81--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-original-text%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E7%AC%94%E8%AE%B0%E5%86%85%E5%AE%B9--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-note-text%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!--%E6%97%B6%E9%97%B4--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-time%20read-rt%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-footer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-btn-div%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-lf%20read-delete-btn%22%3E%E5%88%A0%E9%99%A4%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href=%22javascript:void(0)%22%20class=%22read-a-btn%20read-rt%20read-edit-btn%22%3E%E7%BC%96%E8%BE%91%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-turn-note%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cbutton%20class=%22read-lf%20read-prev%22%3E%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%E4%B8%8A%E4%B8%80%E9%A1%B5%3C/button%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-page%20read-hv-center%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-current%22%3E1%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%3E/%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-total%22%3E1%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cbutton%20class=%22read-rt%20read-next%22%3E%E4%B8%8B%E4%B8%80%E9%A1%B5%3Cspan%20class=%22read-icon%22%3E%3C/span%3E%3C/button%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-reader-share%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-title%20read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-lf%20%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class=%22read-hv-center%22%3E%E5%88%86%E4%BA%AB%E5%88%B0%3C/span%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-rt%20%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cul%20class=%22read-cf%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20_.each(obj.shareNotes,%20function(item)%7B%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cli%20data-type=%22%3C%25=item.type%20%25%3E%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-icon%20%3C%25=item.icon_css%25%3E%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class=%22read-font%20read-text-over%22%3E%3C%25=item.txt%25%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/li%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%20%7D);%20%25%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/ul%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A')
  };
  return output = {
    getTempl: function (type) {
      return templSets[type];
    }
  };
}(js_src_global, js_libs_zeptodev);
js_src_widget_publish = function (window, $) {
  return {
    /**
     * 精排时调用此方法
     * 
     * @param {Object} $domTree Zepto对象
     */
    setPageType: function ($domTree) {
      var self = this;
      //          self.addSpan($domTree);
      self.afterSetType($domTree);
    },
    /** 
     * 递归遍历所有节点
     * 
     * 再为每个字符增加一个span标签
     * 
     * @param {Object} $curr zepto对象
     * 
     * @author gli-hxy-20160822
     * 
     */
    addSpan: function ($curr) {
      var self = this;
      // 如果curr有子节点，就遍历curr下所有子节点
      var $children = $curr.contents();
      if (!!$children) {
        for (var i = 0; i < $children.length; i++) {
          var $thisChild = $($children[i]);
          // 文本节点TEXT_NODE: 3
          if ($children[i].nodeType == 3) {
            var html = '';
            var str = $thisChild.text();
            var wordReg = /(([\w_\.%]+)|([^\2]))/gi;
            html = str.replace(wordReg, '<span class="read-filterSpan">$1</span>');
            //                      for(var k = 0; k < $thisChild.text().length; k++) {
            //                          html += "<span class='filterSpan'>" + $thisChild.text()[k] + "</span>";
            //                      }
            // 替换原节点
            $thisChild.replaceWith($(html));
          } else {
            // math公式增加filterSpan--方便复制
            // math公式和table内的文本不增加span
            // 将当前子节点，再作为父节点向下遍历
            if ($thisChild.hasClass('reader-MathJax')) {
              $thisChild.addClass('read-filterSpan');
            } else if (!$thisChild.hasClass('read-not-publish') && !$thisChild.hasClass('read-filterSpan') && $thisChild.prop('tagName') != 'TABLE') {
              self.addSpan($thisChild);
            }
          }
        }
      }
    },
    /** 
     * Dom加入页面前处理精排, TODO -- 暂未实现.<br/>
     * 
     * @param {String} elem_str 页面html标签
     * 
     */
    beforeSetType: function (elem_str) {
      return elem_str;
    },
    /**
     * Dom加入页面后精排处理
     * 
     * @param {Object} curr zepto对象
     * 
     */
    afterSetType: function (curr) {
      var reg1 = /。/;
      var reg2 = /：|“|”|？|！|。|，|‘|’|、|（|）|~|,|\.|\?|'|'|"|"|!|；|;|@|#|%/;
      var $txt_node = curr.find('span.read-filterSpan');
      //容器距离左边距离
      var l1 = curr.offset().left;
      //容器宽度
      var w1 = curr.offset().width;
      // 存最后一个不为空的span的下标
      var last_index = $txt_node.length - 1;
      // 获取当前页最后一个span.filterSpan
      var $last_span = $($txt_node[last_index]);
      // 本页字数大于2执行
      if (last_index > 0) {
        // 避免找到最后一个为空的span
        for (var i = 0; i < $txt_node.length; i++) {
          if (!$last_span.text()) {
            $last_span = $($txt_node[$txt_node.length - 1 - (i + 1)]);
            last_index = $txt_node.length - 1 - (i + 1);
          } else {
            break;
          }
        }
        // 最后一个字符宽度
        var w2 = $last_span.offset().width;
        // 最后一个字符距离左边距离
        var l2 = $last_span.offset().left;
        // 最后一个字符距离右边的距离
        var delta1 = w1 + l1 - (l2 + w2);
        // 最后一个字没有靠最右.
        if (delta1 > 0) {
          // 最后一个字符不是句号（。）
          if (!reg1.test($last_span.text())) {
            $last_span.attr('data-publish1', 'publish-span1');
            // 获取当前行字的个数
            for (var k = 0; k < last_index + 1; k++) {
              // 通过比较两个字距离顶部的值来判断,这两个字是否在同一行
              if (last_index <= k || $($txt_node[last_index - k]).offset().top != $($txt_node[last_index - k - 1]).offset().top) {
                break;
              }
            }
            // 每个字移动距离的减量
            var reduce1 = delta1 / k;
            // 移动这一行的每一个字,达到两端对齐
            for (var n = 0; n < k; n++) {
              $($txt_node[last_index - n]).css({
                'position': 'relative',
                'left': delta1 - reduce1 * n + 'px'
              });
            }
          }
        }
      }
      // 判断每一行最后一个字是否是符号。如果是符号且靠最右时，调整位置，达到右边对齐效果
      // 符号移动自身的一半
      for (var j = 0; j < $txt_node.length; j++) {
        if ($txt_node[j + 1] === undefined || $($txt_node[j]).offset().top != $($txt_node[j + 1]).offset().top) {
          var $thisSpan = $($txt_node[j]);
          // 最后一个字符宽度
          var w3 = $thisSpan.offset().width;
          // 最后一个字符距离左边距离
          var l3 = $thisSpan.offset().left;
          var delta2 = w1 + l1 - (l3 + w3);
          // delta2 < 2   offset取值有多位小数,导致算值不能太精确,允许两个像素的盘偏差
          if (reg2.test($thisSpan.text()) && delta2 >= 0 && delta2 < 2) {
            // 获取当前行字的个数
            for (var l = 0; l < j + 1; l++) {
              // 通过比较两个字距离顶部的值来判断,这两个字是否在同一行
              if (j <= l || $($txt_node[j - l]).offset().top != $($txt_node[j - l - 1]).offset().top) {
                break;
              }
            }
            var delta3 = w3 / 2;
            // 每个字移动距离的减量
            var reduce2 = delta3 / l;
            // 移动这一行的每一个字,达到两端对齐
            for (var z = 0; z < l; z++) {
              $($txt_node[j - z]).css({
                'position': 'relative',
                'left': delta3 - reduce2 * z + 'px'
              });
            }
          }
        }
      }
    }
  };
}(js_src_global, js_libs_zeptodev);
js_src_pad_panelMainPad = function (window, $, move, publish) {
  var _ = window._;
  var MainPanel = function (options) {
    var defaults = {
      $readerObj: null,
      templHtml: '',
      // HTML 模板
      $domObj: null,
      // 该panel所在 DOM对象.
      data: {
        'chapterName': '',
        'chapterContent': '',
        'pagePerc': ''
      },
      isMobile: true,
      swipe: 'X',
      // 判断水平滑动还是竖直滑动
      basePoint: {
        X: 0,
        Y: 0
      },
      width: 0,
      // 阅读主面板的 宽;
      height: 0,
      // 阅读主面板的 高;
      pageColumn: 1
    };
    this.opts = $.extend(true, {}, defaults, options);
    // 动画页面.
    this.opts.$animatePage = null;
    // 阅读正文
    this.opts.$mainCont = null;
    // 动画正文
    this.opts.$animateCont = null;
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  MainPanel.prototype._init = function () {
    console.log('[panelMain] --> _init');
    this._renderLayout();
    this._bindEvent();
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  MainPanel.prototype._renderLayout = function () {
    var optsObj = this.opts;
    var readerOffset = optsObj.$readerObj.offset();
    optsObj.basePoint.X = readerOffset.left;
    optsObj.basePoint.Y = readerOffset.top;
    // 利用 模板 生成HTML
    var templObj = _.template(optsObj.templHtml);
    var panelHtml = templObj(optsObj.data);
    // 转化 zepto 对象;
    optsObj.$readerObj.append(panelHtml);
    optsObj.$domObj = optsObj.$readerObj.find('.read-selector-main');
    optsObj.$mainCont = optsObj.$domObj.find('.read-content');
    // 宽,高 属性;
    optsObj.width = readerOffset.width;
    optsObj.height = readerOffset.height;
    // 页面内容区域
    optsObj.$chapter = optsObj.$domObj.find('.read-view .read-chapter-view');
    optsObj.$content = optsObj.$domObj.find('.read-view .read-page-1');
    optsObj.$page = optsObj.$domObj.find('.read-view .read-offset-1');
    optsObj.$content2 = optsObj.$domObj.find('.read-view .read-page-2');
    optsObj.$page2 = optsObj.$domObj.find('.read-view .read-offset-2');
    // add by @gli-hxy-20160816 start
    optsObj.$animatePage = optsObj.$domObj.find('.read-content-animate');
    optsObj.$animateCont = optsObj.$animatePage.find('.read-content');
    optsObj.$Achapter = optsObj.$animatePage.find('.read-chapter-view');
    optsObj.$Acontent = optsObj.$animatePage.find('.read-page-1');
    optsObj.$Apage = optsObj.$animatePage.find('.read-view-offset .read-offset-1');
    // add by @gli-hxy-20160816 end
    // 两列不执行平铺动画
    if (optsObj.pageColumn == 2) {
      optsObj.$readerObj.attr('data-page-mode', 'not-mode');
    } else {
      optsObj.$readerObj.attr('data-page-mode', '');
    }
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  MainPanel.prototype._bindEvent = function () {
    var optsObj = this.opts;
    var basePos = optsObj.basePoint;
    var panelW = optsObj.width;
    var panelH = optsObj.height;
    var that = this;
    // 判断是左滑还是右滑
    optsObj.isLeft = true;
    // 判断是否是第一次进入滑动，一次滑动只判断一次左滑还是右滑
    optsObj.isMove = false;
    optsObj.$domObj.on('touchstart', function (e) {
      var touches = e.touches[0];
      //触控开始
      optsObj.flag = null;
      optsObj.movement = 0;
      //记录落点
      optsObj.pageX = touches.pageX;
      optsObj.pageY = touches.pageY;
      optsObj.isMove = true;
    });
    optsObj.$domObj.on('touchmove', function (e) {
      var pageWay = optsObj.$readerObj.attr('data-pageway');
      var pageMode = optsObj.$readerObj.attr('data-page-mode');
      if (pageMode != 'not-mode' && pageWay != 'page_2') {
        that.touchmove(e);
      }
    });
    optsObj.$domObj.on('touchend', function (e) {
      that.touchend(e);
    });
    // PC浏览器: click; Mobile浏览器: tap;
    var eventType = optsObj.isMobile ? 'tap' : 'click';
    optsObj.$domObj.on(eventType, function (e) {
      // add by gli-hxy-20160817 start 
      var tmpState = $(this).attr('data-animate');
      if (tmpState == '1') {
        // 翻页动画正在执行，按时不能操作页面
        console.info('%c [panelMain.js] -> 动画中!', 'background:yellow;');
        return;
      }
      // add by gli-hxy-20160817 end
      /* add by gli-gong-20160823 start */
      // 浏览图片。
      var targetObj = e.target;
      if (targetObj.nodeName == 'IMG' && targetObj.getAttribute('data-cover') != 1) {
        console.info('[panelMain.js]-> 点击了图片!');
        console.info('data-index:' + targetObj.getAttribute('data-index'));
        optsObj.$domObj.trigger('mainpanel:img', { 'currentIdx': targetObj.getAttribute('data-index') });
        return;
      }
      /* add by gli-gong-20160823 end. */
      // 重置.
      targetObj.setAttribute('data-event', '0');
      console.log('MainPanel -> x: ' + e.clientX + ' , y:' + e.clientY + ', type:' + e.type);
      // optsObj.$content.append(" x:" + e.clientX + " , y:" + e.clientY);
      // 判断点击区域 -- 30%, 40%, 30%
      var eX = e.clientX - basePos.X;
      var eY = e.clientY - basePos.Y;
      var eventPos = Math.floor(eX / panelW * 100);
      if (70 < eventPos && eventPos <= 100) {
        // 点击 偏右区域, 下一页 翻页;
        optsObj.$domObj.trigger('mainpanel:right');
      } else if (30 < eventPos && eventPos <= 70) {
        // 点击 中部区域, 弹出设置面板;
        optsObj.$domObj.trigger('mainpanel:middle');
      } else if (0 < eventPos && eventPos <= 30) {
        // 点击 偏右区域, 上一页 翻页;
        optsObj.$domObj.trigger('mainpanel:left');
      } else {
        console.warn('[panelMain] -> eventPos:' + eventPos);
      }
    });
  };
  /**
   * 显示页面数据. <br/>
   * 
   * @param {Object} data {
   *      'chapt_index':      {Number} 章节下标,
   *      'page_index':       {Number} 页码,
   *      'chapterId'         {String} 当前的章节id
   *      'chapterName':      {String} 章节名
   *      'chapterContent':   {String} 当前页html
   *      'pagePerc':         {String} 当前页偏移量  ps:12.34%
   *      'direction':        {String} 翻页方向  ps:'next','prev'
   *      'turnMode':         {Number} 翻页模式  ps:0,正常反应，有翻页动画;1,特殊翻页,无翻页动画
   *      'startPageOffset'   {String} 当前页的开始偏移量
   *      'endPageOffset'     {String} 当前页的结束偏移量
   *     }
   * 
   * @param {Object} way 翻页方式 ( page_1平铺翻页，page_2仿真翻页  )
   * 
   */
  MainPanel.prototype.showPagedata = function (data, way) {
    var that = this;
    var optsObj = that.opts;
    optsObj.data = data;
    // way 翻页方式
    if (way == 'page_1' && data.turnMode != 1) {
      // 平铺翻页
      if (optsObj.pageColumn == 1) {
        that._getTileData();
      } else {
        that.noAnimate();
      }
    } else if (way == 'page_2') {
      // 仿真翻页 
      that.noAnimate();
    } else {
      // 第一次打开阅读器无动画
      that.noAnimate();
    }
  };
  /**
   * trigger 获取数据 填充动画页面显示
   * 
   */
  MainPanel.prototype._getTileData = function () {
    var that = this;
    var optsObj = that.opts;
    var direction = optsObj.data.direction;
    // 填充动画页内容
    if (direction == 'next') {
      optsObj.$animatePage.eq(1).find('.read-chapter-view').html(optsObj.data.chapterName);
      optsObj.$animatePage.eq(1).find('.read-page-1').html(optsObj.data.chapterContent);
      optsObj.$animatePage.eq(1).find('.read-offset-1').html(optsObj.data.currPage);
    } else if (direction == 'prev') {
      optsObj.$animatePage.eq(0).find('.read-chapter-view').html(optsObj.data.chapterName);
      optsObj.$animatePage.eq(0).find('.read-page-1').html(optsObj.data.chapterContent);
      optsObj.$animatePage.eq(0).find('.read-offset-1').html(optsObj.data.currPage);
    }
    // 点击翻页时才执行
    if (optsObj.operation != 'swipe') {
      this._tilePage(direction);
    }
  };
  /**
   * 平铺翻页 <br/>
   * 
   * @param {String} direction 向前翻页还是向后翻页
   * @param {Object} reader Reader对象
   * 
   * @author gli-hxy-20160817
   * @revise by gli-hxy-20160913  使用translate3d方式使动画流畅
   * 
   */
  MainPanel.prototype._tilePage = function (direction) {
    var that = this;
    var optsObj = that.opts;
    // 先把书签显示标记隐藏
    optsObj.$domObj.find('.read-header .read-bookmark-view').hide();
    // 添加正在动画标志
    optsObj.$domObj.attr('data-animate', '1');
    if (direction == 'prev') {
      optsObj.$animatePage.eq(0).removeClass('read-hide');
      setTimeout(function () {
        move(optsObj.$animatePage[0]).translate(optsObj.width, 0).duration('0.3s').ease('out').end();
      }, 10);
    } else {
      optsObj.$animatePage.eq(1).removeClass('read-hide');
      setTimeout(function () {
        move(optsObj.$animatePage[1]).translate(-optsObj.width, 0).duration('0.3s').ease('out').end();
      }, 10);
    }
    setTimeout(function () {
      // 填充 阅读主页面 内容
      optsObj.$chapter.html(optsObj.data.chapterName);
      optsObj.$content.html(optsObj.data.chapterContent);
      optsObj.$page.html(optsObj.data.pagePerc);
      //          optsObj.$page.html(optsObj.data.currPage);
      that._setPageShow();
      optsObj.$domObj.find('.read-content-animate').css({
        'transform': 'none',
        '-webkit-transform': 'none',
        '-moz-transform': 'none',
        '-ms-transform': 'none'
      }).addClass('read-hide');
      optsObj.$animatePage.eq(1).find('.read-chapter-view').html('');
      optsObj.$animatePage.eq(1).find('.read-animate-content').html('');
      optsObj.$animatePage.eq(1).find('.read-page').html('');
      optsObj.$animatePage.eq(0).find('.read-chapter-view').html('');
      optsObj.$animatePage.eq(0).find('.read-animate-content').html('');
      optsObj.$animatePage.eq(0).find('.read-page').html('');
      // 取消正在动画标志
      optsObj.$domObj.attr('data-animate', '0');
      // 判断当前页是否有书签
      optsObj.$domObj.trigger('mainpanel:showBookmark', optsObj.data);
    }, 300);
  };
  /**
   * 仿真翻页 <br/>
   * 
   * @param {String} direction 向前翻页还是向后翻页
   * @param {Object} reader Reader对象
   * 
   * @author gli-hxy-20160817
   * 
   */
  MainPanel.prototype.realPage = function () {
    var that = this;
    var optsObj = that.opts;
    var direction = optsObj.data.direction;
    optsObj.$domObj.attr('data-animate', '1');
    // 先把书签显示标记隐藏
    optsObj.$domObj.find('.read-header .read-bookmark-view').hide();
    optsObj.$real.show();
    setTimeout(function () {
      optsObj.$real.addClass('read-real-turn-' + direction);
    }, 10);
    // 填充 阅读主页面 内容
    optsObj.$realChapter.html(optsObj.$chapter.html());
    optsObj.$realContent.html(optsObj.$content.html());
    optsObj.$chapter.html(optsObj.data.chapterName);
    optsObj.$content.html(optsObj.data.chapterContent);
    optsObj.$page.html(optsObj.data.firstPagePerc);
    //      optsObj.$page.html(optsObj.data.currPage + '/' + optsObj.data.totalPage);
    optsObj.$content2.html(optsObj.data.secondPage);
    optsObj.$page2.html(optsObj.data.pagePerc);
    //      optsObj.$page2.html(optsObj.data.currPage + 1 + '/' + optsObj.data.totalPage);
    setTimeout(function () {
      optsObj.$real.removeClass('read-real-turn-' + direction);
      optsObj.$real.hide();
      optsObj.$domObj.attr('data-animate', '0');
      // 判断当前页是否有书签
      optsObj.$domObj.trigger('mainpanel:showBookmark', optsObj.data);
    }, 500);
    //精排
    //      if(optsObj.usePublish) {
    //          publish.setPageType(optsObj.$content);
    //      }
    this._setPageShow();
  };
  /**
   * 第一次进入阅读器时
   * @param {Object} direction
   * @param {Object} reader
   */
  MainPanel.prototype.noAnimate = function () {
    var that = this;
    var optsObj = that.opts;
    var direction = optsObj.data.direction;
    // 判断当前页是否有书签
    optsObj.$domObj.trigger('mainpanel:showBookmark', optsObj.data);
    // 填充 阅读主页面 内容
    optsObj.$chapter.html(optsObj.data.chapterName);
    optsObj.$content.html(optsObj.data.chapterContent);
    optsObj.$page.html(optsObj.data.firstPagePerc);
    //      optsObj.$page.html(optsObj.data.currPage + '/' + optsObj.data.totalPage);
    optsObj.$content2.html(optsObj.data.secondPage);
    optsObj.$page2.html(optsObj.data.pagePerc);
    //      optsObj.$page2.html(optsObj.data.currPage + 1 + '/' + optsObj.data.totalPage);
    //精排
    //      if(optsObj.usePublish) {
    //          publish.setPageType(optsObj.$content);
    //      }
    this._setPageShow();
  };
  /**
   * 页面显示加载，加载公式/图片/表格/笔记等. <br/>
   * 
   */
  MainPanel.prototype._setPageShow = function () {
    var optsObj = this.opts;
    if (typeof MathJax !== 'undefined') {
      MathJax.Hub.Queue([
        'Typeset',
        MathJax.Hub
      ]);
    }
    this._setImgSrc();
    this._setTableStyle();
    this._bindTableEvent();
    optsObj.$domObj.trigger('mainpanel:showNote');
  };
  /**
   * 设置图片src值. <br/>
   * 
   * @author gli-jiangxq-20160816
   */
  MainPanel.prototype._setImgSrc = function () {
    var optsObj = this.opts;
    optsObj.$mainCont.find('img[data-src]').each(function () {
      var data_src = $(this).attr('data-src');
      $(this).attr('src', data_src);
      $(this).removeAttr('data-src');
    });
  };
  /**
   * 设置表格缩小样式. <br/>
   * 
   * @author gli-jiangxq-20160816
   */
  MainPanel.prototype._setTableStyle = function () {
    var optsObj = this.opts;
    var pageW = optsObj.$mainCont.width();
    var parentH = 0;
    optsObj.$mainCont.find('table').each(function () {
      if ($(this).attr('zoom') == '1') {
        return true;
      }
      if ($(this).width() > pageW) {
        parentH = $(this).parent().height();
        $(this).parent().addClass('read-tbl-big-data');
        parentH = parentH * 2 - $(this).parent().height();
        $(this).attr('zoom', '1');
        $(this).attr('data-resth', parentH);
      }
    });
    optsObj.$mainCont.find('table[zoom="1"]').each(function () {
      var height = $(this).attr('data-resth');
      var tempDiv = $('<div class="read-tbl-wrap" style="height: ' + height + 'px">');
      $(this).parent().append(tempDiv);
      var tmpImg = $('<div class="read-open-pop">');
      $(this).parent().append(tmpImg);
      tempDiv.append($(this));
    });
  };
  /**
   * 绑定表格放大事件. <br/>
   * 
   * @author gli-jiangxq-20160816
   */
  MainPanel.prototype._bindTableEvent = function () {
    var that = this;
    var optsObj = this.opts;
    var basePos = optsObj.basePoint;
    var panelW = optsObj.width;
    var bigTable = optsObj.$mainCont.find('table[zoom="1"]');
    var eventType = optsObj.isMobile ? 'tap' : 'click';
    bigTable.on(eventType, function (e) {
      var eX = e.clientX - basePos.X;
      var eventPos = Math.floor(eX / panelW * 100);
      // 点击表格30%-70%响应放大事件
      if (30 < eventPos && eventPos <= 70) {
        var table_clone = $(this).clone(true);
        that._expandTable(table_clone);
        e.stopPropagation();
      }
    });
  };
  /**
   * 将缩小的表格放大显示. <br/>
   * 
   * @param {Object} table 需要放大的表格
   * @author gli-jiangxq-20160816
   */
  MainPanel.prototype._expandTable = function (table) {
    var optsObj = this.opts;
    var eventType = optsObj.isMobile ? 'tap' : 'click';
    var maskObj = $('<div class="read-comm-panel read-comm-table">');
    var tableObj = $('<div class="read-comm-tbl-wrap">');
    var closeObj = $('<div class="read-close-btn">');
    maskObj.append(closeObj);
    maskObj.append(tableObj);
    tableObj.append(table);
    optsObj.$readerObj.append(maskObj);
    maskObj.on(eventType + ' swipeDown', function (e) {
      return false;
    });
    closeObj.on(eventType, function (e) {
      maskObj.remove();
      e.stopPropagation();
    });
  };
  /**
   * 设置 主面板字体大小. <br/>
   * 
   * @param {Object} options
   * 
   */
  MainPanel.prototype.setFontSize = function (options) {
    var optsObj = this.opts;
    var tmpFontSize = {
      'oldValue': '',
      'newValue': ''
    };
    tmpFontSize.oldValue = 'read-size-' + options.oldValue;
    tmpFontSize.newValue = 'read-size-' + options.newValue;
    optsObj.$domObj.find('.read-content').removeClass(tmpFontSize.oldValue).addClass(tmpFontSize.newValue);
    optsObj.$domObj.find('.read-delicate-container').removeClass(tmpFontSize.oldValue).addClass(tmpFontSize.newValue);
    optsObj.$domObj.find('.read-animate-content').removeClass(tmpFontSize.oldValue).addClass(tmpFontSize.newValue);
  };
  /**
   * 设置 主面板字体类型. <br/>
   * 
   * @param {Object} options
   * 
   */
  MainPanel.prototype.setFontFamily = function (options) {
    var optsObj = this.opts;
    var tmpFamily = {
      'oldValue': '',
      'newValue': ''
    };
    tmpFamily.oldValue = 'read-font-family-' + options.oldValue;
    tmpFamily.newValue = 'read-font-family-' + options.newValue;
    optsObj.$domObj.find('.read-content').removeClass(tmpFamily.oldValue).addClass(tmpFamily.newValue);
    optsObj.$domObj.find('.read-delicate-container').removeClass(tmpFamily.oldValue).addClass(tmpFamily.newValue);
    optsObj.$domObj.find('.read-animate-content').removeClass(tmpFamily.oldValue).addClass(tmpFamily.newValue);
  };
  /**
   * 设置 背景颜色.
   * 
   * @param {Object} options
   * 
   */
  MainPanel.prototype.setBgColor = function (options) {
    var optsObj = this.opts;
    var tmpBgColor = {
      'oldValue': '',
      'newValue': ''
    };
    tmpBgColor.oldValue = 'read-bg-' + options.oldValue;
    tmpBgColor.newValue = 'read-bg-' + options.newValue;
    // 阅读主页面.
    optsObj.$readerObj.removeClass('read-night');
    optsObj.$domObj.removeClass(tmpBgColor.oldValue);
    optsObj.$domObj.addClass(tmpBgColor.newValue);  // 动画页面.
                                                    //      optsObj.$animatePage.removeClass(tmpBgColor.oldValue);
                                                    //      optsObj.$animatePage.addClass(tmpBgColor.newValue);
  };
  /**
   * 打开面板. <br/>
   * 
   */
  MainPanel.prototype.open = function () {
    console.log('[panelMain] --> open');
    var optsObj = this.opts;
    optsObj.$domObj.fadeIn(300);
  };
  /**
   * 关闭面板. <br/>
   * 
   */
  MainPanel.prototype.close = function () {
    var optsObj = this.opts;
    optsObj.$domObj.fadeOut(100);
  };
  /**
   * 自定义事件. <br/>
   * 
   * @param eventName {String}   事件名称, "mainpanel:left", "mainpanel:middle", "mainpanel:right", "mainpanel:swipeDown",
   *                                     "mainpanel:showNote" 
   * @param cb        {Function} 回调事件
   * 
   */
  MainPanel.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  /**
   * 滑动中
   * @param {Object} e 滑动event对象
   */
  MainPanel.prototype.touchmove = function (e) {
    var that = this;
    var optsObj = this.opts;
    var touches = e.touches[0];
    var X = touches.pageX - optsObj.pageX;
    var Y = touches.pageY - optsObj.pageY;
    // 设置是滑动翻页（标识）-- 还是点击翻页标识
    optsObj.operation = 'swipe';
    //判断
    if (!optsObj.flag) {
      optsObj.flag = Math.abs(X) > Math.abs(Y) ? 'X' : 'Y';
    }
    if (optsObj.flag === optsObj.swipe) {
      e.preventDefault();
      e.stopPropagation();
      optsObj.movement = X;
      if (optsObj.isMove) {
        optsObj.isLeft = X < 0 ? false : true;
        if (X < 0) {
          optsObj.isLeft = false;
          optsObj.$domObj.trigger('mainpanel:right');
        } else {
          optsObj.isLeft = true;
          optsObj.$domObj.trigger('mainpanel:left');
        }
        optsObj.isMove = false;
      }
      if (!optsObj.isLeft) {
        optsObj.$animatePage.eq(1).removeClass('read-hide');
        optsObj.$animatePage[1].style.webkitTransform = 'translate3d(' + X + 'px' + ',0,0)';
      } else if (optsObj.isLeft) {
        optsObj.$animatePage.eq(0).removeClass('read-hide');
        optsObj.$animatePage[0].style.webkitTransform = 'translate3d(' + X + 'px' + ',0,0)';
      }
    }
  };
  /**
   * 结束滑动
   * @param {Object} e 滑动event对象
   */
  MainPanel.prototype.touchend = function (e) {
    var that = this;
    var optsObj = this.opts;
    var minRange = 50;
    var movement = optsObj.movement;
    // 设置是滑动翻页（标识）-- 还是点击翻页标识
    optsObj.operation = 'tap';
    if (!optsObj.flag) {
      return;
    }
    e.preventDefault();
    //滑动结束判断是否执行翻页动画
    if (Math.abs(movement) > Math.abs(minRange)) {
      var direction = optsObj.isLeft ? 'prev' : 'next';
      that._tilePage(direction);
    } else {
      optsObj.$animatePage[1].style.webkitTransform = 'translate3d(' + 0 + 'px' + ',0,0)';
      optsObj.$animatePage[0].style.webkitTransform = 'translate3d(' + 0 + 'px' + ',0,0)';
      optsObj.$animatePage.addClass('read-hide');
    }
  };
  return MainPanel;
}(js_src_global, js_libs_zeptodev, move, js_src_widget_publish);
js_src_pad_panelSettingPad = function (window, radioGroup, switches, drag, move, $) {
  //  var $ = window.Zepto;
  var _ = window._;
  var SettingPanel = function (options) {
    var defaults = {
      wrapDomId: '',
      $readerObj: null,
      templHtml: '',
      // 参数设置 主模板
      fontlightHtml: '',
      // 字体/亮度 面板
      progressHtml: '',
      // 字体/亮度 面板
      $domObj: null,
      $headerObj: null,
      $footerObj: null,
      $bodyObj: null,
      $fontlight: null,
      $progress: null,
      isMobile: true,
      isNightMode: null,
      // 屏幕亮度, 系统亮度, 字体大小, 翻页方式, 字体类型, 背景颜色, 屏幕长亮;
      settingData: null,
      // 阅读进度.
      progressData: null
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  SettingPanel.prototype._init = function () {
    console.log('[SettingPanel] --> _init');
    this._renderLayout();
    this._bindEvent();
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  SettingPanel.prototype._renderLayout = function () {
    var optsObj = this.opts;
    // 利用 模板 生成HTML
    var templObj = _.template(optsObj.templHtml);
    var panelHtml = templObj();
    // 转化 zepto 对象;
    optsObj.$domObj = $(panelHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
    optsObj.$headerObj = optsObj.$domObj.find('.read-header');
    optsObj.$footerObj = optsObj.$domObj.find('.read-footer');
    var headerTopVal = optsObj.$headerObj.css('top');
    var footerBottomVal = optsObj.$footerObj.css('bottom');
    // 保存 header, footer 原始值. 动画还原.
    optsObj.$headerObj.attr('data-top', headerTopVal);
    optsObj.$footerObj.attr('data-bottom', footerBottomVal);
    // 进度设置面板 
    this._renderProgress();
    // 字体设置面板
    this._renderFontlight();
    // 判断是否渲染书签-- 显示或者隐藏书签标记
    optsObj.bookmarkDom = optsObj.$domObj.find('.read-header .read-bookmark-btn');
    if (!optsObj.useBookmark) {
      optsObj.bookmarkDom.css('visibility', 'hidden');
    }
    if (!optsObj.useComplaint) {
      optsObj.$headerObj.find('.read-copyright').css('visibility', 'hidden');
    }
    if (!optsObj.useSearch) {
      optsObj.$headerObj.find('.read-search').css('visibility', 'hidden');
    }
    if (!optsObj.useExit) {
      optsObj.$headerObj.find('.read-exit-reader').hide();
    }
  };
  /**
   * 渲染 进度设置面板 布局. <br/>
   * 
   */
  SettingPanel.prototype._renderProgress = function () {
    var optsObj = this.opts;
    var progressTemplObj = _.template(optsObj.progressHtml);
    var progressHtml = progressTemplObj();
    optsObj.$footerObj.append(progressHtml);
    optsObj.$progress = optsObj.$footerObj.find('.read-schedule-set-panel');
    console.info('%c 阅读进度!!:' + optsObj.progressData, 'background:yellow;');
    // 阅读进度 gli-hxy-20160809
    var $progressWrap = optsObj.$progress.find('.read-progress-bar');
    this.$progressObj = new drag({
      'domSelector': $progressWrap,
      'value': optsObj.progressData || 0,
      'isMobile': optsObj.isMobile
    });
    // 拖动定位页码.
    optsObj.$progress.on('dragEnd', function (e, data) {
      optsObj.$domObj.trigger('progress:click', data);
    });
  };
  /**
   * 渲染 字体设置面板 布局.  <br/>
   * 
   */
  SettingPanel.prototype._renderFontlight = function () {
    var optsObj = this.opts;
    var tmpSettingData = optsObj.settingData;
    var fontlightTemplObj = _.template(optsObj.fontlightHtml);
    var fontlightHtml = fontlightTemplObj();
    optsObj.$footerObj.append(fontlightHtml);
    optsObj.$fontlight = optsObj.$footerObj.find('.read-font-set-panel');
    // 屏幕亮度 - 自调节-拖动 gli-hxy-20160808
    var $systemLightbarWrap = optsObj.$fontlight.find('.read-light-bar');
    this.$systemLightbarObj = new drag({
      'domSelector': $systemLightbarWrap,
      'value': tmpSettingData.brightness,
      'isMobile': optsObj.isMobile
    });
    // 屏幕亮度 - 系统亮度.
    var $systemLightWrap = optsObj.$fontlight.find('.read-system-light');
    this.$systemLightObj = new switches({
      'domSelector': $systemLightWrap,
      // 'data': [false, true],
      'value': tmpSettingData.useSysBrightness,
      'isMobile': optsObj.isMobile
    });
    // 屏幕长亮.
    // @author gli-hxy-20160808
    var $screenLightWrap = optsObj.$fontlight.find('.read-screen-always-bright .read-bright-bar');
    this.$screenLightObj = new switches({
      'domSelector': $screenLightWrap,
      // 'data': ['close', 'open'],
      'value': tmpSettingData.screenLongActive,
      'isMobile': optsObj.isMobile
    });
    // 字体大小.
    var $fontSizeWrap = optsObj.$fontlight.find('.read-font-size');
    this.$fontSizeObj = new radioGroup({
      '$domObj': $fontSizeWrap,
      'data': tmpSettingData.fontSize.list,
      'value': tmpSettingData.fontSize.value,
      'isMobile': optsObj.isMobile
    });
    // 翻页方式
    var $pagingWrap = optsObj.$fontlight.find('.read-turn-page');
    this.$pagingObj = new radioGroup({
      'type': 'oval',
      '$domObj': $pagingWrap,
      'data': [
        {
          'text': '平铺翻页',
          // tile
          'value': 'page_1'
        },
        {
          'text': '无',
          // simulation
          'value': 'page_2'
        }
      ],
      'value': 'page_1',
      'isMobile': optsObj.isMobile
    });
    // 字体类型
    var $fontFamilyWrap = optsObj.$fontlight.find('.read-font-family-view');
    this.$fontFamilyObj = new radioGroup({
      'type': 'oval',
      '$domObj': $fontFamilyWrap,
      'data': tmpSettingData.fontFamily.list,
      'value': tmpSettingData.fontFamily.value
    });
    // 背景颜色
    var $bgColorWrap = optsObj.$fontlight.find('.read-bg-color');
    this.$bgColorObj = new radioGroup({
      'type': 'round',
      '$domObj': $bgColorWrap,
      'data': tmpSettingData.bgColor.list,
      'value': tmpSettingData.bgColor.value
    });
    innerSetDisplay();
    // 根据开关设置是否显示
    function innerSetDisplay() {
      var showNum = 4;
      if (!optsObj.useFonts) {
        $fontSizeWrap.parents('.read-setting-bar').hide();
        $fontFamilyWrap.parents('.read-setting-bar').hide();
        showNum -= 1;
      }
      if (!optsObj.useBgColor) {
        $bgColorWrap.parents('.read-setting-bar').hide();
        showNum -= 1;
      }
      if (!optsObj.useLight) {
        $systemLightWrap.parents('.read-setting-bar').hide();
        $screenLightWrap.parents('.read-screen-always-bright').hide();
        optsObj.$footerObj.find('.read-night-btn').hide();
        showNum -= 1;
      }
      if (!optsObj.usePageWay) {
        $pagingWrap.hide();
        showNum -= 1;
      }
      if (!optsObj.useLight && !optsObj.usePageWay) {
        $screenLightWrap.parents('.read-setting-bar').hide();
      }
      if (!showNum) {
        optsObj.$footerObj.find('.read-font-btn').hide();
      }
    }
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  SettingPanel.prototype._bindEvent = function () {
    var optsObj = this.opts;
    var that = this;
    // 确定事件类型.
    var eventType = optsObj.isMobile ? 'tap' : 'click';
    // 隐藏面板
    optsObj.$domObj.find('.read-body').on(eventType, function () {
      that.close();
    });
    // 返回--退出reader
    optsObj.$domObj.find('.read-exit-reader').on(eventType, function () {
      that.close();
      optsObj.$domObj.trigger('out:click');
    });
    // 目录, 书签, 笔记.
    optsObj.$footerObj.find('.read-cbn-btn').on(eventType, function () {
      optsObj.$domObj.trigger('cbn:click');
      that.close();
    });
    // 打开版权投诉
    optsObj.$domObj.find('.read-header .read-copyright').on(eventType, function () {
      optsObj.$domObj.trigger('complaint:click');
      that.close();
    });
    // 更新书签。
    optsObj.bookmarkDom.on(eventType, function () {
      optsObj.$domObj.trigger('bookmark:click', optsObj.bookmarkDom);
    });
    // 打开搜索面板
    optsObj.$domObj.find('.read-header .read-search').on(eventType, function () {
      optsObj.$domObj.trigger('showSearch:click');
      that.close();
    });
    // 章节向前翻.
    optsObj.$footerObj.find('.read-prev').on(eventType, function () {
      optsObj.$domObj.trigger('progress:prev');
    });
    // 章节向后翻.
    optsObj.$footerObj.find('.read-next').on(eventType, function () {
      optsObj.$domObj.trigger('progress:next');
    });
    // 拖动定位页码组件.
    optsObj.$footerObj.find('.read-progress-btn').on(eventType, function () {
      $(this).addClass('read-active').siblings().removeClass('read-active');
      that._hideChildPanel(optsObj.$fontlight);
      that._showChildPanel(optsObj.$progress);
      optsObj.$domObj.trigger('progress:setVal');
    });
    // 设置-字体, 亮度 等.
    optsObj.$footerObj.find('.read-font-btn').on(eventType, function () {
      $(this).addClass('read-active').siblings().removeClass('read-active');
      that._hideChildPanel(optsObj.$progress);
      that._showChildPanel(optsObj.$fontlight);
    });
    // 屏幕亮度, dragMove
    this.$systemLightbarObj.on('dragMove', function (e, param) {
      console.info('[panelSetting.js] -> dragMove:' + param);
      that._setScreenBrightness(parseFloat(param));
      that.$systemLightbarObj.enable();
    });
    this.$systemLightbarObj.on('dragEnd', function (e, param) {
      console.info('[panelSetting.js] -> dragEnd:' + param);
      if (that.$systemLightObj.getValue()) {
        that.$systemLightObj.changeState();
      }
    });
    // 系统亮度
    this.$systemLightObj.on('change:click', function (event, param) {
      if (param) {
        that.$systemLightbarObj.disabled();
        that._useSysBrightness();
      } else {
        that.$systemLightbarObj.enable();
        that._setScreenBrightness(that.$systemLightbarObj.getValue());
      }
    });
    // 设置翻页方式
    this.$pagingObj.on('change:click', function (event, param) {
      console.log(' %c 设置翻页方式! ' + param, 'color:green');
      optsObj.$domObj.trigger('pageway:click', param);
    });
    // 字体大小.
    this.$fontSizeObj.on('change:click', function (e, param) {
      optsObj.$domObj.trigger('size:click', param);
    });
    // 字体类型
    this.$fontFamilyObj.on('change:click', function (e, param) {
      optsObj.$domObj.trigger('family:click', param);
    });
    // 背景颜色
    this.$bgColorObj.on('change:click', function (e, param) {
      optsObj.isNightMode = false;
      optsObj.$domObj.trigger('bgcolor:click', param);
    });
    // 屏幕长亮
    this.$screenLightObj.on('change:click', function (e, param) {
      gli_set_keepscreenon(param);
      // 修改开关文字样式
      var alwaysBright = optsObj.$domObj.find('.read-footer .read-screen-always-bright');
      if (param) {
        alwaysBright.find('.read-font.read-lf').addClass('read-active');
        alwaysBright.find('.read-font.read-rt').removeClass('read-active');
      } else {
        alwaysBright.find('.read-font.read-lf').removeClass('read-active');
        alwaysBright.find('.read-font.read-rt').addClass('read-active');
      }
    });
    // 夜间模式  
    // add by gli-hxy-20160913
    optsObj.$domObj.find('.read-footer .read-set-btn .read-night-btn').on(eventType, function () {
      optsObj.isNightMode = !optsObj.isNightMode;
      optsObj.$domObj.trigger('night:click', optsObj.isNightMode);
    });
  };
  /**
   * 设置快速翻页章节信息. <br/>
   * 
   * @param {Array} data {
   *          'name':         //chaptName, 章节名
   *          'currIndex':    //optsObj.chapt_index + 1, 
   *          'total':        //chaptTotal 总章节数
   *      }
   * 
   * @author gli-jiangxq 20160811
   */
  SettingPanel.prototype.setProgressVal = function (data) {
    var optsObj = this.opts;
    var prev = data.currIndex - 1;
    var next = data.total - data.currIndex;
    if (prev === 0) {
      prev = '无';
    }
    if (next === 0) {
      prev = '无';
    }
    if (data.turnMode) {
      this.$progressObj.setValue(data.val);
    }
    optsObj.$footerObj.find('.read-prev-chapter').html(prev);
    optsObj.$footerObj.find('.read-next-chapter').html(next);
    optsObj.$footerObj.find('.read-chapt-title').html(data.name);
    optsObj.$footerObj.find('.read-chapt-current').html(data.currIndex);
    optsObj.$footerObj.find('.read-chapt-total').html(data.total);
  };
  /**
   * 设置长亮进度条的颜色. <br/>
   * 
   * @param {String} color 如: "yellow" OR "#ffffff".
   * 
   * @author gli-hxy 20160818
   */
  SettingPanel.prototype.setColor = function (color) {
    this.$systemLightbarObj.setColor(color);
  };
  /**
   * 显示 子面板 -- "进度设置面板", "字体/亮度 设置面板". <br/>
   * 
   * @param panelObj {Object} 面板对象. 如: $progress, $fontlight;
   * 
   */
  SettingPanel.prototype._showChildPanel = function (panelObj) {
    var optsObj = this.opts;
    var height = panelObj.height();
    var fontSize = parseFloat(panelObj.css('font-size'));
    height = panelObj.hasClass('read-font-set-panel') ? height + fontSize / 5 : height;
    move(panelObj[0]).set('top', -height + 'px').duration('0.5s').end();
  };
  /**
   * 隐藏 子面板 -- "进度设置面板", "字体/亮度 设置面板". <br/>
   * 
   * @param panelObj {Object} 面板对象. 如: $progress, $fontlight;
   * 
   */
  SettingPanel.prototype._hideChildPanel = function (panelObj) {
    var optsObj = this.opts;
    move(panelObj[0]).set('top', '0').duration('0.5s').end();
  };
  /**
   * 获取面板对象. <br/>
   * 
   */
  SettingPanel.prototype.getPanelObject = function () {
  };
  /**
   * 注册 自定义 监听事件. <br/>
   * 
   * @param eventName {String}   事件名称, 
   *                  "cbn:click", "progress:click", "close:click", 
   *                  "family:click", "size:click", "progress:prev", "progress:next"
   * 
   * @param cb        {Function} 回调事件
   * 
   */
  SettingPanel.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  /**
   * 打开面板. <br/>
   * 
   */
  SettingPanel.prototype.open = function () {
    console.log('[SettingPanel] --> open');
    var optsObj = this.opts;
    optsObj.$domObj.fadeIn(200);
    // 显示 面板
    move(optsObj.wrapDomId + ' .read-setting-panel  .read-header').set('top', '0').duration('0.3s').end();
    move(optsObj.wrapDomId + ' .read-setting-panel  .read-footer').set('bottom', '0').duration('0.3s').end();
    optsObj.$footerObj.find('.read-set-btn .read-content').children().each(function () {
      $(this).removeClass('read-active');
    });
    this.$fontSizeObj.reSize();
    this.$pagingObj.reSize();
    this.$fontFamilyObj.reSize();
    this.$bgColorObj.reSize();
    this.$systemLightbarObj.reSize();
    this.$progressObj.reSize();
    this.$screenLightObj.reSize();
    this.$systemLightObj.reSize();
  };
  /**
   * 关闭面板. <br/>
   * 
   */
  SettingPanel.prototype.close = function () {
    var optsObj = this.opts;
    var headerTopVal = optsObj.$headerObj.attr('data-top');
    var footerBottomVal = optsObj.$footerObj.attr('data-bottom');
    // 隐藏 面板
    move(optsObj.wrapDomId + ' .read-setting-panel .read-header').set('top', headerTopVal).duration('0.3s').end();
    move(optsObj.wrapDomId + ' .read-setting-panel .read-footer').set('bottom', footerBottomVal).duration('0.3s').end();
    setTimeout(function () {
      optsObj.$domObj.fadeOut(10);
    }, 300);
    this._hideChildPanel(optsObj.$progress);
    this._hideChildPanel(optsObj.$fontlight);
    optsObj.$domObj.trigger('close:click');
  };
  /**
   * 获取 设置面板相应参数. <br/>
   * ps: 不包括 阅读进度.
   * 
   */
  SettingPanel.prototype.getSettingData = function () {
    var optsObj = this.opts;
    var tmpData = optsObj.settingData;
    // 屏幕亮度
    tmpData.brightness = this.$systemLightbarObj.getValue();
    // 系统亮度
    tmpData.useSysBrightness = this.$systemLightObj.getValue();
    // 屏幕长亮.
    tmpData.screenLongActive = this.$screenLightObj.getValue();
    // 字体大小
    tmpData.fontSize.value = this.$fontSizeObj.getValue();
    // 翻页方式
    tmpData.pagingType.value = this.$pagingObj.getValue();
    // 字体类型
    tmpData.fontFamily.value = this.$fontFamilyObj.getValue();
    // 背景颜色
    tmpData.bgColor.value = this.$bgColorObj.getValue();
    // 夜间模式
    tmpData.isNightMode = optsObj.isNightMode;
    return tmpData;
  };
  /**
   * 设置屏幕亮度.<br/>
   * 
   * @param {Number} brightnessVal 屏幕亮度值 (ps: 范围 [0 - 1])
   * 
   */
  SettingPanel.prototype._setScreenBrightness = function (brightnessVal) {
    var MIX = 0.3;
    var RANGE = 0.7;
    var tmpVal = MIX + brightnessVal * RANGE;
    tmpVal = parseFloat(tmpVal.toFixed(2));
    if (typeof gli_set_brightness == 'function') {
      gli_set_brightness(tmpVal);
    }
  };
  /**
   * 使用 系统亮度.<br/>
   * 
   */
  SettingPanel.prototype._useSysBrightness = function () {
    var that = this;
    if (typeof gli_get_brightness == 'function') {
      gli_get_brightness(function (val) {
        that._setScreenBrightness(val);
      });
    }
  };
  return SettingPanel;
}(js_src_global, js_src_widget_plugRadioGroup, js_src_widget_plugSwitches, js_src_widget_plugDrag, move, js_libs_zeptodev);
js_src_pad_bookmarkPad = function (window, $, tool, move, dialog, Msg) {
  var _ = window._;
  var Bookmark = function (options) {
    console.log('[Bookmark] -> 构造函数!');
    var defaults = {
      wrapObj: null,
      tmplHtml: '',
      isMobile: true,
      data: null,
      markDomObj: null
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化 <br>.
   */
  Bookmark.prototype._init = function () {
    var optsObj = this.opts;
    optsObj.templObj = _.template(optsObj.tmplHtml);
    this._bindEvent();
    this.dialog = new dialog({
      $wrapDomObj: optsObj.$readerObj,
      isMobile: optsObj.isMobile,
      okBtn: {
        txt: '确定',
        cssClass: '',
        func: function () {
        }
      },
      cancelBtn: {
        txt: '离开',
        cssClass: '',
        func: function () {
        }
      }
    });
  };
  /**
   * 事件委托 绑定事件.<br/>
   * 
   */
  Bookmark.prototype._bindEvent = function () {
    var that = this;
    var optsObj = this.opts;
    var eventName = optsObj.isMobile ? 'tap swipeLeft swipeRight' : 'click swipeLeft swipeRight';
    // 点击书签删除
    optsObj.wrapObj.on(eventName, '.read-bookmark-del', function (e) {
      console.log('[bookmark.js]书签点击了删除' + e.type);
      optsObj.wrapObj.trigger('bookmark:delclick');
      var oneChapterBookmark = $(this).parents('.read-one-chapter-bookmark');
      var bookmarkObj = {
        'chapterId': oneChapterBookmark.attr('data-chapterid'),
        'bookmarkid': $(this).parents('.read-bookmark').attr('data-bookmarkid')
      };
      that.delBookmark(bookmarkObj);
    });
    // 点击书签原文跳转
    optsObj.wrapObj.on(eventName, '.read-original-text', function (e) {
      // 点击书签 
      var percent = parseFloat($(this).parents('.read-bookmark').attr('data-percent'));
      optsObj.wrapObj.trigger('bookmark:click', percent);
    });
  };
  /**
   * 渲染书签页面
   * 
   * @param {Object} data 书签数据对象
   */
  Bookmark.prototype.renderLayout = function (data) {
    var optsObj = this.opts;
    var tmp = tool.convertData(data.bookmark_list, 'bookmark_list');
    var bookmarkConvert = {
      'chapter_list': tmp,
      'bookmark_list': data.bookmark_list
    };
    optsObj.data = bookmarkConvert;
    if (tmp.length > 0) {
      var tempHtml = optsObj.templObj(bookmarkConvert);
      optsObj.wrapObj.html(tempHtml);
    } else {
      optsObj.wrapObj.find('.read-has-bookmark').html('').hide();
      optsObj.wrapObj.find('.read-no-bookmark').fadeIn();
    }
  };
  /**
   * 新增书签信息. <br/>
   * 
   * @param {Object} bookmarkData 书签对象
   * @param {Object} bookmarkData.text 书签位置文本
   * @param {Object} bookmarkData.pageSite 书签位置
   * @param {Object} bookmarkData.chapterId 书签位置的章节id
   * @param {Object} bookmarkData.chapterName 书签位置的章节名
   * 
   */
  Bookmark.prototype.addBookmark = function (bookmarkData) {
    var that = this;
    var optsObj = this.opts;
    console.log('[Bookmark] -> addBookmark!');
    var bookmark = {
      bookmark_id: tool.getRandomKey(),
      bookmark_text: bookmarkData.text.slice(0, 100),
      bookmark_time: tool.getNowFormatDate(),
      bookmark_page: bookmarkData.pageSite,
      chapter_name: bookmarkData.chapterName,
      chapter_id: bookmarkData.chapterId,
      'oparate_type': '1',
      // 1：增; 3：删
      's_id': ''  // s_id为服务器数据库的id,离线新增书签时设置为 空字符串;  
    };
    optsObj.markDomObj.attr({
      'data-bookmarkid': bookmark.bookmark_id,
      'data-chapterid': bookmarkData.chapterId
    }).addClass('read-active');
    var updateObj = $.extend(true, {}, bookmark);
    // 新增书签发送给服务器
    optsObj.api.setBookmark(updateObj, function (data) {
      console.log('[Bookmark.prototype.addBookmark] --> 增加书签-成功!' + data);
      innerAddBookmark();
      var addMark = {
        'oparate_type': '1',
        's_id': data.s_id,
        'bookmark_id': data.bookmark_id,
        'time_stamp': data.time_stamp
      };
      that._updLocalData(addMark);
    }, function (data) {
      if (!optsObj.isClient) {
        that.dialog.setMsg(Msg.bookMarkFail);
        that.dialog.open();
        optsObj.markDomObj.removeClass('read-active');
      } else {
        innerAddBookmark();
      }
    });
    function innerAddBookmark() {
      optsObj.data.bookmark_list.push(bookmark);
      var tempBookmark = {
        'time_stamp': optsObj.data.time_stamp,
        'bookmark_list': optsObj.data.bookmark_list
      };
      // 然后保存本地 
      optsObj.saveFile(optsObj.filePath, JSON.stringify(tempBookmark));
      // 重新渲染书签显示
      that.renderLayout(optsObj.data);
    }
  };
  /**
   * 删除 书签信息. <br/>
   * 
   * @param {Object} bookmarkData 书签对象
   * @param {Object} bookmarkData.bookmarkid 书签id
   * @param {Object} bookmarkData.chapterId 书签位置的章节id
   * 
   */
  Bookmark.prototype.delBookmark = function (bookmarkData) {
    var that = this;
    var optsObj = this.opts;
    console.log('[Bookmark] -> delBookmark!');
    if (_.isEmpty(bookmarkData)) {
      bookmarkData = {
        'bookmarkid': optsObj.markDomObj.attr('data-bookmarkid'),
        'chapterId': optsObj.markDomObj.attr('data-chapterid')
      };
    }
    var bookmarkid = bookmarkData.bookmarkid;
    var list = optsObj.data.bookmark_list;
    var markItem = null;
    for (var i = 0, len = list.length; i < len; i++) {
      markItem = list[i];
      if (markItem.bookmark_id == bookmarkData.bookmarkid) {
        markItem.oparate_type = '3';
        break;
      }
    }
    var tempBookmark = {
      'time_stamp': optsObj.data.time_stamp,
      'bookmark_list': optsObj.data.bookmark_list
    };
    // 保存本地
    optsObj.saveFile(optsObj.filePath, JSON.stringify(tempBookmark));
    if (optsObj.markDomObj.attr('data-bookmarkid') == bookmarkid) {
      optsObj.markDomObj.removeClass('read-active');
    }
    // 重新渲染书签显示
    that.renderLayout(optsObj.data);
    // 删除 与 服务器交互
    if (!!markItem.s_id) {
      // 同步的数据才需要向服务发请求.
      optsObj.api.delBookmark({ 'bookmark_id': bookmarkid }, function (data) {
        var delMark = {
          'oparate_type': '3',
          's_id': data.s_id,
          'bookmark_id': data.bookmark_id,
          'time_stamp': data.time_stamp
        };
        that._updLocalData(delMark);
      }, function (data) {
        if (!optsObj.isClient) {
          that.dialog.setMsg(Msg.bookMarkDelFail);
          that.dialog.open();
          markItem.oparate_type = '0';
          if (optsObj.markDomObj.attr('data-bookmarkid') == bookmarkid) {
            optsObj.markDomObj.addClass('read-active');
          }
          // 重新渲染书签显示
          that.renderLayout(optsObj.data);
        }
      });
    }
  };
  /**
   * 增加 书签信息. <br/>
   * 
   * @param {Object} bookmarkData 书签对象
   * 
   */
  Bookmark.prototype.updateBookmarks = function (bookmarkData) {
    var that = this;
    var optsObj = this.opts;
    console.log('[Bookmark] -> updateBookmarks!');
    optsObj.markDomObj = $(bookmarkData.bookmarkDom);
    if (!optsObj.markDomObj.hasClass('read-active')) {
      that.addBookmark(bookmarkData);
    } else {
      that.delBookmark();
    }
  };
  /**
   * 获取 书签信息. <br/>
   * 
   */
  Bookmark.prototype.getBookmarks = function () {
    console.log('[Bookmark] -> getBookmarks! ');
    var optsObj = this.opts;
    return optsObj.data;
  };
  /**
   * 判断是否显示书签
   * 
   * @param {Object} pageObj {
   *      'chapt_index':      {Number} 章节下标,
   *      'page_index':       {Number} 页码,
   *      'chapterId'         {String} 当前的章节id
   *      'chapterName':      {String} 章节名
   *      'chapterContent':   {String} 当前页html
   *      'pagePerc':         {String} 当前页偏移量  ps:12.34%
   *      'direction':        {String} 翻页方向  ps:'next','prev'
   *      'turnMode':         {Number} 翻页模式  ps:0,正常反应，有翻页动画;1,特殊翻页,无翻页动画
   *      'startPageOffset'   {String} 当前页的开始偏移量
   *      'endPageOffset'     {String} 当前页的结束偏移量
   *     }
   */
  Bookmark.prototype.isShowBookmark = function (pageObj) {
    console.log('[Bookmark] -> isShowBookmark!');
    var that = this;
    var optsObj = that.opts;
    var chapterList = [];
    // 判断当前显示也是否有书签 
    var hasBookmark = true;
    // 取出 optsObj.data.chapter_list
    if (!_.isEmpty(optsObj.data)) {
      chapterList = optsObj.data.chapter_list;
    }
    for (var i = 0; i < chapterList.length; i++) {
      var iChapt = chapterList[i];
      // 先找到章节id相等的所有书签,减少循环次数
      if (pageObj.chapterId == iChapt.chapter_id) {
        for (var j = 0; j < iChapt.bookmark_list.length; j++) {
          var jBookmark = iChapt.bookmark_list[j];
          // 当前书签的偏移量
          var bPage = jBookmark.bookmark_page;
          if (bPage <= pageObj.endPageOffset && bPage > pageObj.startPageOffset) {
            hasBookmark = false;
            that._showMarkIcon(jBookmark.bookmark_id, 'open');
            break;
          }
        }
        break;
      }
    }
    if (hasBookmark) {
      that._showMarkIcon('', 'close');
    }
  };
  /**
   * 在主面板显示书签标记并赋值data-bookmarkid. <br/>
   * 
   * @param {String} bookmark_id 书签id
   * @param {String} status 显示状态 open显示 close隐藏
   * 
   */
  Bookmark.prototype._showMarkIcon = function (bookmark_id, status) {
    var optsObj = this.opts;
    if (optsObj.markDomObj.length == 0) {
      optsObj.markDomObj = optsObj.wrapObj.parents('.read-reader-pad').find('.read-setting-panel').find('.read-header .read-bookmark-btn');
    }
    if (status == 'open') {
      optsObj.markDomObj.attr('data-bookmarkid', bookmark_id).addClass('read-active');
    } else {
      optsObj.markDomObj.attr('data-bookmarkid', '').removeClass('read-active');
    }
  };
  /**
   * 返回 书签DOM对象(jq). <br/>
   * 
   * 
   */
  Bookmark.prototype.getMarkDom = function () {
    return this.opts.markDomObj;
  };
  /**
   * 当用户执行 增加/删除 操作,向后台发送请求,根据返回值 更新本地数据.<br/>
   * 
   * @param {Object} bookmark
   *              bookmark.s_id
   *              bookmark.oparate_type
   *              bookmark.bookmark_id
   *              bookmark.time_stamp
   * 
   * @author gli-gonglong-20161028
   * 
   */
  Bookmark.prototype._updLocalData = function (bookmark) {
    var that = this;
    var optsObj = this.opts;
    var list = optsObj.data.bookmark_list;
    var item = null;
    for (var i = 0, len = list.length; i < len; i++) {
      item = list[i];
      if (item.bookmark_id == bookmark.bookmark_id) {
        if (bookmark.oparate_type == '1') {
          // 增
          item.s_id = bookmark.s_id;
          item.oparate_type = '0';
        } else if (bookmark.oparate_type == '3') {
          // 删
          list.splice(i, 1);
        }
        optsObj.data.time_stamp = bookmark.time_stamp;
        break;
      }
    }
    var tempBookmark = {
      'time_stamp': optsObj.data.time_stamp,
      'bookmark_list': optsObj.data.bookmark_list
    };
    // 然后保存本地 
    optsObj.saveFile(optsObj.filePath, JSON.stringify(tempBookmark));
  };
  return Bookmark;
}(js_src_global, js_libs_zeptodev, js_src_tool, move, js_src_widget_plugDialog, js_src_message_zh);
js_src_pad_panelEditPad = function (window, move, $, dialog, Msg, tool) {
  var _ = window._;
  var editPanel = function (options) {
    var defaults = {
      $readerObj: null,
      editHtml: '',
      $domObj: null,
      isMobile: true,
      noteData: null,
      sigleNote: null,
      // 单条笔记
      api: null
    };
    this.opts = $.extend(false, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  editPanel.prototype._init = function () {
    console.log('[editPanel] --> _init');
    this._renderLayout();
    this._bindEvent();
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  editPanel.prototype._renderLayout = function () {
    var optsObj = this.opts;
    var editTemplObj = _.template(optsObj.editHtml);
    var editHtml = editTemplObj();
    // 笔记编辑 dom
    optsObj.$domObj = $(editHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  editPanel.prototype._bindEvent = function () {
    var that = this;
    var optsObj = that.opts;
    var editTarea = optsObj.$domObj.find('.read-pad-content textarea');
    // 确定事件类型.
    var eventType = optsObj.isMobile ? 'tap' : 'click';
    // 关闭笔记编辑面板 
    optsObj.$domObj.find('.read-pad-body-header .read-cancel-btn').on(eventType, function () {
      var val = editTarea.val().trim();
      editTarea.blur();
      that.cancel(val);
    });
    // 保存笔记信息
    optsObj.$domObj.find('.read-pad-body-header .read-send-btn').on(eventType, function () {
      var val = editTarea.val().trim();
      editTarea.blur();
      that._sendNote(optsObj.thisNoteObj, val);
    });
    // 继续编辑
    optsObj.$domObj.find('.read-canel-box-cont').on(eventType, function () {
      that.hideCanelBox();
      editTarea.focus();
    });
    // 离开
    optsObj.$domObj.find('.read-canel-box-leave').on(eventType, function () {
      that.close();
    });
    // 关闭版权投诉面板 -- 取消
    optsObj.$domObj.find('.read-pad-content textarea').on('focus', function () {
      that.hideCanelBox();
    });
  };
  /**
   * 打开笔记编辑面板. <br/>
   * 
   */
  editPanel.prototype.open = function (data) {
    var that = this;
    var optsObj = that.opts;
    optsObj.thisNoteObj = data;
    optsObj.$domObj.fadeIn();
    optsObj.$domObj.find('.read-pad-content .read-original-text').html(data.original);
    if (!!data.note_text) {
      // true 笔记在编辑
      optsObj.isEditNote = true;
      optsObj.$domObj.find('.read-pad-content textarea').val(data.note_text);
    } else {
      // false 笔记在新增
      optsObj.isEditNote = false;
    }
    if (!!data.isunderline) {
      _.each(optsObj.noteData.note_list, function (note) {
        if (note.note_id == data.note_id) {
          optsObj.thisNoteObj.s_id = note.s_id;
          return false;
        }
      });
    }
  };
  /**
   * 取消笔记编辑面板. <br/>
   * 
   */
  editPanel.prototype.cancel = function (value) {
    var that = this;
    var optsObj = that.opts;
    // 判断是否输入了内容
    if (value) {
      that.showCanelBox();
    } else {
      that.close();
    }
  };
  /**
   * 取消确认框--显示. <br/>
   * 
   */
  editPanel.prototype.showCanelBox = function () {
    var that = this;
    var optsObj = that.opts;
    var box = optsObj.$domObj.find('.read-pad-canel-box');
    var height = parseFloat(box.css('font-size'));
    box.show();
    setTimeout(function () {
      move(box[0]).set('height', height + 'px').duration('0.2s').end();
    }, 10);
  };
  /**
   * 取消确认框--隐藏. <br/>
   * 
   */
  editPanel.prototype.hideCanelBox = function () {
    var that = this;
    var optsObj = that.opts;
    var box = optsObj.$domObj.find('.read-pad-canel-box');
    move(box[0]).set('height', 0).duration('0.2s').end();
    setTimeout(function () {
      box.hide();
    }, 200);
  };
  /**
   * 关闭笔记编辑面板. <br/>
   * 
   */
  editPanel.prototype.close = function () {
    var that = this;
    var optsObj = that.opts;
    // 清空数据
    optsObj.$domObj.find('.read-pad-content textarea').val('');
    that.hideCanelBox();
    optsObj.$domObj.hide();
  };
  /**
   * 发送笔记编辑信息. <br/>
   * 
   * @param {Object} note 笔记参数
   * @param {String} val  笔记内容
   * 
   */
  editPanel.prototype._sendNote = function (note, val) {
    var that = this;
    var optsObj = that.opts;
    // 验证传送内容是否为空
    if (!!val) {
      // 发送成功后的提示框
      that.sucessDialog = new dialog({
        $wrapDomObj: optsObj.$domObj,
        okBtn: {
          txt: '确定',
          cssClass: '',
          func: function () {
            that.close();
            that.sucessDialog.destroy();
          }
        },
        cancelBtn: {
          txt: '离开',
          cssClass: '',
          func: function () {
            that.close();
            that.sucessDialog.destroy();
          }
        }
      });
      // 当前笔记对象
      var saveNote = {
        chapter_id: note.chapter_id,
        chapter_name: note.chapter_name,
        firstId: note.firstId,
        lastId: note.lastId,
        note_id: note.note_id,
        note_page: note.note_page,
        note_text: val,
        note_time: tool.getNowFormatDate(),
        original: note.original,
        s_id: note.s_id,
        oparate_type: '',
        isSave: false
      };
      if (optsObj.isEditNote || !!note.isunderline) {
        // 编辑笔记
        saveNote.oparate_type = 2;
        var tmpNoteList = optsObj.noteData.note_list;
        for (var i = 0, len = tmpNoteList.length; i < len; i++) {
          if (tmpNoteList[i].note_id == saveNote.note_id) {
            // 覆盖旧信息
            tmpNoteList[i] = saveNote;
            break;
          }
        }
      } else {
        // 新增笔记
        saveNote.s_id = '';
        saveNote.note_id = tool.getRandomKey();
        // {Number}  1：增; 2：改; 3：删
        saveNote.oparate_type = 1;
        optsObj.noteData.note_list.push(saveNote);
      }
      optsObj.$domObj.trigger('addnote:click', {
        'noteData': optsObj.noteData,
        'sigleNote': saveNote,
        'flag': optsObj.isEditNote
      });
    } else {
      var emptyDialog = new dialog({
        $wrapDomObj: optsObj.$domObj,
        okBtn: {
          txt: '确定',
          cssClass: '',
          func: function () {
            emptyDialog.destroy();
          }
        },
        cancelBtn: {
          txt: '离开',
          cssClass: '',
          func: function () {
            that.close();
            emptyDialog.destroy();
          }
        }
      });
      // 没输入内容 点击保存笔记时
      emptyDialog.setMsg(Msg.inputContent);
      emptyDialog.open();
    }
  };
  /**
   * 自定义事件. <br/>
   * 
   * @param eventName {String}   事件名称, 'addnote:click'
   * @param cb        {Function} 回调事件
   * 
   */
  editPanel.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  return editPanel;
}(js_src_global, move, js_libs_zeptodev, js_src_widget_plugDialog, js_src_message_zh, js_src_tool);
js_src_pad_panelDetailPad = function (window, move, $, dialog, Msg, tool) {
  var _ = window._;
  var detailPanel = function (options) {
    var defaults = {
      $readerObj: null,
      detailHtml: '',
      $domObj: null,
      isMobile: true,
      noteData: null,
      thisNoteObj: null,
      // 当前笔记id和章节id对象
      thisNoteList: [],
      // 当前章节除开划线的笔记信息
      api: null,
      shareObj: null
    };
    this.opts = $.extend(false, {}, defaults, options);
    // 笔记分享的回调函数集合
    this._noteShareActiveItems = {
      'wx': null,
      'wx_moments': null,
      'sina_weibo': null,
      'qq': null,
      'qq_zone': null
    };
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  detailPanel.prototype._init = function () {
    console.log('[detailPanel] --> _init');
    this._renderLayout();
    this._bindEvent();
    this.dialog = new dialog({ $wrapDomObj: this.opts.$domObj });
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  detailPanel.prototype._renderLayout = function () {
    var optsObj = this.opts;
    var detailTemplObj = _.template(optsObj.detailHtml);
    var shareItem = this._getShareItemsInfo();
    var detailHtml = detailTemplObj({ 'shareNotes': shareItem });
    // 笔记详情 dom
    optsObj.$domObj = $(detailHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  detailPanel.prototype._bindEvent = function () {
    var that = this;
    var optsObj = that.opts;
    // 确定事件类型.
    var eventType = optsObj.isMobile ? 'tap swipeRight' : 'click';
    // 关闭笔记详情面板
    optsObj.$domObj.find('.read-note-detail-cover').on(eventType, function (e) {
      (e.type == 'tap' || e.type == 'swipeRight') && that.close();
    });
    // 删除本条笔记
    optsObj.$domObj.find('.read-footer .read-delete-btn').on(eventType, function (e) {
      e.type == 'tap' && that.deleteNote();
    });
    // 笔记编辑
    optsObj.$domObj.find('.read-footer .read-edit-btn').on(eventType, function (e) {
      e.type == 'tap' && that.editNote();
      that.close();
    });
    // 笔记上翻
    optsObj.$domObj.find('.read-footer .read-prev').on(eventType, function (e) {
      e.type == 'tap' && that._prev();
    });
    // 笔记下翻
    optsObj.$domObj.find('.read-footer .read-next').on(eventType, function (e) {
      e.type == 'tap' && that._next();
    });
    // "分享笔记" -- 微博, 微信, QQ等
    if (optsObj.note_share_conf.flag) {
      // _noteShareActiveItems
      var shareItems = optsObj.note_share_conf.share_items;
      for (var i = 0, len = shareItems.length; i < len; i++) {
        if (shareItems[i].flag) {
          that._noteShareActiveItems[shareItems[i].type] = shareItems[i].share_cb;
        }
      }
      optsObj.$domObj.find('.read-reader-share').on(eventType, 'li', function () {
        var tmpShareNote = that._getCurrentNotInfo();
        var shareType = $(this).attr('data-type');
        if (typeof that._noteShareActiveItems[shareType] == 'function') {
          that._noteShareActiveItems[shareType](tmpShareNote);
        } else {
          console.error('PC分享笔记:' + $(this).find('.read-text-over').html() + ',未注册回调函数!');
        }
      });
    } else {
      // 关闭分享至汉字
      optsObj.$domObj.find('.read-footer .read-title').hide();
    }
  };
  /**
   * 打开笔记详情面板. <br/>
   * 
   * @param {Number} noteid 笔记id
   * @param {Number} chapterid 章节id
   * 
   */
  detailPanel.prototype.open = function (noteid, chapterid) {
    var that = this;
    var optsObj = that.opts;
    // 存储当前笔记数据,删除时用
    optsObj.thisNoteObj = {
      noteid: noteid,
      chapterid: chapterid
    };
    // 动画
    optsObj.$domObj.fadeIn();
    var animateObj = optsObj.$domObj.find('.read-note-detail-content');
    var width = animateObj.width();
    move(animateObj[0]).translate(-width, 0).duration('0.3s').end();
    // 显示笔记
    this._filterNote(chapterid);
    this.viewNote();
  };
  /**
   * 关闭笔记详情面板. <br/>
   * 
   */
  detailPanel.prototype.close = function () {
    var that = this;
    var optsObj = that.opts;
    // 动画
    var animateObj = optsObj.$domObj.find('.read-note-detail-content');
    var width = animateObj.width();
    move(animateObj[0]).translate(width, 0).duration('0.3s').end();
    optsObj.$domObj.fadeOut();
  };
  /**
   * 显示笔记. <br/>
   * 
   */
  detailPanel.prototype.viewNote = function () {
    var that = this;
    var optsObj = that.opts;
    var thisNoteObj = optsObj.thisNoteObj;
    if (thisNoteObj.noteid === -1) {
      // 当前章节没笔记啦
      optsObj.$domObj.find('.read-body .read-original-text').html('');
      optsObj.$domObj.find('.read-body .read-note-text').html('当前章节没笔记啦\uFF01');
      optsObj.$domObj.find('.read-body .read-time').html('');
      optsObj.$domObj.find('.read-footer .read-page .read-current').html(0);
      optsObj.$domObj.find('.read-footer .read-page .read-total').html(0);
      optsObj.$domObj.find('.read-body .read-btns').css('pointer-events', 'none');
      optsObj.$domObj.find('.read-footer').css('pointer-events', 'none');
      return false;
    } else {
      optsObj.$domObj.find('.read-body .read-btns').css('pointer-events', '');
      optsObj.$domObj.find('.read-footer').css('pointer-events', '');
    }
    // 遍历找到chapterid相等且noteid相等的笔记
    _.each(optsObj.thisNoteList, function (note, i) {
      if (note.note_id == thisNoteObj.noteid) {
        optsObj.thisNoteData = note;
        optsObj.$domObj.find('.read-body .read-original-text').html(note.original);
        optsObj.$domObj.find('.read-body .read-note-text').html(note.note_text);
        optsObj.$domObj.find('.read-body .read-time').html(note.note_time);
        optsObj.$domObj.find('.read-footer .read-page .read-current').html(i + 1);
        optsObj.$domObj.find('.read-footer .read-page .read-total').html(optsObj.thisNoteList.length);
        optsObj.thisNoteIndex = i;
        return false;
      }
    });
    if (typeof MathJax !== 'undefined') {
      MathJax.Hub.Queue([
        'Typeset',
        MathJax.Hub
      ]);
    }
  };
  /**
   * 删除笔记后,重新显示笔记. <br/>
   * 
   */
  detailPanel.prototype.reshowNote = function () {
    var optsObj = this.opts;
    this._filterNote(optsObj.thisNoteObj.chapterid);
    var index = optsObj.thisNoteIndex;
    if (index > 0) {
      index = index - 1;
    } else {
      index = index < optsObj.thisNoteList.length ? index : -1;
    }
    optsObj.thisNoteObj.noteid = index > -1 ? optsObj.thisNoteList[index].note_id : -1;
    this.viewNote();
  };
  /**
   * 过滤划线显示笔记. <br/>
   * 
   * @param {String}  chapterid   当前的笔记的章节id
   *  
   */
  detailPanel.prototype._filterNote = function (chapterid) {
    var optsObj = this.opts;
    var noteList = [];
    optsObj.thisNoteList = [];
    for (var i = 0, len = optsObj.noteData.chapter_list.length; i < len; i++) {
      if (optsObj.noteData.chapter_list[i].chapter_id == chapterid) {
        noteList = optsObj.noteData.chapter_list[i].note_list;
        break;
      }
    }
    for (var j = 0, m = noteList.length; j < m; j++) {
      if (!!noteList[j].note_text && noteList[j].oparate_type != '3') {
        optsObj.thisNoteList.push(noteList[j]);
      }
    }
  };
  /**
   * 笔记上翻. <br/>
   * 
   */
  detailPanel.prototype._prev = function () {
    var that = this;
    var optsObj = that.opts;
    var oldIndex = optsObj.thisNoteIndex;
    optsObj.thisNoteIndex = optsObj.thisNoteIndex > 0 ? optsObj.thisNoteIndex - 1 : 0;
    optsObj.thisNoteObj.noteid = optsObj.thisNoteList[optsObj.thisNoteIndex].note_id;
    if (oldIndex == optsObj.thisNoteIndex) {
      return false;
    }
    this.viewNote();
  };
  /**
   * 笔记下翻. <br/>
   * 
   */
  detailPanel.prototype._next = function () {
    var that = this;
    var optsObj = that.opts;
    var oldIndex = optsObj.thisNoteIndex;
    var max = optsObj.thisNoteList.length - 1;
    optsObj.thisNoteIndex = optsObj.thisNoteIndex < max ? optsObj.thisNoteIndex + 1 : max;
    optsObj.thisNoteObj.noteid = optsObj.thisNoteList[optsObj.thisNoteIndex].note_id;
    if (oldIndex == optsObj.thisNoteIndex) {
      return false;
    }
    this.viewNote();
  };
  /**
   *编辑笔记. <br/>
   * 
   */
  detailPanel.prototype.editNote = function () {
    var that = this;
    var optsObj = that.opts;
    optsObj.$domObj.trigger('detailDel:edit', optsObj.thisNoteData);  //          this.viewNote();
  };
  /**
   * 删除笔记. <br/>
   * 
   */
  detailPanel.prototype.deleteNote = function () {
    var that = this;
    var optsObj = that.opts;
    optsObj.$domObj.trigger('detailDel:delete', optsObj.thisNoteObj);
  };
  /**
   * 自定义事件. <br/>
   * 
   * @param eventName {String}   事件名称, 'detailDel:delete', 'detailDel:edit'
   * @param cb        {Function} 回调事件
   * 
   */
  detailPanel.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  /**
   * 获取"分享笔记" 布局相应信息.<br/>
   * 
   * 
   * @return shareItems {Array}
   * @author gli-gonglong-20161018
   * 
   */
  detailPanel.prototype._getShareItemsInfo = function () {
    var optsObj = this.opts;
    var that = this;
    var defaultConf = {
      'flag': false,
      'share_items': [
        {
          // 微信好友
          'type': 'wx',
          //  开关(是否使用该分享). false: 关闭(默认); true: 打开,此时必须注册回调函数!
          'flag': false,
          // 回调函数--分享逻辑
          'share_cb': null
        },
        {
          // 微信朋友圈
          'type': 'wx_moments',
          'flag': false,
          'share_cb': null
        },
        {
          // 新浪微博
          'type': 'sina_weibo',
          'flag': false,
          'share_cb': null
        },
        {
          // qq好友
          'type': 'qq',
          'flag': false,
          'share_cb': null
        },
        {
          // qq空间
          'type': 'qq_zone',
          'flag': false,
          'share_cb': null
        }
      ]
    };
    var propInfo = {
      'wx': {
        'txt': '微信好友',
        'icon_css': 'read-icon-wx'
      },
      'wx_moments': {
        'txt': '微信朋友圈',
        'icon_css': 'read-icon-wx-pyq'
      },
      'sina_weibo': {
        'txt': '新浪微博',
        'icon_css': 'read-icon-wb'
      },
      'qq': {
        'txt': 'qq好友',
        'icon_css': 'read-icon-qq'
      },
      'qq_zone': {
        'txt': 'qq空间',
        'icon_css': 'read-icon-qzone'
      }
    };
    var currentConf = $.extend(true, {}, defaultConf, optsObj.note_share_conf);
    var shareItems = [];
    if (currentConf.flag) {
      // 开启"分享"功能.
      var tmpItems = currentConf.share_items;
      var tmp = {};
      var tmpType = '';
      for (var i = 0, len = tmpItems.length; i < len; i++) {
        if (tmpItems[i].flag) {
          // 开启 分享的具体渠道.
          tmpType = tmpItems[i].type;
          tmp = {
            'flag': true,
            'icon_css': propInfo[tmpType].icon_css,
            'txt': propInfo[tmpType].txt,
            'type': tmpType
          };
          shareItems.push(tmp);
        }
      }
    }
    return shareItems;
  };
  /**
   * 获取当前笔记相关信息. <br/>
   * 
   * return noteInfo {Object} 包括: book_id, chapter_id, note_txt
   * 
   */
  detailPanel.prototype._getCurrentNotInfo = function () {
    var that = this;
    var optsObj = that.opts;
    var noteInfo = {
      'book_id': '',
      'chapter_id': '',
      'note_txt': ''
    };
    try {
      noteInfo.book_id = optsObj.api.opts.baseData.book_id || '';
      noteInfo.chapter_id = optsObj.thisNoteObj.chapterid;
      noteInfo.note_txt = optsObj.thisNoteData.original;
    } catch (e) {
      console.error('[panelDetail.js]' + e);
    }
    return noteInfo;
  };
  return detailPanel;
}(js_src_global, move, js_libs_zeptodev, js_src_widget_plugDialog, js_src_message_zh, js_src_tool);
js_src_pad_notePad = function (window, $, move, editPanel, detailPanel, Tool, dialog, Msg) {
  var _ = window._;
  var Note = function (options) {
    var defaults = {
      wrapObj: null,
      $readerObj: null,
      $contentObj: null,
      tmplHtml: '',
      isMobile: true,
      /**
       * {
       *  updateTime  更新事件
       *  id_counter   记录id
       *  chapter_list: {
       *          chapter_id
       *          chapter_name
       *          note_count  笔记数量
       *          note_list: {
       *              note_id
       *              original  原文
       *              note_text 笔记
       *              note_time
       *              firstId
       *              lastId
       *              note_page
       *          }
       *      }
       * }
       */
      data: null,
      // 笔记划线数据
      chapter_id: '',
      // 当前章节id
      editHtml: '',
      detailHtml: '',
      shareHtml: ''
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化   <br/>.
   */
  Note.prototype._init = function () {
    var optsObj = this.opts;
    optsObj.templObj = _.template(optsObj.tmplHtml);
    //转化 zepto 对象
    optsObj.$contentObj = optsObj.$readerObj.find('.read-selector-main .read-content');
    // 笔记提示对话框
    this.noteDialog = new dialog({
      $wrapDomObj: this.opts.$readerObj,
      okBtn: {
        txt: '确定',
        cssClass: '',
        func: function () {
        }
      },
      cancelBtn: {
        txt: '离开',
        cssClass: '',
        func: function () {
        }
      }
    });
  };
  /**
   * 事件委托 绑定事件.<br/>
   * 
   */
  Note.prototype._bindEvent = function () {
    var optsObj = this.opts;
    var that = this;
    var eventName = optsObj.isMobile ? 'tap' : 'click';
    // 点击笔记的删除按钮
    optsObj.wrapObj.on(eventName, '.read-note-time .read-icon', function (e) {
      var oneChapterNote = $(this).parents('.read-one-chapter-notes');
      var delNoteData = {
        'chapterid': oneChapterNote.attr('data-chapterid'),
        'noteid': $(this).parents('.read-note').attr('data-noteid')
      };
      that.delNote(delNoteData);
      e.stopPropagation();
    });
    // 点击笔记跳转到相应页面
    optsObj.wrapObj.on(eventName, '.read-original-text', function (e) {
      var percent = $(this).parents('.read-note').attr('data-percent');
      optsObj.wrapObj.trigger('cbnnote:click', parseFloat(percent));
      e.stopPropagation();
    });
    // 更新笔记
    optsObj.editObj.on('addnote:click', function (event, data) {
      optsObj.data = data.noteData;
      that.renderCbnPage(optsObj.data);
      that.showNote(optsObj.chapter_id, optsObj.chapter_name);
      if (data.flag) {
        optsObj.noteDetailObj.reshowNote();
      }
      if (!!data.sigleNote) {
        that._sendNote(data.sigleNote);
      }
    });
    // 执行触发的 detailDel:delete
    optsObj.noteDetailObj.on('detailDel:delete', function (e, thisData) {
      that.delNote(thisData);
    });
    // 执行触发的 detailDel:edit
    optsObj.noteDetailObj.on('detailDel:edit', function (e, thisData) {
      thisData.chapter_id = optsObj.chapter_id;
      that.editNote(thisData);
    });
  };
  /**
   * 渲染布局
   * 
   * @param {Object} data 笔记信息
   * 
   */
  Note.prototype.renderLayout = function (data) {
    var that = this;
    var optsObj = this.opts;
    optsObj.data = data || {
      time_stamp: '0',
      note_list: []
    };
    this.renderCbnPage(optsObj.data);
    // 渲染编辑笔记页面
    optsObj.editObj = new editPanel({
      $readerObj: optsObj.$readerObj,
      editHtml: optsObj.editHtml,
      isMobile: optsObj.isMobile,
      api: optsObj.api,
      saveFile: optsObj.saveFile,
      filePath: optsObj.filePath,
      noteData: optsObj.data
    });
    // 渲染笔记详情页面
    optsObj.noteDetailObj = new detailPanel({
      $readerObj: optsObj.$readerObj,
      detailHtml: optsObj.detailHtml,
      shareHtml: optsObj.shareHtml,
      isMobile: optsObj.isMobile,
      api: optsObj.api,
      saveFile: optsObj.saveFile,
      filePath: optsObj.filePath,
      noteData: optsObj.data,
      note_share_conf: optsObj.note_share_conf
    });
    this._bindEvent();
  };
  /* 渲染cbn面板布局. <br/>
   * 
   * @param {Object} data 笔记信息
   */
  Note.prototype.renderCbnPage = function (data) {
    var that = this;
    var optsObj = this.opts;
    // 是否有笔记
    var flag = false;
    var tmp = Tool.convertData(data.note_list, 'note_list');
    data.chapter_list = tmp;
    var noteConvert = {
      'chapter_list': tmp,
      'nowDate': ''
    };
    if (noteConvert.chapter_list.length > 0) {
      for (var i = 0, len = noteConvert.chapter_list.length; i < len; i++) {
        if (noteConvert.chapter_list[i].note_count) {
          flag = true;
          break;
        }
      }
      var nowDate = Tool.getNowFormatDate();
      noteConvert.nowDate = nowDate.substr(0, 10);
      var tempHtml = optsObj.templObj(noteConvert);
      optsObj.wrapObj.html(tempHtml);
      if (typeof MathJax !== 'undefined') {
        MathJax.Hub.Queue([
          'Typeset',
          MathJax.Hub
        ]);
      }
    }
    if (!flag) {
      optsObj.wrapObj.find('.read-has-note').html('').hide();
      optsObj.wrapObj.find('.read-no-note').fadeIn();
    }
  };
  /**
   * 取消删除状态. <br/>
   * 
   */
  Note.prototype.cancelDel = function () {
    var that = this;
    var optsObj = that.opts;
    var allNote = optsObj.wrapObj.find('.read-has-note .read-note');
    // 判断当前书签页是否有某一条书签处于待删除状态
    for (var i = 0; i < allNote.length; i++) {
      // 如果有书签处于待删除状态，这取消这个状态
      if ($(allNote[i]).attr('data-hasDel') == 'true') {
        var thisNote = $(allNote[i]).find('.read-note-del');
        var width = thisNote.width();
        move(thisNote[0]).translate(width, 0).duration('0.2s').end();
        $(allNote[i]).attr('data-hasDel', 'false');
      }
    }
  };
  /**
   * 删除 笔记信息. <br/>
   * 
   * @param {Object} delNoteData {
   *      noteid      {String}  笔记id
   *      chapterid   {String}  笔记所在的章节id
   *  }
   * 
   */
  Note.prototype.delNote = function (delNoteData) {
    var that = this;
    var optsObj = this.opts;
    // var chapter_list = optsObj.data.chapter_list;
    var noteid = delNoteData.noteid;
    var note_list = optsObj.data.note_list;
    var note_sid = '';
    var tmpNoteItem = null;
    for (var i = 0, len = note_list.length; i < len; i++) {
      tmpNoteItem = note_list[i];
      if (tmpNoteItem.note_id == noteid) {
        if (tmpNoteItem.s_id == '') {
          // 删除"离线"状态的数据.
          note_list.splice(i, 1);
        } else {
          tmpNoteItem.oparate_type = '3';
          note_sid = tmpNoteItem.s_id;
        }
        break;
      }
    }
    var localNoteData = {
      'time_stamp': optsObj.data.time_stamp,
      'note_list': optsObj.data.note_list
    };
    // 保存本地
    optsObj.saveFile(optsObj.filePath, JSON.stringify(localNoteData));
    that.renderCbnPage(optsObj.data);
    // 重新渲染笔记显示
    if (!!optsObj.noteDetailObj.opts.thisNoteObj) {
      optsObj.noteDetailObj.reshowNote();
    }
    this.showNote(optsObj.chapter_id, optsObj.chapter_name);
    if (note_sid != '') {
      // 删除的数据在DB有记录时.
      optsObj.api.delNote({ 'note_id': noteid }, function (data) {
        that._updateSingleNote({
          's_id': '',
          'note_id': data.note_id,
          'time_stamp': data.time_stamp,
          'oparate_type': 3
        });
      }, function () {
        if (!optsObj.isClient) {
          that.noteDialog.setMsg(Msg.noteDelFail);
          that.noteDialog.open();
          tmpNoteItem.oparate_type = '0';
          // 重新渲染笔记显示
          that.renderCbnPage(optsObj.data);
          if (!!optsObj.noteDetailObj.opts.thisNoteObj) {
            optsObj.noteDetailObj._filterNote(optsObj.chapter_id);
            optsObj.noteDetailObj.opts.thisNoteObj.noteid = noteid;
            optsObj.noteDetailObj.viewNote();
          }
          that.showNote(optsObj.chapter_id, optsObj.chapter_name);
        }
      });
    }
  };
  /**
   * 页面显示笔记和划线. <br/>
   * 
   * @param {String} chapterid  章节ID
   * @param {String} chapterName  章节名
   */
  Note.prototype.showNote = function (chapterid, chapterName) {
    var optsObj = this.opts;
    var eventName = optsObj.isMobile ? 'tap' : 'click';
    optsObj.chapter_id = chapterid;
    optsObj.chapter_name = chapterName;
    var note_list = [];
    // 显示前,先清除
    optsObj.$contentObj.find('.read-gli-note').removeClass('read-gli-note');
    optsObj.$contentObj.find('.read-gli-underline').removeClass('read-gli-underline');
    optsObj.$contentObj.find('.read-note-icon').remove();
    var chapts = !optsObj.data ? [] : optsObj.data.chapter_list;
    for (var i = 0, len = chapts.length; i < len; i++) {
      if (chapts[i].chapter_id == chapterid) {
        // 深复制
        note_list = chapts[i].note_list.concat();
        break;
      }
    }
    // 笔记开始结束data-id
    var first_id = optsObj.$contentObj.find('span[data-id]').first().attr('data-id');
    var last_id = optsObj.$contentObj.find('span[data-id]').last().attr('data-id');
    first_id = parseInt(first_id);
    last_id = parseInt(last_id);
    // 笔记开始结束下标
    var firstId = 0;
    var lastId = 0;
    var oldId = 0;
    var note_id = '';
    var note_text = '';
    var fontsize = optsObj.$contentObj.css('font-size');
    fontsize = parseFloat(fontsize.replace('px', ''));
    var readerTop = optsObj.$readerObj.offset().top;
    var readerLeft = optsObj.$readerObj.offset().left;
    // 按顺序查找显示
    while (note_list.length) {
      firstId = parseInt(note_list[0].firstId);
      lastId = parseInt(note_list[0].lastId);
      oldId = lastId;
      note_id = note_list[0].note_id;
      note_text = note_list[0].note_text;
      // 笔记跨页等特殊情况也能得到笔记开始结束位置
      firstId = firstId > first_id ? firstId : first_id;
      lastId = lastId < last_id ? lastId : last_id;
      // 笔记不在当前页
      if (firstId > lastId) {
        note_list.splice(0, 1);
        continue;
      }
      if (note_text === '') {
        // 划线
        for (var j = firstId; j <= lastId; j++) {
          optsObj.$contentObj.find('span[data-id="' + j + '"]').attr('data-noteid', note_id);
          if (!optsObj.$contentObj.find('span[data-id="' + j + '"]').hasClass('read-gli-note')) {
            optsObj.$contentObj.find('span[data-id="' + j + '"]').addClass('read-gli-underline');
          }
        }
      } else {
        // 笔记
        for (var j = firstId; j <= lastId; j++) {
          optsObj.$contentObj.find('span[data-id="' + j + '"]').attr('data-noteid', note_id).addClass('read-gli-note');
        }
        if (lastId === oldId) {
          // 笔记标记图标
          var $noteIcon = $('<div class="read-note-icon">');
          var $notelast = optsObj.$contentObj.find('span[data-id="' + lastId + '"]');
          var top = $notelast.offset().top;
          var left = $notelast.offset().left;
          var width = $notelast.width();
          top = top < fontsize ? fontsize : top;
          // 笔记图标设置位置 并绑定事件
          $noteIcon.css({
            'top': top - fontsize + 'px',
            'left': left + width - fontsize + 'px'
          }).attr('data-noteid', note_id).attr('data-chapterid', chapterid).on(eventName, function (event) {
            optsObj.noteDetailObj.open($(this).data('noteid'), optsObj.chapter_id);
            event.stopPropagation();
          });
          optsObj.$contentObj.eq(0).append($noteIcon);
        }
      }
      note_list.splice(0, 1);
    }
  };
  /**
   * 增加划线. <br/>
   * 
   * @param {Object} data {
   *      fisrtId     {Number} 被选中内容的第一个元素的data-id值
   *      lastId      {Number} 被选中内容的最后一个元素的data-id值
   *      original    {String} 选中的内容，公式和特殊标签sub/sup/i等含html代码
   *      chapter_id  {String} 章节ID
   *      note_page   {Number} 当前页码 ps:0.1234
   *  }
   */
  Note.prototype.addUnderline = function (data) {
    var optsObj = this.opts;
    if (optsObj.$contentObj.find('.read-font-select').hasClass('read-gli-underline') || optsObj.$contentObj.find('.read-font-select').hasClass('read-gli-note')) {
      // 不能addUnderline的提示框
      this.noteDialog.setMsg(Msg.noteError);
      this.noteDialog.open();
    } else {
      optsObj.$contentObj.find('.read-font-select').addClass('read-gli-underline');
      var note_list = optsObj.data.note_list;
      var underlineData = {
        'chapter_id': optsObj.chapter_id,
        'chapter_name': optsObj.chapter_name,
        's_id': '',
        'note_id': Tool.getRandomKey(),
        'original': data.original,
        'note_text': '',
        'note_time': Tool.getNowFormatDate(),
        'firstId': data.firstId,
        'lastId': data.lastId,
        'note_page': data.note_page,
        'oparate_type': '1',
        'isSave': false
      };
      optsObj.$contentObj.find('.read-font-select').attr('data-noteid', underlineData.note_id);
      note_list.push(underlineData);
      this.renderCbnPage(optsObj.data);
      this._sendNote(underlineData);
    }
  };
  /**
   * 
   * 编辑笔记. <br/>
   * 
   * @param {Object} data {
   *      fisrtId     {Number} 被选中内容的第一个元素的data-id值
   *      lastId      {Number} 被选中内容的最后一个元素的data-id值
   *      original    {String} 选中的内容，公式和特殊标签sub/sup/i等含html代码
   *      chapter_id  {String} 章节ID
   *      note_page   {Number} 当前页码 ps:0.1234
   *      isunderline {Boolean}是否是划线转笔记
   *  }
   */
  Note.prototype.editNote = function (data) {
    var optsObj = this.opts;
    var that = this;
    if (!data.isunderline && (optsObj.$contentObj.find('.read-font-select').hasClass('read-gli-underline') || optsObj.$contentObj.find('.read-font-select').hasClass('read-gli-note'))) {
      // 不能增加笔记的提示框
      this.noteDialog.setMsg(Msg.noteError);
      this.noteDialog.open();
      return false;
    }
    optsObj.editObj.open(data);
  };
  /**
   * 发送单条笔记信息. <br/>
   * 
   * @param {Object} noteInfo {
   *      firstId     {Number}    笔记开始下标,
   *      lastId      {Number}    笔记结束下标,
   *      note_id     {Number}    笔记ID,
   *      note_page   {String}    笔记在本章位置(0.5213),
   *      note_text   {String}    笔记内容,
   *      note_time   {String}    笔记时间,
   *      original    {String}    笔记原文,
   *  }
   */
  Note.prototype._sendNote = function (noteInfo) {
    var optsObj = this.opts;
    var that = this;
    // 本地储存
    var localNoteData = {
      'time_stamp': optsObj.data.time_stamp,
      'note_list': optsObj.data.note_list
    };
    optsObj.saveFile(optsObj.filePath, JSON.stringify(localNoteData));
    // 保存单条笔记信息
    optsObj.api.sendNote(noteInfo, function (data) {
      console.info('[panelNotePc.js --> _sendNote] -- success!');
      that._updateSingleNote({
        's_id': data.s_id,
        'note_id': data.note_id,
        'time_stamp': data.time_stamp,
        'oparate_type': 1
      });
      // 提示保存成功
      innerSetDialog(Msg.noteSucess, noteInfo.note_text != '');
      that._fallback(true);
    }, function () {
      var msg = optsObj.isClient ? Msg.noteSucess : Msg.noteFail;
      if (noteInfo.note_text == '' && !optsObj.isClient) {
        that.noteDialog.setMsg(Msg.noteFail);
        that.noteDialog.open();
      } else {
        if (noteInfo.note_text != '') {
          innerSetDialog(msg, true);
        }
      }
      that._fallback(optsObj.isClient);
    });
    function innerSetDialog(msg, flag) {
      if (flag) {
        optsObj.editObj.sucessDialog.setMsg(msg);
        optsObj.editObj.sucessDialog.open();
      }
    }
  };
  /**
   * 保存笔记失败回退. <br/>
   * 
   * @param {Boolean} sucessFlag 是否回退
   */
  Note.prototype._fallback = function (sucessFlag) {
    var optsObj = this.opts;
    var note_list = optsObj.data.note_list;
    var editFlag = false;
    for (var i = note_list.length - 1; i >= 0; i--) {
      if (note_list[i].isSave === false) {
        delete note_list[i].isSave;
        var editOpts = optsObj.editObj.opts;
        if (sucessFlag) {
          editOpts.thisNoteObj = null;
        } else {
          if (!editOpts.isEditNote) {
            if (!!editOpts.thisNoteObj && !!editOpts.thisNoteObj.isunderline) {
              // 划线转笔记
              note_list[i].note_text = '';
            } else {
              // 新增笔记
              note_list.splice(i, 1);
            }
          } else {
            // 编辑笔记
            note_list[i] = editOpts.thisNoteObj;
            editFlag = true;
          }
          this.renderCbnPage(optsObj.data);
          this.showNote(optsObj.chapter_id, optsObj.chapter_name);
          if (editFlag) {
            optsObj.noteDetailObj.opts.thisNoteObj.noteid = editOpts.thisNoteObj.note_id;
            optsObj.noteDetailObj._filterNote(optsObj.chapter_id);
            optsObj.noteDetailObj.viewNote();
          }
        }
        break;
      }
    }
  };
  /**
   * 当用户执行 增删改 操作,服务器返回数据时，更新本地数据(内存, 本地文件). <br/>
   * 
   * @param {Object} noteInfo
   *           noteInfo.s_id
   *           noteInfo.note_id
   *           noteInfo.time_stamp
   *           noteInfo.oparate_type, // 1：增; 2：改; 3：删
   * 
   */
  Note.prototype._updateSingleNote = function (noteInfo) {
    var optsObj = this.opts;
    var localNoteList = optsObj.data.note_list;
    var noteItem = null;
    for (var i = 0, len = localNoteList.length; i < len; i++) {
      noteItem = localNoteList[i];
      if (noteItem.note_id == noteInfo.note_id) {
        if (noteInfo.oparate_type == '3') {
          // 删
          localNoteList.splice(i, 1);
        } else {
          // 增, 改
          noteItem.s_id = noteInfo.s_id;
          // 本条数据已与服务器同步
          noteItem.oparate_type = '0';
        }
        // 更新时间戳;
        if (!!noteInfo.time_stamp) {
          optsObj.data.time_stamp = noteInfo.time_stamp;
        }
        break;
      }
    }
    var localNoteData = {
      'time_stamp': optsObj.data.time_stamp,
      'note_list': optsObj.data.note_list
    };
    optsObj.saveFile(optsObj.filePath, JSON.stringify(localNoteData));
  };
  /**
   * 批量更新笔记.<br/>
   * 
   */
  Note.prototype.batchUpdateNote = function (noteInfo, successCb, errorCb) {
    var optsObj = this.opts;
    optsObj.api.batchUpdateNote(noteInfo, function (data) {
      if (typeof successCb == 'function') {
        successCb(data);
      }
    }, function (data) {
      if (typeof errorCb == 'function') {
        errorCb(data);
      }
    });
  };
  /**
   * 自定义事件. <br/>
   * 
   * @param eventName {String}   事件名称, 'cbnnote:click'
   * @param cb        {Function} 回调事件
   * 
   */
  Note.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.wrapObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  return Note;
}(js_src_global, js_libs_zeptodev, move, js_src_pad_panelEditPad, js_src_pad_panelDetailPad, js_src_tool, js_src_widget_plugDialog, js_src_message_zh);
js_src_pad_panelCbnPad = function (window, Catalog, Bookmark, Note, move, $, tool) {
  //  var $ = window.Zepto;
  var _ = window._;
  var CbnPanel = function (options) {
    var defaults = {
      wrapDomId: '',
      // 多实例 区分用;
      $readerObj: null,
      templHtml: '',
      // HTML 模板
      templHeadHtml: '',
      // 头部导航 模板.
      templBodyHtml: '',
      // 子内容 模板.
      templCatalogHtml: '',
      //目录 模板.
      templNoteHtml: '',
      //笔记 模板.
      $domObj: null,
      $headerObj: null,
      $bodyObj: null,
      isMobile: true,
      // 开关- 使用[书签]
      useBookmark: true,
      // 开关- 使用[笔记]
      useNote: true,
      data: null
    };
    var defaultMenu = [
      {
        text: '目录',
        name: 'catalog',
        state: 'read-active',
        view: 'read-catalog-body',
        prompt: '无目录'
      },
      {
        text: '笔记',
        name: 'note',
        state: '',
        view: 'read-note-body',
        prompt: '阅读时长按文字可添加笔记'
      },
      {
        text: '书签',
        name: 'bookmark',
        state: '',
        view: 'read-bookmark-body',
        prompt: '阅读时点击右上角的书签按钮即可添加书签'
      }
    ];
    this.opts = $.extend(true, {}, defaults, options);
    // 根据开关的值, 移除相应 "导航菜单".
    if (!this.opts.useBookmark) {
      // 移除 书签.
      defaultMenu.pop();
    }
    if (!this.opts.useNote) {
      // 移除 笔记.
      defaultMenu.splice(1, 1);
    }
    // 自定义导航,添加默认样式, 'read-custom-body';
    var tmpCustomNavs = this.opts.data;
    for (var j = 0, len = tmpCustomNavs.length; j < len; j++) {
      tmpCustomNavs[j].view = 'read-custom-body';
      tmpCustomNavs[j].state = tmpCustomNavs[j].state || '';
    }
    this.opts.data = defaultMenu.concat(this.opts.data);
    // 自定义导航菜单 最多支持 2 个. 
    if (this.opts.data.length > 5) {
      this.opts.data = this.opts.data.slice(0, 5);
    }
    // add by gli-hxy 把自定义导航的函数取出来
    this.customFunc = [];
    for (var i = 0; i < this.opts.data.length; i++) {
      var cbFunc = this.opts.data[i].cbFunc || tool.emptyFunc;
      this.customFunc.push(cbFunc);
    }
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  CbnPanel.prototype._init = function () {
    console.log('[panelCbn.js] --> _init! ');
    this._renderLayout();
    this._bindEvent();
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  CbnPanel.prototype._renderLayout = function () {
    var optsObj = this.opts;
    var that = this;
    // 利用 模板 生成HTML
    var templObj = _.template(optsObj.templHtml);
    var panelHtml = templObj();
    // 转化 zepto 对象;
    optsObj.$domObj = $(panelHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
    optsObj.$headerObj = optsObj.$domObj.find('.read-header-nav');
    optsObj.$bodyObj = optsObj.$domObj.find('.read-body');
    // 头部导航菜单.
    var navTemplObj = _.template(optsObj.templHeadHtml);
    var headNavMenuHtml = navTemplObj(optsObj.data);
    optsObj.$headerObj.append(headNavMenuHtml);
    // 导航子内容
    var bodyTemplObj = _.template(optsObj.templBodyHtml);
    var bodyHtml = bodyTemplObj(optsObj.data);
    optsObj.$bodyObj.append(bodyHtml);
    // 目录
    var $catalogWrap = optsObj.$bodyObj.find('.read-catalog-body');
    this.$catalogWrapBody = $catalogWrap;
    this.catalogObj = new Catalog({
      wrapObj: $catalogWrap,
      tmplHtml: optsObj.templCatalogHtml,
      isMobile: optsObj.isMobile
    });
    // 书签
    var $bookmarkWrap = optsObj.$bodyObj.find('.read-bookmark-body');
    this.$bookmarkWrapBody = $bookmarkWrap;
    this.bookmarkObj = null;
    var bookmarkDomObj = optsObj.$readerObj.find('.read-setting-panel .read-header .read-bookmark-btn');
    if (optsObj.useBookmark) {
      this.bookmarkObj = new Bookmark({
        wrapObj: $bookmarkWrap,
        $readerObj: optsObj.$readerObj,
        tmplHtml: optsObj.templBookmarkHtml,
        isMobile: optsObj.isMobile,
        isClient: optsObj.isClient,
        markDomObj: bookmarkDomObj,
        saveFile: optsObj.saveFile,
        filePath: optsObj.bookmarkFilePath,
        api: optsObj.api
      });
    }
    //笔记
    var $noteWrap = optsObj.$bodyObj.find('.read-note-body');
    this.$noteWrapBody = $noteWrap;
    this.noteObj = null;
    if (optsObj.useNote) {
      this.noteObj = new Note({
        $readerObj: optsObj.$readerObj,
        wrapObj: $noteWrap,
        tmplHtml: optsObj.templNoteHtml,
        isMobile: optsObj.isMobile,
        isClient: optsObj.isClient,
        saveFile: optsObj.saveFile,
        filePath: optsObj.noteFilePath,
        editHtml: optsObj.editHtml,
        detailHtml: optsObj.detailHtml,
        shareHtml: optsObj.shareHtml,
        api: optsObj.api,
        note_share_conf: optsObj.note_share_conf
      });
    }
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  CbnPanel.prototype._bindEvent = function () {
    var optsObj = this.opts;
    var eventName = optsObj.isMobile ? 'tap swipeLeft' : 'click';
    var that = this;
    // 关闭cbn面板 -- 继续阅读.
    optsObj.$domObj.find('.read-cbn-cover').on(eventName, function () {
      that.close();
    });
    // 当前选中导航菜单的 内容面板.
    var $tmpCurrentNavBody = null;
    optsObj.$headerObj.on(eventName, 'div', function () {
      var idx = $(this).index();
      $(this).addClass('read-active').siblings().removeClass('read-active');
      $tmpCurrentNavBody = optsObj.$bodyObj.children().eq(idx);
      $tmpCurrentNavBody.removeClass('read-hide').siblings().addClass('read-hide');
      // add by gli-hxy 判断是不是点击的自定义导航栏
      if ($tmpCurrentNavBody.hasClass('read-custom-body')) {
        that.customFunc[idx]($tmpCurrentNavBody);
      }
    });
    // 目录-自定义事件
    this.$catalogWrapBody.on('catalog:click', function (event, params) {
      // 章节内容切换, 回到阅读主页面.
      console.log('[panelCbn.js] 你点击了目录! -> id:' + params.id + ', status:' + params.status);
      optsObj.$domObj.trigger('cbncatalog:click', params);
    });
    // 书签-自定义点击事件
    this.$bookmarkWrapBody.on('bookmark:click', function (event, percent) {
      console.log('[panelCbn.js] 你点击了书签 -! ->');
      optsObj.$domObj.trigger('cbnbookmark:click', percent);
    });
  };
  /**
   * 获取面板对象. <br/>
   * 
   */
  CbnPanel.prototype.getPanelObject = function () {
  };
  /**
   * 获取 用户自定义菜单之 body. <br/>
   * 
   * @param position {Number} 自定义菜单坐标. 如: 1 -- 第一个自定义菜单.
   * 
   * @return 
   * 
   */
  CbnPanel.prototype.getCustomNavBody = function (position) {
    console.log('[CbnPanel] --> getCustomNavBody');
  };
  /**
   * 渲染 目录. <br/>
   * 
   * @param data {Object} 目录信息.
   * 
   */
  CbnPanel.prototype.renderCatalog = function (data) {
    this.catalogObj.renderLayout(data);
  };
  /**
   * 渲染 书签. <br/>
   * 
   * @param data {Object} 书签信息.
   * 
   */
  CbnPanel.prototype.renderBookmark = function (data) {
    this.bookmarkObj.renderLayout(data);
  };
  /**
   * 新增 书签. <br/>
   * 
   * @param data {Object} 书签显示dom (zepto对象).
   * 
   */
  CbnPanel.prototype.updateBookmarks = function (data) {
    console.log('[panelCbn.js]--> updateBookmarks');
    if (tool.hasFunction(this.bookmarkObj, 'updateBookmarks')) {
      this.bookmarkObj.updateBookmarks(data);
    }
  };
  /**
   * 获取 书签对象. <br/>
   * 
   */
  CbnPanel.prototype.getBookmarkData = function () {
    console.log('[panelCbn.js]--> getBookmarkData');
    return this.bookmarkObj.getBookmarks();
  };
  /**
   * 显示 书签标记. <br/>
   * 
   */
  CbnPanel.prototype.showBookmark = function (data) {
    console.log('[panelCbn.js]--> showBookmark');
    if (tool.hasFunction(this.bookmarkObj, 'isShowBookmark')) {
      this.bookmarkObj.isShowBookmark(data);
    }
  };
  /**
   * 渲染 笔记. <br/>
   * 
   * @param data {Object} 笔记信息.
   * 
   */
  CbnPanel.prototype.renderNote = function (data) {
    this.noteObj.renderLayout(data);
  };
  /**
   * 打开面板. <br/>
   * 
   */
  CbnPanel.prototype.open = function () {
    var optsObj = this.opts;
    optsObj.$domObj.show();
    var animateDom = optsObj.$domObj.find('.read-cbn-view');
    setTimeout(function () {
      move(animateDom[0]).set('left', '0').duration('0.5s').end();
    }, 10);
  };
  /**
   * 关闭面板. <br/>
   * 
   */
  CbnPanel.prototype.close = function () {
    var optsObj = this.opts;
    var animateDom = optsObj.$domObj.find('.read-cbn-view');
    move(animateDom[0]).set('left', '-100%').duration('0.5s').end();
    setTimeout(function () {
      optsObj.$domObj.fadeOut();
    }, 400);
  };
  /**
   * 注册 自定义 监听事件. <br/>
   * 
   * @param eventName {String}   事件名称, "catalog:click",  "cbncatalog:click"
   * @param cb        {Function} 回调事件
   * 
   */
  CbnPanel.prototype.on = function (eventName, cb) {
    var optsObj = this.opts;
    optsObj.$domObj.on(eventName, function (a, b) {
      if (typeof cb === 'function') {
        cb(a, b);
      }
    });
  };
  return CbnPanel;
}(js_src_global, js_src_catalog, js_src_pad_bookmarkPad, js_src_pad_notePad, move, js_libs_zeptodev, js_src_tool);
js_src_pad_panelComplaintPad = function (window, move, $, dialog, Msg) {
  var _ = window._;
  var ComplaintPanel = function (options) {
    var defaults = {
      $readerObj: null,
      complainHtml: '',
      // 版权投诉 面板
      $domObj: null,
      isMobile: true,
      api: null
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  ComplaintPanel.prototype._init = function () {
    console.log('[ComplaintPanel] --> _init');
    this._renderLayout();
    this._bindEvent();
    this.dialog = new dialog({ $wrapDomObj: this.opts.$domObj });
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  ComplaintPanel.prototype._renderLayout = function () {
    var optsObj = this.opts;
    var complainTemplObj = _.template(optsObj.complainHtml);
    var complainHtml = complainTemplObj();
    // 版权投诉 dom
    optsObj.$domObj = $(complainHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  ComplaintPanel.prototype._bindEvent = function () {
    var that = this;
    var optsObj = that.opts;
    var compTarea = optsObj.$domObj.find('.read-pad-content textarea');
    // 确定事件类型.
    var eventType = optsObj.isMobile ? 'tap' : 'click';
    // 文本域输入时
    compTarea.on('focus', function () {
      that.hideCanelBox();
    });
    // 关闭版权投诉面板 -- 取消
    optsObj.$domObj.find('.read-cancel-btn').on(eventType, function () {
      var val = compTarea.val();
      compTarea.blur();
      that.cancel(val);
    });
    // 继续编辑
    optsObj.$domObj.find('.read-canel-box-cont').on(eventType, function () {
      that.hideCanelBox();
      compTarea.focus();
    });
    // 离开
    optsObj.$domObj.find('.read-canel-box-leave').on(eventType, function () {
      that.close();
    });
    // 发送版权投诉信息
    optsObj.$domObj.find('.read-send-btn').on(eventType, function () {
      var val = compTarea.val();
      compTarea.blur();
      that.sendComplaint(val);
    });
  };
  /**
   * 打开版权投诉面板. <br/>
   * 
   */
  ComplaintPanel.prototype.open = function () {
    var that = this;
    var optsObj = that.opts;
    optsObj.$domObj.fadeIn();
  };
  /**
   * 取消版权投诉面板. <br/>
   * 
   */
  ComplaintPanel.prototype.cancel = function (value) {
    var that = this;
    var optsObj = that.opts;
    // 判断是否输入了内容
    if (value) {
      that.showCanelBox();
    } else {
      that.close();
    }
  };
  /**
   * 取消确认框--显示. <br/>
   * 
   */
  ComplaintPanel.prototype.showCanelBox = function () {
    var that = this;
    var optsObj = that.opts;
    var box = optsObj.$domObj.find('.read-pad-canel-box');
    var height = parseFloat(box.css('font-size'));
    box.show();
    setTimeout(function () {
      move(box[0]).set('height', height + 'px').duration('0.2s').end();
    }, 10);
  };
  /**
   * 取消确认框--隐藏. <br/>
   * 
   */
  ComplaintPanel.prototype.hideCanelBox = function () {
    var that = this;
    var optsObj = that.opts;
    var box = optsObj.$domObj.find('.read-pad-canel-box');
    move(box[0]).set('height', 0).duration('0.2s').end();
    setTimeout(function () {
      box.hide();
    }, 200);
  };
  /**
   * 关闭版权投诉面板. <br/>
   * 
   */
  ComplaintPanel.prototype.close = function () {
    var that = this;
    var optsObj = that.opts;
    // 清空数据
    optsObj.$domObj.find('.read-pad-content textarea').val('');
    that.hideCanelBox();
    optsObj.$domObj.hide();
  };
  /**
   * 发送版权保护信息. <br/>
   * 
   * @param {String} val 投诉内容
   * 
   */
  ComplaintPanel.prototype.sendComplaint = function (val) {
    var that = this;
    var optsObj = that.opts;
    var sendBtn = optsObj.$domObj.find('.read-header .read-send');
    // 发送成功后的提示框
    that.sucessDialog = new dialog({
      $wrapDomObj: this.opts.$domObj,
      okBtn: {
        txt: '确定',
        cssClass: '',
        func: function () {
          that.close();
        }
      },
      cancelBtn: {
        txt: '离开',
        cssClass: '',
        func: function () {
          that.close();
        }
      }
    });
    // 验证传送内容是否为空
    if (val.length != 0) {
      // 控制投诉间隔时间
      var nowTime = new Date().getTime();
      var deltaTime = sendBtn.attr('data-complaint') ? nowTime - sendBtn.attr('data-complaint') : nowTime;
      if (deltaTime > 20000) {
        optsObj.loading.setMsg(Msg.dealWith);
        optsObj.loading.open();
        optsObj.api.sendComplaint({ 'complaint_val': val }, function (data) {
          optsObj.loading.close();
          if (data.status) {
            that.sucessDialog.setMsg(Msg.compSucess);
            that.sucessDialog.open();
            sendBtn.attr('data-complaint', new Date().getTime());
          } else {
            that.sucessDialog.setMsg(data.error);
            that.sucessDialog.open();
          }
        }, function () {
          optsObj.loading.close();
          that.dialog.setMsg(Msg.sendError);
          that.dialog.open();
        });
      } else {
        that.dialog.setMsg(Msg.compInterval);
        that.dialog.open();
      }
    } else {
      that.dialog.setMsg(Msg.inputContent);
      that.dialog.open();
    }
  };
  return ComplaintPanel;
}(js_src_global, move, js_libs_zeptodev, js_src_widget_plugDialog, js_src_message_zh);
js_src_pad_panelSearchPad = function (window, move, $, dialog, Msg) {
  var _ = window._;
  // 搜索历史html
  var hisTmplHtml = '<% _.each(obj, function(search){  %>' + '<div class="read-one-history">' + '<span class="read-font read-lf"><%= search.keyword %></span>' + '<span class="read-time read-rt"><%= search.time %></span>' + '</div>' + '<% }); %>';
  // 搜索结果html
  var searchResTemplHtml = '<% _.each(obj.search_list, function(search_list){  %>' + '<div class="read-one-result read-cf" data-site="<%= search_list.search_page %>">' + '<div class="read-title"><%= search_list.chapter_name %></div>' + '<div class="read-content"><%= search_list.search_text %></div>' + '<div class="read-site read-rt"><%= (parseFloat(search_list.search_page)*100).toFixed(4) + "%" %></div>' + '</div>' + '<% }); %>';
  var SearchPanel = function (options) {
    var defaults = {
      $readerObj: null,
      searchHtml: '',
      // 搜索 面板
      $domObj: null,
      isMobile: true,
      api: null,
      hisTempl: _.template(hisTmplHtml),
      searchResTempl: _.template(searchResTemplHtml)
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  SearchPanel.prototype._init = function () {
    console.log('[SearchPanel] --> _init');
    var optsObj = this.opts;
    if (optsObj.isClient) {
      // 离线搜索
      this.sendSearch = this.sendSearchOffline;
    } else {
      //在线搜索
      this.sendSearch = this.sendSearchOnline;
    }
    this._renderLayout();
    this._bindEvent();
    this.dialog = new dialog({ $wrapDomObj: this.opts.$domObj });
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  SearchPanel.prototype._renderLayout = function () {
    var optsObj = this.opts;
    var searchTemplObj = _.template(optsObj.searchHtml);
    var searchHtml = searchTemplObj();
    // 搜索 dom
    optsObj.$domObj = $(searchHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  SearchPanel.prototype._bindEvent = function () {
    var that = this;
    var optsObj = that.opts;
    // 确定事件类型.
    var eventType = optsObj.isMobile ? 'tap' : 'click';
    // 关闭搜索面板 -- 取消
    optsObj.$domObj.find('.read-header .read-search-back').on(eventType, function () {
      optsObj.$domObj.find('.read-header .read-search-ipt').blur();
      that.close();
    });
    // 发送搜索信息
    optsObj.$domObj.find('.read-header .read-search-btn').on(eventType, function () {
      var val = optsObj.$domObj.find('.read-header .read-search-ipt input').val();
      that.sendSearch(val);
    });
    // 点击历史搜索 -- 搜索
    optsObj.$domObj.on(eventType, '.read-history-content .read-one-history', function (e) {
      console.log('[panelSearch.js] -- > 点击搜索历史');
      var val = $(this).find('.read-font').text();
      that.sendSearch(val);
    });
    // 点击清空历史搜索
    optsObj.$domObj.on(eventType, '.read-search-history .read-clear-history', function (e) {
      console.log('[panelSearch.js] -- > 点击清空搜索历史');
      optsObj.$domObj.find('.read-history-content').html('');
      optsObj.$domObj.find('.read-search-history').hide();
      that.delSearchHis();
    });
    // 点击搜索结果跳转
    optsObj.$domObj.on(eventType, '.read-one-result', function (e) {
      console.log('[panelSearch.js] -- > 点击搜索历史');
      that.close();
      optsObj.$domObj.trigger('search:click', parseFloat($(this).attr('data-site')));
    });
  };
  /**
   * 打开搜索面板. <br/>
   * 
   */
  SearchPanel.prototype.open = function () {
    var that = this;
    var optsObj = that.opts;
    optsObj.$domObj.fadeIn();
    //获取搜索历史记录
    optsObj.api.getSearchHistory({}, function (result) {
      if (result.search_history.length != 0) {
        var hisHtml = optsObj.hisTempl(result.search_history);
        optsObj.$domObj.find('.read-search-history').show().find('.read-history-content').html(hisHtml);
      }
    }, function () {
    });
  };
  /**
   * 关闭搜索面板. <br/>
   * 
   */
  SearchPanel.prototype.close = function () {
    var that = this;
    var optsObj = that.opts;
    // 隐藏搜索结果和搜索历史
    optsObj.$domObj.find('.read-search-history').hide();
    optsObj.$domObj.find('.read-search-result').hide();
    // 清空搜索框内容
    optsObj.$domObj.find('.read-header .read-search-ipt input').val('');
    optsObj.$domObj.fadeOut();
  };
  /**
   * 发送搜索keyword  Offline. <br/>
   * 
   * @param {String} val 关键字
   * 
   */
  SearchPanel.prototype.sendSearchOffline = function (val) {
    var that = this;
    var optsObj = that.opts;
    // TODO 需和phoneGap调试接口
    if (typeof gli_search_offline != 'function') {
      that.sendSearchOnline(val);
    } else {
      // 验证传送内容是否为空
      if (val.length != 0) {
        // loading
        optsObj.loading.open();
        optsObj.loading.setMsg(Msg.nowSearch);
        // 传给客户端搜索
        gli_search_offline({ 'keyword': val }, function (result) {
          optsObj.loading.close();
          if (result.length != 0) {
            // 隐藏搜索历史
            optsObj.$domObj.find('.read-search-history').hide();
            // 显示搜索结果
            var searchResHtml = optsObj.searchResTempl(result);
            optsObj.$domObj.find('.read-search-result').show().html(searchResHtml);
          }
        }, function () {
          optsObj.loading.close();
          that.dialog.setMsg(Msg.sendError);
          that.dialog.open();
        });
      } else {
        console.log('%c [panelSearch] sendSearch--> 请输入搜索内容', 'color:red;');
        that.dialog.setMsg(Msg.inputContent);
        that.dialog.open();
      }
    }
  };
  /**
   * 发送搜索keyword  Online. <br/>
   * 
   * @param {String} val 关键字
   * 
   */
  SearchPanel.prototype.sendSearchOnline = function (val) {
    var that = this;
    var optsObj = that.opts;
    // 验证传送内容是否为空
    if (val.length != 0) {
      // loading
      optsObj.loading.open();
      optsObj.loading.setMsg(Msg.nowSearch);
      optsObj.api.search({ 'keyword': val }, function (data) {
        var result = data.data;
        optsObj.loading.close();
        if (data.status) {
          if (result.search_list.length > 0) {
            // 隐藏搜索历史
            optsObj.$domObj.find('.read-search-history').hide();
            // 显示搜索结果
            var searchResHtml = optsObj.searchResTempl(result);
            optsObj.$domObj.find('.read-search-result').show().html(searchResHtml);
          } else {
            that.dialog.setMsg(Msg.emptySearch);
            that.dialog.open();
          }
        } else {
          that.dialog.setMsg(data.msg);
          that.dialog.open();
        }
      }, function () {
        optsObj.loading.close();
        that.dialog.setMsg(Msg.sendError);
        that.dialog.open();
      });
    } else {
      that.dialog.setMsg(Msg.inputContent);
      that.dialog.open();
      console.log('%c [panelSearch] sendSearch--> 请输入搜索内容', 'color:red;');
    }
  };
  /**
   * 清空搜索记录
   */
  SearchPanel.prototype.delSearchHis = function () {
    var that = this;
    var optsObj = that.opts;
    optsObj.api.delSearchHis({}, function () {
      console.log('%c [panelSearch] 清除历史搜索成功', 'background:green;');
    }, function () {
    });
  };
  return SearchPanel;
}(js_src_global, move, js_libs_zeptodev, js_src_widget_plugDialog, js_src_message_zh);
js_src_pad_panelCorrectPad = function (window, move, $, tips, Msg, dialog) {
  var _ = window._;
  var CorrectPanel = function (options) {
    var defaults = {
      $readerObj: null,
      correctHtml: '',
      // 版权投诉 面板
      $domObj: null,
      isMobile: true,
      api: null
    };
    this.opts = $.extend(true, {}, defaults, options);
    this._init();
  };
  /**
   * 初始化. <br/>
   * 
   */
  CorrectPanel.prototype._init = function () {
    console.log('[CorrectPanel] --> _init');
    this._renderLayout();
    this._bindEvent();
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  CorrectPanel.prototype._renderLayout = function () {
    var optsObj = this.opts;
    var correctTemplObj = _.template(optsObj.correctHtml);
    var correctHtml = correctTemplObj();
    // 纠错文字  dom
    optsObj.$domObj = $(correctHtml);
    optsObj.$readerObj.append(optsObj.$domObj);
    this.tips = new tips({ parentObj: optsObj.$readerObj[0] });
  };
  /**
   * 绑定事件. <br/>
   * 
   */
  CorrectPanel.prototype._bindEvent = function () {
    var that = this;
    var optsObj = that.opts;
    var corrTarea = optsObj.$domObj.find('.read-pad-content textarea');
    // 确定事件类型.
    var eventType = optsObj.isMobile ? 'tap' : 'click';
    // 关闭纠错面板 -- 取消
    optsObj.$domObj.find('.read-pad-body-header .read-cancel-btn').on(eventType, function () {
      var val = corrTarea.val().trim();
      corrTarea.blur();
      that.cancel(val);
    });
    // 发送纠错信息
    optsObj.$domObj.find('.read-pad-body-header .read-send-btn').on(eventType, function () {
      var val = corrTarea.val().trim();
      corrTarea.blur();
      that.sendCorrect(val);
    });
    // 继续编辑
    optsObj.$domObj.find('.read-canel-box-cont').on(eventType, function () {
      that.hideCanelBox();
      corrTarea.focus();
    });
    // 离开
    optsObj.$domObj.find('.read-canel-box-leave').on(eventType, function () {
      that.close();
    });
    // 文本框获得焦点时
    optsObj.$domObj.find('.read-pad-content textarea').on('focus', function () {
      that.hideCanelBox();
    });
  };
  /**
   * 打开纠错文字面板. <br/>
   * 
   * @param {Object} data
   */
  CorrectPanel.prototype.open = function (data) {
    var optsObj = this.opts;
    optsObj.thisNoteObj = data;
    optsObj.first = true;
    optsObj.$domObj.fadeIn();
    optsObj.$domObj.find('.read-pad-content .read-original-text').html(data.original);
    if (typeof MathJax !== 'undefined') {
      MathJax.Hub.Queue([
        'Typeset',
        MathJax.Hub
      ]);
    }
  };
  /**
   * 取消纠错文字面板. <br/>
   * 
   */
  CorrectPanel.prototype.cancel = function (value) {
    var optsObj = this.opts;
    // 判断是否输入了内容
    if (value) {
      this.showCanelBox();
    } else {
      this.close();
    }
  };
  /**
   * 取消确认框--显示. <br/>
   * 
   */
  CorrectPanel.prototype.showCanelBox = function () {
    var that = this;
    var optsObj = that.opts;
    var box = optsObj.$domObj.find('.read-pad-canel-box');
    var height = parseFloat(box.css('font-size'));
    box.show();
    setTimeout(function () {
      move(box[0]).set('height', height + 'px').duration('0.2s').end();
    }, 10);
  };
  /**
   * 取消确认框--隐藏. <br/>
   * 
   */
  CorrectPanel.prototype.hideCanelBox = function () {
    var that = this;
    var optsObj = that.opts;
    var box = optsObj.$domObj.find('.read-pad-canel-box');
    move(box[0]).set('height', 0).duration('0.2s').end();
    setTimeout(function () {
      box.hide();
    }, 200);
  };
  /**
   * 关闭纠错文字面板. <br/>
   * 
   */
  CorrectPanel.prototype.close = function () {
    var that = this;
    var optsObj = that.opts;
    // 清空数据
    optsObj.$domObj.find('.read-pad-content textarea').val('');
    that.hideCanelBox();
    optsObj.$domObj.hide();
  };
  /**
   * 发送纠错信息. <br/>
   * 
   * @param {String} val 纠错说明内容
   * 
   */
  CorrectPanel.prototype.sendCorrect = function (val) {
    var that = this;
    var optsObj = this.opts;
    that.dialog = new dialog({
      $wrapDomObj: this.opts.$domObj,
      okBtn: {
        txt: '确定',
        cssClass: '',
        func: function () {
          that.dialog.destroy();
        }
      },
      cancelBtn: {
        txt: '离开',
        cssClass: '',
        func: function () {
          that.close();
          that.dialog.destroy();
        }
      }
    });
    // 纠错要发送的信息
    var correctData = {
      'chapter_id': optsObj.thisNoteObj.chapter_id,
      'chapter_name': optsObj.thisNoteObj.chapter_name,
      'percent': optsObj.thisNoteObj.note_page,
      'original': optsObj.thisNoteObj.original,
      'correctVal': val
    };
    if (val) {
      // 发送成功后的提示框
      var sucessDialog = new dialog({
        $wrapDomObj: this.opts.$domObj,
        okBtn: {
          txt: '确定',
          cssClass: '',
          func: function () {
            that.close();
            sucessDialog.destroy();
          }
        },
        cancelBtn: {
          txt: '离开',
          cssClass: '',
          func: function () {
            that.close();
            sucessDialog.destroy();
          }
        }
      });
      optsObj.api.sendCorrect(correctData, function () {
        sucessDialog.setMsg(Msg.correctSucess);
        sucessDialog.open();
      }, function (data) {
        console.warn(data);
        that.dialog.setMsg(Msg.sendError);
        that.dialog.open();  //                  that.tips.open(Msg.sendError, 1000);
      });
    } else {
      that.dialog.setMsg(Msg.correctError);
      that.dialog.open();  //              this.tips.open(Msg.correctError, 1000);
    }
  };
  return CorrectPanel;
}(js_src_global, move, js_libs_zeptodev, js_src_widget_plugTips, js_src_message_zh, js_src_widget_plugDialog);
js_src_readerPad = function (window, $, tool, Api, templSet, mainPanel, settingPanel, cbnPanel, complaintPanel, searchPanel, countPage, Loader, promptPanel, copyright, viewImgPanel, Config, dialog, Msg, selectPanel, correctPanel, delicateType) {
  var LOG = tool.LOG;
  var PAD = function (options) {
    LOG.log('[reader.js] --> 构造函数! ');
    var defaults = {
      // a: 必须传入参数.
      domWrapId: '',
      // 阅读器 页面标签的 [属性id]. 如: "#110";
      hostUrl: '',
      // 书籍信息来源地址.
      book_id: '',
      // {String} 图书id.
      passData: null,
      // eg: {shop_id:2} 存放shop_id 等.
      // b: 可选传入参数(存有默认值).
      user_id: '',
      // {String} 用户id 可选.
      downloadPath: 'download/books',
      // 书籍数据读写模式. true: 加密模式; false: (默认)普通/明文 模式;
      isEncrypt: false,
      // true: 本阅读器只需要 下载功能(不需要初始化布局); false: (默认)阅读 +下载.
      // 如果 DOM元素的 宽高小于 "最小值", 则强制复制为 "true",并给出 警告日志信息.
      isOnlyDownload: false,
      // 一次性下载整本书。( true为一次性下载所有能读章节,false:看到哪章下哪章(默认值) )
      // isDownloadAllChapter: false,
      // 是否为 客户端(APP, C++), true: (默认)客户端, 需要缓存文件.读取本地文件; false: PC浏览器;
      isClient: true,
      // 是否为 手机, 用于: 绑定事件, 渲染布局;
      isMobile: true,
      // 是否允许在图片页保存图片到本地指定位置    默认允许true
      isDownloadImg: true,
      // 默认的翻页方式
      pagingType: 'page_1',
      // 夜间模式
      isNightMode: false,
      // true: 不分页,直接读取 epub源文件; false: 需要分页计算.
      useEpubFile: false,
      // true: 开启版权保护; false: 关闭版权保护
      usePublish: true,
      // 开关- 使用[书签]
      useBookmark: true,
      // 开关- 使用[笔记]
      useNote: true,
      // 开关- 使用[文字纠错]
      useCorrect: true,
      // 开关- 使用[版权投诉]
      useComplaint: true,
      // 开关- 使用[搜索]
      useSearch: true,
      // 开关- 使用[退出]
      useExit: true,
      // 开关- 使用[字体]
      useFonts: true,
      // 开关- 使用[背景颜色]
      useBgColor: true,
      // 开关- 使用[亮度控制]
      useLight: true,
      // 开关- 使用[翻页方式]
      usePageWay: true,
      // 开关- 使用[epub样式]
      useEpubStyle: true,
      // 开关- 试读(由reader控制试读 - 中原农民特殊要求)
      useProbation: false,
      // 记录书籍打开时间
      bookOpenTime: '',
      // 分享笔记--参数配置.默认false
      note_share_conf: { 'flag': false },
      historyData: { page_offset: 105 },
      license_id: 'doc_110220330',
      // 加密 - 文件许可证号;
      server: 'server_101010101010',
      // 加密 - lockit服务器域名;
      // 自定义导航类菜单, 注意: 目前仅支持 2 个自定义菜单.
      custom_nav_menus: [],
      /** 
       * 算页过程中(分步返回),执行用户回调。
       * {function} 默认为 空函数.
       * 
       * 如: function(){
       *        // var pages = reader.getPagesAll();
       *        // data数据结构 与 reader.chapts 相同;
       *        // 在此完成业务逻辑。
       *     }
       */
      getDataCb: tool.emptyFunc,
      /** 
       * reader取得目录信息后,执行用户回调。
       *  {function} 默认为 空函数
       * 
       * 如: function(){
       *        // var pages = reader.getCatalogInfo();
       *        // 在此完成业务逻辑。
       *     }
       */
      getCatalogCb: tool.emptyFunc,
      /**
       * 书籍处于 试读状态，当翻到最后一页后 点击 获取下一章数据时触发回调; 
       * {function} 默认为 空函数
       * 
       * 约定: 回调方法逻辑--跳转页面.
       * 
       */
      probotionCb: tool.emptyFunc,
      /**
       * 退出 阅读器 回调函数.<br/>
       * {function} 默认为 空函数
       * 
       */
      exitReaderCb: tool.emptyFunc,
      /**
       * 使用reader下载图书，回调函数 -- 新华传媒. <br/>
       * 
       * 每下载一章就触发一次，更新下载进度.
       */
      downloadCb: tool.emptyFunc,
      /**
       * 点击 不可阅读目录时, 触发此函数. <br/>
       * ps: 试读.
       * 
       */
      getDisableChaptCb: tool.emptyFunc,
      // c: 不可传入参数
      // 是否渲染布局. true:使用布局, false: 不使用布局. 
      _useLayout: true,
      // 阅读器 外部容器;
      $readerWrap: null,
      // 阅读器 根节点对象;
      $readerObj: null,
      // 容器最小宽度 px.
      _minW: 300,
      // 容器最小高度 px.
      _minH: 500,
      // 下载状态 和 进度
      _downloadState: {
        'state': true,
        'rate': 0
      },
      // 正本数据 文字总数.
      totalLen: 0,
      chapt_index: 0,
      // {Number} 当前阅读章节下标, 第一章下标为0
      page_index: 0,
      // {Number} 图书每章节页码下标，第一页下标为1
      pageColumn: 1,
      // 一页显示几列
      // 分页用章节信息, 结构参考 方法: [countPage.js] getPagingData;
      chapts: null
    };
    this.opts = $.extend(true, {}, defaults, options);
    // 下载用
    this.opts.data = {
      // {Object} 目录;
      'catalog': null,
      // {Array} 可读章节信息 {"chapter_name":"", "chapter_id":"", isDownload: ""}
      'readableChapter': null,
      // {Object} 阅读进度. {"progressData":{"updateTime":1472022745833,"progress":"0.7804"}}
      'progressData': null,
      // {Object} 设置面板参数
      'settingData': null,
      // {Object} 版权保护参数
      'copyright': null
    };
    this.LoadingObj = new Loader({
      'domSelector': this.opts.domWrapId,
      'msg': Msg.loading
    });
    this.DialogObj = new dialog({ $wrapDomObj: $(this.opts.domWrapId) });
    this._init();
  };
  /**
   * 根据  传入参数, 判定阅读器用法, 并执行相应 初始化. <br/>
   * 
   */
  PAD.prototype._init = function () {
    var optsObj = this.opts;
    this._check();
    // 书籍打开时间
    optsObj.bookOpenTime = new Date().getTime();
    // 实例化 网络请求API接口对象.
    this.ApiObj = new Api({
      baseData: {
        hostUrl: optsObj.hostUrl,
        book_id: optsObj.book_id,
        user_id: optsObj.user_id,
        use_file_url: optsObj.useEpubFile
      },
      passData: optsObj.passData
    });
    if (optsObj.isClient) {
      //目录
      this.getCatalog = this._getCatalogOffline;
      //书签
      this.getBookmark = this._getBookmarkOffline;
      //笔记
      this.getNote = this._getNoteOffline;
      // 章节内容
      this.getChapterContent = this._getChapterOffline;
    } else {
      //目录
      this.getCatalog = this._getCatalogOnline;
      //书签
      this.getBookmark = this._getBookmarkOnline;
      //笔记
      this.getNote = this._getNoteOnline;
      // 章节内容
      this.getChapterContent = this._getChapterOnline;
    }
    this._refresh();
    this._renderLayout();
  };
  /**
   * 检测传入参数. <br/>
   * 
   */
  PAD.prototype._check = function () {
    var optsObj = this.opts;
    optsObj.$readerWrap = $(optsObj.domWrapId);
    // 检测 阅读器的 DOM标签.
    if (optsObj.isOnlyDownload || optsObj.domWrapId == '' || optsObj.length == 0 || optsObj.$readerWrap.width() < optsObj._minW || optsObj.$readerWrap.height() < optsObj._minH) {
      //  无效, 不渲染布局
      optsObj._useLayout = false;
    } else {
      //  有效.
      optsObj._useLayout = true;
      optsObj.$readerObj = $('<div class=\'read-reader-pad\' />');
      optsObj.$readerWrap.append(optsObj.$readerObj);
      this._setFontSize();  //              this.LoadingObj.open();
    }
  };
  /**
   * 重设参数后 刷新阅读器.<br/>
   * ps: 加密模式, 背景颜色, 图书id,,,等.
   * 
   * @author gli-gonglong-20160727.
   * 
   */
  PAD.prototype._refresh = function () {
    var optsObj = this.opts;
    if (optsObj.isEncrypt) {
      // 加密模式. 这种方式 绑定成了 "对象.静态函数"
      this.saveFile = tool._saveFileEncrypt;
      this.readFile = this._readFileDec;
    } else {
      // 普通模式,
      this.saveFile = tool._saveFileCommon;
      this.readFile = tool._readFileCommon;
    }
    // 如果不是客服端就不保存数据
    if (!optsObj.isClient) {
      this.saveFile = tool.emptyFunc;
      // 如果不是客服端且没有登陆，则关掉笔记和书签功能
      if (optsObj.user_id == '') {
        optsObj.useNote = false;
        optsObj.useBookmark = false;
      }
    }
  };
  /**
   * 读取加密文件. <br/>
   * 
   * @param path    {String} 本地文件存储路径, 包含文件名. 如 "/download/10001/120/0_catalog.txt"
   * @param cb      {Function} 回调函数, 成功: 返回文件内容, 失败: 返回 null;
   */
  PAD.prototype._readFileDec = function (path, cb) {
    var optsObj = this.opts;
    var reader_opts = {
      license_id: optsObj.license_id,
      // 加密 - 文件许可证号;
      server: optsObj.server
    };
    var config_opts = {
      license_id: Config.license_id,
      // 加密 - 文件许可证号;
      server: Config.server
    };
    var opts = $.extend(true, {}, config_opts, reader_opts);
    tool._readFileDecrypt(opts, path, cb);
  };
  /**
   * 渲染布局. <br/>
   * 
   */
  PAD.prototype._renderLayout = function () {
    var optsObj = this.opts;
    // 阅读主页面
    this.mainpage = null;
    // 目录(Catalog), 书签(Bookmark), 笔记(note) 显示面板. 
    this.cbnpage = null;
    // 设置操作 面板
    this.settingpage = null;
    // 分页计算器.
    this.countPageObj = null;
    // 版权投诉面板.
    this.complainpage = null;
    // 搜索面板.
    this.searchpage = null;
    // 操作提示面板
    this.promptPage = null;
    // 图片浏览面板
    this.viewImgPage = null;
    this._renderCatalog();
    if (optsObj._useLayout) {
      this._renderBookmark();
      this._renderNote();
      // 操作提示
      this._renderPromptPage();
      this._renderSetting();
      this._renderMainpage();
      this._renderCopyright();
      // 投诉
      this._renderComplaint();
      // 纠错文字
      this._renderCorrect();
      this._renderSearch();
      this._renderCountpage();
      // 查看图片
      this._renderViewImgPage();
      // 选择文本
      this._renderSelect();
    }
  };
  /**
   * 渲染 阅读主页面, 并监听其相关事件. <br/>
   * 
   */
  PAD.prototype._renderMainpage = function () {
    var optsObj = this.opts;
    var that = this;
    // 阅读主面板.
    var mainTempl = templSet.getTempl('main');
    this.mainpage = new mainPanel({
      $readerObj: optsObj.$readerObj,
      templHtml: mainTempl,
      // HTML 模板
      isMobile: optsObj.isMobile,
      usePublish: optsObj.usePublish,
      pageColumn: optsObj.pageColumn
    });
    // 阅读主面板.
    this.mainpage.on('mainpanel:left', function () {
      that.pre();
      // 清空选择文本内容样式及图标
      that.selectObj.close();
    });
    this.mainpage.on('mainpanel:middle', function () {
      that.settingpage.open();
      that.selectObj.close();
    });
    this.mainpage.on('mainpanel:right', function () {
      that.next();
      that.selectObj.close();
    });
    // 判断是否显示书签标记
    this.mainpage.on('mainpanel:showBookmark', function (event, data) {
      that.cbnpage.showBookmark(data);
    });
    this.mainpage.on('mainpanel:img', function (e, param) {
      that.viewImgPage.setOptions({
        'imgSet': optsObj.chapts[optsObj.chapt_index].images,
        'currentIdx': parseInt(param.currentIdx)
      });
      that.viewImgPage.open();
    });
    this.mainpage.on('mainpanel:showNote', function () {
      var chapter_id = optsObj.chapts[optsObj.chapt_index].chapter_id;
      var chapter_name = optsObj.chapts[optsObj.chapt_index].chapter_name;
      //              that.cbnpage.noteObj.showNote(chapter_id);
      if (tool.hasFunction(that.cbnpage.noteObj, 'showNote')) {
        that.cbnpage.noteObj.showNote(chapter_id, chapter_name);
      }
    });
    // add by gli-jiangxq-20160905 start
    if (typeof gli_keydown_event != 'undefined' && typeof gli_keydown_event == 'function') {
      // 音量键up, 向前翻页;
      gli_keydown_event(1, function () {
        that.pre();
      }, true);
      // 音量键down, 向后翻页;
      gli_keydown_event(2, function () {
        that.next();
      }, true);
      // 退出键
      gli_keydown_event(0, function () {
        that.exit();
      }, true);
    }  // add by gli-jiangxq-20160905 end
  };
  /**
   * 渲染版权保护面板, 并监听其相关事件. <br/>
   * 
   * @author gli-jiangxq-20160822
   */
  PAD.prototype._renderCopyright = function () {
    var optsObj = this.opts;
    var that = this;
    this.copyrightObj = new copyright({
      $readerObj: optsObj.$readerObj,
      isMobile: optsObj.isMobile,
      coprData: Config.copyright,
      api: that.ApiObj
    });
    // 保存版权保护参数
    this.copyrightObj.on('Copyright:saveCoprParam', function (event, data) {
      that.opts.data.copyright = data;
      that._saveCopyright();
    });
    // 获取离线状态下版权保护参数
    this.copyrightObj.on('Copyright:getCoprParam', function () {
      that._getCoprDataOffline(function (data) {
        that.opts.data.copyright = data.coprData;
        that.copyrightObj.opts.copyright = data.coprData;
        that.copyrightObj.run();
      }, function () {
        that.copyrightObj.run();
      });
    });
    // 退出阅读器
    this.copyrightObj.on('Copyright:exitReaderCb', function () {
      that.exit();
    });
  };
  /**
   * 选择文本面板, 并监听其相关事件. <br/>
   * 
   * @author gli-jiangxq-20160919
   */
  PAD.prototype._renderSelect = function () {
    var optsObj = this.opts;
    var that = this;
    this.selectObj = new selectPanel({
      $readerObj: optsObj.$readerObj,
      isMobile: optsObj.isMobile,
      clientType: optsObj.clientType,
      coprObj: that.copyrightObj,
      useNote: optsObj.useNote,
      useCorrect: optsObj.useCorrect,
      pageColumn: optsObj.pageColumn
    });
    // 增加划线
    this.selectObj.on('Select:addUnderline', function (event, data) {
      var newData = innerSetData(data);
      that.cbnpage.noteObj.addUnderline(newData);
    });
    // 删除划线
    this.selectObj.on('Select:delUnderline', function (event, noteid) {
      that.cbnpage.noteObj.delNote({
        'chapterid': optsObj.chapts[optsObj.chapt_index].chapter_id,
        'noteid': noteid
      });
    });
    // 增加笔记
    this.selectObj.on('Select:addNote', function (event, data) {
      var newData = innerSetData(data);
      that.cbnpage.noteObj.editNote(newData);
    });
    // 纠错文字
    this.selectObj.on('Select:correct', function (event, data) {
      var newData = innerSetData(data);
      that.correctpage.open(newData);
    });
    function innerSetData(data) {
      var chapter = optsObj.chapts[optsObj.chapt_index];
      data.chapter_id = chapter.chapter_id;
      data.chapter_name = chapter.chapter_name;
      var pageIndex = data.currPage == 2 ? optsObj.page_index : optsObj.page_index - 1;
      data.note_page = data.posLen / optsObj.totalLen + parseFloat(that.countPageObj.getHeadPerc(pageIndex));
      data.note_page = data.note_page.toFixed(4);
      delete data.posLen;
      delete data.currPage;
      return data;
    }
  };
  /**
   * 渲染 版权投诉面板, 并监听其相关事件. <br/>
   * 
   * @author gli-hxy-20160819 
   * 
   */
  PAD.prototype._renderComplaint = function () {
    var optsObj = this.opts;
    var that = this;
    // 版权投诉面板.
    var complainTempl = templSet.getTempl('complain');
    that.complainpage = new complaintPanel({
      $readerObj: optsObj.$readerObj,
      complainHtml: complainTempl,
      // HTML 模板
      isMobile: optsObj.isMobile,
      api: that.ApiObj,
      loading: that.LoadingObj
    });
  };
  /**
   * 纠错文字面板，并监听其相关事件. <br/>
   * 
   * @author gli-jiangxq-20160920
   */
  PAD.prototype._renderCorrect = function () {
    var optsObj = this.opts;
    var that = this;
    // 纠错文字面板.
    var correctTempl = templSet.getTempl('correct');
    that.correctpage = new correctPanel({
      $readerObj: optsObj.$readerObj,
      correctHtml: correctTempl,
      // HTML 模板
      isMobile: optsObj.isMobile,
      api: that.ApiObj
    });
  };
  /**
   * 渲染 搜索面板, 并监听其相关事件. <br/>
   * 
   * @author gli-hxy-20160819 
   * 
   */
  PAD.prototype._renderSearch = function () {
    var optsObj = this.opts;
    var that = this;
    // 搜索面板.
    var searchTempl = templSet.getTempl('search');
    that.searchpage = new searchPanel({
      $readerObj: optsObj.$readerObj,
      searchHtml: searchTempl,
      // HTML 模板
      isMobile: optsObj.isMobile,
      isClient: optsObj.isClient,
      api: that.ApiObj,
      loading: that.LoadingObj
    });
    that.searchpage.opts.$domObj.on('search:click', function (e, data) {
      console.log('[reader.js] -> search:click 触发事件, 点击搜索结果跳转! ');
      that.countPageObj.turnPageByPerc(data);
    });
  };
  /**
   * 渲染目录, 并监听其相关事件. <br/>
   * 
   */
  PAD.prototype._renderCatalog = function () {
    var optsObj = this.opts;
    var that = this;
    this.getCatalog(function (fileData) {
      optsObj.data.catalog = fileData;
      // 渲染 目录，并下载 默认 章节
      LOG.info('成功读取 目录数据 !', 'background:yellow;');
      optsObj.totalLen = parseInt(fileData.word_count);
      // 深度复制, 数组新建 指针.
      optsObj.chapts = $.extend(true, [], fileData.chapter);
      if (optsObj._useLayout) {
        LOG.info('执行 \u3010渲染布局\u3011!');
        // 检查分页数据准备情况
        that._checkPaging();
        // 目录、书签、笔记，面板.
        var cbnTempl = templSet.getTempl('cbn');
        var cbnNavMenuTempl = templSet.getTempl('cbnNavMenu');
        var cbnNavBodyTempl = templSet.getTempl('cbnNavBody');
        var catalogTempl = templSet.getTempl('catalog');
        var bookmarkTempl = templSet.getTempl('bookmark');
        var noteTempl = templSet.getTempl('note');
        var editTempl = templSet.getTempl('noteEdit');
        var detailTempl = templSet.getTempl('noteDetail');
        var shareTempl = templSet.getTempl('noteShare');
        // 创建bookmark的filePath
        var bookmarkFilePath = that._getCachePath({ 'fileName': 'bookmark' });
        // 创建bookmark的filePath
        var noteFilePath = that._getCachePath({ 'fileName': 'note' });
        that.cbnpage = new cbnPanel({
          wrapDomId: optsObj.domWrapId,
          $readerObj: optsObj.$readerObj,
          templHtml: cbnTempl,
          templHeadHtml: cbnNavMenuTempl,
          templBodyHtml: cbnNavBodyTempl,
          templCatalogHtml: catalogTempl,
          templBookmarkHtml: bookmarkTempl,
          templNoteHtml: noteTempl,
          isMobile: optsObj.isMobile,
          isClient: optsObj.isClient,
          saveFile: that.saveFile,
          bookmarkFilePath: bookmarkFilePath,
          noteFilePath: noteFilePath,
          data: optsObj.custom_nav_menus,
          api: that.ApiObj,
          // 开关- 使用[书签]
          useBookmark: optsObj.useBookmark,
          // 开关- 使用[笔记]
          useNote: optsObj.useNote,
          editHtml: editTempl,
          detailHtml: detailTempl,
          shareHtml: shareTempl,
          note_share_conf: optsObj.note_share_conf
        });
        that.cbnpage.renderCatalog(fileData);
        // 点击bookmark跳转  by gli-hxy-20160816
        that.cbnpage.on('cbnbookmark:click', function (event, percent) {
          // 关闭cbnPanel
          that.cbnpage.close();
          // 跳转到对应百分比
          that.countPageObj.turnPageByPerc(percent);
        });
        // 点击笔记跳转  by gli-hxy-20160919
        that.cbnpage.on('cbnnote:click', function (event, percent) {
          // 关闭cbnPanel
          that.cbnpage.close();
          // 跳转到对应百分比
          that.countPageObj.turnPageByPerc(percent);
        });
        // 点击目录跳转
        that.cbnpage.on('cbncatalog:click', function (event, params) {
          var oldIndex = optsObj.chapt_index;
          var newIndex = that.countPageObj.searchChaptIndex(params.id);
          if (!optsObj.chapts[newIndex].chapter_status) {
            // 该章节无权限
            console.log('[reader.js] -->章节' + params.id + '无权限\uFF01');
            optsObj.getDisableChaptCb();
            return false;
          }
          // 如果不是当前章节
          if (oldIndex !== newIndex) {
            that.countPageObj.turnChapter(newIndex);
          }
          that.cbnpage.close();
        });
      }
    }, function () {
      LOG.info('[reader.js] --> _renderCatalog --> 渲染目录\uFF0C获取目录信息失败!');
      if (optsObj.isClient) {
        LOG.info('[APP阅读] 本地无目录信息, 执行下载 !', 'background:pink;');
        // 本地无数据, 执行下载(目录, 章节);.
        that.download();
        that.LoadingObj.setMsg(Msg.downloadBooks);
      }
    });
  };
  /**
   * 渲染 设置面板. <br/>
   * 
   * 
   */
  PAD.prototype._renderSetting = function () {
    console.info('%c _renderSetting', 'background:yellow;');
    var optsObj = this.opts;
    var that = this;
    var tmpData = optsObj.data;
    that._getProgressDataOffline(function (data) {
      // 获取服务器保存的阅读进度，并和本地保存的进度进行比较
      that._getProgressDataOnline(function (onlineData) {
        if (parseInt(onlineData.bookCloseTime) > parseInt(data.progressData.updateTime)) {
          tmpData.progressData = {
            'updateTime': onlineData.bookCloseTime,
            'progress': onlineData.progress
          };
        } else {
          tmpData.progressData = data.progressData;
        }
        that._getSettingDataOffline(function (data) {
          tmpData.settingData = data.settingData;
          innerSuccessCb();
        }, function () {
          innnerErrorCb();
        });
      }, function () {
        tmpData.progressData = data.progressData;
        that._getSettingDataOffline(function (data) {
          tmpData.settingData = data.settingData;
          innerSuccessCb();
        }, function () {
          innnerErrorCb();
        });
      });  //              tmpData.progressData = data.progressData;
           //
           //              that._getSettingDataOffline(function(data) {
           //
           //                  tmpData.settingData = data.settingData;
           //
           //                  innerSuccessCb();
           //
           //              }, function() {
           //                  // error
           //                  innnerErrorCb();
           //              });
    }, function () {
      // error
      innnerErrorCb();
    });
    function innnerErrorCb() {
    }
    function innerSuccessCb() {
      console.info('%c innerSuccessCb', 'background:yellow;');
      // 设置操作 面板
      var settingTempl = templSet.getTempl('setting');
      // 字体设置面板
      var fontlightTempl = templSet.getTempl('fontlight');
      // 进度设置面板
      var progressTempl = templSet.getTempl('progress');
      that.settingpage = new settingPanel({
        wrapDomId: optsObj.domWrapId,
        $readerObj: optsObj.$readerObj,
        templHtml: settingTempl,
        fontlightHtml: fontlightTempl,
        progressHtml: progressTempl,
        isMobile: optsObj.isMobile,
        progressData: tmpData.progressData.progress,
        settingData: tmpData.settingData,
        isNightMode: tmpData.settingData.isNightMode,
        // 开关- 使用[书签]
        useBookmark: optsObj.useBookmark,
        // 开关- 使用[版权投诉]
        useComplaint: optsObj.useComplaint,
        // 开关- 使用[搜索]
        useSearch: optsObj.useSearch,
        // 开关- 使用[退出]
        useExit: optsObj.useExit,
        // 开关- 使用[字体]
        useFonts: optsObj.useFonts,
        // 开关- 使用[背景颜色]
        useBgColor: optsObj.useBgColor,
        // 开关- 使用[亮度控制]
        useLight: optsObj.useLight,
        // 开关- 使用[翻页方式]
        usePageWay: optsObj.usePageWay
      });
      // 设置操作 面板
      // 目录, 笔记, 书签
      that.settingpage.on('cbn:click', function () {
        console.log('[reader.js] -> 触发事件, 打开目录面板! ');
        that.cbnpage.open();
      });
      that.settingpage.on('bookmark:click', function (event, param) {
        console.log('[reader.js] --> bookmark:click 添加书签!! ');
        var thisChapterObj = optsObj.chapts[optsObj.chapt_index];
        var bookmarkData = {
          'bookmarkDom': param,
          'pageSite': that.countPageObj.getFootPerc(),
          'text': thisChapterObj.pages[optsObj.page_index - 1].txt,
          'chapterId': thisChapterObj.chapter_id,
          'chapterName': thisChapterObj.chapter_name
        };
        that.cbnpage.updateBookmarks(bookmarkData);
      });
      // 设置进度条值.
      that.settingpage.on('progress:setVal', function () {
        console.log('[reader.js] -> 触发事件, 弹出进度条! ');
        var val = that.countPageObj.getFootPerc() || 0;
        that.settingpage.$progressObj.setValue(val);
      });
      // 拖动定位页码.
      that.settingpage.on('progress:click', function (e, data) {
        console.log('[reader.js] -> 触发事件, 拖动定位! ');
        that.countPageObj.turnPageByPerc(data);  //that.settingpage.close();
      });
      // 章节向前翻.
      that.settingpage.on('progress:prev', function () {
        var newIndex = optsObj.chapt_index - 1;
        if (newIndex < 0) {
          newIndex = 0;
          return false;
        }
        if (!optsObj.chapts[newIndex].chapter_status) {
          // 该章节无权限
          console.log('[reader.js] -->章节:' + optsObj.chapts[newIndex].chapter_name + '无权限\uFF01');
          optsObj.getDisableChaptCb();
          return false;
        }
        that.countPageObj.turnChapter(newIndex);
        console.log('[reader.js] -> 触发事件, 章节向前翻! ');
      });
      // 章节向后翻.
      that.settingpage.on('progress:next', function () {
        var newIndex = optsObj.chapt_index + 1;
        if (newIndex === optsObj.chapts.length) {
          newIndex = newIndex - 1;
          return false;
        }
        if (!optsObj.chapts[newIndex].chapter_status) {
          // 该章节无权限
          console.log('[reader.js] -->章节:' + optsObj.chapts[newIndex].chapter_name + '无权限\uFF01');
          optsObj.getDisableChaptCb();
          return false;
        }
        that.countPageObj.turnChapter(newIndex);
        console.log('[reader.js] -> 触发事件, 章节向后翻! ');
      });
      // 设置-字体, 亮度 等.
      that.settingpage.on('font:click', function () {
        console.log('[reader.js] -> 触发事件, 设置-字体, 亮度 等! ');
      });
      // 字体大小.
      var tmpFontSize = tmpData.settingData.fontSize;
      innerSetFontSize({
        'oldValue': tmpFontSize.value,
        'newValue': tmpFontSize.value
      });
      that.settingpage.on('size:click', function (e, param) {
        console.log('[reader.js] -> 字体大小! ');
        innerSetFontSize(param);
      });
      // 版权投诉
      that.settingpage.on('complaint:click', function () {
        console.log('[reader.js] -> 触发事件, 打开版权投诉面板! ');
        that.complainpage.open();
      });
      // 搜索
      that.settingpage.on('showSearch:click', function () {
        console.log('[reader.js] -> 触发事件, 打开搜索面板! ');
        that.searchpage.open();
      });
      // 翻页方式
      that.settingpage.on('pageway:click', function (event, param) {
        console.log('[reader.js] -> 触发事件, 翻页方式 ' + param.newValue);
        optsObj.pagingType = param.newValue;
        optsObj.$readerObj.attr('data-pageway', optsObj.pagingType);
      });
      // 字体类型
      var tmpFamilyData = tmpData.settingData.fontFamily;
      innerSetFontFamily({
        'oldValue': tmpFamilyData.value,
        'newValue': tmpFamilyData.value
      });
      // 捕获事件.
      that.settingpage.on('family:click', function (e, param) {
        LOG.info('[reader.js] -> 字体类型! ');
        innerSetFontFamily(param);
      });
      // 背景颜色
      var tmpBgColor = tmpData.settingData.bgColor;
      innerbackground({
        'oldValue': tmpBgColor.value,
        'newValue': tmpBgColor.value
      });
      that.settingpage.on('bgcolor:click', function (e, param) {
        LOG.info('[reader.js] -> 背景颜色! ');
        innerbackground(param);
      });
      // 夜间模式
      optsObj.isNightMode = tmpData.settingData.isNightMode;
      innerNightMode();
      that.settingpage.on('night:click', function (e, param) {
        LOG.info('[reader.js] -> 夜间模式切换! ');
        optsObj.isNightMode = param;
        innerNightMode();
      });
      // 关闭面板
      that.settingpage.on('close:click', function () {
        console.log('[reader.js] -> 捕获事件, 关闭面板! ');
        that._saveSettingFile();
      });
      // 退出阅读器
      that.settingpage.on('out:click', function () {
        console.log('[reader.js] -> 捕获事件, 退出阅读器! ');
        that.exit();
      });
    }
    // 设置 "字体大小";
    function innerSetFontSize(options) {
      that._deletePages();
      that.mainpage.setFontSize(options);
      that.countPageObj.setFontSize(options);
    }
    // 设置 "字体类型"
    function innerSetFontFamily(options) {
      that._deletePages();
      that.mainpage.setFontFamily(options);
      that.countPageObj.setFontFamily(options);
    }
    // 设置 "背景颜色"
    function innerbackground(options) {
      that.mainpage.setBgColor(options);
    }
    // 设置"夜间模式"
    function innerNightMode() {
      if (optsObj.isNightMode) {
        optsObj.$readerObj.addClass('read-night');
      } else {
        optsObj.$readerObj.removeClass('read-night');
      }
    }
  };
  /**
   * 检查分页状态. <br/>
   * 
   */
  PAD.prototype._checkPaging = function () {
    // 计时器 等待 [阅读记录] 读取完毕.
    var that = this;
    var optsObj = this.opts;
    setTimeout(function () {
      if (null == optsObj.data.progressData || null == optsObj.data.settingData) {
        that._checkPaging();
      } else {
        // 本地路径
        if (!optsObj.isClient) {
          var path = '';
        } else {
          var path = gli_get_cache_path() + that._getCachePath({ fileName: '' }) || '';
          path = path.substr(0, path.lastIndexOf('.'));
        }
        that.countPageObj.begin({
          'totalLen': optsObj.totalLen,
          'chapts': optsObj.chapts,
          'chapt_index': optsObj.chapt_index,
          'progressData': optsObj.data.progressData,
          'path': path
        });
        // 注册监听PAD端 旋转
        if (typeof gli_device_orientation == 'function') {
          setTimeout(function () {
            gli_device_orientation(function (degree) {
              if (Math.abs(degree - 90) < 45 || Math.abs(degree - 270) < 45) {
                that.changePageColumn(1);
              } else {
                that.changePageColumn(2);
              }
            }, 500);
          }, 1000);
        }
      }
    }, 800);
  };
  /**
   * 渲染 分页器面板. <br/>
   * 
   */
  PAD.prototype._renderCountpage = function () {
    var that = this;
    var optsObj = this.opts;
    // 分页器面板
    var countPageTempl = templSet.getTempl('countpage');
    this.countPageObj = new countPage({
      templHtml: countPageTempl,
      $readerObj: optsObj.$readerObj,
      isMobile: optsObj.isMobile,
      clientType: optsObj.clientType,
      isClient: optsObj.isClient,
      pageColumn: optsObj.pageColumn,
      useEpubStyle: optsObj.useEpubStyle,
      useProbation: optsObj.useProbation
    });
    // 精排
    this.delicateObj = new delicateType({ wrapDomObj: optsObj.$readerObj.find('.read-delicate')[0] });
    var innerRenderCatalog = function () {
      var catalogData = optsObj.data.catalog;
      for (var i = 0, len = catalogData.chapter.length; i < len; i++) {
        var pageIndexInfo = that.countPageObj.getPageIndex(i);
        catalogData.chapter[i].pageNum = pageIndexInfo.currPage;
      }
      that.cbnpage.renderCatalog(catalogData);
    };
    // 章节内容
    this.countPageObj.on('countpage:getChapterContent', function (event, index) {
      that._pagingChapter(index);
    });
    // 页面显示
    this.countPageObj.on('countpage:showPage', function (event, data) {
      // 先去精排dom内精排后取出精排数据
      if (optsObj.usePublish) {
        data.chapterContent = that.delicateObj.excute({ html: data.chapterContent });
        if (optsObj.pageColumn == 2) {
          data.secondPage = that.delicateObj.excute({ html: data.secondPage });
        }
      }
      that._showPage(data);
    });
    // 分页完成
    this.countPageObj.on('countpage:finish', function (event, index) {
      var chapt = optsObj.chapts[index];
      var tempData = that.countPageObj.getPagingData();
      chapt.pages = tempData.pages;
      chapt.images = tempData.images;
      chapt.html = tempData.html;
      chapt.isPretreat = tempData.isPretreat;
      //              innerRenderCatalog();
      // 执行注册回调函数
      optsObj.getDataCb();
    });
    // 分页显示数据准备完成
    this.countPageObj.on('countpage:already', function () {
      that.LoadingObj.close();
      // 首次进入阅读器, 操作提示.
      if (optsObj.data.settingData.readTimes === 0) {
        that.promptPage.open(0);
        optsObj.data.settingData.readTimes++;
      }
    });
    // 保存图片
    this.countPageObj.on('countpage:downloadPhoto', function (event, data) {
      that._downloadPhoto(data);
    });
    // 试读 -- 无权限阅读数据
    this.countPageObj.on('countpage:noright', function (event, data) {
      optsObj.probotionCb();
    });
  };
  /**
   * 渲染 图片预览面板. <br/>
   * 
   */
  PAD.prototype._renderViewImgPage = function () {
    var that = this;
    var optsObj = this.opts;
    this.viewImgPage = new viewImgPanel({
      '$wrapObj': optsObj.$readerObj,
      'dataTempl': templSet.getTempl('viewImg'),
      'isClient': optsObj.isClient,
      'isMobile': optsObj.isMobile,
      'clientType': optsObj.clientType,
      'isDownloadImg': optsObj.isDownloadImg
    });
  };
  /**
   * 渲染 操作提示面板 . <br/>
   * 
   */
  PAD.prototype._renderPromptPage = function () {
    var optsObj = this.opts;
    this.promptPage = new promptPanel({
      '$wrapObj': optsObj.$readerObj,
      'isMobile': optsObj.isMobile,
      'contentSet': [
        templSet.getTempl('firstOpen'),
        '<div class=\'read-content\'> TEST_2 !</div>'
      ]
    });
  };
  /**
   * 设置阅读器 区域的 属性: fontsize. <br/>
   * 
   */
  PAD.prototype._setFontSize = function () {
    var optsObj = this.opts;
    var deviceWidth = optsObj.$readerWrap.width();
    //          deviceWidth = deviceWidth > 750 ? 750 : deviceWidth;
    optsObj.$readerWrap.css('font-size', deviceWidth / 10.24 + 'px');
  };
  /**
   * 取得本地图书目录(手机, C++)。<br/>
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  PAD.prototype._getCatalogOffline = function (successCb, errorCb) {
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': 'catalog' });
    this.readFile(filePath, function (data) {
      if (null == data) {
        errorCb();
      } else {
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 取得在线图书目录。<br/>
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  PAD.prototype._getCatalogOnline = function (successCb, errorCb) {
    this.ApiObj.getBookCatalog({}, function (data) {
      successCb(data);
    }, function (result) {
      errorCb(result);
    });
  };
  /**
   * 取得本地图书书签(手机, C++)。<br/>
   * 
   * 如果获取数据失败 或 不可读, 则认为: "数据损坏", 并执行重新下载!
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function} 获得数据失败 执行回调函数.
   * 
   */
  PAD.prototype._getBookmarkOffline = function (successCb, errorCb) {
    LOG.log('[reader.js] -> _getBookmarkOffline! ');
    var optsObj = this.opts;
    var filePath = this._getCachePath({ fileName: 'bookmark' });
    this.readFile(filePath, function (data) {
      if (null == data) {
        errorCb();
      } else {
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 取得在线图书书签(web)。<br/>
   * 
   * 如果获取数据失败 或 不可读, 则认为: "数据损坏", 弹出提示框!
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function} 获得数据失败 执行回调函数.
   * 
   */
  PAD.prototype._getBookmarkOnline = function (successCb, errorCb) {
    LOG.log('[reader.js] -> _getBookmarkOnline! ');
    this.ApiObj.getBookmark({}, function (data) {
      successCb(data);
    }, function (result) {
      console.warn('[reader.js]--获取书签信息失败!');
      errorCb(result);
    });
  };
  /**
   * 渲染书签. <br/>
   * 
   */
  PAD.prototype._renderBookmark = function () {
    var optsObj = this.opts;
    var that = this;
    // 判断开关, 是否使用书签.
    if (!optsObj.useBookmark) {
      return;
    }
    if (!that.cbnpage) {
      // cbnPage 未初始化. 等待。。。
      setTimeout(function () {
        that._renderBookmark();
      }, 1000);
      return;
    }
    this.getBookmark(function (fileData) {
      // 渲染 书签.
      LOG.info('成功读取 书签数据 !', 'background:yellow;');
      // 如果是客户端，先下载服务器上的书签，并和本地的书签进行比较，如果本地书签更新时间晚，批量更新服务器书签
      if (optsObj.isClient) {
        var uploadBookmark = tool.filterLocalData(fileData.bookmark_list);
        if (uploadBookmark.length == 0) {
          // 本地无更新
          innerGetLatestBookmark();
        } else {
          that.ApiObj.batchUpdateBookmark({
            'time_stamp': fileData.time_stamp,
            'mark_list': uploadBookmark
          }, function (data) {
            innerGetLatestBookmark();
          }, function (data) {
            // 批量更新失败.
            that.cbnpage.renderBookmark(fileData);
          });
        }
      } else {
        that.cbnpage.renderBookmark(fileData);
      }
      function innerGetLatestBookmark() {
        that._getBookmarkOnline(function (latestBookmark) {
          var filePath = that._getCachePath({ 'fileName': 'bookmark' });
          var dataStr = JSON.stringify(latestBookmark);
          that.saveFile(filePath, dataStr);
          that.cbnpage.renderBookmark(latestBookmark);
        }, function () {
          // 获取最新笔记信息失败
          that.cbnpage.renderBookmark(fileData);
        });
      }
    }, function () {
      LOG.warn('[reader.js] --> _renderBookmark --> 渲染书签\uFF0C获取书签信息失败!');
      if (optsObj.isClient) {
        LOG.info('[APP阅读] 本地无书签信息, 执行下载 !', 'background:pink;');
        that.downloadBookmark();
      } else {
        that.cbnpage.renderBookmark();
      }
    });
  };
  /**
   * 下载图书书签. <br/>
   * 
   */
  PAD.prototype.downloadBookmark = function () {
    var that = this;
    var optsObj = this.opts;
    LOG.log('[PAD.js] -> downloadBookmark ' + optsObj.book_id);
    // 1. 书签 -- bookmark;
    var filePath = that._getCachePath({ fileName: 'bookmark' });
    this._getBookmarkOnline(function (data) {
      LOG.log('成功下載 书签 并 保存!');
      var dataStr = JSON.stringify(data);
      that.saveFile(filePath, dataStr);
      setTimeout(function () {
        that._renderBookmark();
      }, 300);
    }, function (result) {
      LOG.warn('[PAD.js] -> downloadBookmark ' + result);
    });
  };
  /**
   * 取得本地图书笔记(手机, C++)。<br/>
   * 
   * 如果获取数据失败 或 不可读, 则认为: "数据损坏", 并执行重新下载!
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function} 获得数据失败 执行回调函数.
   * 
   */
  PAD.prototype._getNoteOffline = function (successCb, errorCb) {
    LOG.log('[reader.js] -> _getNoteOffline! ');
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': 'note' });
    this.readFile(filePath, function (data) {
      if (null == data) {
        errorCb();
      } else {
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 取得在线图书笔记(web)。<br/>
   * 
   * 如果获取数据失败 或 不可读, 则认为: "数据损坏", 弹出提示框!
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function} 获得数据失败 执行回调函数.
   * 
   */
  PAD.prototype._getNoteOnline = function (successCb, errorCb) {
    LOG.log('[reader.js] -> _getNoteOnline! ');
    this.ApiObj.getBookNote({}, function (data) {
      successCb(data);
    }, function (result) {
      LOG.warn('[reader.js]--获取笔记信息失败!');
      errorCb(result);
    });
  };
  /**
   * 获取 设置面板 参数.<br/>
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  PAD.prototype._getSettingDataOffline = function (successCb, errorCb) {
    var that = this;
    var optsObj = that.opts;
    var tmpData = {};
    // 非app 比如微信、浏览器等
    if (!optsObj.isClient) {
      tmpData.settingData = Config.settingData;
      successCb(tmpData);
      return;
    }
    var filePath = this._getCachePath({
      'fileName': 'settingPanel',
      'bid': 'b_all',
      'uid': 'u_all'
    });
    this.readFile(filePath, function (data) {
      if (null == data) {
        tmpData.settingData = Config.settingData;
        that.saveFile(filePath, JSON.stringify(tmpData));
        successCb(tmpData);
      } else {
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 获取 阅读进度 参数. TODO -- 需要同步服务器.<br/>
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  PAD.prototype._getProgressDataOffline = function (successCb, errorCb) {
    var that = this;
    var optsObj = that.opts;
    var tmpData = {};
    if (!optsObj.isClient) {
      tmpData.progressData = Config.progressData;
      tmpData.progressData.updateTime = '0';
      successCb(tmpData);
      return;
    }
    var filePath = this._getCachePath({ 'fileName': 'progress' });
    this.readFile(filePath, function (data) {
      if (null == data) {
        tmpData.progressData = Config.progressData;
        tmpData.progressData.updateTime = new Date().getTime() + '';
        that.saveFile(filePath, JSON.stringify(tmpData));
        successCb(tmpData);
      } else {
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 在线获取 阅读进度 参数. <br/>
   * 
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  PAD.prototype._getProgressDataOnline = function (successCb, errorCb) {
    LOG.log('[readerMobile.js] -> _getProgressDataOnline! ');
    this.ApiObj.getProgressData({}, function (data) {
      successCb(data);
    }, function (result) {
      LOG.warn('[reader.js]--在线获取 阅读进度 失败!');
      errorCb(result);
    });
  };
  /**
   * 渲染笔记. <br/>
   * 
   */
  PAD.prototype._renderNote = function () {
    var optsObj = this.opts;
    var that = this;
    // 判断开关, 是否使用书签.
    if (!optsObj.useNote) {
      return;
    }
    if (!that.cbnpage) {
      // cbnPage 未初始化. 等待。。。
      setTimeout(function () {
        that._renderNote();
      }, 100);
      return;
    }
    this.getNote(function (fileData) {
      // 渲染 目录，并下载 默认 章节.
      LOG.info('成功读取 笔记数据 !', 'background:yellow;');
      if (optsObj.isClient) {
        var uploadNote = tool.filterLocalData(fileData.note_list);
        if (uploadNote.length == 0) {
          // 本地无更新
          innerGetLatestNote();
        } else {
          that.cbnpage.noteObj.batchUpdateNote({
            'time_stamp': fileData.time_stamp,
            'note_list': uploadNote
          }, function (data) {
            innerGetLatestNote();
          }, function (data) {
            // 批量更新失败.
            that.cbnpage.renderNote(fileData);
          });
        }
      } else {
        that.cbnpage.renderNote(fileData);
      }
      function innerGetLatestNote() {
        that._getNoteOnline(function (latestNote) {
          var filePath = that._getCachePath({ 'fileName': 'note' });
          var dataStr = JSON.stringify(latestNote);
          that.saveFile(filePath, dataStr);
          that.cbnpage.renderNote(latestNote);
        }, function () {
          // 获取最新笔记信息失败
          that.cbnpage.renderNote(fileData);
        });
      }
    }, function () {
      LOG.warn('[reader.js] --> _renderNote --> 渲染笔记\uFF0C获取笔记信息失败!');
      if (optsObj.isClient) {
        LOG.info('[APP阅读] 本地无笔记信息, 执行下载 !', 'background:pink;');
        that.downloadNote();
      } else {
        that.cbnpage.renderNote();
      }
    });
  };
  /**
   * 下载图书笔记. <br/>
   * 
   */
  PAD.prototype.downloadNote = function () {
    var that = this;
    var optsObj = this.opts;
    LOG.log('[PAD.js] -> download ' + optsObj.book_id);
    // 1. 笔记 -- note; 
    var filePath = this._getCachePath({ 'fileName': 'note' });
    this._getNoteOnline(function (data) {
      LOG.log('成功下載 笔记 并 保存!');
      var dataStr = JSON.stringify(data);
      that.saveFile(filePath, dataStr);
      setTimeout(function () {
        that.cbnpage.renderNote(data);
      }, 300);
    }, function (result) {
      LOG.warn('[PAD.js] -> downloadNote ' + result);
      that.cbnpage.renderNote();
    });
  };
  /**
   * 取得 本地图书章节内容<br/>
   * 
   * @param dataIn {Object}  章节id  e.g.  {chapter_id: "1001",chapter_name: "第一章"}
   * @param successCb {Function} 成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  PAD.prototype._getChapterOffline = function (dataIn, successCb, errorCb) {
    LOG.log('[reader.js] -> _getChapterOffline! ');
    // TODO， 改为 chapter_id;
    var filePath = this._getCachePath({ 'fileName': dataIn.chapter_name });
    this.readFile(filePath, function (data) {
      if (null == data) {
        errorCb();
      } else {
        data = tool.doDecodeData(data);
        successCb(data);
      }
    });
  };
  /**
   * 取得 在线图书章节内容<br/>
   * 
   * @param dataIn {Object}  章节id  e.g.  {chapter_id: "1001",chapter_name: "第一章"}
   * @param successCb {Function} 获得数据成功 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   */
  PAD.prototype._getChapterOnline = function (dataIn, successCb, errorCb) {
    this.ApiObj.getChapter(dataIn, function (result) {
      successCb(result);
    }, function (result) {
      errorCb(result);
    });
  };
  /**
   * 更新目录信息中的 章节下载状态.<br/>
   * 
   * @param target {Object}  e.g {chapter_id: "1001", isDownload: true}
   * 
   */
  PAD.prototype._updateDownloadState = function (target) {
    var optsObj = this.opts;
    var catalogData = !!optsObj.data.catalog ? optsObj.data.catalog.chapter : [];
    for (var i = 0, len = catalogData.length; i < len; i++) {
      if (catalogData[i].chapter_id == target.chapter_id) {
        catalogData[i].isDownload = target.isDownload;
        break;
      }
    }
  };
  /**
   * 保存 目录信息至本地.<br/>
   * 
   */
  PAD.prototype._saveCatalog = function () {
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': 'catalog' });
    var catalogStr = JSON.stringify(optsObj.data.catalog);
    this.saveFile(filePath, catalogStr);
  };
  /**
   * 保存 章节内容 至本地.<br/>
   * 
   * @param {String} chapterName  文件名. 
   * @param {String} content      文件内容.
   * 
   */
  PAD.prototype._saveChapter = function (chapterName, content) {
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': chapterName });
    // 批量下载图片
    if (optsObj.isOnlyDownload) {
      var path = filePath.substr(0, filePath.lastIndexOf('/') + 1);
      this._batchdownloadPhoto(path, content);
    }
    this.saveFile(filePath, content);
  };
  /**
   * 保存/更新 当前设置面板参数至本地.<br/>
   * 
   * @param {Boolean} updTimes 是否更新阅读次数.
   * 
   */
  PAD.prototype._saveSettingFile = function (updTimes) {
    var optsObj = this.opts;
    var filePath = this._getCachePath({
      'fileName': 'settingPanel',
      'bid': 'b_all',
      'uid': 'u_all'
    });
    if (!!this.settingpage) {
      var tmpSettingData = this.settingpage.getSettingData();
      if (!!updTimes) {
        // 阅读器打开次数. 用以判断 是否弹出 "操作提示界面"!
        tmpSettingData.readTimes = parseInt(tmpSettingData.readTimes) + 1;
      }
      this.saveFile(filePath, JSON.stringify({ 'settingData': tmpSettingData }));
    }
  };
  /**
   * 保存/更新 当前 阅读进度 至本地.<br/>
   * 
   */
  PAD.prototype._saveProgressFile = function () {
    var optsObj = this.opts;
    var tempData = optsObj.data.progressData;
    var filePath = this._getCachePath({ 'fileName': 'progress' });
    tempData.updateTime = new Date().getTime();
    tempData.progress = this.countPageObj.getFootPerc();
    this.saveFile(filePath, JSON.stringify({ 'progressData': tempData }));
  };
  /**
   * 保存记录书籍阅读状态. <br/>
   * 
   */
  PAD.prototype._saveBookState = function () {
    var optsObj = this.opts;
    var that = this;
    var bookStateData = [];
    var filePath = this._getCachePath({ 'fileName': 'bookState' });
    this.readFile(filePath, function (data) {
      if (null != data) {
        data = tool.doDecodeData(data);
        data = JSON.parse(data);
        bookStateData = data;
      }
      bookStateData.push({
        'bookOpenTime': optsObj.bookOpenTime,
        'bookCloseTime': new Date().getTime()
      });
      that.ApiObj.setBookState({ 'bookStateData': bookStateData }, function () {
        that.saveFile(filePath, JSON.stringify([]));
      }, function () {
        that.saveFile(filePath, JSON.stringify(bookStateData));
      });
    });
  };
  /**
   * 获取 离线状态下本地的版权保护 参数.<br/>
   * 
   * @param successCb {Function}   成功获得数据 执行回调函数.
   * @param errorCb   {Function}   获得数据失败 执行回调函数.
   * 
   * @author gli-jiangxq-20160829
   */
  PAD.prototype._getCoprDataOffline = function (successCb, errorCb) {
    var that = this;
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': 'copyright' });
    if (!optsObj.isClient) {
      optsObj.data.copyright = Config.copyright;
      errorCb();
      return false;
    }
    this.readFile(filePath, function (data) {
      if (null == data) {
        var tmpData = {};
        tmpData.coprData = Config.copyright;
        that.opts.data.copyright = Config.copyright;
        that.saveFile(filePath, JSON.stringify(tmpData));
        errorCb();
      } else {
        data = tool.doDecodeData(data);
        successCb(JSON.parse(data));
      }
    });
  };
  /**
   * 保存当前版权保护信息至本地. <br/>
   * 
   * @author gli-jiangxq-20160829
   */
  PAD.prototype._saveCopyright = function () {
    var optsObj = this.opts;
    var filePath = this._getCachePath({ 'fileName': 'copyright' });
    var copyrightStr = JSON.stringify({ 'coprData': optsObj.data.copyright });
    this.saveFile(filePath, copyrightStr);
  };
  /**
   * 下载 单个章节内容. <br/>
   * 
   * @param {Object} chapterInfo 单个章节的目录信息
   * @param {String} chapterInfo.chapter_id    章节id
   * @param {String} chapterInfo.chapter_name  章节名
   * @param {Boolean} chapterInfo.isDownload   是否已下载
   * @param {Boolean} chapterInfo.chapter_status 是否可读
   * 
   * @param {Function} successCb 下载成功 回调函数
   * @param {Function} errorCb   下载失败 回调函数
   * 
   * @author gli-hxy-20160826
   * 
   */
  PAD.prototype._downloadSingleChapter = function (chapterInfo, successCb, errorCb) {
    var that = this;
    var optsObj = that.opts;
    if (!chapterInfo || !chapterInfo.chapter_status) {
      // 传入信息错误 或者 本章无权限阅读.
      // errorCb(); TODO
      return;
    }
    this._getChapterOnline({ 'chapter_id': chapterInfo.chapter_id }, function (result) {
      LOG.info('[reader.js] -> 下载单个章节:' + chapterInfo.chapter_name);
      chapterInfo.isDownload = true;
      // 保存本章 内容。
      that._saveChapter(chapterInfo.chapter_name, result);
      // 更新目录信息.
      that._updateDownloadState(chapterInfo);
      that._saveCatalog();
      successCb();
      // 执行下载完成一章回调
      optsObj.downloadCb();
    }, function (result) {
      LOG.warn('[reader.js] -> 获取单个 [章节内容] 失败!' + result);
      errorCb();
    });
  };
  /**
   * 下载章节内容.<br/>
   * 
   */
  PAD.prototype._downloadChapter = function () {
    var optsObj = this.opts;
    var chapterSet = optsObj.data.readableChapter || [];
    var pos = -1;
    var that = this;
    for (var i = 0, len = chapterSet.length; i < len; i++) {
      if (!chapterSet[i].isDownload) {
        pos = i;
        break;
      }
    }
    if (-1 !== pos) {
      //  revise by gli-hxy-20160826 stsrt
      that._downloadSingleChapter(chapterSet[pos], function (result) {
        //  sucess
        // 判断是下载一章，还是全书下载
        if (optsObj.isOnlyDownload) {
          that._downloadChapter();
        }
        if (optsObj._downloadState.rate == 30) {
          that._renderCatalog();
        }
        optsObj._downloadState = {
          'state': true,
          'rate': tool.getProgressRate(chapterSet.length, pos + 1, 30)
        };  //                  optsObj.downloadCb();
      }, function (errorResult) {
        // error.
        if (optsObj._downloadState.rate <= 30) {
          // 只有目录下载成功， 无章节内容.
          console.error('[reader.js] --> _downloadChapter; 只有目录下载成功\uFF0C 无章节内容.');
          // 关闭loading
          that.LoadingObj.close();
          // 提示用户当前章节下载失败
          that.DialogObj.setMsg(Msg.chapterFalse);
          that.DialogObj.open();  // TODO 提示信息的确定取消都要退出阅读器
        }
      });  //  revise by gli-hxy-20160826 end
    }
  };
  /**
   * 下载 图书, 保存为 本地文件. <br/>
   * 
   * 图书信息包括 目录, 章节. <br/>
   * ps: 以后考虑 书签, 笔记, 阅读习惯参数 等...<br/>
   * 
   */
  PAD.prototype.download = function () {
    var optsObj = this.opts;
    var that = this;
    LOG.info('[reader.js] --> download!  userId:' + optsObj.user_id + ' , book_id:' + optsObj.book_id);
    this._getCatalogOnline(function (catalogData) {
      // 存入 当前对象.
      optsObj.data.catalog = catalogData;
      // 增加 属性 [isDownload]
      var tmpChapter = catalogData.chapter;
      // 准备需要下载的 章节的 id.
      var readableChapter = [];
      // 目录下载成功即有30%数据
      optsObj._downloadState.rate = 30;
      for (var i = 0, len = tmpChapter.length; i < len; i++) {
        tmpChapter[i].isDownload = false;
        if (tmpChapter[i].chapter_status) {
          var tmpItem = {};
          tmpItem.chapter_id = tmpChapter[i].chapter_id;
          tmpItem.chapter_name = tmpChapter[i].chapter_name;
          tmpItem.isDownload = tmpChapter[i].isDownload;
          tmpItem.chapter_status = tmpChapter[i].chapter_status;
          readableChapter.push(tmpItem);
        }
      }
      optsObj.data.readableChapter = readableChapter;
      optsObj.getCatalogCb();
      if (optsObj.useEpubFile) {
        //  执行 注册函数回调. 使用 epub源文件. 不需要分页, 不需要下载章节;/ 
        return;
      }
      that._saveCatalog();
      that._downloadChapter();
    }, function (result) {
      LOG.warn('[reader.js] -> download ' + result);
    });
  };
  /**
   * 获取 图书下载 进度信息。
   *
   * @return {
   *     state : {Boolean} 状态 true: 成功, 失败.
   *     rate :  {Number} 进度
   * }
   *
   */
  PAD.prototype.getDownloadInfo = function () {
    var optsObj = this.opts;
    var downloadInfo = optsObj._downloadState;
    return downloadInfo;
  };
  /**
   * 获取 目录信息。<br/>
   *
   * @return {Object} 结构复杂,请参考数据接口文档
   *
   */
  PAD.prototype.getCatalogInfo = function () {
    var optsObj = this.opts;
    var catalogData = optsObj.data.catalog || [];
    return catalogData;
  };
  /**
   * 获取 分页完毕的 书籍信息。<br/>
   *
   * @return {Object}
   *
   */
  PAD.prototype.getPagesAll = function () {
    var optsObj = this.opts;
    var tmpChapterData = optsObj.chapts || [];
    return tmpChapterData;
  };
  /**
   * 下载图片. <br/>
   * @param {Object} images {
   *              old_src: 图片服务器源地址
   *              new_src: 图片保存本地地址
   *         }
   * @author gli-jiangxq-20160816
   */
  PAD.prototype._downloadPhoto = function (img) {
    var optsObj = this.opts;
    var new_src = img.new_src.replace(gli_get_cache_path(), '');
    tool._downloadImageFile(img.old_src, new_src);
  };
  /**
   * 批量下载图片. <br/>
   * 
   * @param {String} path     路径
   * @param {String} content  章节html
   * 
   * @author gli-jiangxq-20161014
   */
  PAD.prototype._batchdownloadPhoto = function (path, content) {
    var basePath = gli_get_cache_path() + path + 'images/';
    var that = this;
    $(content).find('img').each(function () {
      var old_src = $(this).attr('src');
      var img_name = old_src.substring(old_src.lastIndexOf('/') + 1, old_src.length);
      var new_src = basePath + img_name;
      that._downloadPhoto({
        'old_src': old_src,
        'new_src': new_src
      });
    });
  };
  /** 
   * 读取具体某一章节(optsObj.chapt_index),并执行分页. <br/>
   * 
   * @param {Number} index 目标章节的下标
   * 
   * @author gli-jiangxq-20160809
   */
  PAD.prototype._pagingChapter = function (index) {
    var that = this;
    var optsObj = that.opts;
    var chapterItem = optsObj.chapts[index];
    if (!chapterItem.chapter_status) {
      console.log('[reader.js] --> 该章节您没有权限\uFF01');
      return false;
    }
    // 是否已有分页信息
    if (!!optsObj.chapts[index].pages && optsObj.chapts[index].pages.length) {
      // 设置章节分页信息
      that.countPageObj.setChapterData({
        'index': index,
        'getHtml': optsObj.chapts[index].html,
        'pages': optsObj.chapts[index].pages,
        'isPretreat': optsObj.chapts[index].isPretreat
      });
      that.countPageObj.readyData();
    } else {
      that.LoadingObj.setMsg(Msg.loading);
      that.LoadingObj.open();
      // 分页数据已经预处理过，直接用预处理过的html
      if (optsObj.chapts[index].isPretreat) {
        // 设置需要分页的章节信息
        that.countPageObj.setChapterData({
          'index': index,
          'getHtml': optsObj.chapts[index].html,
          'pages': [],
          'isPretreat': optsObj.chapts[index].isPretreat
        });
        // 执行分页
        that.countPageObj.excutePaging();
      } else {
        // 获取当前章节的数据
        that.getChapterContent({
          'chapter_id': chapterItem.chapter_id,
          'chapter_name': chapterItem.chapter_name
        }, function (data) {
          optsObj.chapts[index].html = data;
          // 设置需要分页的章节信息
          that.countPageObj.setChapterData({
            'index': index,
            'getHtml': data,
            'pages': [],
            'isPretreat': optsObj.chapts[index].isPretreat
          });
          // 执行分页
          that.countPageObj.excutePaging();
        }, function (data) {
          // add by gli-hxy-20160826 start
          LOG.warn('[reader.js]--> pagingChapter:' + data);
          that._downloadSingleChapter(chapterItem, function () {
            var len = 0;
            var chapts = optsObj.chapts;
            for (var i = 0; i < chapts.length; i++) {
              if (chapts[i].chapter_status) {
                len++;
              }
            }
            that._pagingChapter(index);
            optsObj._downloadState = {
              'state': true,
              'rate': tool.getProgressRate(len, index + 1, optsObj._downloadState.rate)
            };
          }, function () {
            // 关闭loading
            that.LoadingObj.close();
            // 提示用户当前章节下载失败
            that.DialogObj.setMsg(Msg.chapterFalse);
            that.DialogObj.open();
            that.countPageObj.opts.chapt_index = optsObj.chapt_index;
            that.countPageObj.opts.page_index = optsObj.page_index;
          });  // add by gli-hxy-20160826 end
        });
      }
    }
  };
  /**
   * 删除所有分页数据. <br/>
   * 
   * @author gli-jiangxq-20160818
   */
  PAD.prototype._deletePages = function () {
    var optsObj = this.opts;
    var chapts = optsObj.chapts;
    if (!chapts) {
      return false;
    }
    for (var i = 0, len = chapts.length; i < len; i++) {
      if (!!chapts[i].pages) {
        chapts[i].pages = [];
      }
    }
  };
  /**
   * 向后翻页. </br>
   * 
   * @author gli-jiangxq-20160905
   */
  PAD.prototype.next = function () {
    this.countPageObj.turnPage('next');
  };
  /**
   * 向前翻页. </br>
   * 
   * @author gli-jiangxq-20160905
   */
  PAD.prototype.pre = function () {
    this.countPageObj.turnPage('prev');
  };
  /**
   * 页面显示一列和两列切换. <br/>
   * 
   * @param {Number} column  显示几列  ps:1或者2
   */
  PAD.prototype.changePageColumn = function (column) {
    var optsObj = this.opts;
    if (this.countPageObj.opts.state) {
      console.log('[readerPad.js] --> 正在分页,不能切换\uFF01');
      return false;
    }
    if (optsObj.pageColumn == column) {
      return false;
    }
    optsObj.pageColumn = column;
    this.selectObj.opts.pageColumn = column;
    this.countPageObj.opts.pageColumn = column;
    this._deletePages();
    this._setFontSize();
    this.countPageObj.changeColumn();
    // 如果是两列则无翻页动画，增加标记
    if (optsObj.pageColumn == 2) {
      optsObj.$readerObj.attr('data-page-mode', 'not-mode');
    } else {
      optsObj.$readerObj.attr('data-page-mode', '');
    }
  };
  /**
   * 显示分页数据到页面.  <br/>
   * 
   * @param {Object} data {
   *      'chapt_index':      {Number} optsObj.chapt_index,
   *      'page_index':       {Number} optsObj.page_index,
   *      'chapterId'         {String} 当前的章节id
   *      'chapterName':      {String} 章节名
   *      'chapterContent':   {String} 当前页html
   *      'pagePerc':         {String} 当前页偏移量  ps:12.34%
   *      'direction':        {String} 翻页方向  ps:'next','prev'
   *      'turnMode':         {Number} 翻页模式  ps:0,正常反应，有翻页动画;1,特殊翻页,无翻页动画
   *      'startPageOffset'   {String} 当前页的开始偏移量
   *      'endPageOffset'     {String} 当前页的结束偏移量
   *     }
   * @author gli-jiangxq 20160809
   */
  PAD.prototype._showPage = function (data) {
    LOG.info('[reader.js]--> showPage');
    var optsObj = this.opts;
    // 页面章节下标和页码没有发生改变不执行页面翻页动作
    if (!data.turnMode && optsObj.chapt_index === data.chapt_index && optsObj.page_index === data.page_index) {
      return false;
    }
    optsObj.chapt_index = data.chapt_index;
    optsObj.page_index = data.page_index;
    if (optsObj.pageColumn == 1) {
      data.firstPagePerc = data.pagePerc;
    }
    this.mainpage.showPagedata(data, optsObj.pagingType);
    var chaptName = optsObj.chapts[optsObj.chapt_index].chapter_name;
    var chaptTotal = optsObj.chapts.length;
    var progressVal = this.countPageObj.getFootPerc();
    this.settingpage.setProgressVal({
      'name': chaptName,
      'currIndex': optsObj.chapt_index + 1,
      'total': chaptTotal,
      'val': progressVal,
      'turnMode': data.turnMode
    });
  };
  /**
   * 获取缓存路径（书签、笔记、目录、设置的参数等） <br />
   * 
   * @param {Object} params 传入参数
   * @param {String} params.fileName 文件名  如:"第一章"
   * @param {String} params.bid      图书id 如:"b100"
   * @param {String} params.uid      用户id 如:"20160700001"
   * 
   * @return {String} filePath 文件路径  "c:/path/20160700001/b100/第一章.txt"
   * 
   * @author gli-hxy-20160818
   * 
   */
  PAD.prototype._getCachePath = function (params) {
    var optsObj = this.opts;
    var localPath = optsObj.downloadPath;
    var bookid = params.bid || optsObj.book_id;
    var userid = params.uid || optsObj.user_id;
    var tmpFileName = params.fileName || '';
    var filePath = tool.createBookPath(userid, bookid, tmpFileName, localPath);
    return filePath;
  };
  /**
   * 删除本地指定位置数据（目录、书签、章节信息、设置信息等） <br>.
   * 
   * 开发者使用
   */
  PAD.prototype.delLocalData = function () {
    var that = this;
    var optsObj = that.opts;
    //          var path = tool.createBookPath(
    //              optsObj.user_id,
    //              optsObj.book_id,
    //              "",
    //              optsObj.downloadPath);
    //              
    //          var localPath = path.indexOf(".txt") != -1 ? path.slice(0,-5) :path;
    if (typeof gli_file_unlink == 'function') {
      gli_file_unlink(optsObj.downloadPath);
    }
  };
  /**
   * 退出阅读器取消监听：音量键、返回键监听，相册数量监听
   */
  PAD.prototype._unbindAppEvents = function () {
    // 取消按键注册
    if (typeof gli_keydown_event != 'undefined' && typeof gli_keydown_event == 'function') {
      gli_keydown_event(0, function () {
      }, false);
      gli_keydown_event(1, function () {
      }, false);
      gli_keydown_event(2, function () {
      }, false);
    }
    // 取消相册监听
    if (typeof gli_photo_change != 'undefined' && typeof gli_photo_change == 'function') {
      gli_photo_change(function () {
      }, false);
    }
    // 取消PAD旋转监听
    if (typeof gli_stop_device_orientation == 'function') {
      gli_stop_device_orientation();
    }
  };
  /**
   * 退出阅读器. <br/>
   * 
   */
  PAD.prototype.exit = function (params) {
    var optsObj = this.opts;
    this._saveProgressFile();
    this._saveSettingFile(true);
    this._unbindAppEvents();
    this._saveBookState();
    optsObj.exitReaderCb();
  };
  /**
   * 打开阅读器. <br/>
   * 
   */
  PAD.prototype.open = function (params) {
    console.info('[readerPAD.js] --> open!');
  };
  return PAD;
}(js_src_global, js_libs_zeptodev, js_src_tool, js_src_api, js_src_pad_panelTemplPad, js_src_pad_panelMainPad, js_src_pad_panelSettingPad, js_src_pad_panelCbnPad, js_src_pad_panelComplaintPad, js_src_pad_panelSearchPad, js_src_countPage, js_src_widget_plugLoading, js_src_panelPrompt, js_src_copyright, js_src_panelViewImg, js_src_config, js_src_widget_plugDialog, js_src_message_zh, js_src_select, js_src_pad_panelCorrectPad, js_src_widget_delicateType);
js_src_readerNew = function ($, Mobile, Pc, Pad) {
  var target = null;
  /**
   * 版权保护, 权限设置. <br/>
   * 数据读写.
   * 
   */
  function Reader(options) {
    if (options.clientType == 'PC') {
      target = new Pc(options);
    } else if (options.clientType == 'MOBILE') {
      target = new Mobile(options);
    } else if (options.clientType == 'PAD') {
      target = new Pad(options);
    } else {
      console.error('[clientType]---> 参数传入有误\uFF01\uFF01');
    }
  }
  // open, enter;
  Reader.prototype.open = function () {
    console.log('Reader --> open!');
    target.open();
  };
  // close, exit;
  Reader.prototype.exit = function () {
    console.log('Reader --> exit!');
    target.exit();
  };
  Reader.prototype.prev = function () {
    target.prev();
  };
  Reader.prototype.next = function () {
    target.next();
  };
  Reader.prototype.getPagesAll = function () {
    return target.getPagesAll();
  };
  Reader.prototype.getDownloadInfo = function () {
    return target.getDownloadInfo();
  };
  Reader.prototype.getCatalogInfo = function () {
    return target.getCatalogInfo();
  };
  Reader.prototype.download = function () {
    target.download();
  };
  Reader.prototype.delLocalData = function () {
    target.delLocalData();
  };
  window.Reader = Reader;
  return Reader;
}(js_libs_zeptodev, js_src_readerMobile, js_src_readerPC, js_src_readerPad);
}());