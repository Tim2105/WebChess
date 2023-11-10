const EngineScript = import('/src/scripts/wasm/Engine.js');
let Engine = null;

EngineScript.then((object) => {
    Engine = object;
    Engine.initPlayEngine();

    self.postMessage({
        type: 'ready'
    });
});

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
}