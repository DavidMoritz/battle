/*!
 * Some have suggested that this game is similar to the board game 'Lewis and Clark' by Space Cowboys. - v0.0.1 
 * Build Date: 2016.09.25 
 * Docs: http://moritzcompany.com 
 * Coded @ Moritz Company 
 */ 
 
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
mainApp.controller('MainCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'$uibModal',
	'ItemFactory',
	'BoatFactory',
	'ClassFactory',
	'MapFactory',
	'FirebaseFactory',
	'EventFactory',
	'CardFactory',
	function MainCtrl($s, $timeout, $interval, $uibM, IF, BF, Class, MF, FF, EF, CF) {
		'use strict';

		function init() {
			//	init stuff
			window.$s = $s;

			/**
			// remove scrolling also removes click and drag
			window.addEventListener('touchmove', function disallowScrolling(event) {
				if ($(document).width() >= 768) {
					event.preventDefault();
				}
			}, false);
			*/
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

		function listenToChat() {
			window.latestChat = FF.getFBObject('message');
			window.stopChat = latestChat.$watch(() => {
				$s.chatList.push(_.clone(latestChat));
			});
		}

		/**
		 * Shuffle Journal
		 * The game needs to shuffle the cards in a predictable way
		 * so that every user gets the same outcome. This is done by
		 * 'seeding' the algorithm with the randomly generated gameId.
		 * This algorthim has been tested over larger iterations here:
		 * https://jsfiddle.net/sr7djh8x/6/
		 */
		function shuffleJournal() {
			var shuffledDeck = CF.journalCards.sort((a, b) => {
				var gameNumber = parseInt($s.activeGame.id, 36);
				var firstCardNum = parseInt(a.id, 36);
				var secondCardNum = parseInt(b.id, 36);

				return (gameNumber % firstCardNum) - (gameNumber % secondCardNum);
			});

			var startJournal = shuffledDeck.splice(0,5);
			startJournal.sort((a, b) => a.strength - b.strength);

			$s.journal = startJournal.concat(shuffledDeck);
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

		function leaveGame() {
			$s.activeGame = null;
			listenToChat();
		}

		function updateCursor() {
			$s.cursor.left = ($s.activeGame.cursor.left + Math.max(($('body').width() - $('.container').width()) / 2, 0)) + 'px';
			$s.cursor.top = $s.activeGame.cursor.top + 'px';
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

		function countSymbols(type) {
			var searchThesePlayers = [$s.currentPlayer.idx];

			if ($s.currentPlayer.idx == $s.allPlayers.length) {
				searchThesePlayers.push(1);
				searchThesePlayers.push($s.currentPlayer.idx - 1);
			} else if ($s.currentPlayer.idx == 1) {
				searchThesePlayers.push($s.allPlayers.length);
				searchThesePlayers.push($s.currentPlayer.idx + 1);
			} else {
				searchThesePlayers.push($s.currentPlayer.idx - 1);
				searchThesePlayers.push($s.currentPlayer.idx + 1);
			}

			var players = $s.allPlayers.filter(player => searchThesePlayers.indexOf(player.idx) !== -1);
			
			return players.reduce((count, player) => {
				return count + player.deck.playedCards.filter(card => card.symbol == type).length;
			}, 0);
		}

		//	initialize scoped variables
		_.assign($s, {
			allItems: IF.allItems,
			allPlayers: [],
			ff: {
				gameName: 'newGame'
			},
			map: MF.map,
			eventTracker: 0,
			chatList: [],
			recruitCard: {},
			activeGame: {},
			special: {},
			modalInstance: {
				close: () => 0
			},
			cursor: {
				left: '0px',
				top: '0px'
			},
			boardSpaces: CF.boardSpaces.map(space => {
				space.content = space.event == 'boardPowWow' ? [IF.indian()] : [];
				space.allow = space.allow || 1;

				return space;
			}),
			chooseBoats: BF.chooseBoats
		});

		Object.defineProperty($s, 'state', {
			set: val => {
				if (typeof val == 'string') {
					if ($s._state != 'recruit' && $s._state != 'board') {
						$s.previousState = $s._state;
					}
					$s._state = val;
				}
			},
			get: () => $s._state
		});
			
		$s.state = 'welcome';

		$s.getFaceUpPlayedCards = () => {
			return $s.allPlayers.reduce((cards, player) => {
				return cards.concat(player.deck.cards.filter(card => card.played && !card.support));
			},[]);
		};

		$s.newComer = () => {
			if ($s.indianSupply) {
				var powwow = _.find($s.boardSpaces, {event: 'boardPowWow'});

				powwow.content.push(IF.indian());
				$s.indianSupply--;
			}
		};

		$s.dragBoatSuccess = (resolve, boat, idx) => {
			// hide the item
			$(`.${boat.id}`).find('.item').eq(idx).addClass('hidden');
			setTimeout(() => {
				$('.item.hidden').removeClass('hidden');
			}, 1000);

			$s.addEvent({
				name: 'removeItem',
				idx: idx,
				boatId: boat.id,
				playerId: $s.user.uid
			}, resolve);
		};

		$s.dragCollectSuccess = (resolve, idx) => {
			// hide the item
			$('.collect-boat').find('.item').eq(idx).addClass('hidden');
			setTimeout(() => {
				$('.item.hidden').removeClass('hidden');
			}, 1000);

			$s.addEvent({
				name: 'collectItem',
				idx: idx
			}, resolve);
		};

		$s.dragHorseSuccess = (resolve, idx) => {
			// hide the item
			$('.horse-payment-space').find('.item').eq(idx).addClass('hidden');
			setTimeout(() => {
				$('.item.hidden').removeClass('hidden');
			}, 1000);

			$s.addEvent({
				name: 'removeHorseItem',
				idx: idx
			}, resolve);
		};

		$s.dragCanoeSuccess = (resolve, idx) => {
			// hide the item
			$('.canoe-payment-space').find('.item').eq(idx).addClass('hidden');
			setTimeout(() => {
				$('.item.hidden').removeClass('hidden');
			}, 1000);

			$s.addEvent({
				name: 'removeCanoeItem',
				idx: idx
			}, resolve);
		};

		$s.dropBoatSuccess = (boat, item) => {
			$s.addEvent({
				name: 'addItem',
				boatId: boat.id,
				playerId: $s.user.uid,
				item: item.name,
				used: item.inUse || false
			});
		};

		$s.dropHorsePayment = item => {
			$s.addEvent({
				name: 'horsePayment',
				item: item.name
			});
		};

		$s.horseCollectionText = () => {
			var count = $s.horseCollectionCount();

			switch (count) {
				case -1:
					return 'Cannot Collect Yet';
				case 1:
					return 'Collect 1 Horse';
				default:
					return `Collect ${count} Horses`;
			}
		};

		$s.horseCollectionCount = () => {
			var indians = $s.horsePayment.content.filter(item => item.name == 'indian').length;
			var notIndians = $s.horsePayment.content.length - indians;

			if (notIndians % 3 === 0 && indians <= 2) {
				var max = notIndians / 3;
				var total = $s.horsePayment.content.reduce((total, item) => {
					if (item.name != 'indian') {
						total[item.name] = ++total[item.name] || 1;
					}

					return total;
				}, {});

				if (indians < max - 1) {
					return -1;
				}

				return _.values(total).filter(val => val > max).length ? -1 : max;
			}

			return -1;
		};

		$s.dropCanoePayment = item => {
			$s.addEvent({
				name: 'canoePayment',
				item: item.name
			});
		};

		$s.canoeCollectionText = () => {
			var count = $s.canoeCollectionCount();

			switch (count) {
				case -1:
					return 'Cannot Collect Yet';
				case 1:
					return 'Collect 1 Canoe';
				default:
					return `Collect ${count} Canoes`;
			}
		};

		$s.canoeCollectionCount = () => {
			var indians = $s.canoePayment.content.filter(item => item.name == 'indian').length;
			var wood = $s.canoePayment.content.filter(item => item.name == 'wood').length;

			if (wood % 2 === 0 && indians <= 2 && $s.canoePayment.content.length == indians + wood) {
				var max = wood / 2;

				return indians < max - 1 ? -1 : max;
			}

			return -1;
		};

		$s.validSupplyDrop = () => {
			return $('.dragging').find('.indian').length === 0;
		};

		$s.validIndianDrop = check => {
			var indian = $('.dragging').find('.indian');

			return check ? indian.not('.used').length : indian.length;
		};

		$s.userTurn = () => {
			if ($s.currentUser && $s.currentPlayer) {
				return $s.currentUser.uid == $s.currentPlayer.uid;
			}

			return false;
		};

		$s.addEvent = (event, resolve) => {
			if (typeof event == 'string') {
				event = {name: event};
			}
			event.timestamp = new Date().getTime();

			// $s.activeGame.events.push(event);
			// when push event is confirmed in database
			activeGame.events.push(event);
			activeGame.$save().then(resolve);
		};

		$s.createNewGame = () => {
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
				public: true,
				cursor: {
					left: 0,
					top: 0
				}
			}}, () => {
				$s.joinActiveGame({id: rand});
			});
		};

		$s.joinActiveGame = game => {
			if ($s.activeGame.id || !$s.currentUser) {
				return;
			}

			window.activeGame = FF.getFBObject(`allGames/${game.id}`);

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
				shuffleJournal();
				$s.eventTracker = 0;
				$s.$watch('activeGame.events', updateGame);
				$s.$watch('activeGame.cursor', updateCursor);
			});
			stopChat();
		};

		$s.moveCursor = e => {
			if ($s.userTurn()) {
				var offset = Math.max(($('body').width() - $('.container').width()) / 2, 0);
				$s.activeGame.cursor.left = e.pageX - offset + 2;
				$s.activeGame.cursor.top = e.pageY + 2;
			}
		};

		$s.callPlayCard = card => {
			if ($s.userTurn() && !$s.currentPlayer.takenMainAction) {
				$s.addEvent({
					name: 'playCard',
					cardId: card.id
				});
			}
		};

		$s.addStrength = card => {
			if ($s.userTurn() && !$s.currentPlayer.strengthAdded) {
				$s.addEvent({
					name: 'addStrength',
					cardId: card.id
				});
			}
		};

		$s.trash = card => {
			if ($s.userTurn() && $s.currentPlayer.trashCount) {
				$s.addEvent({
					name: 'trashCard',
					cardId: card.id
				});
			}
		};

		$s.useFaceUpAbility = card => {
			if ($s.userTurn()) {
				$s.addEvent({
					name: 'useFaceUpAbility',
					cardId: card.id
				});
			} else {
				$s.viewCard(card);
			}
		};

		$s.chooseBoat = (type, size) => {
			if ($s.userTurn()) {
				$s.addEvent({
					name: 'collectBoat',
					type: type,
					size: size
				});
			}
		};

		$s.recruitPayment = card => {
			if ($s.userTurn()) {
				if (card) {
					$s.addEvent({
						name: 'recruitPayment',
						cardId: card.id
					});
				} else {
					$s.addEvent('recruitPayment');
				}
			}
		};

		$s.useAbility = (idx, ability) => {
			if ($s.userTurn() && $s.currentPlayer.strengthAvailable) {
				$s.addEvent({
					name: ability.event || 'useAbility',
					idx: idx,
					wood: countSymbols('wood'),
					equipment: countSymbols('equipment'),
					fur: countSymbols('fur'),
					meat: countSymbols('meat')
				});
			}
		};

		$s.useFaceUpCardAbility = (idx, ability) => {
			if ($s.userTurn()) {
				$s.addEvent({
					name: ability.event || 'useFaceUpCardAbility',
					idx: idx,
					wood: countSymbols('wood'),
					equipment: countSymbols('equipment'),
					fur: countSymbols('fur'),
					meat: countSymbols('meat')
				});
			}
		}; 

		$s.addIndian = () => {
			if ($s.userTurn()) {
				$s.addEvent('addIndianToStrength');
			}
		};	

		$s.recruitThisCard = card => {
			if ($s.userTurn()) {
				$s.addEvent({
					name: 'openRecruitPayment',
					cardId: card.id,
					strength: card.strength,
					fur: $s.journal.indexOf(card) + 1
				});
			} else {
				$s.viewCard(card);
			}
		};

		$s.clickBoardSpace = space => {
			if ($s.userTurn() && !$s.currentPlayer.takenMainAction) {
				if ($s.currentPlayer.indianCount) {
					if (space.content.length < space.max) {
						$s.addEvent({
							name: 'clickBoardSpace',
							space: space.event
						});
					} else {
						$s.notify('That space is full');
					}			
				} else {
					$s.notify('You need an indian to use that space');
				}
			}
		};

		$s.viewCard = card => {
			openModal('ViewCard', {
				card: card
			});
		};

		$s.viewPlayer = player => {
			openModal('ViewPlayer', {
				player: player
			});
		};

		$s.viewBoard = () => {
			if ($s.userTurn() && !$s.currentPlayer.takenMainAction) {
				if ($s.state == 'board') {
					$s.addEvent('backToPrevious');
				} else {
					$s.addEvent('openBoard');
				}
			} else {
				openModal('ViewBoard');
			}
		};

		$s.viewRecruit = () => {
			if ($s.userTurn() && $s.currentPlayer.notRecruited) {
				if ($s.state == 'recruit') {
					$s.addEvent('backToPrevious');
				} else {
					$s.addEvent('openRecruit');
				}
			} else {
				openModal('ViewRecruit');
			}
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
		window.allGames = FF.getFBObject('allGames');
		window.activeGame = {};
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

mainApp.controller('ViewPlayerModalInstanceCtrl', function ModalCtrl($scope, $uibModalInstance, player) {
	$scope.player = player;

	$scope.viewCard = card => {
		$s.viewCard(card);
		$scope.cancel();
	};

	$scope.cancel = () => $uibModalInstance.dismiss('cancel');
});

mainApp.controller('ViewBoardModalInstanceCtrl', function ModalCtrl($scope, $uibModalInstance) {
	$scope.boardSpaces = $s.boardSpaces;

	$scope.cancel = () => $uibModalInstance.dismiss('cancel');
});

mainApp.controller('ViewRecruitModalInstanceCtrl', function ModalCtrl($scope, $uibModalInstance) {
	$scope.journal = $s.journal;

	$scope.viewCard = card => {
		$s.viewCard(card);
		$scope.cancel();
	};

	$scope.cancel = () => $uibModalInstance.dismiss('cancel');
});
mainApp.factory('BoatFactory', [
	function BoatFactory() {
		'use strict';

		return {
			startIndian: () => new Array(
				{
					id: 'BI11',
					style: 'BI11',
					cost: () => 0,
					capacity: 1,
					priority: 1,
					content: []
				},{
					id: 'BI21',
					style: 'BI21',
					cost: function cost() {
						return this.content.length;
					},
					capacity: 20,
					priority: 4,
					content: []
				}
			),
			startSupply: () => new Array(
				{
					id: 'BS11',
					style: 'BS11',
					cost: () => 0,
					capacity: 3,
					priority: 1,
					content: []
				},{
					id: 'BS21',
					style: 'BS21',
					cost: function cost() {
						return this.content.length ? 1 : 0;
					},
					capacity: 3,
					priority: 4,
					content: []
				},{
					id: 'BS31',
					style: 'BS31',
					cost: function cost() {
						return this.content.length;
					},
					capacity: 5,
					priority: 5,
					content: []
				}
			),
			indiansmall: num => _.clone({
				id: 'BI31-' + num,
				style: 'BI31',
				cost: () => 0,
				capacity: 1,
				priority: 2,
				content: []
			}),
			indianbig: num => _.clone({
				id: 'BI41-' + num,
				style: 'BI41',
				cost: function cost() {
					return this.content.length ? 1 : 0;
				},
				capacity: 3,
				priority: 3,
				content: []
			}),
			supplysmall: num => _.clone({
				id: 'BS41-' + num,
				style: 'BS41',
				cost: () => 0,
				capacity: 2,
				priority: 2,
				content: []
			}),
			supplybig: num => _.clone({
				id: 'BS51-' + num,
				style: 'BS51',
				cost: function cost() {
					return this.content.length ? 1 : 0;
				},
				capacity: 5,
				priority: 3,
				content: []
			}),
			chooseBoats: [
				{
					name: 'supplysmall',
					type: 'supply',
					size: 'small',
					bonus: 'Receive 2 basic resources of your choice',
					description: 'This Boat can contain up to two resources and costs no Time during Encampment.'
				},
				{
					name: 'indiansmall',
					type: 'indian',
					size: 'small',
					bonus: 'Receive 1 indian from supply (if any available)',
					description: 'This Boat can transport one Indian and costs no Time during Encampment.'
				},
				{
					name: 'supplybig',
					type: 'supply',
					size: 'big',
					bonus: 'Receive 2 basic resources of your choice',
					description: 'This Boat can contain up to five resources and costs one Time during Encampment if it contains at least one resource.'
				},
				{
					name: 'indianbig',
					type: 'indian',
					size: 'big',
					bonus: 'Receive 1 indian from supply (if any available)',
					description: 'This Boat can transport up to three Indians, and costs one Time during Encampment if it transports at least one Indian.'
				}
			]
		};
	}
]);

mainApp.factory('CardFactory', [
	function CardFactory() {
		'use strict';

		return {
			boardSpaces: [
				{
					event: 'boardCollectMeatFur',
					class: 'right',
					max: 1,
					description: 'Collect 1 food and 1 fur'
				},{
					event: 'boardCollectEquipmentWood',
					max: 1,
					description: 'Collect 1 equipment and 1 wood'
				},{
					event: 'boardCollectChoice',
					class: 'left',
					max: 1,
					description: 'Collect 2 fur or 2 wood'
				},{
					event: 'boardCollectCanoe',
					class: 'left',
					max: 20,
					allow: 3,
					description: 'Collect 1 canoe for 2 wood. May be used 3 times.'
				},{
					event: 'boardPowWow',
					class: 'center',
					max: 0,
					description: 'Indians dance the pow-wow here'
				},{
					event: 'boardResetJournal',
					class: 'right',
					max: 1,
					description: 'Remove all recruit cards from journal. May trash up to 3 cards from hand.'
				},{
					event: 'boardCollectHorse',
					class: 'center',
					max: 20,
					allow: 3,
					description: 'Collect 1 horse for 3 different items. May be used 3 times.'
				},{
					event: 'boardUseAbility',
					max: 1,
					description: 'For 1 food, use any ability of a played card in front of any player. The action may only be executed once.'
				},{
					event: 'boardCollectBoat',
					class: 'center',
					max: 2,
					description: 'Collect 1 boat for 3 wood. 4 possible boats. Small Supply: 2 slots free. Big Supply: 5 slots for 1 day. Small Indian: 1 slot free. Big Indian: 3 slots for 1 day.'
				}
			],
			lightblue: [
				{
					id: 'SP11',
					name: 'Meriweather Lewis',
					symbol: 'fur',
					description: 'Travel 2 river for 1 food / travel 4 river for 1 canoe / travel 2 mountain for 1 horse.',
					story: 'Captain of the U.S. Army and personal secretary to the President, he is chosen by President Jefferson to command the Expedition.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						cost: {
							canoe: 1
						},
						short: 'travel 4 river for 1 canoe',
						benefit: {
							river: 4
						}
					}, {
						cost: {
							meat: 1
						},
						short: 'travel 2 river for 1 food',
						benefit: {
							river: 2
						}
					}, {
						cost: {
							horse: 1
						},
						short: 'travel 2 mountain for 1 horse',
						benefit: {
							mountain: 2
						}
					}]
				}, {
					id: 'SP12',
					name: 'Pierre Cruzatte',
					symbol: 'wood',
					description: 'Take Indians from the Village and add them to your Expedition. Also trash first journal card.',
					story: 'Thanks to his French father and his Omaha mother he speaks 3 languages and is skilled in sign language. He is an expert riverman. He entertains the explorers with his fiddle-playing.',
					strength: 2,
					played: false,
					plays: 0,
					abilities: [{
						short: 'gather indians and trash journal card.',
						event: 'interpreter'
					}]
				}, {
					id: 'SP13',
					name: 'Hugh McNeal',
					symbol: 'wood',
					description: 'Collect Wood.',
					story: 'Almost killed by a Tillamook Indian during a romantic assignation. On the return trip, he surprises a grizzly and has to scurry up a willow tree and wait for the bear to leave.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'wood',
						short: 'collect wood.',
						benefit: {}
					}]
				}, {
					id: 'SP14',
					name: 'Seamor',
					symbol: 'meat',
					description: 'Collect Food.',
					story: 'Lewis’ black Newfoundland dog, he is the only animal to complete the entire trip. He hunts for food and provides warnings.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					}]
				}, {
					id: 'SP15',
					name: 'Alexander H. Willard',
					symbol: 'equipment',
					description: 'Collect Equipment.',
					story: 'He has a powerful physique and serves the expedition as blacksmith and gunsmith. He is able to repair equipment and make tools for trading with the Indians.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'equipment',
						short: 'collect equipment.',
						benefit: {}
					}]
				}, {
					id: 'SP16',
					name: 'Richard Windsor',
					symbol: 'fur',
					description: 'Collect Fur.',
					story: 'He is a great hunter and woodsman. Crossing a bluff, he slips and starts to fall down its edge. Lewis runs and tells him to dig his knife in and climb up. He does so, and escapes death.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					}]
				}
			],
			lightsalmon: [
				{
					id: 'SP21',
					name: 'William Clark',
					symbol: 'fur',
					description: 'Travel 2 river for 1 food / travel 4 river for 1 canoe / travel 2 mountain for 1 horse.',
					story: 'Lieutenant during the Northwest Indian War, he is recruited by his friend Lewis when he is 33 to share command of the newly formed Corps of Discovery.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						cost: {
							canoe: 1
						},
						short: 'travel 4 river for 1 canoe',
						benefit: {
							river: 4
						}
					}, {
						cost: {
							meat: 1
						},
						short: 'travel 2 river for 1 food',
						benefit: {
							river: 2
						}
					}, {
						cost: {
							horse: 1
						},
						short: 'travel 2 mountain for 1 horse',
						benefit: {
							mountain: 2
						}
					}]
				}, {
					id: 'SP22',
					name: 'François Labiche',
					symbol: 'wood',
					description: 'Take Indians from the Village and add them to your Expedition. Also trash first journal card.',
					story: 'Recruited as an enlisted member of the Corps, he is an experienced boatman and Indian trader. He speaks English, French and several Indian languages.',
					strength: 2,
					played: false,
					plays: 0,
					abilities: [{
						short: 'gather indians and trash journal card.',
						event: 'interpreter'
					}]
				}, {
					id: 'SP23',
					name: 'John B. Thompson',
					symbol: 'wood',
					description: 'Collect Wood.',
					story: 'He serves as a cook and creates maps. He goes out with several elk-hunting parties to “cure” meat in the field--a nearly essential skill in a damp climate.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'wood',
						short: 'collect wood.',
						benefit: {}
					}]
				}, {
					id: 'SP24',
					name: 'York',
					symbol: 'meat',
					description: 'Collect Food.',
					story: 'Clark’s manservant, he plays a key role in diplomatic relations. Because of his appearance, the Indians suspect he has magical powers. He saves Lewis from a grizzly bear.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					}]
				}, {
					id: 'SP25',
					name: 'Joseph Whitehouse',
					symbol: 'equipment',
					description: 'Collect Equipment.',
					story: 'He serves as a tailor and keeps a journal. He is almost killed on the Jefferson River.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'equipment',
						short: 'collect equipment.',
						benefit: {}
					}]
				}, {
					id: 'SP26',
					name: 'Joseph & Ruben Field',
					symbol: 'fur',
					description: 'Collect Fur.',
					story: 'They are brothers, two of the «Nine Young Men from Kentucky». Healthy and lucky, they are two of the top hunters of the expedition.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					}]
				}
			],
			lightgreen: [
				{
					id: 'SP31',
					name: 'Nathaniel Pryor',
					symbol: 'fur',
					description: 'Travel 2 river for 1 food / travel 4 river for 1 canoe / travel 2 mountain for 1 horse.',
					story: 'Described by the captains as «a man of character and ability», he is one of the «Nine Young Men from Kentucky». He supervises the carpentry at Camp Dubois.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						cost: {
							canoe: 1
						},
						short: 'travel 4 river for 1 canoe',
						benefit: {
							river: 4
						}
					}, {
						cost: {
							meat: 1
						},
						short: 'travel 2 river for 1 food',
						benefit: {
							river: 2
						}
					}, {
						cost: {
							horse: 1
						},
						short: 'travel 2 mountain for 1 horse',
						benefit: {
							mountain: 2
						}
					}]
				}, {
					id: 'SP32',
					name: 'George Gibson',
					symbol: 'wood',
					description: 'Take Indians from the Village and add them to your Expedition. Also trash first journal card.',
					story: 'He enlists as one of the “Nine Young Men from Kentucky” in 1803 and is a fine hunter and horseman and also plays the fiddle. He has some skills in sign language.',
					strength: 2,
					played: false,
					plays: 0,
					abilities: [{
						short: 'gather indians and trash journal card.',
						event: 'interpreter'
					}]
				}, {
					id: 'SP33',
					name: 'Patrick Gass',
					symbol: 'wood',
					description: 'Collect Wood.',
					story: 'He is one of the best hunters in the group, and is routinely sent out alone to scout the surrounding countryside for game. He is considered to be one of the first mountain men.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'wood',
						short: 'collect wood.',
						benefit: {}
					}]
				}, {
					id: 'SP34',
					name: 'John Colter',
					symbol: 'meat',
					description: 'Collect Food.',
					story: 'He is elected Sergeant after Floyd’s death. As a carpenter, he heads the construction of the Corps’ winter quarters, hews dugout canoes, and builds wagons to portage the canoes.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					}]
				}, {
					id: 'SP35',
					name: 'William Bratton',
					symbol: 'equipment',
					description: 'Collect Equipment.',
					story: 'Skilled blacksmith from Kentucky, he is over six feet tall and square-built. He has been suffering an extreme pain in his lower back for months and is cured in an Indian sweat lodge.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'equipment',
						short: 'collect equipment.',
						benefit: {}
					}]
				}, {
					id: 'SP36',
					name: 'Peter Weiser',
					symbol: 'fur',
					description: 'Collect Fur.',
					story: 'He serves as quartermaster, cook, and hunter. He is one of the Corps’ best shots .While the expedition is at Fort Clatsop, he is part of the salt-making detail on the Oregon coast.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					}]
				}
			],
			orchid: [
				{
					id: 'SP41',
					name: 'Charles Floyd',
					symbol: 'fur',
					description: 'Travel 2 river for 1 food / travel 4 river for 1 canoe / travel 2 mountain for 1 horse.',
					story: 'Quartermaster, he dies in August 1804 because of a fatal appendicitis. He is buried on a bluff overlooking the Missouri River in Iowa. He is he only person to die on the expedition.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						cost: {
							canoe: 1
						},
						short: 'travel 4 river for 1 canoe',
						benefit: {
							river: 4
						}
					}, {
						cost: {
							meat: 1
						},
						short: 'travel 2 river for 1 food',
						benefit: {
							river: 2
						}
					}, {
						cost: {
							horse: 1
						},
						short: 'travel 2 mountain for 1 horse',
						benefit: {
							mountain: 2
						}
					}]
				}, {
					id: 'SP42',
					name: 'J. Baptiste Lepage',
					symbol: 'wood',
					description: 'Take Indians from the Village and add them to your Expedition. Also trash first journal card.',
					story: 'He is a French-Canadian fur trader who is living among Minitari and Mandan Indians when the expedition arrives here in 1804. He replaces discharged Private John Newman.',
					strength: 2,
					played: false,
					plays: 0,
					abilities: [{
						short: 'gather indians and trash journal card.',
						event: 'interpreter'
					}]
				}, {
					id: 'SP43',
					name: 'Hugh Hall',
					symbol: 'wood',
					description: 'Collect Wood.',
					story: 'He has a penchant for whiskey, which together with other army infractions result in court martial penalties that are not of sufficient severity to dismiss him from the party.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'wood',
						short: 'collect wood.',
						benefit: {}
					}]
				}, {
					id: 'SP44',
					name: 'William Werner',
					symbol: 'meat',
					description: 'Collect Food.',
					story: 'He serves as a cook and was probably born in Kentucky. Before the expedition, he was disciplined for fighting with John Potts and is court-martialed in 1804 for mutiny.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					}]
				}, {
					id: 'SP45',
					name: 'John Potts',
					symbol: 'equipment',
					description: 'Collect Equipment.',
					story: 'German immigrant and miller by trade, he is a trusted member of the party. He nearly drowns, almost bleeds to death when he cuts his leg, and is attacked by a grizzly bear.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'equipment',
						short: 'collect equipment.',
						benefit: {}
					}]
				}, {
					id: 'SP46',
					name: 'John Collins',
					symbol: 'fur',
					description: 'Collect Fur.',
					story: 'Appointed cook for Sgt. Pryor’s mess, his main contribution is as one of the expedition’s best hunters. He captures specimens to scientifically document the Western wildlife.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					}]
				}
			],
			khaki: [
				{
					id: 'SP51',
					name: 'John Ordway',
					symbol: 'fur',
					description: 'Travel 2 river for 1 food / travel 4 river for 1 canoe / travel 2 mountain for 1 horse.',
					story: 'Sergeant of the U.S. Army, he is the right-hand man of the captains. In charge of guard duties and issuing provisions, he keeps the most detailed journal of the Expedition.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						cost: {
							canoe: 1
						},
						short: 'travel 4 river for 1 canoe',
						benefit: {
							river: 4
						}
					}, {
						cost: {
							meat: 1
						},
						short: 'travel 2 river for 1 food',
						benefit: {
							river: 2
						}
					}, {
						cost: {
							horse: 1
						},
						short: 'travel 2 mountain for 1 horse',
						benefit: {
							mountain: 2
						}
					}]
				}, {
					id: 'SP52',
					name: 'Robert Frazer',
					symbol: 'wood',
					description: 'Take Indians from the Village and add them to your Expedition. Also trash first journal card.',
					story: 'He joins the Corps of Discovery belatedly, after Moses Reed’s desertion. He keeps a diary and a valuable map.',
					strength: 2,
					played: false,
					plays: 0,
					abilities: [{
						short: 'gather indians and trash journal card.',
						event: 'interpreter'
					}]
				}, {
					id: 'SP53',
					name: 'Thomas P. Howard',
					symbol: 'wood',
					description: 'Collect Wood.',
					story: 'He is a steady member of the expedition, despite having been court-martialed for scaling the Fort Mandan stockade wall when returning from a visit to the Mandan Indian village.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'wood',
						short: 'collect wood.',
						benefit: {}
					}]
				}, {
					id: 'SP54',
					name: 'Silas Goodrich',
					symbol: 'meat',
					description: 'Collect Food.',
					story: 'He is transferred from his army unit to Lewis and Clark’s command in 1804. He is the principal fisherman for the corps, and provides other food when necessary.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					}]
				}, {
					id: 'SP55',
					name: 'John Shields',
					symbol: 'equipment',
					description: 'Collect Equipment.',
					story: 'He is from Virginia and the oldest man of the party, enlisting in 1803 at the age of 34. A talented man, he is head blacksmith, gunsmith, boat builder and general repairman.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'equipment',
						short: 'collect equipment.',
						benefit: {}
					}]
				}, {
					id: 'SP56',
					name: 'George Shannon',
					symbol: 'fur',
					description: 'Collect Fur.',
					story: '18 years old, one of the “Nine Young Men from Kentucky”. He is a good singer, hunter and horseman. He gets lost occasionally, but always manages to find his way back.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					}]
				}
			],
			journalCards: [
				{
					id: 'JC09',
					name: 'Joseph Barter',
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
					name: 'Ebenezer Tuttle',
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
					name: 'René Jessaume',
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
					name: 'Moses B. Reed',
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
					name: 'P. Antoine Tabeau',
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
					name: 'John Hay',
					symbol: 'fur',
					description: 'For each Strength that activates this card, choose one of the two resources: Fur or Wood, and collect it. (By activating this card three times, you can, for instance, collect Fur twice and Wood once.)',
					story: 'As a merchant, fur trader, and Cahokia’s post- master, he provides information. Since he speaks French and English, he helps as an interpreter.',
					strength: 2,
					abilities: [{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					},{
						collect: 'wood',
						short: 'collect wood.',
						benefit: {}
					}]
				}, {
					id: 'JC22',
					name: 'Black Moccasin',
					symbol: 'fur',
					description: 'For each Strength that activates this card, choose one of the two resources: Equipment or Food, and collect it. (By activating this card three times, you can, for instance, collect Equipment twice and Food once.)',
					story: 'Minitari chief, he captured Sacagawea from the Shoshone a few years earlier.',
					strength: 2,
					abilities: [{
						collect: 'equipment',
						short: 'collect equipment.',
						benefit: {}
					},{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					}]
				}, {
					id: 'JC26',
					name: 'Hawk\'s Feather',
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
					name: 'Coboway',
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
					name: 'Old Toby',
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
					},{
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
					name: 'Cameahwait',
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
					},{
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
					name: 'J. Baptiste Deschamps',
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
					name: 'John Newman',
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
					},{
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
					name: 'Broken Arm',
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
					name: 'James Mackay',
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
					},{
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
					name: 'Dickson & Hancock',
					symbol: 'meat',
					description: 'For each Strength that activates this card, choose one of the two resources: Food or Fur, and collect it. (By activating this card three times, you can, for instance, collect Food twice and Fur once.)',
					story: 'Fur trappers, they meet the expedition in September,1806, during its return to Washington. They invite John Colter to join them as a trapper.',
					strength: 2,
					abilities: [{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					},{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					}]
				}, {
					id: 'JC38',
					name: 'Hugh Heney',
					symbol: 'meat',
					description: 'For each Strength that activates this card, choose one of the three resources: Fur, Food or Wood. Then collect it. (By activating this card three times, you can, for instance, collect Fur once, Food once and Wood once.)',
					story: 'Canadian fur trader, a «very sensible, intelligent man», he knows the Teton Sioux like no other white man. Heney sends some snakebite medicine to Lewis & Clark.',
					strength: 3,
					abilities: [{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					},{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					},{
						collect: 'wood',
						short: 'collect wood.',
						benefit: {}
					}]
				}, {
					id: 'JC03',
					name: 'Buffalo Medicine',
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
					name: 'John Dame',
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
					name: 'Charles Mackenzie',
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
					name: 'Big White',
					symbol: 'equipment',
					description: 'For each Strength that activates this card, choose one of the two resources: Equipment or Wood. Then collect it. (By activating this card three times, you can, for instance, collect Equipment twice and Wood once.)',
					story: 'He is the principal chief of the lower Mandan village, nicknamed this way because of his size and complexion. He meets President Jefferson in Washington after the expedition',
					strength: 2,
					abilities: [{
						collect: 'equipment',
						short: 'collect equipment.',
						benefit: {}
					},{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					}]
				}, {
					id: 'JC34',
					name: 'Pierre Dorion',
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
					name: 'Comcomly',
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
					name: 'Régis Loisel',
					symbol: 'equipment',
					description: 'For each Strength that activates this card, choose one of the three resources: Equipment, Food or Wood. Then collect it. (By activating this card three times, you can, for instance, collect Equipment once, Food once and Wood once.)',
					story: 'French-Canadian fur trader and explorer at La Charette, on the Missouri River.',
					strength: 3,
					abilities: [{
						collect: 'equipment',
						short: 'collect equipment.',
						benefit: {}
					},{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					},{
						collect: 'wood',
						short: 'collect wood.',
						benefit: {}
					}]
				}, {
					id: 'JC49',
					name: 'Crow At Rest',
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
					name: 'John Robertson',
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
					name: 'Three Eagles',
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
					name: 'Man Crow',
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
					name: 'Twisted Hair',
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
				}
			],
			get allCards() {
				return [].concat(this.lightblue, this.lightsalmon, this.lightgreen, this.orchid, this.khaki, this.journalCards);
			}
		};
	}
]);
mainApp.factory('ClassFactory', [
	'BoatFactory',
	'CardFactory',
	'MapFactory',
	'ItemFactory',
	function ClassFactory(BF, CF, MAP, IF) {
		'use strict';

		function findStartSpace() {
			var start = _.find(MAP.map, {special: 'start'});

			return _.indexOf(MAP.map, start);
		}

		const allColors = ['khaki', 'orchid', 'lightgreen', 'lightsalmon', 'lightblue'];
		const ClassFactory = {
			Corp: class Corp {
				constructor() {
					this.supplyBoats = BF.startSupply();
					this.indianBoats = BF.startIndian();
				}
				get cost() {
					var time = this.supplyBoats.reduce((time, boat) => time + boat.cost(), 0);

					return this.indianBoats.reduce((time, boat) => time + boat.cost(), time);
				}
				get lastIndianBoat() {
					return this.indianBoats[this.indianBoats.length - 1];
				}
				get corpSize() {
					var count = this.indianBoats.length + this.supplyBoats.length;
					var px = 795 - (100 * count);

					return px + 'px';
				}
				payIndian(strength) {
					var result = false,
						indian;

					this.indianBoats.reverse();
					this.indianBoats.map(boat => {
						indian = _.find(boat.content, {inUse: false});

						if (indian && !result) {
							if (strength) {
								indian.inUse = true;
								result = true;
							} else {
								result = indian;
								_.remove(boat.content, indian);
							}
						}
					});
					this.indianBoats.reverse();

					return result;
				}
				noPay() {
					this.supplyBoats.map(boat => {
						boat.content.map(item => {
							item.delete = false;
						});
					});
				}
				reset() {
					this.indianBoats.map(boat => {
						boat.content.map(indian => {
							indian.inUse = false;
						});
					});
				}
				count(countItem) {
					var count = 0;

					this.supplyBoats.map(boat => {
						count += boat.content.filter(item => item.name == countItem).length;
					});

					return count;
				}
			},

			Deck: class Deck {
				constructor(color) {
					this.cards = CF[color];
					this.activeCardId = '';
					this.activeStrengthCardId = '';
				}
				get activeCard() {
					return _.find(this.cards, {id: this.activeCardId}) || {};
				}
				get activeStrengthCard() {
					return _.find(this.cards, {id: this.activeStrengthCardId}) || {};
				}
				get cost() {
					return this.heldCards.length;
				}
				get heldCards() {
					return this.cards.filter(card => !card.played);
				}
				get playedCards() {
					return this.cards.filter(card => card.played);
				}
				get highestHeldCardStrength() {
					return this.cards.reduce((strength, card) => {
						if (!card.played) {
							return Math.max(strength, card.strength);
						}

						return strength;
					}, 0);
				}
				findById(cardId) {
					return _.find(this.cards, {id: cardId});
				}
				reset() {
					this.cards.map(card => {
						card.played = false;
						card.support = false;
						card.plays = 0;
					});
				}
				play(card) {
					var idx = _.findIndex(this.cards, card);

					this.cards[idx].played = true;
				}
				remove(card) {
					var idx = _.findIndex(this.cards, card);

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
					this.scout = findStartSpace();
					this.baseCamp = findStartSpace();
					this.idx = options.idx;
					this.notCamped = true;
					this.notRecruited = true;
					this.takenMainAction = false;
					this.recruitPayment = 0;
					this.collectables = [];
					this.payment = [];
					this.corp.indianBoats[0].content.push(IF.indian());
				}
				get cost() {
					return this.deck.cost + this.corp.cost;
				}
				get strengthAvailable() {
					return this.playStrength > this.deck.activeCard.plays;
				}
				get indianCount() {
					return this.corp.indianBoats.reduce((total, boat) => total + boat.content.filter(indian => !indian.inUse).length, 0);
				}
				endTurn() {
					var powwow = _.find($s.boardSpaces, {event: 'boardPowWow'});

					powwow.content = powwow.content.concat(this.collectables.filter(item => item.name == 'indian'));
					this.playStrength = 0;
					this.collectables = [];
					this.payment = [];
					this.deck.activeCardId = '';
					this.deck.activeStrengthCardId = '';
					this.notCamped = true;
					this.notRecruited = true;
					this.takenMainAction = false;
					this.strengthAdded = false;
				}
				camp() {
					this.notCamped = false;
					this.corp.optimize();

					if (this.scout <= this.cost) {
						this.scout = 0;
					} else {
						this.scout -= this.cost;
						this.checkForScouts(-1);
					}

					if (this.baseCamp < this.scout) {
						this.baseCamp = this.scout;
					}

					this.deck.reset();
					this.corp.reset();
				}
				useAbility(options) {
					var ability = this.deck.activeCard.abilities[options.idx];

					if (!this.strengthAvailable) {
						return;
					} else if (ability.collect) {
						ability.benefit[ability.collect] = options[ability.collect];
					}

					if (ability.cost) {
						if (this.payCost(ability.cost)) {
							this.deck.activeCard.plays++;
							this.benefit(ability.benefit);
						} else {
							$s.notify('you cannot aford that ability', 'warning');
						}
					} else {
						this.deck.activeCard.plays++;
						this.benefit(ability.benefit);
					}
				}
				playCard(card) {
					if (this.takenMainAction) {
						return false;
					}
					this.takenMainAction = true;
					this.playStrength = 0;
					this.deck.play(card);
					this.deck.activeCardId = card.id;

					return true;
				}
				payCost(cost) {
					var tempCost = _.clone(cost);
					this.corp.supplyBoats.map(boat => {
						boat.content.map(item => {
							if (tempCost[item.name] > 0) {
								tempCost[item.name]--;
								item.delete = true;
							}
						});
					});

					if (_.every(_.values(tempCost), cost => cost === 0)) {
						this.corp.supplyBoats.map(boat => {
							boat.content = boat.content.filter(item => !item.delete);
						});

						return true;
					} else {
						this.corp.noPay();

						return false;
					}
				}
				benefit(benefit, override) {
					$s.benefitCount += override || 0;
					var travel = false;

					_.mapKeys(benefit, (amount, key) => {
						for (let i = 0; i < amount; i++) {
							var item = _.find(IF.allItems, {name: key});

							if (item) {
								$s.benefitCount += override ? 0 : 1;
								this.collect(item);
							} else if (key === 'mountain' || key === 'river') {
								this.travel(key);
								travel = true;
							}
						}
					});

					if (travel) {
						this.checkForScouts(1);
					}
				}
				travel(terrain) {
					var space = this.scout;
					var nextSpace = MAP.map[space + 1];

					if (nextSpace.terrain == terrain || nextSpace.terrain == 'mixed') {
						console.log('You moved 1 space on to ' + nextSpace.terrain + ' terrain');
						this.scout++;
					} else {
						console.log('You did not move off of your ' + MAP.map[space].terrain + ' terrain');
					}
				}
				collect(item) {
					this.collectables.push(_.clone(item));
				}
				checkEquipmentForRecruit(equipmentNeed) {
					var supplyEquipment = this.corp.count('equipment');

					return equipmentNeed <= (supplyEquipment + this.deck.highestHeldCardStrength);
				}
				checkForScouts(direction) {
					var dupes = $s.allPlayers.filter(
						player => (player.name != this.name) && (player.scout == this.scout)
					);

					if (dupes.length) {
						this.scout += direction;
						console.log('No two scouts may be on the same space');
						this.checkForScouts(direction);
					}
				}
			},

			User: class User {}
		};

		return ClassFactory;
	}
]);
mainApp.factory('EventFactory', [
	'BoatFactory',
	'CardFactory',
	'ItemFactory',
	'FirebaseFactory',
	'ClassFactory',
	function EventFactory(BF, CF, IF, FF, Class) {
		'use strict';
		
		function findBoat(ref) {
			var player = _.find($s.allPlayers, {uid: ref.playerId});

			return _.find(player.corp.supplyBoats, {id: ref.boatId}) || _.find(player.corp.indianBoats, {id: ref.boatId});
		}

		function boardStuff(event) {
			var space = _.find($s.boardSpaces, {event: event});

			$s.currentPlayer.takenMainAction = true;
			space.content.push(IF.indian());
		}

		/**
		 * Note: $s needs to be defined. This can be done by setting this entire
		 * factory as a property of $s and calling the methods from that property
		 */
		var EF = {
			gameCreated: resolve => {
				$s.state = 'startGame';
				resolve();
			},
			restartTurn: resolve => {
				// not currently working because we can't have all the users splicing the activeGame.events asynchonously
				var idx = _.findLastIndex($s.activeGame.events, e => e.name == 'changeCurrentPlayer' || e.name == 'startGame') + 1;

				if (idx == $s.activeGame.events.length - 2) {
					$s.activeGame.events.splice(idx);
					resolve();
				} else {
					setTimeout(() => {
						$s.activeGame.events.splice(idx);
						$s.restartTurn = true;
						$s.state = 'playCard';
						resolve();
					}, 1000);
				}
			},
			startGame: resolve => {
				var users = FF.getFBObject('users');
				users.$loaded(() => {
					$s.activeGame.playerIds.map(id => {
						var user = users[id];
						$s.allPlayers.push(new Class.Player({
							name: user.firstName,
							uid: user.uid,
							idx: $s.allPlayers.length + 1
						}));
						$s.indianSupply = $s.allPlayers.length * 2 + 2;
					});
					$s.activeGame.active = true;
					$s.user = _.find($s.allPlayers, {uid: $s.currentUser.uid});
					EF.changeCurrentPlayer(resolve);
				});
			},
			backToPrevious: resolve => {
				$s.state = $s.previousState;
				resolve();
			},
			// if a function uses `this` for the event, it cannot be an arrow function
			playCard: function(resolve) {
				var card = $s.currentPlayer.deck.findById(this.cardId);

				if ($s.currentPlayer.playCard(card)) {
					console.log(`Event ${$s.eventTracker}:`, $s);
					$s.state = 'strength';
					resolve();
				} else {
					resolve();
				}
			},
			trashCard: function(resolve) {
				var card = $s.currentPlayer.deck.findById(this.cardId);
				$s.currentPlayer.deck.remove(card);
				
				if (--$s.currentPlayer.trashCount === 0) {
					$s.state = 'playCard';
				}
				resolve();
			},
			useAbility: function(resolve) {
				$s.currentPlayer.useAbility(this);
				resolve();
			},
			addStrength: function(resolve) {
				var card = $s.currentPlayer.deck.findById(this.cardId);

				if ($s.currentPlayer.playStrength < 3) {
					card.support = true;
					$s.currentPlayer.deck.activeStrengthCardId = card.id;
					$s.currentPlayer.playStrength += card.strength;
					$s.currentPlayer.deck.play(card);
					$s.currentPlayer.strengthAdded = true;

					if ($s.currentPlayer.playStrength > 3) {
						$s.currentPlayer.playStrength = 3;
					}
				} else {
					$s.notify('cannot go above 3', 'warning');
				}
				resolve();
			},
			addIndianToStrength: resolve => {
				if ($s.currentPlayer.playStrength < 3) {
					if ($s.currentPlayer.indianCount) {
						$s.currentPlayer.corp.payIndian('strength');
						$s.currentPlayer.playStrength++;
					} else {
						$s.notify('you do not have any more to use');
					}
				} else {
					$s.notify('cannot go above 3');
				}
				resolve();
			},
			camp: resolve => {
				$s.currentPlayer.camp();

				if ($s.map[$s.currentPlayer.baseCamp].special == 'finish') {
					$s.state = 'win';
				} else {
					$s.state = 'playCard';
				}
				resolve();
			},
			recruitCard: function(resolve) {
				var card = $s.journal.splice(this.idx, 1)[0];
				$s.currentPlayer.payCost({
					equipment: card.strength - $s.currentPlayer.recruitPayment,
					fur: this.idx + 1
				});
				$s.currentPlayer.recruitPayment = 0;
				card.played = false;
				card.plays = 0;

				$s.currentPlayer.deck.cards.push(card);
				$s.state = 'playCard';
				resolve();
			},
			closeModal: resolve => {
				$s.modalInstance.close();
				resolve();
			},
			openRecruit: resolve => {
				$s.state = 'recruit';
				resolve();
			},
			openRecruitPayment: function(resolve) {
				if ($s.currentPlayer.checkEquipmentForRecruit(this.strength)) {
					if ($s.currentPlayer.payCost({fur: this.fur})) {
						$s.recruitCard = _.find($s.journal, {id: this.cardId});
						$s.state = 'recruitPayment';
						resolve();
					} else {
						$s.notify('you do not have enough fur.', 'danger');
						resolve();
					}
				} else {
					$s.notify('you do not have enough equipment', 'danger');
					resolve();
				}
			},
			openBoard: resolve => {
				$s.state = 'board';
				resolve();
			},
			recruitPayment: function(resolve) {
				var payment = {
					equipment: $s.recruitCard.strength
				};

				if (this.cardId) {
					var card = $s.currentPlayer.deck.findById(this.cardId);
					payment.equipment = Math.max(payment.equipment - card.strength, 0);
					$s.currentPlayer.deck.remove(card);
				}

				$s.recruitCard.plays = 0;
				$s.currentPlayer.payCost(payment);
				$s.currentPlayer.deck.add($s.recruitCard);
				$s.currentPlayer.notRecruited = false;
				_.remove($s.journal, $s.recruitCard);
				$s.recruitCard = null;
				$s.state = 'playCard';
				resolve();
			},
			changeCurrentPlayer: resolve => {
				if ($s.currentPlayer) {
					$s.currentPlayer.endTurn();
					var currentIdx = $s.currentPlayer.idx;
					$s.currentPlayer = currentIdx == $s.allPlayers.length ? $s.allPlayers[0] : $s.allPlayers[currentIdx];
				} else {
					$s.currentPlayer = $s.allPlayers[0];
				}
				$s.state = 'playCard';
				$s.benefitCount = 0;
				$s.activeGame.message = {};
				$s.special = {};
				EF.closeModal(resolve);
			},
			clickBoardSpace: function(resolve) {
				$s.currentPlayer.corp.payIndian();
				EF[this.space](resolve);
			},
			boardCollectMeatFur: resolve => {
				boardStuff('boardCollectMeatFur');
				$s.currentPlayer.benefit({
					meat: 1,
					fur: 1
				});
				resolve();
			},
			boardCollectEquipmentWood: resolve => {
				boardStuff('boardCollectEquipmentWood');
				$s.currentPlayer.benefit({
					equipment: 1,
					wood: 1
				});
				resolve();
			},
			boardCollectChoice: resolve => {
				boardStuff('boardCollectChoice');
				// TODO: determine which benefit they want
				var benefit = this.benefit || {wood: 2, fur: 2};

				$s.currentPlayer.benefit(benefit, 2);
				resolve();
			},
			boardCollectCanoe: resolve => {
				boardStuff('boardCollectCanoe');

				$s.state = 'collectCanoe';
				$s.canoePayment = {
					content: []
				};
				resolve();
			},
			boardCollectHorse: resolve => {
				boardStuff('boardCollectHorse');

				$s.state = 'collectHorse';
				$s.horsePayment = {
					content: []
				};
				resolve();
			},
			boardCollectBoat: resolve => {
				boardStuff('boardCollectBoat');

				if ($s.currentPlayer.payCost({wood: 3})) {
					$s.state = 'boats';
				} else {
					$s.notify('You cannot afford a boat');
				}
				resolve();
			},
			boardResetJournal: resolve => {
				boardStuff('boardResetJournal');
				$s.journal.splice(0, 5);
				$s.currentPlayer.trashCount = 3;
				$s.state = 'trash';
				resolve();
			},
			boardUseAbility: resolve => {
				boardStuff('boardUseAbility');
				
				if ($s.currentPlayer.payCost({meat: 1})) {
					$s.special.abilityStrength = 1;
					$s.state = 'boardAbility';
				} else {
					$s.notify('You cannot benefit from this space');
				}
				resolve();
			},
			useFaceUpAbility: function(resolve) {
				var card = _.find(CF.allCards, {id: this.cardId});

				$s.special.abilityCard = card;
				$s.state = 'faceUpAbility';

				resolve();
			},
			useFaceUpCardAbility: function(resolve) {
				//use the cards ability somehow
				resolve();
			},
			interpreter: resolve => {
				var indians = $s.boardSpaces.reduce((indians, space) => {
					indians.push(...space.content.splice(0));

					return indians;
				},[]);

				$s.benefitCount += indians.length;
				$s.currentPlayer.collectables.push(...indians);
				$s.currentPlayer.deck.activeCard.plays++;
				$s.newComer();
				$s.journal.splice(0, 1);
				resolve();
			},
			collectHorses: resolve => {
				$s.currentPlayer.benefit({horse: $s.horseCollectionCount()});
				$s.horsePayment.content.filter(item => item.name == 'indian').forEach(() => {
					boardStuff('boardCollectHorse');
				});
				$s.horsePayment.content = [];
				$s.state = 'playCard';

				resolve();
			},
			horsePayment: function(resolve) {
				var item = _.find(IF.allItems, {name: this.item}) || IF.indian();

				$s.horsePayment.content.push(_.clone(item));
				resolve();
			},
			removeHorseItem: function(resolve) {
				$('.item.hidden').removeClass('hidden');
				$s.horsePayment.content.splice(this.idx, 1);

				resolve();
			},
			collectCanoes: resolve => {
				$s.currentPlayer.benefit({canoe: $s.canoeCollectionCount()});
				$s.canoePayment.content.filter(item => item.name == 'indian').forEach(() => {
					boardStuff('boardCollectCanoe');
				});
				$s.canoePayment.content = [];
				$s.state = 'playCard';

				resolve();
			},
			canoePayment: function(resolve) {
				var item = _.find(IF.allItems, {name: this.item}) || IF.indian();

				$s.canoePayment.content.push(_.clone(item));
				resolve();
			},
			removeCanoeItem: function(resolve) {
				$('.item.hidden').removeClass('hidden');
				$s.canoePayment.content.splice(this.idx, 1);

				resolve();
			},
			removeItem: function(resolve) {
				var boat = findBoat(this);

				$('.item.hidden').removeClass('hidden');
				boat.content.splice(this.idx, 1);
				resolve();
			},
			collectItem: function(resolve) {
				$('.item.hidden').removeClass('hidden');
				$s.currentPlayer.collectables.splice(this.idx, 1);
				
				if (--$s.benefitCount === 0) {
					$s.currentPlayer.collectables = [];
				}

				resolve();
			},
			addItem: function(resolve) {
				var boat = findBoat(this),
					item = _.find(IF.allItems, {name: this.item}) || IF.indian();

				item.inUse = this.used;
				boat.content.push(_.clone(item));
				resolve();
			},
			collectBoat: function(resolve) {
				var boatsArr = $s.currentPlayer.corp[this.type + 'Boats'];
				var method = this.type == 'indian' ? 'push' : 'unshift';
				boatsArr[method](BF[this.type + this.size](boatsArr.length));

				if (this.type === 'indian') {
					if ($s.indianSupply) {
						$s.indianSupply--;
						$s.currentPlayer.corp.lastIndianBoat.content.push(IF.indian());
					}
				} else {
					$s.currentPlayer.benefit({
						wood: 2,
						meat: 2,
						equipment: 2,
						fur: 2
					}, 2);
				}
				$s.state = 'playCard';
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

mainApp.factory('ItemFactory', [
	function ItemFactory() {
		'use strict';

		return {
			indian: () => _.clone({
				name: 'indian',
				display: 'Indian',
				color: 'red',
				inUse: false
			}),
			allItems: [{
				name: 'wood',
				display: 'Wood',
				btnClass: 'info',
				color: 'brown'
			}, {
				name: 'fur',
				display: 'Fur',
				btnClass: 'warning',
				color: 'yellow'
			}, {
				name: 'meat',
				display: 'Food',
				btnClass: 'danger',
				color: 'red'
			}, {
				name: 'equipment',
				display: 'Equipment',
				btnClass: 'success',
				color: 'gray'
			}, {
				name: 'canoe',
				display: 'Canoes',
				btnClass: 'primary',
				color: 'blue',
				cost: {
					wood: 2
				}
			}, {
				name: 'horse',
				display: 'Horses',
				btnClass: 'default',
				color: 'white',
				cost: {
					wood: 1,
					fur: 1,
					meat: 1,
					equipment: 1
				}
			}]
		};
	}
]);

mainApp.factory('MapFactory', [
	function MapFactory() {
		'use strict';

		return {
			map: [
				{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river',
					special: 'start'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'mixed'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mixed'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mountain'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river',
					special: 'finish'
				},{
					terrain: 'river',
					special: 'finish'
				},{
					terrain: 'river',
					special: 'finish'
				},{
					terrain: 'river',
					special: 'finish'
				}
			],
			configureMap: [
				{
					terrain: 'river',
					spaces: 5
				},
				{
					special: 'start',
					terrain: 'river',
					spaces: 1
				},
				{
					terrain: 'river',
					spaces: 17
				},
				{
					terrain: 'mixed',
					spaces: 1
				},
				{
					terrain: 'mountain',
					spaces: 7
				},
				{
					terrain: 'mixed',
					spaces: 1
				},
				{
					terrain: 'river',
					spaces: 5
				},
				{
					terrain: 'mountain',
					spaces: 3
				},
				{
					terrain: 'river',
					spaces: 4
				},
				{
					special: 'finish',
					terrain: 'river',
					spaces: 11
				}
			]
		};
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
