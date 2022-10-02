'use strict';

const REQUEST_RESPONSE_TIME = 500;

export const promisifyData = (data = {}) =>
    new Promise((fulfill) => {
        setTimeout(() => {
            fulfill(JSON.stringify(data));
        }, REQUEST_RESPONSE_TIME);
    });
