Ext.define("IBApp.store.UrlAddr", {
    extend: "Ext.data.Store",
    xtype: 'urladdrstore',

    config: {
        fields: [
            { name: 'urlLogin', type: 'string' },
            { name: 'urlServer', type: 'string' },
        ],
        data: [
        {
        	//add profiles by jeffen@pactera 2015/12/15
            //会议室智能管理软件CCIP(council chamber intelligence platform)项目开发环境[Intranet内网](HayaBuilding) 
            //urlLogin: 'http://localhost:8080/pactera-jeesite/restService/userservice/0.2',
            //urlLogin: 'http://192.168.5.7:9301/pactera-jeesite/restService/userservice/0.2',
            //
            //会议室智能管理软件CCIP(council chamber intelligence platform)项目开发环境[Internet外网](Out of office)
            //urlLogin: 'http://219.143.215.116:9301/pactera-jeesite/restService/userservice/0.2',
            
            //互联网访问测试服务
            urlLogin: 'http://meetingadmin.crscd.com.cn:8080/pactera-jeesite/restService/userservice/0.2',
            urlServer: 'http://meeting.crscd.com.cn:8080/mtservice/restService/0.1',
        }, 

        ]
    }
});