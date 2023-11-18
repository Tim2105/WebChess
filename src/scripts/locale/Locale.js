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
        'text.allowIllegalMoves': 'Allow illegal moves'
    },
    de: {
        'app.title': 'WebChess',
        'app.description': 'Web App zum Schach spielen und analysieren',
        'game.white': 'Weiss',
        'game.black': 'Schwarz',
        'prompt.newGame': 'Neues Spiel',
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
        'text.allowIllegalMoves': 'Illegale Züge erlauben'
    },
    fr: {
        'app.title': 'WebChess',
        'app.description': 'Application Web pour jouer et analyser aux échecs',
        'game.white': 'Blanc',
        'game.black': 'Noir',
        'prompt.newGame': 'Nouvelle partie',
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
        'text.allowIllegalMoves': 'Autoriser les coups illégaux'
    }
};