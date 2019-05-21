import firebase_admin
from firebase_admin import credentials, db
import json

users_db = None
messages_db = None

def init():
    global users_db
    global messages_db

    cred = credentials.Certificate("./credentials.json")
    firebase_admin.initialize_app(cred, options={
        'databaseURL': 'https://materia-87a70.firebaseio.com'
    })
    users_db = db.reference('users')
    messages_db = db.reference('messages')

def add_message(message):
    messages_db.push().set(json.loads(message))