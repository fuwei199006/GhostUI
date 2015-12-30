/* 
 * @Author: wells
 * @Date:   2015-12-25 16:03:40
 * @Last Modified by:   wells
 * @Last Modified time: 2015-12-30 09:39:49
 */

'use strict';
//#region searchtext

var showName = "searchText";
var _default = {
    showCnt: 10
};
var searchText = function(args) {
    this.self = args;
    this.$self = $(args);
    this.li = $("<li class='dropdown' style='list-style: none;'></li>"); //父级li
    this.ul = $("<ul class='dropdown-menu'></ul>");
    this.li.append(this.ul);
    this.$self.after(this.li);
}

searchText.prototype = {
    _initOpts: function(opt) {
        var opts = $.extend(true, _default, opt);
        this._initLogic(opts);
        this._textClick();
        this._textKeyUp(opts.data, opts);
    },
    _itemClick: function(item, opt) {
        var li = this.li;
        // var ul=this.ul;
        var self = this.$self;
        item.click(function() {
            li.removeClass("open");
            self.val(item.html());
            if (opt && opt.onItemsClick) {
                opt.onItemsClick(item);
            }
        });
        li.mouseleave(function(){
               li.removeClass("open");
           });
    },
    _initDom: function(data, opt) {
        var ul = this.ul;
        var self = this;
        var $text = this.$self;
        if (data.length > 0) {
            ul.empty();
            $.each(data, function(index, vl) {
                var list = ul.find("li");
                if (list.length < opt.showCnt && vl.text.indexOf($text.val()) !== -1) {
                    var _li = $("<li></li>");
                    var _a = $("<a href='javascript:void(0)'></a>");
                    _a.html(vl.text);
                    _a.attr({
                        "value": vl.value
                    });
                    self._itemClick(_a, opt);
                    _li.append(_a);
                    ul.append(_li);
                }
            });
        }




    },
    _initLogic: function(opt) {
        if (opt.url) {
            $.post(opt.url, {
                    count: opt.showCnt,
                    filer: ''
                },
                function(res) {
                    this._initDom(res, opt);
                })

        } else {
            if (opt.data) {
                this._initDom(opt.data, opt);


            }
        }
    },
    _textClick: function() {
        var li = this.li;
        this.$self.click(function() {
            // body...
            li.toggleClass("open");
        });
    },
    _textKeyUp: function(data, opt) {

        var li = this.li;
        var $searchtext = this;
        this.$self.keyup(function(event) {
            /* Act on the event */
            li.addClass("open");

            $searchtext._initDom(data, opt)
            console.log(cnt());
        });



    },
    destroy:function(){
        this.li.remove();
    }

}

$.fn[showName] = function(option) {
    return this.each(function init(index, value) {
        var searchtext = new searchText(this);
        searchtext._initOpts(option);

    });


};

var cnt = (function() {
    var c = 0;
    return function() {
        c++;
    }
})();
//#endregion
