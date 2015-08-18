'use strict';

var _ = require('lodash');
var Pick = require('./pick.model');

// Get list of picks
exports.index = function(req, res) {
  Pick.find(req.body, function (err, picks) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(picks);
  });
};

// Get a single pick
exports.show = function(req, res) {
  Pick.find(req.body, function (err, pick) {
    if(err) { return handleError(res, err); }
    if(!pick) { return res.status(404).send('Not Found'); }
    return res.json(pick);
  });
};

/*
exports.show = function(req, res) {
  Pick.findById(req.params.id, function (err, pick) {
    if(err) { return handleError(res, err); }
    if(!pick) { return res.status(404).send('Not Found'); }
    return res.json(pick);
  });
};
*/

// Creates a new pick in the DB.
exports.create = function(req, res) {
  Pick.create(req.body, function(err, pick) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(pick);
  });
};

// Updates an existing pick in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Pick.findById(req.params.id, function (err, pick) {
    if (err) { return handleError(res, err); }
    if(!pick) { return res.status(404).send('Not Found'); }
    var updated = _.extend(pick, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(pick);
    });
  });
};

// Deletes a pick from the DB.
exports.destroy = function(req, res) {
  Pick.findById(req.params.id, function (err, pick) {
    if(err) { return handleError(res, err); }
    if(!pick) { return res.status(404).send('Not Found'); }
    pick.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}