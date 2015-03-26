class Tweet:
    def __init__(self, id, created_ts, content):
        self.id = id
        self.content = content
        self.created_ts = created_ts

    
    def dump(self):
        print '%s|%s|%s' % (self.id, self.created_ts, self.content)
