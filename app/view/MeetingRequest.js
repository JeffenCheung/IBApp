var attenders = Ext.create('Ext.data.Store', {
  model: 'IBApp.model.Attenders',
  data: [],
});

var mtObj = new Object();


Ext.define('IBApp.view.MeetingRequest', {
    extend: 'Ext.form.Panel',
    xtype: 'meetingrequestview',
  
    requires:[
    	'Ext.form.FieldSet',
        'Ext.field.DatePicker',
        'Ext.MessageBox',
        'Ext.ActionSheet',
        'Ext.ux.field.DateTimePicker',
        'Ext.ux.picker.DateTime',
        'IBApp.store.PlaceType'
    ],
  
   config:{
    },
    initialize: function () {

        this.callParent(arguments);

        var backButton = {
        	xtype: 'button',
        	ui: 'back',
        	handler: this.onBackButtonTap,
        	scope: this
        };

        /*编辑按钮*/
        var editButton = {
            xtype:'button',
            iconCls: 'more',
            ui:'action',
            id:'edit',
            handler:function(){
                var Role = Ext.getStore("UserInfo").getAt(0).get('userId');              
                console.log(Role);
                if (Role == mtObj.organizerId)
                {
                  var items = [
                  {
                      text:'回复',
                      // ui:'decline',
                      scope:this,
                      handler:this.onReplyTap,
                  },
                  {
                      text:'编辑',
                      scope:this,
                      handler: this.onEditButtonTap,
                  },
                  {
                      xtpye:'button',
                      text:'取消会议',
                      scope:this,
                      handler:this.onCancelMeetingTap,     
                  },   
                  {
                      xtpye:'button',
                      text:'结束会议',
                      scope:this,
                      handler:this.onEndMeetingTap,     
                  }, 
                  {
                      xtpye:'button',
                      text:'Cancel',
                      scope:this,
                      handler:function(){
                          this.actions.hide();     
                      }
                  }, 
                  ];
                }
                else
                {
                  var items = [
                  {
                      text:'回复',
                      ui:'decline',
                      scope:this,
                      handler:this.onReplyTap,
                  },
                  {
                      xtpye:'button',
                      text:'Cancel',
                      scope:this,
                      handler:function(){
                          this.actions.hide();     
                      }
                  }, 
                  ];
                }
                if(!this.actions){
                    this.actions = Ext.create('Ext.ActionSheet',{
                       items:items  
                   });
               }
               Ext.Viewport.add(this.actions);
               this.actions.show();
            },
            scope: this
        };

        var topToolbar = {
            xtype: 'toolbar',
            docked: 'top',
            title: '会议详情',
            items: [
            backButton,
            { xtype: 'spacer' },
            editButton
            ]
        };

        /* 会议详情表单各控件的name值与model保持一致，用于setRecord */      

        /*会议名称*/
        var meetingNameText = {
        	xtype: 'textfield',
        	// name: 'title',
        	label: '名称',
          id:'meetingNameTextid',
          readOnly:true,
        };
        
	      /* 会议开始时间 */
        var startDateTime = {
          	xtype: 'datetimepickerfield',
          	// name: 'start',
          	label: '开始时间',
            id:'startDateTimeid',
            readOnly:true,
          	// value: new Date(),
          	dateTimeFormat: 'Y-m-d H:i',
          	picker: {
          	minuteInterval: 15,
          	ampm: false,
          	slotOrder: ['year','month','day','hour','minute'],
            doneButton: '确定',
            cancelButton: '取消',
        	}
        };

        /* 会议结束时间 */
        var endDateTime = {
        	xtype: 'datetimepickerfield',
        	// name: 'end',
        	label: '结束时间',
          id:'endDateTimeid',
          readOnly:true,
        	// value: new Date(),
        	dateTimeFormat: 'Y-m-d H:i',
        	picker: {
        		minuteInterval: 15,
        		ampm: false,
        		slotOrder: ['year','month','day','hour','minute'],
            doneButton: '确定',
            cancelButton: '取消',
        	}
        };
        
        /* 地点 */
        var placeTypeText = {
          xtype: 'textfield',
        	// name: 'location',
        	label: '地点',
          id:'placeTypeTextid',
          readOnly:true,
        };

        /*组织者*/
        var organizerNameText = {
        	xtype: 'textfield',
        	// name: 'organizerName',
        	label: '组织者',
          id:'organizerNameTextid',
          readOnly:true,
        };
        
        /*与会人员*/
        var participatorNameText = {
        	xtype: 'textareafield',
        	// name: 'participants',
        	label: '与会人员',
          id:'participatorNameTextid',
          readOnly:true,
          width: '93%',
        };
        
        /*服务*/
        var serviceText = {
        	xtype: 'textfield',
        	// name: 'services',
        	label: '服务',
          id:'serviceTextid',
          readOnly:true,
        };

        /*会议摘要*/
        var meetingText = {
            xtype: 'textareafield',
            label: '会议摘要',
            // name: 'mtContent',
            readOnly:true,
            id:'meetingTextid',
        };

        /*提交按钮*/
        var requestBotton = {
            xtype:'button',
            cls:'demobtn',
            id:'requestBottonid',
            margin:'10 0',
            hidden: true,
            text:'提交申请',
            model:false,
            handler: this.onSubmitButtonTap,
            scope: this
     
        };

        /*隐藏信息*/
        var meetingIdText = {
          xtype: 'hiddenfield',
          name: 'meetingId',
        };
        var eventText = {
          xtype: 'hiddenfield',
          name: 'event',
        };
        var statusText = Ext.create('Ext.field.Hidden', {
          name: 'status',
          id: 'statusText'
        });
        var statusEnText = {
          xtype: 'hiddenfield',
          name: 'statusEn',
          id: 'statusEnText'
        };

        var meetingStatusLabel = {
          xtype: 'label',
          id: 'meetingStatusLabel'
        };

        this.add([
        	topToolbar,
          {
            xtype: 'fieldset',
            items: [
              meetingStatusLabel,
              meetingNameText,
              startDateTime,
              endDateTime,
              placeTypeText,
              organizerNameText,
              {
                xtype: 'panel',
                layout: 'hbox',
                items: [
                  participatorNameText,
                  {xtype: 'button',
                    id: 'participatorModifyBtn',
                    baseCls: 'participatorIcon',
                    hidden: true,
                    scope: this,
                    handler: this.onParticipatorModifyBtn,
                  }
                ]
              },
              serviceText,
              meetingText,
              meetingIdText,
              eventText,
              statusText,
              statusEnText
            ]
          },
          requestBotton,

        ]);
    },

    onBackButtonTap: function() {
      	this.fireEvent("meetingRequestToMyMeetingsCommand");
        this.onNoEditButtonTap();
    },

    onEditButtonTap:function(){
        var me = this;
        var MeetingNT = me.down('#meetingNameTextid');
        var organizerNT = me.down('#organizerNameTextid');
        var participatorMB = me.down('#participatorModifyBtn');
        var requestB = me.down('#requestBottonid');
        var meetingT = me.down('#meetingTextid');

        MeetingNT.setReadOnly(false);
        participatorMB.setHidden(false);
        requestB.setHidden(false);
        meetingT.setReadOnly(false);

        this.actions.hide(); 

    },

    onNoEditButtonTap:function(){
        var me = this;
        var MeetingNT = me.down('#meetingNameTextid');
        var organizerNT = me.down('#organizerNameTextid');
        var participatorMB = me.down('#participatorModifyBtn');
        var requestB = me.down('#requestBottonid');
        var meetingT = me.down('#meetingTextid');

        MeetingNT.setReadOnly(true);
        participatorMB.setHidden(true);
        requestB.setHidden(true);
        meetingT.setReadOnly(true);

    },

    onSubmitButtonTap: function() {
        mtObj.mtTheme = this.down('#meetingNameTextid').getValue();
        mtObj.mtContent = this.down('#meetingTextid').getValue();

        mtObj.attenders = [];
        for (var i = 0; i < attenders.getCount(); i++) {
            var at = new Object();
            at.userId = attenders.getAt(i).get('userId');
            at.userName = attenders.getAt(i).get('userName');
            at.flag = attenders.getAt(i).get('flag');
            mtObj.attenders.push(at);
        };
        mtObj.operateFlag = 1; //操作标识 1-手机APP；2-网页
        this.fireEvent("meetingRequestModifyDetailsCommand", mtObj);
        this.onNoEditButtonTap();
    },

    onParticipatorModifyBtn: function() {
        this.fireEvent("participatorModifyCommand", attenders);
    },

    setParticipator: function(mtAttenders, store) {
        attenders.removeAll();
        var len = store.getCount();
        for (var i = 0; i < len; i++) {
            attenders.add(store.getAt(i));
        };
        this.down('#participatorNameTextid').setValue(mtAttenders);
    },

    onReplyTap: function() {
          var me = this;
          Ext.Msg.show({
            title: '参会回复',
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
                itemId: 'cancel'
              } 
            ],
            fn: function(button) {
              var mtReplyObj = new Object();
              if (button == '取消')
              {
                me.actions.hide();
              }
              if (button == '参会') {
                mtReplyObj.replyResult = 1;
                mtReplyObj.replyerId = Ext.getStore("UserInfo").getAt(0).get('userId');
                mtReplyObj.replyerFlag = 1; //回复人标识 1.内部人员2.外部人员 
                mtReplyObj.replyDate =Ext.JSON.encodeDate(new Date());//回复日期
                mtReplyObj.meetingId = mtObj.mtId;//会议ID
                mtReplyObj.replyMethod = 1; //回复方式1.手机APP 2.网页 3.短信 
                me.fireEvent("mtReplyCommand", mtReplyObj);
              };
              if (button == '不参会') {
                mtReplyObj.replyResult = 2;
                mtReplyObj.replyerId = Ext.getStore("UserInfo").getAt(0).get('userId');
                mtReplyObj.replyerFlag = 1; //回复人标识 1.内部人员2.外部人员 
                mtReplyObj.replyDate =Ext.JSON.encodeDate(new Date());//回复日期
                mtReplyObj.meetingId = mtObj.mtId;//会议ID
                mtReplyObj.replyMethod = 1; //回复方式1.手机APP 2.网页 3.短信 
                me.fireEvent("mtReplyCommand", mtReplyObj);
              };
              if (button == '未定') {
                mtReplyObj.replyResult = 3;  
                mtReplyObj.replyerId = Ext.getStore("UserInfo").getAt(0).get('userId');
                mtReplyObj.replyerFlag = 1; //回复人标识 1.内部人员2.外部人员 
                mtReplyObj.replyDate =Ext.JSON.encodeDate(new Date());//回复日期
                mtReplyObj.meetingId = mtObj.mtId;//会议ID
                mtReplyObj.replyMethod = 1; //回复方式1.手机APP 2.网页 3.短信 
                me.fireEvent("mtReplyCommand", mtReplyObj);
              };
              
            }
          });
          me.actions.hide();
      },

    onCancelMeetingTap:function() {
      var me = this;
      var mtCancelobj = new Object();
      
      mtCancelobj.changeFlag = 1;
      mtCancelobj.mtId = mtObj.mtId;
      this.fireEvent("mtCancelCommand", mtCancelobj);
      me.actions.hide(); 
    },

    onEndMeetingTap:function() {
      var me = this;
      var mtCancelobj = new Object();
      
      mtCancelobj.changeFlag = 4;  //更改标识 1.取消会议2.推迟会议3.延长会议4.结束会议5.基本变更
      mtCancelobj.mtId = mtObj.mtId;  
      this.fireEvent("mtCancelCommand", mtCancelobj);
      me.actions.hide(); 
    },

    updateMeetingDetails: function(details) {
        console.log('new details');
        console.log(details);
        var attendersstr = null;
        var servicesstr = null;
        var placestr = null;
        var mtThemestr = null;

        mtObj = details;

        if(details.mtFlag == 1)
        {
            strEn = 'checking';
            str = '正在审核';
        }
        if(details.mtFlag == 2)
        {
            strEn = 'waiting';
            str = '未开始';

            var now = new Date().getTime();
            console.log(details.start);
            var startDate = new Date(details.mtBeginTime).getTime();
                        
            if( startDate <= now )
            {
                strEn = 'begining';
                str = '进行中';
            }
        }
        if(details.mtFlag == 3)
        {
            strEn = 'closed';
            str = '已结束';
        }
        if(details.mtFlag == 4)
        {
            strEn = 'canceled';
            str = '已取消';
        }
        if(details.mtFlag == 5)
        {
            strEn = 'draft';
            str = '草稿';
        }
        if(details.mtFlag == 6)
        {
            strEn = 'deleted';
            str = '删除';
        }
        //添加会议状态样式
        this.down('#meetingStatusLabel').setHtml([
            '<p>',
            str,
            '</p>'
          ].join(""));
        this.down('#meetingStatusLabel').setCls([
          'detail-meeting-status ',
          strEn
        ].join(""));


        if(null == details.mtTheme)
        {
          mtThemestr = '待定';
        }
        else
        {
          mtThemestr = details.mtTheme;
        }

        /*添加与会人员*/
        attenders.removeAll();
        if(null != details.attenders)
        {
          for(var i = 0; i< details.attenders.length; i++)
          {
              var curAttender = Ext.create('IBApp.model.Attenders', {
               'userId': details.attenders[i].userId,
               'userName': details.attenders[i].userName,
               'flag': details.attenders[i].flag,
              });
              attenders.add(curAttender);
              if(null != curAttender.get('userName'))
              {
                attendersstr += curAttender.get('userName') + ';';
                attendersstr = attendersstr.replace("null","");
              }
          };
        }       
        /*添加服务*/
        if(null != details.services)
        {
          for(var i = 0; i< details.services.length; i++)
          {
              if(null != details.services[i])
              {
                servicesstr += details.services[i].serviceName +':' + details.services[i].serviceNum + ';';
                servicesstr = servicesstr.replace("null","");
              }
          };
        }
        /*添加地点*/
        if(null != details.rooms)
        {
          for(var i = 0; i< details.rooms.length; i++)
          {
              if(null != details.rooms[i])
              {
                placestr += details.rooms[i].roomNum + ';';
                placestr = placestr.replace("null","");
              }
          };
        }
        /*向各控件里添加值*/
        var me = this;
        var MeetingNT = me.down('#meetingNameTextid');
        var startDT = me.down('#startDateTimeid');
        var endDT = me.down('#endDateTimeid');
        var placeT = me.down('#placeTypeTextid');

        var organizerNT = me.down('#organizerNameTextid');
        var participatorN = me.down('#participatorNameTextid');
        var serviceT = me.down('#serviceTextid');
        var meetingT = me.down('#meetingTextid');

        MeetingNT.setValue(mtThemestr);
        startDT.setValue(new Date(details.mtBeginTime));
        endDT.setValue(new Date(details.mtEndTime));
        placeT.setValue(placestr);

        organizerNT.setValue(details.organizerName);
        participatorN.setValue(attendersstr);
        serviceT.setValue(servicesstr);
        meetingT.setValue(details.mtContent);
    },
});       
        
    
Ext.JSON.encodeDate = function(d) {
    return Ext.Date.format(d, 'Y-m-d H:i:s');
};