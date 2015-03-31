from pymongo import MongoClient
import json
import logging

logger = logging.getLogger('TweetCollector')

client = MongoClient('localhost', 27017)
db = client.pasta
collection = db.tweets

class Tweet:
    def __init__(self, id, created_ts, content, sentiment='pos'):
        self.id = id
        self.created_ts = created_ts
        self.content = content
        self.sentiment = sentiment
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