'use strict';

angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, $http, Auth) {
    $scope.awesomeThings = [];
    
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.user = Auth.getCurrentUser();
    $scope.businesses = [];
    $scope.picks = {};
    $scope.loc = "Visalia"; //make empty
    $scope.businessIds = [];
   
    $scope.search = function() {
      $scope.businesses = [];
      $http.get('/api/yelp/entertainment/' + $scope.loc).success(function(data) {
        data.businesses.forEach(function(b){
          $scope.businessIds.push(b.id);
          $scope.businesses.push(b);
        });
        $scope.getPicks();
        $(".custom-search-form").animate({ 
          'padding-top' : 0,
          'padding-right' : 0,
          'padding-bottom' : 0,
          'padding-left' : 0,
        }, "slow");
      });
    }
    
    $scope.getPicks = function() {
      $http.get('/api/picks/', { ids: $scope.businessIds } ).success(function(picks) {
        picks.forEach(function(pick){
          $scope.picks[pick.yelpId] = pick;
        });
      });
    }
    
    //toggle pick
    $scope.togglePick = function(yelpId) {
      if ($scope.isLoggedIn()){
        // See if pick already exists
        if ($scope.picks[yelpId]){
          // see if user pick already exists
          if ($scope.picks[yelpId].userIds.indexOf($scope.user._id) === -1) {
            //add user pick
            $scope.picks[yelpId].userIds.push($scope.user._id);
            $scope.picks[yelpId].pickCount += 1;
            $scope.updatePick($scope.picks[yelpId]);
          } else {
            //remove user pick
            var index = $scope.picks[yelpId].userIds.indexOf($scope.user._id);
            $scope.picks[yelpId].userIds.splice(index, 1);
            $scope.picks[yelpId].pickCount -= 1;
            //update picks
            $scope.updatePick($scope.picks[yelpId])
          }
      } else {
        //create new pick object
        $scope.createPick(yelpId);
      }
    } else {
      //TODO: route to login
    }
  };
    
    
    //create new pick object
    $scope.createPick = function(yelpId){
      $scope.picks[yelpId] = { yelpId: yelpId, userIds: [$scope.user._id], pickCount: 1 };
      $http.post('/api/picks/', $scope.picks[yelpId])
      .success(function(newPick){
        $scope.picks[yelpId] = newPick;
      });
    };
    
    $scope.updatePick = function(pick) {
      $http.put('/api/picks/' + pick._id, pick)
      .success(function(updatedPick){
          $scope.picks[pick.yelpId] = updatedPick;
          //remove empty pick objects
          if (updatedPick.userIds.length === 0) {
            $scope.deletePick(updatedPick);
          }
        });
    };
    
    $scope.deletePick = function(pick) {
      delete $scope.picks[pick.yelpId];
      return $http.delete('/api/picks/' + pick._id);
    };
    
     //$scope.search(); //temporary
    
  });
