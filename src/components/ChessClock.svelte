<script>
    export let time;
    export let color;

    $: hour = Math.max(Math.floor(time / 3600000), 0);
    $: min = Math.max(Math.floor((time % 3600000) / 60000), 0);
    $: sec = Math.max(Math.floor((time % 60000) / 1000), 0);
    $: ms = Math.max(Math.floor(time % 1000), 0);

    $: firstHourDigit = Math.floor(hour / 10);
    $: secondHourDigit = hour % 10;

    $: firstMinDigit = Math.floor(min / 10);
    $: secondMinDigit = min % 10;

    $: firstSecDigit = Math.floor(sec / 10);
    $: secondSecDigit = sec % 10;

    $: firstMsDigit = Math.floor(ms / 100);
    $: secondMsDigit = Math.floor((ms % 100) / 10);

</script>

<div class="clock">
    <div class="color">
        {color}
    </div>
    <div class="time">
        {#if time >= 10000}
            <div>{firstHourDigit}</div>
            <div>{secondHourDigit}</div>
            <div>:</div>
        {/if}
        <div>{firstMinDigit}</div>
        <div>{secondMinDigit}</div>
        <div>:</div>
        <div>{firstSecDigit}</div>
        <div>{secondSecDigit}</div>
        {#if time < 10000}
            <div>.</div>
            <div>{firstMsDigit}</div>
            <div>{secondMsDigit}</div>
        {/if}
    </div>
</div>

<style>
    @font-face {
        font-family: 'Seven Segment';
        src: url('/fonts/Seven Segment.ttf');
    }

    .clock {
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .color {
        width: fit-content;
        height: fit-content;

        font-family: 'Seven Segment', sans-serif;

        text-align: center;
    }

    .time {
        width: fit-content;
        height: fit-content;

        font-family: 'Seven Segment', sans-serif;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0;
    }

    @media (orientation: landscape) and (min-aspect-ratio: 9/8) {
        .color {
            font-size: min(3em, 3vw);
        }

        .time {
            font-size: min(4em, 4vw);
        }

        .time div {
            width: min(2em, 2vw);
        }
    }

    @media (orientation: landscape) and (max-aspect-ratio: 9/8) {
        .time {
            font-size: min(3em, 3vh);
        }

        .time div {
            width: min(1.5em, 1.5vh);
        }
    }

    @media (orientation: portrait) {
        .color {
            font-size: min(3em, 3vh);
        }

        .time {
            font-size: min(4em, 4vh);
        }

        .time div {
            width: min(2em, 2vh);
        }
    }

    .time div {
        text-align: center;

        margin: 0;
        padding: 0;
    }

</style>