// public/javascripts/controllers/RecordController.js
<<<<<<< HEAD
app.controller('RecordController', function($scope, RecordService, OrgService) {
	
  var RecCtrl = this;

  $scope.reqdata = {
    requests: null,
    availableOptions : null 
  };


  OrgService.getOrgList().then(function(data) {
    if (data){
      $scope.orgs = data;
      console.log(data);
    }
  });

  RecordService.getRequests().then(function(response) {
      $scope.reqs = response;
    });

  $scope.filterReq = function() {
      var request = $scope.reqs.filter(function (el) {
        return el.org == $scope.org.value
      });
      $scope.reqdata.availableOptions = request; 
=======

app.controller('RecordController', function(RecordService, OrgService) {
  var RecCtrl = this;
  this.categories =
      ['Food', 'Consumable Supplies', 'Long Term Supplies', 'Service/Events'];

  function Field(initialValue) {
    this.value = initialValue;
    this.isValidated = false;
    this.isValid = false;
    this.helpBlock = '';
    this.reset = function() {
      this.value = initialValue;
      this.isValidated = false;
      this.isValid = false;
      this.helpBlock = '';
    };
>>>>>>> 09c923a83d283cf742d1ad213a9baf7416f6d05e
  }
  function FieldWithValidation(initialValue, validationFunction) {
    Field.call(this, initialValue);
    this.validate = validationFunction;
  }
  function Item() {
    this.name = new Field('');
    this.price = new Field(0);
    this.category = new Field('');
  }

  this.alerts = [];
  this.requests = [];
  this.orgs = [];
  this.pcardOptions = [1,2];
  this.typeOptions = ['revenue','purchase'];
  this.datePicker = {
    open: false,
    format: 'shortDate',
    altFormat: 'M!/d!/yy',
    options: {
      formatYear: 'yy',
      maxDate: new Date(),
      minDate: new Date(2016, 1, 1),
      startingDay: 1
    }
  };

  this.createRecord = {
    type: new Field('purchase'),
    org: new FieldWithValidation('', function() {
      if (this.typeaheadOptions) {
        this.isValid = !!this.typeaheadOptions[this.value];
        this.helpBlock = this.isValid ? 'Invalid organization' : '';
        this.isValidated = true;
        return this.isValid;
      }
    }),
    description: new FieldWithValidation('', function() {
      this.isValid = typeof this.value === 'string';
      this.helpBlock = this.isValid ? 'Invalid description' : '';
      this.isValidated = true;
      return this.isValid;
    }),
    reimbursement: new Field('pcard'),
    pcard: new FieldWithValidation('0', function() {
      this.isValid = RecCtrl.createRecord.type.value !== 'purchase' ||
          (parseInt(this.value) == 0 ||
          RecCtrl.pcardOptions.indexOf(parseInt(this.value)) > -1);
      this.helpBlock = this.isValid ? 'Invalid p-card number' : '';
      this.isValidated = true;
      return this.isValid;
    }),
    request: new FieldWithValidation('', function() {
      this.isValid = RecCtrl.createRecord.type.value !== 'purchase' ||
          (typeof this.value === 'string' && this.value.length > 0);
      this.helpBlock = this.isValid ? 'A request must be selected' : '';
      this.isValidated = true;
      return this.isValid;
    }),
    date: new FieldWithValidation('', function() {
      var date = new Date(this.value);
      this.isValid = !!date && date > RecCtrl.datePicker.options.minDate &&
          date < RecCtrl.datePicker.options.maxDate;
      this.helpBlock = this.isValid ? 'Invalid date of purchase' : '';
      this.isValidated = true;
      return this.isValid;
    }),
    amount: new FieldWithValidation(0, function() {
      if (RecCtrl.createRecord.type.value !== 'revenue') { return true; }
      this.isValid = this.value && this.value != 0 &&
          RecCtrl.recordForm.amount.$valid;
      if (RecCtrl.recordForm.amount.$error.required) {
        this.helpBlock = "This field cannot be empty";
      } else {
        this.helpBlock = "The amount cannot be zero";
      }
      this.isValidated = true;
      return this.isValid;
    }),
    items: {
      array: [new Item()],
      total: 0,
      addItem: function() {
        this.array.push(new Item());
      },
      delItem: function(index) {
        this.array.splice(index, 1);
      },
      validate: function() {
        if (RecCtrl.createRecord.type.value !== 'purchase') { return true; }
        var isValid = 0, items = this;
        this.array.forEach(function(item) {
          isValid += items.validateName(item.name) ? 0 : 1;
          isValid += items.validatePrice(item.price) ? 0 : 1;
          isValid += items.validateCategory(item.category) ? 0 : 1;
        })
        return isValid == 0;
      },
      validateName: function(name) {
        name.isValid = !!name.value && name.value != '';
        name.helpBlock = name.isValid
            ? ''
            : 'The name cannot be empty';
        name.isValidated = true;
        return name.isValid;
      },
      validatePrice: function(price) {
        price.isValid = !!price.value && price.value > 0;
        price.helpBlock = price.isValid
            ? ''
            : 'The price must be greater than $0.00';
        price.isValidated = true;
        return price.isValid;
      },
      validateCategory: function(category) {
        category.isValid = !!category.value && category.value != '';
        category.helpBlock = category.isValid
            ? ''
            : 'The category cannot be empty';
        category.isValidated = true;
        return category.isValid;
      },
      updateTotal: function() {
        var sum = 0;
        this.array.map(function(item) {
          sum += item.price.value;
        });
        this.total = sum;
      }
    },
    filterRequests: function() {
      if (this.org.typeaheadOptions) {
        this.request.options = RecCtrl.requests.filter(function (request) {
          return request.org == RecCtrl.createRecord.org
              .typeaheadOptions[RecCtrl.createRecord.org.value];
        });
      }
    },
    validateAll: function() {
      var isValid = 0;
      isValid += this.org.validate() ? 0 : 1;
      isValid += this.description.validate() ? 0 : 1;
      isValid += this.pcard.validate() ? 0 : 1;
      isValid += this.request.validate() ? 0 : 1;
      isValid += this.date.validate() ? 0 : 1;
      isValid += this.items.validate() ? 0 : 1;
      isValid += this.amount.validate() ? 0 : 1;
      return isValid == 0;
    },
    submit: function() {
      RecCtrl.alerts = [];
      if (this.validateAll()) {
        console.log(this.type.value);
        RecordService.createRecord({
          type: this.type.value,
          description: this.description.value,
          value: (this.type.value == 'purchase'
              ? this.items.total
              : this.amount.value),
          org: this.org.typeaheadOptions[this.org.value],
          paymentMethod: this.reimbursement.value,
          pcard: parseInt(this.pcard.value),
          request: this.request.value,
          date: this.date.value,
          items: this.items.array.map(function(item) {
            return {
              description: item.name.value,
              price: item.price.value,
              category: item.category.value
            };
          })
        }).then(function(success) {
          if (success) {
            RecCtrl.alerts = [];
            RecCtrl.createRecord.type.reset();
            RecCtrl.createRecord.org.reset();
            RecCtrl.createRecord.description.reset();
            RecCtrl.createRecord.reimbursement.reset();
            RecCtrl.createRecord.pcard.reset();
            RecCtrl.createRecord.request.reset();
            RecCtrl.createRecord.date.reset();
            RecCtrl.createRecord.amount.reset();
            RecCtrl.createRecord.items.array = [];

          }
          RecCtrl.alerts.push({
            type: success ? 'success' : 'danger',
            msg: success ? 'Successfully created the record' : 'Failed to create the record'
          });
        });
      } else {
        RecCtrl.alerts.push({
          type: 'danger',
          msg: 'Something wrong with the form'
        });
      }
    }
  }

  OrgService.getOrgList().then(function(orgs) {
    if (orgs) {
      RecCtrl.orgs = orgs;
      RecCtrl.createRecord.org.typeaheadOptions = {};
      for (index in RecCtrl.orgs) {
        var org = RecCtrl.orgs[index];
        var name = org.shortName
            ? org.name + ' (' + org.shortName + ')'
            : org.name;
        RecCtrl.createRecord.org.typeaheadOptions[name] = org._id;
      }
    }
  });

  RecordService.getRequests().then(function(requests) {
    if (requests) {
      RecCtrl.requests = requests;
    }
  });

  this.dismissAlert = function(index) {
    RecCtrl.alerts.splice(index, 1);
  };
});
