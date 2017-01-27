mainApp.factory('CardFactory', [
	function CardFactory() {
		'use strict';

		return {
			basic: [
				{
					id: 'BC0',
					value: 0,
					rank: 0,
					class: 'zero'
				}, {
					id: 'BC1',
					value: 1,
					rank: 0,
					class: 'one'
				}, {
					id: 'BC2',
					value: 2,
					rank: 0,
					class: 'two'
				}, {
					id: 'BC3',
					value: 3,
					rank: 0,
					class: 'three'
				}, {
					id: 'BC4',
					value: 4,
					rank: 0,
					class: 'four'
				}, {
					id: 'BC5',
					value: 5,
					rank: 0,
					class: 'five'
				}, {
					id: 'BC6',
					value: 6,
					rank: 0,
					class: 'six'
				}, {
					id: 'BC7',
					value: 7,
					rank: 0,
					class: 'seven'
				}, {
					id: 'BC8',
					value: 8,
					rank: 0,
					class: 'eight'
				}, {
					id: 'BC9',
					value: 9,
					rank: 0,
					class: 'nine'
				}, {
					id: 'B10',
					value: 10,
					rank: 0,
					class: 'ten'
				}, {
					id: 'B11',
					value: 11,
					rank: 0,
					class: 'eleven'
				}
			],
			upgradeCards: [
				{
					id: 'UP1',
					class: 'military',
					type: 'military',
					name: 'Military'
				}, {
					id: 'UP2',
					class: 'defense',
					type: 'defense',
					name: 'Defense'
				}, {
					id: 'UP3',
					class: 'economy',
					type: 'utopia',
					name: 'Economy'
				}, {
					id: 'UP4',
					class: 'converter',
					type: 'converter',
					name: 'Resource Converter'
				}, {
					id: 'UP5',
					class: 'unity',
					type: 'knowledge',
					name: 'Unity'
				}, {
					id: 'UP6',
					class: 'progress-cards',
					type: 'progress',
					name: 'Progress Cards'
				}, {
					id: 'UP7',
					class: 'double',
					type: 'double',
					name: 'Double Upgrade'
				}
			],
			progressCards: [
				{
					id: 'P1A',
					rank: 1,
					group: 'alien',
					name: 'Alien Bank Teller',
					description: 'When this card is played, collect 2 points.',
					class: 'one',
					value: 1
				}, {
					id: 'P1D',
					rank: 1,
					group: 'allied',
					name: 'Risky Business',
					description: 'When this card is played, lose 2 points.',
					class: 'eight',
					value: 9
				}, {
					id: 'P1M',
					rank: 1,
					group: 'military',
					name: 'Military Supplies',
					description: 'When you play this card, your next attack is free.',
					class: 'three',
					value: 3
				}, {
					id: 'P1N',
					rank: 1,
					group: 'native',
					name: 'The Meek Shall Inherit',
					description: 'If you "lose" with this card, collect an extra resource from thte discard pile (if there is one).',
					class: 'eight',
					value: 8
				}, {
					id: 'P2A',
					rank: 2,
					group: 'alien',
					name: 'Extortion',
					description: 'When this card is played, double your points during the next trashing phase.',
					class: 'four',
					value: 4
				}, {
					id: 'P2D',
					rank: 2,
					group: 'allied',
					name: 'Strength in Diversity',
					description: 'When this card is played... -Change your 0 to a 1 OR -Gain 2 points OR -Collect 1 common resource card from the discard pile (at random).',
					class: 'zero',
					value: 0
				}, {
					id: 'P2M',
					rank: 2,
					group: 'military',
					name: 'Precise Strategy',
					description: 'If you win with this card, negate other players\' progress cards for this phase.',
					class: 'five',
					value: 5
				}, {
					id: 'P2N',
					rank: 2,
					group: 'native',
					name: 'The Last Shall Be First',
					description: 'If you are last with this card, choose first resouce this phase.',
					class: 'seven',
					value: 7
				}, {
					id: 'P3A',
					rank: 3,
					group: 'alien',
					name: 'Monopoly',
					description: 'When this card is played, collect 5 points and any one resource.',
					class: 'six',
					value: 6
				}, {
					id: 'P3D',
					rank: 3,
					group: 'allied',
					name: 'Allies in Shadows',
					description: 'With this card, if you... -Win: gain 6 points -Lose: collect 1 rare resource card from the discard pile (at random) -Tie: immediately upgrade your lowest lvl rank on the board.',
					class: 'eleven',
					value: 11
				}, {
					id: 'P3M',
					rank: 3,
					group: 'military',
					name: 'Double Strike',
					description: 'If you win with this card, attack twice during the next attack phase.',
					class: 'two',
					value: 2
				}, {
					id: 'P3N',
					rank: 3,
					group: 'native',
					name: 'We\'re Not Forgotten',
					description: 'If you are last with this card, collect all resources in this phase. If you are not last, collect nothing.',
					class: 'ten',
					value: 12
				}
			],
			resources: [
				{
					initial: 'RL1',
					class: 'lumber',
					title: 'Lumber',
					image: 'basic_lumber.png',
					symbol: 'l',
					tradeValue: 3,
					resources: [{
						name: 'lumber'
					}]
				}, {
					initial: 'RM2',
					class: 'mineral',
					title: 'Mineral Deposits',
					image: 'basic_mineral.png',
					symbol: 'm',
					tradeValue: 3,
					resources: [{
						name: 'mineral'
					}]
				}, {
					initial: 'RE3',
					class: 'energy',
					title: 'Energy Crystals',
					image: 'basic_energy.png',
					symbol: 'e',
					tradeValue: 3,
					resources: [{
						name: 'energy'
					}]
				}, {
					initial: 'RF4',
					class: 'food',
					title: 'Exotic Food',
					image: 'basic_food.png',
					symbol: 'f',
					tradeValue: 3,
					resources: [{
						name: 'food'
					}]
				}
			],
			winner: [
				{
					id: 'RWE1',
					class: 'winner energy',
					title: 'Double Energy Crystals',
					image: 'winner_double_energy.png',
					symbol: 'e e',
					tradeValue: 5,
					resources: [{
						name: 'energy'
					},{
						name: 'energy'
					}]
				}, {
					id: 'RWE2',
					class: 'winner energy food',
					title: 'Energy Crystals & Exotic Food',
					image: 'winner_energy_food.png',
					symbol: 'e f',
					tradeValue: 5,
					resources: [{
						name: 'energy'
					},{
						name: 'food'
					}]
				}, {
					id: 'RWE3',
					class: 'winner energy lumber',
					title: 'Energy Crystals & Lumber',
					image: 'winner_energy_lumber.png',
					symbol: 'e e',
					tradeValue: 5,
					resources: [{
						name: 'energy'
					},{
						name: 'lumber'
					}]
				}, {
					id: 'RWE4',
					class: 'winner energy mineral',
					title: 'Energy Crystals & Mineral Deposits',
					image: 'winner_energy_mineral.png',
					symbol: 'e m',
					tradeValue: 5,
					resources: [{
						name: 'energy'
					},{
						name: 'mineral'
					}]
				}, {
					id: 'RWF1',
					class: 'winner food',
					title: 'Double Exotic Food',
					image: 'winner_double_food.png',
					symbol: 'f f',
					tradeValue: 5,
					resources: [{
						name: 'food'
					},{
						name: 'food'
					}]
				}, {
					id: 'RWF2',
					class: 'winner food lumber',
					title: 'Exotic Food & Lumber',
					image: 'winner_food_lumber.png',
					symbol: 'f f',
					tradeValue: 5,
					resources: [{
						name: 'food'
					},{
						name: 'lumber'
					}]
				}, {
					id: 'RWF3',
					class: 'winner food',
					title: 'Exotic Food & Mineral Deposits',
					image: 'winner_food_mineral.png',
					symbol: 'f m',
					tradeValue: 5,
					resources: [{
						name: 'food'
					},{
						name: 'mineral'
					}]
				}, {
					id: 'RWL1',
					class: 'winner lumber',
					title: 'Double Lumber',
					image: 'winner_double_lumber.png',
					symbol: 'l l',
					tradeValue: 5,
					resources: [{
						name: 'lumber'
					},{
						name: 'lumber'
					}]
				}, {
					id: 'RWL2',
					class: 'winner lumber mineral',
					title: 'Lumber & Mineral Deposits',
					image: 'winner_lumber_mineral.png',
					symbol: 'l m',
					tradeValue: 5,
					resources: [{
						name: 'lumber'
					},{
						name: 'mineral'
					}]
				}, {
					id: 'RWM1',
					class: 'winner mineral',
					title: 'Double Mineral Deposits',
					image: 'winner_double_mineral.png',
					symbol: 'm m',
					tradeValue: 5,
					resources: [{
						name: 'mineral'
					},{
						name: 'mineral'
					}]
				}, {
					id: 'RWW1',
					class: 'winner wild',
					title: 'Wild',
					image: 'winner_wild.png',
					symbol: 'w',
					tradeValue: 5,
					resources: [{
						name: 'wild'
					}]
				}
			],
			get allCards() {
				return [].concat(this.basic, this.upgradeCards, this.progressCards, this.resources, this.winner);
			}
		};
	}
]);