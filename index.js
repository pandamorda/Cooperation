'use strict';

const IS_USER_LOGGED = false;
const USER_AUTH_MAIN_BTN_TEXT = "Nickname";
const USER_UNAUTH_MAIN_BTN_TEXT = "Profile";

const ID = {
    mainBtn: "main-btn",
    loginBtn: "login-btn",
    signBtn: "sign-btn",
    exitBtn: "exit-btn",
    profileBtn: "profile-btn",
    crossBtn: "cross"
}

const CN = {
    hidden: 'hidden',
    userAuth: 'user-auth',
    userUnauth: 'user-unauth'
}


const getElemById = (id) => document.getElementById(id);
const getElemsByClass = (className) => document.getElementsByClassName(className);


const handleLoad = (_event) => {
    const mainBtnElem = getElemById(ID.mainBtn);
    const loginBtnElem = getElemById(ID.loginBtn);
    const signBtnElem = getElemById(ID.signBtn);
    const exitBtnElem = getElemById(ID.exitBtn);
    const profileBtnElem = getElemById(ID.profileBtn);
    const crossElem = getElemById(ID.crossBtn);

    mainBtnElem.textContent = IS_USER_LOGGED
        ? USER_AUTH_MAIN_BTN_TEXT
        : USER_UNAUTH_MAIN_BTN_TEXT;

    const handleAuthBtnClick = (_event) => {
        mainBtnElem.classList.toggle(CN.hidden);
        crossElem.classList.toggle(CN.hidden);

        Array.from(getElemsByClass(IS_USER_LOGGED ? CN.userAuth : CN.userUnauth))
            .forEach((button) => button.classList.toggle(CN.hidden));
    }

    crossElem.addEventListener('click', handleAuthBtnClick);
    mainBtnElem.addEventListener('click', handleAuthBtnClick);

    loginBtnElem.addEventListener('click', () => { });
    signBtnElem.addEventListener('click', () => { });
    exitBtnElem.addEventListener('click', () => { });
    profileBtnElem.addEventListener('click', () => { });
}


window.addEventListener('load', handleLoad);
