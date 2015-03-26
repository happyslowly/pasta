import logging
import time
import twitter

from conf import config

logger = logging.getLogger('TweetCollector')

class TweetCollector(object):
    def __init__(self):
        self.count = 0
        self.auth = twitter.OAuth(config.twitter_oauth_token, config.twitter_oauth_secret,
                                  config.twitter_oauth_custkey, config.twitter_oauth_custsecret)
        logger.info('Connecting to twitter api')
        self.api = twitter.Twitter(auth=self.auth)


    def run(self, query, wait=30):
        while True:
            try:
                self.query_tweets(query)
            except twitter.TwitterHTTPError, e:
                logger.warn(e.message)
                time.sleep(wait)

            except TweetCollectorTimeoutException, e:
                logger.warn(e.message)
                time.sleep(wait)


    def query_tweets(self, query):
        logger.info('Searching: %s' % query)
        search_results = self.api.search.tweets(q=query, count=100)
        statuses = search_results['statuses']

        for tweet in statuses:
            print tweet

            if tweet.get('timeout', False):
                raise TweetCollectorTimeoutException('Timeout')

            if not self.is_tweet_valid(tweet):
                continue

            print tweet['text']

            if not self.count % 100:
                logger.info('Done with %d tweets out of %d' % (self.count, self.total_target))


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

        folded_text = TwitterMixin.word_map(tweet['text']).split()
        if '__h__' in folded_text and '__s__' in folded_text:
            logger.debug('Tweet with double emoicons found - skipping')
            return False

        return True


class TweetCollectorException(Exception):
    pass


class TweetCollectorTimeoutException(Exception):
    pass


