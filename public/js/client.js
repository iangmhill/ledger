var app = angular.module('ledger', [
    'ngRoute',
    'ngMaterial'
  ]).config([
    '$routeProvider',
    '$locationProvider',
  function($routeProvider, $locationProvider) {

    $routeProvider

      // summary landing page
      .when('/', {
        templateUrl: 'partials/summary.html',
        controller: 'SummaryController'
      })

      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginController'
      })

      .when('/request', {
        templateUrl: 'partials/request.html',
        controller: 'RequestController'
      })

      .when('/record', {
        templateUrl: 'partials/record.html',
        controller: 'RecordController'
      })

      .when('/search', {
        templateUrl: 'partials/search.html',
        controller: 'SearchController',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.permissionCheck([roles.user]);
          }
        }
      })

      .when('/allocate', {
        templateUrl: 'partials/allocate.html',
        controller: 'AllocateController',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.permissionCheck([roles.admin]);
          }
        }
      })

      .when('/manage', {
        templateUrl: 'partials/manage.html',
        controller: 'ManageController',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.permissionCheck([roles.admin]);
          }
        }
      })

      .when('/users', {
        templateUrl: 'partials/users.html',
        controller: 'UserController',
        resolve: {
          permission: function(AuthService, $route) {
            return AuthService.permissionCheck([roles.owner]);
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

}])