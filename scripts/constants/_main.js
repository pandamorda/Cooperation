const PROGRESSBAR_PRECISION = 2;

const getElemById = (id) => document.getElementById(id);
const toggleCNs = (elem, ...cns) => cns.forEach(cn => elem.classList.toggle(cn));
const getCssVar = (varName) => getComputedStyle(document.body).getPropertyValue(varName);

const PAGE_URLS = {
    console: '/pages/console/',
    tests: '/pages/tests/'
}

const ID = {
    html: 'html',
    header: {
        profilePart: 'profile-part',
        btnArrow: 'btn-arrow',
        btnProfileMain: 'btn-profile-main',
        btnProfile: 'btn-profile',
        btnExit: 'btn-exit'
    }
}

const CN = {
    hidden: 'hidden',
    header: {
        profileBtnsExpanded: 'profile-btns-expanded',
        btnAppear: 'btn-appear',
        btnDisappear: 'btn-disappear'
    },
    start: {
        card: 'card',
        appearCardL: 'appear-card-l',
        appearCardR: 'appear-card-r'
    }
}
const CSS_VAR = {
    btnAnimationTime: '--btn-animation-time',
    cardAnimationTime: '--card-animation-time'
}