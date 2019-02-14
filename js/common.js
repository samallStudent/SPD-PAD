(function(owner) {
	
	var OWNER_TITLE_NVIEW = {
		titleText: "标题栏", // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
		titleColor: "#fff", // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
		titleSize: "17px", // 字体大小,默认17px
		backgroundColor: "#f2a11c", // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
		progress: { // 标题栏控件的进度条样式
			color: "#f2a11c", // 进度条颜色,默认值为"#00FF00"  
			height: "2px" // 进度条高度,默认值为"2px"         
		},
		splitLine: { // 标题栏控件的底部分割线，类似borderBottom
			color: "#CCCCCC", // 分割线颜色,默认值为"#CCCCCC"  
			height: "1px" // 分割线高度,默认值为"2px"
		},
		autoBackButton: true,
	}
	
	//打开常规窗口
	owner.openwin = function (id, argu, titleNView) {
		var nview = Object.assign({}, OWNER_TITLE_NVIEW, titleNView)
		if(titleNView){
			if(titleNView.isScan){
				nview.buttons = [{
					"float": "right",
					"text": "扫一扫",
					"fontSize": "10px",
					"onclick": clicked
				}]
			}
			mui.openWindow({
				url: id + '.html',
				id: id,
				show: {
					aniShow: 'none'
				},
				styles: {
					titleNView: nview
				},
				createNew: false,
				waiting: {
					autoShow: true
				},
				extras: ( argu && typeof argu === 'object' ) ? argu : JSON.parse(argu)
			});
		}else{
			mui.openWindow({
				url: id + '.html',
				id: id,
				show: {
					aniShow: 'none'
				},
				createNew: false,
				waiting: {
					autoShow: true
				},
				extras: ( argu && typeof argu === 'object' ) ? argu : JSON.parse(argu)
			});
		}
		
	}
	
	function getParents(id) {
		try {
			var self = plus.webview.currentWebview();
			var obj = self.opener();
			var ret = [];
			while (obj) {
				if (obj.id == id) {
					return ret;
				} else {
					ret.push(obj.id);
					obj = obj.opener();
				}
			}
		} catch (e) { }
		return [];
	}


	//到某个窗口
	owner.gotowin = function (id, argu, titleNView) {
		var obj = plus.webview.getWebviewById(id)
		if (obj) {
			var arr = getParents(id);
			if (arr.length > 0) {
				owner.openwin(id, argu, titleNView);
				var self = plus.webview.currentWebview();
				setTimeout(function(){
					for (var i = 0; i < arr.length; i++) {
						plus.webview.getWebviewById(arr[i]).close(arr[i]);
					}
					self.close();
				},600);
			} else {
				owner.openwin(id, argu, titleNView);
			}
		} else {
			owner.openwin(id, argu, titleNView);
		}
	}


	//获取网络模式
	owner.getNetwork = function() {
		var networkTypes = {};
		networkTypes[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
		networkTypes[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
		networkTypes[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
		networkTypes[plus.networkinfo.CONNECTION_WIFI] = "wifi网络";
		networkTypes[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
		networkTypes[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
		networkTypes[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
		return networkTypes[plus.networkinfo.getCurrentType()];
	}

	//禁止输入非数字字符
	owner.banString = function(that) {
		var str = that.value;
		var str1 = str.substr(str.length - 1, str.length);
		if(isNaN(str1)) {
			that.value = str.slice(0, str.length - 1)
		}
	}

	//禁止输入字符
	owner.banother = function(that) {
		var str = that.value;
		var str1 = str.substr(str.length - 1, str.length)

		if(!/^([a-zA-Z0-9]{1,18})$/.test(str1)) {
			that.value = str.slice(0, str.length - 1)
		}
	}

	//禁止输入数字字符以及其他无用的字符
	owner.banNum = function(that) {
		var str = that.value;
		var str1 = str.substr(str.length - 1, str.length)

		if(!isNaN(str1) || !/^([a-zA-Z\u4e00-\u9fa5\ ]{1,10})$/.test(str1)) {
			that.value = str.slice(0, str.length - 1)
		}
	}

	//禁止输入数字字符以及其他无用的字符
	owner.cn = function(that) {
		var str = that.value;
		var str1 = str.substr(str.length - 1, str.length)
		if(!/^([a-z\u4e00-\u9fa5\ ]{1,10})$/.test(str1)) {
			that.value = str.slice(0, str.length - 1)
		}
	}

	// 压缩图片 
	owner.compressImage = function(path, fn, obj) {
		try {
			var img = new Image();
			img.src = path; // 传过来的图片路径在这里用。
			obj || (obj = {});
			var needWid = obj.width || 200;
			img.onload = function() {
				var that = this;
				//生成比例 
				var w = that.width,
					h = that.height,
					scale = w / h;
				w = needWid || w; //480  你想压缩到多大，改这里
				h = w / scale;

				//生成canvas
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');
				canvas.setAttribute("width", w)
				canvas.setAttribute("height", h)

				ctx.drawImage(that, 0, 0, w, h);
				console.log("进入压缩")
				var base64 = canvas.toDataURL('images/jpeg', 1 || 0.8); //1最清晰，越低越模糊。有一点不清楚这里明明设置的是jpeg。弹出 base64 开头的一段 data：image/png;却是png。哎开心就好，开心就好
				f1 = base64; // 把base64数据丢过去，上传要用。
				var bitMap = new plus.nativeObj.Bitmap('picObj');
				bitMap.loadBase64Data(f1, function() {
					bitMap.save(path, {},
						function(i) {
							console.log('保存图片成功：' + JSON.stringify(i));
							try {
								fn();
							} catch(e) {}
						},
						function(e) {
							console.log('保存图片失败：' + JSON.stringify(e));
						});
				});
				return base64;
			}
		} catch(ex) {}
	}
	//过滤表情
	owner.filteremoji = function(ori) {
		try {
			var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
			var ret = ori.replace(regStr, '');
			var hasEmoji = (ori.length > ret.length);
			ret = ret.replace(/(^\s*)|(\s*$)/g, "");
			try {
				if(hasEmoji) {
					mui.toast("不支持输入表情");
				}
			} catch(ex) {}
			return ret;
		} catch(e) {}
		return ori;
	}
	owner.debounce = function(fn, delay){
		console.log(fn)
		let timer = null;
	    return function() {
	    // 通过 ‘this’ 和 ‘arguments’ 获取函数的作用域和变量
		    let context = this;
		    let args = arguments;
		    clearTimeout(timer);
	    	timer = setTimeout(function() {
		      fn.apply(context, args);
		    }, delay);
		}
	}
})(window.common = {})