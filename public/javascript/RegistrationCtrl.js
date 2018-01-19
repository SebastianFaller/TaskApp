angular.module('routingApp').controller('RegistrationCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
    //Sends entered data to server to create new user
    $scope.formSubmit = function() {
        if ($scope.pwd == $scope.repeatPwd) {
            $http.post("https://localhost:8089/registrate/", {
                    name: $scope.name,
                    pwd: $scope.pwd
                })
                .then(function(response) {
                    if (response.data.errorSet.length > 0) {
                        $scope.alertString = response.data.errorSet.pop();
                        $("#serverAlert").fadeIn();
                    } else {
                        $window.location.href = response.data.hlink;
                    }

                }, function errorHandling(response) {
                    console.log("Error " + response);
                });
        } else {
            //Pwds not equal
            $("#notEqualAlert").fadeIn();
        }
    };
}]);