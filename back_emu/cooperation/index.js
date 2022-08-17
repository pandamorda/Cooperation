"use strict";

///// Console Page /////

const getConsoleConfig = () => promisifyData({
    consoleElemId: "console",
    userNameElemId: "user-name",
    version: "0.8.0",
    versionPrecise: "0.8.0:a1",
});

const getPagesUrls = () => promisifyData({
    console: '/pages/console/',
    tests: '/pages/tests/',
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


///// Tests Page /////

const testTypes = {
    multi: 'multi',
    single: 'single',
    multiImg: 'multi-img',
    match: 'match',
    code: 'code',
}

const getQuestionTypesData = () => promisifyData(testTypes);

const getTestData = () => promisifyData({
    testId: 0,
    name: 'English Test',
    timeLimit: 0,
    questions: [
        {
            type: testTypes.multi,
            text: 'Some question 1?',
            answers: ['answer1', 'answer2', 'answer3']
        },
        {
            type: testTypes.single,
            text: 'Some question 2?',
            answers: ['answer1', 'answer2', 'answer3']
        },
        {
            type: testTypes.multiImg,
            text: 'Some question 3?',
            answers: [
                { text: 'answer1', src: '/src/images/logo_icon.jpeg' },
                { text: 'answer2', src: '/src/images/logo_icon.jpeg' },
                { text: 'answer3', src: '/src/images/logo_icon.jpeg' }
            ]
        },
        {
            type: testTypes.match,
            text: 'Some question 4?',
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
        },
    ]
});

const checkTest = (testData = {}) => {
    testData.forEach(question => {
        let isAllHasSameValue = false;

        switch (question.type) {
            case questionTypes.multi:
            case questionTypes.multiImg:
            case questionTypes.match: {
                isAllHasSameValue = inputsArray.every(input => input.checked === inputsArray[0].checked && input.value === inputsArray[0].value);
            }
        }

        let correctness = 0;
        if (!isAllHasSameValue) {
            const correctAnswers = question.correctAnswers;

            inputsArray.forEach((input, index) => {
                switch (question.type) {
                    case questionTypes.multi:
                    case questionTypes.multiImg:
                    case questionTypes.single: {
                        if (input.checked) {
                            correctness += correctAnswers.indexOf(index) !== -1
                                ? 1.0 / correctAnswers.length
                                : correctness && question.type !== questionTypes.single
                                    ? -1.0 / inputsArray.length
                                    : 0;
                        }
                        break;
                    }
                    case questionTypes.match: {
                        correctness += Number(correctAnswers.at(index) === parseInt(input.value)) / correctAnswers.length;
                        break;
                    }
                    case questionTypes.code: {
                        correctAnswers.forEach((answer) => {
                            const codeMatch = input.value.match(answer.regex);
                            const checkCodeFunc = new Function(codeMatch.groups[answer.group]);

                            answer.tests.forEach(test => {
                                correctness += Number(checkCodeFunc(...test.args) === test.result)
                                    / correctAnswers.length / answer.tests.length;
                            });
                        });
                        break;
                    }
                }
            });
        }
    });
}