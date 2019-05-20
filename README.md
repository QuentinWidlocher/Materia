![Materia](http://images2.wikia.nocookie.net/__cb20111023030348/finalfantasy/images/4/4b/Dissidia_-_Cloud_Crystal.png)

# Materia

## What is Materia

Materia is a websocket chat client made with flask and socket.io .
Its goal is not to be better than the others, it's only a training.

## What is Materia made of ?

### Frontend

- Vue.js
- Bootstrap 4

### Backend

- Flask (1.0.3)
- Socket.io

## How to install

### 1) Setup the virtual environement

```
# Linux
python3 -m venv venv

# Windows
py -3 -m venv venv
```

### 2) Activate the virtual environement

```
# Linux
. venv/bin/activate

# Windows
venv\Scripts\activate
```

### 3) Install python requirements

```
pip install -r requirements.txt
```

### 4) Install npm requirements

```
./> npm install
./> cd frontend
./frontend> npm install
```

### 5) Build the frontend

```
./frontend> npm run-script build
```

### 6) Launch the flask server

```
./frontend> cd ..
./> python app.py
```

### 7) Open the served page

Go to `http://127.0.0.1:5000/`