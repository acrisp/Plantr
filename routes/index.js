// ======================================================================
// Import dependencies ==================================================
// ======================================================================
var mongoose   = require('mongoose');
var passport   = require('passport');
var express    = require('express');
var jwt        = require('express-jwt');
var config     = require('../config/main');
var auth       = jwt({ secret: config.secret, userProperty: 'payload'});

// ======================================================================
// Import models ==========================================================
// ======================================================================
var User = mongoose.model('User');
var Soul = mongoose.model('Soul');

// ======================================================================
// Create router group routes ===========================================
// ======================================================================
var router = express.Router();

// ======================================================================
// Register Route =======================================================
// ======================================================================
router.post('/register', function(req, res, next) {

  // ====================================================================
  // Ensure user has provided necessary data. If so, set variables ======
  // ====================================================================
  if(!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Please fill out all fields' });
  }
    var newUser = new User();

    newUser.username = req.body.username;
    newUser.password = req.body.password;

    // ==================================================================
    // Attempt to save the user =========================================
    // ==================================================================
    newUser.save(function(err) {
      if (err) {
        return res.json({ success: false, message: 'That email address already exists.'});
      }
      res.json({ success: true, message: 'Successfully created new user.' });
    });
});

// ======================================================================
// Authenticate the user ================================================
// ======================================================================
router.post('/authenticate', function(req, res, next) {

  // ====================================================================
  // Ensure user provides all necessary data ============================
  // ====================================================================
  if(!req.body.username || !req.body.password){
    return res.status(400).json({ message: 'Please fill out all fields' });
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({ token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req,res, next);
});

// ======================================================================
// Router Routes ========================================================
// ======================================================================

// ======================================================================
// Home Route ===========================================================
// ======================================================================
router.get('/', function(req, res) {
  res.render('index');
});

// ======================================================================
// Register Route =======================================================
// ======================================================================
router.get('/register', function(req, res) {
  res.render('register');
});

// ======================================================================
// Member Route =========================================================
// ======================================================================
router.get('/members', auth, function(req, res) {
  res.render('members');
});

// ======================================================================
// soulList Routes ======================================================
// ======================================================================

// ======================================================================
// Display Soul Directory ===============================================
// ======================================================================
router.get('/soulList', auth, function(req, res, next) {
  Soul.find(function(err,soulList){
    if(err){ return next(err); }

    res.json(soulList);
  });
});

// ======================================================================
// Display Specific Soul ================================================
// ======================================================================
router.get('/soulList/:soul', auth, function(req, res) {
  res.json(req.soul);
});

// ======================================================================
// Add Additional Souls =================================================
// ======================================================================
router.post('/soulList', auth, function(req, res, next) {
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
