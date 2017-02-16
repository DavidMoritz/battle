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

				$s[history][this.eventCount][this.uid] = this;

				if (_.keys($s[history][this.eventCount]).length == $s.allPlayers.length) {
					EF[this.name + 'Ready'](this.eventCount, resolve);
					$s.waiting = false;
				} else {
					resolve();
				}
			},
			submitBattleReady: (count, resolve) => {
				_.mapKeys($s.submitBattleHistory[count], (info, uid) => {
					var player = _.find($s.allPlayers, {uid});

					player.battlePower = info.cards.reduce((total, card) => {
						if(card.special) {
							player.special = player.special || [];
							player.special.push(card.special);
						}

						return total + card.value;
					}, 0);
					player.winner = false;
					player.special =
					player.playCardSet(info.cards);
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

				EF.handleSpecials();

				$s.currentPlayer = $s.allPlayers[0];

				$s.state = 'determineWinner';
				resolve();
			},
			doWinSpecials: player => {
				var negate = false;

				player.special.filter(spec => spec.condition == 'win' || spec.condition == 'mixed').forEach(special => {
					switch(special.name) {
						case 'negateSpecials':
							negate = true;
							break;
						case 'attackTwice':
							player.attackTwice = true;
							break;
						case 'mixedOutcome':
							player.gainPoints(6);
							player.mixedOutcome = true;
							break;
					}
				});

				return negate;
			},
			doRegSpecials: (players, winner) => {
				players.forEach(player => {
					player.special.filter(spec => spec.condition != 'last' && spec.condition != 'win').forEach(special => {
						switch(special.name) {
							case 'freeAttack':
							case 'doubleTrash':
								player[special.name] = true;
								break;
							case 'collectFive':
								player.gainPoints(3);
								player.gainAnyResource = true;
							case 'collectTwo':
							case 'chooseSpecial':
								player.gainPoints(2);
								break;
							case 'loseTwo':
								player.gainPoints(-2);
								break;
							case 'freeResource':
								if(!winner) {
									player.gainDiscard = true;
								}
								break;
							case 'mixedOutcome':
								if(!player.mixedOutcome) {
									if(player.duplicateBattlePower) {
										player.freeUpgrade = true;
									} else {
										player.collectRare = true;
									}
								}
						}
					});
				})
			},
			doLastSpecials: player => {
				player.special.filter(spec => spec.condition == 'last').forEach(special => {
					player[special.name] = true;
				});
			},
			handleSpecials: () => {
				var winner = $s.allPlayers[0];
				var last = $s.allPlayers.slice(-1)[0];

				if(!winner.duplicateBattlePower) {
					if(EF.doWinSpecials(winner)) {
						doRegSpecials([winner], true);

						return;
					}
				}

				doRegSpecials($s.allPlayers);

				if(!last.duplicateBattlePower) {
					doLastSpecials(last);
				}
			},
			chooseResource: function(resolve) {
				var idx = _.findIndex($s.allPlayers, $s.currentPlayer);

				$s.resources.play(this.card, $s.currentPlayer);

				if ($s.resources.available.length == 1) {
					$s.resources.play($s.resources.available[0]);

					if ($s.currentPlayer.deck.heldCards.length) {
						EF.chooseBattle(resolve);
					} else {
						$s.state = 'military';
						EF.military(resolve);
					}
				} else {
					$s.currentPlayer = $s.allPlayers[idx + 1];
					resolve();
				}
			},
			military: resolve => {
				$s.state = 'upgrade';
				resolve();
			},
			upgradeReady: (count, resolve) => {
				_.mapKeys($s.upgradeHistory[count], (info, uid) => {
					var player = _.find($s.allPlayers, {uid}),
						double = !!_.find(info.cards, {type: 'double'});

					info.cards.forEach(card => {
						_.find(player.deck.upgradeCards, {type: card.type}).selected = true;
					});

					player.progressChoices = info.progressChoices || player.progressChoices;

					player.payResources();
					player.upgradeProgress();

					info.cards.forEach(card => {
						if (card.type != 'progress' && card.type != 'double') {
							player.upgradeCorp(card.type);

							if (double) {
								player.upgradeCorp(card.type);
							}
						}
					});

					player.reset();
				});

				$s.resources.resetBasic();

				if ($s.resources.heldWinner.length === 0) {
					$s.resources.resetWinner();
				}
				EF.chooseBattle(resolve);
			}
		};

		return EF;
	}
]);