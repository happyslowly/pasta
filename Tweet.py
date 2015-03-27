from pymongo import MongoClient
import json

client = MongoClient('localhost', 27017)
db = client.pasta
collection = db.tweets

class Tweet:
    def __init__(self, id, created_ts, content, sentiment='pos'):
        self.id = id
        self.content = content
        self.created_ts = str(created_ts.now())
        self.rollup_ts = created_ts
        self.sentiment = sentiment

    
    def dump(self):
        print '%s|%s|%s|%s' % (self.id, self.created_ts, self.content, self.sentiment)


    def save(self):
        sentiment = collection.find_one({"id": self.id}, {"sentiment": 1})
        #print sentimental
        if sentiment is None:
            self.dump()
            collection.insert(self.__dict__)



