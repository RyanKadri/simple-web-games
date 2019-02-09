export enum PlayerOwner {
    _,
    X,
    O,
}

export enum GameOutcomes {
    ONGOING,
    WINNER,
    TIE
}

export type BoardState = PlayerOwner[][];

export interface GameState {
    board: BoardState;
    outcome: GameOutcomes;
    currentPlayer: number;
    winner?: PlayerOwner;
}