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
        "Тест з англійської мови",
        "Soft Skills (психологічний тест)",
    ],
    lastLogin: new Date()
});

const getTestData = () => promisifyData({
    name: 'English Test',
    timeLimit: 65000,
    questions: [
        {
            type: 'multi',
            text: 'Some question 1?',
            correctAnswers: ['answer1'],
            answers: ['answer1', 'answer2', 'answer3']
        },
        {
            type: 'single',
            text: 'Some question 2?',
            correctAnswers: ['answer1'],
            answers: ['answer1', 'answer2', 'answer3']
        },
        {
            type: 'multi-img',
            text: 'Some question 2?',
            correctAnswers: ['answer1'],
            answers: [
                { text: 'answer1', src: '/src/images/logo_icon.jpeg' },
                { text: 'answer2', src: '/src/images/logo_icon.jpeg' },
                { text: 'answer3', src: '/src/images/logo_icon.jpeg' }]
        },
    ]
});