import firebase_admin
from firebase_admin import credentials, db
from helpers import get_elapsed_time
from controllers import user as user_ctrl, message as message_ctrl
import json

database = None

SECRET_KEY = "secret"

def init():
    global database

    # We use the credentials.json to connect to the Direbase database
    cred = credentials.Certificate("./credentials.json")
    firebase_admin.initialize_app(cred, options={
        'databaseURL': 'https://materia-87a70.firebaseio.com'
    })

    # We assign "tables" to the vars
    database = {
        "users" : db.reference('users'),
        "messages" : db.reference('messages'),
    }



### USERS

# Returns a user with this ID
def get_all_users():
    return json.dumps(user_ctrl.get_all_users(database))

# Returns a user with this ID
def get_user(id):
    return json.dumps(user_ctrl.get_user(database, id))

# Edit a user with this ID, using the body
def edit_user(id, body):
    return json.dumps(user_ctrl.edit_user(database, id, body))

# Try to login
def login(body):
    return json.dumps(user_ctrl.login(database, body))



### MESSAGES

# Returns all messages FROM id_from TO id_to based on the direction composite key
def get_messages(id_from, id_to):
    return json.dumps(message_ctrl.get_messages(database, id_from, id_to))

def get_discussion(id_from, id_to):
    return json.dumps(message_ctrl.get_discussion(database, id_from, id_to))

# Return the last message of a discussion
def get_last_message(id_from, id_to):
    return json.dumps(message_ctrl.get_last_message(database, id_from, id_to))

# Adds a message in the database
def add_message(message):
    return json.dumps(message_ctrl.add_message(database, message))
