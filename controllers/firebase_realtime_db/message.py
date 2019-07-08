from helpers import async_no_wait
from controllers.firebase_realtime_db import user as user_ctrl
import time, json

def get_messages(db, id_from, id_to):
    messages_odict = db['messages'].order_by_child("direction").equal_to(id_from + "|" + id_to).get()
    messages = list(messages_odict.values())
    messages_items = list(messages_odict.items())

    for key, value in messages_items:
        messages[messages.index(value)]["id"] = key

    print(f"GET ALL MESSAGES FROM {id_from} TO {id_to} ({len(messages)})")
    return messages

def get_discussion(db, id_from, id_to):

    discussion = list()
    
    i = 0
    while i < 2:
        sender = id_from if i == 0 else id_to
        receiver = id_to if i == 0 else id_from

        discussion += get_messages(db, sender, receiver)

        i += 1

    print(f"GET DISCUSSION BETWEEN {id_from} AND {id_to} ({len(discussion)})")
    return sorted(discussion, key=lambda k: k['dateSent']) 

def get_last_message(db, id_from, id_to):
    last_messages = [None] * 2

    message = db['messages'].order_by_child("direction").equal_to(id_from + "|" + id_to).limit_to_last(1).get()
    if message:
        last_messages[0] = list(message.values())[0]
        last_messages[0]["id"] = list(message.keys())[0]
        
    message = db['messages'].order_by_child("direction").equal_to(id_to + "|" + id_from).limit_to_last(1).get()
    if message:
        last_messages[1] = list(message.values())[0]
        last_messages[1]["id"] = list(message.keys())[0]

    print(f"GET LAST MESSAGE FROM {id_from} AND {id_to}")

    # TODO: Refactor
    if not last_messages[0] and not last_messages[1]:
        return {}
    elif not last_messages[1]:
        return last_messages[0]
    elif not last_messages[0]:
        return last_messages[1]
    else:
        return max(last_messages, key=lambda x: x['dateSent'])

def add_message(db, message):
    # We create a composite key, made by the from → to
    message['direction'] = message['from'] + '|' + message['to']

    # We store the current timestamp
    message['dateSent'] = time.time()

    # We add the message
    added_message = db['messages'].push()
    added_message.set(message)

    message['id'] = added_message.key

    print(f"ADD MESSAGE {added_message.key}")

    update_last_message(db, message)

    return {}


@async_no_wait
def update_last_message(db, message):

    # We get our two users with the controller, to have our data already formatted
    user_base = user_ctrl.get_user(db, message["from"])
    interlocutor_base = user_ctrl.get_user(db, message["to"])
    
    i = 0
    while i < 2:
        user = user_base if i == 0 else interlocutor_base
        interlocutor = interlocutor_base if i == 0 else user_base

        # If the user has no contacts, we instantiate a empty array
        if not "contacts" in user:
            user["contacts"] = []

        # We try to find the interlocutor in the contact list. If he's not here, we add an space for him
        var = next((x for x in user["contacts"] if x["user"]["id"] == interlocutor["id"]), None)
        index = user["contacts"].index(var) if var else -1
        if index < 0:
            user["contacts"].append({})
            index = len(user["contacts"]) -1

        # If the contact has no lastMessage, we instantiate a empty one
        if not "lastMessage" in user["contacts"][index]:
            user["contacts"][index]["lastMessage"] = {}

        # We fill the values in the (empty or not) spaces
        user["contacts"][index]["lastMessage"] = message
        user["contacts"][index]["user"] = interlocutor

        # We don't need to add the contacts of a contact of a user when we edit
        # We need it for the next loop though, so we add a different user than the var
        tmp = user
        del tmp["contacts"][index]["user"]["contacts"]
        user_ctrl.edit_user(db, user["id"], tmp)

        print(f"UPDATE USER { user['id'] } LAST MESSAGE")

        i += 1

