<script>
    import * as Locale from '/src/scripts/locale/Locale.js';

    export let analysisData;

    let scoreString = Locale.getTranslation('text.score');
    let depthString = Locale.getTranslation('text.depth');
    let knpsString = Locale.getTranslation('text.knps');
    let bestMoveString = Locale.getTranslation('text.bestMove');
    let variationsString = Locale.getTranslation('text.variations');
    let loadingString = Locale.getTranslation('text.loading');
    let noMoveString = Locale.getTranslation('text.noMove');

    Locale.addChangeListener(() => {
        scoreString = Locale.getTranslation('text.score');
        depthString = Locale.getTranslation('text.depth');
        knpsString = Locale.getTranslation('text.knps');
        bestMoveString = Locale.getTranslation('text.bestMove');
        variationsString = Locale.getTranslation('text.variations');
        loadingString = Locale.getTranslation('text.loading');
        noMoveString = Locale.getTranslation('text.noMove');
    });

    function scoreToString(score) {
        // Überprüfe, ob die Bewertung eine Mattbewertung ist
        if(Math.abs(score) > 20000) {
            // Berechne die Anzahl der Züge bis zum Matt
            const movesToMate = Math.floor((21000 - Math.abs(score) + 1) / 2);

            let mateString = '';

            if(movesToMate === 0) {
                if(score < 0)
                    mateString += '0-1';
                else
                    mateString += '1-0';
            } else {
                // Wenn die Bewertung positiv ist, ist Weiß im Vorteil
                if(score < 0)
                    mateString += '-';

                // Füge die Anzahl der Züge bis zum Matt hinzu
                mateString += 'M' + movesToMate;
            }

            return mateString;
        }

        const scoreInCp = score / 100;

        // Gib die Bewertung immer mit 2 Nachkommastellen aus
        return scoreInCp.toFixed(2);
    }

    let expandedVariation = null;

    function toggleVariation(variation) {
        if(expandedVariation === variation)
            expandedVariation = null;
        else
            expandedVariation = variation;
    }
    
</script>

<div class="container">
    <div class="content">

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
                    <div class="value vsmall move">{analysisData.variations[0].moves[0].fan === undefined ?
                                                    noMoveString : analysisData.variations[0].moves[0].fan}</div>
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
                {#each analysisData.variations as variation, i}
                    <div class="variation {expandedVariation == i ? 'expanded' : ''}"
                         role="option" tabindex="0" aria-selected="false"
                         on:click={() => toggleVariation(i)}
                         on:keypress={() => toggleVariation(i)}>
                        <div class="scoreContainer">
                            <div class="score">
                                {scoreToString(variation.score)}
                            </div>
                        </div>
                        <div class="moves">
                            {#each variation.moves as move}
                                <div class="move {move.fan === undefined ? 'stretch' : ''}">
                                    {move.fan === undefined ? noMoveString : move.fan}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}

    </div>
</div>

<style>

    .container {
        position: relative;

        z-index: 3;
    }

    .content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        margin: 0;
        padding-top: 1rem;

        background-color: #afcbed;
        background-image: linear-gradient(to top, #afcbed 0%, #f5f7f6 74%);
    }

    @media (orientation: landscape) {
        .container {
            width: 100%;
            height: 100%;
        }

        .content {
            width: 100%;
            height: 100%;

            font-size: min(1.3rem, 5vh);
            font-size: min(1.3rem, 5cqh);
        }
    }

    @media (orientation: portrait) {
        .container {
            width: 100%;
            height: 5.25rem;
        }

        .content {
            width: 100%;

            position: absolute;
            top: 0;

            transition: transform 0.25s ease-out;

            font-size: min(1.1rem, 5vw);
            font-size: min(1.1rem, 5cqw);

            border-top: 1px solid black;
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
        }

        .content:hover {
            transform: translateY(calc(-100% + 5.25rem));
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
        height: 4rem;
        height: 10cqh;

        display: flex;
        flex-direction: column;
        justify-content: center;

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
        width: 90%;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        margin-top: 1rem;
        margin-bottom: 1.5rem;
        margin-left: 1rem;
        margin-right: 1rem;

        gap: 1rem;
    }

    .variations > div:first-child {
        font-weight: bold;
    }

    .variation {
        width: 100%;

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        gap: 1.5rem;

        background-image: linear-gradient(to right, #afcbed 0%, #f5f7f6 74%);
        border-radius: 0.5rem;
    }

    .scoreContainer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        width: 3.75rem;
    }

    .moves {
        width: 100%;
        height: 100%;
        max-height: 2rem;
        max-height: 5cqh;
        overflow-y: hidden;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;

        gap: 0.5rem;
    }

    .value {
        height: 1.5rem;
        height: 3.75cqh;

        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .move {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .moves .move {
        width: 4rem;

        height: 2rem;
        height: 5cqh;

        padding-top: 0;
    }

    .moves .move.stretch {
        width: 100%;
    }

    @media (orientation: portrait) {
        .variation:hover .moves {
            max-height: 7rem;
            max-height: calc(5cqh * 3 + 1rem);

            overflow-y: auto;
        }
    }

    @media (orientation: landscape) {
        .variation {
            padding-left: 0.5rem;
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

        .variation:hover {
            animation: buttonHover 0.15s ease-out -0.05s;
            animation-fill-mode: forwards;
        }

        .variation:focus {
            outline: none;

            animation: buttonHover 0.2s ease-out;
            animation-fill-mode: forwards;
        }

        .moves .move {
            width: 4.75rem;
        }

        .expanded .moves {
            max-height: 7rem;
            max-height: calc(5cqh * 3 + 1rem);

            overflow-y: auto;
        }
    }

    .move:first-child {
        font-weight: bold;
    }

</style>