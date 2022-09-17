import {
    getElById,
    getElsByName,
    getElsByTag,
    redirectPage
} from '@scripts/_common';

import { PAGE_URLS, REDIRECT_TIME } from '@constants/_common';
import { TESTS } from '@constants/_cooperation';

import './tests.css';
import { initTest } from './_tests';

const ID = TESTS.elemIds;

const submitForm = async (testData = {}, questTypes = {}) => {
    const testResults = testData.questionsArr.map((question, index) => {
        const inputsArr = Array.from(
            getElsByName(`${TESTS.questionIdPrefix}${index}`)
        );

        const questType = question.type;

        const inputs = inputsArr.map((input, index) => {
            switch (questType) {
                case questTypes.multi:
                case questTypes.multiImg:
                case questTypes.single: {
                    return { index, value: input.checked };
                }
                default: {
                    return { index, value: input.value };
                }
            }
        });

        return { questId: question.id, questType, inputs };
    });

    // TODO: send data to backend
    console.log(testResults);

    redirectPage(
        PAGE_URLS.console,
        '_blank',
        REDIRECT_TIME,
        (secondsCounter) => {
            getElById(
                ID.testName
            ).textContent = `${testData.name} (Завершено, перенаправлення ${secondsCounter}...)`;
        }
    );
};

const handleFormLoad = async () => {
    const state = {
        interval: 0,
        solvQuestsArr: []
    };

    const response = await fetch('http://localhost:5000/tests?testId=1');
    const respJson = await response.json();
    const dataRaw = respJson.testData;

    const data = {
        test: {
            ...dataRaw.common,
            questionsArr: dataRaw.questionsArr
        },
        questTypes: Object.fromEntries(
            dataRaw.questTypesArr.map((el) => [el.type, el.type])
        )
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        clearInterval(state.interval);

        Array.from(getElsByTag('input'))
            .concat(
                ...Array.from(getElsByTag('textarea')),
                getElById(ID.buttonSubmit)
            )
            .forEach((elem) => (elem.disabled = true));

        window.scrollTo(0, 0);
        submitForm(data.test, data.questTypes);
    };

    initTest(state, data);

    getElById(ID.form).addEventListener('submit', handleFormSubmit);
    getElById(ID.buttonSubmit).addEventListener('click', handleFormSubmit);
};

window.addEventListener('load', handleFormLoad);
