var devStore = Ext.create('Ext.data.Store', {
	fields: [
	    { name: 'controlId', type: 'string' },
	    { name: 'instanceId', type: 'string' },
	    { name: 'instanceType', type: 'string' },
	    { name: 'instanceFlag', type: 'string' },
	    { name: 'instanceValue', type: 'string' },
	    { name: 'groupId', type: 'string' },
	    { name: 'groupName', type: 'string' },
	    { name: 'devName', type: 'string' },
	    { name: 'parentId', type: 'string' },
        { name: 'devId', type: 'string' },
	],
    data: [
    ]
});

var groupNames = [];

Ext.define('IBApp.view.DeviceControlSimple', {
    extend: 'Ext.Panel',
    xtype: 'devicecontrolsimpleview',

    requires:[
    ],

    config:{
        layout: {
            type: 'vbox',
        },
        scrollable: 'vertical',
    },

    initialize: function () {

        this.callParent(arguments);

        var backButton = {
            xtype: 'button',
            ui: 'back',
            handler: this.onBackButtonTap,
            scope: this
        };

        var topToolbar = {
            xtype: 'toolbar',
            docked: 'top',
            title: '设备控制',
            items: [backButton]
        };

        this.add([
            topToolbar,
        ]);
    },

    onBackButtonTap: function() {
    	this.fireEvent("backButtonCommand");
    },

    showDevices: function(devInfoArray) {
    	var me = this;
    	/* 数据存储 */
    	groupNames = [];
        devStore.removeAll();
        this.removeAll();
        console.log('devInfoArray');
        console.log(devInfoArray);

    	for (var i = 0; i < devInfoArray.length; i++) {
    		devStore.add({
    			controlId: devInfoArray[i].groupId + devInfoArray[i].devId + devInfoArray[i].instanceFlag,
    			instanceId: devInfoArray[i].instanceId,
    			instanceType: devInfoArray[i].instanceType,
    			instanceFlag: devInfoArray[i].instanceFlag,
    			instanceValue : devInfoArray[i].instanceValue,
    			groupId: devInfoArray[i].groupId,
    			groupName: devInfoArray[i].groupName,
    			devName: devInfoArray[i].devName,
                parentId: devInfoArray[i].parentId,
    			devId: devInfoArray[i].devId,

    		});

    		if (groupNames.indexOf(devInfoArray[i].groupName) == -1) {
    			groupNames.push(devInfoArray[i].groupName);
    		};
    	};

    	/* 数据提取，显示控件 */
    	for (var i = 0; i < groupNames.length; i++) {

    		devStore.clearFilter();
    		devStore.filter([
    		    {property: 'groupName', value: groupNames[i]},
    		    {property: 'instanceFlag', value: 'I'},
    		]);
    		var dataArray = devStore.getRange();

    		var fieldset = Ext.create('Ext.form.FieldSet', {
    			title: groupNames[i],
    		});

    		if ( groupNames[i].indexOf('B-ZC') != -1 ) {
                console.log('B-ZC');
    			for (var j = 0; j < dataArray.length; j++) {
    				if (dataArray[j].get('devName') == '情景模式') {
    					fieldset.setTitle('情景模式');
    					var sceneSelector = Ext.create('Ext.field.Select', {
				            itemId: dataArray[j].get('controlId').replace('I', ''),
				            options: [
                                {type: '进入模式',  id: '1'},
				                {type: '照明模式',  id: '3'},
				                {type: '离开模式', id: '2'},
				            ],
				            valueField: 'id',
				            displayField: 'type',
				            listeners: {
				                change: function(selector, newValue, oldValue, eOpts) {
				                	var index = devStore.findExact('controlId', selector.getItemId()+'O');
                                    console.log('selector.getItemId()');
                                    console.log(selector.getItemId());
				                	console.log(index);
				                	if (index != -1) {
				                		me.controlDev(devStore.getAt(index).get('parentId'), devStore.getAt(index).get('instanceType'), devStore.getAt(index).get('instanceId'), newValue);
				                	};
				                },
				            },
				        });
				        sceneSelector.setValue(dataArray[j].get('instanceValue'));
				        fieldset.add(sceneSelector); 
    				};
    			}
    		}
    		else if ( (groupNames[i].indexOf('三路灯光') != -1) || (groupNames[i].indexOf('四路灯光') != -1) ) {
    			console.log('三四路灯光');
                var connect = dataArray[0].get('instanceValue');
                console.log('连接状态：1未连接 2已连接 3故障');
                console.log(connect);
                if('2' == connect) 
                {
                    for (var j = 1; j < dataArray.length; j++) {      
        				var toggle = Ext.create('Ext.field.Toggle', {
        					label: dataArray[j].get('devName'),
                            labelWidth: '50%',
        					itemId: dataArray[j].get('controlId').replace('I', ''),
        					value: parseInt(dataArray[j].get('instanceValue')),
        					listeners: {
        					    change: function(field, newValue, oldValue) {
    				                var index = devStore.findExact('controlId', field.getItemId()+'O');
                                    console.log('field.getItemId()');
                                    console.log(field.getItemId());
    				                console.log(index);
    				                if (index != -1) {
    				                	me.controlDev(devStore.getAt(index).get('parentId'), devStore.getAt(index).get('instanceType'), devStore.getAt(index).get('instanceId'), newValue.toString());
    				                };
    				            }
        					}
        				});
    				    fieldset.add(toggle);     
        			};
                }
                else
                {
                    fieldset.setTitle( groupNames[i] +":" + '请现场控制' );
                }
    		}
    		else if (groupNames[i].indexOf('温控器') != -1) {
                console.log('温控器');
                var connect = dataArray[0].get('instanceValue');
                console.log('温控器连接状态：1未连接 2已连接 3故障');
                console.log(connect);
                if('2' == connect)
                { 
        			for (var j = 1; j < dataArray.length; j++) {                       
        				if (dataArray[j].get('devName') == '温控器开关') {
                            console.log('温控器开关');
    	    				var ctrl = Ext.create('Ext.field.Toggle', {
    	    					label: dataArray[j].get('devName'),
                                labelWidth: '50%',
    	    					itemId: dataArray[j].get('controlId').replace('I', ''),
    	    					value: parseInt(dataArray[j].get('instanceValue')),
    	    					listeners: {
    	    					    change: function(field, newValue, oldValue) {
    					                var index = devStore.findExact('controlId', field.getItemId()+'O');
                                        console.log('field.getItemId()');
                                        console.log(field.getItemId());
    					                if (index != -1) {
    					                	me.controlDev(devStore.getAt(index).get('parentId'), devStore.getAt(index).get('instanceType'), devStore.getAt(index).get('instanceId'), newValue.toString());
    					                };
    					            }
    	    					}
    	    				});
    	    			    fieldset.add(ctrl);
                        }
        				else if (dataArray[j].get('devName') == '温控器设置温度') {
                            console.log('温控器设置温度');
    						var ctrl = Ext.create('Ext.field.Spinner', {
    							itemId: dataArray[j].get('controlId').replace('I', ''),
    						    label     : dataArray[j].get('devName'),
                                labelWidth: '50%',
    						    value: dataArray[j].get('instanceValue'),
    						    minValue  : 0,
    						    maxValue  : 100,
    						    stepValue : 2,
    						    cycle     : true,
    						    listeners: {
    	    					    change: function(field, newValue, oldValue) {
    					                var index = devStore.findExact('controlId', field.getItemId()+'O');
                                            console.log('field.getItemId()');
                                            console.log(field.getItemId());
    					                	if (index != -1) {
    					                	me.controlDev(devStore.getAt(index).get('parentId'), devStore.getAt(index).get('instanceType'), devStore.getAt(index).get('instanceId'), newValue);
    					                };
    					            }
    	    					}
    						});
    	    				fieldset.add(ctrl);
        				}
        				else if (dataArray[j].get('devName') == '温控器风量') {
                            console.log('温控器风量');
                           //0001H 低风、0002H 中风、0003H 高风、0081H 自动低风、0082H 自动中风、0083H 自动高风
        					var ctrl  = Ext.create('Ext.SegmentedButton', {
        						itemId: dataArray[j].get('controlId').replace('I', ''),
        						allowMultiple: false,
        						items: [
        						    {
        						        text: '低风',
        						        id: 'wind0001H',
        						    },
        						    {
        						        text: '中风',
        						        id: 'wind0002H',
        						        // pressed: true
        						    },
        						    {
        						        text: '高风',
        						        id: 'wind0003H',
        						    }
        						],
        						listeners: {
                                    initialize: function(container) {
                                        if('1' == dataArray[j].get('instanceValue')){this.setPressedButtons( 'wind0001H' );}
                                        else if('2' == dataArray[j].get('instanceValue')){this.setPressedButtons( 'wind0002H' );}
                                        else if('3' == dataArray[j].get('instanceValue')){this.setPressedButtons( 'wind0003H' );}
                                        else if('129' == dataArray[j].get('instanceValue')){this.setPressedButtons( 'wind0001H' );}
                                        else if('130' == dataArray[j].get('instanceValue')){this.setPressedButtons( 'wind0002H' );}
                                        else if('131' == dataArray[j].get('instanceValue')){this.setPressedButtons( 'wind0003H' );};
                                    },
        						    toggle: function(container, button, pressed){
        						        var index = devStore.findExact('controlId', container.getItemId()+'O');
    						        	if (index != -1) {
    						        		me.controlDev(devStore.getAt(index).get('parentId'), devStore.getAt(index).get('instanceType'), devStore.getAt(index).get('instanceId'), button.getId().replace('wind',''));
        						        };
        						    }
        						}
        					});
        					fieldset.add(ctrl);
        				}
        				else if (dataArray[j].get('devName') == '温控器模式') {
                            console.log('温控器模式');
                            //0001H 制冷、0002H 制热、0003H 通风
        					var ctrl  = Ext.create('Ext.SegmentedButton', {
        						itemId: dataArray[j].get('controlId').replace('I', ''),
        						allowMultiple: false,
        						items: [
        						    {
        						        text: '制冷',
        						        id: 'temp0001H',
        						    },
        						    {
        						        text: '制热',
        						        id: 'temp0002H',
        						        // pressed: true
        						    },
        						    {
        						        text: '通风',
        						        id: 'temp0003H',
        						    }
        						],
        						listeners: {
                                    initialize: function(container) {
                                        if('1' == dataArray[j].get('instanceValue')){this.setPressedButtons( 'temp0001H' );}
                                        else if('2' == dataArray[j].get('instanceValue')){this.setPressedButtons( 'temp0002H' );}
                                        else if('3' == dataArray[j].get('instanceValue')){this.setPressedButtons( 'temp0003H' );};

                                    },
        						    toggle: function(container, button, pressed){
        						        var index = devStore.findExact('controlId', container.getItemId()+'O');
                                        console.log('container.getItemId()');
                                        console.log(container.getItemId());
    						        	if (index != -1) {
    						        		me.controlDev(devStore.getAt(index).get('parentId'), devStore.getAt(index).get('instanceType'), devStore.getAt(index).get('instanceId'), button.getId().replace('temp',''));
        						        };
        						    }
        						}
        					});
        					fieldset.add(ctrl);
        				};                                               
        			};
                }
                else
                {
                    fieldset.setTitle( groupNames[i] +":" + '请现场控制' );
                }
    		}
    		else if (groupNames[i].indexOf('投影仪') != -1) {
                console.log('投影仪');
    			for (var j = 0; j < dataArray.length; j++) {
                    //"instanceDis":"1关闭保护 2开启保护 3关闭 4开启"
                    console.log(dataArray[j].get('instanceValue'));
                    if('1' == dataArray[j].get('instanceValue')){dataArray[j].set('instanceValue','0')}
                    else if('2' == dataArray[j].get('instanceValue')){dataArray[j].set('instanceValue','1')}
                    else if('3' == dataArray[j].get('instanceValue')){dataArray[j].set('instanceValue','0')}
                    else if('4' == dataArray[j].get('instanceValue')){dataArray[j].set('instanceValue','1')};
                    console.log(dataArray[j].get('instanceValue'));
                    
    				var toggle = Ext.create('Ext.field.Toggle', {
    					label: dataArray[j].get('devName'),
                        labelWidth: '50%',
    					itemId: dataArray[j].get('controlId').replace('I', ''),
    					value: parseInt(dataArray[j].get('instanceValue')),
    					listeners: {
    					    change: function(field, newValue, oldValue) {
				                var index = devStore.findExact('controlId', field.getItemId()+'O');
				                if (index != -1) {
                                    var senddata = null;//1:开启，2关闭
                                    if(1 == newValue){senddata = '1'}
                                    else{senddata = '2'};
				                	me.controlDev(devStore.getAt(index).get('parentId'), devStore.getAt(index).get('instanceType'), devStore.getAt(index).get('instanceId'), senddata);
				                };
				            }
    					}
    				});
    				fieldset.add(toggle);
    			};
    		}
    		else if (groupNames[i] == '投影幕') {
                console.log('投影幕');
                for (var j = 0; j < dataArray.length; j++) {
    				var segmentedButton  = Ext.create('Ext.SegmentedButton', {
                        itemId: dataArray[j].get('controlId').replace('I', ''),
    					allowMultiple: false,
    					items: [
    					    {
    					        text: '上升',
    					        id: '1',
    					    },
    					    {
    					        text: '停止',
                                id: '2',
    					        // pressed: true
    					    },
    					    {
    					        text: '下降',
                                id: '3',
    					    }
    					],
    					// pressedButtons: ['1'],
    					listeners: {
                            initialize: function(container) {
                                if('1' == dataArray[j].get('instanceValue')){this.setPressedButtons( '1' );}
                                else if('2' == dataArray[j].get('instanceValue')){this.setPressedButtons( '2' );}
                                else if('3' == dataArray[j].get('instanceValue')){this.setPressedButtons( '3' );};
                            },
                            toggle: function(container, button, pressed){
                                var index = devStore.findExact('controlId', container.getItemId()+'O');  
                                console.log(index);
                                if (index != -1) {
                                    me.controlDev(devStore.getAt(index).get('parentId'), devStore.getAt(index).get('instanceType'), devStore.getAt(index).get('instanceId'), button.getId());
                                };
                            }
    					}
    				});
				    fieldset.add(segmentedButton);
                };
    		}
    		else {
    			continue;
    		}
    		me.add(fieldset);
    	};

    	devStore.clearFilter();
    },

    controlDev: function(parentId, instanceType, instanceId, instanceValue) {
    	this.fireEvent('ctrlDevCommand', parentId, instanceType, instanceId, instanceValue);
    },
});