# InitVue
### demo
```html

<style>
    [v-cloak] {
    display: none;
    }
</style>

<div id="divTr">
    <!-- 搜索框 -->
    <input class="bg-white" type="text" v-model="searchName" placeholder="组名" v-on:keyup.13="search" />
    <!-- 列表框 -->
    <table>
        <thead>
            <tr style="height: 40px">
                <th>
                    <input type="checkbox" v-on:click="checkAll" id="selAll" />
                </th>
                <th>组名称</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item,index) in items">
          <!-- v-cloak  防止在未渲染完成时候 显示出来 -->
                <td v-cloak>
                    <input type="checkbox" name="group" v-bind:value="item.No" v-model="selectValue" />
                </td>
                <td v-cloak>{{item.Name}}</td>
                <td v-cloak><a href="javascript:" @click="modify(item.No,index)">修改</a>&nbsp;<a href="javascript:" @click="showGroup(item.No)">查看</a>&nbsp;<a href="javascript:" @click="moveGroup(item.No)">移动</a>&nbsp;<a href="javascript:" @click="deleteList(item.No)">删除</a></td>
            </tr>
        </tbody>
    </table>
    <a href="javascript:" v-show="upPage" v-on:click="last" v-cloak>上一页</a>&nbsp;&nbsp;&nbsp;<a href="javascript:" v-show="nextPage" v-on:click="next" v-cloak>下一页</a>
</div>
```
```javascript

   var vueOptions = {
            el: "#divTr",
            items: '<%=trs%>',
            total: '<%=total%>',
             pageSize: 30,
             getUrl: "GroupList.aspx",
             getData: {
                 action: "changePage",
                 parentId: parseInt('<%=Request.QueryString["pId"]%>'),
                type: parseInt('<%=Request.QueryString["type"]%>')
            },
            addText: "增加组",
            addSrc: "AddGroup.aspx?pId=<%=Request.QueryString["pId"]%>&type=<%=Request.QueryString["type"]%>",
            deleteSrc: "GroupList.aspx",
            deleteData: {
                action: "delete"
            },
            deleteMsg: "您确定要删除选中项及其孩子吗",
            modifyTxt: "修改组",
            modifyUrl: "ModifyGroup.aspx",
            searchUrl: "GroupList.aspx",
            searchData: {
                action: "search",
                type: parseInt('<%=Request.QueryString["type"]%>')
            },
             mixin: {
                 methods: {
                     moveGroup: function (nos) {
                         if (nos.length == 0) {
                             layer.msg("请选择需要移动的组!");
                             return;
                         }
                         if (typeof (nos) != "number" && typeof (nos) != "string") {
                             nos = nos.join(",");
                         }
                         $("#spTitle").text("移动组");
                         $("#iframeUrl").attr("src", "MoveGroup.aspx?type=<%=Request.QueryString["type"]%>&no=" + nos);
                        $("#dvshow").show();
                    },
                    showGroup: function (a) {
                        location.href = "GroupList.aspx?pId=" + a + "&type=<%=Request.QueryString["type"]%>"
                    }
                }
            }
          }
        var groupList = initVue(vueOptions);
    
```
