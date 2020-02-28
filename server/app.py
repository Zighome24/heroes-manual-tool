from flask import (
    Flask, request, jsonify
)
import json

app = Flask(__name__)

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/training')
def training():
    return app.send_static_file('training.html')

@app.route('/quizzes')
def quizzes():
    return app.send_static_file('quizzes.html')

@app.route('/training-json', methods=['POST', 'GET'])
def trainingJ():
    if request.method == 'POST':
        content = json.dumps(request.json)
        print(content)
        f = open("./static/data/training.json", "w")
        f.write(content)
        return {
            "status" : "ok"
        }
    elif request.method == 'GET':
        f = open("./static/data/training.json", "r")
        content = json.loads(f.read())
        print(content)
        return jsonify(content)
    return {
        "status" : "bad"
    }

@app.route('/quizzes-json', methods=['POST', 'GET'])
def quizzesJ():
    if request.method == 'POST':
        content = json.dumps(request.json)
        print(content)
        f = open("./static/data/quizzes.json", "w")
        f.write(content)
        return {
            "status" : "ok"
        }
    elif request.method == 'GET':
        f = open("./static/data/quizzes.json", "r")
        content = json.loads(f.read())
        return jsonify(content)
        
    return {
        "status" : "bad"
    }