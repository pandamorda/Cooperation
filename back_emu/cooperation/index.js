import { promisifyData } from '../_mockdata';
import logoIcon from '@logo_icon';

///// Console Page /////

export const getUserData = () =>
    promisifyData({
        card: {
            nickname: 'M20A20X',
            name: 'Maksym Sh',
            group: '325a'
        },
        requiredTests: [
            'Технічний тест',
            'Тест з англійської мови',
            'Soft Skills (психологічний тест)'
        ],
        isResumeUploaded: false,
        lastLogin: new Date()
    });

///// Tests Page /////

const questionTypes = {
    multi: 'multi',
    single: 'single',
    multiImg: 'multi-img',
    match: 'match',
    code: 'code'
};

const sampleTest = {
    data: {
        testId: 0,
        name: 'English Test',
        timeLimit: 18e5,
        questions: [
            {
                type: questionTypes.multi,
                text: 'Some question 1?',
                answers: ['answer1', 'answer2', 'answer3']
            },
            {
                type: questionTypes.single,
                text: 'Some question 2?',
                answers: ['answer1', 'answer2', 'answer3']
            },
            {
                type: questionTypes.multiImg,
                text: 'Some question 3?',
                answers: [
                    { text: 'answer1', src: logoIcon },
                    { text: 'answer2', src: logoIcon },
                    { text: 'answer3', src: logoIcon }
                ]
            },
            {
                type: questionTypes.match,
                text: 'Some question 4?',
                answers: [
                    { definition: 'def1', match: 'match1' },
                    { definition: 'def2', match: 'match2' },
                    { definition: 'def3', match: 'match3' }
                ]
            }
            // {
            //     type: questionTypes.code,
            //     text: "Some question 5? (Press 'Ctrl + Enter' to run)",
            //     mode: 'javascript',
            //     inputsInitialValues: [
            //         `const main = () => {const a=1; const b=2; return a+b;}\nconsole.log(main(), 3);\nconsole.log(main(), 'abc');`
            //     ]
            // }
        ]
    },
    answers: [
        [0, 1],
        [0],
        [1, 2],
        [0, 1, 2]
        // [
        //     {
        //         group: 'mainFunc',
        //         regex: /(.+)main(.+)\{(?<mainFunc>(.+))\}/,
        //         tests: [{ args: [], result: 3 }]
        //     }
        // ]
    ]
};

export const checkTest = (testData = {}) => {
    const questions = testData.questions.map((question, questionIndex) => {
        const questionAnswers = sampleTest.answers.at(questionIndex);
        const inputs = question.inputs;
        let isInputsIdentic = false;

        switch (question.type) {
            case questionTypes.multi:
            case questionTypes.multiImg:
            case questionTypes.match: {
                isInputsIdentic = inputs.every(
                    (input) => input.value === inputs[0].value
                );
            }
        }

        let correctness = 0;
        if (!isInputsIdentic) {
            inputs.forEach((input) => {
                switch (question.type) {
                    case questionTypes.multi:
                    case questionTypes.multiImg:
                    case questionTypes.single: {
                        if (input.value) {
                            correctness +=
                                questionAnswers.indexOf(input.index) !== -1
                                    ? 1.0 / questionAnswers.length
                                    : correctness &&
                                      question.type !== questionTypes.single
                                    ? -1.0 / inputs.length
                                    : 0;
                        }
                        break;
                    }
                    case questionTypes.match: {
                        correctness +=
                            Number(
                                questionAnswers.at(input.index) ===
                                    parseInt(input.value)
                            ) / questionAnswers.length;
                        break;
                    }
                    case questionTypes.code: {
                        questionAnswers.forEach((answer) => {
                            const codeMatch = input.value.match(answer.regex);
                            const checkCodeFunc = new Function(
                                codeMatch.groups[answer.group]
                            );

                            answer.tests.forEach((test) => {
                                correctness +=
                                    Number(
                                        checkCodeFunc(...test.args) ===
                                            test.result
                                    ) / answer.tests.length;
                            });
                        });
                        break;
                    }
                }
            });
        }

        return { ...question, correctness, correctAnswers: questionAnswers };
    });

    return { ...testData, questions: questions };
};

export const getQuestionTypesData = () => promisifyData(questionTypes);

export const getTestData = () => promisifyData(sampleTest.data);
