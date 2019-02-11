from flask import Flask, request, jsonify

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

def calcNextMove(board):
    winMove = checkWinMove(board)
    if winMove != None:
        return winMove
    blockMove = checkBlockMove(board)
    if blockMove != None:
        return blockMove
    
    return idealNextMove(board)

def idealNextMove(board):
    for rowNum, row in enumerate(board):
        for colNum, col in enumerate(row):
            if col == BLANK:
                return { "row": rowNum, "column": colNum }
    return { "row": -1, "column": -1 }

def checkWinMove(board):
    for row, col in freeSpaces(board):
        board[row][col] = PLAYER_2
        if checkOutcome(board) == WIN:
            return { "row": row, "column": col }
        board[row][col] = BLANK
    return None

def checkBlockMove(board):
    for row, col in freeSpaces(board):
        board[row][col] = PLAYER_1
        if checkOutcome(board) == LOSS:
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
def checkOutcome(board):
    for triple in TRIPLES_TO_CHECK:
        outcome = checkTriple(board, triple)
        if outcome == PLAYER_1:
            return LOSS
        elif outcome == PLAYER_2:
            return WIN
    for row in board:
        for col in row:
            if col == BLANK:
                return ONGOING
    return TIE
    

def checkTriple(board, triple):
    a,b,c = [board[cell[0]][cell[1]] for cell in triple]
    
    if a == b and b == c:
        return a
    else:
        return BLANK

if __name__ == "__main__":
    app.run(host="0.0.0.0")

