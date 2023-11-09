<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let color;

    function handleQueenPromotion() {
        dispatch('promote', 'q');
    }

    function handleRookPromotion() {
        dispatch('promote', 'r');
    }

    function handleBishopPromotion() {
        dispatch('promote', 'b');
    }

    function handleKnightPromotion() {
        dispatch('promote', 'n');
    }

    function handleDismiss() {
        dispatch('promote', null);
    }

    const pieceOrder = ['q', 'r', 'b', 'n'];
    let selectedPiece = 'q';

    export function focusPiece(piece) {
        selectedPiece = piece;
        document.querySelector(`#promoBtn${piece.toUpperCase()}`).focus();
    }

    function handleFocus(piece) {
        selectedPiece = piece;
    }

    function focusPieceLeft() {
        const index = pieceOrder.indexOf(selectedPiece);

        if(index === 0)
            focusPiece(pieceOrder[pieceOrder.length - 1]);
        else
            focusPiece(pieceOrder[index - 1]);
    }

    function focusPieceRight() {
        const index = pieceOrder.indexOf(selectedPiece);

        if(index === pieceOrder.length - 1)
            focusPiece(pieceOrder[0]);
        else
            focusPiece(pieceOrder[index + 1]);
    }

    function handleKeydown(event) {
        if(event.key === 'ArrowLeft')
            focusPieceLeft();
        else if(event.key === 'ArrowRight')
            focusPieceRight();
    }

</script>

<div class="container">
    <button class="piece" id="promoBtnQ"
            on:click={handleQueenPromotion}
            on:focus={handleFocus('q')}>
        {#if color === 'white'}
            <img src="/pieces/Chess_qlt45.svg" alt="Q" />
        {:else}
            <img src="/pieces/Chess_qdt45.svg" alt="q" />
        {/if}
    </button>
    <button class="piece" id="promoBtnR"
            on:click={handleRookPromotion}
            on:focus={handleFocus('r')}>
        {#if color === 'white'}
            <img src="/pieces/Chess_rlt45.svg" alt="R" />
        {:else}
            <img src="/pieces/Chess_rdt45.svg" alt="r" />
        {/if}
    </button>
    <button class="piece" id="promoBtnB"
            on:click={handleBishopPromotion}
            on:focus={handleFocus('b')}>
        {#if color === 'white'}
            <img src="/pieces/Chess_blt45.svg" alt="B" />
        {:else}
            <img src="/pieces/Chess_bdt45.svg" alt="b" />
        {/if}
    </button>
    <button class="piece" id="promoBtnN"
            on:click={handleKnightPromotion}
            on:focus={handleFocus('n')}>
        {#if color === 'white'}
            <img src="/pieces/Chess_nlt45.svg" alt="N" />
        {:else}
            <img src="/pieces/Chess_ndt45.svg" alt="n" />
        {/if}
    </button>
</div>
<svelte:window on:keydown={handleKeydown}/>

<style>

    .container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        width: 100%;
        height: 100%;
    }

    .piece {
        width: 100%;
        height: 100%;

        border: 3px dashed black;
    }

    .piece:hover, .piece:focus {
        outline: none;
        border: 3px solid black;

        cursor: pointer;
    }

    .piece img {
        width: 80%;
        height: 80%;
    }


</style>