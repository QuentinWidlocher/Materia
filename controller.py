import collections
import firebase_admin
from firebase_admin import credentials, db
import json
import time
from operator import attrgetter
import os
import datetime
from flask_jwt_extended import create_access_token
import asyncio

users_db = None
messages_db = None

SECRET_KEY = "secret"


def get_elapsed_time(f):
    def wrap(*args):
        time1 = time.time()
        ret = f(*args)
        time2 = time.time()
        print('{:s} function took {:.3f} ms'.format(
            f.__name__, (time2-time1)*1000.0))

        return ret
    return wrap


def async_no_wait(f):
    def wrapped(*args, **kwargs):
        return asyncio.get_event_loop().run_in_executor(None, f, *args, *kwargs)

    return wrapped

def init():
    global users_db
    global messages_db

    # We use the credentials.json to connect to the Direbase DB
    cred = credentials.Certificate("./credentials.json")
    firebase_admin.initialize_app(cred, options={
        'databaseURL': 'https://materia-87a70.firebaseio.com'
    })

    # We assign "tables" to the vars
    users_db = db.reference('users')
    messages_db = db.reference('messages')

# Adds a message in the db
@get_elapsed_time
def add_message(message):
    # We create a composite key, made by the from → to
    message['direction'] = message['from'] + '|' + message['to']

    # We store the current timestamp
    message['dateSent'] = time.time()

    # We add the message
    added_message = messages_db.push()
    added_message.set(message)

    message['id'] = added_message.key

    update_last_message(message)

@async_no_wait
def update_last_message(message):
    
    i = 0
    while i < 2:
        userId = message['from'] if i == 0 else message['to']
        interlocutorId = message['to'] if i == 0 else message['from']

        # print('Tour de boucle n°' + str(i+1) + ', msg de ' + userId + ' à ' + interlocutorId)

        user = users_db.child(userId).get()

        if not hasattr(user, 'lastMessages'):
            user['lastMessages'] = {}

        if not hasattr(user['lastMessages'], interlocutorId):
            user['lastMessages'][interlocutorId] = {}

        user['lastMessages'][interlocutorId] = message

        users_db.child(userId).update(user)

        i += 1

# Returns a user with this ID
def get_user(id):
    user = users_db.child(id).get()

    if not user:
        return json.dumps({})

    user["id"] = id
    return json.dumps(user)

# Returns a user with this ID
def get_all_users():
    users_odict = users_db.order_by_child("username").start_at("0").get()
    users = list(users_odict.values())
    users_items = list(users_odict.items())

    for key, value in users_items:
        users[users.index(value)]["id"] = key

    return json.dumps(users)

# Returns all messages FROM id_from TO id_to based on the direction composite key
def get_messages(id_from, id_to):
    messages_odict = messages_db.order_by_child("direction").equal_to(id_from + "|" + id_to).get()
    messages = list(messages_odict.values())
    messages_items = list(messages_odict.items())

    for key, value in messages_items:
        messages[messages.index(value)]["id"] = key

    return json.dumps(messages)

def get_last_message(id_from, id_to):
    last_messages = [None] * 2

    message = messages_db.order_by_child("direction").equal_to(id_from + "|" + id_to).limit_to_last(1).get()
    if message:
        last_messages[0] = list(message.values())[0]
        last_messages[0]["id"] = list(message.keys())[0]
        
    message = messages_db.order_by_child("direction").equal_to(id_to + "|" + id_from).limit_to_last(1).get()
    if message:
        last_messages[1] = list(message.values())[0]
        last_messages[1]["id"] = list(message.keys())[0]

    # TODO: Refactor
    if not last_messages[0] and not last_messages[1]:
        return json.dumps({})
    elif not last_messages[1]:
        return json.dumps(last_messages[0])
    elif not last_messages[0]:
        return json.dumps(last_messages[1])
    else:
        return json.dumps(max(last_messages, key=lambda x: x['dateSent']))



# Try to login
def login(body):
    user = users_db.order_by_child("username").equal_to(body["username"]).get()

    if (not user):
        return json.dumps({"valid": False, "error": "Username not found"})

    user_id = list(user.keys())[0]
    user = list(user.values())[0]
    user["id"] = user_id

    if (user["password"] != body["password"]):
        return json.dumps({"valid": False, "error": "Wrong password."})

    jwtoken = create_access_token(identity=user)

    return json.dumps({"valid": True, "jwt": jwtoken})
    
    
