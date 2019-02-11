from flask import Flask, request, jsonify
from functools import reduce

app = Flask(__name__)

PLAYER_1 = 1
PLAYER_2 = 2
BLANK = 0

WIN = 1
LOSS = 2
TIE = 3
ONGOING = 4

@app.route("/api/nextMove", methods=["POST"])
def calcMove():
    board = request.json
    nextMove = calcNextMove(board)
    return jsonify(nextMove)

def calcNextMove(board, currentPlayer = PLAYER_2):
    winMove = checkWinMove(board, currentPlayer)
    if winMove != None:
        return winMove
    blockMove = checkBlockMove(board, currentPlayer)
    if blockMove != None:
        return blockMove
    
    return idealNextMove(board, currentPlayer)

def idealNextMove(board, currentPlayer):
    bestScore = -999
    best = None
    moves = calcMoves(board, currentPlayer)
    for move in moves:
        if move['score'] > bestScore:
            best = move['move']
    return { "row": best[0], "column": best[1] }

def calcMoves(board, currentPlayer):
    free = freeSpaces(board)
    moves = []
    for space in free:
        board[space[0]][space[1]] = currentPlayer
        outcome = checkOutcome(board, currentPlayer)
        if outcome == WIN:
            score = 1
        elif outcome == TIE:
            score = 0
        else:
            score = -reduce(lambda a, x: a + x["score"], calcMoves(board, otherPlayer(currentPlayer)), 0)
        moves.append({ "score": score, "move": space })
        board[space[0]][space[1]] = BLANK
    return moves

def checkWinMove(board, currentPlayer):
    for row, col in freeSpaces(board):
        board[row][col] = currentPlayer
        if checkOutcome(board, currentPlayer) == WIN:
            return { "row": row, "column": col }
        board[row][col] = BLANK
    return None

def checkBlockMove(board, currentPlayer):
    for row, col in freeSpaces(board):
        board[row][col] = otherPlayer(currentPlayer)
        if checkOutcome(board, currentPlayer) == LOSS:
            return { "row": row, "column": col }
        board[row][col] = BLANK
    return None

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
    return PLAYER_2 if currentPlayer == PLAYER_1 else PLAYER_1    

def checkTriple(board, triple):
    a,b,c = [board[cell[0]][cell[1]] for cell in triple]
    
    if a == b and b == c:
        return a
    else:
        return BLANK

if __name__ == "__main__":
    app.run(host="0.0.0.0")

