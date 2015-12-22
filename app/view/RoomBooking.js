/* 获取楼宇信息 */
var storeBuilding = Ext.create("Ext.data.Store", {
    proxy: {
        type: "ajax",
        url: 'http://meeting.crscd.com.cn:8080/mtservice/restService/0.1/baFloor/buildingList',
        enablePagingParams: false,
        reader: {
            type: 'json',
        }
    },
    fields: [
        { name: 'buildingId', type: 'string' },
        { name: 'buildingName', type: 'string' },
    ],
    data: [
    ]
});

/* 获取楼层信息 */
var storeFloor = Ext.create("Ext.data.Store", {
    proxy: {
        type: "ajax",
        url: 'http://meeting.crscd.com.cn:8080/mtservice/restService/0.1/baFloor/floorList/',
        enablePagingParams: false,
        reader: {
            type: 'json',
        }
    },
    fields: [
        { name: 'floorId', type: 'string' },
        { name: 'floorName', type: 'string' },
    ],
    data: [
    ]
});

Ext.define("IBApp.view.RoomBooking", {
    extend: "Ext.Panel",
    requires: ['Ext.form.FieldSet', 'Ext.ux.field.DateTimePicker', 'IBApp.store.MeetingType','IBApp.store.UrlAddr', 'IBApp.view.EmptyRoomTable'],
    xtype: 'roombookingview',
    config:{
        scrollable: false,
        layout: 'vbox',
    },
    initialize: function () {

        this.callParent(arguments);

        var backButton = {
        	xtype: 'button',
        	ui: 'back',
        	text: '首页',
        	handler: this.onBackButtonTap,
        	scope: this
        };

        var tagButton = Ext.create('Ext.SegmentedButton', {
            centered: true,
            items: [
                {
                    text: '快速推荐',
                    pressed: true
                },
                {
                    text: '查看空闲',
                }
            ],
            listeners: {
                toggle: function(container, button, pressed){
                   // alert("User toggled the '" + button.getText() + "' button: " + (pressed ? 'on' : 'off'));
                    if ((button.getText() == '快速推荐') && pressed) {
                        panelPages.setActiveItem(0);
                    }
                    else if ((button.getText() == '查看空闲') && pressed) {
                        panelPages.setActiveItem(1);
                    }
               }
           }
        });

        var topToolbar = {
        	xtype: 'toolbar',
        	docked: 'top',
        	// title: '预定会议室',
        	items: [backButton, tagButton]
        };

        /* 会议类型 */
        var meetingTypeSelector = Ext.create('Ext.field.Select', {
            name: 'mtTypeId',
            itemId: 'meetingTypeSelector',
            label: '会议类型',
            store: {xtype: 'meetingtypestore'},
            valueField: 'mtTypeId',
            displayField: 'mtTypeName',
            listeners: {
                change: { fn: this.onMeetingTypeChange, scope: this },
            },
        });

        /* 与会人数 */
        var attendanceEditor = {
        	xtype: 'numberfield',
        	name: 'attendNum',
        	label: '与会人数',
            value: 3,
        	minValue: 1,
        	maxValue: 1000,
        	increment: 1,
        };

		/* 会议开始时间 */
        var startDateTime = {
        	xtype: 'datetimepickerfield',
            id: 'beginTime',
        	name: 'beginTime',
        	label: '开始时间',
        	value: this.getDeltaDate(new Date(), 'minute', 2),
        	dateTimeFormat: 'Y-m-d H:i',
        	picker: {
        		minuteInterval: 15,
        		ampm: false,
        		slotOrder: ['year','month','day','hour','minute']
        	}
        };

        /* 会议结束时间 */
        var endDateTime = {
        	xtype: 'datetimepickerfield',
            id: 'endTime',
        	name: 'endTime',
        	label: '结束时间',
            value: this.getDeltaDate(new Date(), 'minute', 17),
        	dateTimeFormat: 'Y-m-d H:i',
        	picker: {
        		minuteInterval: 15,
        		ampm: false,
        		slotOrder: ['year','month','day','hour','minute']
        	}
        };

        /* 选择办公楼 */
        var buildingSelector = {
            xtype: 'selectfield',
            name: 'building',
            store: storeBuilding,
            id:'buildingSelectorid',
            width: 50,
            valueField: 'buildingId',
            displayField: 'buildingName',
            listeners: {
                change: { fn: this.onBuildingChange, scope: this },
            },
        };

        /* 选择楼层 */
        var floorSelector = {
            xtype: 'selectfield',
            name: 'floor',
            store: storeFloor,
            id: 'floorSelectorid',
            width: 50,
            valueField: 'floorId',
            displayField: 'floorName',
            listeners: {
                change: function() {
                },
            },
        };

        var checkRoomDate = Ext.create('Ext.field.DatePicker', {
            id: 'checkRoomDatePicker',
            width: 100,
            value: new Date(),
            dateFormat: 'Y-m-d',
        });

        var roomTable = new Ext.create('IBApp.view.EmptyRoomTable', {
            id: 'roomInfoTable',
            value: new Date(),
            height: 680,
        });

        var panelPages = Ext.create('Ext.Panel', {
            layout: {
                type: 'card',
                animation: 'fade',
            },
            flex: 1,
            items: [
                {
                    xtype: 'formpanel',
                    id: 'recommendBookingPanel',
                    items: [
                        {
                            xtype: 'fieldset',
                            items: [
                                attendanceEditor,
                                meetingTypeSelector,
                                startDateTime,
                                endDateTime,
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: '请选择所需设备',
                            itemId: 'devicesFieldset',
                        },
                        {
                            xtype: 'fieldset',
                            title: '请选择所需服务',
                            itemId: 'servicesFieldset',
                        },
                        {
                            xtype: 'button',
                            itemId: 'submitButton',
                            ui: 'action',
                            text: '搜索',
                            handler: this.onSubmitButtonTap,
                            scope: this
                        }
                    ],
                },
                {
                    xtype: 'panel',
                    layout: 'vbox',
                    scrollable: 'vertical',
                    directionLock: true,
                    items: [
                        {
                            xtype: 'panel',
                            margin: '10 0 10 10',
                            layout: 'hbox',
                            docked: 'top',
                            items: [
                                buildingSelector,
                                floorSelector,
                                checkRoomDate,
                                {
                                    xtype: 'button',
                                    text: '查看',
                                    handler: this.onCheckRoomBtnTap,
                                    scope: this
                                }
                            ]
                        },
                        roomTable,
                        {
                            xtype: 'button',
                            text: '预定',
                            docked: 'bottom',
                            handler: this.onEmptyRoomSubmitTap,
                            scope: this
                        }
                    ]
                }
            ]
        });

        this.add([
        	topToolbar,
        	panelPages,
        ]);

        panelPages.setActiveItem(0);
    },

    updateView: function() {
        var me = this;
        var userId = Ext.getStore("UserInfo").getAt(0).get('userId');
        this.updateMeetingTypeSelector(userId);
        this.updateMeetingTime();

        this.updateBuildingSelector();
        var task = Ext.create('Ext.util.DelayedTask', function() {
            me.onCheckRoomBtnTap();
        });
        task.delay(500);
    },

    onBackButtonTap: function() {
    	this.fireEvent("backToMainMenuCommand");
    },

    onSubmitButtonTap: function() {
        var panel = this.down('#recommendBookingPanel');
        var formValuesObj = panel.getValues(true, true);

        if(formValuesObj.services != null) {
            for (var i=0; i < formValuesObj.services.length; i++) {
                var serv = this.down('#service'+i);
                var obj = new Object();
                obj.serviceName = serv.getLabel();
                obj.serviceNum = serv.getValue();
                if (obj.serviceNum == null) {obj.serviceNum = 0;};
                formValuesObj.services[i] = obj;
            }
        }
        this.fireEvent('roomSearchSubmitCommand', this, formValuesObj);
    },

    updateMeetingTime: function() {
        this.down('#beginTime').setValue(this.getDeltaDate(new Date(), 'minute', 2));
        this.down('#endTime').setValue(this.getDeltaDate(new Date(), 'minute', 17));
    },

    updateMeetingTypeSelector: function(userId) {
        // mtTypeSelector.getStore().getProxy().setExtraParam('userId', userId);
        /* 目前GET方法采用的地址拼接的方式 */
        var mtTypeSelector = this.down('#meetingTypeSelector');
        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urltmp = URLServer + '/mtType/mtTypeListByUser/' ;
        mtTypeSelector.getStore().getProxy().setUrl(urltmp + userId);
        mtTypeSelector.getStore().load();
    },

    onMeetingTypeChange: function() {
        var mtTypeSelector = this.down('#meetingTypeSelector');
        var mtTypeId = mtTypeSelector.getValue();

        this.fireEvent('mtTypeChangeCommand', this, mtTypeId);
    },

    showDevices: function(devicesArray) {
        var deviceFieldset = this.down('#devicesFieldset');
        var arrLen = devicesArray.length;

        deviceFieldset.removeAll();

        for (var i=0; i < arrLen; i++) {
            var device = Ext.create('Ext.field.Checkbox', {
                name: 'devTypeIds',
                label: devicesArray[i].devTypeName,
                labelWidth: '80%',
                value: devicesArray[i].devTypeId
            });
            if (devicesArray[i].flag == 1) {
                device.check();
            }
            deviceFieldset.add(device);
        }
    },

    showServices: function(servicesArray) {
        var serviceFieldset = this.down('#servicesFieldset');
        var arrLen = servicesArray.length;

        serviceFieldset.removeAll();

        for (var i=0; i < arrLen; i++) {
            var service = Ext.create('Ext.field.Number', {
                name: 'services',
                itemId: 'service'+i,
                label: servicesArray[i].serviceName,
                placeHolder: '个数',
            });
            serviceFieldset.add(service);
        }
    },

    showMessages: function(message) {
        Ext.Msg.alert(message);
    },

    updateBuildingSelector: function() {
        storeBuilding.load();
    },

    onBuildingChange: function(selector, newValue, oldValue, eOpts) {
        var URLServer = Ext.getStore("UrlAddr").getAt(0).get('urlServer');
        var urltmp = URLServer + '/baFloor/floorList/';
        storeFloor.getProxy().setUrl(urltmp + newValue);
        storeFloor.load();
    },

    onCheckRoomBtnTap: function() {
        var userId = Ext.getStore("UserInfo").getAt(0).get('userId');
        var floorId = this.down('#floorSelectorid').getValue();
        var date = this.down('#checkRoomDatePicker').getValue();
        var day = date.getDate(),
            month = date.getMonth(),
            year = date.getFullYear();
        var beginTime = new Date(year, month, day,7,0,0);
        var endTime = new Date(year, month, day,23,0,0);
        
        this.fireEvent('checkRoomBtnTapCommand', userId, floorId, beginTime, endTime);
    },

    showRoomsInfo: function (roomsUseInfoArray) {
        var roomIds = [],
            tempRoomId = '';
        var cellInfo = [];

        for (var i = 0; i < roomsUseInfoArray.length; i++) {
            var tempObj = new Object();
            tempObj.roomId = roomsUseInfoArray[i].roomDTO.roomId + ':' + roomsUseInfoArray[i].roomDTO.roomNum;
            tempObj.roomDate = roomsUseInfoArray[i].roomDate;
            tempObj.roomFlag = roomsUseInfoArray[i].roomFlag;

            cellInfo.push(tempObj);

            if (roomIds.indexOf(tempObj.roomId) == -1) {
                roomIds.push(tempObj.roomId);
            };   
        };

        this.down('#roomInfoTable').updateTable(cellInfo, roomIds);
    },

    onEmptyRoomSubmitTap: function () {
        var obj = this.down('#roomInfoTable').getSelectionInfo();
        if (obj == null) {
            Ext.Msg.alert('请选择会议室');
        }
        else {
            console.log(obj);
            var roomId = obj.roomId;
            var beginTime = this.getDeltaDate(obj.begin, 'second', 1);
            var endTime = this.getDeltaDate(obj.end, 'minute', 30);
            this.fireEvent('emptyRoomSubmitCommand', roomId, beginTime, endTime);
        }
    },

    getDeltaDate: function(date, flag, delta){
        if (flag == 'minute') {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + delta);
        }
        else if (flag == 'second') {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() + delta);
        }

        return date;
    },
});