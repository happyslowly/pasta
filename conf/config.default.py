import logging

twitter_oauth_token = ""
twitter_oauth_secret = ""
twitter_oauth_custkey = ""
twitter_oauth_custsecret = ""

keywords = [
  '#Paypalit',
  '#paypalme',
  '#lovepaypal',
  '#paypal',
  '#paypalhere',
  '#paypalcash',
  '#paypal4business',
  '#venmo',
  '#mobilewallet',
  '#ppal',
  '#paypall',
  '#paypals',
  '#paypalsucks',
  '#fuckpaypal',
  '#nopaypal',
  '#boycottpaypal',
  '#paypalalternatives',
  'paypal'
]

logging.basicConfig(level=logging.INFO, format='%(name)s: %(levelname)s %(message)s')

interval = 5

mongo_host = 'localhost'
mongo_port = 27017
