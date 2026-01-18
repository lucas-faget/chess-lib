import { PieceName } from "../types/PieceName";
import { PlayerColor } from "../types/PlayerColor";

export const isInteger = (char: string) => !isNaN(parseInt(char));
export const isPieceName = (char: string) => Object.values(PieceName).includes(char.toLowerCase() as PieceName);
export const isPlayerColor = (char: string) => Object.values(PlayerColor).includes(char.toLowerCase() as PlayerColor);
export const gcd = (a: number, b: number): number => {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return Math.abs(a);
};
