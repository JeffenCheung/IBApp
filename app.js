/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

Ext.application({
    name: 'IBApp',

    requires: [
        'Ext.MessageBox',
        'Ext.Panel',
    ],

    views: [
        'Login', 'MainMenu', 'RoomBooking', 
        'RoomSearchResult', 'RoomBookSuccess','MyMeetings',
        'MeetingRequest', 'DevCtrRoomList', 'DeviceControl',
        'Search', 'ChooseAttenders','DeviceControlSimple', 'RoomBookingViaCertainRoom'
    ],

    controllers: ['Login', 'MainMenu', 'RoomBooking','MyMeetings'],

    models: ['UserInfo', 'MeetingType','PlaceType', 'MyMeetingsEvent','SceneMode', 'Attenders'],

    stores: ['UserInfo', 'MeetingType','PlaceType', 'MyMeetingsEvent','SceneMode','MyMeetingsSearch','UrlAddr'],
    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        // Initialize the main view
        //Ext.Viewport.add(Ext.create('IBApp.view.Login'));
        Ext.Viewport.add([
            {xtype: 'loginview'},
            {xtype: 'mainmenuview'},
            {xtype: 'roombookingview'},
            {xtype: 'roombookingviacertainroomview'},
            {xtype: 'roomsearchresultview'},
            {xtype: 'roombooksuccessview'},
            {xtype: 'mymeetingsview'},
            {xtype: 'meetingrequestview'},
            {xtype: 'devctrroomlistview'},
            {xtype: 'devicecontrolview'},
            {xtype: 'devicecontrolsimpleview'},
            {xtype: 'searchview'},
            {xtype: 'chooseattendersview'},
           
        ]);

        this.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'login'}));

        document.addEventListener("backbutton", function() {
            var curUrl = window.location.hash;
            if ((curUrl !='#mainmenu') && (curUrl !='#login')) {
                window.history.go(-1);
            }
            else {
                navigator.app.exitApp();
            }
        }, false);

        var me = this;
        window.plugins.jPushPlugin.openNotificationInAndroidCallback= function(data){
            var bToObj  = Ext.JSON.decode(data);

            var curUrl = window.location.hash;
            if ( (curUrl !='#login') && (bToObj.extras['cn.jpush.android.EXTRA'].msgType == 1) ) {
                Ext.Msg.show({
                    message: bToObj.extras['cn.jpush.android.EXTRA'].msg,
                    buttons: [
                        {
                          text: '参会',
                          ui: 'action'
                        }, 
                        {
                          text: '不参会',
                          ui: 'action'
                        },
                        {
                          text: '未定',
                          ui: 'action'
                        },
                        {
                          text: '取消',
                          ui: 'action'
                        }
                    ],
                    fn: function(button) {
                        if (button.indexOf('取消') == -1 ) {
                            var mtReplyObj = new Object();
                            if (button == '参会') {
                                mtReplyObj.replyResult = 1;
                            };
                            if (button == '不参会') {
                                mtReplyObj.replyResult = 2;
                            };
                            if (button == '未定') {
                                mtReplyObj.replyResult = 3;  
                            };
                            mtReplyObj.replyerId = Ext.getStore("UserInfo").getAt(0).get('userId');
                            mtReplyObj.replyerFlag = 1; //回复人标识 1.内部人员2.外部人员 
                            mtReplyObj.replyDate =Ext.JSON.encodeDate(new Date());//回复日期
                            mtReplyObj.meetingId = bToObj.extras['cn.jpush.android.EXTRA'].mtId;//会议ID
                            mtReplyObj.replyMethod = 1; //回复方式1.手机APP 2.网页 3.短信 
                            me.getApplication().getController('MyMeetings').onMtReplyCommand(mtReplyObj);
                        };
                    }
                });
            }
            else {
                Ext.Msg.show({
                    message: bToObj.extras['cn.jpush.android.EXTRA'].msg,
                    buttons: [
                        {
                          text: 'OK',
                          ui: 'action'
                        }
                    ]
                });
            }
        };

    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    },
});
