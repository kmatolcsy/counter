import os
from flask import Flask
from flask_pymongo import PyMongo

<<<<<<< HEAD

=======
>>>>>>> e067cd412fb67043628640a0cd800a5b2e854459
app = Flask(__name__)

app.config["MONGO_URI"] = f'mongodb://{os.environ["MONGODB_USERNAME"]}:{os.environ["MONGODB_PASSWORD"]}@{os.environ["MONGODB_HOSTNAME"]}:27017/{os.environ["MONGODB_DATABASE"]}'

mongo = PyMongo(app)
db = mongo.db

from app import views
<<<<<<< HEAD
=======

>>>>>>> e067cd412fb67043628640a0cd800a5b2e854459
