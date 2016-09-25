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
