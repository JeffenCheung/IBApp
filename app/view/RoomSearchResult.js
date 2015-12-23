var obj = new Object();
var recommendRoomsNumber = 0;

Ext.define('IBApp.view.RoomSearchResult', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.Toolbar',
        'Ext.Button',
        'Ext.Panel',
        'Ext.dataview.List',
        'Ext.XTemplate',
        'Ext.field.Radio'
    ],
    xtype: 'roomsearchresultview',
    id: 'form',

    config: {
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',
                title: '预定会议室',
                items: [
                    {
                        xtype: 'button',
                        itemId: 'backButton',
                        ui: 'back',
                        text: '后退'
                    }
                ]
            },
            {
                xtype: 'fieldset',
                itemId: 'roomListFieldset',
                title: '我们已成功为您找到以下会议室，快点抢占吧~',
            },
            {
                xtype: 'button',
                itemId: 'roomBookButton',
                ui: 'action',
                text: '预定',
            }
        ],
        listeners: [
            {
                fn: 'onBackButtonTap',
                event: 'tap',
                delegate: '#backButton'
            },
            {
                fn: 'onRoomBookButtonTap',
                event: 'tap',
                delegate: '#roomBookButton'
            }
        ]
    },

    onBackButtonTap: function(button, e, eOpts) {

        this.fireEvent("backButtonCommand");
    },

    onRoomBookButtonTap: function() {
        var checkedRoomInfo = '';
        for (var i=0; i < recommendRoomsNumber; i++) {
            var room = this.down('#room'+i);
            if( room.isChecked() ) {
                checkedRoomInfo = this.removeHTMLTag(room.getLabel());
                break;
            }
        }

        this.fireEvent("roomBookButtonCommand", this, obj, this.getValues().roomIds, checkedRoomInfo);
    },

    showRoomList: function(meetingObj, recommendRoomsArray) {
        obj = meetingObj;

        var roomBookButton = this.down('#roomBookButton');
        var roomListFieldset = this.down('#roomListFieldset');
        roomListFieldset.removeAll();

        recommendRoomsNumber = recommendRoomsArray.length;

        if (recommendRoomsNumber == 0) {
            roomListFieldset.setTitle('对不起，没有找到合适的会议室');
            roomBookButton.setHidden(true);
        }
        else {
            roomListFieldset.setTitle('成功为您找到<span style="color:blue;font-size:1.5em">'+recommendRoomsNumber+'</span>个会议室，快点抢占吧~');
            for (var i=0; i < recommendRoomsNumber; i++) {
                var room = Ext.create('Ext.field.Radio', {
                    name: 'roomIds',
                    itemId: 'room'+i,
                    labelWrap: true,
                    labelWidth: '80%',
                    label: [
                        '<div class="list-item-title">'+recommendRoomsArray[i].roomName+'&nbsp;</div>',
                        '<div class="list-item-narrative">'+recommendRoomsArray[i].building+'&nbsp;>&nbsp;'+recommendRoomsArray[i].floorName+'&nbsp;>&nbsp;'+recommendRoomsArray[i].roomNum+'&nbsp;&nbsp;&nbsp;&nbsp;容量:'+recommendRoomsArray[i].roomMaxSize+'</div>',
                    ].join(''),
                    value: recommendRoomsArray[i].roomId
                });
                if(i==0) {
                    room.check();
                }

                roomListFieldset.add(room);
            }

            roomBookButton.setHidden(false);
        }
    },

    showMessages: function(message) {
        Ext.Msg.alert(message);
    },

    removeHTMLTag: function(str) {
        str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
        str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
        //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
        str=str.replace(/&nbsp;/,' > ');//去掉&nbsp;
        str=str.replace(/&nbsp;/ig,' ');//去掉&nbsp;
        return str;
    }

});