;(function($, window, document, undefined){
    'use strict';

    $.fn.esSnow = function(options){
        var opt = {
            type: 'chars', //飘落的对象类型 chars/icon 默认：chars
            items: '&#10052', //飘落的对象 默认是 &#10052; 当type为image ['<div class="snow-item snow-item-1"></div>', '<div class="snow-item snow-item-2"></div>', '<div class="snow-item snow-item-3"></div>']
            color: '#ffffff', //type为chars生效
            frequency: [160, 200], //雪花出现的频率范围 单位 ms
            duration: [2000, 4000], //每个雪花动画时长范围 单位 ms
            sizeRange: [15, 40], //雪花大小范围 单位 px
            leftRange: [0, parseInt(($(document).width()) * 0.9)], //left的范围 单位 px
            stopRange: [300, 600] //雪花消失的范围 单位 px
        };
        opt = $.extend(true, {}, opt, options || {});

        /**
        @功能：返回一个指定范围的随机整数
        @params：from {int} 【范围开始】, to {int} 【范围结束】
        @return {number} //介于开始和结束范围的一个数字，包含开始和结束
        **/
        var randomRange = function(from, to){
            var choices = to - from + 1;
            return Math.floor(Math.random() * choices + from);
        };

        var snowTimer = null;
        var itemsImages = [];

        /*
        @功能：单个雪花运动的初始样式
        @return {object}
        */
        var startStyle = function(){
            return {
                left: randomRange(opt.leftRange[0], opt.leftRange[1]),
                top: -30,
                opacity: randomRange(60, 100) / 100
            };
        };

        /*
        @功能：单个雪花运动的结束样式
        @return {object}
        */
        var endStyle = function(){
            return {
                top: randomRange(opt.stopRange[0], opt.stopRange[1]),
                opacity: 0
            };
        };

        /*
        @功能：单个雪花
        */
        var keyframe = function(){
            var item = null;
            var index = randomRange(0, itemsImages.length-1);
            var start = startStyle();
            var end = endStyle();
            var timer = randomRange(opt.duration[0], opt.duration[1]);
            item = itemsImages[index].clone();
            item.css(start).appendTo('body').animate(end, timer, function(){
                item.remove();
            });
        };

        /*
        @功能：开始下雪
        */
        var player = function(){
            var t = randomRange(opt.frequency[0], opt.frequency[0]);
            snowTimer = setTimeout(function(){
                keyframe();
                player();
            }, t);
        };


        /*
        组织初始的运动对象，所有的运动对象都从里面拿
        */
        if(opt.type === 'icon' && $.isArray(opt.items) && opt.items.length > 1){
            $.each(opt.items, function(k){
                itemsImages.push($(opt.items[k]));
            });
        } else {
            for(var i=0; i < (opt.sizeRange[1] - opt.sizeRange[0]); i++){
                itemsImages.push($('<div class="snow-item" style="font-size:'+ (opt.sizeRange[0] + i) +'px; color:'+ opt.color +';">'+ opt.items +'</div>'));
            }
        }

        player();

        return snowTimer;
    };

})(jQuery, window, document);

//# sourceMappingURL=../../sourcemaps/static/scripts/snow.js.map
