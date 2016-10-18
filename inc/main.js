'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * A new battle game by David Wintterle - v0.0.1
 * Build Date: 2016.10.18
 * Docs: http://moritzcompany.com
 * Coded @ Moritz Company
 */

var mainApp = angular.module('mainApp', ['firebase', 'ui.bootstrap']);

mainApp.config(function () {
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
mainApp.controller('MainCtrl', ['$scope', '$timeout', '$interval', '$uibModal', 'ClassFactory', 'EventFactory', 'FirebaseFactory', function MainCtrl($s, $timeout, $interval, $uibM, CF, EF, FF) {
	'use strict';

	function init() {
		//	init stuff
		window.$s = $s;

		$s.joinableGames = _.mapKeys($s.allGames, function (game, key) {
			if ((typeof game === 'undefined' ? 'undefined' : _typeof(game)) === 'object' && game && game.name) {
				switch (true) {
					case game.playerIds.indexOf($s.currentUser.uid) !== -1:
					case game.public && !game.active:
						return key;
				}
			}

			return 'skip';
		});
		delete $s.joinableGames.skip;

		$s.state = 'joinGame';
		$s.chatList = [];
	}

	function listenToChat() {
		window.latestChat = FF.getFBObject('message');
		window.stopChat = latestChat.$watch(function () {
			$s.chatList.push(_.clone(latestChat));
		});
	}

	function createNewUser(id, data) {
		var allUsers = FF.getFBObject('users');

		allUsers.$loaded(function () {
			allUsers[id] = data;
			allUsers.$save();
			$s.currentUser = allUsers[id];
			init();
		});
	}

	function restartTurn() {
		// this is not working.
		var id = $s.activeGame.id;
		$s.currentPlayer = null;
		$s.allPlayers = [];
		$s.activeGame = {};
		$s.restartTurn = false;
		$s.joinActiveGame({ id: id });
	}

	function updateGame() {
		if ($s.restartTurn) {
			restartTurn();
		} else if ($s.eventTracker < $s.activeGame.events.length) {
			$s.activeGame.events.reduce(function (prevEvent) {
				return prevEvent.then(function () {
					return runEvent(++$s.eventTracker);
				}, function () {
					return $s;
				});
			}, runEvent($s.eventTracker));
		}
	}

	function runEvent(idx) {
		if (idx >= $s.activeGame.events.length) {
			$s.eventTracker = $s.activeGame.events.length;
			// return meaningless function to avoid error
			return { then: function then() {
					return 0;
				} };
		}
		var event = $s.activeGame.events[idx];
		var eventFunction = EF[event.name];

		return new Promise(eventFunction.bind(event));
	}

	/**
  * Shuffle Deck
  * The game needs to shuffle the cards in a predictable way
  * so that every user gets the same outcome. This is done by
  * 'seeding' the algorithm with the randomly generated gameId.
  * This algorthim has been tested over larger iterations here:
  * https://jsfiddle.net/sr7djh8x/6/
  */
	function shuffleDeck(deck) {
		return deck.sort(function (a, b) {
			var gameNumber = parseInt($s.activeGame.id, 36);
			var firstCardNum = parseInt(a.id, 36);
			var secondCardNum = parseInt(b.id, 36);

			return gameNumber % firstCardNum - gameNumber % secondCardNum;
		});
	}

	function openModal(name, resolve) {
		$s.modalInstance = $uibM.open({
			animation: true,
			templateUrl: name.toLowerCase() + 'Modal',
			controller: name + 'ModalInstanceCtrl',
			size: 'lg',
			resolve: resolve
		});
	}

	_.assign($s, {
		state: 'welcome',
		allPlayers: [],
		chatList: [],
		battleHistory: [],
		activeGame: {},
		eventTracker: 0,
		ff: {
			gameName: 'newGame'
		}
	});

	$s.getBattleCount = function () {
		var subEvents = $s.activeGame.events.slice(0, $s.eventTracker);
		var submitEvents = _.partition(subEvents, { name: 'submitBattle' })[0].length;

		if ($s.allPlayers.length == 1) {
			return submitEvents;
		}

		return Math.floor(submitEvents / $s.allPlayers.length);
	};

	$s.notify = function (message, type) {
		clearTimeout($s.cancelMessage);
		type = type || 'info';

		$s.activeGame.message = {
			text: message,
			type: type
		};

		$s.cancelMessage = setTimeout(function () {
			$s.activeGame.message = {};
		}, 4000);
	};

	$s.submitChat = function () {
		if (!$s.ff.chat.length) {
			return;
		}
		latestChat.user = $s.currentUser.firstName;
		latestChat.text = $s.ff.chat;
		latestChat.$save();
		$s.ff.chat = '';
	};

	$s.submitCards = function () {
		// disable submit button
		$s.addEvent({
			name: 'submitBattle',
			cards: $s.user.deck.selectedCards,
			uid: $s.user.uid,
			battleCount: $s.getBattleCount()
		});
	};

	$s.addEvent = function (event) {
		if (typeof event == 'string') {
			event = { name: event };
		}
		event.timestamp = new Date().getTime();
		$s.activeGame.events.push(event);
	};

	$s.changeState = function (state) {
		$s.state = state;
	};

	$s.createNewGame = function () {
		// This should be separated based on something so that the
		// "allGames" doesn't just continue to grow.
		// maybe after a game is completed, it gets moved into an
		// archive of some sort rather than continue to be in here.
		var rand = Math.random().toString(36).substring(2, 10);
		allGames.$ref().update(_defineProperty({}, rand, {
			id: rand,
			//name: $s.ff.gameName,
			name: $s.currentUser.firstName + '\'s Game',
			timestamp: new Date().getTime(),
			events: [{
				name: 'gameCreated'
			}],
			hostId: $s.currentUser.uid,
			active: false,
			public: true
		}), function () {
			$s.joinActiveGame({ id: rand });
		});
	};

	$s.joinActiveGame = function (game) {
		if ($s.activeGame.id || !$s.currentUser) {
			return;
		}

		var activeGame = FF.getFBObject('allGames/' + game.id);
		activeGame.$bindTo($s, 'activeGame');

		activeGame.$loaded(function () {
			if (!$s.activeGame.playerIds) {
				$s.activeGame.playerIds = [];
				$s.activeGame.playerNames = [];
			}

			if ($s.activeGame.playerIds.indexOf($s.currentUser.uid) === -1) {
				$s.activeGame.playerIds.push($s.currentUser.uid);
				$s.activeGame.playerNames.push($s.currentUser.name);
			}

			$s.battleHistory = [];
			$s.eventTracker = 0;
			$s.$watch('activeGame.events', updateGame);
		});
		stopChat();
	};

	$s.selectCard = function (card) {
		card.selected = !card.selected;
	};

	$s.viewCard = function (card) {
		openModal('ViewCard', {
			card: card
		});
	};

	$s.fbLogin = function () {
		FF.facebookLogin(function (err) {
			console.log('There was a Facebook Login error', err);
			$s.notify('Facebook Login Error', 'danger');
			// ** TEMPORARY FOR DEV ***
			$s.currentUser = FF.getFBObject('users/DrocniTEYXeclP6n52ugMXEzAgF3');
			$s.currentUser.$loaded(init);
			// ** END TEMPORARY FOR DEV ***
		}, function (authData) {
			console.log('Authenticated successfully with payload:', authData);
			$s.currentUser = FF.getFBObject('users/' + authData.uid);
			$s.currentUser.$loaded(function (user) {
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

	$s.googleLogin = function () {
		FF.googleLogin(function (err) {
			console.log('There was a Google Login error', err);
			$s.notify('Google Login Error', 'danger');
			/* TEMP LOGIN */
			$s.currentUser = FF.getFBObject('users/dpnncrYpfoNkC4qcg5aNzNtBezS2');
			$s.currentUser.$loaded(init);
			/* END TEMP LOGIN */
		}, function (authData) {
			console.log('Authenticated successfully with payload:', authData);
			$s.currentUser = FF.getFBObject('users/' + authData.uid);
			$s.currentUser.$loaded(function (user) {
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
	window.allGames = FF.getFBObject('allGames');
	allGames.$bindTo($s, 'allGames');
	allGames.$loaded(function () {
		$('body').addClass('facebook-available');
		listenToChat();
	});
}]);
mainApp.controller('ViewCardModalInstanceCtrl', function ModalCtrl($scope, $uibModalInstance, card) {
	$scope.card = card;

	$scope.cancel = function () {
		return $uibModalInstance.dismiss('cancel');
	};
});
mainApp.factory('CardFactory', [function CardFactory() {
	'use strict';

	return {
		yellow: [{
			id: 'YB0',
			value: 0,
			class: 'zero',
			color: 'yellow'
		}, {
			id: 'YB1',
			value: 1,
			class: 'one',
			color: 'yellow'
		}, {
			id: 'YB2',
			value: 2,
			class: 'two',
			color: 'yellow'
		}, {
			id: 'YB3',
			value: 3,
			class: 'three',
			color: 'yellow'
		}, {
			id: 'YB4',
			value: 4,
			class: 'four',
			color: 'yellow'
		}, {
			id: 'YB5',
			value: 5,
			class: 'five',
			color: 'yellow'
		}, {
			id: 'YB6',
			value: 6,
			class: 'six',
			color: 'yellow'
		}, {
			id: 'YB7',
			value: 7,
			class: 'seven',
			color: 'yellow'
		}, {
			id: 'YB8',
			value: 8,
			class: 'eight',
			color: 'yellow'
		}, {
			id: 'YB9',
			value: 9,
			class: 'nine',
			color: 'yellow'
		}, {
			id: 'YB10',
			value: 10,
			class: 'ten',
			color: 'yellow'
		}],
		purple: [{
			id: 'PB0',
			value: 0,
			class: 'zero',
			color: 'purple'
		}, {
			id: 'PB1',
			value: 1,
			class: 'one',
			color: 'purple'
		}, {
			id: 'PB2',
			value: 2,
			class: 'two',
			color: 'purple'
		}, {
			id: 'PB3',
			value: 3,
			class: 'three',
			color: 'purple'
		}, {
			id: 'PB4',
			value: 4,
			class: 'four',
			color: 'purple'
		}, {
			id: 'PB5',
			value: 5,
			class: 'five',
			color: 'purple'
		}, {
			id: 'PB6',
			value: 6,
			class: 'six',
			color: 'purple'
		}, {
			id: 'PB7',
			value: 7,
			class: 'seven',
			color: 'purple'
		}, {
			id: 'PB8',
			value: 8,
			class: 'eight',
			color: 'purple'
		}, {
			id: 'PB9',
			value: 9,
			class: 'nine',
			color: 'purple'
		}, {
			id: 'PB10',
			value: 10,
			class: 'ten',
			color: 'purple'
		}],
		cyan: [{
			id: 'CB0',
			value: 0,
			class: 'zero',
			color: 'cyan'
		}, {
			id: 'CB1',
			value: 1,
			class: 'one',
			color: 'cyan'
		}, {
			id: 'CB2',
			value: 2,
			class: 'two',
			color: 'cyan'
		}, {
			id: 'CB3',
			value: 3,
			class: 'three',
			color: 'cyan'
		}, {
			id: 'CB4',
			value: 4,
			class: 'four',
			color: 'cyan'
		}, {
			id: 'CB5',
			value: 5,
			class: 'five',
			color: 'cyan'
		}, {
			id: 'CB6',
			value: 6,
			class: 'six',
			color: 'cyan'
		}, {
			id: 'CB7',
			value: 7,
			class: 'seven',
			color: 'cyan'
		}, {
			id: 'CB8',
			value: 8,
			class: 'eight',
			color: 'cyan'
		}, {
			id: 'CB9',
			value: 9,
			class: 'nine',
			color: 'cyan'
		}, {
			id: 'CB10',
			value: 10,
			class: 'ten',
			color: 'cyan'
		}],
		orange: [{
			id: 'OB0',
			value: 0,
			class: 'zero',
			color: 'orange'
		}, {
			id: 'OB1',
			value: 1,
			class: 'one',
			color: 'orange'
		}, {
			id: 'OB2',
			value: 2,
			class: 'two',
			color: 'orange'
		}, {
			id: 'OB3',
			value: 3,
			class: 'three',
			color: 'orange'
		}, {
			id: 'OB4',
			value: 4,
			class: 'four',
			color: 'orange'
		}, {
			id: 'OB5',
			value: 5,
			class: 'five',
			color: 'orange'
		}, {
			id: 'OB6',
			value: 6,
			class: 'six',
			color: 'orange'
		}, {
			id: 'OB7',
			value: 7,
			class: 'seven',
			color: 'orange'
		}, {
			id: 'OB8',
			value: 8,
			class: 'eight',
			color: 'orange'
		}, {
			id: 'OB9',
			value: 9,
			class: 'nine',
			color: 'orange'
		}, {
			id: 'OB10',
			value: 10,
			class: 'ten',
			color: 'orange'
		}],
		resources: [{
			id: 'JC09',
			class: 'Joseph Barter',
			symbol: 'fur',
			description: 'Pay 1 Canoe and move your Scout 5 spaces forward on the River.',
			story: 'Also known as La Liberté, a private in the U.S. Army before being assigned duties as a boatman. However, he deserts soon afterwards.',
			strength: 1,
			abilities: [{
				cost: {
					canoe: 1
				},
				short: 'travel 5 river for 1 canoe.',
				benefit: {
					river: 5
				}
			}]
		}, {
			id: 'JC04',
			class: 'Ebenezer Tuttle',
			symbol: 'fur',
			description: 'Pay 1 Wood and take 1 Canoe.',
			story: 'Private, recruited for the first part of the expedition up to Fort Mandan. He is sent back to Saint Louis with Pierre Chouteau’s party of fur traders.',
			strength: 1,
			abilities: [{
				cost: {
					wood: 1
				},
				short: 'receive 1 canoe for 1 wood',
				benefit: {
					canoe: 1
				}
			}]
		}, {
			id: 'JC05',
			class: 'René Jessaume',
			symbol: 'fur',
			description: 'Pay 3 Furs and take 1 Horse.',
			story: 'He lived with his Indian wife and children in the Mandan chief ’s village. He helps the captains by providing them with information about the various chiefs and tribal politics.',
			strength: 1,
			abilities: [{
				cost: {
					fur: 3
				},
				short: 'receive 1 horse for 3 fur.',
				benefit: {
					horse: 1
				}
			}]
		}, {
			id: 'JC07',
			class: 'Moses B. Reed',
			symbol: 'fur',
			description: 'Pay 2 Wood and move your Scout 2 spaces forward on the River.',
			story: 'Private, discharged from the Corps for having deserted and stolen weapons.',
			strength: 1,
			abilities: [{
				cost: {
					wood: 2
				},
				short: 'travel 2 river for 2 wood.',
				benefit: {
					river: 2
				}
			}]
		}, {
			id: 'JC24',
			class: 'P. Antoine Tabeau',
			symbol: 'fur',
			description: 'Pay 1 Wood and 1 Food and take 2 Canoes.',
			story: 'French-Canadian fur-trader and explorer; provides useful information about Arikara Indian tribes.',
			strength: 2,
			abilities: [{
				cost: {
					wood: 1,
					meat: 1
				},
				short: 'receive 2 canoes for 1 food and 1 wood.',
				benefit: {
					canoe: 2
				}
			}]
		}, {
			id: 'JC19',
			class: 'John Hay',
			symbol: 'fur',
			description: 'For each Strength that activates this card, choose one of the two resources: Fur or Wood, and collect it. (By activating this card three times, you can, for instance, collect Fur twice and Wood once.)',
			story: 'As a merchant, fur trader, and Cahokia’s post- master, he provides information. Since he speaks French and English, he helps as an interpreter.',
			strength: 2,
			abilities: [{
				collect: 'fur',
				short: 'collect fur.',
				benefit: {}
			}, {
				collect: 'wood',
				short: 'collect wood.',
				benefit: {}
			}]
		}, {
			id: 'JC22',
			class: 'Black Moccasin',
			symbol: 'fur',
			description: 'For each Strength that activates this card, choose one of the two resources: Equipment or Food, and collect it. (By activating this card three times, you can, for instance, collect Equipment twice and Food once.)',
			story: 'Minitari chief, he captured Sacagawea from the Shoshone a few years earlier.',
			strength: 2,
			abilities: [{
				collect: 'equipment',
				short: 'collect equipment.',
				benefit: {}
			}, {
				collect: 'meat',
				short: 'collect food.',
				benefit: {}
			}]
		}, {
			id: 'JC26',
			class: 'Hawk\'s Feather',
			symbol: 'fur',
			description: 'Pay 1 Food and move your Scout 3 spaces forward on the River.',
			story: 'Arikara chief, agrees to attempt peace with the Mandan.',
			strength: 2,
			abilities: [{
				cost: {
					meat: 1
				},
				short: 'travel 3 river for 1 food.',
				benefit: {
					river: 3
				}
			}]
		}, {
			id: 'JC48',
			class: 'Coboway',
			symbol: 'fur',
			description: 'Pay 1 Equipment, 1 Food, 1 Fur and 1 Wood and move your Scout 4 spaces forward in the Mountains.',
			story: 'He is the only Clatsop leader to make recorded contact with the Expedition. He exchanges some goods, including a sea otter pelt, for fish hooks and a small bag of Shoshone tobacco.',
			strength: 3,
			abilities: [{
				cost: {
					equipment: 1,
					fur: 1,
					meat: 1,
					wood: 1
				},
				short: 'travel 4 mountain for 1 of each basic.',
				benefit: {
					mountain: 4
				}
			}]
		}, {
			id: 'JC47',
			class: 'Old Toby',
			symbol: 'fur',
			description: 'Pay 1 Canoe and 1 Horse and move your Scout 6 spaces forward, either on the River or in the Mountains; not both! If activated more than once, each multiple of 6 can be either River or Mountains.',
			story: 'Shoshone guide, he is sent by Cameahwait to lead the Expedition across the Rockies. He guides Clark’s exploration of the Salmon River.',
			strength: 3,
			abilities: [{
				cost: {
					canoe: 1,
					horse: 1
				},
				short: 'travel 6 river for 1 canoe, and 1 horse.',
				benefit: {
					river: 6
				}
			}, {
				cost: {
					canoe: 1,
					horse: 1
				},
				short: 'travel 6 mountain for 1 canoe, and 1 horse.',
				benefit: {
					mountain: 6
				}
			}]
		}, {
			id: 'JC41',
			class: 'Cameahwait',
			symbol: 'fur',
			description: 'Pay 1 Canoe and take 1 Horse or pay 1 Horse and take 1 Canoe.',
			story: 'Shoshone chief, he is Sacagawea’s brother. He provides Lewis and Clark hospitality and horses to repay them for reuniting him with his long-lost sister.',
			strength: 3,
			abilities: [{
				cost: {
					canoe: 1
				},
				short: 'receive 1 horse for 1 canoe',
				benefit: {
					horse: 1
				}
			}, {
				cost: {
					horse: 1
				},
				short: 'receive 1 canoe for 1 horse',
				benefit: {
					canoe: 1
				}
			}]
		}, {
			id: 'JC10',
			class: 'J. Baptiste Deschamps',
			symbol: 'meat',
			description: 'Pay 1 Food and 1 Canoe and move your Scout 6 spaces forward on the River.',
			story: 'As a French boatman, he is appointed foreman of the French boatmen in the red pirogue. He is among the men who, in April, 1805, navigate the keelboat downriver to St. Louis.',
			strength: 1,
			abilities: [{
				cost: {
					canoe: 1,
					meat: 1
				},
				short: 'travel 6 river for 1 canoe and 1 food.',
				benefit: {
					river: 6
				}
			}]
		}, {
			id: 'JC11',
			class: 'John Newman',
			symbol: 'wood',
			story: 'Recruited at Fort Massac, he is expelled from the expedition following his court-martial for (having uttered repeated expressions of a highly criminal and mutinous nature.',
			description: 'Pay 1 Food and move your Scout 1 space forward on the River or in the Mountains.',
			strength: 1,
			abilities: [{
				cost: {
					meat: 1
				},
				short: 'travel 1 river for 1 food.',
				benefit: {
					river: 1
				}
			}, {
				cost: {
					meat: 1
				},
				short: 'travel 1 mountain for 1 food.',
				benefit: {
					mountain: 1
				}
			}]
		}, {
			id: 'JC42',
			class: 'Broken Arm',
			symbol: 'meat',
			description: 'Pay 1 Equipment and take 1 Horse.',
			stroy: 'Nez Perce chief. Honest and generous, he gives the Corps horses and desires to make peace with the Shoshone.',
			strength: 3,
			abilities: [{
				cost: {
					equipment: 1
				},
				short: 'receive 1 horse for 1 equipment.',
				benefit: {
					horse: 1
				}
			}]
		}, {
			id: 'JC32',
			class: 'James Mackay',
			symbol: 'meat',
			description: 'Pay 1 Horse and move your Scout forward 3 spaces, either on the River or in the Mountains; not both! If activated more than once, each multiple of 3 can be either River or Mountains.',
			story: 'Fur trader, explorer, Scotsman, (perhaps the most widely travelled of the many traders met), he is the creator of the most complete Missouri River map used by Lewis & Clark.',
			strength: 2,
			abilities: [{
				cost: {
					horse: 1
				},
				short: 'travel 3 mountain for 1 horse',
				benefit: {
					mountain: 3
				}
			}, {
				cost: {
					horse: 1
				},
				short: 'travel 3 river for 1 horse',
				benefit: {
					river: 3
				}
			}]
		}, {
			id: 'JC21',
			class: 'Dickson & Hancock',
			symbol: 'meat',
			description: 'For each Strength that activates this card, choose one of the two resources: Food or Fur, and collect it. (By activating this card three times, you can, for instance, collect Food twice and Fur once.)',
			story: 'Fur trappers, they meet the expedition in September,1806, during its return to Washington. They invite John Colter to join them as a trapper.',
			strength: 2,
			abilities: [{
				collect: 'meat',
				short: 'collect food.',
				benefit: {}
			}, {
				collect: 'fur',
				short: 'collect fur.',
				benefit: {}
			}]
		}, {
			id: 'JC38',
			class: 'Hugh Heney',
			symbol: 'meat',
			description: 'For each Strength that activates this card, choose one of the three resources: Fur, Food or Wood. Then collect it. (By activating this card three times, you can, for instance, collect Fur once, Food once and Wood once.)',
			story: 'Canadian fur trader, a «very sensible, intelligent man», he knows the Teton Sioux like no other white man. Heney sends some snakebite medicine to Lewis & Clark.',
			strength: 3,
			abilities: [{
				collect: 'fur',
				short: 'collect fur.',
				benefit: {}
			}, {
				collect: 'meat',
				short: 'collect food.',
				benefit: {}
			}, {
				collect: 'wood',
				short: 'collect wood.',
				benefit: {}
			}]
		}, {
			id: 'JC03',
			class: 'Buffalo Medicine',
			symbol: 'equipment',
			description: 'Pay 1 Food and take 1 Canoe.',
			story: 'Teton Sioux third chief, involved in a power struggle. He meets the Expedition on the Bad River in September, 1804.',
			strength: 1,
			abilities: [{
				cost: {
					meat: 1
				},
				short: 'receive 1 canoe for 1 food.',
				benefit: {
					canoe: 1
				}
			}]
		}, {
			id: 'JC13',
			class: 'John Dame',
			symbol: 'equipment',
			description: 'Pay 2 Wood and move your Scout 1 space forward in the Mountains.',
			story: 'Aged 19, fair-haired and blue-eyed, he joins the Corps for the 1rst part of the journey and comes back to Saint Louis in the spring of 1805. He has shot a white pelican.',
			strength: 1,
			abilities: [{
				cost: {
					wood: 2
				},
				short: 'travel 1 mountain for 2 wood.',
				benefit: {
					mountain: 1
				}
			}]
		}, {
			id: 'JC12',
			class: 'Charles Mackenzie',
			symbol: 'equipment',
			description: 'Pay 1 Fur and 1 Horse and move your Scout 3 spaces forward in the Mountains.',
			story: 'Fur trader, he works for the North West Company. Along with Larocque, he is a frequent visitor to Fort Mandan during the winter of 1804-1805.',
			strength: 1,
			abilities: [{
				cost: {
					horse: 1,
					fur: 1
				},
				short: 'travel 6 river for 1 canoe and 1 food.',
				benefit: {
					mountain: 3
				}
			}]
		}, {
			id: 'JC20',
			class: 'Big White',
			symbol: 'equipment',
			description: 'For each Strength that activates this card, choose one of the two resources: Equipment or Wood. Then collect it. (By activating this card three times, you can, for instance, collect Equipment twice and Wood once.)',
			story: 'He is the principal chief of the lower Mandan village, nicknamed this way because of his size and complexion. He meets President Jefferson in Washington after the expedition',
			strength: 2,
			abilities: [{
				collect: 'equipment',
				short: 'collect equipment.',
				benefit: {}
			}, {
				collect: 'fur',
				short: 'collect fur.',
				benefit: {}
			}]
		}, {
			id: 'JC34',
			class: 'Pierre Dorion',
			symbol: 'equipment',
			description: 'Pay 3 Furs and move your Scout forward 2 spaces in the Mountains.',
			story: 'Married to a Yankton woman, he joins the expedition as an interpreter. In April 1805, he is sent back to St.Louis with chiefs of the Yankton, Omaha, Oto & Missouri tribes.',
			strength: 2,
			abilities: [{
				cost: {
					fur: 3
				},
				short: 'receive 1 horse for 1 equipment.',
				benefit: {
					mountain: 2
				}
			}]
		}, {
			id: 'JC43',
			class: 'Comcomly',
			symbol: 'equipment',
			description: 'Pay 1 Equipment, 1 Food, 1 Fur and 1 Wood and move your Scout 7 spaces forward on the River.',
			story: 'Chinook chief, most powerful leader at the mouth of the Columbia, he is described as «a shrewd old savage with but one eye». He is friendly to the white explorers.',
			strength: 3,
			abilities: [{
				cost: {
					equipment: 1,
					fur: 1,
					wood: 1,
					meat: 1
				},
				short: 'travel 7 river for 1 of each basic',
				benefit: {
					river: 7
				}
			}]
		}, {
			id: 'JC37',
			class: 'Régis Loisel',
			symbol: 'equipment',
			description: 'For each Strength that activates this card, choose one of the three resources: Equipment, Food or Wood. Then collect it. (By activating this card three times, you can, for instance, collect Equipment once, Food once and Wood once.)',
			story: 'French-Canadian fur trader and explorer at La Charette, on the Missouri River.',
			strength: 3,
			abilities: [{
				collect: 'equipment',
				short: 'collect equipment.',
				benefit: {}
			}, {
				collect: 'meat',
				short: 'collect food.',
				benefit: {}
			}, {
				collect: 'wood',
				short: 'collect wood.',
				benefit: {}
			}]
		}, {
			id: 'JC49',
			class: 'Crow At Rest',
			symbol: 'equipment',
			description: 'Pay 2 Furs and 2 Equipment and move your Scout 3 spaces forward in the Mountains.',
			story: 'Grand Arikara chief, he is interested in trading buffalo skin. He assures the Corps that the Arikara would let them travel on in safety and that peace with the Mandan is desirable.',
			strength: 3,
			abilities: [{
				cost: {
					equipment: 2,
					fur: 2
				},
				short: 'travel 3 mountain for 2 equipment and 2 fur.',
				benefit: {
					mountain: 3
				}
			}]
		}, {
			id: 'JC08',
			class: 'John Robertson',
			symbol: 'wood',
			description: 'Pay 2 Equipment and move your Scout 3 spaces forward on the River.',
			story: 'Initially a corporal, Clark demotes him for having (no authority) over his men and failing to stop a fight at Camp Dubois. He’s probably the first man to leave the expedition.',
			strength: 1,
			abilities: [{
				cost: {
					equipment: 2
				},
				short: 'travel 3 river for 2 equipment.',
				benefit: {
					river: 3
				}
			}]
		}, {
			id: 'JC25',
			class: 'Three Eagles',
			symbol: 'wood',
			description: 'Pay 2 Equipment and take 1 Horse.',
			story: 'Flathead chief, he meets the party in September, 1805, and welcomes, feeds, and swaps horses with the Corps of Discovery.',
			strength: 2,
			abilities: [{
				cost: {
					equipment: 2
				},
				short: 'receive 1 horse for 2 equipment.',
				benefit: {
					horse: 1
				}
			}]
		}, {
			id: 'JC27',
			class: 'Man Crow',
			symbol: 'wood',
			description: 'Pay 3 Wood and move your Scout 4 spaces forward on the River.',
			story: 'Arikara chief, challenger to Crow at Rest’s civil authority',
			strength: 2,
			abilities: [{
				cost: {
					wood: 3
				},
				short: 'travel 4 river for 3 wood.',
				benefit: {
					river: 4
				}
			}]
		}, {
			id: 'JC40',
			class: 'Twisted Hair',
			symbol: 'wood',
			description: 'Pay 1 Canoe and take 2 Canoes. If you activate this Character several times, you are not allowed to use the resources you get as a result of the first (or second) activation to trigger the next Action. You must use Canoes that had been previously held.',
			story: 'Nez Perce chief, a «cheerful man with apparent sincerity», helps build dugout canoes',
			strength: 3,
			abilities: [{
				cost: {
					canoe: 1
				},
				short: 'receive 2 canoes for 1 canoe.',
				benefit: {
					canoe: 2
				}
			}]
		}],
		winner: [],
		get allCards() {
			return [].concat(this.purple, this.yellow, this.cyan, this.orange, this.resources, this.winner);
		}
	};
}]);
mainApp.factory('ClassFactory', ['CardFactory', function (CF) {
	'use strict';

	var allColors = ['yellow', 'cyan', 'orange', 'purple'];
	var ClassFactory = {
		Corp: function Corp() {
			_classCallCheck(this, Corp);

			this.wood = 0;
			this.energy = 0;
			this.mineral = 0;
			this.food = 0;
		},

		Deck: function () {
			function Deck(color) {
				_classCallCheck(this, Deck);

				this.cards = CF[color];
				this.activeCardId = '';
			}

			_createClass(Deck, [{
				key: 'findById',
				value: function findById(cardId) {
					return _.find(this.cards, { id: cardId });
				}
			}, {
				key: 'reset',
				value: function reset() {
					this.cards.map(function (card) {
						card.played = false;
						card.selected = false;
						card.plays = 0;
					});
				}
			}, {
				key: 'play',
				value: function play(cardInfo) {
					var card = _.find(this.cards, { id: cardInfo.id });

					card.played = true;
				}
			}, {
				key: 'remove',
				value: function remove(cardInfo) {
					var card = _.find(this.cards, { id: cardInfo.id }),
					    idx = _.findIndex(this.cards, card);

					this.cards.splice(idx, 1);
				}
			}, {
				key: 'add',
				value: function add(card) {
					this.cards.push(card);
				}
			}, {
				key: 'battleValue',
				get: function get() {
					return this.selectedCards.reduce(function (total, card) {
						return total + card.value;
					}, 0);
				}
			}, {
				key: 'selectedCards',
				get: function get() {
					return this.heldCards.filter(function (card) {
						return card.selected;
					});
				}
			}, {
				key: 'submittable',
				get: function get() {
					return this.selectedCards.length === 3;
				}
			}, {
				key: 'activeCard',
				get: function get() {
					return _.find(this.cards, { id: this.activeCardId });
				}
			}, {
				key: 'heldCards',
				get: function get() {
					return this.cards.filter(function (card) {
						return !card.played;
					});
				}
			}, {
				key: 'playedCards',
				get: function get() {
					return this.cards.filter(function (card) {
						return card.played;
					});
				}
			}, {
				key: 'highestHeldCardValue',
				get: function get() {
					return this.cards.reduce(function (value, card) {
						if (!card.played) {
							return Math.max(value, card.value);
						}

						return value;
					}, 0);
				}
			}]);

			return Deck;
		}(),

		Player: function () {
			/*
    * Player has a name, a color, a deck, and a corp
    */
			function Player(options) {
				_classCallCheck(this, Player);

				this.name = options.name;
				this.uid = options.uid;
				this.color = options.color || allColors.splice(-1)[0];
				this.corp = new ClassFactory.Corp();
				this.deck = new ClassFactory.Deck(this.color);
				this.idx = options.idx;
				this.collectables = [];
				this.payment = [];
			}

			_createClass(Player, [{
				key: 'reset',
				value: function reset() {
					this.collectables = [];
					this.payment = [];
					this.deck.reset();
				}
			}, {
				key: 'playCardSet',
				value: function playCardSet(cardSet) {
					var _this = this;

					cardSet.forEach(function (card) {
						_this.playCard(card);
					});
				}
			}, {
				key: 'playCard',
				value: function playCard(card) {
					this.deck.play(card);
				}
			}, {
				key: 'collect',
				value: function collect(item) {
					this.collectables.push(_.clone(item));
				}
				// },

				// User: class User {
				// 	constructor() {}

			}]);

			return Player;
		}()
	};

	return ClassFactory;
}]);
mainApp.factory('EventFactory', ['CardFactory', 'FirebaseFactory', 'ClassFactory', function EventFactory(CF, FF, Class) {
	'use strict';

	/**
  * Note: $s needs to be defined. This can be done by setting this entire
  * factory as a property of $s and calling the methods from that property
  */

	var EF = {
		gameCreated: function gameCreated(resolve) {
			$s.state = 'startGame';
			resolve();
		},
		startGame: function startGame(resolve) {
			var users = FF.getFBObject('users');
			users.$loaded(function () {
				$s.activeGame.playerIds.map(function (id) {
					var user = users[id];
					$s.allPlayers.push(new Class.Player({
						name: user.firstName,
						uid: user.uid,
						idx: $s.allPlayers.length + 1
					}));
				});
				$s.activeGame.active = true;
				$s.user = _.find($s.allPlayers, { uid: $s.currentUser.uid });
				EF.chooseBattle(resolve);
			});
		},
		// if a function uses `this` for the event, it cannot be an arrow function
		playCard: function playCard(resolve) {
			var card = $s.currentPlayer.deck.findById(this.cardId);

			if ($s.currentPlayer.playCard(card)) {
				console.log('Event ' + $s.eventTracker + ':', $s);
				$s.state = 'strength';
				resolve();
			} else {
				resolve();
			}
		},
		closeModal: function closeModal(resolve) {
			$s.modalInstance.close();
			resolve();
		},
		chooseBattle: function chooseBattle(resolve) {
			$s.state = 'chooseBattle';
			$s.activeGame.message = {};
			resolve();
		},
		submitBattle: function submitBattle(resolve) {
			if (!$s.battleHistory[this.battleCount]) {
				$s.battleHistory[this.battleCount] = {};
			}

			$s.battleHistory[this.battleCount][this.uid] = this.cards;

			if (_.keys($s.battleHistory[this.battleCount]).length == $s.allPlayers.length) {
				EF.battle(this.battleCount, resolve);
			} else {
				resolve();
			}
		},
		battle: function battle(count, resolve) {
			_.mapKeys($s.battleHistory[count], function (cards, uid) {
				var player = _.find($s.allPlayers, { uid: uid });

				player.battlePower = cards.reduce(function (total, card) {
					return total + card.value;
				}, 0);
				player.winner = false;
				player.playCardSet(cards);
			});

			EF.determineWinner(resolve);
		},
		determineWinner: function determineWinner(resolve) {
			$s.allPlayers.sort(function (a, b) {
				return b.battlePower - a.battlePower;
			});

			$s.allPlayers.forEach(function (player, i) {
				var nextPlayer = $s.allPlayers[i + 1] || {};

				if (i === 0) {
					player.winner = true;
				}

				if (player.battlePower == nextPlayer.battlePower) {
					player.duplicateBattlePower = true;
					nextPlayer.duplicateBattlePower = true;
					nextPlayer.winner = player.winner;
				}
			});

			$s.state = 'determineWinner';
			resolve();
		},
		takeResource: function takeResource(resolve) {
			// take a resource
			resolve();
		}
	};

	return EF;
}]);
mainApp.factory('FirebaseFactory', ['$firebaseArray', '$firebaseObject', function FirebaseFactory($fbArray, $fbObject) {
	'use strict';

	var FB = null;
	var FF = {
		// Firebase methods
		getFB: function getFB(childPath) {
			if (!FB) {
				FB = firebase.database().ref();
			}

			return childPath ? FB.child(childPath) : FB;
		},

		getFBArray: function getFBArray(childPath) {
			return $fbArray(FF.getFB(childPath));
		},

		getFBObject: function getFBObject(childPath) {
			return $fbObject(FF.getFB(childPath));
		},

		getAuth: function getAuth(childPath) {
			return $firebaseAuth(FF.getFB(childPath));
		},

		setFB: function setFB(childPath, value) {
			var ref = FF.getFB(childPath);
			ref.set(value);

			return false;
		},
		googleLogin: function googleLogin(err, success) {
			var provider = new firebase.auth.GoogleAuthProvider();
			firebase.auth().signInWithPopup(provider).then(function (result) {
				success(result.user);
			}).catch(function (error) {
				err(error);
			});
		},
		facebookLogin: function facebookLogin(err, success) {
			var provider = new firebase.auth.FacebookAuthProvider();
			provider.addScope('public_profile');
			firebase.auth().signInWithPopup(provider).then(function (result) {
				// This gives you a Facebook Access Token. You can use it to access the Facebook API.
				//var token = result.credential.accessToken;
				// The signed-in user info.
				//var user = result.user;
				success(result.user);
			}).catch(function (error) {
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
}]);

var mc = {
	pluralize: function pluralize(str) {
		return str.replace(/y$/, 'ie') + 's';
	},

	camelToTitle: function camelToTitle(str) {
		return _.capitalize(str.replace(/([A-Z])/g, ' $1')).trim();
	},

	randomDigits: function randomDigits(min, max) {
		min = min === undefined ? 1 : min;
		max = max || 999;

		return Math.floor(Math.random() * (max - min + 1) + min);
	},

	alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),

	isAngularObjectEqual: function isAngularObjectEqual(object1, object2) {
		return _.isEqual(_.omit(object1, '$$hashKey'), _.omit(object2, '$$hashKey'));
	},

	expandArray: function expandArray(array, times) {
		//	turns [1,2,3] into [1,2,3,1,2,3,1,2,3];
		times = times || 3; //	default number of times to expand it by

		var expandedArray = [];

		for (var i = 0; i < times; i++) {
			expandedArray = expandedArray.concat(angular.copy(array));
		}

		return expandedArray;
	},

	calculateAge: function calculateAge(dateOfBirth) {
		var age;

		if (dateOfBirth) {
			var year = Number(dateOfBirth.substr(0, 4));
			var month = Number(dateOfBirth.substr(5, 2)) - 1;
			var day = Number(dateOfBirth.substr(8, 2));
			var today = new Date();
			age = today.getFullYear() - year;

			if (today.getMonth() < month || today.getMonth() == month && today.getDate() < day) {
				age--;
			}
		}

		return age || 0;
	}
};