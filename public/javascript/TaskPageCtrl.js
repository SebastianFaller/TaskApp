angular.module('routingApp').controller('TaskPageCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
    $scope.tasks = [];
    $scope.line = "";
    console.log("Der token ist " + $window.sessionStorage.token);
    $http.post("/gettasks", {
        token: $window.sessionStorage.token
    }).then(function(res) {
        $scope.tasks = res.data;
    }, function(err) {

    });
    $scope.addTask = function() {
        $http.post("/addtask", {
                task: $scope.line
            })
            .then(function(response) {
                $scope.tasks.push($scope.line);
            }, function errorHandling(response) {
                console.log(response);
            });

    };
    $scope.deleteTask = function(task) {
        $http.post("/deletetask", {
            toDelete: task
        }).then(function(response) {
            var i = $scope.tasks.indexOf(task);
            if (i < 0) console.log("not found");
            $scope.tasks.splice(i, 1);
            console.log($scope.tasks);
        }, function errorHandling(response) {
            console.log(response);
        });
    };
}]);