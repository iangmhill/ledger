// public/javascripts/controllers/RequestController.js
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




	$scope.processForm = function(){
		console.log("submit the form");
		var data = {
			type: $scope.typeChoice,
			organization: $scope.organizationChoice,
			description: $scope.description,
			details: $scope.details,
			amount: $scope.totalPrice,
			online: $scope.links,
			specification: $scope.items
		}
		console.log(data);
		RequestService.createRequest(data);
	};



	$scope.addItem = function(){
		var newItem = {name: "", price: 0, category: "", index: 0};
		newItem.index = item.index + 1;
		$scope.items.push(newItem);
	};
	$scope.delItem = function(index){
		$scope.items.splice(index, 1);
	};

	$scope.addLink = function(){
		var newLink = {url: "", description: "", index: 0};
		newLink.index = link.index + 1;
		$scope.links.push(newLink);
	};
	$scope.delLink = function(index){
		$scope.links.splice(index, 1)
	};
	
});