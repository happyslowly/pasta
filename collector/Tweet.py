from pymongo import MongoClient
import logging
import urllib

from conf import config

logger = logging.getLogger('TweetCollector')

client = MongoClient(config.mongo_host, config.mongo_port)
db = client.pasta
collection = db.tweets

class Tweet:
    def __init__(self, _id, created_ts, content, user, html, sentiment='pos'):
        self.id = _id
        self.created_ts = created_ts
        self.content = content
        self.sentiment = sentiment
        self.user = user
        self.html = html
        self.count = 0

    
    def dump(self):
        print '%s|%d|%s|%s' % (self.id, self.created_ts, self.content, self.sentiment)


    def save(self):
        sentiment = collection.find_one({"id": self.id}, {"sentiment": 1})
        #print sentimental
        if sentiment is None:
            self.count = self.count + 1;
            if self.count % 100 == 0: logger.info('Saved %d tweets.', self.count)
            self.dump()
            collection.insert(self.__dict__)