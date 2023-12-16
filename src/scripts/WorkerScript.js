import * as Engine from './wasm/Engine.js';

function handleInitPlay() {
    Engine.initPlayEngine();
}

function handleStartAnalysis() {
    try {
        Engine.startAnalysis((analysis) => {
            self.postMessage({
                type: 'analysis',
                data: JSON.stringify(analysis)
            });
        });
    } catch(e) {
        self.postMessage({
            type: 'error',
            data: e.message
        });
    }
}

function handleStopAnalysis() {
    Engine.stopAnalysis();
}

function handleSet(fen) {
    try {
        Engine.setBoard(fen);

        self.postMessage({
            type: 'set',
            data: fen
        });
    } catch(e) {
        self.postMessage({
            type: 'error',
            data: e.message
        });
    }
}

function handleMove(move) {
    try {
        Engine.makeMove(move);

        self.postMessage({
            type: 'move',
            data: move
        });
    } catch(e) {
        self.postMessage({
            type: 'error',
            data: e.message
        });
    }
}

function handleSearch(time) {
    const move = Engine.getBestMove(time);

    self.postMessage({
        type: 'search',
        data: move
    });
}

onmessage = (msg) => {
    msg = msg.data;

    switch(msg.type) {
        case 'set':
            handleSet(msg.data);
            break;
        case 'move':
            handleMove(msg.data);
            break;
        case 'search':
            handleSearch(msg.data);
            break;
        case 'initPlay':
            handleInitPlay();
            break;
        case 'startAnalysis':
            handleStartAnalysis();
            break;
        case 'stopAnalysis':
            handleStopAnalysis();
            break;
    }
}

self.postMessage({
    type: 'ready'
});