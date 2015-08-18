'use strict';

//TODO: move over search functions - make it a service rather than variable store.
angular.module('workspaceApp')
  .factory('Search', function () {
    var businesses = [];
    var picks = [];
    var searchPadding = 300;
    
    var results = {
      business: [],
      picks: {},
      searchPadding: 300
    };
    
    return {
      getResults : function() {
        return results;
      },
      setResults : function(r) {
        results = r;
      },
      getBusinesses : function() {
        return businesses;
      },
      setBusinesses : function(b) {
        businesses = b;
      },
      getPicks : function() {
        return picks;
      },
      setPicks : function(p) {
        picks = p;
      },
      getSearchPadding : function() {
        return searchPadding;
      },
      setBusinesses : function(p) {
        searchPadding = p;
      }
    }
  });
