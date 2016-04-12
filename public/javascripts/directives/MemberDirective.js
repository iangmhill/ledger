app.directive('member', function ($compile) {
  return {
      restrict: "E",
      replace: true,
      scope: {
          member: '='
      },
      template: "<li></li>",
      link: function (scope, element, attrs) {
          if (angular.isArray(scope.member.children)) {
              element.append("<collection collection='member.children'></collection>");
              $compile(element.contents())(scope)
          }
      }
  }
})