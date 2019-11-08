import requests
from flask import request, jsonify, render_template
from bson.json_util import dumps

from app import app, db


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/set', methods=['POST'])
def set_counter():
    entry = request.json

    access_key = 'INSERT_KEY_HERE'
    response = requests.get(f'https://api.unsplash.com/search/photos?client_id={access_key}&query={entry.get("city")}')
    results = response.json().get('results')

    entry.update({
        "src": results[0]["urls"]["regular"],
        "usr": results[0]["user"]["name"],
        "deleted": False
    })

    db.counter.insert_one(entry)
    return jsonify(status=True), 201


@app.route('/get')
def get_counter():
    data = dumps(db.counter.find())
    return jsonify(status=True, data=data)
