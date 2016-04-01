// public/javascripts/controllers/RequestController.js
app.controller('RequestController', function($scope) {
	$scope.specificationCheck = false;
	$scope.onlineCheck = false;
	$scope.organization = "";

	$scope.items = [];
	$scope.links = [];
	var item = 1;
	var link = 1;
	$scope.items.push(item);
	$scope.links.push(link);

	$scope.processForm = function(){
		console.log("submit the form");
		console.log($scope.organization);
	};

	$scope.addItem = function(){
		item += 1;
		$scope.items.push(item);
	};
	$scope.delItem = function(){
		$scope.items.pop();
	};

	$scope.addLink = function(){
		link += 1;
		$scope.links.push(link);
	};
	$scope.delLink = function(){
		$scope.links.pop();
	};
	
});