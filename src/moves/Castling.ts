import { MoveType } from "../types/MoveType";
import { CastlingSide } from "../types/CastlingSide";
import { Piece } from "../pieces/Piece";
import { Square } from "../board/Square";
import { Move } from "./Move";
import { MoveDTO } from "../dto/MoveDTO";

export class Castling extends Move {
    side: CastlingSide;
    rookMove: Move;

    constructor(fromSquare: Square, toSquare: Square, rookMove: Move, side: CastlingSide) {
        super(fromSquare, toSquare);
        this.rookMove = rookMove;
        this.side = side;
    }

    getType(): MoveType {
        return MoveType.Castling;
    }

    override carryOutMove(): void {
        const kingPiece: Piece | null = this.fromSquare.piece;
        const rookPiece: Piece | null = this.rookMove.fromSquare.piece;

        this.fromSquare.piece = null;
        this.rookMove.fromSquare.piece = null;

        this.toSquare.piece = kingPiece;
        this.rookMove.toSquare.piece = rookPiece;
    }

    override undoMove(): void {
        const kingPiece: Piece | null = this.toSquare.piece;
        const rookPiece: Piece | null = this.rookMove.toSquare.piece;

        this.toSquare.piece = null;
        this.rookMove.toSquare.piece = null;

        this.fromSquare.piece = kingPiece;
        this.rookMove.fromSquare.piece = rookPiece;
    }

    override toString(): string {
        return this.side === CastlingSide.Kingside ? "O-O" : "O-O-O";
    }

    override serialize(): MoveDTO {
        return {
            ...super.serialize(),
            nestedMove: this.rookMove.serialize(),
        };
    }
}
