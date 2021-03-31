import random
import time

def measureTime(g):
    def wrapper(*args):
        score = 0
        b = time.time()
        score = g(*args)
        a = time.time()
        return a-b,score
    return wrapper

def getRandomNumber(digits):
    a = 10**(digits - 1)
    b = 10**(digits)
    return random.randint(a,b)

def getRandomOp(op):
    n = len(op)
    return op[random.randint(0,n-1)]

def getLevelInfo(level):
    digits = 2
    num_terms = 3
    op = '+'
    return digits,num_terms,op

def createQuestion(digits,numTerms,op):
    s = ""
    s += str(getRandomNumber(digits))
    for i in range(1,numTerms):
        s += getRandomOp(op) + str(getRandomNumber(digits))
    return eval(s),s

@measureTime
def runGame(num_questions,num_levels):
    score = 0
    for level in range(1,num_levels):
        digits,num_terms,op = getLevelInfo(level)
        for q in range(num_questions):
            ans,question = createQuestion(digits,num_terms,op)
            print(question,'?')
            user = int(input("Your answer:"))
            if user == ans:
                print(chr(9989))
                score += 1
            else:
                print(chr(10060))
    return score

time,score = runGame(10,2)
print("Your time was :%d \nAnd your score was: %d"%(int(time),score))
