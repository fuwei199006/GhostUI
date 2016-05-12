(function($, undefine) {
	if (!$) {
		logError("没有引用jQuery");
		return false;
	}
	var pluginName = "Tabview";
	var Tab = function(element, options) {
		this.$element = $(element);
		this.element = element;

		this._init(options);
	}
	Tab.defalut = {

		OnLeftScroll: undefine,
		OnRigthScroll: undefine,
		OnTabClick: undefine,
		OnItemClick:undefine
	};
	Tab.prototype = {
		_init: function(options) {
			if (options.data) {
				if (typeof options.data === 'string') { //if the type of  data of arguments  convert it to json
					options.data = $.parseJSON(options.data);
				}
				this.items = $.extend(true, [], options.data); //convert to array of json  all of them will the first level
				delete options.data; //delete the property
			}

			this.options = $.extend({}, Tab.default, options)
			this._bindEvent();
			this._render();
		},
		_bindEvent: function() {
			var $tab=this;
			this.$element.on("swipeleft", function() {
				var firstdiv = $(this).find("div:eq(0)")
				if(firstdiv.hasClass("active")){
					$(this).find("div:eq(1)").addClass("active").siblings().removeClass("active");
				}
				firstdiv.hide(1000, () => {
					firstdiv.remove();
					firstdiv.show();
					$(this).append(firstdiv);
				});
				if ($tab.options.OnLeftScroll) {
					$tab.options.OnLeftScroll(firstdiv);
				}
			}).on("swiperight", function() {
				var lastdiv = $(this).find("div:last-of-type")
				if(lastdiv.hasClass("active")){
					$(this).find("div:eq(1)").click();
				}
				lastdiv.hide();
				lastdiv.remove();
				$(this).prepend(lastdiv);
				lastdiv.show(1000);
				if ($tab.options.onRightScroll) {
					$tab.options.onRightScroll(lastdiv);
				}
			});
		},
		_render: function() {
			var $tab=this;
			this.$element.css("width", this.items.length * 25 + "%")
			$.each(this.items, (x, y) => {
				
				var $div = $("<div></div>").css("width", "21.5%").click(function(){
					if($tab.options.OnItemClick){
						$tab.options.OnItemClick($(this));
					}
					$(this).addClass("active").siblings().removeClass("active");
				});
				if(x===0)$div.addClass("active");
				this.$element.append($div.text(y.text).attr({
					"data-value": y.value
				}));
			});
		},
		_isInNav:function(item){
			var index=this.$element.indexOf(item);
 			var left=item.position().left;
 			var width=item.width();
 			var cWidth=document.clientWidth;
 			if(left+width>cWidth){
 				alert("ok")

 			}
			
		}

	}
	$.fn[pluginName] = function(options, args) {

		return this.each(() => {

			var self = $.data(this, 'plugin_' + pluginName); //取数据
			if (typeof options === 'string') { //如果参数的类型是字符类型 说明调用的是函数
				if (!self) {
					logError('没有初始化组件 : ' + options); //如果self没有值 没有初始化
				} else if (!$.isFunction(self[options]) || options.charAt(0) === '_') { //如果缓存的值 option 不是一个函数
					logError('没有这个方法 : ' + options);
				} else {
					if (typeof args === 'string') { //如果参数类型是字符类型，把参数转成数组
						args = [args];
					}
					self[options].apply(self, args); //把函数和参数传
				}
			} else {
				if (!self) { // if not string and value is undefine Cach the new instance of the Tree which merge by option 
					$.data(this, 'plugin_' + pluginName, new Tab(this, $.extend(true, {}, options)));
				} else {
					self._init(options); //if has value init it 
				}
			}
		});

	}
	var logError = function(message) {
		if (window.console) {
			window.console.error(message);
		}
	};
})(jQuery);