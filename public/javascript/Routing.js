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
        when('/registrationPage', {
            templateUrl: 'registration.html',
            controller: 'RegistrationCtrl'
        }).
        otherwise({
            redirectTo: '/loginPage'
        });
    }
]);

routingApp.controller('NavCtrl', ['$scope', '$rootScope', '$window', function($scope, $rootScope, $window) {
    //Initialize navbar user. 
    $rootScope.loggedUser = $window.sessionStorage.loggedUser;

    $scope.logout = function() {
        $rootScope.loggedUser = "";
        $window.sessionStorage.loggedUser = "";
        delete $window.sessionStorage.token;
        $window.location.href = "#!/loginPage";
    };

}]);