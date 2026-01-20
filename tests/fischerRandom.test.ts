import { describe, it, expect } from "vitest";
import { PieceName } from "../src/types/PieceName";
import { CastlingSide } from "../src/types/CastlingSide";
import { Chess960Rows } from "./data/Chess960Rows";
import { generateKRConfigs } from "./helpers/fischerRandom";
import { FischerRandomChess } from "../src/chess/FischerRandomChess";

describe("Fischer Random Chess", () => {
    for (const [id, row] of Object.entries(Chess960Rows)) {
        it(`should returns the starting FEN string for position ${id}`, () => {
            const chess: FischerRandomChess = FischerRandomChess.fromId(parseInt(id));
            const fen: string = `${row}/pppppppp/8/8/8/8/PPPPPPPP/${row.toUpperCase()} w KQkq - 0 1`;
            expect(chess.toFen()).toBe(fen);
        });
    }

    describe("Castling", () => {
        for (const side of [CastlingSide.Kingside, CastlingSide.Queenside]) {
            describe(side, () => {
                for (const config of generateKRConfigs(side)) {
                    describe(config.row, () => {
                        describe("whites", () => {
                            const fen: string = `${config.row}/pppppppp/8/8/8/8/PPPPPPPP/${config.row.toUpperCase()} w KQkq - 0 1`;
                            const rookSquare: string = `${config.rookFile}1`;
                            const kingSquare: string = `${config.kingFile}1`;

                            it("should returns correct rook square", () => {
                                const chess: FischerRandomChess = new FischerRandomChess(fen);
                                expect(chess.players[0].castlingSquares[side].rook.from).toBe(rookSquare);
                                expect(chess.chessboard.getSquareByName(rookSquare)?.piece?.getName()).toBe(
                                    PieceName.Rook,
                                );
                            });

                            it("should returns correct king square", () => {
                                const chess: FischerRandomChess = new FischerRandomChess(fen);
                                expect(chess.players[0].castlingSquares[side].king.from).toBe(kingSquare);
                                expect(chess.chessboard.getSquareByName(kingSquare)?.piece?.getName()).toBe(
                                    PieceName.King,
                                );
                            });

                            it("should allow castling", () => {
                                const chess: FischerRandomChess = new FischerRandomChess(fen);
                                expect(chess.isLegalMove(kingSquare, rookSquare)).toBe(true);
                            });
                        });
                        describe("blacks", () => {
                            const fen: string = `${config.row}/pppppppp/8/8/8/8/PPPPPPPP/${config.row.toUpperCase()} b KQkq - 0 1`;
                            const rookSquare: string = `${config.rookFile}8`;
                            const kingSquare: string = `${config.kingFile}8`;

                            it("should returns correct rook square", () => {
                                const chess: FischerRandomChess = new FischerRandomChess(fen);
                                expect(chess.players[1].castlingSquares[side].rook.from).toBe(rookSquare);
                                expect(chess.chessboard.getSquareByName(rookSquare)?.piece?.getName()).toBe(
                                    PieceName.Rook,
                                );
                            });

                            it("should returns correct king square", () => {
                                const chess: FischerRandomChess = new FischerRandomChess(fen);
                                expect(chess.players[1].castlingSquares[side].king.from).toBe(kingSquare);
                                expect(chess.chessboard.getSquareByName(kingSquare)?.piece?.getName()).toBe(
                                    PieceName.King,
                                );
                            });

                            it("should allow castling", () => {
                                const chess: FischerRandomChess = new FischerRandomChess(fen);
                                expect(chess.isLegalMove(kingSquare, rookSquare)).toBe(true);
                            });
                        });
                    });
                }
            });
        }
    });
});
