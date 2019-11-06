from flask import request, jsonify, render_template

from app import app, db


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/set', methods=['POST'])
def set_counter():
    db.counter.insert_one(request.json)
    return jsonify(status=True), 201


@app.route('/get')
def get_counter():
    data = db.counter.find()
    return jsonify(status=True, data=data)
