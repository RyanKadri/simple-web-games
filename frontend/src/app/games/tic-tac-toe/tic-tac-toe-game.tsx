import { createStyles, withStyles, WithStyles, Theme, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { TicTacToeBoard } from "./tic-tac-toe-board";
import { PlayerOwner, BoardState, GameOutcomes, GameState } from "./types/types";

const styles = (_: Theme) => createStyles({
    header: {
        flexBasis: "100%",
    }
});

const initState: GameState = {
    board: [
        [ PlayerOwner._, PlayerOwner._, PlayerOwner._ ],
        [ PlayerOwner._, PlayerOwner._, PlayerOwner._ ],
        [ PlayerOwner._, PlayerOwner._, PlayerOwner._ ],
    ],
    outcome: GameOutcomes.ONGOING,
    currentPlayer: 0
}

const players = [ PlayerOwner.X, PlayerOwner.O ];

const _TicTacToe = ({ classes }: Props) => {
    
    const [gameState, setGameState] = useState(initState);
    const currentPlayer = players[gameState.currentPlayer];

    const onSelected = (col: number, row: number) => {
        const newBoard = calcBoardState(gameState.board, currentPlayer, col, row)
        setGameState({ 
            ...gameState,
            ...checkOutcome(newBoard),
            board: newBoard,
            currentPlayer: (gameState.currentPlayer + 1) % 2,
        });
    };

    return (
        <>
            <Typography variant="h5" className={ classes.header }>Tic Tac Toe </Typography>
            <Typography variant="h6" className={ classes.header }>{ 
                gameState.outcome === GameOutcomes.WINNER 
                    ? `Congrats ${playerStr(gameState.winner!)}, you win!`
                    : gameState.outcome === GameOutcomes.TIE
                        ? `Hmm. Tie game. Guess you both lose :(`
                        : `Current Player: ${ playerStr(currentPlayer) }`
            }</Typography>
            <TicTacToeBoard 
                boardState={ gameState.board } 
                gameState={ gameState.outcome }
                onSquareSelected={ onSelected }
            />
        </>
    )
}

function playerStr(player: PlayerOwner) {
    return player === PlayerOwner.X ? 'X' : 'O'
}

function calcBoardState(currBoard: BoardState, currentPlayer: PlayerOwner, selectedCol: number, selectedRow: number) {
    if(currBoard[selectedRow][selectedCol] !== PlayerOwner._) {
        throw new Error("Invalid move. This square is already occupied");
    } else {
        return currBoard.map((row, rowNum) => 
            row.map((col, colNum) => 
                rowNum === selectedRow && colNum === selectedCol 
                    ? currentPlayer
                    : col
            )
        )
    }
}

function checkOutcome(board: BoardState): Pick<GameState, 'outcome' | 'winner'> {
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
            outcome: GameOutcomes.WINNER,
            winner
        }
    } else if(board.every(row => row.every(col => col !== PlayerOwner._))) {
        return { outcome: GameOutcomes.TIE }
    } else {
        return { outcome: GameOutcomes.ONGOING };
    }
}

function checkWinner(a: PlayerOwner, b: PlayerOwner, c: PlayerOwner) {
    if(a === b && b === c && a !== PlayerOwner._) {
        return a;
    } else {
        return undefined
    }
}

interface Props extends WithStyles<typeof styles> {}

export const TicTacToeGame = withStyles(styles)(_TicTacToe);