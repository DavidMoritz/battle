/*!
 * Some have suggested that this game is similar to the board game 'Lewis and Clark' by Space Cowboys. - v0.0.1 
 * Build Date: 2016.10.11 
 * Docs: http://moritzcompany.com 
 * Coded @ Moritz Company 
 */ 
 
var mainApp = angular.module('mainApp', ['firebase', 'angular.filter', 'ngAnimate', 'ui.bootstrap', 'ngDraggable']);

mainApp.config(() => {
	var config = {
		apiKey: 'AIzaSyD6S7XI77nZX1yabhWapmLggdykUnJxwH8',
		authDomain: 'battle-74684.firebaseapp.com',
		databaseURL: 'https://battle-74684.firebaseio.com',
		storageBucket: 'gs://battle-74684.appspot.com'
	};
	firebase.initializeApp(config);
});

mainApp.run(function runWithDependencies($rootScope) {
	$rootScope._ = _;
	$rootScope.moment = moment;
	$rootScope.mc = mc;
});
mainApp.controller('MainCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'$uibModal',
	'FirebaseFactory',
	function MainCtrl($s, $timeout, $interval, $uibM, FF) {
		'use strict';

		function init() {
			//	init stuff
			window.$s = $s;

			$s.chatList = [];
		}

		function listenToChat() {
			window.latestChat = FF.getFBObject('message');
			window.stopChat = latestChat.$watch(() => {
				$s.chatList.push(_.clone(latestChat));
			});
		}

		_.assign($s, {
			allPlayers: [],
			chatList: [],
			ff: {
				gameName: 'newGame'
			},
			currentUser: {
				firstName: 'David'
			}
		});

		$s.notify = (message, type) => {
			clearTimeout($s.cancelMessage);
			type = type || 'info';

			$s.activeGame.message = {
				text: message,
				type: type
			};

			$s.cancelMessage = setTimeout(() => {
				$s.activeGame.message = {};
			}, 4000);
		};

		$s.submitChat = () => {
			if (!$s.ff.chat.length) {
				return;
			}
			latestChat.user = $s.currentUser.firstName;
			latestChat.text = $s.ff.chat;
			latestChat.$save();
			$s.ff.chat = '';
		};

		$s.fbLogin = () => {
			FF.facebookLogin(err => {
				console.log('There was a Facebook Login error', err);
				// ** TEMPORARY FOR DEV ***
				$s.notify('Facebook Login Error', 'danger');
			}, authData => {
				console.log('Authenticated successfully with payload:', authData);
				$s.currentUser = FF.getFBObject('users/' + authData.uid);
				$s.currentUser.$loaded(user => {
					if (!user.uid) {
						var name = authData.providerData[0].displayName;
						createNewUser(authData.uid, {
							name: name,
							rating: 1200,
							uid: authData.uid,
							firstName: authData.providerData[0].first_name || name.substring(0, name.indexOf(' ')) || name
						});
					} else {
						init();
					}
				});
			});
		};

		$s.googleLogin = () => {
			FF.googleLogin(err => {
				console.log('There was a Google Login error', err);
				$s.notify('Google Login Error', 'danger');
			}, authData => {
				console.log('Authenticated successfully with payload:', authData);
				$s.currentUser = FF.getFBObject('users/' + authData.uid);
				$s.currentUser.$loaded(user => {
					if (!user.uid) {
						var name = authData.providerData[0].displayName;
						createNewUser(authData.uid, {
							name: name,
							rating: 1200,
							uid: authData.uid,
							firstName: authData.providerData[0].first_name || name.substring(0, name.indexOf(' ')) || name
						});
					} else {
						init();
					}
				});
			});
		};

		// grab all the games and make sure Firebase is working!
		listenToChat();
	}
]);
mainApp.factory('FirebaseFactory', [
	'$firebaseArray',
	'$firebaseObject',
	function FirebaseFactory($fbArray, $fbObject) {
		'use strict';
		var FB = null;
		var FF = {
			// Firebase methods
			getFB: childPath => {
				if (!FB) {
					FB = firebase.database().ref();
				}

				return childPath ? FB.child(childPath) : FB;
			},

			getFBArray: childPath => $fbArray(FF.getFB(childPath)),

			getFBObject: childPath => $fbObject(FF.getFB(childPath)),

			getAuth: childPath => $firebaseAuth(FF.getFB(childPath)),

			setFB: (childPath, value) => {
				var ref = FF.getFB(childPath);
				ref.set(value);

				return false;
			},
			googleLogin: (err, success) => {
				var provider = new firebase.auth.GoogleAuthProvider();
				firebase.auth().signInWithPopup(provider).then(result => {
					success(result.user);
				}).catch(error => {
					err(error);
				});
			},
			facebookLogin: (err, success) => {
				var provider = new firebase.auth.FacebookAuthProvider();
				provider.addScope('public_profile');
				firebase.auth().signInWithPopup(provider).then(function(result) {
					// This gives you a Facebook Access Token. You can use it to access the Facebook API.
					//var token = result.credential.accessToken;
					// The signed-in user info.
					//var user = result.user;
					success(result.user);
				}).catch(function(error) {
					// Handle Errors here.
					//var errorCode = error.code;
					//var errorMessage = error.message;
					// The email of the user's account used.
					//var email = error.email;
					// The firebase.auth.AuthCredential type that was used.
					//var credential = error.credential;
					// ...
					err(error);
				});
			}
		};

		return FF;
	}
]);

var mc = {
	pluralize: str => str.replace(/y$/, 'ie') + 's',

	camelToTitle: str => _.capitalize(str.replace(/([A-Z])/g, ' $1')).trim(),

	randomDigits: (min, max) => {
		min = min === undefined ? 1 : min;
		max = max || 999;

		return Math.floor(Math.random() * (max - min + 1) + min);
	},

	alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),

	isAngularObjectEqual: (object1, object2) => _.isEqual(_.omit(object1, '$$hashKey'), _.omit(object2, '$$hashKey')),

	expandArray: (array, times) => {	//	turns [1,2,3] into [1,2,3,1,2,3,1,2,3];
		times = times || 3;	//	default number of times to expand it by

		var expandedArray = [];

		for (var i = 0; i < times; i++) {
			expandedArray = expandedArray.concat(angular.copy(array));
		}

		return expandedArray;
	},

	calculateAge: (dateOfBirth) => {
		var age;

		if (dateOfBirth) {
			var year = Number(dateOfBirth.substr(0, 4));
			var month = Number(dateOfBirth.substr(5, 2)) - 1;
			var day = Number(dateOfBirth.substr(8, 2));
			var today = new Date();
			age = today.getFullYear() - year;

			if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
				age--;
			}
		}

		return age || 0;
	}
};
