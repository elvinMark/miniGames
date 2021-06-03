import random
import math
E = 0
X = 1
O = 2
symbols = [' ','X','O']
class TicTacToe:
    def __init__(self):
        self.board = [E]*9
        self.counter = [[0]*3 for i in range(8)]
        self.best_move = -1
    def check_row(self,r):
        for i in range(3):
            self.counter[2*r+2][self.board[3*r + i]] += 1
    def check_col(self,c):
        for i in range(3):
            self.counter[2*c+3][self.board[3*i + c]] += 1
    def check_diag(self,d):
        for i in range(3):
            self.counter[d][self.board[3*i + d*(2 - i) + (1-d)*i]] += 1
    def check_all(self):
        self.counter = [[0]*3 for i in range(8)]
        for i in range(3):
            self.check_row(i)
            self.check_col(i)
            if i<2:
                self.check_diag(i)
    def check_space(self):
        return 0 in self.board
    def find_winner(self):
        for elem in self.counter:
            if 3 in elem[1:]:
                return elem.index(3)
        return 0
    def player_move(self,pos):
        if self.board[pos] == E:
            self.board[pos] = O
            return True
        return False
    def random_move(self):
        pos = 0
        while self.board[pos]!=E:
            pos = math.floor(8*random.random())
        self.board[pos] = X
    def minimax(self,depth,min_value,max_value):
        self.check_all()
        tmp = self.find_winner()
        if tmp:
            tmp = -1 if tmp == O else tmp
            return tmp/depth
        if not self.check_space():
           return 0
        arr = []
        values = []
        for i in range(9):
            if self.board[i] == E:
                tmp = self.copy()
                tmp.board[i] = X if not depth%2 else O
                arr.append(i)
                minv = min_value if not len(values) else min(values) 
                maxv = max_value if not len(values) else max(values)
                mm = tmp.minimax(depth+1,minv,maxv)
                if not depth%2 and mm>min_value:
                    return mm
                elif depth%2 and mm<max_value:
                    return mm
                values.append(mm)
        if not depth%2:
            self.best_move = arr[values.index(max(values))]
            return max(values)
        else:
            self.best_move = arr[values.index(min(values))]
            return min(values)
    def com_move(self):
        self.minimax(0,100,-100)
        print(self.best_move)
        self.board[self.best_move] = X
        #self.random_move()
        return None
    def __str__(self):
        s = ''
        for i in range(3):
            for j in range(3):
              s += ' '+ symbols[self.board[3*i + j]] + ' '
              if j<2:
                  s += '|'
            if i<2:
                s += '\n------------\n'
            else:
                s += '\n'
        return s
    def copy(self):
        t = TicTacToe()
        t.board = self.board.copy()
        return t
if __name__ == "__main__":
    t = TicTacToe()
    print(t)
    while(1):
        while not t.player_move(int(input('Introduce your move: '))):
            print('Wrong input, try again')
            print(t)
        print('Player Move:')
        print(t)
        t.check_all()
        if t.find_winner():
            print('Player wins')
            break
        if not t.check_space():
            print('It is a tie')
            break
        t.com_move()
        print('Computer Move:')
        print(t)
        t.check_all()
        if t.find_winner():
            print('Computer wins')
            break
    
