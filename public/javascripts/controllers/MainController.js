app.controller('MainController', function($scope, $location, AuthService) {
  var MainCtrl = this;

  this.user = {
    isAuthenticated: false
  };
  this.navRoutes = [];
  this.authRoutes = [{
    name: 'Login',
    path: '/login'
  }];

  this.onPermissionsUpdate = function(user) {
    MainCtrl.user = user;
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
          name: 'Search',
          path: '/search'
        });
      }
      if (user.isAdmin || user.orgs.length > 0) {
        navRoutes.push({
          name: 'Manage',
          path: '/manage'
        });
      }
    }

    MainCtrl.navRoutes = navRoutes;
    MainCtrl.authRoutes = authRoutes;
  };

  this.getClass = function(path) {
    if ($location.path().substr(0, path.length) === path) {
      return 'active';
    } else {
      return '';
    }
  }

  AuthService.registerPermissionsUpdateCallback(this.onPermissionsUpdate);

});