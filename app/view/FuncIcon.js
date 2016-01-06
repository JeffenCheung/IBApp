Ext.define('IBApp.view.FuncIcon', {
	extend: 'Ext.Panel',
	requires: ['Ext.Img'],
	xtype: 'funciconview',

	config: {
		flex: 1,
		margin: 5,
		imageSrc: '',
		text: '',
	},

	initialize: function () {

	    this.callParent(arguments);

	    var image = Ext.create('Ext.Img', {
	    	src: this.config.imageSrc,
	    	style: 'position: absolute;width:50%;height:35%;bottom: 15px;right: 5px;',
	    });

	    this.add([
        	image,
        ]);
	    this.setHtml(['<p style="text-align:left">',
	    	          this.config.text,
	    	          '</p>'].join(""));

	    var me = this;
	    this.element.on({
	    	tap: function() {
	    		if (this.getId() == 'myMeetings') {
	    			me.fireEvent('MyMeetingsCommand');
	    		}
	    		else if (this.getId() == 'roomBooking') {
	    			me.fireEvent('roomBookingCommand');
	    		}
	    		else if (this.getId() == 'scanningCode') {
	    			me.fireEvent('scanningCodeCommand');
	    		}
	    		else if (this.getId() == 'deviceControl') {
	    			me.fireEvent('deviceControlCommand');
	    		};
	    	}
	    })
	},

});