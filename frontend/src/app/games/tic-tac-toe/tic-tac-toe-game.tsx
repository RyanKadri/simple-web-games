import { createStyles, withStyles, WithStyles, Theme, Typography, Button, Switch, FormControlLabel } from "@material-ui/core";
import React, { useState, SyntheticEvent, useEffect } from "react";
import { TicTacToeBoard } from "./tic-tac-toe-board";
import { PlayerOwner, GameStatus, GameState } from "./types/types";
import { checkOutcome, updateBoard as calcNewBoard } from "./rules/rules";

const styles = (theme: Theme) => createStyles({
    header: {
        flexBasis: "100%",
    },
    resetButton: {
        marginTop: theme.spacing.unit * 2
    }
});

const initState: GameState = {
    board: [
        [ PlayerOwner._, PlayerOwner._, PlayerOwner._ ],
        [ PlayerOwner._, PlayerOwner._, PlayerOwner._ ],
        [ PlayerOwner._, PlayerOwner._, PlayerOwner._ ],
    ],
    status: GameStatus.ONGOING,
    currentPlayer: 0,
    waiting: false
}

const players = [ PlayerOwner.X, PlayerOwner.O ];

const _TicTacToeGame = ({ classes }: Props) => {
    
    const [gameState, setGameState] = useState(initState);
    const [aiOpponent, setAiOpponent] = useState(false);
    const currentPlayer = players[gameState.currentPlayer];
    const cleanGame = gameState === initState;

    const onSelected = (column: number, row: number) => {
        const move = { row, column, player: currentPlayer };
        const newBoard = calcNewBoard(gameState.board, move);
        const outcome = checkOutcome(newBoard);
        const waiting = outcome.status === GameStatus.ONGOING 
                            && aiOpponent 
                            && currentPlayer === PlayerOwner.O
        setGameState({ 
            ...gameState,
            ...outcome,
            waiting,
            board: newBoard,
            currentPlayer: (gameState.currentPlayer + 1) % 2,
        });
    };

    const onReset = () => {
        setGameState(initState);
    }

    const addAiOpponent = (e: SyntheticEvent<HTMLInputElement>) => {
        setAiOpponent(e.currentTarget.checked)
    }

    useEffect(() => {
        if(aiOpponent 
                && currentPlayer === PlayerOwner.O 
                && gameState.status === GameStatus.ONGOING
        ) {
            fetch("/api/nextMove", { 
                method: "POST",
                body: JSON.stringify(gameState.board),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json())
            .then(nextMove => onSelected(nextMove.column, nextMove.row))
        }
    }, [gameState.currentPlayer, aiOpponent])


    return (
        <>
            <Typography variant="h5" className={ classes.header }>Tic Tac Toe </Typography>
            <Typography variant="h6" className={ classes.header }>{ 
                gameState.status === GameStatus.WINNER 
                    ? `Congrats ${playerStr(gameState.winner!)}, you win!`
                    : gameState.status === GameStatus.TIE
                        ? `Hmm. Tie game. Guess you both lose :(`
                        : `Current Player: ${ playerStr(currentPlayer) }`
            }</Typography>
            <TicTacToeBoard 
                boardState={ gameState.board } 
                gameState={ gameState.status }
                onSquareSelected={ onSelected }
            />
            <FormControlLabel 
                label="Play against computer"
                control={
                    <Switch 
                        checked={ aiOpponent }
                        onChange={ addAiOpponent }
                        color="primary" />
                }
            />
            {
                cleanGame ? null :
                <Button variant="contained" color="secondary" className={ classes.resetButton }
                    onClick={ onReset }>
                    Reset
                </Button>
            }
        </>
    )
}

function playerStr(player: PlayerOwner) {
    return player === PlayerOwner.X ? 'X' : 'O'
}

interface Props extends WithStyles<typeof styles> {}

export const TicTacToeGame = withStyles(styles)(_TicTacToeGame);