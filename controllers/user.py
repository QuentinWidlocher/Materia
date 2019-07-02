from flask_jwt_extended import create_access_token
import json

def get_all_users(db):
    users_odict = db['users'].order_by_child("username").start_at("0").get()
    users = list(users_odict.values())
    users_items = list(users_odict.items())

    for key, value in users_items:
        users[users.index(value)]["id"] = key

    print(f"GET ALL USERS ({len(users)})")

    return users

def get_user_by_phone(db, phone):
    user = db['users'].order_by_child("phone").equal_to(phone).get()

    print(f"FIND USER BY PHONE {phone}")

    if not user:
        return { "id": None }

    print(list(user.values())[0]["username"])

    return { "id": list(user.keys())[0], "username": list(user.values())[0]["username"] }
    

def get_user(db, id):
    user = db['users'].child(id).get()

    if not user:
        return {}

    user["id"] = id

    if not "contacts" in user:
        user["contacts"] = []

    print(f"GET USER {id}")

    return user

def edit_user(db, id, body):
    return db['users'].child(id).update(body)

def login(db, body):

    user = get_user(db, body["id"])

    # We don't need to pass the users in the jwt
    if "contacts" in user:
        del user["contacts"]

    if (user["password"] != body["password"]):
        return {"valid": False, "error": "Wrong password."}

    jwtoken = create_access_token(identity=user)

    print(f"LOG USER {user['id']}")

    return {"valid": True, "jwt": jwtoken}
