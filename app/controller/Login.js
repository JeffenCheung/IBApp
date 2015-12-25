Ext.define('IBApp.controller.Login', {
	extend: 'Ext.app.Controller',
	requires: ['IBApp.store.UserInfo','IBApp.store.UrlAddr'],
	config: {
		refs: {
			loginView: 'loginview',
			mainMenuView: 'mainmenuview'
		},
		control: {
			loginView: {
				signInCommand: 'onSignInCommand'
			},
			mainMenuView: {
				signOffCommand: 'onSignOffCommand'
			}
		},
		routes: {
			'login': 'showLoginView',
		}
	},

	sessionId: null,

	showLoginView: function() {
		Ext.Viewport.animateActiveItem(this.getLoginView(), 'fade');
	},

	onSignInCommand: function(view, userid, password) {
		console.log('userid: ' + userid + '\n' + 'Password: ' + password);
		var me = this,
		    loginView = me.getLoginView();

		if (userid.length === 0 || password.length === 0) {
			loginView.showSignInFailedMessage('请输入用户名和密码.');
			return;
		}
		loginView.setMasked({
			xtype: 'loadmask',
			message: '登录中...'
		});
		//从store里提取地址
		var URLLogin = Ext.getStore("UrlAddr").getAt(0).get('urlLogin');
        var urltmp = URLLogin + '/login/doPostAuthenticationInfoRS/';
		/* 从后台进行验证 */
		Ext.Ajax.request({
			// url: 'http://192.168.31.232/BackEndTest/Authority.php',
			url: urltmp,
			method: 'POST',
			disableCaching: false,
			withCredentials: true,
    		useDefaultXhrHeader: false,
			params: {
				userId: userid,
				password: password
			},
			success: function (response) {
				var loginResponse = Ext.JSON.decode(response.responseText);
				console.log(loginResponse);
				if (loginResponse.success === 'true') {
	                // The server will send a token that can be used throughout the app to confirm that the user is authenticated.
	                sessionId = loginResponse.sessionId;

	                /* set userInfoStore */
	                var curUser = Ext.create('IBApp.model.UserInfo', {
	                	'userId': loginResponse.userProfile.id,
	                	'imgURL': './resources/icons/profile.png',
	                	'userNo': loginResponse.id,
	                	'userName': loginResponse.userName,
	                	'userRoles': loginResponse.userRoles,
	                	'userPermissions': loginResponse.userPermissions,
	                });
	                Ext.getStore("UserInfo").removeAll();
                    Ext.getStore("UserInfo").add(curUser);

	                me.signInSuccess(curUser.get('userRoles'));

	            } else {
	                me.signInFailure(loginResponse.erroMsg);
	            }
			},
			failure: function (response) {
				me.sessionId = null;
				me.signInFailure('登录失败...请重试.');
			}
		});

		// just for test, will be deleted after debug
		// me.signInSuccess('APP_ADMIN');
	},

	signInSuccess: function (userRoles) {
	    console.log('Signed in.');
	    var loginView = this.getLoginView();
	    mainMenuView = this.getMainMenuView();
	    loginView.setMasked(false);

	    //为当前userId为别名
		window.plugins.jPushPlugin.setAlias(Ext.getStore("UserInfo").getAt(0).get('userId'));

	    /* setFunctionIcon via userRole */
	    mainMenuView.setFunctionIcon(userRoles);
	    this.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'mainmenu'}));
	},

	getSlideLeftTransition: function () {
	    return { type: 'slide', direction: 'left' };
	},

	getSlideRightTransition: function () {
	    return { type: 'slide', direction: 'right' };
	},

	signInFailure: function (message) {
	    var loginView = this.getLoginView();
	    loginView.showSignInFailedMessage(message);
	    loginView.setMasked(false);
	},

	onSignOffCommand: function () {
	    var me = this;
	    // Ext.Ajax.request({
	    //     url: '../../services/logoff.ashx',
	    //     method: 'post',
	    //     params: {
	    //         sessionToken: me.sessionToken
	    //     },
	    //     success: function (response) {

	    //         // TODO: Implementation.
	    //     },
	    //     failure: function (response) {

	    //         // TODO: Implementation.
	    //     }
	    // });


		//退出登录时，清除别名，就不会再接收到推送信息了
		window.plugins.jPushPlugin.setAlias('');

	    this.getApplication().getHistory().add(Ext.create('Ext.app.Action', {url: 'login'}));
	}
});