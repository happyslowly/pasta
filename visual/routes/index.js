var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pasta', function (error) {
  if (error) {
    console.log(error);
  }
});

var tweetSchema = new mongoose.Schema({
  id: String,
  created_ts: String,
  content: String,
  sentimental: String
});
var Tweet = mongoose.model('tweets', tweetSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pasta' });
});

/* GET tweets */
router.get('/tweets', function(req, res, next) {
  Tweet.find({}, function(err, docs) {
    res.json(docs);
  });
});

module.exports = router;
