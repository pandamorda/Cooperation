/// CONSOLE ///

export const CONSOLE = {
    elemIds: {
        userName: 'user-name',
        status: 'console-status',
        console: 'console'
    },
    cinCheckInterval: 200
};

/// COOPERATION ///

export const COOPERATION = {
    resumeForm: {
        uploadStatus: 'resume-upload-status',
        fileInput: 'resume-input'
    }
};

/// TESTS PAGE ///

export const CODE_EDITOR = {
    theme: 'dracula',
    height: 100,
    minCheckValueLenght: 5,
    consoleInitialText: 'Output will be shown here...'
};

export const TESTS = {
    elemIds: {
        progressbar: 'test-progress',
        progressbarLabel: 'test-progress-label',
        testName: 'test-name',
        form: 'resume-form',
        navTimer: 'nav-timer',
        navList: 'questions-nav',
        buttonSubmit: 'submit'
    },
    elemCns: {
        anchor: 'anchor',
        clickable: 'clicable',
        qLegend: 'form-question',
        qFieldset: 'form-fieldset',
        qInputs: 'fieldset-inputs',
        qInputsFigures: 'input-figures',
        qInputsMatches: 'matches',
        qMatchText: 'match-text',
        qLabelFigure: 'label-figure',
        qLabelImgContainer: 'input-img-container'
    },
    codeEditor: {
        config: {
            editor: {
                theme: CODE_EDITOR.theme,
                lineNumbers: true,
                extraKeys: { Tab: 'autocomplete' },
                lineWrapping: true,
                lint: true,
                gutters: ['CodeMirror-lint-markers']
            },
            console: {
                mode: 'text',
                theme: CODE_EDITOR.theme,
                lineNumbers: true,
                readOnly: true,
                lineWrapping: true
            }
        }
    },
    questionIdPrefix: 'q',
    anchorSolvedText: '✔'
};
