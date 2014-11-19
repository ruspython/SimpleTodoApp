(function () {
    'use strict';

    var TodoApp = angular.module('Todo', ["ngCookies", "ngResource"]).config(function ($interpolateProvider) {
        $interpolateProvider.startSymbol('[[').endSymbol(']]');
    }).run(function ($http, $cookies) {
        $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken || document.getElementsByName('csrfmiddlewaretoken')[0];
    });
    ;


    TodoApp.controller('TodoCtrl', function ($scope, todoFactory, todoService) {
        $scope.todos = [];


        loadRemoteData();

        $scope.addTodo = function () {
            if ($scope.newTodo) {
                todoService.addTodo($scope.newTodo)
                    .then(function () {
                        $scope.newTodo = "";
                        loadRemoteData();
                    },
                    function (errorMessage) {
                        console.warn(errorMessage);
                    });
            }
        };


        $scope.edit = function (todo) {
            var desc = prompt("New value", todo.desc);
            if (desc) {
                todoService.editTodo(todo.id, desc).then(loadRemoteData);
            }
        };

        $scope.doUndo = function (todo) {
            todoService.doUndoTodo(todo.id).then(loadRemoteData);
        };

        $scope.delete = function (todo) {
            todoService.removeTodo(todo.id).then(loadRemoteData);
        };

        $scope.clearDone = function () {
            todoService.clearDone().then(loadRemoteData);
        };


        function loadRemoteData() {
            $scope.todos = todoFactory.queryAll();
        }
    });

// -------------------------------------------------- //
// -------------------------------------------------- //

    TodoApp.factory('todoFactory', function ($resource) {
        return $resource('/api/todo/:todoId//', {}, {
            queryAll: {method: 'GET', isArray: true}
        });
    });

// -------------------------------------------------- //
// -------------------------------------------------- //


    TodoApp.service(
        "todoService",
        function ($http, $q) {
            return({
                addTodo: addTodo,
                removeTodo: removeTodo,
                editTodo: editTodo,
                doUndoTodo: doUndoTodo,
                clearDone: clearDone
            });

            function addTodo(desc) {
                var request = $http({
                    method: 'post',
                    url: 'api/add/',
                    data: {
                        desc: desc
                    }
                });
                return(request.then(handleSuccess, handleError));
            }

            function editTodo(id, desc) {
                var request = $http({
                    method: 'post',
                    url: 'api/edit/',
                    data: {
                        id: id,
                        desc: desc
                    }
                });
                return(request.then(handleSuccess, handleError));
            }

            function removeTodo(id) {
                var request = $http({
                    method: 'post',
                    url: 'api/remove/',
                    data: {
                        id: id
                    }
                });
                return(request.then(handleSuccess, handleError));
            }

            function doUndoTodo(id) {
                var request = $http({
                    method: 'post',
                    url: 'api/do-undo/',
                    data: {
                        id: id
                    }
                });
                return(request.then(handleSuccess, handleError));
            }

            function clearDone() {
                var request = $http({
                    method: 'post',
                    url: 'api/clear-done/'
                });
                return(request.then(handleSuccess, handleError));
            }

            function handleError(response) {
                if (!angular.isObject(response.data) || !response.data.message) {
                    return ($q.reject("unknown error occurred"));
                }
                return ($q.reject(response.data.message));
            }

            function handleSuccess(response) {
                return (response.data);
            };
        }
    );

// -------------------------------------------------- //
// -------------------------------------------------- //

//    TodoApp.directive('todotext', function () {
//        return {
//            require: 'ngModel',
//            link: function (scope, elm, attrs, ngModel) {
//                ngModel.$validators.todotext = function (modelValue, viewValue) {
//                    return modelValue != '';
//                };
//            }
//        };
//    });


})();

