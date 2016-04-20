// public/javascripts/controllers/ManageController.js
app.controller('ManageController', function(AuthService, OrgService) {
  var MngCtrl = this;
  // Initialization
  this.roots = [];
  this.orgs = {};
  this.pendingUsers = [];
  this.approvalProcessOptions = ['strict','onlyone','none'];
  this.alert = {
    isActive: false,
    type:'',
    msg:''
  };

  this.updateChildren = function() {
    var children = {};
    angular.forEach(this.orgs, function(org, parentId) {
      children[parentId] = [];
      for (childId in MngCtrl.orgs) {
        if (MngCtrl.orgs[childId].parent == parentId) {
          children[parentId].push(childId);
        }
      }
    });
    this.children = children;
  };

  this.updateTypeaheadOptions = function() {
    this.typeaheadOptions = {};
    angular.forEach(this.orgs, function(org, id) {
      if (org.nonterminal) {
        var name = (org.shortName ?
            '' + org.name + ' (' + org.shortName + ')' : '' + org.name);
        MngCtrl.typeaheadOptions[name] = id;
      }
    });
  };
  this.updateOrgs = function() {
    for (id in this.orgs) {
      this.orgs[id].ownersList = this.orgs[id].owners.map(function(owner) {
        return owner.name
      }).join(", ");
    }
    this.updateChildren();
    this.updateTypeaheadOptions();
  };

  this.createOrg = {
    isCollapsed: true,
    name: {
      value: '',
      isValidated: false,
      isValid: true,
      helpBlock: '',
      validate: function() {
        if (typeof this.value === 'string' && this.value.length > 0) {
          this.isValid = true;
          this.helpBlock = '';
        } else {
          this.isValid = false;
          this.helpBlock = 'Organization name cannot be empty';
        }
        this.isValidated = true;
      }
    },
    shortName: {
      value: '',
      isValidated: false,
      isValid: true,
      helpBlock: '',
      validate: function() {
        if (typeof this.value === 'string') {
          this.isValid = true;
          this.helpBlock = '';
        } else {
          this.isValid = false;
          this.helpBlock = 'Organization short name must be a string';
        }
        this.isValidated = true;
      }
    },
    parent: {
      value: '',
      isValidated: false,
      isValid: true,
      helpBlock: '',
      validate: function() {
        if (MngCtrl.typeaheadOptions[this.value]) {
          this.isValid = true;
          this.helpBlock = '';
        } else {
          this.isValid = false;
          this.helpBlock = 'Invalid parent organization';
        }
        this.isValidated = true;
      }
    },
    budgeted: {
      value: false
    },
    nonterminal: {
      value: false
    },
    approvalProcess: {
      value: MngCtrl.approvalProcessOptions[0],
      isValidated: false,
      isValid: true,
      helpBlock: '',
      validate: function() {
        if (typeof this.value === 'string' &&
            MngCtrl.approvalProcessOptions.indexOf(this.value) > -1) {
          this.isValid = true;
          this.helpBlock = '';
        } else {
          this.isValid = false;
          this.helpBlock = 'Invalid approval process option';
        }
        this.isValidated = true;
      }
    },
    submitCreateOrg: function() {
      var createOrg = this;
      OrgService.createOrg({
        name: this.name.value,
        shortName: this.shortName.value,
        org: MngCtrl.typeaheadOptions[this.parent.value],
        budgeted: this.budgeted.value,
        budget: 0,
        nonterminal: this.nonterminal.value,
        approvalProcess: this.approvalProcess.value
      }).then(function(response) {
        if (response.isSuccessful) {
          createOrg.closeCreateOrg();
          MngCtrl.orgs[response.org._id] = response.org;
          MngCtrl.updateOrgs();
        }
      })
    },
    closeCreateOrg: function() {
      this.isCollapsed = true;

      this.name.value = '';
      this.name.isValidated = false;
      this.name.isValid = true;
      this.name.helpBlock = '';

      this.shortName.value = '';
      this.shortName.isValidated = false;
      this.shortName.isValid = true;
      this.shortName.helpBlock = '';

      this.parent.value = '';
      this.parent.isValidated = false;
      this.parent.isValid = true;
      this.parent.helpBlock = '';

      this.budgeted.value = false;

      this.nonterminal.value = false;

      this.approvalProcess.value = '';
      this.approvalProcess.isValidated = false;
      this.approvalProcess.isValid = true;
      this.approvalProcess.helpBlock = '';
    }
  };
  this.resolveUser = function(index, isApproved) {
    AuthService.resolveUser(this.pendingUsers[index], isApproved).then(function(response) {
      MngCtrl.alert.isActive = true;
      MngCtrl.alert.type = response.isSuccessful ? 'success' : 'danger';
      MngCtrl.alert.msg = (response.isSuccessful ? 'SUCCESS' : 'FAILURE') +
          ' ' + MngCtrl.pendingUsers[index].username + (isApproved ? ' approved' : ' rejected');
      if (response.isSuccessful) {
        MngCtrl.pendingUsers.splice(index, 1);
      }
    });
  };


  AuthService.getPendingUsers().then(function(pendingUsers) {
    MngCtrl.pendingUsers = pendingUsers || [];
  });
  OrgService.getUserOrgs().then(function(response) {
    var checkRoot = function(tree, roots, rootToCheck) {
      if (roots.indexOf(rootToCheck) > -1) { return false; }
      return tree[rootToCheck].parent
          ? checkRoot(tree, roots, tree[rootToCheck].parent)
          : true;
    }
    MngCtrl.roots = response.roots.filter(function(root) {
      var roots = response.roots.slice(0);
      roots.splice(roots.indexOf(root),1);
      console.log(response.roots);
      return checkRoot(response.orgs, roots, root);
    });
    MngCtrl.orgs = response.orgs;
    MngCtrl.updateOrgs();
  });
}).filter('search', function() {
  return function(input, search) {
    if (!input) return input;
    if (!search) return input;
    var expected = ('' + search).toLowerCase();
    var result = [];
    angular.forEach(input, function(id, name) {
      if (name.toLowerCase().indexOf(expected) !== -1) {
        result.push(name);
      }
    });
    return result;
  }
});