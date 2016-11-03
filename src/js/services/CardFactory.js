mainApp.factory('CardFactory', [
	function CardFactory() {
		'use strict';

		return {
			yellow: [
				{
					id: 'YB0',
					value: 0,
					class: 'zero',
					color: 'yellow'
				}, {
					id: 'YB1',
					value: 1,
					class: 'one',
					color: 'yellow'
				}, {
					id: 'YB2',
					value: 2,
					class: 'two',
					color: 'yellow'
				}, {
					id: 'YB3',
					value: 3,
					class: 'three',
					color: 'yellow'
				}, {
					id: 'YB4',
					value: 4,
					class: 'four',
					color: 'yellow'
				}, {
					id: 'YB5',
					value: 5,
					class: 'five',
					color: 'yellow'
				}, {
					id: 'YB6',
					value: 6,
					class: 'six',
					color: 'yellow'
				}, {
					id: 'YB7',
					value: 7,
					class: 'seven',
					color: 'yellow'
				}, {
					id: 'YB8',
					value: 8,
					class: 'eight',
					color: 'yellow'
				}, {
					id: 'YB9',
					value: 9,
					class: 'nine',
					color: 'yellow'
				}, {
					id: 'YB10',
					value: 10,
					class: 'ten',
					color: 'yellow'
				}
			],
			purple: [
				{
					id: 'PB0',
					value: 0,
					class: 'zero',
					color: 'purple'
				}, {
					id: 'PB1',
					value: 1,
					class: 'one',
					color: 'purple'
				}, {
					id: 'PB2',
					value: 2,
					class: 'two',
					color: 'purple'
				}, {
					id: 'PB3',
					value: 3,
					class: 'three',
					color: 'purple'
				}, {
					id: 'PB4',
					value: 4,
					class: 'four',
					color: 'purple'
				}, {
					id: 'PB5',
					value: 5,
					class: 'five',
					color: 'purple'
				}, {
					id: 'PB6',
					value: 6,
					class: 'six',
					color: 'purple'
				}, {
					id: 'PB7',
					value: 7,
					class: 'seven',
					color: 'purple'
				}, {
					id: 'PB8',
					value: 8,
					class: 'eight',
					color: 'purple'
				}, {
					id: 'PB9',
					value: 9,
					class: 'nine',
					color: 'purple'
				}, {
					id: 'PB10',
					value: 10,
					class: 'ten',
					color: 'purple'
				}
			],
			cyan: [
				{
					id: 'CB0',
					value: 0,
					class: 'zero',
					color: 'cyan'
				}, {
					id: 'CB1',
					value: 1,
					class: 'one',
					color: 'cyan'
				}, {
					id: 'CB2',
					value: 2,
					class: 'two',
					color: 'cyan'
				}, {
					id: 'CB3',
					value: 3,
					class: 'three',
					color: 'cyan'
				}, {
					id: 'CB4',
					value: 4,
					class: 'four',
					color: 'cyan'
				}, {
					id: 'CB5',
					value: 5,
					class: 'five',
					color: 'cyan'
				}, {
					id: 'CB6',
					value: 6,
					class: 'six',
					color: 'cyan'
				}, {
					id: 'CB7',
					value: 7,
					class: 'seven',
					color: 'cyan'
				}, {
					id: 'CB8',
					value: 8,
					class: 'eight',
					color: 'cyan'
				}, {
					id: 'CB9',
					value: 9,
					class: 'nine',
					color: 'cyan'
				}, {
					id: 'CB10',
					value: 10,
					class: 'ten',
					color: 'cyan'
				}
			],
			orange: [
				{
					id: 'OB0',
					value: 0,
					class: 'zero',
					color: 'orange'
				}, {
					id: 'OB1',
					value: 1,
					class: 'one',
					color: 'orange'
				}, {
					id: 'OB2',
					value: 2,
					class: 'two',
					color: 'orange'
				}, {
					id: 'OB3',
					value: 3,
					class: 'three',
					color: 'orange'
				}, {
					id: 'OB4',
					value: 4,
					class: 'four',
					color: 'orange'
				}, {
					id: 'OB5',
					value: 5,
					class: 'five',
					color: 'orange'
				}, {
					id: 'OB6',
					value: 6,
					class: 'six',
					color: 'orange'
				}, {
					id: 'OB7',
					value: 7,
					class: 'seven',
					color: 'orange'
				}, {
					id: 'OB8',
					value: 8,
					class: 'eight',
					color: 'orange'
				}, {
					id: 'OB9',
					value: 9,
					class: 'nine',
					color: 'orange'
				}, {
					id: 'OB10',
					value: 10,
					class: 'ten',
					color: 'orange'
				}
			],
			upgradeCards: [
				{
					id: 'UP01',
					class: 'utopia',
					name: 'Utopia'
				}, {
					id: 'UP02',
					class: 'military',
					name: 'Military'
				}, {
					id: 'UP03',
					class: 'defense',
					name: 'Defense'
				}, {
					id: 'UP04',
					class: 'knowledge',
					name: 'Shared Knowledge'
				}, {
					id: 'UP05',
					class: 'converter',
					name: 'Resource Converter'
				}, {
					id: 'UP06',
					class: 'progress-cards',
					name: 'Progress Cards'
				}, {
					id: 'UP07',
					class: 'double',
					name: 'Double Upgrade'
				}
			],
			resources: [
				{
					initial: 'RL1',
					class: 'wood',
					title: 'Lumber',
					symbol: 'l',
					tradeValue: 3,
					resources: [{
						name: 'wood'
					}]
				}, {
					initial: 'RM2',
					class: 'mineral',
					title: 'Mineral Deposits',
					symbol: 'm',
					tradeValue: 3,
					resources: [{
						name: 'mineral'
					}]
				}, {
					initial: 'RE3',
					class: 'energy',
					title: 'Energy Crystals',
					symbol: 'e',
					tradeValue: 3,
					resources: [{
						name: 'energy'
					}]
				}, {
					initial: 'RF4',
					class: 'food',
					title: 'Food',
					symbol: 'f',
					tradeValue: 3,
					resources: [{
						name: 'food'
					}]
				}
			],
			winner: [
				{
					id: 'RWL1',
					class: 'winner wood',
					title: 'Double Lumber',
					symbol: 'l l',
					tradeValue: 5,
					resources: [{
						name: 'wood'
					},{
						name: 'wood'
					}]
				}, {
					id: 'RWM2',
					class: 'winner mineral',
					title: 'Double Mineral Deposits',
					symbol: 'm m',
					tradeValue: 5,
					resources: [{
						name: 'mineral'
					},{
						name: 'mineral'
					}]
				}, {
					id: 'RWE3',
					class: 'winner energy',
					title: 'Double Energy Crystals',
					symbol: 'e e',
					tradeValue: 5,
					resources: [{
						name: 'energy'
					},{
						name: 'energy'
					}]
				}, {
					id: 'RWF4',
					class: 'winner food',
					title: 'Double Food',
					symbol: 'f f',
					tradeValue: 5,
					resources: [{
						name: 'food'
					},{
						name: 'food'
					}]
				}, {
					id: 'RWW5',
					class: 'winner wild',
					title: 'Wild',
					symbol: 'w',
					tradeValue: 5,
					resources: [{
						name: 'wild'
					}]
				}
			],
			get allCards() {
				return [].concat(this.purple, this.yellow, this.cyan, this.orange, this.resources, this.winner);
			}
		};
	}
]);