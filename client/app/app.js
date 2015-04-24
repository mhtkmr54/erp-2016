'use strict';

angular.module('erp2015App', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ngFileUpload',
  'ui.bootstrap',
  'smart-table',
  'permission',
  'ngFacebook',
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/coordPortal/dashboard');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })
  .config( function( $facebookProvider ) {
    $facebookProvider.setAppId('1630409340524916');
  })
  .run( function ($rootScope) {
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=1630409340524916";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth, Permission) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.url('/login');
        }
      });
    })
    /**
     * Defining all roles
     */
    Permission
      .defineRole('anonymous', function(stateParams) {
        Auth.isLoggedInAsync(function(success) {
          var currUser = Auth.getCurrentUser();
          if(currUser) {
            return true;
          }
          return false;
        });
      })
      .defineRole('user', function(stateParams) {
        Auth.isLoggedInAsync(function (success) {
          var currUser = Auth.getCurrentUser();
          if(currUser.role === 'user') {
            return true;
          }
        });
        return false;        
      })
      .defineRole('core', function(stateParams) {
        Auth.isLoggedInAsync(function (success) {
          var currUser = Auth.getCurrentUser();
          if(currUser.role === 'core') {
            return true;
          }
        });
        return false;        
      })
      .defineRole('admin', function(stateParams) {
        return Auth.isAdmin();       
      });
  });