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
					$s.startGame();
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
				$s.state = 'chooseBattle';
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

				$s.state = 'determineWinner';
				resolve();
			},
			takeResource: function(resolve) {
				// take a resource
				resolve();
			},
			upgradeReady: (count, resolve) => {
				resolve();
			}
		};

		return EF;
	}
]);