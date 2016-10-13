mainApp.factory('ClassFactory', [
	'CardFactory',
	function ClassFactory(CF) {
		'use strict';

		const allColors = ['clubs', 'diamonds', 'spades', 'hearts'];
		const ClassFactory = {
			Corp: class Corp {
				constructor() {
					this.wood = 0;
					this.energy = 0;
					this.mineral = 0;
					this.food = 0;
				}
			},

			Deck: class Deck {
				constructor(color) {
					this.cards = CF[color];
					this.activeCardId = '';
				}
				get battleValue() {
					return this.selectedCards.reduce((total, card) => total + card.value, 0);
				}
				get selectedCards() {
					return this.heldCards.filter(card => card.selected);	
				}
				get submittable() {
					return this.selectedCards.length === 3;
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
					this.idx = options.idx;
					this.collectables = [];
					this.payment = [];
				}
				reset() {
					this.collectables = [];
					this.payment = [];
					this.deck.activeCardId = '';
					this.deck.reset();
				}
				playCardSet(cardSet) {
					cardSet.forEach(card => {
						this.deck.play(card);
					});
				}
				playCard(card) {
					this.deck.play(card);
					this.deck.activeCardId = card.id;

					return true;
				}
				collect(item) {
					this.collectables.push(_.clone(item));
				}
				// },

				// User: class User {
				// 	constructor() {}
			}
		};

		return ClassFactory;
	}
]);