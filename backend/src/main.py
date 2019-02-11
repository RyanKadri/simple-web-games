from flask import Flask, request, jsonify
from functools import reduce

app = Flask(__name__)

ME = 2
OPPONENT = 1
BLANK = 0

WIN = 1
LOSS = 2
TIE = 3
ONGOING = 4

nextMoveDict = {}

@app.route("/api/nextMove", methods=["POST"])
def calcMove():
    board = request.json
    nextMove = calcNextMove(board)
    return jsonify(nextMove)

def precalcMoves(board, currentPlayer = OPPONENT):

    hash = hashBoard(board)
    precalcVal = nextMoveDict.get(hash)
    if precalcVal != None:
        return precalcVal[1]

    best = None
    bestScore = None
    totalScore = 0
    opponent = otherPlayer(currentPlayer)
    free = freeSpaces(board)

    for space in free:
        board[space[0]][space[1]] = currentPlayer

        outcome = checkOutcome(board, currentPlayer)
        if outcome == WIN:
            score = 1
        elif outcome == TIE:
            score = 0
        else:
            score = -(1/len(free)) * precalcMoves(board, opponent)

        totalScore += score
        if bestScore == None or score > bestScore:
            best = space
            bestScore = score
        board[space[0]][space[1]] = BLANK
    nextMoveDict[hash] = (best, totalScore)
    return totalScore
    
def hashBoard(board):
    hash = 0
    for rowInd, row in enumerate(board):
        for colInd, col in enumerate(row):
            ind = 3 * rowInd + colInd
            hash += col * 3 ** ind
    return hash

def calcNextMove(board):
    hash = hashBoard(board)
    move, _ = nextMoveDict.get(hash)
    return { "row": move[0], "column": move[1] }

def freeSpaces(board):
    allSpaces = [(x,y) for x in range(0,3) for y in range(0,3)]
    free = [space for space in allSpaces if board[space[0]][space[1]] == BLANK]
    return free

TRIPLES_TO_CHECK = [
    [(0,0), (1,1), (2,2)],
    [(2,0), (1,1), (0,2)]
] + [[(x,y) for x in range(3)] for y in range(3)] + [[(y,x) for x in range(3)] for y in range(3)]
def checkOutcome(board, currentPlayer):
    for triple in TRIPLES_TO_CHECK:
        outcome = checkTriple(board, triple)
        if outcome == otherPlayer(currentPlayer):
            return LOSS
        elif outcome == currentPlayer:
            return WIN
    for row in board:
        for col in row:
            if col == BLANK:
                return ONGOING
    return TIE

def otherPlayer(currentPlayer):
    return OPPONENT if currentPlayer == ME else ME    

def checkTriple(board, triple):
    a,b,c = [board[cell[0]][cell[1]] for cell in triple]
    
    if a == b and b == c:
        return a
    else:
        return BLANK

if __name__ == "__main__":
    initBoard = [[BLANK, BLANK, BLANK], [BLANK, BLANK, BLANK], [BLANK, BLANK, BLANK]]
    precalcMoves(initBoard)
    app.run(host="0.0.0.0")

