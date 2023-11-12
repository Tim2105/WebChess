<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let time;

    $: hour = Math.max(Math.floor(time / 3600000), 0);
    $: min = Math.max(Math.floor((time % 3600000) / 60000), 0);
    $: sec = Math.max(Math.floor((time % 60000) / 1000), 0);

    $: firstHourDigit = Math.floor(hour / 10);
    $: secondHourDigit = hour % 10;

    $: firstMinDigit = Math.floor(min / 10);
    $: secondMinDigit = min % 10;

    $: firstSecDigit = Math.floor(sec / 10);
    $: secondSecDigit = sec % 10;

    function addHours(event, n) {
        dispatch('update', {
            time: time + n * 3600000
        });
    }

    function addMinutes(event, n) {
        dispatch('update', {
            time: time + n * 60000
        });
    }

    function addSeconds(event, n) {
        dispatch('update', {
            time: time + n * 1000
        });
    }

    function subtractHours(event, n) {
        dispatch('update', {
            time: time - n * 3600000
        });
    }

    function subtractMinutes(event, n) {
        dispatch('update', {
            time: time - n * 60000
        });
    }

    function subtractSeconds(event, n) {
        dispatch('update', {
            time: time - n * 1000
        });
    }

</script>

<div class="container">

    <div class="firstHourDigit digitContainer">
        <button on:click={e => addHours(e, 10)}>
            <img src="/icons/AddIcon.svg" alt="Add" />
        </button>
        <div class="digit">{firstHourDigit}</div>
        <button on:click={e => subtractHours(e, 10)}>
            <img src="/icons/SubtractIcon.svg" alt="Subtract" />
        </button>
    </div>

    <div class="secondHourDigit digitContainer">
        <button on:click={e => addHours(e, 1)}>
            <img src="/icons/AddIcon.svg" alt="Add" />
        </button>
        <div class="digit">{secondHourDigit}</div>
        <button on:click={e => subtractHours(e, 1)}>
            <img src="/icons/SubtractIcon.svg" alt="Subtract" />
        </button>
    </div>

    <div class="colon">:</div>

    <div class="firstMinDigit digitContainer">
        <button on:click={e => addMinutes(e, 10)}>
            <img src="/icons/AddIcon.svg" alt="Add" />
        </button>
        <div class="digit">{firstMinDigit}</div>
        <button on:click={e => subtractMinutes(e, 10)}>
            <img src="/icons/SubtractIcon.svg" alt="Subtract" />
        </button>
    </div>

    <div class="secondMinDigit digitContainer">
        <button on:click={e => addMinutes(e, 1)}>
            <img src="/icons/AddIcon.svg" alt="Add" />
        </button>
        <div class="digit">{secondMinDigit}</div>
        <button on:click={e => subtractMinutes(e, 1)}>
            <img src="/icons/SubtractIcon.svg" alt="Subtract" />
        </button>
    </div>

    <div class="colon">:</div>

    <div class="firstSecDigit digitContainer">
        <button on:click={e => addSeconds(e, 10)}>
            <img src="/icons/AddIcon.svg" alt="Add" />
        </button>
        <div class="digit">{firstSecDigit}</div>
        <button on:click={e => subtractSeconds(e, 10)}>
            <img src="/icons/SubtractIcon.svg" alt="Subtract" />
        </button>
    </div>

    <div class="secondSecDigit digitContainer">
        <button on:click={e => addSeconds(e, 1)}>
            <img src="/icons/AddIcon.svg" alt="Add" />
        </button>
        <div class="digit">{secondSecDigit}</div>
        <button on:click={e => subtractSeconds(e, 1)}>
            <img src="/icons/SubtractIcon.svg" alt="Subtract" />
        </button>
    </div>

</div>

<style>
    @font-face {
        font-family: 'Seven Segment';
        src: url('/fonts/Seven Segment.ttf');
    }

    .container {
        container-type: inline-size;

        width: min(90%, 400px);

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        margin: 0;
        padding: 1rem;

        font-family: 'Seven Segment', sans-serif;
        font-size: 6rem;

        background-color: lightgray;
        border: 1px solid black;
        border-radius: 5px;
    }

    .digitContainer, .colon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        width: 3rem;
        width: min(3rem, 12cqw);

        font-size: min(6rem, 24cqw);
    }

    .digitContainer button {
        width: 1.75rem;
        width: min(1.75rem, 8cqw);
        width: 1.75rem;
        height: min(1.75rem, 8cqw);
        height: 1.75rem;
        padding: 0;
        margin: 0 0.2rem;
        border: 2px solid transparent;
        border-radius: 5px;
        background-color: transparent;

        display: flex;
        justify-content: center;
        align-items: center;

        padding: 5px;
    }

    .digitContainer button:hover {
        cursor: pointer;
    }

    .digitContainer button:focus {
        outline: none;
        border: 2px solid black;
    }

    img {
        width: 100%;
        height: 100%;
    }

    .digit {
        width: 100%;
        text-align: end;
    }

    .colon {
        text-align: center;
    }

</style>