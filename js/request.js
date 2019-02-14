/**
 * mui.ajaxRequest
 * 封装mui.ajax请求，调用方式与一致
 */
(function($, doc) {
//	var baseUrl = "http://192.168.31.200:8888/medicinal-web" // 测试地址//
//	var baseUrl = "http://192.168.31.223:8080/medicinal-web" // 测试地址/
//	var baseUrl = 'http://116.62.143.29:8088/medicinal-web'; // 线上地址2（快）
//	var baseUrl = 'http://10.146.8.221:9002/medicinal-web'; // 合肥测试环境

//	var baseUrl = 'http://10.146.159.113:8888/medicinal-web'; // 个人测试地址
	
	var baseUrl = 'http://10.146.9.50:8080/medicinal-web';// 合肥正式环境


    mui.extend({
        ajaxRequest: function(url , options){
            var defaults = commonDefaules(options);
            var options = mui.extend(defaults, options);
            options.beforeSend = defaults.onBeforeSend;
            options.success = defaults.onSuccess;
            options.error = defaults.onError;
            mui.ajax(baseUrl+url , options);
        }
    })

    function commonDefaules(options){
        //默认参数定义
        var defaults = {
            dataType: "json",
            type: "post",
            timeout: 15000,
            wait: true,
            xhrFields: {
                withCredentials: true // 携带 cookie
            },
            contentType: "application/x-www-form-urlencoded",
            waitMessage: "努力奔跑中，等等我...",
            onBeforeSend : function(xhr){
            	if(options.showWaiting){
            		plus.nativeUI.showWaiting('加载中......');
            	}
            	
                if(defaults.wait == true){
                    showLoading(defaults.waitMessage);
                }
                if(options.beforeSend){
                    options.beforeSend(xhr);
                }
            },
            onSuccess : function(data){
            	if(options.showWaiting){
            		plus.nativeUI.closeWaiting();
            	}
                if(defaults.wait == true){
                    hideLoading();
                }
                //也可用于后台验证失败时的提示信息
                if(data && data.result && (data.result === "input")){
                    plus.nativeUI.alert(data.message , function(){} , "提示：" , "取消");
                    return;
                }
                if(options.success){
                    options.success(data);
                }
            },
            onError : function(a , b , c){
            	mui.toast("网络异常,请稍候再试",{ type: 'div' });
            	if(options.showWaiting){
            		plus.nativeUI.closeWaiting();
            	}
                hideLoading();
               	mui.openWindow({
                    url: "login/index.html",
                    id: "login/index.html",
                    extras: {
                        mark: "index" //额外的参数，仅仅是个标识，实际开发中不用；
                    }
                });
                if(options.error){
                	
                    options.error(a , b , c);
                }
            }
        };
        return defaults;
    }

    function showLoading(msg){
        plus.nativeUI.showWaiting(msg , {
            /*round: "1px", //圆角*/
            style: "white",
            back:"none",//不响应返回按钮事件
            background: "#66CDAA",
            /*background:"rgba(110,120,50,1)",*/
            loading:{
                display:"inline" ,
                icon:"/images/waiting.png"
            }
        });
    }

    function hideLoading(){
        plus.nativeUI.closeWaiting();
    }
}(mui, document));