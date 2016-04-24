'use strict';

angular.module('myApp.trailpage', ['ngRoute', 'angular-storage', 'angular-input-stars'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/trail/:id', {
    templateUrl: 'trailpage/trailpage.html',
    controller: 'TrailPageCtrl'
  });
}])

.controller('TrailPageCtrl', ['$scope', '$http', 'auth', 'store', function($scope, $http, auth, store) {

  $scope.activity = {};

  $scope.authenticated = store.get('profile') ? true : false;
  $scope.display_mode  = 'not_started'; // TODO - If activity exists, then we initialize this differently

  function onLoginSuccess(profile, token) {
    store.set('profile', profile);
    store.set('token', token);
    $scope.authenticated = true;
  }

  function onLoginFailed(error) {
    console.log("LOGIN FAILED");
    console.log(error);
  }

  $scope.loginWithFacebook = function() {
    auth.signin({
      popup: true,
      connection: 'facebook',
      scope: 'openid name email'
    }, onLoginSuccess, onLoginFailed);
  };

  $scope.loginWithStrava = function() {
    throw "Strava Login not implemented yet";
  };

  $scope.startActivity = function(type) {
    // Would do API call here to create a new activity object
    $scope.display_mode = 'started';
    $scope.activity = { "type": type };
  };

  $scope.finishActivity = function() {
    // Would do API call here to update the activity object
    $scope.display_mode = 'finished';
  };

  $scope.submitFeedback = function(doFinish) {
    // Would do API call here to POST feedback

    if (doFinish) {
      $scope.display_mode = 'submitted';
    }
  };

}]);
