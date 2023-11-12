<script>
    import { createEventDispatcher } from 'svelte';

    import * as Locale from '/src/scripts/locale/Locale.js'

    const dispatch = createEventDispatcher();

    let newGameText = Locale.getTranslation('prompt.newGame');
    let activeLocale = Locale.getLanguage();
    let activeLocaleFlag = Locale.supportedLanguages[activeLocale].flag;

    Locale.addChangeListener((lang) => {
        newGameText = Locale.getTranslation('prompt.newGame');
        activeLocale = lang;
        activeLocaleFlag = Locale.supportedLanguages[lang].flag;
    });

    function handleNewGame() {
        dispatch('newgame');
    }

    let showSupportedLanguages = false;

    function toggleSupportedLanguages() {
        showSupportedLanguages = !showSupportedLanguages;
    }

    function setLanguage(lang) {
        showSupportedLanguages = false;
        Locale.setLanguage(lang);
    }

    function toggleNavbar() {
        const navbar = document.querySelector('nav');
        navbar.style.display = navbar.style.display ? '' : 'flex';
    }

    function handleClickOutside(event) {
        if(!event.target.closest('nav') &&
            !event.target.closest('.expander') &&
            !event.target.classList.contains('flag'))
            document.querySelector('nav').style.display = '';
    }

</script>

<button class="expander" on:click={toggleNavbar}>
    <img src="/icons/MenuIcon.svg" alt="Expand" />
</button>

<nav class="container">
    <div class="option">
        <button on:click={handleNewGame}>
            {newGameText}
        </button>
    </div>

    <div class="option" id="optionLocale">
        <button on:click={toggleSupportedLanguages}>
            <img src={activeLocaleFlag} alt={activeLocale} class="flag" />
        </button>

        {#if showSupportedLanguages}
            {#each Object.keys(Locale.supportedLanguages) as lang}
                {#if lang !== activeLocale}
                    <button on:click={() => setLanguage(lang)}>
                        <img src={Locale.supportedLanguages[lang].flag} alt={lang} class="flag" />
                    </button>
                {/if}
            {/each}
        {/if}
    </div>
</nav>

<svelte:window on:click={handleClickOutside} />

<style>

    nav {
        width: 100%;
        height: 100%;

        background-color: lightgray;

        z-index: 4;
    }

    .option {
        width: fit-content;
    }

    .option button:hover {
        background-color: gray;

        cursor: pointer;

    }

    #optionLocale button {
        height: 100%;

        background: none;
        border: none;

        display: flex;
        justify-content: center;
    }

    #optionLocale button img {
        aspect-ratio: 3/2;
    }

    @media (orientation: landscape) {
        .expander {
            display: none;
        }

        nav {
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            border-radius: 0 0 5px 5px;

            border-bottom: 1px solid black;
        }

        .option {
            height: 100%;
        }

        .option button {
            width: fit-content;
            height: 100%;
            background: none;

            border-top: none;
            border-bottom: none;
            border-left: 2px solid black;
            border-right: 2px solid black;

            padding: 0.5em 1em;
            margin: 0;
        }

        .option button:first-child {
            border-left: none;
        }

        #optionLocale {
            flex-grow: 1;

            display: flex;
            flex-direction: row-reverse;
            justify-content: flex-start;
        }

        #optionLocale button img {
            height: 100%;
        }
    }

    @media (orientation: portrait) {
        .expander {
            position: absolute;
            top: 0;
            left: 0;

            background: none;
            border: none;

            z-index: 5;
        }

        .expander img {
            height: 6vh;
        }

        nav {
            display: none;

            position: absolute;
            top: 0;
            left: 0;

            padding-top: 6vh;

            flex-direction: column;
            justify-content: space-between;

            box-sizing: border-box;

            border-radius: 0 5px 5px 0;

            border-right: 1px solid black;
        }

        .option {
            width: 100%;
        }

        .option button {
            width: 100%;
            height: fit-content;
            background: none;

            border-top: 2px solid black;
            border-bottom: 2px solid black;
            border-left: none;
            border-right: none;

            padding: 1em 0.5em;
            margin: 0;
        }

        .option button:first-child {
            margin-top: 0.5em;
        }

        #optionLocale {
            display: flex;
            flex-direction: column-reverse;
            justify-content: flex-end;
        }

        #optionLocale button img {
            width: min(100%, 4em);
        }
    }

</style>