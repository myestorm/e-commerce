# 电商网站产品购买数量，jQuery插件：esInputInteger


### 基本使用方法

1.引入文件

    <link rel="stylesheet" href="input_integer.min.css">
    <script src="input_integer.min.js"></script>

2.html

    <input type="text" data-min="1" data-max="10" data-val="1" value="1">
    
    data-min="1"  //最小值
    data-max="10" //最大值
    data-val="1"  //输入错误时的默认值

3.使用方法

    $('input').esInputInteger({
        before: function(val){
            console.log(val);
            
            //如果要打断流程
            //return false;
        },
        change: function(val){ //数量变化时触发
            console.log(val);
        }
    });