'use strict';

const CIN_CHECK_INTERVAL = 200;

const Command = function (description = '', command = () => { }) {
   this.description = description;
   this.run = command;
}


class Console {

   ///// FIELDS /////

   #buffer = '';
   #staticTextLenght = 0;
   #config = {};
   #userData = {};
   #htmlElem;
   #userCommands = {
      card: new Command('Перегляд особистої картки користувача', (userCard = this.#userData.card) => {
         const cardEntries = Object.entries(userCard).map((entry) => `${entry[0]}: ${entry[1]}`);

         const entryMaxLenght = cardEntries.reduce((maxLenght, entry) => Math.max(entry.length, maxLenght), 0);
         const borderSymbols = '='.repeat(entryMaxLenght + 2);

         this.#cout(`\nYour card:\n┌╒${borderSymbols}╗┐`);
         cardEntries.forEach(entry => this.#cout(`├╡ ${entry}${' '.repeat(entryMaxLenght - entry.length)} ╞╢`));
         this.#cout(`╙╙${borderSymbols}╜┘`);
      }),
      clear: new Command('Очищення екрану терміналу', async () => this.#htmlElem.value = ''),
      commands: new Command('Інормація про команди користувача', () => {
         this.#cout('\nДоступні команди:');
         Object.entries(this.#userCommands).forEach((command) => this.#cout(` - ${command[0]} - ${command[1].description}`));
      }),
      help: new Command('Загальна інформація', () => {
         this.#cout(
            // TODO
            '\n - Введіть \'commands\', щоб переглянути доступні команди'
         );
      }),
      tests: new Command('Інормація про тестування', async () => {
         const requiredTests = this.#userData.requiredTests;
         this.#cout('\nОбов\'язкові тести:');
         requiredTests.forEach((test, index) => this.#cout(`\t${index}. ${test}`));

         const testIndex = await this.#cin(
            (value) => 0 <= +value && +value < requiredTests.length,
            '\nВведіть номер тесту для його старту',
            'Incorrect test number'
         );

         const pagesUrls = JSON.parse(await getPagesUrls());

         this.#cout(`Розпочато '${requiredTests.at(testIndex)}'. Перенаправлення...`)
         await redirectPage(
            pagesUrls.tests, '_blank', REDIRECT_TIME,
            (counter) => this.#cout(`\t${counter}`)
         );
         this.#cout('Очікування завершення тесту...');

         // TODO: (backend) get results
         this.#cout('RESULTS');
      })
   };

   ///// CONSTRUCTOR /////

   constructor(config = {}, userData = {}) {
      this.#config = config;
      this.#userData = userData;

      document.getElementById(this.#config.userNameElemId).innerHTML = this.#userData.card.nickname;
      this.#htmlElem = document.getElementById(this.#config.consoleElemId);

      this.#htmlElem.addEventListener('focus', (event) => this.#handleFocus(event));
      this.#htmlElem.addEventListener('keydown', (event) => this.#handleKeyDown(event));
      this.#htmlElem.disabled = true;

      this.#outStartLog();
      this.#runCommandHandler();
   }

   /// STREAM ///

   #cout(...values) {
      values.forEach(val => {
         this.#htmlElem.value = this.#htmlElem.value.concat(`\n${val.toString()}`);
         this.#staticTextLenght = this.#htmlElem.value.length;
      });
   }

   #cerr(errorMsg = '') {
      this.#cout(`\n\tERROR: ${errorMsg}`);
   }

   async #cin(validate = (_cinValue) => true, prompt = '', errorMsg = '') {
      let isCinValueValid = false;
      let cinValue = '';

      prompt && this.#cout(prompt);

      while (!isCinValueValid) {
         this.#cout(`\n${this.#userData.card.nickname}@Machine > `)
         this.#htmlElem.disabled = false;
         this.#htmlElem.focus();

         cinValue = await new Promise((fulfill) => {
            const cinCheckInterval = setInterval(() => {
               if (this.#buffer) {
                  clearInterval(cinCheckInterval);
                  const bufferValue = this.#buffer;
                  this.#buffer = '';
                  fulfill(bufferValue);
               }
            }, CIN_CHECK_INTERVAL);
         });

         isCinValueValid = validate(cinValue)
         !isCinValueValid && this.#cerr(errorMsg)
      }

      return cinValue;
   }

   /// EVENTHANDLERS ///

   #handleFocus(event) { this.#setCursorPosition(event.target.value.length); }

   #handleKeyDown(event) {
      const eventTarget = event.currentTarget;
      const eventKeyCode = event.keyCode;

      const isCursorOnStaticText = eventTarget.selectionStart <= this.#staticTextLenght;

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
            this.#buffer = this.#htmlElem.value.slice(this.#staticTextLenght).trim();
            this.#htmlElem.disabled = true;
            this.#staticTextLenght = this.#htmlElem.value.length;
            break;
         }
         default: {
            isCursorOnStaticText && this.#setCursorPosition(eventTarget.value.length);
            break;
         }
      }
   }

   /// MISC ///

   #outStartLog() {
      this.#userCommands.clear.run();
      this.#cout(
         `InitiativeGroup, site v${this.#config.version} (v${this.#config.versionPrecise}, ${new Date()}) [HTML-CSS & JS (spec.)] on linux`,
         `Останній онлайн: ${this.#userData.lastLogin}`
      );
      this.#userCommands.card.run();
      this.#cout('\n** Введіть \'help\', щоб переглянути загальну інформацію **');
   }

   async #runCommandHandler() {
      while (true) {
         await new Promise(async (fulfill) => {
            const userCommand = await this.#cin((value) => this.#userCommands.hasOwnProperty(value), null, "Incorrect user command");
            await this.#userCommands[userCommand].run();
            fulfill();
         });
      }
   };

   #setCursorPosition(position) { this.#htmlElem.selectionStart = position };
}
