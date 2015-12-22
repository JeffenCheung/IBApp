var userInfoTemplate = new Ext.XTemplate(
	'<tpl for=".">',
	'<img width=100px height=100px style="float:left;margin-right:40px;margin-left:10px" src="{imgURL}" />',
	'<div class="user-profile-title">{userName}</div>',
	'<div class="user-profile-narrative">',
	'<p>{userNo}</p>',
	// '<p>{userRoles}</p>',
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