using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace RemindMsg
{
    public partial class Service1 : ServiceBase
    {
        public Service1()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            //设置一个到17.35的定时任务
            var dt=DateTime.Now;
            int timespan = 0;
            if ((dt.Hour >= 17 && dt.Minute > 35))
            {
                //设置时间为隔天
                timespan = ConvertDateTimeInt(Convert.ToDateTime(dt.ToString("yyyy-MM-dd 17:35")).AddDays(1))-ConvertDateTimeInt(dt);
            }
            else
            {
                //设置时间为当天
                timespan = ConvertDateTimeInt(Convert.ToDateTime(dt.ToString("yyyy-MM-dd 17:35"))) - ConvertDateTimeInt(dt);
            }
            System.Timers.Timer setHalf = new System.Timers.Timer(timespan * 1000);
            setHalf.Elapsed += new System.Timers.ElapsedEventHandler(setHalfFun);
            setHalf.AutoReset = false;
            setHalf.Enabled = true;
        }

        private void setHalfFun(object sender, System.Timers.ElapsedEventArgs e)
        {
            //设置每隔24小时执行
            System.Timers.Timer aTimer1 = new System.Timers.Timer(1000*60*60*24);
            aTimer1.Elapsed += new System.Timers.ElapsedEventHandler(aTimer_Elapsed1);
            aTimer1.AutoReset = true;
            aTimer1.Enabled = true;
        }

        private void aTimer_Elapsed1(object sender, System.Timers.ElapsedEventArgs e)
        {
           //发送请求通知
            string text="{\"msgtype\": \"text\", \"text\": {\"content\": \"打卡测试\"}, \"at\": {\"atMobiles\": [], \"isAtAll\": false}}";
            HttpPostjson("https://oapi.dingtalk.com/robot/send?access_token=b7ae12e5e475f775b6597e3b9718dab40ae2e2a9f9b48fdad3d3610af7b5960b", text);
        }

        protected override void OnStop()
        {
        }
        #region  post请求
        /// <summary>
        /// post请求(正常)
        /// </summary>
        /// <param name="Url">请求的Url</param>
        /// <param name="postDataStr">内容</param>
        /// <returns></returns>
        public string HttpPost(string Url, string postDataStr)
        {
            Encoding encoding = Encoding.UTF8;
            byte[] data = encoding.GetBytes(postDataStr);
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Url);
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = data.Length;
            Stream myRequestStream = request.GetRequestStream();
            myRequestStream.Write(data, 0, data.Length);

            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream myResponseStream = response.GetResponseStream();
            using (StreamReader sr = new StreamReader(myResponseStream, Encoding.GetEncoding("utf-8")))
            {
                return sr.ReadToEnd();
            }
        }
        /// <summary>
        /// post请求(正常)
        /// </summary>
        /// <param name="Url">请求的Url</param>
        /// <param name="postDataStr">内容</param>
        /// <returns></returns>
        public string HttpPostjson(string Url, string postDataStr)
        {
            Encoding encoding = Encoding.UTF8;
            byte[] data = encoding.GetBytes(postDataStr);
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Url);
            request.Method = "POST";
            request.ContentType = "application/json";
            request.ContentLength = data.Length;
            Stream myRequestStream = request.GetRequestStream();
            myRequestStream.Write(data, 0, data.Length);

            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream myResponseStream = response.GetResponseStream();
            using (StreamReader sr = new StreamReader(myResponseStream, Encoding.GetEncoding("utf-8")))
            {
                return sr.ReadToEnd();
            }
        }
        #endregion

        /// <summary>
        /// 时间类型的数据转换成I
        /// </summary>
        /// <param name="time"></param>
        /// <returns></returns>
        public int ConvertDateTimeInt(System.DateTime time)
        {
            System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1));//根据微信需要将时间转换成int类型
            return (int)(time - startTime).TotalSeconds;
        }
    }
}
