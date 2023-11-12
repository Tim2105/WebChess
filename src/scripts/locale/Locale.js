export const supportedLanguages = {
    en: {
        name: 'English',
        flag: '/flags/flag_en.svg'
    },
    ger: {
        name: 'Deutsch',
        flag: '/flags/flag_ger.svg'
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
    },
    ger: {
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
    }
};