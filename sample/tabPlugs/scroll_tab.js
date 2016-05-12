/* 
* @Author: fuwei
* @Date:   2016-05-12 20:46:22
* @Last Modified by:   anchen
* @Last Modified time: 2016-05-12 21:06:33
*/
(function($, undefine) {
    if (!$) {
        logError("没有引用jQuery");
        return false;
    }
    var pluginName = "Tabview";
    var Tab = function(element, options) {
        $(element).html();
        this.$element = $(element);
        this.element = element;
        this._init(options);
    }
    Tab.defalut = {
        OnLeftScroll: undefine,
        OnRigthScroll: undefine,
        OnTabClick: undefine,
        OnItemClick: undefine,
        OnChange: undefine
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
            this.options = $.extend({}, Tab.
                default, options)
            this._offEvent();
            this._bindEvent();
            this._render();
        },
        _bindEvent: function() {
            var $tab = this;
            if (!$tab.options.scroll) return false;
            var isTouchMove, startTx, startTy;
            $tab.$element.on('touchstart', function(e) {
                var touches = e.originalEvent.targetTouches[0];
                startTx = touches.clientX;
                startTy = touches.clientY;
                isTouchMove = false;
            });
            $tab.$element.on('touchmove', function(e) {
                isTouchMove = true;
                e.preventDefault();
            });
            $tab.$element.on('touchend', function(e) {
                if (!isTouchMove) {
                    return;
                }
                var touches = e.originalEvent.changedTouches[0],
                    endTx = touches.clientX,
                    endTy = touches.clientY,
                    distanceX = startTx - endTx,
                    distanceY = startTy - endTy,
                    isSwipe = false;
                if (Math.abs(distanceX) >= Math.abs(distanceY)) {
                    if (distanceX > 20) {
                        var firstdivs = $(this).find("div:visible");
                        if (firstdivs.length === 1) return false;
                        var firstdiv = $(firstdivs[0]);
                        if (firstdiv.hasClass("active")) {
                            firstdiv.next().addClass("active").siblings().removeClass("active");
                            if ($tab.options.OnChange) {
                                $tab.options.OnChange(firstdiv);
                            }
                        }
                        firstdiv.hide(100, function() {
                            firstdiv.on("click", function() {
                                if ($tab.options.OnItemClick) {
                                    $tab.options.OnItemClick($(this));
                                }
                                $(this).addClass("active").siblings().removeClass("active");
                            });
                        });
                        if ($tab.options.OnLeftScroll) {
                            $tab.options.OnLeftScroll(firstdiv);
                        }
                        isSwipe = true;
                    } else if (distanceX < -20) {
                        var lastdiv = $(this).find("div:hidden:last");
                        var activeDiv = $(this).find(".active");
                        lastdiv.show(100, function() {
                            if ($tab.options.onRightScroll) {
                                $tab.options.onRightScroll(lastdiv);
                            }
                            if (!$tab._isInNav(activeDiv)) {
                                activeDiv.prev().addClass("active").siblings().removeClass("active");
                                if ($tab.options.OnChange) {
                                    $tab.options.OnChange(activeDiv);
                                }
                            }
                        });
                        lastdiv.on("click", function() {
                            if ($tab.options.OnItemClick) {
                                $tab.options.OnItemClick($(this));
                            }
                            $(this).addClass("active").siblings().removeClass("active");
                        });
                        isSwipe = true;
                    }
                }
            });
        },
        _render: function() {
            var $tab = this;
            this.$element.html('');
            this.$element.css("width", $tab.options.tWidth || this.items.length * 25 + "%").addClass("navdiv")
            $.each(this.items, function(x, y) {
                var $div = $("<div></div>").css("width", $tab.options.itemWidth || "21.5%").on("click", function() {
                    if ($tab.options.OnItemClick) {
                        $tab.options.OnItemClick($(this));
                    }
                    $(this).addClass("active").siblings().removeClass("active");
                });
                if (x === 0) $div.addClass("active");
                $tab.$element.append($div.html(y.text).attr({
                    "data-value": y.value
                }));
            });
        },
        _isInNav: function(item) {
            //var index = this.$element.indexOf(item);
            var clientWd = $(document).width();
            var itemWd = item.width();
            var xDis = item.position().left;
            if (itemWd + xDis > clientWd) {
                return false;
            }
            return true;
        },
        _offEvent: function() {
            this.$element.off();
        }
    }
    $.fn[pluginName] = function(options, args, index) {
        return this.each(function() {
            var self = $.data(this, 'plugin_' + index + pluginName); //取数据
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