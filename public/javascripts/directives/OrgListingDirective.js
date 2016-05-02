app.directive('listing', function ($compile) {
  return {
    restrict: "E",
    replace: true,
    scope: {
      directory: '=',
      parent: '=',
      children: '='
    },
    template: (
      '<div class="org">' +
        '<div class="org-header">' +
          '<div class="org-name">' +
            '<div class="">' +
              '<a ng-href="/manage/{{directory[parent].url}}"> {{ directory[parent].name }}</a>' +
            '</div>' +
            '<div class="subtext">' +
              '{{ directory[parent].ownersList }}' +
            '</div>' +
          '</div>' +
          '<div ng-if="directory[parent].budgeted" class="org-highlights">' +
            '<div class="org-highlight">' +
              '{{ "$" + directory[parent].budget.toFixed(2).toString() }}' +
            '</div>' +
            '<div class="org-highlight">' +
              '{{ "$" + directory[parent].spent.toFixed(2).toString() }}' +
            '</div>' +
            '<div class="org-highlight">' +
              '{{ "$" + directory[parent].remaining.toFixed(2).toString() }}' +
            '</div>' +
          '</div>' +
          '<div ng-if="!directory[parent].budgeted" class="org-highlights">' +
            '<div class="org-highlight">' +
              '{{ "Not budgeted" }}' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    ),
    link: function (scope, element, attrs) {
      scope.$watch('children', function() {
        if (scope.children[scope.parent].length > 0) {
          element.append("<listing ng-repeat='child in children[parent]' directory='directory' parent='child' children='children'></listing>");
          $compile(element.contents())(scope)
        }
      })
    }
  }
})