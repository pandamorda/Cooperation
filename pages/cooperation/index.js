'use strict';

window.addEventListener('load', async () => {
    const userData = JSON.parse(await getUserData());
    const consoleConfigData = JSON.parse(await getConsoleConfig());

    new MiniConsole(consoleConfigData, userData);
});