angular.module('routingApp').controller('TaskPageCtrl', ['$scope', '$rootScope', '$http', '$window', function($scope, $rootScope, $http, $window) {
    $scope.tasks = [];
    $scope.line = "Insert task";
    $scope.lineGroup = "Insert Group";
    $scope.filterGroup = "";

    $http.post("/gettasks", {
        token: $window.sessionStorage.token
    }).then(function(res) {
        console.log(res.data);
        if (res.data.errorSet != null && res.data.errorSet.length > 0) {
            alert(res.data.errorSet.pop());
            $rootScope.loggedUser = "";
            $window.sessionStorage.loggedUser = "";
            $window.location.href = "#!/loginPage";
        } else {
            $scope.tasks = res.data.tasks;
            $scope.showList = $scope.tasks;
            $scope.groupList = $scope.filterDistinct($scope.tasks);
        }
    }, function(err) {

    });
    $scope.addTask = function() {
        newTask = {
            task: $scope.line,
            group: $scope.lineGroup,
            done: false
        };
        $http.post("/addtask", {
                task: newTask,
                token: $window.sessionStorage.token

            })
            .then(function(response) {
                $scope.tasks.push(newTask);
                //Update the filtered groups
                $scope.showGroup($scope.filterGroup);

                console.log("New tasks " + JSON.stringify($scope.tasks));
            }, function errorHandling(response) {
                console.log(response);
            });

    };
    $scope.deleteTask = function(task) {
        console.log("Delet sended with task: " + JSON.stringify(task));
        $http.post("/deletetask", {
            toDelete: task,
            token: $window.sessionStorage.token
        }).then(function(response) {
            var i = $scope.tasks.indexOf(task);
            if (i < 0) console.log("not found");
            $scope.tasks.splice(i, 1);
            //Update the filtered groups
            $scope.showGroup($scope.filterGroup);
            console.log($scope.tasks);
        }, function errorHandling(response) {
            console.log(response);
        });
    };
    $scope.doneTask = function(doneTask) {
        $http.post("/taskdone", {
                task: doneTask,
                token: $window.sessionStorage.token

            })
            .then(function(response) {
                doneTask.done = true;

                console.log("task " + JSON.stringify(doneTask) + " is done!");
            }, function errorHandling(response) {
                console.log(response);
            });
    };

    $scope.showGroup = function(group) {
        if (group == "") {
            $scope.showAllGroups();
        } else {
            $scope.filterGroup = group;
            var newShow = [];
            $scope.tasks.forEach(function(elem, index) {
                if (elem.group == group) {
                    newShow.push(elem);
                }
            });
            $scope.showList = newShow;
        }
    };

    $scope.showAllGroups = function() {
        $scope.showList = $scope.tasks;
        $scope.filterGroup = "";
    };

    $scope.filterDistinct = function(set) {
        checkSet = [];
        set.forEach(function(elem, index) {
            if (!checkSet.includes(elem.group)) {
                checkSet.push(elem.group);
            }
        });
        console.log(JSON.stringify(checkSet));
        return checkSet;
    };
}]);