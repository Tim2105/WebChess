/**
 * @file Chess.js
 * @description Kapselt ein Schachbrett.
 * 
 * @property {array} pieces - Figurenarray als 1D-Array von Strings
 * @property {string} turn - Zugrecht, 'w' oder 'b'
 * @property {string} castling - Rochade-Möglichkeiten, z.B. 'KQkq'
 * @property {string} enPassant - En-Passant-Zug, z.B. 'e3'
 * @property {number} fiftyMoveRule - 50-Züge-Regel
 * @property {number} fullMove - Zugnummer
 */
export class Board {
    /**
     * @description Erstellt ein neues Schachbrett.
     * 
     * @param {array} pieces - Figurenarray als 1D-Array von Strings
     * @param {string} turn - Zugrecht, 'w' oder 'b'
     * @param {string} castling - Rochade-Möglichkeiten, z.B. 'KQkq'
     * @param {string} enPassant - En-Passant-Zug, z.B. 'e3'
     * @param {number} fiftyMoveRule - 50-Züge-Regel
     * @param {number} fullMove - Zugnummer
     */
    constructor(pieces, turn, castling, enPassant, fiftyMoveRule, fullMove) {
        this.pieces = pieces;
        this.turn = turn;
        this.castling = castling;
        this.enPassant = enPassant;
        this.fiftyMoveRule = fiftyMoveRule;
        this.fullMove = fullMove;
    }
}

/**
 * @file Chess.js
 * @description Erstellt ein Figurenarray aus einem FEN-String.
 * 
 * @param {string} fen - FEN-String
 * 
 * @returns {Board} Schachbrett
 */
export function fenToBoard(fen) {
    const pieces = Array(64).fill('');

    const fenParts = fen.split(' ');
    const fenBoard = fenParts[0];
    const turn = fenParts[1];
    const castling = fenParts[2];
    const enPassant = fenParts[3];
    const fiftyMoveRule = parseInt(fenParts[4]);
    const fullMove = parseInt(fenParts[5]);
    const boardRows = fenBoard.split('/').reverse();

    for(let row = 0; row < boardRows.length; row++) {
        let col = 0;
        for(let i = 0; i < boardRows[row].length; i++) {
            const char = boardRows[row][i];
            if(!isNaN(char)) {
                col += parseInt(char);
            } else {
                pieces[row * 8 + col] = char;
                col++;
            }
        }
    }

    const board = new Board(pieces, turn, castling, enPassant, fiftyMoveRule, fullMove);
    return board;
}