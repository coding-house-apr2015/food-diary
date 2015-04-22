'use strict';

angular.module('food-diary', ['firebase'])
.run(['$rootScope', '$window', function($rootScope, $window){
  $rootScope.fbRoot = new $window.Firebase('https://food-diary.firebaseio.com/');
}])
.controller('master', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray){
  var fbUser = $scope.fbRoot.child('user');
  var afUser = $firebaseObject(fbUser);
  $scope.user = afUser;

  var fbFoods = $scope.fbRoot.child('foods');
  var afFoods = $firebaseArray(fbFoods);
  $scope.foods = afFoods;

  $scope.saveUser = function(){
    $scope.user.$save();
    $scope.isUserFormShown = false;
    computeBMI();
  };

  $scope.user.$loaded().then(function(){
    computeBMI();
  });

  $scope.foods.$loaded().then(function(){
    computeWeight();
  });

  $scope.saveFood = function(){
    if($scope.food.$id){
      $scope.foods.$save($scope.food).then(function(){
        computeWeight();
        $scope.food = {};
      });
    }else{
      var now = new Date();
      $scope.food.date = now.getTime();
      $scope.foods.$add($scope.food).then(function(){
        computeWeight();
        $scope.food = {};
      });
    }
  };

  $scope.editFood = function(food){
    $scope.food = food;
  };

  $scope.removeFood = function(food){
    $scope.foods.$remove(food).then(function(){
      computeWeight();
    });
  };

  $scope.showUserForm = function(){
    $scope.isUserFormShown = true;
  };

  function computeWeight(){
    var totalCalories = $scope.foods.reduce(function(accumulator, food){
      return accumulator + (food.calories * food.servings);
    }, 0);
    $scope.weightGained = totalCalories / 3500;
  }

  function computeBMI(){
    var inches = $scope.user.unit === 'in' ? $scope.user.height : $scope.user.height * 0.393701;
    $scope.bmi = ($scope.user.weight * 703) / Math.pow(inches, 2);
  }
}]);
