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
