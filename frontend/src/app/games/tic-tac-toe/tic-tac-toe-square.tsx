import { PlayerOwner } from "./types/types";
import React from "react";
import { WithStyles, createStyles, Theme, withStyles } from "@material-ui/core";

const borderWidth = 4;

const styles = (theme: Theme) => createStyles({
    square: {
        padding: theme.spacing.unit,
        border: `solid ${borderWidth}px #444`,
        marginRight: - borderWidth,
        marginBottom: - borderWidth,
        "&:hover:not(.selected):not(.disabled)": {
            backgroundColor: "rgba(0,0,0,0.12)"
        }
    },
    token: {
        fill: "none",
        stroke: '#444',
        strokeWidth: 4
    }
}) 

const _TicTacToeSquare = (props: Props) => {
    const { owner, classes, onSelected, disabled } = props;
    const selected = owner !== PlayerOwner._;
    return (
        <div className={ `${classes.square} ${ selected ? 'selected' : ''} ${ disabled ? 'disabled': ''}` }
             onClick={ !selected && !disabled ? onSelected : ()=>{} }
        >{ 
            owner === PlayerOwner.X
                ? <XMark { ...props } />
                : owner === PlayerOwner.O
                    ? <OMark { ...props } />
                    : <button style={{ visibility: "hidden" }}></button>
        }</div>
    )
}

const OMark = ({ classes }: Props) => (
    <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="38" className={classes.token} />
    </svg>
)

const XMark = ({ classes}: Props) => (
    <svg viewBox="0 0 100 100" >
        <path d="M12,12 L88,88" className={classes.token} />
        <path d="M88,12 L12,88" className={classes.token} />
    </svg>
)

interface Props extends WithStyles<typeof styles> {
    owner: PlayerOwner;
    disabled: boolean;
    onSelected: () => void;
}

export const TicTacToeSquare = withStyles(styles)(_TicTacToeSquare);