angular.module('routingApp').controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$window', function($scope, $rootScope, $http, $window) {
    //When entering the login Page, always log out.
    delete $window.sessionStorage.token;
    $rootScope.loggedUser = "";

    $scope.formSubmit = function() {
        $http.post("https://localhost:8089/login/", {
                name: $scope.name,
                pwd: $scope.pwd
            })
            .then(function(response) {
                console.log("Hallo" + response.data.success);
                if (!response.data.success) {
                    //erase token if login failed and clear navbar username
                    delete $window.sessionStorage.token;
                    $rootScope.loggedUser = "";
                    $("#alert").fadeIn();
                } else {
                    //save token
                    $window.sessionStorage.token = response.data.token;
                    $rootScope.loggedUser = $scope.name;
                    console.log("Empfangener token: " + $window.sessionStorage.token);
                    //go to taskpage
                    $window.location.href = response.data.hlink;
                }

            }, function errorHandling(response) {
                console.log("Error " + response);
            });
    };
}]);