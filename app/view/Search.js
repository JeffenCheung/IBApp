Ext.define('IBApp.view.Search', {
    extend: 'Ext.Panel',
    xtype: 'searchview',
  
    requires:[
    	'Ext.form.FieldSet',
        'Ext.dataview.List',
        'IBApp.store.MyMeetingsSearch',
        'Ext.plugin.PullRefresh',
      
    ],
  
   config:{
        layout: {
            type: 'vbox',   
        },
    },
    initialize: function () {

        this.callParent(arguments);

        var backButton = {
        	xtype: 'button',
        	ui: 'back',
        	text: '后退',
        	handler: this.onBackButtonTap,
        	scope: this
        };

        var searchButton = {
            xtype: 'button',
            ui: 'action',
            iconCls: 'search',
            handler: this.onSearchTap,
        	scope: this
            
        };

        var searchragion = {
            xtype: 'searchfield',
            itemId: 'searchfielId',
            Width :'300px',
            placeHolder: '会议室名称/主办单位/会议主题',
           
        };
        var Slist = Ext.create('Ext.dataview.List', {
            flex: 1,
            onItemDisclosure: true,
            itemHeight: 70,
            // plugins: [ 
            // { 
            //       xclass: 'Ext.plugin.PullRefreshFn',
            //       pullRefreshText: 'Pull down for more new Tweets!' ,
            //       refreshFn: function() {  
            //              // Ext.getStore('ENTER YOUR STORE HERE').load('',1) 
            //              console.log('1111111111');
            //         } 
            // } 
            // ], 
            store: 'MyMeetingsSearch',
            itemTpl: ['<div class="list-item-title"><span style="display:inline-block;width:50%;white-space:nowrap;word-break:break-all;text-overflow:ellipsis;overflow:hidden;">{title}</span><span class="meeting-status {statusEn}">{status}</span></div>',
            '<div class="list-item-narrative">{location}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{startstr}&nbsp;~&nbsp;{endstr}</div>'
            ].join(""),
            emptyText: '<div class="notes-list-empty-text">没有会议</div>',
            listeners: {
                itemtap: { fn: this.onListTap, scope: this },
            },

        });

        this.add([
        	{
                xtype: 'toolbar',
                docked: 'top', 
                centered:true,
                items: [
                    backButton,
                    searchragion,
                    searchButton,
                ]
        	}, 
            Slist
        ]);

        Slist.on("itemtap",function(list,index,target,record,e,opt){  
        });
    },

    onBackButtonTap: function() {
        this.fireEvent("SearchToMyMeetingsCommand");
    },

    onSearchTap:function() {
        var me = this;
	    var keywordid= me.down('#searchfielId');
	      
	    var keyword = keywordid.getValue();
    	me.fireEvent('SearchCommand', me, keyword);
        
    },

    onListTap: function (list, index, target, record, e, eOpts) {
        this.fireEvent('searchMeetingsListCommand', record);
    },
});    


   
    
