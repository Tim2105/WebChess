<script>
    import { onMount, onDestroy } from 'svelte';
    import AnalysisBoard from './AnalysisBoard.svelte';
    import ChessBoard from "./ChessBoard.svelte";
    import * as Engine from '../scripts/wasm/Engine.js';
    import ChessWorker from '../scripts/WorkerScript.js?worker';
    import { Board, fenToBoard } from '../scripts/Chess.js';

    let engineWorker;
    let isWorkerReady = false;

    let analysisData = new Engine.AnalysisData(0, 0, 1, []);

    function updateAnalysisData(analysis) {
        /**
         * @type {Engine.AnalysisData}
         */
        analysisData = JSON.parse(analysis);

        // Drehe die Bewertung um, wenn Schwarz am Zug ist
        if(board.turn === 'b') {
            for(const variation of analysisData.variations)
                variation.score = -variation.score;
        }
    }

    let board = fenToBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1');
    let legalMoves = [];
    let lastMove = null;

    onMount(() => {
        Engine.setBoard('8/bp1k4/2p5/8/1n4P1/1P3P2/6K1/4R3 w - - 0 1');
        updateState(null);
        startAnalysis();
    });

    onDestroy(() => {
        if(engineWorker)
            engineWorker.terminate();
    });

    function startAnalysis() {
        // Terminiere den alten Worker
        if(engineWorker)
            engineWorker.terminate();

        // Starte einen neuen Worker
        isWorkerReady = false;
        engineWorker = new ChessWorker();
        engineWorker.onmessage = (msg) => {
            msg = msg.data;

            switch(msg.type) {
                case 'ready':
                    isWorkerReady = true;
                    break;
                case 'analysis':
                    updateAnalysisData(msg.data);
                    break;
                case 'error':
                    console.error(msg.data);
                    break;
            }
        }

        // Starte die Analyse,
        // sobald der Worker bereit ist
        const interval = setInterval(() => {
            if(isWorkerReady) {
                clearInterval(interval);
                engineWorker.postMessage({
                    type: 'set',
                    data: Engine.getBoard()
                });

                engineWorker.postMessage({
                    type: 'startAnalysis'
                });
            }
        }, 100);
    }

    function updateState(move) {
        board = fenToBoard(Engine.getBoard());
        legalMoves = Engine.getLegalMoves();
        lastMove = move;
    }

    function handleUserMove(event) {
        const move = event.detail;

        try {
            Engine.makeMove(move);
            startAnalysis();
            updateState(move);
        } catch(e) {
            console.error(e);
        }
    }

    function handleNewFen(event) {
        const fen = event.detail;

        Engine.setBoard(fen);
        startAnalysis();
        updateState(null);
    }

</script>

<div class="container">

    <div class="board">
        <ChessBoard board={board} lastMove={lastMove}
                    legalMoves={legalMoves} allowIllegalMoves={false}
                    on:move={handleUserMove}
                    on:newfen={handleNewFen} />
    </div>

    <div class="analysis">
        <AnalysisBoard engine={Engine} analysisData={analysisData} />
    </div>

</div>

<style>

    .container {
        position: relative;

        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        margin: 0;
        padding: 0;
    }

    .board {
        display: flex;
        justify-content: center;
        align-items: center;

        aspect-ratio: 1/1;
    }

    .analysis {
        align-self: flex-end;
    }

    @media (orientation: landscape) {
        .container {
            flex-wrap: wrap;

            gap: 5%;
        }

        .board {
            height: 100%;
        }

        .analysis {
            height: 100%;
            width: 40%;
        }
    }

    @media (orientation: landscape) and (max-aspect-ratio: 7/5) {
        .board {
            height: 75%;
        }
    }

    @media (orientation: portrait) {
        .container {
            justify-content: flex-start;
        }

        .board {
            width: 100%;

            margin-top: 18.5%;
            margin-top: 14cqh;
        }

        .analysis {
            width: 100%;

            position: absolute;
            top: 100%;
        }
    }

    @media (orientation: portrait) and (min-aspect-ratio: 5/6) {
        .board {
            width: 80%;
        }
    }

</style>