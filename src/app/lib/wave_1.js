(function () {
    //加载动画的HTML片段
    var tpl = '<div class="loading-halo-container"></div>' +
        '<div class="loading-circle">' +
        '<div class="loading-percent loading-left"></div>' +
        '<div class="loading-percent loading-right loading-wth0"></div>' +
        '</div>' +
        ' <div class="loading-logo"></div>';


    var loading = null;

    var LoadingWave = function () {
        this.dom = LoadingWave.getDom();
        this.meCircle = this.dom.querySelector(".loading-circle");
        this.meLogo = this.dom.querySelector(".loading-logo");
        this.meRight = this.dom.querySelector(".loading-right");
        this.meLeft = this.dom.querySelector(".loading-left");
        this._timer = null;
    };
    //以下为模拟jquery的addClass,和removeClass
    var core_rnotwhite = /\S+/g;
    var rclass = /[\t\r\n]/g;
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    var core_trim = "X".trim;
    var addClass = function (elem, value) {
        var classes, cur, clazz, j,
            proceed = typeof value === "string" && value;

        if (proceed) {
            classes = (value || "").match(core_rnotwhite) || [];

            cur = elem.nodeType === 1 && (elem.className ?
                (" " + elem.className + " ").replace(rclass, " ") :
                " "
            );

            if (cur) {
                j = 0;
                while ((clazz = classes[j++])) {
                    if (cur.indexOf(" " + clazz + " ") < 0) {
                        cur += clazz + " ";
                    }
                }
                elem.className = trim(cur);

            }

        }

    };

    var trim = core_trim && !core_trim.call("\uFEFF\xA0") ?
        function (text) {
            return text == null ?
                "" :
                core_trim.call(text);
        } :

        function (text) {
            return text == null ?
                "" :
                (text + "").replace(rtrim, "");
        };

    var removeClass = function (elem, value) {
        var classes, cur, clazz, j,
            proceed = arguments.length === 0 || typeof value === "string" && value;

        if (proceed) {
            classes = (value || "").match(core_rnotwhite) || [];

            cur = elem.nodeType === 1 && (elem.className ?
                (" " + elem.className + " ").replace(rclass, " ") :
                ""
            );

            if (cur) {
                j = 0;
                while ((clazz = classes[j++])) {
                    while (cur.indexOf(" " + clazz + " ") >= 0) {
                        cur = cur.replace(" " + clazz + " ", " ");
                    }
                }
                elem.className = value ? trim(cur) : "";
            }
        }
    };

    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame || window.cancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame;

    var maskContainer = null;
    var clipContainer = null;
    /**
     *动画开始
     */
    LoadingWave.prototype.begin = function () {
        this._percent = 0;
        this._callback = null;
        var self = this;
        var max = Math.floor(Math.random() * 20) + 70;      //随机给一个90以内的整数作为最大值
        function update() {
            if (self._percent > max) {  //超过最大值的时候停止加载
                self._percent = max + 1;
                if (self._timer) {
                    cancelAnimationFrame(self._timer);
                    self._timer = null;
                }
            } else if (self._percent > 50) {     //超过50%的时候，替换样式
                addClass(self.meCircle, 'clip-auto');
                removeClass(self.meRight, 'loading-wth0');
            }
            self.playAnimation(self._percent);  //设置旋转动画
            self._percent++;
            self._timer = requestAnimationFrame(update);
        }
        update();
    };
    /**
     *动画结束
     *@param cb 回调函数
     */
    LoadingWave.prototype.end = function (cb) {
        this._callback = cb;
        var self = this;
        if (self._timer) {  //清除定时器，
            cancelAnimationFrame(self._timer);
            self._timer = null;
        }
        var percent = self._percent;
        function end() {
            if (percent < 100) {
                if (percent > 50) {
                    addClass(self.meCircle, 'clip-auto');
                    removeClass(self.meRight, 'loading-wth0');
                }
                self.playAnimation(percent);
                 percent += 5;
            self._timer = requestAnimationFrame(end);
            } else if (percent >= 100) {
                percent = 100;
                self.playAnimation(percent);
                if (self._timer) {
                    cancelAnimationFrame(self._timer);
                    self._timer = null;
                }
                //先隐藏中间的加载部分，不然会出现加载页面消失了，但是加载部分还在
                self.dom.style.display = "none";
                
                addClass(clipContainer, "slideOutFade_loading");
                setTimeout(function () {
                    if (self._callback) {
                        self._callback();
                        self._callback = null;
                    }
                }, 500);
            }
           
        }
        end();
    };
    /**
     *设置加载logo
     *@param logo 加载Logo图片
     */
    LoadingWave.prototype.setLogo = function (logo) {
        this.meLogo.style["background"] = "url('" + logo + "') no-repeat center #161619";
    };
    var maskContainer = null;
    var clipContainer = null;

    LoadingWave.prototype.playAnimation = function (n) {
        this.meLeft.style["-webkit-transform"] = "rotate(" + (18 / 5) * n + "deg)";
        this.meLeft.style["transform"] = "rotate(" + (18 / 5) * n + "deg)";
    };

    LoadingWave.paused = true;
    /**
     *开始加载动画
     *@param logo 
     */
    LoadingWave.start = function (logo,parentID) {
        if (!LoadingWave.paused) {
            return loading;
        }
        //TODO
        if (maskContainer && maskContainer.parentNode) {
           
            maskContainer.parentNode.removeChild(maskContainer);
            removeClass(clipContainer, "slideOutFade_loading");
        }
       LoadingWave.paused = false;
        if (!loading) {
            loading = new LoadingWave();
            maskContainer = document.createElement("div");
            clipContainer = document.createElement("div");
            clipContainer.className = "container-clip-mask";
            maskContainer.className = "loading-wave-mask";
            maskContainer.appendChild(clipContainer);
            maskContainer.appendChild(loading.dom);
        }
        if(clipContainer){
     removeClass(clipContainer, "slideOutFade_loading");
}
 
        if (!maskContainer.parentNode) {
            if(parentID){
               document.getElementById(parentID).appendChild(maskContainer)
            }else{
                document.body.appendChild(maskContainer);
            }
            // document.body.appendChild(maskContainer);
        }
        clipContainer.style.height = "100%";
        clipContainer.style.top = "0px";

        if (logo) {
            loading.setLogo(logo);
        }
        loading.begin();
        return loading;
    };
    //结束动画
    LoadingWave.end = function (cb) {
        if (LoadingWave.paused) {
            return;
        }

        LoadingWave.paused = true;
        if (loading) {
            loading.end(function () {
                if (maskContainer.parentNode) {
                    maskContainer.parentNode.removeChild(maskContainer);
                }
                removeClass(clipContainer, "slideOutFade_loading");
                maskContainer = null;
                loading=null;
                if (cb) {
                    cb();
                }
            });
        }
    };
    //获取动画模版
    LoadingWave.getDom = function () {
        var dom = document.createElement("div");
        dom.className = "loading-wrap";
        dom.innerHTML = tpl;
        return dom;
    };
    //设置CSS
    var cssArr = [];
    //光环背景图片
    var halo_img = "data:image/png;base64,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lltu3dqqmAghhMXFxbNvueXWrQ/PxeoOXWpUlyS3zSRsIPmxANeVBDxUKLxsd3Rta227w1p1QlpMdGq/efOFm+6+e8c7BoPB+kj7run3+/eedNKGX4k4uCl9GM9S9aCEH8RtD56jkLMT5ctDhcILiOq01EHLXGq95amLiW3btj/qlFNOu+pLX/ryjRQTRzIYDNZ/6UtfvuGUU067atu27Y/q0EX9mibYlLJRwo/FPEUq0XKFovXzEyjViVp+Sif+4gvPy1/+ipO2bt32vqWlpadE2m6S+fn5L55xxqaX/cEf/P7dHZpLViosVQ9q+aldfeA5Chk7Ub60BIXlA5mae60tHsZsQkycddY5F3z961+/bjgcHh1pu2l6vd5Dj3/84y++7bZbb+rQnKICy0YpX6X95bTX6idtq5Mf61se6KWumge3amOlNAotJnbu3Nk/9dTT3rRz5873UUzEMxwOj965c+f7Tj31tDfv3LmzP6O55PZHra2PElh5dmPwkmvR45vKckFheiAkCpRrXWtLRYup8W3ZctOa889/7n978MHdr57Vlkyl9+CDu191/vnP/e9btty0ZlbbKhGl4+WZQImDyPOv13r5lkdL5ydy+rZwfsKKjVrbIcXbXnPN27/vAx/44Ida+ZGqWszPz3/uJS958YsuvfT1/zSjqeaXAdLbGt62PSyeo2jyS49WBQXPT+j+uxUfIm3f/Oa3fP+f/umf/cVgMDgpwibpSL/fv/uFL/zZn37zm9/0jzOaaokKBNFRwwfPUdTtJ2Wnsy8KCrl+qNWJLu0sLPao1Ymp7V73ul858eabP75lMBg8IcI3iaTf79933nnP2vyOd/z2/TOaar3VIizmCDF0bddSlcKsoLB+KJPEY2UPVhrJg5hjufzyNx5/880f/wuKCXkGg8ETbr754zdcfvkbjy9ksvr9YgDmEnIYGoJCuzphEaQT5F6qE10pspBce+1vPeaGG278s8Fg8KQCMZEODAaDJ95ww41/fu21v/WYKc20hALCM4AiCJDyGwJm10hWKEiLSDxoE21+5CMfPer97//DD/HMRH0Gg8GG97//Dz/0kY989KgpzareD4R4ReMMBYL6SumrcoAPsI31f+/apki7nTt39s8//7nvX1xcPK+jLSLAwsLCzR/96P966QknnDCY0kxjn177HAPCWY3abaTb5vQp0VfC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";
    //圆环图片
    var ring_img = "data:image/png;base64,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";
    //默认LOGO
    var img_logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAuCAYAAACMAoEVAAAB4UlEQVRoge2WsYoUQRCG/6qu6VlPvGP1dDFZcFB8CEP1FQzkDMyE83HM5AITH0JjczNBOPEuM9ED5dzp6e4yODdRYXrgwKulv3R+ivmqaoohZoc1RHyfmZ4R8T0iLABiXHg0q+KLan6Xs77suttv1k+I2YGIvHPuQET2nBM450BE//ONJ6GqSCkhpYgY4+uU0tOuuxOEiCAiB963e03T4LesOTkRRc4JwzA8DqHPAJ6Q9+2Dtp299b6FcwzAjtTfKFLKCKFH368euq2ty6+axi9FHGyLAQCBmdab19H29rz33ntmA7ejkJwzQgiBmclb+r5KICIwk2drx6OEtdPm7OI/2Gg5mRKesr6qei51p9T5k2I51YydnavfSvMnJ1/nVPD3NlJXAFxJKaHve4TQT2owzefXtGn8aDDGiNXqJ6UUR7POCWazSyoy3ruxusvlLQZwF8D+6emP/RCGIsFhCNMml1LCMAwFaYJqPpe6h4cfMxF9EJHni8XN66rhUen0TBwUVUWMEUT8IueypgFG5IAzQe/9+ykHxowcABwff/4+JW9K7owNndxUqpxVqpxVqpxVqpxVqpxVqpxVqpxVqpxVqpxVqpxVqpxVqpxVqpxVZHf3RnH46OhTUU414yLU/QWVg7xKGuhYqgAAAABJRU5ErkJggg=="
    cssArr.push(
        ".loading-wave-mask{ " +

        "position: absolute; " +
        "top:0;left:0;z-index:9999;width:100%;height:100%" +
        "}"
    );

    cssArr.push(
        ".container-clip-mask{ " +
        "background:#161619;" +
        "position:absolute;width:100%;height:100%;" +
        "}"
    );
    cssArr.push(
        ".loading-halo-container { " +
        "position: absolute;" +
        "width: 532px;" +
        "height: 532px;" +
        "top: 50%;" +
        "left: 50%;" +
        "z-index: 1;" +
        "transform: translate(-50%,-50%);" +
        "-webkit-transform: translate(-50%,-50%);" +
        "background: url('" + halo_img + "') no-repeat center; " +
        "}"
    );
    cssArr.push(
        ".loading-wrap { " +
        "top: 50%;" +
        "left: 50%;" +
        "transform: translate(-50%,-50%);" +
        "-webkit-transform: translate(-50%,-50%);" +
        "background: url('" + ring_img + "') no-repeat center; " +
        "}"
    );
    cssArr.push(
        ".loading-wrap, .loading-circle, .loading-percent { " +
        "position: absolute;" +
        "width: 145px;" +
        "height: 145px;" +
        "border-radius: 50%;" +
        "}"
    );

    cssArr.push(
        ".loading-circle{ " +
        "box-sizing: border-box;" +
        "clip: rect(0,145px,145px,72.5px);" +
        "border: 8px solid transparent;" +
        "}"
    );

    cssArr.push(
        ".clip-auto{ " +
        "clip: rect(auto,auto,auto,auto);" +
        "}"
    );
    cssArr.push(
        ".loading-percent{ " +
        "box-sizing: border-box;" +
        "top: -8px;" +
        "left: -8px;" +
        "}"
    );

    cssArr.push(
        ".loading-left{ " +
        "transition: transform ease;" +
        "clip: rect(0,72.5px,145px,0);" +
        "border: 8px solid #ffcc00;" +
        "}"
    );

    cssArr.push(
        ".loading-right{ " +
        "clip: rect(0,145px,145px,72.5px);" +
        "border: 8px solid #ffcc00;" +
        "}"
    );

    cssArr.push(
        ".loading-wth0{ " +
        "width: 0;" +
        "}"
    );

    cssArr.push(
        ".loading-logo{ " +
        "position: absolute;" +
        "box-sizing: border-box;" +
        "width: 129px;" +
        "height: 129px;" +
        "line-height: 129px;" +
        "text-align: center;" +
        "font-size: 40px;" +
        "left: 8px;" +
        "top: 8px;" +
        "border-radius: 50%;" +
        "background: url('" + img_logo + "') no-repeat center; " +
        "z-index: 1;" +
        "}"
    );


    cssArr.push(
        ".slideOutFade_loading { " +
        "-webkit-animation-name: slideOutFade_loading; " +
        "animation-name: slideOutFade_loading; " +
        "-webkit-animation-duration: 0.5s; " +
        "animation-duration: 0.5s; " +
        "-webkit-animation-fill-mode: both; " +
        "animation-fill-mode: both; } " +
        "@-webkit-keyframes slideOutFade_loading { " +
        "0% { " +
        "opacity: 0.7; } " +
        "100% { " +
        "opacity: 0; } }"
    );

    cssArr.push(
        ".me-wave-fade-in { " +
        "-webkit-animation-name: me-wave-fade-in; " +
        "animation-name: me-wave-fade-in; " +
        "-webkit-animation-duration: 0.3s; " +
        "animation-duration: 0.3s; " +
        "-webkit-animation-fill-mode: forwards; " +
        "animation-fill-mode: forwards; } " +
        "@-webkit-keyframes me-wave-fade-in { " +
        "0% { " +
        "opacity: 0; } " +
        "100% { " +
        "opacity: 1; } }"
    );

    cssArr.push(
        ".me-wave-fade-out { " +
        "-webkit-animation-name: me-wave-fade-out; " +
        "animation-name: me-wave-fade-out; " +
        "-webkit-animation-duration: 0.3s; " +
        "animation-duration: 0.3s; " +
        "-webkit-animation-fill-mode: forwards; " +
        "animation-fill-mode: forwards; } " +
        "@-webkit-keyframes me-wave-fade-out { " +
        "0% { " +
        "opacity: 1; } " +
        "100% { " +
        "opacity: 0; } }"
    );

    if (!document.getElementById("style-loading-wave-animation")) {
        var styleNode = document.createElement("style");
        styleNode.type = "text/css";
        styleNode.id = "style-loading-wave-animation";
        styleNode.innerHTML = cssArr.join("");
        document.head.appendChild(styleNode);
    }

   if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports=LoadingWave;
    }else{
 window.LoadingWave = LoadingWave;
    }
})();