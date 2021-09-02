import random
import time
import argparse

parser = argparse.ArgumentParser("This is a simple math game!")

parser.add_argument("--levels",type=int,default=1,help="specify the number of levels you want to play")
parser.add_argument("--questions",type=int,default=10,help="specify the number of questions in each level")

args = parser.parse_args()

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
def runLevel(num_questions,level):
    score = 0
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

def wait(s):
    for i in range(s):
        print(f"{i}...")
        time.sleep(1)

def runGame(num_questions,num_levels):
    for level in range(1,num_levels + 1):
        input(f"Level: {level}")
        wait(3)
        time, score = runLevel(num_questions,level)
        print("Your time was :%d min. %d sec. \nAnd your score was: %d"%(time//60,time%60,score))

runGame(args.questions,args.levels)
