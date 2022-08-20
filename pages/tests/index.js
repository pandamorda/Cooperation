'use strict';

const ID = TESTS.elemIds;
const CN = TESTS.elemCns;


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
        case questionTypes.code: {
            isSolved = inputElemsArray.every(elem => elem.value.length >= CODE_EDITOR.minCheckValueLenght);
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
    getElemById(ID.progressbar).value = testProgress;
    getElemById(ID.progressbarLabel).textContent = `Прогрес ${testProgress.toFixed(PROGRESSBAR_PRECISION)}%`;
}

const updateNav = (questionId = '', solvedQuestionIdsArray = []) => {
    const questionAnchorElem = Array.from(getElemById(ID.navList).getElementsByTagName('a'))
        .filter(anchor => anchor.href.split('#').pop() === questionId)
        .pop();

    questionAnchorElem.textContent = solvedQuestionIdsArray.indexOf(questionId) !== -1
        ? TESTS.anchorSolvedText
        : questionId.split(TESTS.questionIdPrefix).pop();
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
    element, questionHandlerAux = () => { }, ...args
) => {
    element.addEventListener('input', (event) => {
        updateForm(...args);
        questionHandlerAux && questionHandlerAux(event);
    });
}

const generateInputs = (
    question = {}, questionId = '', inputsFieldsetElem,
    questionTypes = {}, ...args
) => {
    if (question.type === questionTypes.code) {
        const consoleElem = createElem('textarea');
        consoleElem.value = CODE_EDITOR.consoleInitialText;

        inputsFieldsetElem.append(consoleElem);

        const consoleEditor = CodeMirror.fromTextArea(consoleElem, TESTS.codeEditor.config.console);
        consoleEditor.setSize('auto', 'auto');

        question.inputsInitialValues.forEach(inputInitialValue => {
            const inputElem = createElem('textarea');
            inputElem.name = questionId;
            inputElem.value = inputInitialValue;

            inputsFieldsetElem.prepend(inputElem);

            const editor = CodeMirror.fromTextArea(inputElem, {
                ...TESTS.codeEditor.config.editor,
                mode: question.mode
            })
            editor.setSize(null, CODE_EDITOR.height);

            editor.on('keydown', (_cm, event) => {
                inputElem.value = editor.getValue();
                updateForm(questionId, question.type, questionTypes, ...args);

                if (event.ctrlKey && event.keyCode === 13) {
                    const editorValue = editor.getValue();
                    const rgConsoleLog = /console\.log\((?<logCode>(.+))\);?/g;

                    const logCodes = Array.from(editorValue.matchAll(rgConsoleLog));
                    const editorsValueExceptLogs = editorValue.replace(rgConsoleLog, '');

                    consoleEditor.setValue(
                        logCodes.map(logCode => logCode.groups['logCode']
                            .split(',')
                            .map(logCodePart => (new Function(editorsValueExceptLogs.concat(`return ${logCodePart};`)))())
                            .join(', ')
                        ).join('\n')
                    );
                }
            });
        });

        return;
    }


    question.answers.forEach((answer, index) => {
        const inputElem = createElem('input');
        inputElem.id = `${questionId}-${index}`;
        inputElem.name = questionId;
        inputElem.classList.add(CN.clickable);
        setInputEventlistener(
            inputElem, null, questionId,
            question.type, questionTypes, ...args
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
                labelElem.classList.add(CN.figureLabel);

                const answerTextElem = createElem('span');
                answerTextElem.textContent = answer.text;

                const answerImgElem = createElem('img');
                answerImgElem.src = answer.src;
                answerImgElem.alt = answer.text

                const answerImgContainerElem = createElem('span');
                answerImgContainerElem.classList.add(CN.qLabelImgContainer);
                answerImgContainerElem.append(answerImgElem);

                labelElem.append(answerImgContainerElem, answerTextElem);
                inputWrapperElem = createElem('figure');
                break;
            }
            case questionTypes.match: {
                setInputEventlistener(
                    inputElem,
                    (event) => {
                        const charCode = Number(event.currentTarget.value);
                        if (isNaN(charCode) || charCode < 0 || question.answers.length <= charCode) {
                            event.currentTarget.value = '';
                        }
                    },
                    questionId, question.type, questionTypes, ...args
                );

                inputElem.setAttribute('maxlength', 1);
                labelElem.textContent = answer.definition || '';

                const inputWrapperElem = createElem('span');
                inputWrapperElem.append(inputElem, labelElem);

                const matchWrapperElem = createElem('span');
                matchWrapperElem.textContent = `${index}. ${answer.match}` || '';
                matchWrapperElem.classList.add(CN.qMatchText);

                inputWrapperChilds = [inputWrapperElem, matchWrapperElem];
                break;
            }
        }

        inputWrapperElem.append(...inputWrapperChilds);
        inputsFieldsetElem.append(inputWrapperElem);
    });
}

const generateQuestions = (testData = {}, questionTypes = {}, solvedQuestions = []) => {
    const questionsNav = getElemById(ID.navList);
    const buttonSubmit = getElemById(ID.buttonSubmit);

    testData.questions.forEach((question, questionIndex) => {
        const questionId = `${TESTS.questionIdPrefix}${questionIndex}`;

        const inputsFieldsetElem = createElem('fieldset');
        inputsFieldsetElem.classList.add(CN.qInputs);

        switch (question.type) {
            case questionTypes.multiImg: {
                inputsFieldsetElem.classList.add(CN.qInputsFigures);
                break;
            }
            case questionTypes.match: {
                inputsFieldsetElem.classList.add(CN.qInputsMatches);
                break;
            }
        }

        const questionLegendElem = createElem('legend');
        questionLegendElem.classList.add(CN.qLegend);
        questionLegendElem.textContent = question.text;

        const questionFieldsetElem = createElem('fieldset');
        questionFieldsetElem.classList.add(CN.qFieldset, CN.anchor);
        questionFieldsetElem.id = questionId;

        questionFieldsetElem.append(questionLegendElem, inputsFieldsetElem);
        buttonSubmit.insertAdjacentElement('beforebegin', questionFieldsetElem);

        generateInputs(
            question, questionId, inputsFieldsetElem,
            questionTypes, solvedQuestions, testData.questions,
        );


        const questionAnchorElem = createElem('a');
        questionAnchorElem.href = `#${questionFieldsetElem.id}`;
        questionAnchorElem.textContent = questionIndex;

        const questionNavItemElem = createElem('li');
        questionNavItemElem.classList.add(CN.clickable);
        questionNavItemElem.append(questionAnchorElem);

        questionsNav.append(questionNavItemElem);
    });
}

const handleTimer = async (test = {}, timeLimit = 0) => {
    const navTimerElem = getElemById(ID.navTimer);
    let secondsCounter = timeLimit * 1e-3;

    test.interval = setInterval(() => {
        const seconds = secondsCounter % 60;
        navTimerElem.textContent = `${Math.trunc(secondsCounter / 60)}:${seconds < 10 ? `0${seconds}` : seconds}`;

        if (secondsCounter <= 0) {
            clearInterval(test.interval);
            getElemById(ID.form).dispatchEvent(new Event('submit'));
        }
        secondsCounter--;
    }, 1000);
}

const submitForm = async (testData = {}, questionTypes = {}) => {
    const testResultsData = { ...testData };
    testResultsData.questions = testResultsData.questions.map((question, index) => {
        const inputsArray = Array.from(getElemsByName(`${TESTS.questionIdPrefix}${index}`));

        const checkedInputsArray = inputsArray.map((input, index) => {
            switch (question.type) {
                case questionTypes.multi:
                case questionTypes.multiImg:
                case questionTypes.single: {
                    return { index, value: input.checked };
                }
                default: {
                    return { index, value: input.value };
                }
            }
        })

        return { ...question, inputs: checkedInputsArray };
    });

    cl(testResultsData);
    // TODO: send data to backend

    const pagesUrls = JSON.parse(await getPagesUrls());
    redirectPage(
        pagesUrls.console, '_blank', REDIRECT_TIME,
        (secondsCounter) => {
            getElemById(ID.testName).textContent = `${testData.name} (Завершено, перенаправлення ${secondsCounter}...)`;
        }
    );
};



const handleFormLoad = async () => {
    const test = {
        interval: 0,
        data: JSON.parse(await getTestData()),
        questions: {
            solvedIdsArray: [],
            types: JSON.parse(await getQuestionTypesData())
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        clearInterval(test.interval);

        Array.from(getElemsByTagName('input'))
            .concat(Array.from(getElemsByTagName('textarea')))
            .concat(getElemById(ID.buttonSubmit))
            .forEach(elem => elem.disabled = true);

        window.scrollTo(0, 0);
        submitForm(test.data, test.questions.types);
    }


    getElemById(ID.testName).textContent = test.data.name;

    updateProgressbar(test.questions.solvedIdsArray, test.data.questions);
    generateQuestions(test.data, test.questions.types, test.solvedIdsArray);
    handleTimer(test, test.data.timeLimit);

    getElemById(ID.form).addEventListener('submit', handleFormSubmit);
    getElemById(ID.buttonSubmit).addEventListener('click', handleFormSubmit);
};

window.addEventListener('load', handleFormLoad);
