"use strict";

const REQUEST_RESPONSE_TIME = 0;


const promisifyData = (data = {}) => new Promise((fulfill) => {
    setTimeout(
        () => { fulfill(data); },
        REQUEST_RESPONSE_TIME
    );
});


const redirectPage = (url = '', openMode = '_blanket', redirectTime = 0, aux = (_secondsCounter) => { }) => {
    let secondsCounter = redirectTime * 1e-3;
    const redirectInterval = setInterval(() => {
        aux && aux(secondsCounter);

        if (secondsCounter === 0) {
            clearInterval(redirectInterval)
            window.open(url, openMode);
        };

        secondsCounter--;
    }, 1000);
}
