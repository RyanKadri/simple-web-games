export enum PlayerOwner {
    _,
    X,
    O,
}

export enum GameStatus {
    ONGOING,
    WINNER,
    TIE
}

export type BoardState = PlayerOwner[][];

export interface GameState {
    board: BoardState;
    status: GameStatus;
    currentPlayer: number;
    winner?: PlayerOwner;
    waiting: boolean;
}

export interface Move {
    player: PlayerOwner;
    row: number;
    column: number;
}