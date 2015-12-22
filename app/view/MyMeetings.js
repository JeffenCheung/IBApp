Ext.define('IBApp.view.MyMeetings', {
	extend: 'Ext.Panel',
	xtype:'mymeetingsview',	
	requires:[
		'Ext.dataview.List',
    	'Ext.ux.TouchCalendar',
    	'Ext.ux.TouchCalendarView',
    	'Ext.ux.TouchCalendarSimpleEvents',
        'Ext.plugin.PullRefresh',
    ],

    config: {
    	fullscreen: true,
    	layout: 'fit',   
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

        var searchButton = {
            xtype: 'button',
            ui: 'action',
            iconCls: 'search',
            // text: '搜索',
            handler: this.onSearchButtonTap,
            scope: this
        };

    	var eventStore = Ext.create('IBApp.store.MyMeetingsEvent');

    	var calendar = new Ext.ux.TouchCalendarView({
            viewMode: 'month',
            weekStart: 0,
            value: new Date(),
            id:'calendarid',
            eventStore: eventStore,
            plugins: [Ext.create('Ext.ux.TouchCalendarSimpleEvents')]
        });

        var eventList = Ext.create('Ext.dataview.List', {
        	docked: 'bottom',
            onItemDisclosure: true,
            id:'eventListid',
        	height: 250,
            itemHeight: 70,
            style: 'border-top: 1px solid #f0f0f0',
        	itemTpl: ['<div class="list-item-title">{title}<span class="meeting-status {statusEn}">{status}</span><span class="list-item-narrative-reply">&nbsp;&nbsp;&nbsp;&nbsp;回复:{replyNum}/{attenderNum}</span></div>',
            '<div class="list-item-narrative">{location}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{startstr}&nbsp;~&nbsp;{endstr}</div>'
            ].join(""),
            plugins: [ 
            { 
                // var me = this;
                xclass: 'Ext.plugin.PullRefreshFn',
                pullRefreshText: '下拉获取更多。。。' ,
                refreshFn: function() {  
                    /*更新范围当月第一天到最后一天*/
                    var day = (new Date()).getDate(),
                    month = (new Date()).getMonth(),
                    year = (new Date()).getFullYear();
                    var bdate = new Date(year, month, 1,0,0);
                    var edate = new Date(year, month, Ext.Date.getDaysInMonth(bdate),24,0);
                    console.log(bdate);
                    console.log(edate);
                    this.getParent().getParent().onUpdateMyCalendarTap(bdate,edate);
                } 
            } 
            ], 
            emptyText: '<div class="notes-list-empty-text">没有会议</div>',
        	store: new Ext.data.Store({
                model: 'IBApp.model.MyMeetingsEvent',
                data: []
            }),

            listeners: {

                itemtap: { fn: this.onMeetingsListTap, scope: this },
                initialize: function(list) {
                    var today = Ext.Date.clearTime(new Date(), true).getTime();
                    calendar.eventStore.clearFilter();
                    calendar.eventStore.filterBy(function(record){
                        var startDate = Ext.Date.clearTime(record.get('start'), true).getTime(), 
                            endDate = Ext.Date.clearTime(record.get('end'), true).getTime();
                            
                        return (startDate <= today) && (endDate >= today);
                    }, this);
                    list.getStore().setData(calendar.eventStore.getRange());    

                }
            }
        });

        this.add([
        	calendar, 
        	{
                xtype: 'toolbar',
                docked: 'top',
                title: '我的会议',
                items: [
                    backButton,
                    { xtype: 'spacer' },
                    searchButton
                ]
        	}, 
        	eventList
        	]
        ); 

		calendar.on('selectionchange', function(calendarview, newDate, prevDate){
		    // var eventList = this.getDockedItems()[1];
            calendar.eventStore = Ext.getStore("MyMeetingsEvent");
		    
            calendar.eventStore.clearFilter();
		    calendar.eventStore.filterBy(function(record){
		        var startDate = Ext.Date.clearTime(record.get('start'), true).getTime(), 
                endDate = Ext.Date.clearTime(record.get('end'), true).getTime();
                return (startDate <= newDate) && (endDate >= newDate);
		    }, this);

		    eventList.getStore().setData(calendar.eventStore.getRange());
		});

        calendar.on('periodchange', function(calendarview, minDate, maxDate,direction, eOpts){
            console.log('periodchange');
            console.log(maxDate);
            console.log(minDate);
            console.log(direction);

            this.getParent().onUpdateMyCalendarTap(minDate,maxDate);


        });

		calendar.on('eventtap', function(event){
		    console.log('eventtap');
		});

		calendar.on('eventdragstart', function(draggable, eventRecord, e){
		    console.log('eventdragstart');
		});
		calendar.on('beforeeventdrop', function(draggable, eventRecord, e){
		    console.log('beforeeventdrop');
		    return true;
		});
		calendar.on('eventdrop', function(draggable, eventRecord, e){
		    console.log('eventdrop');
		});
		calendar.on('eventdrag', function(draggable, eventRecord, e){
		    console.log('eventdrag');
		});

        eventList.on("itemtap",function(list,index,target,record,e,opt){  
        });
    },


    onPushContentCommand:function () {
        this.fireEvent('pushContentCommand');
    },


    onMeetingsListTap: function (list, index, target, record, e, eOpts) {
             
     
        this.fireEvent('meetingsListCommand', record);
    },


    onBackButtonTap: function() {
        this.fireEvent("MyMeetingsToMainMenuCommand");
    },

    onSearchButtonTap: function() {
        this.fireEvent("searchviewCommand");
    },

    onUpdateMyCalendarTap: function(bdate,edate) {
        this.fireEvent("updateMyCalendarCommand",bdate,edate);
    },



    updateEventStore:function(){

        var calendarid = this.down('#calendarid');
        var eventListid = this.down('#eventListid');
        //更新Calendar的Store信息
        calendarid.eventStore = Ext.getStore("MyMeetingsEvent");
        //进入页面后自动显示今天页面
        var today = Ext.Date.clearTime(new Date(), true).getTime();
        calendarid.eventStore.clearFilter();
        calendarid.eventStore.filterBy(function(record){
            var startDate = Ext.Date.clearTime(record.get('start'), true).getTime(), 
            endDate = Ext.Date.clearTime(record.get('end'), true).getTime();        
            return (startDate <= today) && (endDate >= today);
        }, this);

        eventListid.getStore().setData(calendarid.eventStore.getRange());

        console.log('eventListid.getStore():'+ calendarid.eventStore.getCount()  +'\n');
        calendarid.refresh();


    },

});