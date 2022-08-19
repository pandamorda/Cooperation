'use strict';

window.onload = async () => {
    const userData = JSON.parse(await getUserData());
    const consoleConfig = JSON.parse(await getConsoleConfig());

    new Console(consoleConfig, userData)
};
