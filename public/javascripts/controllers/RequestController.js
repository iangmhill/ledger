// public/javascripts/controllers/RequestController.js

app.controller('RequestController', function(RequestService, OrgService) {
  var ReqCtrl = this;
  this.alerts = [];
  this.onlineCheck = false;
  this.categories =
      ['Food', 'Consumable Supplies', 'Long Term Supplies', 'Service/Events'];
  this.reEditRequest = RequestService.reEditRequest;

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
  function Link() {
    this.url = new Field('');
    this.description = new Field('');
  }

  this.createRequest = {
    org: new FieldWithValidation('', function() {
      this.isValid = ReqCtrl.requestForm.org.$valid;
      if (ReqCtrl.requestForm.org.$error.required) {
        this.helpBlock = "This field cannot be empty";
      } else {
        this.helpBlock = "This field must be string";
      }
      this.isValidated = true;
      return this.isValid;
    }),
    description: new FieldWithValidation('', function() {
      this.isValid = ReqCtrl.requestForm.description.$valid;
      if (ReqCtrl.requestForm.description.$error.required) {
        this.helpBlock = "This field cannot be empty";
      } else {
        this.helpBlock = "This field must be string";
      }
      this.isValidated = true;
      return this.isValid;
    }),
    amount: new FieldWithValidation(0, function() {
      this.isValid = this.value && this.value != 0 &&
          ReqCtrl.requestForm.amount.$valid;
      if (ReqCtrl.requestForm.amount.$error.required) {
        this.helpBlock = "This field cannot be empty";
      } else {
        this.helpBlock = "The amount cannot be zero";
      }
      this.isValidated = true;
      return this.isValid;
    }),
    online: {
      value: false,
      onChange: function() {
        console.log(this.value);
        ReqCtrl.createRequest.links.array = this.value ? [new Link()] : [];
      }
    },
    items: {
      array: [new Item()],
      addItem: function() {
        this.array.push(new Item());
      },
      delItem: function(index) {
        this.array.splice(index, 1);
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
      }
    },
    links: {
      array: [],
      addLink: function() {
        this.array.push(new Link());
      },
      delLink: function(index) {
        this.array.splice(index, 1);
      },
      validateUrl: function(url) {
        url.isValid = !!url.value && url.value != '';
        url.helpBlock = url.isValid
            ? ''
            : 'The url cannot be empty';
        url.isValidated = true;
        return url.isValid;
      },
      validateDescription: function(description) {
        description.isValid = true;
        description.isValidated = true;
        return description.isValid;
      }
    },
    comment: new FieldWithValidation('', function() {
      this.isValid = !ReqCtrl.reEditRequest ||
          (typeof this.value === 'string' && this.value.length > 0);
      this.helpBlock = this.isValid ? '' : 'Comment cannot be empty';
      this.isValidated = true;
      return this.isValid;
    }),
    validateAll: function() {
      var isValid = 0;
      isValid += this.org.validate() ? 0 : 1;
      isValid += this.description.validate() ? 0 : 1;
      isValid += this.amount.validate() ? 0 : 1;

      this.items.array.forEach(function(item) {
        isValid += ReqCtrl.createRequest.items.validateName(item.name) ? 0 : 1;
        isValid += ReqCtrl.createRequest.items
            .validatePrice(item.price) ? 0 : 1;
        isValid += ReqCtrl.createRequest.items
            .validateCategory(item.category) ? 0 : 1;
      })
      this.links.array.forEach(function(link){
        isValid += ReqCtrl.createRequest.links.validateUrl(link.url) ? 0 : 1;
        isValid += ReqCtrl.createRequest.links
            .validateDescription(link.description) ? 0 : 1;
      })
      isValid += this.comment.validate() ? 0 : 1;

      return isValid == 0;
    },
    resetAll: function() {
      ReqCtrl.createRequest.org.reset();
      ReqCtrl.createRequest.description.reset();
      ReqCtrl.createRequest.amount.reset();
      ReqCtrl.createRequest.online.value = false;
      ReqCtrl.createRequest.items.array = [];
      ReqCtrl.createRequest.links.array = [];
      ReqCtrl.createRequest.comment.reset();
    },
    submit: function() {
      ReqCtrl.alerts = [];
      if (this.validateAll()) {
        var request = {
          org: this.org.typeaheadOptions[this.org.value],
          description: this.description.value,
          amount: this.amount.value,
          links: this.links.array.map(function(link) {
            return {
              url: link.url.value,
              description: link.description.value
            };
          }),
          items: this.items.array.map(function(item) {
            return {
              description: item.name.value,
              price: item.price.value,
              category: item.category.value
            };
          })
        };
        if (this.reEditRequest) {
          request.comment = this.comment.value;
          RequestService.editRequest(request).then(function(success) {
            if (success) {
              ReqCtrl.alerts = [];
              ReqCtrl.createRequest.resetAll();
              RequestService.reEditRequest = false;
              RequestService.reEditRequestInfo = undefined;
              ReqCtrl.reEditRequest = false;
            }
            ReqCtrl.alerts.push({
              type: success ? 'success' : 'danger',
              msg: success ? 'Successfully Submit the Request' : 'Fail to Submit the Request'
            });
          });
        } else {
          RequestService.createRequest(request).then(function(success) {
            if (success) {
              ReqCtrl.alerts = [];
              ReqCtrl.createRequest.resetAll();
            }
            ReqCtrl.alerts.push({
              type: success ? 'success' : 'danger',
              msg: success ? 'Successfully Submit the Request' : 'Fail to Submit the Request'
            });
          });
        }

      } else {
        ReqCtrl.alerts.push({
          type: 'danger',
          msg: 'Something wrong with the form'
        });
      }
    }
  };

  this.dismissAlert = function(index) {
    ReqCtrl.alerts.splice(index, 1);
  };

  // Initialization
  OrgService.getOrgList().then(function(orgs) {
    if (orgs) {
      ReqCtrl.orgs = orgs;

      ReqCtrl.createRequest.org.typeaheadOptions = {};
      for (index in ReqCtrl.orgs) {
        var org = ReqCtrl.orgs[index];
        var name = org.shortName
            ? org.name + ' (' + org.shortName + ')'
            : org.name;
        ReqCtrl.createRequest.org.typeaheadOptions[name] = org._id;
      }
    }
  });

  if (RequestService.reEditRequest && RequestService.reEditRequestInfo) {
    var targetRequest = RequestService.reEditRequestInfo;

    this.org.value = targetRequest.orgName;
    this.description.value = targetRequest.description;
    this.amount.value = targetRequest.value;
    this.online.value = targetRequest.links.length > 1;
    this.links.array = targetRequest.online;
    this.items.array = targetRequest.specification;
  }


});
