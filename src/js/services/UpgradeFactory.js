mainApp.factory('UpgradeFactory', [
	function UpgradeFactory() {
		'use strict';

		return {
			military: [
				{
					level: 1,
					points: 0,
					recurringPoimts: 3,
					damage: {
						resource: 1,
						points: 0
					},
					cost: [
						'food'
					]
				}, {
					level: 2,
					points: 0,
					recurringPoimts: 5,
					damage: {
						resource: 1,
						points: 2
					},
					cost: [
						'food',
						'energy'
					]
				}, {
					level: 3,
					points: 0,
					recurringPoimts: 7,
					damage: {
						resource: 1,
						points: 4
					},
					cost: [
						'food',
						'energy',
						'energy'
					]
				}, {
					level: 4,
					points: 0,
					recurringPoimts: 10,
					damage: {
						resource: 2,
						points: 1
					},
					cost: [
						'food',
						'food',
						'energy',
						'energy'
					]
				}
			],
			defense: [
				{
					level: 1,
					points: 0,
					recurringPoimts: 2,
					cost: [
						'lumber'
					]
				}, {
					level: 2,
					points: 0,
					recurringPoimts: 4,
					cost: [
						'lumber',
						'mineral'
					]
				}, {
					level: 3,
					points: 0,
					recurringPoimts: 10,
					cost: [
						'lumber',
						'lumber',
						'mineral',
						'mineral'
					]
				}
			],
			utopia: [
				{
					level: 1,
					points: 5,
					recurringPoimts: 0,
					cost: [
						'lumber',
						'food'
					]
				}, {
					level: 2,
					points: 15,
					recurringPoimts: 0,
					cost: [
						'lumber',
						'food',
						'mineral'
					]
				}, {
					level: 3,
					points: 35,
					recurringPoimts: 0,
					cost: [
						'lumber',
						'food',
						'mineral',
						'energy'
					]
				}, {
					level: 4,
					points: 70,
					recurringPoimts: 0,
					cost: [
						'lumber',
						'food',
						'food',
						'mineral',
						'mineral',
						'energy'
					]
				}
			],
			knowledge: [
				{
					level: 1,
					points: 0,
					recurringPoimts: 0,
					bonus: 'Resources never expire',
					cost: [
						'wild'
					]
				}, {
					level: 2,
					points: 0,
					recurringPoimts: 0,
					bonus: 'All upgrades (except Shared Knowledge) cost one less resource',
					cost: [
						'wild',
						'lumber'
					]
				}, {
					level: 3,
					points: 0,
					recurringPoimts: 0,
					bonus: '3 upgrades per round instead of 2',
					cost: [
						'wild',
						'food',
						'mineral'
					]
				}
			],
			converter: [
				{
					level: 1,
					points: 0,
					recurringPoimts: 0,
					conversionRate: {
						pay: 2,
						receive: 1
					},
					cost: [
						'lumber'
					]
				}, {
					level: 2,
					points: 0,
					recurringPoimts: 0,
					conversionRate: {
						pay: 1,
						receive: 1
					},
					cost: [
						'energy',
						'energy'
					]
				}, {
					level: 3,
					points: 24,
					recurringPoimts: 0,
					conversionRate: {
						pay: 1,
						receive: 2
					},
					cost: [
						'energy',
						'energy',
						'energy'
					]
				}
			],
			get allUpgrades() {
				return [].concat(this.military, this.defense, this.utopia, this.knowledge, this.converter);
			}
		};
	}
]);