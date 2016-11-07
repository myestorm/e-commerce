# 专题特效插件：esSnow


### 基本使用方法

1.引入文件

    <link rel="stylesheet" href="snow.min.css"><!--非必需-->
    <script src="snow.min.js"></script>

2.使用方法

	$.fn.esSnow();
    
	//自定义下的内容
    var items = [];
	for(var i=0; i<20; i++){
		items[i] = '<div class="snow-item snow-item-'+ (i+1) +'"></div>';
	}
	
	$.fn.esSnow({
		type: 'icon',
		items: items
	});
	
3.参数说明

	type: 'chars', //飘落的对象类型 chars/icon 默认：chars
	items: '&#10052', //飘落的对象 默认是 &#10052; 当type为image ['<div class="snow-item snow-item-1"></div>', '<div class="snow-item snow-item-2"></div>', '<div class="snow-item snow-item-3"></div>']
	color: '#ffffff', //type为chars生效
	frequency: [160, 200], //雪花出现的频率范围 单位 ms
	duration: [2000, 4000], //每个雪花动画时长范围 单位 ms
	sizeRange: [15, 40], //雪花大小范围 单位 px
	leftRange: [0, parseInt(($(document).width()) * 0.9)], //left的范围 单位 px
	stopRange: [300, 600] //雪花消失的范围 单位 px