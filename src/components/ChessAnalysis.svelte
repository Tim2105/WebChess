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
    let fenString = '';

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

        if(!Engine.isGameOngoing()) {
            let score = 0;
            if(Engine.isCheckmate()) {
                if(board.turn === 'w')
                    score = 21000;
                else
                    score = -21000;
            }

            const variation = new Engine.Variation([0], score);
            analysisData = new Engine.AnalysisData(0, 0, 1, [variation]);
        } else {
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
    let fenText = Locale.getTranslation('text.fen');
    let loadFenText = Locale.getTranslation('text.loadFen');
    Locale.addChangeListener(() => {
        allowIllegalMovesText = Locale.getTranslation('text.allowIllegalMoves');
        fenText = Locale.getTranslation('text.fen');
        loadFenText = Locale.getTranslation('text.loadFen');
    });

    function setFenFromInput() {
        try {
            handleNewFen({ detail: fenString });
        } catch(e) {}
    }

</script>

<div class="container">

    <div class="controlBoardContainer">
        <div class="controlContainer">
            <div class="checkboxContainer">
                <div class="label">
                    {allowIllegalMovesText}
                </div>
                <input type="checkbox" class="allowIllegalMoves" bind:checked={allowIllegalMoves} />
            </div>
            <div class="textInputContainer">
                <input type="text" class="fenInput" bind:value={fenString} placeholder="{fenText}" />
                <button class="fenButton" on:click={setFenFromInput}>
                    {loadFenText}
                </button>
            </div>
        </div>

        <div class="board">
            <ChessBoard board={board} lastMove={lastMove}
                        legalMoves={legalMoves} allowIllegalMoves={allowIllegalMoves}
                        on:move={handleUserMove}
                        on:newfen={handleNewFen} />
        </div>
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

    .controlContainer {
        width: 100%;
        height: 10%;

        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;

        gap: 0.5rem;

        margin: 0.5rem 0 0 0;
    }

    .checkboxContainer {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .textInputContainer {
        display: flex;
        justify-content: center;
        align-items: center;

        gap: 0.25rem;

        max-width: 100%;
    }

    .label {
        font-size: 1.25rem;
        text-align: center;
    }

    .fenInput, .fenButton {
        font-size: 1rem;
    }

    .fenInput {
        height: 1.5rem;

        border: 1px solid black;
        border-radius: 0.25rem;
    }

    .fenButton {
        border: 1px solid black;
        border-radius: 0.25rem;

        padding: 0.25rem 0.5rem;
    }

    @keyframes buttonHover {
        from {
            background-image: none;
            background-size: 0 100%;
        }

        to {
            background-image: linear-gradient(to left,
                                              transparent, transparent 50%,
                                            #48a9fe 50%, #0beef9 100%);
            background-size: 200% 100%;
        }
    }

    .fenButton:hover {
        animation: buttonHover 0.15s ease-out -0.05s;
        animation-fill-mode: forwards;

        cursor: pointer;
    }

    .fenButton:focus {
        animation: buttonHover 0.2s ease-out;
        animation-fill-mode: forwards;

        cursor: pointer;
    }

    .allowIllegalMoves {
        width: 1.5rem;
        height: 1.5rem;

        margin-left: 1rem;
    }

    .analysis {
        align-self: flex-end;
    }

    .controlBoardContainer {
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;

        gap: 1rem;
    }

    @media (orientation: landscape) {
        .container {
            flex-wrap: wrap;
            align-content: space-between;

            gap: 5%;
        }

        .controlBoardContainer {
            width: 60%;

            align-items: center;
        }

        .board {
            height: 75%;
        }

        .analysis {
            height: 100%;

            width: 35%;
        }
    }

    @media (orientation: landscape) and (max-aspect-ratio: 6/5) {
        .board {
            height: 64%;
        }
    }

    @media (orientation: landscape) and (min-aspect-ratio: 19/10) {
        .board {
            height: 100%;
        }

        .analysis {
            width: 25%;
        }

        .controlBoardContainer {
            flex-direction: row;
            justify-content: center;
            align-items: center;

            width: 70%;
        }

        .controlContainer {
            width: 100%;
            height: 100%;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    }


    @media (orientation: portrait) {
        .container {
            justify-content: space-around;
        }

        .controlBoardContainer {
            width: 100%;

            align-items: center;
        }

        .board {
            width: 100%;
        }

        .analysis {
            width: 100%;
        }

        .controlContainer {
            width: 90%;
            margin-left: 10%;
        }
    }

    @media (orientation: portrait) and (min-aspect-ratio: 3/4) {
        .board {
            width: 88%;
        }
    }

    @media (orientation: portrait) and (min-aspect-ratio: 8/9) {
        .board {
            width: 78%;
        }
    }

</style>