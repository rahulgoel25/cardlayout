// card layout 
var app = angular.module("cardlayout", []);

app.config(function ($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['self', '**']);
});
app.constant('URL', 'data/');

app.run(function ($templateCache, $http, URL) {
  $http.get(URL + 'templates.json').then(function (response) {
    $templateCache.put('Templates', response);
  })
});


app.factory('DataService', function ($http, URL) {
  var getData = function () {
    return $http.get(URL + 'content.json');
  };

  return {
    getData: getData
  };
});

app.factory('TemplateService', function ($q, $templateCache) {
  var getTemplates = function () {
    let defer = $q.defer();
    if ($templateCache.get('Templates') !== undefined)
      defer.resolve($templateCache.get('Templates'));
    else
      defer.reject('Oops... something went wrong');
    return defer.promise;
  };

  return {
    getTemplates: getTemplates
  };
});


app.controller('ContentCtrl', ['$scope', 'DataService', '$window', function ($scope, DataService, $window) {
  var ctrl = this;

  ctrl.content = [];

  ctrl.fetchContent = function () {
    DataService.getData().then(function (result) {
      ctrl.content = result.data;
    });
  };
  $(window).on('load', function () {
    var container = $('.container');
    container.masonry({
      // options
      itemSelector: '.card',
      isAnimated: true,
      animationOptions: {
        duration: 400
      }
    });
  });

  ctrl.fetchContent();
}]);

app.directive('contentItem', function ($compile, TemplateService, $templateCache) {
  var getTemplate = function (templates, contentType) {
    var template = '';

    switch (contentType) {
      case 'activity':
        template = templates.activityTemplate;
        break;
      case 'lesson_plan':
        template = templates.lesson_planTemplate;
        break;
      case 'blog_post':
        template = templates.blog_postTemplate;
        break;
    }

    return template;
  };

  var linker = function (scope, element, attrs) {
    scope.rootDirectory = 'images/';

    TemplateService.getTemplates().then(function (response) {
      var templates = response.data;

      element.html(getTemplate(templates, scope.content.content_type));
      element.addClass("card");
      $compile(element.contents())(scope);
    });
  };

  return {
    restrict: 'E',
    replace: true,
    link: linker,
    scope: {
      content: '='
    }
  };
});
