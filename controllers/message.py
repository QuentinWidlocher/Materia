from helpers import async_no_wait
from controllers import user as user_ctrl
import time

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


# @async_no_wait
def update_last_message(db, message):

    user_base = user_ctrl.get_user(db, message["from"])
    del user_base["id"]
    del user_base["contacts"]

    interlocutor_base = user_ctrl.get_user(db, message["to"])
    del interlocutor_base["id"]
    del interlocutor_base["contacts"]
    
    i = 0
    while i < 2:
        print(user_base, interlocutor_base)
        user = user_base if i == 0 else interlocutor_base
        interlocutor = interlocutor_base if i == 0 else user_base

        if not hasattr(user, "contacts"):
            user["contacts"] = {}

        if not hasattr(user["contacts"], interlocutor["id"]):
            user["contacts"][interlocutor["id"]] = {}

        if not hasattr(user["contacts"][interlocutor["id"]], "lastMessage"):
            user["contacts"][interlocutor["id"]]["lastMessage"] = {}

        user["contacts"][interlocutor["id"]]["lastMessage"] = message
        user["contacts"][interlocutor["id"]]["user"] = interlocutor

        user_ctrl.edit_user(db, userId, user)

        print(f"UPDATE USER {userId} LAST MESSAGE")

        i += 1

