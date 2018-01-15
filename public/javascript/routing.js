var routingApp = angular.module('routingApp', ['ngRoute']);

//Define Routing for app
routingApp.config(['$routeProvider',
    function($routeProvider) {
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
            redirectTo: '/page1'
        });
    }
]);

routingApp.controller('NavCtrl', ['$scope', function($scope) {

}]);

routingApp.controller('Page1Ctrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
    $scope.tasks = [];
    $scope.line = "";
    console.log("Der token ist "+$window.sessionStorage.token);
    $http.post("/gettasks", {token: $window.sessionStorage.token}).then(function(res){
        $scope.tasks = res.data;
    }, function(err){

    });
    $scope.addTask = function() {
        $http.post("/addtask", {task : $scope.line})
            .then(function(response) {
                $scope.tasks.push($scope.line);
            }, function errorHandling(response){
                console.log(response);
            });

    };
    $scope.deleteTask = function(task){
        $http.post("/deletetask", {toDelete: task}).then(function(response){
            var i = $scope.tasks.indexOf(task);
            if(i < 0) console.log("not found");
            $scope.tasks.splice(i,1);
            console.log($scope.tasks);
        }, function errorHandling(response){
            console.log(response);
        }); 
    };
}]);

routingApp.controller('Page2Ctrl', ['$scope', function($scope) {

}]);

routingApp.controller('Page3Ctrl', ['$scope', 'ComputeService', function($scope, ComputeService) {
    $scope.compe = function() {
        $scope.resPage3 =
            ComputeService.addNumber($scope.val1, $scope.val2);
    };
}]);