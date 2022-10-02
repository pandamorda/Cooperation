import { getElById, getElsByCN } from '@scripts/common';
import {
    ID,
    CN,
    IS_USER_LOGGED,
    USER_AUTH_MAIN_BTN_TEXT,
    USER_UNAUTH_MAIN_BTN_TEXT
} from '@constants/preview';

import './preview.css';

const handleLoad = () => {
    const mainBtnElem = getElById(ID.mainBtn);
    const loginBtnElem = getElById(ID.loginBtn);
    const signBtnElem = getElById(ID.signBtn);
    const exitBtnElem = getElById(ID.exitBtn);
    const profileBtnElem = getElById(ID.profileBtn);
    const crossElem = getElById(ID.crossBtn);

    mainBtnElem.textContent = IS_USER_LOGGED
        ? USER_AUTH_MAIN_BTN_TEXT
        : USER_UNAUTH_MAIN_BTN_TEXT;

    const handleAuthBtnClick = () => {
        mainBtnElem.classList.toggle(CN.hidden);
        crossElem.classList.toggle(CN.hidden);

        Array.from(
            getElsByCN(IS_USER_LOGGED ? CN.userAuth : CN.userUnauth)
        ).forEach((button) => button.classList.toggle(CN.hidden));
    };

    crossElem.addEventListener('click', handleAuthBtnClick);
    mainBtnElem.addEventListener('click', handleAuthBtnClick);

    loginBtnElem.addEventListener('click', () => {});
    signBtnElem.addEventListener('click', () => {});
    exitBtnElem.addEventListener('click', () => {});
    profileBtnElem.addEventListener('click', () => {});
};

window.addEventListener('load', handleLoad);
