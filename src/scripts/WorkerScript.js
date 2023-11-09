import * as Engine from '/src/scripts/wasm/Engine.js';

onmessage = (msg) => {
    msg = msg.data;

    if(msg.type === 'set') {
        try {
            Engine.setBoard(msg.data);

            self.postMessage({
                type: 'set',
                data: msg.data
            });
        } catch(e) {
            self.postMessage({
                type: 'error',
                data: e.message
            });
        }
    } else if(msg.type === 'move') {
        const move = Engine.getBestMove(msg.data);
        self.postMessage({
            type: 'move',
            data: move
        });
    }
}