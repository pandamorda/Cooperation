import { ConsoleBase, Command } from '@scripts/_console-base';

import { getElById, redirectPage } from '@scripts/_common';

import { PAGE_URLS, REDIRECT_TIME } from '@constants/_common';
import { CONSOLE, COOPERATION } from '@constants/_cooperation';

export class MiniConsole extends ConsoleBase {
    #statusElem;
    #resumeFormInputElem;
    #isResumeUploaded = false;
    #isUserLogged = false;
    _userCommands = {
        ...this._userCommands,
        startTests: new Command('Початок тестування', async () => {
            while (!this.#isResumeUploaded) {
                await this._cin(
                    (value) => value === 'Y' || value === 'N',
                    "\nРозпочати зараз ? ('Y')",
                    'Incorrect char'
                );

                if (!this.#isUserLogged) {
                    this._cerr('Користувач не авторизований!');
                } else if (!this.#isResumeUploaded) {
                    this._cerr('Резюме не завантажено!');
                }
            }

            this._cout(`Розпочинаємо...`);
            redirectPage(
                PAGE_URLS.console,
                '_blank',
                REDIRECT_TIME,
                (counter) => this._dcout(' ', counter)
            );
        })
    };

    ///// CONSTRUCTOR /////

    constructor(config = {}, userData = {}) {
        super(config, userData);

        this.#statusElem = getElById(CONSOLE.elemIds.status);
        this.#resumeFormInputElem = getElById(COOPERATION.resumeForm.fileInput);
        this.#resumeFormInputElem.addEventListener('change', () =>
            this.updateStatus()
        );

        this.#isResumeUploaded = userData.isResumeUploaded;

        this.updateStatus();

        this._init(false);
    }

    ///// STREAM /////

    #sout(...values) {
        this.#statusElem.innerText = '\tСтатус:\n';
        values.forEach((val) => {
            this.#statusElem.innerText = this.#statusElem.innerText.concat(
                `\n--- ${val.toString()} ---`
            );
        });
    }

    ///// MISC /////

    _outStartLog() {
        this._dcout('', '\n\nstart()');
        this._userCommands.startTests.run();
    }

    updateStatus() {
        this.updateResumeUploadStatus();

        if (this.#isUserLogged) {
            this.#sout(
                this._userData.requiredTests ? 'Доступні тести' : '',
                !this.#isResumeUploaded ? 'Резюме не завантажено' : ''
            );
        } else {
            this.#sout('Користувач не авторизований');
        }
    }

    updateResumeUploadStatus() {
        this.#isResumeUploaded =
            Boolean(this.#resumeFormInputElem.value) && this.#isUserLogged;

        getElById(COOPERATION.resumeForm.uploadStatus).innerText = !this
            .#isUserLogged
            ? 'Користувач не авторизований'
            : this.#isResumeUploaded
            ? 'Все добре ✔'
            : 'Потрібне завантаження';
    }
}
