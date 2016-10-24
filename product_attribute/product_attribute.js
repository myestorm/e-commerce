;(function($, window, document, undefined){
    'use strict';

    var EsProductAttribute = function(options){
        var opt = {
            box: null,
            data: {},
            change: function(){} //arguments[0] jquery object: 当前操作的对象，arguments[1] array : 当前的对象的维度信息，arguments[2] object: checked 所有的选中的维度，selected 如果能确定一个维度返回的一个产品的信息，否则返回符合条件的产品列表
        };
        var box = null;
        var self = this;

        opt = $.extend(true, {}, opt, options || {});
        box = opt.box;

        if(!box[0]){
            alert('参数不正确！');
            return false;
        }


        var ui = {};
        /**
        * @功能 维度模板
        * @parms d object
        * {
        *     gid: "分组id",
        *     pid: "属性id",
        *     id: "维度id",
        *     name: "维度名称"
        * }
        * @return html
        **/
        ui.attrItem = function(d){
            var gid = d.gid ? d.gid : '';
            return '<li class="item-event" data-gid="'+ gid +'" data-pid="'+ d.pid +'" data-id="'+ d.id +'" data-name="'+ d.name +'"><a href="javascript:;">'+ d.name +'<i></i></a></li>';
        };

        /**
        * @功能 维度列表模板
        * @parms d object
        * {
        *     pid: "300100",
        *     name: "颜色",
        *     gid: "200230",
        *     list: [{
        *         id: "1",
        *         name: "红色"
        *     }, {
        *         id: "2",
        *         name: "黑色"
        *     }, {
        *         id: "3",
        *         name: "蓝色"
        *     }]
        * }
        * @return html
        **/
        ui.attrItems = function(d){
            var html = '';
            var items = '';
            $.each(d.list, function(){
                var v = arguments[1];
                v.gid = d.gid;
                v.pid = d.pid;
                items += ui.attrItem(v);
            });
            html = '<label class="title">'+ d.name +'：</label>'+
                '<div class="attribute" data-name="'+ d.name +'" data-pid="'+ d.pid +'">'+
                '    <ul>'+ items +'</ul>'+
                '</div>';
            if(opt.isGroups === true){
                html = '<div class="item">'+ html +'</div>';
            } else {
                html = '<li>'+ html +'</li>';
            }
            return html;
        };

        /**
        * @功能 显示购买维度区域
        **/
        ui.render = function(){
            var html = '';
            if(opt.isGroups === true){

                var groupItem = function(d){
                    var html = '';
                    $.each(d, function(){
                        html += ui.attrItems(arguments[1]);
                    });
                    return html;
                };

                $.each(opt.groups_order, function(k){
                    var v = opt.groups_map[arguments[1]];
                    var items = opt.parms[v.gid] ? groupItem(opt.parms[v.gid], k) : '';
                    html += '<li>'+
                        '    <div class="group">'+
                        '        <div class="group-img">'+
                        '            <a href="'+ v.url +'"><img src="'+ v.img +'"></a>'+
                        '        </div>'+
                        '        <div class="group-info">'+
                        '            <div class="group-title">'+
                        '               <span>'+ (k+1) +'.</span> '+ v.name +
                        '            </div>'+
                        '            <div class="group-items">'+ items +'</div>'+
                        '        </div>'+
                        '    </div>'+
                        '</li>';
                });
            } else {
                $.each(opt.data.parms, function(){
                    html += ui.attrItems(arguments[1]);
                });
            }
            html = '<ul>'+ html +'</ul>';
            box.html(html);
        };

        /**
        * @功能 合并维度数据
        * @parms d array
        * [{
        *     gid: "200230",
        *     pid: "300100",
        *     id: "1",
        * }, {
        *     gid: "200230",
        *     pid: "300101",
        *     id: "1",
        * }, {
        *     gid: "200230",
        *     pid: "300102",
        *     id: "1",
        * }, {
        *     gid: "200231",
        *     pid: "300103",
        *     id: "1",
        * }]
        * @return gid|||pid|||id,gid|||pid|||id,gid|||pid|||id
        **/
        var mergeParms = function(d){
            var res = [];
            $.each(d, function(){
                var v = arguments[1];
                var g = v.gid ? v.gid +'|||' : '';
                res.push(g + v.pid +'|||'+ v.id);
            });
            return res.join(',');
        };

        /**
        * @功能 修改行选中数据
        * @parms gid:string pid:string, id:string, status:boolean-true:选中
        **/
        var modifyRowChecked = function(gid, pid, id, status){
            if(gid){
                opt.parms[gid][pid].checeked = status;
                if(status === true){
                    opt.parms[gid][pid].checekedId = id;
                } else {
                    opt.parms[gid][pid].checekedId = '';
                }
            } else {
                opt.parms[pid].checeked = status;
                if(status === true){
                    opt.parms[pid].checekedId = id;
                } else {
                    opt.parms[pid].checekedId = '';
                }
            }
        };

        /**
        * @功能 产品是否可售
        * @parms array: [[gid,pid,id]， [gid,pid,id]， [gid,pid,id]]
        * @return boolean
        **/
        var checkIsCanUse = function(arr){
            var sku = self.findProducts(arr);
            var res = true;
            if(sku === null){
                res = false;
            } else if(Number(sku.stock) < 1){
                res = false;
            }
            return res;
        };

        /**
        * @功能 组合数组
        * @parms array: [[1,2,3]， [a,b,c]， [I,II,III]]
        * @return array [1aI, 1aII, 1aIII, 1bI, 1bII, 1bIII, 1cI, 1cII, 1cIII, 2aI, 2aII, 2aIII, 2bI, 2bII, 2bIII, 2cI, 2cII, 2cIII, 3aI, 3aII, 3aIII, 3bI, 3bII, 3bIII, 3cI, 3cII, 3cIII]
        **/
        var doExchange = function(doubleArrays){
            var len = doubleArrays.length;
            if (len >= 2) {
                var len1 = doubleArrays[0].length;
                var len2 = doubleArrays[1].length;
                var newlen = len1 * len2;
                var temp = new Array(newlen);
                var index = 0;
                for (var i = 0; i < len1; i++) {
                    for (var j = 0; j < len2; j++) {
                        temp[index] = doubleArrays[0][i] +','+ doubleArrays[1][j];
                        index++;
                    }
                }
                var newArray = new Array(len - 1);
                for (var k = 2; k < len; k++) {
                    newArray[k - 1] = doubleArrays[k];
                }
                newArray[0] = temp;
                return doExchange(newArray);
            } else {
                return doubleArrays[0];
            }
        };

        /**
        * @功能 字符分拆数组
        * @parms string: 200230|||300100|||1,200230|||300101|||1,200230|||300102|||1,200231|||300103|||1
        * @return array [[200230,300100,1], [200230,300101,1], [200230,300102,1], [200231,300103,1]]
        **/
        var charToArr = function(char){
            var arr = char.split(',');
            var res = [];
            $.each(arr, function(){
                var v = arguments[1];
                res.push(v.split('|||'));
            });
            return res;
        };

        /**
        * @功能 获取对象属性
        * @parms jquery object
        * @return array
        **/
        var getItemInfo = function($d){
            var gid = $d.data('gid');
            var pid = $d.data('pid');
            var id = $d.data('id');
            return gid ? [gid, pid, id] : [pid, id];
        };

        /**
        * @功能 获取选中数据
        * @return array:[[gid, pid, id], [gid, pid, id]] 或者 [[pid, id], [pid, id]]
        **/
        var getChecked = function(){
            var items = box.find('li.item-event.checked');
            var res = [];
            $.each(items, function(){
                res.push(getItemInfo($(this)));
            });
            return res;
        };

        /** 属性是否可用
        * @parms arr:array【[gid,pid,id]】, checkedArr:array 【选中项：[[gid, pid, id], [gid, pid, id]] 或者 [[pid, id], [pid, id]]】
        * @return boolean 【true:可用 false:不可用，null: 参数不正确】
        **/
        var checkParmCanUse = function(arr, checkedArr){
            var res = null;
            checkedArr = checkedArr ? checkedArr : [];
            //var checkedArr = getChecked();
            if(arr && arr.length > 0){

                //检查是否初始的时候为不可用
                var disFirst = arr.length === 3 ? opt.parms[arr[0]][arr[1]].disabled : opt.parms[arr[0]].disabled;
                var checkId = arr.length === 3 ? arr[2] : arr[1];
                if($.inArray(checkId, disFirst) > -1){
                    res = false;
                } else {
                    var row = []; //未选中行，并删除arr 所在的行
                    var preExChange = [];

                    //修改状态
                    $.each(checkedArr, function(){
                        var v = arguments[1];
                        if(v.length === 3){ //分组
                            modifyRowChecked(v[0], v[1], v[2], true);
                        } else {
                            modifyRowChecked(null, v[0], v[1], true);
                        }
                        preExChange.push([arguments[1].join('|||')]);
                    });

                    preExChange.push([arr.join('|||')]);

                    //找到没有选中的行
                    var i = 0;
                    $.each(opt.parms, function(){
                        var v = arguments[1];
                        if(arr.length === 3){ //分组
                            $.each(v, function(){
                                var pv = arguments[1];
                                if(pv.checeked !== true){ //没选中
                                    row[i] = [];
                                    $.each(pv.list, function(){
                                        var sv = arguments[1];
                                        if(sv.gid.toString() === arr[0].toString() && sv.pid.toString() === arr[1].toString() && sv.id.toString() === arr[2].toString()){ //验证行
                                            row[i] = [];
                                            return false;
                                        } else {
                                            if(!row[i]){
                                                row[i] = [];
                                            }
                                            row[i].push(sv.gid +'|||'+ sv.pid+'|||'+sv.id);
                                        }
                                    });
                                    if(row[i] && row[i].length > 0){
                                        i++;
                                    }
                                }
                            });
                        } else {
                            if(v.checeked !== true){ //没选中
                                $.each(v.list, function(){
                                    var sv = arguments[1];
                                    if(sv.pid.toString() === arr[0].toString() && sv.id.toString() === arr[1].toString()){ //验证行
                                        row[i] = [];
                                        return false;
                                    } else {
                                        if(!row[i]){
                                            row[i] = [];
                                        }
                                        row[i].push(sv.pid +'|||'+ sv.id);
                                    }
                                });
                                if(row[i] && row[i].length > 0){
                                    i++;
                                }
                            }
                        }
                    });

                    $.each(row, function(){
                        var v = arguments[1];
                        if(v.length > 0){
                            preExChange.push(arguments[1]);
                        }
                    });

                    var ex = doExchange(preExChange); //当前界面所有的组合
                    var len = 0;
                    $.each(ex, function(){
                        var v = charToArr(arguments[1]);
                        var r = checkIsCanUse(v);
                        if(r === false){
                            len++;
                        }
                    });

                    if(len === ex.length){ //如果所有的组合都不可用，则表示该属性不能用
                        res = false;
                    } else {
                        res = true;
                    }
                }
            }
            return res;
        };
        //console.log(checkParmCanUse([200230,300100,3]));

        /**
        * @功能 获取dom
        * @parms array: [gid, pid, id] || [pid, id]
        * @return jquery object
        **/
        var getLiItem = function(d){
            var f = d.length === 3 ? '[data-gid="'+ d[0] +'"][data-pid="'+ d[1] +'"][data-id="'+ d[2] +'"]' : '[data-pid="'+ d[0] +'"][data-id="'+ d[1] +'"]';
            var li = box.find('li'+ f);
            return li;
        };

        /**
        * @功能 设置为不可用状态
        * @parms d:array 【[gid, pid, id] || [pid, id]】, disabled:boolean
        **/
        var setDisabled = function(d, disabled){
            var li = getLiItem(d);
            if(li.length === 1){
                if(disabled === true){
                    li.addClass('disabled');
                } else {
                    li.removeClass('disabled');
                }
            }
        };

        /**
        * @功能 设置为选中状态
        * @parms d:array 【[gid, pid, id] || [pid, id]】, checked:boolean
        **/
        var setChecked = function(d, checked){
            var li = getLiItem(d);
            if(li.length === 1){
                if(checked === true){
                    li.addClass('checked');
                } else {
                    li.removeClass('checked');
                }
            }
        };

        /**
        * @功能 点击操作处理
        * @parms arr:array 【[gid, pid, id] || [pid, id]】, isCheck:boolean, li:jquery object
        **/
        var getUnCheckedRow = function(arr, isCheck, li){
            var gid = '';
            var pid = '';
            var id = '';
            var checkArr = getChecked();
            var productInfo = self.getProductInfo(checkArr);

            /**
            * @功能 删除当前行的选中项从数组中删除
            * @parms gid:string, pid:string
            * @return array
            **/
            var removeSelf = function(gid, pid){
                var res = $.extend(true, [], [], checkArr);
                $.each(res, function(k, v){
                    if(gid){
                        if(v[0].toString() === gid.toString() && v[1].toString() === pid.toString()){
                            res.splice(k, 1);
                            return false;
                        }
                    } else {
                        if(v[0].toString() === pid.toString()){
                            res.splice(k, 1);
                            return false;
                        }
                    }
                });
                return res;
            };

            /**
            * 改变行的选中状态的值
            **/
            if(arr.length === 3){
                gid = arr[0].toString();
                pid = arr[1].toString();
                id = arr[2].toString();
                if(isCheck === true){
                    opt.parms[gid][pid].checeked = id;
                } else {
                    opt.parms[gid][pid].checeked = '';
                }
            } else {
                pid = arr[0].toString();
                id = arr[1].toString();
                if(isCheck === true){
                    opt.parms[pid].checeked = id;
                } else {
                    opt.parms[pid].checeked = '';
                }
            }

            /**
            * 改变每个维度组合后的状态
            **/
            $.each(opt.data.parms, function(){
                var val = arguments[1];
                $.each(val.list, function(){
                    var v = arguments[1];
                    var gid = v.gid ? v.gid : null;
                    var newArr = removeSelf(gid, v.pid);
                    var a = v.gid ? [v.gid, v.pid, v.id] : [v.pid, v.id];
                    var r = checkParmCanUse(a, newArr);
                    if(r === false){
                        setDisabled(a, true);
                    } else {
                        setDisabled(a, false);
                    }
                });
            });

            if(opt.change && $.isFunction(opt.change)){
                opt.change(li, getItemInfo(li), {
                    checked: checkArr,
                    selected: productInfo ? productInfo : self.filterProducts(checkArr)
                });
            }
        };

        /**
        * 初始化
        **/
        this.init = function(){
            /**
            * 将维度数据list转成map
            * 套餐商品：
            * {
            *     "200230":{
            *             "300100":{
            *             "pid":"300100",
            *             "name":"颜色",
            *             "gid":"200230",
            *             "list":[
            *                 {"id":"1","name":"红色","gid":"200230","pid":"300100"},
            *                 {"id":"2","name":"黑色","gid":"200230","pid":"300100"},
            *                 {"id":"3","name":"蓝色","gid":"200230","pid":"300100"}
            *             ]
            *         }
            *     }
            * }
            *
            * 单品：
            * {
            *     "300100":{
            *         "pid":"300100",
            *         "name":"颜色",
            *         "gid":"200230",
            *         "list":[
            *             {"id":"1","name":"红色","gid":"200230","pid":"300100"},
            *             {"id":"2","name":"黑色","gid":"200230","pid":"300100"},
            *             {"id":"3","name":"蓝色","gid":"200230","pid":"300100"}
            *         ]
            * }
            **/
            opt.parms = {};

            //判断是否有分组
            if(opt.data.groups && opt.data.groups.length > 0){
                opt.isGroups = true;
                opt.groups_order = [];
                opt.groups_map = {};

                var tempOrder = [];
                var groupsOrder = function(num, gid){ //排序放置的位置 越小越靠前

                    if(tempOrder.length === 0 || num >= tempOrder[tempOrder.length - 1]){
                        tempOrder.push(num);
                        opt.groups_order.push(gid);
                    } else if(num < tempOrder[0]){
                        tempOrder.unshift(num);
                        opt.groups_order.unshift(gid);
                    } else {
                        $.each(tempOrder, function(k, v){
                            if(num <= v){
                                tempOrder.splice(k, 0 , num);
                                opt.groups_order.splice(k, 0 , gid);
                                return false;
                            }
                        });
                    }
                };
                $.each(opt.data.groups, function(){ //group数组转map
                    var v = arguments[1];
                    var sorts = Number(v.sorts);
                    groupsOrder(sorts, v.gid);
                    opt.groups_map[v.gid] = v;
                });
                tempOrder = null;

                //维度list转map
                $.each(opt.data.parms, function(){
                    var v = arguments[1];
                    if(!opt.parms[v.gid]){
                        opt.parms[v.gid] = {};
                    }
                    opt.parms[v.gid][v.pid] = v;
                });
                //console.log(opt.parms);
            } else {
                $.each(opt.data.parms, function(){
                    var v = arguments[1];
                    if(!opt.parms[v.pid]){
                        opt.parms[v.pid] = {};
                    }
                    opt.parms[v.pid] = v;
                });
            }

            //显示界面
            ui.render();

            /**
            * 将products数据list转成map
            * 200230|||300100|||1,200230|||300101|||1,200230|||300102|||1,200231|||300103|||1:{
            *     sku: "100010",
            *     stock: "3",
            *     price: "120.00",
            *     ori_price: "200.00",
            *     parms: [{
            *         gid: "200230",
            *         pid: "300100",
            *         id: "1",
            *     }, {
            *         gid: "200230",
            *         pid: "300101",
            *         id: "1",
            *     }, {
            *         gid: "200230",
            *         pid: "300102",
            *         id: "1",
            *     }, {
            *         gid: "200231",
            *         pid: "300103",
            *         id: "1",
            *     }]
            * }
            **/
            opt.products = {};
            $.each(opt.data.products, function(k, v){
                var key = mergeParms(v.parms);
                opt.products[key] = v;
                opt.products[key].index = k;
            });
            //console.log(opt.products);

            /**
            * 初始检查所有的维度，如果初始不可用直接加入disabled列表，操作过程中无需2次检查
            **/
            $.each(opt.data.parms, function(){
                var v = arguments[1];
                $.each(v.list, function(){
                    var sv = arguments[1];
                    var tv = null;
                    if(opt.isGroups === true){
                        tv = [v.gid, v.pid, sv.id];
                    } else {
                        tv = [v.pid, sv.id];
                    }
                    var r = checkParmCanUse(tv);
                    if(r === false){
                        if(opt.isGroups === true){
                            if(opt.parms[tv[0]][tv[1]].disabled){
                                if($.inArray(tv[2].toString(), opt.parms[tv[0]][tv[1]].disabled) < 0){
                                    opt.parms[tv[0]][tv[1]].disabled.push(tv[2].toString());
                                }
                            } else {
                                opt.parms[tv[0]][tv[1]].disabled = [tv[2].toString()];
                            }
                        } else {
                            if(opt.parms[tv[0]].disabled){
                                if($.inArray(tv[1].toString(), opt.parms[tv[0]].disabled) < 0){
                                    opt.parms[tv[0]].disabled.push(tv[1].toString());
                                }
                            } else {
                                opt.parms[tv[0]].disabled = [tv[1].toString()];
                            }
                        }
                        setDisabled(tv, true);
                    }
                });
            });

            /**
            * 绑定维度click事件
            **/
            box.on('click', 'li.item-event', function(){
                var me = $(this);
                var isCheck = null;
                if(!me.hasClass('disabled')){
                    var info = getItemInfo(me);
                    if(me.hasClass('checked')){
                        me.removeClass('checked');
                        isCheck = false;
                    } else {
                        me.addClass('checked').siblings().removeClass('checked');
                        isCheck = true;
                    }
                    getUnCheckedRow(info, isCheck, me);
                }
                return false;
            });

            if(opt.data.parms.length === 0 && opt.data.products.length === 1){
                if(opt.change && $.isFunction(opt.change)){
                    opt.change(null, null, {
                        checked: [],
                        selected: opt.data.products
                    });
                }
            }
        };

        /**
        * @功能 通过维度找产品
        * @parms array: [[gid,pid,id]， [gid,pid,id]， [gid,pid,id]]
        * @return object 【如果没有找到，返回null】
        **/
        this.findProducts = function(arr){
            var res = null;
            var checkIn = function(a){
                var len = 0;
                $.each(arr, function(){
                    var v = arguments[1];
                    var t = v.join('|||');
                    if($.inArray(t, a) > -1){
                        len++;
                    }
                });
                return arr.length === len ? true : false;
            };
            $.each(opt.products, function(k, v){
                var tArr = k.split(',');
                var r = checkIn(tArr);
                if(r){
                    res = v;
                    return false;
                }
            });
            return res;
        };

        /**
        * @功能 查找包含指定维度的产品
        * @parms array: [[gid,pid,id]， [gid,pid,id]， [gid,pid,id]]
        * @return array 【如果没有找到，返回[]】
        **/
        this.filterProducts = function(arr){
            var res = [];
            $.each(opt.products, function(k, v){
                var tmp = k.split(',');
                var len = 0;
                $.each(arr, function(){
                    var v = arguments[1];
                    if($.inArray(v.join('|||'), tmp) > -1){
                        len++;
                    }
                });
                if(len === arr.length){
                    res.push(v);
                }
            });
            return res;
        };

        /**
        * @功能 获取当前选中的产品
        * @return object 【如果没有找到，返回null】
        **/
        this.getProductInfo = function(){
            var arr = getChecked();
            var res = null;
            if(arr.length === opt.data.parms_len){
                res = self.findProducts(arr);
            }

            //检查是否是无维度商品
            if(res === null && opt.data.parms_len === 0 && opt.data.products.length === 1){
                res = opt.data.products[0];
            }

            return res;
        };
    };

    if(!$.es || !$.isPlainObject($.es)){
        $.es = {};
    }
    $.es.ProductAttribute = EsProductAttribute;

    $.fn.esProductAttribute = function(options){
        var opt = {
            box: this,
            data: {},
            change: function(){}
        };
        var esProductAttribute = null;
        opt = $.extend(true, {}, opt, options || {});
        esProductAttribute = new $.es.ProductAttribute(opt);
        esProductAttribute.init();
    };

})(jQuery, window, document);
