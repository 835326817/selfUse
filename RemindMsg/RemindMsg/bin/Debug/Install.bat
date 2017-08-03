%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\installutil.exe "d:\documents\visual studio 2013\Projects\RemindMsg\RemindMsg\bin\Debug\RemindMsg.exe"
Net Start RemindMsg
sc config RemindMsg start= auto
