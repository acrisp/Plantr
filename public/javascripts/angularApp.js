var app = angular.module('plantr', ['ui.router']);

app.factory('souls', ['$http', function($http){
  var o = {
    souls: []
  };

  o.getAll = function() {
    return $http.get('/soulList').success(function(data){
      angular.copy(data, o.souls);
    });
  };

  o.get = function (id) {
    return $http.get('soulList/' + id)
      .then(function(res) {
        return res.data;
      });
  };

  o.create = function(soul) {
    return $http.post('/soulList', soul).success(function(data){
      o.souls.push(data);
    });
  };

  return o;
}]);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){

    $stateProvider
      .state('members', {
        url: '/members',
        templateUrl: '/members.html',
        controller: 'MainCtrl'
      })

      .state('addSoul', {
        url: '/addSoul',
        templateUrl: '/addSoul.ejs',
        controller: 'MainCtrl'
      })

      .state('soulList', {
        url: '/soulList',
        templateUrl: '/soulList.ejs',
        controller: 'MainCtrl',
        resolve: {
          postPromise: ['souls', function(souls){
            return souls.getAll();
          }]
        }
      })

      .state('soul', {
        url:'/soul/{id}',
        templateUrl: '/soul.ejs',
        controller: 'SoulsCtrl',
        resolve: {
          soul: ['$stateParams', 'souls', function($stateParams, souls) {
            return souls.get($stateParams.id);
          }]
        }
      });

     $urlRouterProvider.otherwise('members');
  }]);

app.controller('MainCtrl', [
  '$scope',
  'souls',
  '$stateParams',
  function($scope, souls){
    $scope.souls = souls.souls;

    $scope.addSoul = function(){
      if(!$scope.fullname || $scope.fullname === '') { return; }
      souls.create({
        fullname: $scope.fullname,
        street: $scope.street,
        city: $scope.city,
        state: $scope.state,
        zip: $scope.zip,
        dateContacted: $scope.dateContacted,
        lessonNumber: $scope.lessonNumber,
        dateSent: $scope.dateSent,
        dateReceived: $scope.dateReceived
      });
      $scope.fullname = '';
      $scope.street = '';
      $scope.city = '';
      $scope.state = '';
      $scope.zip = '';
      $scope.dateContacted = '';
      $scope.lessonNumber = '';
      $scope.dateSent = '';
      $scope.dateReceived = '';
    };
  }]);

  app.controller('SoulsCtrl', [
    '$scope',
    'souls',
    'soul',
    function($scope, souls, soul){

      $scope.soul = soul;
    }]);
