'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', 'auth', function($scope, auth) {

  function onLoginSuccess(profile, token) {
    console.log(profile);
    console.log(token);
  }

  function onLoginFailed(error) {
    console.log("FAILED");
    console.log(error);
  }

  $scope.loginWithFacebook = function() {
    auth.signin({
      popup: true,
      connection: 'facebook',
      scope: 'openid name email'
    }, onLoginSuccess, onLoginFailed);

  };

}]);
