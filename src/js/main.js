mainApp.controller('MainCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'$uibModal',
	'ClassFactory',
	'EventFactory',
	'UpgradeFactory',
	'FirebaseFactory',
	function MainCtrl($s, $timeout, $interval, $uibM, CF, EF, UF, FF) {
		'use strict';

		function init() {
			//	init stuff
			window.$s = $s;

			if (typeof Promise !== 'function') {
				alert('You\'re browser is not capable of supporting this game. Please trash your crappy backward browser and switch to a modern browser like Chrome, Safari, or Firefox');
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
			},
			upgrades: UF
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

		$s.waitEvent = (name, info) => {
			$s.waiting = true;

			$s.addEvent(_.extend({
				name,
				uid: $s.user.uid,
				eventCount: $s.getEventCount(name)
			}, info));
		};

		$s.submitCards = () => {
			$s.waitEvent('submitBattle', {cards: $s.user.deck.selectedCards});
		};

		$s.upgradeCards = () => {
			$s.waitEvent('upgrade', {
				cards: $s.user.deck.chosenUpgrades,
				progressChoices: $s.user.progressChoices
			});
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

			if (card.type == 'progress' || card.type == 'double') {
				$s.selectResources(card);
			}

			if (card.type != 'double') {
				_.find($s.user.deck.upgradeCards, {type: 'double'}).selected = false;
			}
		};

		$s.viewCard = card => {
			openModal('ViewCard', {card});
		};

		$s.selectResources = card => {
			var double = card.type == 'double',
				count = double ? $s.user.corp.progress.level + 2 : $s.user.corp.progress.level + 1,
				deselectProgress = () => {
					_.find($s.user.deck.upgradeCards, {type: 'progress'}).selected = false;
					_.find($s.user.deck.upgradeCards, {type: 'double'}).selected = false;
					$s.user.resetProgressChoices();
				};

			if (double && !_.find($s.user.deck.upgradeCards, {type: 'progress'}).selected) {
				return;
			}

			if (card.selected) {
				var items = {
					count,
					resources: _.clone($s.user.nonAllocatedResources),
					progressCards: $s.user.deck.progressCards.filter(card => card.rank == count)
				};

				$s.selectResourceModalInstance = $uibM.open({
					animation: true,
					templateUrl: 'selectresourcesModal',
					controller: 'SelectResourcesModalInstanceCtrl',
					size: 'lg',
					resolve: {items}
				});

				$s.selectResourceModalInstance.result.then(results => {
					$s.user.progressChoices = {
						cards: $s.user.progressChoices.cards.concat(results.card),
						cost: $s.user.progressChoices.cost.concat(results.resources.map(res => res.name))
					};
				}, deselectProgress);
			} else {
				deselectProgress();
			}
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