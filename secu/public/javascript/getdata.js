var getDataApp = angular.module('getDataApp', []);

getDataApp.controller('getDataCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.load = function() {
        $http.post('/GetData').then(function (data) {
                $scope.myData = data.data.dataFromServer;
        });
    };
    $scope.load();
}]);