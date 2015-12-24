

(function ($, undefine) {
    /*global jQuery, console*/

    'use strict';
    //===========================#region 多选插件
    $.fn.mSelect = function (option) {
        var _default = {};

        var opt = $.extend(true, _default, option);

        this.each(function (index, value) {

            var dom = this;
            $(dom).empty();
            if (dom) {
                $.each(opt.data, function (idx, vlu) {
                    var strg = $("<strong></strong>").addClass("text-muted").html(vlu.Name + ":");
                    var fcDiv = $("<div></div>").append(strg).appendTo(dom);
                    $.each(vlu.Item, function (ix, vl) {
                        CommonCreatItem(vlu, fcDiv, vl, true, dom); //传入当前的字段和当前的父容器，还有当前的数值
                    });
                    if (vlu.hasMore) {
                        var hSpan = $("<small></small>").addClass("w-badge filter").html("更多>>"); //.append($("<span></span>").addClass("caret"));
                        fcDiv.append(hSpan);
                        fcDiv.append("<br/>"); //强制换行
                        hSpan.click(function () {
                            if (hSpan.next().next().is(":hidden")) {
                                $(hSpan).nextAll().show(100);
                                $(hSpan).html("收起").append($("<span></span>").addClass("caret"));
                            } else {
                                $(hSpan).nextAll().removeClass("w-badge-info");
                                $(hSpan).nextAll().hide(100);
                                $(hSpan).html("更多>>");
                            }

                        });
                        $.each(vlu.hasMore, function (ix, vl) {
                            CommonCreatItem(vlu, fcDiv, vl, false, dom); //传入当前的字段和当前的父容器，还有当前的数值
                        });
                    }
                });
            }
        });

        function CommonCreatItem(vlu, fcDiv, vl, isShow, dom) {
            var dom = dom;
            //vl代表单个的数据 
            //var fSpan = $("<span></span>").addClass("text-muted filter");
            var fSpan = $("<span></span>").addClass("w-badge filter w-badge-custom").attr({
                "pField": vlu.Field
            }); //添加默认的样式
            if (!isShow) {
                fSpan.attr({
                    type: "hasMore"
                }).hide();
            }
            if (opt.optionFunc) {
                //text的作为显示，value作为字段
                var ob = opt.optionFunc(vl, vlu);
                fSpan.html(ob.text);
                fSpan.attr({
                    "field": ob.value
                });
            } else {
                //text的作为显示，value作为字段
                fSpan.attr({
                    "field": vl.value
                });
                fSpan.html(vl.text);
            }
            /**
             * 绑定span事件
             */
            fSpan.click(function () {
                //对样式的修改 w-badge-info代表选中的唯一条件
                if (vlu.isMulti) { //是否允许多选？
                    if (fSpan.hasClass("w-badge-info")) {
                        fSpan.removeClass("w-badge-info");
                    } else {
                        fSpan.addClass("w-badge-info");
                    }
                } else {
                    if (fSpan.hasClass("w-badge-info")) {
                        fSpan.removeClass("w-badge-info");
                    } else {
                        fSpan.addClass("w-badge-info").siblings().removeClass("w-badge-info")
                    }

                }
                if (opt.onClick) {
                    var datajson = GetJson($(dom).find(".w-badge-info"));
                    var domList = $(dom).find(".w-badge-info")
                    opt.onClick(fSpan, datajson, domList);
                }
            });
            fSpan.hover(function () {
                if (opt.onHover) {
                    opt.onHover(fSpan)
                };
            });

            fcDiv.append(fSpan);
        }
    }

    function GetJson(cSpans) {
        var djson = {};
        $.each(cSpans, function (ix, vl) {
            var key = $(vl).attr("pfield");
            if (hasKey.call(djson, key) != -1) {
                djson[key].push($(vl).attr("field"));
            } else {
                djson[key] = [];
                djson[key].push($(vl).attr("field"));
            }

        });
        return djson;
    }
    //=================================#endregion

   

function hasKey(k) {
    for (var key in this) {
        if (key === k) return 0;
    }
    return -1;
}

})(jQuery);
//#endregion

