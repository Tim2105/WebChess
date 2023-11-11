<script>
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';
    import ChessBoard from '../components/ChessBoard.svelte';
    import ChessClock from './ChessClock.svelte';
    import * as Engine from '../scripts/wasm/Engine.js';
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

    export let whitePlayer;
    export let blackPlayer;

    $: waitForWhitePlayer = whitePlayer === 'user' ? waitforUserMove : waitForEngineMove;
    $: waitForBlackPlayer = blackPlayer === 'user' ? waitforUserMove : waitForEngineMove;

    let engineWorker = null;
    let isWorkerReady = false;

    onMount(() => {
        engineWorker = new Worker('/src/scripts/WorkerScript.js');

        engineWorker.onmessage = (msg) => {
            msg = msg.data;

            switch(msg.type) {
                case 'search':
                    handleEngineMove(msg.data);
                    break;
                case 'ready':
                    isWorkerReady = true;
                    break;
                case 'error':
                    console.log(msg.data);
                    break;
            }
        }

        startGame();
    });

    onDestroy(() => {
        if(engineWorker)
            engineWorker.terminate();

        if(timerInterval)
            clearInterval(timerInterval);
    });

    let board = fenToBoard(Engine.getBoard());

    let legalMoves = Engine.getLegalMoves();

    let lastMove = null;

    let isGameOver = false;

    let waitingForUserInput = false;

    export let whiteFullTime;
    export let blackFullTime;
    let whiteTime = whiteFullTime;
    let blackTime = blackFullTime;
    let whiteStarted = false;
    let blackStarted = false;

    let timerInterval = null;
    let lastTimestamp = 0;

    export function startGame(fen) {
        // Warte, bis die Engine bereit ist
        if(!isWorkerReady) {
            setTimeout(() => startGame(fen), 100);
            return;
        }

        if(fen) {
            Engine.setBoard(fen);

            if(engineWorker) {
                engineWorker.postMessage({
                    type: 'set',
                    data: fen
                });
            }
        }

        if(timerInterval)
            clearInterval(timerInterval);
        
        lastMove = null;
        isGameOver = false;
        waitingForUserInput = false;

        whiteTime = whiteFullTime;
        blackTime = blackFullTime;

        whiteStarted = false;
        blackStarted = false;
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
        if(timerInterval) {
            const now = performance.now();

            // Inkrementiere die Zeit des Spielers um 10ms, der gerade am Zug war
            // um für die Berechnungdauer der Anwendung zu kompensieren
            const increment = 10;

            if(board.turn === 'w')
                whiteTime -= now - lastTimestamp - increment;
            else
                blackTime -= now - lastTimestamp - increment;

            clearInterval(timerInterval);
        }
    }

    function nextMove(lastPlayedMove) {
        updateState(lastPlayedMove);

        if(isGameOver)
            return;

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
            }

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
            }

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
        } catch(error) {
            console.log(error);
        }
    }

    function handleUserMove(event) {
        applyMove(event.detail);
    }

    function handleEngineMove(move) {
        applyMove(move);
    }

</script>

<div class="container">

    <div class="clock blackClock">
        <ChessClock time={blackTime} color="black" />
    </div>

    <div class="board">
        <ChessBoard board={board} acceptInput={waitingForUserInput && !isGameOver}
                    legalMoves={legalMoves} lastMove={lastMove}
                    on:move={handleUserMove} />
    </div>

    <div class="clock whiteClock">
        <ChessClock time={whiteTime} color="white" />
    </div>

</div>

<style>
    .container {
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

    @media (orientation: landscape) {
        .container {
            flex-wrap: wrap;

            gap: 5%;
        }

        .board {
            height: 99%;

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
        }

        .blackClock {
            margin: auto 0;
        }

        .whiteClock {
            margin: auto 0;
        }
    }

    @media (orientation: portrait) and (min-aspect-ratio: 5/6) {
        .board {
            width: 80%;
        }
    }


</style>