'use strict';

//var _ = require('lodash');
//var Yelp = require('./yelp.model');
var yelpConfig = require('./yelp.config');
var yelp = require("yelp").createClient(yelpConfig.apiKeys);

// See http://www.yelp.com/developers/documentation/v2/search_api
exports.index = function(req, res) {
  yelp.search({term: req.params.term, location: req.params.loc}, function(error, data) {
    return res.json(data);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}