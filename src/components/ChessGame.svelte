<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import ChessBoard from '../components/ChessBoard.svelte';
    import * as Engine from '../scripts/wasm/Engine.js';
    import { fenToBoard } from '../scripts/Chess.js';

    const dispatch = createEventDispatcher();

    let engineWorker = null;

    onMount(() => {
        engineWorker = new Worker('/src/scripts/WorkerScript.js', { type: 'module' });

        engineWorker.onmessage = (msg) => {
            msg = msg.data;

            switch(msg.type) {
                case 'move':
                    handleEngineMove(msg.data);
                    break;
                case 'error':
                    console.log(msg.data);
                    break;
            }
        }
    });

    let board = fenToBoard(Engine.getBoard());

    let legalMoves = Engine.getLegalMoves();

    let lastMove = null;

    let isGameOver = false;

    let isPlayerTurn = true;

    function updateState() {
        // Aktualisiere die Liste der legalen Züge
        legalMoves = Engine.getLegalMoves();

        // Aktualisiere das Schachbrett
        board = fenToBoard(Engine.getBoard());

        // Überprüfe, ob das Spiel vorbei ist
        if(Engine.isCheckmate()) {
            isGameOver = true;

            if(board.turn === 'w')
                dispatch('gameover', { winner: 'black', reason: 'checkmate' });
            else
                dispatch('gameover', { winner: 'white', reason: 'checkmate' });
        } else if(Engine.isDraw()) {
            isGameOver = true;

            dispatch('gameover', { winner: 'none', reason: 'draw' });
        }

        // Übergeben die aktuelle Position an den Engine-Worker
        engineWorker.postMessage({
            type: 'set',
            data: Engine.getBoard()
        });

        isPlayerTurn = !isPlayerTurn;
    }

    function nextMove() {
        updateState();

        if(isGameOver)
            return;

        if(isPlayerTurn)
            return;
        else {
            engineWorker.postMessage({
                type: 'move',
                data: 6000
            });
        }
    }

    function handleUserMove(event) {
        const move = event.detail;

        try {
            Engine.makeMove(move);

            // Speichere den letzten Zug
            lastMove = move;

            nextMove();
        } catch(error) {
            console.log(error);
        }
    }

    function handleEngineMove(move) {
        try {
            Engine.makeMove(move);

            // Speichere den letzten Zug
            lastMove = move;

            updateState();
        } catch(error) {
            console.log(error);
        }
    }
</script>

<ChessBoard board={board} acceptInput={isPlayerTurn} legalMoves={legalMoves} lastMove={lastMove} on:move={handleUserMove} />