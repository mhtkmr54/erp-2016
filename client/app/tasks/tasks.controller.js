'use strict';

angular.module('erp2015App')
  .controller('TasksCtrl', function ($scope, $state) {
  	$state.go('coordPortalDashboardCtrl');
    $scope.message = 'Hello';
  });
