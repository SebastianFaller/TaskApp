var routingApp = angular.module('routingApp', ['ngRoute']);

//Define Routing for app
routingApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/taskPage', {
            templateUrl: 'TaskPage.html',
            controller: 'TaskPageCtrl'
        }).
        when('/loginPage', {
            templateUrl: 'Login.html',
            controller: 'LoginCtrl'
        }).
        when('/page3', {
            templateUrl: 'Page3.html',
            controller: 'Page3Ctrl'
        }).
        otherwise({
            redirectTo: '/taskPage'
        });
    }
]);

routingApp.controller('NavCtrl', ['$scope', function($scope) {

}]);

routingApp.controller('Page3Ctrl', ['$scope', 'ComputeService', function($scope, ComputeService) {
    $scope.compe = function() {
        $scope.resPage3 =
            ComputeService.addNumber($scope.val1, $scope.val2);
    };
}]);