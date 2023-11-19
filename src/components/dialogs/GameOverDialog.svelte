<script>
    import { createEventDispatcher, onMount } from 'svelte';

    import * as Locale from '/src/scripts/locale/Locale.js'

    const dispatch = createEventDispatcher();

    onMount(() => {
        // Setze den Fokus auf den Close-Button
        document.getElementById('gameOverDialogCloseButton').focus();
    });

    export let winner;
    export let reason;

    const statusTable = {
        'white': {
            'checkmate': 'whiteWinsByCheckmate',
            'timeout': 'whiteWinsByTimeout'
        },
        'black': {
            'checkmate': 'blackWinsByCheckmate',
            'timeout': 'blackWinsByTimeout'
        },
        'none': {
            'stalemate': 'drawByStalemate',
            'fifty-move-rule': 'drawByFiftyMoveRule',
            'threefold-repetition': 'drawByThreefoldRepetition',
            'insufficient-material': 'drawByInsufficientMaterial'
        }
    };

    let gameOverMsg = Locale.getTranslation('msg.gameOver');
    let description = Locale.getTranslation('msg.' + statusTable[winner][reason]);
    let closeMsg = Locale.getTranslation('msg.close');

    Locale.addChangeListener((lang) => {
        gameOverMsg = Locale.getTranslation('msg.gameOver');
        description = Locale.getTranslation('msg.' + statusTable[winner][reason]);
        closeMsg = Locale.getTranslation('msg.close');
    });

    function close() {
        dispatch('close');
    }

</script>

<div class="container dialog">
    <div class="gameOver">
        {gameOverMsg}
    </div>

    <div class="gameOverDescription">
        {description}
    </div>

    <div class="buttonContainer">
        <button on:click={close} id="gameOverDialogCloseButton">
            {closeMsg}
        </button>
    </div>
</div>

<style>

    .container {
        width: min(90%, 600px);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        margin: 0;
        padding: 1rem;

        background-color: lightgray;
        border: 1px solid black;
        border-radius: 5px;
    }

    .gameOver {
        font-size: 2em;
        font-weight: bold;
    }

    .gameOverDescription {
        font-size: 1.5em;
    }

    .buttonContainer {
        margin-top: 1rem;
    }

    button {
        width: fit-content;
        height: fit-content;
        padding: 0.5em 1em;
        margin: 0.8em 0;
        border: 2px solid black;
        border-radius: 5px;
        background-color: transparent;

        display: flex;
        justify-content: center;
        align-items: center;

        padding: 0.5em 1em;
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

    button:hover {
        animation: buttonHover 0.2s ease-out;
        animation-fill-mode: forwards;

        cursor: pointer;
    }

</style>