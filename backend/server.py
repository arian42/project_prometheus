#!/bin/python
from datetime import datetime, timedelta
from flask import request, jsonify, make_response, Flask, send_from_directory
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
from werkzeug.utils import secure_filename
import uuid

app = Flask(__name__)

app.config['SECRET_KEY'] = 'not-that-secret'
app.config["DEBUG"] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['UPLOAD_FOLDER'] = Path(__file__).parent.absolute() / 'uploads'
app.config['UPLOAD_EXTENSIONS'] = ('.jpg', '.png', '.gif')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
db = SQLAlchemy(app)

print(app.config['UPLOAD_FOLDER'])

EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+")
FILE_REGEX = re.compile(r"[\w]{100}")


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    last_online = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(64), nullable=False)
    image = db.Column(db.String(255), nullable=False, default="default.png")


class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_s = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_r = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    new_msg = db.Column(db.Integer, nullable=False)
    last_msg_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receive = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(4000), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __str__(self):
        return f'id={self.id} s={self.sender} r={self.receive} m=[{self.message}]'


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


@app.route('/img/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename) # as_attachment=True


@app.route('/api/profile', methods=['GET', 'POST'])
@token_required
@cross_origin()
def profile(user_id, *argv, **kwargs):
    user = User.query.filter_by(id=user_id).first()
    target = {
        'name': user.name,
        'username': user.username,
        'avatar': '/img/' + user.image,
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


@app.route('/api/profile-update', methods=['POST'])
@token_required
@cross_origin()
def profile_upload(user_id, *argv, **kwargs):
    user = User.query.filter_by(id=user_id).first()
    # check if the post request has the file part
    if 'file' not in request.files:
        return make_response(jsonify({'error': "no file is sent."}), 400)
    file = request.files['file']
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        return make_response(jsonify({'error': "no file is sent."}), 400)
    if file and file.filename.lower()[-4:] in ('.png', '.jpg'):
        # filename = secure_filename(file.filename)
        filename = uuid.uuid4().hex + '.' + file.filename.split('.')[-1].lower()
        user.image = filename
        file.save(Path(app.config['UPLOAD_FOLDER'], filename))
    # Update other profile pram
    d = request.get_json(force=True)
    for key in ('username', 'name'):
        if d.get(key):
            user[key] = d.get(key)
    db.session.commit()

    target = {
        'name': user.name,
        'username': user.username,
        'avatar': '/img/' + user.image,
    }
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
        if user.id == user_id:
            continue
        obj = {
            'name': user.name,
            'username': user.username,
            'avatar': '/img/' + user.image
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

        # check if they are friends
        friend = Chat.query.filter_by(user_s=user_id, user_r=user2.id).first()
        if not friend:
            # make them friends
            friend1 = Chat(user_s=user_id, user_r=user2.id, new_msg=1)
            friend2 = Chat(user_r=user_id, user_s=user2.id, new_msg=0)
            db.session.add(friend1)
            db.session.add(friend2)
        else:
            friend.new_msg += 1

        # don't forget to commit
        db.session.commit()
        return jsonify(success=True)
    else:
        res_d = []

        # set my messages to 0 after view
        friend = Chat.query.filter_by(user_s=user2.id, user_r=user_id).first()
        if friend:
            friend.new_msg = 0
        db.session.commit()

        messages = Message.query.filter_by(sender=user_id, receive=user2.id).all()
        my_fucking_username = User.query.filter_by(id=user_id).first()
        for msg in messages:
            le_msg = {
                'id': msg.id,
                'author': my_fucking_username.username,
                'message': msg.message,
                'timestamp': msg.timestamp
            }
            res_d.append(le_msg)

        messages = Message.query.filter_by(sender=user2.id, receive=user_id).all()
        for msg in messages:
            le_msg = {
                'id': msg.id,
                'author': user2.username,
                'message': msg.message,
                'timestamp': msg.timestamp
            }
            res_d.append(le_msg)

        res_d.sort(key=lambda x: x['id'], reverse=False)
        return make_response(jsonify(res_d), 200)


@app.route('/api/chats/<sq>', methods=['GET', "POST"])
@app.route('/api/chats', methods=['GET', "POST"])
@cross_origin()
@token_required
def conversations(user_id, sq=None, *argv, **kwargs):
    res = []
    friends = Chat.query.filter_by(user_r=user_id)
    for f in friends:
        # last message of oposite/other user
        last_message_o = Message.query.filter_by(sender=f.user_s, receive=user_id) \
            .order_by(Message.id.desc()).first()
        # .order_by('-id').first()

        # my last message
        last_message_me = Message.query.filter_by(receive=f.user_s, sender=user_id) \
            .order_by(Message.id.desc()).first()

        # this will select newest message bettwin sender and reciver
        if last_message_o and last_message_me:
            if last_message_me.timestamp > last_message_o.timestamp:
                lm = last_message_me
            else:
                lm = last_message_o
        else:
            # one of them is null
            if last_message_o:
                lm = last_message_o
            elif last_message_me:
                lm = last_message_me
            else:
                # this should not happen normally
                class why_this_exist:
                    def __init__(self):
                        self.timestamp = ""
                        self.message = "-- Removed --"
                lm = why_this_exist()

        if f.user_s == user_id:
            continue
        le_user = User.query.filter_by(id=f.user_s).first()
        res.append({
            'name': le_user.name,
            'username': le_user.username,
            'avatar': '/img/' + le_user.image,
            "newmsg": f.new_msg,
            "time": lm.timestamp,
            "lastmsg": lm.message
        })

    newlist = sorted(res, key=lambda k: k['time'])
    # filter query if SQ is provided
    if sq:
        for num, item in enumerate(newlist):
            if sq.lower() not in item['username'].lower():
                newlist.pop(num)

    return make_response(jsonify(newlist), 200)


@app.route('/api/delete-msg/<msg_id>', methods=['GET', "POST"])
@cross_origin()
@token_required
def delete_msg(user_id, msg_id, *argv, **kwargs):
    msg = Message.query.filter_by(id=msg_id, sender=user_id).first()
    if msg:
        db.session.delete(msg)
        db.session.commit()
    else:
        return make_response(jsonify({'error': "request denied."}), 403)


@app.route('/api/delete-update/<msg_id>', methods=["POST"])
@cross_origin()
@token_required
def update_msg(user_id, msg_id, *argv, **kwargs):
    d = request.get_json(force=True)
    msg = Message.query.filter_by(id=msg_id, sender=user_id).first()
    if msg and d.get('msg'):
        msg.message = d['msg']
        db.session.commit()
    else:
        return make_response(jsonify({'error': "request denied."}), 403)


if __name__ == '__main__':
    if not Path('test.db').is_file():
        db.create_all()
    if not Path(app.config['UPLOAD_FOLDER']).exists():
        Path(app.config['UPLOAD_FOLDER']).mkdir()
    app.run()
