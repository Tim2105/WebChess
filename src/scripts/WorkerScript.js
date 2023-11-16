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

    if(msg.type === 'set')
        handleSet(msg.data);
    else if(msg.type === 'move')
        handleMove(msg.data);
    else if(msg.type === 'search')
        handleSearch(msg.data);
    else if(msg.type === 'initPlay')
        handleInitPlay();
    else if(msg.type === 'startAnalysis')
        handleStartAnalysis();
    else if(msg.type === 'stopAnalysis')
        handleStopAnalysis();
}

self.postMessage({
    type: 'ready'
});