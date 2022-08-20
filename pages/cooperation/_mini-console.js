'use strict';

class MiniConsole extends ConsoleBase {

    #statusElem;
    _userCommands = {
        ...this._userCommands,
        startTests: new Command('Початок тестування', async () => {
            const char = await this._cin((value) => value === 'Y' || value === 'N',
                '\nРозпочати зараз ? (\'Y\', \'N\')',
                'Incorrect char'
            )

            if (char === 'Y') {
                this._cout(`Розпочинаємо...`)
                redirectPage(
                    PAGE_URLS.console, '_blanket', REDIRECT_TIME,
                    (counter) => this._dcout(' ', counter)
                )
            }
        })
    }

    constructor(config = {}, userData = {}) {
        super(config, userData);
        this.#statusElem = document.getElementById(CONSOLE.elemIds.status);
        if (this._userData.requiredTests) {
            this.#sout(`\tСтатус:\n--- Доступні тести ---`);
        }
        this._init(false);
    }

    #sout(...values) {
        values.forEach(val => {
            this.#statusElem.innerText = '';
            this.#statusElem.innerText = this.#statusElem.innerText.concat(`\n${val.toString()}`);
        });
    }

    _outStartLog() {
        this._dcout('', 'startTests()');
        this._userCommands.startTests.run();
    }
}