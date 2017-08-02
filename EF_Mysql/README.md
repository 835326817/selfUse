# mysql
## 为EF6生成的mysql实体类添加注释
## demo见文件 parking.tt
### 添加的方法
#### 开头添加mysql引用 约在第二行
```
    <#@ assembly name="MySql.Data" #> 
```

#### 调用方法处 约在51行左右
```
    /// <summary>  
    /// <#=codeStringGenerator.GetRemark(edmProperty)#>  
    /// </summary>  
```

#### 注意点:自行修改连接字符串 约置于432行处
```
    public string GetRemark(EdmProperty edmProperty)
        {
            var tableName = edmProperty.DeclaringType.Name;
            var colName = _code.Escape(edmProperty);
            //System.Diagnostics.Debugger.Break();  
            string sql = string.Format(@"select column_comment from INFORMATION_SCHEMA.Columns where table_name='{0}' and table_schema='parking' and COLUMN_NAME='{1}'", tableName,colName);
            string Conn = "Database='parking';Data Source='localhost';User Id='root';Password='root';charset='utf8';pooling=true";
            object remark = new object();
            using (MySql.Data.MySqlClient.MySqlConnection con = new MySql.Data.MySqlClient.MySqlConnection(Conn))
            {
                MySql.Data.MySqlClient.MySqlCommand cmd = new MySql.Data.MySqlClient.MySqlCommand();
                cmd.CommandText = sql;
                cmd.CommandType = System.Data.CommandType.Text;
                cmd.Connection = con;
                con.Open();
                remark = cmd.ExecuteScalar();
            }
            return remark + "";
        }
```
