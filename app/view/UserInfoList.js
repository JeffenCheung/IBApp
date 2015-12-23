var userInfoTemplate = new Ext.XTemplate(
	'<tpl for=".">',
	'<div style="float:left;margin-right:40px;">',
	'<div>',
	'<img width=80px height=20px src="resources/icons/img5.png" />',
	'</div>',
	'<div>',
	'<img width=80px height=80px style="margin-top: 5px;" src="resources/icons/img4.png" />',
	'</div>',
	'</div>',
	'<div style="color:#ffffff">',
	'<div style="margin-top: 40px;">Admin &nbsp{userName}</div>',
	'<div style="margin-top: 20px;">工号：{userNo}</div>',
	'</div>',
	'</tpl>'
);

Ext.define('IBApp.view.UserInfoList', {
	extend: 'Ext.dataview.List',
	requires: ['IBApp.store.UserInfo'],
	xtype: 'userinfolist',

	config: {
		store: 'UserInfo',
		itemTpl: userInfoTemplate,
		disableSelection: true,
		// onItemDisclosure: true,
		scrollable: {
            disabled: true
        },
		listeners: {
		    // itemtap: function (list, index, target, record, e, eOpts) {
		    // 	Ext.Msg.alert("click " + record.get('userName'));
		    // },
		}
	}
});