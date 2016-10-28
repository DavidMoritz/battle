/*!
 * A new battle game by David Wintterle - v0.0.1 
 * Build Date: 2016.10.28 
 * Docs: http://moritzcompany.com 
 * Coded @ Moritz Company 
 */ 
 
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
mainApp.controller('MainCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'$uibModal',
	'ClassFactory',
	'EventFactory',
	'FirebaseFactory',
	function MainCtrl($s, $timeout, $interval, $uibM, CF, EF, FF) {
		'use strict';

		function init() {
			//	init stuff
			window.$s = $s;

			if (typeof Promise !== 'function') {
				alert('You\'re browser is not capable of supporting this game. Please trash your crappy backward browser and switch to modern browser like Chrome, Safair, or Firefox');
			}

			$s.joinableGames = _.mapKeys($s.allGames, (game, key) => {
				if (typeof game === 'object' && game && game.name) {
					switch (true) {
						case (game.playerIds.indexOf($s.currentUser.uid) !== -1):
						case (game.public && !game.active):
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
			window.stopChat = latestChat.$watch(() => {
				$s.chatList.push(_.clone(latestChat));
			});
		}

		function createNewUser(id, data) {
			var allUsers = FF.getFBObject('users');

			allUsers.$loaded(() => {
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
			$s.joinActiveGame({id: id});
		}

		function updateGame() {
			if ($s.restartTurn) {
				restartTurn();
			} else if ($s.eventTracker < $s.activeGame.events.length) {
				$s.activeGame.events.reduce(prevEvent => {
					return prevEvent.then(() => {
						return runEvent(++$s.eventTracker);
					}, () => $s);
				}, runEvent($s.eventTracker));
			}
		}

		function runEvent(idx) {
			if (idx >= $s.activeGame.events.length) {
				$s.eventTracker = $s.activeGame.events.length;
				// return meaningless function to avoid error
				return {then: () => 0};
			}
			var event = $s.activeGame.events[idx];
			var eventFunction = EF[event.name];

			return new Promise(eventFunction.bind(event));
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
			submitBattleHistory: [],
			upgradeHistory: [],
			activeGame: {},
			eventTracker: 0,
			ff: {
				gameName: 'newGame'
			}
		});

		$s.getEventCount = (name) => {
			var subEvents = $s.activeGame.events.slice(0, $s.eventTracker);
			var submitEvents = _.partition(subEvents, {name})[0].length;

			if ($s.allPlayers.length == 1) {
				return submitEvents;
			}

			return Math.floor(submitEvents / $s.allPlayers.length);
		};

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

		$s.waitEvent = (name, cards) => {
			$s.waiting = true;

			$s.addEvent({
				name,
				cards,
				uid: $s.user.uid,
				eventCount: $s.getEventCount(name)
			});
		};

		$s.submitCards = () => {
			$s.waitEvent('submitBattle', $s.user.deck.selectedCards);
		};

		$s.upgradeCards = () => {
			$s.waitEvent('upgrade', $s.user.deck.chosenUpgrades);
		};

		$s.addEvent = event => {
			if (typeof event == 'string') {
				event = {name: event};
			}
			event.timestamp = new Date().getTime();
			$s.activeGame.events.push(event);
		};

		$s.changeState = state => {
			$s.state = state;
		};

		$s.createNewGame = () => {
			// This should be separated based on something so that the
			// "allGames" doesn't just continue to grow.
			// maybe after a game is completed, it gets moved into an
			// archive of some sort rather than continue to be in here.
			var rand = Math.random().toString(36).substring(2, 10);
			allGames.$ref().update({[rand]: {
				id: rand,
				//name: $s.ff.gameName,
				name: `${$s.currentUser.firstName}'s Game`,
				timestamp: new Date().getTime(),
				events: [{
					name: 'gameCreated'
				}],
				hostId: $s.currentUser.uid,
				active: false,
				public: true
			}}, () => {
				$s.joinActiveGame({id: rand});
			});
		};

		$s.joinActiveGame = game => {
			if ($s.activeGame.id || !$s.currentUser) {
				return;
			}

			var activeGame = FF.getFBObject(`allGames/${game.id}`);
			activeGame.$bindTo($s, 'activeGame');

			activeGame.$loaded(() => {
				if (!$s.activeGame.playerIds) {
					$s.activeGame.playerIds = [];
					$s.activeGame.playerNames = [];
				}

				if ($s.activeGame.playerIds.indexOf($s.currentUser.uid) === -1) {
					$s.activeGame.playerIds.push($s.currentUser.uid);
					$s.activeGame.playerNames.push($s.currentUser.name);
				}

				$s.submitBattleHistory = [];
				$s.upgradeHistory = [];
				$s.eventTracker = 0;
				$s.$watch('activeGame.events', updateGame);
			});
			stopChat();
		};

		$s.selectCard = card => {
			card.selected = !card.selected;
		};

		$s.viewCard = card => {
			openModal('ViewCard', {
				card: card
			});
		};

		$s.chooseResource = card => {
			if ($s.currentPlayer == $s.user) {
				$s.addEvent({
					name: 'chooseResource',
					card
				});
			}
		};

		$s.fbLogin = () => {
			FF.facebookLogin(err => {
				console.log('There was a Facebook Login error', err);
				$s.notify('Facebook Login Error', 'danger');
				// ** TEMPORARY FOR DEV ***
				$s.currentUser = FF.getFBObject('users/DrocniTEYXeclP6n52ugMXEzAgF3');
				$s.currentUser.$loaded(init);
				// ** END TEMPORARY FOR DEV ***
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
				/* TEMP LOGIN */
				$s.currentUser = FF.getFBObject('users/dpnncrYpfoNkC4qcg5aNzNtBezS2');
				$s.currentUser.$loaded(init);
				/* END TEMP LOGIN */
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
		window.allGames = FF.getFBObject('allGames');
		allGames.$bindTo($s, 'allGames');
		allGames.$loaded(() => {
			$('body').addClass('facebook-available');
			listenToChat();
		});
	}
]);
mainApp.controller('ViewCardModalInstanceCtrl', function ModalCtrl($scope, $uibModalInstance, card) {
	$scope.card = card;

	$scope.cancel = () => $uibModalInstance.dismiss('cancel');
});
mainApp.factory('CardFactory', [
	function CardFactory() {
		'use strict';

		return {
			yellow: [
				{
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
				}
			],
			purple: [
				{
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
				}
			],
			cyan: [
				{
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
				}
			],
			orange: [
				{
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
				}
			],
			upgradeCards: [
				{
					id: 'UP01',
					class: 'utopia',
					name: 'Utopia'
				}, {
					id: 'UP02',
					class: 'military',
					name: 'Military'
				}, {
					id: 'UP03',
					class: 'defense',
					name: 'Defense'
				}, {
					id: 'UP04',
					class: 'knowledge',
					name: 'Shared Knowledge'
				}, {
					id: 'UP05',
					class: 'converter',
					name: 'Resource Converter'
				}, {
					id: 'UP06',
					class: 'progress-cards',
					name: 'Progress Cards'
				}, {
					id: 'UP07',
					class: 'double',
					name: 'Double Upgrade'
				}
			],
			resources: [
				{
					initial: 'RL1',
					class: 'wood',
					title: 'Lumber',
					symbol: 'l',
					tradeValue: 3,
					resources: [{
						name: 'wood'
					}]
				}, {
					initial: 'RM2',
					class: 'mineral',
					title: 'Mineral Deposits',
					symbol: 'm',
					tradeValue: 3,
					resources: [{
						name: 'mineral'
					}]
				}, {
					initial: 'RE3',
					class: 'energy',
					title: 'Energy Crystals',
					symbol: 'e',
					tradeValue: 3,
					resources: [{
						name: 'energy'
					}]
				}, {
					initial: 'RF4',
					class: 'food',
					title: 'Food',
					symbol: 'f',
					tradeValue: 3,
					resources: [{
						name: 'food'
					}]
				}
			],
			winner: [
				{
					id: 'RWL1',
					class: 'winner wood',
					title: 'Double Lumber',
					symbol: 'l l',
					tradeValue: 5,
					resources: [{
						name: 'wood'
					},{
						name: 'wood'
					}]
				}, {
					id: 'RWM2',
					class: 'winner mineral',
					title: 'Double Mineral Deposits',
					symbol: 'm m',
					tradeValue: 5,
					resources: [{
						name: 'mineral'
					},{
						name: 'mineral'
					}]
				}, {
					id: 'RWE3',
					class: 'winner energy',
					title: 'Double Energy Crystals',
					symbol: 'e e',
					tradeValue: 5,
					resources: [{
						name: 'energy'
					},{
						name: 'energy'
					}]
				}, {
					id: 'RWF4',
					class: 'winner food',
					title: 'Double Food',
					symbol: 'f f',
					tradeValue: 5,
					resources: [{
						name: 'food'
					},{
						name: 'food'
					}]
				}, {
					id: 'RWW5',
					class: 'winner wild',
					title: 'Wild',
					symbol: 'w',
					tradeValue: 5,
					resources: [{
						name: 'wild'
					}]
				}
			],
			get allCards() {
				return [].concat(this.purple, this.yellow, this.cyan, this.orange, this.resources, this.winner);
			}
		};
	}
]);
mainApp.factory('ClassFactory', [
	'CardFactory',
	function CFactory(CF) {
		'use strict';

		/**
		 * Shuffle Deck
		 * The game needs to shuffle the cards in a predictable way
		 * so that every user gets the same outcome. This is done by
		 * 'seeding' the algorithm with the randomly generated gameId.
		 * This algorthim has been tested over larger iterations here:
		 * https://jsfiddle.net/sr7djh8x/6/
		 */
		function shuffleDeck(deck, seed) {
			return deck.sort((a, b) => {
				var gameNumber = parseInt(seed, 36);
				var firstCardNum = parseInt(a.id, 36);
				var secondCardNum = parseInt(b.id, 36);

				return (gameNumber % firstCardNum) - (gameNumber % secondCardNum);
			});
		}

		const allColors = ['yellow', 'cyan', 'orange', 'purple'];
		const ClassFactory = {
			Corp: class Corp {
				constructor() {
					this.military = {
						level: 0,
						points: 0
					};
					this.defense = {
						level: 0,
						points: 0
					};
					this.resourceConverter = {
						level: 0,
						points: 0
					};
					this.utopia = {
						level: 0,
						points: 0
					};
				}
			},

			Resources: class Resources {
				constructor(n, seed) {
					this.basic = [];
					this.winner = CF.winner;
					this.playCount = n;

					var push = resource => {
						var item = _.clone(resource);
						item.id = item.initial + n;

						this.basic.push(item);
					};

					while (n) {
						CF.resources.forEach(push);
						n--;
					}

					this.basic = shuffleDeck(this.basic, seed);
					this.winner = shuffleDeck(this.winner, seed);
				}
				get heldBasic() {
					return this.basic.filter(card => !card.played && !card.available);
				}
				get heldWinner() {
					return this.winner.filter(card => !card.played);
				}
				get available() {
					return Array.prototype.concat(
						this.winner.filter(card => card.available),
						this.basic.filter(card => card.available)
					);
				}
				findResource(resource) {
					return _.find(this.winner, resource) || _.find(this.basic, resource);
				}
				newResouces() {
					var count = this.playCount;

					while (count) {
						this.heldBasic[0].available = true;
						count--;
					}

					this.heldWinner[0].available = true;
				}
				play(cardInfo, player) {
					var card = this.findResource(cardInfo);

					this.takeResource(card);

					if (player) {
						card.resources.forEach(resource => player.collectResource(resource));
					}
				}
				takeResource(card) {
					card.played = true;
					card.available = false;
				}
			},

			Deck: class Deck {
				constructor(color) {
					this.cards = CF[color];
					this.upgradeCards = CF.upgradeCards;
					this.activeCardId = '';
				}
				get battleValue() {
					return this.selectedCards.reduce((total, card) => total + card.value, 0);
				}
				get selectedCards() {
					return this.heldCards.filter(card => card.selected);
				}
				get submittable() {
					var limit = Math.min(this.heldCards.length, 3);

					return this.selectedCards.length === limit;
				}
				get chosenUpgrades() {
					return this.upgradeCards.filter(card => card.selected);
				}
				get upgradable() {
					return this.chosenUpgrades.length === 2;
				}
				get activeCard() {
					return _.find(this.cards, {id: this.activeCardId});
				}
				get heldCards() {
					return this.cards.filter(card => !card.played);
				}
				get playedCards() {
					return this.cards.filter(card => card.played);
				}
				get highestHeldCardValue() {
					return this.cards.reduce((value, card) => {
						if (!card.played) {
							return Math.max(value, card.value);
						}

						return value;
					}, 0);
				}
				findById(cardId) {
					return _.find(this.cards, {id: cardId});
				}
				reset() {
					this.cards.map(card => {
						card.played = false;
						card.selected = false;
						card.plays = 0;
					});
				}
				play(cardInfo) {
					var card = _.find(this.cards, {id: cardInfo.id});

					card.played = true;
				}
				remove(cardInfo) {
					var card = _.find(this.cards, {id: cardInfo.id}),
						idx = _.findIndex(this.cards, card);

					this.cards.splice(idx, 1);
				}
				add(card) {
					this.cards.push(card);
				}
			},

			Player: class Player {
				/*
				 * Player has a name, a color, a deck, and a corp
				 */
				constructor(options) {
					this.name = options.name;
					this.uid = options.uid;
					this.color = options.color || allColors.splice(-1)[0];
					this.corp = new ClassFactory.Corp();
					this.deck = new ClassFactory.Deck(this.color);
					this.idx = options.idx;
					this.collectables = [];
				}
				reset() {
					this.collectables = this.collectables.filter(item => !item.expiring);
					this.collectables.forEach(item => item.expiring = true);
					this.deck.reset();
				}
				playCardSet(cardSet) {
					cardSet.forEach(card => {
						this.playCard(card);
					});
				}
				playCard(card) {
					this.deck.play(card);
				}
				collectResource(item) {
					this.collectables.push(_.clone(item));
				}
			}
		};

		return ClassFactory;
	}
]);
mainApp.factory('EventFactory', [
	'CardFactory',
	'FirebaseFactory',
	'ClassFactory',
	function EventFactory(CF, FF, Class) {
		'use strict';

		/**
		 * Note: $s needs to be defined. This can be done by setting this entire
		 * factory as a property of $s and calling the methods from that property
		 */
		var EF = {
			gameCreated: resolve => {
				$s.state = 'startGame';
				resolve();
			},
			startGame: resolve => {
				var users = FF.getFBObject('users');
				users.$loaded(() => {
					$s.activeGame.active = true;
					$s.activeGame.playerIds.map(id => {
						var user = users[id];
						$s.allPlayers.push(new Class.Player({
							name: user.firstName,
							uid: user.uid,
							idx: $s.allPlayers.length + 1
						}));
					});
					$s.resources = new Class.Resources($s.allPlayers.length, $s.activeGame.id);
					$s.user = _.find($s.allPlayers, {uid: $s.currentUser.uid});
					EF.chooseBattle(resolve);
				});
			},
			// // if a function uses `this` for the event, it cannot be an arrow function
			// playCard: function(resolve) {
			// 	var card = $s.currentPlayer.deck.findById(this.cardId);

			// 	if ($s.currentPlayer.playCard(card)) {
			// 		console.log(`Event ${$s.eventTracker}:`, $s);
			// 		$s.state = 'strength';
			// 		resolve();
			// 	} else {
			// 		resolve();
			// 	}
			// },
			closeModal: resolve => {
				$s.modalInstance.close();
				resolve();
			},
			chooseBattle: resolve => {
				$s.state = 'chooseBattle';
				$s.resources.newResouces();
				$s.activeGame.message = {};
				resolve();
			},
			update: function(resolve) {
				EF.submit.bind(this)(resolve);
			},
			submitBattle: function(resolve) {
				EF.submit.bind(this)(resolve);
			},
			submit: function(resolve) {
				var history = this.name + 'History';

				if (!$s[history][this.eventCount]) {
					$s[history][this.eventCount] = {};
				}

				$s[history][this.eventCount][this.uid] = this.cards;

				if (_.keys($s[history][this.eventCount]).length == $s.allPlayers.length) {
					EF[this.name + 'Ready'](this.eventCount, resolve);
					$s.waiting = false;
				} else {
					resolve();
				}
			},
			submitBattleReady: (count, resolve) => {
				_.mapKeys($s.submitBattleHistory[count], (cards, uid) => {
					var player = _.find($s.allPlayers, {uid});

					player.battlePower = cards.reduce((total, card) => total + card.value, 0);
					player.winner = false;
					player.playCardSet(cards);
				});

				EF.determineWinner(resolve);
			},
			determineWinner: resolve => {
				$s.allPlayers.sort((a, b) => b.battlePower - a.battlePower);

				$s.allPlayers.forEach((player, i) => {
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

				$s.currentPlayer = $s.allPlayers[0];

				$s.state = 'determineWinner';
				resolve();
			},
			chooseResource: function(resolve) {
				var idx = _.findIndex($s.allPlayers, $s.currentPlayer);

				$s.resources.play(this.card, $s.currentPlayer);

				if ($s.resources.available.length == 1) {
					$s.resources.play($s.resources.available[0]);

					if ($s.currentPlayer.deck.heldCards.length) {
						EF.chooseBattle(resolve);
					} else {
						$s.state = 'upgrade';
						EF.upgradeReady(resolve);
					}
				} else {
					$s.currentPlayer = $s.allPlayers[idx + 1];
					resolve();
				}
			},
			upgradeReady: (count, resolve) => {
				resolve();
			}
		};

		return EF;
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
