var mainApp = angular.module('mainApp', ['firebase', 'angular.filter', 'ngAnimate', 'ui.bootstrap', 'ngDraggable']);

mainApp.config(() => {
	var config = {
		apiKey: 'AIzaSyAfaDdizApxfxhhcEOUQ6vfq3jQpKBUEfg',
		authDomain: 'explorers-game.firebaseapp.com',
		databaseURL: 'https://explorers-game.firebaseio.com',
		storageBucket: 'explorers-game.appspot.com'
	};
	firebase.initializeApp(config);
});

mainApp.run(function runWithDependencies($rootScope) {
	$rootScope._ = _;
	$rootScope.moment = moment;
	$rootScope.mc = mc;
});