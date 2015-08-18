'use strict';

//TODO: move over search functions - make it a service rather than variable store.
angular.module('workspaceApp')
  .factory('Search', function () {
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
      }
    };
  });
