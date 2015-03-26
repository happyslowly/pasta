#!/usr/bin/env python
# PYTHON_ARGCOMPLETE_OK

__author__ = 'xixu'
import twitter
import argparse
import argcomplete
import sys
import time
import logging

from conf import config
from TweetCollector import TweetCollector

logger = logging.getLogger('collect-paypal')

parser = argparse.ArgumentParser(description='Collect PayPal tweets', usage='python collect-paypal.py')
args = parser.parse_args()

argcomplete.autocomplete(parser)


try:
    query = 'paypal'
    c = TweetCollector()
    c.run(query)

except (KeyboardInterrupt, SystemExit):
    pass
