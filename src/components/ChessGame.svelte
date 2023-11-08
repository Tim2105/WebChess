<script>
    import { createEventDispatcher } from 'svelte';
    import ChessBoard from '../components/ChessBoard.svelte';
    import * as Engine from '../scripts/wasm/Engine.js';
    import { fenToBoard } from '../scripts/Chess.js';

    const dispatch = createEventDispatcher();

    let board = fenToBoard(Engine.getBoard());

    let legalMoves = Engine.getLegalMoves();

    let lastMove = null;

    let isGameOver = false;

    function handleMove(event) {
        if(isGameOver)
            return;

        const move = event.detail;
        Engine.makeMove(move);

        // Aktualisiere die Liste der legalen Züge
        legalMoves = Engine.getLegalMoves();

        // Aktualisiere den letzten Zug
        lastMove = move;

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
    }

</script>

<ChessBoard board={board} legalMoves={legalMoves} lastMove={lastMove} on:move={handleMove} />