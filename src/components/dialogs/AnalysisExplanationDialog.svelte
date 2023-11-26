<script>
    import * as Locale from '/src/scripts/locale/Locale.js'

    let scoreText = Locale.getTranslation('text.score');
    let depthText = Locale.getTranslation('text.depth');
    let bestMoveText = Locale.getTranslation('text.bestMove');
    let knpsText = Locale.getTranslation('text.knps');
    let variationsText = Locale.getTranslation('text.variations');

    let analysisExplanationHeaderText = Locale.getTranslation('text.analysisExplanationHeader');
    let analysisExplanationScoreText = Locale.getTranslation('text.analysisExplanationScore');
    let analysisExplanationDepthText = Locale.getTranslation('text.analysisExplanationDepth');
    let analysisExplanationBestMoveText = Locale.getTranslation('text.analysisExplanationBestMove');
    let analysisExplanationKnpsText = Locale.getTranslation('text.analysisExplanationKnps');
    let analysisExplanationVariationsText = Locale.getTranslation('text.analysisExplanationVariations');

    Locale.addChangeListener(() => {
        scoreText = Locale.getTranslation('text.score');
        depthText = Locale.getTranslation('text.depth');
        bestMoveText = Locale.getTranslation('text.bestMove');
        knpsText = Locale.getTranslation('text.knps');
        variationsText = Locale.getTranslation('text.variations');

        analysisExplanationHeaderText = Locale.getTranslation('text.analysisExplanationHeader');
        analysisExplanationScoreText = Locale.getTranslation('text.analysisExplanationScore');
        analysisExplanationDepthText = Locale.getTranslation('text.analysisExplanationDepth');
        analysisExplanationBestMoveText = Locale.getTranslation('text.analysisExplanationBestMove');
        analysisExplanationKnpsText = Locale.getTranslation('text.analysisExplanationKnps');
        analysisExplanationVariationsText = Locale.getTranslation('text.analysisExplanationVariations');
    });

</script>

<div class="container dialog">
    <div class="content">
        <h1>{analysisExplanationHeaderText}</h1>
        <h2>{scoreText}</h2>
        <p>
            {analysisExplanationScoreText}
        </p>
        <h2>{depthText}</h2>
        <p>
            {analysisExplanationDepthText}
        </p>
        <h2>{bestMoveText}</h2>
        <p>
            {analysisExplanationBestMoveText}
        </p>
        <h2>{knpsText}</h2>
        <p>
            {analysisExplanationKnpsText}
        </p>
        <h2>{variationsText}</h2>
        <p>
            {analysisExplanationVariationsText}
        </p>
    </div>
</div>

<style>

    .container {
        position: absolute;

        display: flex;
        justify-content: center;
        align-items: center;

        width: min(90%, 500px);
        height: min(90%, 500px);

        border-radius: 1rem;
    }

    .content {
        position: relative;

        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;

        padding: 0 1rem;

        overflow: auto;
    }

    h1 {
        font-size: 1.5em;
        font-weight: bold;

        text-align: left;
    }

    h2 {
        font-size: 1.2em;
        font-weight: bold;

        text-align: left;

        margin: 1rem 0 0.5rem 0;
        padding: 0;
    }

    p {
        font-size: 1em;

        text-align: left;

        margin: 0;
    }

</style>