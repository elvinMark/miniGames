SUCCESS = 0
MOVE_NOT_ALLOWED = -1
NORMAL = 1
CHECK = 2
CHECK_MATE = 3
BLACK = 0
WHITE = 1

piece_color = ["black","white"]

pieces_order = ["rook","knight","bishop","queen","king","bishop","knight","rook"]

dict_piece = {"rook":"^","knight":"$","bishop":"&","queen":"*","king":"+","pawn":"!"}

directions = {"rook":[[-1,0],[1,0],[0,1],[0,-1]],"bishop":[[-1,1],[1,1],[1,-1],[-1,-1]],"queen":[[-1,0],[1,0],[0,1],[0,-1],[-1,1],[1,1],[1,-1],[-1,-1]],"knight":[[2,1],[-2,1],[2,-1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]}

check_lower = lambda x : x > 0
check_upper = lambda x : x < 7

check = lambda x : x >= 0 and x <= 7

def get_indexes(pos):
    return [56 - ord(pos[1]) ,ord(pos[0]) - 97]
def get_pos(indexes):
    return chr(indexes[1] + 97) + chr(56 - indexes[0])

def generate_pos_at_dir(pos,di,dj,just_one=False):
    i,j = get_indexes(pos)
    i += di
    j += dj
    while check(i) and check(j):
        yield i,j
        if just_one:
            break
        i += di
        j += dj

def get_possible_moves(p,b):
    out = []
    if p.piece_type == "pawn":
        s = 1 if p.color == "white" else -1
        cond = check_lower if p.color == "white" else check_upper
        i,j = p.get_indexes()
        print(i,j)
        if cond(i):
            if j>0:
                if b[i-s][j-1] and p.attack:
                    if b[i-s][j-1].color != p.color:
                        out.append(get_pos([i-s,j-1]))
            if j<7:
                if b[i-s][j+1] and p.attack:
                    if b[i-s][j+1].color != p.color:
                        out.append(get_pos([i-s,j+1]))
            if not b[i-s][j]:
                out.append(get_pos([i-s,j]))
        if cond(i-s) and not p.moves:
            if not b[i-s][j]:
                out.append(get_pos([i - 2*s,j]))
    elif p.piece_type == "rook" or p.piece_type == "queen" or p.piece_type == "bishop":
        for di,dj in directions[p.piece_type]:
            for i,j in generate_pos_at_dir(p.pos,di,dj):
                if b[i][j]:
                    if b[i][j].color != p.color:
                        out.append(get_pos([i,j]))
                    break
                out.append(get_pos([i,j]))
    elif p.piece_type == "knight":
        i,j = p.get_indexes()
        for di,dj in directions["knight"]:
            ni = i+di
            nj = j+dj
            if check(ni) and check(nj):
                if b[ni][nj]:
                    if b[ni][nj].color == p.color:
                        continue
                out.append(get_pos([ni,nj]))
    elif p.piece_type == "king":
        i,j = p.get_indexes()
        for di,dj in directions["queen"]:
            ni = i+di
            nj = j+dj
            if check(ni) and check(nj):
                if b[ni][nj]:
                    if b[ni][nj].color == p.color:
                        continue
                out.append(get_pos([ni,nj]))
    return out

class piece:
    def __init__(self,color,piece_type,pos):
        self.color = color
        self.piece_type = piece_type
        self.pos = pos
        self.moves = []
        self.attack = False
    def __str__(self):
        return ("B" if self.color == "black" else "W") + dict_piece[self.piece_type]
    def get_indexes(self):
        return get_indexes(self.pos)
    def move(self,pos):
        self.moves.append(pos)
        self.pos = pos
        self.attack = False
    def can_eat_to(self,p):
        return self.color!= p.color
    def set_to_attack(self):
        self.attack = True

class chess:
    def __init__(self):
        self.board = [[None]*8 for i in range(8)]
        self.black_pieces = []
        self.white_pieces = []
        self.black_eaten_pieces = []
        self.white_eaten_pieces = []
        self.white_king = None
        self.black_king = None
        for i in range(8):
            self.black_pieces.append(piece("black",pieces_order[i],get_pos([0,i])))
            self.black_pieces.append(piece("black","pawn",get_pos([1,i])))
            self.white_pieces.append(piece("white",pieces_order[i],get_pos([7,i])))
            self.white_pieces.append(piece("white","pawn",get_pos([6,i])))
        for k in range(16):
            if self.black_pieces[k].piece_type == "king":
                self.black_king = self.black_pieces[k]
            if self.white_pieces[k].piece_type == "king":
                self.white_king = self.white_pieces[k]
            i,j = self.black_pieces[k].get_indexes()
            self.board[i][j] = self.black_pieces[k]
            i,j = self.white_pieces[k].get_indexes()
            self.board[i][j] = self.white_pieces[k]
    def __str__(self):
        s = "  -- -- -- -- -- -- -- --\n"
        for i in range(8):
            s += str(8-i) + "|"
            for j in range(8):
                s += ("  " if self.board[i][j] == None else str(self.board[i][j])) + "|"
            if i < 7:
                s += "\n +--+--+--+--+--+--+--+--+\n"
        s +="\n  -- -- -- -- -- -- -- --\n"
        s += "   a  b  c  d  e  f  g  h\n"
        return s
    
    def at(self,pos):
        i,j = get_indexes(pos)
        return self.board[i][j]
    def get_possible_moves(self,p):
        return get_possible_moves(p,self.board)
    def can_move_to(self,p,pos):
        return pos in self.get_possible_moves(p)
    def lookfor_check(self,color):
        possible_moves = []
        if color == "white":
            for p in self.black_pieces:
                possible_moves += self.get_possible_moves(p)
            if self.white_king.pos in possible_moves:
                return True
        elif color == "black":
            for p in self.white_pieces:
                possible_moves += self.get_possible_moves(p)
            if self.white_king.pos in possible_moves:
            return True
        return False
    def check_status(self,color):
        status = NORMAL
        if color == "white":
            check_status = lookfor_check(color)
            if check_status:
                status = CHECK        
        elif color == "back":
            status = CHECK
        return status
    def move(self,pos1,pos2):
        p1 = self.at(pos1)
        p2 = self.at(pos2)
        if p2 and p1:
            p1.set_to_attack()
        if p1:
            if self.can_move_to(p1,pos2):
                if p2:
                    if p1.can_eat_to(p2):
                        if p2.color == "white":
                            idx = self.white_pieces.index(p2)
                            self.white_pieces.pop(idx)
                            self.white_eaten_pieces.append(p2)
                        else:
                            idx = self.black_pieces.index(p2)
                            self.black_pieces.pop(idx)
                            self.black_eaten_pieces.append(p2)
                    else:
                        return MOVE_NOT_ALLOWED
                i1,j1 = p1.get_indexes()
                i2,j2 = get_indexes(pos2)
                p1.move(pos2)
                self.board[i1][j1] = None
                self.board[i2][j2] = p1
                return
            else:
                return MOVE_NOT_ALLOWED
        else:
            return MOVE_NOT_ALLOWED

c = chess()
print(c)
while True:
    pos1,pos2 = input().split(" ")
    c.move(pos1,pos2)
    print(c)
