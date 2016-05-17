angular.module('plantr', ['ui.router'])
// ui.router config
.config([
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
   }
])

// Main controller
.controller('MainCtrl', [
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
   }])

// Soul controller
.controller('SoulsCtrl', [
   '$scope',
   'souls',
   'soul',
   function($scope, souls, soul){

       $scope.soul = soul;
   }])

// Auth controller
.controller('AuthCtrl', [
   '$scope',
   'auth',
   '$window',
   function($scope, auth, $window){
       $scope.user = {};

       $scope.register = function(){
           auth.register($scope.user).error(function(error){
               $scope.error = error;
           }).then(function(){
               $window.location.href = '/';
           });
       };

       $scope.logIn = function(){
           auth.logIn($scope.user).error(function(error){
               $scope.error = error;
           }).then(function(){
             $window.location.href = 'api/members';
           });
       };
    }])

// Souls Factory
.factory('souls', ['$http', function($http){
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
}])

.factory('auth', ['$http', '$window', function($http, $window){
   var auth = {};

   auth.saveToken = function(token){
       $window.localStorage['plantr-token'] = token;
   };

   auth.getToken = function(){
       return $window.localStorage['plantr-token'];
   };

   auth.isLoggedIn = function(){
       var token = auth.getToken();

       if(token){
           var payload = JSON.parse($window.atob(token.split('.')[1]));

           return payload.exp > Date.now() / 1000;
       } else {
           return false;
       }
   };

   auth.currentUser = function(){
       if(auth.isLoggedIn()){
           var token = auth.getToken();
           var payload = JSON.parse($window.atob(token.split('.')[1]));

           return payload.username;
       }
   };

  auth.register = function(user){
    return $http.post('/register', user).success(function(data){
    });
  };

  auth.logIn = function(user){
    return $http.post('api/authenticate', user).success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.logOut = function(){
    $window.localStorage.removeItem('plantr-token');
  };

  return auth;
}])
