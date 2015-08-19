//扩展方法
(function(){
    var UTIL = $U= {
        getURLParam: function(){
            var search = location.search,
                reg = /[^\&]+=[^\&]+/g;

            if(!search) return {};

            search = search.slice(1);

            var arr,arrs,result={};
            while(arr = reg.exec(search)){
                if(arrs = arr[0].match(/[^\=]+/g)){
                    result[arrs[0]] = decodeURIComponent(arrs[1]);
                }
            }

            return result;
        },
        redirect: function(url, json,isReplace){
            var factUrl = json ? this.addURLParam(url, json) : url;

            url ? (!!isReplace ? location.replace(factUrl) : (location.href = factUrl)) :
                location.reload();
        },
        addURLParam: function(url, param){
            var p = param || {},
                noP = url.indexOf('?') === -1,
                tpl = '&{0}={1}',
                params = '';
            for(var i in param){
                params += tpl.format(i,encodeURIComponent(param[i]));
            }

            noP && (params = params.replace('&','?'));

            return url+params;
        },
        filterJSON:function(obj,param,isNot){
            var result = {};
            if(!obj) return result;

            isNot = !!isNot;
            var params = param || [];
            if(!params.length) return result;
            params = ',' + params.join(',') + ',';


            for(var k in obj){
                if(params.indexOf(','+k+',')!=-1){
                    !isNot && (result[k] = obj[k]);
                }else{
                    isNot && (result[k] = obj[k]);
                }
            }

            return result;

        }
    };

    SN = {
        getURLIOS:function(param){
            var url = "com.suning.suningebuy://wapToEbuy";
            return param ? $U.addURLParam(url,param) : url;
        },
        getURLAndroid:function(param){
            var url = "suning://m.suning.com/index";
            return param ? $U.addURLParam(url,param) : url;
        },
        openClient:function(iphoneUrl,androidUrl,downIOS,downAndroid,isReplace){
            if(isIOS){
                window.location = iphoneUrl;
                setTimeout(function(){
                    window.location = downIOS;  //打不开去IOS下载页
                },2000);
            }else{
                window.location = androidUrl;

                //打不开去android 下载页
                var downFn = function(url){
                    isReplace ? location.replace(url) : (window.location = url);
                }
                window.onblur = function(){
                    isBlur = false;
                    downFn(downAndroid);
//                    window.location = downAndroid;
                };
                var isBlur = true;
                setTimeout(function(){
                    if(isBlur){
                        downFn(downAndroid);
//                        window.location = downAndroid;
                    }
                },2000);
            }
        },
        getWapURL:function(param,first){
            var downloadUrl = first ? first : param['downloadurl'] || param['url'];
            return downloadUrl || 'http://m.suning.com';
        }
    }


    Node.prototype.toggle = function(flag){
        this.style.display=!!flag ? 'block' : 'none';
        return this;
    }
    Node.prototype.show = function(){
        this.toggle(true);
    }
    Node.prototype.hide = function(){
        this.toggle();
    }
    String.prototype.format = function(){
        var jsonFlag = arguments.length == 1 && arguments[0] instanceof Object,
            args = jsonFlag ? arguments[0] : arguments,
            reg = jsonFlag ? /\{(\w+)\}/g : /\{(\d+)\}/g;

        return this.replace(reg,
            function(m, i){
                return args[i] || '';
            });
    };
})();
