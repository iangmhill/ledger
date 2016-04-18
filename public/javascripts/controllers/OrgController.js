// public/javascripts/controllers/OrgController.js
app.controller('OrgController', function($routeParams, AuthService,
    OrgService, $location, $window, $scope) {

  var OrgCtrl = this;

  this.updateChartWidth = function() {

    if (document.getElementById('budget-chart').parentNode) {
      var width = document.getElementById('budget-chart').parentNode.clientWidth;
      // var width = angular.element(document.querySelector('.tab-content'))[0]
      //     .clientWidth * (2/3);
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
  this.updateChartWidthAndReload = function() {
    OrgCtrl.updateChartWidth();
    $scope.$apply();
  }
  angular.element(document).ready(this.updateChartWidthAndReload);
  angular.element($window).bind('resize', this.updateChartWidthAndReload);

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
  };
  this.generateTypeahead = function() {
    for (index in this.users) {
      this.users[index].typeahead = this.users[index].name + ' (' +
          this.users[index].username + ')';
    }
  };
  this.generateOwnersList = function() {
    this.org.ownersList = this.org.owners.map(function(owner) {
      return owner.name
    }).join(", ");
  };

  AuthService.getUserList().then(function(users) {
    OrgCtrl.users = users;
    OrgCtrl.generateTypeahead();
    OrgService.getOrgByUrl($routeParams.org.toLowerCase()).then(function (res) {
      if (!res.isSuccessful || !res.isAuthorized || !res.org) {
        return $location.path('/manage');
      }
      OrgCtrl.org = res.org;
      OrgCtrl.generateOwnersList();
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
        OrgCtrl.generateOwnersList();
      }
    });
  }

  this.removeOwner = function(index) {
    OrgService.removeOwner(this.org.owners[index].username, this.org._id)
        .then(function(res) {
      if (res.isSuccessful) {
        OrgCtrl.users = OrgCtrl.users.concat(OrgCtrl.org.owners.splice(index, 1));
        OrgCtrl.generateTypeahead();
        OrgCtrl.generateOwnersList();
      }
    });
  }
})