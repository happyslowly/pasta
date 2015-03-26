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
    result = new Array();

    for (var i = 0; i < docs.length; i++) {
      result.push({
        content: docs[i].content,
        created_ts: docs[i].created_ts,
        sentimental: docs[i].sentimental
      })
    }
    res.json(result);
  });
});

module.exports = router;
