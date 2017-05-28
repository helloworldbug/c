// 文件名称: file.js
// 创 建 人: nyh
// 创建日期: 2017/04/28
// 描    述: ME文件上传接口
// 版本号：V2.0

//var token_server_url = "http://192.168.6.196:3031/qn/getqntoken";//获取上传token的服务地址
var token_server_url = "http://push.test.agoodme.com/qn/getqntoken";//获取上传token的服务地址
var qiniu_server_url = "http://up.qiniu.com";//七牛上传文件服务地址
var base64_url = "http://up.qiniu.com/putb64/-1/key/";


//var domain = "http://ocavwbjcd.bkt.clouddn.com/";//二级域名,（默认服务端配置二级域名，如果服务端请求token有返回二级域名地址则用服务端的）
var domain = "http://json.agoodme.com/";//二级域名,（默认服务端配置二级域名，如果服务端请求token有返回二级域名地址则用服务端的）
//建议该三个参数，在服务端进行配置

var file_api = {};
/**
 * name,文件名称+后缀,如：666.jpg
 * file,文件对象
 * key,文件唯一编码，如果不给则服务端提供(上传json静态文件必须给作品id作为静态json文件的名字)
 * cb_ok,成功回调，返回 {hash: "FsfQBMZB5bxwtU5IO-EcvvgkTbs2", key: "fa1f1f2822b1e22e689d22577f7aea1e40.jpg", url: "http://ocavwbjcd.bkt.clouddn.com/fa1f1f2822b1e22e689d22577f7aea1e40.jpg"}
 * cb_err,错误回调，返回{"code":XXX,"error":"XXX"},错误信息格式：http://o9gnz92z5.bkt.clouddn.com/code/v6/api/kodo-api/up/upload.html#upload-response-status
 **/
file_api.upload = function (options, cb_ok, cb_err) {
    var name = options.name || "",
        file = options.file,
        key =options.key||"";

    if (!file) {
        cb_err({"error": "file文件对象为空!" });
        return;
    }
    if (!name) {
        cb_err({ "error": "文件name为空!" });
        return;
    }
    var filekey;

    if (key !== null && key !== undefined && key != "") {//如果
        var arr = name.split('.');
        filekey = key + "." + arr[arr.length - 1];
    }

    var token = "";
    var upload_file = function () {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', qiniu_server_url, true);
        var formData;
        formData = new FormData();
        if (key !== null && key !== undefined && key != "") {
            if (name) {
                //以自定义key文件名+文件后缀作为文件的最终名字，对外url
                //formData.append('key', key + name);
                var arr = name.split('.');
                formData.append('key', key + "."+arr[arr.length-1]);
            } else {
                formData.append('key', key);
            }
        }
        formData.append('token', token);
        formData.append('file', file);
        xhr.onreadystatechange = function (response) {
            if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
                var obj = JSON.parse(xhr.responseText);
                if (domain) {
                    obj.url = domain+obj.key;
                }
                cb_ok(obj);
            } else if (xhr.status != 200 && xhr.responseText) {
                cb_err({ "code": xhr.status, "error": xhr.responseText });
                return;
            }
        };
        xhr.send(formData);
    }
    // how to uploud base64 https://developer.qiniu.com/kodo/kb/1326/how-to-upload-photos-to-seven-niuyun-base64-code
    var upload_base64 = function (base64) {

        var v =file_api.base64_encode(filekey);
        console.log(v.replace(/\//g, '_').replace(/\+/g, '-'));
        var url = base64_url + v.replace(/\//g, '_').replace(/\+/g, '-');
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
                var obj = JSON.parse(xhr.responseText);
                if (domain) {
                    obj.url = domain + obj.key;
                }
                cb_ok(obj);
            } else if (xhr.status != 200 && xhr.responseText) {
                cb_err({ "code": xhr.status, "error": xhr.responseText });
                return;
            }
        }
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.setRequestHeader("Authorization", "UpToken " + token);
        xhr.send(base64);
    }

    try {
        var data = {};
        if (!key) {//如果不包含key，则请求key
            data.key = true;
            data.file_key = filekey;
        } else {
            data.key = false;
            data.file_key = filekey;
        }
        $.ajax({
            type: "POST",
            url: token_server_url,
            dataType:"json",
            data: data,
            success: function (d) {
                //d 格式为：{"token":"XXX","domain":"XXX","key":"XXX"}
                if (d.uptoken) {
                    token = d.uptoken;
                    if (d.domain) {
                        domain = d.domain;//如果服务器返回domain则用服务器配置的domain
                    }
                    if (!key && d.key) {//如果客户端不传key则采用服务器的key
                        key = d.key;
                    }

                    if (file && file.base64) {
                        upload_base64(file.base64);
                    } else if (file && file.type == "text/plain") {
                        upload_file();
                    }

                } else {
                    cb_err({ "error": "token参数为空!" });
                    return;
                }
            }, error: function (e) {
                cb_err(e.message);
                return;
            }
        });
    }catch(e){
        cb_err({ "error": 'file upload exception:' + e.message });
        return;
    }
};

/**
 * encode string by utf8
 * @param  {String} string to encode
 * @return {String} encoded string
 */
file_api.utf8_encode = function (argString) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // +   bugfixed by: Rafal Kukawski
    // +   improved by: kirilloid
    // +   bugfixed by: kirilloid
    // *     example 1: this.utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === 'undefined') {
        return '';
    }

    var string = (argString + ''); // .replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    var utftext = '',
        start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode(
                (c1 >> 6) | 192, (c1 & 63) | 128
            );
        } else if (c1 & 0xF800 ^ 0xD800 > 0) {
            enc = String.fromCharCode(
                (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        } else { // surrogate pairs
            if (c1 & 0xFC00 ^ 0xD800 > 0) {
                throw new RangeError('Unmatched trail surrogate at ' + n);
            }
            var c2 = string.charCodeAt(++n);
            if (c2 & 0xFC00 ^ 0xDC00 > 0) {
                throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
            }
            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
            enc = String.fromCharCode(
                (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
};

/**
 * encode data by base64
 * @param  {String} data to encode
 * @return {String} encoded data
 * https://github.com/qiniu/js-sdk/blob/d2600639a86894bdaba2bce3483d01e85d7dbed2/src/qiniu.js#L420
 */
file_api.base64_encode = function (data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara
    // +   improved by: Thunder.m
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: this.utf8_encode
    // *     example 1: this.base64_encode('Kevin van Zonneveld');
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['atob'] == 'function') {
    //    return atob(data);
    //}
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = '',
        tmp_arr = [];

    if (!data) {
        return data;
    }

    data = file_api.utf8_encode(data + '');

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
            break;
        case 2:
            enc = enc.slice(0, -1) + '=';
            break;
    }

    return enc;
};
module.exports=file_api;