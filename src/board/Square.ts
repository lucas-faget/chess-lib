import { Position } from "../coordinates/Position";
import { PieceName } from "../types/PieceName";
import { PlayerColor } from "../types/PlayerColor";
import { Piece } from "../pieces/Piece";
import { Pawn } from "../pieces/Pawn";
import { Knight } from "../pieces/Knight";
import { Bishop } from "../pieces/Bishop";
import { Rook } from "../pieces/Rook";
import { Queen } from "../pieces/Queen";
import { King } from "../pieces/King";

export class Square {
    name: string;
    position: Position;
    piece: Piece | null;

    constructor(name: string, position: Position) {
        this.name = name;
        this.position = position;
        this.piece = null;
    }

    isEmpty(): boolean {
        return this.piece === null;
    }

    isOccupiedByAlly(color: PlayerColor): boolean {
        return this.piece !== null && this.piece.color === color;
    }

    isOccupiedByOpponent(color: PlayerColor): boolean {
        return this.piece !== null && this.piece.color !== color;
    }

    isOccupiedByPieceName(pieceName: PieceName): boolean {
        return this.piece !== null && this.piece.getName() === pieceName;
    }

    setPiece(name: PieceName, color: PlayerColor): void {
        switch (name) {
            case PieceName.Pawn:
                this.piece = new Pawn(color);
                break;
            case PieceName.Knight:
                this.piece = new Knight(color);
                break;
            case PieceName.Bishop:
                this.piece = new Bishop(color);
                break;
            case PieceName.Rook:
                this.piece = new Rook(color);
                break;
            case PieceName.Queen:
                this.piece = new Queen(color);
                break;
            case PieceName.King:
                this.piece = new King(color);
                break;
        }
    }

    toString(): string {
        return this.piece?.toString() ?? "-";
    }
}
