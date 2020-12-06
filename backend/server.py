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
import re
from hashlib import md5  # change this for the love of god


app = flask.Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'not-that-secret'
app.config["DEBUG"] = True


EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+")


class data:
    def __init__(self):
        for file_name in ("users.pickle", "chat.pickle"):
            if not Path(file_name).is_file():
                with open(file_name, 'bw+') as f:
                    pickle.dump(dict(), f)

        self.chat_records = self._read_data('chat.pickle')
        self._chat_file = open('chat.pickle', 'ab+')
        self.users = pickle.load(open('users.pickle', 'rb'))
        self.users_by_name = self._users_by_name()

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

    def _users_by_name(self):
        """ this makes user queries eazy and fast. this will run at runtime """
        foo = {}
        for uid, user in self.users.items():
            foo[user['username']] = uid
        return foo

    def add_user(self, email, username, name, password):
        while True:
            # this is not safe random but it is ok for this use
            # https://stackoverflow.com/questions/3530294/how-to-generate-unique-64-bits-integers-from-python
            user_id = getrandbits(64)
            if not user_id in self.users:
                self.users[user_id] = {
                    "username": username, "email": email, "name": name, "password": password}
                self.users_by_name[username] = user_id
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


@app.route('/api/sign-up', methods=['POST'])
def signup():
    data = request.get_json(force=True)

    for key in ('email', 'password', 'name', 'username'):
        if not data.get(key):
            return make_response(jsonify({'error': "{'email', 'password', 'name', 'username'} fields are required."}), 400)

    for _, user in db.users.items():
        if user['email'] == data['email'].lower():
            return make_response(jsonify({'error': "Email is taken."}), 400)
        if user['username'] == data['username'].lower():
            return make_response(jsonify({'error': "Username is taken."}), 400)

    if len(data['password']) < 8:
        return make_response(jsonify({'error': "password cant be smaller than 8 chracters"}), 400)

    if not EMAIL_REGEX.match(data['email'].lower()):
        return make_response(jsonify({'error': "Email is not valid."}), 400)

    user_id = db.add_user(data['email'].lower(),
                          data['username'].lower(), data['name'], md5(data['password'].encode('utf-8')).hexdigest())

    # generate token
    token = jwt.encode({
        'id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'])

    return make_response(jsonify({'token': token.decode('UTF-8'), 'name': data.get('name')}), 200)


@app.route('/api/sign-in', methods=['POST'])
def login():
    data = request.get_json(force=True)

    if data.get("usernameOrEmail") and data.get("password"):
        username = data["usernameOrEmail"].lower()
        for uid, user in db.users.items():
            print(user)
            if user['username'] == username or user['email'] == username:
                print(2)
                if user['password'] == md5(data['password'].encode('utf-8')).hexdigest():
                    token = jwt.encode({
                        'id': uid,
                        'exp': datetime.utcnow() + timedelta(hours=24)
                    }, app.config['SECRET_KEY'])
                    print(token)
                    return make_response(jsonify({'token': token.decode('utf-8'), "username": user['username']}), 200)
        return make_response(jsonify({'error': "username or password is not corect."}), 400)
    else:
        return make_response(jsonify({'error': "password and username is required."}), 400)


@app.route('/api/profile', methods=['GET', 'POST'])
@token_required
def profile(*argv, **kwargs):
    data = request.get_json(force=True)
    if data.get('username'):
        for uid, user in db.users.items():
            if user['username'] == data['username'].lower():
                target = {
                    'name': db.users[uid]['name'],
                    'username': db.users[uid]['username'],
                    'avatar': "#"
                }
                break
        else:
            return make_response(jsonify({'error': "user not found."}), 400)
    else:
        # this is not working
        target = {
            'name': db.users[user_id]['name'],
            'username': db.users[user_id]['username'],
            'avatar': "#"

        }
    return make_response(jsonify(target), 200)


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
