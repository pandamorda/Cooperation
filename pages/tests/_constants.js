const QUESTION_ID_PREFIX = 'q';
const ANCHOR_SOLVED_INNER_HTML = '✔';
const REDIRECT_TIME = 3000;
const PROGRESSBAR_PRECISION = 2;

const id = {
    progressbar: 'test-progress',
    progressbarLabel: 'test-progress-label',
    testName: 'test-name',
    form: 'resume-form',
    navTimer: 'nav-timer',
    navList: 'questions-nav',
    buttonSubmit: 'submit',
}

const cn = {
    anchor: 'anchor',
    clickable: 'clicable',
    qLegend: 'form-question',
    qFieldset: 'form-fieldset',
    qInputs: 'fieldset-inputs',
    qInputsFigures: 'input-figures',
    qInputsMatches: 'matches',
    qMatchText: 'match-text',
    qLabelFigure: 'label-figure',
    qLabelImgContainer: 'input-img-container',
}


const codeEditor = {
    theme: 'dracula',
    height: 100,
    minCheckValueLenght: 5,
    consoleInitialText: 'Output will be shown here...',
}

const consoleEditorConfig = {
    mode: 'text',
    theme: codeEditor.theme,
    lineNumbers: true,
    readOnly: true,
    lineWrapping: true
}

const codeEditorConfig = {
    theme: codeEditor.theme,
    lineNumbers: true,
    extraKeys: { 'Tab': 'autocomplete' },
    lineWrapping: true,
    lint: true,
    gutters: ['CodeMirror-lint-markers'],
}