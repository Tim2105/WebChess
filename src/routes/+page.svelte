<script>
    import ChessGame from '../components/ChessGame.svelte';

</script>

<div class="container">
    <ChessGame />
</div>

<style>

    :global(html, body) {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .container {
        width: 600px;
        height: 600px;
    }

</style>