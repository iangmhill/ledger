// public/javascripts/services/AuthService.js

var roles = {
  UNAUTH: 0,
  USER: 1,
  OWNER: 2,
  ADMIN: 3
};

var routeForUnauthorizedAccess = '/login';
var routeDashboard             = '/';

app.service('AuthService', function($http, $q, $rootScope, $location) {

  this.user = {
    isAuthenticated: false
  };

  this.permissionsUpdateCallbacks = [];

  this.registerPermissionsUpdateCallback = function(callback) {
    var service = this;
    this.permissionsUpdateCallbacks.push(callback);
    if (!this.user.isAuthenticated) {
      this.fetchPermissions().then(function success(response) {
        service.user = response.data;
        callback(service.user);
      })
    } else {
      callback(service.user);
    }
  };

  this.broadcastPermissionsChange = function() {
    var service = this;
    angular.forEach(this.permissionsUpdateCallbacks, function(callback) {
      callback(service.user);
    });
  };

  this.fetchPermissions = function() {
    return $http.get('/api/getUserPermissions');
  };

  this.login = function(credentials) {
    var service = this;
    var deferred = $q.defer();
    $http.post('/login', credentials).then(function success(response) {
      service.fetchPermissions().then(function success(response) {
        service.user = response.data;
        service.broadcastPermissionsChange();
        if (service.user.isAuthenticated) {
          $location.path('/');
        }
        deferred.resolve(service.user.isAuthenticated);
      });
    });
    return deferred.promise;
  };

  this.logout = function() {
    var service = this;
    $http.get('/logout').then(function success(response) {
      service.fetchPermissions().then(function success(response) {
        service.user = response.data;
        service.broadcastPermissionsChange();
        if (!service.user.isAuthenticated) {
          $location.path(routeForUnauthorizedAccess);
        }
      });
    });
  };

  this.permissionCheck = function(validRoles) {
    var deferred = $q.defer();
    var service = this;

    if (this.user.isAuthenticated) {
      this.evaluatePermissions(this.user, validRoles, deferred);
    } else {
      this.fetchPermissions().then(function success(response) {
        service.user = response.data;
        service.evaluatePermissions(service.user, validRoles, deferred);
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

  this.evaluatePermissions = function(user, validRoles, deferred) {
    var ifPermissionPassed = false;

    angular.forEach(validRoles, function (role) {
      switch (role) {
        case roles.UNAUTH:
          if (!user.isAuthenticated) {
            ifPermissionPassed = true;
          }
          break;
        case roles.USER:
          if (user.isAuthenticated) {
            ifPermissionPassed = true;
          }
          break;
        case roles.OWNER:
          if (user.orgs.length > 0) {
            ifPermissionPassed = true;
          }
          break;
        case roles.ADMIN:
          if (user.isAdmin) {
            ifPermissionPassed = true;
          }
          break;
        default:
          ifPermissionPassed = false;
      }
    });
    if (!ifPermissionPassed) {
      if (user.isAuthenticated) {
        $location.path(routeDashboard);
      } else {
        $location.path(routeForUnauthorizedAccess);
      }
      $rootScope.$on('$locationChangeSuccess', function (next, current) {
          deferred.resolve();
      });
    } else {
      deferred.resolve();
    }
  };

  this.changeEmail = function(newEmail) {
    var service = this;
    var deferred = $q.defer();
    $http.post('/changeEmail', {
      newEmail: newEmail
    }).then(function success(response) {
      service.user = response.data;
      service.broadcastPermissionsChange();
      deferred.resolve(service.user.email == newEmail);
    });
    return deferred.promise;
  };

  this.changePassword = function(password, newPassword) {
    var deferred = $q.defer();
    $http.post('/changePassword', {
      password: password,
      newPassword: newPassword
    }).then(function success(response) {
      deferred.resolve(response.data);
    });
    return deferred.promise;
  };

  this.changeName = function(newName) {
    var service = this;
    var deferred = $q.defer();
    $http.post('/changeName', {
      newName: newName
    }).then(function success(response) {
      service.user = response.data;
      service.broadcastPermissionsChange();
      deferred.resolve(service.user.name == newName);
    });
    return deferred.promise;
  };

  this.register = function(user) {
    var deferred = $q.defer();
    $http.post('/register', user).then(function(response) {
      deferred.resolve(response.data);
    });
    return deferred.promise;
  };

  this.checkUniqueUsername = function(username) {
    var deferred = $q.defer();
    $http.post('/checkUniqueUsername', {
      username: username
    }).then(function success(response) {
      deferred.resolve(response.data.isUnique);
    });
    return deferred.promise;
  };

});