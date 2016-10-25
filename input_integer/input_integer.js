;(function($, window, document, undefined){
    'use strict';

    var inputInteger = function(input, change, before){
        var self = {};
        var imin = parseInt(input.data('min'));
        var imax = parseInt(input.data('max'));
        var ival = parseInt(input.data('val'));

        /**
        * @功能 计算数字
        * @param type 【-1 0 1】
        * @return number
        **/
        var countNumber = function(type){
            var val = parseInt(input.val());
            var res = true;

            if(before && $.isFunction(before)){
                res = before(val);
            }

            if(res === false){
                return false;
            }

            type = parseInt(type);

            if(!$.isNumeric(type)){
                type = 0;
            }

            if(!$.isNumeric(val)){
                if($.isNumeric(ival)){
                    val = ival;
                } else {
                    val = 0;
                }
            }

            val = val + type;

            if($.isNumeric(imin)){
                if(val < imin){
                    val = imin;
                }
            }

            if($.isNumeric(imax)){
                if(val > imax){
                    val = imax;
                }
            }

            input.val(val);

            if(change && $.isFunction(change)){
                change(val);
            }
        };

        /**
        * @功能 初始化
        **/
        var init = function(){
            var box = null;
            input.wrap('<div class="es-input-integer"></div>');
            box = input.closest('.es-input-integer');
            box.prepend('<a href="javascript:;" class="sub">-</a>');
            box.append('<a href="javascript:;" class="add">+</a>');
            box.on('click', '.sub', function(){
                countNumber(-1);
            });
            box.on('click', '.add', function(){
                countNumber(1);
            });
            box.on('input change', 'input', function(){
                countNumber(0);
            });
        };
        init();
    };

    $.fn.esInputInteger = function(options){
        var opt = {
            change: null,
            before: null
        };
        opt = $.extend(true, {}, opt, options || {});

        $.each(this, function(){
            inputInteger($(this), opt.change, opt.before);
        });
        return this;
    };

})(jQuery, window, document);
