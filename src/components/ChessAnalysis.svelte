<script>
    import { onMount, onDestroy } from 'svelte';
    import AnalysisBoard from './AnalysisBoard.svelte';
    import ChessBoard from "./ChessBoard.svelte";
    import * as Engine from '../scripts/wasm/Engine.js';
    import * as Locale from '../scripts/locale/Locale.js';
    import ChessWorker from '../scripts/WorkerScript.js?worker';
    import { Board, fenToBoard } from '../scripts/Chess.js';

    let engineWorker;
    let isWorkerReady = false;

    let analysisData = new Engine.AnalysisData(0, 0, 1, []);

    function attachFan(analysisData) {
        for(const variation of analysisData.variations) {
            for(let i = 0; i < variation.moves.length; i++) {
                variation.moves[i].fan = Engine.moveToFigurineNotation(variation.moves[i]);
                Engine.makeMove(variation.moves[i]);
            }

            for(let i = 0; i < variation.moves.length; i++)
                Engine.undoMove();
        }
    }

    function updateAnalysisData(analysis) {
        /**
         * @type {Engine.AnalysisData}
         */
        analysisData = Engine.AnalysisData.fromJSON(analysis);

        // Drehe die Bewertung um, wenn Schwarz am Zug ist
        if(board.turn === 'b') {
            for(const variation of analysisData.variations)
                variation.score = -variation.score;
        }

        // Füge allen Zügen die FAN (Figurine Algebraic Notation) hinzu
        attachFan(analysisData);
    }

    let board = fenToBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1');
    let legalMoves = [];
    let lastMove = null;

    onMount(() => {
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

    let allowIllegalMoves = false;

    let allowIllegalMovesText = Locale.getTranslation('text.allowIllegalMoves');
    Locale.addChangeListener(() => {
        allowIllegalMovesText = Locale.getTranslation('text.allowIllegalMoves');
    });

</script>

<div class="container">

    <div class="checkboxContainer">
        <div class="label">
            {allowIllegalMovesText}
        </div>
        <input type="checkbox" class="allowIllegalMoves" bind:checked={allowIllegalMoves} />
    </div>

    <div class="board">
        <ChessBoard board={board} lastMove={lastMove}
                    legalMoves={legalMoves} allowIllegalMoves={allowIllegalMoves}
                    on:move={handleUserMove}
                    on:newfen={handleNewFen} />
    </div>

    <div class="analysis">
        <AnalysisBoard analysisData={analysisData} />
    </div>

</div>

<style>

    .container {
        container-type: inline-size;

        position: relative;

        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        margin: 0;
        padding: 0;

        overflow-y: hidden;
    }

    .board {
        display: flex;
        justify-content: center;
        align-items: center;

        aspect-ratio: 1/1;
    }

    .checkboxContainer {
        align-self: flex-end;

        display: flex;
        justify-content: center;
        align-items: center;

        margin: 1rem 1rem 1rem 0;
    }

    .label {
        font-size: 1.25rem;
        text-align: center;
    }

    .allowIllegalMoves {
        width: 1.5rem;
        height: 1.5rem;

        margin-left: 1rem;
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
            justify-content: space-around;
        }

        .board {
            width: 100%;
        }

        .analysis {
            width: 100%;
        }
    }

    @media (orientation: portrait) and (min-aspect-ratio: 5/7) {
        .board {
            width: 80%;
        }
    }

    @media (orientation: portrait) and (min-aspect-ratio: 8/9) {
        .board {
            width: 70%;
        }
    }

</style>