'use strict';

angular.module('myApp.trailpage', ['ngRoute', 'angular-storage', 'angular-input-stars', 'uiGmapgoogle-maps'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/trail/:id', {
    templateUrl: 'trailpage/trailpage.html',
    controller: 'TrailPageCtrl'
  });
}])

.controller('TrailPageCtrl', ['$scope', '$routeParams', '$http', 'auth', 'store', function($scope, $routeParams, $http, auth, store) {

  $scope.map = {
    center: {latitude: 40.1451, longitude: -99.6680 },
    fill: { color: "#FFF", opacity: "0" },
    stroke: { color: 'red', weight: 2, opacity: 1 }
  };

  $scope.trail    = {};
  $scope.activity = {};

  $scope.feedback = {
    rank:    null,
    comment: null
  };

  $scope.authenticated = store.get('profile') ? true : false;
  $scope.display_mode  = store.get('activity') ? 'started' : 'not_started';

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

    var postData = { trailId: $scope.trail.trailId, type: type };

    $http.post(API_BASE_URL + '/activities', postData).then(
        function(successResp) {
          $scope.display_mode = 'started';
          $scope.activity = successResp.data.activity;
          store.set('activity', $scope.activity);
        },
        function(/* fail */) {
          $scope.display_mode = 'error';
        }
    );

  };

  $scope.finishActivity = function() {
    // Would do API call here to update the activity object
    $scope.display_mode = 'finished';
  };

  $scope.submitFeedback = function(doFinish) {

    $http.post(API_BASE_URL + '/activities/' + $scope.activity.id, $scope.feedback).then(
      function(successResp) {
        $scope.activity = successResp.data.activity;
        store.set('activity', $scope.activity);
      },
      function(/* fail */) {
        $scope.display_mode = 'error';
      }
    ).finally(function() {
      if (doFinish) {
        $scope.display_mode = 'submitted';
        $scope.activity = {}; //unset activity
        store.remove('activity');
      }
    });
  };

  $scope.getTemperature = function() {
    if ( ! $scope.weather) {
      return '';
    }

    for (var i = 0; i < $scope.weather.record.readings.length; i++) {
      if ($scope.weather.record.readings[i].sensor_type == "Thermometer") {
        return $scope.weather.record.readings[i].value;
      }
    }

    return '';
  };

  //
  // Initialize..
  //
  $http.get(API_BASE_URL + '/trails/' + $routeParams.id).then(
      function(successResp) {
        $scope.trail = successResp.data.trailData.trail;
        $scope.weather = successResp.data.trailData.weather[0];
      },
      function(/* failResp */) {
        $scope.display_mode = 'error';
      }
  );

}])

.filter('capitalize', function() {
  return function(input, all) {
    var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
    return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
  }
})

.filter('extract_miles', function() {
  return function(input) {
    if ( ! input) {
      return '';
    }
    var myRegex = /(.+?)(\s+mi)?(\s+?)?\/(.+)?/g;
    var matches = myRegex.exec(input);
    return matches[1];
  }
});
