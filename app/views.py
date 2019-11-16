import random
import requests
from flask import request, jsonify, render_template
from bson.json_util import dumps, ObjectId

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
    index = random.randrange(len(results))

    if results:
        entry.update({
            "src": results[index]["urls"]["regular"],
            "usr": results[index]["user"]["name"]
        })

    entry["deleted"] = False

    db.counter.insert_one(entry)
    return jsonify(status=True), 201


@app.route('/get')
def get_counter():
    data = dumps(db.counter.find({"deleted": False}).sort("date", -1))
    
    return jsonify(status=True, data=data), 200


@app.route('/del', methods=['DELETE'])
def del_counter():
    filters = request.json
    filters['_id'] =ObjectId(filters['_id'])
    print(db.counter.find_one(filters))
    ans = db.counter.update_one(filters, {"$set": {"deleted": True}})
    print(ans)
    return jsonify(status=True), 200
