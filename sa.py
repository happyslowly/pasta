import re, math, collections, itertools
import random, csv, sys
import nltk, nltk.classify.util, nltk.metrics
from nltk.classify import NaiveBayesClassifier
from nltk.corpus import movie_reviews
import json

posfeats = []
negfeats = []

def word_feats(words):
    return dict([(word, True) for word in words])
	
# Read files from movie_reviews to negfeats and posfeats

negids = movie_reviews.fileids('neg')
posids = movie_reviews.fileids('pos')

#negfeats = [(word_feats(movie_reviews.words(fileids=[f])), 'neg') for f in negids]
#posfeats = [(word_feats(movie_reviews.words(fileids=[f])), 'pos') for f in posids]

with open("posfeats.txt","r") as f:
	posfeats=json.loads(f.readline())
		
with open("negfeats.txt", 'r') as f:
    negfeats=json.loads(f.readline())


#Set cut off: 4/5 for train and 1/5 for test

negcutoff = len(negfeats)*6/7
poscutoff = len(posfeats)*6/7

#trainfeats = negfeats[:negcutoff] + posfeats[:poscutoff]
trainfeats = negfeats[:negcutoff] + posfeats[:poscutoff]
testfeats = negfeats[negcutoff:] + posfeats[poscutoff:]

#print trainfeats
print 'train on %d instances, test on %d instances' % (len(trainfeats), len(testfeats))

#The function call to train the data

classifier = NaiveBayesClassifier.train(trainfeats)
classifier.show_most_informative_features(10)
#print(nltk.classify.accuracy(classifier, testfeats))


def get_sentiment(raw):
    tweetWords=[]
    words=raw.split()
    for i in words:
        i = i.lower()
        i = i.strip('\'$"?,.!')
        tweetWords.append(i)
    tweet = tweetWords
    return classifier.classify(word_feats(tweet))
