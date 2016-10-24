# 电商网站产品购买区域，属性选择jQuery插件：esProductAttribute


### 基本使用方法

1.引入文件

    <link rel="stylesheet" href="../product_attribute.min.css">
    <script src="../product_attribute.min.js"></script>

2.使用方法

    var $DATA = {}; //具体数据格式，请查看demo
    $('.es-product-attribute').esProductAttribute({
        data: $DATA, //数据
        change: function(li, liData, data){ //选择属性时触发
            console.log(li, liData, data);
        }
    });

3.需要注意的几个问题：

    a) 当数据中的groups为空时，parms，products中的gid应不存在；
    b) 当数据中的groups为空时，parms中的pid应该唯一；
    c) 当parms为空时，products的长度必须是1。
    
    
### 直接使用

    var attr = new $.es.ProductAttribute({
        box: $('.es-product-attribute'),
        data: $DATA,
        change: function(li, liData, data){
            console.log(li, liData, data);
        }
    });
    attr.init();
    
    /**
    * @功能 通过维度找产品
    * @parms array: [[gid,pid,id]， [gid,pid,id]， [gid,pid,id]]
    * @return object 【如果没有找到，返回null】
    **/
    attr.findProducts([[gid,pid,id]， [gid,pid,id]， [gid,pid,id]]);
    
    /**
    * @功能 查找包含指定维度的产品
    * @parms array: [[gid,pid,id]， [gid,pid,id]， [gid,pid,id]]
    * @return array 【如果没有找到，返回[]】
    **/
    attr.filterProducts([[gid,pid,id]， [gid,pid,id]， [gid,pid,id]]);
    
    /**
    * @功能 获取当前选中的产品
    * @return object 【如果没有找到或者属性没有选全，返回null】
    **/
    attr.getProductInfo();