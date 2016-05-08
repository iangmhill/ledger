// public/javascripts/controllers/OrgController.js
app.controller('OrgController', function($routeParams, AuthService,
    OrgService, $location, $window, $scope) { // I've usually seen the parameters to an Angular controller alphabetized -- common convention

  var OrgCtrl = this;
  // vv make sure to clear out hardcoded dummy data before you deploy
  this.transfers = [
    { type: 'budget', from: 'SG', to: 'CORe', justification: '', value: 4 },
    { type: 'transfer', from: 'SG', to: 'CORe' , justification: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas cursus venenatis arcu eget laoreet. Pellentesque in consectetur dolor. Nulla facilisi. Proin commodo auctor condimentum. Donec eu mauris id neque dapibus placerat. Mauris luctus urna sit amet mi iaculis eleifend. Nunc id tellus risus. Ut mollis lorem luctus, convallis eros sit amet, eleifend nulla. Integer elit tortor, vulputate quis auctor id, elementum et lectus.', value: 50 }
  ];
  /*
   * Chart properties
   */
  this.updateChartWidth = function() {
    if (document.getElementById('budget-chart').parentNode) {
      var width =
          document.getElementById('budget-chart').parentNode.clientWidth;
      OrgCtrl.options = {
        chart: {
          type: 'pieChart',
          donut: false,
          height: width * .75,
          width: width,
          x: function(d){return d.key;},
          y: function(d){return d.y;},
          showLabels: true,
          duration: 500,
          labelThreshold: 0.01,
          labelSunbeamLayout: false,
          labelsOutside: true,
          valueFormat: function(n) {
            return '$' + n.toFixed(2);
          },
          showLegend: true,
          legend: {
            margin: {
              top: 5,
              right: 35,
              bottom: 5,
              left: 0
            },
            width: width,
            height: 50,
            align: true,
            rightAlign: false,
            vers: 'classic'
          }
        }
      };
    }
  };
  angular.element($window).bind('resize', function() {
    OrgCtrl.updateChartWidth();
    $scope.$apply();
  });
  this.data = [
            {
                key: "CORe",
                y: 9000
            },
            {
                key: "SAC",
                y: 16000
            },
            {
                key: "SERV",
                y: 7000
            },
            {
                key: "CCO",
                y: 19000
            }
        ];
  /*
   * Changing ownership form
   */
  this.ownerForm = {
    value: '',
    isValidated: false,
    isValid: false,
    validate: function() {

    },
    generateTypeahead: function() {
      for (index in OrgCtrl.users) {
        OrgCtrl.users[index].typeahead = OrgCtrl.users[index].name + ' (' +
            OrgCtrl.users[index].username + ')';
      }
    }
  };
  /*
   * Transfer and budget allocation form
   */
  this.allocateForm = {
    isCollapsed: true,
    open: function() {
      this.isCollapsed = false;
      OrgCtrl.requestForm.close();
    },
    resetField: function(field, value) {
      field.value = value;
      field.isValidated = false;
      field.isValid = false;
    },
    amount: {
      value: 0,
      isValidated: false,
      isValid: false,
      helpBlock: '',
      validate: function() {
        this.value = Math.round(this.value * 100) / 100;
        this.isValid = (
          this.value <= (OrgCtrl.org.budget - OrgCtrl.org.allocated) &&
          this.value > 0
        );
        this.helpBlock = this.isValid ? '' : 'The allocation amount must be ' +
            'greater than $0 and less than the org\'s unallocated funds';
        this.isValidated = true;
      }
    },
    to: {
      value: '',
      isValidated: false,
      isValid: false,
      helpBlock: '',
      typeaheadOptions: {},
      validate: function() {
        this.isValid = (this.typeaheadOptions[this.value]);
        this.helpBlock = this.isValid ? '' : 'Funds can only be transfered ' +
            'to other budgeted orgs';
        this.isValidated = true;
      },
      generateTypeahead: function() {
        this.typeaheadOptions = {};
        for (index in OrgCtrl.orgs) {
          var org = OrgCtrl.orgs[index];
          if (org.budgeted && OrgCtrl.org._id != org._id) {
            var name = org.shortName
                ? org.name + ' (' + org.shortName + ')'
                : org.name;
            this.typeaheadOptions[name] = org._id;
          }
        }
      }
    },
    description: {
      value: '',
      isValidated: false,
      isValid: false,
      validate: function() {
        this.isValid = true;
        this.helpBlock = '';
        this.isValidated = true;
      }
    },
    confirm: function() {
      this.amount.validate();
      this.to.validate();
      this.description.validate();
      if (this.amount.isValid &&
          this.to.isValid &&
          this.description.isValid) {
        OrgService.createTransfer(
            this.org._id,
            this.to.typeaheadOptions[this.to.value],
            this.org._id,
            this.amount.value,
            this.justification.value
        ).then(function(response) {
          if (response.isSuccessful) {
            OrgCtrl.requestForm.close();
          }
        })
      }
    },
    close: function() {
      this.isCollapsed = true;
      this.resetField(this.to, '');
      this.resetField(this.description, '');
      this.resetField(this.amount, 0);
    }
  };

  /*
   * Request budget form
   */
  this.requestForm = {
    isCollapsed: true,
    open: function() {
      this.isCollapsed = false;
      OrgCtrl.allocateForm.close();
    },
    resetField: function(field, value) {
      field.value = value;
      field.isValidated = false;
      field.isValid = false;
    },
    amount: {
      value: 0,
      isValidated: false,
      isValid: false,
      helpBlock: '',
      validate: function() {
        this.value = Math.round(this.value * 100) / 100;
        this.isValid = (
          this.value <= (OrgCtrl.org.budget - OrgCtrl.org.allocated) &&
          this.value > 0
        );
        this.helpBlock = this.isValid ? '' : 'The allocation amount must be ' +
            'greater than $0 and less than the org\'s unallocated funds';
        this.isValidated = true;
      }
    },
    justification: {
      value: '',
      isValidated: false,
      isValid: false,
      validate: function() {
        this.isValid = true;
        this.helpBlock = '';
        this.isValidated = true;
      }
    },
    confirm: function() {
      this.amount.validate();
      this.justification.validate();
      if (this.amount.isValid && this.justification.isValid) {
        OrgService.createTransfer(
          this.org._id,
          this.org._id,
          this.org.parent,
          this.amount.value,
          this.justification.value
        ).then(function(response) {
          if (response.isSuccessful) {
            OrgCtrl.requestForm.close();
          }
        })
      }
    },
    close: function() {
      this.isCollapsed = true;
      this.resetField(this.justification, '');
      this.resetField(this.amount, 0);
    }
  };
  this.removeCurrentOwners = function() {
    this.users = this.users.filter(function(user) {
      for (index in OrgCtrl.org.owners) {
        if (user.username == OrgCtrl.org.owners[index].username) {
          return false;
        }
      }
      return true;
    })
  };
  this.generateOwnersList = function() {
    this.org.ownersList = this.org.owners.map(function(owner) {
      return owner.name
    }).join(", ");
  };
  this.addOwner = function() {
    OrgService.addOwner(this.ownerForm.value, this.org._id)
        .then(function(res) {
      if (res.isSuccessful) {
        OrgCtrl.org.owners.push(res.user);
        OrgCtrl.ownerForm.value = '';
        OrgCtrl.ownerForm.isValidated = false;
        OrgCtrl.ownerForm.isValid = false;
        OrgCtrl.removeCurrentOwners();
        OrgCtrl.generateOwnersList();
      }
    });
  };
  this.removeOwner = function(index) {
    OrgService.removeOwner(this.org.owners[index].username, this.org._id)
        .then(function(res) {
      if (res.isSuccessful) {
        OrgCtrl.users = OrgCtrl.users.concat(OrgCtrl.org.owners.splice(index, 1));
        OrgCtrl.ownerForm.generateTypeahead();
        OrgCtrl.generateOwnersList();
      }
    });
  }

  AuthService.getUserList().then(function(users) {
    OrgCtrl.users = users;
    OrgCtrl.ownerForm.generateTypeahead();
    OrgService.getOrgByUrl($routeParams.org.toLowerCase()).then(function (res) {
      if (!res.isSuccessful || !res.isAuthorized || !res.org) {
        return $location.path('/manage');
      }
      OrgCtrl.org = res.org;
      OrgCtrl.generateOwnersList();
      OrgCtrl.removeCurrentOwners();
      OrgService.getOrgList().then(function(orgs) {
        OrgCtrl.orgs = orgs;
        OrgCtrl.allocateForm.to.generateTypeahead();
      });
    })
  });
})
