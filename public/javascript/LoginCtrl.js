angular.module('routingApp').controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$window', function($scope, $rootScope, $http, $window) {
    //Submits the enterd user data to the server and handles response
    $scope.formSubmit = function() {
        $http.post("https://localhost:8089/login/", {
                name: $scope.name,
                pwd: $scope.pwd
            })
            .then(function(response) {
                if (!response.data.success) {
                    //erase token if login failed and clear navbar username
                    delete $window.sessionStorage.token;
                    $rootScope.loggedUser = "";
                    $window.sessionStorage.loggedUser = "";
                    $("#alert").fadeIn();
                } else {
                    //save token
                    $window.sessionStorage.token = response.data.token;
                    //Set navbar user
                    $rootScope.loggedUser = $scope.name;
                    $window.sessionStorage.loggedUser = $scope.name;
                    //go to taskpage
                    $window.location.href = response.data.hlink;
                }

            }, function errorHandling(response) {
                console.log("Error " + response);
            });
    };
}]);