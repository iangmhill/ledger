// public/javascripts/controllers/OrgController.js
app.controller('OrgController', function($routeParams, AuthService,
    OrgService, $location) {

  var OrgCtrl = this;
  this.addOwner = {
    value: '',
    isValidated: false,
    isValid: false,
    validate: function() {

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
  }
  this.generateTypeahead = function() {
    for (index in this.users) {
      this.users[index].typeahead = this.users[index].name + ' (' +
          this.users[index].username + ')';
    }
  }

  AuthService.getUserList().then(function(users) {
    OrgCtrl.users = users;
    OrgCtrl.generateTypeahead();
    OrgService.getOrgByUrl($routeParams.org.toLowerCase()).then(function (res) {
      if (!res.isSuccessful || !res.isAuthorized || !res.org) {
        return $location.path('/manage');
      }
      OrgCtrl.org = res.org;
      OrgCtrl.removeCurrentOwners();
    })
  })


  this.addOwner = function() {
    OrgService.addOwner(this.addOwner.value, this.org._id)
        .then(function(res) {
      if (res.isSuccessful) {
        OrgCtrl.org.owners.push(res.user);
        OrgCtrl.addOwner.value = '';
        OrgCtrl.addOwner.isValidated = false;
        OrgCtrl.addOwner.isValid = false;
        OrgCtrl.removeCurrentOwners();
      }
    });
  }

  this.removeOwner = function(index) {
    OrgService.removeOwner(this.org.owners[index].username, this.org._id)
        .then(function(res) {
      if (res.isSuccessful) {
        OrgCtrl.users = OrgCtrl.users.concat(OrgCtrl.org.owners.splice(index, 1));
        OrgCtrl.generateTypeahead();
      }
    });
  }
})