var app = angular.module('ledger', [
    'ngAnimate',
    'ngMessages',
    'ngRoute',
    'ngTouch',
    'nvd3',
    'ui.bootstrap'
  ]).config([
    '$routeProvider',
    '$locationProvider',
  function($routeProvider, $locationProvider) {

    $routeProvider

      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginController',
        controllerAs: 'LgnCtrl',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.permissionCheck([roles.UNAUTH]);
          }
        }
      })

      .when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'RegisterController',
        controllerAs: 'RegCtrl',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.permissionCheck([roles.UNAUTH]);
          }
        }
      })

      .when('/', {
        templateUrl: 'partials/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'DashCtrl',
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
        controllerAs: 'RecCtrl',
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
        controllerAs: 'MngCtrl',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.permissionCheck([roles.OWNER, roles.ADMIN]);
          }
        }
      })

      .when('/manage/:org/:tab?', {
        templateUrl: 'partials/org.html',
        controller: 'OrgController',
        controllerAs: 'OrgCtrl',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.orgOwnerOnly($route.current.params.org);
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


