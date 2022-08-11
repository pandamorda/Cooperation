'use strict';

const getElemById = (id) => document.getElementById(id);

const updateProgressbar = (solvedQuestionsAmount, questionsAmount) => {
    const progressbarElem = getElemById(id.progressbar);
    const progressbarLabelElem = getElemById(id.progressbarLabel);

    const testProgress = solvedQuestionsAmount / questionsAmount * 100;
    progressbarElem.value = testProgress;
    progressbarLabelElem.innerHTML = `Прогрес ${Math.round(testProgress * 100) * 0.01}%`;
}

const handleTimer = async (testNameElem, testData) => {
    const navTimerElem = getElemById(id.navTimer);

    let testSecondsCounter = testData.timeLimit * 1e-3;
    const testInterval = setInterval(() => {
        const seconds = testSecondsCounter % 60;
        navTimerElem.innerHTML = `${Math.trunc(testSecondsCounter / 60)}:${seconds < 10 ? `0${seconds}` : seconds}`;

        if (testSecondsCounter === 0) {
            clearInterval(testInterval);

            let redirectSecondsCounter = REDIRECT_TIME * 1e-3;
            const redirectInterval = setInterval(() => {
                testNameElem.innerHTML = `${testData.name} (Завершено, перенаправлення ${redirectSecondsCounter}...)`;

                if (redirectSecondsCounter === 0) {
                    clearInterval(redirectInterval);
                    handleFormSubmit();
                }

                redirectSecondsCounter--;
            }, 1000);
        }

        testSecondsCounter--;
    }, 1000);
}

const handleForm = async () => {
    const testData = await getTestData();

    const solvedQuestionIdsArray = [];

    const testNameElem = getElemById(id.testName);

    testNameElem.innerHTML = testData.name;
    updateProgressbar(solvedQuestionIdsArray.length, testData.questions.length);

    handleTimer(testData.timeLimit);
};

window.onload = () => { handleForm(); }
