<script>
    import Navbar from '../components/Navbar.svelte';
    import ChessAnalysis from '../components/ChessAnalysis.svelte';
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

        gameComponent.setup();
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
        <!-- <ChessGame whiteFullTime={300000} blackFullTime={300000}
                on:gameover={handleGameOver} bind:this={gameComponent} />

        {#if showGameOverDialog}
            <div class="gameOverDialog">
                <GameOverDialog winner={winner} reason={reason}
                                on:close={closeGameOverDialog} />
            </div>
        {/if} -->

        <ChessAnalysis />
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

        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;

        background-color: #ebf5ff;
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

    :global(.floatingButton) {
        width: min(5rem, 15vw, 15vh);
        height: min(5rem, 15vw, 15vh);

        margin: min(0.5rem, 1vw);

        border: none;
        border-radius: 50%;

        background: #f0f0f0;
        box-shadow: 3px 3px 15px 4px rgba(0,0,0,0.8);

        cursor: pointer;
    }

    @keyframes buttonActive {
        from {}

        to {
            box-shadow: 1px 1px 3px 2px rgba(100,100,100,0.8);
        }
    }

    @media (hover: hover) {
        :global(.floatingButton:hover) {
            box-shadow: 3px 3px 15px 4px rgba(100,100,100,0.8);
        }
    }

    :global(.floatingButton:active) {
        animation: buttonActive 0.04s ease-out;
        animation-fill-mode: forwards;
    }

    :global(.floatingButton img) {
        width: 100%;
        height: 100%;
    }

</style>