"use strict";

const REQUEST_RESPONSE_TIME = 500;

const promisifyData = (data = {}) => new Promise((fulfill) => {
    setTimeout(
        () => { fulfill(data); },
        REQUEST_RESPONSE_TIME
    );
});

const getConsoleConfig = () => promisifyData({
    consoleElemId: "console",
    userNameElemId: "user-name",
    version: "0.8.0",
    versionPrecise: "0.8.0:a1",
});

const getUserData = () => promisifyData({
    card: {
        nickname: "M20A20X",
        name: "Maksym Sh",
        group: "325a"
    },
    requiredTests: [
        "Технічний тест",
        "Тест з англійськой мови",
        "Soft Skills (психологічний тест)",
    ],
    lastLogin: new Date()
});
