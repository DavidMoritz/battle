mainApp.factory('ClassFactory', [
	'CardFactory',
	'UpgradeFactory',
	function CFactory(CF, UF) {
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
					this.converter = {
						level: 0,
						points: 0
					};
					this.utopia = {
						level: 0,
						points: 0
					};
					this.knowledge = {
						level: 0,
						points: 0
					};
					this.progress = {
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
					this.seed = seed;

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
				resetBasic() {
					this.basic.forEach(card => card.played = false);
					this.basic = shuffleDeck(this.basic, this.seed);
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
					const labelCard = card => {
						card.color = color;
						card.id = color.charAt(0).toUpperCase() + card.id;

						return card;
					};

					this.cards = CF.basic.map(labelCard);
					this.progressCards = CF.progressCards.map(labelCard);
					this.upgradeCards = CF.upgradeCards.map(labelCard);
					this.activeCardId = '';
				}
				get allCards() {
					return Array.prototype.concat(this.cards, this.progressCards, this.upgradeCards);
				}
				get battleValue() {
					return this.selectedCards.reduce((total, card) => total + card.value, 0);
				}
				get selectedCards() {
					return this.heldCards.filter(card => card.selected);
				}
				get chosenUpgrades() {
					return this.upgradeCards.filter(card => card.selected);
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
				get progressCardRank() {
					return this.cards.reduce((rank, card) => Math.max(card.rank, rank), 0);
				}
				get progressCardOptions() {
					return this.progressCards.filter(card => card.rank == this.progressCardRank + 1);
				}
				findById(cardId) {
					return _.find(this.cards, {id: cardId});
				}
				reset() {
					this.allCards.map(card => {
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
					this.resources = [];
					this.resetProgressChoices();
				}
				get upgradable() {
					return this.deck.chosenUpgrades.length === Math.max(this.corp.knowledge.level, 2);
				}
				get chosenResources() {
					return this.resources.filter(resource => resource.selected);
				}
				get allocatedResources() {
					var tempCost = _.clone(this.progressChoices.cost),
						level, type;
					this.deck.chosenUpgrades.forEach(card => {
						type = card.type;

						if (type == 'double') {
							type = this.deck.chosenUpgrades[0].type;
							level = this.corp[type].level + 1;
						} else {
							level = this.corp[type].level;
						}
						tempCost = tempCost.concat(UF[type][level].cost);
					});

					return this.resources.filter(item => {
						var t = tempCost.indexOf(item.name);

						if (t > -1) {
							tempCost.splice(t, 1);

							return true;
						}

						return false;
					});
				}
				get nonAllocatedResources() {
					return _.difference(this.resources, this.allocatedResources);
				}
				payResources() {
					this.resources = this.nonAllocatedResources.filter(item => !item.expiring);
				}
				resetProgressChoices() {
					this.progressChoices = {
						cards: [],
						cost: []
					};
				}
				reset() {
					if (!this.corp.knowledge.level) {
						this.resources.forEach(item => item.expiring = true);
					}
					this.resetProgressChoices();
					this.deck.reset();
				}
				upgradeCorp(area) {
					this.corp[area] = _.clone(UF[area][this.corp[area].level]);
				}
				upgradeProgress() {
					this.progressChoices.cards.forEach(card => {
						_.find(this.deck.cards, {value: card.value}) = card;
					});
				}
				affordUpgrade(card) {
					if (card.selected) {
						return true;
					}
					var chosenLength = this.deck.chosenUpgrades.length,
						wildCount = 0,
						type = card.type,
						costTemp, value, i;

					if (type == 'double') {
						if (!chosenLength) {
							return false;
						}
						type = this.deck.chosenUpgrades[chosenLength - 1].type;

						if (!type) {
							return false;
						} else if (type == 'double') {
							return true;
						}
						value = this.corp[type].level + 1;
					} else {
						value = this.corp[type].level;
					}

					costTemp = _.clone(UF[type][value].cost);

					if (costTemp[0] == 'any') {
						return this.nonAllocatedResources.length >= costTemp.length;
					}

					this.nonAllocatedResources.forEach(item => {
						if (costTemp.length) {
							i = costTemp.indexOf(item.name);

							if (i > -1) {
								costTemp.splice(i, 1);
							} else if (item.name == 'wild') {
								wildCount++;
							}
						}
					});

					return costTemp.length <= wildCount;
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
					this.resources.push(_.clone(item));
				}
			}
		};

		return ClassFactory;
	}
]);