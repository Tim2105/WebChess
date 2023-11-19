<script>
    import { createEventDispatcher } from 'svelte';

    import * as Locale from '/src/scripts/locale/Locale.js'

    const dispatch = createEventDispatcher();

    let newGameText = Locale.getTranslation('prompt.newGame');
    let analysisText = Locale.getTranslation('prompt.analyze');
    let activeLocale = Locale.getLanguage();
    let activeLocaleFlag = Locale.supportedLanguages[activeLocale].flag;

    Locale.addChangeListener((lang) => {
        newGameText = Locale.getTranslation('prompt.newGame');
        analysisText = Locale.getTranslation('prompt.analyze');
        activeLocale = lang;
        activeLocaleFlag = Locale.supportedLanguages[lang].flag;
    });

    function handleNewGame() {
        dispatch('newgame');
    }

    function handleAnalysis() {
        dispatch('analysis');
    }

    let showSupportedLanguages = false;

    function handleLanguageClick(event) {
        // Ignoriere das Event, wenn es von einem Maus-Click ausgelöst wurde

        if(event.pointerType === 'mouse')
            return;

        showSupportedLanguages = !showSupportedLanguages;
    }

    function showSupportedLanguagesOnMouseEnter(event) {
        // Ignoriere das Event, wenn es von einem Touchscreen ausgelöst wurde
        // Ein Touch-Click auf ein Feld löst nämlich auch ein Mouse-Enter-Event aus
        if(event.sourceCapabilities.firesTouchEvents)
            return;
        
        showSupportedLanguages = true;
    }

    function hideSupportedLanguagesOnMouseLeave(event) {
        // Ignoriere das Event, wenn es von einem Touchscreen ausgelöst wurde
        if(event.sourceCapabilities.firesTouchEvents)
            return;

        showSupportedLanguages = false;
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

<div class="expander">
    <button class="floatingButton" on:click={toggleNavbar}>
        <img src="/icons/MenuIcon.svg" alt="Expand" oncontextmenu="return false;"/>
    </button>
</div>

<nav class="container">
    <div class="option">
        <button on:click={handleNewGame}>
            {newGameText}
        </button>
    </div>

    <div class="option">
        <button on:click={handleAnalysis}>
            {analysisText}
        </button>
    </div>

    <div class="option" id="optionLocale" role="list"
         on:mouseleave={hideSupportedLanguagesOnMouseLeave}>
        <button class="activeLanguage"
                on:click={handleLanguageClick}
                on:mouseenter={showSupportedLanguagesOnMouseEnter}>
            <img src={activeLocaleFlag} alt={activeLocale} class="flag" />
            <img src="/icons/ExpandIcon.svg" alt="Expand" class="flagExpander" />
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

        z-index: 4;
    }

    .option {
        width: fit-content;
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

    .option button:hover {
        animation: buttonHover 0.15s ease-out -0.05s;
        animation-fill-mode: forwards;

        cursor: pointer;
    }

    .option button:focus {
        animation: buttonHover 0.2s ease-out;
        animation-fill-mode: forwards;

        cursor: pointer;
    }

    #optionLocale button {
        height: 100%;

        background: none;
        border: none;
        animation: none;

        display: flex;
        justify-content: center;
    }

    #optionLocale button img {
        aspect-ratio: 3/2;
    }

    .activeLanguage {
        display: flex;

        gap: 0.4em;
    }

    @keyframes slideInX {
        from {
            transform: translateX(100%);
        }

        to {
            transform: translateX(0);
        }
    }

    @keyframes slideInY {
        from {
            transform: translateY(100%);
        }

        to {
            transform: translateY(0);
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    @media (orientation: landscape) {
        .expander {
            display: none;
        }

        nav {
            container-type: inline-size;

            display: flex;
            flex-direction: row;
            justify-content: space-between;

            background-color: #5ca0f2;
            background-image: linear-gradient(to left, #5ca0f2 0%, #f5f7f6 74%);

            border-radius: 0 0 5px 5px;
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
            border-left: 2px solid darkgray;
            border-right: 2px solid darkgray;

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

        #optionLocale button:not(:first-child) {
            animation: slideInX 0.2s ease-out,
                       fadeIn 0.3s ease-out;

            padding: 0.5em 0;
        }

        #optionLocale button:not(:first-child, :last-child) {
            padding-left: 1em;
        }

        #optionLocale .activeLanguage {
            flex-direction: row-reverse;
            justify-content: center;
            align-items: center;

            padding-left: 0;
        }

        .flagExpander {
            rotate: 90deg;
        }
    }

    @media (orientation: portrait) {
        .expander {
            position: absolute;
            top: 0;
            left: 0;

            padding: 1vh;

            height: 6vh;

            background: none;
            border: none;

            z-index: 5;
        }

        .expander img {
            width: 75%;
            height: 75%;
        }

        @keyframes containerSlideIn {
            from {
                height: 0;
            }

            to {
                height: 100%;
            }
        }

        nav {
            display: none;

            background-color: #5ca0f2;
            background-image: linear-gradient(to top, #5ca0f2 0%, #f5f7f6 74%);

            animation: containerSlideIn 0.3s ease-out;

            position: absolute;
            top: 0;
            left: 0;

            padding-top: 12vh;

            flex-direction: column;
            justify-content: space-between;

            box-sizing: border-box;

            border-radius: 0 5px 5px 0;
        }

        .option {
            animation: fadeIn 0.5s ease-in;

            width: 100%;
        }

        .option button {
            width: 100%;
            height: fit-content;
            background: none;

            border-top: 2px solid darkgray;
            border-bottom: 2px solid darkgray;
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

        #optionLocale button:not(:first-child) {
            animation: slideInY 0.2s ease-out,
                       fadeIn 0.25s ease-out;

            padding: 0 0.5em;
        }

        #optionLocale button img {
            width: min(90%, 6rem);
            width: min(90%, 12.5cqh);
        }

        #optionLocale button:not(:first-child, :last-child) {
            padding-top: 1em;
        }

        #optionLocale .activeLanguage {
            flex-direction: column-reverse;
            justify-content: center;
            align-items: center;

            padding-top: 0;
        }

        .flagExpander {
            rotate: 180deg;
        }
    }

</style>