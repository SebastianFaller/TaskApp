var routingApp = angular.module('routingApp', ['ngRoute']);

//Define Routing for app
routingApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/taskPage', {
            templateUrl: 'taskPage.html',
            controller: 'TaskPageCtrl'
        }).
        when('/loginPage', {
            templateUrl: 'login.html',
            controller: 'LoginCtrl'
        }).
        when('/page3', {
            templateUrl: 'registration.html',
            controller: 'RegistrationCtrl'
        }).
        otherwise({
            redirectTo: '/taskPage'
        });
    }
]);

routingApp.controller('NavCtrl', ['$scope', function($scope) {

}]);