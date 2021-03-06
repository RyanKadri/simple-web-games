import React from "react";
import { withStyles, WithStyles, createStyles } from "@material-ui/core";
import { BoardState, GameStatus } from "./types/types";
import { TicTacToeSquare } from "./tic-tac-toe-square";

const styles = createStyles({
    board: {
        display: "grid",
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr',
        width: '50vh',
        flexGrow: 1
    }
})

const _TicTacToeBoard = ({ classes, boardState, gameState, onSquareSelected }: Props)  => {
    return (
        <div className={classes.board}>
            { boardState.flatMap((row, rowNum) => 
                row.map((col, colNum) => (
                    <TicTacToeSquare key={ `${rowNum},${colNum}` }
                                     owner={ col }
                                     disabled={ gameState !== GameStatus.ONGOING }
                                     onSelected={ () => onSquareSelected(colNum, rowNum) } 
                    />
                ))
            ) }
        </div>
    )
}

interface Props extends WithStyles<typeof styles> {
    onSquareSelected: (col: number, row: number) => void;
    boardState: BoardState;
    gameState: GameStatus;
}

export const TicTacToeBoard = withStyles(styles)(_TicTacToeBoard)