# Pasta #
## PayPal Sentimental Analysis Base on Twitter##

### Technology Stack ###
* Twitter Python API
* MongoDB
* Nodejs, Express
* HighCharts

### Setup ###
1. install python packages

		pip install twitter pymongo nltk

2. create a config.py from config.default.py, and put your twitter customer keys and tokens there
		
		cp conf/config.default.py conf/config.py
		
3. install node modules

		cd visual && npm install
		
4. startup
		
		./collect-paypal.py &
		visual/bin/www
		
5. go to http://localhost:3000 and have a taste		
