app.controller('MainController', function($scope, $location, AuthService) {
  
  $scope.user = {
    isAuthenticated: false
  };
  $scope.navRoutes = [];
  $scope.authRoutes = [{
    name: 'Login',
    path: '/login'
  }];

  this.onPermissionsUpdate = function(user) {
    $scope.user = user;
    var navRoutes = [];
    var authRoutes = [{
      name: 'Login',
      path: '/login'
    }];
    if (user.isAuthenticated) {
      authRoutes = [{
        name: 'Account',
        path: '/account'
      }];
      navRoutes.push({
        name: 'Request',
        path: '/request'
      });
      navRoutes.push({
        name: 'Record',
        path: '/record'
      });
      if (user.orgs.length > 0) {
        navRoutes.push({
          name: 'Allocate',
          path: '/allocate'
        });
        navRoutes.push({
          name: 'Manage',
          path: '/manage'
        });
      }
      if (user.isAdmin) {
        navRoutes.push({
          name: 'Admin',
          path: '/admin'
        });
      }
    }

    $scope.navRoutes = navRoutes;
    $scope.authRoutes = authRoutes;
  };

  $scope.getClass = function(path) {
    if ($location.path().substr(0, path.length) === path) {
      return 'active';
    } else {
      return '';
    }
  }

  AuthService.registerPermissionsUpdateCallback(this.onPermissionsUpdate);

});