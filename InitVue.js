//post请求为jq方式  $.post
//layer弹窗需基于jq
//修改增加部分为 div>iframe 
//ps 此处使用了layer 弹窗控件   请自行修改 如删除部分 

//所有项必填,若无虚功能,请随便填写
//el:实例化元素Id "#app1"
//items:初始化时的字符串
//total:总数
//pageSize:每页元素个数
//getUrl:获取的post请求的url
//getData:需要传递的参数 pageIndex已写定
//addText:增加的标题名
//addSrc:增加的url
//deleteSrc:删除post请求的url
//deleteData:需要传递的参数
//deleteMsg:删除时提示语
//modifyTxt:修改的标题名
//modifyUrl:修改的url
//searchUrl:搜索post请求的url
//searchData:搜索post请求的参数 name已写定
//mixin:需要添加的Vue参数,方法   
//var mixin=
//    { 
//    data:{a:1},
//    methods:{
//        a:function(){}
//        } 
//    };
function initVue(options) {
    return new Vue({
        el: options.el,
        data: {
            items: new Array,//初始化时的字符串
            upPage: false,//上一页按钮
            nextPage: false,//下一页按钮
            pageIndex: 1,//页数
            total: parseInt(options.total),//总数
            selectValue: [],//选中的值
            searchName: "",
            beforePage: false,
            endPage: false,
            isShowPage:false,
            allPage: 0,
            isShowNum:true
        },
        methods: {
            //翻页按钮显示
            setPage: function () {
                if (this.allPage == 0) {
                    this.beforePage = false;
                    this.endPage = false;
                    this.isShowPage = false;
                    this.isShowNum = false;
                }
                else {
                    if (this.pageIndex == this.allPage) {
                        //列如 1/1  3/3
                        if (this.allPage == 1) {
                            this.beforePage = false;
                            this.endPage = false;
                            this.isShowPage = false;
                        }
                        else {
                            //可跳转页面  可返回首页
                            this.beforePage = true;
                            this.endPage = false;
                            this.isShowPage = true;
                        }
                    }
                    else {
                        //  1/3
                        if (this.pageIndex == 1) {
                            this.beforePage = false;
                            this.isShowPage = true;
                            this.endPage = true;
                        }
                        else {
                            //   2/3
                            this.beforePage = true;
                            this.isShowPage = true;
                            this.endPage = true;
                        }
                    }
                }
               
            },
            //上一页
            last: function () {
                this.pageIndex--;
                this.getList();
            },
            //下一页
            next: function () {
                this.pageIndex++;
                this.getList();
            },
            //首页
            first:function(){
                this.pageIndex=1;
                this.getList();
            },
            //尾页
            end:function(){
                this.pageIndex = this.allPage;
                this.getList();
            },
            //尾页
            href: function (a) {
                this.pageIndex = a;
                this.getList();
            },
            //全选功能
            checkAll: function (e) {
                var _this = this;
                if (!e.target.checked) {//实现反选
                    _this.selectValue = [];
                }
                else {//实现全选
                    //遍历items
                    _this.selectValue = [];
                    _this.items.forEach(function (item) {
                        //将Id赋值给selectValue 由于是双向绑定 会自动选中
                        _this.selectValue.push(item.No);
                    });
                }
            },
            //获取列表
            getList: function () {
                var _this = this;
                options.getData.pageIndex = _this.pageIndex;
                $.post(options.getUrl, options.getData, function (data) {
                    if (data.result != -1) {
                        _this.items = data.Rows;
                    }
                    else {
                        _this.items = new Array();
                    }
                    //设置按钮显示
                    _this.setPage();
                }, "json")
            },
            //增加
            //此处为弹窗,请自行修改 若每个页面不同 则直接使用mixin添加
            add: function () {
                $("#spTitle").text(options.addText);
                $("#iframeUrl").attr("src", options.addSrc);
                $("#dvshow").show();
            },
            //删除机器
            deleteList: function (ids) {//a:1:批量删 2:单独删  ids:id  
                var _this = this;
                if (ids.length == 0) {
                    layer.msg("请先选择需要删除的项!")
                    return;
                }
                layer.confirm(options.deleteMsg, {
                    btn: ['确定', '取消'] ,offset: '250px'//按钮
                }, function () {
                    //转换成string类型
                    if (typeof (ids) != "number" && typeof (ids) != "string") {
                        ids = ids.join(",")
                    }
                    options.deleteData.no = ids;
                    $.post(options.deleteSrc, options.deleteData, function (data) {
                        if (data == -1) {
                            layer.msg("删除失败");
                        }
                        else {
                            layer.msg("删除成功");
                            //删除对应行
                            try {
                                ids = ids.indexOf(",") > -1 ? ids.split(",") : ids;
                            }
                            catch (e) {
                            }
                            _this.deleteRows(ids);
                        }
                    })
                }, function () {
                    //取消
                });

            },
            //删除行
            deleteRows: function (ids) {//ids:array or number
                var _this = this;
                //遍历数据
                for (var i = 0; i < _this.items.length; i++) {
                    if (typeof (ids) != "number" && typeof (ids) != "string") {
                        //遍历数组
                        $.each(ids, function (index1, id) {
                            if (_this.items[i].No == id) {
                                //删除数据
                                _this.items.splice(i, 1);//移除
                                i--;//$.each index-- 无效,故改for循环
                                return false;
                            }
                        })
                    }
                    else {
                        if (ids == _this.items[i].No) {
                            _this.items.splice(i, 1);//移除
                            return;
                        }
                    }
                }
                _this.initCheckAll();
                _this.pageInit();
            },
            //修改机器
            modify: function (no, index) {
                $("#spTitle").text(options.modifyTxt);
                $("#iframeUrl").attr("src", options.modifyUrl + "?no=" + no + "&index=" + index);
                $("#dvshow").show();
            },
            //设置显示的时间格式
            setTime: function (value) {
                try {
                    return Common.formatterDateTime(value);
                }
                catch (e) {
                    return value;
                }
            },
            //页面初始化  将每页数据还原
            pageInit: function () {
                var _this = this;
                options.getData.pageIndex = _this.pageIndex;
                $.post(options.getUrl, options.getData, function (data) {
                    if (data.result != -1) {
                        _this.items = data.Rows;
                    }
                    else {
                        _this.items = new Array();
                        //当前页没内容时候,默认返回第一页
                        if (_this.pageIndex != 1) {
                            _this.pageIndex = 1;
                            _this.pageInit();
                        }
                    }
                    _this.total = data.total;
                    _this.setPage();
                }, "json")
            },
            //重新设置多选功能
            initCheckAll: function () {
                //初始化多选功能
                document.getElementById("selAll").checked = false;
                this.selectValue = [];
            },
            search: function () {
                var _this = this;
                options.searchData.name = _this.searchName;
                if (options.searchData.name == "") {
                    _this.isShowNum = true;
                    var data = (new Function("return " + options.items))();
                    if (data.result != -1) {
                        _this.items = data.Rows;
                    }
                    _this.allPage = parseInt(this.total / options.pageSize) + (this.total % options.pageSize == 0 ? 0 : 1);
                    _this.setPage();//设置上一页与下一页按钮的显示与隐藏
                }
                else {
                    $.post(options.searchUrl, options.searchData, function (data) {
                        if (data.result != -1) {
                            _this.items = data;
                            if (_this.items.length > 50) {
                                layer.msg("搜索数据过多,目前只显示前50条")
                                _this.items.splice(50, _this.items.length - 49);
                            }

                            _this.isShowNum = false;
                            _this.beforePage = false;
                            _this.endPage = false;
                            _this.isShowPage = false;
                        }
                        else {
                            layer.msg("没找到结果");
                            _this.items = new Array;


                            _this.isShowNum = false;
                            _this.beforePage = false;
                            _this.endPage = false;
                            _this.isShowPage = false;
                        }
                    }, "json");
                }
               
            }
        },
        mounted: function () {
            //初始化设置
            var data = (new Function("return " + options.items))();
            if (data.result != -1) {
                this.items = data.Rows;
            }
            this.allPage = parseInt(this.total / options.pageSize) + (this.total % options.pageSize == 0 ? 0 : 1);
            this.setPage();//设置上一页与下一页按钮的显示与隐藏
        }
            , mixins: [options.mixin]  //自己添加的data与methods

    });
}
//时间转换
var Common = { formatterDate: function (date) { if (date == undefined) { return "" } date = date.substr(1, date.length - 2); var obj = eval('(' + "{Date: new " + date + "}" + ')'); var date = obj["Date"]; if (date.getFullYear() < 1900) { return "" } var datetime = date.getFullYear() + "-" + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()); return datetime }, formatterDate2: function (date) { if (date == undefined) { return "" } date = date.substr(1, date.length - 2); var obj = eval('(' + "{Date: new " + date + "}" + ')'); var date = obj["Date"]; if (date.getFullYear() < 1900) { return "" } var datetime = date.getFullYear() + "-" + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " 00:00:00"; return datetime }, formatterDateTime: function (date) { if (date == undefined) { return "" } date = date.substr(1, date.length - 2); var obj = eval('(' + "{Date: new " + date + "}" + ')'); var date = obj["Date"]; if (date.getFullYear() < 1900) { return "" } var datetime = date.getFullYear() + "-" + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " " + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()); return datetime }, formatterYear: function (date) { if (date == undefined) { return "" } date = date.substr(1, date.length - 2); var obj = eval('(' + "{Date: new " + date + "}" + ')'); var date = obj["Date"]; if (date.getFullYear() < 1900) { return "" } return date.getFullYear() }, getNowTime: function () { var date = new Date(); var datetime = date.getFullYear() + "-" + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " " + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()); return datetime } };
