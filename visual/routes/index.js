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
  sentiment: String
});
var Tweet = mongoose.model('tweets', tweetSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pasta' });
});

/* GET tweets */
router.get('/tweets', function(req, res, next) {
  var since_id = req.query.since_id;
  console.log(req.query);
  console.log(since_id);
  Tweet.find({}, function(err, docs) {
    result = new Array();

    for (var i = 0; i < docs.length; i++) {
      if (docs[i].id > since_id) {
        result.push({
          id: docs[i].id,
          content: docs[i].content,
          plot_ts: normalizeTs(docs[i].created_ts),
          created_ts: docs[i].created_ts,
          sentiment: docs[i].sentiment
        });
      }
    }
    res.json(result);
  });
});

function normalizeTs(ts) {
  var year = ts.substring(0, 4);
  var month = ts.substring(5, 7);
  var day = ts.substring(8, 10);

  var hour = ts.substring(11, 13);
  var minutes = ts.substring(14, 16);
  var seconds = ts.substring(17, 19);

/*
  if (seconds < 30) {
    seconds = 0;
  } else {
    seconds = 30;
  }
  */

  return Date.UTC(year, month - 1, day, hour, minutes, seconds, 0);

}

module.exports = router;
