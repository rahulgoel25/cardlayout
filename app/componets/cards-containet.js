'use strict';

app.directive("card-item", ['$compile', '$http', '$templateCache', function ($compile, $http, $templateCache) {
  // Linker function
  var linkHandler = function (scope, elem, attrs) {};
  var controllerHandler = function ($scope, $element) {};
  var compileElement = function (elem, attrs) {
    $http.get(tAttrs.templateUrl, {
      cache: $templateCache
    }).success(function (html) {
      t.Element.html(html);
    });
  };
  var templateHandler = function (contentType) {
    var template = '';
    switch (contentType) {
      case 'test1':
        template = testTemplate1;
        break;
      case 'test2':
        template = testTemplate2;
        break;
      case 'test3':
        template = testTemplate3;
        break;
    }
    return template;
  };
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      content: '='
    },
    link: linkHandler,
    controller: controllerHandler,
    template: templateHandler

  }
}]);
