Ext.define("IBApp.controller.RoomBooking", {
    extend: "Ext.app.Controller",
    requires: ['IBApp.store.UrlAddr'],
    config: {
        refs: {
            // We're going to lookup our views by xtype.
            meetingRequestView:'meetingrequestview',
            roomBookingView: 'roombookingview',
            roomBookingViaCertainRoomView: 'roombookingviacertainroomview',
            roomSearchResultView: 'roomsearchresultview',
            roomBookSuccessView: 'roombooksuccessview',
        },
        control: {
        	roomBookingView: {
                mtTypeChangeCommand: 'onMtTypeChangeCommand',
        		roomSearchSubmitCommand: 'onRoomSearchSubmitCommand',
                checkRoomBtnTapCommand: 'onCheckRoomBtnTapCommand',
                emptyRoomSubmitCommand: 'onEmptyRoomSubmitCommand',
        	},
            roomBookingViaCertainRoomView: {
                backButtonTapCommand: 'onBackButtonCommand',
                mtTypeChangeCommand: 'onMtTypeChangeServices',
                meetingAddCommand: 'onRoomBookButtonCommand',
            },
            roomSearchResultView: {
                backButtonCommand: 'onBackButtonCommand',
                roomBookButtonCommand: 'onRoomBookButtonCommand'
            },
            roomBookSuccessView: {
                backButtonCommand: 'onBacktoMainMenuCommand',
            	modifyMeetingInfoButtonCommand: 'onModifyMeetingInfoButtonCommand',
                myMeetingsButtonCommand: 'onMyMeetingsButtonCommand',
            }
        },
        routes: {
            'roomsearchresult': 'showRoomSearchResultView',
            'roombooksuccess': 'showRoomBookSuccessView',
            'roombookingviacertainroom': 'showRoomBookingViaCertainRoomView',
        }
    },

    showRoomSearchResultView: function() {
        Ext.Viewport.animateActiveItem(this.getRoomSearchResultView(), 'fade');
    },

    showRoomBookSuccessView: function() {
        Ext.Viewport.animateActiveItem(this.getRoomBookSuccessView(), 'fade');
    },

    showRoomBookingViaCertainRoomView: function() {
        Ext.Viewport.animateActiveItem(this.getRoomBookingViaCertainRoomView(), 'fade');
    },

    onMtTypeChangeCommand: function(view, mtTypeId) {
        var me = this;
        var devices = null, services = null;

        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urlDeviceType = URLServer + '/baDevType/devTypeListByMtType/'  + mtTypeId;
        Ext.Ajax.request({
            url: urlDeviceType,
            method: 'GET',
            disableCaching: false,
            success: function (response) {
                devices = Ext.JSON.decode(response.responseText);
                me.getRoomBookingView().showDevices(devices);
            },
            failure: function (response) {
                me.getRoomBookingView().showMessages('获取设备列表失败');
            }
        });

        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urlServiceType = URLServer + '/mtService/mtServiceList/'  + mtTypeId;
        Ext.Ajax.request({
            url: urlServiceType,
            method: 'GET',
            disableCaching: false,
            success: function (response) {
                services = Ext.JSON.decode(response.responseText);
                me.getRoomBookingView().showServices(services);
            },
            failure: function (response) {
                me.getRoomBookingView().showMessages('获取服务列表失败');
            }
        });
    },

    onRoomSearchSubmitCommand: function (view, obj) {
        var me = this;
        if (obj.attendNum == null) {
            me.getRoomBookingView().showMessages('需要填写与会人数');
            return;
        }
        
        if ( (obj.beginTime <= new Date()) || (obj.beginTime >= obj.endTime) ) {
            me.getRoomBookingView().showMessages('会议时间不合理');
            return;
        }

        var userId = Ext.getStore("UserInfo").getAt(0).get('userId');
        var strBeginTime = Ext.JSON.encodeDate(obj.beginTime);
        var strEndTime = Ext.JSON.encodeDate(obj.endTime);

        obj.userId = userId;
        obj.attenders = null;
        obj.beginTime = strBeginTime;
        obj.endTime = strEndTime;
        obj.devTypeIds = Ext.JSON.encode(obj.devTypeIds);
        var paramsJson = Ext.JSON.encode(obj);

        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urlGetRecommendMtRoom = URLServer + '/mtRoom/recommendList/' ;
        Ext.Ajax.request({
            url: urlGetRecommendMtRoom,
            method: 'POST',
            disableCaching: false,
            params: paramsJson,
            success: function (response) {
                var recommendRooms = Ext.JSON.decode(response.responseText);
                // console.log(recommendRooms);
                if(recommendRooms != '[]') {
                    me.getRoomSearchResultView().showRoomList(obj, recommendRooms);
                    me.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'roomsearchresult'}));
                }
                else {
                    me.getRoomBookingView().showMessages('没有符合条件的会议室');
                }
            },
            failure: function (response) {
                me.getRoomBookingView().showMessages('访问失败');
            }
        });
    },

    onCheckRoomBtnTapCommand: function (userId, floorId, beginTime, endTime) {
        var me = this;
        if ( (userId == null) || (floorId == null) || (beginTime == null) || (endTime == null) ) {
            me.getRoomBookingView().showMessages('需要填写楼层信息');
            return;
        }

        var obj = new Object();
        obj.userId = userId;
        obj.floorId = floorId;
        obj.beginTime = Ext.JSON.encodeDate(beginTime);
        obj.endTime = Ext.JSON.encodeDate(endTime);
        obj.flag = 1; // 日视图
        obj.timeSpan = 30;  // 时间间隔30分钟
        var paramsJson = Ext.JSON.encode(obj);

        me.getRoomBookingView().setMasked({
            xtype: 'loadmask',
            message: '正在加载中...'
        });

        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urlGetRoomUseInfo = URLServer + '/mtRoom/roomUseInfoList' ;
        Ext.Ajax.request({
            url: urlGetRoomUseInfo,
            method: 'POST',
            disableCaching: false,
            params: paramsJson,
            success: function (response) {
                me.getRoomBookingView().setMasked(false);
                var roomsUseInfo = Ext.JSON.decode(response.responseText);
                // console.log(roomsUseInfo);
                me.getRoomBookingView().showRoomsInfo(roomsUseInfo);
            },
            failure: function (response) {
                me.getRoomBookingView().setMasked(false);
                me.getRoomBookingView().showMessages('访问失败');
            }
        });
    },

    onEmptyRoomSubmitCommand: function(roomId, beginTime, endTime) {
        var me = this;
        var view = this.getRoomBookingViaCertainRoomView();

        /* 通过roomId获取可选的会议类型 */
        view.updateMeetingType(roomId.split(':')[0]);

        /* 通过roomId获取设备类型 */
        var devices = null;
        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urlDeviceType = URLServer + '/baDevType/devTypeListByRoom/'  + roomId.split(':')[0];
        Ext.Ajax.request({
            url: urlDeviceType,
            method: 'GET',
            disableCaching: false,
            success: function (response) {
                devices = Ext.JSON.decode(response.responseText);
                view.showInfo(roomId, Ext.JSON.encodeDate(beginTime), Ext.JSON.encodeDate(endTime), devices);
                me.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'roombookingviacertainroom'}));
            },
            failure: function (response) {
                view.showMessages('获取设备列表失败');
            }
        });
    },

    onMtTypeChangeServices: function(view, mtTypeId) {
        var me = this;
        var services = null;

        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urlServiceType = URLServer + '/mtService/mtServiceList/'  + mtTypeId;
        Ext.Ajax.request({
            url: urlServiceType,
            method: 'GET',
            disableCaching: false,
            success: function (response) {
                services = Ext.JSON.decode(response.responseText);
                me.getRoomBookingViaCertainRoomView().showServices(services);
            },
            failure: function (response) {
               me.getRoomBookingViaCertainRoomView().showMessages('获取服务列表失败');
            }
        });
    },

    onBackButtonCommand: function (){
        window.history.go(-1);
    },

    onRoomBookButtonCommand: function (view, meetingObj, roomId, roomInfo){
        var me = this;
        var paramsObj = new Object();

        paramsObj.mtTypeId = meetingObj.mtTypeId;
        paramsObj.attendNum = meetingObj.attendNum;
        paramsObj.objectId= "1";
        paramsObj.sponsorId = '1';
        paramsObj.organizerId = meetingObj.userId;
        paramsObj.organizerName = Ext.getStore("UserInfo").getAt(0).get('userName');
        paramsObj.mtBeginTime = meetingObj.beginTime;
        paramsObj.mtEndTime = meetingObj.endTime;
        if (meetingObj.services == null) {
            paramsObj.hasService = 1;
        }
        else {
            paramsObj.hasService = 2;
            paramsObj.services = meetingObj.services;
        }        
        paramsObj.hasBoos = 1;
        paramsObj.postDate = Ext.JSON.encodeDate(new Date());
        paramsObj.mtFlag = 2;
        var at = {
            'userId': meetingObj.userId,
            'userName': paramsObj.organizerName,
            'flag': 1,
        };
        paramsObj.attenders = [at];
        paramsObj.roomIds = [roomId];
        paramsObj.operateFlag = 1;//操作标识 1-手机APP；2-网页 
        var paramsJson = Ext.JSON.encode(paramsObj);
        console.log(paramsJson);

        me.getRoomBookSuccessView().setMasked({
            xtype: 'loadmask',
            message: '正在加载中...'
        });

        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urlAddMeeting = URLServer + '/meeting/addMeeting/' ;
        Ext.Ajax.request({
            url: urlAddMeeting,
            method: 'POST',
            disableCaching: false,
            params: paramsJson,
            success: function (response) {
                me.getRoomBookSuccessView().setMasked(false);
                var ret = Ext.JSON.decode(response.responseText);
                if (ret.resultFlag == 0) {
                    me.getRoomSearchResultView().showMessages('申报会议失败');
                }
                else if (ret.resultFlag == 2) {
                    me.getRoomSearchResultView().showMessages('会议有冲突');
                }
                else if (ret.resultFlag == 1) {
                    me.getRoomBookSuccessView().showMeetingInfo(paramsObj, roomInfo, ret.result);
                    me.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'roombooksuccess'}));
                };
            },
            failure: function (response) {
                me.getRoomBookSuccessView().setMasked(false);
                me.getRoomSearchResultView().showMessages('访问服务失败');
            }
        });
    },
    
    onModifyMeetingInfoButtonCommand: function (mtDetails) {
        this.getMeetingRequestView().updateMeetingDetails(mtDetails);
        this.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'meetingrequest'}));
    },

    onMyMeetingsButtonCommand: function () {
        this.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'mymeetings'}));

    },

    onBacktoMainMenuCommand: function() {
        this.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'mainmenu'}));
    },

});

Ext.JSON.encodeDate = function(d) {
    return Ext.Date.format(d, 'Y-m-d H:i:s');
};