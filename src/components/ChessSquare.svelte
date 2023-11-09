<script>
    import { createEventDispatcher } from 'svelte';

    /**
     * @description Der EventDispatcher für das Event 'click'.
     * @type {EventDispatcher}
     */
    const dispatch = createEventDispatcher();

    /**
     * @description Ein Feld auf dem Schachbrett als Zahl (0-63).
     * @type {number}
     */
    export let square;

    /**
     * @description Die Reihe des Feldes.
     * @type {number}
     */
    const rank = Math.floor(square / 8);

    /**
     * @description Die Spalte des Feldes.
     * @type {number}
     */
    const file = square % 8;

    /**
     * @description Die Farbe des Feldes.
     * @type {string}
     */
    const color = (rank + file) % 2 === 0 ? "white" : "black";

    /**
     * @description Die Figur auf dem Feld als String
     * ('K', 'Q', 'R', 'B', 'N', 'P', 'k', 'q', 'r', 'b', 'n', 'p').
     * @type {string}
     */
    export let piece;

    /**
     * @description Ob das Feld ausgewählt ist.
     * @type {boolean}
     */
    export let isSelected = false;

    /**
     * @description Ob das Feld der Ausgang oder das Ziel des letzten Zuges war.
     * @type {boolean}
     */
    export let isOrigOrDestOfLastMove = false;

    /**
     * @description Ob das Feld das Ziel eines legalen Zuges ist.
     * @type {boolean}
     */
    export let isLegalDestination = false;

    /**
     * @description Wird aufgerufen, wenn das Feld angeklickt wird.
     */
    function handleClick(event) {
        event.stopPropagation();

        dispatch('click', {
            square: square
        });
    }

    let isFocussed = false;

    function handleFocus() {
        isFocussed = true;
        dispatch('focus', {
            square: square
        });
    }

    function handleDefocus() {
        isFocussed = false;
    }

    function focusElement() {
        document.querySelector(`#square${square}`).focus();
    }

</script>

<div class="container">
    <button class="square {color} {isSelected ? 'selected' : ''}"
            id = "square{square}" on:click|nonpassive={handleClick}
            on:mouseenter={focusElement} on:focus={handleFocus}
            on:focusout={handleDefocus}>
        {#if piece}
            {#if piece === 'K'}
                <img class="piece" src="/pieces/Chess_klt45.svg" alt="K" />
            {:else if piece === 'Q'}
                <img class="piece" src="/pieces/Chess_qlt45.svg" alt="Q" />
            {:else if piece === 'R'}
                <img class="piece" src="/pieces/Chess_rlt45.svg" alt="R" />
            {:else if piece === 'B'}
                <img class="piece" src="/pieces/Chess_blt45.svg" alt="B" />
            {:else if piece === 'N'}
                <img class="piece" src="/pieces/Chess_nlt45.svg" alt="N" />
            {:else if piece === 'P'}
                <img class="piece" src="/pieces/Chess_plt45.svg" alt="P" />
            {:else if piece === 'k'}
                <img class="piece" src="/pieces/Chess_kdt45.svg" alt="k" />
            {:else if piece === 'q'}
                <img class="piece" src="/pieces/Chess_qdt45.svg" alt="q" />
            {:else if piece === 'r'}
                <img class="piece" src="/pieces/Chess_rdt45.svg" alt="r" />
            {:else if piece === 'b'}
                <img class="piece" src="/pieces/Chess_bdt45.svg" alt="b" />
            {:else if piece === 'n'}
                <img class="piece" src="/pieces/Chess_ndt45.svg" alt="n" />
            {:else if piece === 'p'}
                <img class="piece" src="/pieces/Chess_pdt45.svg" alt="p" />
            {/if}
        {/if}
        {#if isLegalDestination}
            <img class="legalMoveDot" src="/LegalMoveDot.svg" alt="." />
        {/if}
        <div class="lastMoveBorderContainer {isOrigOrDestOfLastMove ? 'lastMove' : ''}
                    {isFocussed ? 'focussed' : ''}"/>
    </button>
</div>

<style>
    .container {
        width: 100%;
        height: 100%;
    }

    .square {
        position: relative;

        display: inline-flex;
        justify-content: center;
        align-items: center;

        width: 100%;
        height: 100%;

        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;

        border: none;
    }

    .piece {
        position: absolute;
        z-index: 1;

        width: 100%;
    }

    .legalMoveDot {
        position: absolute;
        z-index: 2;

        width: 40%;
    }

    .lastMoveBorderContainer {
        position: absolute;
        z-index: 3;

        width: 100%;
        height: 100%;

        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;

        border: none;
    }

    .square:hover {
        cursor: pointer;
    }

    .square.selected {
        border: 3px solid black;
    }

    .square:hover, .square:focus {
        outline: none;
        border: 3px solid black;
    }

    .lastMove:not(.selected):not(.focussed) {
        border: 3px solid red;
    }

    .white {
        background-color: #eeddbb;
    }

    .black {
        background-color: #664422;
    }

</style>