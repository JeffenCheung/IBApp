Ext.define("IBApp.model.MyMeetingsEvent", {
    extend: "Ext.data.Model",
	config: {
		fields: [
		{
			name: 'event',
			type: 'string'
		}, 
		{
			name: 'title',
			type: 'string'
		}, 
		{
			name: 'start',
			type: 'date',
			dateFormat: 'c'
		}, 
		{
			name: 'startstr',
			type: 'string'
		}, 
		{
			name: 'end',
			type: 'date',
			dateFormat: 'c'
		}, 
		{
			name: 'endstr',
			type: 'string'
		}, 
		{
			name: 'css',
			type: 'string'
		},
		{
			name: 'location',
			type: 'string'
		}, 
		{
			name: 'mtFlag',
			type: 'string'
		}, 
		{
			name: 'status',
			type: 'string'
		}, 
		{
			name: 'statusEn',
			type: 'string'
		}, 	
		{
			name: 'mtId',
			type: 'string'
		}, 	
		{
			name: 'organizerName',
			type: 'string'
		},
		{
			name: 'mtContent',
			type: 'string'
		},
		{
			name: 'replyNum',
			type: 'string'
		},
		{
			name: 'attenderNum',
			type: 'string'
		},
		]

	}
});