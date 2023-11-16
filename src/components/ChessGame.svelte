<script>
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';
    import ChessBoard from '../components/ChessBoard.svelte';
    import ChessClock from './ChessClock.svelte';
    import * as Engine from '../scripts/wasm/Engine.js';
    import ChessWorker from '../scripts/WorkerScript.js?worker';
    import { fenToBoard } from '../scripts/Chess.js';

    const dispatch = createEventDispatcher();

    function waitforUserMove(time) {
        waitingForUserInput = true;
    }

    function waitForEngineMove(time) {
        engineWorker.postMessage({
            type: 'search',
            data: time
        });
    }

    let whitePlayer = 'user';
    let blackPlayer = 'engine';

    let flipBoard = false;

    function flip() {
        flipBoard = !flipBoard;

        // Tausche die Spieler
        let temp = whitePlayer;
        whitePlayer = blackPlayer;
        blackPlayer = temp;

        // Tausche die Eingabefunktionen der Spieler
        temp = waitForWhitePlayer;
        waitForWhitePlayer = waitForBlackPlayer;
        waitForBlackPlayer = temp;

        waitingForUserInput = false;

        if(board.turn === 'w' && whitePlayer === 'user')
            waitForWhitePlayer(whiteTime);
        else if(board.turn === 'b' && blackPlayer === 'user')
            waitForBlackPlayer(blackTime);
    }

    $: waitForWhitePlayer = whitePlayer === 'user' ? waitforUserMove : waitForEngineMove;
    $: waitForBlackPlayer = blackPlayer === 'user' ? waitforUserMove : waitForEngineMove;

    let engineWorker = null;
    let isWorkerReady = false;

    onMount(async () => {
        engineWorker = new ChessWorker();

        engineWorker.onmessage = (msg) => {
            msg = msg.data;

            switch(msg.type) {
                case 'search':
                    handleEngineMove(msg.data);
                    break;
                case 'ready':
                    engineWorker.postMessage({
                        type: 'initPlay'
                    });
                    isWorkerReady = true;
                    break;
                case 'error':
                    console.error(msg.data);
                    break;
            }
        };

        setup();
    });

    onDestroy(() => {
        if(engineWorker)
            engineWorker.terminate();

        if(timerInterval)
            clearInterval(timerInterval);
    });

    let board = fenToBoard("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

    let legalMoves = [];

    let lastMove = null;

    let started = false;
    let isGameOver = false;

    let waitingForUserInput = false;

    export let whiteFullTime;
    export let blackFullTime;
    let whiteTime = whiteFullTime;
    let blackTime = blackFullTime;
    let whiteStarted = false;
    let blackStarted = false;

    let timerInterval = null;
    let lastTimestamp = null;

    export function setup(fen) {
        // Warte, bis die Engine bereit ist
        if(!isWorkerReady) {
            setTimeout(() => setup(fen), 100);
            return;
        }

        if(!fen)
            fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

        Engine.setBoard(fen);

        if(engineWorker) {
            engineWorker.postMessage({
                type: 'set',
                data: fen
            });
        }

        if(timerInterval)
            clearInterval(timerInterval);
        
        lastMove = null;
        isGameOver = false;
        waitingForUserInput = false;

        whiteTime = whiteFullTime;
        blackTime = blackFullTime;
        lastTimestamp = null;

        started = false;
        whiteStarted = false;
        blackStarted = false;

        updateState(null);

        if(board.turn === 'w' && whitePlayer === 'user')
            waitForWhitePlayer(null);
        else if(board.turn === 'b' && blackPlayer === 'user')
            waitForBlackPlayer(null);
    }

    function startGame() {
        nextMove(null);
    }

    function updateState(lastPlayedMove) {
        // Aktualisiere die Liste der legalen Züge
        legalMoves = Engine.getLegalMoves();

        // Speichere den letzten Zug
        lastMove = lastPlayedMove;

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

            if(Engine.isDrawByStalemate())
                dispatch('gameover', { winner: 'none', reason: 'stalemate' });
            else if(Engine.isDrawByFiftyMoveRule())
                dispatch('gameover', { winner: 'none', reason: 'fifty-move-rule' });
            else if(Engine.isDrawByThreefoldRepetition())
                dispatch('gameover', { winner: 'none', reason: 'threefold-repetition' });
            else if(Engine.isDrawByInsufficientMaterial())
                dispatch('gameover', { winner: 'none', reason: 'insufficient-material' });
        }

        // Übergebe den letzen gespielten Zug an die Engine
        if(lastMove) {
            engineWorker.postMessage({
                type: 'move',
                data: lastMove
            });
        }
    }

    function pauseTimer() {
        // Lösche den Timer (falls vorhanden)
        // und aktualisiere die Zeit des Spielers,
        // der gerade am Zug war
        if(timerInterval && lastTimestamp) {
            const now = performance.now();

            // Inkrementiere die Zeit des Spielers um 15ms, der gerade am Zug war
            // um für die Berechnungdauer der Anwendung zu kompensieren
            const increment = 15;

            if(board.turn === 'w')
                whiteTime -= now - lastTimestamp - increment;
            else
                blackTime -= now - lastTimestamp - increment;

            clearInterval(timerInterval);
        }
    }

    function nextMove(lastPlayedMove) {
        started = true;
        waitingForUserInput = false;

        updateState(lastPlayedMove);

        if(isGameOver) {
            // Beende den Timer,
            // falls das Spiel vorbei ist
            if(timerInterval)
                clearInterval(timerInterval);

            return;
        }

        // Warte auf den nächsten Zug
        if(board.turn === 'w') {
            // Starte den Timer für den weißen Spieler
            if(whiteStarted || whitePlayer === 'engine') {
                lastTimestamp = performance.now();
                timerInterval = setInterval(() => {
                    const now = performance.now();
                    whiteTime -= now - lastTimestamp;
                    lastTimestamp = now;

                    if(whiteTime <= 0) {
                        clearInterval(timerInterval);
                        isGameOver = true;
                        dispatch('gameover', { winner: 'black', reason: 'timeout' });
                    }
                }, 100);
            } else
                lastTimestamp = null;

            waitForWhitePlayer(whiteTime);
        } else {
            // Starte den Timer für den schwarzen Spieler
            if(blackStarted || blackPlayer === 'engine') {
                lastTimestamp = performance.now();
                timerInterval = setInterval(() => {
                    const now = performance.now();
                    blackTime -= now - lastTimestamp;
                    lastTimestamp = now;

                    if(blackTime <= 0) {
                        clearInterval(timerInterval);
                        isGameOver = true;
                        dispatch('gameover', { winner: 'white', reason: 'timeout' });
                    }
                }, 100);
            } else
                lastTimestamp = null;

            waitForBlackPlayer(blackTime);
        }
    }

    function applyMove(move) {
        if(isGameOver) {
            clearInterval(timerInterval);
            return;
        }

        try {
            Engine.makeMove(move);
            pauseTimer();

            if(board.turn === 'w')
                whiteStarted = true;
            else
                blackStarted = true;

            nextMove(move);
        } catch(error) {}
    }

    function handleUserMove(event) {
        applyMove(event.detail);
    }

    function handleEngineMove(move) {
        applyMove(move);
    }

    function updateWhiteTime(event) {
        whiteFullTime = event.detail.time;
        whiteTime = event.detail.time;
    }

    function updateBlackTime(event) {
        blackFullTime = event.detail.time;
        blackTime = event.detail.time;
    }

</script>

<div class="container">

    {#if !started}
        <div class="floatingButtonContainer">
            <button class="floatingButton" on:click={startGame}>
                <img src="/icons/PlayIcon.svg" alt="Start" draggable="false" oncontextmenu="return false;" />
            </button>
            <button class="floatingButton" on:click={flip}>
                <img src="/icons/FlipIcon.svg" alt="Flip" draggable="false" oncontextmenu="return false;" />
            </button>
        </div>
    {/if}

    {#if !flipBoard}
        <div class="clock blackClock">
            <ChessClock time={blackTime} color="black"
                        editable={!started}
                        on:update={updateBlackTime} />
        </div>

        <div class="clock whiteClock">
            <ChessClock time={whiteTime} color="white"
                        editable={!started}
                        on:update={updateWhiteTime} />
        </div>
    {:else}
        <div class="clock blackClock">
            <ChessClock time={whiteTime} color="white"
                        editable={!started}
                        on:update={updateWhiteTime} />
        </div>

        <div class="clock whiteClock">
            <ChessClock time={blackTime} color="black"
                        editable={!started}
                        on:update={updateBlackTime} />
        </div>
    {/if}

    <div class="board">
        <ChessBoard board={board} flipBoard={flipBoard}
                    acceptInput={waitingForUserInput && !isGameOver}
                    legalMoves={legalMoves} lastMove={lastMove}
                    on:move={handleUserMove} />
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

    .floatingButtonContainer {
        position: absolute;
        right: max(0.5rem, 1vw);

        z-index: 5;
    }

    @media (orientation: landscape) {
        .container {
            flex-wrap: wrap;

            gap: 5%;
        }

        .floatingButtonContainer {
            top: max(0.5rem, 1vw);
        }

        .board {
            height: 100%;

            margin-left: auto;

            order: 1;
        }

        .clock {
            margin: 0;
            margin-right: auto;

            order: 2;
        }
    }

    @media (orientation: landscape) and (max-aspect-ratio: 7/5) {
        .container {
            display: grid;
            grid-template-columns: 75% 25%;
            grid-template-rows: auto auto;
        }

        .board {
            height: 75%;

            grid-row: 1 / 3;
        }

        .blackClock {
            margin-top: auto;
        }

        .whiteClock {
            margin-bottom: auto;
        }
    }

    @media (orientation: portrait) {
        .board {
            width: 100%;
            order: 2;
        }

        .floatingButtonContainer {
            bottom: max(0.5rem, 1vw);

            display: flex;
            flex-direction: column;

            gap: 0.25rem;
        }

        .blackClock {
            margin: auto 0;
            order: 1;
        }

        .whiteClock {
            margin: auto 0;
            order: 3;
        }
    }

    @media (orientation: portrait) and (min-aspect-ratio: 5/6) {
        .board {
            width: 80%;
        }
    }

    @media (orientation: portrait) and (min-aspect-ratio: 3/4) {
        .floatingButtonContainer {
            bottom: 0;
            right: 0;

            display: flex;
            flex-direction: row;

            gap: 0.25rem;
        }
    }

</style>