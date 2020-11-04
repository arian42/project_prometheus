#!/bin/python
import datetime
import json
import flask
from flask import request, jsonify
from flask_cors import CORS


app = flask.Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

data = []

print(data)

data_file = open('data.txt', 'a')

# load the chat file
with open('data.txt', 'r+') as f:
    data = json.loads( '[' + f.read()[:-1] + ']')

@app.route('/api/chat', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        d = request.get_json(force=True)
        row = {}
        row['user'] = d['user']
        row['msg'] = d['msg']
        row['time'] = datetime.datetime.now().strftime('%H:%M:%S')
        data_file.write(json.dumps(row) + ',')
        data_file.flush()
        data.append(row)
        return jsonify(success=True)
    else:
        return jsonify(data)

app.run()
