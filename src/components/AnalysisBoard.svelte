<script>
    import * as Locale from '/src/scripts/locale/Locale.js'

    export let Engine;

    export let analysisData;

    let scoreString = Locale.getTranslation('text.score');
    let depthString = Locale.getTranslation('text.depth');
    let knpsString = Locale.getTranslation('text.knps');
    let bestMoveString = Locale.getTranslation('text.bestMove');
    let variationsString = Locale.getTranslation('text.variations');
    let loadingString = Locale.getTranslation('text.loading');

    Locale.addChangeListener(() => {
        scoreString = Locale.getTranslation('text.score');
        depthString = Locale.getTranslation('text.depth');
        knpsString = Locale.getTranslation('text.knps');
        bestMoveString = Locale.getTranslation('text.bestMove');
        variationsString = Locale.getTranslation('text.variations');
        loadingString = Locale.getTranslation('text.loading');
    });

    function scoreToString(score) {
        const scoreInCp = score / 100;

        // Gib die Bewertung immer mit 2 Nachkommastellen aus
        return scoreInCp.toFixed(2);
    }
    
</script>

<div class="container">

    <div class="mainInfo infoRow">
        <div class="pvScore block">
            <div>{scoreString}</div>
            {#if analysisData && analysisData.variations.length > 0}
                <div class="value vbig">{scoreToString(analysisData.variations[0].score)}</div>
            {:else}
                <div class="value vbig">{loadingString}</div>
            {/if}
        </div>
        <div class="bestMove block">
            <div>{bestMoveString}</div>
            {#if analysisData && analysisData.variations.length > 0}
                <div class="value vsmall">{analysisData.variations[0].moves[0]}</div>
            {:else}
                <div class="value vsmall">{loadingString}</div>
            {/if}
        </div>
    </div>

    <div class="metaInfo infoRow">
        <div class="depth block">
            <div>{depthString}</div>
            <div class="value vsmall">{analysisData.depth}</div>
        </div>
        <div class="knps block">
            <div>{knpsString}</div>
            <div class="value vbig">{Math.round(analysisData.nodes / analysisData.time)}</div>
        </div>
    </div>

    {#if analysisData && analysisData.variations.length > 0}
        <div class="variations">
            <div>{variationsString}</div>
            {#each analysisData.variations as variation}
                <div class="variation">
                    <div class="scoreFirstMoveContainer">
                        <div class="score">
                            {variation.score}
                        </div>
                        <div class="firstMoveRow">
                            {#each {length: 4} as _, i}
                                {#if variation.moves.length > i}
                                    <div class="move">
                                        {variation.moves[i]}
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    </div>
                    <div class="remainingMoves">
                        {#each variation.moves.slice(4) as move}
                            <div class="move">
                                {move}
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    {/if}

</div>

<style>

    .container {
        container-type: inline-size;

        position: relative;

        width: 100%;
        height: 100%;

        z-index: 3;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        box-sizing: border-box;

        margin: 0;
        padding-top: 1.5rem;

        background-color: #afcbed;
        background-image: linear-gradient(to top, #afcbed 0%, #f5f7f6 74%);
    }

    @media (orientation: landscape) {
        
    }

    @media (orientation: portrait) {
        .container {
            transform: translateY(-6rem);
            transition: transform 0.25s ease-out;

            font-size: min(1.5rem, 9vw);
            font-size: min(1.5rem, 9cqw);
        }

        .container:hover {
            transform: translateY(-100%);
            transition: transform 0.25s ease-out;
        }
    }

    .infoRow {
        width: 100%;

        position: relative;

        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;

        gap: 2rem;

        margin-bottom: 1rem;
    }

    .block {
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: flex-end;

        gap: 0.5rem;
    }

    .block:first-child {
        align-items: flex-end;
    }

    .block:last-child {
        align-items: flex-start;
    }

    .block > div:first-child {
        width: fit-content;

        font-weight: bold;
    }

    .variations {
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        margin-top: 1rem;
    }

    .variation {
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        gap: 0.5rem;

        margin-bottom: 1.5rem;
    }

    .scoreFirstMoveContainer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        gap: 2rem;
    }

    .firstMoveRow {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        gap: 1rem;
    }

    .firstMoveRow .move {
        width: 5rem;
    }

    .scoreFirstMoveContainer .move:first-child {
        font-weight: bold;
    }

    .remainingMoves {
        width: 100%;

        display: none;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
    }

    .remainingMoves .move {
        width: 5rem;
        width: max(5rem, 10cqw);
    }

</style>