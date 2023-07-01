/**
 * CONSTANTS
 */
const BTN_START = 'start';
const BTN_PAUSE = 'pause';
const BTN_RESET = 'reset';
const INPUT_INTERVAL = 'interval';
const INPUT_REST = 'rest';
const INPUT_REPETITIONS = 'repetitions';
const DIV_TIMER = 'timer';
const AUDIO_COIN = 'coin.mp3';


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

    currentInterval: null,
    currentRepetitions: null,
}


/**
 * HELPERS
 */
function getElement(id) {
    return document.getElementById(id);
}

function getValue(id) {
    return getElement(id).value;
}


/**
 * BUTTON STATES
 */
function setStartBtnPressedState() {
    getElement(BTN_START).disabled = true;
    getElement(BTN_PAUSE).disabled = false;
    getElement(BTN_RESET).disabled = false;
}

function setResetBtnPressedState() {
    getElement(BTN_START).disabled = false;
    getElement(BTN_PAUSE).disabled = true;
    getElement(BTN_RESET).disabled = true;
}


/**
 * TIMER
 */
function calculateTimer() {
    const elapsedTime = (Date.now() - state.startTime) / 1000;
    state.currentInterval = (state.interval - elapsedTime).toFixed(3);
}

function startTimer() {
    state.timer = setInterval(function () {
        calculateTimer();
        render();
    }, 100);
}

function stopTimer() {
    clearInterval(state.timer);
}


/**
 * BUTTON EVENT HANDLERS
 */
function setFromInput() {
    state.interval = getValue(INPUT_INTERVAL);
    state.rest = getValue(INPUT_REST);
    state.repetitions = getValue(INPUT_REPETITIONS);
    state.currentRepetitions = getValue(INPUT_REPETITIONS);
    state.currentInterval = getValue(INPUT_INTERVAL);
}

function start() {
    if (state.timer && !state.paused) {
        return;
    }

    if (!state.paused) {
        setFromInput();
        state.startTime = Date.now();
    }

    setStartBtnPressedState();
    startTimer();
}

function pause() {
    state.paused = true;
    stopTimer();
    beep();
}

function reset() {
    state.timer = null;
    state.paused = false;
    stopTimer();
    setFromInput();
    render();
    setResetBtnPressedState();
}


/**
 * A/V
 */
function beep() {
    const audio = new Audio(AUDIO_COIN);
    audio.play();
}

function render() {
    getElement(DIV_TIMER).innerHTML = state.currentInterval;
}
