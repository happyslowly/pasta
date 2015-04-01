#!/usr/bin/env python

import twitter
import sys
import time
import logging
import urllib

from conf import config
from collector import TweetCollector

logger = logging.getLogger('collect-paypal')

try:
    query = '+OR+'.join([urllib.quote(kw, '') for kw in config.keywords])
    c = TweetCollector()
    c.run(query)

except (KeyboardInterrupt, SystemExit):
    pass
