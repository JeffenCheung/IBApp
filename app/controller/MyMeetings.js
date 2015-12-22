Ext.define("IBApp.controller.MyMeetings", {
    extend: "Ext.app.Controller",
    requires: ['IBApp.store.UrlAddr'],
    config: {
        refs: {
            // We're going to lookup our views by xtype.
            myMeetingsView: 'mymeetingsview',
            meetingRequestView:'meetingrequestview',
            deviceControlView:'devicecontrolview',
            deviceControlSimpleView:'devicecontrolsimpleview',
            searchView:'searchview',
            devCtrRoomListView: 'devctrroomlistview',
            chooseAttendersView: 'chooseattendersview',
        },
        control: {
            myMeetingsView: {
                meetingsListCommand:'onMeetingsListCommand',
                searchviewCommand:'onSearchviewCommand',
            },
            meetingRequestView: {
                meetingRequestToMyMeetingsCommand:'onMeetingRequestToMyMeetingsCommand',
                meetingRequestModifyDetailsCommand:'onMeetingRequestModifyDetailsCommand',
                participatorModifyCommand: 'onParticipatorModifyCommand',
                mtReplyCommand:'onMtReplyCommand',
                mtCancelCommand:'onMtCancelCommand',
            },
            devCtrRoomListView: {
                roomListTapCommand: 'onRoomListTapCommand',
            },
            deviceControlView: {
                backButtonCommand:'onDeviceControlBackButtonCommand',
            },
            deviceControlSimpleView: {
                backButtonCommand:'onDeviceControlBackButtonCommand',
                ctrlDevCommand: 'onCtrlDevCommand',
            },
            searchView:{
                SearchToMyMeetingsCommand:'onSearchToMyMeetingsCommand',
                SearchCommand:'onSearchCommand',
                searchMeetingsListCommand:'onMeetingsListCommand',
            },
            chooseAttendersView: {
                backToMeetingRequest: 'onBackToMeetingRequest',
                getUserByName: 'onGetUserByName',
            }
        },
        routes: {
            'meetingrequest': 'showMeetingRequestView',
            'devicecontrol': 'showDeviceControlView',
            'devicecontrolsimple': 'showDeviceControlSimpleView',
            'search':'showSearchView',
            'chooseattenders': 'showChooseAttendersView',
        }
    },

    showMeetingRequestView: function() {
        Ext.Viewport.animateActiveItem(this.getMeetingRequestView(), 'fade');
    },

    showDeviceControlView: function() {
        Ext.Viewport.animateActiveItem(this.getDeviceControlView(), 'fade');
    },

    showDeviceControlSimpleView: function() {
        Ext.Viewport.animateActiveItem(this.getDeviceControlSimpleView(), 'fade');
    },

    showSearchView: function() {
        Ext.Viewport.animateActiveItem(this.getSearchView(), 'fade');
    },

    showChooseAttendersView: function() {
        Ext.Viewport.animateActiveItem(this.getChooseAttendersView(), 'fade');
    },

    onMeetingRequestToMyMeetingsCommand: function () {
        this.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'mymeetings'}));
    },

    /* 修改与会人员页返回至会议详情页 */
    onBackToMeetingRequest: function (mtAttenders, store) {
        if ( (mtAttenders != null) && (store != null) ) {
            this.getMeetingRequestView().setParticipator(mtAttenders, store);
        };
        window.history.go(-1);
    },

    onParticipatorModifyCommand: function (store) {
        var me = this;
        var userId = Ext.getStore("UserInfo").getAt(0).get('userId');
        var inContacts = null, outContacts = null;

        /* 获取内部常用联系人 */
        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urlGetInContacts = URLServer + '/topContact/inContactsList/' +  userId + '/6';
        Ext.Ajax.request({
            url: urlGetInContacts,
            method: 'GET',
            disableCaching: false,
            success: function (response) {
                inContacts = Ext.JSON.decode(response.responseText);
                me.getChooseAttendersView().showContacts(inContacts, 1);

                me.getOutContacts(store);
            },
            failure: function (response) {
                Ext.Msg.alert('获取内部常用联系人失败');
            }
        });

        // /* 获取外部常用联系人 */
        // var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        // var urlGetOutContacts = URLServer + '/topContact/outContactsList/' +  userId + '/6';
        // Ext.Ajax.request({
        //     url: urlGetOutContacts,
        //     method: 'GET',
        //     disableCaching: false,
        //     success: function (response) {
        //         outContacts = Ext.JSON.decode(response.responseText);
        //         me.getChooseAttendersView().showContacts(outContacts, 2);
        //     },
        //     failure: function (response) {
        //         Ext.Msg.alert('获取外部常用联系人失败');
        //     }
        // });
        
        // var task = Ext.create('Ext.util.DelayedTask', function () {
        //     me.getChooseAttendersView().showExistAttenders(store);
        // });
        // task.delay(1000);
        // this.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'chooseattenders'}));
    },

    getOutContacts: function(store) {
        var me = this;
        var userId = Ext.getStore("UserInfo").getAt(0).get('userId');
        var outContacts = null;

        /* 获取外部常用联系人 */
        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urlGetOutContacts = URLServer + '/topContact/outContactsList/' +  userId + '/6';
        Ext.Ajax.request({
            url: urlGetOutContacts,
            method: 'GET',
            disableCaching: false,
            success: function (response) {
                outContacts = Ext.JSON.decode(response.responseText);
                me.getChooseAttendersView().showContacts(outContacts, 2);

                me.getChooseAttendersView().showExistAttenders(store);
                me.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'chooseattenders'}));
            },
            failure: function (response) {
                Ext.Msg.alert('获取外部常用联系人失败');
            }
        });
    },

    onGetUserByName: function(userName) {
        var me = this;
        var obj = new Object();
        obj.userName = userName;
        var paramsJson = Ext.JSON.encode(obj);

        // var urlGetUserByName = 'http://10.2.49.250:8080/mtservice/restService/0.1/user/userList';
        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urlGetUserByName = URLServer + '/user/userList/';
        Ext.Ajax.request({
            url: urlGetUserByName,
            method: 'POST',
            disableCaching: false,
            params: paramsJson,
            success: function (response) {
                userList = Ext.JSON.decode(response.responseText);
                me.getChooseAttendersView().showUserSearchList(userList);
            },
            failure: function (response) {
                Ext.Msg.alert('用户搜索失败');
            }
        });
    },

    onDeviceControlBackButtonCommand: function () {
        window.history.go(-1);
    },

    onCtrlDevCommand: function(parentId, instanceType, instanceId, instanceValue) {
        var me = this;
        var obj = new Object();
        obj.parentId = parentId;
        obj.instanceType = instanceType;
        obj.instanceId = instanceId;
        obj.instanceValue = instanceValue;
        var paramsJson = Ext.JSON.encode(obj);
        console.log(paramsJson);

        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urlCtrlDev = URLServer + '/roomDev/operateDev';
        Ext.Ajax.request({
            url: urlCtrlDev,
            method: 'POST',
            disableCaching: false,
            params: paramsJson,
            success: function (response) {
                ret = response.responseText;
                if (ret == -1) {Ext.Msg.alert('失败');};
            },
            failure: function (response) {
                Ext.Msg.alert('设备控制失败');
            }
        });
    },

    onMeetingRequestModifyDetailsCommand: function(modifiedMtDetails) {
        var paramsJson = Ext.JSON.encode(modifiedMtDetails);
        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urlUpdateMeeting = URLServer + '/meeting/updateMeeting/';
        Ext.Ajax.request({
            url: urlUpdateMeeting,
            method: 'POST',
            disableCaching: false,
            params: paramsJson,
            success: function (response) {
                var ret = Ext.JSON.decode(response.responseText);
                if(ret.resultFlag == 1) {
                    Ext.Msg.alert('会议修改成功！');
                }
                else if(ret.resultFlag == 2) {
                    Ext.Msg.alert('修改有冲突');
                }
                else if(ret.resultFlag == 0) {
                    Ext.Msg.alert('修改失败');
                }
            },
            failure: function (response) {
                Ext.Msg.alert('访问失败');
            }
        });
    },

    onRoomListTapCommand: function(record) {
        var me = this;
        var inputObj = new Object();

        inputObj.userId = Ext.getStore("UserInfo").getAt(0).get('userId');
        inputObj.roomId = record.get('roomId');
        inputObj.beginTime = Ext.JSON.encodeDate(new Date());
        inputObj.endTime = Ext.JSON.encodeDate(new Date());
        var paramsJson = Ext.JSON.encode(inputObj);
        console.log('onRoomListTapCommand');
        console.log(paramsJson);
        var urlGetRoomDev = Ext.getStore("UrlAddr").getAt(0).get('urlServer') + '/roomDev/getRoomDev';
        Ext.Ajax.request({
            url: urlGetRoomDev,
            method: 'POST',
            disableCaching: false,
            params: paramsJson,
            success: function (response) {
                var devInfoArray = Ext.JSON.decode(response.responseText);
                me.getDeviceControlSimpleView().showDevices(devInfoArray);
                me.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'devicecontrolsimple'}));
            },
            failure: function (response) {
                Ext.Msg.alert('获取设备信息失败');
            }
        });
    },

    onMeetingsListCommand: function(record) {
        console.log('搜索list')
        var mtId = record.get('mtId');
        console.log('mtId');
        console.log(mtId);
        var me = this;
        var details = null;
        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urlmtdetails = URLServer + '/meeting/mtInfo/' + mtId;
        Ext.Ajax.request({
            url: urlmtdetails,
            method: 'GET',
            disableCaching: false,
            success: function (response) {
                details = Ext.JSON.decode(response.responseText);
                //更新MeetingRequest的会议详情
                me.getMeetingRequestView().updateMeetingDetails(details);
                me.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'meetingrequest'}));
            },
            failure: function (response) {
                Ext.Msg.alert('获取会议详情失败!');
            }
        });

        this.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'meetingrequest'}));
    },

    onSearchviewCommand: function() {
        //先删除上次的搜索记录
        Ext.getStore("MyMeetingsSearch").removeAll();
        this.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'search'}));
    },

    onSearchToMyMeetingsCommand: function () {
        this.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'mymeetings'}));
    },

    onSearchCommand: function (view, keyword) {
        var me = this;
        var paramsObj = new Object();
        /*搜索范围当月第一天到最后一天*/
        var day = (new Date()).getDate(),
        month = (new Date()).getMonth(),
        year = (new Date()).getFullYear();
        var bdate = new Date(year, month, 1,0,0);
        var edate = new Date(year, month, Ext.Date.getDaysInMonth(bdate),24,0);
        /*搜索范围输入*/
        paramsObj.userId = Ext.getStore("UserInfo").getAt(0).get('userId');
        paramsObj.beginDate = Ext.JSON.encodeDate(bdate); 
        paramsObj.endDate = Ext.JSON.encodeDate(edate); 
        paramsObj.condition = keyword;
        paramsObj.maxresult = -1;//每页最多多少条记录
        paramsObj.currentpage = -1;//当前页数（从0开始）
        var paramsJson = Ext.JSON.encode(paramsObj);
        /* 从后台进行验证 */
        // var urltmp = 'http://10.2.49.250:8080/mtservice/restService/0.1/meeting/mtList/';
         // var urltmp = 'http://10.2.20.69:8080/mtservice/restService/0.1/meeting/mtList/';
        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urltmp = URLServer + '/meeting/mtList/';

        console.log('搜索------paramsJson');
        console.log(paramsJson);

        myMeetingsView = me.getMyMeetingsView();
        myMeetingsView.setMasked({
            xtype: 'loadmask',
            message: '搜索中...'
        });

        Ext.Ajax.request(
        {         
            url: urltmp,
            method: 'POST',
            disableCaching: false,
            // withCredentials: true,
            // useDefaultXhrHeader: false,
            params: paramsJson,
            success: function (response) 
            {
                var resultResponse = Ext.JSON.decode(response.responseText);

                console.log(resultResponse);
                Ext.getStore("MyMeetingsSearch").removeAll();
                /* set MyMeetingsEventStore  mtFlag:1-正在审核；2-未开始；3-已结束；4-已取消；5-草稿；6-删除；*/  
                for(var i = 0; i< resultResponse.length; i++)
                {
                    var curUser = Ext.create('IBApp.model.MyMeetingsEvent', {
                     /*根据Calendar控件需要，model的name有些与接收到的Json名称一致，有些不一致*/
                     'title': resultResponse[i].mtTheme,
                     'start': new Date(resultResponse[i].mtBeginTime),
                     'end': new Date(resultResponse[i].mtEndTime),
                     'event': '8.03 - 8:05',
                     'location':resultResponse[i].rooms[0].roomNum,
                     'mtFlag':resultResponse[i].mtFlag,
                     'mtId':resultResponse[i].mtId,
                     'organizerName':resultResponse[i].organizerName,
                     'mtContent':resultResponse[i].mtContent,
                     'replyNum':resultResponse[i].replyNum,
                     'attenderNum':resultResponse[i].attenderNum,
                    });


                    if(resultResponse[i].mtFlag == 1)
                    {
                        curUser.set('statusEn','checking');
                        curUser.set('status','正在审核');
                    }
                    if(resultResponse[i].mtFlag == 2)
                    {
                        curUser.set('statusEn','waiting');
                        curUser.set('status','未开始');
                    }
                    if(resultResponse[i].mtFlag == 3)
                    {
                        curUser.set('statusEn','closed');
                        curUser.set('status','已结束');
                    }
                    if(resultResponse[i].mtFlag == 4)
                    {
                        curUser.set('statusEn','canceled');
                        curUser.set('status','已取消');
                    }
                    if(resultResponse[i].mtFlag == 5)
                    {
                        curUser.set('statusEn','draft');
                        curUser.set('status','草稿');
                    }
                    if(resultResponse[i].mtFlag == 6)
                    {
                        curUser.set('statusEn','deleted');
                        curUser.set('status','删除');
                    }

                    if(null == curUser.get('title'))
                    {
                        curUser.set('title', '待定');
                    }

                    curUser.set('startstr', Ext.JSON.encodeDate(curUser.get('start')));
                    curUser.set('endstr', Ext.JSON.encodeDate(curUser.get('end')));
                    Ext.getStore("MyMeetingsSearch").add(curUser);                
                };
               
                myMeetingsView = me.getMyMeetingsView();
                myMeetingsView.setMasked(false);
                me.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'search'}));
                 
            }, 
            failure: function (response) 
            { 
                Ext.Msg.alert('搜索会议失败！');
            }
        }); 
 
    },

    onMtReplyCommand:function(mtReplyObj) {
        var paramsJson = Ext.JSON.encode(mtReplyObj);
        console.log('paramsJson');
        console.log(paramsJson);
        // var urlReplyMeeting = 'http://10.2.49.250:8080/mtservice/restService/0.1/reply/addReply';
        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urlReplyMeeting = URLServer + '/reply/addReply/';
        Ext.Ajax.request({
            url: urlReplyMeeting,
            method: 'POST',
            disableCaching: false,
            params: paramsJson,
            success: function (response) {
                var ret = response.responseText;

                  console.log('ret');
                  console.log(ret);
                if(ret != '0') {
                    Ext.Msg.alert('回复成功！');
                }
                else
                {
                    Ext.Msg.alert('回复失败');       
                }
            },
            failure: function (response) {
                Ext.Msg.alert('回复网络连接失败');
            }
        });
    },

    onMtCancelCommand:function(mtCancelobj) {
        var paramsJson = Ext.JSON.encode(mtCancelobj);
        console.log('paramsJson');
        console.log(paramsJson);
        // var urlCancelMeeting = 'http://10.2.49.250:8080/mtservice/restService/0.1/meeting/quickUpdateMeeting';
        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urlCancelMeeting = URLServer + '/meeting/quickUpdateMeeting/';
        Ext.Ajax.request({
            url: urlCancelMeeting,
            method: 'POST',
            disableCaching: false,
            params: paramsJson,
            success: function (response) {
                var ret = Ext.JSON.decode(response.responseText);

                  console.log('ret');
                  console.log(ret);
                if(ret.resultFlag == 1) {
                    if(mtCancelobj.changeFlag == 1)
                    {
                        Ext.Msg.alert('会议取消成功！');
                    }
                    else if (mtCancelobj.changeFlag == 4)
                    {
                        Ext.Msg.alert('会议结束成功！');
                    }
                }
                else
                {
                    if(mtCancelobj.changeFlag == 1)
                    {
                        Ext.Msg.alert('会议取消失败！');
                    }
                    else if (mtCancelobj.changeFlag == 4)
                    {
                        Ext.Msg.alert('会议结束失败！');
                    }
                           
                }
            },
            failure: function (response) {
                Ext.Msg.alert('取消网络连接失败');
            }
        });
    }

});