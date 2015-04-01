var express = require('express');
var router = express.Router();
var tzOffset = new Date().getTimezoneOffset() * 60 * 1000;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pasta', function (error) {
  if (error) {
    console.log(error);
  }
});

var tweetSchema = new mongoose.Schema({
  id: String,
  created_ts: Number,
  content: String,
  sentiment: String,
  url: String
});
var Tweet = mongoose.model('tweets', tweetSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
	  title: 'Pasta',
	  mailto: 'DL-PP-RISK-GRS-PASTA@corp.ebay.com'
  })
});

/* GET tweets */
router.get('/tweets', function(req, res, next) {
  var offset = req.query.offset * 1000 * 60;
  var currentTs = new Date().getTime() + tzOffset;
  
  Tweet.find({'created_ts': {$gte: (currentTs - offset)/1000}}, function(err, docs) {
    result = new Array();
    for (var i = 0; i < docs.length; i++) {
      result.push({
        id: docs[i].id,
        content: docs[i].content,
        created_ts: docs[i].created_ts * 1000,
        sentiment: docs[i].sentiment,
        url: docs[i].url
      });
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
