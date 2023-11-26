export const supportedLanguages = {
    en: {
        name: 'English',
        flag: '/flags/flag_en.svg'
    },
    de: {
        name: 'Deutsch',
        flag: '/flags/flag_de.svg'
    },
    fr: {
        name: 'Français',
        flag: '/flags/flag_fr.svg'
    }
};

let currentLanguage = 'en';
const defaultLanguage = 'en';

const changeListeners = [];

export function setLanguage(lang) {
    if(supportedLanguages[lang]) {
        currentLanguage = lang;

        changeListeners.forEach(listener => listener(lang));
    }
}

export function getLanguage() {
    return currentLanguage;
}

export function addChangeListener(listener) {
    changeListeners.push(listener);
}

export function removeChangeListener(listener) {
    changeListeners.splice(changeListeners.indexOf(listener), 1);
}

export function getTranslation(key) {
    const translation = translations[currentLanguage][key];
    if(translation) {
        return translation;
    } else {
        console.warn(`No translation found for key "${key}" in language "${currentLanguage}".`);
        return translations[defaultLanguage][key];
    }
}

export const translations = {
    en: {
        'app.title': 'WebChess',
        'app.description': 'Web App for playing and analyzing chess',
        'game.white': 'White',
        'game.black': 'Black',
        'prompt.newGame': 'New game',
        'prompt.analyze': 'Analyze',
        'msg.close': 'Close',
        'msg.gameOver': 'Game over',
        'msg.whiteWinsByCheckmate': 'White wins by checkmate',
        'msg.blackWinsByCheckmate': 'Black wins by checkmate',
        'msg.whiteWinsByTimeout': 'White wins by timeout',
        'msg.blackWinsByTimeout': 'Black wins by timeout',
        'msg.drawByStalemate': 'Draw by stalemate',
        'msg.drawByThreefoldRepetition': 'Draw by threefold repetition',
        'msg.drawByFiftyMoveRule': 'Draw by fifty move rule',
        'msg.drawByInsufficientMaterial': 'Draw by insufficient material',
        'text.score': 'Score',
        'text.depth': 'Depth',
        'text.knps': 'kNps',
        'text.bestMove': 'Best move',
        'text.variations': 'Variations',
        'text.loading': 'Loading',
        'text.allowIllegalMoves': 'Allow illegal moves',
        'text.fen': 'FEN',
        'text.loadFen': 'Load FEN',
        'text.noMove': 'No move',
        'text.analysisExplanationHeader':
        `The analysis is done by a custom chess engine, written in C++ (from scratch) and compiled to WebAssembly.
        During its search, the engine collects various information, most of which is displayed here.
        `,
        'text.analysisExplanationScore':
        `The score is the evaluation of the current position in pawn units.
        A Score of 1 is equivalent to an advantage of one pawn.
        A positive score indicates an advantage for white while a negative score indicates an advantage for black.
        `,
        'text.analysisExplanationDepth':
        `The depth is a lower bound for the number of half moves the engine has looked ahead in all variations.
        `,
        'text.analysisExplanationBestMove':
        `The best move is the move the engine thinks is best in the current position.
        `,
        'text.analysisExplanationKnps':
        `The average number of thousand positions (nodes) the engine searches per second
        or, in other words, the number of positions the engine searches per millisecond.
        This measurement is an indicator for the speed of the engine.
        `,
        'text.analysisExplanationVariations':
        `The variations contain the sequences of moves, that led the engine to its evaluation.
        Even though the engine reports the three best variations, only the first one influences the score.
        The other variations are only collected for user information.
        `,
    },
    de: {
        'app.title': 'WebChess',
        'app.description': 'Web App zum Schach spielen und analysieren',
        'game.white': 'Weiss',
        'game.black': 'Schwarz',
        'prompt.newGame': 'Neues Spiel',
        'prompt.analyze': 'Analysieren',
        'msg.close': 'Schließen',
        'msg.gameOver': 'Spiel vorbei',
        'msg.whiteWinsByCheckmate': 'Weiß gewinnt durch Schachmatt',
        'msg.blackWinsByCheckmate': 'Schwarz gewinnt durch Schachmatt',
        'msg.whiteWinsByTimeout': 'Weiß gewinnt durch Zeitüberschreitung',
        'msg.blackWinsByTimeout': 'Schwarz gewinnt durch Zeitüberschreitung',
        'msg.drawByStalemate': 'Remis durch Patt',
        'msg.drawByThreefoldRepetition': 'Remis durch dreifache Stellungswiederholung',
        'msg.drawByFiftyMoveRule': 'Remis durch die 50-Züge-Regel',
        'msg.drawByInsufficientMaterial': 'Remis durch unzureichendes Material',
        'text.score': 'Bewertung',
        'text.depth': 'Tiefe',
        'text.knps': 'kNps',
        'text.bestMove': 'Bester Zug',
        'text.variations': 'Varianten',
        'text.loading': 'Lädt',
        'text.allowIllegalMoves': 'Illegale Züge erlauben',
        'text.fen': 'FEN',
        'text.loadFen': 'FEN laden',
        'text.noMove': 'Kein Zug',
        'text.analysisExplanationHeader':
        `Die Analyse wird von einer eigenen Schachengine durchgeführt, die (von Grund auf) in C++ geschrieben und in WebAssembly kompiliert wurde.
        Während der Suche sammelt die Engine verschiedene Informationen, von denen die meisten hier angezeigt werden.
        `,
        'text.analysisExplanationScore':
        `Die Bewertung ist die Evaluation der aktuellen Stellung in Bauerneinheiten.
        Eine Bewertung von 1 bedeutet einen Vorteil, der einem Bauern entspricht.
        Eine positive Bewertung deutet auf einen Vorteil für Weiß hin, während eine negative Bewertung auf einen Vorteil für Schwarz hinweist.
        `,
        'text.analysisExplanationDepth':
        `Die Tiefe ist eine untere Schranke für die Anzahl der Halbzüge, die die Engine in allen Varianten vorrausgeschaut hat.
        `,
        'text.analysisExplanationBestMove':
        `Der beste Zug ist der Zug, den die Engine in der aktuellen Stellung für den Besten hält.
        `,
        'text.analysisExplanationKnps':
        `Die durchschnittliche Anzahl der tausend Positionen (Knoten), die die Engine pro Sekunde durchsucht,
        oder mit anderen Worten, die Anzahl der Positionen, die die Engine pro Millisekunde durchsucht.
        Dieser Wert ist eine Messgröße für die Geschwindigkeit der Engine.
        `,
        'text.analysisExplanationVariations':
        `Die Varianten enthalten die Zugfolgen, die die Engine zu ihrer Bewertung geführt haben.
        Obwohl die Engine die drei besten Varianten ausgibt, beeinflusst nur die Erste die Bewertung.
        Die anderen Varianten werden nur zu Informationszwecken gesammelt.
        `,
    },
    fr: {
        'app.title': 'WebChess',
        'app.description': 'Application Web pour jouer et analyser aux échecs',
        'game.white': 'Blanc',
        'game.black': 'Noir',
        'prompt.newGame': 'Nouvelle partie',
        'prompt.analyze': 'Analyser',
        'msg.close': 'Fermer',
        'msg.gameOver': 'Partie terminée',
        'msg.whiteWinsByCheckmate': 'Les blancs gagnent par échec et mat',
        'msg.blackWinsByCheckmate': 'Les noirs gagnent par échec et mat',
        'msg.whiteWinsByTimeout': 'Les blancs gagnent par dépassement de temps',
        'msg.blackWinsByTimeout': 'Les noirs gagnent par dépassement de temps',
        'msg.drawByStalemate': 'Partie nulle par pat',
        'msg.drawByThreefoldRepetition': 'Partie nulle par triple répétition de position',
        'msg.drawByFiftyMoveRule': 'Partie nulle par la règle des 50 coups',
        'msg.drawByInsufficientMaterial': 'Partie nulle par matériel insuffisant',
        'text.score': 'Évaluation',
        'text.depth': 'Profondeur',
        'text.knps': 'kNps',
        'text.bestMove': 'Meilleur coup',
        'text.variations': 'Variantes',
        'text.loading': 'Chargement',
        'text.allowIllegalMoves': 'Autoriser les coups illégaux',
        'text.fen': 'FEN',
        'text.loadFen': 'Charger FEN',
        'text.noMove': 'Pas de coup',
        'text.analysisExplanationHeader':
        `L'analyse est effectuée par un moteur d'échecs personnalisé, écrit en C++ (à partir de zéro) et compilé en WebAssembly.
        Pendant sa recherche, le moteur collecte diverses informations, dont la plupart sont affichées ici.
        `,
        'text.analysisExplanationScore':
        `L'évaluation est l'évaluation de la position actuelle en unités de pions.
        Une évaluation de 1 signifie un avantage équivalent à un pion.
        Une évaluation positive indique un avantage pour les blancs tandis qu'une évaluation négative indique un avantage pour les noirs.
        `,
        'text.analysisExplanationDepth':
        `La profondeur est une borne inférieure pour le nombre de demi-coups que le moteur a regardé dans toutes les variations.
        `,
        'text.analysisExplanationBestMove':
        `Le meilleur coup est le coup que le moteur pense être le meilleur dans la position actuelle.
        `,
        'text.analysisExplanationKnps':
        `Le nombre de milliers de positions (nœuds) que le moteur recherche par seconde en moyenne
        ou, en d'autres termes, le nombre de positions que le moteur recherche par milliseconde.
        Cette mesure est un indicateur de la vitesse du moteur.
        `,
        'text.analysisExplanationVariations':
        `Les variations contiennent les séquences de coups qui ont conduit le moteur à son évaluation.
        Bien que le moteur signale les trois meilleures variations, seule la première influence l'évaluation.
        Les autres variations ne sont collectées que pour l'information de l'utilisateur.
        `,
    }
};