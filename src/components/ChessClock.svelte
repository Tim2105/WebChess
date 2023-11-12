<script>
    import { createEventDispatcher } from 'svelte';

    import ClockEditDialog from './dialogs/ClockEditDialog.svelte';

    import * as Locale from '/src/scripts/locale/Locale.js'

    const dispatch = createEventDispatcher();

    export let time;
    export let color;
    export let editable;

    let showEditDialog = false;

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

    function updateTime(event) {
        const newTime = event.detail.time;
        const hundredHours = 360000000;
        time = Math.max(Math.min(newTime, hundredHours - 1),
                        1000);

        dispatch('update', {
            time: time
        });
    }

    function handleClickOutside(event) {
        if(event.target.classList.contains('clockEditDialogContainer'))
            showEditDialog = false;
    }

    function handleKeydown(event) {
        if(event.key === 'Escape')
            showEditDialog = false;
    }

    let colorText = Locale.getTranslation('game.' + color);

    Locale.addChangeListener((lang) => {
        colorText = Locale.getTranslation('game.' + color);
    });

</script>

<div class="clock">
    <div class="color">
        {colorText}
    </div>
    <div class="time">
        {#if time >= 10000}
            <div>{firstHourDigit}</div>
            <div>{secondHourDigit}</div>
            <div class="colon">:</div>
        {/if}
        <div>{firstMinDigit}</div>
        <div>{secondMinDigit}</div>
        <div class="colon">:</div>
        <div>{firstSecDigit}</div>
        <div>{secondSecDigit}</div>
        {#if time < 10000}
            <div class="colon">.</div>
            <div>{firstMsDigit}</div>
            <div>{secondMsDigit}</div>
        {/if}

        {#if editable}
            <div class="edit">
                <button on:click={() => showEditDialog = true}>
                    <img src="/icons/EditIcon.svg" alt="Edit" draggable="false" oncontextmenu="return false;" />
                </button>
            </div>
        {/if}
    </div>
</div>

{#if showEditDialog}
    <div class="editDialog clockEditDialogContainer">
        <ClockEditDialog time={time} on:update={updateTime} />
    </div>
{/if}

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

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
        position: relative;

        width: fit-content;
        height: fit-content;

        font-family: 'Seven Segment', sans-serif;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0;
    }

    .edit {
        width: fit-content;
        height: 100%;

        position: absolute;
        top: 0;

        display: flex;
        align-items: center;
    }

    .edit button {
        display: flex;
        justify-content: center;
        align-items: center;

        aspect-ratio: 1/1;
        margin-left: 0.5em;
        
        border: none;

        background-color: transparent;

        cursor: pointer;
    }

    .time div:not(.colon) {
        text-align: end;

        margin: 0;
        padding: 0;
    }

    .time div.colon {
        text-align: center;
    }

    .edit button img {
        width: 100%;
    }

    @media (orientation: landscape) {
        .color {
            font-size: min(3em, 3vw);
        }

        .time {
            font-size: min(4em, 4vw);
        }

        .edit {
            left: calc(8 * min(2rem, 2vw));
        }

        .edit button {
            height: min(5em, 6vw);
        }

        .time div {
            width: min(2rem, 2vw);
        }
    }

    @media (orientation: portrait) {
        .color {
            font-size: min(3em, 3vh);
        }

        .time {
            font-size: min(4em, 4vh);
        }

        .edit {
            left: calc(8 * min(2rem, 2vh));
        }

        .edit button {
            height: min(5em, 6vh);
        }

        .time div {
            width: min(2rem, 2vh);
        }
    }

    .editDialog {
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