/ public/javascripts/controllers/RequestController.js
app.controller('RequestController', function($scope, RequestService) {
	$scope.items = [];
	$scope.links = [];

	var item = {name: "", price: 0, category: "", index: 0};
	var link = {url: "", description: "", index: 0};

	$scope.items.push(item);
	$scope.links.push(link);


	$scope.specificationCheck = false;
	$scope.onlineCheck = false;

	$scope.organizationChoice
	$scope.categoryChoice;
	$scope.description = "";
	$scope.totalPrice = 0;
	$scope.typeChoice = "";
	$scope.details = "";




	$scope.processFor