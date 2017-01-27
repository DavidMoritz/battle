mainApp.controller('ViewCardModalInstanceCtrl', function ModalCtrl($scope, $uibModalInstance, card) {
	$scope.card = card;

	$scope.cancel = () => $uibModalInstance.dismiss('cancel');
});

mainApp.controller('SelectResourcesModalInstanceCtrl', function ModalCtrl($scope, $uibModalInstance, items) {
	var deselect = item => {
		item.selected = false;

		return item;
	};

	$scope.count = items.count;
	$scope.progressCards = items.progressCards.map(deselect);
	$scope.resources = items.resources.map(deselect);

	$scope.select = item => item.selected = !item.selected;

	$scope.choose = () => {
		$uibModalInstance.close({
			resources: $scope.resources.filter(res => res.selected),
			card: $scope.progressCards.filter(card => card.selected)
		});
	};

	$scope.chooseable = () => $scope.resources.filter(res => res.selected).length == items.count && $scope.progressCards.filter(card => card.selected).length == 1;

	$scope.cancel = () => $uibModalInstance.dismiss('cancel');
});