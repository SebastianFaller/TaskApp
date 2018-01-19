angular.module('routingApp').controller('TaskPageCtrl', ['$scope', '$rootScope', '$http', '$window', function($scope, $rootScope, $http, $window) {
    $scope.tasks = [];
    $scope.line = "Insert task";
    $scope.lineGroup = "Insert Group";
    $scope.filterGroup = "";

    //Sends server message to retrive all stored tasks of a user
    $http.post("/gettasks", {
        token: $window.sessionStorage.token
    }).then(function(res) {
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

    //Sends server message to delete
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

            }, function errorHandling(response) {
                console.log(response);
            });

    };

    //Sends server message to delete a task
    $scope.deleteTask = function(task) {
        $http.post("/deletetask", {
            toDelete: task,
            token: $window.sessionStorage.token
        }).then(function(response) {
            var i = $scope.tasks.indexOf(task);
            //if (i < 0) console.log("not found");
            $scope.tasks.splice(i, 1);
            //Update the filtered groups
            $scope.showGroup($scope.filterGroup);
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

            }, function errorHandling(response) {
                console.log(response);
            });
    };

    //Prints only the tasks of the given group
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

    //Prints all task without regard to group
    $scope.showAllGroups = function() {
        $scope.showList = $scope.tasks;
        $scope.filterGroup = "";
    };

    //Filters grouplist to get only distinct values
    $scope.filterDistinct = function(set) {
        checkSet = [];
        set.forEach(function(elem, index) {
            if (!checkSet.includes(elem.group)) {
                checkSet.push(elem.group);
            }
        });
        return checkSet;
    };
}]);