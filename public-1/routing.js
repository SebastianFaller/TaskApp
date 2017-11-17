var routingApp = angular.module('routingApp', ['ngRoute']);

//Define Routing for app
routingApp.config(['$routeProvider',
function($routeProvider){
    $routeProvider.when('/page1', {
        templateUrl: 'Page1.html',
        controller: 'Page1Ctrl'
    }).
    when('/page2', {
        templateUrl: 'Page2.html',
        controller: 'Page2Ctrl'
    }).
    when('/page3', {
        templateUrl: 'Page3.html',
        controller: 'Page3Ctrl'
    }).
    otherwise({
        redirectTo:'/page1'
    });
}]);

routingApp.controller('NavCtrl', ['$scope', function($scope){

}]);

routingApp.controller('Page1Ctrl', ['$scope', function($scope){

}]);

routingApp.controller('Page2Ctrl', ['$scope', function($scope){
    
}]);

routingApp.controller('Page3Ctrl', ['$scope', function($scope){
        
}]);