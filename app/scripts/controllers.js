'use strict';

angular.module('Mifamilia.controllers', [])

.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
 
  // Called to navigate to the main app
  $scope.startApp = function() {
    $state.go('main');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
})

.controller('MainCtrl', function($scope, $state, $firebase) {

  console.log('MainCtrl');
  $scope.folder = 'Mile'

  $scope.upload = function() {

    angular.forEach($scope.files,function(file){

      var reader = new FileReader();

      reader.onload = function(e) {
        var folder = $scope.folder;
        var name = e.timeStamp;
        var dataURL = reader.result;
        var f = new Firebase('https://mifamilia.firebaseio.com/'+ folder + '/' + name + '/filePayload');
        f.set(dataURL, function() {
          console.log('uploaded');
        });
      }

      reader.readAsDataURL(file);

    })

  }

  $scope.images = $firebase(new Firebase('https://mifamilia.firebaseio.com/' + $scope.folder));

  $scope.loadImg = function(){
    var f = new Firebase('https://mifamilia.firebaseio.com/' + $scope.folder);
    f.once('value', function(snap) {
      var payload = snap.val();
      if (payload != null) {
        $scope.imageSrc = payload;
      } else {
        console.log('not found');
      }
    });
  }

  
  $scope.toIntro = function(){
    $state.go('intro');
  }
})

.directive('fileInput',['$parse',function($parse){
  return {
    restrict:'A',
    link:function(scope,elm,attrs){
      elm.bind('change',function(){
        $parse(attrs.fileInput)
        .assign(scope,elm[0].files)
        scope.$apply()
      })
    }
  }
}]);
