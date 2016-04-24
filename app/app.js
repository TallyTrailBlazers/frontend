'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'auth0',
  'angular-storage',
  'angular-jwt',
  'myApp.trailpage',
  'myApp.version'
]).
config(['$routeProvider', '$httpProvider', '$locationProvider', 'authProvider', 'jwtInterceptorProvider', function($routeProvider, $httpProvider, $locationProvider, authProvider, jwtInterceptorProvider) {
  $routeProvider
  .when('/trail/:trailId', {
        templateUrl: 'trailpage/trailpage.html',
        controller: 'TrailPageCtrl'
      })
  .otherwise({redirectTo: '/trail/1'});

  authProvider.init({
    domain:   'caseyamcl.auth0.com',
    clientID: 'dMLFCrz1DGZjJCC3Jx5n9e9bttpllSAI',
    loginUrl: '/'
  });

  jwtInterceptorProvider.tokenGetter = ['store', function(store) {
    // Return the saved token
    return store.get('token');
  }];
  $httpProvider.interceptors.push('jwtInterceptor');

  $locationProvider.html5Mode(true);

}]).
run(function(auth) {
  auth.hookEvents();
});
