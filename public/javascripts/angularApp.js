var app = angular.module('plantr', ['ui.router']);

app.factory('posts', [function(){
  var o = {
    posts: []
  };
  return o;
}])

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl'
      })

      .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl'
      })

     $urlRouterProvider.otherwise('home');
  }]);

app.controller('FormCtrl', function($scope) {

  //function to submit the form after all validation has occurred
  $scope.submitForm = function(isValid) {

    // check to make sure the form is completely valid
    if (isValid) {
      alert('Form is valid');
    }
  };
});

app.controller('MainCtrl', [
  '$scope',
  'posts',
  function($scope, posts){
    $scope.posts = posts.posts;

    $scope.addPost = function(){
      if(!$scope.title || $scope.title === '') {return;}
      $scope.posts.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0
      });
      $scope.title = '';
      $scope.link = '';

    };

    $scope.incrementUpvotes = function(post) {
      post.upvotes += 1;
    };
  }]);

  app.controller('PostsCtrl', [
    '$scope',
    '$stateParams',
    'posts',

    function($scope, $stateParams, posts){
      $scope.post = posts.posts[$stateParams.id];
      $scope.post.comments = [];

      $scope.addComment = function(){
        if($scope.body === '') {return;}
        $scope.post.comments.push({
          body: $scope.body,
          author: 'user',
          upvotes: 0
        });
        $scope.body = '';
      };
      $scope.incrementUpvotes = function(comment) {
        comment.upvotes += 1;
      };
    }]);
