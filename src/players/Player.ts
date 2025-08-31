import { Direction } from "../coordinates/Direction";
import { PlayerColor } from "../types/PlayerColor";
import { PieceName } from "../types/PieceName";
import { MoveType } from "../types/MoveType";
import { CastlingSide } from "../types/CastlingSide";
import { CastlingRights } from "../types/CastlingRights";
import { Piece } from "../pieces/Piece";
import { Pawn } from "../pieces/Pawn";
import { King } from "../pieces/King";
import { Square } from "../board/Square";
import { Move } from "../moves/Move";
import { Chessboard } from "../board/Chessboard";

export class Player {
    name: string;
    color: PlayerColor;
    direction: Direction;
    pawnCaptureDirections: Direction[];
    enPassantCaptureDirections: Direction[];
    castlingRights: CastlingRights;
    kingsideDirection: Direction | null;
    queensideDirection: Direction | null;
    kingSquare: Square | null = null;
    isChecked: Piece | false = false;

    constructor(
        color: PlayerColor,
        name: string,
        direction: Direction,
        castlingRights: CastlingRights = { kingside: true, queenside: true }
    ) {
        this.color = color;
        this.name = name;
        this.direction = direction;
        this.pawnCaptureDirections = Pawn.getCaptureDirections(direction);
        this.enPassantCaptureDirections = Pawn.getEnPassantCaptureDirections(direction);
        this.castlingRights = castlingRights;
        this.kingsideDirection = King.getCastlingDirection(CastlingSide.Kingside, direction);
        this.queensideDirection = King.getCastlingDirection(CastlingSide.Queenside, direction);
    }

    updateCastlingRights(move: Move, chessboard: Chessboard): void {
        if (!this.kingSquare || (!this.castlingRights.kingside && !this.castlingRights.queenside)) {
            return;
        }

        if (move.getType() === MoveType.Castling || move.toSquare.isOccupiedByPieceName(PieceName.King)) {
            this.castlingRights.kingside = false;
            this.castlingRights.queenside = false;
            return;
        }

        if (move.toSquare.isOccupiedByPieceName(PieceName.Rook)) {
            if (this.castlingRights.kingside && this.kingsideDirection) {
                if (
                    chessboard.getSquareByDirection(
                        this.kingSquare,
                        this.kingsideDirection,
                        King.KingsideCastlingOffset
                    ) === move.fromSquare
                ) {
                    this.castlingRights.kingside = false;
                }
            }
            if (this.castlingRights.queenside && this.queensideDirection) {
                if (
                    chessboard.getSquareByDirection(
                        this.kingSquare,
                        this.queensideDirection,
                        King.QueensideCastlingOffset
                    ) === move.fromSquare
                ) {
                    this.castlingRights.queenside = false;
                }
            }
        }
    }
}
