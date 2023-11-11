<script>
    import ChessGame from '../components/ChessGame.svelte';
</script>

<div class="container">
    <ChessGame whitePlayer="user" blackPlayer="user"
               whiteFullTime={300000} blackFullTime={300000}
               on:gameover={e => console.log(e.detail)} />
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
        width: 100%;
        height: 100%;
    }

</style>