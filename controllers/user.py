from flask_jwt_extended import create_access_token

def get_all_users(db):
    users_odict = db['users'].order_by_child("username").start_at("0").get()
    users = list(users_odict.values())
    users_items = list(users_odict.items())

    for key, value in users_items:
        users[users.index(value)]["id"] = key

    print(f"GET ALL USERS ({len(users)})")

    return users

def get_user(db, id):
    user = db['users'].child(id).get()

    if not user:
        return {}

    user["id"] = id

    print(f"GET USER {id}")

    return user

def login(db, body):
    user = db['users'].order_by_child("username").equal_to(body["username"]).get()

    if (not user):
        return {"valid": False, "error": "Username not found"}

    user_id = list(user.keys())[0]
    user = list(user.values())[0]
    user["id"] = user_id

    if (user["password"] != body["password"]):
        return {"valid": False, "error": "Wrong password."}

    jwtoken = create_access_token(identity=user)

    print(f"LOG USER {user_id}")

    return {"valid": True, "jwt": jwtoken}