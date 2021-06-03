from flask import Flask, render_template, render_template_string, request
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
import time
import json
import tictactoe as tt

app = Flask(__name__)

players = {}
rooms = {}

@app.route("/")
def home():
    return render_template("index.html",player_id=len(players)+1,rooms=rooms.keys())

@app.route("/pipe")
def pipe():
    global players
    global rooms
    if request.environ.get("wsgi.websocket"):
        ws = request.environ["wsgi.websocket"]
        cp = None
        oponent_ws = None
        room_id = None
        mode = None
        ws.send(json.dumps({"cmd":"init"}))
        while True:
            time.sleep(1)
            data = ws.receive()
            if data:
                data = json.loads(data)
                if data["cmd"] == "init":
                    players[data["id"]] = ws
                elif data["cmd"] == "room":
                    if data["mode"] == "bot":
                        mode = "bot"
                        cp = tt.tictactoe()
                        ws.send(json.dumps({"cmd":"start","turn":1}))
                    elif data["mode"] == "vs":
                        players[data["id"]] = ws
                        mode = "vs"
                        room_id = str(len(rooms) + 1)
                        rooms[room_id] = {}
                        rooms[room_id]["player1"] =  data["id"]
                        response = {"cmd":"new_room","room":room_id}
                        for elem in players:
                            players[elem].send(json.dumps(response))
                elif data["cmd"] == "join":
                    mode = "vs"
                    room_id = str(data["room"])
                    if len(rooms[room_id]) > 1:
                        response = {"cmd":"error","msg":"room is full"}
                        ws.send(json.dumps(response))
                    else:
                        rooms[room_id]["player2"] = data["id"]
                        response1 = {"cmd":"start","turn":1}
                        response2 = {"cmd":"start","turn":2}
                        oponent_ws = players[rooms[room_id]["player1"]]
                        oponent_ws.send(json.dumps(response1))
                        ws.send(json.dumps(response2))   
                elif data["cmd"] == "move":
                    move = data["move"]
                    if mode == "bot":
                        cp.mark(1,move[0],move[1])
                        if cp.winner() == tt.NO_WINNER:
                            best_move = cp.get_best_move(2)
                            cp.mark(2,best_move[0],best_move[1])
                            response = {"cmd":"move","move":best_move}
                            ws.send(json.dumps(response))
                    elif mode == "vs":
                        if not oponent_ws:
                            oponent_ws = players[rooms[room_id]["player2"]]
                        response = {"cmd":"move","move":move}
                        oponent_ws.send(json.dumps(response))
                elif data["cmd"] == "leave_room":
                    if room_id in rooms.keys():
                        del rooms[room_id]
                        oponent_ws.send(json.dumps({"cmd":"leave_room"}))   
                    break
    ws.send(json.dumps({"cmd":"finish"}))
    return ""
if __name__ == "__main__":
    server = WSGIServer(("0.0.0.0",8080),app,handler_class=WebSocketHandler)
    server.serve_forever()
    # app.run(host="localhost",port=8080)
