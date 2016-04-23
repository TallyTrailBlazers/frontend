'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'auth0',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$routeProvider', 'authProvider', function($routeProvider, authProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});

  authProvider.init({
    domain:   'caseyamcl.auth0.com',
    clientID: 'dMLFCrz1DGZjJCC3Jx5n9e9bttpllSAI',
    loginUrl: '/'
  });

}]).
run(function(auth) {
  auth.hookEvents();
});
