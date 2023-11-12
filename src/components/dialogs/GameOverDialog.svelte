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

    $: gameOverMsg = Locale.getTranslation('msg.gameOver');

    $: description = Locale.getTranslation('msg.' + statusTable[winner][reason]);

    $: closeMsg = Locale.getTranslation('msg.close');

    Locale.addChangeListener((lang) => {
        gameOverMsg = Locale.getTranslation('msg.gameOver');
        description = Locale.getTranslation('msg.' + statusTable[winner][reason]);
        closeMsg = Locale.getTranslation('msg.close');
    });

    function close() {
        dispatch('close');
    }

</script>

<div class="container">
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
        background-color: lightgray;

        display: flex;
        justify-content: center;
        align-items: center;

        padding: 0.5em 1em;
    }

    button:hover {
        cursor: pointer;
        background-color: gray;
    }

</style>