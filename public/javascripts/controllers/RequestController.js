// public/javascripts/controllers/RequestController.js
app.controller('RequestController', function($scope, RequestService) {
	$scope.submitStatus = 0;	
	$scope.alerts = [];

	$scope.items = [];
	$scope.links = [];
	var itemNum = 1;
	var linkNum = 1;

	// var item = {name: "", price: 0, category: "", index: 0};
	var item = {
		name: "", 
		price: 0, 
		category: "", 
		index: 0,
	    validation: {
	      isValid: 'empty',
	      nameHelpBlock: '',
	      priceHelpBlock: '',
	      categoryHelpBlock: ''
	    }
	}

	var link = {
		url: "", 
		description: "", 
		index: 0,
	    validation: {
	      isValid: 'empty',
	      urlhelpBlock: '',
	      dspHelpBlock: ''
	    }
	}

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

		itemNum = 1;
		$scope.items = $scope.items.splice(0, 1)
		$scope.items.forEach(function(item){
			item.name = "";
			item.price = 0;
			item.category = "";
			item.validation.isValid = "empty";
			item.validation.nameHelpBlock = "";
		    item.validation.priceHelpBlock = "";
		    item.validation.categoryHelpBlock = "";
		})

		linkNum = 1;
		$scope.links = $scope.links.splice(0, 1)
		$scope.links.forEach(function(link){
			link.url = "";
			link.description = "";
			link.validation.isValid = "empty";
			link.validation.urlHelpBlock = "";
			link.validation.dspHelpBlock = "";
		})

	};

	$scope.dismissAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};	


	$scope.processForm = function(){
		$scope.submitStatus = 0;
		$scope.alerts = [];
		console.log("$scope.submitStatus: " + $scope.submitStatus);
		$scope.organization.validate();
		console.log("after organization");
		console.log("$scope.submitStatus: " + $scope.submitStatus);
		$scope.description.validate();
		console.log("after description");
		console.log("$scope.submitStatus: " + $scope.submitStatus);

		$scope.amount.validate();
		console.log("after amount");
		console.log("$scope.submitStatus: " + $scope.submitStatus);
		
		$scope.type.validate();
		console.log("after type");
		console.log("$scope.submitStatus: " + $scope.submitStatus);
		
		$scope.details.validate();
		console.log("after details");
		console.log("$scope.submitStatus: " + $scope.submitStatus);
		
		$scope.items.forEach(function(item){
			console.log("for each items")
			$scope.validateItem(item.index);
		})
		console.log("after items");
		console.log("$scope.submitStatus: " + $scope.submitStatus);
		
		$scope.links.forEach(function(link){
			console.log("for each link")
			$scope.validateLink(link.index);
		})
		console.log("after links");
		console.log("$scope.submitStatus: " + $scope.submitStatus);
		
		if($scope.submitStatus !== 5 + itemNum*3 + linkNum*2){
			$scope.alerts.push({
	          type: 'danger',
	          msg: 'Something wrong with the form'
	        });
		}
		else{
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
		$scope.submitStatus = 0;
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
			if($scope.requestForm.amount.$valid && this.value != 0 && this.value){
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

	
	$scope.validateItem = function(index){
		$scope.items.forEach(function(item){
		// console.log("validation item");
			if (item.index == index) {
				console.log("find the item");
				console.log("index: " + index);
				console.log(item.name);
				item.validation.nameHelpBlock = "";
				item.validation.priceHelpBlock = "";
				item.validation.categoryHelpBlock = "";
				if(item.name == ""  || !item.name){
					item.validation.isValid = "invalid";
					item.validation.nameHelpBlock = "The name cannot be empty";
					console.log("name")
					console.log(item.validation.isValid);
					$scope.submitStatus -= 1;	
				}
				else{
					$scope.submitStatus += 1;	
					if(item.price == 0 || !item.price){
						item.validation.isValid = "invalid";					
						item.validation.priceHelpBlock = "The price must be a non-zero number";
						item.validation.categoryHelpBlock = ""; 						
						console.log("price")
						console.log(item.validation.isValid);
						$scope.submitStatus -= 1;	
					}
					else{
						$scope.submitStatus += 1;	
						if (item.category == ""  || !item.category){
							item.validation.isValid = "invalid";
							item.validation.categoryHelpBlock = "The category cannot be empty"; 						
							console.log("category")
							console.log(item.validation.isValid);
							$scope.submitStatus -= 1;	
						}
						else{
							$scope.submitStatus += 1;	
							item.validation.isValid = "valid";
							item.validation.nameHelpBlock = "";
							item.validation.priceHelpBlock = "";
							item.validation.categoryHelpBlock = "";
							console.log("else")
							console.log(item.validation.isValid);
						}
					}
				} 
			};
		})
	}



	$scope.validateLink = function(index){
		$scope.links.forEach(function(link){
			if (link.index == index) {
				console.log("find the link");
				console.log("index: " + index);
				console.log(link.url);
				link.validation.urlHelpBlock = "";
				link.validation.dspHelpBlock = "";
				if(link.url == ""  || !link.url){
					link.validation.isValid = "invalid";
					link.validation.urlHelpBlock = "The url cannot be empty";
					console.log("url")
					console.log(link.validation.isValid);
					$scope.submitStatus -= 1;	
				}
				else{
					$scope.submitStatus += 1;	
					if(link.description == "" || !link.description){
						link.validation.isValid = "invalid";					
						link.validation.dspHelpBlock = "The description cannot be empty";
						console.log("description")
						console.log(link.validation.isValid);
						$scope.submitStatus -= 1;	
					}
					else{
						$scope.submitStatus += 1;	
						link.validation.isValid = "valid";
						link.validation.urlHelpBlock = "";
						link.validation.dspHelpBlock = "";
						console.log("else")
						console.log(link.validation.isValid);
					}
				} 
			};
		})
	}

	$scope.addItem = function(){
		var newItem = {
			name: "", 
			price: 0, 
			category: "", 
			index: itemNum,
		    validation: {
		      isValid:  'empty',
		      nameHelpBlock: '',
		      priceHelpBlock: '',
		      categoryHelpBlock: ''
		    }
		}
		itemNum += 1;
		$scope.items.push(newItem);
	};
	$scope.delItem = function(index){
		$scope.items.splice(index, 1);
	};

	$scope.addLink = function(){
		var newLink  = {
		url: "", 
		description: "", 
		index: linkNum,
	    validation: {
	      isValid: 'empty',
	      urlhelpBlock: '',
	      dspHelpBlock: ''
	    }
	}
		linkNum += 1;
		$scope.links.push(newLink);
	};

	$scope.delLink = function(index){
		$scope.links.splice(index, 1)
	};
	
});