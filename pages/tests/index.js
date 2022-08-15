'use strict';

const createElem = (elem) => document.createElement(elem);
const getElemById = (id) => document.getElementById(id);
const getElemsByName = (id) => document.getElementsByName(id);
const getElemsByTagName = (id) => document.getElementsByTagName(id);

/////
const cl = console.log;
///// 



const updateSolvedIdsArray = (questionId = '', questionType = '', solvedQuestionsArray = [], questionTypes = {}) => {
    const inputElemsArray = Array.from(getElemsByName(questionId));

    const solvedIdIndex = solvedQuestionsArray.indexOf(questionId);
    const isInArray = solvedIdIndex !== -1;
    let isSolved = false;

    switch (questionType) {
        case questionTypes.match: {
            isSolved = inputElemsArray.every(elem => elem.value);
            break;
        }
        default: {
            isSolved = inputElemsArray.findIndex(elem => elem.checked) !== -1;
            break;
        }
    }

    if (!isInArray && isSolved) {
        solvedQuestionsArray.push(questionId);
    } else if (isInArray && !isSolved) {
        solvedQuestionsArray.splice(solvedIdIndex, 1);
    }
}

const updateProgressbar = (solvedQuestionsArray = [], questionsArray = []) => {
    const testProgress = solvedQuestionsArray.length / questionsArray.length * 100 || 0;
    getElemById(id.progressbar).value = testProgress;
    getElemById(id.progressbarLabel).textContent = `Прогрес ${testProgress.toFixed(PROGRESSBAR_PRECISION)}%`;
}

const updateNav = (questionId = '', solvedQuestionIdsArray = []) => {
    const questionAnchorElem = Array.from(getElemById(id.navList).getElementsByTagName('a'))
        .filter(anchor => anchor.href.split('#').pop() === questionId)
        .pop();

    questionAnchorElem.textContent = solvedQuestionIdsArray.indexOf(questionId) !== -1
        ? ANCHOR_SOLVED_INNER_HTML
        : questionId.split(QUESTION_ID_PREFIX).pop();
}

const updateForm = (
    questionId = '', questionType = '', questionTypes = {},
    solvedQuestionsArray = [], questionsArray = []
) => {
    updateSolvedIdsArray(questionId, questionType, solvedQuestionsArray, questionTypes);
    updateProgressbar(solvedQuestionsArray, questionsArray);
    updateNav(questionId, solvedQuestionsArray);
}

const setInputEventlistener = (
    element, questionId = '', questionType = '', questionTypes = {},
    solvedQuestionsArray = [], questionsArray = [], questionHandlerAux = () => { }
) => {
    element.addEventListener('input', (event) => {
        updateForm(questionId, questionType, questionTypes, solvedQuestionsArray, questionsArray);
        questionHandlerAux && questionHandlerAux(event);
    });
}

const generateInputs = (
    question = {}, questionId = '', inputsFieldsetElem,
    solvedQuestionsArray = [], questionsArray = [], questionTypes = {}
) => {
    question.answers.forEach((answer, index) => {
        const inputElem = createElem('input');
        inputElem.id = `${questionId}-${index}`;
        inputElem.name = questionId;
        inputElem.classList.add(cn.clickable);
        setInputEventlistener(
            inputElem, questionId, question.type,
            questionTypes, solvedQuestionsArray, questionsArray
        );

        const labelElem = createElem('label');
        labelElem.setAttribute('for', inputElem.id);

        let inputWrapperElem = createElem('p');
        let inputWrapperChilds = [inputElem, labelElem];

        switch (question.type) {
            case questionTypes.multi: {
                inputElem.type = 'checkbox';
                labelElem.textContent = answer;
                break;
            }
            case questionTypes.single: {
                inputElem.type = 'radio';
                labelElem.textContent = answer;
                break;
            }
            case questionTypes.multiImg: {
                inputElem.type = 'checkbox';
                labelElem.classList.add(cn.figureLabel);

                const answerTextElem = createElem('span');
                answerTextElem.textContent = answer.text;

                const answerImgElem = createElem('img');
                answerImgElem.src = answer.src;
                answerImgElem.alt = answer.text

                const answerImgContainerElem = createElem('span');
                answerImgContainerElem.classList.add(cn.qLabelImgContainer);
                answerImgContainerElem.append(answerImgElem);

                labelElem.append(answerImgContainerElem, answerTextElem);
                inputWrapperElem = createElem('figure');
                break;
            }
            case questionTypes.match: {
                setInputEventlistener(
                    inputElem, questionId, question.type, questionTypes,
                    solvedQuestionsArray, questionsArray, (event) => {
                        const charCode = Number(event.currentTarget.value);

                        if (isNaN(charCode) || charCode < 0 || question.answers.length <= charCode) {
                            event.currentTarget.value = '';
                        }
                    });

                inputElem.setAttribute('maxlength', 1);
                labelElem.textContent = answer.definition || '';

                const inputWrapperElem = createElem('span');
                inputWrapperElem.append(inputElem, labelElem);

                const matchWrapperElem = createElem('span');
                matchWrapperElem.textContent = `${index}. ${answer.match}` || '';
                matchWrapperElem.classList.add(cn.qMatchText);

                inputWrapperChilds = [inputWrapperElem, matchWrapperElem];
                break;
            }
        }

        inputWrapperElem.append(...inputWrapperChilds);
        inputsFieldsetElem.append(inputWrapperElem);
    });
}

const generateQuestions = (testData = {}, questionTypesData = {}, solvedQuestionIdsArray = []) => {
    const questionsNav = getElemById(id.navList);
    const buttonSubmit = getElemById(id.buttonSubmit);

    testData.questions.forEach((question, questionIndex) => {
        const questionId = `${QUESTION_ID_PREFIX}${questionIndex}`;

        const inputsFieldsetElem = createElem('fieldset');
        inputsFieldsetElem.classList.add(cn.qInputs);

        switch (question.type) {
            case questionTypesData.multiImg: {
                inputsFieldsetElem.classList.add(cn.qInputsFigures);
                break;
            }
            case questionTypesData.match: {
                inputsFieldsetElem.classList.add(cn.qInputsMatches);
                break;
            }
        }

        const questionLegendElem = createElem('legend');
        questionLegendElem.classList.add(cn.qLegend);
        questionLegendElem.textContent = question.text;

        const questionFieldsetElem = createElem('fieldset');
        questionFieldsetElem.classList.add(cn.qFieldset, cn.anchor);
        questionFieldsetElem.id = questionId;

        questionFieldsetElem.append(questionLegendElem, inputsFieldsetElem);
        buttonSubmit.insertAdjacentElement('beforebegin', questionFieldsetElem);

        generateInputs(
            question, questionId, inputsFieldsetElem,
            solvedQuestionIdsArray, testData.questions, questionTypesData
        );


        const questionAnchorElem = createElem('a');
        questionAnchorElem.href = `#${questionFieldsetElem.id}`;
        questionAnchorElem.textContent = questionIndex;

        const questionNavItemElem = createElem('li');
        questionNavItemElem.classList.add(cn.clickable);
        questionNavItemElem.append(questionAnchorElem);

        questionsNav.append(questionNavItemElem);
    });
}

const handleTimer = async (testData = {}) => {
    const stopTest = (interval) => {
        clearInterval(interval);

        Array.from(getElemsByTagName('input'))
            .concat(Array.from(getElemsByTagName('textarea')))
            .forEach(elem => elem.disabled = true);

        handleFormSubmit(testData);

        let redirectSecondsCounter = REDIRECT_TIME * 1e-3;
        const redirectInterval = setInterval(() => {
            getElemById(id.testName).textContent = `${testData.name} (Завершено, перенаправлення ${redirectSecondsCounter}...)`;

            redirectSecondsCounter === 0 && clearInterval(redirectInterval);
            redirectSecondsCounter--;
        }, 1000);
    }


    const navTimerElem = getElemById(id.navTimer);
    let testSecondsCounter = testData.timeLimit * 1e-3;

    const testInterval = setInterval(() => {
        const seconds = testSecondsCounter % 60;
        navTimerElem.textContent = `${Math.trunc(testSecondsCounter / 60)}:${seconds < 10 ? `0${seconds}` : seconds}`;

        testSecondsCounter === 0 && stopTest(testInterval);
        testSecondsCounter--;
    }, 1000);
}

const handleFormSubmit = (testData = {}, questionTypes = {}) => {
    const results = [];

    testData.questions.forEach((question, index) => {
        const inputsArray = Array.from(getElemsByName(`${QUESTION_ID_PREFIX}${index}`));
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
                }
            });
        }

        results.push({ ...question, correctness });
    });

    cl(results);
    // TODO: send data to backend
};


const handleForm = async () => {
    const testData = await getTestData();
    const questionTypesData = await getQuestionTypesData();

    getElemById(id.testName).textContent = testData.name;

    const solvedQuestionIdsArray = [];

    updateProgressbar(solvedQuestionIdsArray, testData.questions);
    generateQuestions(testData, questionTypesData, solvedQuestionIdsArray);
    handleTimer(testData);

    const form = getElemById(id.form);
    form.addEventListener('submit', (event) => { event.preventDefault(); handleFormSubmit(testData, questionTypesData) });
};

window.addEventListener('load', handleForm);
