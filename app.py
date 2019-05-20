from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

app = Flask(__name__, 
            static_folder = "./dist/static",
            template_folder = "./dist")
# app.config['SECRET_KEY'] = 'wypsalbl'
socketio = SocketIO(app)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")

@socketio.on('connect')
def connect():
    emit('welcome')

@socketio.on('message')
def message(message):
    emit('message', message, broadcast=True, include_self=False)

if __name__ == '__main__':
    socketio.run(app)