import { createEl, getElById, getElsByName } from '@scripts/_common';

import { PROGRESSBAR_PRECISION } from '@constants/_common';
import { CODE_EDITOR, TESTS } from '@constants/_cooperation';

const ID = TESTS.elemIds;
const CN = TESTS.elemCns;

const updateSolvQuestsArr = (args) => {
    const { questId, questType, questTypes, testState } = { ...args };

    const inputElsArr = Array.from(getElsByName(questId));

    const solvQuestIndex = testState.solvQuestsArr.indexOf(questId);
    const isInArray = solvQuestIndex !== -1;
    let isSolved = false;

    switch (questType) {
        case questTypes.match: {
            isSolved = inputElsArr.every((elem) => elem.value);
            break;
        }
        case questTypes.code: {
            isSolved = inputElsArr.every(
                (elem) => elem.value.length >= CODE_EDITOR.minCheckValueLenght
            );
            break;
        }
        default: {
            isSolved = inputElsArr.findIndex((elem) => elem.checked) !== -1;
            break;
        }
    }

    if (!isInArray && isSolved) {
        testState.solvQuestsArr.push(questId);
    } else if (isInArray && !isSolved) {
        testState.solvQuestsArr.splice(solvQuestIndex, 1);
    }
};

const updateProgressbar = (solvQuestsArr = [], questArrLenght = []) => {
    const testProgress = (solvQuestsArr.length / questArrLenght) * 100 || 0;

    getElById(ID.progressbar).value = testProgress;
    getElById(
        ID.progressbarLabel
    ).textContent = `Прогрес ${testProgress.toFixed(PROGRESSBAR_PRECISION)}%`;
};

const updateNav = (questId = '', solvQuestsArr = []) => {
    const questAnchorEl = Array.from(
        getElById(ID.navList).getElementsByTagName('a')
    )
        .filter((anchor) => anchor.href.split('#').pop() === questId)
        .pop();

    questAnchorEl.textContent =
        solvQuestsArr.indexOf(questId) !== -1
            ? TESTS.anchorSolvedText
            : questId.split(TESTS.questionIdPrefix).pop();
};

const updateForm = (args) => {
    const { questId, questionsArr, testState } = args;

    updateSolvQuestsArr(args);
    updateProgressbar(testState.solvQuestsArr, questionsArr.length);
    updateNav(questId, testState.solvQuestsArr);
};

const setEventlistener = (args) => {
    const { inputEl, auxHandler } = { ...args };

    inputEl.addEventListener('input', (event) => {
        updateForm(args);
        auxHandler && auxHandler(event);
    });
};

const generateInputs = (args) => {
    const { question, questId, inputsFieldsetEl, questTypes } = { ...args };

    // if (question.type === questionTypes.code) {
    //     const consoleElem = createEl('textarea');
    //     consoleElem.value = CODE_EDITOR.consoleInitialText;

    //     inputsFieldsetElem.append(consoleElem);

    //     const consoleEditor = CodeMirror.fromTextArea(
    //         consoleElem,
    //         TESTS.codeEditor.config.console
    //     );
    //     consoleEditor.setSize('auto', 'auto');

    //     question.inputsInitialValues.forEach((inputInitialValue) => {
    //         const inputElem = createEl('textarea');
    //         inputElem.name = questId;
    //         inputElem.value = inputInitialValue;

    //         inputsFieldsetElem.prepend(inputElem);

    //         const editor = CodeMirror.fromTextArea(inputElem, {
    //             ...TESTS.codeEditor.config.editor,
    //             mode: question.mode
    //         });
    //         editor.setSize(null, CODE_EDITOR.height);

    //         editor.on('keydown', (_cm, event) => {
    //             inputElem.value = editor.getValue();
    //             updateForm(questId, question.type, questionTypes, ...args);

    //             if (event.ctrlKey && event.keyCode === 13) {
    //                 const editorValue = editor.getValue();
    //                 const rgConsoleLog = /console\.log\((?<logCode>(.+))\);?/g;

    //                 const logCodes = Array.from(
    //                     editorValue.matchAll(rgConsoleLog)
    //                 );
    //                 const editorsValueExceptLogs = editorValue.replace(
    //                     rgConsoleLog,
    //                     ''
    //                 );

    //                 consoleEditor.setValue(
    //                     logCodes
    //                         .map((logCode) =>
    //                             logCode.groups['logCode']
    //                                 .split(',')
    //                                 .map((logCodePart) =>
    //                                     new Function(
    //                                         editorsValueExceptLogs.concat(
    //                                             `return ${logCodePart};`
    //                                         )
    //                                     )()
    //                                 )
    //                                 .join(', ')
    //                         )
    //                         .join('\n')
    //                 );
    //             }
    //         });
    //     });

    //     return;
    // }
    const questOptions = question.options.split(';');
    const questType = question.type;

    questOptions.forEach((option, index) => {
        const inputEl = createEl('input');
        inputEl.id = `${questId}-${index}`;
        inputEl.name = questId;
        inputEl.classList.add(CN.clickable);
        setEventlistener({ inputEl, questType, ...args });

        const labelEl = createEl('label');
        labelEl.setAttribute('for', inputEl.id);

        let inputWrapEl = createEl('p');
        let inputWrapChilds = [inputEl, labelEl];

        switch (question.type) {
            case questTypes.multi: {
                inputEl.type = 'checkbox';
                labelEl.textContent = option;
                break;
            }
            case questTypes.single: {
                inputEl.type = 'radio';
                labelEl.textContent = option;
                break;
            }
            case questTypes.multiImg: {
                inputEl.type = 'checkbox';
                labelEl.classList.add(CN.figureLabel);

                const answerTextElem = createEl('span');
                answerTextElem.textContent = option.text;

                const answerImgElem = createEl('img');
                answerImgElem.src = option.src;
                answerImgElem.alt = option.text;

                const answerImgContainerElem = createEl('span');
                answerImgContainerElem.classList.add(CN.qLabelImgContainer);
                answerImgContainerElem.append(answerImgElem);

                labelEl.append(answerImgContainerElem, answerTextElem);
                inputWrapEl = createEl('figure');
                break;
            }
            case questTypes.match: {
                setEventlistener(
                    inputEl,
                    (event) => {
                        const charCode = Number(event.currentTarget.value);
                        if (
                            isNaN(charCode) ||
                            charCode < 0 ||
                            question.answers.length <= charCode
                        ) {
                            event.currentTarget.value = '';
                        }
                    },
                    questId,
                    question.type,
                    questTypes,
                    ...args
                );

                inputEl.setAttribute('maxlength', 1);
                labelEl.textContent = option.definition || '';

                const inputWrapperElem = createEl('span');
                inputWrapperElem.append(inputEl, labelEl);

                const matchWrapperElem = createEl('span');
                matchWrapperElem.textContent =
                    `${index}. ${option.match}` || '';
                matchWrapperElem.classList.add(CN.qMatchText);

                inputWrapChilds = [inputWrapperElem, matchWrapperElem];
                break;
            }
        }

        inputWrapEl.append(...inputWrapChilds);
        inputsFieldsetEl.append(inputWrapEl);
    });
};

const generateQuestions = (
    questionsArr = {},
    questTypes = {},
    testState = {}
) => {
    const questsNav = getElById(ID.navList);
    const btnSubmitEl = getElById(ID.buttonSubmit);

    questionsArr.forEach((question, questIndex) => {
        const questId = `${TESTS.questionIdPrefix}${questIndex}`;

        const inputsFieldsetEl = createEl('fieldset');
        inputsFieldsetEl.classList.add(CN.qInputs);

        switch (question.type) {
            case questTypes.multiImg: {
                inputsFieldsetEl.classList.add(CN.qInputsFigures);
                break;
            }
            case questTypes.match: {
                inputsFieldsetEl.classList.add(CN.qInputsMatches);
                break;
            }
        }

        const legendEl = createEl('legend');
        legendEl.classList.add(CN.qLegend);
        legendEl.textContent = `${questIndex + 1}. ${question.text}`;

        const fieldsetEl = createEl('fieldset');
        fieldsetEl.classList.add(CN.qFieldset, CN.anchor);
        fieldsetEl.id = questId;

        fieldsetEl.append(legendEl, inputsFieldsetEl);
        btnSubmitEl.insertAdjacentElement('beforebegin', fieldsetEl);

        generateInputs({
            question,
            questId,
            inputsFieldsetEl,
            questTypes,
            testState,
            questionsArr
        });

        const anchorEl = createEl('a');
        anchorEl.href = `#${fieldsetEl.id}`;
        anchorEl.textContent = questIndex + 1;

        const navItemEl = createEl('li');
        navItemEl.classList.add(CN.clickable);
        navItemEl.append(anchorEl);

        questsNav.append(navItemEl);
    });
};

const handleTimer = async (testState = {}, timeLimit = 0) => {
    const navTimerElem = getElById(ID.navTimer);
    let secondsCounter = timeLimit * 1e-3;

    testState.interval = setInterval(() => {
        const seconds = secondsCounter % 60;
        navTimerElem.textContent = `${Math.trunc(secondsCounter / 60)}:${
            seconds < 10 ? `0${seconds}` : seconds
        }`;

        if (secondsCounter <= 0) {
            clearInterval(testState.interval);
            getElById(ID.form).dispatchEvent(new Event('submit'));
        }
        secondsCounter--;
    }, 1000);
};

export const initTest = (testState = {}, testData = {}) => {
    const { questTypes, test } = testData;

    getElById(ID.testName).textContent = test.name;

    updateProgressbar(testState.solvedIdsArray, test.questionsArr.length);
    generateQuestions(test.questionsArr, questTypes, testState);
    handleTimer(testState, test.timeLimit);
};
