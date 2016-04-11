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

	// $scope.organizationChoice
	// $scope.categoryChoice;
	// $scope.description = "";
	// $scope.totalPrice = 0;
	// $scope.typeChoice = "";
	// $scope.details = "";




	$scope.processForm = function(){
		$scope.organization.validate();
		$scope.description.validate();
		$scope.amount.validate();
		$scope.type.validate();
		$scope.details.validate();

		console.log("submit the form");
		this.newPassword.validate();
	    this.confirmNewPassword.validate();
		var data = {
			type: $scope.typeChoice,
			organization: $scope.organizationChoice,
			description: $scope.description,
			details: $scope.details,
			amount: $scope.totalPrice,
			online: $scope.links,
			specification: $scope.items
		}
		// console.log(data);
		RequestService.createRequest(data);
		
	}

	$scope.type = {
		value: '',
	    validation: {
	      // isValid: 'valid',
	      isValid: 'empty',
	      helpBlock: ''
	    },
		validate: function(){
			console.log("triggered");
			if($scope.requestForm.type.$valid){
				this.validation.isValid = "valid";
			}
			else{
				this.validation.isValid = "invalid";
				if($scope.requestForm.type.$error.required){
					this.validation.helpBlock = "This field cannot be empty";
				}
				else{
					this.validation.helpBlock = "This field must be string";
				}
			}
			console.log($scope.requestForm.type.$valid);
			console.log(JSON.stringify($scope.requestForm.type.$error, null, 4));
		}	
	}

	$scope.organization = {
		value: '',
	    validation: {
	      // isValid: 'valid',
	      isValid: 'empty',
	      helpBlock: ''
	    },
		validate: function(){
			console.log("triggered");
			if($scope.requestForm.organization.$valid){
				this.validation.isValid = "valid";
			}
			else{
				this.validation.isValid = "invalid";
				if($scope.requestForm.organization.$error.required){
					this.validation.helpBlock = "This field cannot be empty";
				}
				else{
					this.validation.helpBlock = "This field must be string";
				}
			}
			console.log($scope.requestForm.organization.$valid);
			console.log(JSON.stringify($scope.requestForm.organization.$error, null, 4));
		}	
	}

	$scope.description = {
		value: '',
	    validation: {
	      // isValid: 'valid',
	      isValid: 'empty',
	      helpBlock: ''
	    },
		validate: function(){
			console.log("triggered");
			if($scope.requestForm.description.$valid){
				this.validation.isValid = "valid";
			}
			else{
				this.validation.isValid = "invalid";
				if($scope.requestForm.description.$error.required){
					this.validation.helpBlock = "This field cannot be empty";
				}
				else{
					this.validation.helpBlock = "This field must be string";
				}
			}
			console.log($scope.requestForm.description.$valid);
			console.log(JSON.stringify($scope.requestForm.description.$error, null, 4));
		}	
	}

	$scope.details = {
		value: '',
	    validation: {
	      // isValid: 'valid',
	      isValid: 'empty',
	      helpBlock: ''
	    },
		validate: function(){
			console.log("triggered");
			if($scope.requestForm.details.$valid){
				this.validation.isValid = "valid";
			}
			else{
				this.validation.isValid = "invalid";
				if($scope.requestForm.description.$error.required){
					this.validation.helpBlock = "This field cannot be empty";
				}
				else{
					this.validation.helpBlock = "This field must be string";
				}
			}
			console.log($scope.requestForm.details.$valid);
			console.log(JSON.stringify($scope.requestForm.details.$error, null, 4));
		}	
	}


	$scope.amount = {
		value: 0,
	    validation: {
	      isValid: 'empty',
	      helpBlock: ''
	    },
		validate: function(){
			console.log("triggered");
			if($scope.requestForm.amount.$valid && this.value != 0){
				this.validation.isValid = "valid";
			}
			else{
				this.validation.isValid = "invalid";
				if($scope.requestForm.amount.$error.required){
					this.validation.helpBlock = "This field cannot be empty";
				}
				else{
					this.validation.helpBlock = "The amount cannot be zero";
				}
			}
			console.log($scope.requestForm.amount.$valid);
			console.log(JSON.stringify($scope.requestForm.amount.$error, null, 4));
		}	
	}

	// $scope.specification = {
	// 	value: 0,
	//     validation: {
	//       isValid: 'empty',
	//       helpBlock: ''
	//     },
	// 	validate: function(){
	// 		console.log("triggered");
	// 		if($scope.requestForm.specification.$valid){
	// 			this.validation.isValid = "valid";
	// 		}
	// 		else{
	// 			this.validation.isValid = "invalid";
	// 			if($scope.requestForm.specification.$error.required){
	// 				this.validation.helpBlock = "This field cannot be empty";
	// 			}
	// 			else{
	// 				this.validation.helpBlock = "This field must be number";
	// 			}
	// 		}
	// 		console.log($scope.requestForm.specification.$valid);
	// 		console.log(JSON.stringify($scope.requestForm.specification.$error, null, 4));
	// 	}	
	// }

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