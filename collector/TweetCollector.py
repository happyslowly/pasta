import logging
import time
import re
import twitter

from conf import config
from Tweet import Tweet
from sentiment import sa

logger = logging.getLogger('TweetCollector')

ts_format = '%a %b %d %H:%M:%S +0000 %Y'

class TweetCollector(object):
    def __init__(self):
        self.auth = twitter.OAuth(config.twitter_oauth_token, config.twitter_oauth_secret,
                                  config.twitter_oauth_custkey, config.twitter_oauth_custsecret)
        logger.info('Connecting to twitter api')
        self.api = twitter.Twitter(auth=self.auth)
        self.sequence = 0


    def run(self, query, wait=config.interval):
        sequence = 0
        while True:
            try:
                self.query_tweets(query, sequence)
                sequence = sequence + 1
                time.sleep(wait)
            except twitter.TwitterHTTPError, e:
                logger.warn(e.message)
                time.sleep(wait)

            except TweetCollectorTimeoutException, e:
                logger.warn(e.message)
                time.sleep(wait)
                
            except ValueError, e:
                logger.warn(e.message)
                sequence = 0 # reset sequence to zero to bypass error record
                time.sleep(wait)


    def query_tweets(self, query, sequence=0):
        logger.info('Searching: %s' % query)
        since_id = 0
        try:
          if sequence == 0:
              search_results = self.api.search.tweets(q=query, count=100, result_type='recent')
          else:
              search_results = self.api.search.tweets(q=query, count=100, since_id=since_id)
        except:
          return

        statuses = search_results['statuses']

        for _tweet in statuses:

            if _tweet.get('timeout', False):
                raise TweetCollectorTimeoutException('Timeout')

            if not self.is_tweet_valid(_tweet):
                continue
            
            if since_id == 0 or since_id < _tweet['id']: since_id = _tweet['id']
         
            tweet = Tweet(str(_tweet['id']),
                          int(time.mktime(time.strptime(_tweet['created_at'], ts_format))),
                          _tweet['text'], _tweet['user']['screen_name'], 
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


