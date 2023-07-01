/**
 * CONSTANTS
 */
const AUDIO_PATH_COIN = './coin.mp3';
const AUDIO_SWITCH = 'audio_switch';
const BTN_START = 'start';
const BTN_PAUSE = 'pause';
const BTN_RESET = 'reset';
const INPUT_INTERVAL = 'interval';
const INPUT_REST = 'rest';
const INPUT_REPETITIONS = 'repetitions';
const TEXT_PAUSE = 'Pause';
const TEXT_RESUME = 'Resume';
const DIV_TIMER = 'timer';


/**
 * HELPERS
 */
 function getElement(id) {
    return document.getElementById(id);
}


/**
 * STATE
 */
const state = {
    startTime: null,
    timer: null,
    paused: false,

    interval: null,
    repetitions: null,
    rest: null,

    currentTime: null,
    currentInterval: null,
    currentRepetitions: null,
    isResting: false,

    refs: {
        btn_start: getElement(BTN_START),
        btn_pause: getElement(BTN_PAUSE),
        btn_reset: getElement(BTN_RESET),
        input_interval: getElement(INPUT_INTERVAL),
        input_rest: getElement(INPUT_REST),
        input_repetitions: getElement(INPUT_REPETITIONS),
        div_timer: getElement(DIV_TIMER),
    },

    audio: {
        [AUDIO_SWITCH]: new Audio(AUDIO_PATH_COIN),
    }
}



/**
 * BUTTON STATES
 */
function setStartBtnPressedState() {
    state.refs.btn_start.disabled = true;
    state.refs.btn_pause.disabled = false;
    state.refs.btn_reset.disabled = false;
}

function setResetBtnPressedState() {
    state.refs.btn_start.disabled = false;
    state.refs.btn_pause.disabled = true;
    state.refs.btn_reset.disabled = true;
}

function setBtnPausedOnState() {
    state.refs.btn_pause.innerHTML = TEXT_RESUME;
}

function setBtnPausedOffState() {
    state.refs.btn_pause.innerHTML = TEXT_PAUSE;
}


/**
 * TIMER
 */
function setStartTime() {
    state.startTime = Date.now();
}

function startTimer() {
    state.timer = setInterval(function () {
        const elapsedTime = (Date.now() - state.startTime) / 1000;
        state.currentTime = (state.currentInterval - elapsedTime).toFixed(3);
        determineSwitch();
        render();
    }, 100);
}

function determineSwitch() {
    if (state.currentTime <= 0) {
        const newInterval = state.isResting ? state.interval : state.rest;
        state.currentTime = newInterval;
        state.currentInterval = newInterval;
        state.isResting = !state.isResting;
        setStartTime();
        playAudio(AUDIO_SWITCH);
    }
}

function stopTimer() {
    clearInterval(state.timer);
}


/**
 * INPUT
 */
 function setFromInput() {
    const interval = state.refs.input_interval.value;
    const rest = state.refs.input_rest.value;
    const repetitions = state.refs.input_repetitions;

    Object.assign(
        state,
        {
            interval,
            rest,
            repetitions,
            currentInterval: interval,
            currentTime: interval,
            currentRepetitions: repetitions,
        },
    );
}


/**
 * BUTTON EVENT HANDLERS
 */
function start() {
    setStartTime();
    setFromInput();
    setStartBtnPressedState();
    startTimer();
}

function pause() {
    if (!state.paused) {
        stopTimer();
        state.paused = true;
        setBtnPausedOnState();
    } else {
        startTimer();
        state.paused = false;
        setBtnPausedOffState();
    }
}

function reset() {
    stopTimer();
    setFromInput();
    setResetBtnPressedState();
    render();
}


/**
 * A/V
 */
function playAudio(property) {
    state.audio[property].play();
}

function render() {
    state.refs.div_timer.innerHTML = state.currentTime;
}
