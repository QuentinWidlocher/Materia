from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS, cross_origin
from flask_jwt_extended import JWTManager, jwt_required
from controllers.firebase_realtime_db import controller as ctrl
import routes
import datetime

app = Flask(__name__, 
            static_folder = "./dist/static",
            template_folder = "./dist")

app.config["HOST"] = "0.0.0.0"
app.config["PORT"] = "5000"

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

# Change this!
app.config["JWT_SECRET_KEY"] = "N0uQzxIYpPPjtR9zS6nDtc5OqnjRu5xruzJLXcRBiORHgksfp5bIaPRbgtivEprj"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(seconds=(60*60*8)) # 8h
jwt = JWTManager(app)

socketio = SocketIO(app)

json = {"content-type": "application/json"}

##
### API
##

# Get all users
@app.route(routes.user_base + "/", methods=["GET"])
@app.route(routes.user_base      , methods=["GET"])
@cross_origin()
@jwt_required
def get_all_users():
    return ctrl.get_all_users(), json

# Get a user
@app.route(routes.user_unique + "/", methods=["GET"])
@app.route(routes.user_unique      , methods=["GET"])
@cross_origin()
@jwt_required
def get_user(id):
    return ctrl.get_user(id), json

# Get a user
@app.route(routes.user_unique_phone + "/", methods=["GET"])
@app.route(routes.user_unique_phone      , methods=["GET"])
@cross_origin()
def get_user_by_phone(phone):
    return ctrl.get_user_by_phone(phone), json

# Update a user
@app.route(routes.user_unique + "/", methods=["PUT"])
@app.route(routes.user_unique      , methods=["PUT"])
@cross_origin()
@jwt_required
def edit_user(id):
    return ctrl.edit_user(id, request.get_json()), json

# Create user
@app.route(routes.user_base + "/", methods=["POST"])
@app.route(routes.user_base      , methods=["POST"])
@cross_origin()
def create_user():
    return ctrl.create_user(request.get_json()), json

# Try to login
@app.route(routes.user_login + "/", methods=["POST"])
@app.route(routes.user_login      , methods=["POST"])
@cross_origin()
def login():
    return ctrl.login(request.get_json()), json

# Get the last message of a conversation
@app.route(routes.message_last + "/", methods=["GET"])
@app.route(routes.message_last      , methods=["GET"])
@cross_origin()
@jwt_required
def get_last_message(id_from, id_to):
    return ctrl.get_last_message(id_from, id_to), json
    
# Get all messages FROM id_from TO id_to
@app.route(routes.message_direction + "/", methods=["GET"])
@app.route(routes.message_direction      , methods=["GET"])
@cross_origin()
@jwt_required
def get_messages(id_from, id_to):
    return ctrl.get_discussion(id_from, id_to), json



##
### INTERFACE
##

# All other path lead to index.html (VueJS)
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return render_template("index.html")


##
### SOCKET IO
##

# On client connecting
@socketio.on("connect")
def connect():
    emit("welcome")

# On message sent
@socketio.on("message")
def message(message):

    # We add the message to the DB
    ctrl.add_message(message)

    # We transmit the message to everyone else
    # TODO: Use a room system to transmit only to concerned people
    emit("message", message, broadcast=True, include_self=False)

# On user activity changed
@socketio.on("activity")
def activity(data):
    print(f"User {data['userId']} is {'active' if data['active'] else 'inactive'}")
    ctrl.edit_user(data["userId"], { "active": data["active"]})

    # We transmit the activity to everyone else
    # TODO: Use a room system to transmit only to concerned people
    emit("activity", data, broadcast=True, include_self=False)

if __name__ == "__main__":
    
    # We initialize the Firebase DB first
    ctrl.init()

    print("")
    print(" * Serving Flask app")
    print(" * Environment: " + app.config["ENV"])
    print(" * Debug mode: " + ("on" if app.config["DEBUG"] else "off"))
    print(" * Running on http://" + app.config["HOST"] + ":" + app.config["PORT"] + "/")
    print("")

    socketio.run(app, host=app.config["HOST"], port=app.config["PORT"])
