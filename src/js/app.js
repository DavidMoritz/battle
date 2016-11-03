var mainApp = angular.module('mainApp', ['firebase', 'ui.bootstrap']);

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
	$rootScope.mc = mc;
});