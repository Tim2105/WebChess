<script>
    import { createEventDispatcher } from 'svelte';

    import ChessSquare from './ChessSquare.svelte';
    import PromotionDialog from './dialogs/PromotionDialog.svelte';
    import { Board } from '../scripts/Chess.js';

    const dispatch = createEventDispatcher();

    /**
     * @description Die Liste der Figuren auf dem Schachbrett.
     * Sollte von außen bereitgestellt werden.
     * @type {Board}
     */
    export let board;

    /**
     * @description Ob das Schachbrett Eingaben akzeptieren soll.
     * @type {boolean}
     */
    export let acceptInput = true;

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
    let focussedSquare = null;

    $: legalDestFromSelectedSquare = legalMoves.filter(move => move.from === selectedSquare)
                                     .map(move => move.to);

    let showPromotionDialog = false;
    let promotionOriginSquare = null;
    let promotionSquare = null;

    function handleClick(event) {
        event.stopPropagation();

        if(showPromotionDialog || !acceptInput)
            dismissPromotion();

        const square = event.detail.square;
        if(selectedSquare === square) {
            selectedSquare = null;
        } else {
            // Überprüfe, ob der Zug legal ist
            const move = legalMoves.find(move => move.from === selectedSquare && move.to === square);

            // Wenn der Zug einen Bauern auf die letzte Reihe zieht, öffne den Dialog zur Bauernumwandlung
            if(move && board.pieces[selectedSquare].toLowerCase() === 'p' && Math.floor((square / 8) % 7) === 0) {
                promotionOriginSquare = selectedSquare;
                promotionSquare = square;
                showPromotionDialog = true;
            } else {
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
    }

    function handleFocus(event) {
        focussedSquare = event.detail.square;
    }

    function handleKeydown(event) {
        if(showPromotionDialog || !acceptInput)
            return;

        if(event.key === 'ArrowDown')
            focusSquareBelow();
        else if(event.key === 'ArrowUp')
            focusSquareAbove();
        else if(event.key === 'ArrowLeft')
            focusSquareLeft();
        else if(event.key === 'ArrowRight')
            focusSquareRight();
    }

    function handleClickOutside() {
        if(showPromotionDialog)
            dismissPromotion();

        selectedSquare = null;
    }

    function focusSquare(square) {
        focussedSquare = square;
        document.querySelector(`#square${square}`).focus();
    }

    function focusSquareBelow() {
        if(!focussedSquare)
            focusSquare(60);
        else
            focusSquare((focussedSquare - 8 + 64) % 64);
    }

    function focusSquareAbove() {
        if(!focussedSquare)
            focusSquare(4);
        else
            focusSquare((focussedSquare + 8) % 64);
    }

    function focusSquareLeft() {
        if(!focussedSquare)
            focusSquare(31);
        else {
            const file = focussedSquare % 8;

            if(file === 0)
                focusSquare(focussedSquare + 7);
            else
                focusSquare(focussedSquare - 1);
        }
    }

    function focusSquareRight() {
        if(!focussedSquare)
            focusSquare(24);
        else {
            const file = focussedSquare % 8;

            if(file === 7)
                focusSquare(focussedSquare - 7);
            else
                focusSquare(focussedSquare + 1);
        }
    }

    function dismissPromotion() {
        selectedSquare = null;
        showPromotionDialog = false;
        promotionOriginSquare = null;
        promotionSquare = null;
    }

    function handlePromotion(piece) {
        if(!piece.detail) {
            dismissPromotion();
            return;
        }

        const moves = legalMoves.filter(move => move.from === promotionOriginSquare &&
                                                move.to === promotionSquare);

        let move = null;
        switch(piece.detail) {
            case 'q':
                move = moves.find(move => move.isQueenPromotion);
                break;
            case 'r':
                move = moves.find(move => move.isRookPromotion);
                break;
            case 'b':
                move = moves.find(move => move.isBishopPromotion);
                break;
            case 'n':
                move = moves.find(move => move.isKnightPromotion);
                break;
        }

        dispatch('move', move);
        selectedSquare = null;
        showPromotionDialog = false;
        promotionOriginSquare = null;
        promotionSquare = null;
    }

</script>

<div class="boardContainer">
    <div class="board">
        {#each {length: 8} as _, rank}
            {#each {length: 8} as _, file}
                <ChessSquare square={(7 - rank) * 8 + file}
                            piece={board.pieces[(7 - rank) * 8 + file]}
                            isSelected={selectedSquare === (7 - rank) * 8 + file}
                            isOrigOrDestOfLastMove={lastMove && (lastMove.from === (7 - rank) * 8 + file
                                                    || lastMove.to === (7 - rank) * 8 + file)}
                            isLegalDestination={acceptInput && 
                                                legalDestFromSelectedSquare.includes((7 - rank) * 8 + file)}
                            on:click={handleClick} on:focus={handleFocus} />
            {/each}
        {/each}
        {#if showPromotionDialog}
            <div class="promoDialogContainer">
                <div class="promoDialog">
                    <PromotionDialog color={board.turn === 'w' ? 'white' : 'black'}
                                    on:promote={handlePromotion} />
                </div>
            </div>
        {/if}
    </div>
</div>
<svelte:window on:keydown={handleKeydown}
               on:click={handleClickOutside} />

<style>

    .boardContainer {
        position: relative;
    }

    @media (orientation: landscape) {
        .boardContainer {
            height: 100%;
            padding-right: 100%;
        }
    }

    @media (orientation: portrait) {
        .boardContainer {
            width: 100%;
            padding-bottom: 100%;
        }
    }

    .board {
        position: absolute;

        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(8, 1fr);
        width: 100%;
        height: 100%;
    }

    .promoDialogContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .promoDialog {
        width: 100%;
        height: 25%;

        z-index: 3;
    }

</style>