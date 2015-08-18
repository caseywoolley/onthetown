'use strict';

angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, $http, $location, Auth, $cookieStore, Search) {
    
    $scope.setResults = Search.setResults;
    $scope.getResults = Search.getResults;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.user = Auth.getCurrentUser();
    
    $scope.businesses = $scope.getResults().businesses;
    $scope.picks = $scope.getResults().picks;
    $scope.busy = false;
    
    
    //restore last search term
    if ($cookieStore.get('search')) {
      $scope.loc = $cookieStore.get('search');
    } else {
      $scope.loc = '';
    }
    
    //set search bar appearance
    $(".custom-search-form").css({ 
            'padding-top' : $scope.getResults().searchPadding,
            'padding-right' : 0,
            'padding-bottom' : $scope.getResults().searchPadding,
            'padding-left' : 0,
    });

    $scope.search = function() {
      if ($scope.busy === false) {
        $scope.busy = true;
        $scope.businesses = [];
        $scope.businessIds = [];
        $http.get('/api/yelp/entertainment/' + $scope.loc).success(function(data) {
          data.businesses.forEach(function(b){
            $scope.businesses.push(b);
          });
          $scope.getPicks();
          $(".custom-search-form").animate({ 
            'padding-top' : 0,
            'padding-right' : 0,
            'padding-bottom' : 0,
            'padding-left' : 0,
          }, "slow");
          $scope.busy = false;
        }).error(function(){
          $scope.busy = false;
        });
      }
      //store search term in cookies
      if ($scope.loc) {
        $cookieStore.put('search', $scope.loc);
      }
    }
    
    $scope.getPicks = function() {
      $http.get('/api/picks/', { ids: $scope.businessIds } ).success(function(picks) {
        picks.forEach(function(pick){
          $scope.picks[pick.yelpId] = pick;
        });
        
        $scope.setResults({
            businesses: $scope.businesses,
            picks: $scope.picks,
            searchPadding: 0
          });
      });
    }
    
    //toggle pick
    $scope.togglePick = function(yelpId) {
      if ($scope.isLoggedIn()){
         if ($scope.busy === false) {
            $scope.busy = true;
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
      } //if busy
    } else {
      //re-route to login
      $location.path('/login');
    }
  };

    //create new pick object
    $scope.createPick = function(yelpId){
      $scope.picks[yelpId] = { yelpId: yelpId, userIds: [$scope.user._id], pickCount: 1 };
      $http.post('/api/picks/', $scope.picks[yelpId])
      .success(function(newPick){
        $scope.picks[yelpId] = newPick;
        $scope.busy = false;
      }).error(function(){ $scope.busy = false });
    };
    
    $scope.updatePick = function(pick) {
      $http.put('/api/picks/' + pick._id, pick)
      .success(function(updatedPick){
          $scope.picks[pick.yelpId] = updatedPick;
          //remove empty pick objects
          if (updatedPick.userIds.length === 0) {
            $scope.deletePick(updatedPick);
          } else {
            $scope.busy = false;
          }
          
        }).error(function(){ $scope.busy = false });
    };
    
    $scope.deletePick = function(pick) {
      delete $scope.picks[pick.yelpId];
      return $http.delete('/api/picks/' + pick._id)
      .success(function(){ $scope.busy = false })
      .error(function(){ $scope.busy = false });
    };

  });
