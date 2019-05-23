import firebase_admin
from firebase_admin import credentials, db
import json
import time

users_db = None
messages_db = None

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
def add_message(message):
    # We create a composite key, made by the from → to
    message['direction'] = message['from'] + '|' + message['to']

    # We store the current timestamp
    message['dateSent'] = time.time()

    # We add the message
    messages_db.push().set(message)

# Returns a user with this ID
def get_user(id):
    user = users_db.child(id).get()
    user["id"] = id
    return json.dumps(user)

# Returns all messages FROM id_from TO id_to based on the direction composite key
def get_messages(id_from, id_to):
    return json.dumps(messages_db.order_by_child("direction").equal_to(id_from + "|" + id_to).get())

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
    
    return json.dumps({"valid": True, "user": user})
    
