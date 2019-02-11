import { BoardState, GameState, GameStatus, PlayerOwner, Move } from "../types/types";

export function checkOutcome(board: BoardState): Pick<GameState, 'status' | 'winner'> {
    let winner = undefined;
    
    winner = checkWinner(board[0][0], board[1][1], board[2][2])
        || checkWinner(board[0][2], board[1][1], board[2][0])       
    let i = 0;
    while(winner === undefined && i < 3) {
        winner = checkWinner(board[i][0], board[i][1], board[i][2])
            || checkWinner(board[0][i], board[1][i], board[2][i]);
        i ++;
    }
    if(winner !== undefined) {
        return {
            status: GameStatus.WINNER,
            winner
        }
    } else if(board.every(row => row.every(col => col !== PlayerOwner._))) {
        return { status: GameStatus.TIE }
    } else {
        return { status: GameStatus.ONGOING };
    }
}

function checkWinner(a: PlayerOwner, b: PlayerOwner, c: PlayerOwner) {
    if(a === b && b === c && a !== PlayerOwner._) {
        return a;
    } else {
        return undefined
    }
}

export function updateBoard(currBoard: BoardState, move: Move) {
    if(currBoard[move.row][move.column] !== PlayerOwner._) {
        throw new Error("Invalid move. This square is already occupied");
    } else {
        return currBoard.map((row, rowNum) => 
            row.map((col, colNum) => 
                rowNum === move.row && colNum === move.column 
                    ? move.player
                    : col
            )
        )
    }
}