var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Soul');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET /souls page */
router.get('/souls', function(req,res,next) {
  Soul.find(function(err, posts){
    if(err){ return next(err); }

    res.json(souls);
  });
});

router.get('/addSoul', function(req,res,next) {
  res.render('addSoul', { title: 'Add a Soul' });
});

module.exports = router;
