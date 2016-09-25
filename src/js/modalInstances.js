mainApp.controller('ViewCardModalInstanceCtrl', function ModalCtrl($scope, $uibModalInstance, card) {
	$scope.card = card;

	$scope.cancel = () => $uibModalInstance.dismiss('cancel');
});

mainApp.controller('ViewPlayerModalInstanceCtrl', function ModalCtrl($scope, $uibModalInstance, player) {
	$scope.player = player;

	$scope.viewCard = card => {
		$s.viewCard(card);
		$scope.cancel();
	};

	$scope.cancel = () => $uibModalInstance.dismiss('cancel');
});

mainApp.controller('ViewBoardModalInstanceCtrl', function ModalCtrl($scope, $uibModalInstance) {
	$scope.boardSpaces = $s.boardSpaces;

	$scope.cancel = () => $uibModalInstance.dismiss('cancel');
});

mainApp.controller('ViewRecruitModalInstanceCtrl', function ModalCtrl($scope, $uibModalInstance) {
	$scope.journal = $s.journal;

	$scope.viewCard = card => {
		$s.viewCard(card);
		$scope.cancel();
	};

	$scope.cancel = () => $uibModalInstance.dismiss('cancel');
});