#!/bin/python
from datetime import datetime, timedelta
from flask import request, jsonify, make_response, Flask
from functools import wraps
import jwt
from pathlib import Path
from random import getrandbits
from flask_cors import cross_origin, CORS
import pickle  # for data storage
import re
from hashlib import md5  # change this for the love of god
import time
from flask_sqlalchemy import SQLAlchemy

# from flask_socketio import SocketIO

app = Flask(__name__)

app.config['SECRET_KEY'] = 'not-that-secret'
app.config["DEBUG"] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

db = SQLAlchemy(app)
# socketio = SocketIO(app)


EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+")
FILE_REGEX = re.compile(r"[\w]{100}")


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    last_online = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(64), nullable=False)


class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user1 = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user2 = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receive = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(4000), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __str__(self):
        return f'id={self.id} s={self.sender} r={self.receive} m=[{self.message}]'


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
            "newmsg": 0,
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
                    "username": username, "email": email, "name": name, "password": password, "friends": [], 'cash': {}}
                self.users_by_name[username] = user_id
                break

        with open('users.pickle', 'wb') as f:
            pickle.dump(self.users, f)

        return user_id

    def start_chat(self, user_id, user2_id):
        user_id, user2_id = int(user_id), int(user2_id)
        if not self.users[user_id].get('friends'):  # if users dose not have frinds
            self.users[user_id]['friends'] = []

        if user2_id not in self.users[user_id]['friends']:  # we will add user now
            # create chat file
            with open(self._gen_filename(user_id, user2_id), 'bw+') as f:
                pickle.dump(list(), f)
            # update user profile
            self.users[user_id]['friends'].append(user2_id)
            self.users[user2_id]['friends'].append(user_id)
            with open('users.pickle', 'wb') as f:
                pickle.dump(self.users, f)


# db_old like instance
db_old = data()


# decorator for verifying the JWT
def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = None
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
            datadata = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            user_id = datadata['id']

        except:
            return make_response(jsonify({
                'error': 'Token is invalid.'
            }), 401)
        # returns the current logged in users contex to the routes
        return func(user_id=user_id, *args, **kwargs)

    return decorated


@app.route('/api/sign-up', methods=['POST'])
@cross_origin()
def signup():
    data = request.get_json(force=True)

    for key in ('email', 'password', 'name', 'username'):
        if not data.get(key):
            return make_response(jsonify({'error': "{'email', 'password', 'name', 'username'} fields are required."}),
                                 400)

    # User.query.all()
    # print(User.query.filter_by(email=data['email'].lower()).first())

    if User.query.filter_by(email=data['email'].lower()).first():
        return make_response(jsonify({'error': "Email is taken."}), 400)

    if User.query.filter_by(username=data['username'].lower()).first():
        return make_response(jsonify({'error': "Username is taken."}), 400)

    if len(data['password']) < 8:
        return make_response(jsonify({'error': "password cant be smaller than 8 chracters"}), 400)

    if not EMAIL_REGEX.match(data['email'].lower()):
        return make_response(jsonify({'error': "Email is not valid."}), 400)

    # if not FILE_REGEX.match(data['username'].lower()):
    #     return make_response(jsonify({'error': "usernaem must only contain [ a-z 0-9 and _ ]"}), 400)

    while True:
        rand_id = getrandbits(32)
        if not User.query.filter_by(id=rand_id).first():
            break

    the_user = User(id=rand_id,
                    username=data['username'].lower(),
                    email=data['email'].lower(),
                    name=data['name'],
                    password=md5(data['password'].encode('utf-8')).hexdigest()
                    )

    db.session.add(the_user)
    db.session.commit()

    # generate token
    token = jwt.encode({
        'id': rand_id,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm="HS256")

    return make_response(jsonify({'token': token, 'username': data.get('username')}), 200)


@app.route('/api/sign-in', methods=['POST'])
@cross_origin()
def login():
    """ this functions will give you your token"""
    post_data = request.get_json(force=True)

    if post_data.get("usernameOrEmail") and post_data.get("password"):
        username = post_data["usernameOrEmail"].lower()
        if EMAIL_REGEX.match(username):
            user = User.query.filter_by(email=username).first()
        else:
            user = User.query.filter_by(username=username).first()

        if user and user.password == md5(post_data['password'].encode('utf-8')).hexdigest():
            token = jwt.encode({
                'id': user.id,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, app.config['SECRET_KEY'], algorithm="HS256")

            return make_response(jsonify({'token': token, "username": user.username}), 200)

        return make_response(jsonify({'error': "username or password is not correct."}), 400)
    else:
        return make_response(jsonify({'error': "password and username is required."}), 400)


@app.route('/api/profile', methods=['GET', 'POST'])
@token_required
@cross_origin()
def profile(user_id, *argv, **kwargs):
    user = User.query.filter_by(id=user_id).first()
    target = {
        'name': user.name,
        'username': user.username,
        'avatar': "#"
    }
    from_data = request.get_json(force=True) if request.method == 'POST' else {'hehe!': "hoho"}
    if from_data.get('username'):
        user = User.query.filter_by(username=from_data['username'].lower()).first()
        if user:
            target = {
                'name': user.name,
                'username': user.username,
                'avatar': "#"
            }
        else:
            return make_response(jsonify({'error': "user not found."}), 400)
    return make_response(jsonify(target), 200)


@app.route('/api/search/<username>', methods=['GET'])
@app.route('/api/search', methods=['POST', 'GET'])
@cross_origin()
@token_required
def search(user_id, username=None, *argv, **kwargs):
    ans = []
    if request.method == 'POST':
        d = request.get_json(force=True)
        username = d.get('username').lower()
    if request.method == 'GET' and not username:
        username = request.args.get('username').lower()

    search_q = "%{}%".format(username)
    users = User.query.filter(User.username.like(search_q) | User.name.like(search_q) | User.email.like(search_q)).all()
    for user in users:
        obj = {
            'name': user.name,
            'username': user.username,
            'avatar': "#"
        }
        ans.append(obj)
    return make_response(jsonify(ans), 200)


@app.route('/api/chat/<username>', methods=['GET', 'POST'])
@cross_origin()
@token_required
def chat(user_id, username, *argv, **kwargs):
    # on post you will send message on get you will reccive all message
    user2 = User.query.filter_by(username=username.lower()).first()
    if not user2:
        return make_response(jsonify({'error': "user not found."}), 400)

    if request.method == 'POST':
        d = request.get_json(force=True)
        the_msg = Message(
            sender=user_id,
            receive=user2.id,
            message=d.get('msg', "NO data sent.")
        )

        db.session.add(the_msg)
        db.session.commit()
        return jsonify(success=True)
    else:
        res_d = []

        # for m in Message.query.all():
        #     print(m)
        # print(f's=user2={user2.id}  r=user_id={user_id}')
        queryies = (
            Message.query.filter_by(sender=user2.id).filter_by(receive=user_id).all(),
            Message.query.filter_by(sender=user_id).filter_by(receive=user2.id).all()
        )
        for messages in queryies:
            for msg in messages:
                le_msg = {
                    'id': msg.id,
                    'author': user2.username,
                    'message': msg.message,
                    'timestamp': msg.timestamp
                }
                res_d.append(le_msg)
        res_d.sort(key=lambda x: x['id'], reverse=False)
        # print(res_d)
        return make_response(jsonify(res_d), 200)

""" this will not work !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"""
@app.route('/api/chats', methods=['GET', "POST"])
@cross_origin()
@token_required
def conversations(user_id, *argv, **kwargs):
    res = []
    print(db_old.users)
    for ids in db_old.users[user_id].get('friends', []):
        profile = {
            'name': db_old.users[ids]['name'],
            'username': db_old.users[ids]['username'],
            'avatar': "#"
        }
        gg = db_old.users[ids].get(user_id, {
            "newmsg": 0,
            "time": 0,
            "lastmsg": None
        })
        res.append({
            "profile": profile,
            "newmsg": gg['newmsg'],
            "time": gg['time'],
            "lastmsg": gg['lasmsg']
        })

    newlist = sorted(res, key=lambda k: k['time'])
    return make_response(jsonify(newlist), 200)


if __name__ == '__main__':
    if not Path('test.db').is_file():
        db.create_all()
    # socketio.run(app)
    app.run()
