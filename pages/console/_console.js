'use strict';

const cl = console.log;

class Console extends ConsoleBase {

   _userCommands = {
      ...this._userCommands,
      card: new Command('Перегляд особистої картки користувача', (userCard = this._userData.card) => {
         const cardEntries = Object.entries(userCard).map((entry) => `${entry[0]}: ${entry[1]}`);

         const entryMaxLenght = cardEntries.reduce((maxLenght, entry) => Math.max(entry.length, maxLenght), 0);
         const borderSymbols = '='.repeat(entryMaxLenght + 2);

         this._cout(`\nYour card:\n┌╒${borderSymbols}╗┐`);
         cardEntries.forEach(entry => this._cout(`├╡ ${entry}${' '.repeat(entryMaxLenght - entry.length)} ╞╢`));
         this._cout(`╙╙${borderSymbols}╜┘`);
      }),
      commands: new Command('Інормація про команди користувача', () => {
         this._cout('\nДоступні команди:');
         Object.entries(this._userCommands).forEach((command) => this._cout(` - ${command[0]} - ${command[1].description}`));
      }),
      help: new Command('Загальна інформація', () => {
         this._cout(
            // TODO
            '\n - Введіть \'commands\', щоб переглянути доступні команди'
         );
      }),
      tests: new Command('Інормація про тестування', async () => {
         const requiredTests = this._userData.requiredTests;
         this._cout('\nОбов\'язкові тести:');
         requiredTests.forEach((test, index) => this._cout(`\t${index}. ${test}`));

         const testIndex = await this._cin(
            (value) => 0 <= +value && +value < requiredTests.length,
            '\nВведіть номер тесту для його старту',
            'Incorrect test number'
         );

         this._cout(`Розпочато '${requiredTests.at(testIndex)}'. Перенаправлення...`)
         await redirectPage(
            PAGE_URLS.tests, '_blank', REDIRECT_TIME,
            (counter) => this._dcout(' ', counter)
         );
         this._cout('Очікування завершення тесту...');

         // TODO: (backend) get results
         this._cout('RESULTS');
      })
   }

   constructor(config = {}, userData = {}) {
      super(config, userData);
      document.getElementById(CONSOLE.elemIds.userName).innerText = this._userData.card.nickname;
      this._init();
   }

   _outStartLog() {
      this._userCommands.card.run();
      this._cout('\n** Введіть \'help\', щоб переглянути загальну інформацію **');
   }
}
