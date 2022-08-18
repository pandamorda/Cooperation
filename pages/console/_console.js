'use strict';

class Console {

   ///// FIELDS /////

   #staticTextLenght = 0;
   #config = {};
   #userData = {};
   #htmlElem;
   #userCommands = {
      card: () => {
         const cardEntries = Object.entries(this.#userData.card).map((entry) => `${entry[0]}: ${entry[1]}`);

         const entryMaxLenght = cardEntries.reduce(
            (maxLenght, entry) => Math.max(entry.length, maxLenght),
            0
         );

         const card = cardEntries.reduce((card, entry) => card.concat(`├╡ ${entry}${' '.repeat(entryMaxLenght - entry.length)} ╞╢\n`), '');
         const borderSymbols = '='.repeat(entryMaxLenght + 2);

         this.#cout(`\nYour card:\n┌╒${borderSymbols}╗┐\n${card}╙╙${borderSymbols}╜┘\n`);
      },
      clear: () => { this.#htmlElem.value = ''; }
   }

   ///// CONSTRUCTOR /////

   constructor(config = {}, userData = {}) {
      this.#config = config;
      this.#userData = userData;

      document.getElementById(this.#config.userNameElemId).innerHTML = this.#userData.card.nickname;
      this.#htmlElem = document.getElementById(this.#config.consoleElemId);

      this.#htmlElem.onfocus = this.#handleFocus;
      this.#htmlElem.onkeydown = this.#handleKeyDown;
      this.#htmlElem.disabled = true;

      this.#outStartLog();
      this.#useDefaultHandleCommandSubmit();
   }

   /// STREAM ///

   #cout = (value = '',) => {
      this.#htmlElem.value = this.#htmlElem.value.concat(`\n${value}`);
      this.#staticTextLenght = this.#htmlElem.value.length;
   }

   #cerr = (errorMsg = '',) => { this.#cout(`\n\tERROR: ${errorMsg}`); }

   #cin = () => {
      this.#cout(`\n${this.#userData.card.nickname}@Machine > `)
      this.#htmlElem.disabled = false;
      this.#htmlElem.focus();

      return () => new Promise((fulfill) => {
         const value = this.#htmlElem.value.slice(this.#staticTextLenght).trim();
         this.#htmlElem.disabled = true;

         this.#staticTextLenght = this.#htmlElem.value.length;
         fulfill(value);
      });
   }

   /// EVENTHANDLERS ///

   #handleFocus = (event) => { this.#setCursorPosition(event.target.value.length); }

   #handleCommandSubmit = async () => { };

   #setHandleCommandSubmit = (handleCommandSubmit = async () => { }) => {
      this.#handleCommandSubmit = handleCommandSubmit;
   }

   #useDefaultHandleCommandSubmit = () => {
      const promiseValue = this.#cin();
      this.#setHandleCommandSubmit(async () => {
         const userCommand = await promiseValue();

         if (!this.#userCommands.hasOwnProperty(userCommand)) {
            this.#cerr("INCORRECT_COMMAND");
            return;
         }

         this.#userCommands[userCommand]();
      });
   };

   #handleKeyDown = async (event) => {
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
            await this.#handleCommandSubmit();
            this.#useDefaultHandleCommandSubmit();

            event.preventDefault();
            break;
         }
         default:
            isCursorOnStaticText && this.#setCursorPosition(eventTarget.value.length);
            break;
      }
   }

   /// MISC ///

   #setCursorPosition = (position) => this.#htmlElem.selectionStart = position;

   #outStartLog = () => {
      this.#cout(`InitiativeGroup, site v${this.#config.version} (v${this.#config.versionPrecise}, ${new Date()}) [HTML-CSS & JS (spec.)] on linux`);
      this.#cout(`Last login: ${this.#userData.lastLogin}`)
      this.#userCommands.card(this.#userData.card);
      // this.#userCommands.tests(this.#userData);
      // Your test 1 results: // <-- Appears on complete
      /** Test 1 results
       * 
       * [...]  
       * Solved 15% of test 1
       ** /
      Уведіть номер тесту, щоб розпочати його: 1, 2 або 3
      
      
      
      You already solved the test 3!
      <strong>!</strong>Уведіть номер тесту, щоб розпочати його: 1, 2 або 3
      Help -- print \`help\` and press <Enter>.
      this.#config.user.nickname@Machine ~ % help
      Ти повинен пройти 3 тести.
      Тести:
       1 [tec] - Технічний тест
       2 [eng] - Тест з англійськой мови
       3 [ss] - Soft Skills (психологічний тест)
      Для початку проходження тесту введи його номер або кодове слово.
         Наприклад: розпочаток тесту з англійської мови виконується через “2”
      
      <...>             Ми з вами зв’яжемося! На головну: /main; профіль -- /p`
            );
      */
   }
}
