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