import { Direction } from "../coordinates/Direction";
import { Directions } from "../coordinates/Directions";
import { PieceName } from "../types/PieceName";
import { CastlingSide } from "../types/CastlingSide";
import { Piece } from "./Piece";
import { Queen } from "./Queen";
import { Move } from "../moves/Move";
import { Capture } from "../moves/Capture";
import { Castling } from "../moves/Castling";
import { Square } from "../board/Square";
import { Player } from "../players/Player";
import { Chessboard } from "../board/Chessboard";

export class King extends Piece {
    static Directions: Direction[] = Queen.Directions;
    static KingsideCastlingOffset: number = 3;
    static QueensideCastlingOffset: number = 4;

    getName(): PieceName {
        return PieceName.King;
    }

    getMoves(player: Player, fromSquare: Square, chessboard: Chessboard): Move[] {
        let moves: Move[] = [];
        let toSquare: Square | null = null;

        for (const direction of King.Directions) {
            if ((toSquare = chessboard.getSquareByDirection(fromSquare, direction))) {
                if (toSquare.isEmpty()) {
                    let move: Move = new Move(fromSquare, toSquare);
                    moves.push(move);
                } else {
                    if (
                        toSquare.isOccupiedByOpponent(player.color) &&
                        !toSquare.isOccupiedByPieceName(PieceName.King)
                    ) {
                        let move: Move = new Capture(fromSquare, toSquare, toSquare.piece);
                        moves.push(move);
                    }
                }
            }
        }

        return [...moves, ...this.getCastlingMoves(player, fromSquare, chessboard)];
    }

    getCastlingMoves(player: Player, fromSquare: Square, chessboard: Chessboard): Move[] {
        if (player.isChecked) {
            return [];
        }

        let moves: Move[] = [];

        let toSquare: Square | null = null;
        let rookSquare: Square | null = null;

        const sides: CastlingSide[] = [];
        if (player.castlingRights.kingside) sides.push(CastlingSide.Kingside);
        if (player.castlingRights.queenside) sides.push(CastlingSide.Queenside);

        for (const side of sides) {
            const direction: Direction | null =
                side === CastlingSide.Kingside ? player.kingsideDirection : player.queensideDirection;
            const offset: number =
                side === CastlingSide.Kingside ? King.KingsideCastlingOffset : King.QueensideCastlingOffset;

            if (!direction) continue;

            rookSquare = chessboard.getSquareByDirection(fromSquare, direction, offset);
            if (!rookSquare || !rookSquare.isOccupiedByPieceName(PieceName.Rook)) {
                continue;
            }

            if (
                side === CastlingSide.Queenside &&
                !chessboard.getSquareByDirection(fromSquare, direction, offset - 1)?.isEmpty()
            ) {
                continue;
            }

            toSquare = chessboard.getSquareByDirection(fromSquare, direction);
            if (toSquare && toSquare.isEmpty()) {
                let move: Move = new Move(fromSquare, toSquare);
                if (!chessboard.isCheckedByMoving(player, move)) {
                    toSquare = chessboard.getSquareByDirection(toSquare, direction);
                    if (toSquare && toSquare.isEmpty()) {
                        move = new Castling(
                            fromSquare,
                            toSquare,
                            new Move(rookSquare, chessboard.getSquareByDirection(fromSquare, direction)!),
                            side
                        );
                        moves.push(move);
                    }
                }
            }
        }

        return moves;
    }

    static getCastlingDirection(castlingSide: CastlingSide, playerDirection: Direction): Direction | null {
        if (playerDirection.dx === 0 && playerDirection.dy !== 0) {
            return castlingSide === CastlingSide.Kingside ? Directions.Right : Directions.Left;
        } else {
            if (playerDirection.dy === 0 && playerDirection.dx !== 0) {
                return castlingSide === CastlingSide.Kingside ? Directions.Down : Directions.Up;
            }
        }

        return null;
    }
}
