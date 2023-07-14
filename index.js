/**
 * CONSTANTS
 */
const KEY_STORAGE = 'hiittimer-input';
const AUDIO_PATH_COIN = './coin.mp3';
const AUDIO_SWITCH = 'audio_switch';
const BTN_ON = 'on';
const BTN_RESET = 'reset';
const INPUT_INTERVAL = 'interval';
const INPUT_REST = 'rest';
const INPUT_ACTIVITIES = 'activities';
const TEXT_START = 'Start';
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
    interval: null,
    activities: null,
    rest: null,
    currentRoundStart: null,
    currentTime: null,
    currentInterval: null,
    remainingActivities: null,
    isResting: false,
    startTime: null,
    timer: null,
    started: null,
    paused: null,
    pauseStarted: null,
    pausedTime: null,


    refs: {
        btn_on: getElement(BTN_ON),
        btn_reset: getElement(BTN_RESET),
        input_interval: getElement(INPUT_INTERVAL),
        input_rest: getElement(INPUT_REST),
        input_activities: getElement(INPUT_ACTIVITIES),
        div_timer: getElement(DIV_TIMER),
    },

    audio: {
        [AUDIO_SWITCH]: new Audio(AUDIO_PATH_COIN),
    }
}

function initializeState() {
    const storage = localStorage.getItem(KEY_STORAGE);
    if (storage) {
        Object.assign(state, { ...JSON.parse(storage) });
        state.refs.input_interval.value = state.interval;
        state.refs.input_rest.value = state.rest;
        state.refs.input_activities.value = state.activities;
    } else {
        Object.assign(
            state,
            {
                interval: state.refs.input_interval.value,
                rest: state.refs.input_rest.value,
                activities: state.refs.input_activities.value,
            },
        );
    }

    Object.assign(
        state,
        {
            currentInterval: Number(state.interval),
            currentTime: Number(state.interval),
            remainingActivities: Number(state.activities) * 2,
            started: false,
            paused: false,
            pauseStarted: 0,
            pausedTime: 0,
            isResting: false,
        }
    );
}

function setStorageFromInput() {
    localStorage.setItem(
        KEY_STORAGE,
        JSON.stringify({
            interval: state.refs.input_interval.value,
            rest: state.refs.input_rest.value,
            activities: state.refs.input_activities.value,
        }),
    );
}


/**
 * FORM STATES
 */
function setBtnStartedStated() {
    state.refs.btn_reset.disabled = false;
    state.refs.input_interval.disabled = true;
    state.refs.input_rest.disabled = true;
    state.refs.input_activities.disabled = true;
    state.refs.btn_on.innerHTML = TEXT_PAUSE;
}

function setBtnResetState() {
    state.refs.btn_reset.disabled = true;
    state.refs.input_interval.disabled = false;
    state.refs.input_rest.disabled = false;
    state.refs.input_activities.disabled = false;
    state.refs.btn_on.innerHTML = TEXT_START;
}

function setBtnPausedState() {
    state.refs.btn_on.innerHTML = TEXT_RESUME;
}

function setBtnUnpausedState() {
    state.refs.btn_on.innerHTML = TEXT_PAUSE;
}


/**
 * TIMER
 */
function startTimer() {
    state.timer = setInterval(function () {
        if (state.paused) {
            return;
        }
        const elapsedTime = state.pausedTime + (Date.now() - state.currentRoundStart);
        state.currentTime = (state.currentInterval - (elapsedTime / 1000)).toFixed(3);
        determineSwitch();
        render();
    }, 50);
}

function determineSwitch() {
    if (state.currentTime < 0) {
        const newInterval = state.isResting ? state.interval : state.rest;
        state.currentTime = newInterval;
        state.currentInterval = newInterval;
        state.remainingActivities = state.remainingActivities - 1;
        state.isResting = !state.isResting;
        state.pausedTime = 0;
        state.currentRoundStart = Date.now();        

        if (state.remainingActivities === 0) {
            reset();
        } else {
            clearInterval(state.timer);
            startTimer()
        }

        playAudio(AUDIO_SWITCH);
    }
}


/**
 * BUTTON EVENT HANDLERS
 */
function start() {
    state.currentRoundStart = Date.now();
    setStorageFromInput();
    initializeState();
    setBtnStartedStated();
    startTimer();
    state.started = true;
}

function pause() {
    const now = Date.now();
    if (!state.paused) {
        state.paused = true;
        state.pauseStarted = now;        
        setBtnPausedState();
    } else {
        state.paused = false;
        state.pausedTime = state.pausedTime + state.pauseStarted - now;
        setBtnUnpausedState();
    }
}

function reset() {
    clearInterval(state.timer);
    initializeState();
    setBtnResetState();
    render();
}

function startOrPause() {
    state.started ? pause() : start();
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


/**
 * Keyboard Input
 */
const keyboardEvents = {
    'Enter': startOrPause,
    'Space': startOrPause,
    'Escape': reset,
}

document.addEventListener('keyup', (event) => {
    if (Object.keys(keyboardEvents).includes(event.code)) {
        keyboardEvents[event.code]()
    }
}, false);


/**
 * Main
 */
initializeState();
render();