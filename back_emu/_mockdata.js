"use strict";

const REQUEST_RESPONSE_TIME = 500;
const ONE_SECOND = 1000;
const REDIRECT_TIME = 3000;


const promisifyData = (data = {}) => new Promise((fulfill) => {
    setTimeout(
        () => { fulfill(JSON.stringify(data)); },
        REQUEST_RESPONSE_TIME
    );
});

const redirectPage = async (
    url = '', openMode = '_blanket', redirectTime = 0,
    aux = (_secondsCounter) => { }
) => new Promise(fulfill => {
    let secondsCounter = redirectTime * 1e-3;
    const redirectInterval = setInterval(() => {
        aux && aux(secondsCounter);

        if (secondsCounter === 0) {
            clearInterval(redirectInterval)
            window.open(url, openMode);
            fulfill();
        };

        secondsCounter--;
    }, ONE_SECOND);
});
