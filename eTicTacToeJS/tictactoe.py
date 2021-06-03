import random

symbols = [" ","X","O"]
SUCCESS = 0
NO_WINNER = -1
DRAW = -2
MOVE_NOT_ALLOWED = -3

WIN_SCORE = 4

class tictactoe:
    def __init__(self):
        self.board = [[0]*3 for i in range(3)]
        self.childs = []
        self.move = []
    def __str__(self):
        s ="+-+-+-+\n"
        for i in self.board:
            s += "|"
            for j in i:
                s += symbols[j]+"|"
            s += "\n+-+-+-+\n"
        return s
    def is_empty(self):
        for elem in self.board:
            for i in elem:
                if i:
                    return False
        return True
    def mark(self,player,i,j):
        if self.board[i][j]:
            return MOVE_NOT_ALLOWED
        self.board[i][j] = player
        return SUCCESS
    def winner(self):
        for i in range(3):
            p = self.board[i][0]
            if p:
                for j in range(1,3):
                    if self.board[i][j] != p:
                        break
                if self.board[i][j] == p:
                    return p
            p = self.board[0][i]
            if p:
                for j in range(1,3):
                    if self.board[j][i] != p:
                        break
                if self.board[j][i] == p:
                    return p
        p = self.board[0][0]
        if p:
            for i in range(1,3):
                if self.board[i][i] != p:
                    break
            if self.board[i][i] == p:
                return p
        p = self.board[0][2]
        if p:
            for i in range(1,-1,-1):
                if self.board[2-i][i] != p:
                    break
            if self.board[2-i][i] == p:
                return p
        for i in range(3):
            for j in range(3):
                if not self.board[i][j]:
                    return NO_WINNER
        return DRAW
    def clone(self):
        tmp = tictactoe()
        for i in range(3):
            tmp.board[i] = self.board[i].copy()
        return tmp
    # minmax is true then maximize score
    # minmax is false then minimize score
    def calculate_score(self,p,minmax=True,alpha=-999,beta=999,depth = 1): 
        self.childs = []
        winner = self.winner()
        if winner != NO_WINNER:
            s = depth if minmax else -depth
            self.score = 0 if winner == DRAW else WIN_SCORE*s if winner==p else -s*WIN_SCORE
            return self.score        
        if minmax:
            self.score = -999
        else:
            self.score = 999
        stop = False
        for i in range(3):
            for j in range(3):
                tmp = self.clone()
                if tmp.mark(p,i,j) == SUCCESS:
                    tmp.move = [i,j]
                    self.childs.append(tmp)
                    if minmax:
                        score = tmp.calculate_score(p%2+1,minmax=not minmax,alpha=self.score,beta=beta,depth=depth/2)
                        if score>self.score:
                            self.score = score
                        if score>beta:
                            stop = True
                            break
                    else:
                        score = tmp.calculate_score(p%2+1,minmax=not minmax,alpha=alpha,beta=self.score,depth=depth/2)
                        if score<self.score:
                            self.score = score
                        if score<alpha:
                            stop = True
                            break
            if stop:
                break
        return self.score
    def print_childs(self,depth=0):
        print(depth*" ",self.move,self.score)
        for child in self.childs:
            child.print_childs(depth=depth+2)
    def get_num_nodes(self):
        s = 0
        for child in self.childs:
            s += 1
            s += child.get_num_nodes()
        return s
    def get_best_move(self,p):
        if self.is_empty():
            return int(3*random.random()),int(3*random.random())
        score = self.calculate_score(p)
        for elem in self.childs:
            if elem.score == score:
                return elem.move
        return None
import sys
if __name__ == "__main__":
    t = tictactoe()
    turn = 1 if random.random()>0.5 else 2
    print(t)
    while True:
        if turn == 1:
            i,j = input("move: ").split(" ")
        else:
            t.childs = []
            i,j = t.get_best_move(turn)
        if t.mark(turn,int(i),int(j)) == SUCCESS:
            turn = turn%2 + 1
        print(t)
        if t.winner() != NO_WINNER:
            break
    if t.winner() == DRAW:
        print("DRAW")
    else :
        print("Winner: ",t.winner())
