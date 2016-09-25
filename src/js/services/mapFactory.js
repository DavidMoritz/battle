mainApp.factory('MapFactory', [
	function MapFactory() {
		'use strict';

		return {
			map: [
				{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river',
					special: 'start'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'mixed'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mixed'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mountain'
				},{
					terrain: 'mountain'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river'
				},{
					terrain: 'river',
					special: 'finish'
				},{
					terrain: 'river',
					special: 'finish'
				},{
					terrain: 'river',
					special: 'finish'
				},{
					terrain: 'river',
					special: 'finish'
				}
			],
			configureMap: [
				{
					terrain: 'river',
					spaces: 5
				},
				{
					special: 'start',
					terrain: 'river',
					spaces: 1
				},
				{
					terrain: 'river',
					spaces: 17
				},
				{
					terrain: 'mixed',
					spaces: 1
				},
				{
					terrain: 'mountain',
					spaces: 7
				},
				{
					terrain: 'mixed',
					spaces: 1
				},
				{
					terrain: 'river',
					spaces: 5
				},
				{
					terrain: 'mountain',
					spaces: 3
				},
				{
					terrain: 'river',
					spaces: 4
				},
				{
					special: 'finish',
					terrain: 'river',
					spaces: 11
				}
			]
		};
	}
]);