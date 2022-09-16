import { CONSOLE } from '@constants/_cooperation';

export const Command = function (description = '', command = () => {}) {
    this.description = description;
    this.run = command;
};

export class ConsoleBase {
    ///// FIELDS /////

    #buffer = '';
    #staticTextLenght = 0;
    _userData = {};
    _htmlElem;
    _userCommands = {
        clear: new Command(
            'Очищення екрану терміналу',
            async () => (this._htmlElem.value = '')
        )
    };

    ///// CONSTRUCTOR /////

    constructor(userData = {}) {
        if (this.constructor === ConsoleBase) {
            throw new Error("Abstract classes can't be instantiated.");
        }

        this._userData = userData;

        this._htmlElem = document.getElementById(CONSOLE.elemIds.console);

        this._htmlElem.addEventListener('focus', (event) =>
            this.#handleFocus(event)
        );
        this._htmlElem.addEventListener('keydown', (event) =>
            this.#handleKeyDown(event)
        );
        this._htmlElem.disabled = true;
    }

    /// STREAM ///

    _dcout(delim = '\n', ...values) {
        values.forEach((val) => {
            this._htmlElem.value = this._htmlElem.value.concat(
                `${delim}${val.toString()}`
            );
            this.#staticTextLenght = this._htmlElem.value.length;
        });
    }

    _cout(...values) {
        values.forEach((val) => {
            this._htmlElem.value = this._htmlElem.value.concat(
                `\n${val.toString()}`
            );
            this.#staticTextLenght = this._htmlElem.value.length;
        });
    }

    _cerr(errorMsg = '') {
        this._cout(`\n\tERROR: ${errorMsg}`);
    }

    async _cin(validate = () => true, prompt = '', errorMsg = '') {
        let isCinValueValid = false;
        let cinValue = '';

        this._htmlElem.disabled = false;
        this._htmlElem.focus();

        while (!isCinValueValid) {
            this._cout(prompt ? prompt : '\n');
            this._cout(`${this._userData.card.nickname}@Machine > `);

            cinValue = await new Promise((fulfill) => {
                const cinCheckInterval = setInterval(() => {
                    if (this.#buffer) {
                        clearInterval(cinCheckInterval);
                        const bufferValue = this.#buffer;
                        this.#buffer = '';
                        fulfill(bufferValue);
                    }
                }, CONSOLE.cinCheckInterval);
            });

            isCinValueValid = validate(cinValue);
            !isCinValueValid && this._cerr(errorMsg);
        }

        this._htmlElem.disabled = true;

        return cinValue;
    }

    /// EVENTHANDLERS ///

    #handleFocus(event) {
        this.#setCursorPosition(event.target.value.length);
    }

    #handleKeyDown(event) {
        const eventTarget = event.currentTarget;
        const eventKeyCode = event.keyCode;

        const isCursorOnStaticText =
            eventTarget.selectionStart <= this.#staticTextLenght;

        switch (eventKeyCode) {
            case 37:
            case 38:
            case 39:
            case 40: {
                break;
            }
            case 8: {
                isCursorOnStaticText && event.preventDefault();
                break;
            }
            case 13: {
                event.preventDefault();
                this.#buffer =
                    this._htmlElem.value.slice(this.#staticTextLenght).trim() ||
                    '\n';
                this.#staticTextLenght = this._htmlElem.value.length;
                break;
            }
            default: {
                isCursorOnStaticText &&
                    this.#setCursorPosition(eventTarget.value.length);
                break;
            }
        }
    }

    /// MISC ///
    _init(isRunCommandHandler = true) {
        this.#logConsoleInit();
        this._outStartLog();
        isRunCommandHandler && this.#runCommandHandler();
    }

    #logConsoleInit() {
        this._userCommands.clear.run();
        this._cout(
            `InitiativeGroup, site v0.8.0 (v0.8.0:a1), ${new Date()}) [HTML-CSS & JS (spec.)] on linux`,
            `Останній онлайн: ${this._userData.lastLogin}`
        );
    }

    _outStartLog() {
        throw new Error('Method must be implemented!');
    }

    async #runCommandHandler() {
        const isInfinite = true;

        while (isInfinite) {
            const userCommand = await this._cin(
                (value) =>
                    Object.prototype.hasOwnProperty.call(
                        this._userCommands,
                        value
                    ),
                null,
                'Incorrect user command'
            );

            await this._userCommands[userCommand].run();
        }
    }

    #setCursorPosition(position) {
        this._htmlElem.selectionStart = position;
    }
}
