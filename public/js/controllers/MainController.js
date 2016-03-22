app.controller('MainController', function($scope, $location, AuthService) {
  
  $scope.headerRoutes = [{
    name: 'Request',
    path: '/request'
  },{
    name: 'Record',
    path: '/record'
  }];
  $scope.footerRoutes = [{
    name: 'Login',
    path: '/login'
  }];

  this.onPermissionsUpdate = function(permissions) {
    var headerRoutes = [{
      name: 'Request',
      path: '/request'
    },{
      name: 'Record',
      path: '/record'
    }];
    var footerRoutes = [{
      name: 'Login',
      path: '/login'
    }];
    if (permissions.isAuthenticated) {
      footerRoutes = [{
        name: 'Logout',
        path: '/logout'
      }];
      if (permissions.isUser) {
        headerRoutes.push({
          name: 'Search',
          path: '/search'
        });
      }
      if (permissions.isAdmin) {
        headerRoutes.push({
          name: 'Allocate',
          path: '/allocate'
        });
        headerRoutes.push({
          name: 'Manage',
          path: '/manage'
        });
      }
      if (permissions.isOwner) {
        headerRoutes.push({
          name: 'Users',
          path: '/users'
        });
      }
    }

    $scope.headerRoutes = headerRoutes;
    $scope.footerRoutes = footerRoutes;
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