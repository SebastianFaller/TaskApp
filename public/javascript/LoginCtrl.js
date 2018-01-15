angular.module('routingApp').controller('LoginCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
    $scope.formSubmit = function() {
        $http.post("https://localhost:8089/login/", {
                name: $scope.name,
                pwd: $scope.pwd
            })
            .then(function(response) {
                console.log("Hallo" + response.data.success);
                if (!response.data.success) {
                    //erase token if login failed
                    delete $window.sessionStorage.token;
                    $("#alert").fadeIn();
                } else {
                    //save token
                    $window.sessionStorage.token = response.data.token;
                    console.log("Empfangener token: " + $window.sessionStorage.token);
                    //go to taskpage
                    $window.location.href = response.data.hlink;
                }

            }, function errorHandling(response) {
                console.log("Error " + response);
            });
    };
}]);