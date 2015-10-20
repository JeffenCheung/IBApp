Ext.define("IBApp.controller.RoomBooking", {
    extend: "Ext.app.Controller",
    config: {
        refs: {
            // We're going to lookup our views by xtype.
            roomBookingView: 'roombookingview',
            roomSearchResultView: 'roomsearchresultview',
            roomBookSuccessView: 'roombooksuccessview'
        },
        control: {
        	roomBookingView: {
        		roomSearchSubmitCommand: 'onRoomSearchSubmitCommand'
        	},
            roomSearchResultView: {
                backButtonCommand: 'onBackButtonCommand',
                roomBookButtonCommand: 'onRoomBookButtonCommand'
            },
        }
    },

    getSlideLeftTransition: function () {
        return { type: 'slide', direction: 'left' };
    },

    getSlideRightTransition: function () {
        return { type: 'slide', direction: 'right' };
    },

    onRoomSearchSubmitCommand: function () {
        Ext.Viewport.animateActiveItem(this.getRoomSearchResultView(), this.getSlideLeftTransition());
    },

    onBackButtonCommand: function (){
        Ext.Viewport.animateActiveItem(this.getRoomBookingView(), this.getSlideRightTransition());
    },

    onRoomBookButtonCommand: function (){
        Ext.Viewport.animateActiveItem(this.getRoomBookSuccessView(), this.getSlideLeftTransition());
    }

});