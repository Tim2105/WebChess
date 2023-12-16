import createModule from './bin/module.js';

/**
 * @type WebAssembly.Instance
 * @description Die WebAssembly-Instanz,
 * die die exportierten Funktionen der C++-Engine enthält.
 */
export const chessModule = await createModule();

const exportedFunctions = {
    setBoard: chessModule.cwrap('setBoard', 'number', ['string']),
    getBoard: chessModule.cwrap('getBoard', 'string', []),
    getLegalMoves: chessModule.cwrap('getLegalMoves', 'string', []),
    getGameStatus: chessModule.cwrap('getGameStatus', 'number', []),
    initPlayEngine: chessModule.cwrap('initPlayEngine', null, []),
    getBestMove: chessModule.cwrap('getBestMove', 'number', ['number']),
    getBestMoveInStaticTime: chessModule.cwrap('getBestMoveInStaticTime', 'number', ['number']),
    makeMove: chessModule.cwrap('makeMove', 'number', ['number']),
    undoMove: chessModule.cwrap('undoMove', 'number', []),
    initAnalysis: chessModule.cwrap('initAnalysis', null, ['number', 'number']),
    startAnalysis: chessModule.cwrap('startAnalysis', 'number', []),
    stopAnalysis: chessModule.cwrap('stopAnalysis', 'number', []),
    getAnalysisData: chessModule.cwrap('getAnalysisData', 'string', []),
    getError: chessModule.cwrap('getError', 'string', []),
    moveToFigurineNotation: chessModule.cwrap('moveToFigurineNotation', 'string', ['number']),
}

/**
 * @description Eine Klasse, die die Züge aus der Engine-
 * internen Repräsentation für JavaScript zugänglich macht.
 * 
 * @property {number} bits Die interne Repräsentation des Zuges.
 * @property {number} from Das Startfeld des Zuges.
 * @property {number} to Das Zielfeld des Zuges.
 * @property {boolean} isQuiet Gibt an, ob der Zug ein leiser Zug ist.
 * @property {boolean} isDoublePawn Gibt an, ob der Zug ein Doppelschritt ist.
 * @property {boolean} isKingCastle Gibt an, ob der Zug eine Rochade auf der Königsseite ist.
 * @property {boolean} isQueenCastle Gibt an, ob der Zug eine Rochade auf der Damenseite ist.
 * @property {boolean} isCastle Gibt an, ob der Zug eine Rochade ist.
 * @property {boolean} isCapture Gibt an, ob der Zug ein Schlagzug ist.
 * @property {boolean} isEnPassant Gibt an, ob der Zug ein En-Passant-Zug ist.
 * @property {boolean} isPromotion Gibt an, ob der Zug eine Bauernumwandlung ist.
 * @property {boolean} isKnightPromotion Gibt an, ob der Zug eine Umwandlung in einen Springer ist.
 * @property {boolean} isBishopPromotion Gibt an, ob der Zug eine Umwandlung in einen Läufer ist.
 * @property {boolean} isRookPromotion Gibt an, ob der Zug eine Umwandlung in einen Turm ist.
 * @property {boolean} isQueenPromotion Gibt an, ob der Zug eine Umwandlung in eine Dame ist.
 * @property {boolean} isNullMove Gibt an, ob der Zug ein Nullzug ist (sind immer illegal!).
 * 
 * @method getOrigin Gibt das Startfeld des Zuges als String zurück.
 * @method getDestination Gibt das Zielfeld des Zuges als String zurück.
 * @method toString Gibt den Zug als String zurück.
 */
class Move {
    /**
     * @param {number} bits Die interne Repräsentation des Zuges.
     * @description Erstellt ein neues Move-Objekt.
     */
    constructor(bits) {
        this.bits = bits;

        /**
         * Die interne Repräsentation ist ein 16-Bit-Integer.
         * Dabei repräsentieren die Bits 10-15 das Startfeld,
         * die Bits 4-9 das Zielfeld und die Bits 0-3 enthalten
         * Flags für Spezialzüge. Wenn die interne Repräsentation
         * 0 ist, handelt es sich um einen Nullzug.
         * 
         * Die Flags sind wie folgt definiert:
         * 0: Leiser Zug
         * 1: Doppelschritt
         * 2: Rochade auf Köngsseite
         * 3: Rochade auf Damenseite
         * 4: Schlagzug
         * 5: En-Passant
         * 8: Promotion auf Springer
         * 9: Promotion auf Läufer
         * 10: Promotion auf Turm
         * 11: Promotion auf Dame
         */

        this.from = (bits >> 10) & 0x3f;
        this.to = (bits >> 4) & 0x3f;
        this.isQuiet = (bits & 0xC) === 0;
        this.isDoublePawn = (bits & 0xF) === 1;
        this.isKingCastle = (bits & 0xF) === 2;
        this.isQueenCastle = (bits & 0xF) === 3;
        this.isCastle = this.isKingCastle || this.isQueenCastle;
        this.isCapture = bits & 4;
        this.isEnPassant = (bits & 0xF) === 5;
        this.isPromotion = bits & 8;
        this.isKnightPromotion = (bits & 0b1011) === 8;
        this.isBishopPromotion = (bits & 0b1011) === 9;
        this.isRookPromotion = (bits & 0b1011) === 10;
        this.isQueenPromotion = (bits & 0b1011) === 11;

        this.isNullMove = bits === 0;
    }

    /**
     * @description Gibt das Startfeld des Zuges als String zurück.
     * 
     * @returns {string} Das Startfeld des Zuges.
     */
    getOrigin() {
        const file = this.from % 8;
        const rank = Math.floor(this.from / 8);

        return String.fromCharCode(97 + file) + (rank + 1);
    }

    /**
     * @description Gibt das Zielfeld des Zuges als String zurück.
     * 
     * @returns {string} Das Zielfeld des Zuges.
     */
    getDestination() {
        const file = this.to % 8;
        const rank = Math.floor(this.to / 8);

        return String.fromCharCode(97 + file) + (rank + 1);
    }

    /**
     * @description Gibt den Zug als String zurück.
     * 
     * @returns {string} Der Zug als String.
     */
    toString() {
        let result = this.getOrigin() + this.getDestination();

        if(this.isPromotion)
            result += this.isKnightPromotion ? 'n' : this.isBishopPromotion ? 'b' : this.isRookPromotion ? 'r' : 'q';

        return result;
    }
}

/**
 * @description Eine Klasse, die Variationen kapselt.
 * 
 * @property {Array<Move>} moves Die Züge der Variation.
 * @property {number} score Die Bewertung der Variation.
 */
export class Variation {
    /**
     * @description Erstellt ein neues Variation-Objekt.
     * 
     * @param {Array<Move>} moves Die Züge der Variation.
     * @param {number} score Die Bewertung der Variation.
     */
    constructor(moves, score) {
        this.moves = moves;
        this.score = score;
    }

    /**
     * @description Gibt die Variation als JSON-Objekt zurück.
     */
    toJSON() {
        return {
            moves: this.moves.map(move => move.bits),
            score: this.score
        };
    }

    /**
     * @description Erstellt eine Variation aus einem JSON-Objekt.
     */
    static fromJSON(json) {
        return new Variation(json.moves.map(move => new Move(move)), json.score);
    }
}

/**
 * @description Eine Klasse, die die Daten einer Analyse kapselt.
 */
export class AnalysisData {
    /**
     * @description Erstellt ein neues AnalysisData-Objekt.
     * 
     * @param {number} depth Die Tiefe der Analyse.
     * @param {number} nodes Die Anzahl der besuchten Knoten.
     * @param {number} time Die Zeit, die für die Analyse bisher verwendet wurde.
     * @param {Array<Variation>} variations Die besten Variationen.
     */
    constructor(depth, nodes, time, variations) {
        this.depth = depth;
        this.nodes = nodes;
        this.time = time;
        this.variations = variations;
    }

    /**
     * @description Gibt die Analyse als JSON-Objekt zurück.
    */
    toJSON() {
        return {
            depth: this.depth,
            nodes: this.nodes,
            time: this.time,
            variations: this.variations.map(variation => variation.toJSON())
        };
    }

    /**
     * @description Erstellt eine Analyse aus einem JSON-Objekt.
     */
    static fromJSON(json) {
        json = JSON.parse(json);
        return new AnalysisData(json.depth, json.nodes, json.time,
                                json.variations.map(variation => Variation.fromJSON(variation)));
    }
}

/**
 * @description Setzt das aktuelle Spielbrett auf eine
 * bestimmte Stellung (FEN).
 * 
 * @param {string} fen Die FEN-Repräsentation des Spielbrettes.
 * 
 * @throws Wenn die FEN ungültig ist.
 */
export function setBoard(fen) {
    if(!exportedFunctions.setBoard(fen))
        throw new Error(exportedFunctions.getError());
}

/**
 * @description Generiert die FEN-Repräsentation des aktuellen
 * Brettes.
 * 
 * @returns {string} Das aktuelle Spielbrett als FEN.
 */
export function getBoard() {
    return exportedFunctions.getBoard();
}

/**
 * @description Generiert alle legalen Züge für die aktuelle Stellung.
 * 
 * @returns {Array<Move>} Ein Array, das alle legalen Züge enthält.
 */
export function getLegalMoves() {
    const result = [];

    const moves = JSON.parse(exportedFunctions.getLegalMoves());
    for(const move of moves)
        result.push(new Move(move));

    return result;
}

/**
 * @description Wandelt ein Feld in Textform in eine Zahl um.
 * 
 * @param {string} square Das Feld als String (z.B. 'a1').
 * 
 * @returns {number} Das Feld als Zahl (0-63).
 * 
 * @throws Wenn das Feld ungültig ist.
 */
export function squareToIndex(square) {
    if(typeof square !== 'string' || square.length !== 2)
        throw new Error('Invalid square!');

    if(square.charCodeAt(0) < 97 || square.charCodeAt(0) > 104)
        throw new Error('Invalid file!');

    if(parseInt(square[1]) < 1 || parseInt(square[1]) > 8)
        throw new Error('Invalid rank!');

    const file = square.charCodeAt(0) - 97;
    const rank = parseInt(square[1]) - 1;

    return rank * 8 + file;
}

/**
 * @description Erstellt ein Move-Objekt aus einem Startfeld, einem Zielfeld
 * und der umzuwandelnden Figur (falls notwendig).
 * 
 * @param {number} from Das Startfeld des Zuges als Zahl (0-63).
 * @param {number} to Das Zielfeld des Zuges als Zahl (0-63).
 * @param {string | null} promotion Die umzuwandelnde Figur (null, 'n', 'b', 'r' oder 'q').
 * 
 * @returns {Move | null} Der Zug als Move-Objekt oder null, wenn der Zug illegal ist.
 */
export function sqToLegalMove(from, to, promotion = null) {
    const moves = getLegalMoves();

    for(const move of moves)
        if(move.from === from && move.to === to) {
            if(promotion === null && !move.isPromotion)
                return move;
            else if(promotion === 'n' && move.isKnightPromotion)
                return move;
            else if(promotion === 'b' && move.isBishopPromotion)
                return move;
            else if(promotion === 'r' && move.isRookPromotion)
                return move;
            else if(promotion === 'q' && move.isQueenPromotion)
                return move;
        }

    return null;
}

/**
 * @description Erstellt ein Move-Objekt aus einem String.
 * 
 * @param {string} moveString Der Zug als String (z.B. 'e2e4').
 * 
 * @returns {Move | null} Der Zug als Move-Objekt oder null, wenn der Zug illegal ist.
 */
export function strToLegalMove(moveString) {
    const moves = getLegalMoves();

    for(const move of moves)
        if(moveString === move.toString())
            return move;

    return null;
}

/**
 * @description Überprüft, ob das Spiel noch läuft.
 * 
 * @returns {boolean} Gibt an, ob das Spiel noch läuft.
 */
export function isGameOngoing() {
    return exportedFunctions.getGameStatus() === 0;
}

/**
 * @description Überprüft, ob das Spiel beendet ist.
 * 
 * @returns {boolean} Gibt an, ob das Spiel beendet ist.
 */
export function isGameOver() {
    return exportedFunctions.getGameStatus() !== 0;
}

/**
 * @description Überprüft, ob das Spiel durch Schachmatt beendet ist.
 * 
 * @returns {boolean} Gibt an, ob das Spiel durch Schachmatt beendet ist.
 */
export function isCheckmate() {
    const status = exportedFunctions.getGameStatus();
    return status === 1 || status === 2;
}

/**
 * @description Überprüft, ob das Spiel unentschieden ist.
 * 
 * @returns {boolean} Gibt an, ob das Spiel unentschieden ist.
 */
export function isDraw() {
    return exportedFunctions.getGameStatus() >= 3;
}

export function isDrawByStalemate() {
    return exportedFunctions.getGameStatus() === 3;
}

export function isDrawByFiftyMoveRule() {
    return exportedFunctions.getGameStatus() === 4;
}

export function isDrawByThreefoldRepetition() {
    return exportedFunctions.getGameStatus() === 5;
}

export function isDrawByInsufficientMaterial() {
    return exportedFunctions.getGameStatus() === 6;
}

/**
 * Initialisiert die Spiel-Engine.
 */
export function initPlayEngine() {
    exportedFunctions.initPlayEngine();
}

/**
 * @description Fragt die Engine nach dem besten Zug.
 * 
 * @param {number} time Die Zeit, die die Engine in einem Spiel
 * zur Verfügung hat (in ms). Die Funktion wird in dieser Zeit
 * garantiert zurückkehren.
 * 
 * @returns {Move} Der beste Zug.
 */
export function getBestMove(time) {
    return new Move(exportedFunctions.getBestMove(time));
}

/**
 * @description Fragt die Engine nach dem besten Zug.
 * 
 * @param {number} time Die Zeit, die die Engine für die Suche
 * verwenden soll (in ms).
 */
export function getBestMoveInStaticTime(time) {
    return new Move(exportedFunctions.getBestMoveInStaticTime(time));
}

/**
 * @description Führt einen Zug aus. Der Zug wird
 * vorher auf seine Legalität überprüft.
 * 
 * @param {Move} move Der auszuführende Zug.
 * 
 * @throws Wenn der Zug illegal ist.
 */
export function makeMove(move) {
    if(!exportedFunctions.makeMove(move.bits))
        throw new Error(exportedFunctions.getError());
}

/**
 * @description Macht den letzten Zug rückgängig.
 * 
 * @throws Wenn kein Zug gemacht wurde.
 */
export function undoMove() {
    if(!exportedFunctions.undoMove())
        throw new Error(exportedFunctions.getError());
}

let isAnalysisRunning = false;

/**
 * @description Initialisiert und startet eine Analyse
 * der aktuellen Stellung.
 * 
 * @param {function} updateCallback Eine Callback-Funktion, die
 * bei jedem Update der Analyse aufgerufen wird. Die Funktion
 * erhält ein AnalysisData-Objekt als Parameter.
 */
export function startAnalysis(updateCallback) {
    if(isAnalysisRunning)
        return;

    const callbackWrapper = () => {
        const data = JSON.parse(exportedFunctions.getAnalysisData());

        const variations = [];
        for(const variation of data.variations)
            variations.push(new Variation(variation.moves.map(move => new Move(move)), variation.score));

        updateCallback(new AnalysisData(data.depth, data.nodes, data.time, variations));
    }

    // Füge die Callback-Funktion in die WebAssembly-Tabelle ein.
    const callbackPtr = chessModule.addFunction(callbackWrapper, 'v');

    // Initialisiere die Analyse.
    exportedFunctions.initAnalysis(callbackPtr, 250);

    isAnalysisRunning = true;

    // Starte die Analyse.
    if(!exportedFunctions.startAnalysis()) {
        isAnalysisRunning = false;
        throw new Error(exportedFunctions.getError());
    }

    // Ruf die Callback-Funktion ein letztes Mal auf.
    callbackWrapper();

    isAnalysisRunning = false;

    // Entferne die Callback-Funktion aus der WebAssembly-Tabelle.
    chessModule.removeFunction(callbackPtr);
}

/**
 * @description Stoppt die aktuelle Analyse.
 */
export function stopAnalysis() {
    if(!isAnalysisRunning)
        return;

    if(!exportedFunctions.stopAnalysis())
        throw new Error(exportedFunctions.getError());
}

/**
 * @description Wandelt die interne Repräsentation eines Zuges
 * in die Standard-Figurinen-Notation um.
 * 
 * @param {number} move Die interne Repräsentation des Zuges.
 * 
 * @returns {string} Der Zug in Figurinen-Notation.
 */
export function moveToFigurineNotation(move) {
    return exportedFunctions.moveToFigurineNotation(move.bits);
}