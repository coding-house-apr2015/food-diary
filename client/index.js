'use strict';

angular.module('food-diary', ['firebase'])
.run(['$rootScope', '$window', function($rootScope, $window){
  $rootScope.fbRoot = new $window.Firebase('https://food-diary.firebaseio.com/');
}])
.controller('master', ['$scope', '$firebaseObject', function($scope, $firebaseObject){
  var fbUser = $scope.fbRoot.child('user');
  var afUser = $firebaseObject(fbUser);

  $scope.user = afUser;

  $scope.saveUser = function(){
    $scope.user.$save();
    computeBMI();
  };

  $scope.user.$loaded().then(function(){
    computeBMI();
  });

  function computeBMI(){
    var inches = $scope.user.unit === 'in' ? $scope.user.height : $scope.user.height * 0.393701;
    $scope.bmi = ($scope.user.weight * 703) / Math.pow(inches, 2);
  }
}]);
