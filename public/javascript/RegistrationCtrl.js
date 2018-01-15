angular.module('routingApp').controller('RegistrationCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
    $scope.formSubmit = function() {
        //TODO check if this is valid js
        if ($scope.pwd == $scope.repeatPwd) {
            console.log($scope.pwd);
            console.log($scope.repeatPwd);
            $http.post("https://localhost:8089/registrate/", {
                    name: $scope.name,
                    pwd: $scope.pwd
                })
                .then(function(response) {
                    console.log(response.data.errorSet);
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