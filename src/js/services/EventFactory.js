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
				console.log('gameCreated');
				resolve();
			},
			startGame: resolve => {
				console.log('gameStart');
				var users = FF.getFBObject('users');
				users.$loaded(() => {
					$s.activeGame.playerIds.map(id => {
						var user = users[id];
						$s.allPlayers.push(new Class.Player({
							name: user.firstName,
							uid: user.uid,
							idx: $s.allPlayers.length + 1
						}));
					});
					$s.activeGame.active = true;
					$s.user = _.find($s.allPlayers, {uid: $s.currentUser.uid});
					EF.chooseBattle(resolve);
				});
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
			closeModal: resolve => {
				$s.modalInstance.close();
				resolve();
			},
			chooseBattle: resolve => {
				console.log('chooseBattle');
				$s.state = 'chooseBattle';
				$s.activeGame.message = {};
				resolve();
			},
			submitBattle: resolve => {
				$s.activeGame.currentBattle.push($s.currentUser.battleCards);

				if ($s.activeGame.currentBattle.length == $s.allPlayer.length) {
					EF.battle(resolve);
				} else {
					resolve();
				}
			}
		};

		return EF;
	}
]);