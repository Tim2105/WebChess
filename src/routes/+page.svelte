<script>
    import Navbar from '../components/Navbar.svelte';
    import ChessGame from '../components/ChessGame.svelte';
    import GameOverDialog from '../components/dialogs/GameOverDialog.svelte';

    let gameComponent = null;

    let showGameOverDialog = false;
    let winner = null;
    let reason = null;

    function handleGameOver(msg) {
        msg = msg.detail;

        showGameOverDialog = true;
        winner = msg.winner;
        reason = msg.reason;
    }

    function closeGameOverDialog() {
        showGameOverDialog = false;
    }

    function reset() {
        winner = null;
        reason = null;

        gameComponent.startGame();
    }

    function handleClickOutside(event) {

    }

    function handleKeydown(event) {
        if(event.key === 'Escape')
            showGameOverDialog = false;
    }
</script>

<div class="page">
    <div class="navbar">
        <Navbar on:newgame={reset} />
    </div>

    <main class="container">
        <ChessGame whitePlayer="user" blackPlayer="user"
                whiteFullTime={300000} blackFullTime={300000}
                on:gameover={handleGameOver} bind:this={gameComponent} />

        {#if showGameOverDialog}
            <div class="gameOverDialog">
                <GameOverDialog winner={winner} reason={reason}
                                on:close={closeGameOverDialog} />
            </div>
        {/if}
    </main>
</div>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<style>

    :global(html, body) {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;

        -webkit-tap-highlight-color: transparent;

        background-color: #d9e9f9;
    }

    :global(.dialog) {
        background-color: #afcbed;
        background-image: linear-gradient(to top, #afcbed 0%, #f5f7f6 74%);
    }

    @keyframes slideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }

        to {
            transform: translateY(0);
        }
    }

    :global(.dialog:not(.noanimation)) {
        animation: slideUp 0.2s ease-out;
    }

    .page {
        position: relative;

        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
    }

    @media (orientation: landscape) {
        .navbar {
            width: 100%;
            height: min(10%, 3rem);
        }

        /*
        * Reduziere die Gesamthöhe der Seite um 3px,
        * weil wir sonst aus irgendwelchen Gründen
        * vertikalen Overflow haben.
        */
        .page {
            height: calc(100% - 3px);
        }
    }

    @media (orientation: portrait) {
        .navbar {
            position: absolute;
            top: 0;
            left: 0;

            width: max(40%, 5rem);
            height: 100%;
        }
    }

    .container {
        position: relative;

        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .gameOverDialog {
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        z-index: 5;
    }

</style>