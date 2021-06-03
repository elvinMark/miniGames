from flask import Flask, render_template, render_template_string,request
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
import json
import time 
app = Flask(__name__)

rooms = {}
room_counter = 0

@app.route("/")
def home():
    return render_template("index.html",rooms = rooms.keys())

@app.route("/room",methods = ["GET","POST"])
def create():
    global room_counter
    global rooms
    if request.method == "POST":
        rooms[str(room_counter)] = {"num_players":1};
        room_counter += 1
        return render_template("room.html",room_number = room_counter-1,player="Player1");

@app.route("/room/<room_number>")
def room(room_number):
    if room_number in rooms.keys():
        if rooms[room_number]["num_players"] == 1:
            rooms[room_number]["num_players"] += 1
            return render_template("room.html",room_number = room_number,player="Player2")
        else:
            return render_template("error.html",room_number = room_number,message = "is full")
    else:
        return render_template("error.html",room_number = room_number, message = " not found")

@app.route("/pipe")
def pipe():
    global rooms
    if request.environ.get("wsgi.websocket"):
        ws = request.environ["wsgi.websocket"]
        ws.send(json.dumps({"cmd":"init"}))
        while True:
            time.sleep(1)
            data = ws.receive()
            if data:
                data = json.loads(data)
                #print(data)
                if data["cmd"] == "init":
                    rooms[data["room"]][data["player"]] = ws
                    if rooms[data["room"]]["num_players"] == 2:
                        response = {"cmd" : "start_choosing"}
                        rooms[data["room"]]["Player1"].send(json.dumps(response))
                        rooms[data["room"]]["Player2"].send(json.dumps(response))
                elif data["cmd"] == "select_color":
                    selected_color = data["data"]
                    player = "Player1" if data["player"] == "Player2" else "Player2"
                    ws1 = rooms[data["room"]][player]
                    response = {"cmd":"select_color","data":selected_color}
                    ws1.send(json.dumps(response))
                elif data["cmd"] == "move":
                    player = "Player1" if data["player"] == "Player2" else "Player2"
                    ws1 = rooms[data["room"]][player]
                    response = {"cmd":"move","data":data["data"]}
                    ws1.send(json.dumps(response))
    ws.close()
    return ""
if __name__ == "__main__":
    server = WSGIServer(("0.0.0.0",8080),app,handler_class=WebSocketHandler)
    server.serve_forever()
    #app.run(host="0.0.0.0",port=8080)
