var app = angular.module('ledger', [
    'ngRoute',
    'ngAnimate',
    'ngTouch',
    'ui.bootstrap'
  ]).config([
    '$routeProvider',
    '$locationProvider',
  function($routeProvider, $locationProvider) {

    $routeProvider

      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginController',
        controllerAs: 'LgnCtrl'
      })

      .when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignupController',
        controllerAs: 'SgnpCtrl'
      })

      .when('/', {
        templateUrl: 'partials/dashboard.html',
        controller: 'DashboardController',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.permissionCheck([roles.USER]);
          }
        }
      })

      .when('/request', {
        templateUrl: 'partials/request.html',
        controller: 'RequestController',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.permissionCheck([roles.USER]);
          }
        }
      })

      .when('/record', {
        templateUrl: 'partials/record.html',
        controller: 'RecordController',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.permissionCheck([roles.USER]);
          }
        }
      })

      .when('/search', {
        templateUrl: 'partials/search.html',
        controller: 'SearchController',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.permissionCheck([roles.OWNER]);
          }
        }
      })

      .when('/manage', {
        templateUrl: 'partials/manage.html',
        controller: 'ManageController',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.permissionCheck([roles.OWNER, roles.ADMIN]);
          }
        }
      })

      .when('/account', {
        templateUrl: 'partials/account.html',
        controller: 'AccountController',
        controllerAs: 'AccCtrl',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.permissionCheck([roles.USER]);
          }
        }
      })

      .when('/logout', {
        resolve: {
          authentication: function(AuthService, $route) {
            return AuthService.logout();
          }
        }
      });

    $locationProvider.html5Mode(true);

}]).controller('NavigationCtrl', function($scope, $location) {
  $scope.isActive = function (viewLocation) { 
    return viewLocation === $location.path();
  };
  var vm = this;
  vm.isCollapsed = true;
  vm.toggleCollapse = function() {
    vm.isCollapsed = !vm.isCollapsed;
  };
  vm.hideMenu = function() {
    vm.isCollapsed = true;
  };
});


