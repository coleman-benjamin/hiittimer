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
    state.interval = getInput('interval');
    state.repetitions = getInput('repetitions');
    state.rest = getInput('rest');

    state.currentRepetitions = getInput('repetitions');
    state.currentInterval = getInput('interval');
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
    state.timer = null;
    state.paused = false;
    clearInterval(state.timer);
    setFromInput();
    render();
}

function getInput(id) {
    return document.getElementById(id).value;
}

function render() {
    document.getElementById('timer').innerHTML = state.currentInterval;
}
