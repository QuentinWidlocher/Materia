from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
# app.config['SECRET_KEY'] = 'wypsalbl'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def connect():
    print('Connection')
    emit('welcome')

@socketio.on('message')
def message(message):
    print(message)
    emit('message', message, broadcast=True, include_self=False)

if __name__ == '__main__':
    socketio.run(app)