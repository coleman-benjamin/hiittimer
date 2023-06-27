const state = {
    startTime: null,
    timer: null,
    currentInterval: null,
    currentRepetitions: null,
    paused: false,

    interval: null,
    repetitions: null,
    rest: null,
}

let startTime;

function start() {
    if (state.timer && !state.paused) {
        return;
    }

    if (!state.paused) {
        setFromInput();
        state.startTime = Date.now();
    }

    state.timer = setInterval(function () {
        calculateTimer();
        render();
    }, 100);
}

function setFromInput() {
    state.repetitions = getInput('repetitions');
    state.currentRepetitions = getInput('repetitions');
    state.interval = getInput('interval');
    state.currentInterval = getInput('interval');
    state.rest = getInput('rest');    
}

function calculateTimer() {
    const elapsedTime = (Date.now() - state.startTime) / 1000;
    state.currentInterval = (state.interval - elapsedTime).toFixed(3);
}

function pause() {
    state.paused = true;
    clearInterval(state.timer);
}

function reset() {
    pause();
    state.timer = null;
    state.paused = false;
}

function getInput(id) {
    return document.getElementById(id).value;
}

function render() {
    document.getElementById('timer').innerHTML = state.currentInterval;
}
