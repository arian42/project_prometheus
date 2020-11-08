#!/bin/python
from datetime import datetime, timedelta
from flask import request, jsonify, make_response
from functools import wraps
import jwt
from pathlib import Path
from random import getrandbits
import flask
from flask_cors import CORS
import pickle  # for data storage

app = flask.Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'not-that-secret'
app.config["DEBUG"] = True


class data:
    def __init__(self):
        for file_name in ("users.pickle", "chat.pickle"):
            if not Path(file_name).is_file():
                with open(file_name, 'bw+') as f:
                    pickle.dump(dict(), f)

        self.chat_records = self._read_data('chat.pickle')
        self._chat_file = open('chat.pickle', 'ab+')
        self.users = pickle.load(open('users.pickle', 'rb'))
        self.users_by_phone = self._users_by_phone()

    def _read_data(self, file_name):
        recoreds = []
        with open(file_name, 'rb') as f:
            while True:
                try:
                    recoreds.append(pickle.load(f))
                except EOFError:
                    break
        return recoreds

    def save_chat(self, message):
        data = {
            'msg': message,
            'time': datetime.utcnow().strftime('%H:%M')
        }
        self.chat_records.append(data)
        pickle.dump(data, self._chat_file)

    def _users_by_phone(self):
        """ this makes user queries eazy and fast. this will run at runtime """
        phone = {}
        for uid, user in self.users.items():
            phone[user['phone']] = uid
        return phone

    def add_user(self, phone, name):
        while True:
            # this is not safe random but it is ok for this use
            # https://stackoverflow.com/questions/3530294/how-to-generate-unique-64-bits-integers-from-python
            user_id = getrandbits(64)
            if not user_id in self.users:
                self.users[user_id] = {"name": name, "phone": phone}
                self.users_by_phone[phone] = user_id
                break

        with open('users.pickle', 'wb') as f:
            pickle.dump(self.users, f)

        return user_id


# db like instance
db = data()

# decorator for verifying the JWT


def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        else:
            # if it is not in the headers we try to read from json post data
            try:
                # if json dosn't contain token fild set token to none
                token = request.get_json(force=True).get('token', None)
            except:
                # post data is not a vaild json
                token = None

        if not token:
            # return 401 if token is not passed
            return make_response(jsonify({'error': 'Token is required.'}), 401)

        try:
            # decod the jwt to fetch the stored details
            data = jwt.decode(token, app.config['SECRET_KEY'])
            user_id = data['id']

        except:
            return make_response(jsonify({
                'error': 'Token is invalid.'
            }), 401)
        # returns the current logged in users contex to the routes
        return func(user_id, *args, **kwargs)

    return decorated


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(force=True)

    if not data or not data.get('phone-token') or not data.get('otp'):
        return make_response(jsonify({'error': 'Invalid request.'}), 401)

    try:
        rtoken = jwt.decode(data.get('phone-token'), app.config['SECRET_KEY'])
    except:
        return make_response(jsonify({'error': 'Invalid token.'}), 401)

    if not rtoken['phone'] in db.users_by_phone:
        uid = db.add_user(rtoken['phone'], rtoken['name'])
    else:
        uid = db.users_by_phone[rtoken['phone']]

    if data['otp'] == '123456':
        # generates the JWT Token
        token = jwt.encode({
            'id': uid,
            'exp': datetime.utcnow() + timedelta(hours=48)
        }, app.config['SECRET_KEY'])

        return make_response(jsonify({'token': token.decode('UTF-8'), 'name': rtoken['name'], 'user_id': uid}), 200)

    return make_response(jsonify({'error': 'Invalid code'}), 401)


@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json(force=True)

    if not data.get('phone'):
        return make_response(jsonify({'error': 'Invalid phone number.'}), 401)

    # validate phone number
    # send OTP SMS
    # add OTP to database

    # generate token
    token = jwt.encode({
        'phone': data.get('phone'),
        'name': data.get('name', ''),
        'exp': datetime.utcnow() + timedelta(minutes=2)
    }, app.config['SECRET_KEY'])

    return make_response(jsonify({'phone-token': token.decode('UTF-8'), 'name': data.get('name')}), 200)


@app.route('/api/chat', methods=['GET', 'POST'])
@token_required
def chat(*argv, **kwargs):
    if request.method == 'POST':
        d = request.get_json(force=True)
        db.save_chat(d['msg'])
        return jsonify(success=True)
    else:
        return make_response(jsonify(db.chat_records), 200)


app.run()
