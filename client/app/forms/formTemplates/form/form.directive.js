'use strict';

angular.module('erp2015App')
  .directive('formDirective', function ($http) {
    return {
        controller: function($scope) {
            $scope.submit = function() {
                $scope.form.form_fields_submitted = [];

                $scope.form.form_fields_submitted = $scope.form.form_fields;
                $scope.form.form_id_submitted = $scope.form._id;

                $http.post('/api/coordForms/submitForm', { 
                    formValues: $scope.form.form_fields_submitted,  
                    formId: $scope.form.form_id_submitted
                })
                .then(function(message) {
                    $scope.form.submitted = true;
                    
                    // Below command is required else hacker can see all the responses submitted through $scope
                    $scope.form = {};        
                    
                    window.alert(message.data.msg);
                    window.location.reload();                   
                });           
            };
        },
        templateUrl: 'app/forms/formTemplates/form/form.html',
        restrict: 'E',
        scope: {
            form:'='
        }
    };
  });
