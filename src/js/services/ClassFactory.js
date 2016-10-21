mainApp.factory('ClassFactory', [
	'CardFactory',
	function CFactory(CF) {
		'use strict';

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
				constructor(n) {
					this.basic = [];
					this.winner = EF.winner;

					while(n) {
						EF.resources.forEach(item => {
							item.id = item.id + n;

							this.deck.push(item);
						});
						n--;
					}
				}
			}

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
				collect(item) {
					this.collectables.push(_.clone(item));
				}
			}
		};

		return ClassFactory;
	}
]);