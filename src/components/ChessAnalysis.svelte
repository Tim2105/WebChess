<script>
    import { onMount, onDestroy } from 'svelte';
    import AnalysisExplanation from './dialogs/AnalysisExplanationDialog.svelte';
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
        // Markiere den gesamten Text im FEN-Input,
        // wenn dieser fokussiert wird
        document.getElementById('fenInput').addEventListener('focus', (event) => {
            event.target.select();
        });

        updateState(null);
        initAnalysis();
    });

    onDestroy(() => {
        if(engineWorker)
            engineWorker.terminate();
    });

    function initAnalysis() {
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
            initAnalysis();
            updateState(move);
        } catch(e) {
            console.error(e);
        }
    }

    function handleNewFen(event) {
        const fen = event.detail;

        try {
            Engine.setBoard(fen);
            initAnalysis();
            updateState(null);
        } catch(e) {
            // Setze das Spielbrett auf die alte Stellung zurück
            updateState(null);
        }
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

    let showAnalysisExplanation = false;

    function toggleAnalysisExplanation() {
        showAnalysisExplanation = !showAnalysisExplanation;
    }

    function handleKeyDown(event) {
        if(event.key === 'Escape')
            showAnalysisExplanation = false;
    }

</script>

<div class="container">

    <button class="explanationContainer {showAnalysisExplanation ? 'show' : ''}"
            on:click={toggleAnalysisExplanation}>
        <AnalysisExplanation />
    </button>

    <div class="controlBoardContainer">
        <div class="controlContainer">
            <div class="checkboxContainer">
                <div class="label">
                    {allowIllegalMovesText}
                </div>
                <input type="checkbox" class="allowIllegalMoves" bind:checked={allowIllegalMoves} />
            </div>
            <div class="textInputContainer">
                <input type="text" class="fenInput" id="fenInput" bind:value={fenString} placeholder="{fenText}" />
                <button class="fenButton" on:click={setFenFromInput}>
                    {loadFenText}
                </button>
            </div>
        </div>

        <div class="board">
            <ChessBoard board={board} lastMove={lastMove}
                        legalMoves={legalMoves} allowIllegalMoves={allowIllegalMoves}
                        showFile={true} showRank={true}
                        on:move={handleUserMove}
                        on:newfen={handleNewFen} />
        </div>
    </div>

    <div class="analysis">
        <button class="infoButton floatingButton" on:click={toggleAnalysisExplanation}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486
                         10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8
                         8-8 8 3.589 8 8-3.589 8-8 8zm.5-11h-1v5h1v-5zm0
                         6h-1v1h1v-1z"/>
            </svg>
        </button>
        <AnalysisBoard analysisData={analysisData} />
    </div>

</div>

<svelte:window on:keydown={handleKeyDown} />

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

    .explanationContainer {
        display: none;

        position: absolute;
        top: 0;
        left: 0;

        z-index: 6;

        width: 100%;
        height: 100%;

        background: none;
        border: none;
    }

    .explanationContainer:focus {
        outline: none;
    }

    .explanationContainer.show {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .board {
        display: flex;
        justify-content: center;
        align-items: center;

        aspect-ratio: 1/1;
    }

    .controlContainer {
        container-type: inline-size;

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
        text-align: center;
    }

    .fenInput, .fenButton {
        font-size: 1rem;
    }

    .fenInput {
        border: 1px solid black;
        border-radius: 0.25rem;
    }

    .fenButton {
        border: 1px solid black;
        border-radius: 0.25rem;

        padding: 0.25rem 0.5rem;
    }

    @media (orientation: landscape) {
        .label {
            font-size: min(1.25rem, 5vh);
            font-size: min(1.25rem, 5cqh);
        }

        .fenInput {
            width: 60%;

            height: min(1.5rem, 5vh);
            height: min(1.5rem, 5cqh);
        }

        .fenButton {
            width: 35%;

            font-size: min(1rem, 3.5vh);
            font-size: min(1rem, 3.5cqh);
        }
    }

    @media (orientation: portrait) {
        .label {
            font-size: min(1.25rem, 5vw);
            font-size: min(1.25rem, 5cqw);
        }

        .fenInput {
            width: 60%;

            height: min(1.5rem, 5vw);
            height: min(1.5rem, 5cqw);
        }

        .fenButton {
            width: 35%;

            font-size: min(1rem, 3.5vw);
            font-size: min(1rem, 3.5cqw);
        }
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

    .infoButton {
        position: absolute;
        right: 0.5rem;

        z-index: 4;

        width: 3rem;
        height: 3rem;

        padding: 0;

        border: none;

        background-color: white;
    }

    .infoButton:hover {
        cursor: pointer;
    }

    @media (orientation: landscape) {
        .container {
            flex-wrap: wrap;
            align-content: space-between;

            gap: 5%;
        }

        .infoButton {
            top: 0.5rem;
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

        .infoButton {
            bottom: 0.5rem;
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