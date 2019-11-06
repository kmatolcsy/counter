from flask import jsonify, request

from app import app, db

@app.route('/')
def index():
	return jsonify(
		status=True,
		message="Hello from flask"
	)


@app.route('/set', methods=['POST'])
def set_counter():
	data = requests.get_json()

	if data.get('counter'):
		db.counter.insert_one(data['counter'])
		return jsonify(
			status=True,
			message='Counter saved successfully'
		), 201
	else:
		return jsonify(
			status=True,
			message='Something went wrong'
		)


@app.route('/get', methods=['GET'])
def get_counter():
	counters = db.counter.find()
	data = [{k: counter[k] for k in ('title', 'date')} for counter in counters]

	return jsonify(
		status=True,
		data=data
	)
