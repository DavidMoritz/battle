mainApp.factory('EventFactory', [
	'CardFactory',
	'FirebaseFactory',
	'UpgradeFactory',
	'ClassFactory',
	function EventFactory(CF, FF, UF, Class) {
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
			upgrade: function(resolve) {
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
						EF.military(resolve);
					}
				} else {
					$s.currentPlayer = $s.allPlayers[idx + 1];
					resolve();
				}
			},
			military: resolve => {
				resolve();
			},
			upgradeCorp: (player, area) => {
				player.corp[area] = _.clone(_.find(UF[area], {level: player.corp[area].level + 1}));
			},
			upgradeReady: (count, resolve) => {
				_.mapKeys($s.upgradeHistory[count], (cards, uid) => {
					var player = _.find($s.allPlayers, {uid}),
						card = cards.type,
						double = !!_.find(cards, {type: 'double'});

					cards.forEach(card => {
						if (card.type != 'progress-cards' && card.type != 'double') {
							EF.upgradeCorp(player, card.type);

							if (double) {
								EF.upgradeCorp(player, card.type);
							}
						}
					});

					player.reset();
				});

				$s.resources.resetBasic();
				EF.chooseBattle(resolve);
			}
		};

		return EF;
	}
]);