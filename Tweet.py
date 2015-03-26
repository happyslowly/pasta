from pymongo import MongoClient
import json

client = MongoClient('localhost', 27017)
db = client.pasta
collection = db.tweets

class Tweet:
    def __init__(self, id, created_ts, content, sentimental='pos'):
        self.id = id
        self.content = content
        self.created_ts = str(created_ts.now())
        self.sentimental = sentimental

    
    def dump(self):
        print '%s|%s|%s' % (self.id, self.created_ts, self.content)


    def save(self):
        sentimental = collection.find_one({"id": self.id}, {"sentimental": 1})
        #print sentimental
        if sentimental is None or sentimental != self.sentimental:
            self.dump()
            #collection.insert(self.__dict__)



