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
import time

app = flask.Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'not-that-secret'
app.config["DEBUG"] = True

EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+")
FILE_REGEX = re.compile(r"[\w]{100}")


class data:
    def __init__(self):
        if not Path('users.pickle').is_file():
            with open("users.pickle", 'bw+') as f:
                pickle.dump(dict(), f)

        self.users = pickle.load(open('users.pickle', 'rb'))
        self.users_by_name = self._users_by_name()

    def _gen_filename(self, user_id, user2_id):
        user_id, user2_id = int(user_id), int(user2_id)
        if user_id > user2_id:
            return "chat/" + str(user_id) + str(user2_id) + ".pickle"
        else:
            return "chat/" + str(user2_id) + str(user_id) + ".pickle"


    def _users_by_name(self):
        """ this makes user queries eazy and fast. this will run at runtime """
        foo = {}
        for uid, user in self.users.items():
            foo[user['username']] = uid
        return foo


    def read_chat(self, user_id, user2_id):
        chat_records = None
        with open(self._gen_filename(user_id, user2_id), 'rb') as f:
            chat_records = pickle.load(f)
        return chat_records


    def save_chat(self, message, user_id, user2_id):
        chat_id = int(str(user_id) + str(int(time.time())))
        data = {
            'id': chat_id,
            'author': self.users[user_id]["username"],
            'message': message,
            'timestamp': int(time.time() * 1000)
        }

        dd = {
            "newmsg" : 0,
            "time": data['timestamp'],
            "lastmsg": data['message']
        }
        if self.users[user_id].get(user2_id):
            dd["newmsg"] = self.users[user_id][user2_id]['newmsg'] + 1
        self.users[user_id][user2_id] = dd

        chat_records = None
        with open(self._gen_filename(user_id, user2_id), 'rb') as f:
            chat_records = pickle.load(f)
        chat_records.append(data)
        with open(self._gen_filename(user_id, user2_id), 'wb') as f:
            pickle.dump(chat_records, f)
        return chat_records


    def add_user(self, email, username, name, password):
        while True:
            # this is not safe random but it is ok for this use
            # https://stackoverflow.com/questions/3530294/how-to-generate-unique-64-bits-integers-from-python
            user_id = getrandbits(64)
            if not user_id in self.users:
                self.users[user_id] = {
                    "username": username, "email": email, "name": name, "password": password, "friends": [], 'cash':{}}
                self.users_by_name[username] = user_id
                break

        with open('users.pickle', 'wb') as f:
            pickle.dump(self.users, f)

        return user_id


    def start_chat(self, user_id, user2_id):
        user_id, user2_id = int(user_id), int(user2_id)
        if not self.users[user_id].get('friends'): # if users dose not have frinds 
            self.users[user_id]['friends'] = []

        if user2_id not in self.users[user_id]['friends']: # we will add user now
            # create chat file
            with open(self._gen_filename(user_id, user2_id), 'bw+') as f:
                pickle.dump(list(), f)
            # update user profile
            self.users[user_id]['friends'].append(user2_id)
            self.users[user2_id]['friends'].append(user_id)
            with open('users.pickle', 'wb') as f:
                pickle.dump(self.users, f)

            
# db like instance
db = data()

# decorator for verifying the JWT
def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = None
        print(request.headers)
        # jwt is passed in the request header
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        elif request.args.get('token'):
            token = request.args.get('token')
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
        return func(user_id=user_id, *args, **kwargs)

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
    
    # if not FILE_REGEX.match(data['username'].lower()):
    #     return make_response(jsonify({'error': "usernaem must only contain [ a-z 0-9 and _ ]"}), 400)

    user_id = db.add_user(data['email'].lower(),
                          data['username'].lower(), data['name'], md5(data['password'].encode('utf-8')).hexdigest())

    # generate token
    token = jwt.encode({
        'id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'])

    return make_response(jsonify({'token': token.decode('UTF-8'), 'username': data.get('username')}), 200)


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
def profile(user_id, *argv, **kwargs):
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


@app.route('/api/search/<username>', methods=['GET'])
@app.route('/api/search', methods=['POST', 'GET'])
@token_required
def search(user_id, username=None, *argv, **kwargs):
    ans = []
    if request.method == 'POST':
        d = request.get_json(force=True)
        username = d.get('username').lower()
    if request.method == 'GET' and not username:
        username = request.args.get('username')   
    print(username)
    print(db.users)
    if username and db.users:
        for uid, ddd in db.users.items():
            if username in ddd['username']:
                obj = {
                    'name': db.users[uid]['name'],
                    'username': db.users[uid]['username'],
                    'avatar': "#"
                }
                ans.append(obj)
    return make_response(jsonify(ans), 200)


@app.route('/api/chat/<username>', methods=['GET', 'POST'])
@token_required
def chat(user_id, username, *argv, **kwargs):
    user2_id = db.users_by_name.get(username.lower())
    if user2_id:
        db.start_chat(user_id, user2_id)
    else:
        return make_response(jsonify({'error': "user not found."}), 400)
    
    if request.method == 'POST':
        d = request.get_json(force=True)
        db.save_chat(d.get('msg', "NO data sent."), user_id, user2_id)
        return jsonify(success=True)
    else:
        return make_response(jsonify(db.read_chat(user_id, user2_id)), 200)


@app.route('/api/chats', methods=['GET', "POST"])
@token_required
def conversations(user_id, *argv, **kwargs):
    res = []
    print(db.users)
    for ids in db.users[user_id].get('friends', []):
        profile = {
            'name': db.users[ids]['name'],
            'username': db.users[ids]['username'],
            'avatar': "#"
        }
        gg = db.users[ids].get(user_id, {
            "newmsg" : 0,
            "time": 0,
            "lastmsg": None
        })
        res.append({
            "profile": profile,
            "newmsg" : gg['newmsg'],
            "time": gg['time'],
            "lastmsg": gg['lasmsg']
        })

    newlist = sorted(res, key=lambda k: k['time']) 
    return make_response(jsonify(newlist), 200)


app.run()
