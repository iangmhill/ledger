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
      // summary landing page
      .when('/', {
        templateUrl: 'partials/summary.html',
        controller: 'SummaryController',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.permissionCheck([roles.USER]);
          }
        }
      })

      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginController'
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

      .when('/allocate', {
        templateUrl: 'partials/allocate.html',
        controller: 'AllocateController',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.permissionCheck([roles.USER, roles.OWNER]);
          }
        }
      })

      .when('/manage', {
        templateUrl: 'partials/manage.html',
        controller: 'ManageController',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.permissionCheck([roles.USER, roles.OWNER]);
          }
        }
      })

      .when('/admin', {
        templateUrl: 'partials/admin.html',
        controller: 'AdminController',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.permissionCheck([roles.USER, roles.ADMIN]);
          }
        }
      })

      .when('/account', {
        templateUrl: 'partials/account.html',
        controller: 'AccountController',
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
  vm.toggleCollapse = toggleCollapse;

  function toggleCollapse() {
      vm.isCollapsed = !vm.isCollapsed;
  }
});


