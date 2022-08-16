"use strict";

const REQUEST_RESPONSE_TIME = 0;

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

const testTypes = {
    multi: 'multi',
    single: 'single',
    multiImg: 'multi-img',
    match: 'match',
    code: 'code',
}

const getQuestionTypesData = () => promisifyData(testTypes);

const getTestData = () => promisifyData({
    name: 'English Test',
    timeLimit: 18e5,
    questions: [
        {
            type: testTypes.multi,
            text: 'Some question 1?',
            correctAnswers: [0],
            answers: ['answer1', 'answer2', 'answer3']
        },
        {
            type: testTypes.single,
            text: 'Some question 2?',
            correctAnswers: [1],
            answers: ['answer1', 'answer2', 'answer3']
        },
        {
            type: testTypes.multiImg,
            text: 'Some question 3?',
            correctAnswers: [1, 2],
            answers: [
                { text: 'answer1', src: '/src/images/logo_icon.jpeg' },
                { text: 'answer2', src: '/src/images/logo_icon.jpeg' },
                { text: 'answer3', src: '/src/images/logo_icon.jpeg' }]
        },
        {
            type: testTypes.match,
            text: 'Some question 4?',
            correctAnswers: [0, 1, 2],
            answers: [
                { definition: 'def1', match: 'match1' },
                { definition: 'def2', match: 'match2' },
                { definition: 'def3', match: 'match3' },
            ]
        },
        {
            type: testTypes.code,
            text: 'Some question 5? (Press \'Ctrl + Enter\' to run)',
            mode: 'javascript',
            inputsInitialValues: [`const main = () => {const a=1; const b=2; return a+b;}\nconsole.log(main(), 3);\nconsole.log(main(), 'abc');`],
            correctAnswers: [
                { group: 'function', tests: [{ args: [], result: 3 }], regex: /(.+)main(.+)\{(?<function>(.+))\}/ }
            ],
        },
    ]
});


