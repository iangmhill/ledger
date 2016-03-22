// public/js/services/AuthService.js

var roles = {
  owner: 0,
  admin: 1,
  user: 2
};

var routeForUnauthorizedAccess = '/login';

app.service('AuthService', function($http, $q, $rootScope, $location) {

  this.userPermissions = {
    permissions: {},
    isPermissionLoaded: false
  };

  this.permissionsUpdateCallbacks = [];

  this.registerPermissionsUpdateCallback = function(callback) {
    var service = this;
    this.permissionsUpdateCallbacks.push(callback);
    if (!this.userPermissions.isPermissionLoaded) {
      this.fetchPermissions().then(function success(response) {
        service.userPermissions.permissions = response.data;
        service.userPermissions.isPermissionLoaded = true;
        callback(service.userPermissions.permissions);
      })
    } else {
      callback(service.userPermissions.permissions);
    }
  };

  this.broadcastPermissionsChange = function() {
    for (var i = 0; i < this.permissionsUpdateCallbacks.length; i++) {
      this.permissionsUpdateCallbacks[i](this.userPermissions.permissions);
    }
  };

  this.fetchPermissions = function() {
    return $http.get('/api/getUserPermissions');
  };

  this.login = function(credentials) {
    var service = this;
    $http.post('/login', credentials).then(function success(response) {
      service.fetchPermissions().then(function success(response) {
        service.userPermissions.permissions = response.data;
        service.userPermissions.isPermissionLoaded = true;
        service.broadcastPermissionsChange();
      })
      $location.path('/');
    });
  };

  this.logout = function() {
    var service = this;
    $http.get('/logout').then(function success(response) {
      service.fetchPermissions().then(function success(response) {
        service.userPermissions.permissions = response.data;
        service.userPermissions.isPermissionLoaded = true;
        service.broadcastPermissionsChange();
      })
      $location.path('/');
    });
  };

  this.createAccount = function(credentials) {
    var confirmation = $q.defer();
    $http.post('/signup', credentials);
  };

  this.permissionCheck = function(validRoles) {
    var deferred = $q.defer();
    var service = this;

    if (this.userPermissions.isPermissionLoaded) {
      this.evaluatePermissions(this.userPermissions, validRoles, deferred);
    } else {
      this.fetchPermissions().then(function success(response) {
        service.userPermissions.permissions = response.data;
        service.userPermissions.isPermissionLoaded = true;
        service.evaluatePermissions(service.userPermissions, validRoles, deferred);
        service.broadcastPermissionsChange();
      }, function error(response) {
        if (response.status == 401) {
          $location.path(routeForUnauthorizedAccess);
          $rootScope.$on('$locationChangeSuccess', function (next, current) {
              deferred.resolve();
          });
        }
      });
    }
    return deferred.promise;
  };

  this.evaluatePermissions = function(userPermissions, validRoles, deferred) {
    var ifPermissionPassed = false;

    angular.forEach(validRoles, function (role) {
      switch (role) {
        case roles.owner:
          if (userPermissions.permissions.isOwner) {
            ifPermissionPassed = true;
          }
          break;
        case roles.admin:
          if (userPermissions.permissions.isAdmin) {
            ifPermissionPassed = true;
          }
          break;
        case roles.user:
          if (userPermissions.permissions.isUser) {
            ifPermissionPassed = true;
          }
          break;
        default:
          ifPermissionPassed = false;
      }
    });
    if (!ifPermissionPassed) {
      $location.path(routeForUnauthorizedAccess);
      $rootScope.$on('$locationChangeSuccess', function (next, current) {
          deferred.resolve();
      });
    } else {
      deferred.resolve();
    }
  };

});