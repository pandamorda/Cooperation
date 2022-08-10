'use strict';

window.onload = async () => {
    const userData = await getUserData();
    const consoleConfig = await getConsoleConfig();

    new Console(consoleConfig, userData)
};
