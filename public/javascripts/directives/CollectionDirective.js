app.directive('collection', function () {
  return {
      restrict: "E",
      replace: true,
      scope: {
          collection: '='
      },
      template: "<ul><member ng-repeat='member in collection' member='member'></member></ul>"
  }
})