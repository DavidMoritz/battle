mainApp.factory('ItemFactory', [
	function ItemFactory() {
		'use strict';

		return {
			indian: () => _.clone({
				name: 'indian',
				display: 'Indian',
				color: 'red',
				inUse: false
			}),
			allItems: [{
				name: 'wood',
				display: 'Wood',
				btnClass: 'info',
				color: 'brown'
			}, {
				name: 'fur',
				display: 'Fur',
				btnClass: 'warning',
				color: 'yellow'
			}, {
				name: 'meat',
				display: 'Food',
				btnClass: 'danger',
				color: 'red'
			}, {
				name: 'equipment',
				display: 'Equipment',
				btnClass: 'success',
				color: 'gray'
			}, {
				name: 'canoe',
				display: 'Canoes',
				btnClass: 'primary',
				color: 'blue',
				cost: {
					wood: 2
				}
			}, {
				name: 'horse',
				display: 'Horses',
				btnClass: 'default',
				color: 'white',
				cost: {
					wood: 1,
					fur: 1,
					meat: 1,
					equipment: 1
				}
			}]
		};
	}
]);
