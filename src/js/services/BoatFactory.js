mainApp.factory('BoatFactory', [
	function BoatFactory() {
		'use strict';

		return {
			startIndian: () => new Array(
				{
					id: 'BI11',
					style: 'BI11',
					cost: () => 0,
					capacity: 1,
					priority: 1,
					content: []
				},{
					id: 'BI21',
					style: 'BI21',
					cost: function cost() {
						return this.content.length;
					},
					capacity: 20,
					priority: 4,
					content: []
				}
			),
			startSupply: () => new Array(
				{
					id: 'BS11',
					style: 'BS11',
					cost: () => 0,
					capacity: 3,
					priority: 1,
					content: []
				},{
					id: 'BS21',
					style: 'BS21',
					cost: function cost() {
						return this.content.length ? 1 : 0;
					},
					capacity: 3,
					priority: 4,
					content: []
				},{
					id: 'BS31',
					style: 'BS31',
					cost: function cost() {
						return this.content.length;
					},
					capacity: 5,
					priority: 5,
					content: []
				}
			),
			indiansmall: num => _.clone({
				id: 'BI31-' + num,
				style: 'BI31',
				cost: () => 0,
				capacity: 1,
				priority: 2,
				content: []
			}),
			indianbig: num => _.clone({
				id: 'BI41-' + num,
				style: 'BI41',
				cost: function cost() {
					return this.content.length ? 1 : 0;
				},
				capacity: 3,
				priority: 3,
				content: []
			}),
			supplysmall: num => _.clone({
				id: 'BS41-' + num,
				style: 'BS41',
				cost: () => 0,
				capacity: 2,
				priority: 2,
				content: []
			}),
			supplybig: num => _.clone({
				id: 'BS51-' + num,
				style: 'BS51',
				cost: function cost() {
					return this.content.length ? 1 : 0;
				},
				capacity: 5,
				priority: 3,
				content: []
			}),
			chooseBoats: [
				{
					name: 'supplysmall',
					type: 'supply',
					size: 'small',
					bonus: 'Receive 2 basic resources of your choice',
					description: 'This Boat can contain up to two resources and costs no Time during Encampment.'
				},
				{
					name: 'indiansmall',
					type: 'indian',
					size: 'small',
					bonus: 'Receive 1 indian from supply (if any available)',
					description: 'This Boat can transport one Indian and costs no Time during Encampment.'
				},
				{
					name: 'supplybig',
					type: 'supply',
					size: 'big',
					bonus: 'Receive 2 basic resources of your choice',
					description: 'This Boat can contain up to five resources and costs one Time during Encampment if it contains at least one resource.'
				},
				{
					name: 'indianbig',
					type: 'indian',
					size: 'big',
					bonus: 'Receive 1 indian from supply (if any available)',
					description: 'This Boat can transport up to three Indians, and costs one Time during Encampment if it transports at least one Indian.'
				}
			]
		};
	}
]);
