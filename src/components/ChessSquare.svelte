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
    const color = (rank + file) % 2 === 0 ? "black" : "white";

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

        // Ein Touch-Click auf ein Feld soll den Fokus nicht setzen
        if(event.pointerType === 'touch')
            document.querySelector(`#square${square}`).blur();
    }

    let isFocussed = false;

    function handleFocus(event) {
        isFocussed = true;
        dispatch('focus', {
            square: square
        });
    }

    function handleDefocus() {
        isFocussed = false;
    }

    let isHovered = false;

    function handleHover() {
        isHovered = true;
    }

    function handleMouseOut() {
        isHovered = false;

        // Wenn die Maus das Spielbrett verlässt (also kein neuer Fokus gesetzt wird),
        // soll der Fokus nicht mehr auf einem Feld liegen
        document.querySelector(`#square${square}`).blur();
    }

    function focusElement() {
        document.querySelector(`#square${square}`).focus();
    }

</script>

<div class="container">
    <button class="square {color} {isSelected ? 'selected' : ''}"
            id = "square{square}" on:click|nonpassive={handleClick}
            on:mouseenter={focusElement} on:focus={handleFocus}
            on:focusout={handleDefocus} on:mouseover={handleHover}
            on:mouseleave={handleMouseOut}>
        {#if piece}
            {#if piece === 'K'}
                <img class="piece" src="/pieces/Chess_klt45.svg" alt="K"
                    draggable="false" oncontextmenu="return false;" />
            {:else if piece === 'Q'}
                <img class="piece" src="/pieces/Chess_qlt45.svg" alt="Q"
                    draggable="false" oncontextmenu="return false;" />
            {:else if piece === 'R'}
                <img class="piece" src="/pieces/Chess_rlt45.svg" alt="R"
                    draggable="false" oncontextmenu="return false;" />
            {:else if piece === 'B'}
                <img class="piece" src="/pieces/Chess_blt45.svg" alt="B"
                    draggable="false" oncontextmenu="return false;" />
            {:else if piece === 'N'}
                <img class="piece" src="/pieces/Chess_nlt45.svg" alt="N"
                    draggable="false" oncontextmenu="return false;" />
            {:else if piece === 'P'}
                <img class="piece" src="/pieces/Chess_plt45.svg" alt="P"
                    draggable="false" oncontextmenu="return false;" />
            {:else if piece === 'k'}
                <img class="piece" src="/pieces/Chess_kdt45.svg" alt="k"
                    draggable="false" oncontextmenu="return false;" />
            {:else if piece === 'q'}
                <img class="piece" src="/pieces/Chess_qdt45.svg" alt="q"
                    draggable="false" oncontextmenu="return false;" />
            {:else if piece === 'r'}
                <img class="piece" src="/pieces/Chess_rdt45.svg" alt="r"
                    draggable="false" oncontextmenu="return false;" />
            {:else if piece === 'b'}
                <img class="piece" src="/pieces/Chess_bdt45.svg" alt="b"
                    draggable="false" oncontextmenu="return false;" />
            {:else if piece === 'n'}
                <img class="piece" src="/pieces/Chess_ndt45.svg" alt="n"
                    draggable="false" oncontextmenu="return false;" />
            {:else if piece === 'p'}
                <img class="piece" src="/pieces/Chess_pdt45.svg" alt="p"
                    draggable="false" oncontextmenu="return false;" />
            {/if}
        {/if}
        {#if isLegalDestination}
            <img class="legalMoveDot" src="/LegalMoveDot.svg" alt="." preload />
        {/if}
        <div class="lastMoveBorderContainer {isOrigOrDestOfLastMove ? 'lastMove' : ''}
                    {isFocussed ? 'focussed' : ''} {isHovered ? 'hovered' : ''}">
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
        border: 2px solid black;
    }

    @media (pointer: fine) {
        .square:hover, .square:focus {
            outline: none;
            border: 2px solid black;
        }
    }

    /*
    * Clicks auf einem Touchscreen hovern das Feld.
    * Damit das Zielfeld eines Zuges aber hervorgehoben wird,
    * muss das Hover-Kriterium entfernt werden.
    */
   @media (pointer: coarse) {
        .lastMove:not(.selected):not(.focussed) {
            border: 2px solid rgba(10, 10, 255, 0.85);
        }
    }

    @media not (pointer: coarse) {
        .lastMove:not(.selected):not(.hovered, .focussed) {
            border: 2px solid rgba(10, 10, 255, 0.85);
        }
    }

    .white {
        background-color: #eeddbb;
    }

    .black {
        background-color: #775533;
    }

</style>