mainApp.controller('ViewCardModalInstanceCtrl', function ModalCtrl($scope, $uibModalInstance, card) {
	$scope.card = card;

	$scope.cancel = () => $uibModalInstance.dismiss('cancel');
});