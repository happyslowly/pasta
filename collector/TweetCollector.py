import logging
import time
import re
import twitter
import dateutil.parser

from sentiment import sa
from conf import config
from Tweet import Tweet
from sentiment import sa

from conf import config

logger = logging.getLogger('TweetCollector')

ts_format = '%a %b %d %H:%M:%S +0000 %Y'

class TweetCollector(object):
    def __init__(self):
        self.auth = twitter.OAuth(config.twitter_oauth_token, config.twitter_oauth_secret,
                                  config.twitter_oauth_custkey, config.twitter_oauth_custsecret)
        logger.info('Connecting to twitter api')
        self.api = twitter.Twitter(auth=self.auth)


    def run(self, query, wait=config.interval):
        sequence = 0
        while True:
            try:
                self.query_tweets(query)
                sequence = sequence + 1
                time.sleep(wait)
            except twitter.TwitterHTTPError, e:
                logger.warn(e.message)
                time.sleep(wait)

            except TweetCollectorTimeoutException, e:
                logger.warn(e.message)
                time.sleep(wait)


    def query_tweets(self, query, sequence=0):
        logger.info('Searching: %s' % query)
        max_id = 0
        since_id = 0
        if sequence == 0:
            search_results = self.api.search.tweets(q=query, count=100, result_type='recent')
        else:
            #search_results = self.api.search.tweets(q=query, count=100, max_id=max_id-1)
            search_results = self.api.search.tweets(q=query, count=100, since_id=since_id)

        statuses = search_results['statuses']

        for _tweet in statuses:

            if _tweet.get('timeout', False):
                raise TweetCollectorTimeoutException('Timeout')

            if not self.is_tweet_valid(_tweet):
                continue
            
            if max_id == 0 or max_id > _tweet['id']: max_id = _tweet['id']
            if since_id == 0 or since_id < _tweet['id']: since_id = _tweet['id']

            tweet = Tweet(str(_tweet['id']),
                          int(time.mktime(time.strptime(_tweet['created_at'], ts_format))),
                          _tweet['text'],
                          sa.get_sentiment(self.clean(_tweet['text'])))
            tweet.save()

    
    def clean(self, content):
        return re.sub(r'http(s)*://\S+', '', content.replace('\n', ' '))


    def is_tweet_valid(self, tweet):

        if not tweet or 'delete' in tweet:
            logger.debug('Empty tweet - skipping')
            return False

        if not 'lang' in tweet or tweet['lang'] != 'en':
            logger.debug('Non EN - skipping')
            return False

        if not 'text' in tweet or tweet['text'].startswith('RT'):
            logger.debug('RE-Tweet found - skipping')
            return False

        return True


class TweetCollectorException(Exception):
    pass


class TweetCollectorTimeoutException(Exception):
    pass

