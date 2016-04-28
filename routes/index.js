var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Soul = mongoose.model('Soul');


/* GET routes */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/members', function(req, res) {
  res.render('members');
});

router.get('/soulList', function(req, res, next) {
  Soul.find(function(err,soulList){
    if(err){ return next(err); }

    res.json(soulList);
  });
});

router.get('/soulList/:soul', function(req, res) {
  res.json(req.soul);
});

/* POST routes */
router.post('/soulList', function(req, res, next) {
  var soul = new Soul(req.body);

  soul.save(function(err, soul){
    if(err){ return next(err); }

    res.json(soul);
  });
});

router.param('soul', function(req, res, next, id){
  var query = Soul.findById(id);

  query.exec(function(err, soul){
    if(err) { return next(err); }
    if(!soul) { return next(new Error("can't find soul")); }

    req.soul = soul;
    return next();
  });
});

module.exports = router;
