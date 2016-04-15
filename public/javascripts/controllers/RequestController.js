

// public/javascripts/controllers/RequestController.js
app.controller('RequestController', function($scope, RequestService) {
	$scope.submitStatus = 0;	
	$scope.alerts = [];

	$scope.items = [];
	$scope.links = [];

	var item = {name: "", price: 0, category: "", index: 0};
	var link = {url: "", description: "", index: 0};

	$scope.items.push(item);
	$scope.links.push(link);


	$scope.specificationCheck = false;
	$scope.onlineCheck = false;



	var clearAlerts = function(){
		$scope.organization.validation.isValid = 'empty';
		$scope.organization.validation.helpBlock = '';
		$scope.organization.value = "";

		$scope.description.validation.isValid = 'empty';
		$scope.description.validation.helpBlock = '';
		$scope.description.value = "";
		
		$scope.amount.validation.isValid = 'empty';
		$scope.amount.validation.helpBlock = '';
		$scope.amount.value = 0;
		
		$scope.type.validation.isValid = 'empty';
		$scope.type.validation.helpBlock = '';
		$scope.type.value = "";

		
		$scope.details.validation.isValid = 'empty';
		$scope.details.validation.helpBlock = '';
		$scope.details.value = "";

		$scope.specification.validation.isValid = 'empty';
		$scope.specification.validation.helpBlock = '';
		$scope.items = $scope.items.splice(0, 1)
		$scope.items.forEach(function(item){
			item.name = "";
			item.price = 0;
			item.category = "";
		})
	};

	$scope.dismissAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};	


	$scope.processForm = function(){
		$scope.alerts = [];
		$scope.organization.validate();
		$scope.description.validate();
		$scope.amount.validate();
		$scope.type.validate();
		$scope.details.validate();

		if($scope.submitStatus%5 != 0){
			$scope.alerts.push({
	          type: 'danger',
	          msg: 'Something wrong with the form'
	        });
		}
		console.log("submit the form");
		var data = {
			type: $scope.type.value,
			organization: $scope.organization.value,
			description: $scope.description.value,
			details: $scope.details.value,
			amount: $scope.amount.value,
			online: $scope.links,
			specification: $scope.items
		}
		// console.log(data);
		RequestService.createRequest(data).then(function(success) {
        $scope.alerts.push({
          type: success ? 'success' : 'danger',
          msg: success ? 'Successfully Submit the Request' : 'Fail to Submit the Request'
        });
        if(success){
        	clearAlerts();
        }
      });
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
				$scope.submitStatus += 1;	
			}
			else{
				$scope.submitStatus -= 1;		
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
				$scope.submitStatus += 1;	
			}
			else{
				$scope.submitStatus -= 1;	
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
				$scope.submitStatus += 1;	
			}
			else{
				$scope.submitStatus -= 1;	
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
				$scope.submitStatus += 1;	
			}
			else{
				$scope.submitStatus -= 1;	
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
				$scope.submitStatus += 1;	
			}
			else{
				$scope.submitStatus -= 1;	
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


	$scope.specification = {
		// name: "", 
		// price: 0, 
		// category: "", 
		// index: 0,
	    validation: {
	      isValid: 'empty',
	      helpBlock: ''
	    },
		validateName: function(){
			console.log("triggered");
			if($scope.requestForm.specificationPrice.$valid && $scope.requestForm.specificationName.$valid && $scope.requestForm.specificationItemCategory.$valid){
				this.validation.isValid = "valid";
			}
			else{
				this.validation.isValid = "invalid";
				if($scope.requestForm.specificationPrice.$error.required || $scope.requestForm.specificationName.$error.required || $scope.requestForm.specificationItemCategory.$error.required){
					this.validation.helpBlock = "This field cannot be empty";
				}
				else{
					this.validation.helpBlock = "This field must be text";
				}
			}
			console.log($scope.requestForm.specificationName.$valid);
			console.log(JSON.stringify($scope.requestForm.specificationName.$error, null, 4));
		},	
		validatePrice: function(){
			console.log("triggered");
			if($scope.requestForm.specificationPrice.$valid && $scope.requestForm.specificationName.$valid && $scope.requestForm.specificationItemCategory.$valid){
				this.validation.isValid = "valid";
				$scope.submitStatus += 1;	
			}
			else{
				this.validation.isValid = "invalid";
				if($scope.requestForm.specificationPrice.$error.required || $scope.requestForm.specificationName.$error.required || $scope.requestForm.specificationItemCategory.$error.required){
					this.validation.helpBlock = "This field cannot be empty";
				}
				else{
					this.validation.helpBlock = "This field must be number";
				}
			}
			console.log($scope.requestForm.specificationPrice.$valid);
			console.log(JSON.stringify($scope.requestForm.specificationPrice.$error, null, 4));			
		}
		,
		validateItemCategory: function(){
			console.log("triggered");
			if($scope.requestForm.specificationPrice.$valid && $scope.requestForm.specificationName.$valid && $scope.requestForm.specificationItemCategory.$valid){
				this.validation.isValid = "valid";
			}
			else{
				this.validation.isValid = "invalid";
				if($scope.requestForm.specificationPrice.$error.required || $scope.requestForm.specificationName.$error.required || $scope.requestForm.specificationItemCategory.$error.required){
					this.validation.helpBlock = "This field cannot be empty";
				}
				else{
					this.validation.helpBlock = "This field must be number";
				}
			}
			console.log($scope.requestForm.specificationItemCategory.$valid);
			console.log(JSON.stringify($scope.requestForm.specificationItemCategory.$error, null, 4));
		}
	}

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

