<script>
    import { createEventDispatcher } from 'svelte';

    import ChessSquare from './ChessSquare.svelte';
    import { Board } from '../scripts/Chess.js';

    const dispatch = createEventDispatcher();

    /**
     * @description Die Liste der Figuren auf dem Schachbrett.
     * Sollte von außen bereitgestellt werden.
     * @type {Board}
     */
    export let board;

    /**
     * @description Die Liste der legalen Züge.
     * Muss von außen bereitgestellt werden.
     * @type {Move[]}
     */
    export let legalMoves = [];

    /**
     * @description Der letzte gespielte Zug.
     * @type {Move[]}
     */
    export let lastMove = null;

    let selectedSquare = null;

    $: legalDestFromSelectedSquare = legalMoves.filter(move => move.from === selectedSquare)
                                     .map(move => move.to);

    function handleClick(event) {
        const square = event.detail.square;
        if(selectedSquare === square) {
            selectedSquare = null;
        } else {
            // Überprüfe, ob der Zug legal ist
            const move = legalMoves.find(move => move.from === selectedSquare && move.to === square);

            if(move) {
                // Emittiere ein 'move'-Event
                dispatch('move', move);
                selectedSquare = null;
            } else {
                // Wähle das Feld aus, wenn es das Ausgangsfeld eines legalen Zuges ist
                if(legalMoves.some(move => move.from === square))
                    selectedSquare = square;
            }
        }
    }

</script>

<div class="board">
    {#each {length: 8} as _, rank}
        {#each {length: 8} as _, file}
            <ChessSquare square={(7 - rank) * 8 + file}
                         piece={board.pieces[(7 - rank) * 8 + file]}
                         isSelected={selectedSquare === (7 - rank) * 8 + file}
                         isOrigOrDestOfLastMove={lastMove && (lastMove.from === (7 - rank) * 8 + file
                                                 || lastMove.to === (7 - rank) * 8 + file)}
                         isLegalDestination={legalDestFromSelectedSquare.includes((7 - rank) * 8 + file)}
                         on:click={handleClick} />
        {/each}
    {/each}
</div>

<style>

    .board {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(8, 1fr);
        width: 100%;
        height: 100%;
    }

</style>